// =============================================================================
// 🌟 PLANETARY CARDS API ROUTE
// src/app/api/astrology/planetary-cards/route.ts
// =============================================================================
// Genera fichas planetarias anuales que explican cómo los tránsitos largos
// modulan todos los eventos del año
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import connectDB from '@/lib/db';
import NatalChart from '@/models/NatalChart';
import Interpretation from '@/models/Interpretation';
import User from '@/models/User';
import Chart from '@/models/Chart';
import OpenAI from 'openai';
import {
  generatePlanetaryCardPrompt,
  determineActivePlanets,
  type PlanetaryCardPromptData
} from '@/utils/prompts/planetaryCardsPrompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configuración de Vercel
export const maxDuration = 60; // 60 segundos para generación con OpenAI

// =============================================================================
// POST - Generate Planetary Cards
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    console.log('🌟 ===== PLANETARY CARDS REQUEST =====');

    // 🔒 AUTHENTICATION
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      token = request.nextUrl.searchParams.get('token') || null;
    }

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - No authentication token provided'
      }, { status: 401 });
    }

    // Initialize Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    console.log('👤 User authenticated:', userId);

    // 📝 PARSE REQUEST BODY
    const body = await request.json();
    const {
      planets, // Array de planetas a generar (opcional)
      regenerate = false
    }: {
      planets?: string[];
      regenerate?: boolean;
    } = body;

    await connectDB();

    // ✅ 1. Buscar carta natal del usuario
    const natalChart = await NatalChart.findOne({ userId }).lean().exec() as any;
    if (!natalChart) {
      return NextResponse.json({
        success: false,
        error: 'No natal chart found for user'
      }, { status: 404 });
    }

    console.log('📊 Found natal chart');

    // ✅ 2. Buscar Solar Return actual (OPCIONAL - si existe, mejor contexto)
    const currentYear = new Date().getFullYear();

    // Buscar interpretación del Solar Return
    const solarReturn = await Interpretation.findOne({
      userId,
      chartType: 'solar-return',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec() as any;

    // Buscar la CARTA del Solar Return (con posiciones planetarias)
    const chartDoc = await Chart.findOne({ userId }).lean().exec() as any;
    const solarReturnChart = chartDoc?.solarReturnChart;

    if (solarReturn && solarReturnChart) {
      console.log('🌅 Found Solar Return interpretation + chart - generating enhanced planetary cards');
    } else if (solarReturn && !solarReturnChart) {
      console.log('⚠️ Found Solar Return interpretation but no chart data - using interpretation only');
    } else {
      console.log('⚠️ No Solar Return found - generating basic planetary cards based on natal + transits');
    }

    // ✅ 3. Buscar interpretación natal (opcional, para contexto)
    const natalInterpretation = await Interpretation.findOne({
      userId,
      chartType: 'natal',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec() as any;

    // ✅ 4. Buscar datos del usuario
    const birthData = await require('@/models/BirthData').default.findOne({ userId }).lean().exec() as any;
    const user = await User.findOne({ userId }).lean().exec() as any;

    const userName = user?.fullName || user?.name || birthData?.fullName || 'Usuario';
    const userAge = user?.age || calculateAge(user?.birthDate || birthData?.birthDate);
    const userBirthPlace = user?.birthPlace || birthData?.birthPlace || 'Desconocido';
    const birthDate = user?.birthDate || birthData?.birthDate || new Date().toISOString().split('T')[0];

    console.log(`👤 User: ${userName}, ${userAge} años`);

    // ✅ 5. Determinar qué planetas generar
    const planetsToGenerate = planets && planets.length > 0
      ? planets
      : (solarReturn && solarReturnChart)
        ? determineActivePlanets(solarReturn.interpretation || solarReturn)
        : ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte']; // Planetas básicos si no hay SR

    console.log('🌟 Planets to generate:', planetsToGenerate);
    console.log('📊 Solar Return Chart available:', !!solarReturnChart);

    // ✅ 6. Generar fichas para cada planeta
    const planetaryCards: any[] = [];

    for (const planetName of planetsToGenerate) {
      console.log(`🔄 Generating card for ${planetName}...`);

      // Generar prompt
      const promptData: PlanetaryCardPromptData = {
        userName,
        userAge,
        userBirthPlace,
        birthDate, // Para calcular fechas del año solar
        planetName,
        natalChart: natalChart.natalChart || natalChart,
        solarReturn: solarReturnChart || null, // Usar la CARTA, no la interpretación
        natalInterpretation: natalInterpretation?.interpretation
      };

      const prompt = generatePlanetaryCardPrompt(promptData);

      console.log(`📝 Prompt generated for ${planetName}, length:`, prompt.length);

      // Llamar a OpenAI
      console.log(`🤖 Calling OpenAI for ${planetName}...`);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un astrólogo evolutivo experto. Respondes ÚNICAMENTE con JSON válido en español, sin markdown ni comentarios.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0].message.content;

      if (!responseText) {
        console.error(`❌ Empty response from OpenAI for ${planetName}`);
        continue;
      }

      console.log(`✅ OpenAI response received for ${planetName}, length:`, responseText.length);

      // Parsear JSON
      let parsedCard;
      try {
        parsedCard = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`❌ JSON parse error for ${planetName}:`, parseError);
        console.error('Response text:', responseText.substring(0, 500));
        continue;
      }

      console.log(`✅ JSON parsed successfully for ${planetName}`);

      planetaryCards.push({
        ...parsedCard,
        generatedAt: new Date(),
        cached: false
      });
    }

    console.log(`✅ Generated ${planetaryCards.length} planetary cards`);

    // ✅ 7. Retornar fichas
    return NextResponse.json({
      success: true,
      cards: planetaryCards,
      totalCards: planetaryCards.length,
      userName,
      solarReturnYear: currentYear,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('❌ Error generating planetary cards:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// =============================================================================
// GET - Retrieve Planetary Cards (if cached in future)
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId is required'
      }, { status: 400 });
    }

    // TODO: Implementar caché de fichas planetarias en MongoDB
    // Por ahora, retornar mensaje indicando que deben generarse

    return NextResponse.json({
      success: false,
      message: 'Planetary cards are not cached yet. Use POST to generate them.',
      cached: false
    }, { status: 404 });

  } catch (error) {
    console.error('❌ Error retrieving planetary cards:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve planetary cards'
    }, { status: 500 });
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calcula edad a partir de fecha de nacimiento
 */
function calculateAge(birthDate: string | Date | undefined): number {
  if (!birthDate) return 30; // Default

  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age || 30;
}
