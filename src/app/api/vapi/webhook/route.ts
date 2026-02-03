import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

// ==========================================
// 📥 POST: WEBHOOK DE VAPI
// Recibe actualizaciones de llamadas
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📞 [VAPI WEBHOOK] Evento recibido:', body.message?.type || 'unknown');

    // Tipos de eventos de Vapi
    const { message } = body;

    if (!message) {
      return NextResponse.json({ success: true });
    }

    const { type, call } = message;

    // Extraer leadId del metadata si existe
    const leadId = call?.metadata?.leadId;

    await connectDB();

    switch (type) {
      case 'call-started':
        console.log('📞 [VAPI] Llamada iniciada:', call?.id);
        if (leadId) {
          await Lead.findByIdAndUpdate(leadId, {
            status: 'contactado',
            notas: `Llamada iniciada: ${call?.id}`
          });
        }
        break;

      case 'call-ended':
        console.log('📞 [VAPI] Llamada finalizada:', call?.id);
        console.log('   Duración:', call?.duration, 'segundos');
        console.log('   Estado:', call?.status);

        if (leadId) {
          const duration = call?.duration || 0;
          const status = duration > 30 ? 'interesado' : 'contactado';

          await Lead.findByIdAndUpdate(leadId, {
            status,
            notas: `Llamada finalizada. Duración: ${duration}s. Estado: ${call?.status}`
          });
        }
        break;

      case 'transcript':
        // Transcripción de la llamada
        console.log('📝 [VAPI] Transcripción recibida');
        if (leadId && call?.transcript) {
          await Lead.findByIdAndUpdate(leadId, {
            $push: {
              notas: `\n\nTranscripción:\n${call.transcript}`
            }
          });
        }
        break;

      case 'hang':
        // Usuario colgó
        console.log('📞 [VAPI] Usuario colgó');
        break;

      case 'speech-update':
        // Actualización de speech (ignorar)
        break;

      case 'function-call':
        // Llamada a función del asistente
        console.log('🔧 [VAPI] Function call:', message.functionCall?.name);
        break;

      default:
        console.log('📞 [VAPI] Evento no manejado:', type);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ [VAPI WEBHOOK] Error:', error);
    // Siempre devolver 200 para que Vapi no reintente
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}

// Vapi también puede hacer GET para verificar el webhook
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Vapi webhook activo',
    timestamp: new Date().toISOString()
  });
}
