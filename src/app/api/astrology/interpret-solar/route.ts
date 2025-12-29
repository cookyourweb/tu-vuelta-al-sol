// src/app/api/astrology/interpret-solar/route.ts
// ENDPOINT PARA INTERPRETACIÓN PROGRESADA DISRUPTIVA

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  generateDisruptiveProgressedPrompt,
  type ChartData,
  type UserProfile
} from '@/utils/prompts/disruptivePrompts';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 60;

// Cache en memoria para evitar regenerar interpretaciones duplicadas
const interpretationCache = new Map<string, { interpretation: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ✅ FUNCIÓN: Generar interpretación progresada disruptiva
async function generateDisruptiveProgressedInterpretation(
  progressedChart: ChartData,
  natalChart: ChartData,
  userProfile: UserProfile,
  natalInterpretation?: any
): Promise<any> {
  const openai = getOpenAIClient();

  const prompt = generateDisruptiveProgressedPrompt(
    progressedChart,
    natalChart,
    userProfile,
    natalInterpretation
  );

  console.log('🔥 Generando interpretación progresada disruptiva');

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo evolutivo experto en progresiones secundarias. Respondes SOLO con JSON válido. Tu enfoque es activar la evolución consciente y el poder personal."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parseando JSON progresada:', parseError);
      throw new Error('Respuesta de IA no válida');
    }

  } catch (error) {
    console.error('Error en OpenAI progresada:', error);
    throw error;
  }
}

// ✅ FUNCIÓN: Fallback para progresada
function generateProgressedFallback(userProfile: UserProfile): any {
  return {
    tema_anual: `${userProfile.name}, este año tu evolución se centra en integrar tu poder revolucionario con estructuras tangibles.`,
    evolucion_personalidad: "Has desarrollado la capacidad de manifestar tu visión única sin comprometer tu autenticidad esencial.",
    nuevas_fortalezas: [
      "Capacidad mejorada para estructurar tu genialidad en formas tangibles",
      "Mayor confianza en tu capacidad de liderazgo transformacional",
      "Habilidad refinada para comunicar visiones complejas de manera accesible",
      "Poder aumentado para atraer recursos que amplifiquen tu impacto"
    ],
    plan_accion_evolutivo: {
      activar_ahora: [
        "Inicia un proyecto que combine tu visión única con demanda real del mercado",
        "Establece un sistema diario que honre tanto tu creatividad como tu productividad"
      ],
      soltar_obsoleto: [
        "Libera la necesidad de validación externa de tu valor único",
        "Suelta patrones de autosabotaje cuando tu poder se vuelve 'demasiado visible'"
      ],
      expandir_territorio: [
        "Explora oportunidades de liderazgo en áreas que tradicionalmente no considerabas",
        "Amplía tu red hacia personas que operen en tu misma frecuencia evolutiva"
      ]
    },
    comparacion_evolutiva: {
      natal_vs_progresada: "Tu Sol progresado ha desarrollado mayor capacidad de materialización, mientras tu Luna ha evolucionado hacia una inteligencia emocional más estratégica.",
      activaciones_casas: "Las casas de poder personal y recursos se han activado significativamente, indicando mayor capacidad de impacto tangible.",
      aspectos_evolutivos: "Los aspectos actuales favorecen la alquimia entre visión y manifestación concreta."
    },
    mensaje_activacion: `Has evolucionado de ser un/a visionario/a puro/a a ser un/a ARQUITECTO/A DE REALIDADES. Tu poder ahora incluye la capacidad de hacer real lo imposible.`,
    rituales_integracion: [
      "Ritual mensual de evaluación: ¿Qué he manifestado que antes solo era visión?",
      "Práctica diaria de 15 minutos combinando visualización con acción concreta",
      "Ceremonia trimestral de gratitud por tu evolución consciente"
    ]
  };
}

export async function POST(request: NextRequest) {
  console.log('🌙 [INTERPRET-PROGRESSED] Iniciando interpretación progresada disruptiva');

  try {
    const body = await request.json();
    const {
      userId,
      progressedChart,
      natalChart,
      userProfile,
      natalInterpretation,
      regenerate = false,
      disruptiveMode = false
    } = body;

    // Validación
    if (!userId || !progressedChart || !userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos: userId, progressedChart y userProfile son requeridos'
      }, { status: 400 });
    }

    // Verificar caché
    const cacheKey = `progressed_${userId}_${disruptiveMode ? 'disruptive' : 'standard'}`;
    if (!regenerate) {
      const cached = interpretationCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log('✅ [INTERPRET-PROGRESSED] Interpretación encontrada en caché');
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

    // Generar interpretación progresada
    if (disruptiveMode && process.env.OPENAI_API_KEY) {
      console.log('🔥 [INTERPRET-PROGRESSED] Modo disruptivo activado con IA');
      try {
        interpretation = await generateDisruptiveProgressedInterpretation(
          progressedChart,
          natalChart,
          userProfile,
          natalInterpretation
        );
      } catch (error) {
        console.warn('⚠️ [INTERPRET-PROGRESSED] IA falló, usando fallback:', error);
        interpretation = generateProgressedFallback(userProfile);
      }
    } else {
      console.log('📋 [INTERPRET-PROGRESSED] Usando interpretación de fallback');
      interpretation = generateProgressedFallback(userProfile);
    }

    // Guardar en caché
    interpretationCache.set(cacheKey, {
      interpretation,
      timestamp: Date.now()
    });

    console.log('✅ [INTERPRET-PROGRESSED] Interpretación progresada generada exitosamente');

    return NextResponse.json({
      success: true,
      data: {
        interpretation,
        cached: false,
        generatedAt: new Date().toISOString(),
        method: disruptiveMode ? 'openai_disruptive' : 'fallback'
      }
    });

  } catch (error) {
    console.error('❌ [INTERPRET-PROGRESSED] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
