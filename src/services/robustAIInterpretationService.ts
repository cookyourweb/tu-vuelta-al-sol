// src/services/robustAIInterpretationService.ts
// 🤖 SERVICIO IA ROBUSTO - VERSIÓN FINAL CON SINTAXIS OPENAI CORREGIDA

import OpenAI from 'openai';
import type { UserProfile, AstrologicalEvent } from '@/utils/astrology/events';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

interface AIInterpretation {
  impact: string;
  advice: string;
  mantra: string;
  ritual?: string;
  avoid?: string;
  opportunity?: string;
  actionPlan?: string[];
  timing?: string;
}

interface InterpretationResult {
  success: boolean;
  interpretation?: AIInterpretation;
  method: 'assistant' | 'completion' | 'basic';
  error?: string;
}

// MÉTODO 1: ASSISTANT (PRINCIPAL) - SINTAXIS CORREGIDA
async function tryAssistantMethod(event: AstrologicalEvent, userProfile: UserProfile): Promise<InterpretationResult> {
  try {
    console.log(`🤖 Intentando Assistant para: ${event.title}`);
    
    const assistantId = process.env.OPENAI_ASSISTANT_ID || 'asst_2RiAp8rkMTnCqipvIYyS4jpT';
    
    const thread = await openai.beta.threads.create();
    const prompt = generatePersonalizedPrompt(event, userProfile);
    
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: prompt
    });
    
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });
    
    // SINTAXIS CORREGIDA PARA RETRIEVE
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    const maxAttempts = 20;
    
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      if (attempts >= maxAttempts) {
        throw new Error('Assistant timeout - demasiado tiempo procesando');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      // SINTAXIS CORREGIDA - MISMA FORMA
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
    }
    
    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const responseMessage = messages.data[0];
      
      if (responseMessage && responseMessage.content[0].type === 'text') {
        const responseText = responseMessage.content[0].text.value;
        const interpretation = parseAIResponse(responseText);
        
        console.log(`✅ Assistant exitoso para: ${event.title}`);
        return {
          success: true,
          interpretation,
          method: 'assistant'
        };
      }
    }
    
    throw new Error(`Assistant failed with status: ${runStatus.status}`);
    
  } catch (error) {
    console.log(`⚠️ Assistant falló para ${event.title}:`, error instanceof Error ? error.message : 'Error desconocido');
    return {
      success: false,
      method: 'assistant',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// MÉTODO 2: COMPLETION GPT-4 (SECUNDARIO)
async function tryCompletionMethod(event: AstrologicalEvent, userProfile: UserProfile): Promise<InterpretationResult> {
  try {
    console.log(`🧠 Intentando GPT-4 Completion para: ${event.title}`);
    
    const prompt = generateAdvancedPrompt(event, userProfile);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Eres un astrólogo evolutivo experto que crea interpretaciones transformadoras y prácticas. 
          Respondes siempre en formato JSON válido con las claves: impact, advice, mantra, ritual, avoid, opportunity, actionPlan, timing.
          Tu lenguaje es inspirador, disruptivo y motivador. Siempre das consejos específicos y accionables.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });
    
    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No se recibió respuesta de GPT-4');
    }
    
    const interpretation = parseAIResponse(responseText);
    
    console.log(`✅ GPT-4 exitoso para: ${event.title}`);
    return {
      success: true,
      interpretation,
      method: 'completion'
    };
    
  } catch (error) {
    console.log(`⚠️ GPT-4 falló para ${event.title}:`, error instanceof Error ? error.message : 'Error desconocido');
    return {
      success: false,
      method: 'completion',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// MÉTODO 3: INTERPRETACIÓN BÁSICA (TERCIARIO) 
function generateBasicInterpretation(event: AstrologicalEvent, userProfile: UserProfile): InterpretationResult {
  console.log(`📚 Usando interpretación básica para: ${event.title}`);
  
  const interpretations = getBasicInterpretations();
  const eventType = event.type || 'default';
  const baseInterpretation = interpretations[eventType] || interpretations.default;
  
  const interpretation: AIInterpretation = {
    impact: baseInterpretation.impact.replace('{age}', userProfile.nextAge.toString()),
    advice: baseInterpretation.advice.replace('{place}', userProfile.place),
    mantra: baseInterpretation.mantra,
    ritual: baseInterpretation.ritual,
    avoid: baseInterpretation.avoid,
    opportunity: baseInterpretation.opportunity,
    actionPlan: baseInterpretation.actionPlan,
    timing: formatTiming(event.date)
  };
  
  return {
    success: true,
    interpretation,
    method: 'basic'
  };
}

// FUNCIÓN PRINCIPAL: TRIPLE FALLBACK
export async function generateRobustInterpretation(
  event: AstrologicalEvent, 
  userProfile: UserProfile
): Promise<InterpretationResult> {
  
  // MÉTODO 1: Intentar Assistant
  const assistantResult = await tryAssistantMethod(event, userProfile);
  if (assistantResult.success) {
    return assistantResult;
  }
  
  // MÉTODO 2: Intentar GPT-4 Completion
  const completionResult = await tryCompletionMethod(event, userProfile);
  if (completionResult.success) {
    return completionResult;
  }
  
  // MÉTODO 3: Fallback básico (SIEMPRE funciona)
  console.log(`🛡️ Usando fallback básico para: ${event.title}`);
  return generateBasicInterpretation(event, userProfile);
}

// FUNCIONES DE UTILIDAD
function generatePersonalizedPrompt(event: AstrologicalEvent, userProfile: UserProfile): string {
  return `
Como astrólogo evolutivo, interpreta este evento para una persona específica:

EVENTO: ${event.title}
FECHA: ${event.date}
TIPO: ${event.type}
DESCRIPCIÓN: ${event.description}

PERFIL PERSONAL:
- Edad actual: ${userProfile.currentAge} años (cumplirá ${userProfile.nextAge})
- Ubicación: ${userProfile.place}
- Coordenadas: ${userProfile.latitude}, ${userProfile.longitude}

Crea una interpretación TRANSFORMADORA que incluya:
1. IMPACTO personal específico para esta edad y momento
2. CONSEJO práctico y accionable
3. MANTRA poderoso personalizado
4. RITUAL específico para este evento
5. QUÉ EVITAR durante este período
6. OPORTUNIDAD principal a aprovechar
7. PLAN DE ACCIÓN con 3-5 pasos concretos
8. TIMING óptimo para acciones

Responde en JSON con estas claves exactas: impact, advice, mantra, ritual, avoid, opportunity, actionPlan, timing.
`;
}

function generateAdvancedPrompt(event: AstrologicalEvent, userProfile: UserProfile): string {
  return `
Interpreta este evento astrológico con enfoque evolutivo y práctico:

🌟 EVENTO: ${event.title} (${event.date})
👤 PERSONA: ${userProfile.nextAge} años en ${userProfile.place}

Crea interpretación JSON con:
{
  "impact": "Cómo afecta específicamente a alguien de ${userProfile.nextAge} años",
  "advice": "Consejo práctico y accionable para ${userProfile.place}",
  "mantra": "Frase poderosa personalizada",
  "ritual": "Ritual específico para este evento",
  "avoid": "Qué evitar durante este período",
  "opportunity": "Principal oportunidad a aprovechar",
  "actionPlan": ["Acción 1", "Acción 2", "Acción 3"],
  "timing": "Mejor momento para actuar"
}

Lenguaje: Inspirador, específico, transformador.
`;
}

function parseAIResponse(responseText: string): AIInterpretation {
  try {
    const cleanText = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const parsed = JSON.parse(cleanText);
    
    return {
      impact: parsed.impact || 'Momento de crecimiento personal importante.',
      advice: parsed.advice || 'Mantente abierto a las oportunidades que se presenten.',
      mantra: parsed.mantra || 'Fluyo con la energía del universo.',
      ritual: parsed.ritual,
      avoid: parsed.avoid,
      opportunity: parsed.opportunity,
      actionPlan: Array.isArray(parsed.actionPlan) ? parsed.actionPlan : [],
      timing: parsed.timing
    };
    
  } catch (error) {
    console.log('⚠️ Error parseando JSON, usando interpretación básica');
    return {
      impact: 'Las energías cósmicas se alinean para crear nuevas oportunidades en tu vida.',
      advice: 'Mantente atento a las señales y confía en tu intuición durante este período.',
      mantra: 'Abrazo el cambio y me abro a mi máximo potencial.',
      timing: 'Los próximos días serán especialmente favorables para la acción.'
    };
  }
}

function getBasicInterpretations(): Record<string, any> {
  return {
    'lunar_phase': {
      impact: 'Las fases lunares activan tu mundo emocional y psíquico a los {age} años.',
      advice: 'Conecta con tu intuición y permite que las emociones fluyan naturalmente.',
      mantra: 'Mi intuición me guía hacia mi propósito superior.',
      ritual: 'Medita bajo la luna y escribe tus intenciones en un papel.',
      avoid: 'No tomes decisiones importantes desde el drama emocional.',
      opportunity: 'Momento perfecto para manifestar deseos desde el corazón.',
      actionPlan: ['Meditar diariamente 10 minutos', 'Escribir intenciones claras', 'Observar patrones emocionales']
    },
    'retrograde': {
      impact: 'Los períodos retrógrados te invitan a revisar y perfeccionar aspectos importantes.',
      advice: 'Usa este tiempo para reflexionar, reorganizar y mejorar lo existente.',
      mantra: 'La pausa me permite crecer con sabiduría.',
      ritual: 'Revisa proyectos pasados y planifica mejoras específicas.',
      avoid: 'No inicies proyectos completamente nuevos o firmes contratos importantes.',
      opportunity: 'Resolver asuntos pendientes y fortalecer cimientos.',
      actionPlan: ['Revisar proyectos en curso', 'Hacer respaldos digitales', 'Reorganizar espacios']
    },
    'eclipse': {
      impact: 'Los eclipses marcan portales de transformación profunda y cambios evolutivos.',
      advice: 'Prepárate para cambios significativos y abraza las nuevas direcciones.',
      mantra: 'Me rindo al flujo divino de la transformación.',
      ritual: 'Escribe lo que quieres soltar y lo que deseas manifestar.',
      avoid: 'Resistirte a los cambios o aferrarte al pasado.',
      opportunity: 'Saltos cuánticos en evolución personal y manifestación.',
      actionPlan: ['Definir nuevas metas', 'Soltar relaciones tóxicas', 'Tomar acción valiente']
    },
    'default': {
      impact: 'Este evento cósmico trae energías de crecimiento y oportunidad.',
      advice: 'Mantente abierto a las nuevas posibilidades que se presentan.',
      mantra: 'Estoy alineado con el flujo perfecto del universo.',
      ritual: 'Dedica tiempo a la gratitud y visualiza tus objetivos.',
      avoid: 'La resistencia al cambio o el pesimismo.',
      opportunity: 'Avanzar hacia tus metas con confianza renovada.',
      actionPlan: ['Practicar gratitud diaria', 'Visualizar objetivos', 'Tomar una acción concreta']
    }
  };
}

function formatTiming(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy es el momento perfecto para actuar.';
    if (diffDays === 1) return 'Mañana será ideal para tomar acción.';
    if (diffDays <= 7) return `En los próximos ${diffDays} días será el momento óptimo.`;
    if (diffDays <= 30) return `En las próximas ${Math.ceil(diffDays/7)} semanas aprovechar esta energía.`;
    
    return `A partir del ${date.toLocaleDateString('es-ES')} será el momento ideal.`;
  } catch (error) {
    return 'El timing divino se alineará perfectamente.';
  }
}

// FUNCIÓN PARA MÚLTIPLES EVENTOS
export async function generateMultipleRobustInterpretations(
  events: AstrologicalEvent[],
  userProfile: UserProfile
): Promise<{
  success: boolean;
  interpretedEvents: (AstrologicalEvent & { personalInterpretation: AIInterpretation; method: string })[];
  stats: {
    total: number;
    assistant: number;
    completion: number;
    basic: number;
    errors: number;
  };
}> {
  
  const results = [];
  const stats = { total: events.length, assistant: 0, completion: 0, basic: 0, errors: 0 };
  
  console.log(`🔄 Procesando ${events.length} eventos con sistema robusto`);
  
  for (const event of events) {
    const result = await generateRobustInterpretation(event, userProfile);
    
    if (result.success) {
      stats[result.method]++;
    } else {
      stats.errors++;
    }
    
    results.push({
      ...event,
      personalInterpretation: result.interpretation!,
      method: result.method
    });
    
    // Pausa pequeña para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`✅ Interpretaciones completadas:`, stats);
  
  return {
    success: true,
    interpretedEvents: results,
    stats
  };
}

// RESUMEN EJECUTIVO ROBUSTO
export async function generateRobustExecutiveSummary(
  events: AstrologicalEvent[],
  userProfile: UserProfile
): Promise<{
  success: boolean;
  summary?: string;
  method: string;
  error?: string;
}> {
  
  try {
    console.log(`📊 Generando resumen ejecutivo para ${userProfile.nextAge} años`);
    
    const prompt = `
Como astrólogo evolutivo, crea un RESUMEN EJECUTIVO del año astrológico para:

PERFIL:
- Edad: ${userProfile.currentAge} años (cumplirá ${userProfile.nextAge})
- Ubicación: ${userProfile.place}
- Período: Año personal ${userProfile.nextAge}

EVENTOS PRINCIPALES:
${events.slice(0, 10).map(e => `• ${e.title} (${e.date}) - ${e.type}`).join('\n')}

Crea un resumen ejecutivo inspirador que incluya:

1. TEMA CENTRAL del año
2. PRINCIPALES OPORTUNIDADES (3 máximo)
3. DESAFÍOS A SUPERAR (2 máximo)
4. MOMENTOS CLAVE del año
5. CONSEJO MAESTRO para maximizar este año

Lenguaje: Inspirador, específico, transformador.
Extensión: 200-300 palabras máximo.
Tono: Empoderador y práctico.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo evolutivo que crea resúmenes anuales transformadores y prácticos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });
    
    const summary = completion.choices[0]?.message?.content;
    
    if (!summary) {
      throw new Error('No se recibió resumen de GPT-4');
    }
    
    console.log(`✅ Resumen ejecutivo generado exitosamente`);
    
    return {
      success: true,
      summary,
      method: 'completion'
    };
    
  } catch (error) {
    console.log(`⚠️ Error generando resumen, usando básico:`, error instanceof Error ? error.message : 'Error desconocido');
    
    const basicSummary = `
🌟 TU AÑO ASTROLÓGICO ${userProfile.nextAge}

TEMA CENTRAL: Año de evolución personal y manifestación consciente a los ${userProfile.nextAge} años.

OPORTUNIDADES PRINCIPALES:
• Crecimiento espiritual acelerado
• Nuevas conexiones y colaboraciones significativas  
• Manifestación de proyectos importantes

DESAFÍOS A SUPERAR:
• Equilibrar ambición personal con necesidades emocionales
• Soltar patrones limitantes del pasado

MOMENTOS CLAVE: ${events.length} eventos astrológicos marcarán puntos de inflexión importantes a lo largo del año.

CONSEJO MAESTRO: Confía en tu intuición y toma acción alineada con tu propósito. Este año en ${userProfile.place} será fundamental para tu evolución personal.

Las estrellas han conspirado para tu despertar. ¡Es tu momento de brillar!
`;
    
    return {
      success: true,
      summary: basicSummary,
      method: 'basic'
    };
  }
}