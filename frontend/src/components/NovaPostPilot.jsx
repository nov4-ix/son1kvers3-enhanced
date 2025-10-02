/**
 * 🚀 Nova Post Pilot (NOP) - Social Media Automation
 * Gestión y publicación automatizada en redes sociales
 */

import React, { useState, useEffect } from 'react';
import './NovaPostPilot.css';
import NovaPostPilotService from '../services/NovaPostPilotService';
import AnalyticsService from '../services/AnalyticsService';

function NovaPostPilot() {
  const [nopService] = useState(() => new NovaPostPilotService());
  const [analyticsService] = useState(() => new AnalyticsService());
  
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('compose');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: '#4267B2' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5' }
  ];

  useEffect(() => {
    loadAnalytics();
    loadPublishedPosts();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsService.getAnalyticsData('7d');
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadPublishedPosts = () => {
    // Simular posts publicados
    const mockPosts = [
      {
        id: 1,
        content: '🎵 Nuevo track disponible! #music #electronic',
        platforms: ['instagram', 'twitter'],
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        engagement: { likes: 245, comments: 12, shares: 8 }
      },
      {
        id: 2,
        content: 'Working on new beats 🎛️ #producer #studio',
        platforms: ['facebook', 'tiktok'],
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        engagement: { likes: 189, comments: 23, shares: 15 }
      },
      {
        id: 3,
        content: 'Behind the scenes 👻 #ghoststudio',
        platforms: ['youtube', 'instagram'],
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        engagement: { likes: 312, comments: 45, shares: 22 }
      }
    ];
    setPublishedPosts(mockPosts);
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileData = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image') ? 'image' : 'video'
    }));
    setMediaFiles([...mediaFiles, ...fileData]);
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateAISuggestions = async () => {
    setUseAI(true);
    // Simular generación de sugerencias con IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestions = [
      '🎵 Dropping new vibes this week! Stay tuned for something special 🔥 #NewMusic #ComingSoon',
      '🎛️ Behind the scenes in the studio... Magic is happening ✨ #StudioLife #MusicProduction',
      '👻 Ghost mode activated. New track in the works 🎧 #Producer #ElectronicMusic',
      '🌟 Creating soundscapes for the soul... What do you want to hear next? 💭 #MusicCreator'
    ];
    
    setAiSuggestions(suggestions);
  };

  const selectSuggestion = (suggestion) => {
    setPostContent(suggestion);
    setAiSuggestions([]);
  };

  const handlePublish = async () => {
    if (!postContent || selectedPlatforms.length === 0) {
      alert('Por favor escribe contenido y selecciona al menos una plataforma');
      return;
    }

    setIsPublishing(true);

    try {
      for (const platform of selectedPlatforms) {
        await nopService.publishContent(
          postContent,
          platform,
          mediaFiles.length > 0 ? mediaFiles[0].file : null,
          !!scheduledTime
        );
      }

      alert(`✅ Publicado exitosamente en: ${selectedPlatforms.join(', ')}`);
      
      // Limpiar formulario
      setPostContent('');
      setSelectedPlatforms([]);
      setMediaFiles([]);
      setScheduledTime('');
      
      // Recargar posts
      loadPublishedPosts();
    } catch (error) {
      console.error('Error publishing:', error);
      alert('Error al publicar. Usando modo demo.');
    } finally {
      setIsPublishing(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Hace unos minutos';
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="nova-post-pilot">
      <div className="nop-header">
        <h1>🚀 Nova Post Pilot</h1>
        <p className="nop-subtitle">Social Media Automation & Analytics</p>
      </div>

      {/* Tabs de navegación */}
      <div className="nop-tabs">
        <button
          className={`tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveTab('compose')}
        >
          ✍️ Compose
        </button>
        <button
          className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      <div className="nop-container">
        {/* TAB: Compose */}
        {activeTab === 'compose' && (
          <div className="compose-section">
            <div className="compose-main">
              {/* Editor de contenido */}
              <div className="content-editor">
                <div className="editor-header">
                  <h2>✍️ Crear Publicación</h2>
                  <button
                    className="ai-btn"
                    onClick={generateAISuggestions}
                    disabled={aiSuggestions.length > 0}
                  >
                    <span>🤖</span>
                    <span>Sugerencias IA</span>
                  </button>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="ai-suggestions">
                    <h3>💡 Sugerencias generadas por IA:</h3>
                    {aiSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="suggestion-card"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        <p>{suggestion}</p>
                        <button>Usar</button>
                      </div>
                    ))}
                    <button
                      className="close-suggestions"
                      onClick={() => setAiSuggestions([])}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <textarea
                  className="post-textarea"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="¿Qué quieres compartir?"
                  rows={8}
                />

                <div className="text-stats">
                  <span>{postContent.length} caracteres</span>
                  <span className={postContent.length > 280 ? 'warning' : ''}>
                    {postContent.length > 280 && '⚠️ Demasiado largo para Twitter'}
                  </span>
                </div>

                {/* Media preview */}
                {mediaFiles.length > 0 && (
                  <div className="media-preview">
                    {mediaFiles.map((media, idx) => (
                      <div key={idx} className="media-item">
                        {media.type === 'image' ? (
                          <img src={media.preview} alt="Preview" />
                        ) : (
                          <video src={media.preview} />
                        )}
                        <button
                          className="remove-media"
                          onClick={() => removeMedia(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Media upload */}
                <div className="media-upload">
                  <label className="upload-label">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaUpload}
                      style={{ display: 'none' }}
                    />
                    <span className="icon">📎</span>
                    <span>Adjuntar media</span>
                  </label>
                </div>
              </div>

              {/* Plataformas */}
              <div className="platforms-section">
                <h2>🌐 Plataformas</h2>
                <div className="platforms-grid">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      className={`platform-btn ${
                        selectedPlatforms.includes(platform.id) ? 'selected' : ''
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                      style={{
                        '--platform-color': platform.color
                      }}
                    >
                      <span className="platform-icon">{platform.icon}</span>
                      <span className="platform-name">{platform.name}</span>
                      {selectedPlatforms.includes(platform.id) && (
                        <span className="check-icon">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Programación */}
              <div className="schedule-section">
                <h2>⏰ Programar (Opcional)</h2>
                <input
                  type="datetime-local"
                  className="datetime-input"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
                {scheduledTime && (
                  <p className="schedule-info">
                    📅 Se publicará el {new Date(scheduledTime).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Botón de publicar */}
              <button
                className="publish-btn"
                onClick={handlePublish}
                disabled={isPublishing || !postContent || selectedPlatforms.length === 0}
              >
                {isPublishing ? (
                  <>
                    <span className="spinner"></span>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>{scheduledTime ? 'Programar' : 'Publicar Ahora'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Panel lateral - Preview */}
            <div className="preview-panel">
              <h2>👁️ Preview</h2>
              {selectedPlatforms.length > 0 ? (
                <div className="previews">
                  {selectedPlatforms.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId);
                    return (
                      <div key={platformId} className="preview-card">
                        <div className="preview-header">
                          <span>{platform.icon}</span>
                          <span>{platform.name}</span>
                        </div>
                        <div className="preview-content">
                          <p>{postContent || 'Tu contenido aparecerá aquí...'}</p>
                          {mediaFiles.length > 0 && (
                            <div className="preview-media">
                              <img src={mediaFiles[0].preview} alt="Preview" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-preview">
                  <div className="placeholder-icon">📱</div>
                  <p>Selecciona plataformas para ver preview</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Analytics */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>📊 Analytics Dashboard</h2>
            {analytics ? (
              <div className="analytics-grid">
                <div className="metric-card">
                  <div className="metric-icon">👥</div>
                  <div className="metric-info">
                    <h3>Followers</h3>
                    <p className="metric-value">{analytics.followers.current.toLocaleString()}</p>
                    <p className="metric-change positive">+{analytics.followers.growth}%</p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">❤️</div>
                  <div className="metric-info">
                    <h3>Engagement</h3>
                    <p className="metric-value">{analytics.engagement.rate}%</p>
                    <p className="metric-change positive">+8.2%</p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">📈</div>
                  <div className="metric-info">
                    <h3>Reach</h3>
                    <p className="metric-value">{analytics.reach.total.toLocaleString()}</p>
                    <p className="metric-change positive">+12.5%</p>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">🎯</div>
                  <div className="metric-info">
                    <h3>Impressions</h3>
                    <p className="metric-value">{(analytics.reach.total * 1.5).toLocaleString()}</p>
                    <p className="metric-change positive">+15.3%</p>
                  </div>
                </div>

                <div className="chart-card full-width">
                  <h3>📊 Engagement por Plataforma</h3>
                  <div className="platform-stats">
                    {platforms.map(platform => (
                      <div key={platform.id} className="platform-stat">
                        <span className="stat-icon">{platform.icon}</span>
                        <span className="stat-name">{platform.name}</span>
                        <div className="stat-bar">
                          <div
                            className="stat-fill"
                            style={{
                              width: `${Math.random() * 100}%`,
                              background: platform.color
                            }}
                          />
                        </div>
                        <span className="stat-value">{Math.floor(Math.random() * 1000)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-card full-width">
                  <h3>📅 Mejores Horarios para Publicar</h3>
                  <div className="best-times">
                    <div className="time-slot">
                      <span className="time-icon">🌅</span>
                      <div>
                        <h4>Mañana</h4>
                        <p>9:00 AM - 11:00 AM</p>
                      </div>
                      <span className="time-engagement">High engagement</span>
                    </div>
                    <div className="time-slot">
                      <span className="time-icon">🌆</span>
                      <div>
                        <h4>Tarde</h4>
                        <p>2:00 PM - 4:00 PM</p>
                      </div>
                      <span className="time-engagement">Medium engagement</span>
                    </div>
                    <div className="time-slot">
                      <span className="time-icon">🌃</span>
                      <div>
                        <h4>Noche</h4>
                        <p>8:00 PM - 10:00 PM</p>
                      </div>
                      <span className="time-engagement">High engagement</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="loading">Cargando analytics...</div>
            )}
          </div>
        )}

        {/* TAB: History */}
        {activeTab === 'history' && (
          <div className="history-section">
            <h2>📜 Historial de Publicaciones</h2>
            <div className="posts-list">
              {publishedPosts.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-content">
                    <p>{post.content}</p>
                    <div className="post-platforms">
                      {post.platforms.map(platformId => {
                        const platform = platforms.find(p => p.id === platformId);
                        return (
                          <span key={platformId} className="post-platform">
                            {platform.icon}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="post-meta">
                    <span className="post-time">{formatTimeAgo(post.timestamp)}</span>
                    <div className="post-engagement">
                      <span>❤️ {post.engagement.likes}</span>
                      <span>💬 {post.engagement.comments}</span>
                      <span>🔄 {post.engagement.shares}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Schedule */}
        {activeTab === 'schedule' && (
          <div className="schedule-view-section">
            <h2>📅 Publicaciones Programadas</h2>
            <div className="no-scheduled">
              <div className="placeholder-icon">📅</div>
              <p>No hay publicaciones programadas</p>
              <button onClick={() => setActiveTab('compose')}>
                Crear publicación programada
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NovaPostPilot;
