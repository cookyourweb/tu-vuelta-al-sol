// src/app/api/astrology/complete-events/route.ts
// 🌟 ENDPOINT COMPLETO CON Y SIN OPENAI

import { NextRequest, NextResponse } from 'next/server';
import { checkUserDataCompleteness } from '@/services/userDataService';
import { getAstrologicalEvents } from '@/services/astrologicalEventsService';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Chart from '@/models/Chart';

// Inicializar OpenAI (solo si hay API key)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { birthData: providedBirthData, userId, forceRegenerate = false } = await request.json();
    
    console.log('🚀 Iniciando generación de agenda completa...');
    
    let birthData = providedBirthData;
    
    // 🔍 SI NO SE PROPORCIONAN DATOS DE NACIMIENTO, OBTENERLOS DEL USUARIO
    if (!birthData && userId) {
      console.log('🔍 Obteniendo datos de nacimiento del usuario...');
      
      const userDataCheck = await checkUserDataCompleteness(userId);
      
      if (!userDataCheck.hasRequiredData) {
        console.log('❌ Datos incompletos:', userDataCheck.missingData);
        return NextResponse.json({
          success: false,
          error: 'Datos de nacimiento incompletos',
          missingData: userDataCheck.missingData,
          action: 'redirect_to_birth_data',
          message: 'Necesitas configurar tus datos de nacimiento primero'
        }, { status: 400 });
      }
      
      birthData = userDataCheck.birthData;
      console.log('✅ Datos de nacimiento obtenidos del usuario');
    }
    
    // 🔍 VALIDAR QUE TENEMOS LOS DATOS MÍNIMOS
    if (!birthData || birthData === null || !birthData.date || !birthData.latitude || !birthData.longitude) {
      console.log('❌ Datos de nacimiento insuficientes:', birthData);
      return NextResponse.json({
        success: false,
        error: 'Datos de nacimiento requeridos',
        requiredFields: ['date', 'time', 'location', 'latitude', 'longitude'],
        action: 'provide_birth_data',
        receivedData: birthData
      }, { status: 400 });
    }

    console.log('✅ Datos validados, generando eventos...');

    // 📅 GENERAR EVENTOS ASTROLÓGICOS BÁSICOS
    console.log('📅 Generando eventos astrológicos...');
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    let events = [];
    try {
      events = await generateAstrologicalEvents(
        birthData.date,
        birthData.time,
        birthData.latitude,
        birthData.longitude,
        currentYear,
        nextYear
      );
      console.log(`✅ ${events.length} eventos astrológicos generados`);
    } catch (eventsError) {
      console.error('❌ Error generando eventos:', eventsError);
      return NextResponse.json({
        success: false,
        error: 'Error generando eventos astrológicos',
        details: eventsError instanceof Error ? eventsError.message : 'Error desconocido'
      }, { status: 500 });
    }
    
    // 🎯 PREPARAR PERFIL DE USUARIO
    const userProfile = {
      birthDate: birthData.date,
      birthTime: birthData.time,
      place: birthData.location,
      nextAge: calculateAge(birthData.date) + 1,
      currentAge: calculateAge(birthData.date),
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone || 'UTC',
      coordinates: {
        latitude: birthData.latitude,
        longitude: birthData.longitude
      }
    };
    
    console.log('✅ Perfil de usuario preparado:', {
      place: userProfile.place,
      currentAge: userProfile.currentAge,
      nextAge: userProfile.nextAge
    });
    
    // 🤖 INTERPRETACIÓN IA (SI HAY CRÉDITO DE OPENAI)
    let interpretedEvents = [...events];
    let aiInterpretationUsed = false;
    
    if (openai && events.length > 0) {
      console.log('🤖 OpenAI disponible - iniciando interpretación IA...');
      
      try {
        // Obtener carta natal para interpretación personalizada
        await connectDB();
        const chartData = await Chart.findOne({ userId });
        
        const highPriorityEvents = events.filter(e => e.priority === 'high').slice(0, 5);
        const mediumPriorityEvents = events.filter(e => e.priority === 'medium').slice(0, 3);
        const eventsToInterpret = [...highPriorityEvents, ...mediumPriorityEvents];
        
        if (eventsToInterpret.length > 0) {
          console.log(`🔮 Interpretando ${eventsToInterpret.length} eventos con IA...`);
          
          const interpretationPrompt = createInterpretationPrompt(eventsToInterpret, userProfile, chartData);
          
          const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
              {
                role: "system",
                content: "Eres un astrólogo experto que interpreta eventos astrológicos reales para personas específicas basándote en su carta natal. Responde SOLO con JSON válido."
              },
              {
                role: "user",
                content: interpretationPrompt
              }
            ],
            temperature: 0.7,
            max_tokens: 4000
          });

          const interpretationResponse = completion.choices[0].message.content;
          
          try {
            // Limpiar respuesta y parsear JSON
            const cleanResponse = interpretationResponse
              ?.replace(/```json\n?/g, "")
              .replace(/```\n?/g, "")
              .trim();
            
            const interpretations = JSON.parse(cleanResponse || '[]');
            
            // Aplicar interpretaciones IA a los eventos
            interpretedEvents = events.map((event: any) => {
              const aiInterpretation = interpretations.find((interp: any) => interp.id === event.id);
              
              return {
                ...event,
                aiInterpretation: aiInterpretation?.personalInterpretation || generateBasicInterpretation(event),
                hasAiInterpretation: !!aiInterpretation
              };
            });
            
            aiInterpretationUsed = true;
            console.log(`✅ ${interpretations.length} eventos interpretados con IA avanzada`);
            
          } catch (parseError) {
            console.error('⚠️ Error parseando interpretaciones IA:', parseError);
            // Continuar con interpretaciones básicas
            interpretedEvents = events.map((event: any) => ({
              ...event,
              aiInterpretation: generateBasicInterpretation(event),
              hasAiInterpretation: false
            }));
          }
        }
        
      } catch (aiError) {
        console.error('⚠️ Error en interpretación IA:', aiError);
        
        // Si hay error de cuota, marcar específicamente
        const isQuotaError = aiError instanceof Error && aiError.message.includes('rate_limit_exceeded');
        
        console.log(isQuotaError ? '💳 Cuota de OpenAI excedida' : '🔧 Error técnico en IA');
        
        // Continuar con interpretaciones básicas
        interpretedEvents = events.map((event: any) => ({
          ...event,
          aiInterpretation: generateBasicInterpretation(event),
          hasAiInterpretation: false,
          aiError: isQuotaError ? 'quota_exceeded' : 'technical_error'
        }));
      }
    } else {
      console.log('⚠️ OpenAI no disponible - usando interpretaciones básicas...');
      
      // Sin OpenAI, usar interpretaciones básicas
      interpretedEvents = events.map((event: any) => ({
        ...event,
        aiInterpretation: generateBasicInterpretation(event),
        hasAiInterpretation: false
      }));
    }
    
    // 📊 GENERAR RESUMEN EJECUTIVO
    console.log('📊 Generando resumen ejecutivo...');
    let executiveSummary;
    
    if (openai && aiInterpretationUsed) {
      try {
        // Resumen ejecutivo con IA
        executiveSummary = await generateAIExecutiveSummary(interpretedEvents.slice(0, 10), userProfile);
        console.log('✅ Resumen ejecutivo generado con IA');
      } catch (summaryError) {
        console.error('⚠️ Error generando resumen IA:', summaryError);
        executiveSummary = generateSimpleExecutiveSummary(interpretedEvents, userProfile);
      }
    } else {
      // Resumen ejecutivo simple
      executiveSummary = generateSimpleExecutiveSummary(interpretedEvents, userProfile);
      console.log('✅ Resumen ejecutivo generado (versión simple)');
    }
    
    // 📈 CALCULAR ESTADÍSTICAS
    const categories = [...new Set(interpretedEvents.map((e: any) => e.category || e.type))];
    const stats = {
      totalEvents: interpretedEvents.length,
      highPriorityEvents: interpretedEvents.filter((e: any) => e.priority === 'high').length,
      mediumPriorityEvents: interpretedEvents.filter((e: any) => e.priority === 'medium').length,
      lowPriorityEvents: interpretedEvents.filter((e: any) => e.priority === 'low').length,
      withAiInterpretation: interpretedEvents.filter((e: any) => e.hasAiInterpretation).length,
      lunarPhases: interpretedEvents.filter((e: any) => e.type && e.type.includes('luna')).length,
      eclipses: interpretedEvents.filter((e: any) => e.type === 'eclipse').length,
      retrogrades: interpretedEvents.filter((e: any) => e.type === 'retrogrado').length,
      aspects: interpretedEvents.filter((e: any) => e.type === 'aspecto').length,
      planetaryTransits: interpretedEvents.filter((e: any) => e.type === 'transito').length,
      directMotions: interpretedEvents.filter((e: any) => e.type === 'directo').length,
      seasonal: interpretedEvents.filter((e: any) => e.type === 'seasonal').length
    };
    
    // 🎯 ESTRUCTURA FINAL DE LA AGENDA
    const completeAgenda = {
      userProfile,
      events: interpretedEvents,
      executiveSummary,
      statistics: stats,
      metadata: {
        generatedAt: new Date().toISOString(),
        generationTimeMs: Date.now() - startTime,
        version: aiInterpretationUsed ? '2.0-ai' : '1.1-basic',
        aiInterpretationUsed,
        openaiAvailable: !!openai,
        cacheEnabled: false,
        totalCategories: categories.length
      }
    };
    
    const totalTime = Date.now() - startTime;
    console.log(`🌟 Agenda completa generada: ${stats.totalEvents} eventos en ${totalTime}ms`);
    console.log(`🤖 IA utilizada: ${aiInterpretationUsed ? 'SÍ' : 'NO'}`);
    
    return NextResponse.json({
      success: true,
      data: completeAgenda,
      metadata: {
        fromCache: false,
        generationTimeMs: totalTime,
        processingStages: {
          eventsGenerated: events.length,
          aiInterpretations: stats.withAiInterpretation,
          executiveSummaryGenerated: !!executiveSummary,
          cacheAttempted: false,
          performanceOptimal: totalTime < 60000
        },
        aiStatus: aiInterpretationUsed ? 'active' : 'not_available',
        nextSteps: aiInterpretationUsed ? 'Agenda completa con IA' : 'Agregar crédito OpenAI para interpretaciones avanzadas'
      }
    });
    
  } catch (error) {
    console.error('❌ Error en complete-events:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error generando agenda',
      details: error instanceof Error ? error.stack : 'Error desconocido',
      metadata: {
        fromCache: false,
        generationTimeMs: Date.now() - startTime,
        stage: 'generation_failed'
      }
    }, { status: 500 });
  }
}

// ==========================================
// 🔧 FUNCIONES AUXILIARES
// ==========================================

function calculateAge(date: string): number {
  const birthDate = new Date(date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function generateBasicInterpretation(event: any) {
  return {
    personalImpact: `Este evento ${event.title} influirá en tu desarrollo personal.`,
    practicalAdvice: `Aprovecha la energía de ${event.type} para tu crecimiento.`,
    spiritualGuidance: `Conecta con las energías cósmicas de este período.`,
    mantra: `Estoy en armonía con el cosmos.`,
    priority: event.priority || 'medium'
  };
}

function createInterpretationPrompt(events: any[], userProfile: any, chartData: any) {
  return `
Interpreta estos eventos astrológicos para una persona específica:

PERFIL DEL USUARIO:
- Edad: ${userProfile.currentAge} años
- Lugar: ${userProfile.place}
- Fecha de nacimiento: ${userProfile.birthDate}

CARTA NATAL:
${chartData ? JSON.stringify(chartData.natalChart, null, 2) : 'No disponible'}

EVENTOS A INTERPRETAR:
${JSON.stringify(events, null, 2)}

INSTRUCCIONES:
1. Analiza cada evento considerando la carta natal específica
2. Proporciona interpretaciones personalizadas, no genéricas
3. Incluye consejos prácticos y específicos
4. Mantén un tono motivador pero realista

FORMATO DE RESPUESTA:
Responde SOLO con un array JSON:
[
  {
    "id": "id_del_evento",
    "personalInterpretation": {
      "personalImpact": "Cómo afecta específicamente basado en su carta natal",
      "practicalAdvice": "Consejo práctico específico",
      "spiritualGuidance": "Guía espiritual personalizada",
      "mantra": "Mantra personalizado",
      "ritual": "Ritual recomendado (opcional)",
      "opportunity": "Oportunidad específica (opcional)"
    }
  }
]
`;
}

async function generateAIExecutiveSummary(events: any[], userProfile: any) {
  if (!openai) return generateSimpleExecutiveSummary(events, userProfile);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo experto que crea resúmenes ejecutivos personalizados. Responde solo con JSON válido."
        },
        {
          role: "user",
          content: `
Crea un resumen ejecutivo astrológico para:
USUARIO: ${userProfile.place}, ${userProfile.currentAge} años
EVENTOS: ${JSON.stringify(events.slice(0, 5), null, 2)}

Formato JSON:
{
  "monthlyHighlights": ["4 destacados mensuales"],
  "quarterlyFocus": ["4 enfoques trimestrales"],  
  "yearlyThemes": ["3 temas anuales"],
  "priorityActions": [
    {
      "category": "categoria",
      "action": "acción específica",
      "timing": "cuándo",
      "impact": "impacto esperado"
    }
  ]
}
`
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    const cleanResponse = response?.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleanResponse || '{}');
    
  } catch (error) {
    console.error('Error en resumen IA:', error);
    return generateSimpleExecutiveSummary(events, userProfile);
  }
}

function generateSimpleExecutiveSummary(events: any[], userProfile: any) {
  return {
    monthlyHighlights: [
      'Ene-Mar: TEMPORADA DE DESPERTAR CÓSMICO - ¡Activa tu poder interior!',
      'Abr-Jun: PORTAL DE MANIFESTACIÓN RADICAL - ¡Momento de crear tu nueva realidad!',
      'Jul-Sep: REVOLUCIÓN INTERIOR TOTAL - ¡Rompe todos los patrones limitantes!',
      'Oct-Dic: INTEGRACIÓN Y PODER MÁXIMO - ¡Vive tu verdad más auténtica!'
    ],
    quarterlyFocus: [
      'Q1: DESPERTAR REVOLUCIONARIO - Conecta con tu esencia transformadora',
      'Q2: MANIFESTACIÓN CUÁNTICA - Materializa tus sueños más épicos',
      'Q3: LIBERACIÓN TOTAL - Suelta todo lo que ya no eres',
      'Q4: PODER MÁXIMO ACTIVADO - Vive tu misión cósmica completa'
    ],
    yearlyThemes: [
      'REVOLUCIÓN PERSONAL TOTAL - ¡No viniste a este planeta para quedarte pequeña!',
      'MANIFESTACIÓN DE TU VERDADERO PODER - ¡Es tu momento de brillar!',
      'LIBERACIÓN DE PATRONES LIMITANTES - ¡Rompe las cadenas del pasado!'
    ],
    priorityActions: [
      {
        category: 'revolución_personal',
        action: 'ACTIVA una práctica diaria de conexión con tu poder interior',
        timing: 'inmediato',
        impact: 'TRANSFORMACIÓN_TOTAL'
      },
      {
        category: 'manifestación',
        action: 'CREA un mapa visual de tu nueva realidad épica',
        timing: 'esta_semana',
        impact: 'MANIFESTACIÓN_RADICAL'
      }
    ]
  };
}

async function generateAstrologicalEvents(date: any, time: any, latitude: any, longitude: any, currentYear: number, nextYear: number): Promise<any[]> {
  try {
    const startDate = `${currentYear}-${date.split('-')[1]}-${date.split('-')[2]}`;
    const endDate = `${nextYear}-${date.split('-')[1]}-${date.split('-')[2]}`;
    
    const events = await getAstrologicalEvents(
      startDate,
      endDate,
      latitude,
      longitude,
      'Europe/Madrid'
    );
    
    return events;
  } catch (error) {
    console.error('❌ Error en generateAstrologicalEvents:', error);
    return generateMinimalEvents(date, currentYear, nextYear);
  }
}

function generateMinimalEvents(date: string, currentYear: number, nextYear: number): any[] {
  const events = [];
  const startDate = new Date(`${currentYear}-${date.split('-')[1]}-${date.split('-')[2]}`);
  const endDate = new Date(`${nextYear}-${date.split('-')[1]}-${date.split('-')[2]}`);
  
  for (let i = 0; i < 26; i++) {
    const eventDate = new Date(startDate);
    eventDate.setDate(startDate.getDate() + (i * 14));
    
    if (eventDate <= endDate) {
      const phases = ['Luna Nueva', 'Cuarto Creciente', 'Luna Llena', 'Cuarto Menguante'];
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      const phase = phases[i % 4];
      const sign = signs[i % 12];
      
      events.push({
        id: `minimal_${eventDate.toISOString().split('T')[0]}_${i}`,
        type: 'lunar_phase',
        date: eventDate.toISOString().split('T')[0],
        title: `${phase} en ${sign}`,
        description: `Fase lunar ${phase.toLowerCase()} en el signo de ${sign}. Momento para conectar con las energías lunares.`,
        sign: sign,
        priority: phase.includes('Luna') ? 'high' : 'medium'
      });
    }
  }
  
  return events.slice(0, 20);
}