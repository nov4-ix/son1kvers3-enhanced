/**
 * 🎮 Nexus Interface - Interfaz Inmersiva Cyberpunk
 * Componente principal de la interfaz Nexus con efectos Matrix y cyberpunk
 */

import React, { useState, useEffect, useRef } from 'react';
import './NexusInterface.css';
import NexusLocations from './NexusLocations';
import CyberpunkTerminal from './CyberpunkTerminal';
import LoreGallery from './LoreGallery';
import ALVAESymbol from './ALVAESymbol';
import GhostStudio from './GhostStudio';
import TheCreator from './TheCreator';
import CodexViewer from './CodexViewer';
import CommunityHub from './CommunityHub';

const NexusInterface = () => {
    const [nexusState, setNexusState] = useState('lobby'); // 'lobby', 'opened', 'immersed'
    const [selectedSection, setSelectedSection] = useState(null);
    const [circleExpanded, setCircleExpanded] = useState(false);
    const [showPetals, setShowPetals] = useState(false);
    const [glitchTexts, setGlitchTexts] = useState(['ALVAE', 'Resistencia', 'Son1kVers3']);
    const [immersiveLevel, setImmersiveLevel] = useState(1);
    const [userAvatar, setUserAvatar] = useState({
        symbols: [],
        colors: ['#00FFE7'],
        vibration: 'neutral'
    });
    const [showMap, setShowMap] = useState(false);
    const [showCodex, setShowCodex] = useState(false);
    
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (matrixEffect) {
            initMatrixEffect();
        }
        
        if (cyberpunkMode) {
            initCyberpunkEffects();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [matrixEffect, cyberpunkMode]);

    const initMatrixEffect = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");

        const fontSize = 10;
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const animate = () => {
            draw();
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    const initCyberpunkEffects = () => {
        // Efectos de partículas cyberpunk
        const particles = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        const animateParticles = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
                ctx.fill();
            });

            animationRef.current = requestAnimationFrame(animateParticles);
        };

        animateParticles();
    };

    const activateNexus = () => {
        setIsActive(true);
        setImmersiveLevel(prev => Math.min(prev + 1, 5));
        
        // Efectos de activación
        playActivationSound();
        showActivationEffect();
        
        // Easter egg: Konami Code
        checkKonamiCode();
    };

    const playActivationSound = () => {
        if (audioContextRef.current) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('Audio context not available:', error);
        }
    };

    const showActivationEffect = () => {
        // Efecto visual de activación
        const effect = document.createElement('div');
        effect.className = 'nexus-activation-effect';
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            border: 2px solid #00ff00;
            border-radius: 50%;
            animation: nexus-pulse 1s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 1000);
    };

    const checkKonamiCode = () => {
        // Implementar detección del código Konami
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        let userInput = [];
        
        const handleKeyDown = (e) => {
            userInput.push(e.keyCode);
            if (userInput.length > konamiCode.length) {
                userInput.shift();
            }
            
            if (userInput.join(',') === konamiCode.join(',')) {
                activateEasterEgg('konami');
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
    };

    const activateEasterEgg = (type) => {
        const easterEggs = {
            konami: {
                message: '🎮 KONAMI CODE ACTIVATED! Nexus Mode: ULTRA',
                effect: 'ultra-cyberpunk',
                duration: 10000
            },
            matrix: {
                message: '🔮 Matrix Mode: ACTIVATED',
                effect: 'matrix-rain',
                duration: 5000
            },
            cyberpunk: {
                message: '⚡ Cyberpunk Mode: MAXIMUM OVERDRIVE',
                effect: 'neon-glow',
                duration: 8000
            },
            alvae: {
                message: '👁️ ALVAE SYMBOL ACTIVATED - All-Seeing Eye Engaged',
                effect: 'alvae-vision',
                duration: 12000
            }
        };
        
        const easterEgg = easterEggs[type];
        if (easterEgg) {
            setEasterEggs(prev => [...prev, easterEgg]);
            
            // Aplicar efecto visual
            applyEasterEggEffect(easterEgg.effect);
            
            // Remover después de la duración
            setTimeout(() => {
                setEasterEggs(prev => prev.filter(egg => egg !== easterEgg));
            }, easterEgg.duration);
        }
    };

    const applyEasterEggEffect = (effectType) => {
        const body = document.body;
        
        switch (effectType) {
            case 'ultra-cyberpunk':
                body.style.filter = 'hue-rotate(180deg) saturate(2)';
                body.style.animation = 'ultra-cyberpunk-pulse 0.5s infinite alternate';
                break;
            case 'matrix-rain':
                body.style.filter = 'sepia(1) hue-rotate(90deg)';
                break;
            case 'neon-glow':
                body.style.filter = 'brightness(1.2) contrast(1.1)';
                body.style.boxShadow = 'inset 0 0 100px #00ffff';
                break;
            case 'alvae-vision':
                body.style.filter = 'hue-rotate(45deg) saturate(1.5) brightness(1.1)';
                body.style.boxShadow = 'inset 0 0 150px rgba(0, 255, 231, 0.3)';
                break;
        }
    };

    const switchMode = (mode) => {
        setCurrentMode(mode);
        
        // Efectos de transición
        const transition = document.createElement('div');
        transition.className = 'nexus-mode-transition';
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #000, #00ff00, #000);
            opacity: 0;
            animation: nexus-transition 0.5s ease-in-out;
            pointer-events: none;
            z-index: 999;
        `;
        
        document.body.appendChild(transition);
        
        setTimeout(() => {
            document.body.removeChild(transition);
        }, 500);
    };

    const toggleMatrixEffect = () => {
        setMatrixEffect(!matrixEffect);
    };

    const toggleCyberpunkMode = () => {
        setCyberpunkMode(!cyberpunkMode);
    };

    const increaseImmersiveLevel = () => {
        if (immersiveLevel < 5) {
            setImmersiveLevel(prev => prev + 1);
            activateEasterEgg('cyberpunk');
        }
    };

    // Secciones del Nexus (pétalos del círculo)
    const nexusSections = [
        {
            id: 'ghost_studio',
            name: 'GHOST STUDIO',
            icon: '👻',
            color: '#00FFE7',
            description: 'Herramienta central de análisis y transformación',
            position: { angle: 0, radius: 150 }
        },
        {
            id: 'clone_station', 
            name: 'CLONE STATION',
            icon: '🎤',
            color: '#ff6b6b',
            description: 'Clonación de voz con so-VITS y Bark',
            position: { angle: 72, radius: 150 }
        },
        {
            id: 'codex',
            name: 'CODEX',
            icon: '📚',
            color: '#8b5cf6',
            description: 'Historia del universo Son1kVers3',
            position: { angle: 144, radius: 150 }
        },
        {
            id: 'la_liga',
            name: 'LA LIGA',
            icon: '⚔️',
            color: '#FFC107',
            description: 'Comunidad de la Divina Liga del No Silencio',
            position: { angle: 216, radius: 150 }
        },
        {
            id: 'the_creator',
            name: 'THE CREATOR',
            icon: '🎵',
            color: '#10b981',
            description: 'Generación musical text-audio',
            position: { angle: 288, radius: 150 }
        }
    ];

    // Manejar click en el círculo central
    const handleCircleClick = () => {
        if (nexusState === 'lobby') {
            setNexusState('opened');
            setCircleExpanded(true);
            setTimeout(() => {
                setShowPetals(true);
                playActivationSound();
            }, 500);
        }
    };

    // Manejar selección de sección
    const handleSectionSelect = (section) => {
        setSelectedSection(section);
        setNexusState('immersed');
        
        // Actualizar avatar del usuario
        updateUserAvatar(section);
        
        // Efecto de transición
        createTransitionEffect(section.color);
    };

    // Actualizar avatar del usuario basado en interacciones
    const updateUserAvatar = (section) => {
        setUserAvatar(prev => ({
            symbols: [...new Set([...prev.symbols, section.icon])],
            colors: [...new Set([...prev.colors, section.color])],
            vibration: section.id.includes('ghost') ? 'haunted' : 
                      section.id.includes('clone') ? 'vocal' :
                      section.id.includes('codex') ? 'wise' :
                      section.id.includes('liga') ? 'warrior' : 'creative'
        }));
    };

    // Crear efecto de transición
    const createTransitionEffect = (color) => {
        const transition = document.createElement('div');
        transition.className = 'nexus-section-transition';
        transition.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: ${color};
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: nexus-expand 1s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(transition);
        
        setTimeout(() => {
            document.body.removeChild(transition);
        }, 1000);
    };

    // Renderizar lobby (pantalla inicial)
    const renderLobby = () => (
        <div className="nexus-lobby">
            {/* Textos glitch flotantes */}
            <div className="glitch-texts">
                {glitchTexts.map((text, index) => (
                    <div
                        key={text}
                        className="glitch-text"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${index * 0.5}s`
                        }}
                    >
                        {text}
                    </div>
                ))}
            </div>

            {/* Círculo central luminoso */}
            <div className="nexus-central-circle" onClick={handleCircleClick}>
                <div className={`circle-core ${circleExpanded ? 'expanded' : ''}`}>
                    <div className="circle-inner">
                        <div className="circle-pulse"></div>
                        <div className="circle-text">NEXUS</div>
                    </div>
                </div>
            </div>

            {/* Instrucción para el usuario */}
            {!circleExpanded && (
                <div className="nexus-instruction">
                    <p>Toca el círculo para abrir el portal</p>
                    <div className="instruction-arrow">↑</div>
                </div>
            )}
        </div>
    );

    // Renderizar pétalos (secciones)
    const renderPetals = () => (
        <div className="nexus-petals">
            {nexusSections.map((section, index) => {
                const angle = section.position.angle;
                const radius = section.position.radius;
                const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                
                return (
                    <div
                        key={section.id}
                        className="nexus-petal"
                        style={{
                            transform: `translate(${x}px, ${y}px)`,
                            animationDelay: `${index * 0.1}s`,
                            borderColor: section.color
                        }}
                        onClick={() => handleSectionSelect(section)}
                    >
                        <div className="petal-icon" style={{ color: section.color }}>
                            {section.icon}
                        </div>
                        <div className="petal-name" style={{ color: section.color }}>
                            {section.name}
                        </div>
                        <div className="petal-description">
                            {section.description}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Renderizar mapa inmersivo
    const renderImmersiveMap = () => (
        <div className="immersive-map">
            <div className="map-header">
                <h2>🌌 Mapa del Universo Son1kVers3</h2>
                <button 
                    className="map-close"
                    onClick={() => setShowMap(false)}
                >
                    ✕
                </button>
            </div>
            
            <div className="map-galaxy">
                {/* Nodos de locaciones */}
                {[
                    { name: 'La Terminal', x: 20, y: 30, color: '#00FFE7' },
                    { name: 'Ghost Studio', x: 70, y: 20, color: '#ff6b6b' },
                    { name: 'El Archivo', x: 80, y: 70, color: '#8b5cf6' },
                    { name: 'Dead Zone', x: 30, y: 80, color: '#FFC107' },
                    { name: 'Estudio Fantasma', x: 50, y: 50, color: '#10b981' }
                ].map((location, index) => (
                    <div
                        key={location.name}
                        className="map-node"
                        style={{
                            left: `${location.x}%`,
                            top: `${location.y}%`,
                            borderColor: location.color,
                            animationDelay: `${index * 0.2}s`
                        }}
                        onClick={() => {
                            setShowMap(false);
                            // Navegar a la locación
                        }}
                    >
                        <div className="node-pulse" style={{ borderColor: location.color }}></div>
                        <div className="node-label" style={{ color: location.color }}>
                            {location.name}
                        </div>
                    </div>
                ))}
                
                {/* Conexiones entre nodos */}
                <svg className="map-connections">
                    <defs>
                        <linearGradient id="connectionGradient">
                            <stop offset="0%" stopColor="#00FFE7" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 20% 30% Q 50% 10% 70% 20%"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        fill="none"
                        className="connection-line"
                    />
                    <path
                        d="M 70% 20% Q 90% 50% 80% 70%"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        fill="none"
                        className="connection-line"
                    />
                    <path
                        d="M 80% 70% Q 50% 90% 30% 80%"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        fill="none"
                        className="connection-line"
                    />
                </svg>
            </div>
        </div>
    );

    // Renderizar avatar del usuario
    const renderUserAvatar = () => (
        <div className="user-avatar-totem">
            <div className="avatar-core" style={{ borderColor: userAvatar.colors[0] }}>
                <div className="avatar-symbols">
                    {userAvatar.symbols.slice(0, 3).map((symbol, index) => (
                        <span
                            key={index}
                            className="avatar-symbol"
                            style={{
                                color: userAvatar.colors[index % userAvatar.colors.length],
                                animationDelay: `${index * 0.3}s`
                            }}
                        >
                            {symbol}
                        </span>
                    ))}
                </div>
                <div className="avatar-vibration">
                    <div className={`vibration-wave ${userAvatar.vibration}`}></div>
                </div>
            </div>
            <div className="avatar-level">
                Nivel {immersiveLevel}
            </div>
        </div>
    );

    return (
        <div className={`nexus-interface-immersive ${nexusState} level-${immersiveLevel}`}>
            {/* Canvas para efectos de fondo */}
            <canvas
                ref={canvasRef}
                className="nexus-background-canvas"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1
                }}
            />

            {/* Partículas de fondo */}
            <div className="nexus-particles">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="nexus-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Header minimalista */}
            <header className="nexus-minimal-header">
                <div className="header-left">
                    <span className="nexus-title">NEXUS</span>
                    <span className="nexus-subtitle">Portal del Códex</span>
                </div>
                
                <div className="header-controls">
                    <button 
                        className="control-btn"
                        onClick={() => setShowMap(!showMap)}
                        title="Mapa Inmersivo"
                    >
                        🌌
                    </button>
                    <button 
                        className="control-btn"
                        onClick={() => setImmersiveLevel(prev => prev < 5 ? prev + 1 : 1)}
                        title="Nivel de Inmersión"
                    >
                        🚀
                    </button>
                </div>
            </header>

            {/* Contenido principal según estado */}
            <main className="nexus-main">
                {nexusState === 'lobby' && renderLobby()}
                
                {nexusState === 'opened' && (
                    <div className="nexus-opened">
                        <div className="nexus-central-area">
                            <div className="expanded-circle">
                                <ALVAESymbol 
                                    size="large"
                                    interactive={true}
                                    glowing={true}
                                />
                            </div>
                            {showPetals && renderPetals()}
                        </div>
                        
                        <div className="nexus-instructions">
                            <p>Selecciona una sección para sumergirte en el universo</p>
                        </div>
                    </div>
                )}
                
                {nexusState === 'immersed' && selectedSection && (
                    <div className="nexus-immersed">
                        <div className="immersed-header">
                            <button 
                                className="back-btn"
                                onClick={() => setNexusState('opened')}
                            >
                                ← Volver al Portal
                            </button>
                            <h2 style={{ color: selectedSection.color }}>
                                {selectedSection.icon} {selectedSection.name}
                            </h2>
                        </div>
                        
                        <div className="immersed-content">
                            {/* Renderizar herramienta según sección seleccionada */}
                            {selectedSection.id === 'ghost_studio' && (
                                <GhostStudio services={{}} />
                            )}
                            {selectedSection.id === 'clone_station' && (
                                <div className="clone-station-wrapper">
                                    <h3>🎤 Clone Station</h3>
                                    <p>Clonación de voz con so-VITS y Bark</p>
                                    {/* Aquí iría el componente de clonación */}
                                </div>
                            )}
                            {selectedSection.id === 'codex' && (
                                <CodexViewer />
                            )}
                            {selectedSection.id === 'la_liga' && (
                                <CommunityHub />
                            )}
                            {selectedSection.id === 'the_creator' && (
                                <TheCreator services={{}} />
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Avatar del usuario */}
            {nexusState !== 'lobby' && (
                <div className="user-avatar-container">
                    {renderUserAvatar()}
                </div>
            )}

            {/* Mapa inmersivo */}
            {showMap && renderImmersiveMap()}

            {/* Footer minimalista */}
            <footer className="nexus-minimal-footer">
                <span>Son1kVers3 • Nexus Portal • "Lo imperfecto también es sagrado"</span>
            </footer>

            {/* Estilos dinámicos para animaciones */}
            <style jsx>{`
                @keyframes nexus-expand {
                    0% {
                        width: 10px;
                        height: 10px;
                        opacity: 1;
                    }
                    100% {
                        width: 100vw;
                        height: 100vh;
                        opacity: 0.8;
                    }
                }
            `}</style>
        </div>
    );
};

export default NexusInterface;


