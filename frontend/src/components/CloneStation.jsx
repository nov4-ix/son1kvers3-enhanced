/**
 * 🎤 Clone Station - Voice Cloning Interface
 * Interfaz completa para clonación de voz con so-VITS y Bark
 */

import React, { useState, useRef, useEffect } from 'react';
import './CloneStation.css';
import VoiceCloningService from '../services/VoiceCloningService';

function CloneStation() {
  const [voiceService] = useState(() => new VoiceCloningService());
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [clonedAudio, setClonedAudio] = useState(null);
  const [voiceProfiles, setVoiceProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [emotion, setEmotion] = useState('neutral');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Cargar perfiles de voz guardados
    loadVoiceProfiles();
  }, []);

  const loadVoiceProfiles = () => {
    // Simular carga de perfiles guardados
    const profiles = [
      { id: 1, name: 'Voz Principal', type: 'so-VITS', duration: '2:30' },
      { id: 2, name: 'Voz Femenina', type: 'Bark', duration: '1:45' },
      { id: 3, name: 'Voz Masculina', type: 'so-VITS', duration: '3:10' }
    ];
    setVoiceProfiles(profiles);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      console.log('Audio file loaded:', file.name);
    } else {
      alert('Por favor selecciona un archivo de audio válido');
    }
  };

  const handleCloneVoice = async () => {
    if (!textInput) {
      alert('Por favor ingresa el texto a sintetizar');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      let result;
      if (audioFile) {
        // Clonar desde archivo de audio
        result = await voiceService.cloneVoice(audioFile, textInput);
      } else if (selectedProfile) {
        // Usar perfil existente
        result = await voiceService.cloneVoiceFromPrompt(
          `Usar perfil: ${selectedProfile.name}`,
          textInput
        );
      } else {
        // Generar con Bark (sin referencia)
        result = await voiceService.cloneVoiceFromPrompt(
          `Voz ${emotion}`,
          textInput
        );
      }

      clearInterval(progressInterval);
      setProgress(100);
      setClonedAudio(result);

      console.log('Voice cloning completed:', result);
    } catch (error) {
      console.error('Error cloning voice:', error);
      alert('Error al clonar voz. Usando modo fallback.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const handleSaveProfile = () => {
    if (!clonedAudio) {
      alert('No hay audio clonado para guardar');
      return;
    }

    const profileName = prompt('Nombre del perfil de voz:');
    if (profileName) {
      const newProfile = {
        id: voiceProfiles.length + 1,
        name: profileName,
        type: audioFile ? 'so-VITS' : 'Bark',
        duration: '0:00'
      };
      setVoiceProfiles([...voiceProfiles, newProfile]);
      alert(`Perfil "${profileName}" guardado exitosamente`);
    }
  };

  const handleDownload = () => {
    if (clonedAudio && clonedAudio.audioUrl) {
      const link = document.createElement('a');
      link.href = clonedAudio.audioUrl;
      link.download = `cloned_voice_${Date.now()}.wav`;
      link.click();
    }
  };

  return (
    <div className="clone-station">
      <div className="clone-header">
        <h1>🎤 Clone Station</h1>
        <p className="clone-subtitle">Advanced Voice Cloning & Synthesis</p>
      </div>

      <div className="clone-container">
        {/* Panel izquierdo - Input */}
        <div className="clone-input-panel">
          <div className="section">
            <h2>📁 Fuente de Audio</h2>
            <div className="audio-source-options">
              <button
                className="source-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="icon">📤</span>
                <span>Subir Audio</span>
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
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <h2>👤 Perfiles de Voz</h2>
            <div className="voice-profiles-list">
              {voiceProfiles.map(profile => (
                <div
                  key={profile.id}
                  className={`profile-card ${selectedProfile?.id === profile.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProfile(profile)}
                >
                  <div className="profile-info">
                    <h3>{profile.name}</h3>
                    <span className="profile-type">{profile.type}</span>
                  </div>
                  <span className="profile-duration">{profile.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>😊 Emoción</h2>
            <div className="emotion-selector">
              {['neutral', 'happy', 'sad', 'angry', 'excited'].map(emo => (
                <button
                  key={emo}
                  className={`emotion-btn ${emotion === emo ? 'active' : ''}`}
                  onClick={() => setEmotion(emo)}
                >
                  {emo === 'neutral' && '😐'}
                  {emo === 'happy' && '😊'}
                  {emo === 'sad' && '😢'}
                  {emo === 'angry' && '😠'}
                  {emo === 'excited' && '🤩'}
                  <span>{emo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel central - Control */}
        <div className="clone-control-panel">
          <div className="text-input-section">
            <h2>✍️ Texto a Sintetizar</h2>
            <textarea
              className="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Escribe el texto que quieres convertir a voz..."
              rows={8}
            />
            <div className="text-stats">
              <span>{textInput.length} caracteres</span>
              <span>{textInput.split(' ').filter(w => w).length} palabras</span>
            </div>
          </div>

          <div className="clone-actions">
            <button
              className="clone-btn primary"
              onClick={handleCloneVoice}
              disabled={isProcessing || !textInput}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  <span>Clonando...</span>
                </>
              ) : (
                <>
                  <span>🎤</span>
                  <span>Clonar Voz</span>
                </>
              )}
            </button>

            {progress > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="progress-text">{progress}%</span>
              </div>
            )}
          </div>

          {/* Configuración avanzada */}
          <div className="advanced-settings">
            <details>
              <summary>⚙️ Configuración Avanzada</summary>
              <div className="settings-grid">
                <label>
                  <span>Pitch:</span>
                  <input type="range" min="-12" max="12" defaultValue="0" />
                </label>
                <label>
                  <span>Speed:</span>
                  <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
                </label>
                <label>
                  <span>Volume:</span>
                  <input type="range" min="0" max="1" step="0.1" defaultValue="0.8" />
                </label>
              </div>
            </details>
          </div>
        </div>

        {/* Panel derecho - Output */}
        <div className="clone-output-panel">
          <div className="section">
            <h2>🎧 Resultado</h2>
            {clonedAudio ? (
              <div className="audio-result">
                <div className="audio-visualizer">
                  <div className="waveform">
                    {[...Array(50)].map((_, i) => (
                      <div
                        key={i}
                        className="wave-bar"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.02}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                <audio
                  controls
                  src={clonedAudio.audioUrl}
                  className="audio-player"
                />

                <div className="audio-info">
                  <div className="info-item">
                    <span className="label">Duración:</span>
                    <span className="value">{clonedAudio.duration || '0:00'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Formato:</span>
                    <span className="value">{clonedAudio.format || 'WAV'}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Calidad:</span>
                    <span className="value">{clonedAudio.quality || '44.1kHz'}</span>
                  </div>
                </div>

                <div className="audio-actions">
                  <button className="action-btn" onClick={handleDownload}>
                    <span>💾</span>
                    <span>Descargar</span>
                  </button>
                  <button className="action-btn" onClick={handleSaveProfile}>
                    <span>📁</span>
                    <span>Guardar Perfil</span>
                  </button>
                  <button className="action-btn">
                    <span>🔄</span>
                    <span>Regenerar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-audio">
                <div className="placeholder-icon">🎤</div>
                <p>El audio clonado aparecerá aquí</p>
              </div>
            )}
          </div>

          {/* Información del sistema */}
          <div className="system-info">
            <h3>🔧 Estado del Sistema</h3>
            <div className="status-list">
              <div className="status-item online">
                <span className="status-dot"></span>
                <span>Bark AI: Online</span>
              </div>
              <div className="status-item online">
                <span className="status-dot"></span>
                <span>so-VITS: Ready</span>
              </div>
              <div className="status-item online">
                <span className="status-dot"></span>
                <span>Web Audio API: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CloneStation;
