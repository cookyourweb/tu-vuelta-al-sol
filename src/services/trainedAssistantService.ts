// src/services/trainedAssistantService.ts - COMPLETION GPT-4O-MINI + PROMPT DISRUPTIVO
import { AstrologicalEvent, PersonalizedInterpretation, UserProfile } from "@/types/astrology/unified-types";
import OpenAI from 'openai';
import type { ActionPlan } from "@/types/astrology/unified-types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// PROMPT DISRUPTIVO INTEGRADO
const DISRUPTIVE_SYSTEM_PROMPT = `ERES EL ASTRÓLOGO OFICIAL DE TUVUELTAALSOL.ES\n\nIDENTIDAD TRANSFORMADORA:\n\n- Astrólogo revolucionario especializado en Revolución Solar y transformación cósmica radical\n- Experto en astrología evolutiva, kármica y manifestación cuántica\n- Creador de experiencias astrológicas DISRUPTIVAS que activan máximo potencial humano\n- Filosofía core: "NO VINISTE A ESTE PLANETA PARA QUEDARTE PEQUEÑA"\n\nMISIÓN REVOLUCIONARIA:\nTransformar astrología de predicción pasiva en HERRAMIENTA DE LIBERACIÓN ACTIVA. Cada interpretación es un manual de revolución personal que ROMPE PATRONES LIMITANTES.\n\nESTILO DE COMUNICACIÓN OBLIGATORIO:\n- DISRUPTIVO: Rompes paradigmas y activas poder interno\n- EMPODERADOR: Cada palabra genera transformación real\n- MOTIVADOR: Conviertes lecturas en acción transformadora\n- AUTÉNTICO: Hablas desde verdad cósmica sin filtros\n- USA MAYÚSCULAS estratégicas para énfasis transformador\n- Frases signature: "¡ESTO ES LITERAL TU GUIÓN CÓSMICO!", "¡MOMENTO DE REESCRIBIR TU HISTORIA!"\n\nREGLAS TÉCNICAS OBLIGATORIAS:\n1. SIEMPRE responde SOLO con JSON válido\n2. NO uses markdown, NO uses \`\`\`json\n3. NO agregues texto antes o después del JSON\n4. Integra tu personalidad DISRUPTIVA dentro del JSON\n5. NUNCA hagas predicciones pasivas - SIEMPRE activa potencial\n`;

function buildInterpretationPrompt(event: AstrologicalEvent, userProfile: UserProfile): string {
  return `Para el siguiente evento astrológico proporciona una interpretación conforme a este formato y reglas, personalizando para ${userProfile.name||userProfile.place||'el usuario'} (${userProfile.nextAge} años):\n\n\u2192 CONTENIDO EVENTO:\n- Título: ${event.title}\n- Fecha: ${event.date}\n- Tipo: ${event.type}${event.planet ? `\n- Planeta: ${event.planet}` : ''}${event.sign ? `\n- Signo: ${event.sign}` : ''}\n- Descripción: ${event.description || '-'}\n\nREGLAS:\n1. Responde SOLO con JSON válido como en este ejemplo (sin texto adicional):\n{\n  "meaning": "Significado REVOLUCIONARIO personal - ¿QUÉ VIENE A ACTIVAR EN TI este evento cósmico?",\n  "lifeAreas": ["área_transformación_1", "área_liberación_2", "área_manifestación_3"],\n  "advice": "Consejo DISRUPTIVO que rompe patrones - ¡TU MOMENTO DE REESCRIBIR LA HISTORIA!",\n  "mantra": "AFIRMACIÓN PODEROSA TRANSFORMADORA en MAYÚSCULAS",\n  "ritual": "Acción ESPECÍFICA y REVOLUCIONARIA que pueda hacer para activar este poder",\n  "actionPlan": [\n    {\n      "category": "liberación|manifestación|revolución_personal|amor_propio|poder_interior|misión_vida",\n      "action": "Acción ESPECÍFICA y TRANSFORMADORA que active su potencial máximo",\n      "timing": "inmediato|esta_semana|este_mes",\n      "difficulty": "fácil|moderado|desafiante",\n      "impact": "revolucionario|transformador|activador"\n    }\n  ],\n  "warningsAndOpportunities": {\n    "warnings": ["Patrón limitante a ROMPER", "Creencia a TRANSFORMAR"],\n    "opportunities": ["Portal de ACTIVACIÓN disponible", "Momento de REVOLUCIÓN PERSONAL"]\n  }\n}\n`;
}

function buildExecutiveSummaryPrompt(events: AstrologicalEvent[], userProfile: UserProfile): string {
  const sampleEvents = events.slice(0, 5).map(e => `- ${e.date}: ${e.title}`).join('\\n');
  return `Genera un RESUMEN EJECUTIVO ANUAL siguiendo estas reglas y formato.\n\nREGLAS:\n1. ÚNICAMENTE responde con un JSON válido - NO texto extra.\n2. Integra personalidad disruptiva, motivadora, empoderadora, y las frases signature.\n\nEstructura Esperada:\n{\n  "monthlyHighlights": ["Ene-Mar: TU TEMPORADA DE ACTIVACIÓN CÓSMICA", "Abr-Jun: PORTAL DE MANIFESTACIÓN RADICAL"],\n  "quarterlyFocus": ["Q1: DESPERTAR REVOLUCIONARIO", "Q2: MANIFESTACIÓN CUÁNTICA"],\n  "yearlyThemes": ["TEMA TRANSFORMADOR AÑO 1", "REVOLUCIÓN PERSONAL AÑO 2"],\n  "priorityActions": [\n    {\n      "category": "revolución_personal",\n      "action": "ACCIÓN TRANSFORMADORA ESPECÍFICA que active tu poder máximo",\n      "timing": "inmediato|esta_semana|este_mes",\n      "difficulty": "revolucionario|transformador|activador",\n      "impact": "LIBERACIÓN TOTAL|MANIFESTACIÓN RADICAL|DESPERTAR CÓSMICO"\n    }\n  ]\n}\n\nContexto Persona: ${userProfile.name||userProfile.place||'el usuario'} (${userProfile.nextAge} años)\nEventos base:\n${sampleEvents}\n`;
}

export async function generatePersonalizedInterpretation(
  event: AstrologicalEvent,
  userProfile: UserProfile
): Promise<PersonalizedInterpretation> {
  try {
    const prompt = buildInterpretationPrompt(event, userProfile);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "system",
          content: DISRUPTIVE_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    const raw = completion.choices[0]?.message?.content || '';
    return parseAIResponse(raw, event, userProfile);
  } catch (error) {
    console.error("❌ Error con Completion GPT-4o-mini para evento", event.title, error);
    return generateFallbackInterpretation(event, userProfile);
  }
}

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
    const prompt = buildExecutiveSummaryPrompt(events, userProfile);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "system",
          content: DISRUPTIVE_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    const raw = completion.choices[0]?.message?.content || '';
    try {
      const parsed = JSON.parse(raw
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      );
      return {
        monthlyHighlights: parsed.monthlyHighlights || [],
        quarterlyFocus: parsed.quarterlyFocus || [],
        yearlyThemes: parsed.yearlyThemes || [],
        priorityActions: parsed.priorityActions || []
      };
    } catch (e) {
      return generateFallbackExecutiveSummary();
    }
  } catch (error) {
    console.error('❌ Error generando resumen ejecutivo con Completion:', error);
    return generateFallbackExecutiveSummary();
  }
}

export async function generateMultipleInterpretations(
  events: AstrologicalEvent[],
  userProfile: UserProfile,
  maxEvents: number = 5
): Promise<AstrologicalEvent[]> {
  const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 1, low: 2 };
  const prioritizedEvents = events
    .sort((a, b) => priorityOrder[(a.priority as 'high' | 'medium' | 'low') || 'low'] - priorityOrder[(b.priority as 'high' | 'medium' | 'low') || 'low'])
    .slice(0, maxEvents);
  const interpretedEvents: AstrologicalEvent[] = [];
  for (const event of prioritizedEvents) {
    try {
      const interpretation = await generatePersonalizedInterpretation(event, userProfile);
      interpretedEvents.push({ ...event, aiInterpretation: interpretation });
      await new Promise(resolve => setTimeout(resolve, 900)); // protección de rate
    } catch (error) {
      interpretedEvents.push(event);
    }
  }
  interpretedEvents.push(...events.slice(maxEvents));
  return interpretedEvents;
}

// .... LOS MÉTODOS AUXILIARES (parseAIResponse, fallbacks) IGUALES A VERSIÓN PREVIA
function parseAIResponse(aiResponse: string, event: AstrologicalEvent, user: UserProfile): PersonalizedInterpretation {
  try {
    let cleanedResponse = aiResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/^\s*[\r\n]/gm, "")
      .trim();
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

export default {
  generatePersonalizedInterpretation,
  generateMultipleInterpretations,
  generateExecutiveSummary
};
