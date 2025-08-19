import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Chart from '@/models/Chart';
import BirthData from '@/models/BirthData';
import admin from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const { uid, email } = await request.json();
    
    if (!uid && !email) {
      return NextResponse.json({ error: 'Falta uid o email' }, { status: 400 });
    }

    await connectDB();

    // Construir filtro para eliminar por uid o email
    const userFilter = uid ? { uid } : { email };

    // Buscar usuario para obtener uid si se busca por email
    let user = null;
    if (email && !uid) {
      user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }
      userFilter.uid = user.uid;
    }

    // Eliminar usuario en Firebase Auth
    let firebaseAuthDeleted = false;
    let firebaseAuthError = '';
    if (userFilter.uid) {
      try {
        await admin.auth().deleteUser(userFilter.uid);
        firebaseAuthDeleted = true;
      } catch (e: any) {
        firebaseAuthDeleted = false;
        firebaseAuthError = e?.message || String(e);
        console.log('Firebase Auth delete error:', firebaseAuthError);
      }
    }

    // Eliminar usuario en la base de datos
    const userDeletionResult = await User.deleteOne(userFilter);
    // Eliminar charts asociados
    const chartsDeletionResult = await Chart.deleteMany({ userId: userFilter.uid });
    // Eliminar todos los birthdatas asociados
    const birthDataDeletionResult = await BirthData.deleteMany({ userId: userFilter.uid });

    if (userDeletionResult.deletedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Usuario, charts y birthdatas eliminados correctamente',
      userDeleted: userDeletionResult.deletedCount,
      chartsDeleted: chartsDeletionResult.deletedCount,
      birthDatasDeleted: birthDataDeletionResult.deletedCount,
      firebaseAuthDeleted,
      firebaseAuthError
    }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
