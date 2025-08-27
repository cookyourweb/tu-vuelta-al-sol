import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const adminApp = getFirebaseAdmin();
    
    // Buscar usuario por email en Firebase Auth
    let userRecord;
    try {
      userRecord = await adminApp.auth().getUserByEmail(email);
    } catch (error) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado en Firebase Auth',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
        metadata: {
          creationTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error en debug-auth:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
