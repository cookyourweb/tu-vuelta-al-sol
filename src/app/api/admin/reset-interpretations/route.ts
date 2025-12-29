import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

/**
 * Admin endpoint to reset interpretations
 * This forces regeneration with the new prompt structure
 *
 * POST /api/admin/reset-interpretations
 * Body: {
 *   chartType: 'natal' | 'solar-return' | 'all',
 *   userId?: string  // Optional: reset only for specific user
 * }
 *
 * Examples:
 * - Reset all natal: { chartType: 'natal' }
 * - Reset for user: { chartType: 'natal', userId: 'abc123' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chartType, userId } = body;

    if (!chartType || !['natal', 'solar-return', 'all'].includes(chartType)) {
      return NextResponse.json({
        error: 'chartType required (natal, solar-return, or all)'
      }, { status: 400 });
    }

    await connectDB();

    let result;
    let filter: any = {};

    // Build filter
    if (chartType !== 'all') {
      filter.chartType = chartType;
    }

    if (userId) {
      filter.userId = userId;
    }

    // Delete interpretations
    result = await Interpretation.deleteMany(filter);

    const message = userId
      ? `${result.deletedCount} ${chartType} interpretations deleted for user ${userId}`
      : `${result.deletedCount} ${chartType} interpretations deleted`;

    console.log(`✅ Reset complete: ${message}`);

    return NextResponse.json({
      success: true,
      chartType,
      userId: userId || 'all',
      deletedCount: result.deletedCount,
      message: `${message}. Next generation will use new structure.`
    });

  } catch (error) {
    console.error('❌ Error resetting interpretations:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset interpretations'
    }, { status: 500 });
  }
}
