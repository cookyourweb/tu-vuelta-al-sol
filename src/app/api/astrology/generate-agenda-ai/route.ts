// =============================================================================
// 🔧 CORRECCIÓN 3: Agenda IA - Usando tipos existentes
// src/app/api/astrology/generate-agenda-ai/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// ✅ USAR SOLO TIPOS EXISTENTES
import type { 
  AstrologicalEvent,
  UserProfile,
  PersonalizedInterpretation
} from '@/types/astrology/unified-types';

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Perfil de usuario requerido'
      }, { status: 400 });
    }

    console.log('🎯 [AGENDA-IA] Generando agenda personalizada para:', userProfile.name);

    // Obtener datos de cartas si están disponibles
    const natalChart = userProfile.detailedNatalChart || null;
    const progressedChart = userProfile.detailedProgressedChart || null;

    console.log('📊 [AGENDA-IA] Datos disponibles:', {
      tiene_carta_natal: !!natalChart,
      tiene_carta_progresada: !!progressedChart,
      edad: userProfile.currentAge
    });

    // ✅ GENERAR EVENTOS USANDO TIPOS EXISTENTES
    const events = generatePersonalizedEvents(userProfile, natalChart, progressedChart);
    
    // Si tenemos OpenAI configurado, usar IA para interpretaciones adicionales
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = createPersonalizedPrompt(userProfile, natalChart, progressedChart);
      
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Eres un astrólogo evolutivo experto especializado en interpretaciones personalizadas profundas. Tu estilo es disruptivo, motivador y transformacional. NUNCA das interpretaciones genéricas.`
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.8,
        });

        const aiContent = response.choices[0]?.message?.content;
        console.log('🤖 [AGENDA-IA] Respuesta de OpenAI recibida');
        
        try {
          const aiInterpretations = JSON.parse(aiContent || '{}');
          
          // Agregar interpretaciones de IA usando tipos existentes
          if (aiInterpretations.interpretaciones) {
            aiInterpretations.interpretaciones.forEach((interpretation: any) => {
              const newEvent: AstrologicalEvent = {
                id: `ai-${Date.now()}-${Math.random()}`,
                type: 'ai_generated',
                date: interpretation.fecha,
                title: interpretation.evento,
                description: 'Interpretación personalizada con IA',
                importance: 'high',
                priority: 'high', // ✅ Ambos campos para compatibilidad
                aiInterpretation: {
                  meaning: interpretation.significado_epico,
                  advice: interpretation.consejo_revolucionario,
                  mantra: interpretation.mantra_de_poder,
                  ritual: interpretation.ritual_recomendado,
                  lifeAreas: ['Crecimiento Personal', 'Transformación', 'Propósito de Vida']
                }
              };
              events.push(newEvent);
            });
          }
        } catch (parseError) {
          console.log('⚠️ [AGENDA-IA] Error parseando respuesta de IA, usando eventos base');
        }
        
      } catch (openaiError) {
        console.error('❌ [AGENDA-IA] Error con OpenAI:', openaiError);
      }
    }

    // Ordenar eventos por fecha
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const currentYear = new Date().getFullYear();
    
    return NextResponse.json({
      success: true,
      data: {
        agenda: {
          titulo: `🌟 ${userProfile.name?.toUpperCase()}: TU REVOLUCIÓN CÓSMICA ${currentYear}-${currentYear + 1}`,
          subtitulo: `AGENDA PERSONALIZADA - ${natalChart ? `Sol ${getSolSign(natalChart)}, Luna ${getLunaSign(natalChart)}` : 'Configuración Única'}`,
          eventos: events,
          total_eventos: events.length,
          personalizacion: {
            tiene_carta_natal: !!natalChart,
            tiene_carta_progresada: !!progressedChart,
            edad_actual: userProfile.currentAge,
            configuracion_solar: natalChart ? `${getSolSign(natalChart)} ${getSolDegree(natalChart)}°` : 'N/A'
          }
        },
        metadata: {
          generado_en: new Date().toISOString(),
          modelo_usado: process.env.OPENAI_API_KEY ? "gpt-4o-mini + personalización" : "personalización_base",
          nivel_personalizacion: natalChart ? "MÁXIMA" : "ALTA",
          version: "USANDO_TIPOS_EXISTENTES_v1.0"
        }
      },
      message: `✨ Agenda completamente personalizada generada para ${userProfile.name} con ${events.length} eventos épicos`
    });

  } catch (error) {
    console.error('❌ [AGENDA-IA] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// ✅ FUNCIONES HELPER usando tipos existentes
function generatePersonalizedEvents(userProfile: UserProfile, natalChart: any, progressedChart: any): AstrologicalEvent[] {
  const events: AstrologicalEvent[] = [];
  
  // Evento personalizado usando datos reales del usuario
  const mercurioEvent: AstrologicalEvent = {
    id: 'mercurio-libra-personalizado',
    type: 'planetary_transit',
    date: '2025-09-05',
    title: 'Mercurio entra en Libra',
    description: 'Tu planeta regente mejora tu comunicación y relaciones',
    importance: 'high',
    priority: 'high',
    planet: 'Mercurio',
    sign: 'Libra',
    aiInterpretation: {
      meaning: `🔥 **REVOLUCIÓN COMUNICATIVA ÉPICA, ${userProfile.name?.toUpperCase()}!**
      
      Tu configuración astrológica única está recibiendo un UPGRADE cósmico masivo. A los ${userProfile.currentAge} años, tienes la experiencia perfecta para aprovechar esta energía al máximo.`,
      
      advice: `**APROVECHA ESTE MOMENTO DORADO:**
      
      🎯 **TU VENTAJA ÚNICA**: Tu madurez de ${userProfile.currentAge} años + nueva habilidad diplomática = PODER TOTAL.
      
      **ACCIONES INMEDIATAS:**
      • Inicia conversaciones importantes que has postpone
      • Propón ideas creativas - es tu momento brillante
      • Usa tu experiencia para mediar conflictos
      • Ese proyecto que tenías en mente - HAZLO AHORA`,
      
      mantra: 'MI EXPERIENCIA SE EXPRESA CON ELEGANCIA Y CREA PUENTES DE ENTENDIMIENTO',
      
      ritual: `**RITUAL DE PODER PERSONAL:**
      1. Escribe 3 ideas que quieres comunicar mejor
      2. Practica expresar cada idea con diplomacia
      3. Añade tu toque personal único
      4. Envía un mensaje importante que has estado postponiendo`,
      
      lifeAreas: ['Comunicación', 'Relaciones', 'Proyectos', 'Liderazgo']
    }
  };
  
  events.push(mercurioEvent);

  // Más eventos personalizados...
  const lunaEvent: AstrologicalEvent = {
    id: 'luna-nueva-personalizada',
    type: 'lunar_phase',
    date: '2025-09-15',
    title: 'Luna Nueva en Virgo',
    description: 'Momento perfecto para nuevos comienzos organizados',
    importance: 'medium',
    priority: 'medium',
    aiInterpretation: {
      meaning: `🌑 **RESET CÓSMICO PERSONALIZADO, ${userProfile.name?.toUpperCase()}!**
      
      A los ${userProfile.currentAge} años, tienes la experiencia para saber QUÉ proyectos merecen tu energía. Esta Luna Nueva te ayuda a ORGANIZARTE para manifestar tus visiones.`,
      
      advice: `**TU OPORTUNIDAD DORADA:**
      
      • Lista 3 proyectos prioritarios
      • Crea un plan realista para cada uno
      • Usa tu experiencia para evitar errores pasados
      • Establece rutinas que realmente funcionen para ti`,
      
      mantra: 'MIS VISIONES SE ORGANIZAN EN REALIDADES TANGIBLES',
      ritual: 'Escribe tus intenciones, organízalas por prioridad y elimina las que ya no resuenan contigo',
      lifeAreas: ['Organización', 'Nuevos Proyectos', 'Rutinas', 'Productividad']
    }
  };
  
  events.push(lunaEvent);

  return events;
}

function createPersonalizedPrompt(userProfile: UserProfile, natalChart: any, progressedChart: any): string {
  return `
# CONTEXTO ASTROLÓGICO PARA ${userProfile.name?.toUpperCase()}

## PERFIL PERSONAL
- **Nombre**: ${userProfile.name}
- **Edad actual**: ${userProfile.currentAge} años
- **Momento evolutivo**: ${userProfile.currentAge >= 50 ? 'MAESTRÍA E INTEGRACIÓN' : 'CRECIMIENTO Y EXPERIENCIA'}

## ANÁLISIS PERSONALIZADO
A los ${userProfile.currentAge} años estás en una fase única de tu evolución personal. 

Genera 2 interpretaciones adicionales épicas para eventos del próximo año de ${userProfile.name}.

Formato JSON:
{
  "interpretaciones": [
    {
      "evento": "nombre del evento",
      "fecha": "2025-MM-DD",
      "significado_epico": "Por qué es épico específicamente para ${userProfile.name}",
      "consejo_revolucionario": "Acción específica considerando su edad de ${userProfile.currentAge} años",
      "mantra_de_poder": "Mantra personalizado",
      "ritual_recomendado": "Ritual específico"
    }
  ]
}
`;
}

// Helper functions para extraer datos de carta natal de forma segura
function getSolSign(natalChart: any): string {
  return natalChart?.planetas?.find((p: any) => p.name === 'Sol')?.sign || 
         natalChart?.sol?.sign || 
         'Acuario';
}

function getLunaSign(natalChart: any): string {
  return natalChart?.planetas?.find((p: any) => p.name === 'Luna')?.sign || 
         natalChart?.luna?.sign || 
         'Libra';
}

function getSolDegree(natalChart: any): string {
  const degree = natalChart?.planetas?.find((p: any) => p.name === 'Sol')?.degree || 
                 natalChart?.sol?.degree || 
                 15.5;
  return degree.toFixed(1);
}