// src/app/api/interpretations/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

// Duración del cache según el tipo de interpretación
const CACHE_DURATION_NATAL = 365 * 24 * 60 * 60 * 1000; // 365 días - carta natal no cambia
const CACHE_DURATION_SOLAR_RETURN = 365 * 24 * 60 * 60 * 1000; // 365 días - solar return es anual
const CACHE_DURATION_DEFAULT = 24 * 60 * 60 * 1000; // 24 horas para otros

function getCacheDuration(chartType: string): number {
  switch (chartType) {
    case 'natal':
      return CACHE_DURATION_NATAL;
    case 'solar-return':
      return CACHE_DURATION_SOLAR_RETURN;
    default:
      return CACHE_DURATION_DEFAULT;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 AUTHENTICATION - Routes handle their own Firebase auth since middleware blocks all protected routes
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

    await admin.auth().verifyIdToken(token);

    const body = await request.json();
    const { chartType } = body;

    // ✅ DETECTAR TIPO: NATAL o SOLAR RETURN
    if (chartType === 'natal') {
      return handleNatalInterpretationSave(body);
    }

    // ✅ SOLAR RETURN (código existente)
    console.log('🌅 ===== SOLAR RETURN INTERPRETATION REQUEST =====');

    const {
      userId,
      userProfile,
      regenerate = false
    }: {
      userId: string;
      userProfile: any;
      regenerate?: boolean;
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields for solar return' },
        { status: 400 }
      );
    }

    await connectDB();

    const expirationDate = new Date(Date.now() + getCacheDuration('solar-return'));

    // ✅ UPSERT: Update if exists, create if not
    const result = await Interpretation.findOneAndUpdate(
      {
        userId,
        chartType: 'solar-return',
        expiresAt: { $gt: new Date() } // Only update active interpretations
      },
      {
        $set: {
          userProfile: {
            name: userProfile.name,
            age: userProfile.age,
            birthPlace: userProfile.birthPlace || 'Unknown',
            birthDate: userProfile.birthDate || 'Unknown',
            birthTime: userProfile.birthTime || 'Unknown'
          },
          interpretation: {
            // Solar return specific structure
            ...body.interpretation
          },
          generatedAt: body.generatedAt ? new Date(body.generatedAt) : new Date(),
          expiresAt: expirationDate,
          method: 'openai',
          cached: false,
          lastModified: new Date()
        }
      },
      {
        upsert: true, // Create if doesn't exist
        new: true,    // Return updated document
        runValidators: true
      }
    );

    console.log('✅ SOLAR RETURN UPSERT successful:', {
      _id: result._id,
      userId: result.userId,
      chartType: result.chartType,
      generatedAt: result.generatedAt
    });

    return NextResponse.json({
      success: true,
      message: 'Solar return interpretation saved successfully',
      interpretationId: result._id.toString(),
      interpretation: result.interpretation,
      generatedAt: result.generatedAt,
      expiresAt: result.expiresAt
    });

  } catch (error) {
    console.error('❌ Error saving solar return:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save solar return interpretation'
    }, { status: 500 });
  }
}

// ✅ HANDLER PARA INTERPRETACIÓN NATAL
async function handleNatalInterpretationSave(body: any) {
  try {
    console.log('💾 ===== SAVING NATAL INTERPRETATION =====');

    const { userId, chartType, interpretation, userProfile, generatedAt } = body;

    // Validación
    if (!userId || !interpretation) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // ✅ LOGS PARA DEBUG
    console.log('🔍 Claves recibidas:', Object.keys(interpretation));
    console.log('🔍 formacion_temprana:', interpretation.formacion_temprana ?
      'SÍ (' + Object.keys(interpretation.formacion_temprana).length + ' keys)' : 'NO');
    console.log('🔍 patrones_psicologicos:', interpretation.patrones_psicologicos ?
      'SÍ (' + interpretation.patrones_psicologicos.length + ' items)' : 'NO');
    console.log('🔍 planetas_profundos:', interpretation.planetas_profundos ?
      'SÍ (' + Object.keys(interpretation.planetas_profundos).length + ' keys)' : 'NO');
    console.log('🔍 nodos_lunares:', interpretation.nodos_lunares ?
      'SÍ (' + Object.keys(interpretation.nodos_lunares).length + ' keys)' : 'NO');

    await connectDB();

    const expirationDate = new Date(Date.now() + getCacheDuration(chartType));

    // ✅ UPSERT
    const result = await Interpretation.findOneAndUpdate(
      { userId, chartType },
      {
        userId,
        chartType,
        interpretation, // ← Guarda TODO sin filtros
        userProfile: userProfile || {},
        generatedAt: generatedAt ? new Date(generatedAt) : new Date(),
        expiresAt: expirationDate,
        method: 'openai',
        cached: false
      },
      {
        upsert: true,
        new: true,
        runValidators: false
      }
    );

    console.log('✅ UPSERT successful:', {
      _id: result._id,
      userId: result.userId,
      chartType: result.chartType,
      generatedAt: result.generatedAt
    });

    return NextResponse.json({
      success: true,
      message: 'Interpretation saved successfully',
      interpretationId: result._id.toString(),
      interpretation: result.interpretation,
      generatedAt: result.generatedAt,
      expiresAt: result.expiresAt
    });

  } catch (error) {
    console.error('❌ Error saving natal interpretation:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chartType = searchParams.get('chartType');

    if (!userId || !chartType) {
      return NextResponse.json(
        { error: 'userId and chartType are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Find active (non-expired) interpretations only
    const interpretationDoc = await Interpretation.findOne({
      userId,
      chartType,
      expiresAt: { $gt: new Date() } // Only return active interpretations
    })
    .sort({ generatedAt: -1, _id: -1 }) // Sort by date DESC + _id DESC
    .lean()
    .exec() as any;

    if (!interpretationDoc) {
      return NextResponse.json({
        success: false,
        message: `No ${chartType} interpretation available`
      }, { status: 404 });
    }

    // ✅ Check if expired (but still return it with warning)
    const isExpired = new Date(interpretationDoc.expiresAt) < new Date();
    const hoursSinceGeneration = (Date.now() - new Date(interpretationDoc.generatedAt).getTime()) / (1000 * 60 * 60);

    console.log(`✅ Found ${chartType} interpretation:`, {
      _id: interpretationDoc._id,
      generatedAt: interpretationDoc.generatedAt,
      hoursSinceGeneration: hoursSinceGeneration.toFixed(1),
      isExpired,
      isRecent: hoursSinceGeneration < 24
    });

    return NextResponse.json({
      success: true,
      interpretation: interpretationDoc.interpretation,
      cached: true,
      generatedAt: interpretationDoc.generatedAt,
      method: interpretationDoc.method || 'mongodb_cached',
      expired: isExpired,
      hoursSinceGeneration: hoursSinceGeneration.toFixed(1)
    });

  } catch (error) {
    console.error('❌ Error retrieving interpretation:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve interpretation'
    }, { status: 500 });
  }
}

// ✅ PUT: Actualizar/reemplazar interpretación existente (usado por InterpretationButton)
export async function PUT(request: NextRequest) {
  try {
    // Authenticate the request
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      token = request.cookies.get('token')?.value ||
              request.nextUrl.searchParams.get('token') || null;
    }

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - No authentication token provided'
      }, { status: 401 });
    }

    // Initialize Firebase if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    }

    // Verify the token
    await admin.auth().verifyIdToken(token);

    console.log('📝 ===== PUT: UPDATING INTERPRETATION =====');

    const body = await request.json();
    const { userId, chartType, interpretation, userProfile, generatedAt } = body;

    // Validación
    if (!userId || !chartType || !interpretation) {
      return NextResponse.json(
        { success: false, error: 'userId, chartType e interpretation son requeridos' },
        { status: 400 }
      );
    }

    console.log('🔍 PUT - Datos recibidos:', {
      userId,
      chartType,
      interpretationKeys: Object.keys(interpretation),
      hasAdvertencias: !!interpretation.advertencias,
      hasInsights: !!interpretation.insights_transformacionales,
      hasRituales: !!interpretation.rituales_recomendados
    });

    await connectDB();

    const expirationDate = new Date(Date.now() + getCacheDuration(chartType));

    // ✅ UPSERT: Reemplaza existente o crea nuevo
    const result = await Interpretation.findOneAndUpdate(
      { userId, chartType },
      {
        $set: {
          userId,
          chartType,
          interpretation, // ← Guarda TODO el objeto completo
          userProfile: userProfile || {},
          generatedAt: generatedAt ? new Date(generatedAt) : new Date(),
          expiresAt: expirationDate,
          method: 'openai',
          cached: false,
          lastModified: new Date()
        }
      },
      {
        upsert: true,    // Crear si no existe
        new: true,       // Devolver documento actualizado
        runValidators: false
      }
    );

    console.log('✅ PUT UPSERT exitoso:', {
      _id: result._id,
      userId: result.userId,
      chartType: result.chartType,
      generatedAt: result.generatedAt,
      interpretationKeys: Object.keys(result.interpretation || {})
    });

    return NextResponse.json({
      success: true,
      message: `${chartType} interpretation saved/updated successfully`,
      interpretationId: result._id.toString(),
      interpretation: result.interpretation,
      generatedAt: result.generatedAt,
      expiresAt: result.expiresAt
    });

  } catch (error) {
    console.error('❌ PUT Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chartType = searchParams.get('chartType');

    if (!userId || !chartType) {
      return NextResponse.json(
        { success: false, error: 'userId and chartType are required' },
        { status: 400 }
      );
    }

    await connectDB();

    console.log(`🗑️ === DELETING ${chartType.toUpperCase()} INTERPRETATION CACHE ===`);
    console.log('👤 User:', userId);
    console.log('📋 Chart Type:', chartType);

    // Delete all interpretations for this user and chart type
    const result = await Interpretation.deleteMany({
      userId,
      chartType
    });

    console.log('📊 Deletion result:', result);

    if (result.deletedCount > 0) {
      console.log(`✅ Deleted ${result.deletedCount} cached interpretations`);
      return NextResponse.json({
        success: true,
        message: `${chartType} interpretation cache cleared`,
        deletedCount: result.deletedCount
      });
    } else {
      console.log('📭 No cached interpretations found to delete');
      return NextResponse.json({
        success: true,
        message: `No cached ${chartType} interpretations found`,
        deletedCount: 0
      });
    }

  } catch (error) {
    console.error('❌ Error deleting interpretation cache:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete interpretation cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
