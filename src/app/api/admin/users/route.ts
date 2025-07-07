import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Obtener lista de usuarios con campos básicos
    const users = await User.find({}, { uid: 1, email: 1, fullName: 1, _id: 0 }).limit(50).lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}
