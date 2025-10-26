// src/app/api/astrology/interpret-natal/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';
import {
  generateDisruptiveNatalPrompt,
  formatChartForPrompt,
  type ChartData,
  type UserProfile
} from '@/utils/prompts/disruptivePrompts';

// Cache en memoria
const interpretationCache = new Map<string, { interpretation: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

interface NatalInterpretationRequest {
  userId: string;
  natalChart: ChartData;
  userProfile: UserProfile;
  regenerate?: boolean;
  disruptiveMode?: boolean;
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Helper para significados de casas
function getCasaMeaning(house: any): string {
  const meanings: { [key: number]: string } = {
    1: 'identidad y presencia',
    2: 'recursos y valores',
    3: 'comunicación y aprendizaje',
    4: 'hogar y raíces',
    5: 'creatividad y romance',
    6: 'trabajo y salud',
    7: 'relaciones y asociaciones',
    8: 'transformación profunda',
    9: 'sabiduría y expansión',
    10: 'carrera y legado',
    11: 'comunidad e ideales',
    12: 'espiritualidad y liberación'
  };
  return meanings[Number(house)] || 'tu zona de poder';
}

// ✅ FUNCIÓN ACTUALIZADA CON LOGS
async function generateDisruptiveInterpretation(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<any> {
  const openai = getOpenAIClient();
  const prompt = generateDisruptiveNatalPrompt(chartData, userProfile);

  // ✅ LOGS INICIALES
  console.log('🤖 === LLAMANDO A OPENAI PARA INTERPRETACIÓN ===');
  console.log('👤 Usuario:', userProfile.name);
  console.log('🪐 Planetas enviados:', chartData.planets?.length);
  console.log('🏠 Planetas con casa definida:', chartData.planets?.filter(p => p.houseNumber || p.house).length);
  console.log('📝 Longitud del prompt:', prompt.length, 'caracteres');
  console.log('📄 Preview del prompt (primeros 200 chars):', prompt.substring(0, 200) + '...');

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo evolutivo revolucionario siguiendo el sistema de TuVueltaAlSol.es. CRÍTICO: Debes responder con JSON válido COMPLETO. Asegúrate de cerrar TODAS las strings, arrays y objetos. Si te quedas sin espacio, prioriza completar el JSON correctamente aunque acortes contenido. Mantén un tono disruptivo pero educativo, como en los ejemplos proporcionados."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 8000,
    });

    const response = completion.choices[0]?.message?.content;

    // ✅ LOGS DE RESPUESTA
    console.log('✅ RESPUESTA DE OPENAI RECIBIDA');
    console.log('📏 Longitud de respuesta:', response?.length || 0, 'caracteres');
    console.log('🔤 Primeros 300 chars:', response?.substring(0, 300));
    console.log('🔤 Últimos 200 chars:', response?.substring((response?.length || 0) - 200));

    if (!response) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    // Limpiar respuesta
    let cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // ✅ INTENTAR REPARAR JSON INCOMPLETO
    if (!cleanedResponse.endsWith('}')) {
      console.warn('⚠️ JSON incompleto detectado, intentando reparar...');
      
      const openBraces = (cleanedResponse.match(/{/g) || []).length;
      const closeBraces = (cleanedResponse.match(/}/g) || []).length;
      const missing = openBraces - closeBraces;
      
      console.log(`🔧 Faltan ${missing} llaves de cierre`);
      
      // Cerrar strings abiertas
      const openQuotes = (cleanedResponse.match(/"/g) || []).length;
      if (openQuotes % 2 !== 0) {
        console.log('🔧 Cerrando comilla abierta');
        cleanedResponse += '"';
      }
      
      // Cerrar llaves faltantes
      for (let i = 0; i < missing; i++) {
        cleanedResponse += '}';
      }
      
      console.log('✅ JSON reparado, intentando parsear...');
    }

    try {
      const parsed = JSON.parse(cleanedResponse);
      
      // ✅ LOGS DE ÉXITO
      console.log('✅ JSON PARSEADO EXITOSAMENTE');
      console.log('🔑 Claves principales:', Object.keys(parsed));
      console.log('🪐 Planetas interpretados:', Object.keys(parsed.planetas || {}));
      
      return parsed;
      
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('📄 Respuesta problemática (primeros 500):', cleanedResponse.substring(0, 500));
      console.error('📄 Respuesta problemática (últimos 300):', cleanedResponse.substring(Math.max(0, cleanedResponse.length - 300)));
      throw new Error('Respuesta de IA no válida - JSON malformado');
    }

  } catch (error) {
    console.error('❌ Error en llamada a OpenAI:', error);
    throw error;
  }
}

// Fallback con datos reales
function generateFallbackInterpretation(userProfile: UserProfile, chartData: ChartData): any {
  console.log('📋 Generando interpretación de fallback con datos reales');
  
  const sun = chartData.planets?.find(p => p.name === 'Sol' || p.name === 'Sun');
  const moon = chartData.planets?.find(p => p.name === 'Luna' || p.name === 'Moon');
  const mercury = chartData.planets?.find(p => p.name === 'Mercurio' || p.name === 'Mercury');
  const venus = chartData.planets?.find(p => p.name === 'Venus');
  const mars = chartData.planets?.find(p => p.name === 'Marte' || p.name === 'Mars');

  const getHouse = (planet: any) => planet?.houseNumber || planet?.house || '?';

  return {
    esencia_revolucionaria: `${userProfile.name}, con tu Sol en ${sun?.sign || 'tu signo'} Casa ${getHouse(sun)}, eres una fuerza única de transformación en el área de ${getCasaMeaning(getHouse(sun))}.`,
    
    proposito_vida: `Tu misión en este planeta es activar el potencial humano a través de tu autenticidad radical en ${getCasaMeaning(getHouse(sun))}.`,
    
    planetas: {
      sol: {
        titulo: `☉ Sol en ${sun?.sign || 'Tu Signo'} ${sun?.degree ? sun.degree.toFixed(1) + '°' : ''} - Casa ${getHouse(sun)} → A qué has venido a este mundo`,
        posicion_tecnica: `${sun?.degree?.toFixed(0) || '?'}° ${sun?.sign || '?'} - Casa ${getHouse(sun)} (${getCasaMeaning(getHouse(sun))})`,
        descripcion: `${userProfile.name}, tu Sol en ${sun?.sign || 'tu signo'} en Casa ${getHouse(sun)} define tu propósito vital.\n\nCasa ${getHouse(sun)} es el área de ${getCasaMeaning(getHouse(sun))}. Esto significa que tu esencia se manifiesta principalmente en esta zona de tu vida.\n\nNo viniste a ser como otros esperan - viniste a manifestar tu verdad única desde esta posición específica de poder.`,
        poder_especifico: `Tu Sol en Casa ${getHouse(sun)} te da poder natural para brillar en ${getCasaMeaning(getHouse(sun))}. Este es tu superpoder más visible.`,
        accion_inmediata: `Hoy, pregúntate: '¿Estoy usando mi Casa ${getHouse(sun)} para brillar o para esconderme?' Da un paso concreto hacia tu autenticidad en esta área.`,
        ritual: `Ritual solar: Cada mañana, declara en voz alta: 'Hoy activo mi poder en ${getCasaMeaning(getHouse(sun))} sin disculpas.'`
      },
      
      luna: {
        titulo: `☽ Luna en ${moon?.sign || 'Tu Signo'} ${moon?.degree ? moon.degree.toFixed(1) + '°' : ''} - Casa ${getHouse(moon)} → Tus emociones`,
        posicion_tecnica: `${moon?.degree?.toFixed(0) || '?'}° ${moon?.sign || '?'} - Casa ${getHouse(moon)} (${getCasaMeaning(getHouse(moon))})`,
        descripcion: `${userProfile.name}, tu Luna en ${moon?.sign || 'tu signo'} en Casa ${getHouse(moon)} revela tu naturaleza emocional.\n\nTus emociones se activan especialmente en ${getCasaMeaning(getHouse(moon))}. No es debilidad - es tu brújula interna más precisa.\n\nCuando honras tu Luna aquí, encuentras tu verdadero refugio emocional.`,
        poder_especifico: `Tu Luna en Casa ${getHouse(moon)} te da inteligencia emocional profunda en esta área. Sabes leer energías donde otros están ciegos.`,
        accion_inmediata: `Esta semana, cuando sientas algo intenso relacionado con ${getCasaMeaning(getHouse(moon))}, pregúntate: '¿Qué intenta enseñarme mi Luna?' Anota la respuesta.`,
        ritual: `Ritual lunar: En Luna Llena, escribe emociones que ya no te sirven. En Luna Nueva, siembra intenciones para nutrir esta área.`
      }
    },
    
    integracion_carta: {
      titulo: "Integración de tu Carta Natal",
      sintesis: `${userProfile.name}, tu carta revela un camino único de liderazgo y transformación. Con ${chartData.planets?.length || 10} planetas activando diferentes áreas, eres multidimensional - no te limites a un solo rol.`,
      elementos_destacados: [
        `Sol en Casa ${getHouse(sun)} - Tu zona de máximo poder`,
        `Luna en Casa ${getHouse(moon)} - Tu brújula emocional`
      ],
      camino_evolutivo: `Tu configuración te invita a integrar tu identidad pública (Sol) con tus necesidades emocionales (Luna), creando un camino de autenticidad radical.`
    },
    
    plan_accion: {
      hoy_mismo: [
        `Activa tu Sol en Casa ${getHouse(sun)} - haz una cosa que te haga brillar en ${getCasaMeaning(getHouse(sun))}`,
        `Honra tu Luna en Casa ${getHouse(moon)} - identifica una necesidad emocional y atiéndela`,
        `Declara en voz alta: "Hoy soy auténtica/o en todas mis áreas de vida"`
      ],
      esta_semana: [
        `Inicia una conversación importante en ${getCasaMeaning(getHouse(mercury))}`,
        `Invierte en lo que realmente valoras (Casa ${getHouse(venus)})`,
        `Establece un límite claro donde has estado cediendo`
      ],
      este_mes: [
        `Lanza un proyecto que refleje tu verdad en Casa ${getHouse(sun)}`,
        `Transforma completamente un área que está pidiendo regeneración`,
        `Invierte en formación que potencie tu zona de abundancia natural`
      ]
    },
    
    declaracion_poder: `YO, ${userProfile.name.toUpperCase()}, SOY UN CANAL DE TRANSFORMACIÓN EN ${getCasaMeaning(getHouse(sun)).toUpperCase()}. MI AUTENTICIDAD ES MI REVOLUCIÓN.`,
    
    advertencias: [
      `${userProfile.name}, tu mayor limitación es NO activar tu poder en Casa ${getHouse(sun)}. Deja de jugar pequeña.`,
      `Tu Luna pide que honres tus emociones en ${getCasaMeaning(getHouse(moon))} - deja de ignorar tu brújula interna.`,
      `El atajo no existe - tu maestría requiere trabajo profundo y constante.`
    ],
    
    insights_transformacionales: [
      `Tu Sol en Casa ${getHouse(sun)} es tu zona de máximo poder - cuando la activas conscientemente, todo se alinea.`,
      `Luna en Casa ${getHouse(moon)} te revela que tus emociones son tu brújula más precisa - confía en lo que sientes.`,
      `Eres multidimensional - no te limites a un solo rol o identidad.`,
      `Tu configuración es tu mapa de posibilidades, no tu destino fijo - tú decides qué activas cada día.`
    ],
    
    rituales_recomendados: [
      `Ritual Solar Diario: Cada mañana, activa conscientemente Casa ${getHouse(sun)} como tu prioridad.`,
      `Ritual Lunar Mensual: En Lunas Nuevas y Llenas, trabaja las emociones de Casa ${getHouse(moon)}.`,
      `Ritual Anual de Revisión: En tu cumpleaños, revisa cómo has usado tus casas principales.`
    ]
  };
}

export async function POST(request: NextRequest) {
  console.log('🌟 [INTERPRET-NATAL] Iniciando interpretación natal');

  try {
    const body: NatalInterpretationRequest = await request.json();
    const { userId, natalChart, userProfile, regenerate = false, disruptiveMode = true } = body;

    if (!userId || !natalChart || !userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos'
      }, { status: 400 });
    }

    // Verificar caché
    const cacheKey = `natal_${userId}_${disruptiveMode ? 'disruptive' : 'standard'}`;
    if (!regenerate) {
      const cached = interpretationCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log('✅ [INTERPRET-NATAL] Usando interpretación en caché');
        return NextResponse.json({
          success: true,
          data: {
            interpretation: cached.interpretation,
            cached: true,
            generatedAt: new Date(cached.timestamp).toISOString(),
            method: 'cached'
          }
        });
      }
    }

    let interpretation: any;

    // Generar interpretación
    if (disruptiveMode && process.env.OPENAI_API_KEY) {
      console.log('🔥 [INTERPRET-NATAL] Modo disruptivo con IA activado');
      try {
        interpretation = await generateDisruptiveInterpretation(natalChart, userProfile);
      } catch (error) {
        console.warn('⚠️ [INTERPRET-NATAL] IA falló, usando fallback:', error);
        interpretation = generateFallbackInterpretation(userProfile, natalChart);
      }
    } else {
      console.log('📋 [INTERPRET-NATAL] Usando fallback con datos reales');
      interpretation = generateFallbackInterpretation(userProfile, natalChart);
    }

    // Guardar en caché
    interpretationCache.set(cacheKey, {
      interpretation,
      timestamp: Date.now()
    });

    // ✅ SAVE TO MONGODB FOR PERSISTENCE
    try {
      await connectDB();

      // Check for recent duplicate (within 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentDuplicate = await Interpretation.findOne({
        userId,
        chartType: 'natal',
        generatedAt: { $gte: fiveMinutesAgo }
      });

      if (recentDuplicate) {
        console.log('⚠️ Duplicate prevention: Skipping save (interpretation generated within last 5 minutes)');
      } else {
        // Save new interpretation
        const expirationDate = new Date(Date.now() + CACHE_DURATION);

        await Interpretation.create({
          userId,
          chartType: 'natal',
          userProfile: {
            name: userProfile.name,
            age: userProfile.age,
            birthPlace: userProfile.birthPlace,
            birthDate: userProfile.birthDate,
            birthTime: userProfile.birthTime
          },
          interpretation,
          generatedAt: new Date(),
          expiresAt: expirationDate,
          method: disruptiveMode ? 'openai_disruptive' : 'fallback_with_real_data',
          isActive: true
        });

        console.log('✅ [INTERPRET-NATAL] Interpretación guardada en MongoDB');
      }

    } catch (dbError) {
      // Don't fail if MongoDB save fails, cache is enough
      console.warn('⚠️ [INTERPRET-NATAL] No se pudo guardar en MongoDB:', dbError);
    }

    console.log('✅ [INTERPRET-NATAL] Interpretación generada exitosamente');

    return NextResponse.json({
      success: true,
      data: {
        interpretation,
        cached: false,
        generatedAt: new Date().toISOString(),
        method: disruptiveMode ? 'openai_disruptive' : 'fallback_with_real_data'
      }
    });

  } catch (error) {
    console.error('❌ [INTERPRET-NATAL] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}