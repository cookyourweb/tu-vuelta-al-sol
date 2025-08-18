// src/app/api/astrology/generate-agenda-ai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    // Obtener datos del usuario
    const birthData = await BirthData.findOne({ userId });
    const chart = await Chart.findOne({ userId });
    
    if (!birthData || !chart?.natalChart) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos. Genera tu carta natal primero.' },
        { status: 404 }
      );
    }

    const currentYear = new Date().getFullYear();
    const userData = {
      nombre: birthData.fullName || 'Explorador Cósmico',
      fecha_nacimiento: birthData.birthDate.toISOString().split('T')[0],
      edad_actual: currentYear - birthData.birthDate.getFullYear()
    };

    // Prompt estilo TuVueltaAlSol
    const promptMaestro = `
Eres un astrólogo revolucionario que crea AGENDAS ASTROLÓGICAS TRANSFORMADORAS.

ESTILO OBLIGATORIO:
- Tono: DISRUPTIVO, MOTIVADOR, EMPODERADOR  
- Lenguaje: "¡ESTO ES LITERAL TU GUIÓN CÓSMICO!"
- Enfoque: REVOLUCIÓN PERSONAL, no predicción pasiva

RESPONDE EN FORMATO JSON:
{
  "titulo": "🌟 TU REVOLUCIÓN CÓSMICA ${currentYear + 1}",
  "intro_disruptiva": "¡ATENCIÓN ${userData.nombre}! Las estrellas han conspirado para tu despertar...",
  "año_actual": ${currentYear + 1},
  "fechas_power": {
    "cumpleanos_solar": "¡DÍA DE MÁXIMO PODER CÓSMICO!",
    "mensaje_final": "Tu momento de despertar épico comienza AHORA..."
  }
}

Crea una respuesta ÉPICA y TRANSFORMADORA para ${userData.nombre}.
`;

    // Llamada a OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: promptMaestro },
        { role: "user", content: `Genera agenda para: ${JSON.stringify(userData)}` }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const respuestaIA = completion.choices[0].message.content;
    
    // Parsear respuesta
    let agendaGenerada;
    try {
      agendaGenerada = JSON.parse(respuestaIA?.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim() || '{}');
    } catch {
      agendaGenerada = { agenda_texto: respuestaIA };
    }

    return NextResponse.json({
      success: true,
      data: {
        agenda: agendaGenerada,
        metadata: {
          generado_en: new Date().toISOString(),
          usuario: userData.nombre,
          tokens_utilizados: completion.usage?.total_tokens || 0
        }
      },
      message: `¡Agenda astrológica generada para ${userData.nombre}!`
    });

  } catch (error) {
    console.error('❌ Error generando agenda IA:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: "Error al generar la agenda astrológica"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "✅ Endpoint de Agenda IA funcionando",
    configuracion: {
      openai_configurado: !!process.env.OPENAI_API_KEY
    }
  });
}