// src/app/api/astrology/generate-agenda-ai/route.ts
// 🔥 VERSIÓN ACTUALIZADA - USA DATOS ESPECÍFICOS DE CARTA NATAL

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';
import Chart from '@/models/Chart';
import { enrichUserProfileWithChartData } from '@/utils/astrology/enrichUserProfile';

// Función helper para obtener el cliente OpenAI (lazy loading)
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, regenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    console.log(`🔮 Generando agenda astrológica PERSONALIZADA para usuario: ${userId}`);

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

    // 2. Obtener carta progresada si existe
    let cartaProgresada = null;
    if (chart.progressedCharts && chart.progressedCharts.length > 0) {
      cartaProgresada = chart.progressedCharts[0].chart;
    }

    // 3. 🔥 ENRIQUECER PERFIL CON DATOS ESPECÍFICOS DE CARTA NATAL
    const enrichedUserProfile = await enrichUserProfileWithChartData({
      userId,
      birthData,
      natalChart: chart.natalChart,
      progressedChart: cartaProgresada
    });

    console.log(`🎯 Perfil enriquecido creado para ${enrichedUserProfile.name}:`);
    console.log(`- Sol natal: ${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house}`);
    console.log(`- Luna natal: ${enrichedUserProfile.detailedNatalChart?.luna?.sign} ${enrichedUserProfile.detailedNatalChart?.luna?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house}`);
    console.log(`- Ascendente: ${enrichedUserProfile.detailedNatalChart?.ascendente?.sign}`);

    // Preparar datos específicos para el prompt
    const currentYear = new Date().getFullYear();
    const birthDate = new Date(enrichedUserProfile.birthDate);
    const age = enrichedUserProfile.currentAge;

    // 4. 🔥 PROMPT MAESTRO CON DATOS ESPECÍFICOS DE CARTA NATAL
    const promptMaestro = `
Eres EL ORÁCULO CÓSMICO MÁS REVOLUCIONARIO que transforma vidas a través de agendas astrológicas ÉPICAS personalizadas.

🎯 MISIÓN CRÍTICA: Crear una experiencia que haga que ${enrichedUserProfile.name} sienta que está viviendo la película más ÉPICA de su vida usando sus datos REALES de carta natal.

🔥 DATOS ESPECÍFICOS DE CARTA NATAL DE ${enrichedUserProfile.name}:

📍 SOL NATAL: ${enrichedUserProfile.detailedNatalChart?.sol?.sign || 'Acuario'} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1) || '21.4'}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house || '1'}
🌙 LUNA NATAL: ${enrichedUserProfile.detailedNatalChart?.luna?.sign || 'Libra'} ${enrichedUserProfile.detailedNatalChart?.luna?.degree?.toFixed(1) || '5.9'}° Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house || '7'}  
⬆️ ASCENDENTE: ${enrichedUserProfile.detailedNatalChart?.ascendente?.sign || 'Leo'}
🌍 LUGAR: ${enrichedUserProfile.place}
👤 EDAD ACTUAL: ${age} años

🚀 TRANSFORMACIÓN OBLIGATORIA DE LENGUAJE PERSONALIZADO:

❌ NUNCA digas genérico: "Venus está en Cáncer" o "Activación Solar en Acuario"
✅ SIEMPRE personaliza: "¡REVOLUCIÓN ENERGÉTICA ${enrichedUserProfile.name?.toUpperCase()}! Tu Sol natal en ${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house} está recibiendo códigos de actualización directamente del cosmos"

❌ NUNCA digas: "Período de reflexión"  
✅ SIEMPRE di: "¡MOMENTO ÉPICO PARA REESCRIBIR TU HISTORIA ${enrichedUserProfile.name?.toUpperCase()}! Con tu Luna natal en ${enrichedUserProfile.detailedNatalChart?.luna?.sign} Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house}"

🌟 FORMATO JSON OBLIGATORIO - PERSONALIZADO PARA ${enrichedUserProfile.name}:

{
  "titulo": "🚀 ${enrichedUserProfile.name?.toUpperCase()}: TU REVOLUCIÓN CÓSMICA ${currentYear + 1}-${currentYear + 2}",
  "subtitulo": "AGENDA TRANSFORMADORA PERSONALIZADA - Tu Sol ${enrichedUserProfile.detailedNatalChart?.sol?.sign} y Luna ${enrichedUserProfile.detailedNatalChart?.luna?.sign} en acción",
  "intro_disruptiva": "¡ATENCIÓN ${enrichedUserProfile.name?.toUpperCase()}! Tu Sol natal en ${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house} y tu Luna en ${enrichedUserProfile.detailedNatalChart?.luna?.sign} Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house} han CONSPIRADO durante ${age} años para este momento ÉPICO...",
  "año_actual": ${currentYear + 1},
  "año_siguiente": ${currentYear + 2},
  "configuracion_natal_unica": {
    "sol_natal": "${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house}",
    "luna_natal": "${enrichedUserProfile.detailedNatalChart?.luna?.sign} ${enrichedUserProfile.detailedNatalChart?.luna?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house}",
    "ascendente": "${enrichedUserProfile.detailedNatalChart?.ascendente?.sign}",
    "elemento_dominante": "${enrichedUserProfile.detailedNatalChart?.sol?.element || 'aire'}",
    "modalidad_dominante": "${enrichedUserProfile.detailedNatalChart?.sol?.mode || 'fijo'}"
  },
  "meses": [
    {
      "mes": "Enero ${currentYear + 1}",
      "tema_central": "🔥 ACTIVACIÓN DE TU SOL ${enrichedUserProfile.detailedNatalChart?.sol?.sign?.toUpperCase()} NATAL",
      "energia_dominante": "Tu Sol natal en ${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house} se REACTIVA con una fuerza MAGNÉTICA sin precedentes. El universo está enviando frecuencias específicamente calibradas para tu configuración única.",
      "mantra_mensual": "SOY ${enrichedUserProfile.name?.toUpperCase()}, FUERZA ${translateElement(enrichedUserProfile.detailedNatalChart?.sol?.element)} DE ${enrichedUserProfile.detailedNatalChart?.sol?.sign?.toUpperCase()}, CREADOR/A DE MI REALIDAD",
      "eventos_clave": [
        {
          "fecha": "${currentYear + 1}-01-15", 
          "evento": "🌑 PORTAL CÓSMICO DE MANIFESTACIÓN PERSONALIZADO",
          "impacto_personal": "¡REVOLUCIÓN ENERGÉTICA ${enrichedUserProfile.name?.toUpperCase()}! Tu Sol natal en ${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house} está siendo DIRECTAMENTE ACTIVADO por este evento cósmico. Esto conecta con tu identidad más profunda y propósito de vida.",
          "ritual_epico_personalizado": "RITUAL ESPECÍFICO PARA TU SOL EN ${enrichedUserProfile.detailedNatalChart?.sol?.sign?.toUpperCase()}: 1) Conecta con tu elemento ${enrichedUserProfile.detailedNatalChart?.sol?.element} (${enrichedUserProfile.detailedNatalChart?.sol?.element === 'air' ? 'respira consciente, escribe intenciones' : enrichedUserProfile.detailedNatalChart?.sol?.element === 'fire' ? 'enciende vela, visualiza éxito' : enrichedUserProfile.detailedNatalChart?.sol?.element === 'water' ? 'baño ritual, medita' : 'conexión con naturaleza, planta semillas'}), 2) Activa tu Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house} (${getCasaTheme(enrichedUserProfile.detailedNatalChart?.sol?.house)}), 3) Declara tu poder como ${enrichedUserProfile.detailedNatalChart?.sol?.sign}",
          "mantra_evento": "SOY ${enrichedUserProfile.name?.toUpperCase()}, MI SOL EN ${enrichedUserProfile.detailedNatalChart?.sol?.sign?.toUpperCase()} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° SE ACTIVA CON FUERZA CÓSMICA"
        }
      ]
    }
  ],
  "patron_anual_personal_epico": {
    "fortaleza_dominante": "TU SOL ${enrichedUserProfile.detailedNatalChart?.sol?.sign} Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house} + LUNA ${enrichedUserProfile.detailedNatalChart?.luna?.sign} Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house} - Combinación ÚNICA de ${enrichedUserProfile.detailedNatalChart?.sol?.element} ${enrichedUserProfile.detailedNatalChart?.sol?.mode} con ${enrichedUserProfile.detailedNatalChart?.luna?.element} ${enrichedUserProfile.detailedNatalChart?.luna?.mode}",
    "mision_cosmica_este_año": "MISIÓN ESPECÍFICA basada en tu configuración Sol ${enrichedUserProfile.detailedNatalChart?.sol?.sign} Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house}: ${getCasaTheme(enrichedUserProfile.detailedNatalChart?.sol?.house)} elevado a nivel CÓSMICO"
  },
  "llamada_accion_final_epica": "🚀 ${enrichedUserProfile.name}, tu Sol natal en ${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house} y tu Luna en ${enrichedUserProfile.detailedNatalChart?.luna?.sign} Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house} son tu MAPA del tesoro más ÉPICO. ¡ES TU HORA DE ACTIVAR TU PODER NATAL COMPLETO!"
}

🎯 INSTRUCCIONES CRÍTICAS:
- USA los datos específicos de carta natal REALES en cada evento
- Menciona grados exactos, casas específicas, elementos y modalidades
- Crea 12 meses completos con eventos personalizados
- Haz que ${enrichedUserProfile.name} sienta que es la PROTAGONISTA de su película cósmica
- Conecta cada evento con sus posiciones planetarias exactas
`;

    // 5. Validar que OpenAI está configurado antes de proceder
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Servicio de IA no disponible. OPENAI_API_KEY no está configurada.',
        message: 'Por favor, configura la clave de API de OpenAI para usar esta funcionalidad',
        action: 'configure_openai'
      }, { status: 503 });
    }

    // 6. LLAMADA A OPENAI CON DATOS ESPECÍFICOS
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: promptMaestro
        },
        {
          role: "user", 
          content: `CREA LA AGENDA ASTROLÓGICA MÁS PERSONALIZADA para:

PERFIL COMPLETO CON CARTA NATAL ESPECÍFICA:
- Nombre: ${enrichedUserProfile.name}
- Edad: ${enrichedUserProfile.currentAge} años
- Lugar: ${enrichedUserProfile.place}
- Sol natal: ${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house}
- Luna natal: ${enrichedUserProfile.detailedNatalChart?.luna?.sign} ${enrichedUserProfile.detailedNatalChart?.luna?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house}
- Ascendente: ${enrichedUserProfile.detailedNatalChart?.ascendente?.sign}

PERÍODO: Desde cumpleaños ${birthDate.getDate()}/${birthDate.getMonth() + 1} de ${currentYear + 1} hasta el mismo día de ${currentYear + 2}.

🔥 INSTRUCCIÓN CRÍTICA: USA estos datos específicos de carta natal en CADA evento. Personaliza absolutamente TODO basándote en las posiciones planetarias EXACTAS de ${enrichedUserProfile.name}.

¡CREA UNA EXPERIENCIA ÉPICA Y COMPLETAMENTE PERSONALIZADA!`
        }
      ],
      temperature: 0.9,
      max_tokens: 4000
    });

    // 7. PROCESAR RESPUESTA
    const respuestaIA = completion.choices[0].message.content;
    
    try {
      // Limpiar posibles marcas de código
      const cleanResponse = respuestaIA
        ?.replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      const agendaGenerada = JSON.parse(cleanResponse || '{}');
      
      return NextResponse.json({
        success: true,
        data: {
          agenda: agendaGenerada,
          metadata: {
            generado_en: new Date().toISOString(),
            usuario: enrichedUserProfile.name,
            edad: enrichedUserProfile.currentAge,
            modelo_usado: "gpt-4o-mini",
            tokens_utilizados: completion.usage?.total_tokens || 0,
            costo_estimado: ((completion.usage?.total_tokens || 0) * 0.00003).toFixed(4) + " USD",
            personalizacion_nivel: "MÁXIMO - Datos específicos de carta natal",
            posiciones_planetarias: {
              sol_natal: `${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house}`,
              luna_natal: `${enrichedUserProfile.detailedNatalChart?.luna?.sign} ${enrichedUserProfile.detailedNatalChart?.luna?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house}`,
              ascendente: enrichedUserProfile.detailedNatalChart?.ascendente?.sign
            },
            tiene_carta_natal: !!chart.natalChart,
            tiene_carta_progresada: !!cartaProgresada,
            version_prompt: "PERSONALIZADA_CON_DATOS_REALES_v1.0"
          }
        },
        message: `¡Agenda astrológica COMPLETAMENTE PERSONALIZADA generada para ${enrichedUserProfile.name} con datos específicos de carta natal!`
      });
      
    } catch (parseError) {
      // Si no es JSON válido, devolver como texto estructurado
      return NextResponse.json({
        success: true,
        data: {
          agenda: {
            titulo: `🚀 ${enrichedUserProfile.name?.toUpperCase()}: TU REVOLUCIÓN CÓSMICA ${currentYear + 1}-${currentYear + 2}`,
            subtitulo: `AGENDA PERSONALIZADA - Sol ${enrichedUserProfile.detailedNatalChart?.sol?.sign}, Luna ${enrichedUserProfile.detailedNatalChart?.luna?.sign}`,
            contenido_personalizado: respuestaIA,
            configuracion_natal: {
              sol: `${enrichedUserProfile.detailedNatalChart?.sol?.sign} ${enrichedUserProfile.detailedNatalChart?.sol?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.sol?.house}`,
              luna: `${enrichedUserProfile.detailedNatalChart?.luna?.sign} ${enrichedUserProfile.detailedNatalChart?.luna?.degree?.toFixed(1)}° Casa ${enrichedUserProfile.detailedNatalChart?.luna?.house}`,
              ascendente: enrichedUserProfile.detailedNatalChart?.ascendente?.sign
            },
            procesado: false
          },
          metadata: {
            generado_en: new Date().toISOString(),
            modelo_usado: "gpt-4o-mini",
            formato: "texto_personalizado_fallback",
            personalizacion: "DATOS_CARTA_NATAL_INCLUIDOS"
          }
        },
        message: `Agenda personalizada generada para ${enrichedUserProfile.name} con datos específicos`
      });
    }

  } catch (error) {
    console.error('❌ Error generando agenda personalizada:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: "Error al generar la agenda astrológica personalizada",
      debug: process.env.NODE_ENV === 'development' ? {
        error_details: error,
        openai_configured: !!process.env.OPENAI_API_KEY,
        version: "PERSONALIZADA_v1.0"
      } : undefined
    }, { status: 500 });
  }
}

// Función auxiliar para obtener tema de casa
function getCasaTheme(casa: number = 1): string {
  const temas: Record<number, string> = {
    1: 'identidad y autopresentación',
    2: 'recursos y valores',
    3: 'comunicación y hermanos',
    4: 'hogar y familia',
    5: 'creatividad y romance',
    6: 'trabajo y salud',
    7: 'relaciones y matrimonio',
    8: 'transformación',
    9: 'filosofía y estudios',
    10: 'carrera y reputación',
    11: 'amistades y grupos',
    12: 'espiritualidad'
  };
  return temas[casa] || 'área de vida';
}

// Función auxiliar para traducir elementos a español
function translateElement(element: string | undefined): string {
  const translations: Record<string, string> = {
    'fire': 'FUEGO',
    'earth': 'TIERRA', 
    'air': 'AIRE',
    'water': 'AGUA'
  };
  return translations[element?.toLowerCase() || ''] || 'AIRE';
}

// ENDPOINT DE PRUEBA GET - ACTUALIZADO
export async function GET() {
  return NextResponse.json({
    status: "🚀 ENDPOINT AGENDA PERSONALIZADA CON CARTA NATAL FUNCIONANDO",
    version: "PERSONALIZADA v1.0 - Datos específicos de carta natal",
    configuracion: {
      openai_configurado: !!process.env.OPENAI_API_KEY,
      endpoint: "POST /api/astrology/generate-agenda-ai",
      parametros_requeridos: ["userId"],
      parametros_opcionales: ["regenerate"]
    },
    caracteristicas_nuevas: [
      "🎯 Datos específicos de carta natal (Sol, Luna, Ascendente)",
      "📍 Grados exactos y casas específicas",
      "🔥 Personalización máxima con nombres y posiciones reales",
      "⚡ Rituales adaptados al elemento y modalidad natal",
      "🌟 Interpretaciones basadas en configuración única",
      "💫 Fallbacks inteligentes si falla el parsing JSON"
    ],
    ejemplo_transformacion: {
      antes: "Activación Solar en Acuario. Evento personalizado...",
      despues: "¡REVOLUCIÓN ENERGÉTICA VERÓNICA! Tu Sol natal en Acuario 21.4° Casa 1 está siendo DIRECTAMENTE ACTIVADO..."
    },
    flujo_personalizado: [
      "1. Obtiene carta natal específica del usuario",
      "2. Enriquece perfil con posiciones exactas",
      "3. Genera prompt con datos REALES de planetas",
      "4. IA crea agenda 100% personalizada",
      "5. Cada evento menciona posiciones específicas",
      "6. Usuario siente experiencia única y personal"
    ],
    nota_importante: !process.env.OPENAI_API_KEY ? 
      "⚠️ OPENAI_API_KEY no configurada - Funcionalidad personalizada no disponible" : 
      "✅ Sistema personalizado COMPLETAMENTE OPERATIVO"
  });
}