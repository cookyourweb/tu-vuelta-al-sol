
// =============================================================================
// ARCHIVO 2: src/app/api/astrology/progressed-interpretation/route.ts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';
import Chart, { castChart } from '@/models/Chart';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 60;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, focusAreas = [] } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId requerido' 
      }, { status: 400 });
    }

    console.log('🔮 [PROGRESSED-AI] Iniciando análisis astrológico puro para:', userId);

    // Cargar datos
    const birthDataRaw = await BirthData.findOne({ 
      $or: [{ userId }, { uid: userId }] 
    }).lean();
    
    const birthData = castBirthData(birthDataRaw);
    
    if (!birthData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Datos de nacimiento no encontrados' 
      }, { status: 404 });
    }

    const chartRaw = await Chart.findOne({ 
      $or: [{ userId }, { uid: userId }] 
    }).lean();
    
    const chart = castChart(chartRaw);
    
    if (!chart) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cartas astrológicas no encontradas' 
      }, { status: 404 });
    }

    let progressedChart = null;
    
    if (chart.progressedCharts?.length) {
      progressedChart = chart.progressedCharts.find(pc => pc.isActive);
    }
    
    if (!progressedChart && chart.progressedChart) {
      progressedChart = { chart: chart.progressedChart };
    }
    
    if (!progressedChart) {
      return NextResponse.json({ 
        success: false, 
        error: 'Carta progresada no encontrada' 
      }, { status: 404 });
    }

    console.log('✅ [PROGRESSED-AI] Datos cargados, generando prompt astrológico...');

    // PROMPT ENFOCADO SOLO EN ASTROLOGÍA
    const promptAstrologico = `
Eres un astrólogo evolutivo experto que interpreta cartas progresadas basándose ÚNICAMENTE en configuraciones astrológicas.

ANÁLISIS REQUERIDO:
Interpreta esta configuración específica sin referencias a edad, lugar o información personal. 
Enfócate SOLO en los significados astrológicos puros y su evolución.

CARTA NATAL:
${formatChartForAstrologicalAnalysis(chart.natalChart)}

CARTA PROGRESADA ACTUAL:
${formatChartForAstrologicalAnalysis(progressedChart.chart)}

ENFOQUE OBLIGATORIO:
1. Analiza SOLO los aspectos astrológicos y sus significados
2. Identifica patrones de evolución planetaria
3. Interpreta cambios de signos y casas en términos evolutivos
4. Conecta progresiones con arquetipos astrológicos
5. Proporciona guías basadas en energías planetarias

METODOLOGÍA ASTROLÓGICA:
- Progresiones secundarias (1 día = 1 año de vida)
- Análisis de cambios de signo como cambios de consciencia
- Cambios de casa como nuevos escenarios de experiencia
- Aspectos progresados como dinámicas evolutivas nuevas

RESPONDE EN JSON EXACTO:
{
  "configuracion_dominante": {
    "patron_evolutivo_principal": "Descripción del tema evolutivo central basado en las progresiones más significativas",
    "elementos_activados": ["elemento1", "elemento2"],
    "modalidades_activadas": ["cardinal", "fixed", "mutable"],
    "energia_general": "Descripción de la energía predominante actual"
  },
  "analisis_progresiones": [
    {
      "planeta": "Sol/Luna/etc",
      "configuracion_natal": "Signo y casa original",
      "configuracion_progresada": "Nueva posición",
      "significado_arquetipico": "Qué representa este cambio en términos de arquetipos",
      "proceso_evolutivo": "Cómo se manifiesta esta evolución",
      "energia_trabajar": "Qué energías planetarias potenciar",
      "energia_integrar": "Qué aspectos necesitan integración"
    }
  ],
  "dinamicas_activas": [
    {
      "configuracion": "Aspecto o patrón astrológico específico",
      "significado_tradicional": "Interpretación astrológica clásica",
      "manifestacion_evolutiva": "Cómo se vive este patrón en evolución",
      "potencial_desarrollo": "Hacia dónde puede evolucionar",
      "reto_arquetipico": "Qué arquetipo necesita ser integrado"
    }
  ],
  "elementos_y_modalidades": {
    "distribucion_natal": "Análisis elemental y modal de la carta natal",
    "distribucion_progresada": "Cómo ha cambiado la distribución",
    "impacto_evolutivo": "Qué significa este cambio en términos de desarrollo",
    "equilibrio_necesario": "Qué elementos o modalidades necesitan atención"
  },
  "casas_activadas": [
    {
      "casa": "número",
      "tema_arquetipico": "Tema de vida que representa esta casa",
      "activacion_actual": "Cómo está siendo activada por las progresiones",
      "desarrollo_sugerido": "Qué aspectos de este tema desarrollar"
    }
  ],
  "ciclos_planetarios": {
    "ciclos_completandose": "Qué ciclos planetarios están llegando a su fin",
    "ciclos_iniciandose": "Qué nuevos ciclos están comenzando",
    "timing_natural": "En qué momento del gran ciclo evolutivo se encuentra",
    "preparacion_proxima_fase": "Hacia qué configuración se dirige"
  },
  "integracion_practica": {
    "arquetipos_activar": "Qué arquetipos planetarios necesitan expresión",
    "energias_canalizar": "Cómo canalizar las energías dominantes",
    "elementos_equilibrar": "Qué elementos necesitan armonización",
    "modalidades_desarrollar": "Qué modalidades requieren desarrollo",
    "rituales_arquetipicos": "Prácticas basadas en simbolismo astrológico",
    "afirmaciones_planetarias": ["Afirmaciones basadas en energías específicas"]
  },
  "perspectiva_evolutiva": "Síntesis de hacia dónde apunta esta configuración astrológica en términos de desarrollo de consciencia"
}

IMPORTANTE: 
- NO menciones edad, lugar, género, o datos personales
- Enfócate exclusivamente en significados astrológicos
- Usa terminología precisa de astrología evolutiva
- Conecta todo con arquetipos y simbolismo planetario
- Mantén el análisis en el nivel de energías y patrones cósmicos
`;

    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo evolutivo experto que interpreta configuraciones astrológicas en términos de desarrollo de consciencia y patrones arquetípicos. No usas información personal, solo significados astrológicos puros."
        },
        {
          role: "user",
          content: promptAstrologico
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const aiResponse = response.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    let interpretationData;
    try {
      const cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      interpretationData = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Error parseando JSON de OpenAI:', parseError);
      throw new Error('Respuesta de IA no válida');
    }

    console.log('✅ [PROGRESSED-AI] Interpretación astrológica generada');

    return NextResponse.json({
      success: true,
      data: {
        interpretation: interpretationData,
        metadata: {
          userId,
          generatedAt: new Date().toISOString(),
          chartType: 'progressed_astrological_analysis',
          aiModel: 'gpt-4',
          analysisType: 'pure_astrological'
        }
      }
    });

  } catch (error) {
    console.error('❌ [PROGRESSED-AI] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error generando interpretación astrológica',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

function formatChartForAstrologicalAnalysis(chart: any): string {
  if (!chart) return 'No disponible';
  
  let formatted = '';
  
  // Planetas con enfoque astrológico
  if (chart.planets && Array.isArray(chart.planets)) {
    formatted += "CONFIGURACIÓN PLANETARIA:\n";
    chart.planets.forEach((planet: any) => {
      formatted += `${planet.name}: ${Math.floor(planet.degree || 0)}°${String(Math.floor(((planet.degree || 0) % 1) * 60)).padStart(2, '0')}' ${planet.sign} en Casa ${planet.housePosition || planet.house}${planet.retrograde ? ' (R)' : ''}\n`;
    });
  }
  
  // Para carta progresada
  if (chart.sol_progresado) {
    formatted += `Sol progresado: ${Math.floor(chart.sol_progresado.degree)}°${String(Math.floor((chart.sol_progresado.degree % 1) * 60)).padStart(2, '0')}' ${chart.sol_progresado.sign} Casa ${chart.sol_progresado.house}\n`;
  }
  if (chart.luna_progresada) {
    formatted += `Luna progresada: ${Math.floor(chart.luna_progresada.degree)}°${String(Math.floor((chart.luna_progresada.degree % 1) * 60)).padStart(2, '0')}' ${chart.luna_progresada.sign} Casa ${chart.luna_progresada.house}\n`;
  }
  if (chart.mercurio_progresado) {
    formatted += `Mercurio progresado: ${Math.floor(chart.mercurio_progresado.degree)}°${String(Math.floor((chart.mercurio_progresado.degree % 1) * 60)).padStart(2, '0')}' ${chart.mercurio_progresado.sign} Casa ${chart.mercurio_progresado.house}\n`;
  }
  
  // Puntos angulares
  if (chart.ascendant || chart.ascendente) {
    const asc = chart.ascendant || chart.ascendente;
    formatted += `Ascendente: ${Math.floor(asc.degree || 0)}°${String(Math.floor(((asc.degree || 0) % 1) * 60)).padStart(2, '0')}' ${asc.sign}\n`;
  }
  
  if (chart.midheaven) {
    formatted += `Medio Cielo: ${Math.floor(chart.midheaven.degree)}°${String(Math.floor((chart.midheaven.degree % 1) * 60)).padStart(2, '0')}' ${chart.midheaven.sign}\n`;
  }
  
  // Distribución elemental si está disponible
  if (chart.elementDistribution) {
    formatted += `DISTRIBUCIÓN ELEMENTAL: Fuego ${chart.elementDistribution.fire}, Tierra ${chart.elementDistribution.earth}, Aire ${chart.elementDistribution.air}, Agua ${chart.elementDistribution.water}\n`;
  }
  
  return formatted;
}

