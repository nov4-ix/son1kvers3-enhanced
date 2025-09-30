/**
 * 🎵 Son1kVers3 Enhanced - Aplicación Principal
 * Integración completa de todas las funcionalidades avanzadas
 */

import React, { useState, useEffect } from 'react';
import './App.css';

// Importar servicios
import WebAudioGenerator from './services/WebAudioGenerator';
import OllamaAIService from './services/OllamaAIService';
import VoiceCloningService from './services/VoiceCloningService';
import NovaPostPilotService from './services/NovaPostPilotService';
import AnalyticsService from './services/AnalyticsService';

// Importar componentes
import NexusInterface from './components/NexusInterface';
import DAWEditor from './components/DAWEditor';
import FloatingPlayer from './components/FloatingPlayer';
import CommunityHub from './components/CommunityHub';
import ResistanceMessage from './components/ResistanceMessage';

function App() {
  const [currentView, setCurrentView] = useState('nexus');
  const [services, setServices] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    webAudio: false,
    ollama: false,
    voiceCloning: false,
    novaPost: false,
    analytics: false,
    stealth: false
  });

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      console.log('🚀 Inicializando Son1kVers3 Enhanced...');
      
      // Inicializar servicios con modo fallback
      const webAudio = new WebAudioGenerator();
      const ollama = new OllamaAIService();
      const voiceCloning = new VoiceCloningService();
      const novaPost = new NovaPostPilotService();
      const analytics = new AnalyticsService();

      // Verificar estado de servicios (con timeout)
      const status = {
        webAudio: true, // Siempre disponible (Web Audio API)
        ollama: false, // Se verifica después
        voiceCloning: true, // Siempre disponible (modo fallback)
        novaPost: true, // Siempre disponible (modo fallback)
        analytics: true, // Siempre disponible (modo fallback)
        stealth: false // Se verifica por separado
      };

      setServices({
        webAudio,
        ollama,
        voiceCloning,
        novaPost,
        analytics
      });

      setSystemStatus(status);
      setIsInitialized(true);

      console.log('✅ Son1kVers3 Enhanced inicializado correctamente');
      console.log('📊 Estado de servicios:', status);

      // Verificar Ollama en segundo plano
      setTimeout(async () => {
        try {
          const ollamaStatus = await ollama.isServiceAvailable();
          setSystemStatus(prev => ({ ...prev, ollama: ollamaStatus }));
        } catch (error) {
          console.warn('Ollama no disponible, usando modo fallback');
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Error inicializando servicios:', error);
      // Inicializar con modo fallback
      setIsInitialized(true);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'nexus':
        return <NexusInterface />;
      case 'daw':
        return <DAWEditor 
          onExport={(project) => {
            console.log('Exportando proyecto:', project);
            // Aquí se implementaría la exportación real
          }}
          onSave={(project) => {
            console.log('Guardando proyecto:', project);
            // Aquí se implementaría el guardado real
          }}
        />;
      case 'music':
        return <MusicInterface services={services} />;
      case 'voice':
        return <VoiceInterface services={services} />;
      case 'analytics':
        return <AnalyticsInterface services={services} />;
      case 'social':
        return <SocialInterface services={services} />;
      case 'ghost':
        return <GhostInterface services={services} />;
      case 'community':
        return <CommunityHub />;
      case 'nexus':
        return <NexusInterface />;
      default:
        return <NexusInterface />;
    }
  };

  if (!isInitialized) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Inicializando Son1kVers3 Enhanced...</h2>
          <p>Preparando interfaz cyberpunk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header con navegación */}
      <header className="app-header">
        <div className="app-logo">
          <img src="/logo.svg" alt="Son1kVers3" className="app-logo-img" />
          <div className="app-logo-text">
            <h1>Son1kVers3 Enhanced</h1>
            <span className="app-version">v2.0</span>
          </div>
        </div>
        
        <nav className="app-nav">
          {[
            { id: 'nexus', label: 'Nexus', icon: '🎮' },
            { id: 'daw', label: 'DAW Editor', icon: '🎛️' },
            { id: 'music', label: 'Music', icon: '🎵' },
            { id: 'voice', label: 'Voice', icon: '🎤' },
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'social', label: 'Social', icon: '🚀' },
            { id: 'ghost', label: 'Ghost', icon: '👻' },
            { id: 'community', label: 'Santuario', icon: '⚔️' }
          ].map(item => (
            <button
              key={item.id}
              className={`nav-btn ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleViewChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Indicador de estado de servicios */}
        <div className="service-status">
          {Object.entries(systemStatus).map(([service, status]) => (
            <div
              key={service}
              className={`status-indicator ${status ? 'online' : 'offline'}`}
              title={`${service}: ${status ? 'Online' : 'Offline'}`}
            />
        ))}
      </div>
      </header>

      {/* Contenido principal */}
      <main className="app-main">
        {renderCurrentView()}
        
        {/* Mensaje de resistencia en todas las vistas */}
        <ResistanceMessage />
      </main>

      {/* Reproductor flotante global */}
      <FloatingPlayer />

      {/* Footer con información del sistema */}
      <footer className="app-footer">
        <div className="footer-info">
          <p>Son1kVers3 Enhanced v2.0 - Sistema de Generación Musical Avanzado</p>
          <p>Powered by Web Audio API, Ollama AI, so-VITS, Bark, and Nova Post Pilot</p>
        </div>
      </footer>
      </div>
  );
}

// Componentes de interfaz específicos
const MusicInterface = ({ services }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(null);

  const handleGenerateMusic = async () => {
    if (!services.webAudio) return;
    
    setIsGenerating(true);
    try {
      const result = await services.webAudio.generateMusic(
        "Generate a cyberpunk electronic track with heavy bass and futuristic synths",
        { duration: 30, tempo: 128, key: 'C' }
      );
      setGeneratedAudio(result);
    } catch (error) {
      console.error('Error generating music:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="music-interface">
      <h2>🎵 Music Generation</h2>
      <div className="music-controls">
        <button
          className="generate-btn"
          onClick={handleGenerateMusic}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Track'}
        </button>
        
        {generatedAudio && (
          <div className="audio-player">
            <audio controls src={generatedAudio.audioUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

const VoiceInterface = ({ services }) => {
  const [isCloning, setIsCloning] = useState(false);
  const [clonedAudio, setClonedAudio] = useState(null);

  const handleVoiceClone = async () => {
    if (!services.voiceCloning) return;
    
    setIsCloning(true);
    try {
      // Simular clonación de voz
      const result = await services.voiceCloning.cloneVoiceFromPrompt(
        "Convertir voz a texto con emoción feliz",
        "Hola, este es un ejemplo de clonación de voz"
      );
      setClonedAudio(result);
    } catch (error) {
      console.error('Error cloning voice:', error);
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="voice-interface">
      <h2>🎤 Voice Cloning</h2>
      <div className="voice-controls">
        <button
          className="clone-btn"
          onClick={handleVoiceClone}
          disabled={isCloning}
        >
          {isCloning ? 'Cloning...' : 'Clone Voice'}
        </button>
        
        {clonedAudio && (
          <div className="audio-player">
            <audio controls src={clonedAudio.audioUrl} />
            </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsInterface = ({ services }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (services.analytics) {
      services.analytics.getAnalyticsData('7d').then(setAnalyticsData);
    }
  }, [services.analytics]);

  return (
    <div className="analytics-interface">
      <h2>📊 Analytics Dashboard</h2>
      {analyticsData ? (
        <div className="analytics-grid">
          <div className="metric-card">
            <h3>Followers</h3>
            <p className="metric-value">{analyticsData.followers.current}</p>
            <p className="metric-change">+{analyticsData.followers.growth}%</p>
          </div>
          <div className="metric-card">
            <h3>Engagement</h3>
            <p className="metric-value">{analyticsData.engagement.rate}%</p>
            <p className="metric-change">+8%</p>
          </div>
          <div className="metric-card">
            <h3>Reach</h3>
            <p className="metric-value">{analyticsData.reach.total}</p>
            <p className="metric-change">+12%</p>
          </div>
      </div>
      ) : (
        <p>Cargando datos de analytics...</p>
      )}
    </div>
  );
};

const SocialInterface = ({ services }) => {
  const [postContent, setPostContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishPost = async () => {
    if (!services.novaPost) return;
    
    setIsPublishing(true);
    try {
      const result = await services.novaPost.publishContent(
        postContent,
        'instagram',
        null,
        false
      );
      console.log('Post published:', result);
    } catch (error) {
      console.error('Error publishing post:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="social-interface">
      <h2>🚀 Social Media</h2>
      <div className="social-controls">
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Escribe tu post aquí..."
          className="post-textarea"
        />
        <button
          className="publish-btn"
          onClick={handlePublishPost}
          disabled={isPublishing || !postContent}
        >
          {isPublishing ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
      </div>
  );
};

const GhostInterface = ({ services }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeAudio = async () => {
    setIsAnalyzing(true);
    try {
      // Simular análisis de audio
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Audio analysis completed');
    } catch (error) {
      console.error('Error analyzing audio:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="ghost-interface">
      <h2>👻 Ghost Studio</h2>
      <div className="ghost-controls">
        <button
          className="analyze-btn"
          onClick={handleAnalyzeAudio}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
        </button>
      </div>
    </div>
  );
};

export default App;


