// src/services/trainedAssistantService.ts
// 🤖 SERVICIO CON TU ASSISTANT ENTRENADO ESPECÍFICO

import { AstrologicalEvent, PersonalizedInterpretation, UserProfile } from "@/utils/astrology/events";
import OpenAI from 'openai';

// ==========================================
// 🔧 CONFIGURACIÓN CON TU ASSISTANT ENTRENADO - CORREGIDA
// ==========================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,     // wunjo-rcyvpv
  project: process.env.OPENAI_PROJECT_ID,      // proj_MfpxlisuxKqjN7eIKrGHZqw4
});

// 🎯 TU ASSISTANT ID ENTRENADO - CORREGIDO
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_2RiAp8rkMTnCqipvIYyS4jpT';

if (!ASSISTANT_ID) {
  console.error('❌ ASSISTANT_ID no encontrado en .env');
}

// ==========================================
// 🎯 FUNCIÓN PRINCIPAL CON TU ASSISTANT
// ==========================================

export async function generatePersonalizedInterpretation(
  event: AstrologicalEvent,
  userProfile: UserProfile
): Promise<PersonalizedInterpretation> {
  
  try {
    console.log(`🤖 Usando Assistant entrenado ID: ${ASSISTANT_ID?.substring(0, 8)}... para: ${event.title}`);
    
    if (!ASSISTANT_ID) {
      throw new Error('Assistant ID no configurado');
    }

    // 🎯 CREAR THREAD PARA LA CONVERSACIÓN
    const thread = await openai.beta.threads.create();
    
    // 📝 MENSAJE MÍNIMO - Tu assistant ya sabe astrología
    const messageContent = `
Interpreta este evento astrológico:

USUARIO: ${userProfile.place}, ${userProfile.nextAge} años
EVENTO: ${event.title}
TIPO: ${event.type}
FECHA: ${event.date}
DESCRIPCIÓN: ${event.description}
${event.planet ? `PLANETA: ${event.planet}` : ''}
${event.sign ? `SIGNO: ${event.sign}` : ''}

Responde SOLO con JSON válido:
{
  "meaning": "significado personal específico para ${userProfile.nextAge} años",
  "lifeAreas": ["área1", "área2", "área3"],
  "advice": "consejo práctico específico",
  "mantra": "frase poderosa para repetir",
  "ritual": "acción simple que pueda hacer",
  "actionPlan": [
    {
      "category": "trabajo|amor|salud|dinero|crecimiento|relaciones|creatividad",
      "action": "acción específica y realizable",
      "timing": "inmediato|esta_semana|este_mes",
      "difficulty": "fácil|moderado|desafiante",
      "impact": "bajo|medio|alto"
    }
  ],
  "warningsAndOpportunities": {
    "warnings": ["advertencia1", "advertencia2"],
    "opportunities": ["oportunidad1", "oportunidad2"]
  }
}`;

    // 📤 ENVIAR MENSAJE AL ASSISTANT
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messageContent
    });

    // 🚀 EJECUTAR CON TU ASSISTANT ENTRENADO
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    // ⏳ ESPERAR RESPUESTA - MÉTODO CORREGIDO
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    
    // Polling hasta que termine
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }

    if (runStatus.status === 'completed') {
      // 📥 OBTENER RESPUESTA DEL ASSISTANT
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      // ✅ VALIDACIÓN ROBUSTA DEL CONTENIDO
      if (lastMessage && 
          lastMessage.role === 'assistant' && 
          lastMessage.content && 
          lastMessage.content.length > 0 && 
          lastMessage.content[0] && 
          lastMessage.content[0].type === 'text') {
        
        const assistantResponse = lastMessage.content[0].text.value;
        
        console.log('🔮 RESPUESTA COMPLETA DEL ASSISTANT:');
        console.log('================================');
        console.log(assistantResponse);
        console.log('================================');

        // 🔄 PROCESAR RESPUESTA
        const interpretation = parseAIResponse(assistantResponse, event, userProfile);
        
        console.log(`✅ Interpretación generada con Assistant entrenado para ${event.title}`);
        return interpretation;
      } else {
        console.error('❌ Estructura de respuesta inesperada:', {
          hasMessage: !!lastMessage,
          role: lastMessage?.role,
          hasContent: !!lastMessage?.content,
          contentLength: lastMessage?.content?.length,
          contentType: lastMessage?.content?.[0]?.type
        });
        throw new Error('Estructura de respuesta del Assistant inválida');
      }
    }

    // Si algo falla, usar fallback
    throw new Error(`Assistant run failed with status: ${runStatus.status}`);
    
  } catch (error) {
    console.error(`❌ Error con Assistant entrenado para ${event.title}:`, error);
    return generateFallbackInterpretation(event, userProfile);
  }
}

// ==========================================
// 🎯 FUNCIÓN PARA MÚLTIPLES EVENTOS OPTIMIZADA
// ==========================================

export async function generateMultipleInterpretations(
  events: AstrologicalEvent[],
  userProfile: UserProfile,
  maxEvents: number = 5
): Promise<AstrologicalEvent[]> {
  
  console.log(`🤖 Usando Assistant entrenado para ${Math.min(events.length, maxEvents)} eventos`);
  
  if (!ASSISTANT_ID) {
    console.error('❌ Assistant ID no configurado, usando fallbacks');
    return events.map(event => ({
      ...event,
      aiInterpretation: generateFallbackInterpretation(event, userProfile)
    }));
  }
  
  // Priorizar eventos más importantes
  const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 1, low: 2 };
  const prioritizedEvents = events
    .sort((a, b) => {
      return priorityOrder[a.priority as 'high' | 'medium' | 'low'] - priorityOrder[b.priority as 'high' | 'medium' | 'low'];
    })
    .slice(0, maxEvents);
  
  const interpretedEvents: AstrologicalEvent[] = [];
  
  // 🚀 PROCESAMIENTO SECUENCIAL para Assistants (más estable)
  for (const event of prioritizedEvents) {
    try {
      console.log(`🔮 Procesando: ${event.title}`);
      const interpretation = await generatePersonalizedInterpretation(event, userProfile);
      
      interpretedEvents.push({
        ...event,
        aiInterpretation: interpretation
      });
      
      // Pausa entre requests para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Error interpretando evento ${event.id}:`, error);
      // Agregar evento sin interpretación si falla
      interpretedEvents.push(event);
    }
  }
  
  // Agregar eventos restantes sin interpretación IA
  const remainingEvents = events.slice(maxEvents);
  interpretedEvents.push(...remainingEvents);
  
  console.log(`✅ ${interpretedEvents.filter(e => e.aiInterpretation).length} eventos interpretados con Assistant entrenado`);
  return interpretedEvents;
}

// ==========================================
// 🎯 FUNCIÓN PARA GENERAR RESUMEN EJECUTIVO CON ASSISTANT
// ==========================================

export async function generateExecutiveSummary(
  events: AstrologicalEvent[],
  userProfile: UserProfile
): Promise<{
  monthlyHighlights: string[];
  quarterlyFocus: string[];
  yearlyThemes: string[];
  priorityActions: Array<{
    category: string;
    action: string;
    timing: string;
    difficulty: string;
    impact: string;
  }>;
}> {
  
  try {
    console.log(`🤖 Generando resumen ejecutivo con Assistant entrenado`);
    
    if (!ASSISTANT_ID) {
      console.error('❌ Assistant ID no configurado, usando fallback');
      return generateFallbackExecutiveSummary();
    }

    // 🎯 CREAR THREAD PARA EL RESUMEN
    const thread = await openai.beta.threads.create();
    
    // 📝 PROMPT PARA RESUMEN EJECUTIVO
    const executivePrompt = `
Crea un resumen ejecutivo del año astrológico para ${userProfile.place}, ${userProfile.nextAge} años.

EVENTOS DEL AÑO:
${events.slice(0, 10).map(e => `- ${e.date}: ${e.title} (${e.type})`).join('\n')}

Responde SOLO con JSON válido:
{
  "monthlyHighlights": [
    "Enero-Marzo: tema principal del trimestre",
    "Abril-Junio: tema principal del trimestre", 
    "Julio-Septiembre: tema principal del trimestre",
    "Octubre-Diciembre: tema principal del trimestre"
  ],
  "quarterlyFocus": [
    "Q1: enfoque principal primer trimestre",
    "Q2: enfoque principal segundo trimestre",
    "Q3: enfoque principal tercer trimestre", 
    "Q4: enfoque principal cuarto trimestre"
  ],
  "yearlyThemes": [
    "Tema principal del año 1",
    "Tema principal del año 2",
    "Tema principal del año 3"
  ],
  "priorityActions": [
    {
      "category": "crecimiento",
      "action": "Acción prioritaria para el crecimiento personal",
      "timing": "inmediato",
      "difficulty": "moderado",
      "impact": "alto"
    },
    {
      "category": "trabajo",
      "action": "Acción prioritaria para el área profesional",
      "timing": "este_mes",
      "difficulty": "moderado", 
      "impact": "alto"
    },
    {
      "category": "relaciones",
      "action": "Acción prioritaria para las relaciones",
      "timing": "esta_semana",
      "difficulty": "fácil",
      "impact": "medio"
    }
  ]
}`;

    // 📤 ENVIAR MENSAJE AL ASSISTANT
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: executivePrompt
    });

    // 🚀 EJECUTAR CON TU ASSISTANT ENTRENADO
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    // ⏳ ESPERAR RESPUESTA - MÉTODO CORREGIDO
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      // ✅ VALIDACIÓN ROBUSTA DEL CONTENIDO
      if (lastMessage && 
          lastMessage.role === 'assistant' && 
          lastMessage.content && 
          lastMessage.content.length > 0 && 
          lastMessage.content[0] && 
          lastMessage.content[0].type === 'text') {
        
        const assistantResponse = lastMessage.content[0].text.value;
        
        console.log('🔮 RESPUESTA COMPLETA DEL ASSISTANT (RESUMEN EJECUTIVO):');
        console.log('================================');
        console.log(assistantResponse);
        console.log('================================');

        try {
          // Limpiar y parsear respuesta
          const cleanedResponse = assistantResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleanedResponse);
          
          console.log(`✅ Resumen ejecutivo generado con Assistant entrenado`);
          return {
            monthlyHighlights: parsed.monthlyHighlights || [],
            quarterlyFocus: parsed.quarterlyFocus || [],
            yearlyThemes: parsed.yearlyThemes || [],
            priorityActions: parsed.priorityActions || []
          };
          
        } catch (parseError) {
          console.error('Error parseando resumen ejecutivo:', parseError);
          return generateFallbackExecutiveSummary();
        }
      } else {
        console.error('❌ Estructura de respuesta inesperada en resumen ejecutivo:', {
          hasMessage: !!lastMessage,
          role: lastMessage?.role,
          hasContent: !!lastMessage?.content,
          contentLength: lastMessage?.content?.length,
          contentType: lastMessage?.content?.[0]?.type
        });
        throw new Error('Estructura de respuesta del Assistant inválida para resumen ejecutivo');
      }
    }

    // Si algo falla, usar fallback
    throw new Error(`Assistant run failed with status: ${runStatus.status}`);
    
  } catch (error) {
    console.error('❌ Error generando resumen ejecutivo con Assistant:', error);
    return generateFallbackExecutiveSummary();
  }
}

// ==========================================
// 🎯 FUNCIONES AUXILIARES
// ==========================================

function parseAIResponse(aiResponse: string, event: AstrologicalEvent, user: UserProfile): PersonalizedInterpretation {
  try {
    // Limpiar respuesta de posibles markdown
    const cleanedResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleanedResponse);
    
    return {
      meaning: parsed.meaning || generateFallbackMeaning(event),
      lifeAreas: parsed.lifeAreas || ['crecimiento', 'bienestar'],
      advice: parsed.advice || generateFallbackAdvice(event),
      mantra: parsed.mantra || generateFallbackMantra(event),
      ritual: parsed.ritual || generateFallbackRitual(event),
      actionPlan: parsed.actionPlan || generateFallbackActionPlans(event),
      warningsAndOpportunities: parsed.warningsAndOpportunities || {
        warnings: ['Mantén la paciencia durante los desafíos'],
        opportunities: ['Aprovecha las nuevas perspectivas que surjan']
      }
    };
    
  } catch (error) {
    console.error('Error parseando respuesta del Assistant:', error);
    return generateFallbackInterpretation(event, user);
  }
}

function generateFallbackInterpretation(event: AstrologicalEvent, user: UserProfile): PersonalizedInterpretation {
  return {
    meaning: generateFallbackMeaning(event),
    lifeAreas: ['crecimiento', 'bienestar', 'relaciones'],
    advice: generateFallbackAdvice(event),
    mantra: generateFallbackMantra(event),
    ritual: generateFallbackRitual(event),
    actionPlan: generateFallbackActionPlans(event),
    warningsAndOpportunities: {
      warnings: [
        'Evita tomar decisiones impulsivas durante este período',
        'No te exijas más de lo necesario'
      ],
      opportunities: [
        'Momento ideal para la reflexión y el crecimiento interno',
        'Oportunidad de fortalecer tu intuición y conexión interior'
      ]
    }
  };
}

function generateFallbackMeaning(event: AstrologicalEvent): string {
  const meanings: Record<string, string> = {
    'lunar_phase': `Esta ${event.title} te invita a sintonizar con los ciclos naturales y ajustar tu energía personal.`,
    'retrograde': `El período retrógrado de ${event.planet} es una oportunidad valiosa para revisar y refinar aspectos importantes de tu vida.`,
    'direct': `El período directo de ${event.planet} marca un momento para avanzar y tomar acción en áreas clave de tu vida.`,
    'eclipse': `Este eclipse marca un momento de transformación profunda y renovación en tu camino personal.`,
    'planetary_transit': `El tránsito de ${event.planet} trae nuevas oportunidades de crecimiento y expansión.`,
    'aspect': `Este aspecto planetario crea un momento de conexión especial entre diferentes energías de tu vida.`,
    'seasonal': `Este evento estacional te invita a alinearte con los cambios naturales y aprovechar nuevas oportunidades.`
  };
  
  return meanings[event.type] || `${event.title} te ofrece una oportunidad única de crecimiento y evolución personal.`;
}

function generateFallbackAdvice(event: AstrologicalEvent): string {
  return `Mantente consciente de las energías de ${event.title} y úsalas para tu crecimiento personal. Este es un momento perfecto para la introspección y la acción consciente.`;
}

function generateFallbackMantra(event: AstrologicalEvent): string {
  const mantras: Record<string, string> = {
    'lunar_phase': 'Fluyo con los ritmos naturales del universo',
    'retrograde': 'Uso este tiempo para crecer y mejorar desde adentro',
    'direct': 'Avanzo con confianza y claridad en mi camino',
    'eclipse': 'Abrazo la transformación con confianza y claridad',
    'planetary_transit': 'Estoy abierto a las nuevas oportunidades que llegan',
    'aspect': 'Encuentro armonía en todas las energías de mi vida',
    'seasonal': 'Me alineo con los ciclos naturales para mi bienestar'
  };
  
  return mantras[event.type] || 'Estoy alineado con las energías del universo para mi máximo bien';
}

function generateFallbackRitual(event: AstrologicalEvent): string {
  return `Dedica 10 minutos a meditar sobre ${event.title}, enciende una vela y establece intenciones claras para este período.`;
}

function generateFallbackActionPlans(event: AstrologicalEvent): Array<{
  category: "crecimiento" | "relaciones" | "trabajo" | "amor" | "salud" | "dinero" | "creatividad";
  action: string;
  timing: "inmediato" | "esta_semana" | "este_mes" | "próximo_trimestre";
  difficulty: "fácil" | "moderado" | "desafiante";
  impact: "bajo" | "medio" | "alto";
}> {
  return [
    {
      category: 'crecimiento',
      action: `Reflexiona sobre cómo ${event.title} puede apoyar tu desarrollo personal`,
      timing: 'inmediato',
      difficulty: 'fácil',
      impact: 'medio'
    },
    {
      category: 'salud',
      action: 'Establece una rutina de mindfulness durante este período astrológico',
      timing: 'esta_semana',
      difficulty: 'moderado',
      impact: 'alto'
    },
    {
      category: 'relaciones',
      action: 'Comunica tus necesidades con claridad y compasión',
      timing: 'este_mes',
      difficulty: 'moderado',
      impact: 'alto'
    }
  ];
}

function generateFallbackExecutiveSummary() {
  return {
    monthlyHighlights: [
      'Primer trimestre: Establecimiento de nuevas rutinas y estructuras',
      'Segundo trimestre: Expansión en relaciones y oportunidades profesionales',
      'Tercer trimestre: Consolidación de logros y ajustes necesarios',
      'Cuarto trimestre: Cierre de ciclos y preparación para el siguiente año'
    ],
    quarterlyFocus: [
      'Q1: Sembrar las bases para el crecimiento',
      'Q2: Expandir horizontes y oportunidades',
      'Q3: Consolidar y refinar los logros',
      'Q4: Integrar aprendizajes y preparar transiciones'
    ],
    yearlyThemes: [
      'Transformación personal y profesional',
      'Equilibrio entre crecimiento y estabilidad',
      'Fortalecimiento de relaciones significativas',
      'Desarrollo de la intuición y sabiduría interior'
    ],
    priorityActions: [
      {
        category: 'crecimiento',
        action: 'Desarrollar una práctica regular de autoconocimiento',
        timing: 'inmediato',
        difficulty: 'moderado',
        impact: 'alto'
      },
      {
        category: 'trabajo',
        action: 'Definir objetivos profesionales claros para el año',
        timing: 'este_mes',
        difficulty: 'moderado',
        impact: 'alto'
      },
      {
        category: 'relaciones',
        action: 'Fortalecer comunicación en relaciones importantes',
        timing: 'esta_semana',
        difficulty: 'fácil',
        impact: 'medio'
      }
    ]
  };
}

// ==========================================
// 🎯 EXPORTACIONES
// ==========================================

export default {
  generatePersonalizedInterpretation,
  generateMultipleInterpretations,
  generateExecutiveSummary
};