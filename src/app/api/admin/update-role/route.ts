import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { uid, role } = await request.json();
    
    if (!uid || !role) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    await connectDB();

    // Verificar si el usuario existe
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Actualizar el rol del usuario
    user.role = role;
    await user.save();

    return NextResponse.json(
      { message: 'Rol de usuario actualizado correctamente', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar rol de usuario' },
      { status: 500 }
    );
  }
}
