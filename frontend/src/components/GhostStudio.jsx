/**
 * 👻 Ghost Studio - Herramienta Central de Son1kVers3
 * Analizador de audio inteligente con knobs característicos y generación de prompts
 */

import React, { useState, useRef, useEffect } from 'react';
import './GhostStudio.css';
import TranslationService from '../services/TranslationService';

const GhostStudio = ({ services }) => {
  // Estados principales
  const [uploadedFile, setUploadedFile] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  
  // Estados de knobs característicos
  const [knobs, setKnobs] = useState({
    expresividad: 50,  // Mood y estado de ánimo
    trash: 30,         // Sonido saturado de mezcla
    grunge: 25,        // Instrumentos con distorsión
    rareza: 40         // Qué tanto cambiar del original
  });
  
  // Estados de configuración
  const [useAutoArrangement, setUseAutoArrangement] = useState(true);
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [translatedPrompt, setTranslatedPrompt] = useState('');
  
  // Referencias
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const translationService = useRef(new TranslationService());

  // Efectos
  useEffect(() => {
    if (audioAnalysis && userPrompt) {
      generateOptimizedPrompt();
    }
  }, [audioAnalysis, userPrompt, knobs, useAutoArrangement]);

  // Manejar subida de archivo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo de audio
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/m4a'];
    if (!validTypes.includes(file.type)) {
      alert('Por favor sube un archivo de audio válido (WAV, MP3, OGG, M4A)');
      return;
    }

    setUploadedFile(file);
    setAudioAnalysis(null);
    
    // Crear URL para reproducción
    const audioUrl = URL.createObjectURL(file);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }

    // Analizar automáticamente
    await analyzeAudio(file);
  };

  // Analizador de audio inteligente
  const analyzeAudio = async (file) => {
    setIsAnalyzing(true);
    
    try {
      console.log('🎵 Analizando audio con Ghost Studio...');
      
      // Simular análisis de audio (en producción usaría Web Audio API + ML)
      const analysis = await performAudioAnalysis(file);
      
      setAudioAnalysis(analysis);
      console.log('✅ Análisis completado:', analysis);
      
      // Generar prompt inicial basado en el análisis
      if (userPrompt) {
        generateOptimizedPrompt();
      }
      
    } catch (error) {
      console.error('Error analizando audio:', error);
      alert('Error analizando el audio. Por favor intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Función de análisis de audio (simulada con IA real en producción)
  const performAudioAnalysis = async (file) => {
    // Simular tiempo de análisis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // En producción, esto usaría:
    // - Web Audio API para análisis de frecuencias
    // - ML models para detección de género
    // - Beat detection algorithms para BPM
    // - Spectral analysis para instrumentación
    
    const mockAnalysis = {
      bpm: Math.floor(Math.random() * (140 - 80) + 80), // 80-140 BPM
      key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)],
      genre: ['Electronic', 'Rock', 'Pop', 'Hip Hop', 'Indie', 'Alternative'][Math.floor(Math.random() * 6)],
      mood: ['Energetic', 'Melancholic', 'Uplifting', 'Dark', 'Chill', 'Aggressive'][Math.floor(Math.random() * 6)],
      instruments: {
        drums: Math.random() > 0.3,
        bass: Math.random() > 0.2,
        guitar: Math.random() > 0.4,
        synth: Math.random() > 0.5,
        vocals: Math.random() > 0.6,
        piano: Math.random() > 0.7
      },
      energy: Math.floor(Math.random() * 100),
      danceability: Math.floor(Math.random() * 100),
      valence: Math.floor(Math.random() * 100), // Positividad
      acousticness: Math.floor(Math.random() * 100),
      duration: Math.floor(Math.random() * (300 - 60) + 60), // 1-5 minutos
      arrangement_suggestion: generateArrangementSuggestion()
    };
    
    return mockAnalysis;
  };

  // Generar sugerencia de arreglo basada en análisis
  const generateArrangementSuggestion = () => {
    const arrangements = [
      'Add orchestral strings for emotional depth',
      'Include heavy distorted guitars for rock energy',
      'Layer ambient synth pads for atmospheric texture',
      'Add punchy electronic drums for modern feel',
      'Include brass section for dynamic impact',
      'Layer vocal harmonies for richness',
      'Add bass drops for electronic emphasis',
      'Include acoustic elements for organic feel'
    ];
    
    return arrangements[Math.floor(Math.random() * arrangements.length)];
  };

  // Manejar cambio de knobs
  const handleKnobChange = (knobName, value) => {
    setKnobs(prev => ({
      ...prev,
      [knobName]: parseInt(value)
    }));
  };

  // Generar prompt aleatorio creativo
  const generateRandomPrompt = () => {
    const creativePrompts = [
      'A haunting melody that echoes through abandoned cyberpunk streets',
      'Explosive energy with distorted guitars and pounding drums',
      'Ethereal ambient soundscape with mysterious undertones',
      'Aggressive electronic beats with industrial influences',
      'Melancholic piano ballad with orchestral arrangements',
      'High-energy dance track with infectious rhythms',
      'Dark atmospheric piece with cinematic elements',
      'Uplifting anthem with soaring melodies and rich harmonies'
    ];
    
    const randomPrompt = creativePrompts[Math.floor(Math.random() * creativePrompts.length)];
    setUserPrompt(randomPrompt);
  };

  // Generar prompt optimizado basado en análisis y knobs
  const generateOptimizedPrompt = async () => {
    if (!audioAnalysis) return;
    
    let optimizedPrompt = userPrompt || 'Create a musical arrangement';
    
    // Añadir información del análisis si está activado el arreglo automático
    if (useAutoArrangement) {
      optimizedPrompt += ` in ${audioAnalysis.genre.toLowerCase()} style`;
      optimizedPrompt += ` at ${audioAnalysis.bpm} BPM`;
      optimizedPrompt += ` in ${audioAnalysis.key} key`;
      optimizedPrompt += ` with ${audioAnalysis.mood.toLowerCase()} mood`;
      
      // Añadir instrumentación detectada
      const detectedInstruments = Object.entries(audioAnalysis.instruments)
        .filter(([instrument, present]) => present)
        .map(([instrument]) => instrument);
      
      if (detectedInstruments.length > 0) {
        optimizedPrompt += ` featuring ${detectedInstruments.join(', ')}`;
      }
      
      // Añadir sugerencia de arreglo
      optimizedPrompt += `. ${audioAnalysis.arrangement_suggestion}`;
    }
    
    // Aplicar influencia de knobs
    optimizedPrompt = applyKnobsToPrompt(optimizedPrompt);
    
    setGeneratedPrompt(optimizedPrompt);
    
    // Traducir al inglés para mejor respuesta del motor
    const translated = await translateToEnglish(optimizedPrompt);
    setTranslatedPrompt(translated);
  };

  // Aplicar influencia de knobs al prompt
  const applyKnobsToPrompt = (basePrompt) => {
    let modifiedPrompt = basePrompt;
    
    // Expresividad (mood y estado de ánimo)
    if (knobs.expresividad > 70) {
      modifiedPrompt += ', with highly expressive and emotional performance';
    } else if (knobs.expresividad > 40) {
      modifiedPrompt += ', with moderate emotional expression';
    } else {
      modifiedPrompt += ', with subtle and controlled expression';
    }
    
    // Trash (sonido saturado de mezcla)
    if (knobs.trash > 70) {
      modifiedPrompt += ', heavily saturated and compressed mix with aggressive processing';
    } else if (knobs.trash > 40) {
      modifiedPrompt += ', with some saturation and punch in the mix';
    } else {
      modifiedPrompt += ', with clean and polished production';
    }
    
    // Grunge (instrumentos con distorsión)
    if (knobs.grunge > 70) {
      modifiedPrompt += ', featuring heavily distorted and gritty instruments';
    } else if (knobs.grunge > 40) {
      modifiedPrompt += ', with some distortion and edge on instruments';
    } else {
      modifiedPrompt += ', with clean and pristine instrument tones';
    }
    
    // Rareza (qué tanto cambiar del original)
    if (knobs.rareza > 70) {
      modifiedPrompt += ', completely reimagined with experimental and unconventional elements';
    } else if (knobs.rareza > 40) {
      modifiedPrompt += ', with creative variations and some unexpected elements';
    } else {
      modifiedPrompt += ', staying close to the original style and structure';
    }
    
    return modifiedPrompt;
  };

  // Traducir prompt al inglés usando el servicio de traducción
  const translateToEnglish = async (text) => {
    try {
      // Usar el servicio de traducción optimizado para música
      const optimizedPrompt = translationService.current.generateMusicPrompt(
        text, 
        audioAnalysis, 
        knobs
      );
      
      return optimizedPrompt;
    } catch (error) {
      console.error('Error traduciendo prompt:', error);
      return text; // Fallback al texto original
    }
  };

  // Generar track con Suno
  const generateTrack = async () => {
    if (!translatedPrompt && !generatedPrompt) {
      alert('Por favor genera un prompt primero');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      console.log('🎵 Generando track con Suno...');
      console.log('Prompt final:', translatedPrompt || generatedPrompt);
      
      // Llamar al backend para generar con Suno
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: translatedPrompt || generatedPrompt,
          original_analysis: audioAnalysis,
          knobs_settings: knobs,
          use_auto_arrangement: useAutoArrangement,
          user_prompt: userPrompt
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGeneratedTrack(result);
        console.log('✅ Track generado exitosamente');
      } else {
        throw new Error(result.error || 'Error generando track');
      }
      
    } catch (error) {
      console.error('Error generando track:', error);
      alert('Error generando el track: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ghost-studio">
      <div className="ghost-studio-header">
        <h1>👻 Ghost Studio</h1>
        <p>Herramienta Central de Son1kVers3 - Analizador Inteligente y Generador de Arreglos</p>
      </div>

      <div className="ghost-studio-content">
        {/* Sección de subida de archivo */}
        <div className="upload-section">
          <h3>📁 Subir Maqueta</h3>
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            {uploadedFile ? (
              <div className="file-info">
                <span className="file-icon">🎵</span>
                <div className="file-details">
                  <p className="file-name">{uploadedFile.name}</p>
                  <p className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📤</span>
                <p>Haz clic para subir tu maqueta</p>
                <p className="upload-hint">Soporta WAV, MP3, OGG, M4A</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          {uploadedFile && (
            <div className="audio-player">
              <audio ref={audioRef} controls className="audio-control">
                Tu navegador no soporta el elemento de audio.
              </audio>
            </div>
          )}
        </div>

        {/* Sección de análisis */}
        {isAnalyzing && (
          <div className="analyzing-section">
            <div className="analyzing-animation">
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay-1"></div>
              <div className="pulse-ring delay-2"></div>
            </div>
            <p>🔍 Analizando audio...</p>
            <p className="analyzing-detail">Detectando BPM, género, instrumentación...</p>
          </div>
        )}

        {/* Resultados del análisis */}
        {audioAnalysis && (
          <div className="analysis-results">
            <h3>📊 Análisis de Audio</h3>
            <div className="analysis-grid">
              <div className="analysis-card">
                <span className="analysis-label">BPM</span>
                <span className="analysis-value">{audioAnalysis.bpm}</span>
              </div>
              <div className="analysis-card">
                <span className="analysis-label">Género</span>
                <span className="analysis-value">{audioAnalysis.genre}</span>
              </div>
              <div className="analysis-card">
                <span className="analysis-label">Tonalidad</span>
                <span className="analysis-value">{audioAnalysis.key}</span>
              </div>
              <div className="analysis-card">
                <span className="analysis-label">Mood</span>
                <span className="analysis-value">{audioAnalysis.mood}</span>
              </div>
              <div className="analysis-card">
                <span className="analysis-label">Energía</span>
                <span className="analysis-value">{audioAnalysis.energy}%</span>
              </div>
              <div className="analysis-card">
                <span className="analysis-label">Danzabilidad</span>
                <span className="analysis-value">{audioAnalysis.danceability}%</span>
              </div>
            </div>
            
            {/* Instrumentación detectada */}
            <div className="instruments-detected">
              <h4>🎼 Instrumentación Detectada</h4>
              <div className="instruments-list">
                {Object.entries(audioAnalysis.instruments).map(([instrument, present]) => (
                  <span 
                    key={instrument}
                    className={`instrument-tag ${present ? 'detected' : 'not-detected'}`}
                  >
                    {instrument}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Sugerencia de arreglo */}
            <div className="arrangement-suggestion">
              <h4>💡 Sugerencia de Arreglo</h4>
              <p>{audioAnalysis.arrangement_suggestion}</p>
              <label className="auto-arrangement-toggle">
                <input
                  type="checkbox"
                  checked={useAutoArrangement}
                  onChange={(e) => setUseAutoArrangement(e.target.checked)}
                />
                <span>Usar arreglo automático basado en análisis</span>
              </label>
            </div>
          </div>
        )}

        {/* Knobs característicos */}
        <div className="knobs-section">
          <h3>🎛️ Knobs Característicos</h3>
          <div className="knobs-grid">
            <div className="knob-container">
              <div className="knob-wrapper">
                <div className="knob" style={{ '--rotation': `${(knobs.expresividad / 100) * 270 - 135}deg` }}>
                  <div className="knob-indicator"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={knobs.expresividad}
                  onChange={(e) => handleKnobChange('expresividad', e.target.value)}
                  className="knob-input"
                />
              </div>
              <label className="knob-label">
                <span className="knob-name">EXPRESIVIDAD</span>
                <span className="knob-value">{knobs.expresividad}%</span>
                <span className="knob-description">Mood y estado de ánimo</span>
              </label>
            </div>

            <div className="knob-container">
              <div className="knob-wrapper">
                <div className="knob" style={{ '--rotation': `${(knobs.trash / 100) * 270 - 135}deg` }}>
                  <div className="knob-indicator"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={knobs.trash}
                  onChange={(e) => handleKnobChange('trash', e.target.value)}
                  className="knob-input"
                />
              </div>
              <label className="knob-label">
                <span className="knob-name">TRASH</span>
                <span className="knob-value">{knobs.trash}%</span>
                <span className="knob-description">Sonido saturado de mezcla</span>
              </label>
            </div>

            <div className="knob-container">
              <div className="knob-wrapper">
                <div className="knob" style={{ '--rotation': `${(knobs.grunge / 100) * 270 - 135}deg` }}>
                  <div className="knob-indicator"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={knobs.grunge}
                  onChange={(e) => handleKnobChange('grunge', e.target.value)}
                  className="knob-input"
                />
              </div>
              <label className="knob-label">
                <span className="knob-name">GRUNGE</span>
                <span className="knob-value">{knobs.grunge}%</span>
                <span className="knob-description">Instrumentos con distorsión</span>
              </label>
            </div>

            <div className="knob-container">
              <div className="knob-wrapper">
                <div className="knob" style={{ '--rotation': `${(knobs.rareza / 100) * 270 - 135}deg` }}>
                  <div className="knob-indicator"></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={knobs.rareza}
                  onChange={(e) => handleKnobChange('rareza', e.target.value)}
                  className="knob-input"
                />
              </div>
              <label className="knob-label">
                <span className="knob-name">RAREZA</span>
                <span className="knob-value">{knobs.rareza}%</span>
                <span className="knob-description">Cambio del original</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generación de prompts */}
        <div className="prompt-section">
          <h3>✍️ Generación de Prompts</h3>
          
          <div className="prompt-controls">
            <button 
              className="prompt-btn random"
              onClick={generateRandomPrompt}
            >
              🎲 Prompt Random
            </button>
            <button 
              className="prompt-btn generate"
              onClick={generateOptimizedPrompt}
              disabled={!audioAnalysis}
            >
              🧠 Generar Prompt
            </button>
          </div>
          
          <div className="prompt-input">
            <label>Prompt del Usuario:</label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Describe el estilo o arreglo que deseas..."
              rows="3"
            />
          </div>
          
          {generatedPrompt && (
            <div className="generated-prompt">
              <label>Prompt Generado:</label>
              <div className="prompt-display">{generatedPrompt}</div>
            </div>
          )}
          
          {translatedPrompt && (
            <div className="translated-prompt">
              <label>Prompt Traducido (Inglés):</label>
              <div className="prompt-display translated">{translatedPrompt}</div>
            </div>
          )}
        </div>

        {/* Generación final */}
        <div className="generation-section">
          <button 
            className={`generate-track-btn ${isGenerating ? 'generating' : ''}`}
            onClick={generateTrack}
            disabled={isGenerating || (!generatedPrompt && !userPrompt)}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generando con Suno...
              </>
            ) : (
              <>
                🎵 Generar Track
              </>
            )}
          </button>
        </div>

        {/* Resultado generado */}
        {generatedTrack && (
          <div className="generated-track">
            <h3>🎉 Track Generado</h3>
            <div className="track-info">
              <p><strong>ID:</strong> {generatedTrack.job_id}</p>
              <p><strong>Estado:</strong> {generatedTrack.status}</p>
              {generatedTrack.audio_url && (
                <audio controls src={generatedTrack.audio_url} className="generated-audio">
                  Tu navegador no soporta el elemento de audio.
                </audio>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GhostStudio;
