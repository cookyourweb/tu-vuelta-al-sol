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
    // 🔒 AUTHENTICATION REQUIRED - Users can only access their own data
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      token = new URL(request.url).searchParams.get('token') || null;
    }

    if (!token) {
      return NextResponse.json({
        error: 'Unauthorized - Authentication token required'
      }, { status: 401 });
    }

    // Initialize Firebase Admin for token verification
    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    }

    // Verify token and extract authenticated user
    const decodedToken = await admin.auth().verifyIdToken(token);
    const authenticatedUserId = decodedToken.uid;

    const { searchParams } = new URL(request.url);
    const requestedUid = searchParams.get('uid');

    if (!requestedUid) {
      return NextResponse.json({ error: 'UID es requerido' }, { status: 400 });
    }

    // 🔒 SECURITY CHECK - Users can only access their own data
    if (authenticatedUserId !== requestedUid) {
      return NextResponse.json({
        error: 'Forbidden - Cannot access other users\' data'
      }, { status: 403 });
    }

    await connectDB();

    let user = await User.findOne({ uid: requestedUid });

    // If user doesn't exist, create a basic user record from Firebase
    if (!user) {
      try {
        const auth = admin.auth();
        const firebaseUser = await auth.getUser(requestedUid);

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
        console.log('User created automatically:', requestedUid);
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
