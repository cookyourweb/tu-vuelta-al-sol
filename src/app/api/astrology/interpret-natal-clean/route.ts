// src/app/api/astrology/interpret-natal-clean/route.ts
// ENDPOINT ACTUALIZADO PARA INTERPRETACIÓN NATAL PSICOLÓGICA/EDUCATIVA

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  generateCompleteNatalChartPrompt,
  type ChartData,
  type UserProfile
} from '@/utils/prompts/completeNatalChartPrompt';

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

// ✅ FUNCIÓN: Generar interpretación psicológica/educativa
async function generateNatalInterpretation(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<any> {
  const openai = getOpenAIClient();

  const prompt = generateCompleteNatalChartPrompt(chartData, userProfile);

  console.log('🔥 Generando interpretación natal psicológica con prompt:', prompt.substring(0, 200) + '...');

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo evolutivo profesional especializado en CARTAS NATALES. Respondes EXCLUSIVAMENTE con JSON válido, sin texto adicional, sin markdown. Tu enfoque es PSICOLÓGICO, EDUCATIVO y PEDAGÓGICO. NUNCA incluyes rituales, mantras, predicciones, consejos de acción, ni timing en la carta natal. Solo describes IDENTIDAD Y PSICOLOGÍA. SIEMPRE completas TODAS las secciones del JSON requerido con el formato exacto especificado en el prompt."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 16000,
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

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exceeded')) {
        throw new Error('Se ha excedido el límite de uso de la API de OpenAI. Por favor, contacta al administrador para actualizar el plan de facturación.');
      }

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        throw new Error('Error de autenticación con OpenAI. La clave API puede ser inválida.');
      }

      if (error.message.includes('rate limit')) {
        throw new Error('Límite de velocidad excedido. Por favor, espera unos minutos antes de intentar nuevamente.');
      }
    }

    throw error;
  }
}

// ✅ FUNCIÓN: Interpretación de fallback - NUEVA ESTRUCTURA PSICOLÓGICA
function generateFallbackInterpretation(userProfile: UserProfile): any {
  return {
    esencia_natal: `${userProfile.name}, tu carta natal revela una estructura psicológica única que te define. La combinación de tu Sol, Luna y Ascendente crea un patrón de identidad que se manifiesta en cómo te relacionas con el mundo y contigo mismo/a.`,
    proposito_vida: "Tu Sol representa tu esencia vital y el propósito central de tu vida. Es la energía que buscas expresar y desarrollar a lo largo de tu existencia. Cuando vives alineado/a con tu Sol, experimentas un sentido profundo de autenticidad y plenitud.",
    mundo_emocional: "Tu Luna representa tu mundo emocional, tus necesidades más profundas y cómo procesas las experiencias afectivas. Comprender tu Luna es clave para entender tus reacciones emocionales automáticas.",
    mente_comunicacion: "Tu Mercurio y Saturno describen cómo procesas información, te comunicas y estructuras tu pensamiento. Estos planetas revelan tu estilo cognitivo único.",
    amor_valores: "Venus muestra qué valoras, cómo das y recibes afecto, y qué te hace sentir en armonía. Es tu brújula para las relaciones y el placer.",
    accion_energia: "Marte representa cómo te movilizas, dónde pones tu energía y cómo enfrentas desafíos. Es tu motor de acción.",
    lecciones_karmicas: "Los Nodos Lunares y Saturno muestran tus patrones de aprendizaje profundos. El Nodo Sur representa habilidades innatas que tiendes a repetir. El Nodo Norte señala hacia dónde necesitas crecer.",
    formacion_temprana: "La Luna, Saturno y Venus en tu carta revelan cómo se formaron tus patrones emocionales, límites internos y modelo de amor durante tu infancia. Estos patrones siguen activos en tu vida adulta.",
    luz_sombra: {
      fortalezas: [
        "Capacidad natural para procesar experiencias de manera única",
        "Sensibilidad hacia aspectos de la realidad que otros no perciben",
        "Recursos psicológicos para enfrentar tu particular camino de vida"
      ],
      sombras: [
        "Patrones automáticos que se formaron para protegerte pero que hoy pueden limitarte",
        "Tendencia a repetir ciertos ciclos relacionales o emocionales",
        "Zonas de tu psique que requieren integración consciente"
      ]
    },
    sintesis_identidad: `Tu carta natal, ${userProfile.name}, es un mapa de quién eres psicológicamente. No predice tu futuro - describe tu estructura interna. Comprender estos patrones te permite relacionarte con ellos conscientemente, en lugar de ser movido/a automáticamente por ellos. Tu carta no te limita: te explica.`
  };
}

export async function POST(request: NextRequest) {
  console.log('🌟 [INTERPRET-NATAL] Iniciando interpretación natal psicológica/educativa');

  try {
    const body: NatalInterpretationRequest = await request.json();
    const { userId, natalChart, userProfile, regenerate = false } = body;

    // Validación
    if (!userId || !natalChart || !userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos: userId, natalChart y userProfile son requeridos'
      }, { status: 400 });
    }

    // Verificar caché (si no se fuerza regenerar)
    const cacheKey = `natal_${userId}_psychological`;
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
    if (process.env.OPENAI_API_KEY) {
      console.log('🔥 [INTERPRET-NATAL] Generando interpretación con IA');
      try {
        interpretation = await generateNatalInterpretation(natalChart, userProfile);
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
        method: process.env.OPENAI_API_KEY ? 'openai_psychological' : 'fallback'
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
