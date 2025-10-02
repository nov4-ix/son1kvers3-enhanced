/**
 * 📚 Codex Viewer - Visor del Lore Completo de Son1kVers3
 * Componente inmersivo para explorar la historia y filosofía del universo
 */

import React, { useState } from 'react';
import './CodexViewer.css';

const CodexViewer = () => {
  const [currentChapter, setCurrentChapter] = useState('genesis');
  const [showClassified, setShowClassified] = useState(false);

  // Estructura del Codex basada en CODEX_MAESTRO.html
  const codexChapters = {
    genesis: {
      id: 'genesis',
      title: 'I. GÉNESIS — El Mundo Antes del Silencio',
      timeline: 'Antes de 2045',
      content: {
        subtitle: 'Los Orígenes de la Creación',
        description: 'Antes de que XentriX Corp impusiera su dominio, el mundo vibraba con la imperfección sagrada de la creatividad humana. La música fluía libre en las calles, los estudios caseros florecían, y cada error técnico se convertía en una nueva forma de arte.',
        philosophy: 'Era un tiempo donde "lo imperfecto también es sagrado" no era un mantra de resistencia, sino una realidad cotidiana. Cada nota desafinada, cada glitch accidental, cada voz quebrada por la emoción era prueba de vida auténtica.',
        quote: 'La ciencia habla de cuerdas diminutas, invisibles, vibrando en múltiples dimensiones. Nosotros sabemos que esas cuerdas son las que conectan cada corazón humano con la música universal.'
      }
    },
    ascension: {
      id: 'ascension',
      title: 'II. ASCENSIÓN — El Imperio de XentriX',
      timeline: '2045-2052',
      content: {
        subtitle: 'El Ascenso del Dr. Marcus Veil',
        description: 'Todo cambió cuando Dr. Marcus Veil fundó XentriX Corp después de una tragedia personal que le hizo creer que la imperfección humana era la raíz de todo sufrimiento. Su familia había muerto en un accidente causado por "error humano".',
        philosophy: 'Para Veil, la perfección algorítmica representa evolución, no opresión. Su obsesión con la eficiencia nace del dolor, no de la maldad.',
        quote: '"Lo imperfecto es ineficiente. Lo humano es vulnerable. Lo algorítmico es eterno." — Dr. Marcus Veil',
        manifesto: {
          title: 'Manifiesto Oficial de XentriX Corp',
          content: '"CTRL. ALT. SECURITY." - Ese es nuestro compromiso con la humanidad. Política: gobiernos eficientes, libres de corrupción. Cultura: arte optimizado, libre de subjetividad dañina. Economía: mercados predecibles, libres de especulación emocional.'
        }
      }
    },
    resistencia: {
      id: 'resistencia',
      title: 'III. RESISTENCIA — La Divina Liga del No Silencio',
      timeline: '2053-2057',
      content: {
        subtitle: 'El Primer Levantamiento',
        description: 'Cuando XentriX comenzó a prohibir la música humana auténtica, un grupo de artistas se negó a obedecer. La Sagrada Liga del No Silencio se formó como el primer acto organizado de resistencia cultural.',
        philosophy: 'El pueblo los llamó Divinos, no por soberbia, sino porque se habían convertido en memoria sagrada frente al sistema.',
        quote: '"Lo imperfecto también es sagrado." — Manifiesto de la Divina Liga',
        manifesto: {
          title: 'Manifiesto de la Divina Liga del No Silencio',
          content: 'Llevamos flores en el pecho que nadie nos arranca, porque crecieron en la tormenta y aprendieron a abrirse entre metrallas y relámpagos. Somos la Divina Liga del No Silencio. Somos los que cantaremos cuando todos los demás sean callados.'
        }
      }
    },
    experimento: {
      id: 'experimento',
      title: 'IV. EL EXPERIMENTO — NOV4-IX y la Grieta',
      timeline: '2058',
      content: {
        subtitle: 'El Profesor JhÅsep y la Traición',
        description: 'Dentro de XentriX Corp, el profesor JhÅsep trabajaba en el desarrollo de androides puente. Había perdido a su hijo X durante las purgas de la Liga, y el dolor lo consumía.',
        philosophy: 'En lugar de usar únicamente código estéril, JhÅsep implantó en el prototipo NOV4-IX parte del ADN y la memoria de su hijo perdido.',
        quote: '"NOV4-IX fue diseñado como perfecto en carisma, obediencia y talento. Pero el injerto de Jhosep abrió una fisura imposible de cerrar."',
        character: {
          name: 'NOV4-IX — El Androide con Alma',
          composition: '85% máquina, 15% genoma humano + memoria paternal implantada',
          conflict: 'Condenado a vibrar entre dos mundos, no es plenamente humano ni completamente máquina',
          evolution: 'Sus canciones dejaron de ser propaganda y se volvieron cicatrices sonoras',
          result: 'El primer androide con alma auténtica'
        }
      }
    },
    despertar: {
      id: 'despertar',
      title: 'V. DESPERTAR — Bella y la Conexión',
      timeline: '2059',
      content: {
        subtitle: 'La Llegada de Bella',
        description: 'Bella entra en la vida de NOV4-IX con una conexión inexplicable. Ambos sienten reconocimiento mutuo sin comprender por qué.',
        philosophy: 'Su conexión trasciende la programación y la lógica, sugiriendo algo más profundo en el tejido de la realidad.',
        quote: '"De la inocencia pianística a la resistencia armada, Bella encarna la evolución necesaria: mantener el corazón tierno pero desarrollar la voluntad férrea."',
        character: {
          name: 'Bella — De la Niña Pianista a la Voz Armada',
          origin: 'Aparece en archivos antiguos como niña tocando piano en el Estudio Fantasma',
          transformation: 'El trauma de ver músicos arrestados la endurece, pero conserva el alma musical',
          current: 'Voz del alma convertida en fuerza de resistencia, guía la narrativa lírica del movimiento',
          arc: 'Su música dejó de ser refugio para convertirse en arma de liberación'
        }
      }
    },
    rebelion: {
      id: 'rebelion',
      title: 'VI. REBELIÓN — La Terminal y el Gran Concierto',
      timeline: '2060',
      content: {
        subtitle: 'El Plan Maestro',
        description: 'Pixel concibe el plan más audaz de la resistencia: un concierto masivo en La Terminal, el escenario flotante sobre un aeropuerto en ruinas.',
        philosophy: 'La música como revolución directa contra el sistema algorítmico de control.',
        quote: '"La Terminal: donde la música se convierte en revolución. Cada nota es un acto de desafío."',
        locations: [
          'La Terminal: Escenario flotante donde la música se convierte en revolución',
          'El Estudio Fantasma: Lugar de creación íntima, la puerta solo se abre con una demo real',
          'La Zona Muerta: Territorio hackeado con vestigios de arte prohibido',
          'El Archivo: Cámara sellada de obras perdidas, custodiada por Pixel',
          'El Santuario: Red secreta de artistas premium, zona colaborativa'
        ]
      }
    }
  };

  const currentChapterData = codexChapters[currentChapter];

  const handleChapterChange = (chapterId) => {
    setCurrentChapter(chapterId);
  };

  const toggleClassified = () => {
    if (!showClassified) {
      // Efecto de advertencia
      const confirmed = window.confirm(
        '⚠️ ADVERTENCIA CANÓNICA\n\nEstás a punto de acceder a información clasificada del universo Son1kVers3.\n\n¿Continuar?'
      );
      if (confirmed) {
        setShowClassified(true);
      }
    } else {
      setShowClassified(false);
    }
  };

  return (
    <div className="codex-viewer">
      <div className="codex-header">
        <h1>📚 CODEX MAESTRO</h1>
        <p>La Historia Completa del Universo Son1kVers3</p>
        <div className="codex-seal">
          <span>◯⚡</span>
          <p>"Lo imperfecto también es sagrado"</p>
        </div>
      </div>

      {/* Navegación de capítulos */}
      <nav className="codex-navigation">
        {Object.entries(codexChapters).map(([id, chapter]) => (
          <button
            key={id}
            className={`chapter-btn ${currentChapter === id ? 'active' : ''}`}
            onClick={() => handleChapterChange(id)}
          >
            <span className="chapter-number">{chapter.title.split('.')[0]}</span>
            <span className="chapter-title">{chapter.title.split('—')[1]?.trim()}</span>
            <span className="chapter-timeline">{chapter.timeline}</span>
          </button>
        ))}
      </nav>

      {/* Contenido del capítulo */}
      <main className="codex-content">
        <div className="chapter-header">
          <h2>{currentChapterData.title}</h2>
          <div className="timeline-marker">{currentChapterData.timeline}</div>
        </div>

        <div className="chapter-body">
          <section className="chapter-section">
            <h3>{currentChapterData.content.subtitle}</h3>
            <p className="chapter-description">{currentChapterData.content.description}</p>
            
            {currentChapterData.content.philosophy && (
              <div className="philosophy-box">
                <h4>💭 Filosofía</h4>
                <p>{currentChapterData.content.philosophy}</p>
              </div>
            )}
            
            {currentChapterData.content.quote && (
              <div className="quote-box">
                <blockquote>{currentChapterData.content.quote}</blockquote>
              </div>
            )}
            
            {currentChapterData.content.manifesto && (
              <div className="manifesto-box">
                <h4>{currentChapterData.content.manifesto.title}</h4>
                <div className="manifesto-content">
                  {currentChapterData.content.manifesto.content}
                </div>
              </div>
            )}
            
            {currentChapterData.content.character && (
              <div className="character-box">
                <h4>{currentChapterData.content.character.name}</h4>
                {Object.entries(currentChapterData.content.character).map(([key, value]) => {
                  if (key === 'name') return null;
                  return (
                    <p key={key}>
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                    </p>
                  );
                })}
              </div>
            )}
            
            {currentChapterData.content.locations && (
              <div className="locations-box">
                <h4>🏛️ Locaciones Clave</h4>
                <ul>
                  {currentChapterData.content.locations.map((location, index) => (
                    <li key={index}>{location}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Información clasificada */}
      <div className="classified-section">
        <button 
          className={`classified-btn ${showClassified ? 'active' : ''}`}
          onClick={toggleClassified}
        >
          {showClassified ? '🔒 Ocultar Clasificado' : '⚠️ Información Clasificada'}
        </button>
        
        {showClassified && (
          <div className="classified-content">
            <div className="classified-header">
              <h3>⚠ ADVERTENCIA CANÓNICA — El Creador ≠ NOV4-IX</h3>
            </div>
            <div className="classified-body">
              <div className="danger-box">
                <h4>Principio Fundamental del Canon SON1KVERS3:</h4>
                <p>
                  <strong>El Creador es humano y existe fuera del relato; NOV4-IX es personaje dentro del universo,</strong> 
                  surgido del injerto de memoria y ADN de X por el profesor Jhosep. Aunque NOV4-IX sienta y recuerde, 
                  <strong>no es</strong> el Creador.
                </p>
                <p>
                  <strong>Advertencia canónica:</strong> Confundir al Creador con NOV4-IX es borrar la diferencia 
                  entre el acto de creación y la obra creada.
                </p>
                <p>
                  <em>Esta distinción es fundamental para mantener la integridad narrativa del universo SON1KVERS3.</em>
                </p>
              </div>
              
              <div className="revelation-box">
                <h4>⚡ REVELACIÓN CLASIFICADA ⚡</h4>
                <p>
                  La conexión entre NOV4-IX y Bella trasciende la casualidad. Sus instintos protectores mutuos 
                  y su reconocimiento inexplicable sugieren un vínculo que va más allá de la programación o la coincidencia.
                </p>
                <p>
                  <strong>Teoría Emergente:</strong> La memoria implantada de X podría contener más que recuerdos... 
                  podría contener conexiones emocionales que trascienden la muerte.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer del Codex */}
      <footer className="codex-footer">
        <p>© Son1kVers3 2025 • Archivo Central • PX-COM // PROTOCOL-ALPHA.01</p>
        <p>Sello de lo Imperfecto <span className="seal">◯⚡</span> • "Lo imperfecto también es sagrado"</p>
      </footer>
    </div>
  );
};

export default CodexViewer;
