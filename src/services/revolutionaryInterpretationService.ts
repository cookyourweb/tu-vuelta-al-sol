// =============================================================================
// 🔥 SERVICIO DE GENERACIÓN DE INTERPRETACIÓN REVOLUCIONARIA
// revolutionaryInterpretationService.ts
// =============================================================================
// Toma los datos del Triple Fusionado y genera una interpretación holística
// con profundidad psicológica y lenguaje disruptivo
// =============================================================================

import OpenAI from 'openai';
import { generateDisruptiveNatalPrompt, ChartData, UserProfile } from '@/utils/prompts/disruptivePrompts';

// =============================================================================
// 🔧 CLIENTE OPENAI
// =============================================================================

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('❌ OPENAI_API_KEY no configurada en variables de entorno');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID || undefined,
    project: process.env.OPENAI_PROJECT_ID || undefined,
  });
}

// =============================================================================
// 📚 INTERFACES - Interpretación Revolucionaria
// =============================================================================

export interface FormacionTemprana {
  casa_lunar?: {
    planeta: string;
    infancia_emocional: string;
    patron_formado: string;
    impacto_adulto: string;
  };
  casa_saturnina?: {
    planeta: string;
    limites_internalizados: string;
    mensaje_recibido: string;
    impacto_adulto: string;
  };
  casa_venusina?: {
    planeta: string;
    amor_aprendido: string;
    modelo_relacional: string;
    impacto_adulto: string;
  };
}

export interface PatronPsicologico {
  nombre_patron: string;
  planeta_origen: string;
  como_se_manifiesta: string[];
  origen_infancia: string;
  dialogo_interno: string[];
  ciclo_karmico: string[];
  sombra_junguiana: string;
  superpoder_integrado: string;
  pregunta_reflexion: string;
}

export interface PlanetaProfundo {
  planeta: string;
  posicion_completa: string;
  lectura_psicologica: string;
  arquetipo: string;
  luz: string;
  sombra: string;
  integracion: string;
}

export interface AngulosVitales {
  ascendente: {
    posicion: string;
    mascara_social: string;
    cuerpo_fisico: string;
    enfoque_vida: string;
    desafio_evolutivo: string;
    superpoder: string;
  };
  medio_cielo: {
    posicion: string;
    vocacion_soul: string;
    imagen_publica: string;
    legado: string;
    carrera_ideal: string;
    autoridad_interna: string;
  };
}

export interface NodosLunares {
  nodo_sur: {
    signo_casa: string;
    zona_comfort: string;
    patron_repetitivo: string;
  };
  nodo_norte: {
    signo_casa: string;
    direccion_evolutiva: string;
    desafio: string;
  };
  eje_completo: string;
}

export interface RevolutionaryInterpretation {
  esencia_revolucionaria?: string;
  proposito_vida?: string;
  formacion_temprana?: FormacionTemprana;
  patrones_psicologicos?: PatronPsicologico[];
  planetas_profundos?: PlanetaProfundo[];
  angulos_vitales?: AngulosVitales;
  nodos_lunares?: NodosLunares;
  declaracion_poder?: string;
  advertencias?: string[];
  insights_transformacionales?: string[];
  pregunta_final_reflexion?: string;
}

// =============================================================================
// 🌟 FUNCIÓN PRINCIPAL: GENERAR INTERPRETACIÓN REVOLUCIONARIA
// =============================================================================

export async function generateRevolutionaryInterpretation(
  chartData: ChartData,
  userProfile: UserProfile,
  onProgress?: (message: string, progress: number) => void
): Promise<RevolutionaryInterpretation> {
  try {
    console.log('🔥 ===== GENERANDO INTERPRETACIÓN REVOLUCIONARIA =====');
    console.log('👤 Usuario:', userProfile.name);
    console.log('📊 Datos de carta:', {
      planets: chartData.planets?.length || 0,
      ascendant: chartData.ascendant?.sign,
      midheaven: chartData.midheaven?.sign
    });

    if (onProgress) {
      onProgress('🔥 Generando interpretación revolucionaria con IA...', 85);
    }

    const openai = getOpenAIClient();

    // Generar prompt usando la función de disruptivePrompts.ts
    const prompt = generateDisruptiveNatalPrompt(chartData, userProfile);

    console.log('📝 Prompt generado, longitud:', prompt.length, 'caracteres');

    if (onProgress) {
      onProgress('🧠 Analizando patrones psicológicos profundos...', 90);
    }

    // Llamar a OpenAI con configuración optimizada
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo EXPERTO en psicología profunda (Jung, Rudhyar, Greene, Sasportas). Tu especialidad es crear interpretaciones transformacionales que conecten formación temprana con patrones adultos. Respondes SOLO con JSON válido, sin texto adicional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.85, // Un poco más creativo para lenguaje disruptivo
      max_tokens: 4000, // Interpretación completa necesita más espacio
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    if (onProgress) {
      onProgress('✅ Interpretación revolucionaria generada', 95);
    }

    console.log('📦 Respuesta recibida, longitud:', content.length, 'caracteres');

    // Parsear y validar JSON
    const interpretation = JSON.parse(content) as RevolutionaryInterpretation;

    // Validar que tenga los campos principales
    const requiredFields = [
      'esencia_revolucionaria',
      'proposito_vida',
      'formacion_temprana',
      'patrones_psicologicos',
      'planetas_profundos',
      'angulos_vitales',
      'nodos_lunares'
    ];

    const missingFields = requiredFields.filter(field => !interpretation[field as keyof RevolutionaryInterpretation]);

    if (missingFields.length > 0) {
      console.warn('⚠️ Campos faltantes en interpretación:', missingFields);
    }

    console.log('✅ Interpretación revolucionaria generada exitosamente');
    console.log('📊 Estadísticas:', {
      esencia_revolucionaria: interpretation.esencia_revolucionaria ? '✅' : '❌',
      formacion_temprana: interpretation.formacion_temprana ? '✅' : '❌',
      patrones_psicologicos: interpretation.patrones_psicologicos?.length || 0,
      planetas_profundos: interpretation.planetas_profundos?.length || 0,
      angulos_vitales: interpretation.angulos_vitales ? '✅' : '❌',
      nodos_lunares: interpretation.nodos_lunares ? '✅' : '❌',
      insights: interpretation.insights_transformacionales?.length || 0
    });

    return interpretation;

  } catch (error) {
    console.error('❌ Error generando interpretación revolucionaria:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Si falla, retornar estructura mínima
    return generateFallbackRevolutionaryInterpretation(userProfile.name);
  }
}

// =============================================================================
// 🔄 FALLBACK: Interpretación genérica si falla OpenAI
// =============================================================================

function generateFallbackRevolutionaryInterpretation(userName: string): RevolutionaryInterpretation {
  return {
    esencia_revolucionaria: `${userName.toUpperCase()}, tu carta natal revela una complejidad única que merece ser explorada en profundidad. Esta interpretación está siendo generada...`,

    proposito_vida: 'Tu propósito de vida está conectado profundamente con tu configuración astrológica única. Requiere una interpretación personalizada completa.',

    formacion_temprana: {
      casa_lunar: {
        planeta: 'Luna',
        infancia_emocional: 'Tu infancia emocional formó patrones importantes que aún impactan tu vida.',
        patron_formado: 'Se formaron patrones de respuesta emocional específicos.',
        impacto_adulto: 'Estos patrones continúan manifestándose en tu vida adulta de formas sutiles pero poderosas.'
      }
    },

    patrones_psicologicos: [
      {
        nombre_patron: 'Patrón en Formación',
        planeta_origen: 'Múltiples planetas',
        como_se_manifiesta: [
          'Este patrón requiere análisis profundo',
          'La interpretación completa revelará más detalles'
        ],
        origen_infancia: 'Los patrones se forman en la infancia temprana.',
        dialogo_interno: [
          'Tu diálogo interno tiene patrones únicos',
          'Requiere interpretación personalizada'
        ],
        ciclo_karmico: [
          'Los ciclos kármicos son complejos',
          'Necesitan análisis detallado'
        ],
        sombra_junguiana: 'Tu sombra contiene elementos no integrados que esperan ser reconocidos.',
        superpoder_integrado: 'Al integrar tu sombra, emergen poderes únicos.',
        pregunta_reflexion: '¿Qué partes de ti mismo has dejado sin explorar?'
      }
    ],

    planetas_profundos: [],

    angulos_vitales: {
      ascendente: {
        posicion: 'Ascendente',
        mascara_social: 'Tu Ascendente define tu máscara social única.',
        cuerpo_fisico: 'Se manifiesta en tu presencia física.',
        enfoque_vida: 'Define cómo ves y experimentas la vida.',
        desafio_evolutivo: 'Tu evolución requiere ir más allá de tu máscara.',
        superpoder: 'Cuando uses tu Ascendente conscientemente, emerges poderoso.'
      },
      medio_cielo: {
        posicion: 'Medio Cielo',
        vocacion_soul: 'Tu vocación del alma está esperando ser descubierta.',
        imagen_publica: 'Tu imagen pública tiene características únicas.',
        legado: 'El legado que viniste a dejar es significativo.',
        carrera_ideal: 'Tu carrera ideal está conectada con tu propósito.',
        autoridad_interna: 'Tu autoridad interna necesita ser desarrollada.'
      }
    },

    declaracion_poder: `YO, ${userName.toUpperCase()}, SOY un ser único con una configuración cósmica irrepetible. Mi carta natal es mi mapa hacia la evolución consciente.`,

    advertencias: [
      'Esta es una interpretación genérica de respaldo',
      'Se recomienda regenerar para obtener interpretación completa',
      'La profundidad psicológica requiere análisis detallado'
    ],

    insights_transformacionales: [
      'Tu carta natal contiene claves únicas para tu evolución',
      'Cada planeta, casa y aspecto cuenta una historia',
      'La integración consciente transforma patrones',
      'Tu evolución es un proceso continuo'
    ],

    pregunta_final_reflexion: `${userName}, ¿estás lista para explorar las profundidades de tu carta natal y descubrir los patrones que han moldeado tu vida?`
  };
}

// =============================================================================
// 💾 VALIDAR SI YA EXISTE INTERPRETACIÓN REVOLUCIONARIA
// =============================================================================

export function hasRevolutionaryInterpretation(data: any): boolean {
  if (!data) return false;

  // Verificar que tenga la estructura esperada
  return !!(
    data.esencia_revolucionaria &&
    data.proposito_vida &&
    data.formacion_temprana &&
    data.patrones_psicologicos
  );
}

// =============================================================================
// 📊 OBTENER ESTADÍSTICAS DE INTERPRETACIÓN REVOLUCIONARIA
// =============================================================================

export function getRevolutionaryInterpretationStats(interpretation: RevolutionaryInterpretation) {
  return {
    hasEssence: !!interpretation.esencia_revolucionaria,
    hasPurpose: !!interpretation.proposito_vida,
    hasFormation: !!interpretation.formacion_temprana,
    psychologicalPatterns: interpretation.patrones_psicologicos?.length || 0,
    deepPlanets: interpretation.planetas_profundos?.length || 0,
    hasAngles: !!interpretation.angulos_vitales,
    hasNodes: !!interpretation.nodos_lunares,
    transformationalInsights: interpretation.insights_transformacionales?.length || 0,
    warnings: interpretation.advertencias?.length || 0,
    completeness: calculateCompleteness(interpretation)
  };
}

function calculateCompleteness(interpretation: RevolutionaryInterpretation): number {
  const fields = [
    interpretation.esencia_revolucionaria,
    interpretation.proposito_vida,
    interpretation.formacion_temprana,
    interpretation.patrones_psicologicos,
    interpretation.planetas_profundos,
    interpretation.angulos_vitales,
    interpretation.nodos_lunares,
    interpretation.declaracion_poder,
    interpretation.insights_transformacionales
  ];

  const filledFields = fields.filter(f => f !== undefined && f !== null).length;
  return Math.round((filledFields / fields.length) * 100);
}
