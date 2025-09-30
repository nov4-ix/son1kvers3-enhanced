#!/usr/bin/env python3
"""
Proxy Manager for Son1kVers3

Provides simple round-robin proxy rotation with optional health tracking.
"""

from __future__ import annotations

import os
import itertools
import threading
from typing import List, Optional, Dict


class ProxyManager:
    """Manages proxy rotation and selection for outbound HTTP requests."""

    def __init__(self) -> None:
        raw_proxy_list = os.getenv("PROXY_LIST", "").strip()
        self.rotation_enabled: bool = os.getenv("PROXY_ROTATION_ENABLED", "false").lower() == "true"

        self.proxies: List[str] = [
            proxy.strip() for proxy in raw_proxy_list.split(",") if proxy.strip()
        ]

        # Iterator for round-robin
        self._lock = threading.Lock()
        self._iter = itertools.cycle(self.proxies) if self.proxies else None

        # Very lightweight health status (success/failure counters)
        self._health: Dict[str, Dict[str, int]] = {proxy: {"ok": 0, "fail": 0} for proxy in self.proxies}

    def has_proxies(self) -> bool:
        return bool(self.proxies)

    def get_next_proxy(self) -> Optional[str]:
        if not self.rotation_enabled or not self._iter:
            return None
        with self._lock:
            return next(self._iter)

    def get_best_proxy(self) -> Optional[str]:
        """Return the proxy with best ok/fail ratio; fallback to round-robin."""
        if not self.rotation_enabled or not self._health:
            return self.get_next_proxy()

        # Score: ok - fail (simple heuristic)
        best = None
        best_score = float("-inf")
        for proxy, stats in self._health.items():
            score = stats.get("ok", 0) - stats.get("fail", 0)
            if score > best_score:
                best = proxy
                best_score = score
        return best or self.get_next_proxy()

    def report_success(self, proxy: Optional[str]) -> None:
        if proxy and proxy in self._health:
            self._health[proxy]["ok"] += 1

    def report_failure(self, proxy: Optional[str]) -> None:
        if proxy and proxy in self._health:
            self._health[proxy]["fail"] += 1

