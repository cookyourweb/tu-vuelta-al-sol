import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

/**
 * Admin endpoint to reset all interpretations of a specific chart type
 * This forces regeneration with the new prompt structure
 *
 * POST /api/admin/reset-interpretations
 * Body: { chartType: 'natal' | 'solar-return' | 'all' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chartType } = body;

    if (!chartType || !['natal', 'solar-return', 'all'].includes(chartType)) {
      return NextResponse.json({
        error: 'chartType required (natal, solar-return, or all)'
      }, { status: 400 });
    }

    await connectDB();

    let result;

    if (chartType === 'all') {
      // Delete all interpretations
      result = await Interpretation.deleteMany({});
    } else {
      // Delete specific chart type
      result = await Interpretation.deleteMany({ chartType });
    }

    console.log(`✅ Reset complete: ${result.deletedCount} ${chartType} interpretations deleted`);

    return NextResponse.json({
      success: true,
      chartType,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} ${chartType} interpretations deleted. Next generation will use new structure.`
    });

  } catch (error) {
    console.error('❌ Error resetting interpretations:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset interpretations'
    }, { status: 500 });
  }
}
