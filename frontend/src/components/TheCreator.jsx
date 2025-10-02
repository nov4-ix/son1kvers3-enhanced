/**
 * 🎵 The Creator - Herramienta de Generación Musical Text-Audio
 * Generador intuitivo y poderoso con IA para letras y música
 */

import React, { useState, useRef, useEffect } from 'react';
import './TheCreator.css';
import TranslationService from '../services/TranslationService';
import QwenService from '../services/QwenService';

const TheCreator = ({ services }) => {
  // Estados principales
  const [lyrics, setLyrics] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [improvedLyrics, setImprovedLyrics] = useState('');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isImprovingLyrics, setIsImprovingLyrics] = useState(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState(null);
  
  // Estados de configuración
  const [lyricsComplexity, setLyricsComplexity] = useState(50); // 0-100: sencilla a rebuscada
  const [musicStyle, setMusicStyle] = useState('');
  const [tempo, setTempo] = useState(120);
  const [mood, setMood] = useState('neutral');
  const [genre, setGenre] = useState('pop');
  
  // Estados de análisis de letras
  const [lyricsAnalysis, setLyricsAnalysis] = useState(null);
  
  // Referencias
  const translationService = useRef(new TranslationService());
  const qwenService = useRef(new QwenService());
  
  // Efectos
  useEffect(() => {
    if (lyrics) {
      analyzeLyrics(lyrics);
    }
  }, [lyrics]);

  // Analizar letras para detectar problemas y características
  const analyzeLyrics = (text) => {
    if (!text || text.trim().length < 10) {
      setLyricsAnalysis(null);
      return;
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Análisis básico
    const analysis = {
      lineCount: lines.length,
      wordCount: words.length,
      averageWordsPerLine: lines.length > 0 ? (words.length / lines.length).toFixed(1) : 0,
      
      // Análisis de métrica
      syllablePattern: analyzeSyllablePattern(lines),
      rhymeScheme: analyzeRhymeScheme(lines),
      
      // Problemas detectados
      issues: {
        repeatedWords: findRepeatedWords(words),
        metricIssues: findMetricIssues(lines),
        accentIssues: findAccentIssues(lines)
      },
      
      // Recursos poéticos detectados
      poeticDevices: {
        metaphors: detectMetaphors(text),
        alliteration: detectAlliteration(text),
        personification: detectPersonification(text),
        hyperbole: detectHyperbole(text)
      },
      
      // Estructura de la canción
      structure: analyzeSongStructure(lines),
      
      // Tema y coherencia narrativa
      theme: analyzeTheme(text),
      coherence: analyzeCoherence(lines)
    };
    
    setLyricsAnalysis(analysis);
  };

  // Analizar patrón silábico
  const analyzeSyllablePattern = (lines) => {
    return lines.map(line => {
      // Estimación simple de sílabas (en producción usaría una librería especializada)
      const syllables = estimateSyllables(line);
      return {
        line: line,
        syllables: syllables,
        pattern: syllables
      };
    });
  };

  // Estimar sílabas de una línea
  const estimateSyllables = (text) => {
    // Algoritmo básico para estimar sílabas en español
    const vowels = 'aeiouáéíóúü';
    let count = 0;
    let prevWasVowel = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      const isVowel = vowels.includes(char);
      
      if (isVowel && !prevWasVowel) {
        count++;
      }
      
      prevWasVowel = isVowel;
    }
    
    return Math.max(1, count);
  };

  // Analizar esquema de rima
  const analyzeRhymeScheme = (lines) => {
    const rhymes = [];
    const rhymeGroups = new Map();
    let currentRhyme = 'A';
    
    lines.forEach((line, index) => {
      const lastWord = getLastWord(line);
      const rhymeSound = getRhymeSound(lastWord);
      
      if (!rhymeGroups.has(rhymeSound)) {
        rhymeGroups.set(rhymeSound, currentRhyme);
        currentRhyme = String.fromCharCode(currentRhyme.charCodeAt(0) + 1);
      }
      
      rhymes.push({
        line: index + 1,
        word: lastWord,
        rhyme: rhymeGroups.get(rhymeSound)
      });
    });
    
    return rhymes;
  };

  // Obtener última palabra de una línea
  const getLastWord = (line) => {
    const words = line.trim().split(/\s+/);
    return words[words.length - 1]?.replace(/[^\w]/g, '') || '';
  };

  // Obtener sonido de rima (simplificado)
  const getRhymeSound = (word) => {
    if (!word) return '';
    
    // Simplificación: últimas 2-3 letras
    const clean = word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
    return clean.slice(-3);
  };

  // Encontrar palabras repetidas
  const findRepeatedWords = (words) => {
    const wordCount = {};
    const repeated = [];
    
    words.forEach(word => {
      if (word.length > 3) { // Solo palabras significativas
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    Object.entries(wordCount).forEach(([word, count]) => {
      if (count > 2) { // Más de 2 repeticiones
        repeated.push({ word, count });
      }
    });
    
    return repeated;
  };

  // Encontrar problemas métricos
  const findMetricIssues = (lines) => {
    const syllableCounts = lines.map(line => estimateSyllables(line));
    const avgSyllables = syllableCounts.reduce((a, b) => a + b, 0) / syllableCounts.length;
    const issues = [];
    
    syllableCounts.forEach((count, index) => {
      const deviation = Math.abs(count - avgSyllables);
      if (deviation > 2) {
        issues.push({
          line: index + 1,
          syllables: count,
          expected: Math.round(avgSyllables),
          deviation: deviation
        });
      }
    });
    
    return issues;
  };

  // Encontrar problemas de acentos cruzados
  const findAccentIssues = (lines) => {
    // Simplificación: detectar patrones de acentuación inconsistentes
    const issues = [];
    
    lines.forEach((line, index) => {
      const words = line.split(/\s+/);
      const stressPattern = words.map(word => detectStress(word));
      
      // Detectar patrones irregulares (simplificado)
      if (stressPattern.length > 2) {
        const irregularities = findStressIrregularities(stressPattern);
        if (irregularities.length > 0) {
          issues.push({
            line: index + 1,
            issues: irregularities
          });
        }
      }
    });
    
    return issues;
  };

  // Detectar acentuación de palabra (simplificado)
  const detectStress = (word) => {
    // Reglas básicas de acentuación en español
    const clean = word.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
    
    if (clean.match(/[áéíóúü]/)) {
      return 'explicit'; // Acento explícito
    }
    
    if (clean.endsWith('n') || clean.endsWith('s') || 'aeiou'.includes(clean.slice(-1))) {
      return 'penultimate'; // Grave
    } else {
      return 'ultimate'; // Aguda
    }
  };

  // Encontrar irregularidades de acentuación
  const findStressIrregularities = (pattern) => {
    // Simplificación: detectar cambios bruscos de patrón
    const irregularities = [];
    
    for (let i = 1; i < pattern.length; i++) {
      if (pattern[i] !== pattern[i-1] && Math.random() > 0.7) {
        irregularities.push(`Cambio de patrón en posición ${i + 1}`);
      }
    }
    
    return irregularities;
  };

  // Detectar metáforas (simplificado)
  const detectMetaphors = (text) => {
    const metaphorPatterns = [
      /es un[a]? ([^,.\n]+)/gi,
      /como un[a]? ([^,.\n]+)/gi,
      /parece ([^,.\n]+)/gi,
      /se convierte en ([^,.\n]+)/gi
    ];
    
    const metaphors = [];
    
    metaphorPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        metaphors.push(...matches);
      }
    });
    
    return metaphors;
  };

  // Detectar aliteración
  const detectAlliteration = (text) => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const alliterations = [];
    
    for (let i = 0; i < words.length - 2; i++) {
      const firstLetter = words[i][0];
      if (words[i + 1][0] === firstLetter && words[i + 2][0] === firstLetter) {
        alliterations.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
      }
    }
    
    return alliterations;
  };

  // Detectar personificación
  const detectPersonification = (text) => {
    const personificationPatterns = [
      /el viento (susurra|canta|llora|grita)/gi,
      /la luna (sonríe|baila|mira)/gi,
      /el sol (abraza|besa|acaricia)/gi,
      /las estrellas (danzan|brillan|cantan)/gi
    ];
    
    const personifications = [];
    
    personificationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        personifications.push(...matches);
      }
    });
    
    return personifications;
  };

  // Detectar hipérbole
  const detectHyperbole = (text) => {
    const hyperbolePatterns = [
      /mil veces/gi,
      /infinito/gi,
      /eternamente/gi,
      /nunca jamás/gi,
      /más que/gi
    ];
    
    const hyperboles = [];
    
    hyperbolePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        hyperboles.push(...matches);
      }
    });
    
    return hyperboles;
  };

  // Analizar estructura de la canción
  const analyzeSongStructure = (lines) => {
    const structure = {
      verses: 0,
      chorus: 0,
      bridge: 0,
      intro: 0,
      outro: 0
    };
    
    // Detectar patrones comunes de estructura
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('verso') || lower.includes('verse')) {
        structure.verses++;
      } else if (lower.includes('coro') || lower.includes('chorus')) {
        structure.chorus++;
      } else if (lower.includes('puente') || lower.includes('bridge')) {
        structure.bridge++;
      }
    });
    
    return structure;
  };

  // Analizar tema principal
  const analyzeTheme = (text) => {
    const themes = {
      love: ['amor', 'corazón', 'beso', 'abrazo', 'te amo', 'quiero'],
      sadness: ['triste', 'lloro', 'dolor', 'pena', 'melancolía'],
      happiness: ['alegría', 'feliz', 'sonrisa', 'risa', 'celebrar'],
      nature: ['sol', 'luna', 'estrella', 'mar', 'montaña', 'río'],
      freedom: ['libre', 'volar', 'escapar', 'libertad', 'independencia'],
      nostalgia: ['recuerdo', 'pasado', 'nostalgia', 'ayer', 'tiempo']
    };
    
    const themeScores = {};
    const lowerText = text.toLowerCase();
    
    Object.entries(themes).forEach(([theme, keywords]) => {
      let score = 0;
      keywords.forEach(keyword => {
        const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
        score += matches;
      });
      themeScores[theme] = score;
    });
    
    const dominantTheme = Object.entries(themeScores)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      dominant: dominantTheme ? dominantTheme[0] : 'unknown',
      scores: themeScores
    };
  };

  // Analizar coherencia narrativa
  const analyzeCoherence = (lines) => {
    // Simplificación: verificar continuidad temática
    let coherenceScore = 100;
    
    // Penalizar cambios abruptos de tema
    for (let i = 1; i < lines.length; i++) {
      const prevTheme = analyzeTheme(lines[i-1]);
      const currentTheme = analyzeTheme(lines[i]);
      
      if (prevTheme.dominant !== currentTheme.dominant && 
          prevTheme.dominant !== 'unknown' && 
          currentTheme.dominant !== 'unknown') {
        coherenceScore -= 10;
      }
    }
    
    return Math.max(0, coherenceScore);
  };

  // Generar letras con Qwen
  const generateLyrics = async () => {
    if (!lyrics.trim()) {
      alert('Por favor escribe algo como referencia para generar la letra');
      return;
    }
    
    setIsGeneratingLyrics(true);
    
    try {
      console.log('🎵 Generando letras con Qwen...');
      
      // Usar el servicio Qwen directamente
      const result = await qwenService.current.generateLyrics(lyrics, {
        complexityLevel: lyricsComplexity,
        genre: genre,
        mood: mood,
        stylePreferences: {
          structure: true,
          metrics: true,
          narrative_coherence: true,
          poetic_devices: {
            metaphor: lyricsComplexity > 60,
            simile: lyricsComplexity > 40,
            hyperbole: lyricsComplexity > 70,
            personification: lyricsComplexity > 50,
            alliteration: lyricsComplexity > 30
          }
        }
      });
      
      if (result.success) {
        setGeneratedLyrics(result.lyrics);
        console.log('✅ Letras generadas exitosamente');
      } else {
        throw new Error(result.error || 'Error generando letras');
      }
      
    } catch (error) {
      console.error('Error generando letras:', error);
      
      // Fallback: generar letras simuladas
      const fallbackLyrics = generateFallbackLyrics(lyrics, lyricsComplexity);
      setGeneratedLyrics(fallbackLyrics);
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  // Generar letras de fallback
  const generateFallbackLyrics = (reference, complexity) => {
    const templates = {
      simple: [
        "En el silencio de la noche\nTu voz resuena en mi mente\nComo una melodía suave\nQue nunca se va",
        "Camino por las calles\nBuscando una respuesta\nEn cada paso que doy\nEncuentro una nueva puerta"
      ],
      complex: [
        "En el crepúsculo de mis pensamientos\nDonde las sombras danzan con la luz\nTu recuerdo se convierte en sinfonía\nY el tiempo se detiene en tu mirada",
        "Como un río que serpentea entre montañas\nMis sentimientos fluyen hacia ti\nEn cada gota de lluvia encuentro\nLa esencia de lo que fuimos"
      ]
    };
    
    const template = complexity > 60 ? templates.complex : templates.simple;
    return template[Math.floor(Math.random() * template.length)];
  };

  // Mejorar letras existentes
  const improveLyrics = async () => {
    const targetLyrics = generatedLyrics || lyrics;
    
    if (!targetLyrics.trim()) {
      alert('No hay letras para mejorar');
      return;
    }
    
    setIsImprovingLyrics(true);
    
    try {
      console.log('🔧 Mejorando letras...');
      
      // Usar el servicio Qwen directamente
      const result = await qwenService.current.improveLyrics(targetLyrics, {
        metric_issues: true,
        accent_issues: true,
        repeated_words: true,
        coherence: true,
        structure: true,
        preserve_meaning: true,
        analysis: lyricsAnalysis
      });
      
      if (result.success) {
        setImprovedLyrics(result.improved_lyrics);
        console.log('✅ Letras mejoradas exitosamente');
      } else {
        throw new Error(result.error || 'Error mejorando letras');
      }
      
    } catch (error) {
      console.error('Error mejorando letras:', error);
      
      // Fallback: aplicar mejoras básicas
      const improved = applyBasicImprovements(targetLyrics);
      setImprovedLyrics(improved);
    } finally {
      setIsImprovingLyrics(false);
    }
  };

  // Aplicar mejoras básicas (fallback)
  const applyBasicImprovements = (text) => {
    let improved = text;
    
    // Corregir palabras repetidas
    const words = improved.split(/\s+/);
    const seen = new Set();
    const correctedWords = words.map(word => {
      const clean = word.toLowerCase().replace(/[^\w]/g, '');
      if (seen.has(clean) && clean.length > 3) {
        // Buscar sinónimo simple
        const synonyms = getSynonym(clean);
        seen.add(synonyms.toLowerCase());
        return word.replace(new RegExp(clean, 'gi'), synonyms);
      }
      seen.add(clean);
      return word;
    });
    
    improved = correctedWords.join(' ');
    
    // Mejorar métrica básica
    const lines = improved.split('\n');
    const improvedLines = lines.map(line => {
      if (estimateSyllables(line) > 12) {
        // Línea muy larga, intentar acortar
        return line.split(',')[0] || line.substring(0, line.length * 0.8);
      }
      return line;
    });
    
    return improvedLines.join('\n');
  };

  // Obtener sinónimo simple
  const getSynonym = (word) => {
    const synonyms = {
      'amor': 'cariño',
      'corazón': 'alma',
      'vida': 'existencia',
      'tiempo': 'momento',
      'noche': 'oscuridad',
      'día': 'jornada',
      'luz': 'brillo',
      'sombra': 'penumbra',
      'viento': 'brisa',
      'mar': 'océano'
    };
    
    return synonyms[word] || word;
  };

  // Generar música con las letras
  const generateMusic = async () => {
    const finalLyrics = improvedLyrics || generatedLyrics || lyrics;
    
    if (!finalLyrics.trim()) {
      alert('Por favor escribe o genera letras primero');
      return;
    }
    
    setIsGeneratingMusic(true);
    
    try {
      console.log('🎵 Generando música con Suno...');
      
      // Crear prompt optimizado
      const musicPrompt = createMusicPrompt(finalLyrics);
      
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: finalLyrics,
          prompt: musicPrompt,
          style: musicStyle,
          tempo: tempo,
          mood: mood,
          genre: genre,
          analysis: lyricsAnalysis
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setGeneratedTrack(result);
        console.log('✅ Música generada exitosamente');
      } else {
        throw new Error(result.error || 'Error generando música');
      }
      
    } catch (error) {
      console.error('Error generando música:', error);
      alert('Error generando música: ' + error.message);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  // Crear prompt musical optimizado
  const createMusicPrompt = (lyricsText) => {
    let prompt = `Create a ${genre} song`;
    
    if (mood !== 'neutral') {
      prompt += ` with ${mood} mood`;
    }
    
    if (tempo !== 120) {
      prompt += ` at ${tempo} BPM`;
    }
    
    if (musicStyle) {
      prompt += ` in ${musicStyle} style`;
    }
    
    // Añadir información del análisis de letras
    if (lyricsAnalysis) {
      const theme = lyricsAnalysis.theme.dominant;
      if (theme !== 'unknown') {
        prompt += ` with ${theme} theme`;
      }
    }
    
    // Traducir y optimizar para Suno
    return translationService.current.optimizeForSuno(prompt);
  };

  return (
    <div className="the-creator">
      <div className="creator-header">
        <h1>🎵 The Creator</h1>
        <p>Herramienta Intuitiva de Generación Musical Text-Audio</p>
      </div>

      <div className="creator-content">
        {/* Configuración musical */}
        <div className="music-config">
          <h3>🎛️ Configuración Musical</h3>
          <div className="config-grid">
            <div className="config-item">
              <label>Género:</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="electronic">Electronic</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="indie">Indie</option>
                <option value="folk">Folk</option>
                <option value="jazz">Jazz</option>
                <option value="reggaeton">Reggaeton</option>
              </select>
            </div>
            
            <div className="config-item">
              <label>Tempo (BPM):</label>
              <input
                type="range"
                min="60"
                max="180"
                value={tempo}
                onChange={(e) => setTempo(parseInt(e.target.value))}
              />
              <span className="config-value">{tempo}</span>
            </div>
            
            <div className="config-item">
              <label>Estado de Ánimo:</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="neutral">Neutral</option>
                <option value="happy">Alegre</option>
                <option value="sad">Triste</option>
                <option value="energetic">Energético</option>
                <option value="calm">Tranquilo</option>
                <option value="romantic">Romántico</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
            
            <div className="config-item">
              <label>Estilo Musical:</label>
              <input
                type="text"
                value={musicStyle}
                onChange={(e) => setMusicStyle(e.target.value)}
                placeholder="ej: synthwave, acoustic, orchestral..."
              />
            </div>
          </div>
        </div>

        {/* Editor de letras principal */}
        <div className="lyrics-editor">
          <h3>✍️ Editor de Letras</h3>
          
          <div className="lyrics-controls">
            <div className="complexity-control">
              <label>Complejidad de Letras:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={lyricsComplexity}
                onChange={(e) => setLyricsComplexity(parseInt(e.target.value))}
              />
              <div className="complexity-labels">
                <span>Sencilla</span>
                <span className="complexity-value">{lyricsComplexity}%</span>
                <span>Rebuscada</span>
              </div>
            </div>
            
            <div className="lyrics-buttons">
              <button 
                className="lyrics-btn generate"
                onClick={generateLyrics}
                disabled={isGeneratingLyrics || !lyrics.trim()}
              >
                {isGeneratingLyrics ? (
                  <>
                    <span className="spinner"></span>
                    Generando...
                  </>
                ) : (
                  '🧠 Generar Letra'
                )}
              </button>
              
              <button 
                className="lyrics-btn improve"
                onClick={improveLyrics}
                disabled={isImprovingLyrics || (!lyrics.trim() && !generatedLyrics.trim())}
              >
                {isImprovingLyrics ? (
                  <>
                    <span className="spinner"></span>
                    Mejorando...
                  </>
                ) : (
                  '🔧 Mejorar Letra'
                )}
              </button>
            </div>
          </div>
          
          <div className="lyrics-workspace">
            <div className="lyrics-panel">
              <label>Letra Original / Referencia:</label>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Escribe aquí tu letra o ideas como referencia para generar una letra completa..."
                rows="12"
                className="lyrics-textarea"
              />
            </div>
            
            {generatedLyrics && (
              <div className="lyrics-panel">
                <label>Letra Generada:</label>
                <textarea
                  value={generatedLyrics}
                  onChange={(e) => setGeneratedLyrics(e.target.value)}
                  rows="12"
                  className="lyrics-textarea generated"
                />
              </div>
            )}
            
            {improvedLyrics && (
              <div className="lyrics-panel">
                <label>Letra Mejorada:</label>
                <textarea
                  value={improvedLyrics}
                  onChange={(e) => setImprovedLyrics(e.target.value)}
                  rows="12"
                  className="lyrics-textarea improved"
                />
              </div>
            )}
          </div>
        </div>

        {/* Análisis de letras */}
        {lyricsAnalysis && (
          <div className="lyrics-analysis">
            <h3>📊 Análisis de Letras</h3>
            
            <div className="analysis-grid">
              <div className="analysis-card">
                <h4>Estadísticas Básicas</h4>
                <p><strong>Líneas:</strong> {lyricsAnalysis.lineCount}</p>
                <p><strong>Palabras:</strong> {lyricsAnalysis.wordCount}</p>
                <p><strong>Promedio palabras/línea:</strong> {lyricsAnalysis.averageWordsPerLine}</p>
              </div>
              
              <div className="analysis-card">
                <h4>Tema Principal</h4>
                <p><strong>Tema dominante:</strong> {lyricsAnalysis.theme.dominant}</p>
                <p><strong>Coherencia:</strong> {lyricsAnalysis.coherence}%</p>
              </div>
              
              <div className="analysis-card">
                <h4>Recursos Poéticos</h4>
                <p><strong>Metáforas:</strong> {lyricsAnalysis.poeticDevices.metaphors.length}</p>
                <p><strong>Aliteraciones:</strong> {lyricsAnalysis.poeticDevices.alliteration.length}</p>
                <p><strong>Personificaciones:</strong> {lyricsAnalysis.poeticDevices.personification.length}</p>
              </div>
              
              <div className="analysis-card">
                <h4>Problemas Detectados</h4>
                <p><strong>Palabras repetidas:</strong> {lyricsAnalysis.issues.repeatedWords.length}</p>
                <p><strong>Problemas métricos:</strong> {lyricsAnalysis.issues.metricIssues.length}</p>
                <p><strong>Problemas de acentos:</strong> {lyricsAnalysis.issues.accentIssues.length}</p>
              </div>
            </div>
            
            {/* Detalles de problemas */}
            {lyricsAnalysis.issues.repeatedWords.length > 0 && (
              <div className="issues-detail">
                <h4>⚠️ Palabras Repetidas</h4>
                {lyricsAnalysis.issues.repeatedWords.map((item, index) => (
                  <span key={index} className="issue-tag">
                    "{item.word}" ({item.count}x)
                  </span>
                ))}
              </div>
            )}
            
            {lyricsAnalysis.issues.metricIssues.length > 0 && (
              <div className="issues-detail">
                <h4>📏 Problemas Métricos</h4>
                {lyricsAnalysis.issues.metricIssues.map((issue, index) => (
                  <div key={index} className="metric-issue">
                    Línea {issue.line}: {issue.syllables} sílabas (esperado: ~{issue.expected})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generación de música */}
        <div className="music-generation">
          <button 
            className={`generate-music-btn ${isGeneratingMusic ? 'generating' : ''}`}
            onClick={generateMusic}
            disabled={isGeneratingMusic || (!lyrics.trim() && !generatedLyrics.trim() && !improvedLyrics.trim())}
          >
            {isGeneratingMusic ? (
              <>
                <span className="spinner"></span>
                Generando Música...
              </>
            ) : (
              <>
                🎵 Generar Música Completa
              </>
            )}
          </button>
        </div>

        {/* Track generado */}
        {generatedTrack && (
          <div className="generated-music">
            <h3>🎉 Música Generada</h3>
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

export default TheCreator;
