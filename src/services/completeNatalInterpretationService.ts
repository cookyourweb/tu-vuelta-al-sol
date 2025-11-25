// =============================================================================
// 🎯 COMPLETE NATAL INTERPRETATION SERVICE
// src/services/completeNatalInterpretationService.ts
// Genera interpretación completa con estructura detallada
// =============================================================================

import OpenAI from 'openai';
import {
  generateCompleteNatalChartPrompt,
  calculateElementDistribution,
  calculateModalityDistribution,
  type ChartData,
  type UserProfile,
} from '@/utils/prompts/completeNatalChartPrompt';

// =============================================================================
// TYPES - Estructura flexible que coincide con el nuevo prompt
// =============================================================================

export interface CartaNatalCompleta {
  puntos_fundamentales: {
    sol: { signo: string; grado: number; casa: number; poder: string };
    luna: { signo: string; grado: number; casa: number; poder: string };
    ascendente: { signo: string; grado: number; casa: number; poder: string };
    medio_cielo: { signo: string; grado: number; casa: number; poder: string };
    nodo_norte: { signo: string; grado: number; casa: number; poder: string };
  };

  sintesis_elemental: {
    fuego: { porcentaje: number; planetas: string[]; significado: string };
    tierra: { porcentaje: number; planetas: string[]; significado: string };
    aire: { porcentaje: number; planetas: string[]; significado: string };
    agua: { porcentaje: number; planetas: string[]; significado: string };
    configuracion_alquimica: string;
    elemento_escaso: string;
  };

  modalidades: {
    cardinal: { porcentaje: number; significado: string };
    fijo: { porcentaje: number; significado: string };
    mutable: { porcentaje: number; significado: string };
    ritmo_accion: string;
  };

  esencia_revolucionaria: string;

  interpretaciones_planetarias: {
    sol: InterpretacionSol;
    luna: InterpretacionLuna;
    ascendente: InterpretacionAscendente;
    mercurio: InterpretacionMercurio;
    venus: InterpretacionVenus;
    marte: InterpretacionMarte;
    jupiter: InterpretacionJupiter;
    saturno: InterpretacionSaturno;
    urano: InterpretacionTranspersonal;
    neptuno: InterpretacionTranspersonal;
    pluton: InterpretacionTranspersonal;
    quiron: InterpretacionQuiron;
  };

  aspectos_destacados: {
    stelliums: string;
    aspectos_tensos: string;
    aspectos_armoniosos: string;
    patron_dominante: string;
  };

  integracion_carta: {
    hilo_de_oro: string;
    sintesis: string;
    polaridades: Array<{ polo_a: string; polo_b: string; integracion: string }>;
  };

  fortalezas_educativas: {
    como_aprende_mejor: string[];
    inteligencias_dominantes: Array<{ tipo: string; descripcion: string; planeta_origen: string }>;
    modalidades_estudio: string[];
  };

  areas_especializacion: Array<{
    area: string;
    origen_astrologico: string;
    profesiones: string[];
    descripcion: string;
  }>;

  patrones_sanacion: {
    heridas: Array<{
      nombre: string;
      origen_astrologico: string;
      patron: string;
      origen_infancia: string;
      sanacion: string;
    }>;
    ciclos_sanacion_lunar: {
      luna_nueva: string;
      luna_creciente: string;
      luna_llena: string;
      luna_menguante: string;
    };
    practicas_integracion: Array<{
      practica: string;
      duracion: string;
      beneficio: string;
      fase_lunar: string;
    }>;
  };

  manifestacion_amor: {
    patron_amoroso: string;
    que_atrae: string;
    que_necesita: string;
    trampa_amorosa: string;
    ritual_luna_nueva_venus: {
      preparacion: string;
      activacion_28_dias: string;
      entrega_luna_llena: string;
    };
    declaracion_amor: string;
  };

  visualizacion_guiada: {
    titulo: string;
    duracion: string;
    mejor_momento: string;
    preparacion: string[];
    texto: string;
  };

  datos_para_agenda: {
    eventos_lunares_personalizados: Array<{
      evento: string;
      significado: string;
      ritual: string;
      intencion: string;
    }>;
    practicas_por_fase: {
      luna_nueva: string[];
      cuarto_creciente: string[];
      luna_llena: string[];
      cuarto_menguante: string[];
    };
    dias_poder: Array<{
      cuando: string;
      que_hacer: string;
      que_evitar: string;
    }>;
    advertencias_cosmicas: Array<{
      situacion: string;
      como_afecta: string;
      precauciones: string;
    }>;
  };

  declaracion_poder_final: string;
  mantra_personal: string;
}

// Tipos específicos para interpretaciones planetarias
interface InterpretacionSol {
  posicion: string;
  titulo_arquetipo: string;
  proposito_vida: string;
  trampa: string;
  superpoder: string;
  afirmacion: string;
}

interface InterpretacionLuna {
  posicion: string;
  titulo_arquetipo: string;
  mundo_emocional: string;
  como_se_nutre: string;
  patron_infancia: string;
  sanacion_emocional: string;
}

interface InterpretacionAscendente {
  posicion: string;
  titulo_arquetipo: string;
  personalidad_visible: string;
  presencia: string;
  mascara_vs_esencia: string;
}

interface InterpretacionMercurio {
  posicion: string;
  titulo_arquetipo: string;
  como_piensa: string;
  fortalezas_mentales: string;
  desafio: string;
}

interface InterpretacionVenus {
  posicion: string;
  titulo_arquetipo: string;
  como_ama: string;
  que_necesita_en_pareja: string;
  trampa_amorosa: string;
  valores: string;
}

interface InterpretacionMarte {
  posicion: string;
  titulo_arquetipo: string;
  como_actua: string;
  energia_vital: string;
  ira: string;
  desafio: string;
}

interface InterpretacionJupiter {
  posicion: string;
  titulo_arquetipo: string;
  donde_viene_suerte: string;
  expansion: string;
  consejo: string;
}

interface InterpretacionSaturno {
  posicion: string;
  titulo_arquetipo: string;
  karma_lecciones: string;
  responsabilidad: string;
  recompensa: string;
}

interface InterpretacionTranspersonal {
  posicion: string;
  donde_revoluciona?: string;
  genialidad?: string;
  espiritualidad?: string;
  ilusion_vs_inspiracion?: string;
  transformacion?: string;
  sombra_y_poder?: string;
}

interface InterpretacionQuiron {
  posicion: string;
  herida_principal: string;
  don_sanador: string;
}

// =============================================================================
// OPENAI CLIENT
// =============================================================================

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

// =============================================================================
// MAIN GENERATION FUNCTION
// =============================================================================

export async function generateCompleteNatalInterpretation(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<CartaNatalCompleta> {
  console.log('🎯 [COMPLETE NATAL] Starting generation for:', userProfile.name);

  const openai = getOpenAIClient();
  const prompt = generateCompleteNatalChartPrompt(chartData, userProfile);

  console.log('🎯 [COMPLETE NATAL] Prompt length:', prompt.length, 'characters');

  const startTime = Date.now();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates detailed astrological chart interpretations in valid JSON format. Always respond with ONLY JSON, no additional text.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 16000,
    response_format: { type: 'json_object' }
  });

  const generationTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('🎯 [COMPLETE NATAL] Generation completed in', generationTime, 'seconds');

  // 🔍 DEBUG: Inspect OpenAI response structure
  console.log('🔍 [DEBUG] OpenAI Response structure:', {
    hasChoices: !!response.choices,
    choicesLength: response.choices?.length,
    firstChoice: response.choices?.[0] ? {
      hasMessage: !!response.choices[0].message,
      messageRole: response.choices[0].message?.role,
      hasContent: !!response.choices[0].message?.content,
      contentLength: response.choices[0].message?.content?.length,
      finishReason: response.choices[0].finish_reason,
      refusal: response.choices[0].message?.refusal
    } : null,
    usage: response.usage,
    id: response.id,
    model: response.model
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    console.error('❌ [DEBUG] No content found. Full response:', JSON.stringify(response, null, 2));
    throw new Error('No content in OpenAI response');
  }

  console.log('🎯 [COMPLETE NATAL] Response length:', content.length, 'characters');

  try {
    const interpretation = JSON.parse(content) as CartaNatalCompleta;
    console.log('🎯 [COMPLETE NATAL] Parsed successfully. Sections:', Object.keys(interpretation).length);
    return interpretation;
  } catch (parseError) {
    console.error('🎯 [COMPLETE NATAL] JSON parse error:', parseError);
    throw new Error('Failed to parse OpenAI response as JSON');
  }
}

// =============================================================================
// CHUNKED GENERATION (for reliability)
// =============================================================================

export async function generateCompleteNatalInterpretationChunked(
  chartData: ChartData,
  userProfile: UserProfile,
  onProgress?: (message: string, percentage: number) => void
): Promise<CartaNatalCompleta> {
  console.log('🎯 [CHUNKED NATAL] Starting chunked generation for:', userProfile.name);

  const openai = getOpenAIClient();
  const elementos = calculateElementDistribution(chartData.planets);
  const modalidades = calculateModalityDistribution(chartData.planets);

  // Helper to find planets
  const findPlanet = (names: string[]) =>
    chartData.planets.find(p => names.some(n => p.name.toLowerCase().includes(n.toLowerCase())));

  const sun = findPlanet(['sol', 'sun']);
  const moon = findPlanet(['luna', 'moon']);
  const mercury = findPlanet(['mercurio', 'mercury']);
  const venus = findPlanet(['venus']);
  const mars = findPlanet(['marte', 'mars']);
  const jupiter = findPlanet(['júpiter', 'jupiter']);
  const saturn = findPlanet(['saturno', 'saturn']);

  const result: Partial<CartaNatalCompleta> = {};

  // CHUNK 1: Core data + Esencia + Síntesis elemental + Modalidades
  onProgress?.('🌟 Generando tu síntesis elemental y esencia...', 15);
  const chunk1 = await generateChunk(openai, `
Genera JSON con estas secciones para ${userProfile.name}:
- Sol: ${sun?.sign} Casa ${sun?.house}
- Luna: ${moon?.sign} Casa ${moon?.house}
- Ascendente: ${chartData.ascendant.sign}
- Medio Cielo: ${chartData.midheaven.sign}
- Elementos: Fuego ${elementos.fire.percentage}%, Tierra ${elementos.earth.percentage}%, Aire ${elementos.air.percentage}%, Agua ${elementos.water.percentage}%
- Modalidades: Cardinal ${modalidades.cardinal.percentage}%, Fijo ${modalidades.fixed.percentage}%, Mutable ${modalidades.mutable.percentage}%

{
  "puntos_fundamentales": { "sol": {...}, "luna": {...}, "ascendente": {...}, "medio_cielo": {...}, "nodo_norte": {...} },
  "sintesis_elemental": { "fuego": {...}, "tierra": {...}, "aire": {...}, "agua": {...}, "configuracion_alquimica": "[Párrafo PODEROSO]", "elemento_escaso": "[...]" },
  "modalidades": { "cardinal": {...}, "fijo": {...}, "mutable": {...}, "ritmo_accion": "[...]" },
  "esencia_revolucionaria": "[4-5 líneas PODEROSAS comenzando con 'Eres un Alma...']"
}

Lenguaje DISRUPTIVO: "NO viniste a...", "Tu misión es..."
Solo JSON válido.`);
  Object.assign(result, chunk1);

  // CHUNK 2: Interpretaciones Sol, Luna, Ascendente, Mercurio
  onProgress?.('☀️ Interpretando Sol, Luna y Ascendente...', 30);
  const chunk2 = await generateChunk(openai, `
Genera interpretaciones PROFUNDAS para ${userProfile.name}:
- Sol: ${sun?.sign} Casa ${sun?.house}
- Luna: ${moon?.sign} Casa ${moon?.house}
- Ascendente: ${chartData.ascendant.sign}
- Mercurio: ${mercury?.sign} Casa ${mercury?.house}

{
  "interpretaciones_planetarias": {
    "sol": {
      "posicion": "${sun?.sign} Casa ${sun?.house}",
      "titulo_arquetipo": "[Título creativo tipo 'La Mística que Transforma']",
      "proposito_vida": "[3-4 párrafos PROFUNDOS]",
      "trampa": "[La trampa de esta posición]",
      "superpoder": "[El superpoder]",
      "afirmacion": "[Mantra]"
    },
    "luna": {
      "posicion": "${moon?.sign} Casa ${moon?.house}",
      "titulo_arquetipo": "[Título]",
      "mundo_emocional": "[2-3 párrafos]",
      "como_se_nutre": "[4-5 formas]",
      "patron_infancia": "[Patrón]",
      "sanacion_emocional": "[Sanación]"
    },
    "ascendente": {
      "posicion": "${chartData.ascendant.sign}",
      "titulo_arquetipo": "[Título]",
      "personalidad_visible": "[2-3 párrafos]",
      "presencia": "[Tipo de presencia]",
      "mascara_vs_esencia": "[Diferencia]"
    },
    "mercurio": {
      "posicion": "${mercury?.sign} Casa ${mercury?.house}",
      "titulo_arquetipo": "[Título]",
      "como_piensa": "[2 párrafos]",
      "fortalezas_mentales": "[4 fortalezas]",
      "desafio": "[Desafío]"
    }
  }
}

Cada interpretación con TÍTULO ARQUETIPO creativo. Solo JSON válido.`);
  result.interpretaciones_planetarias = { ...result.interpretaciones_planetarias, ...chunk2.interpretaciones_planetarias };

  // CHUNK 3: Venus, Marte, Júpiter, Saturno
  onProgress?.('💕 Interpretando Venus, Marte, Júpiter, Saturno...', 45);
  const chunk3 = await generateChunk(openai, `
Genera interpretaciones para ${userProfile.name}:
- Venus: ${venus?.sign} Casa ${venus?.house}
- Marte: ${mars?.sign} Casa ${mars?.house}
- Júpiter: ${jupiter?.sign} Casa ${jupiter?.house}
- Saturno: ${saturn?.sign} Casa ${saturn?.house}

{
  "interpretaciones_planetarias": {
    "venus": { "posicion": "...", "titulo_arquetipo": "...", "como_ama": "...", "que_necesita_en_pareja": "...", "trampa_amorosa": "...", "valores": "..." },
    "marte": { "posicion": "...", "titulo_arquetipo": "...", "como_actua": "...", "energia_vital": "...", "ira": "...", "desafio": "..." },
    "jupiter": { "posicion": "...", "titulo_arquetipo": "...", "donde_viene_suerte": "...", "expansion": "...", "consejo": "..." },
    "saturno": { "posicion": "...", "titulo_arquetipo": "...", "karma_lecciones": "...", "responsabilidad": "...", "recompensa": "..." }
  }
}

Solo JSON válido.`);
  result.interpretaciones_planetarias = { ...result.interpretaciones_planetarias, ...chunk3.interpretaciones_planetarias };

  // CHUNK 4: Transpersonales + Aspectos + Integración
  onProgress?.('🌌 Planetas transpersonales y aspectos...', 60);
  const chunk4 = await generateChunk(openai, `
Para ${userProfile.name}, genera:

{
  "interpretaciones_planetarias": {
    "urano": { "posicion": "...", "donde_revoluciona": "...", "genialidad": "..." },
    "neptuno": { "posicion": "...", "espiritualidad": "...", "ilusion_vs_inspiracion": "..." },
    "pluton": { "posicion": "...", "transformacion": "...", "sombra_y_poder": "..." },
    "quiron": { "posicion": "...", "herida_principal": "...", "don_sanador": "..." }
  },
  "aspectos_destacados": {
    "stelliums": "[Si hay 3+ planetas en mismo signo]",
    "aspectos_tensos": "[2-3 cuadraturas/oposiciones]",
    "aspectos_armoniosos": "[2-3 trígonos/sextiles]",
    "patron_dominante": "[Patrón de la carta]"
  },
  "integracion_carta": {
    "hilo_de_oro": "[Párrafo que UNE todo]",
    "sintesis": "[Frase síntesis]",
    "polaridades": [{ "polo_a": "...", "polo_b": "...", "integracion": "..." }]
  }
}

Solo JSON válido.`);
  result.interpretaciones_planetarias = { ...result.interpretaciones_planetarias, ...chunk4.interpretaciones_planetarias };
  result.aspectos_destacados = chunk4.aspectos_destacados;
  result.integracion_carta = chunk4.integracion_carta;

  // CHUNK 5: Fortalezas, Áreas, Sanación
  onProgress?.('📚 Fortalezas educativas y patrones de sanación...', 75);
  const chunk5 = await generateChunk(openai, `
Para ${userProfile.name} (Sol ${sun?.sign}, Luna ${moon?.sign}, Asc ${chartData.ascendant.sign}):

{
  "fortalezas_educativas": {
    "como_aprende_mejor": ["Condición 1", "Condición 2", "Condición 3", "Condición 4"],
    "inteligencias_dominantes": [{ "tipo": "...", "descripcion": "...", "planeta_origen": "..." }],
    "modalidades_estudio": ["Modalidad 1", "Modalidad 2", "Modalidad 3"]
  },
  "areas_especializacion": [
    { "area": "...", "origen_astrologico": "...", "profesiones": ["...", "...", "..."], "descripcion": "..." },
    { "area": "...", "origen_astrologico": "...", "profesiones": ["...", "..."], "descripcion": "..." },
    { "area": "...", "origen_astrologico": "...", "profesiones": ["...", "..."], "descripcion": "..." }
  ],
  "patrones_sanacion": {
    "heridas": [
      { "nombre": "...", "origen_astrologico": "...", "patron": "...", "origen_infancia": "...", "sanacion": "..." },
      { "nombre": "...", "origen_astrologico": "...", "patron": "...", "origen_infancia": "...", "sanacion": "..." }
    ],
    "ciclos_sanacion_lunar": {
      "luna_nueva": "[Ritual específico]",
      "luna_creciente": "[Práctica]",
      "luna_llena": "[Ritual]",
      "luna_menguante": "[Práctica de soltar]"
    },
    "practicas_integracion": [
      { "practica": "...", "duracion": "...", "beneficio": "...", "fase_lunar": "..." }
    ]
  }
}

Prácticas vinculadas a FASES LUNARES, NO a días de semana. Solo JSON válido.`);
  Object.assign(result, chunk5);

  // CHUNK 6: Amor, Visualización, Agenda, Declaración
  onProgress?.('💕 Manifestación del amor y visualización...', 90);
  const chunk6 = await generateChunk(openai, `
Para ${userProfile.name} (Venus ${venus?.sign}, Luna ${moon?.sign}, Sol ${sun?.sign}):

{
  "manifestacion_amor": {
    "patron_amoroso": "[Párrafo sobre su patrón en amor]",
    "que_atrae": "[Qué tipo de personas atrae]",
    "que_necesita": "[Qué necesita en pareja]",
    "trampa_amorosa": "[Patrón negativo]",
    "ritual_luna_nueva_venus": {
      "preparacion": "[Instrucciones - Luna Nueva en Libra]",
      "activacion_28_dias": "[Práctica durante ciclo lunar]",
      "entrega_luna_llena": "[Ritual de entrega]"
    },
    "declaracion_amor": "[Declaración poderosa tipo: 'Merezco un amor que...']"
  },
  "visualizacion_guiada": {
    "titulo": "Encuentro con tu Carta Natal",
    "duracion": "15-20 minutos",
    "mejor_momento": "Luna Llena o cumpleaños solar",
    "preparacion": ["Espacio tranquilo, luz de vela", "Carta natal visible", "Cuaderno cerca"],
    "texto": "[Texto COMPLETO de visualización de 200-250 palabras personalizado con Sol ${sun?.sign}, Luna ${moon?.sign}, Ascendente ${chartData.ascendant.sign}]"
  },
  "datos_para_agenda": {
    "eventos_lunares_personalizados": [
      { "evento": "Luna Nueva en ${sun?.sign}", "significado": "...", "ritual": "...", "intencion": "..." },
      { "evento": "Luna Llena en ${moon?.sign}", "significado": "...", "ritual": "...", "intencion": "..." }
    ],
    "practicas_por_fase": {
      "luna_nueva": ["...", "..."],
      "cuarto_creciente": ["...", "..."],
      "luna_llena": ["...", "..."],
      "cuarto_menguante": ["...", "..."]
    },
    "dias_poder": [
      { "cuando": "Luna transita ${sun?.sign}", "que_hacer": "...", "que_evitar": "..." }
    ],
    "advertencias_cosmicas": [
      { "situacion": "Mercurio Retrógrado", "como_afecta": "...", "precauciones": "..." }
    ]
  },
  "declaracion_poder_final": "[5-6 líneas ÉPICAS en primera persona. Terminar con 'Este es mi mapa. Esta es mi magia. Esta SOY YO.']",
  "mantra_personal": "[Frase corta: 'SOY FUEGO que transforma...']"
}

Solo JSON válido.`);
  Object.assign(result, chunk6);

  onProgress?.('✨ ¡Interpretación completa lista!', 100);
  console.log('🎯 [CHUNKED NATAL] All chunks completed');

  return result as CartaNatalCompleta;
}

// Helper function for chunk generation
async function generateChunk(openai: OpenAI, prompt: string): Promise<any> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Eres un astrólogo experto. Responde SOLO con JSON válido, sin texto adicional. Lenguaje DISRUPTIVO y EMPODERADOR.'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.8,
    max_tokens: 4000,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No content in chunk response');

  return JSON.parse(content);
}

export { type ChartData, type UserProfile };
