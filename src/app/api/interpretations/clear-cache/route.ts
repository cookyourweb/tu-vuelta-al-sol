import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chartType } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    await connectDB();

    // Delete all Solar Return interpretations with broken structure
    const result = await Interpretation.deleteMany({
      userId,
      chartType: chartType || 'solar-return',
      $or: [
        { 'interpretation.esencia_revolucionaria_anual': { $exists: false } },
        { 'interpretation.proposito_vida_anual': { $exists: false } }
      ]
    });

    console.log(`🗑️ Deleted ${result.deletedCount} broken interpretations`);

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: 'Broken cache cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to clear cache'
    }, { status: 500 });
  }
}
