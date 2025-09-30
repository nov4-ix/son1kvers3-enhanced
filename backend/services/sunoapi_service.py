#!/usr/bin/env python3
"""
SunoAPI Service Wrapper

Seguro, con backoff exponencial, límite de concurrencia y rotación opcional de proxies.
El servicio actúa como pass-through controlado: reenvía el body al endpoint de SunoAPI
sin almacenar secretos ni PII en logs.
"""

from __future__ import annotations

import os
import json
import asyncio
import logging
import random
from typing import Any, Dict, Optional

import httpx

from .proxy_manager import ProxyManager


logger = logging.getLogger(__name__)


class SunoAPIService:
    def __init__(self) -> None:
        # Config
        self.api_key: str = os.getenv("SUNO_API_KEY", "").strip()
        self.base_url: str = os.getenv("SUNO_API_BASE_URL", "https://sunoapi.com/api").rstrip("/")
        self.generate_path: str = os.getenv("SUNO_GENERATE_PATH", "/v1/generate")

        # Network and reliability
        self.timeout_seconds: float = float(os.getenv("SUNO_REQUEST_TIMEOUT", "60"))
        self.max_retries: int = int(os.getenv("SUNO_MAX_RETRIES", "4"))
        self.concurrent_limit: int = int(os.getenv("SUNO_MAX_CONCURRENCY", "20"))

        # Concurrency semaphore
        self._sem = asyncio.Semaphore(self.concurrent_limit)

        # Proxy manager (optional)
        self.proxy_manager = ProxyManager()

        # Minimal prompt sanitization toggle
        self.sanitize_prompts: bool = os.getenv("SUNO_SANITIZE_PROMPTS", "true").lower() == "true"

        # Http client
        self._client = httpx.AsyncClient(timeout=self.timeout_seconds)

    async def close(self) -> None:
        await self._client.aclose()

    def _headers(self) -> Dict[str, str]:
        headers: Dict[str, str] = {
            "Content-Type": "application/json",
        }
        if self.api_key:
            # Prefer Authorization header; adjust if vendor expects a different header
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    def _build_url(self, path: str) -> str:
        if not path.startswith("/"):
            path = f"/{path}"
        return f"{self.base_url}{path}"

    def _sanitize_prompt(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.sanitize_prompts:
            return data
        # Do not mutate original
        payload = json.loads(json.dumps(data))
        prompt = payload.get("prompt")
        if isinstance(prompt, str):
            # Basic redactions for PII-like patterns
            prompt = prompt.replace("@", "[at]")
            prompt = prompt.replace("+", " plus ")
            payload["prompt"] = prompt
        return payload

    async def _sleep_backoff(self, attempt: int) -> None:
        # Exponential backoff with jitter
        base = 1.0 * (2 ** attempt)
        jitter = random.uniform(0.0, 0.25)
        await asyncio.sleep(base + jitter)

    async def _request_with_retries(
        self,
        method: str,
        url: str,
        json_body: Optional[Dict[str, Any]] = None,
    ) -> httpx.Response:
        last_exc: Optional[Exception] = None

        for attempt in range(self.max_retries + 1):
            proxy_used: Optional[str] = None
            try:
                proxies = None
                proxy_used = self.proxy_manager.get_best_proxy()
                if proxy_used:
                    proxies = {
                        "http": proxy_used,
                        "https": proxy_used,
                    }

                resp = await self._client.request(
                    method=method,
                    url=url,
                    headers=self._headers(),
                    json=json_body,
                    proxies=proxies,
                )

                if resp.status_code == 429 or 500 <= resp.status_code < 600:
                    # Retry on rate limit and server errors
                    if attempt < self.max_retries:
                        self.proxy_manager.report_failure(proxy_used)
                        await self._sleep_backoff(attempt)
                        continue
                # Success or non-retryable error
                if 200 <= resp.status_code < 300:
                    self.proxy_manager.report_success(proxy_used)
                else:
                    self.proxy_manager.report_failure(proxy_used)
                return resp

            except (httpx.ReadTimeout, httpx.ConnectTimeout, httpx.NetworkError) as exc:  # type: ignore[attr-defined]
                last_exc = exc
                if attempt < self.max_retries:
                    self.proxy_manager.report_failure(proxy_used)
                    await self._sleep_backoff(attempt)
                    continue
                break

        # If we exited loop without return, raise last exception or create one
        if last_exc:
            raise last_exc
        raise RuntimeError("SunoAPI request failed after retries")

    async def generate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.api_key:
            # Demo response when API key is missing
            return {
                "success": False,
                "message": "SUNO_API_KEY no configurada",
                "demo": True,
            }

        async with self._sem:
            safe_payload = self._sanitize_prompt(payload)
            url = self._build_url(self.generate_path)
            resp = await self._request_with_retries("POST", url, json_body=safe_payload)

            # Try to parse JSON, fall back to text
            try:
                data = resp.json()
            except Exception:
                data = {"status_code": resp.status_code, "text": resp.text}

            return {
                "status_code": resp.status_code,
                "data": data,
            }


# Singleton helper for FastAPI lifespan if desired
_service_singleton: Optional[SunoAPIService] = None


def get_suno_service() -> SunoAPIService:
    global _service_singleton
    if _service_singleton is None:
        _service_singleton = SunoAPIService()
    return _service_singleton

