// src/app/api/astrology/interpret-natal/route.ts
// ENDPOINT ACTUALIZADO PARA INTERPRETACIÓN NATAL DISRUPTIVA

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  generateDisruptiveNatalPrompt,
  formatChartForPrompt,
  type ChartData,
  type UserProfile
} from '@/utils/prompts/disruptivePrompts';

// Cache en memoria para evitar regenerar interpretaciones duplicadas
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

// ✅ FUNCIÓN: Generar interpretación disruptiva
async function generateDisruptiveInterpretation(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<any> {
  const openai = getOpenAIClient();

  const prompt = generateDisruptiveNatalPrompt(chartData, userProfile);

  console.log('🔥 Generando interpretación disruptiva con prompt:', prompt.substring(0, 200) + '...');

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo evolutivo revolucionario. Respondes SOLO con JSON válido, sin texto adicional. Tu enfoque es disruptivo, transformacional y activador de poder personal."
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

    // Limpiar respuesta y parsear JSON
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      console.error('Respuesta recibida:', cleanedResponse);
      throw new Error('Respuesta de IA no válida');
    }

  } catch (error) {
    console.error('Error en OpenAI:', error);
    throw error;
  }
}

// ✅ FUNCIÓN: Interpretación de fallback
function generateFallbackInterpretation(userProfile: UserProfile): any {
  return {
    esencia_revolucionaria: `${userProfile.name}, eres una fuerza revolucionaria auténtica encarnada. Tu presencia cambia energías automáticamente.`,
    proposito_vida: "Activar el potencial humano dormido través de tu autenticidad radical y visión de futuro.",
    plan_accion: {
      hoy_mismo: [
        "Identifica UNA mentira que estás viviendo para 'encajar'",
        "Declara públicamente una verdad radical sobre ti",
        "Elimina UNA cosa/persona/compromiso que apaga tu fuego"
      ],
      esta_semana: [
        "Conecta con UNA persona que comparta tu visión de futuro",
        "Inicia UN proyecto que exprese tu naturaleza revolucionaria",
        "Rechaza UNA oportunidad que requiera que seas 'menos'"
      ],
      este_mes: [
        "Lanza algo al mundo que sea auténticamente tuyo",
        "Establece límites férricos con personas que no honren tu naturaleza",
        "Invierte en herramientas/educación que amplifiquen tu poder"
      ]
    },
    declaracion_poder: `SOY ${userProfile.name.toUpperCase()}, REVOLUCIONARIO/A ENCARNADO/A. MI AUTENTICIDAD RADICAL ES MI SERVICIO A LA HUMANIDAD. NO VINE A ENCAJAR - VINE A DESPERTAR.`,
    advertencias: [
      "Si estás en un trabajo que te aburre, tu alma se está muriendo",
      "Si escondes tu rareza por 'seguridad', estás saboteando tu propósito",
      "Si no estás incomodando a alguien con tu autenticidad, no estás siendo lo suficientemente real"
    ],
    insights_transformacionales: [
      "Tu configuración natal te diseñó para ser catalizador de evolución humana",
      "Cada casa contiene un aspecto específico de tu misión revolucionaria",
      "Tu carta natal es tu mapa del tesoro para liberar potencial dormido"
    ],
    rituales_recomendados: [
      "Declara diariamente tu declaración de poder frente al espejo",
      "Dedica 20 minutos diarios a actividades que expresen tu esencia auténtica",
      "Establece un ritual semanal de revisión: ¿Estás viviendo tu carta natal?"
    ]
  };
}

export async function POST(request: NextRequest) {
  console.log('🌟 [INTERPRET-NATAL] Iniciando interpretación natal disruptiva');

  try {
    const body: NatalInterpretationRequest = await request.json();
    const { userId, natalChart, userProfile, regenerate = false, disruptiveMode = false } = body;

    // Validación
    if (!userId || !natalChart || !userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos: userId, natalChart y userProfile son requeridos'
      }, { status: 400 });
    }

    // Verificar caché (si no se fuerza regenerar)
    const cacheKey = `natal_${userId}_${disruptiveMode ? 'disruptive' : 'standard'}`;
    if (!regenerate) {
      const cached = interpretationCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log('✅ [INTERPRET-NATAL] Interpretación encontrada en caché');
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
      console.log('🔥 [INTERPRET-NATAL] Modo disruptivo activado con IA');
      try {
        interpretation = await generateDisruptiveInterpretation(natalChart, userProfile);
      } catch (error) {
        console.warn('⚠️ [INTERPRET-NATAL] IA falló, usando fallback:', error);
        interpretation = generateFallbackInterpretation(userProfile);
      }
    } else {
      console.log('📋 [INTERPRET-NATAL] Usando interpretación de fallback');
      interpretation = generateFallbackInterpretation(userProfile);
    }

    // Guardar en caché
    interpretationCache.set(cacheKey, {
      interpretation,
      timestamp: Date.now()
    });

    console.log('✅ [INTERPRET-NATAL] Interpretación generada exitosamente');

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
    console.error('❌ [INTERPRET-NATAL] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
