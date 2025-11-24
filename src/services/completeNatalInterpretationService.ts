// =============================================================================
// 🎯 COMPLETE NATAL INTERPRETATION SERVICE
// src/services/completeNatalInterpretationService.ts
// Genera interpretación completa con todas las secciones
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
// TYPES
// =============================================================================

export interface InterpretacionPlaneta {
  posicion: {
    signo: string;
    casa: number;
    grado: number;
  };
  educativo: string;
  poderoso: string;
  poetico: string;
  sombras: Array<{
    nombre: string;
    patron: string;
    trampa: string;
    regalo: string;
  }>;
  sintesis: {
    frase: string;
    declaracion: string;
  };
}

export interface CartaNatalCompleta {
  puntos_fundamentales: {
    sol: { signo: string; grado: number; casa: number; superpoder: string };
    luna: { signo: string; grado: number; casa: number; superpoder: string };
    ascendente: { signo: string; grado: number; superpoder: string };
    medio_cielo: { signo: string; grado: number; superpoder: string };
    nodo_norte: { signo: string; grado: number; casa: number; superpoder: string };
    nodo_sur: { signo: string; grado: number; casa: number; superpoder: string };
  };

  sintesis_elemental: {
    fuego: { porcentaje: number; planetas: string[]; significado: string };
    tierra: { porcentaje: number; planetas: string[]; significado: string };
    aire: { porcentaje: number; planetas: string[]; significado: string };
    agua: { porcentaje: number; planetas: string[]; significado: string };
    elemento_dominante: string;
    elemento_escaso: string;
    configuracion_alquimica: string;
  };

  modalidades: {
    cardinal: { porcentaje: number; significado: string };
    fijo: { porcentaje: number; significado: string };
    mutable: { porcentaje: number; significado: string };
    ritmo_accion: string;
  };

  esencia_revolucionaria: string;

  proposito_vida: {
    nodo_norte: {
      signo: string;
      casa: number;
      mision: string;
      habilidades_activar: string[];
    };
    nodo_sur: {
      signo: string;
      casa: number;
      zona_confort: string;
      patrones_soltar: string[];
    };
    salto_evolutivo: {
      de: string;
      a: string;
    };
  };

  interpretaciones: {
    sol: InterpretacionPlaneta;
    luna: InterpretacionPlaneta;
    ascendente: InterpretacionPlaneta;
    medio_cielo: InterpretacionPlaneta;
    mercurio: InterpretacionPlaneta;
    venus: InterpretacionPlaneta;
    marte: InterpretacionPlaneta;
    jupiter: InterpretacionPlaneta;
    saturno: InterpretacionPlaneta;
    urano: InterpretacionPlaneta;
    neptuno: InterpretacionPlaneta;
    pluton: InterpretacionPlaneta;
    quiron: InterpretacionPlaneta;
    lilith: InterpretacionPlaneta;
    nodo_norte: InterpretacionPlaneta;
  };

  fortalezas_educativas: {
    como_aprendes_mejor: string[];
    inteligencias_dominantes: Array<{
      tipo: string;
      descripcion: string;
      planeta_origen: string;
    }>;
    modalidades_estudio: string[];
  };

  areas_especializacion: Array<{
    area: string;
    planetas_origen: string;
    profesiones_sugeridas: string[];
  }>;

  patrones_sanacion: {
    heridas: Array<{
      nombre: string;
      planeta_origen: string;
      patron: string;
      origen_infancia: string;
      como_se_manifiesta: string[];
      sanacion: string;
    }>;
  };

  manifestacion_amor: {
    patron_amoroso: string;
    que_atraes: string;
    que_necesitas: string;
    trampa_amorosa: string;
    leccion_amorosa: string;
    declaracion_amor: string;
  };

  visualizacion: {
    duracion: string;
    mejor_momento: string;
    preparacion: string[];
    texto_visualizacion: string;
  };

  declaracion_poder: string;

  datos_para_agenda: {
    heridas_para_ciclos_lunares: string[];
    ritual_amor_luna_optima: string;
    temas_principales: string[];
  };
}

// =============================================================================
// OPENAI CLIENT
// =============================================================================

function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// =============================================================================
// MAIN GENERATION FUNCTION
// =============================================================================

export async function generateCompleteNatalInterpretation(
  chartData: ChartData,
  userProfile: UserProfile,
  onProgress?: (message: string, percentage: number) => void
): Promise<CartaNatalCompleta> {
  console.log('🎯 [COMPLETE NATAL] Starting generation for:', userProfile.name);

  const openai = getOpenAIClient();

  onProgress?.('🌟 Preparando tu interpretación completa...', 5);

  // Generate the complete prompt
  const prompt = generateCompleteNatalChartPrompt(chartData, userProfile);

  console.log('🎯 [COMPLETE NATAL] Prompt length:', prompt.length);

  onProgress?.('✨ Consultando los astros para tu carta completa...', 15);

  try {
    // Call OpenAI with the complete prompt
    // Using GPT-4o for best JSON generation
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Eres un astrólogo evolutivo DISRUPTIVO experto.
Generas interpretaciones TRANSFORMACIONALES con lenguaje que EMPODERA.
Respondes ÚNICAMENTE con JSON válido sin texto adicional.
Usas el nombre del usuario en los textos.
Tu estilo mezcla: EDUCATIVO (claro) + PODEROSO (transformacional) + POÉTICO (metáforas).`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.85,
      max_tokens: 16000, // Maximum for complete interpretation
      response_format: { type: 'json_object' },
    });

    onProgress?.('🔮 Procesando tu mapa cósmico...', 70);

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    console.log('🎯 [COMPLETE NATAL] Response received, length:', response.length);

    // Parse JSON response
    let parsedResponse: CartaNatalCompleta;

    try {
      // Clean response if needed
      let cleanedResponse = response.trim();

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
      }

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('🎯 [COMPLETE NATAL] JSON parse error:', parseError);
      console.error('🎯 [COMPLETE NATAL] Raw response (first 500 chars):', response.substring(0, 500));
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    onProgress?.('✨ ¡Interpretación completa generada!', 100);

    console.log('🎯 [COMPLETE NATAL] Successfully generated complete interpretation');
    console.log('🎯 [COMPLETE NATAL] Sections:', Object.keys(parsedResponse));

    return parsedResponse;

  } catch (error) {
    console.error('🎯 [COMPLETE NATAL] Error:', error);
    throw error;
  }
}

// =============================================================================
// CHUNKED GENERATION (Alternative for very long responses)
// =============================================================================

export async function generateCompleteNatalInterpretationChunked(
  chartData: ChartData,
  userProfile: UserProfile,
  onProgress?: (message: string, percentage: number) => void
): Promise<CartaNatalCompleta> {
  console.log('🎯 [CHUNKED NATAL] Starting chunked generation for:', userProfile.name);

  const openai = getOpenAIClient();

  // Calculate elements and modalities first (local calculation)
  const elementos = calculateElementDistribution(chartData.planets);
  const modalidades = calculateModalityDistribution(chartData.planets);

  // Initialize result object
  const result: Partial<CartaNatalCompleta> = {};

  // CHUNK 1: Core sections (puntos_fundamentales, sintesis, modalidades, esencia)
  onProgress?.('🌟 Generando tu síntesis elemental...', 10);
  const chunk1 = await generateChunk1(openai, chartData, userProfile, elementos, modalidades);
  Object.assign(result, chunk1);

  // CHUNK 2: Propósito de vida y interpretaciones principales
  onProgress?.('✨ Descifrando tu propósito de vida...', 30);
  const chunk2 = await generateChunk2(openai, chartData, userProfile);
  Object.assign(result, chunk2);

  // CHUNK 3: Interpretaciones planetarias (Sol, Luna, Asc, MC)
  onProgress?.('🪐 Interpretando tus planetas personales...', 50);
  const chunk3 = await generateChunk3(openai, chartData, userProfile);
  result.interpretaciones = { ...result.interpretaciones, ...chunk3 } as any;

  // CHUNK 4: Resto de planetas + Quirón + Lilith
  onProgress?.('🌌 Explorando tus planetas transpersonales...', 65);
  const chunk4 = await generateChunk4(openai, chartData, userProfile);
  result.interpretaciones = { ...result.interpretaciones, ...chunk4 } as any;

  // CHUNK 5: Fortalezas, áreas, sanación, amor
  onProgress?.('💫 Revelando tus fortalezas y patrones...', 80);
  const chunk5 = await generateChunk5(openai, chartData, userProfile);
  Object.assign(result, chunk5);

  // CHUNK 6: Visualización y declaración final
  onProgress?.('🔮 Preparando tu declaración de poder...', 95);
  const chunk6 = await generateChunk6(openai, chartData, userProfile);
  Object.assign(result, chunk6);

  onProgress?.('✨ ¡Interpretación completa lista!', 100);

  console.log('🎯 [CHUNKED NATAL] All chunks completed');

  return result as CartaNatalCompleta;
}

// =============================================================================
// CHUNK GENERATION HELPERS
// =============================================================================

async function generateChunk1(
  openai: OpenAI,
  chartData: ChartData,
  userProfile: UserProfile,
  elementos: ReturnType<typeof calculateElementDistribution>,
  modalidades: ReturnType<typeof calculateModalityDistribution>
): Promise<Pick<CartaNatalCompleta, 'puntos_fundamentales' | 'sintesis_elemental' | 'modalidades' | 'esencia_revolucionaria'>> {

  const sol = chartData.planets.find(p => p.name.toLowerCase().includes('sol'));
  const luna = chartData.planets.find(p => p.name.toLowerCase().includes('luna'));
  const nodoNorte = chartData.planets.find(p => p.name.toLowerCase().includes('nodo norte'));
  const nodoSur = chartData.planets.find(p => p.name.toLowerCase().includes('nodo sur'));

  const prompt = `Genera JSON para la carta natal de ${userProfile.name}:

DATOS:
- Sol: ${sol?.sign} Casa ${sol?.house}
- Luna: ${luna?.sign} Casa ${luna?.house}
- Ascendente: ${chartData.ascendant.sign}
- MC: ${chartData.midheaven.sign}
- Nodo Norte: ${nodoNorte?.sign} Casa ${nodoNorte?.house}
- Fuego: ${elementos.fire.percentage}%, Tierra: ${elementos.earth.percentage}%, Aire: ${elementos.air.percentage}%, Agua: ${elementos.water.percentage}%
- Cardinal: ${modalidades.cardinal.percentage}%, Fijo: ${modalidades.fixed.percentage}%, Mutable: ${modalidades.mutable.percentage}%

Genera JSON con:
{
  "puntos_fundamentales": { sol, luna, ascendente, medio_cielo, nodo_norte, nodo_sur - cada uno con signo, grado, casa, superpoder },
  "sintesis_elemental": { fuego, tierra, aire, agua - cada uno con porcentaje, planetas[], significado + elemento_dominante, elemento_escaso, configuracion_alquimica },
  "modalidades": { cardinal, fijo, mutable - cada uno con porcentaje, significado + ritmo_accion },
  "esencia_revolucionaria": "Texto DISRUPTIVO 8-12 líneas empezando con '¡${userProfile.name.toUpperCase()}, NO VINISTE A ENCAJAR!'"
}

ESTILO: Disruptivo, transformacional, usa MAYÚSCULAS estratégicamente.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Astrólogo evolutivo disruptivo. Solo JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response for chunk 1');

  return JSON.parse(response);
}

async function generateChunk2(
  openai: OpenAI,
  chartData: ChartData,
  userProfile: UserProfile
): Promise<Pick<CartaNatalCompleta, 'proposito_vida'>> {

  const nodoNorte = chartData.planets.find(p => p.name.toLowerCase().includes('nodo norte'));
  const nodoSur = chartData.planets.find(p => p.name.toLowerCase().includes('nodo sur'));

  const prompt = `Genera JSON de propósito de vida para ${userProfile.name}:

NODO NORTE: ${nodoNorte?.sign} Casa ${nodoNorte?.house}
NODO SUR: ${nodoSur?.sign} Casa ${nodoSur?.house}

JSON:
{
  "proposito_vida": {
    "nodo_norte": { signo, casa, mision (4-6 líneas DISRUPTIVAS), habilidades_activar: [4 items] },
    "nodo_sur": { signo, casa, zona_confort (texto), patrones_soltar: [3 items] },
    "salto_evolutivo": { de: "frase corta", a: "frase corta" }
  }
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Astrólogo evolutivo disruptivo. Solo JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response for chunk 2');

  return JSON.parse(response);
}

async function generateChunk3(
  openai: OpenAI,
  chartData: ChartData,
  userProfile: UserProfile
): Promise<Pick<CartaNatalCompleta['interpretaciones'], 'sol' | 'luna' | 'ascendente' | 'medio_cielo'>> {

  const sol = chartData.planets.find(p => p.name.toLowerCase().includes('sol'));
  const luna = chartData.planets.find(p => p.name.toLowerCase().includes('luna'));

  const prompt = `Genera interpretaciones completas para ${userProfile.name}:

SOL: ${sol?.sign} Casa ${sol?.house} (${sol?.degree}°)
LUNA: ${luna?.sign} Casa ${luna?.house} (${luna?.degree}°)
ASCENDENTE: ${chartData.ascendant.sign} (${chartData.ascendant.degree}°)
MEDIO CIELO: ${chartData.midheaven.sign} (${chartData.midheaven.degree}°)

Para CADA UNO genera:
{
  "sol": {
    "posicion": { signo, casa, grado },
    "educativo": "6-8 líneas explicando qué es, qué significa en ese signo/casa",
    "poderoso": "8-10 líneas DISRUPTIVAS con '¡NO VINISTE A...!' y MAYÚSCULAS",
    "poetico": "4-6 líneas metafóricas hermosas",
    "sombras": [{ nombre, patron, trampa: "❌ ...", regalo: "✅ ..." }, ...],
    "sintesis": { frase: "15 palabras máx", declaracion: "YO SOY... 2-4 líneas" }
  },
  "luna": { ... mismo formato ... },
  "ascendente": { ... mismo formato ... },
  "medio_cielo": { ... mismo formato ... }
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Astrólogo evolutivo disruptivo. Solo JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 6000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response for chunk 3');

  return JSON.parse(response);
}

async function generateChunk4(
  openai: OpenAI,
  chartData: ChartData,
  userProfile: UserProfile
): Promise<Partial<CartaNatalCompleta['interpretaciones']>> {

  const getPlanet = (name: string) => chartData.planets.find(p =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );

  const mercurio = getPlanet('mercurio');
  const venus = getPlanet('venus');
  const marte = getPlanet('marte');
  const jupiter = getPlanet('jupiter') || getPlanet('júpiter');
  const saturno = getPlanet('saturno');
  const urano = getPlanet('urano');
  const neptuno = getPlanet('neptuno');
  const pluton = getPlanet('pluton') || getPlanet('plutón');
  const quiron = getPlanet('quiron') || getPlanet('quirón') || getPlanet('chiron');
  const lilith = getPlanet('lilith');
  const nodoNorte = getPlanet('nodo norte');

  const prompt = `Genera interpretaciones para ${userProfile.name}:

MERCURIO: ${mercurio?.sign} Casa ${mercurio?.house}
VENUS: ${venus?.sign} Casa ${venus?.house}
MARTE: ${marte?.sign} Casa ${marte?.house}
JÚPITER: ${jupiter?.sign} Casa ${jupiter?.house}
SATURNO: ${saturno?.sign} Casa ${saturno?.house}
URANO: ${urano?.sign} Casa ${urano?.house}
NEPTUNO: ${neptuno?.sign} Casa ${neptuno?.house}
PLUTÓN: ${pluton?.sign} Casa ${pluton?.house}
QUIRÓN: ${quiron?.sign} Casa ${quiron?.house}
LILITH: ${lilith?.sign} Casa ${lilith?.house}
NODO NORTE: ${nodoNorte?.sign} Casa ${nodoNorte?.house}

Para CADA planeta genera (mismo formato):
{
  "mercurio": { posicion, educativo, poderoso, poetico, sombras[], sintesis },
  "venus": { ... },
  "marte": { ... },
  "jupiter": { ... },
  "saturno": { ... },
  "urano": { ... },
  "neptuno": { ... },
  "pluton": { ... },
  "quiron": { ... herida sagrada, sanador herido ... },
  "lilith": { ... poder femenino oculto ... },
  "nodo_norte": { ... }
}

ESTILO: Disruptivo, "¡NO VINISTE A...!", MAYÚSCULAS, sombras con trampa/regalo.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Astrólogo evolutivo disruptivo. Solo JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 8000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response for chunk 4');

  return JSON.parse(response);
}

async function generateChunk5(
  openai: OpenAI,
  chartData: ChartData,
  userProfile: UserProfile
): Promise<Pick<CartaNatalCompleta, 'fortalezas_educativas' | 'areas_especializacion' | 'patrones_sanacion' | 'manifestacion_amor'>> {

  const sol = chartData.planets.find(p => p.name.toLowerCase().includes('sol'));
  const luna = chartData.planets.find(p => p.name.toLowerCase().includes('luna'));
  const venus = chartData.planets.find(p => p.name.toLowerCase().includes('venus'));
  const marte = chartData.planets.find(p => p.name.toLowerCase().includes('marte'));
  const mercurio = chartData.planets.find(p => p.name.toLowerCase().includes('mercurio'));

  const prompt = `Genera secciones especiales para ${userProfile.name}:

SOL: ${sol?.sign} Casa ${sol?.house}
LUNA: ${luna?.sign} Casa ${luna?.house}
VENUS: ${venus?.sign} Casa ${venus?.house}
MARTE: ${marte?.sign} Casa ${marte?.house}
MERCURIO: ${mercurio?.sign} Casa ${mercurio?.house}
ASCENDENTE: ${chartData.ascendant.sign}

JSON:
{
  "fortalezas_educativas": {
    "como_aprendes_mejor": ["4-5 items específicos basados en la carta"],
    "inteligencias_dominantes": [{ tipo, descripcion, planeta_origen }, ...],
    "modalidades_estudio": ["3-4 recomendaciones"]
  },
  "areas_especializacion": [
    { area: "nombre área", planetas_origen: "qué planetas", profesiones_sugeridas: ["3 profesiones"] },
    { ... 2 más ... }
  ],
  "patrones_sanacion": {
    "heridas": [
      { nombre: "La Herida de...", planeta_origen, patron, origen_infancia, como_se_manifiesta: ["3 items"], sanacion },
      { ... otra herida ... }
    ]
  },
  "manifestacion_amor": {
    "patron_amoroso": "texto basado en Venus + Luna + Marte",
    "que_atraes": "...",
    "que_necesitas": "...",
    "trampa_amorosa": "...",
    "leccion_amorosa": "...",
    "declaracion_amor": "3-4 líneas empezando con 'Merezco un amor que...'"
  }
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Astrólogo evolutivo disruptivo. Solo JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response for chunk 5');

  return JSON.parse(response);
}

async function generateChunk6(
  openai: OpenAI,
  chartData: ChartData,
  userProfile: UserProfile
): Promise<Pick<CartaNatalCompleta, 'visualizacion' | 'declaracion_poder' | 'datos_para_agenda'>> {

  const sol = chartData.planets.find(p => p.name.toLowerCase().includes('sol'));
  const luna = chartData.planets.find(p => p.name.toLowerCase().includes('luna'));

  const prompt = `Genera secciones finales para ${userProfile.name}:

SOL: ${sol?.sign}
LUNA: ${luna?.sign}
ASCENDENTE: ${chartData.ascendant.sign}

JSON:
{
  "visualizacion": {
    "duracion": "15-20 minutos",
    "mejor_momento": "Luna Llena o cumpleaños solar",
    "preparacion": ["3-4 instrucciones"],
    "texto_visualizacion": "Texto completo de visualización guiada (8-12 líneas) personalizado para ${userProfile.name}, mencionando su Sol en ${sol?.sign}, Luna en ${luna?.sign}, Ascendente ${chartData.ascendant.sign}. Que sea hermoso y transformador."
  },
  "declaracion_poder": "Texto ÉPICO de 10-14 líneas. Empieza con 'YO SOY la que/el que...'. Fusiona toda la carta. Usa MAYÚSCULAS. Termina impactante como '¡Y ASÍ ES!' o 'NO PIDO PERMISO PARA SER TODO YO.'",
  "datos_para_agenda": {
    "heridas_para_ciclos_lunares": ["nombre herida 1", "nombre herida 2"],
    "ritual_amor_luna_optima": "Luna Nueva en [signo de Venus o Casa 7]",
    "temas_principales": ["3 temas clave de la carta"]
  }
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Astrólogo evolutivo disruptivo. Solo JSON válido.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.85,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) throw new Error('No response for chunk 6');

  return JSON.parse(response);
}
