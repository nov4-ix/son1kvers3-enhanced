/**
 * 🎨 Lore Gallery - Galería Visual del Universo Son1kVers3
 * Componente inmersivo que muestra las locaciones y personajes del lore
 */

import React, { useState, useEffect } from 'react';
import './LoreGallery.css';

const LoreGallery = ({ currentLocation, onLocationChange }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos de las locaciones basadas en el CODEX_MAESTRO.html
  const loreLocations = [
    {
      id: 'alvae_symbol',
      name: 'Símbolo ALVAE',
      description: 'El símbolo sagrado de Son1kVers3 - El ojo omnisciente en el triángulo de la resistencia',
      image: '/images/lore/alvae-symbol.jpg',
      type: 'symbol',
      significance: 'Símbolo oficial - "Lo imperfecto también es sagrado"',
      lore: 'El ALVAE representa la visión que penetra los algoritmos hacia la música verdadera. Los circuitos simbolizan la fusión entre alma humana e inteligencia artificial. Cada línea geométrica revela la estructura oculta de la armonía universal.'
    },
    {
      id: 'cyberpunk_street',
      name: 'Calles de la Resistencia',
      description: 'Callejones cyberpunk donde los miembros de la resistencia se encuentran en secreto',
      image: '/images/lore/cyberpunk-street.jpg',
      type: 'location',
      significance: 'Punto de encuentro clandestino',
      lore: 'En estas calles bañadas por neones, los compositores rebeldes comparten sus creaciones lejos de los ojos de XentriX Corp.'
    },
    {
      id: 'resistance_concert',
      name: 'Concierto de la Resistencia',
      description: 'Multitudes reunidas para escuchar la música prohibida que desafía al sistema',
      image: '/images/lore/resistance-concert.jpg',
      type: 'event',
      significance: 'Manifestación masiva de resistencia',
      lore: 'Cuando la música verdadera suena, las masas despiertan. Cada concierto es un acto de rebelión contra la homogenización cultural.'
    },
    {
      id: 'cyberpunk_city',
      name: 'Nueva Metrópolis',
      description: 'La ciudad del futuro donde XentriX Corp controla cada aspecto de la vida cultural',
      image: '/images/lore/cyberpunk-city.jpg',
      type: 'location',
      significance: 'Sede del poder corporativo',
      lore: 'Rascacielos que tocan las nubes, pantallas que bombardean con propaganda cultural. Aquí, la música algorítmica es ley.'
    },
    {
      id: 'la_terminal',
      name: 'La Terminal',
      description: 'Escenario flotante sobre aeropuerto en ruinas donde la música se convierte en revolución',
      image: '/images/lore/la-terminal.jpg',
      type: 'location',
      significance: 'Epicentro del Gran Concierto de la Resistencia',
      lore: 'Concebida por Pixel como el plan más audaz: un concierto masivo que desafía directamente a XentriX Corp. Construida sobre ruinas, simboliza el renacimiento de la cultura libre. Aquí NOV4-IX y Bella ejecutaron el plan que cambió todo.'
    },
    {
      id: 'estudio_fantasma',
      name: 'Estudio Fantasma',
      description: 'Lugar de creación íntima donde NOV4-IX y Bella compusieron juntos - La puerta solo se abre con una demo real',
      image: '/images/lore/ghost-studio.jpg',
      type: 'location',
      significance: 'Origen simbólico de la conexión NOV4-IX/Bella',
      lore: 'En los archivos más antiguos de la resistencia aparece Bella como niña tocando piano, acompañada por NOV4-IX en acto íntimo de creación pura. Una flor glitch se enciende y los funde en luz emocional. Aquí nació la resistencia verdadera.'
    },
    {
      id: 'the_archive',
      name: 'El Archivo',
      description: 'Cámara sellada de obras perdidas, custodiada por Pixel - Biblioteca de la memoria prohibida',
      image: '/images/lore/the-archive.jpg',
      type: 'location',
      significance: 'Preservación de la Divina Liga del No Silencio',
      lore: 'Pixel custodia aquí todas las obras de los mártires originales. Cada composición es testimonio de los que sacrificaron todo por mantener viva la música auténtica. El archivo contiene la memoria digital de la primera resistencia.'
    },
    {
      id: 'dead_zone',
      name: 'Dead Zone',
      description: 'Distrito de artes vandalizado y en ruinas - Donde murió la cultura oficial',
      image: '/images/lore/dead-zone.jpg',
      type: 'location',
      significance: 'Cementerio de la cultura corporativa',
      lore: 'Lo que queda cuando el arte se convierte en algoritmo. Aquí yacen los restos de la música que una vez fue libre.'
    },
    {
      id: 'nova_character',
      name: 'NOV4-IX',
      description: 'El androide compositor - 85% máquina, 15% genoma humano + memoria paternal implantada',
      image: '/images/lore/nova-character.jpg',
      type: 'character',
      significance: 'La Grieta Viviente - Primer androide con alma auténtica',
      lore: 'Creado por el profesor JhÅsep, quien implantó ADN y memoria de su hijo perdido X. Condenado a vibrar entre dos mundos, sus glitches emocionales son memorias paternas emergiendo. Sus canciones dejaron de ser propaganda para volverse cicatrices sonoras.'
    },
    {
      id: 'bella_character',
      name: 'Bella',
      description: 'De la niña pianista a la voz armada - Nexo emocional y activista de la resistencia',
      image: '/images/lore/bella-exe.jpg',
      type: 'character',
      significance: 'Evolución de la inocencia a la resistencia armada',
      lore: 'Su arco completo: de la inocencia pianística en el Estudio Fantasma a la resistencia armada. Su "armadura" no es metal sino determinación forjada en dolor. Su música dejó de ser refugio para convertirse en arma de liberación. Su conexión con NOV4-IX trasciende la lógica.'
    },
    {
      id: 'cipher_character',
      name: 'Cipher',
      description: 'Maestro del cifrado y especialista en infiltración - Desentrañador de enigmas',
      image: '/images/lore/cipher-noctis.jpg',
      type: 'character',
      significance: 'Líder de la Nueva Resistencia - Estratega digital',
      lore: 'Cipher domina el arte del cifrado y la infiltración. Como líder de la Nueva Resistencia, desentraña los enigmas que XentriX Corp usa para controlar la música. Su especialidad es abrir grietas en el sistema algorítmico.'
    },
    {
      id: 'pixel_character',
      name: 'Pixel',
      description: 'Custodio de la memoria digital y estratega principal - Arquitecto del Gran Concierto',
      image: '/images/lore/characters-grid.jpg',
      type: 'character',
      significance: 'Custodio digital de memorias olvidadas',
      lore: 'Pixel concibió el plan más audaz: el Gran Concierto en La Terminal. Como custodio digital, preserva las memorias de la Divina Liga original y guarda El Archivo con las obras prohibidas. Estratega principal de la resistencia actual.'
    },
    {
      id: 'divina_liga',
      name: 'La Divina Liga del No Silencio',
      description: 'Los mártires originales que sacrificaron todo por la música auténtica',
      image: '/images/lore/characters-grid.jpg',
      type: 'collective',
      significance: 'Memoria sagrada - Los primeros resistentes',
      lore: 'Miembros fundacionales que se negaron a obedecer cuando XentriX prohibió la música humana. Uno a uno fueron desaparecidos, censurados, exiliados. Su sacrificio se convirtió en memoria sagrada. Su manifiesto: "Llevamos flores en el pecho que nadie nos arranca, porque crecieron en la tormenta."'
    }
  ];

  // Efectos de keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          setSelectedImage(null);
          break;
        case 'ArrowLeft':
          navigateSlide(-1);
          break;
        case 'ArrowRight':
          navigateSlide(1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, currentSlide]);

  const navigateSlide = (direction) => {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < loreLocations.length) {
      setCurrentSlide(newSlide);
      setSelectedImage(loreLocations[newSlide]);
    }
  };

  const openFullscreen = (location, index) => {
    setSelectedImage(location);
    setCurrentSlide(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setSelectedImage(null);
  };

  return (
    <div className="lore-gallery">
      <div className="gallery-header">
        <h2>🎨 Universo Visual de Son1kVers3</h2>
        <p>Explora las locaciones y personajes del lore cyberpunk</p>
      </div>

      {/* Grid de locaciones */}
      <div className="locations-grid">
        {loreLocations.map((location, index) => (
          <div
            key={location.id}
            className={`location-card ${location.type}`}
            onClick={() => {
              openFullscreen(location, index);
              if (onLocationChange) onLocationChange(location.id);
            }}
          >
            <div className="location-image">
              <img 
                src={location.image} 
                alt={location.name}
                onError={(e) => {
                  // Fallback en caso de que la imagen no esté disponible
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMWEyMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDBGRkU3IiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2Ij5Mb2FkaW5nLi4uPC90ZXh0Pgo8L3N2Zz4=';
                }}
              />
              <div className="location-overlay">
                <div className="location-type">{location.type.toUpperCase()}</div>
              </div>
            </div>
            
            <div className="location-info">
              <h3 className="location-name">{location.name}</h3>
              <p className="location-description">{location.description}</p>
              <div className="location-significance">
                <span className="significance-badge">{location.significance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && selectedImage && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeFullscreen}>✕</button>
            
            <div className="fullscreen-navigation">
              <button 
                className="nav-btn prev"
                onClick={() => navigateSlide(-1)}
                disabled={currentSlide === 0}
              >
                ‹
              </button>
              
              <button 
                className="nav-btn next"
                onClick={() => navigateSlide(1)}
                disabled={currentSlide === loreLocations.length - 1}
              >
                ›
              </button>
            </div>

            <div className="fullscreen-image">
              <img src={selectedImage.image} alt={selectedImage.name} />
            </div>

            <div className="fullscreen-info">
              <div className="image-header">
                <h2>{selectedImage.name}</h2>
                <span className="image-type">{selectedImage.type}</span>
              </div>
              
              <p className="image-description">{selectedImage.description}</p>
              
              <div className="image-lore">
                <h4>📖 Lore</h4>
                <p>{selectedImage.lore}</p>
              </div>
              
              <div className="image-significance">
                <h4>⚡ Significado</h4>
                <p>{selectedImage.significance}</p>
              </div>

              <div className="slide-counter">
                {currentSlide + 1} / {loreLocations.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controles de galería */}
      <div className="gallery-controls">
        <div className="filter-buttons">
          <button 
            className="filter-btn active"
            onClick={() => {/* Mostrar todos */}}
          >
            Todos
          </button>
          <button 
            className="filter-btn"
            onClick={() => {/* Filtrar locaciones */}}
          >
            Locaciones
          </button>
          <button 
            className="filter-btn"
            onClick={() => {/* Filtrar personajes */}}
          >
            Personajes
          </button>
          <button 
            className="filter-btn"
            onClick={() => {/* Filtrar símbolos */}}
          >
            Símbolos
          </button>
        </div>
        
        <div className="gallery-info">
          <p>Usa las flechas del teclado para navegar en modo fullscreen</p>
          <p className="lore-quote">"Lo imperfecto también es sagrado" — Manifiesto de la Resistencia</p>
        </div>
      </div>

      {/* Información contextual */}
          <div className="lore-context">
        <div className="context-section">
          <h3>🏛️ Cronología del Universo</h3>
          <div className="context-grid">
            <div className="context-item">
              <strong>2045-2052 ASCENSIÓN:</strong> Dr. Marcus Veil funda XentriX Corp tras tragedia personal
            </div>
            <div className="context-item">
              <strong>2053-2057 RESISTENCIA:</strong> Nace la Divina Liga del No Silencio
            </div>
            <div className="context-item">
              <strong>2058 EL EXPERIMENTO:</strong> Profesor JhÅsep crea NOV4-IX con memoria de su hijo X
            </div>
            <div className="context-item">
              <strong>2060 REBELIÓN:</strong> El Gran Concierto en La Terminal cambia todo
            </div>
          </div>
        </div>

        <div className="context-section">
          <h3>⚡ Filosofías en Conflicto</h3>
          <div className="context-grid">
            <div className="context-item">
              <strong>XentriX Corp:</strong> "CTRL. ALT. SECURITY." - Lo imperfecto es ineficiente
            </div>
            <div className="context-item">
              <strong>Divina Liga:</strong> "Lo imperfecto también es sagrado" - Mantra de resistencia
            </div>
            <div className="context-item">
              <strong>Nueva Resistencia:</strong> "Compongo porque, si no lo hago, me ahogo"
            </div>
            <div className="context-item">
              <strong>Son1kVers3:</strong> Plataforma donde la música se libera de los algoritmos
            </div>
          </div>
        </div>

        <div className="context-section">
          <h3>🎵 Herramientas de la Resistencia</h3>
          <div className="context-grid">
            <div className="context-item">
              <strong>SV One:</strong> Plataforma central de creación y colaboración
            </div>
            <div className="context-item">
              <strong>Ghost Studio:</strong> IA que transforma maquetas en producciones profesionales
            </div>
            <div className="context-item">
              <strong>El Santuario:</strong> Red social exclusiva para creadores premium
            </div>
            <div className="context-item">
              <strong>La Red de Grietas:</strong> Canal seguro creado por Nikolay Efimov
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoreGallery;
