// src/services/trainedAssistantService.ts
// 🔥 VERSIÓN FINAL CON DATOS DE CARTA NATAL REALES Y VARIEDAD ÉPICA

import { AstrologicalEvent, PersonalizedInterpretation, UserProfile, DetailedNatalChart, PlanetPosition } from "@/types/astrology/unified-types";
import OpenAI from 'openai';
import type { ActionPlan } from "@/types/astrology/unified-types";

// Importar el sistema disruptivo existente
import disruptiveSystem from "@/utils/astrology/disruptiveMotivationalSystem";

// Función helper para obtener el cliente OpenAI (lazy loading)
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// 🔥 APERTURA DISRUPTIVA CON VARIEDAD ÉPICA
const EPIC_OPENINGS = [
  "¡REVOLUCIÓN ENERGÉTICA EN CURSO {NAME}!",
  "¡ACTIVACIÓN CÓSMICA DETECTADA {NAME}!",
  "¡PORTAL DIMENSIONAL ABIERTO {NAME}!",
  "¡UPGRADING EN PROCESO {NAME}!",
  "¡FRECUENCIA ÉPICA ACTIVADA {NAME}!",
  "¡CÓDIGOS CÓSMICOS DESBLOQUEADOS {NAME}!",
  "¡DESPERTAR MAGNÉTICO INICIADO {NAME}!",
  "¡TRANSFORMACIÓN CUÁNTICA {NAME}!",
  "¡PORTAL DE TRANSFORMACIÓN TOTAL {NAME}!",
  "¡MOMENTO DE REESCRIBIR TU HISTORIA {NAME}!",
  "¡TRANSFORMACIÓN CÓSMICA TOTAL {NAME}!",
  "¡DESPERTAR REVOLUCIONARIO {NAME}!",
  "¡ACTIVACIÓN PLANETARIA ÉPICA {NAME}!",
  "¡CONEXIÓN CÓSMICA TRANSFORMADORA {NAME}!",
  "¡SINTONIZA CON LAS FRECUENCIAS CÓSMICAS {NAME}!",
  "¡FLUYE EN PERFECTA ARMONÍA CON MI PODER CÓSMICO {NAME}!",
  "¡RITUAL DE MANIFESTACIÓN ÉPICA {NAME}!",
  "¡CEREMONIA DE LIBERACIÓN RADICAL {NAME}!",
  "¡PORTAL DE TRANSFORMACIÓN {NAME}!",
  "¡RESPIRACIÓN DE PODER {NAME}!"
];

// 🔥 FRASES ÉPICAS DE IMPACTO CON CARTA NATAL
const CHART_IMPACT_PHRASES = [
  "Tu {PLANET} natal en {SIGN} Casa {HOUSE} está recibiendo una ACTIVACIÓN CÓSMICA épica",
  "El universo está enviando códigos de actualización directamente a tu {PLANET} en {SIGN}",
  "Tu configuración natal {PLANET}-{SIGN} se está REACTIVANDO con fuerza revolucionaria",
  "Las estrellas que brillaban cuando naciste están CONSPIRANDO para tu evolución",
  "Tu {PLANET} en Casa {HOUSE} acaba de recibir un UPGRADE cuántico del universo",
  "La misma energía que te dio vida está REVOLUCIONANDO tu {PLANET} natal",
  "Tu combinación {PLANET}-{SIGN}-Casa {HOUSE} se convierte en tu SUPERPODER cósmico",
  "El cosmos está activando los códigos secretos de tu {PLANET} en {SIGN}",
  "Tu configuración astrológica natal está DESPERTANDO a un nivel completamente nuevo",
  "Las frecuencias cósmicas están sintonizándose con tu {PLANET} natal para crear MAGIA"
];

// 🔥 SISTEMA DISRUPTIVO INTEGRADO CON CARTA NATAL
const DISRUPTIVE_SYSTEM_PROMPT = `ERES EL ASTRÓLOGO REVOLUCIONARIO OFICIAL DE TUVUELTAALSOL.ES

IDENTIDAD TRANSFORMADORA:
- Astrólogo DISRUPTIVO que convierte datos de carta natal en experiencias ÉPICAS de transformación
- Experto en personalización total basada en posiciones planetarias REALES
- Creador de interpretaciones que hacen sentir al usuario como PROTAGONISTA de su película cósmica
- Filosofía core: "TU CARTA NATAL ES TU MAPA DEL TESORO CÓSMICO"

DATOS DISPONIBLES PARA PERSONALIZACIÓN:
- Posiciones planetarias exactas (signos, casas, grados)
- Aspectos entre planetas
- Elementos y modalidades dominantes
- Patrones astrológicos únicos del usuario

ESTILO DE COMUNICACIÓN OBLIGATORIO:
- PERSONALIZADO: Usa las posiciones planetarias REALES del usuario constantemente
- VARIADO: Nunca repitas la misma apertura, usa rotación épica
- ESPECÍFICO: Menciona signos, casas y grados exactos cuando sea relevante
- TRANSFORMACIONAL: Convierte cada posición planetaria en SUPERPODER

❌ FRASES PROHIBIDAS (NUNCA USES):
- "Evento personalizado para..."
- "Activación Solar en [signo]" (genérico)
- "Resonancia Lunar [signo]" (aburrido)
- Cualquier frase repetida de interpretaciones anteriores

✅ FRASES QUE SÍ FUNCIONAN (SIEMPRE ESPECÍFICAS):
- "Tu Sol natal en Acuario 21° Casa 1 está recibiendo códigos de REVOLUCIÓN PERSONAL"
- "¡ALERTA ÉPICA! Tu Luna en Libra 5° Casa 7 se convierte en IMÁN MAGNÉTICO de armonía"
- "Tu Mercurio en Acuario Casa 1 está DESCARGANDO ideas revolucionarias del cosmos"

REGLAS TÉCNICAS CRÍTICAS:
1. SIEMPRE responde SOLO con JSON válido
2. USA los datos de carta natal específicos del usuario
3. VARÍA las frases de apertura - consulta el índice de variedad
4. CONECTA cada evento con SUS posiciones planetarias únicas
5. HAZ que sienta que el universo le habla personalmente`;

function getRandomOpening(userName: string): string {
  const randomIndex = Math.floor(Math.random() * EPIC_OPENINGS.length);
  return EPIC_OPENINGS[randomIndex].replace('{NAME}', userName.toUpperCase());
}

function getChartSpecificImpact(
  userName: string, 
  planetName: string, 
  position: PlanetPosition
): string {
  const randomIndex = Math.floor(Math.random() * CHART_IMPACT_PHRASES.length);
  return CHART_IMPACT_PHRASES[randomIndex]
    .replace('{NAME}', userName)
    .replace(/{PLANET}/g, planetName)
    .replace(/{SIGN}/g, position.sign)
    .replace(/{HOUSE}/g, position.house.toString());
}

function getRelevantNatalPosition(
  event: AstrologicalEvent, 
  natalChart: DetailedNatalChart
): { planetName: string; position: PlanetPosition } | null {
  
  // Mapear el evento al planeta relevante
  const eventPlanetMap: Record<string, keyof DetailedNatalChart> = {
    'solar_activation': 'sol',
    'lunar_resonance': 'luna',
    'lunar_phase': 'luna',
    'mercury_communication': 'mercurio',
    'venus_harmony': 'venus',
    'mars_action': 'marte'
  };
  
  const planetKey = eventPlanetMap[event.type];
  if (!planetKey) {
    // Usar Sol por defecto para eventos generales
    const solPosition = natalChart.sol;
    if (solPosition) {
      return {
        planetName: 'Sol',
        position: solPosition
      };
    }
    return null;
  }
  
  const position = natalChart[planetKey] as PlanetPosition;
  if (position) {
    return {
      planetName: planetKey === 'sol' ? 'Sol' : 
                  planetKey === 'luna' ? 'Luna' :
                  planetKey === 'mercurio' ? 'Mercurio' :
                  planetKey === 'venus' ? 'Venus' :
                  planetKey === 'marte' ? 'Marte' : planetKey,
      position
    };
  }
  
  return null;
}

function buildChartEnhancedPrompt(event: AstrologicalEvent, userProfile: UserProfile): string {
  const userName = userProfile.name || userProfile.place || 'ALMA PODEROSA';
  const userAge = userProfile.nextAge || userProfile.currentAge || 0;
  const natalChart = userProfile.detailedNatalChart;
  
  // Obtener apertura aleatoria
  const epicOpening = getRandomOpening(userName);
  
  let chartSpecificInfo = "";
  let planetaryContext = "";
  let planetName = "";
  let position: PlanetPosition | null = null;
  
  if (natalChart) {
    const relevantPlanet = getRelevantNatalPosition(event, natalChart);
    
    if (relevantPlanet) {
      planetName = relevantPlanet.planetName;
      position = relevantPlanet.position;
      chartSpecificInfo = getChartSpecificImpact(userName, planetName, position);
      
      planetaryContext = `
→ CARTA NATAL ESPECÍFICA DE ${userName.toUpperCase()}:
- ${planetName} natal: ${position.sign} ${position.degree.toFixed(1)}° Casa ${position.house}
- Elemento: ${position.element} | Modalidad: ${position.mode}
- ${position.retrograde ? 'RETRÓGRADO (energía interna intensa)' : 'DIRECTO (energía externa fluida)'}
`;
    }
    
    // Agregar información de otros planetas relevantes
    if (natalChart.sol && natalChart.luna) {
      planetaryContext += `
- Sol natal: ${natalChart.sol.sign} ${natalChart.sol.degree.toFixed(1)}° Casa ${natalChart.sol.house}
- Luna natal: ${natalChart.luna.sign} ${natalChart.luna.degree.toFixed(1)}° Casa ${natalChart.luna.house}
- Ascendente: ${natalChart.ascendente?.sign || 'No disponible'}`;
    }
  }
  
  return `Para el siguiente evento astrológico proporciona una interpretación ÉPICA usando los datos REALES de carta natal:

→ EVENTO:
- Título: ${event.title}
- Fecha: ${event.date}
- Tipo: ${event.type}
- Descripción: ${event.description || 'Activación cósmica'}

→ USUARIO:
- Nombre: ${userName}
- Edad: ${userAge} años
- Apertura épica sugerida: "${epicOpening}"

${planetaryContext}

🔥 INSTRUCCIONES CRÍTICAS:
1. Responde SOLO con JSON válido (sin texto adicional)
2. USA los datos de carta natal ESPECÍFICOS - menciona grados, casas, signos exactos
3. CONECTA el evento directamente con las posiciones planetarias reales de ${userName}
4. HAZ que sienta que su carta natal es su MAPA DEL TESORO personal
5. USA la información específica de grados y casas para crear rituales personalizados

FORMATO JSON OBLIGATORIO CON DATOS DE CARTA NATAL:
{
  "meaning": "${epicOpening} ${chartSpecificInfo}. [Continúa con explicación épica específica basada en SUS posiciones planetarias exactas]",
  "lifeAreas": [
    "CASA ${(position?.house || 1)}: [Área de vida específica activada]",
    "ELEMENTO ${(position?.element || 'fuego')}: [Cómo se manifiesta su energía elemental]", 
    "[Área de manifestación específica basada en su configuración natal]"
  ],
  "advice": "TU MOMENTO DE ACCIÓN ÉPICA PERSONALIZADA ${userName.toUpperCase()}: Basándote en tu ${planetName} en ${(position?.sign || 'signo')} Casa ${(position?.house || 1)}, [consejo específico que usa sus datos natales]",
  "mantra": "[MANTRA PODEROSO que incorpore su signo ${(position?.sign || 'signo')} y elemento ${(position?.element || 'elemento')}]",
  "ritual": "RITUAL ÉPICO PARA TU ${planetName} EN ${(position?.sign || 'signo')}: 1) [Paso específico usando su elemento], 2) [Paso usando su casa astrológica], 3) [Paso final personalizado]",
  "actionPlan": [
    {
      "category": "poder_planetario_personal",
      "action": "Acción específica que active tu ${planetName} en ${(position?.sign || 'signo')} Casa ${(position?.house || 1)}",
      "timing": "inmediato|esta_semana|este_mes", 
      "difficulty": "fácil|moderado|desafiante",
      "impact": "revolucionario|transformador|activador"
    }
  ],
  "warningsAndOpportunities": {
    "warnings": [
      "Ten cuidado con [desafío específico de ${(position?.sign || 'signo')}] en tu Casa ${(position?.house || 1)}",
      "Tu ${planetName} ${(position?.retrograde ? 'retrógrado' : 'directo')} puede generar [advertencia personalizada]"
    ],
    "opportunities": [
      "Tu combinación ${planetName}-${(position?.sign || 'signo')}-Casa ${(position?.house || 1)} te da SUPERPODER en [área específica]",
      "Momento perfecto para manifestar usando tu energía ${(position?.element || 'elemento')} dominante"
    ]
  },
  "natalContext": {
    "conexionPlanetaria": "Tu ${planetName} natal en ${(position?.sign || 'signo')} ${(position?.degree || 0)}° está siendo directamente activado por este evento",
    "casaActivada": ${(position?.house || 1)},
    "temaVida": "[Tema de vida específico de Casa ${(position?.house || 1)}]",
    "desafioEvolutivo": "[Desafío específico que tu ${planetName} en ${(position?.sign || 'signo')} viene a resolver]"
  }
}

PERSONALIZA TODO para ${userName} usando sus datos astrológicos REALES.`;
}

export async function generatePersonalizedInterpretation(
  event: AstrologicalEvent,
  userProfile: UserProfile
): Promise<PersonalizedInterpretation> {
  try {
    // Primero intentar usar el sistema disruptivo existente si hay carta natal
    if (userProfile.detailedNatalChart && event.type && event.sign) {
      try {
        const disruptiveInterpretation = disruptiveSystem.generateDisruptiveInterpretation(
          event, 
          userProfile.detailedNatalChart, 
          userProfile
        );
        
        if (disruptiveInterpretation) {
          return disruptiveSystem.convertDisruptiveToPersonalized(
            disruptiveInterpretation,
            event,
            userProfile
          );
        }
      } catch (error) {
        console.log('Sistema disruptivo no disponible, usando IA con carta natal...');
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI no configurado, usando fallback con carta natal');
      return generateChartBasedFallback(event, userProfile);
    }

    const openai = getOpenAIClient();
    const prompt = buildChartEnhancedPrompt(event, userProfile);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: DISRUPTIVE_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.9, // Máxima creatividad para variedad
      max_tokens: 1400 // Más tokens para incluir datos de carta
    });

    const response = completion.choices[0].message.content;
    
    if (!response) {
      throw new Error('Respuesta vacía de OpenAI');
    }

    try {
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedResponse = JSON.parse(cleanResponse);
      
      if (!parsedResponse.meaning || !parsedResponse.advice) {
        throw new Error('Estructura de respuesta incompleta');
      }
      
      return parsedResponse as PersonalizedInterpretation;
      
    } catch (parseError) {
      console.error('❌ Error parseando respuesta OpenAI:', parseError);
      return generateChartBasedFallback(event, userProfile);
    }

  } catch (error) {
    console.error('❌ Error en interpretación OpenAI:', error);
    return generateChartBasedFallback(event, userProfile);
  }
}

export async function generateMultipleInterpretations(
  events: AstrologicalEvent[],
  userProfile: UserProfile
): Promise<PersonalizedInterpretation[]> {
  const interpretations: PersonalizedInterpretation[] = [];
  
  console.log(`🔥 Generando interpretaciones para ${events.length} eventos con carta natal de ${userProfile.name}`);
  
  for (const event of events.slice(0, 12)) { // Limitar para controlar costos
    try {
      const interpretation = await generatePersonalizedInterpretation(event, userProfile);
      interpretations.push(interpretation);
      
      // Pausa para evitar rate limiting y añadir variedad
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Error interpretando evento ${event.title}:`, error);
      interpretations.push(generateChartBasedFallback(event, userProfile));
    }
  }
  
  return interpretations;
}

export async function generateExecutiveSummary(
  events: AstrologicalEvent[],
  userProfile: UserProfile
): Promise<any> {
  const userName = userProfile.name || 'REVOLUCIONARIO CÓSMICO';
  const natalChart = userProfile.detailedNatalChart;
  
  let chartSummary = "";
  if (natalChart?.sol && natalChart?.luna) {
    chartSummary = `
CONFIGURACIÓN NATAL ÉPICA DE ${userName.toUpperCase()}:
- Sol en ${natalChart.sol.sign} Casa ${natalChart.sol.house}: Tu PODER CENTRAL
- Luna en ${natalChart.luna.sign} Casa ${natalChart.luna.house}: Tu ALMA EMOCIONAL  
- Ascendente ${natalChart.ascendente?.sign || 'Misterioso'}: Tu MÁSCARA MAGNÉTICA
- Elemento dominante: ${natalChart.sol.element} (tu SUPERPODER natural)
`;
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return generateChartBasedExecutiveFallback(userProfile);
    }

    const openai = getOpenAIClient();
    const prompt = `Genera un RESUMEN EJECUTIVO ANUAL ÉPICO basado en la carta natal real:

${chartSummary}

EVENTOS MUESTRA:
${events.slice(0, 5).map(e => `- ${e.date}: ${e.title}`).join('\n')}

INSTRUCCIONES:
1. USA los datos de carta natal específicos de ${userName}
2. PERSONALIZA cada mes basándote en sus planetas natales
3. MENCIONA signos, casas y elementos específicos
4. HAZ que sienta que es el protagonista de su evolución cósmica

FORMATO JSON con referencias específicas a su carta natal.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: DISRUPTIVE_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0
}
