// src/app/api/interpretations/event/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import connectDB from '@/lib/db';
import EventInterpretation, { generateEventId, calculateExpirationDate } from '@/models/EventInterpretation';
import Interpretation from '@/models/Interpretation';
import NatalChart from '@/models/NatalChart';
import User from '@/models/User';
import { generateEventInterpretationPrompt, EventData } from '@/utils/prompts/eventInterpretationPrompt';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ POST: Generar o recuperar interpretación de evento
export async function POST(request: NextRequest) {
  try {
    console.log('🌙 ===== EVENT INTERPRETATION REQUEST =====');

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
      event,
      regenerate = false
    }: {
      event: EventData;
      regenerate?: boolean;
    } = body;

    // Validación
    if (!event || !event.type || !event.date || event.house === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: event (type, date, house)'
      }, { status: 400 });
    }

    console.log('📅 Event:', event);

    await connectDB();

    // ✅ GENERAR EVENT ID
    const eventId = generateEventId(event);
    console.log('🔑 Event ID:', eventId);

    // ✅ BUSCAR EN CACHE (si no se fuerza regeneración)
    if (!regenerate) {
      const cached = await EventInterpretation.findByUserAndEvent(userId, eventId);

      if (cached && !cached.isExpired()) {
        console.log('✅ Found cached interpretation:', cached._id);
        return NextResponse.json({
          success: true,
          interpretation: cached.interpretation,
          cached: true,
          generatedAt: cached.generatedAt,
          expiresAt: cached.expiresAt,
          method: 'cached'
        });
      } else if (cached) {
        console.log('⏰ Cached interpretation expired, regenerating...');
      }
    }

    // ✅ NO HAY CACHE o se forzó regeneración → GENERAR NUEVA INTERPRETACIÓN

    console.log('🔄 Generating new interpretation...');

    // 1. Buscar carta natal del usuario
    let natalChart = await NatalChart.findOne({ userId }).lean().exec() as any;
    if (!natalChart) {
      console.warn('⚠️ MUY IMPORTANTE: No encontrada carta natal, volvemos a generarla');

      // Auto-regenerar carta natal
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/charts/natal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });

        if (!response.ok) {
          throw new Error('Failed to generate natal chart');
        }

        const result = await response.json();
        console.log('✅ Carta natal regenerada exitosamente');

        // Buscar la carta recién generada
        natalChart = await NatalChart.findOne({ userId }).lean().exec() as any;

        if (!natalChart) {
          return NextResponse.json({
            success: false,
            error: 'No se pudo generar carta natal'
          }, { status: 500 });
        }
      } catch (error) {
        console.error('❌ Error regenerando carta natal:', error);
        return NextResponse.json({
          success: false,
          error: 'No se pudo generar carta natal automáticamente'
        }, { status: 500 });
      }
    }

    console.log('📊 Found natal chart');

    // 2. Buscar datos de nacimiento asociados
    const birthData = await require('@/models/BirthData').default.findById(natalChart.birthDataId).lean().exec() as any;

    // 3. Buscar Solar Return actual
    const currentYear = new Date().getFullYear();
    const solarReturn = await Interpretation.findOne({
      userId,
      chartType: 'solar-return',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec() as any;

    if (!solarReturn) {
      console.warn('⚠️ No Solar Return found, proceeding without it');
    } else {
      console.log('🌅 Found Solar Return');
    }

    // 4. Buscar interpretación natal guardada (KEY: contiene fortalezas/bloqueos)
    const natalInterpretation = await Interpretation.findOne({
      userId,
      chartType: 'natal',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec() as any;

    if (!natalInterpretation) {
      return NextResponse.json({
        success: false,
        error: 'No natal interpretation found. User must generate natal chart interpretation first.'
      }, { status: 404 });
    }

    console.log('✅ Found natal interpretation with fortalezas/bloqueos');

    // 5. Buscar datos del usuario
    const user = await User.findOne({ userId }).lean().exec() as any;
    const userName = user?.fullName || user?.name || birthData?.fullName || 'Usuario';
    const userAge = user?.age || calculateAge(user?.birthDate || birthData?.birthDate);
    const userBirthPlace = user?.birthPlace || birthData?.birthPlace || 'Desconocido';

    console.log(`👤 User: ${userName}, ${userAge} años`);
    console.log(`📍 Birth data name: ${birthData?.fullName}`);

    // 6. Generar prompt
    const prompt = generateEventInterpretationPrompt({
      userName,
      userAge,
      userBirthPlace,
      event,
      natalChart: natalChart.natalChart || natalChart,
      solarReturn: solarReturn?.interpretation || {},
      natalInterpretation: natalInterpretation.interpretation || {}
    });

    console.log('📝 Prompt generated, length:', prompt.length);

    // 6. Llamar a OpenAI
    console.log('🤖 Calling OpenAI...');

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
      throw new Error('Empty response from OpenAI');
    }

    console.log('✅ OpenAI response received, length:', responseText.length);

    // 7. Parsear JSON
    let parsedInterpretation;
    try {
      parsedInterpretation = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Response text:', responseText.substring(0, 500));
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    console.log('✅ JSON parsed successfully');

    // 8. Guardar en MongoDB
    const expirationDate = calculateExpirationDate();

    const eventInterpretation = await EventInterpretation.findOneAndUpdate(
      { userId, eventId },
      {
        $set: {
          userId,
          eventId,
          eventType: event.type,
          eventDate: new Date(event.date),
          eventDetails: {
            sign: event.sign,
            house: event.house,
            planetsInvolved: event.planetsInvolved,
            transitingPlanet: event.transitingPlanet,
            natalPlanet: event.natalPlanet,
            aspectType: event.aspectType
          },
          interpretation: parsedInterpretation,
          generatedAt: new Date(),
          expiresAt: expirationDate,
          method: 'openai',
          cached: false,
          lastModified: new Date()
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: false
      }
    ) as any;

    console.log('✅ Event interpretation saved:', eventInterpretation._id);

    return NextResponse.json({
      success: true,
      interpretation: eventInterpretation.interpretation,
      interpretationId: eventInterpretation._id.toString(),
      generatedAt: eventInterpretation.generatedAt,
      expiresAt: eventInterpretation.expiresAt,
      method: 'openai',
      cached: false
    });

  } catch (error) {
    console.error('❌ Error generating event interpretation:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ✅ GET: Recuperar interpretación guardada
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');
    const eventType = searchParams.get('eventType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId is required'
      }, { status: 400 });
    }

    await connectDB();

    // Si se proporciona eventId, buscar ese evento específico
    if (eventId) {
      const interpretation = await EventInterpretation.findByUserAndEvent(userId, eventId);

      if (!interpretation) {
        return NextResponse.json({
          success: false,
          message: 'Event interpretation not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        interpretation: interpretation.interpretation,
        eventDetails: interpretation.eventDetails,
        generatedAt: interpretation.generatedAt,
        expiresAt: interpretation.expiresAt,
        cached: true
      });
    }

    // Si se proporciona rango de fechas, buscar todos los eventos en ese rango
    if (startDate && endDate) {
      const interpretations = await EventInterpretation.findByUserAndDateRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      return NextResponse.json({
        success: true,
        interpretations: interpretations.map(i => ({
          eventId: i.eventId,
          eventType: i.eventType,
          eventDate: i.eventDate,
          eventDetails: i.eventDetails,
          interpretation: i.interpretation,
          generatedAt: i.generatedAt,
          expiresAt: i.expiresAt
        })),
        count: interpretations.length
      });
    }

    // Si se proporciona eventType, buscar todos los eventos de ese tipo
    if (eventType) {
      const interpretations = await EventInterpretation.find({
        userId,
        eventType,
        expiresAt: { $gt: new Date() }
      })
      .sort({ eventDate: -1 })
      .lean()
      .exec();

      return NextResponse.json({
        success: true,
        interpretations: interpretations.map(i => ({
          eventId: i.eventId,
          eventDate: i.eventDate,
          eventDetails: i.eventDetails,
          interpretation: i.interpretation,
          generatedAt: i.generatedAt,
          expiresAt: i.expiresAt
        })),
        count: interpretations.length
      });
    }

    // Por defecto: próximos 30 días
    const upcoming = await EventInterpretation.findUpcomingEvents(userId, 30);

    return NextResponse.json({
      success: true,
      interpretations: upcoming.map(i => ({
        eventId: i.eventId,
        eventType: i.eventType,
        eventDate: i.eventDate,
        eventDetails: i.eventDetails,
        interpretation: i.interpretation,
        generatedAt: i.generatedAt,
        expiresAt: i.expiresAt
      })),
      count: upcoming.length
    });

  } catch (error) {
    console.error('❌ Error retrieving event interpretations:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve event interpretations'
    }, { status: 500 });
  }
}

// ✅ DELETE: Borrar caché de interpretación de evento (forzar regeneración)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const eventId = searchParams.get('eventId');

    if (!userId || !eventId) {
      return NextResponse.json({
        success: false,
        error: 'userId and eventId are required'
      }, { status: 400 });
    }

    await connectDB();

    console.log(`🗑️ Deleting event interpretation: ${eventId} for user ${userId}`);

    const result = await EventInterpretation.deleteOne({ userId, eventId });

    if (result.deletedCount > 0) {
      console.log('✅ Event interpretation deleted');
      return NextResponse.json({
        success: true,
        message: 'Event interpretation cache cleared',
        deletedCount: result.deletedCount
      });
    } else {
      console.log('📭 No event interpretation found to delete');
      return NextResponse.json({
        success: true,
        message: 'No cached event interpretation found',
        deletedCount: 0
      });
    }

  } catch (error) {
    console.error('❌ Error deleting event interpretation:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete event interpretation cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ✅ HELPER: Calcular edad
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
