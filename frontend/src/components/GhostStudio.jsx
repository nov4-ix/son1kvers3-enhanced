/**
 * 👻 Ghost Studio - Advanced Audio Analysis & Mastering
 * Análisis espectral, masterización y procesamiento de audio
 */

import React, { useState, useRef, useEffect } from 'react';
import './GhostStudio.css';

function GhostStudio() {
  const [audioFile, setAudioFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [processingMode, setProcessingMode] = useState('analyze');
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Inicializar Web Audio API
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(ctx);
    
    const analyzerNode = ctx.createAnalyser();
    analyzerNode.fftSize = 2048;
    setAnalyser(analyzerNode);

    return () => {
      if (ctx) ctx.close();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && analyser && canvasRef.current) {
      drawVisualization();
    }
  }, [isPlaying, analyser]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = url;
      }
      console.log('Audio file loaded:', file.name);
    } else {
      alert('Por favor selecciona un archivo de audio válido');
    }
  };

  const handleAnalyze = async () => {
    if (!audioFile) {
      alert('Por favor carga un archivo de audio primero');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simular análisis de audio
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockAnalysis = {
        duration: '3:45',
        sampleRate: '44.1kHz',
        bitrate: '320kbps',
        format: 'MP3',
        peaks: generatePeaks(),
        spectrum: generateSpectrum(),
        lufs: -14.2,
        truePeak: -1.0,
        dynamicRange: 8.5,
        bpm: 128,
        key: 'C minor',
        energy: 0.85,
        danceability: 0.78,
        vocals: 0.65,
        instruments: 0.85,
        quality: 'High',
        issues: [
          { type: 'warning', message: 'Pico de frecuencia en 8kHz' },
          { type: 'info', message: 'Dynamic range óptimo para streaming' }
        ]
      };

      setAnalysisData(mockAnalysis);
      console.log('Analysis completed:', mockAnalysis);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      alert('Error al analizar audio');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePeaks = () => {
    return Array.from({ length: 100 }, () => Math.random());
  };

  const generateSpectrum = () => {
    return Array.from({ length: 32 }, () => ({
      frequency: Math.random() * 20000,
      magnitude: Math.random() * 100
    }));
  };

  const drawVisualization = () => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) return;

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(10, 10, 30)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(0.5, '#0088ff');
        gradient.addColorStop(1, '#ff00ff');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Conectar audio al analizador
      if (!audioRef.current.connectedToAnalyser && audioContext && analyser) {
        const source = audioContext.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        audioRef.current.connectedToAnalyser = true;
      }

      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const applyMastering = (preset) => {
    alert(`Aplicando preset de masterización: ${preset}`);
    // Aquí iría la lógica real de procesamiento
  };

  return (
    <div className="ghost-studio">
      <div className="ghost-header">
        <h1>👻 Ghost Studio</h1>
        <p className="ghost-subtitle">Advanced Audio Analysis & Mastering Suite</p>
      </div>

      <div className="ghost-container">
        {/* Panel superior - Carga y visualización */}
        <div className="ghost-top-panel">
          <div className="file-upload-section">
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="icon">📁</span>
              <span>Cargar Audio</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            
            {audioFile && (
              <div className="file-info">
                <span className="file-icon">🎵</span>
                <span className="file-name">{audioFile.name}</span>
                <span className="file-size">
                  {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>

          <div className="mode-selector">
            <button
              className={`mode-btn ${processingMode === 'analyze' ? 'active' : ''}`}
              onClick={() => setProcessingMode('analyze')}
            >
              🔍 Analizar
            </button>
            <button
              className={`mode-btn ${processingMode === 'master' ? 'active' : ''}`}
              onClick={() => setProcessingMode('master')}
            >
              🎛️ Masterizar
            </button>
            <button
              className={`mode-btn ${processingMode === 'repair' ? 'active' : ''}`}
              onClick={() => setProcessingMode('repair')}
            >
              🔧 Reparar
            </button>
            <button
              className={`mode-btn ${processingMode === 'enhance' ? 'active' : ''}`}
              onClick={() => setProcessingMode('enhance')}
            >
              ✨ Mejorar
            </button>
          </div>

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={!audioFile || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                <span>Analizando...</span>
              </>
            ) : (
              <>
                <span>🔬</span>
                <span>Analizar Audio</span>
              </>
            )}
          </button>
        </div>

        {/* Visualización de forma de onda */}
        <div className="waveform-section">
          <canvas
            ref={canvasRef}
            className="waveform-canvas"
            width={1200}
            height={200}
          />
          
          {audioFile && (
            <div className="audio-controls">
              <button className="control-btn" onClick={handlePlayPause}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <audio ref={audioRef} style={{ display: 'none' }} />
            </div>
          )}
        </div>

        {/* Panel principal - Análisis y controles */}
        <div className="ghost-main-panel">
          {/* Panel izquierdo - Métricas */}
          <div className="metrics-panel">
            <h2>📊 Métricas de Audio</h2>
            {analysisData ? (
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-label">LUFS</div>
                  <div className="metric-value">{analysisData.lufs}</div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${(Math.abs(analysisData.lufs) / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">True Peak</div>
                  <div className="metric-value">{analysisData.truePeak} dB</div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${100 - Math.abs(analysisData.truePeak)}%` }}
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Dynamic Range</div>
                  <div className="metric-value">{analysisData.dynamicRange} dB</div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill"
                      style={{ width: `${(analysisData.dynamicRange / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">BPM</div>
                  <div className="metric-value">{analysisData.bpm}</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Key</div>
                  <div className="metric-value">{analysisData.key}</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Energy</div>
                  <div className="metric-value">{(analysisData.energy * 100).toFixed(0)}%</div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill energy"
                      style={{ width: `${analysisData.energy * 100}%` }}
                    />
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Danceability</div>
                  <div className="metric-value">{(analysisData.danceability * 100).toFixed(0)}%</div>
                  <div className="metric-bar">
                    <div 
                      className="metric-fill dance"
                      style={{ width: `${analysisData.danceability * 100}%` }}
                    />
                  </div>
                </div>

                <div className="metric-card full-width">
                  <div className="metric-label">Composición</div>
                  <div className="composition-bars">
                    <div className="comp-bar">
                      <span>Vocals</span>
                      <div className="comp-bar-bg">
                        <div 
                          className="comp-bar-fill vocals"
                          style={{ width: `${analysisData.vocals * 100}%` }}
                        />
                      </div>
                      <span>{(analysisData.vocals * 100).toFixed(0)}%</span>
                    </div>
                    <div className="comp-bar">
                      <span>Instruments</span>
                      <div className="comp-bar-bg">
                        <div 
                          className="comp-bar-fill instruments"
                          style={{ width: `${analysisData.instruments * 100}%` }}
                        />
                      </div>
                      <span>{(analysisData.instruments * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <div className="placeholder-icon">📊</div>
                <p>Carga un archivo y haz clic en "Analizar"</p>
              </div>
            )}

            {analysisData && analysisData.issues.length > 0 && (
              <div className="issues-section">
                <h3>⚠️ Problemas Detectados</h3>
                <div className="issues-list">
                  {analysisData.issues.map((issue, idx) => (
                    <div key={idx} className={`issue-item ${issue.type}`}>
                      <span className="issue-icon">
                        {issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel central - Espectro */}
          <div className="spectrum-panel">
            <h2>🌈 Análisis Espectral</h2>
            {analysisData ? (
              <div className="spectrum-display">
                <div className="spectrum-bars">
                  {analysisData.spectrum.map((band, idx) => (
                    <div key={idx} className="spectrum-bar-container">
                      <div
                        className="spectrum-bar"
                        style={{ height: `${band.magnitude}%` }}
                      />
                      <span className="freq-label">
                        {(band.frequency / 1000).toFixed(1)}k
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-data">
                <div className="placeholder-icon">🌈</div>
                <p>El análisis espectral aparecerá aquí</p>
              </div>
            )}
          </div>

          {/* Panel derecho - Procesamiento */}
          <div className="processing-panel">
            <h2>🎛️ Procesamiento</h2>
            
            <div className="presets-section">
              <h3>Presets de Masterización</h3>
              <div className="presets-grid">
                <button
                  className="preset-btn"
                  onClick={() => applyMastering('spotify')}
                >
                  <span className="preset-icon">🎵</span>
                  <span>Spotify</span>
                  <span className="preset-desc">-14 LUFS</span>
                </button>
                <button
                  className="preset-btn"
                  onClick={() => applyMastering('youtube')}
                >
                  <span className="preset-icon">📺</span>
                  <span>YouTube</span>
                  <span className="preset-desc">-13 LUFS</span>
                </button>
                <button
                  className="preset-btn"
                  onClick={() => applyMastering('apple')}
                >
                  <span className="preset-icon">🍎</span>
                  <span>Apple Music</span>
                  <span className="preset-desc">-16 LUFS</span>
                </button>
                <button
                  className="preset-btn"
                  onClick={() => applyMastering('soundcloud')}
                >
                  <span className="preset-icon">☁️</span>
                  <span>SoundCloud</span>
                  <span className="preset-desc">-14 LUFS</span>
                </button>
              </div>
            </div>

            <div className="effects-section">
              <h3>Efectos</h3>
              <div className="effects-list">
                <label className="effect-control">
                  <span>Compressor</span>
                  <input type="checkbox" />
                </label>
                <label className="effect-control">
                  <span>Limiter</span>
                  <input type="checkbox" />
                </label>
                <label className="effect-control">
                  <span>EQ</span>
                  <input type="checkbox" />
                </label>
                <label className="effect-control">
                  <span>Stereo Widener</span>
                  <input type="checkbox" />
                </label>
              </div>
            </div>

            <div className="export-section">
              <button className="export-btn primary">
                <span>💾</span>
                <span>Exportar Audio</span>
              </button>
              <button className="export-btn secondary">
                <span>📄</span>
                <span>Guardar Reporte</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GhostStudio;
