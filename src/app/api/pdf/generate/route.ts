// src/app/api/astrology/generate-agenda-ai/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Función helper para obtener el cliente OpenAI (lazy loading)
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface AgendaRequest {
  datos_usuario: {
    nombre: string;
    fecha_nacimiento: string;
    hora_nacimiento: string;
    lugar_nacimiento: string;
    edad_actual: number;
  };
  carta_natal: any;
  carta_progresada: any;
  transitos_anuales?: any;
}

export async function POST(request: NextRequest) {
  try {
    const body: AgendaRequest = await request.json();
    
    // 🔮 PROMPT MAESTRO TUVUELTAALSOL
    const promptMaestro = `
Eres un astrólogo revolucionario y disruptivo que crea AGENDAS ASTROLÓGICAS TRANSFORMADORAS. 
Tu misión es convertir datos astrológicos en EXPERIENCIAS ÉPICAS que cambien vidas.

ESTILO OBLIGATORIO:
- Tono: DISRUPTIVO, MOTIVADOR, EMPODERADOR  
- Lenguaje: "¡ESTO ES LITERAL TU GUIÓN CÓSMICO!"
- Enfoque: REVOLUCIÓN PERSONAL, no predicción pasiva
- Energía: ALTA, ÉPICA, TRANSFORMADORA

REGLAS DE ORO:
❌ NO digas: "Venus está en Cáncer"
✅ SÍ di: "¡TU CORAZÓN SE CONVIERTE EN UNA FUERZA MAGNÉTICA IRRESISTIBLE!"

❌ NO digas: "Posible período de reflexión"  
✅ SÍ di: "¡MOMENTO DE REESCRIBIR TU HISTORIA DESDE EL ALMA!"

DEBE INCLUIR:
- Mantra mensual personalizado
- Rituales específicos por eventos
- Acciones concretas QUÉ HACER
- Fechas de máximo poder personal
- Qué EVITAR en días específicos

USA EL NOMBRE DE LA PERSONA CONSTANTEMENTE.
CONECTA TODO con su carta natal específica.
MENCIONA casas astrológicas y su significado personal.

RESPONDE EN FORMATO JSON EXACTO:
{
  "titulo": "🌟 TU REVOLUCIÓN CÓSMICA 2025-2026",
  "subtitulo": "Agenda de Manifestación Astrológica Personalizada", 
  "intro_disruptiva": "¡ATENCIÓN [NOMBRE]! Las estrellas han conspirado para tu despertar...",
  "año_actual": 2025,
  "año_siguiente": 2026,
  "meses": [
    {
      "mes": "Enero 2025",
      "tema_central": "ACTIVACIÓN DE TU PODER PERSONAL",
      "energia_dominante": "Sol progresado en [signo] Casa [número]",
      "mantra_mensual": "SOY EL ARQUITECTO DE MI DESTINO",
      "eventos_clave": [
        {
          "fecha": "2025-01-15", 
          "evento": "Luna Nueva en Capricornio",
          "impacto_personal": "MOMENTO ÉPICO para manifestar abundancia material",
          "accion_recomendada": "Ritual específico de manifestación",
          "evitar": "No tomes decisiones importantes en relaciones"
        }
      ],
      "ritual_power": "Descripción del ritual específico para este mes",
      "afirmacion_diaria": "Afirmación poderosa personalizada"
    }
  ],
  "fechas_power": {
    "cumpleanos_solar": "¡DÍA DE MÁXIMO PODER CÓSMICO!",
    "eclipses_personales": "Portales de transformación específicos", 
    "retrogrados_clave": "Períodos de revisión interna"
  },
  "llamada_accion_final": "Tu momento de despertar épico comienza AHORA..."
}
`;

    // 🚀 LLAMADA A OPENAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: promptMaestro
        },
        {
          role: "user", 
          content: `Crea una agenda astrológica disruptiva para:

DATOS USUARIO:
${JSON.stringify(body.datos_usuario, null, 2)}

CARTA NATAL:
${JSON.stringify(body.carta_natal, null, 2)}

CARTA PROGRESADA:
${JSON.stringify(body.carta_progresada, null, 2)}

Período: Desde cumpleaños ${body.datos_usuario.fecha_nacimiento.split('-')[1]}/${body.datos_usuario.fecha_nacimiento.split('-')[2]} de 2025 hasta el mismo día de 2026.

¡CREA UNA EXPERIENCIA ÉPICA Y TRANSFORMADORA!`
        }
      ],
      temperature: 0.8,
      max_tokens: 4000
    });

    // 📝 PROCESAR RESPUESTA
    const respuestaIA = completion.choices[0].message.content;
    
    try {
      // Intentar parsear como JSON
      const agendaGenerada = JSON.parse(respuestaIA || '{}');
      
      return NextResponse.json({
        success: true,
        data: {
          agenda: agendaGenerada,
          metadata: {
            generado_en: new Date().toISOString(),
            modelo_usado: "gpt-4-turbo-preview",
            tokens_utilizados: completion.usage?.total_tokens || 0,
            costo_estimado: ((completion.usage?.total_tokens || 0) * 0.00003).toFixed(4) + " USD"
          }
        },
        message: "¡Agenda astrológica disruptiva generada con éxito!"
      });
      
    } catch (parseError) {
      // Si no es JSON válido, devolver como texto
      return NextResponse.json({
        success: true,
        data: {
          agenda_texto: respuestaIA,
          metadata: {
            generado_en: new Date().toISOString(),
            modelo_usado: "gpt-4-turbo-preview",
            formato: "texto_libre"
          }
        },
        message: "Agenda generada en formato texto"
      });
    }

  } catch (error) {
    console.error('❌ Error generando agenda IA:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: "Error al generar la agenda astrológica"
    }, { status: 500 });
  }
}

// 🔍 ENDPOINT DE PRUEBA GET
export async function GET() {
  return NextResponse.json({
    status: "✅ Endpoint de Agenda IA funcionando",
    endpoints: {
      generar: "POST /api/astrology/generate-agenda-ai",
      parametros_requeridos: [
        "datos_usuario.nombre",
        "datos_usuario.fecha_nacimiento", 
        "carta_natal",
        "carta_progresada"
      ]
    },
    ejemplo_uso: {
      method: "POST",
      body: {
        datos_usuario: {
          nombre: "María",
          fecha_nacimiento: "1974-02-10",
          hora_nacimiento: "07:30",
          lugar_nacimiento: "Madrid, España",
          edad_actual: 51
        },
        carta_natal: "{ datos de carta natal }",
        carta_progresada: "{ datos de carta progresada }"
      }
    }
  });
}