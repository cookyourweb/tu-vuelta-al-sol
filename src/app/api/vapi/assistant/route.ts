import { NextRequest, NextResponse } from 'next/server';
import vapiService from '@/services/vapiService';

// ==========================================
// 📥 GET: LISTAR ASISTENTES
// ==========================================

export async function GET() {
  try {
    const assistants = await vapiService.listAssistants();

    return NextResponse.json({
      success: true,
      assistants
    });

  } catch (error: any) {
    console.error('❌ [VAPI] Error al listar asistentes:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}

// ==========================================
// 📤 POST: CREAR ASISTENTE
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const assistant = await vapiService.createAssistant(body);

    return NextResponse.json({
      success: true,
      assistant,
      message: `Asistente creado. Añade VAPI_ASSISTANT_ID=${assistant.id} a tu .env`
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ [VAPI] Error al crear asistente:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}
