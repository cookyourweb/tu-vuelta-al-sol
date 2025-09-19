// CORRECCIÓN ESPECÍFICA PARA TU ASSISTANT
// Reemplaza tu función generateAIInterpretation en src/app/api/astrology/interpret-natal/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define el tipo NatalInterpretation
export type NatalInterpretation = {
  personalidad_core: string;
  fortalezas_principales: string[];
  desafios_evolutivos: string[];
  proposito_vida: string;
  patron_energetico: string;
  casa_mas_activada: number;
  planeta_dominante: string;
};

// Configuración específica para TU Assistant
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no configurada');
  }

  if (!process.env.OPENAI_ASSISTANT_ID) {
    throw new Error('OPENAI_ASSISTANT_ID no configurado');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
    project: process.env.OPENAI_PROJECT_ID,
  });
}

// ✅ MÉTODO POST PARA EL ENDPOINT
export async function POST(request: NextRequest) {
  try {
    const { userId, natalChart, userProfile, regenerate = false } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId requerido'
      }, { status: 400 });
    }

    if (!natalChart) {
      return NextResponse.json({
        success: false,
        error: 'natalChart requerido'
      }, { status: 400 });
    }

    console.log('🌟 [INTERPRET-NATAL] Iniciando interpretación natal para:', userProfile?.name || 'Usuario');

    let interpretation;
    let method = 'fallback';

    try {
      interpretation = await generateAIInterpretation(natalChart, userProfile);
      method = 'openai_assistant';
      console.log('✅ [INTERPRET-NATAL] Interpretación IA generada exitosamente');
    } catch (assistantError) {
      console.error('❌ [INTERPRET-NATAL] Error con IA, usando fallback:', assistantError);
      interpretation = createNatalFallback(natalChart, userProfile);
      method = 'fallback_astrologico';
    }

    return NextResponse.json({
      success: true,
      data: {
        interpretation,
        cached: false,
        generatedAt: new Date().toISOString(),
        method
      }
    });

  } catch (error) {
    console.error('❌ [INTERPRET-NATAL] Error crítico:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor'
    }, { status: 500 });
  }
}

// ✅ MÉTODO GET PARA VERIFICAR STATUS
export async function GET() {
  return NextResponse.json({
    status: "✅ Endpoint de Interpretación Natal funcionando",
    assistant_id: process.env.OPENAI_ASSISTANT_ID,
    openai_configured: !!process.env.OPENAI_API_KEY,
    capabilities: [
      "Interpretación revolucionaria usando OpenAI Assistant",
      "Análisis de personalidad core",
      "Fortalezas principales y desafíos evolutivos",
      "Propósito de vida basado en configuración específica",
      "Patrón energético dominante",
      "Casa más activada y planeta dominante"
    ]
  });
}

export async function generateAIInterpretation(
  natalChart: any,
  userProfile: any
): Promise<NatalInterpretation> {
  console.log('🤖 [INTERPRET-NATAL] Usando TU Assistant específico');
  
  try {
    const openai = getOpenAIClient();

    // Prompt optimizado para TU estilo específico
    const prompt = buildYourSpecificPrompt(natalChart, userProfile);

    const thread = await openai.beta.threads.create({
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    console.log('✅ Thread creado:', thread.id);

    // Configuración específica para tu Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      temperature: 0.8, // Tu configuración preferida
      max_completion_tokens: 2000,
      // NO agregamos instructions aquí porque tu Assistant ya las tiene configuradas
    });

    console.log('🔄 Run iniciado con tu Assistant:', run.id);

    // Polling mejorado específico para tu caso
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
    let attempts = 0;
    const maxAttempts = 120; // 4 minutos para tu Assistant complejo

    while (
      (runStatus.status === 'in_progress' || runStatus.status === 'queued') &&
      attempts < maxAttempts
    ) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos entre checks
      runStatus = await openai.beta.threads.runs.retrieve(run.id, { thread_id: thread.id });
      attempts++;

      // Logging cada 30 segundos para no spam
      if (attempts % 15 === 0) {
        console.log(`🔄 Tu Assistant ejecutándose: ${runStatus.status} (${attempts * 2}s)`);
      }
    }

    console.log(`🏁 Tu Assistant finalizado: ${runStatus.status}`);

    // Manejo específico de respuestas
    if (runStatus.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      if (lastMessage.content[0].type === 'text') {
        const responseText = lastMessage.content[0].text.value;
        console.log('📝 Respuesta cruda de tu Assistant:', responseText.substring(0, 200) + '...');
        
        // Limpieza específica para tu Assistant
        const cleanResponse = cleanYourAssistantResponse(responseText);
        
        try {
          const parsedResponse = JSON.parse(cleanResponse);
          console.log('✅ Respuesta parseada exitosamente');
          return parsedResponse as NatalInterpretation;
        } catch (parseError) {
          console.error('❌ Error parseando JSON de tu Assistant:', parseError);
          console.log('🔧 Respuesta problemática:', cleanResponse);
          
          // Intento de extracción manual para tu formato
          return extractDataFromYourFormat(responseText, natalChart, userProfile);
        }
      }
    } else if (runStatus.status === 'failed') {
      console.error('❌ Tu Assistant falló. Detalles:', runStatus.last_error);
      
      if (runStatus.last_error) {
        console.error('Error específico:', runStatus.last_error.message);
        console.error('Código:', runStatus.last_error.code);
      }
      
      // Analizar por qué falló específicamente
      throw new Error(`Tu Assistant falló: ${runStatus.last_error?.message || 'Razón desconocida'}`);
    } else if (runStatus.status === 'expired') {
      console.error('❌ Tu Assistant expiró por timeout');
      throw new Error('Tu Assistant tardó demasiado en responder');
    } else {
      console.error('❌ Estado inesperado de tu Assistant:', runStatus.status);
      throw new Error(`Estado inesperado: ${runStatus.status}`);
    }

    throw new Error('No se pudo obtener respuesta de tu Assistant');

  } catch (error) {
    console.error('❌ Error completo con tu Assistant:', error);
    throw error; // Esto activará tu fallback
  }
}

// Función para construir prompt específico para TU estilo
function buildYourSpecificPrompt(natalChart: any, userProfile: any): string {
  const age = new Date().getFullYear() - new Date(userProfile.birthDate).getFullYear();
  
  return `
🌟 ANÁLISIS REVOLUCIONARIO CARTA NATAL - ${userProfile.name?.toUpperCase() || 'GUERRERO CÓSMICO'}

DATOS TRANSFORMADORES:
- Edad: ${age} años (momento perfecto para despertar)
- Lugar de poder: ${userProfile.birthPlace || 'Coordenadas cósmicas'}
- Fecha de activación: ${userProfile.birthDate || 'Momento estelar'}
- Hora de manifestación: ${userProfile.birthTime || 'Portal temporal'}

CONFIGURACIÓN ASTROLÓGICA ESPECÍFICA:
${formatChartForYourStyle(natalChart)}

MISIÓN REVOLUCIONARIA: 
Analiza esta configuración cósmica única y crea una interpretación que DESPIERTE el poder interno de ${userProfile.name || 'esta alma'}.

Usa tu estilo característico DISRUPTIVO y TRANSFORMADOR.

RESPONDE EN JSON VÁLIDO con este formato EXACTO:
{
  "personalidad_core": "Descripción ÉPICA de la personalidad core",
  "fortalezas_principales": ["fortaleza revolucionaria 1", "fortaleza cósmica 2", "superpoder 3"],
  "desafios_evolutivos": ["desafío transformador 1", "oportunidad de crecimiento 2"],
  "proposito_vida": "Propósito ÉPICO de vida basado en configuración específica",
  "patron_energetico": "Patrón energético dominante",
  "casa_mas_activada": ${findMostActivatedHouse(natalChart)},
  "planeta_dominante": "${findDominantPlanet(natalChart)}"
}

¡ACTIVA TU PODER REVOLUCIONARIO ASTROLÓGICO!
`;
}

// Limpieza específica para las respuestas de tu Assistant
function cleanYourAssistantResponse(responseText: string): string {
  let cleaned = responseText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^```/g, '')
    .replace(/```$/g, '')
    .trim();
  
  // Buscar JSON específicamente en tu formato
  const jsonMatch = cleaned.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  // Limpiar caracteres específicos que tu Assistant puede agregar
  cleaned = cleaned
    .replace(/🌟|✨|🎯|🔥|⚡/g, '') // Remover emojis si interfieren
    .replace(/\n\s*\n/g, '\n') // Limpiar espacios extra
    .trim();
  
  return cleaned;
}

// Extracción manual si el parsing falla
function extractDataFromYourFormat(responseText: string, natalChart: any, userProfile: any): NatalInterpretation {
  console.log('🔧 Intentando extracción manual del formato de tu Assistant');
  
  // Buscar patrones específicos en el texto de tu Assistant
  const extractField = (fieldName: string): string => {
    const patterns = [
      new RegExp(`"${fieldName}":\\s*"([^"]+)"`, 'i'),
      new RegExp(`${fieldName}[:\\s]+([^\\n]+)`, 'i'),
    ];
    
    for (const pattern of patterns) {
      const match = responseText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return '';
  };
  
  // Extraer array fields
  const extractArrayField = (fieldName: string): string[] => {
    const pattern = new RegExp(`"${fieldName}":\\s*\\[([^\\]]+)\\]`, 'i');
    const match = responseText.match(pattern);
    if (match && match[1]) {
      return match[1]
        .split(',')
        .map(item => item.replace(/"/g, '').trim())
        .filter(item => item.length > 0);
    }
    return [];
  };
  
  return {
    personalidad_core: extractField('personalidad_core') || 'Personalidad única y revolucionaria',
    fortalezas_principales: extractArrayField('fortalezas_principales') || ['Fuerza cósmica natural', 'Intuición desarrollada', 'Capacidad transformadora'],
    desafios_evolutivos: extractArrayField('desafios_evolutivos') || ['Integración de polaridades', 'Desarrollo de paciencia cósmica'],
    proposito_vida: extractField('proposito_vida') || 'Ser agente de transformación y despertar',
    patron_energetico: extractField('patron_energetico') || 'Energía revolucionaria y transformadora',
    casa_mas_activada: parseInt(extractField('casa_mas_activada')) || findMostActivatedHouse(natalChart),
    planeta_dominante: extractField('planeta_dominante') || findDominantPlanet(natalChart)
  };
}

// Formatear carta para tu estilo específico
function formatChartForYourStyle(chartData: any): string {
  let formatted = '';
  
  if (chartData.planets && Array.isArray(chartData.planets)) {
    formatted += '⚡ PLANETAS DE PODER:\n';
    chartData.planets.slice(0, 8).forEach((planet: any) => {
      if (planet.name && planet.sign && planet.house) {
        formatted += `- ${planet.name}: ${Math.round(planet.degree || 0)}° ${planet.sign} Casa ${planet.house} (ACTIVADO)\n`;
      }
    });
  }
  
  if (chartData.elementDistribution) {
    formatted += '\n🔥 DISTRIBUCIÓN ELEMENTAL:\n';
    Object.entries(chartData.elementDistribution).forEach(([element, percentage]) => {
      formatted += `- ${element.toUpperCase()}: ${percentage}% \n`;
    });
  }
  
  return formatted;
}

// Funciones helper para encontrar patrones dominantes
function findMostActivatedHouse(chartData: any): number {
  if (!chartData.planets) return 1;
  
  const houseCounts: { [key: number]: number } = {};
  chartData.planets.forEach((planet: any) => {
    if (planet.house) {
      houseCounts[planet.house] = (houseCounts[planet.house] || 0) + 1;
    }
  });
  
  const maxCount = Math.max(...Object.values(houseCounts));
  const mostActivated = Object.keys(houseCounts).find(
    house => houseCounts[parseInt(house)] === maxCount
  );
  
  return parseInt(mostActivated || '1');
}

function findDominantPlanet(chartData: any): string {
  if (!chartData.planets || chartData.planets.length === 0) return 'Sol';
  
  // Buscar Sol primero, luego Luna, luego Ascendente ruler
  const priorityOrder = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte'];
  
  for (const priority of priorityOrder) {
    const planet = chartData.planets.find((p: any) => 
      p.name?.toLowerCase() === priority.toLowerCase()
    );
    if (planet) return priority;
  }
  
  return chartData.planets[0]?.name || 'Sol';
}

// DIAGNÓSTICO ESPECÍFICO PARA TU ASSISTANT
export async function diagnoseYourAssistant() {
  try {
    const openai = getOpenAIClient();

    // Test básico de conexión
    console.log('🔍 Probando conexión con tu Assistant...');

    const assistant = await openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID!);
    console.log('✅ Assistant encontrado:', assistant.name);

    // Test de thread simple
    const testThread = await openai.beta.threads.create({
      messages: [{
        role: "user",
        content: "Test simple: responde solo con 'OK'"
      }]
    });

    const testRun = await openai.beta.threads.runs.create(testThread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      max_completion_tokens: 100
    });

    // Esperar resultado del test
    let status = await openai.beta.threads.runs.retrieve(testRun.id, { thread_id: testThread.id });
    let attempts = 0;

    while ((status.status === 'in_progress' || status.status === 'queued') && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      status = await openai.beta.threads.runs.retrieve(testRun.id, { thread_id: testThread.id });
      attempts++;
    }

    console.log('🏁 Test Assistant result:', status.status);

    if (status.status === 'completed') {
      console.log('✅ Tu Assistant funciona correctamente');
      return true;
    } else {
      console.log('❌ Tu Assistant tiene problemas:', status.last_error?.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Error diagnosticando tu Assistant:', error);
    return false;
  }
}

// FALLBACK ASTROLÓGICO PARA CARTA NATAL
function createNatalFallback(natalChart: any, userProfile: any): NatalInterpretation {
  console.log('📋 [FALLBACK] Generando interpretación astrológica básica');

  const sol = natalChart.planets?.find((p: any) => p.name === 'Sol') || natalChart.sol || { sign: 'Acuario', house: 1, degree: 21 };
  const luna = natalChart.planets?.find((p: any) => p.name === 'Luna') || natalChart.luna || { sign: 'Libra', house: 7, degree: 6 };
  const ascendente = natalChart.ascendant || { sign: 'Sagitario', degree: 15 };

  const personalidadCore = `Tu personalidad está marcada por la energía ${sol.sign} en Casa ${sol.house}, con una naturaleza emocional ${luna.sign} y un ascendente ${ascendente.sign}. Esta configuración indica una persona ${getPersonalityDescription(sol.sign, luna.sign)}.`;

  const fortalezas = [
    `Determinación ${sol.sign}: ${getStrengthDescription(sol.sign)}`,
    `Intuición ${luna.sign}: ${getEmotionalStrength(luna.sign)}`,
    `Adaptabilidad ${ascendente.sign}: ${getAscendantStrength(ascendente.sign)}`
  ];

  const desafios = [
    `Integración de polaridades: Equilibrar tu ${sol.sign} solar con tu ${luna.sign} lunar`,
    `Expresión auténtica: Usar tu ascendente ${ascendente.sign} para manifestar tu esencia ${sol.sign}`,
    `Crecimiento evolutivo: Desarrollar la madurez necesaria para tu configuración cósmica`
  ];

  const proposito = `Tu propósito de vida está conectado con ${getPurposeDescription(sol.sign, luna.sign, ascendente.sign)}. Tu configuración ${sol.sign}-${luna.sign}-${ascendente.sign} te posiciona como un agente de transformación que puede contribuir significativamente al despertar colectivo.`;

  return {
    personalidad_core: personalidadCore,
    fortalezas_principales: fortalezas,
    desafios_evolutivos: desafios,
    proposito_vida: proposito,
    patron_energetico: `Energía ${sol.sign} con influencia ${luna.sign} y expresión ${ascendente.sign}`,
    casa_mas_activada: sol.house,
    planeta_dominante: 'Sol'
  };
}

// FUNCIONES AUXILIARES PARA FALLBACK
function getPersonalityDescription(sunSign: string, moonSign: string): string {
  const descriptions: { [key: string]: string } = {
    'Acuario-Libra': 'innovadora y equilibrada, con fuerte sentido de justicia y creatividad',
    'Acuario-Escorpio': 'intensa y visionaria, con profunda capacidad transformadora',
    'Acuario-Sagitario': 'libre y filosófica, con visión amplia del mundo',
    'default': 'única y especial, con cualidades distintivas que te hacen destacar'
  };

  const key = `${sunSign}-${moonSign}`;
  return descriptions[key] || descriptions.default;
}

function getStrengthDescription(sign: string): string {
  const strengths: { [key: string]: string } = {
    'Acuario': 'Capacidad innovadora y pensamiento revolucionario',
    'Leo': 'Liderazgo natural y creatividad expresiva',
    'Sagitario': 'Visión amplia y optimismo contagioso',
    'default': 'Fortaleza innata y capacidad única'
  };
  return strengths[sign] || strengths.default;
}

function getEmotionalStrength(sign: string): string {
  const strengths: { [key: string]: string } = {
    'Libra': 'Capacidad para crear armonía y relaciones equilibradas',
    'Escorpio': 'Profundidad emocional y capacidad transformadora',
    'Sagitario': 'Optimismo y capacidad para ver el lado positivo',
    'default': 'Intuición desarrollada y sensibilidad emocional'
  };
  return strengths[sign] || strengths.default;
}

function getAscendantStrength(sign: string): string {
  const strengths: { [key: string]: string } = {
    'Sagitario': 'Capacidad para inspirar y motivar a otros',
    'Capricornio': 'Disciplina y capacidad para lograr objetivos',
    'Acuario': 'Originalidad y pensamiento independiente',
    'default': 'Adaptabilidad y capacidad de respuesta'
  };
  return strengths[sign] || strengths.default;
}

function getPurposeDescription(sun: string, moon: string, asc: string): string {
  if (sun === 'Acuario' && moon === 'Libra') {
    return 'la transformación social a través de relaciones armoniosas y justicia colectiva';
  }
  if (sun === 'Acuario') {
    return 'la innovación y el avance de la conciencia colectiva';
  }
  return 'el crecimiento personal y la contribución a la evolución humana';
}
