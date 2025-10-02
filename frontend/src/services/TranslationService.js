/**
 * 🌐 Translation Service
 * Servicio de traducción para optimizar prompts para Suno
 */

class TranslationService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8000';
        this.isAvailable = false;
        this.translations = new Map();
        this.musicTerms = this.initializeMusicTerms();
        
        this.init();
    }

    async init() {
        try {
            await this.checkHealth();
            console.log('🌐 Translation Service inicializado');
        } catch (error) {
            console.warn('Translation Service no disponible, usando modo fallback');
            this.isAvailable = false;
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/translate/health`, {
                method: 'GET',
                timeout: 3000
            });
            
            if (response.ok) {
                this.isAvailable = true;
            } else {
                this.isAvailable = false;
            }
        } catch (error) {
            this.isAvailable = false;
            throw new Error('Translation Service no disponible');
        }
    }

    // Inicializar términos musicales para traducción
    initializeMusicTerms() {
        return {
            // Géneros musicales
            'rock': 'rock',
            'pop': 'pop',
            'jazz': 'jazz',
            'blues': 'blues',
            'reggae': 'reggae',
            'funk': 'funk',
            'soul': 'soul',
            'hip hop': 'hip hop',
            'rap': 'rap',
            'electrónico': 'electronic',
            'electronico': 'electronic',
            'techno': 'techno',
            'house': 'house',
            'trance': 'trance',
            'dubstep': 'dubstep',
            'drum and bass': 'drum and bass',
            'ambient': 'ambient',
            'clásico': 'classical',
            'clasico': 'classical',
            'orquesta': 'orchestral',
            'sinfónico': 'symphonic',
            'sinfonico': 'symphonic',
            'folk': 'folk',
            'country': 'country',
            'metal': 'metal',
            'punk': 'punk',
            'grunge': 'grunge',
            'indie': 'indie',
            'alternativo': 'alternative',
            'experimental': 'experimental',
            'synthwave': 'synthwave',
            'vaporwave': 'vaporwave',
            'lo-fi': 'lo-fi',
            'trap': 'trap',
            'reggaeton': 'reggaeton',
            'salsa': 'salsa',
            'bachata': 'bachata',
            'merengue': 'merengue',
            'cumbia': 'cumbia',
            'tango': 'tango',
            'flamenco': 'flamenco',

            // Instrumentos
            'guitarra': 'guitar',
            'bajo': 'bass',
            'batería': 'drums',
            'bateria': 'drums',
            'piano': 'piano',
            'teclado': 'keyboard',
            'sintetizador': 'synthesizer',
            'violín': 'violin',
            'violin': 'violin',
            'viola': 'viola',
            'violonchelo': 'cello',
            'contrabajo': 'double bass',
            'flauta': 'flute',
            'clarinete': 'clarinet',
            'saxofón': 'saxophone',
            'saxofon': 'saxophone',
            'trompeta': 'trumpet',
            'trombón': 'trombone',
            'trombon': 'trombone',
            'tuba': 'tuba',
            'arpa': 'harp',
            'acordeón': 'accordion',
            'acordeon': 'accordion',
            'armónica': 'harmonica',
            'armonica': 'harmonica',
            'percusión': 'percussion',
            'percusion': 'percussion',
            'maracas': 'maracas',
            'bongos': 'bongos',
            'congas': 'congas',
            'timbal': 'timpani',

            // Términos técnicos
            'tempo': 'tempo',
            'ritmo': 'rhythm',
            'melodía': 'melody',
            'melodia': 'melody',
            'armonía': 'harmony',
            'armonia': 'harmony',
            'acorde': 'chord',
            'escala': 'scale',
            'tonalidad': 'key',
            'compás': 'time signature',
            'compas': 'time signature',
            'verso': 'verse',
            'estribillo': 'chorus',
            'puente': 'bridge',
            'intro': 'intro',
            'outro': 'outro',
            'solo': 'solo',
            'riff': 'riff',
            'groove': 'groove',
            'swing': 'swing',
            'shuffle': 'shuffle',
            'sincopado': 'syncopated',
            'staccato': 'staccato',
            'legato': 'legato',
            'crescendo': 'crescendo',
            'diminuendo': 'diminuendo',
            'forte': 'forte',
            'piano': 'piano (dynamic)',
            'allegro': 'allegro',
            'andante': 'andante',
            'adagio': 'adagio',

            // Efectos y procesamiento
            'reverb': 'reverb',
            'delay': 'delay',
            'eco': 'echo',
            'distorsión': 'distortion',
            'distorsion': 'distortion',
            'overdrive': 'overdrive',
            'fuzz': 'fuzz',
            'chorus': 'chorus effect',
            'flanger': 'flanger',
            'phaser': 'phaser',
            'wah': 'wah',
            'compresión': 'compression',
            'compresion': 'compression',
            'ecualizador': 'equalizer',
            'filtro': 'filter',
            'saturación': 'saturation',
            'saturacion': 'saturation',

            // Emociones y estados de ánimo
            'alegre': 'happy',
            'triste': 'sad',
            'melancólico': 'melancholic',
            'melancolico': 'melancholic',
            'energético': 'energetic',
            'energetico': 'energetic',
            'relajado': 'relaxed',
            'tranquilo': 'calm',
            'agresivo': 'aggressive',
            'intenso': 'intense',
            'suave': 'soft',
            'dulce': 'sweet',
            'oscuro': 'dark',
            'brillante': 'bright',
            'cálido': 'warm',
            'calido': 'warm',
            'frío': 'cold',
            'frio': 'cold',
            'nostálgico': 'nostalgic',
            'nostalgico': 'nostalgic',
            'romántico': 'romantic',
            'romantico': 'romantic',
            'épico': 'epic',
            'epico': 'epic',
            'dramático': 'dramatic',
            'dramatico': 'dramatic',
            'misterioso': 'mysterious',
            'etéreo': 'ethereal',
            'etereo': 'ethereal',

            // Descriptores de sonido
            'limpio': 'clean',
            'sucio': 'dirty',
            'crudo': 'raw',
            'pulido': 'polished',
            'áspero': 'rough',
            'aspero': 'rough',
            'suave': 'smooth',
            'texturizado': 'textured',
            'atmosférico': 'atmospheric',
            'atmosferico': 'atmospheric',
            'ambiental': 'ambient',
            'espacioso': 'spacious',
            'íntimo': 'intimate',
            'intimo': 'intimate',
            'poderoso': 'powerful',
            'delicado': 'delicate',
            'pesado': 'heavy',
            'ligero': 'light',

            // Términos de producción
            'mezcla': 'mix',
            'masterización': 'mastering',
            'masterizacion': 'mastering',
            'grabación': 'recording',
            'grabacion': 'recording',
            'estudio': 'studio',
            'producción': 'production',
            'produccion': 'production',
            'arreglo': 'arrangement',
            'composición': 'composition',
            'composicion': 'composition',
            'improvisación': 'improvisation',
            'improvisacion': 'improvisation',
            'sample': 'sample',
            'loop': 'loop',
            'beat': 'beat',
            'track': 'track',
            'pista': 'track',
            'canal': 'channel',
            'bus': 'bus',
            'envío': 'send',
            'envio': 'send',
            'retorno': 'return',

            // Palabras comunes
            'canción': 'song',
            'cancion': 'song',
            'música': 'music',
            'musica': 'music',
            'sonido': 'sound',
            'audio': 'audio',
            'voz': 'voice',
            'vocal': 'vocal',
            'instrumental': 'instrumental',
            'acústico': 'acoustic',
            'acustico': 'acoustic',
            'eléctrico': 'electric',
            'electrico': 'electric',
            'digital': 'digital',
            'analógico': 'analog',
            'analogico': 'analog',
            'vintage': 'vintage',
            'moderno': 'modern',
            'clásico': 'classic',
            'clasico': 'classic',
            'tradicional': 'traditional',
            'contemporáneo': 'contemporary',
            'contemporaneo': 'contemporary',
            'futurista': 'futuristic',
            'retro': 'retro'
        };
    }

    // Traducir texto completo
    async translateText(text, targetLanguage = 'en') {
        if (!text || typeof text !== 'string') {
            return text;
        }

        // Si ya está en inglés, no traducir
        if (this.isEnglish(text)) {
            return text;
        }

        // Intentar traducción con API si está disponible
        if (this.isAvailable) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/api/translate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: text,
                        target_language: targetLanguage,
                        source_language: 'es'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.translated_text;
                }
            } catch (error) {
                console.warn('Error en traducción API, usando fallback');
            }
        }

        // Fallback: traducción local
        return this.translateLocally(text);
    }

    // Traducción local usando diccionario
    translateLocally(text) {
        let translatedText = text.toLowerCase();

        // Aplicar traducciones de términos musicales
        Object.entries(this.musicTerms).forEach(([spanish, english]) => {
            const regex = new RegExp(`\\b${spanish}\\b`, 'gi');
            translatedText = translatedText.replace(regex, english);
        });

        // Traducciones adicionales comunes
        const commonTranslations = {
            'con': 'with',
            'y': 'and',
            'o': 'or',
            'en': 'in',
            'de': 'of',
            'del': 'of the',
            'la': 'the',
            'el': 'the',
            'un': 'a',
            'una': 'a',
            'que': 'that',
            'como': 'like',
            'muy': 'very',
            'más': 'more',
            'mas': 'more',
            'menos': 'less',
            'grande': 'big',
            'pequeño': 'small',
            'pequeno': 'small',
            'rápido': 'fast',
            'rapido': 'fast',
            'lento': 'slow',
            'alto': 'high',
            'bajo': 'low',
            'fuerte': 'strong',
            'débil': 'weak',
            'debil': 'weak',
            'nuevo': 'new',
            'viejo': 'old',
            'joven': 'young',
            'bueno': 'good',
            'malo': 'bad',
            'mejor': 'better',
            'peor': 'worse',
            'primero': 'first',
            'último': 'last',
            'ultimo': 'last'
        };

        Object.entries(commonTranslations).forEach(([spanish, english]) => {
            const regex = new RegExp(`\\b${spanish}\\b`, 'gi');
            translatedText = translatedText.replace(regex, english);
        });

        return translatedText;
    }

    // Optimizar prompt para Suno
    optimizeForSuno(prompt) {
        let optimizedPrompt = prompt;

        // Asegurar que esté en inglés
        if (!this.isEnglish(optimizedPrompt)) {
            optimizedPrompt = this.translateLocally(optimizedPrompt);
        }

        // Aplicar optimizaciones específicas para Suno
        const sunoOptimizations = {
            // Estructura de prompt más efectiva
            'create': 'generate',
            'make': 'create',
            'produce': 'generate',
            
            // Términos más específicos
            'song': 'track',
            'piece': 'composition',
            'tune': 'melody',
            
            // Descriptores más efectivos
            'with heavy bass': 'bass-heavy',
            'with strong drums': 'drum-heavy',
            'very energetic': 'high-energy',
            'very calm': 'ambient',
            'very fast': 'uptempo',
            'very slow': 'downtempo',
            
            // Formato de BPM
            'at (\\d+) bpm': 'tempo $1 BPM',
            'tempo (\\d+)': '$1 BPM',
            
            // Formato de tonalidad
            'in ([A-G][#b]?) key': 'key of $1',
            'key ([A-G][#b]?)': 'key of $1'
        };

        Object.entries(sunoOptimizations).forEach(([pattern, replacement]) => {
            const regex = new RegExp(pattern, 'gi');
            optimizedPrompt = optimizedPrompt.replace(regex, replacement);
        });

        // Limpiar y formatear
        optimizedPrompt = optimizedPrompt
            .replace(/\s+/g, ' ') // Espacios múltiples
            .replace(/[,\s]+,/g, ',') // Comas duplicadas
            .replace(/\s*,\s*/g, ', ') // Espaciado de comas
            .replace(/\s*\.\s*/g, '. ') // Espaciado de puntos
            .trim();

        // Asegurar que termine con punto si es una oración completa
        if (optimizedPrompt.length > 10 && !optimizedPrompt.endsWith('.') && !optimizedPrompt.endsWith('!') && !optimizedPrompt.endsWith('?')) {
            optimizedPrompt += '.';
        }

        return optimizedPrompt;
    }

    // Detectar si el texto está en inglés
    isEnglish(text) {
        const englishWords = [
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'create', 'generate', 'make', 'song', 'music', 'track', 'beat', 'rhythm',
            'guitar', 'piano', 'drums', 'bass', 'vocal', 'instrumental', 'electronic',
            'rock', 'pop', 'jazz', 'blues', 'metal', 'folk', 'country', 'hip', 'hop'
        ];

        const words = text.toLowerCase().split(/\s+/);
        const englishWordCount = words.filter(word => englishWords.includes(word)).length;
        const englishRatio = englishWordCount / words.length;

        return englishRatio > 0.3; // Si más del 30% son palabras en inglés
    }

    // Generar prompt optimizado para música
    generateMusicPrompt(basePrompt, analysis = null, knobs = null) {
        let prompt = basePrompt || 'Create a musical composition';

        // Añadir información del análisis si está disponible
        if (analysis) {
            if (analysis.genre) {
                prompt += ` in ${analysis.genre.toLowerCase()} style`;
            }
            if (analysis.bpm) {
                prompt += ` at ${analysis.bpm} BPM`;
            }
            if (analysis.key) {
                prompt += ` in ${analysis.key} key`;
            }
            if (analysis.mood) {
                prompt += ` with ${analysis.mood.toLowerCase()} mood`;
            }
        }

        // Aplicar configuración de knobs si está disponible
        if (knobs) {
            if (knobs.expresividad > 70) {
                prompt += ', highly expressive and emotional';
            } else if (knobs.expresividad < 30) {
                prompt += ', subtle and controlled';
            }

            if (knobs.trash > 70) {
                prompt += ', heavily saturated and compressed';
            } else if (knobs.trash > 40) {
                prompt += ', with some saturation and punch';
            }

            if (knobs.grunge > 70) {
                prompt += ', featuring distorted and gritty instruments';
            } else if (knobs.grunge > 40) {
                prompt += ', with some edge and distortion';
            }

            if (knobs.rareza > 70) {
                prompt += ', experimental and unconventional';
            } else if (knobs.rareza > 40) {
                prompt += ', with creative variations';
            }
        }

        return this.optimizeForSuno(prompt);
    }

    // Cache de traducciones
    cacheTranslation(original, translated) {
        this.translations.set(original, translated);
    }

    getCachedTranslation(text) {
        return this.translations.get(text);
    }

    // Limpiar cache
    clearCache() {
        this.translations.clear();
    }
}

// Exportar para uso global
export default TranslationService;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TranslationService;
} else {
    window.TranslationService = TranslationService;
}
