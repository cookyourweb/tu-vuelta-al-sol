// src/app/api/interpretations/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest) {
  try {
    console.log('💾 ===== SAVING INTERPRETATION =====');

    const body = await request.json();
    const {
      userId,
      chartType,
      interpretation,
      userProfile,
      generatedAt,
    } = body;

    if (!userId || !chartType || !interpretation || !userProfile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const expirationDate = new Date(Date.now() + CACHE_DURATION);

    // ✅ UPSERT: Update if exists, create if not
    const result = await Interpretation.findOneAndUpdate(
      {
        userId,
        chartType,
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
          interpretation,
          generatedAt: generatedAt ? new Date(generatedAt) : new Date(),
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
    console.error('❌ Error saving:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save interpretation'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 ===== RETRIEVING INTERPRETATION =====');

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const chartType = searchParams.get('chartType');

    if (!userId || !chartType) {
      return NextResponse.json(
        { success: false, error: 'userId and chartType required' },
        { status: 400 }
      );
    }

    await connectDB();

    const latestInterpretation = await Interpretation.findOne({
      userId,
      chartType,
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec() as any;

    if (!latestInterpretation) {
      console.log(`❌ No active ${chartType} interpretation found`);
      return NextResponse.json({
        success: false,
        message: `No active ${chartType} interpretation found`
      }, { status: 404 });
    }

    console.log('✅ Latest interpretation found:', latestInterpretation._id);

    return NextResponse.json({
      success: true,
      interpretation: latestInterpretation.interpretation,
      generatedAt: latestInterpretation.generatedAt,
      expiresAt: latestInterpretation.expiresAt,
      method: latestInterpretation.method,
      cached: true
    });

  } catch (error) {
    console.error('❌ Error retrieving:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve interpretation'
    }, { status: 500 });
  }
}
