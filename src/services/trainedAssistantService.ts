// src/services/trainedAssistantService.ts
// 🔥 VERSIÓN OPTIMIZADA PARA EVITAR RATE LIMITS
// ✅ REDUCIDO A MÁXIMO 3 LLAMADAS OPENAI

import OpenAI from 'openai';
import { 
  AstrologicalEvent, 
  PersonalizedInterpretation, 
  UserProfile, 
  DetailedNatalChart, 
  DetailedProgressedChart,
  PlanetPosition 
} from "@/types/astrology/unified-types";

// 🎯 CONFIGURACIÓN PROFESIONAL CON VARIABLES DE ENTORNO
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || '';
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID || '';
const OPENAI_ORG_ID = process.env.OPENAI_ORG_ID || '';

// 🔧 CLIENTE OPENAI CONFIGURADO
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('❌ OPENAI_API_KEY no configurada en variables de entorno');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: OPENAI_ORG_ID,
    project: OPENAI_PROJECT_ID,
  });
}

// 📊 TIPOS PARA INTERPRETACIONES EDUCATIVAS
interface NatalInterpretation {
  personalidad_core: string;
  fortalezas_principales: string[];
  desafios_evolutivos: string[];
  proposito_vida: string;
  patron_energetico: string;
  casa_mas_activada: number;
  planeta_dominante: string;
  arquetipos_principales: string[];
  tema_existencial: string;
}

interface ProgressedInterpretation {
  tema_anual: string;
  evolucion_personalidad: string;
  nuevas_fortalezas: string[];
  desafios_superados: string[];
  enfoque_transformacional: string;
  cambios_energeticos: string;
  activaciones_casas: number[];
  aspectos_clave: string[];
  oportunidades_crecimiento: string[];
}

interface AgendaInterpretation {
  titulo: string;
  subtitulo: string;
  intro_disruptiva: string;
  declaracion_activacion: string;
  meses: MonthInterpretation[];
  llamada_accion_final: string;
  mantra_anual: string;
  enfoque_antifragilidad: string;
}

interface MonthInterpretation {
  mes: string;
  tema_central: string;
  energia_dominante: string;
  mantra_mensual: string;
  eventos_clave: EventInterpretation[];
  accion_recomendada: string;
  rituales: string[];
  preparacion_antifragilidad: string;
}

interface EventInterpretation {
  fecha: string;
  titulo: string;
  significado_personal: string;
  consejo_especifico: string;
  ritual_sugerido: string;
  nivel_impacto: 'alto' | 'medio' | 'bajo';
  patron_a_transformar: string;
  oportunidad_crecimiento: string;
}

// 🌟 FUNCIÓN OPTIMIZADA: UNA SOLA LLAMADA PARA TODO
export async function generateCompleteInterpretation(
  natalChart: DetailedNatalChart,
  progressedChart: DetailedProgressedChart,
  yearlyEvents: AstrologicalEvent[],
  userProfile: UserProfile
) {
  try {
    console.log('🚀 Generando interpretación completa optimizada...');

    const openai = getOpenAIClient();

    // 🎯 UN SOLO PROMPT MAESTRO CON TODO EL CONTEXTO
    const masterPrompt = buildMasterPrompt(natalChart, progressedChart, yearlyEvents, userProfile);

    const thread = await openai.beta.threads.create({
      messages: [{
        role: "user",
        content: masterPrompt
      }]
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
      temperature: 0.8,
      max_completion_tokens: 8000, // Más tokens para respuesta completa
      instructions: `
Eres un ASTRÓLOGO EDUCATIVO REVOLUCIONARIO.

MISIÓN: Generar UNA RESPUESTA COMPLETA con interpretación natal + progresada + agenda.

ESTRUCTURA REQUERIDA (JSON VÁLIDO):
{
  "natal": {
    "personalidad_core": "Esencia profunda con explicación",
    "fortalezas_principales": ["fortaleza 1", "fortaleza 2"],
    "desafios_evolutivos": ["desafío y transformación", "otro desafío"],
    "proposito_vida": "Propósito basado en Sol, Luna, Ascendente",
    "patron_energetico": "Patrón energético dominante",
    "casa_mas_activada": 1,
    "planeta_dominante": "Sol",
    "arquetipos_principales": ["arquetipo 1", "arquetipo 2"],
    "tema_existencial": "Tema central"
  },
  "progressed": {
    "tema_anual": "Tema principal este año",
    "evolucion_personalidad": "Cómo evoluciona",
    "nuevas_fortalezas": ["nueva fortaleza 1", "nueva fortaleza 2"],
    "desafios_superados": ["desafío superado", "otro"],
    "enfoque_transformacional": "Enfoque principal",
    "cambios_energeticos": "Cambios energéticos",
    "activaciones_casas": [1, 5],
    "aspectos_clave": ["aspecto 1", "aspecto 2"],
    "oportunidades_crecimiento": ["oportunidad 1", "oportunidad 2"]
  },
  "agenda": {
    "titulo": "TU REVOLUCIÓN CÓSMICA 2025-2026",
    "subtitulo": "Agenda Personalizada para [Nombre]",
    "intro_disruptiva": "Introducción épica",
    "declaracion_activacion": "Declaración poderosa",
    "meses": [
      {
        "mes": "Febrero 2025",
        "tema_central": "Tema del mes",
        "energia_dominante": "Energía dominante",
        "mantra_mensual": "Mantra personalizado",
        "eventos_clave": [
          {
            "fecha": "2025-02-15",
            "titulo": "Evento específico",
            "significado_personal": "Qué significa para esta persona",
            "consejo_especifico": "Qué hacer específicamente",
            "ritual_sugerido": "Ritual personalizado",
            "nivel_impacto": "alto",
            "patron_a_transformar": "Patrón a trabajar",
            "oportunidad_crecimiento": "Oportunidad a aprovechar"
          }
        ],
        "accion_recomendada": "Acción principal",
        "rituales": ["ritual 1", "ritual 2"],
        "preparacion_antifragilidad": "Preparación para desafíos"
      }
    ],
    "llamada_accion_final": "Llamada épica final",
    "mantra_anual": "Mantra para todo el año",
    "enfoque_antifragilidad": "Enfoque de fortalecimiento"
  }
}

RESPONDE SOLO JSON VÁLIDO. NO uses markdown ni comentarios.
`
    });

    // ⏱️ ESPERAR CON TIMEOUTS APROPIADOS
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    const maxAttempts = 60; // 60 segundos máximo

    while ((runStatus.status === 'in_progress' || runStatus.status === 'queued') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos entre checks
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;
      
      if (attempts % 10 === 0) {
        console.log(`⏳ Esperando respuesta de OpenAI... (${attempts * 2}s)`);
      }
    }

    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      if (lastMessage.content[0].type === 'text') {
        const responseText = lastMessage.content[0].text.value;
        console.log('📄 Respuesta cruda de OpenAI:', responseText.substring(0, 200) + '...');
        
        // Limpiar respuesta
        let cleanResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Buscar JSON válido en la respuesta
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanResponse = jsonMatch[0];
        }
        
        try {
          const parsedResponse = JSON.parse(cleanResponse);
          console.log('✅ Interpretación completa generada exitosamente');
          
          return {
            natal: parsedResponse.natal || createNatalFallback(natalChart, userProfile),
            progressed: parsedResponse.progressed || createProgressedFallback(progressedChart, userProfile),
            agenda: parsedResponse.agenda || createAgendaFallback(parsedResponse.natal, parsedResponse.progressed, userProfile),
            processedEvents: yearlyEvents // Sin procesar individualmente para evitar rate limits
          };
        } catch (parseError) {
          console.error('❌ Error parseando JSON:', parseError);
          console.log('🔍 Respuesta que falló:', cleanResponse);
          throw new Error('Respuesta de IA no válida');
        }
      }
    }

    console.error('❌ OpenAI no completó en tiempo esperado. Status:', runStatus.status);
    throw new Error(`Assistant no completó. Status: ${runStatus.status}`);

  } catch (error) {
    console.error('❌ Error en interpretación completa:', error);
    
    // FALLBACK COMPLETO
    return {
      natal: createNatalFallback(natalChart, userProfile),
      progressed: createProgressedFallback(progressedChart, userProfile),
      agenda: createAgendaFallback(null, null, userProfile),
      processedEvents: yearlyEvents
    };
  }
}

// 🏗️ PROMPT MAESTRO OPTIMIZADO
function buildMasterPrompt(
  natalChart: DetailedNatalChart,
  progressedChart: DetailedProgressedChart,
  yearlyEvents: AstrologicalEvent[],
  userProfile: UserProfile
): string {
  
  // Extraer planetas con verificaciones de seguridad
  const planetPositions = extractPlanetsFromChart(natalChart);
  const progressedPositions = extractProgressedPlanets(progressedChart);
  
  return `
🔥 INTERPRETACIÓN COMPLETA EDUCATIVA TRANSFORMACIONAL 🔥

DATOS PERSONALES:
Nombre: ${userProfile.name || 'Usuario'}
Fecha: ${userProfile.birthDate}
Edad actual: ${userProfile.currentAge} años
Lugar: ${userProfile.place || userProfile.birthPlace || 'Madrid, España'}

CARTA NATAL:
${planetPositions.map(p => `${p.name}: ${p.position?.sign || 'N/A'} ${p.position?.degree || 0}° Casa ${p.position?.house || 1}`).join('\n')}

CARTA PROGRESADA:
${progressedPositions.map(p => `${p.name}: ${p.position?.sign || 'N/A'} ${p.position?.degree || 0}° Casa ${p.position?.house || 1}`).join('\n')}

EVENTOS PRINCIPALES DEL AÑO (primeros 10):
${yearlyEvents.slice(0, 10).map(e => `${e.date}: ${e.title}`).join('\n')}

🎯 MISIÓN: Crear una interpretación COMPLETA que incluya:

1. INTERPRETACIÓN NATAL: Personalidad, fortalezas, desafíos, propósito
2. INTERPRETACIÓN PROGRESADA: Evolución, nuevas fortalezas, cambios energéticos
3. AGENDA TRANSFORMACIONAL: 12 meses con eventos específicos y rituales

ENFOQUE EDUCATIVO:
- Explica cada planeta como arquetipo psicológico
- Conecta con propósito de vida y crecimiento personal
- Proporciona herramientas prácticas de transformación
- Enfoque antifragilidad: usar tránsitos como fortaleza

GENERA UNA RESPUESTA JSON COMPLETA con las tres secciones.
`;
}

// 🔧 FUNCIONES AUXILIARES MEJORADAS

function extractPlanetsFromChart(natalChart: DetailedNatalChart): Array<{name: string, position: any}> {
  const planets = [];
  
  if (natalChart.sol) planets.push({ name: 'Sol', position: natalChart.sol });
  if (natalChart.luna) planets.push({ name: 'Luna', position: natalChart.luna });
  if (natalChart.mercurio) planets.push({ name: 'Mercurio', position: natalChart.mercurio });
  if (natalChart.venus) planets.push({ name: 'Venus', position: natalChart.venus });
  if (natalChart.marte) planets.push({ name: 'Marte', position: natalChart.marte });
  if (natalChart.jupiter) planets.push({ name: 'Júpiter', position: natalChart.jupiter });
  if (natalChart.saturno) planets.push({ name: 'Saturno', position: natalChart.saturno });
  if (natalChart.urano) planets.push({ name: 'Urano', position: natalChart.urano });
  if (natalChart.neptuno) planets.push({ name: 'Neptuno', position: natalChart.neptuno });
  if (natalChart.pluton) planets.push({ name: 'Plutón', position: natalChart.pluton });
  
  return planets;
}

function extractProgressedPlanets(progressedChart: DetailedProgressedChart): Array<{name: string, position: any}> {
  const planets = [];
  
  if (progressedChart.sol_progresado) planets.push({ name: 'Sol Progresado', position: progressedChart.sol_progresado });
  if (progressedChart.luna_progresada) planets.push({ name: 'Luna Progresada', position: progressedChart.luna_progresada });
  if (progressedChart.mercurio_progresado) planets.push({ name: 'Mercurio Progresado', position: progressedChart.mercurio_progresado });
  if (progressedChart.venus_progresada) planets.push({ name: 'Venus Progresada', position: progressedChart.venus_progresada });
  if (progressedChart.marte_progresado) planets.push({ name: 'Marte Progresado', position: progressedChart.marte_progresado });
  
  return planets;
}

// 🛡️ FUNCIONES DE FALLBACK MEJORADAS

function createNatalFallback(natalChart: DetailedNatalChart, userProfile: UserProfile): NatalInterpretation {
  return {
    personalidad_core: `Personalidad ${userProfile.currentAge} años con gran potencial de transformación personal. Tu carta natal revela una combinación única de energías que te definen como un ser en constante evolución.`,
    fortalezas_principales: [
      "Capacidad innata de crecimiento personal y adaptación", 
      "Potencial de transformación y renovación constante",
      "Intuición natural para navegar cambios vitales"
    ],
    desafios_evolutivos: [
      "Desarrollo continuo del autoconocimiento y aceptación personal", 
      "Integración armoniosa de todos los aspectos de tu personalidad",
      "Equilibrio entre seguridad y crecimiento"
    ],
    proposito_vida: "Tu propósito se centra en la evolución personal consciente y la contribución al crecimiento colectivo a través de tu ejemplo auténtico.",
    patron_energetico: "Energía equilibrada con tendencia natural al crecimiento y la transformación positiva",
    casa_mas_activada: 1,
    planeta_dominante: "Sol",
    arquetipos_principales: ["El Buscador", "El Transformador", "El Sanador"],
    tema_existencial: "Autodescubrimiento continuo y expresión auténtica de tu verdadera esencia"
  };
}

function createProgressedFallback(progressedChart: DetailedProgressedChart, userProfile: UserProfile): ProgressedInterpretation {
  const currentYear = new Date().getFullYear();
  return {
    tema_anual: `Año ${currentYear} de crecimiento personal acelerado y apertura a nuevas oportunidades de evolución`,
    evolucion_personalidad: "Este año marca un desarrollo significativo en tu autoconfianza y claridad personal. Tu personalidad se refina hacia una expresión más auténtica.",
    nuevas_fortalezas: [
      "Mayor autoconocimiento y aceptación personal", 
      "Capacidad expandida de liderazgo emocional",
      "Sabiduría integrada de experiencias pasadas"
    ],
    desafios_superados: [
      "Inseguridades limitantes del pasado que ya no definen tu presente", 
      "Patrones de pensamiento restrictivos que han evolucionado",
      "Miedos al cambio transformados en confianza"
    ],
    enfoque_transformacional: "Integración consciente de nuevas capacidades personales con la sabiduría acumulada de tu experiencia vital",
    cambios_energeticos: "Tu energía se vuelve más enfocada, direccionada y auténticamente poderosa",
    activaciones_casas: [1, 10, 4],
    aspectos_clave: [
      "Desarrollo de mayor autoconfianza y presencia personal", 
      "Claridad expandida en objetivos y dirección vital",
      "Integración de sabiduría emocional con acción práctica"
    ],
    oportunidades_crecimiento: [
      "Liderazgo personal en áreas de tu experiencia", 
      "Expresión creativa de tu unicidad",
      "Servicio consciente desde tu autenticidad"
    ]
  };
}

function createAgendaFallback(
  natalInterpretation: any,
  progressedInterpretation: any,
  userProfile: UserProfile
): AgendaInterpretation {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  
  return {
    titulo: `TU REVOLUCIÓN CÓSMICA ${currentYear}-${nextYear}`,
    subtitulo: `Agenda Astrológica Personalizada para ${userProfile.name || 'Usuario'}`,
    intro_disruptiva: `${userProfile.name || 'Querido/a buscador/a'}, este es tu año de transformación personal profunda. A los ${userProfile.currentAge} años, has acumulado la sabiduría necesaria para dar el siguiente salto evolutivo. Cada momento cósmico te invita a crecer, evolucionar y brillar con tu luz auténtica.`,
    declaracion_activacion: "SOY UNA FUERZA CONSCIENTE DE TRANSFORMACIÓN POSITIVA EN EL MUNDO. MI CRECIMIENTO PERSONAL CONTRIBUYE AL DESPERTAR COLECTIVO.",
    meses: [
      // Generar 12 meses básicos
      ...Array.from({length: 12}, (_, i) => {
        const monthDate = new Date(currentYear, i);
        const monthName = monthDate.toLocaleString('es', { month: 'long' });
        return {
          mes: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${currentYear + (i > 8 ? 1 : 0)}`,
          tema_central: `Mes de ${getMonthTheme(i)}`,
          energia_dominante: getMonthEnergy(i),
          mantra_mensual: getMonthMantra(i),
          eventos_clave: [],
          accion_recomendada: `Enfócate en ${getMonthAction(i)}`,
          rituales: [getMonthRitual(i)],
          preparacion_antifragilidad: `Este mes, prepárate para ${getMonthPreparation(i)}`
        };
      })
    ],
    llamada_accion_final: "Acepta completamente tu poder transformador y créa conscientemente el cambio que deseas ver en tu vida y en el mundo.",
    mantra_anual: "CREZCO, EVOLUCIONO Y ME TRANSFORMO CONSCIENTEMENTE CON CADA EXPERIENCIA. SOY AGENTE DE MI PROPIA EVOLUCIÓN.",
    enfoque_antifragilidad: "Uso cada desafío como una oportunidad sagrada para volverme más fuerte, sabio y auténtico. Mi crecimiento es mi contribución al mundo."
  };
}

// Funciones auxiliares para fallback
function getMonthTheme(month: number): string {
  const themes = [
    'nuevos comienzos', 'purificación', 'renacimiento', 'crecimiento', 'expansión', 'integración',
    'reflexión', 'transformación', 'sabiduría', 'manifestación', 'gratitud', 'preparación'
  ];
  return themes[month] || 'crecimiento';
}

function getMonthEnergy(month: number): string {
  const energies = [
    'Iniciativa', 'Introspección', 'Renovación', 'Florecimiento', 'Abundancia', 'Equilibrio',
    'Reflexión', 'Metamorfosis', 'Expansión', 'Manifestación', 'Gratitud', 'Preparación'
  ];
  return energies[month] || 'Equilibrio';
}

function getMonthMantra(month: number): string {
  const mantras = [
    'ABRAZO LOS NUEVOS COMIENZOS CON CONFIANZA',
    'ME PURIFICO Y RENUEVO MI ENERGÍA',
    'RENAZCO A NUEVAS POSIBILIDADES',
    'CREZCO CON AMOR Y PACIENCIA',
    'ME EXPANDO HACIA MI MÁXIMO POTENCIAL',
    'INTEGRO MIS EXPERIENCIAS CON SABIDURÍA',
    'REFLEXIONO CON PROFUNDIDAD Y CLARIDAD',
    'ME TRANSFORMO CON GRACIA Y PODER',
    'COMPARTO MI SABIDURÍA CON EL MUNDO',
    'MANIFIESTO MIS SUEÑOS EN REALIDAD',
    'AGRADEZCO TODO MI CRECIMIENTO',
    'ME PREPARO PARA NUEVOS CICLOS'
  ];
  return mantras[month] || 'CREZCO CON AMOR Y SABIDURÍA';
}

function getMonthAction(month: number): string {
  const actions = [
    'establecer intenciones claras', 'limpiar y purificar', 'plantar nuevas semillas', 'nutrir tu crecimiento',
    'expandir tus horizontes', 'equilibrar todas las áreas', 'reflexionar profundamente', 'transformar patrones',
    'compartir tu sabiduría', 'materializar tus visiones', 'celebrar logros', 'preparar el futuro'
  ];
  return actions[month] || 'crecer conscientemente';
}

function getMonthRitual(month: number): string {
  const rituals = [
    'Escribir intenciones y quemarlas ceremonialmente',
    'Baño purificador con sal marina',
    'Plantar semillas reales o simbólicas',
    'Meditación en la naturaleza',
    'Crear un mapa de visión',
    'Ritual de equilibrio con los 4 elementos',
    'Journaling profundo y reflexivo',
    'Ceremonia de liberación de lo viejo',
    'Compartir conocimiento con otros',
    'Visualización creativa de manifestación',
    'Círculo de gratitud',
    'Preparación de altar para nuevo ciclo'
  ];
  return rituals[month] || 'Meditación consciente';
}

function getMonthPreparation(month: number): string {
  const preparations = [
    'cambios positivos en tu vida', 'limpiezas emocionales profundas', 'nuevas oportunidades',
    'crecimiento acelerado', 'expansión de conciencia', 'equilibrio en todas las áreas',
    'insights profundos', 'transformaciones mayores', 'oportunidades de enseñanza',
    'materialización de proyectos', 'celebraciones significativas', 'ciclos de renovación'
  ];
  return preparations[month] || 'crecimiento personal';
}

// 💡 FUNCIONES DE UTILIDAD CONSERVADAS

export function validateAssistantConfiguration(): {
  isConfigured: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (!process.env.OPENAI_API_KEY) {
    issues.push('❌ OPENAI_API_KEY no configurada');
    recommendations.push('Configurar OPENAI_API_KEY en variables de entorno');
  }

  if (!ASSISTANT_ID) {
    issues.push('❌ OPENAI_ASSISTANT_ID no definido');
    recommendations.push('Configurar OPENAI_ASSISTANT_ID en variables de entorno');
  }

  if (!OPENAI_PROJECT_ID) {
    issues.push('❌ OPENAI_PROJECT_ID no definido');
    recommendations.push('Configurar OPENAI_PROJECT_ID en variables de entorno');
  }

  const isConfigured = issues.length === 0;

  if (isConfigured) {
    console.log('✅ OpenAI Assistant correctamente configurado');
  } else {
    console.warn('⚠️ Problemas de configuración detectados:', issues);
  }

  return { isConfigured, issues, recommendations };
}

export function calculateInterpretationStats(events: AstrologicalEvent[]): {
  totalEvents: number;
  interpretedEvents: number;
  interpretationRate: number;
  eventTypes: Record<string, number>;
} {
  const totalEvents = events.length;
  const interpretedEvents = events.filter(e => e.personalInterpretation || e.aiInterpretation).length;
  const interpretationRate = totalEvents > 0 ? (interpretedEvents / totalEvents) * 100 : 0;

  const eventTypes: Record<string, number> = {};
  events.forEach(event => {
    eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
  });

  return {
    totalEvents,
    interpretedEvents,
    interpretationRate: Math.round(interpretationRate * 100) / 100,
    eventTypes
  };
}