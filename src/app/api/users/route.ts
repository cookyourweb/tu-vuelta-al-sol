//src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { uid, email, fullName } = await request.json();
    
    if (!uid || !email || !fullName) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    await connectDB();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
    }

    // Crear nuevo usuario
    const newUser = new User({
      uid,
      email,
      fullName,
      createdAt: new Date(),
      lastLogin: new Date(),
      role: 'user',
      isVerified: false,
      subscriptionStatus: 'free'
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'Usuario creado correctamente', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}