// src/app/api/astrology/interpret-solar-return/route.ts
// =============================================================================
// ENDPOINT PARA INTERPRETACIONES DE SOLAR RETURN
// Integración OpenAI GPT-4 + Caché MongoDB + Fallbacks
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MongoClient } from 'mongodb';
import { solarReturnPrompts } from '@/utils/prompts/solarReturnPrompts';

// ✅ CONFIGURACIÓN OPENAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ CONFIGURACIÓN MONGODB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/astrology';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en ms

// ✅ INTERFACES
interface SolarReturnRequest {
  userId: string;
  natalChart: any;
  solarReturnChart: any;
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  regenerate?: boolean;
}

interface CachedInterpretation {
  _id?: string;
  userId: string;
  chartType: 'solar-return';
  natalChart: any;
  solarReturnChart: any;
  userProfile: any;
  interpretation: any;
  generatedAt: string;
  expiresAt: Date;
}

// ✅ FUNCIÓN: Verificar caché MongoDB
async function checkCache(userId: string, natalChart: any, solarReturnChart: any): Promise<CachedInterpretation | null> {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db('astrology');
    const collection = db.collection('interpretations');

    // Buscar interpretación válida (no expirada)
    const cached = await collection.findOne({
      userId,
      chartType: 'solar-return',
      'natalChart.planets': { $exists: true },
      'solarReturnChart.planets': { $exists: true },
      expiresAt: { $gt: new Date() }
    });

    await client.close();

    if (cached) {
      console.log('✅ Interpretación Solar Return encontrada en caché');
      return cached as unknown as CachedInterpretation;
    }

    return null;
  } catch (error) {
    console.error('❌ Error verificando caché:', error);
    return null;
  }
}

// ✅ FUNCIÓN: Guardar en caché
async function saveToCache(interpretation: CachedInterpretation): Promise<void> {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db('astrology');
    const collection = db.collection('interpretations');

    // Establecer expiración
    interpretation.expiresAt = new Date(Date.now() + CACHE_DURATION);

    await collection.insertOne(interpretation as any);
    await client.close();

    console.log('💾 Interpretación Solar Return guardada en caché');
  } catch (error) {
    console.error('❌ Error guardando en caché:', error);
  }
}

// ✅ FUNCIÓN: Generar interpretación con OpenAI
async function generateWithOpenAI(natalChart: any, solarReturnChart: any, userProfile: any): Promise<any> {
  try {
    console.log('🤖 Generando interpretación Solar Return con OpenAI...');

    // Preparar datos para el prompt
    const promptData = {
      userName: userProfile.name || 'Usuario',
      userAge: userProfile.age || 0,
      birthDate: userProfile.birthDate || '',
      birthTime: userProfile.birthTime || '',
      birthPlace: userProfile.birthPlace || '',
      solarReturnYear: solarReturnChart?.solarReturnInfo?.year || new Date().getFullYear(),
      natalChart: JSON.stringify(natalChart, null, 2),
      solarReturnChart: JSON.stringify(solarReturnChart, null, 2)
    };

    // Reemplazar variables en el prompt maestro
    let prompt = solarReturnPrompts.master;
    Object.entries(promptData).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo revolucionario especializado en Solar Return. Responde SOLO con JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parsear JSON
    const interpretation = JSON.parse(response);
    console.log('✅ Interpretación Solar Return generada exitosamente');

    return interpretation;

  } catch (error) {
    console.error('❌ Error generando con OpenAI:', error);
    throw error;
  }
}

// ✅ FUNCIÓN: Generar fallback básico
function generateFallback(natalChart: any, solarReturnChart: any, userProfile: any): any {
  console.log('🔄 Generando fallback básico para Solar Return');

  const fallback = { ...solarReturnPrompts.fallback };

  // Personalizar con datos disponibles
  const natalSun = natalChart?.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const solarAsc = solarReturnChart?.ascendant;

  if (natalSun) {
    fallback.esencia_revolucionaria = fallback.esencia_revolucionaria
      .replace('{natalSunSign}', natalSun.sign || 'desconocido');
  }

  if (solarAsc) {
    fallback.plan_accion.hoy_mismo[2] = fallback.plan_accion.hoy_mismo[2]
      .replace('{solarAscendantSign}', solarAsc.sign || 'desconocido');
  }

  return fallback;
}

// ✅ POST HANDLER PRINCIPAL
export async function POST(request: NextRequest) {
  try {
    console.log('🌅 Solicitud de interpretación Solar Return recibida');

    const body: SolarReturnRequest = await request.json();
    const { userId, natalChart, solarReturnChart, userProfile, regenerate = false } = body;

    // ✅ VALIDACIONES
    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
    }

    if (!natalChart || !solarReturnChart) {
      return NextResponse.json({ error: 'natalChart y solarReturnChart requeridos' }, { status: 400 });
    }

    // ✅ VERIFICAR CACHÉ (si no se fuerza regeneración)
    if (!regenerate) {
      const cached = await checkCache(userId, natalChart, solarReturnChart);
      if (cached) {
        return NextResponse.json({
          success: true,
          interpretation: cached.interpretation,
          cached: true,
          generatedAt: cached.generatedAt
        });
      }
    }

    // ✅ GENERAR INTERPRETACIÓN
    let interpretation;

    try {
      // Intentar con OpenAI primero
      interpretation = await generateWithOpenAI(natalChart, solarReturnChart, userProfile);
    } catch (openaiError) {
      console.warn('⚠️ OpenAI falló, usando fallback:', openaiError);
      // Fallback si OpenAI falla
      interpretation = generateFallback(natalChart, solarReturnChart, userProfile);
    }

    // ✅ GUARDAR EN CACHÉ
    const cacheData: CachedInterpretation = {
      userId,
      chartType: 'solar-return',
      natalChart,
      solarReturnChart,
      userProfile,
      interpretation,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + CACHE_DURATION)
    };

    await saveToCache(cacheData);

    // ✅ RESPUESTA EXITOSA
    return NextResponse.json({
      success: true,
      interpretation,
      cached: false,
      generatedAt: cacheData.generatedAt
    });

  } catch (error) {
    console.error('❌ Error en endpoint Solar Return:', error);

    return NextResponse.json({
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// ✅ GET HANDLER PARA TESTING
export async function GET() {
  return NextResponse.json({
    message: 'Endpoint Solar Return Interpretation',
    status: 'active',
    cacheDuration: `${CACHE_DURATION / (1000 * 60 * 60)} horas`
  });
}
