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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'UID es requerido' }, { status: 400 });
    }

    await connectDB();

    let user = await User.findOne({ uid });

    // If user doesn't exist, create a basic user record
    if (!user) {
      // Try to get user details from Firebase Auth
      try {
        const { getAuth } = await import('firebase-admin/auth');
        const auth = getAuth();
        const firebaseUser = await auth.getUser(uid);

        user = new User({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
          createdAt: new Date(),
          lastLogin: new Date(),
          role: 'user',
          isVerified: firebaseUser.emailVerified,
          subscriptionStatus: 'free'
        });

        await user.save();
        console.log('User created automatically:', uid);
      } catch (firebaseError) {
        console.error('Error creating user from Firebase:', firebaseError);
        return NextResponse.json({ error: 'Error al obtener usuario desde Firebase' }, { status: 500 });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}
