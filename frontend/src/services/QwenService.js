/**
 * 🧠 Qwen Service - Motor de IA para Generación de Letras
 * Servicio especializado en generación y mejora de letras musicales
 */

class QwenService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8003'; // Puerto del backend de Qwen
        this.isAvailable = false;
        this.model = 'qwen2.5:latest';
        this.maxTokens = 2048;
        this.temperature = 0.7;
        
        this.init();
    }

    async init() {
        try {
            await this.checkHealth();
            console.log('🧠 Qwen Service inicializado');
        } catch (error) {
            console.warn('Qwen Service no disponible, usando modo fallback');
            this.isAvailable = false;
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/qwen/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                this.isAvailable = true;
            } else {
                this.isAvailable = false;
            }
        } catch (error) {
            this.isAvailable = false;
            throw new Error('Qwen Service no disponible');
        }
    }

    // Generar letras basadas en referencia del usuario
    async generateLyrics(referenceText, options = {}) {
        const {
            complexityLevel = 50,
            genre = 'pop',
            mood = 'neutral',
            stylePreferences = {}
        } = options;

        if (!this.isAvailable) {
            return this.generateFallbackLyrics(referenceText, complexityLevel);
        }

        try {
            const prompt = this.createLyricsPrompt(referenceText, complexityLevel, genre, mood, stylePreferences);
            
            const response = await fetch(`${this.apiBaseUrl}/api/qwen/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: this.model,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                    system_message: this.getSystemMessage('lyrics_generation')
                })
            });

            if (!response.ok) {
                throw new Error(`Qwen API error: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                success: true,
                lyrics: data.generated_text,
                analysis: this.analyzeLyricsQuality(data.generated_text),
                metadata: {
                    model: this.model,
                    complexity: complexityLevel,
                    genre: genre,
                    mood: mood
                }
            };

        } catch (error) {
            console.error('Error generando letras con Qwen:', error);
            return this.generateFallbackLyrics(referenceText, complexityLevel);
        }
    }

    // Mejorar letras existentes
    async improveLyrics(lyrics, issues = {}) {
        if (!this.isAvailable) {
            return this.improveFallbackLyrics(lyrics, issues);
        }

        try {
            const prompt = this.createImprovementPrompt(lyrics, issues);
            
            const response = await fetch(`${this.apiBaseUrl}/api/qwen/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    model: this.model,
                    max_tokens: this.maxTokens,
                    temperature: 0.5, // Menos creatividad para mejoras
                    system_message: this.getSystemMessage('lyrics_improvement')
                })
            });

            if (!response.ok) {
                throw new Error(`Qwen API error: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                success: true,
                improved_lyrics: data.generated_text,
                improvements_made: this.analyzeImprovements(lyrics, data.generated_text),
                metadata: {
                    model: this.model,
                    original_issues: issues
                }
            };

        } catch (error) {
            console.error('Error mejorando letras con Qwen:', error);
            return this.improveFallbackLyrics(lyrics, issues);
        }
    }

    // Crear prompt para generación de letras
    createLyricsPrompt(referenceText, complexityLevel, genre, mood, stylePreferences) {
        let prompt = `Genera una letra de canción completa basada en la siguiente referencia:\n\n"${referenceText}"\n\n`;
        
        prompt += `Especificaciones:\n`;
        prompt += `- Género musical: ${genre}\n`;
        prompt += `- Estado de ánimo: ${mood}\n`;
        prompt += `- Nivel de complejidad: ${complexityLevel}/100 (0=muy sencilla, 100=muy rebuscada)\n\n`;

        // Añadir preferencias de estilo
        if (stylePreferences.structure) {
            prompt += `- Incluir estructura clara (verso, coro, puente)\n`;
        }
        
        if (stylePreferences.metrics) {
            prompt += `- Mantener métrica consistente\n`;
        }
        
        if (stylePreferences.narrative_coherence) {
            prompt += `- Asegurar coherencia narrativa\n`;
        }

        // Recursos poéticos según complejidad
        if (stylePreferences.poetic_devices) {
            prompt += `- Recursos poéticos a incluir:\n`;
            
            if (stylePreferences.poetic_devices.metaphor) {
                prompt += `  * Metáforas\n`;
            }
            if (stylePreferences.poetic_devices.simile) {
                prompt += `  * Símiles\n`;
            }
            if (stylePreferences.poetic_devices.hyperbole) {
                prompt += `  * Hipérboles\n`;
            }
            if (stylePreferences.poetic_devices.personification) {
                prompt += `  * Personificación\n`;
            }
            if (stylePreferences.poetic_devices.alliteration) {
                prompt += `  * Aliteración\n`;
            }
        }

        prompt += `\nInstrucciones específicas según complejidad:\n`;
        
        if (complexityLevel < 30) {
            prompt += `- Usar vocabulario simple y directo\n`;
            prompt += `- Frases cortas y claras\n`;
            prompt += `- Evitar metáforas complejas\n`;
            prompt += `- Rimas consonantes simples\n`;
        } else if (complexityLevel < 70) {
            prompt += `- Equilibrar simplicidad con creatividad\n`;
            prompt += `- Usar algunas metáforas y símiles\n`;
            prompt += `- Variar la longitud de las frases\n`;
            prompt += `- Combinar rimas consonantes y asonantes\n`;
        } else {
            prompt += `- Usar vocabulario sofisticado y poético\n`;
            prompt += `- Crear imágenes complejas y evocativas\n`;
            prompt += `- Emplear múltiples recursos literarios\n`;
            prompt += `- Experimentar con estructuras métricas\n`;
        }

        prompt += `\nGenera SOLO la letra, sin explicaciones adicionales. La letra debe ser emotiva, coherente y adecuada para ser cantada.`;

        return prompt;
    }

    // Crear prompt para mejora de letras
    createImprovementPrompt(lyrics, issues) {
        let prompt = `Mejora la siguiente letra de canción corrigiendo los problemas identificados:\n\n`;
        prompt += `LETRA ORIGINAL:\n${lyrics}\n\n`;
        
        prompt += `PROBLEMAS A CORREGIR:\n`;
        
        if (issues.metric_issues) {
            prompt += `- Problemas métricos: Ajustar el número de sílabas para mayor consistencia\n`;
        }
        
        if (issues.accent_issues) {
            prompt += `- Acentos cruzados: Corregir la acentuación para mejor fluidez\n`;
        }
        
        if (issues.repeated_words) {
            prompt += `- Palabras repetidas: Reemplazar repeticiones excesivas con sinónimos\n`;
        }
        
        if (issues.coherence) {
            prompt += `- Coherencia narrativa: Mejorar la continuidad temática\n`;
        }
        
        if (issues.structure) {
            prompt += `- Estructura: Organizar mejor versos, coros y puentes\n`;
        }

        prompt += `\nINSTRUCCIONES:\n`;
        prompt += `- Mantener la idea central y el mensaje de la canción original\n`;
        prompt += `- Preservar el estilo y tono emocional\n`;
        prompt += `- Hacer solo los cambios necesarios para corregir los problemas\n`;
        prompt += `- Asegurar que la letra mejorada sea natural y cantable\n`;
        prompt += `- Mantener la estructura de versos y coros si existe\n\n`;
        
        prompt += `Devuelve SOLO la letra mejorada, sin explicaciones.`;

        return prompt;
    }

    // Obtener mensaje del sistema según el tipo de tarea
    getSystemMessage(taskType) {
        const systemMessages = {
            lyrics_generation: `Eres un letrista profesional experto en crear letras de canciones emotivas y bien estructuradas. 
                               Tienes amplio conocimiento de métrica, rima, recursos poéticos y narrativa musical. 
                               Creas letras que conectan emocionalmente con el oyente y son fáciles de cantar.`,
            
            lyrics_improvement: `Eres un editor especializado en perfeccionar letras de canciones. 
                                Tienes experiencia corrigiendo problemas métricos, acentuación, repeticiones y coherencia narrativa. 
                                Mejoras las letras manteniendo su esencia y mensaje original.`
        };

        return systemMessages[taskType] || systemMessages.lyrics_generation;
    }

    // Analizar calidad de letras generadas
    analyzeLyricsQuality(lyrics) {
        const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
        const words = lyrics.toLowerCase().match(/\b\w+\b/g) || [];
        
        return {
            line_count: lines.length,
            word_count: words.length,
            avg_words_per_line: lines.length > 0 ? (words.length / lines.length).toFixed(1) : 0,
            estimated_duration: Math.ceil(words.length / 3), // Aproximadamente 3 palabras por segundo
            complexity_score: this.calculateComplexityScore(lyrics),
            poetic_devices: this.detectPoeticDevices(lyrics),
            structure_analysis: this.analyzeStructure(lines)
        };
    }

    // Calcular puntuación de complejidad
    calculateComplexityScore(lyrics) {
        let score = 0;
        const text = lyrics.toLowerCase();
        
        // Vocabulario sofisticado
        const sophisticatedWords = ['etéreo', 'melancólico', 'efímero', 'nostálgico', 'sublime'];
        sophisticatedWords.forEach(word => {
            if (text.includes(word)) score += 10;
        });
        
        // Recursos poéticos
        if (text.match(/como un[a]?/g)) score += 5; // Símiles
        if (text.match(/es un[a]?/g)) score += 5; // Metáforas
        if (text.match(/mil|infinito|eterno/g)) score += 8; // Hipérboles
        
        // Estructura compleja
        const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
        const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
        if (avgLineLength > 50) score += 10;
        
        return Math.min(100, score);
    }

    // Detectar recursos poéticos
    detectPoeticDevices(lyrics) {
        const devices = {
            metaphors: [],
            similes: [],
            hyperboles: [],
            personification: [],
            alliteration: []
        };
        
        const text = lyrics.toLowerCase();
        
        // Metáforas
        const metaphorMatches = text.match(/es un[a]? [^,.\n]+/g);
        if (metaphorMatches) devices.metaphors = metaphorMatches;
        
        // Símiles
        const simileMatches = text.match(/como un[a]? [^,.\n]+/g);
        if (simileMatches) devices.similes = simileMatches;
        
        // Hipérboles
        const hyperboleMatches = text.match(/(mil|infinito|eterno|nunca jamás|siempre)/g);
        if (hyperboleMatches) devices.hyperboles = hyperboleMatches;
        
        return devices;
    }

    // Analizar estructura
    analyzeStructure(lines) {
        const structure = {
            has_verses: false,
            has_chorus: false,
            has_bridge: false,
            repetition_pattern: 'none'
        };
        
        // Detectar patrones de repetición
        const lineGroups = {};
        lines.forEach(line => {
            const key = line.trim().toLowerCase();
            lineGroups[key] = (lineGroups[key] || 0) + 1;
        });
        
        const repeatedLines = Object.values(lineGroups).filter(count => count > 1);
        if (repeatedLines.length > 0) {
            structure.repetition_pattern = 'chorus_detected';
            structure.has_chorus = true;
        }
        
        // Detectar versos (líneas únicas)
        const uniqueLines = Object.values(lineGroups).filter(count => count === 1);
        if (uniqueLines.length > 2) {
            structure.has_verses = true;
        }
        
        return structure;
    }

    // Analizar mejoras realizadas
    analyzeImprovements(originalLyrics, improvedLyrics) {
        const improvements = [];
        
        const originalWords = originalLyrics.toLowerCase().match(/\b\w+\b/g) || [];
        const improvedWords = improvedLyrics.toLowerCase().match(/\b\w+\b/g) || [];
        
        // Detectar cambios en longitud
        if (Math.abs(originalWords.length - improvedWords.length) > 5) {
            improvements.push('Ajustada longitud general');
        }
        
        // Detectar cambios en repeticiones
        const originalRepeats = this.countRepeatedWords(originalWords);
        const improvedRepeats = this.countRepeatedWords(improvedWords);
        
        if (improvedRepeats < originalRepeats) {
            improvements.push('Reducidas palabras repetidas');
        }
        
        // Detectar mejoras métricas
        const originalLines = originalLyrics.split('\n').filter(line => line.trim().length > 0);
        const improvedLines = improvedLyrics.split('\n').filter(line => line.trim().length > 0);
        
        const originalVariance = this.calculateMetricVariance(originalLines);
        const improvedVariance = this.calculateMetricVariance(improvedLines);
        
        if (improvedVariance < originalVariance) {
            improvements.push('Mejorada consistencia métrica');
        }
        
        return improvements;
    }

    // Contar palabras repetidas
    countRepeatedWords(words) {
        const wordCount = {};
        let repeats = 0;
        
        words.forEach(word => {
            if (word.length > 3) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });
        
        Object.values(wordCount).forEach(count => {
            if (count > 2) repeats += count - 2;
        });
        
        return repeats;
    }

    // Calcular varianza métrica
    calculateMetricVariance(lines) {
        const syllableCounts = lines.map(line => this.estimateSyllables(line));
        const avg = syllableCounts.reduce((a, b) => a + b, 0) / syllableCounts.length;
        const variance = syllableCounts.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / syllableCounts.length;
        return variance;
    }

    // Estimar sílabas (método simplificado)
    estimateSyllables(text) {
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
    }

    // Generar letras de fallback
    generateFallbackLyrics(referenceText, complexityLevel) {
        const templates = {
            simple: [
                `En el silencio de la noche
Tu voz resuena en mi mente
Como una melodía suave
Que nunca se va

[Coro]
${referenceText}
Es todo lo que necesito
${referenceText}
En mi corazón está escrito

Camino por las calles
Buscando una respuesta
En cada paso que doy
Encuentro una nueva puerta

[Coro]
${referenceText}
Es todo lo que necesito
${referenceText}
En mi corazón está escrito`,

                `Bajo las estrellas brillantes
Sueño con un mundo mejor
Donde cada nota que canto
Lleva un mensaje de amor

[Coro]
${referenceText}
Como un río que fluye
${referenceText}
Mi alma se renueva

Las palabras se escapan
Como hojas en el viento
Pero tu recuerdo permanece
En cada momento

[Coro]
${referenceText}
Como un río que fluye
${referenceText}
Mi alma se renueva`
            ],
            
            complex: [
                `En el crepúsculo de mis pensamientos
Donde las sombras danzan con la luz
Tu recuerdo se convierte en sinfonía
Y el tiempo se detiene en tu mirada

[Verso]
Como un río que serpentea entre montañas
Mis sentimientos fluyen hacia ti
En cada gota de lluvia encuentro
La esencia de lo que fuimos

[Coro]
${referenceText}
Etéreo susurro del alma
${referenceText}
Melodía que trasciende el tiempo

[Puente]
En el laberinto de la nostalgia
Busco los fragmentos de ayer
Cada eco resuena en el vacío
Como una promesa por cumplir

[Coro]
${referenceText}
Etéreo susurro del alma
${referenceText}
Melodía que trasciende el tiempo`,

                `Bajo el manto de estrellas infinitas
Donde el cosmos abraza mi ser
Tus palabras se vuelven constelaciones
Que guían mi errante caminar

[Verso]
Como mariposas de cristal
Mis sueños danzan en el aire
Cada latido es una sinfonía
Que el universo viene a escuchar

[Coro]
${referenceText}
Sublime arquitectura del sentir
${referenceText}
Poesía que el viento ha de llevar

[Puente]
En la alquimia de los sentimientos
Transformo el dolor en canción
Cada nota es una revelación
Del misterio de la creación

[Coro]
${referenceText}
Sublime arquitectura del sentir
${referenceText}
Poesía que el viento ha de llevar`
            ]
        };
        
        const templateGroup = complexityLevel > 60 ? templates.complex : templates.simple;
        const selectedTemplate = templateGroup[Math.floor(Math.random() * templateGroup.length)];
        
        return {
            success: true,
            lyrics: selectedTemplate,
            analysis: this.analyzeLyricsQuality(selectedTemplate),
            metadata: {
                model: 'fallback',
                complexity: complexityLevel,
                source: 'template'
            }
        };
    }

    // Mejorar letras de fallback
    improveFallbackLyrics(lyrics, issues) {
        let improved = lyrics;
        
        // Aplicar mejoras básicas
        if (issues.repeated_words) {
            improved = this.reduceWordRepetition(improved);
        }
        
        if (issues.metric_issues) {
            improved = this.improveMetrics(improved);
        }
        
        return {
            success: true,
            improved_lyrics: improved,
            improvements_made: ['Aplicadas mejoras básicas'],
            metadata: {
                model: 'fallback',
                method: 'basic_improvements'
            }
        };
    }

    // Reducir repetición de palabras
    reduceWordRepetition(text) {
        const synonyms = {
            'amor': 'cariño',
            'corazón': 'alma',
            'vida': 'existencia',
            'tiempo': 'momento',
            'noche': 'oscuridad',
            'día': 'jornada',
            'luz': 'brillo',
            'sombra': 'penumbra'
        };
        
        let improved = text;
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordCount = {};
        
        words.forEach(word => {
            if (word.length > 3) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });
        
        Object.entries(wordCount).forEach(([word, count]) => {
            if (count > 2 && synonyms[word]) {
                // Reemplazar algunas instancias con sinónimos
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                let replacements = 0;
                improved = improved.replace(regex, (match) => {
                    replacements++;
                    return replacements % 2 === 0 ? synonyms[word] : match;
                });
            }
        });
        
        return improved;
    }

    // Mejorar métricas básicas
    improveMetrics(text) {
        const lines = text.split('\n');
        const improvedLines = lines.map(line => {
            if (line.trim().length === 0) return line;
            
            const syllables = this.estimateSyllables(line);
            
            // Si la línea es muy larga, intentar acortarla
            if (syllables > 12) {
                const words = line.split(' ');
                return words.slice(0, Math.ceil(words.length * 0.8)).join(' ');
            }
            
            return line;
        });
        
        return improvedLines.join('\n');
    }

    // Verificar disponibilidad del servicio
    isServiceAvailable() {
        return this.isAvailable;
    }
}

// Exportar para uso global
export default QwenService;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = QwenService;
} else {
    window.QwenService = QwenService;
}
