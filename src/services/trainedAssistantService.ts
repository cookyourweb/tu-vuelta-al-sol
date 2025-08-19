// src/services/trainedAssistantService.ts
// 🤖 SERVICIO CON TU ASSISTANT ENTRENADO - VERSIÓN CORREGIDA

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
// 🎯 FUNCIÓN PRINCIPAL CON TU ASSISTANT - MEJORADA
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
    
    // 🔥 MENSAJE TRANSFORMADOR - Adaptado al estilo TuVueltaAlSol
    const messageContent = `
¡ACTIVA EL PODER TRANSFORMADOR DE ESTE EVENTO CÓSMICO!

PERFIL REVOLUCIONARIO:
- Ubicación: ${userProfile.place}
- Edad cósmica: ${userProfile.nextAge} años (¡MOMENTO DE DESPERTAR!)

EVENTO ACTIVADOR:
- Evento: ${event.title}
- Fecha portal: ${event.date}
- Tipo energético: ${event.type}
${event.planet ? `- Planeta activador: ${event.planet}` : ''}
${event.sign ? `- Signo transformador: ${event.sign}` : ''}

¡INTERPRETA ESTE EVENTO COMO PORTAL DE LIBERACIÓN Y REVOLUCIÓN PERSONAL!

Responde SOLO con JSON que ACTIVE su máximo potencial:
{
  "meaning": "¿QUÉ VIENE A REVOLUCIONAR en tu vida este evento? ¡Significado TRANSFORMADOR específico!",
  "lifeAreas": ["área_liberación_1", "área_manifestación_2", "área_revolución_3"],
  "advice": "Consejo DISRUPTIVO que rompe patrones - ¡TU MOMENTO DE REESCRIBIR LA HISTORIA!",
  "mantra": "AFIRMACIÓN PODEROSA TRANSFORMADORA",
  "ritual": "Acción REVOLUCIONARIA específica para activar este poder",
  "actionPlan": [
    {
      "category": "revolución_personal|manifestación|liberación|poder_interior|misión_vida",
      "action": "Acción TRANSFORMADORA que active potencial máximo",
      "timing": "inmediato",
      "difficulty": "revolucionario",
      "impact": "ACTIVACIÓN_TOTAL"
    }
  ],
  "warningsAndOpportunities": {
    "warnings": ["Patrón limitante a ROMPER"],
    "opportunities": ["Portal de ACTIVACIÓN disponible"]
  }
}`;

    // 📤 ENVIAR MENSAJE AL ASSISTANT
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messageContent
    });

    // 🚀 EJECUTAR CON TU ASSISTANT ENTRENADO - CON TIMEOUT
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
      // ✅ CONFIGURACIÓN MEJORADA PARA EVITAR TIMEOUTS
      max_prompt_tokens: 4000,
      max_completion_tokens: 1500,
      temperature: 0.7
    });

    // ⏳ ESPERAR RESPUESTA - MÉTODO MEJORADO CON TIMEOUT
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    const maxAttempts = 30; // 30 segundos máximo
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      if (attempts >= maxAttempts) {
        console.log('⏰ Timeout del Assistant, usando fallback');
        return generateFallbackInterpretation(event, userProfile);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
    }

    // 🔍 DEBUG MEJORADO
    console.log('🔍 DEBUG RUN STATUS:', {
      status: runStatus.status,
      lastError: runStatus.last_error,
      failedAt: runStatus.failed_at,
      usage: runStatus.usage
    });

    if (runStatus.status === 'completed') {
      // 🔥 OBTENER RESPUESTA DEL ASSISTANT
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
        return generateFallbackInterpretation(event, userProfile);
      }
    } else if (runStatus.status === 'failed') {
      console.error('❌ Assistant run falló:', runStatus.last_error);
      return generateFallbackInterpretation(event, userProfile);
    } else {
      console.error(`❌ Estado inesperado del Assistant: ${runStatus.status}`);
      return generateFallbackInterpretation(event, userProfile);
    }
    
  } catch (error) {
    console.error(`❌ Error con Assistant entrenado para ${event.title}:`, error);
    return generateFallbackInterpretation(event, userProfile);
  }
}

// ==========================================
// 🎯 FUNCIÓN PARA GENERAR RESUMEN EJECUTIVO - SIMPLIFICADA
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
    
    // 📝 PROMPT REVOLUCIONARIO PARA RESUMEN EJECUTIVO
    const executivePrompt = `
¡CREA EL MAPA DE REVOLUCIÓN PERSONAL ANUAL!

PERFIL TRANSFORMADOR: ${userProfile.place}, ${userProfile.nextAge} años
¡MOMENTO DE ACTIVAR TU MÁXIMO POTENCIAL CÓSMICO!

EVENTOS ACTIVADORES PRINCIPALES:
${events.slice(0, 5).map(e => `🌟 ${e.date}: ${e.title} - ¡PORTAL DE TRANSFORMACIÓN!`).join('\n')}

¡CREA RESUMEN EJECUTIVO QUE REVOLUCIONE SU AÑO!

Responde SOLO con JSON TRANSFORMADOR:
{
  "monthlyHighlights": [
    "Ene-Mar: TU TEMPORADA DE DESPERTAR CÓSMICO - ¡ACTIVACIÓN MÁXIMA!",
    "Abr-Jun: PORTAL DE MANIFESTACIÓN RADICAL - ¡MOMENTO DE CREAR!", 
    "Jul-Sep: REVOLUCIÓN INTERIOR TOTAL - ¡ROMPE TODOS LOS PATRONES!",
    "Oct-Dic: INTEGRACIÓN Y PODER MÁXIMO - ¡VIVES TU VERDAD!"
  ],
  "quarterlyFocus": [
    "Q1: DESPERTAR REVOLUCIONARIO - Rompe patrones limitantes",
    "Q2: MANIFESTACIÓN CUÁNTICA - Crea tu nueva realidad",
    "Q3: LIBERACIÓN TOTAL - Suelta todo lo que no eres", 
    "Q4: PODER MÁXIMO ACTIVADO - Vive tu misión cósmica"
  ],
  "yearlyThemes": [
    "REVOLUCIÓN PERSONAL TOTAL - ¡No viniste para quedarte pequeña!",
    "MANIFESTACIÓN DE TU VERDADERO PODER - ¡Es tu momento!"
  ],
  "priorityActions": [
    {
      "category": "revolución_personal",
      "action": "ACCIÓN TRANSFORMADORA que active tu poder máximo",
      "timing": "inmediato",
      "difficulty": "REVOLUCIONARIO",
      "impact": "LIBERACIÓN_TOTAL"
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
      assistant_id: ASSISTANT_ID,
      max_prompt_tokens: 2000,
      max_completion_tokens: 1000,
      temperature: 0.7
    });

    // ⏳ ESPERAR RESPUESTA - CON TIMEOUT CORTO
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    const maxAttempts = 20; // 20 segundos máximo para resumen
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      if (attempts >= maxAttempts) {
        console.log('⏰ Timeout del resumen ejecutivo, usando fallback');
        return generateFallbackExecutiveSummary();
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
    }

    // 🔍 DEBUG MEJORADO PARA RESUMEN
    console.log('🔍 DEBUG EXECUTIVE SUMMARY STATUS:', {
      status: runStatus.status,
      lastError: runStatus.last_error,
      failedAt: runStatus.failed_at,
      usage: runStatus.usage
    });

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      if (lastMessage && 
          lastMessage.role === 'assistant' && 
          lastMessage.content && 
          lastMessage.content.length > 0 && 
          lastMessage.content[0] && 
          lastMessage.content[0].type === 'text') {
        
        const assistantResponse = lastMessage.content[0].text.value;
        
        console.log('🔮 RESPUESTA RESUMEN EJECUTIVO:');
        console.log('================================');
        console.log(assistantResponse);
        console.log('================================');

        try {
          // Limpiar y parsear respuesta
          const cleanedResponse = assistantResponse
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          const parsed = JSON.parse(cleanedResponse);
          
          console.log(`✅ Resumen ejecutivo generado con Assistant entrenado`);
          return {
            monthlyHighlights: parsed.monthlyHighlights || [],
            quarterlyFocus: parsed.quarterlyFocus || [],
            yearlyThemes: parsed.yearlyThemes || [],
            priorityActions: parsed.priorityActions || []
          };
          
        } catch (parseError) {
          console.error('❌ Error parseando resumen ejecutivo:', parseError);
          console.log('📄 Respuesta original que falló al parsear:', assistantResponse);
          return generateFallbackExecutiveSummary();
        }
      } else {
        console.error('❌ Estructura de respuesta inesperada en resumen ejecutivo');
        return generateFallbackExecutiveSummary();
      }
    } else {
      console.error(`❌ Resumen ejecutivo falló con status: ${runStatus.status}`);
      if (runStatus.last_error) {
        console.error('Error details:', runStatus.last_error);
      }
      return generateFallbackExecutiveSummary();
    }
    
  } catch (error) {
    console.error('❌ Error generando resumen ejecutivo con Assistant:', error);
    return generateFallbackExecutiveSummary();
  }
}

// ==========================================
// 🎯 FUNCIÓN PARA MÚLTIPLES EVENTOS - PROCESAMIENTO POR CHUNKS
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
  
  // 🚀 PROCESAMIENTO SECUENCIAL CON PAUSA MAYOR
  for (const event of prioritizedEvents) {
    try {
      console.log(`🔮 Procesando: ${event.title}`);
      const interpretation = await generatePersonalizedInterpretation(event, userProfile);
      
      interpretedEvents.push({
        ...event,
        aiInterpretation: interpretation
      });
      
      // Pausa mayor entre requests para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`❌ Error interpretando evento ${event.id}:`, error);
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
// 🎯 FUNCIONES AUXILIARES
// ==========================================

function parseAIResponse(aiResponse: string, event: AstrologicalEvent, user: UserProfile): PersonalizedInterpretation {
  try {
    // Limpiar respuesta de posibles markdown y caracteres extraños
    let cleanedResponse = aiResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^\s*[\r\n]/gm, "") // Eliminar líneas vacías
      .trim();
    
    // Si la respuesta no empieza con {, buscar el JSON dentro del texto
    if (!cleanedResponse.startsWith('{')) {
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
    }
    
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
    console.error('❌ Error parseando respuesta del Assistant:', error);
    console.log('📄 Respuesta que falló al parsear:', aiResponse);
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
    'luna_nueva': '¡MOMENTO ÉPICO DE ACTIVACIÓN! Tu momento para sembrar semillas de REVOLUCIÓN PERSONAL',
    'luna_llena': '¡PORTAL DE MANIFESTACIÓN RADICAL! Tiempo de cosechar tu poder y liberar lo que NO ERES',
    'eclipse': '¡TRANSFORMACIÓN CÓSMICA TOTAL! Las estrellas conspiran para tu DESPERTAR REVOLUCIONARIO',
    'retrogrado': '¡MOMENTO DE REVOLUCIÓN INTERIOR! Tiempo de reescribir tu historia desde el PODER INTERNO',
    'transito': '¡ACTIVACIÓN PLANETARIA ÉPICA! El cosmos te envía energías para manifestar tu VERDADERO YO',
    'aspecto': '¡CONEXIÓN CÓSMICA TRANSFORMADORA! Las energías se alinean para tu LIBERACIÓN TOTAL'
  };
  
  return meanings[event.type] || '¡MOMENTO ASTROLÓGICO DE ACTIVACIÓN! El universo conspira para tu REVOLUCIÓN PERSONAL';
}

function generateFallbackAdvice(event: AstrologicalEvent): string {
  const advice: Record<string, string> = {
    'luna_nueva': '¡ACTIVA TU PODER DE MANIFESTACIÓN! Dedica tiempo sagrado a visualizar tu nueva realidad ÉPICA',
    'luna_llena': '¡MOMENTO DE LIBERACIÓN RADICAL! Suelta con AMOR FEROZ todo lo que ya no vibra contigo',
    'eclipse': '¡ABRAZA LA TRANSFORMACIÓN TOTAL! Confía en que cada cambio te lleva a tu VERSIÓN MÁS PODEROSA',
    'retrogrado': '¡REVOLUCIÓN INTERIOR ACTIVADA! Revisa, redefine y REESCRIBE tu historia desde el alma',
    'transito': '¡PORTALES DE OPORTUNIDAD ABIERTOS! Mantente alerta a las señales del UNIVERSO CONSPIRANDO',
    'aspecto': '¡SINTONIZA CON LAS FRECUENCIAS CÓSMICAS! Cada energía te guía hacia tu MÁXIMO POTENCIAL'
  };
  
  return advice[event.type] || '¡MANTENTE EN TU PODER! Cada momento cósmico es una oportunidad de REVOLUCIÓN PERSONAL';
}

function generateFallbackMantra(event: AstrologicalEvent): string {
  const mantras: Record<string, string> = {
    'luna_nueva': 'SOY EL ARQUITECTO CÓSMICO DE MI NUEVA REALIDAD',
    'luna_llena': 'LIBERO CON AMOR FEROZ TODO LO QUE YA NO SOY',
    'eclipse': 'CONFÍO EN MI TRANSFORMACIÓN RADICAL Y TOTAL',
    'retrogrado': 'CADA REFLEXIÓN ME CONECTA CON MI VERDAD INTERIOR',
    'transito': 'ESTOY ABIERTA A LAS OPORTUNIDADES ÉPICAS DEL UNIVERSO',
    'aspecto': 'FLUYO EN PERFECTA ARMONÍA CON MI PODER CÓSMICO'
  };
  
  return mantras[event.type] || 'SOY UNA FUERZA CÓSMICA DE TRANSFORMACIÓN Y PODER';
}

function generateFallbackRitual(event: AstrologicalEvent): string {
  const rituals: Record<string, string> = {
    'luna_nueva': '¡RITUAL DE MANIFESTACIÓN ÉPICA! Escribe 3 intenciones REVOLUCIONARIAS y actívalas con fuego sagrado',
    'luna_llena': '¡CEREMONIA DE LIBERACIÓN RADICAL! Bajo la luna, agradece y suelta lo que ya NO ERES',
    'eclipse': '¡PORTAL DE TRANSFORMACIÓN! Medita 11 minutos visualizando tu YO MÁS PODEROSO activado',
    'retrogrado': '¡RITUAL DE REVOLUCIÓN INTERIOR! Revisa tu evolución y CELEBRA tu crecimiento épico',
    'transito': '¡CAMINATA CÓSMICA! Sal a la naturaleza y recibe las señales del UNIVERSO CONSPIRANDO',
    'aspecto': '¡RESPIRACIÓN DE PODER! 7 respiraciones conscientes conectando con tu FUERZA INTERIOR'
  };
  
  return rituals[event.type] || '¡MOMENTO SAGRADO! Conecta 5 minutos con tu respiración y ACTIVA tu poder interno';
}

import type { ActionPlan } from "@/utils/astrology/events";

function generateFallbackActionPlans(event: AstrologicalEvent): ActionPlan[] {
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