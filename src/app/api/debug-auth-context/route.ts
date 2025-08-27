import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase/admin';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json({ error: 'UID es requerido' }, { status: 400 });
    }

    const adminApp = getFirebaseAdmin();
    
    // Verificar Firebase Auth
    let firebaseUser = null;
    try {
      firebaseUser = await adminApp.auth().getUser(uid);
    } catch (error) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado en Firebase Auth',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }, { status: 404 });
    }

    // Verificar MongoDB
    await connectDB();
    const mongoUser = await User.findOne({ uid });
    
    if (!mongoUser) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado en MongoDB',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      firebase: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified,
        disabled: firebaseUser.disabled
      },
      mongo: {
        _id: mongoUser._id,
        uid: mongoUser.uid,
        email: mongoUser.email,
        fullName: mongoUser.fullName,
        role: mongoUser.role,
        isVerified: mongoUser.isVerified
      },
      status: {
        canAccessAdmin: mongoUser.role === 'admin',
        issues: [
          firebaseUser.disabled && 'Usuario deshabilitado en Firebase',
          !firebaseUser.emailVerified && 'Email no verificado en Firebase',
          mongoUser.role !== 'admin' && 'Usuario no tiene rol de admin en MongoDB'
        ].filter(Boolean)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error en debug-auth-context:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
