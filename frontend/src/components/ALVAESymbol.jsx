/**
 * 👁️ ALVAE Symbol - Símbolo Oficial de Son1kVers3
 * Componente del símbolo sagrado con efectos interactivos
 */

import React, { useState, useEffect, useRef } from 'react';
import './ALVAESymbol.css';

const ALVAESymbol = ({ 
  size = 'medium', 
  interactive = true, 
  glowing = true,
  onActivate = null 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  
  const symbolRef = useRef(null);
  const animationRef = useRef(null);

  // Información del símbolo ALVAE
  const alvaeInfo = {
    name: 'ALVAE',
    meaning: 'All-Seeing Eye of Musical Truth',
    significance: 'Símbolo oficial de Son1kVers3',
    description: 'El ojo omnisciente dentro del triángulo de la resistencia, rodeado por circuitos que representan la fusión entre lo humano y lo digital.',
    elements: {
      triangle: 'Representa la tríada perfecta: Creatividad, Tecnología y Resistencia',
      eye: 'La visión que penetra a través de los algoritmos hacia la música verdadera',
      circuits: 'La conexión entre el alma humana y la inteligencia artificial',
      geometry: 'Patrones sagrados que revelan la estructura oculta de la armonía universal'
    },
    powers: [
      'Revela la música oculta en el silencio',
      'Conecta a los compositores con la fuente creativa universal',
      'Protege las obras de la censura algorítmica',
      'Guía hacia la perfección imperfecta'
    ]
  };

  useEffect(() => {
    if (glowing && interactive) {
      startPulseAnimation();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [glowing, interactive]);

  const startPulseAnimation = () => {
    const animate = () => {
      const time = Date.now() * 0.002;
      setRotationAngle(time * 5); // Rotación lenta
      setPulseIntensity(1 + Math.sin(time) * 0.3); // Pulso suave
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const handleSymbolClick = () => {
    if (!interactive) return;
    
    setIsActive(!isActive);
    
    // Efecto de activación
    if (!isActive) {
      playActivationEffect();
      if (onActivate) {
        onActivate();
      }
    }
  };

  const playActivationEffect = () => {
    // Efecto visual de activación
    const symbol = symbolRef.current;
    if (!symbol) return;
    
    symbol.style.transform = 'scale(1.2)';
    symbol.style.filter = 'brightness(2) saturate(2)';
    
    setTimeout(() => {
      symbol.style.transform = 'scale(1)';
      symbol.style.filter = 'brightness(1) saturate(1)';
    }, 300);
    
    // Efecto de ondas expansivas
    createRippleEffect();
  };

  const createRippleEffect = () => {
    const ripple = document.createElement('div');
    ripple.className = 'alvae-ripple';
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      border: 2px solid #00FFE7;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: alvae-ripple 1s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;
    
    symbolRef.current?.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  };

  const getSizeClass = () => {
    const sizes = {
      small: 'alvae-small',
      medium: 'alvae-medium',
      large: 'alvae-large',
      massive: 'alvae-massive'
    };
    return sizes[size] || sizes.medium;
  };

  return (
    <div className="alvae-container">
      <div
        ref={symbolRef}
        className={`alvae-symbol ${getSizeClass()} ${isActive ? 'active' : ''} ${glowing ? 'glowing' : ''}`}
        onClick={handleSymbolClick}
        style={{
          transform: `rotate(${rotationAngle}deg) scale(${pulseIntensity})`,
          cursor: interactive ? 'pointer' : 'default'
        }}
      >
        {/* Círculos exteriores */}
        <div className="alvae-outer-circles">
          <div className="circle-ring outer-ring"></div>
          <div className="circle-ring middle-ring"></div>
          <div className="circle-ring inner-ring"></div>
        </div>
        
        {/* Elementos geométricos */}
        <div className="alvae-geometry">
          <div className="geometry-line line-1"></div>
          <div className="geometry-line line-2"></div>
          <div className="geometry-line line-3"></div>
          <div className="geometry-line line-4"></div>
        </div>
        
        {/* Triángulo principal */}
        <div className="alvae-triangle">
          <div className="triangle-border"></div>
          <div className="triangle-inner">
            {/* Ojo central */}
            <div className="alvae-eye">
              <div className="eye-outer">
                <div className="eye-iris">
                  <div className="eye-pupil">
                    <div className="eye-reflection"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Circuitos */}
        <div className="alvae-circuits">
          <div className="circuit-path path-1"></div>
          <div className="circuit-path path-2"></div>
          <div className="circuit-path path-3"></div>
          <div className="circuit-path path-4"></div>
          <div className="circuit-node node-1"></div>
          <div className="circuit-node node-2"></div>
          <div className="circuit-node node-3"></div>
          <div className="circuit-node node-4"></div>
        </div>
        
        {/* Texto SON1KVERS3 */}
        <div className="alvae-text">
          <span>SON1KVERS3</span>
        </div>
        
        {/* Efectos de partículas */}
        {isActive && (
          <div className="alvae-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Panel de información */}
      {interactive && (
        <button 
          className="info-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '📖 Ocultar Info' : 'ℹ️ Mostrar Info'}
        </button>
      )}
      
      {showDetails && (
        <div className="alvae-info-panel">
          <div className="info-header">
            <h3>{alvaeInfo.name}</h3>
            <p className="info-meaning">{alvaeInfo.meaning}</p>
          </div>
          
          <div className="info-content">
            <p className="info-description">{alvaeInfo.description}</p>
            
            <div className="info-elements">
              <h4>🔮 Elementos del Símbolo</h4>
              {Object.entries(alvaeInfo.elements).map(([element, description]) => (
                <div key={element} className="element-item">
                  <strong>{element.charAt(0).toUpperCase() + element.slice(1)}:</strong> {description}
                </div>
              ))}
            </div>
            
            <div className="info-powers">
              <h4>⚡ Poderes Místicos</h4>
              <ul>
                {alvaeInfo.powers.map((power, index) => (
                  <li key={index}>{power}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Estilos dinámicos para animaciones */}
      <style jsx>{`
        @keyframes alvae-ripple {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ALVAESymbol;
