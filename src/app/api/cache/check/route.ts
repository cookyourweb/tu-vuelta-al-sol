// src/app/api/cache/check/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId, birthDataHash } = await request.json();
    
    await connectDB();
    
    // Buscar en MongoDB
    const mongoose = await import('mongoose');
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    const cachedAgenda = await db.collection('user_agenda_cache').findOne({
      userId,
      birthDataHash,
      expiresAt: { $gt: new Date() } // No expirado
    });
    
    return NextResponse.json({ data: cachedAgenda });
  } catch (error) {
    console.error('Error al verificar caché:', error);
    return NextResponse.json({ error: 'Error al verificar caché' }, { status: 500 });
  }
}
