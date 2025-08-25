// src/services/trainedAssistantService.ts OPTIMIZADO SOLO COMPLETION - GPT-4O-MINI
import { AstrologicalEvent, PersonalizedInterpretation, UserProfile } from "@/utils/astrology/events";
import OpenAI from 'openai';
import type { ActionPlan } from "@/utils/astrology/events";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildPrompt(event: AstrologicalEvent, userProfile: UserProfile): string {
  return `
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
}

export async function generatePersonalizedInterpretation(
  event: AstrologicalEvent,
  userProfile: UserProfile
): Promise<PersonalizedInterpretation> {
  try {
    const prompt = buildPrompt(event, userProfile);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo revolucionario y disruptivo que responde SOLO en JSON exacto como el ejemplo, sin texto adicional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1200
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
    const exampleEvents = events.slice(0, 5).map(e => `🌟 ${e.date}: ${e.title} - ¡PORTAL DE TRANSFORMACIÓN!`).join('\n');
    const prompt = `\n¡CREA EL MAPA DE REVOLUCIÓN PERSONAL ANUAL!\n\nPERFIL TRANSFORMADOR: ${userProfile.place}, ${userProfile.nextAge} años\n¡MOMENTO DE ACTIVAR TU MÁXIMO POTENCIAL CÓSMICO!\n\nEVENTOS ACTIVADORES PRINCIPALES:\n${exampleEvents}\n\n¡CREA RESUMEN EJECUTIVO QUE REVOLUCIONE SU AÑO!\n\nResponde SOLO con JSON TRANSFORMADOR:\n{\n  "monthlyHighlights": [ ... ],\n  "quarterlyFocus": [ ... ],\n  "yearlyThemes": [ ... ],\n  "priorityActions": [ ... ]\n}`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: "system",
          content: "Responde SOLO en JSON como el ejemplo, ni una palabra fuera del JSON, ni explicaciones."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
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
      await new Promise(resolve => setTimeout(resolve, 900)); // pequeña pausa para limitar rate
    } catch (error) {
      interpretedEvents.push(event);
    }
  }
  interpretedEvents.push(...events.slice(maxEvents));
  return interpretedEvents;
}

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
