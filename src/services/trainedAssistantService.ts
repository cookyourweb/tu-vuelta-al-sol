// src/services/trainedAssistantService.ts
// SERVICIO IA ACTUALIZADO CON TIPOS UNIFICADOS

import { 
  AstrologicalEvent, 
  PersonalizedInterpretation, 
  UserProfile 
} from '../types/astrology/unified-types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!ASSISTANT_ID) {
  console.error('❌ OPENAI_ASSISTANT_ID no encontrado en .env');
}

// ==========================================
// 🎯 FUNCIÓN PRINCIPAL MEJORADA
// ==========================================

export async function generatePersonalizedInterpretation(
  event: AstrologicalEvent,
  userProfile: UserProfile,
  customPrompt?: string
): Promise<{ success: boolean; interpretation?: PersonalizedInterpretation; method?: string; error?: string }> {
  
  try {
    console.log(`🤖 Interpretación profundamente personalizada para: ${event.title}`);
    
    if (!ASSISTANT_ID) {
      throw new Error('Assistant ID no configurado');
    }

    // Crear thread
    const thread = await openai.beta.threads.create();
    
    // Generar prompt con análisis astrológico profundo
    const enhancedPrompt = generateDeepAstrologicalPrompt(event, userProfile);

    // Enviar mensaje al assistant
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: enhancedPrompt
    });

    // Ejecutar assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    // Polling con timeout
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    const maxAttempts = 30;
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      if (attempts >= maxAttempts) {
        console.log(`⏰ Timeout para ${event.title}, usando fallback`);
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      if (lastMessage?.role === 'assistant' && lastMessage.content?.[0]?.type === 'text') {
        const assistantResponse = lastMessage.content[0].text.value;
        
        console.log(`🔮 Respuesta del Assistant para ${event.title}:`, assistantResponse.substring(0, 200) + '...');

        const interpretation = parseEnhancedAIResponse(assistantResponse, event, userProfile);
        
        console.log(`✅ Interpretación profunda generada para ${event.title}`);
        return { 
          success: true, 
          interpretation, 
          method: 'trained_assistant_with_deep_chart_analysis' 
        };
      }
    }

    throw new Error(`Assistant run failed with status: ${runStatus.status}`);
    
  } catch (error) {
    console.error(`❌ Error con Assistant para ${event.title}:`, error instanceof Error ? error.message : 'Error desconocido');
    
    // Fallback con GPT-4 usando el mismo contexto profundo
    return await generateFallbackWithDeepContext(event, userProfile);
  }
}

// ==========================================
// 📝 PROMPT PROFUNDAMENTE PERSONALIZADO
// ==========================================

function generateDeepAstrologicalPrompt(event: AstrologicalEvent, userProfile: UserProfile): string {
  // Extraer contexto astrológico
  const astroContext = userProfile.astrological;
  const userContext = event.userContext;
  
  return `
INTERPRETA ESTE EVENTO ASTROLÓGICO COMO UN ASTRÓLOGO MAESTRO QUE CONOCE ÍNTIMAMENTE A ESTA PERSONA:

🌟 EVENTO CÓSMICO:
${event.title} - ${event.date}
Tipo: ${event.type}
Descripción: ${event.description}
${event.planet ? `Planeta: ${event.planet}` : ''}
${event.sign ? `Signo: ${event.sign}` : ''}

👤 PERFIL ASTROLÓGICO COMPLETO:
Nombre: ${userProfile.name}
Edad: ${userProfile.nextAge} años
Ubicación: ${userProfile.place}

🎯 CARTA NATAL REAL:
Sol: ${astroContext.signs.sun} en Casa ${astroContext.houses.sun}
Luna: ${astroContext.signs.moon} en Casa ${astroContext.houses.moon}
Ascendente: ${astroContext.signs.ascendant}
Mercurio: ${astroContext.signs.mercury} en Casa ${astroContext.houses.mercury}
Venus: ${astroContext.signs.venus} en Casa ${astroContext.houses.venus}
Marte: ${astroContext.signs.mars} en Casa ${astroContext.houses.mars}

🔥 NATURALEZA ASTROLÓGICA:
Elementos dominantes: ${astroContext.dominantElements.join(', ')}
Modalidad dominante: ${astroContext.dominantMode}

💎 PERFIL EVOLUTIVO:
Temas de vida principales:
${astroContext.lifeThemes.map(theme => `- ${theme}`).join('\n')}

Fortalezas naturales:
${astroContext.strengths.map(strength => `- ${strength}`).join('\n')}

Desafíos de crecimiento:
${astroContext.challenges.map(challenge => `- ${challenge}`).join('\n')}

${astroContext.progressions ? `
🌊 PROGRESIONES ACTIVAS:
Año evolutivo: ${astroContext.progressions.year}
Enfoque actual: ${astroContext.progressions.focus}
Progresiones activas:
${astroContext.progressions.activeProgressions.map(prog => `- ${prog.meaning}`).join('\n')}
` : ''}

🎯 INSTRUCCIONES ESPECÍFICAS:
Como astrólogo evolutivo experto, crea una interpretación que:

1. CONECTE el evento directamente con su carta natal específica
2. MENCIONE cómo este evento interactúa con sus signos y casas natales
3. RELACIONE con sus fortalezas y desafíos personales identificados
4. PERSONALICE completamente para alguien de ${userProfile.nextAge} años en ${userProfile.place}
5. INCLUYA consejos ACCIONABLES basados en su perfil astrológico único
6. CREE un mantra que resuene con su naturaleza astrológica
7. SUGIERA un ritual específico para su configuración planetaria

Responde SOLO con JSON válido:
{
  "meaning": "Significado específico conectando ${event.title} con Sol en ${astroContext.signs.sun} Casa ${astroContext.houses.sun} y Luna en ${astroContext.signs.moon} Casa ${astroContext.houses.moon}",
  "lifeAreas": ["áreas de vida específicas según sus casas natales"],
  "advice": "Consejo específico para ${astroContext.signs.sun} con ${astroContext.dominantElements[0]} dominante a los ${userProfile.nextAge} años",
  "mantra": "Mantra que conecte con su naturaleza ${astroContext.dominantElements[0]} y ${astroContext.dominantMode}",
  "ritual": "Ritual específico para activar su configuración natal durante ${event.title}",
  "actionPlan": [
    {
      "category": "trabajo|amor|salud|dinero|crecimiento|relaciones|creatividad",
      "action": "Acción específica aprovechando sus fortalezas naturales",
      "timing": "inmediato|esta_semana|este_mes",
      "difficulty": "fácil|moderado|desafiante",
      "impact": "bajo|medio|alto"
    }
  ],
  "warningsAndOpportunities": {
    "warnings": ["Advertencias específicas basadas en sus desafíos identificados"],
    "opportunities": ["Oportunidades específicas aprovechando sus fortalezas naturales"]
  }
}

CRÍTICO: Esta interpretación debe sentirse como si fuera creada por un astrólogo que ha estudiado durante años su carta natal específica. Menciona planetas, signos y casas concretos de su carta.
`;
}

// ==========================================
// 🚀 FALLBACK CON CONTEXTO PROFUNDO
// ==========================================

async function generateFallbackWithDeepContext(
  event: AstrologicalEvent,
  userProfile: UserProfile
): Promise<{ success: boolean; interpretation?: PersonalizedInterpretation; method?: string; error?: string }> {
  
  try {
    console.log(`🧠 Fallback GPT-4 con contexto profundo para: ${event.title}`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres un astrólogo evolutivo experto que crea interpretaciones profundamente personalizadas. 
          Conoces la carta natal específica de la persona y conectas cada evento con sus posiciones planetarias reales.
          Respondes en JSON con las claves exactas: meaning, lifeAreas, advice, mantra, ritual, actionPlan, warningsAndOpportunities.`
        },
        {
          role: "user",
          content: generateDeepAstrologicalPrompt(event, userProfile)
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });
    
    const responseText = completion.choices[0]?.message?.content;
    if (responseText) {
      const interpretation = parseEnhancedAIResponse(responseText, event, userProfile);
      console.log(`✅ Fallback GPT-4 exitoso para ${event.title}`);
      return { 
        success: true, 
        interpretation, 
        method: 'gpt4_fallback_with_deep_context' 
      };
    }
    
    throw new Error('No response from GPT-4');
    
  } catch (error) {
    console.error(`❌ Fallback GPT-4 falló para ${event.title}:`, error);
    
    // Último fallback con interpretación personalizada básica
    return { 
      success: true, 
      interpretation: generatePersonalizedFallback(event, userProfile),
      method: 'personalized_fallback'
    };
  }
}

// ==========================================
// 🔧 FUNCIONES AUXILIARES
// ==========================================

function parseEnhancedAIResponse(aiResponse: string, event: AstrologicalEvent, user: UserProfile): PersonalizedInterpretation {
  try {
    const cleanedResponse = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleanedResponse);
    
    return {
      meaning: parsed.meaning || generatePersonalizedMeaning(event, user),
      lifeAreas: parsed.lifeAreas || ['crecimiento', 'bienestar'],
      advice: parsed.advice || generatePersonalizedAdvice(event, user),
      mantra: parsed.mantra || generatePersonalizedMantra(event, user),
      ritual: parsed.ritual || generatePersonalizedRitual(event, user),
      actionPlan: parsed.actionPlan || generatePersonalizedActionPlans(event, user),
      warningsAndOpportunities: parsed.warningsAndOpportunities || {
        warnings: [`Para tu configuración ${user.astrological.dominantElements[0]}, evita actuar impulsivamente durante ${event.title}`],
        opportunities: [`${event.title} activa positivamente tu ${user.astrological.signs.sun} solar para crecimiento personal`]
      }
    };
    
  } catch (error) {
    console.error('Error parseando respuesta IA:', error);
    return generatePersonalizedFallback(event, user);
  }
}

function generatePersonalizedFallback(event: AstrologicalEvent, user: UserProfile): PersonalizedInterpretation {
  return {
    meaning: `${event.title} resuena especialmente con tu naturaleza ${user.astrological.dominantElements[0]} y tu Sol en ${user.astrological.signs.sun}. A los ${user.nextAge} años, este evento te invita a integrar las lecciones de tu configuración natal única.`,
    lifeAreas: ['crecimiento', 'propósito', 'autorrealización'],
    advice: `Con tu Sol en ${user.astrological.signs.sun} en Casa ${user.astrological.houses.sun}, aprovecha ${event.title} para fortalecer tu identidad auténtica. Tu elemento ${user.astrological.dominantElements[0]} te da la energía necesaria para este período.`,
    mantra: `Desde mi ${user.astrological.signs.sun} solar, abrazo la transformación que ${event.title} trae a mi vida.`,
    ritual: `Enciende una vela que represente tu elemento ${user.astrological.dominantElements[0]} y medita sobre cómo ${event.title} puede fortalecer las cualidades de tu Sol en ${user.astrological.signs.sun}.`,
    actionPlan: [
      {
        category: 'crecimiento',
        action: `Reflexiona sobre cómo ${event.title} puede activar positivamente tu Sol en ${user.astrological.signs.sun} Casa ${user.astrological.houses.sun}`,
        timing: 'inmediato',
        difficulty: 'fácil',
        impact: 'alto'
      },
      {
        category: 'relaciones',
        action: `Usa tu naturaleza ${user.astrological.dominantElements[0]} para conectar auténticamente durante este período`,
        timing: 'esta_semana',
        difficulty: 'moderado',
        impact: 'medio'
      }
    ],
    warningsAndOpportunities: {
      warnings: [
        `Con tu configuración ${user.astrological.dominantElements[0]} dominante, evita reaccionar impulsivamente durante ${event.title}`,
        `Tu Luna en ${user.astrological.signs.moon} puede intensificar emociones - mantén el equilibrio`
      ],
      opportunities: [
        `${event.title} activa positivamente las cualidades de tu Sol en ${user.astrological.signs.sun}`,
        `Tu elemento ${user.astrological.dominantElements[0]} te da energía natural para aprovechar este período`
      ]
    }
  };
}

function generatePersonalizedMeaning(event: AstrologicalEvent, user: UserProfile): string {
  return `${event.title} resuena especialmente con tu naturaleza ${user.astrological.dominantElements[0]} y tu Sol en ${user.astrological.signs.sun}. A los ${user.nextAge} años desde ${user.place}, este evento cósmico activa directamente las cualidades de tu Casa ${user.astrological.houses.sun}, invitándote a integrar las lecciones de tu configuración natal única para tu crecimiento evolutivo.`;
}

function generatePersonalizedAdvice(event: AstrologicalEvent, user: UserProfile): string {
  return `Con tu Sol en ${user.astrological.signs.sun} en Casa ${user.astrological.houses.sun} y tu elemento ${user.astrological.dominantElements[0]} dominante, aprovecha ${event.title} para fortalecer tu identidad auténtica. Tu modalidad ${user.astrological.dominantMode} te guía hacia la acción correcta en este momento de tu evolución a los ${user.nextAge} años.`;
}

function generatePersonalizedMantra(event: AstrologicalEvent, user: UserProfile): string {
  const mantras = [
    `Desde mi ${user.astrological.signs.sun} solar, abrazo la transformación que ${event.title} trae a mi vida`,
    `Mi naturaleza ${user.astrological.dominantElements[0]} me da fuerza para navegar ${event.title} con sabiduría`,
    `Con ${user.nextAge} años de experiencia, fluyo con la energía de ${event.title}`,
    `Mi Luna en ${user.astrological.signs.moon} me guía intuitivamente durante ${event.title}`
  ];
  
  return mantras[Math.floor(Math.random() * mantras.length)];
}

function generatePersonalizedRitual(event: AstrologicalEvent, user: UserProfile): string {
  const elementColor = {
    fire: 'roja',
    earth: 'verde',
    air: 'amarilla',
    water: 'azul'
  };
  
  const color = elementColor[user.astrological.dominantElements[0]] || 'blanca';
  
  return `Enciende una vela ${color} que represente tu elemento ${user.astrological.dominantElements[0]}. Medita durante 10 minutos visualizando cómo ${event.title} fortalece las cualidades de tu Sol en ${user.astrological.signs.sun}. Escribe una intención específica sobre cómo quieres aprovechar esta energía para tu crecimiento en Casa ${user.astrological.houses.sun}.`;
}

function generatePersonalizedActionPlans(event: AstrologicalEvent, user: UserProfile): Array<any> {
  const plans = [
    {
      category: 'crecimiento',
      action: `Reflexiona sobre cómo ${event.title} puede activar positivamente tu Sol en ${user.astrological.signs.sun} Casa ${user.astrological.houses.sun}`,
      timing: 'inmediato',
      difficulty: 'fácil',
      impact: 'alto'
    },
    {
      category: 'relaciones',
      action: `Usa tu naturaleza ${user.astrological.dominantElements[0]} para conectar auténticamente con otros durante este período`,
      timing: 'esta_semana',
      difficulty: 'moderado',
      impact: 'medio'
    }
  ];

  // Agregar plan específico según el tema de vida principal
  if (user.astrological.lifeThemes.length > 0) {
    plans.push({
      category: 'creatividad',
      action: `Aprovecha ${event.title} para trabajar en: ${user.astrological.lifeThemes[0]}`,
      timing: 'este_mes',
      difficulty: 'moderado',
      impact: 'alto'
    });
  }

  return plans;
}

// ==========================================
// 🔄 FUNCIONES PARA MÚLTIPLES EVENTOS
// ==========================================

export async function generateMultipleInterpretations(
  events: AstrologicalEvent[],
  userProfile: UserProfile,
  maxEvents: number = 10
): Promise<AstrologicalEvent[]> {
  
  console.log(`🤖 Procesando ${Math.min(events.length, maxEvents)} eventos con contexto profundo para ${userProfile.name}`);
  
  if (!ASSISTANT_ID) {
    console.error('❌ Assistant ID no configurado, usando fallbacks personalizados');
    return events.map(event => ({
      ...event,
      aiInterpretation: generatePersonalizedFallback(event, userProfile)
    }));
  }
  
  // Priorizar eventos importantes
  const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 1, low: 2 };
  const prioritizedEvents = events
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, maxEvents);
  
  const interpretedEvents: AstrologicalEvent[] = [];
  
  // Procesamiento secuencial
  for (const event of prioritizedEvents) {
    try {
      console.log(`🔮 Procesando con contexto astrológico: ${event.title}`);
      const result = await generatePersonalizedInterpretation(event, userProfile);
      
      if (result.success && result.interpretation) {
        interpretedEvents.push({
          ...event,
          aiInterpretation: result.interpretation
        });
      } else {
        interpretedEvents.push({
          ...event,
          aiInterpretation: generatePersonalizedFallback(event, userProfile)
        });
      }
      
      // Pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.error(`Error interpretando evento ${event.id}:`, error);
      interpretedEvents.push({
        ...event,
        aiInterpretation: generatePersonalizedFallback(event, userProfile)
      });
    }
  }
  
  // Agregar eventos restantes sin interpretación IA
  const remainingEvents = events.slice(maxEvents);
  interpretedEvents.push(...remainingEvents);
  
  console.log(`✅ ${interpretedEvents.filter(e => e.aiInterpretation).length} eventos interpretados con contexto astrológico profundo`);
  return interpretedEvents;
}

// ==========================================
// 📊 RESUMEN EJECUTIVO CON CONTEXTO PERSONAL
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
    console.log(`📊 Generando resumen ejecutivo personalizado para ${userProfile.name}`);
    
    if (!ASSISTANT_ID) {
      return generatePersonalizedExecutiveSummary(userProfile);
    }

    const thread = await openai.beta.threads.create();
    
    const executivePrompt = `
Crea un resumen ejecutivo del año astrológico específicamente personalizado para esta persona:

PERFIL ASTROLÓGICO COMPLETO:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.nextAge} años
- Ubicación: ${userProfile.place}
- Sol: ${userProfile.astrological.signs.sun} Casa ${userProfile.astrological.houses.sun}
- Luna: ${userProfile.astrological.signs.moon} Casa ${userProfile.astrological.houses.moon}
- Ascendente: ${userProfile.astrological.signs.ascendant}
- Elemento dominante: ${userProfile.astrological.dominantElements[0]}
- Modalidad dominante: ${userProfile.astrological.dominantMode}

TEMAS DE VIDA PRINCIPALES:
${userProfile.astrological.lifeThemes.map(theme => `- ${theme}`).join('\n')}

FORTALEZAS NATURALES:
${userProfile.astrological.strengths.map(strength => `- ${strength}`).join('\n')}

EVENTOS PRINCIPALES DEL AÑO:
${events.slice(0, 15).map(e => `- ${e.date}: ${e.title} (${e.type})`).join('\n')}

Responde SOLO con JSON usando su configuración astrológica específica:
{
  "monthlyHighlights": [
    "Trimestre específico conectando con su Sol en ${userProfile.astrological.signs.sun}",
    "Trimestre activando su Luna en ${userProfile.astrological.signs.moon}",
    "Trimestre fortaleciendo su elemento ${userProfile.astrological.dominantElements[0]}",
    "Trimestre integrando su naturaleza ${userProfile.astrological.dominantMode}"
  ],
  "quarterlyFocus": [
    "Q1: Enfoque específico para Su Sol en Casa ${userProfile.astrological.houses.sun}",
    "Q2: Trabajo con Luna en Casa ${userProfile.astrological.houses.moon}",
    "Q3: Desarrollo de su elemento ${userProfile.astrological.dominantElements[0]}",
    "Q4: Integración de aprendizajes para ${userProfile.nextAge} años"
  ],
  "yearlyThemes": [
    "Evolución específica de su configuración natal única",
    "Desarrollo de fortalezas naturales identificadas",
    "Integración de lecciones de sus casas principales"
  ],
  "priorityActions": [
    {
      "category": "crecimiento",
      "action": "Acción específica aprovechando Sol en ${userProfile.astrological.signs.sun} Casa ${userProfile.astrological.houses.sun}",
      "timing": "inmediato",
      "difficulty": "moderado",
      "impact": "alto"
    }
  ]
}`;

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: executivePrompt
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    
    while (runStatus.status === 'queued' || runStatus.status === 'in_progress' && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      if (lastMessage?.role === 'assistant' && lastMessage.content?.[0]?.type === 'text') {
        const assistantResponse = lastMessage.content[0].text.value;
        
        try {
          const cleanedResponse = assistantResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleanedResponse);
          
          console.log(`✅ Resumen ejecutivo personalizado generado para ${userProfile.name}`);
          return {
            monthlyHighlights: parsed.monthlyHighlights || [],
            quarterlyFocus: parsed.quarterlyFocus || [],
            yearlyThemes: parsed.yearlyThemes || [],
            priorityActions: parsed.priorityActions || []
          };
          
        } catch (parseError) {
          console.error('Error parseando resumen ejecutivo:', parseError);
        }
      }
    }

    throw new Error('Assistant no completó el resumen');
    
  } catch (error) {
    console.error('❌ Error generando resumen ejecutivo:', error);
    return generatePersonalizedExecutiveSummary(userProfile);
  }
}

function generatePersonalizedExecutiveSummary(userProfile: UserProfile) {
  return {
    monthlyHighlights: [
      `Enero-Marzo: Activación de tu Sol en ${userProfile.astrological.signs.sun} para nuevos comienzos`,
      `Abril-Junio: Trabajo emocional con tu Luna en ${userProfile.astrological.signs.moon}`,
      `Julio-Septiembre: Fortalecimiento de tu elemento ${userProfile.astrological.dominantElements[0]}`,
      `Octubre-Diciembre: Integración de aprendizajes para tus ${userProfile.nextAge} años`
    ],
    quarterlyFocus: [
      `Q1: Desarrollar cualidades de tu Sol en Casa ${userProfile.astrological.houses.sun}`,
      `Q2: Nutrir necesidades de tu Luna en Casa ${userProfile.astrological.houses.moon}`,
      `Q3: Expresar tu naturaleza ${userProfile.astrological.dominantMode}`,
      `Q4: Preparar terreno para el siguiente ciclo evolutivo`
    ],
    yearlyThemes: [
      `Evolución consciente de tu configuración ${userProfile.astrological.signs.sun}-${userProfile.astrological.signs.moon}`,
      `Equilibrio entre tu elemento ${userProfile.astrological.dominantElements[0]} y otros aspectos de tu ser`,
      `Desarrollo del potencial único de tu carta natal desde ${userProfile.place}`
    ],
    priorityActions: [
      {
        category: 'crecimiento',
        action: `Desarrollar conscientemente las cualidades de tu Sol en ${userProfile.astrological.signs.sun} Casa ${userProfile.astrological.houses.sun}`,
        timing: 'inmediato',
        difficulty: 'moderado',
        impact: 'alto'
      },
      {
        category: 'relaciones',
        action: `Usar tu naturaleza ${userProfile.astrological.dominantElements[0]} para conectar auténticamente`,
        timing: 'este_mes',
        difficulty: 'moderado',
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