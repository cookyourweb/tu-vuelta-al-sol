// src/app/api/astrology/synthesis-annual/route.ts
// 🎯 SÍNTESIS ANUAL DE ALTO NIVEL
// Genera una visión general del proceso anual sin entrar en detalles planetarios
// Enfoque: PROCESO VITAL central del año con tono observador

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 60;

// ✅ Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ==========================================
// 📊 SÍNTESIS ANUAL INTERFACE
// ==========================================

interface AnnualSynthesis {
  tema_central: string;      // 50-80 palabras: El hilo conductor del año
  proceso_vital: string;     // 100-150 palabras: Qué está sucediendo en el nivel profundo
  actitud_clave: string;     // 30-50 palabras: La actitud que facilita el proceso
}

// ==========================================
// 🎨 PROMPT DE SÍNTESIS ANUAL
// ==========================================

function generateAnnualSynthesisPrompt(
  year: number,
  solarReturnData: any,
  natalData: any
): string {
  return `Eres un astrólogo profesional especializado en Retorno Solar. Tu tarea es crear una SÍNTESIS ANUAL de alto nivel que capture el PROCESO VITAL central del año ${year}.

IMPORTANTE:
- Tono OBSERVADOR y psicológico, NO imperativo
- NO mencionar planetas ni casas específicas
- Enfocarse en el PROCESO general, no en detalles técnicos
- Lenguaje: "suele aparecer", "tiende a manifestarse", "se experimenta como"
- Evitar: "debes", "tienes que", "la vida te pide"

CONTEXTO ASTROLÓGICO:
${JSON.stringify({ solarReturn: solarReturnData, natal: natalData }, null, 2)}

Tu respuesta debe ser un JSON con esta estructura EXACTA:

{
  "tema_central": "String de 50-80 palabras: El hilo conductor del año. ¿Qué está siendo activado en el nivel más profundo? ¿De qué trata este ciclo anual en esencia? Usa lenguaje observador.",

  "proceso_vital": "String de 100-150 palabras: Descripción del proceso que suele experimentarse durante este período. Cómo se manifiesta este ciclo en la vida cotidiana, qué patrones tienden a aparecer, qué cambios suelen notarse. Sin mencionar planetas ni casas - solo el PROCESO VIVENCIAL. Lenguaje observador y descriptivo.",

  "actitud_clave": "String de 30-50 palabras: La actitud o postura interna que suele facilitar el proceso de este año. No es una orden sino una observación de qué enfoque tiende a generar mayor fluidez durante este ciclo."
}

EJEMPLO DE TONO CORRECTO (observador, no imperativo):

✅ "Este año suele activarse un proceso de redefinición personal. Muchas personas con esta configuración experimentan cambios en cómo se perciben a sí mismas y cómo se presentan al mundo. El proceso tiende a manifestarse como una búsqueda de mayor autenticidad en las áreas donde antes había adaptación."

❌ "Este año debes redefinirte. La vida te pide que cambies cómo te percibes. Tienes que buscar autenticidad y abandonar la adaptación."

RESPONDE SOLO CON EL JSON. No agregues explicaciones adicionales.`;
}

// ==========================================
// 🚀 HANDLER PRINCIPAL
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    // 📊 Buscar interpretación completa de Solar Return (más reciente)
    const solarReturnInterpretation = await Interpretation.findOne({
      userId,
      chartType: 'solar-return',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 });

    if (!solarReturnInterpretation) {
      return NextResponse.json(
        { success: false, error: 'No se encontró interpretación de Solar Return para este año' },
        { status: 404 }
      );
    }

    // 📊 Buscar interpretación natal
    const natalInterpretation = await Interpretation.findOne({
      userId,
      chartType: 'natal'
    });

    // ✅ Verificar si ya existe síntesis en caché
    if (solarReturnInterpretation.synthesis_annual) {
      const cacheAge = Date.now() - new Date(solarReturnInterpretation.updatedAt || 0).getTime();

      if (cacheAge < CACHE_DURATION) {
        console.log('✅ Síntesis anual encontrada en caché');
        return NextResponse.json({
          success: true,
          data: solarReturnInterpretation.synthesis_annual,
          cached: true
        });
      }
    }

    // 🤖 Generar síntesis con OpenAI
    console.log(`🤖 Generando síntesis anual para año ${year}...`);

    const client = getOpenAI();
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'OpenAI no está configurado' },
        { status: 500 }
      );
    }

    const prompt = generateAnnualSynthesisPrompt(
      parseInt(year),
      solarReturnInterpretation.solarReturnChart || solarReturnInterpretation.interpretation,
      natalInterpretation?.natalChart || natalInterpretation?.interpretation
    );

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo profesional con enfoque psicológico y tono observador. Generas síntesis anuales enfocadas en el PROCESO VITAL, no en detalles técnicos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const rawResponse = completion.choices[0].message.content;
    if (!rawResponse) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const synthesis: AnnualSynthesis = JSON.parse(rawResponse);

    // 💾 Guardar en base de datos
    await Interpretation.findByIdAndUpdate(
      solarReturnInterpretation._id,
      {
        $set: {
          synthesis_annual: synthesis,
          updatedAt: new Date()
        }
      }
    );

    console.log('✅ Síntesis anual generada y guardada');

    return NextResponse.json({
      success: true,
      data: synthesis,
      cached: false
    });

  } catch (error: any) {
    console.error('❌ Error en synthesis-annual:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error generando síntesis anual'
      },
      { status: 500 }
    );
  }
}

// ==========================================
// 🔄 POST - Regenerar síntesis forzadamente
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, year } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const currentYear = year || new Date().getFullYear();

    await connectDB();

    // Invalidar caché eliminando síntesis existente (más reciente)
    await Interpretation.findOneAndUpdate(
      {
        userId,
        chartType: 'solar-return',
        expiresAt: { $gt: new Date() }
      },
      {
        $unset: { synthesis_annual: 1 }
      },
      {
        sort: { generatedAt: -1 }
      }
    );

    // Redirigir a GET para regenerar
    const url = new URL(request.url);
    url.searchParams.set('userId', userId);
    url.searchParams.set('year', currentYear.toString());

    return GET(new NextRequest(url.toString()));

  } catch (error: any) {
    console.error('❌ Error en POST synthesis-annual:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error regenerando síntesis anual'
      },
      { status: 500 }
    );
  }
}
