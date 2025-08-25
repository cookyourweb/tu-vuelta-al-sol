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
    const { userId, regenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🔮 Generando agenda astrológica para usuario: ${userId}`);

    // Conectar a base de datos
    await connectDB();

    // 1. Obtener datos del usuario automáticamente
    const birthData = await BirthData.findOne({ userId });
    const chart = await Chart.findOne({ userId });
    
    if (!birthData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos de nacimiento no encontrados. Completa tu perfil primero.',
          action: 'redirect_to_birth_data'
        },
        { status: 404 }
      );
    }

    if (!chart?.natalChart) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Carta natal no encontrada. Genera tu carta natal primero.',
          action: 'redirect_to_natal_chart'
        },
        { status: 404 }
      );
    }

    // 2. Preparar datos automatizados
    const currentYear = new Date().getFullYear();
    const birthDate = new Date(birthData.birthDate);
    const age = currentYear - birthDate.getFullYear();
    
    const userData = {
      nombre: birthData.fullName || 'Explorador Cósmico',
      fecha_nacimiento: birthData.birthDate.toISOString().split('T')[0],
      hora_nacimiento: birthData.birthTime || '12:00:00',
      lugar_nacimiento: birthData.birthPlace || 'Lugar sagrado',
      edad_actual: age
    };

    // 3. Obtener carta progresada si existe
    let cartaProgresada = null;
    if (chart.progressedCharts && chart.progressedCharts.length > 0) {
      cartaProgresada = chart.progressedCharts[0].chart;
    }

    console.log(`📊 Datos preparados para ${userData.nombre}, edad ${userData.edad_actual}`);

    // 4. PROMPT MAESTRO OPTIMIZADO
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
  "titulo": "🌟 ${userData.nombre.toUpperCase()}: TU REVOLUCIÓN CÓSMICA ${currentYear + 1}",
  "subtitulo": "Agenda de Manifestación Astrológica Personalizada", 
  "intro_disruptiva": "¡ATENCIÓN ${userData.nombre}! Las estrellas han conspirado para tu despertar épico a los ${userData.edad_actual} años...",
  "año_actual": ${currentYear},
  "año_siguiente": ${currentYear + 1},
  "meses": [
    {
      "mes": "Enero ${currentYear + 1}",
      "tema_central": "ACTIVACIÓN DE TU PODER PERSONAL",
      "energia_dominante": "Sol progresado activando tu Casa de [ANALIZA CARTA]",
      "mantra_mensual": "SOY EL ARQUITECTO DE MI DESTINO",
      "eventos_clave": [
        {
          "fecha": "${currentYear + 1}-01-15", 
          "evento": "Luna Nueva en Capricornio",
          "impacto_personal": "MOMENTO ÉPICO para manifestar abundancia material específica para ${userData.nombre}",
          "accion_recomendada": "Ritual específico personalizado",
          "evitar": "No tomes decisiones importantes en [área específica basada en carta]"
        }
      ],
      "ritual_power": "Ritual personalizado basado en las posiciones planetarias de ${userData.nombre}",
      "afirmacion_diaria": "Afirmación específica para ${userData.nombre} basada en su carta natal"
    }
  ],
  "fechas_power": {
    "cumpleanos_solar": "¡DÍA DE MÁXIMO PODER CÓSMICO para ${userData.nombre}!",
    "eclipses_personales": "Portales de transformación específicos para ${userData.nombre}",
    "retrogrados_clave": "Períodos de revisión interna perfectos para ${userData.nombre}"
  },
  "llamada_accion_final": "${userData.nombre}, tu momento de despertar épico comienza AHORA..."
}

IMPORTANTE: Personaliza TODO basándote en la carta natal real. Menciona signos, casas y planetas específicos.
`;

    // 5. LLAMADA A OPENAI CON DATOS REALES
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: promptMaestro
        },
        {
          role: "user", 
          content: `Crea una agenda astrológica ÉPICA y DISRUPTIVA para:

DATOS USUARIO:
${JSON.stringify(userData, null, 2)}

CARTA NATAL COMPLETA:
${JSON.stringify(chart.natalChart, null, 2)}

CARTA PROGRESADA (si disponible):
${cartaProgresada ? JSON.stringify(cartaProgresada, null, 2) : 'No disponible aún'}

PERIODO: Desde cumpleaños ${birthDate.getDate()}/${birthDate.getMonth() + 1} de ${currentYear + 1} hasta el mismo día de ${currentYear + 2}.

¡CREA UNA EXPERIENCIA ÉPICA Y TRANSFORMADORA PARA ${userData.nombre}!

ANALIZA su carta natal real, menciona sus planetas específicos, signos y casas.
Personaliza cada evento según SUS posiciones planetarias.
Haz que se sienta como el protagonista de su propia película cósmica.`
        }
      ],
      temperature: 0.8,
      max_tokens: 4000
    });

    // 6. PROCESAR RESPUESTA
    const respuestaIA = completion.choices[0].message.content;
    console.log(`🎯 Respuesta generada para ${userData.nombre}:`, respuestaIA?.substring(0, 200));
    
    let agendaGenerada;
    
    try {
      // Limpiar la respuesta de posibles marcas de código
      const cleanResponse = respuestaIA
        ?.replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      agendaGenerada = JSON.parse(cleanResponse || '{}');
      
      console.log(`✅ Agenda JSON parseada correctamente para ${userData.nombre}`);
      
    } catch (parseError) {
      console.warn(`⚠️ Error parseando JSON, devolviendo como texto:`, parseError);
      
      return NextResponse.json({
        success: true,
        data: {
          agenda_texto: respuestaIA,
          metadata: {
            generado_en: new Date().toISOString(),
            usuario: userData.nombre,
            edad: userData.edad_actual,
            modelo_usado: "gpt-4o-mini",
            formato: "texto_libre"
          }
        },
        message: `Agenda generada en formato texto para ${userData.nombre}`
      });
    }

    // 7. RESPUESTA EXITOSA
    return NextResponse.json({
      success: true,
      data: {
        agenda: agendaGenerada,
        metadata: {
          generado_en: new Date().toISOString(),
          usuario: userData.nombre,
          edad: userData.edad_actual,
          lugar_nacimiento: userData.lugar_nacimiento,
          periodo: `${currentYear + 1}-${currentYear + 2}`,
          modelo_usado: "gpt-4o-mini",
          tokens_utilizados: completion.usage?.total_tokens || 0,
          costo_estimado: ((completion.usage?.total_tokens || 0) * 0.00003).toFixed(4) + " USD",
          tiene_carta_natal: !!chart.natalChart,
          tiene_carta_progresada: !!cartaProgresada
        }
      },
      message: `¡Agenda astrológica ÉPICA generada para ${userData.nombre}!`
    });

  } catch (error) {
    console.error('❌ Error generando agenda IA:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: "Error al generar la agenda astrológica",
      debug: process.env.NODE_ENV === 'development' ? {
        error_details: error,
        openai_configured: !!process.env.OPENAI_API_KEY
      } : undefined
    }, { status: 500 });
  }
}

// 🔍 ENDPOINT DE PRUEBA GET
export async function GET() {
  return NextResponse.json({
    status: "✅ Endpoint de Agenda IA OPTIMIZADO funcionando",
    version: "2.0 - Automatizado",
    configuracion: {
      openai_configurado: !!process.env.OPENAI_API_KEY,
      endpoint: "POST /api/astrology/generate-agenda-ai",
      parametros_requeridos: ["userId"],
      parametros_opcionales: ["regenerate"]
    },
    ejemplo_uso: {
      method: "POST",
      body: {
        userId: "firebase_user_id_aqui",
        regenerate: false
      }
    },
    flujo: [
      "1. Recibe userId",
      "2. Obtiene datos automáticamente de BD",
      "3. Valida carta natal existe",
      "4. Genera prompt personalizado",
      "5. Llama a OpenAI",
      "6. Devuelve agenda épica"
    ],
    timestamps: {
      servidor: new Date().toISOString(),
      zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });
}