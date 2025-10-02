/**
 * 🎵 The Creator - AI Music Generation
 * Generación de música con IA, MIDI, y Web Audio API
 */

import React, { useState, useRef, useEffect } from 'react';
import './TheCreator.css';
import WebAudioGenerator from '../services/WebAudioGenerator';
import OllamaAIService from '../services/OllamaAIService';

function TheCreator() {
  const [audioService] = useState(() => new WebAudioGenerator());
  const [aiService] = useState(() => new OllamaAIService());
  
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [genre, setGenre] = useState('electronic');
  const [mood, setMood] = useState('energetic');
  const [tempo, setTempo] = useState(128);
  const [key, setKey] = useState('C');
  const [duration, setDuration] = useState(30);
  const [savedProjects, setSavedProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = () => {
    // Simular proyectos guardados
    const mockProjects = [
      {
        id: 1,
        name: 'Cyberpunk Dreams',
        genre: 'electronic',
        tempo: 140,
        duration: 45,
        created: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 2,
        name: 'Midnight Vibes',
        genre: 'lofi',
        tempo: 85,
        duration: 60,
        created: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 3,
        name: 'Festival Anthem',
        genre: 'edm',
        tempo: 128,
        duration: 120,
        created: new Date(Date.now() - 259200000).toISOString()
      }
    ];
    setSavedProjects(mockProjects);
  };

  const genres = [
    { id: 'electronic', name: 'Electronic', icon: '🎹', color: '#00ffff' },
    { id: 'edm', name: 'EDM', icon: '🔊', color: '#ff00ff' },
    { id: 'lofi', name: 'Lo-Fi', icon: '🌙', color: '#ffd700' },
    { id: 'ambient', name: 'Ambient', icon: '🌌', color: '#9370db' },
    { id: 'synthwave', name: 'Synthwave', icon: '🌆', color: '#ff1493' },
    { id: 'dubstep', name: 'Dubstep', icon: '💥', color: '#00ff00' },
    { id: 'trap', name: 'Trap', icon: '🔥', color: '#ff4500' },
    { id: 'house', name: 'House', icon: '🏠', color: '#1e90ff' }
  ];

  const moods = [
    { id: 'energetic', name: 'Energetic', emoji: '⚡' },
    { id: 'chill', name: 'Chill', emoji: '😌' },
    { id: 'dark', name: 'Dark', emoji: '🌑' },
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'melancholic', name: 'Melancholic', emoji: '😔' },
    { id: 'aggressive', name: 'Aggressive', emoji: '😤' },
    { id: 'dreamy', name: 'Dreamy', emoji: '💭' },
    { id: 'epic', name: 'Epic', emoji: '🎯' }
  ];

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const handleGenerate = async () => {
    if (!prompt && genre === 'electronic') {
      alert('Por favor describe qué tipo de música quieres generar');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 300);

      // Generar música con AI
      const fullPrompt = `Generate a ${genre} track with ${mood} mood at ${tempo} BPM in ${key} key. ${prompt}`;
      
      const result = await audioService.generateMusic(fullPrompt, {
        duration,
        tempo,
        key,
        genre,
        mood
      });

      clearInterval(progressInterval);
      setProgress(100);
      
      setGeneratedTrack({
        ...result,
        name: `${genre}_${mood}_${Date.now()}`,
        settings: { genre, mood, tempo, key, duration }
      });

      console.log('Track generated:', result);
    } catch (error) {
      console.error('Error generating music:', error);
      alert('Error al generar música. Usando modo demo.');
      
      // Modo fallback - generar audio demo
      const demoTrack = {
        audioUrl: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
        waveform: Array.from({ length: 100 }, () => Math.random()),
        duration: `${duration}s`,
        name: `${genre}_${mood}_demo`,
        settings: { genre, mood, tempo, key, duration }
      };
      setGeneratedTrack(demoTrack);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !generatedTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSaveProject = () => {
    if (!generatedTrack) {
      alert('No hay track para guardar');
      return;
    }

    const projectName = prompt('Nombre del proyecto:') || 'Untitled Project';
    
    const newProject = {
      id: savedProjects.length + 1,
      name: projectName,
      genre,
      tempo,
      duration,
      created: new Date().toISOString()
    };

    setSavedProjects([newProject, ...savedProjects]);
    alert(`Proyecto "${projectName}" guardado exitosamente`);
  };

  const handleDownload = () => {
    if (!generatedTrack || !generatedTrack.audioUrl) {
      alert('No hay audio para descargar');
      return;
    }

    const link = document.createElement('a');
    link.href = generatedTrack.audioUrl;
    link.download = `${generatedTrack.name}.wav`;
    link.click();
  };

  const handleExportMIDI = () => {
    alert('Exportando MIDI... (funcionalidad en desarrollo)');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="the-creator">
      <div className="creator-header">
        <h1>🎵 The Creator</h1>
        <p className="creator-subtitle">AI-Powered Music Generation</p>
      </div>

      {/* Tabs */}
      <div className="creator-tabs">
        <button
          className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          🎹 Generate
        </button>
        <button
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          💾 Projects
        </button>
        <button
          className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          ⚙️ Advanced
        </button>
      </div>

      <div className="creator-container">
        {/* TAB: Generate */}
        {activeTab === 'generate' && (
          <div className="generate-section">
            {/* Panel izquierdo - Configuración */}
            <div className="config-panel">
              <div className="section">
                <h2>🎼 Género</h2>
                <div className="genres-grid">
                  {genres.map(g => (
                    <button
                      key={g.id}
                      className={`genre-btn ${genre === g.id ? 'active' : ''}`}
                      onClick={() => setGenre(g.id)}
                      style={{ '--genre-color': g.color }}
                    >
                      <span className="genre-icon">{g.icon}</span>
                      <span className="genre-name">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="section">
                <h2>😊 Estado de Ánimo</h2>
                <div className="moods-grid">
                  {moods.map(m => (
                    <button
                      key={m.id}
                      className={`mood-btn ${mood === m.id ? 'active' : ''}`}
                      onClick={() => setMood(m.id)}
                    >
                      <span className="mood-emoji">{m.emoji}</span>
                      <span className="mood-name">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="section">
                <h2>🎛️ Parámetros</h2>
                <div className="parameters">
                  <label className="param-label">
                    <span>Tempo (BPM)</span>
                    <div className="param-control">
                      <input
                        type="range"
                        min="60"
                        max="180"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                      />
                      <input
                        type="number"
                        min="60"
                        max="180"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                        className="param-number"
                      />
                    </div>
                  </label>

                  <label className="param-label">
                    <span>Duración (segundos)</span>
                    <div className="param-control">
                      <input
                        type="range"
                        min="15"
                        max="180"
                        step="15"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                      />
                      <input
                        type="number"
                        min="15"
                        max="180"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="param-number"
                      />
                    </div>
                  </label>

                  <label className="param-label">
                    <span>Tonalidad</span>
                    <select
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="param-select"
                    >
                      {keys.map(k => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* Panel central - Generación */}
            <div className="generation-panel">
              <div className="prompt-section">
                <h2>✍️ Describe tu música</h2>
                <textarea
                  className="prompt-textarea"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe el tipo de música que quieres generar...
Ejemplo: 'Un track cyberpunk con sintetizadores pesados y bajo profundo, perfecto para una escena de persecución nocturna'"
                  rows={6}
                />
                <div className="prompt-examples">
                  <p>💡 Ejemplos:</p>
                  <button onClick={() => setPrompt('Heavy bass with futuristic synths and glitch effects')}>
                    Cyberpunk Bass
                  </button>
                  <button onClick={() => setPrompt('Smooth lo-fi beats with vinyl crackle and jazz piano')}>
                    Lo-Fi Chill
                  </button>
                  <button onClick={() => setPrompt('Epic orchestral build-up with electronic drop')}>
                    Epic EDM
                  </button>
                </div>
              </div>

              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner"></span>
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <span>🎵</span>
                    <span>Generar Música</span>
                  </>
                )}
              </button>

              {progress > 0 && (
                <div className="progress-section">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{progress}% completado</p>
                </div>
              )}

              {/* Resultado */}
              {generatedTrack && (
                <div className="result-section">
                  <h2>🎧 Track Generado</h2>
                  
                  {/* Waveform visualization */}
                  <div className="waveform-display">
                    {generatedTrack.waveform?.map((value, idx) => (
                      <div
                        key={idx}
                        className="wave-bar"
                        style={{
                          height: `${value * 100}%`,
                          background: `hsl(${180 + value * 100}, 100%, 50%)`
                        }}
                      />
                    ))}
                  </div>

                  {/* Audio player */}
                  <div className="audio-player-section">
                    <button className="play-btn" onClick={handlePlayPause}>
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <audio
                      ref={audioRef}
                      src={generatedTrack.audioUrl}
                      onEnded={() => setIsPlaying(false)}
                    />
                    <div className="track-info">
                      <p className="track-name">{generatedTrack.name}</p>
                      <p className="track-duration">{generatedTrack.duration}</p>
                    </div>
                  </div>

                  {/* Track details */}
                  <div className="track-details">
                    <div className="detail-item">
                      <span className="label">Género:</span>
                      <span className="value">{generatedTrack.settings.genre}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Mood:</span>
                      <span className="value">{generatedTrack.settings.mood}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Tempo:</span>
                      <span className="value">{generatedTrack.settings.tempo} BPM</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Key:</span>
                      <span className="value">{generatedTrack.settings.key}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="track-actions">
                    <button className="action-btn" onClick={handleDownload}>
                      <span>💾</span>
                      <span>Descargar WAV</span>
                    </button>
                    <button className="action-btn" onClick={handleExportMIDI}>
                      <span>🎹</span>
                      <span>Exportar MIDI</span>
                    </button>
                    <button className="action-btn" onClick={handleSaveProject}>
                      <span>📁</span>
                      <span>Guardar Proyecto</span>
                    </button>
                    <button className="action-btn" onClick={handleGenerate}>
                      <span>🔄</span>
                      <span>Regenerar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Panel derecho - Inspiración */}
            <div className="inspiration-panel">
              <h2>💡 Inspiración</h2>
              
              <div className="inspiration-card">
                <h3>🎯 Popular ahora</h3>
                <ul>
                  <li>Synthwave Retrofuturista</li>
                  <li>Lo-Fi para Study</li>
                  <li>Dark Techno Industrial</li>
                  <li>Future Bass Uplifting</li>
                </ul>
              </div>

              <div className="inspiration-card">
                <h3>🔥 Tendencias</h3>
                <ul>
                  <li>Hyperpop Experimental</li>
                  <li>Ambient Cinematográfico</li>
                  <li>Phonk Agresivo</li>
                  <li>Chillwave Nostálgico</li>
                </ul>
              </div>

              <div className="inspiration-card">
                <h3>🎨 Paletas de sonido</h3>
                <div className="sound-palettes">
                  <button className="palette-btn">🌆 Neon City</button>
                  <button className="palette-btn">🌌 Space Odyssey</button>
                  <button className="palette-btn">🏙️ Urban Nights</button>
                  <button className="palette-btn">🌊 Ocean Waves</button>
                </div>
              </div>

              <div className="tips-card">
                <h3>💭 Tips</h3>
                <p>
                  Sé específico en tu descripción. Incluye instrumentos, 
                  emociones y referencias a estilos conocidos para mejores resultados.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Projects */}
        {activeTab === 'projects' && (
          <div className="projects-section">
            <h2>💾 Proyectos Guardados</h2>
            <div className="projects-grid">
              {savedProjects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-icon">🎵</div>
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <p>{project.genre} • {project.tempo} BPM • {project.duration}s</p>
                    <p className="project-date">{formatDate(project.created)}</p>
                  </div>
                  <div className="project-actions">
                    <button className="project-btn">▶️</button>
                    <button className="project-btn">📝</button>
                    <button className="project-btn">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Advanced */}
        {activeTab === 'advanced' && (
          <div className="advanced-section">
            <h2>⚙️ Configuración Avanzada</h2>
            <div className="advanced-grid">
              <div className="advanced-card">
                <h3>🎛️ Síntesis</h3>
                <label>
                  <span>Oscillator Type</span>
                  <select>
                    <option>Sine</option>
                    <option>Square</option>
                    <option>Sawtooth</option>
                    <option>Triangle</option>
                  </select>
                </label>
                <label>
                  <span>Filter Cutoff</span>
                  <input type="range" min="20" max="20000" />
                </label>
                <label>
                  <span>Resonance</span>
                  <input type="range" min="0" max="100" />
                </label>
              </div>

              <div className="advanced-card">
                <h3>🎚️ Mix</h3>
                <label>
                  <span>Bass Level</span>
                  <input type="range" min="0" max="100" defaultValue="80" />
                </label>
                <label>
                  <span>Mid Level</span>
                  <input type="range" min="0" max="100" defaultValue="60" />
                </label>
                <label>
                  <span>Treble Level</span>
                  <input type="range" min="0" max="100" defaultValue="70" />
                </label>
              </div>

              <div className="advanced-card">
                <h3>🔊 Effects</h3>
                <label>
                  <input type="checkbox" />
                  <span>Reverb</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Delay</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Chorus</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>Distortion</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TheCreator;
