// src/app/api/agenda/generate-book/route.ts
// ============================================================================
// OPTIMIZADO: Reutiliza datos existentes de BD (natal, SR, eventos)
// Solo pide a OpenAI el texto narrativo que NO existe en ningún sitio.
// Coste anterior: ~$0.15-0.25 | Coste optimizado: ~$0.05-0.08
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import connectDB from '@/lib/db';
import NatalChart from '@/models/NatalChart';
import Interpretation from '@/models/Interpretation';
import User from '@/models/User';
import { calculateSolarYearEvents } from '@/utils/astrology/solarYearEvents';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    console.log('📘 ===== GENERATE BOOK (OPTIMIZED) =====');

    // 🔒 AUTHENTICATION
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - No authentication token provided'
      }, { status: 401 });
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log('👤 User:', userId);

    await connectDB();

    // =========================================================================
    // PASO 1: CARGAR TODO DE BD (sin llamar a OpenAI)
    // =========================================================================

    const user = await User.findOne({ uid: userId }).lean().exec() as any;
    const BirthData = require('@/models/BirthData').default;
    const birthData = await BirthData.findOne({ userId }).lean().exec() as any;

    if (!birthData) {
      return NextResponse.json({ success: false, error: 'No birth data found' }, { status: 404 });
    }

    const userName = user?.fullName || user?.name || user?.displayName || birthData?.name || birthData?.fullName || 'Usuario';
    const userAge = calculateAge(birthData.birthDate);

    // Carta natal
    const natalChart = await NatalChart.findOne({ userId }).lean().exec() as any;
    if (!natalChart) {
      return NextResponse.json({ success: false, error: 'No natal chart found' }, { status: 404 });
    }

    // Interpretación natal (YA GENERADA — la reutilizamos)
    const natalInterpretation = await Interpretation.findOne({
      userId, chartType: 'natal', expiresAt: { $gt: new Date() }
    }).sort({ generatedAt: -1 }).lean().exec() as any;

    // Retorno solar (YA GENERADO — lo reutilizamos)
    const solarReturn = await Interpretation.findOne({
      userId, chartType: 'solar-return', expiresAt: { $gt: new Date() }
    }).sort({ generatedAt: -1 }).lean().exec() as any;

    if (!solarReturn) {
      return NextResponse.json({
        success: false,
        error: 'No solar return found. Generate solar return first.'
      }, { status: 404 });
    }

    console.log('✅ BD data loaded: natal, SR, birthData');
    console.log(`   Natal interpretation: ${natalInterpretation ? 'YES' : 'NO'}`);
    console.log(`   Solar Return: YES`);

    // =========================================================================
    // PASO 2: CALCULAR FECHAS Y EVENTOS
    // =========================================================================

    const now = new Date();
    const currentYear = now.getFullYear();
    const birthMonth = new Date(birthData.birthDate).getMonth();
    const birthDay = new Date(birthData.birthDate).getDate();

    const birthdayThisYear = new Date(currentYear, birthMonth, birthDay);
    const hasBirthdayPassedThisYear = now >= birthdayThisYear;
    const startYear = hasBirthdayPassedThisYear ? currentYear : currentYear - 1;
    const startDate = new Date(startYear, birthMonth, birthDay);
    const endDate = new Date(startYear + 1, birthMonth, birthDay);

    console.log(`📅 Cycle: ${format(startDate, 'dd MMM yyyy', { locale: es })} → ${format(endDate, 'dd MMM yyyy', { locale: es })}`);

    // Intentar cargar eventos del SolarCycle en BD primero
    const SolarCycle = require('@/models/SolarCycle').default;
    const yearLabel = `${startYear}-${startYear + 1}`;
    const existingCycle = await SolarCycle.findOne({ userId, yearLabel }).lean().exec() as any;

    let yearEvents: any[];

    if (existingCycle?.events?.length > 0) {
      // ✅ REUTILIZAR eventos del ciclo ya calculado en BD
      console.log(`✅ Reusing ${existingCycle.events.length} events from SolarCycle BD`);
      yearEvents = existingCycle.events.map((e: any) => {
        // Extraer signo de múltiples fuentes posibles
        const sign = e.metadata?.zodiacSign
          || e.metadata?.sign
          || e.metadata?.toSign  // Para ingresos
          || extractSignFromDescription(e.description || e.title || '')
          || '';

        return {
          type: mapEventType(e.type),
          date: new Date(e.date),
          sign,
          planet: e.metadata?.planet || '',
          house: e.metadata?.house || 1,
          description: e.description || e.title || ''
        };
      }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      // Calcular eventos con astronomy-engine (fallback)
      console.log('⚡ Calculating events with astronomy-engine...');
      const solarEvents = await calculateSolarYearEvents(startDate);
      yearEvents = [
        ...solarEvents.lunarPhases.map(p => ({
          type: p.type === 'new_moon' ? 'luna-nueva' : 'luna-llena',
          date: p.date, sign: p.sign, house: 1, description: p.description, degree: p.degree
        })),
        ...solarEvents.eclipses.map(e => ({
          type: e.type === 'solar' ? 'eclipse-solar' : 'eclipse-lunar',
          date: e.date, sign: e.sign, house: 1, description: e.description, degree: e.degree
        })),
        ...solarEvents.planetaryIngresses.map(i => ({
          type: 'ingreso-planetario',
          date: i.date, sign: i.toSign, planet: i.planet, house: 1, description: i.description
        })),
        ...solarEvents.retrogrades.map(r => ({
          type: 'retrogrado-inicio',
          date: r.startDate, sign: r.startSign, planet: r.planet, house: 1, description: r.description
        }))
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    console.log(`📊 ${yearEvents.length} events total`);

    // Agrupar por mes
    const monthsData = groupEventsByMonth(yearEvents, startDate, endDate);

    // =========================================================================
    // PASO 3: CARGAR INTERPRETACIONES DE EVENTOS YA EXISTENTES EN BD
    // =========================================================================

    const EventInterpretation = require('@/models/EventInterpretation').default;
    const eventInterpretations: { [eventId: string]: any } = {};

    // Cargar TODAS las interpretaciones ya generadas para este usuario
    const existingInterps = await EventInterpretation.find({
      userId,
      expiresAt: { $gt: new Date() }
    }).lean().exec() as any[];

    if (existingInterps?.length > 0) {
      for (const interp of existingInterps) {
        eventInterpretations[interp.eventId] = interp.interpretation;
      }
      console.log(`✅ Loaded ${existingInterps.length} event interpretations from cache`);
    } else {
      console.log('⚠️ No cached event interpretations found');
    }

    // =========================================================================
    // PASO 4: ENSAMBLAR DATOS EXISTENTES (sin OpenAI)
    // =========================================================================

    const natal = natalInterpretation?.interpretation || {};
    const sr = solarReturn?.interpretation || {};
    const chartData = natalChart.natalChart || natalChart;
    const sol = chartData.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
    const luna = chartData.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
    const ascendente = chartData.ascendant;

    // Datos que YA EXISTEN y NO necesitan OpenAI
    const assembledFromBD = {
      // Del natal
      planeta_dominante: natal.planeta_dominante || '',
      proposito_vida: natal.proposito_vida || '',
      patron_energetico: natal.patron_energetico || '',
      super_poderes: natal.super_poderes || [],
      desafios_evolutivos: natal.desafios_evolutivos || [],
      mision_vida: natal.mision_vida || '',
      esencia: natal.esencia_revolucionaria || '',

      // Del solar return
      tema_central_anio: sr.tema_central_del_anio || sr.esencia_revolucionaria_anual || sr.tema_anual || '',
      declaracion_poder: sr.declaracion_poder_anual || '',
      rituales_recomendados: sr.rituales_recomendados || [],
      insights: sr.insights_transformacionales || [],
      advertencias: sr.advertencias || [],
      eventos_clave: sr.eventos_clave_del_anio || [],
      plan_accion: sr.plan_accion || '',
      integracion_final: sr.integracion_final || '',

      // Datos de la carta
      sol_signo: sol?.sign || '',
      sol_casa: sol?.house || '',
      luna_signo: luna?.sign || '',
      luna_casa: luna?.house || '',
      ascendente_signo: ascendente?.sign || '',
    };

    console.log('✅ Assembled existing data from BD');
    console.log(`   Tema año: "${assembledFromBD.tema_central_anio.substring(0, 50)}..."`);
    console.log(`   Superpoderes: ${assembledFromBD.super_poderes.length}`);
    console.log(`   Rituales SR: ${assembledFromBD.rituales_recomendados.length}`);

    // =========================================================================
    // PASO 5: PEDIR A OPENAI SOLO LO QUE NO EXISTE
    // Solo texto narrativo del libro: portada, bienvenida, 12 portadas mes,
    // cierre, frase final. Todo lo demás viene de BD.
    // =========================================================================

    console.log('🤖 Requesting ONLY narrative text from OpenAI...');

    const narrativePrompt = buildNarrativePrompt({
      userName,
      userAge,
      startDate,
      endDate,
      assembledFromBD,
      monthsData,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo y terapeuta simbólico. Respondes ÚNICAMENTE con JSON válido en español, sin markdown. Voz cálida, directa, terapéutica.'
        },
        { role: 'user', content: narrativePrompt }
      ],
      temperature: 0.85,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) throw new Error('Empty response from OpenAI');

    let narrative;
    try {
      narrative = JSON.parse(responseText);
    } catch {
      console.error('❌ JSON parse error, raw:', responseText?.substring(0, 200));
      throw new Error('Failed to parse OpenAI response');
    }

    console.log('✅ Narrative text received from OpenAI');

    // =========================================================================
    // PASO 6: COMBINAR BD + NARRATIVA EN ESTRUCTURA FINAL DEL LIBRO
    // =========================================================================

    const bookContent = {
      userName,
      userAge,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),

      // Carta natal (datos crudos para componentes visuales)
      natalChart: chartData,

      // Solar return (datos crudos)
      solarReturn: sr,

      // PORTADA — de OpenAI
      portada: narrative.portada || {
        titulo: `Tu Vuelta al Sol ${startYear}-${startYear + 1}`,
        subtitulo: assembledFromBD.tema_central_anio,
        dedicatoria: `Para ${userName}`
      },

      // APERTURA — OpenAI + BD
      apertura_del_viaje: {
        antes_de_empezar: narrative.antes_de_empezar || '',
        carta_de_bienvenida: narrative.carta_de_bienvenida || '',
        tema_central_del_año: assembledFromBD.tema_central_anio,
        que_soltar: narrative.que_soltar || '',
        ritual_de_inicio: assembledFromBD.rituales_recomendados?.[0] || narrative.ritual_de_inicio || '',
      },

      // TU MAPA INTERIOR — de BD (natal interpretation)
      tu_mapa_interior: {
        carta_natal_explicada: narrative.carta_natal_explicada || assembledFromBD.esencia,
        soul_chart: {
          nodo_sur: natal.nodo_sur || narrative.nodo_sur || '',
          nodo_norte: natal.nodo_norte || narrative.nodo_norte || '',
          planeta_dominante: assembledFromBD.planeta_dominante,
          patron_alma: assembledFromBD.patron_energetico,
          patrones_inconscientes: Array.isArray(assembledFromBD.desafios_evolutivos)
            ? assembledFromBD.desafios_evolutivos.join('. ')
            : assembledFromBD.desafios_evolutivos || '',
        },
        integrar_proposito: assembledFromBD.proposito_vida,
      },

      // TU AÑO ASTROLÓGICO — de BD (solar return interpretation)
      tu_año_astrologico: {
        retorno_solar: {
          asc_significado: sr.ascendente_significado || sr.asc_significado || '',
          sol_en_casa: sr.sol_en_casa || '',
          luna_en_casa: sr.luna_en_casa || '',
          planetas_angulares: sr.planetas_angulares || '',
          ritual_inicio: assembledFromBD.rituales_recomendados?.[0] || narrative.ritual_de_inicio || '',
          ascendente_del_año: sr.ascendente_del_año || `${ascendente?.sign || ''}`,
          tema_principal: assembledFromBD.tema_central_anio,
          ritual_de_cumpleaños: narrative.ritual_de_cumpleanos || assembledFromBD.rituales_recomendados?.[1] || '',
          mantra_del_año: assembledFromBD.declaracion_poder || narrative.mantra_del_anio || '',
        }
      },

      // CALENDARIO — de BD + OpenAI solo para intros
      calendario_personalizado: {
        descripcion: narrative.calendario_descripcion || '',
        meses_clave: narrative.meses_clave || '',
        aprendizajes_del_año: assembledFromBD.insights?.join('\n\n') || narrative.aprendizajes || '',
        lunas_nuevas_intro: narrative.lunas_nuevas_intro || 'Las Lunas Nuevas son momentos de siembra. Un tiempo para plantar intenciones, abrir nuevos capítulos y conectar con lo que quieres cultivar.',
        lunas_llenas_intro: narrative.lunas_llenas_intro || 'Las Lunas Llenas iluminan lo que estaba oculto. Son momentos de culminación, revelación e integración.',
        eclipses_intro: narrative.eclipses_intro || 'Los eclipses son portales de cambio acelerado. Marcan antes y después en tu historia personal.',
      },

      // LÍNEA DE TIEMPO EMOCIONAL — de OpenAI (necesita interpretación creativa)
      linea_tiempo_emocional: narrative.linea_tiempo_emocional || [],

      // MESES CLAVE — de OpenAI
      meses_clave_puntos_giro: narrative.meses_clave_puntos_giro || [],

      // MES A MES — de OpenAI (portadas y rituales mensuales)
      mes_a_mes: narrative.mes_a_mes || [],

      // CIERRE — OpenAI + BD
      cierre_del_ciclo: {
        integrar_lo_vivido: narrative.integrar_lo_vivido || '',
        carta_de_cierre: narrative.carta_de_cierre || '',
        preparacion_proximo_ciclo: narrative.preparacion_proximo_ciclo || assembledFromBD.integracion_final || '',
      },

      // FRASE FINAL — de OpenAI
      frase_final: narrative.frase_final || 'Nada de lo que viviste fue en vano. Todo fue parte del camino de regreso a ti.',

      // DATOS PARA COMPONENTES
      yearEvents: yearEvents.slice(0, 100),
      monthsData,
      eventInterpretations,
    };

    console.log('✅ Book assembled successfully (BD + OpenAI narrative)');

    return NextResponse.json({
      success: true,
      book: bookContent,
      generatedAt: new Date().toISOString(),
      optimization: {
        source: 'hybrid',
        bdFieldsReused: Object.keys(assembledFromBD).length,
        openaiTokensRequested: 4000,
        eventInterpretationsFromCache: Object.keys(eventInterpretations).length,
      }
    });

  } catch (error) {
    console.error('❌ Error generating book:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function calculateAge(birthDate: string | Date): number {
  if (!birthDate) return 30;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age || 30;
}

/** Mapea tipos de evento del SolarCycle al formato plano */
function mapEventType(type: string): string {
  const map: Record<string, string> = {
    'new_moon': 'luna-nueva',
    'full_moon': 'luna-llena',
    'eclipse': 'eclipse-solar',
    'retrograde': 'retrogrado-inicio',
    'planetary_transit': 'ingreso-planetario',
    'seasonal': 'estacional',
  };
  return map[type] || type;
}

/** Extrae el signo zodiacal de una descripción como "Luna Nueva en Acuario 28.5°" */
function extractSignFromDescription(description: string): string {
  if (!description) return '';

  const ZODIAC_SIGNS = [
    'Aries', 'Tauro', 'Géminis', 'Geminis', 'Cáncer', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  // Buscar patrón "en [Signo]" o simplemente el nombre del signo
  const normalizedDesc = description.toLowerCase();

  for (const sign of ZODIAC_SIGNS) {
    if (normalizedDesc.includes(sign.toLowerCase())) {
      return sign;
    }
  }

  return '';
}

/** Agrupa eventos por mes (12 meses desde startDate) */
function groupEventsByMonth(events: any[], startDate: Date, endDate: Date): any[] {
  const monthsData: any[] = [];
  const currentMonth = new Date(startDate);

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });

    const lunas_nuevas = monthEvents.filter(e => e.type === 'luna-nueva');
    const lunas_llenas = monthEvents.filter(e => e.type === 'luna-llena');
    const eclipses = monthEvents.filter(e => e.type === 'eclipse-solar' || e.type === 'eclipse-lunar');
    const ingresos = monthEvents.filter(e => e.type === 'ingreso-planetario');
    const retrogrados = monthEvents.filter(e => e.type?.includes('retrogrado'));

    monthsData.push({
      nombre: format(monthStart, 'MMMM yyyy', { locale: es }),
      nombreCorto: format(monthStart, 'MMMM', { locale: es }),
      inicio: monthStart.toISOString(),
      fin: monthEnd.toISOString(),
      // ✅ Usar 'date' (no 'fecha') para consistencia con tipos TypeScript
      lunas_nuevas: lunas_nuevas.map(e => ({
        date: e.date instanceof Date ? e.date.toISOString() : new Date(e.date).toISOString(),
        signo: e.sign, house: e.house, description: e.description
      })),
      lunas_llenas: lunas_llenas.map(e => ({
        date: e.date instanceof Date ? e.date.toISOString() : new Date(e.date).toISOString(),
        signo: e.sign, house: e.house, description: e.description
      })),
      eclipses: eclipses.map(e => ({
        date: e.date instanceof Date ? e.date.toISOString() : new Date(e.date).toISOString(),
        type: e.type, signo: e.sign, house: e.house, description: e.description
      })),
      ingresos_destacados: ingresos.slice(0, 3).map(e => ({
        date: format(new Date(e.date), 'dd MMM', { locale: es }),
        planeta: e.planet || e.description?.split(' ')[0],
        signo: e.sign, description: e.description
      })),
      retrogrados: retrogrados.map(e => ({
        date: e.date instanceof Date ? e.date.toISOString() : new Date(e.date).toISOString(),
        planeta: e.planet, signo: e.sign, description: e.description
      })),
      total_eventos: monthEvents.length
    });

    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return monthsData;
}

// =============================================================================
// PROMPT OPTIMIZADO — Solo pide texto narrativo nuevo
// =============================================================================

function buildNarrativePrompt(data: {
  userName: string;
  userAge: number;
  startDate: Date;
  endDate: Date;
  assembledFromBD: any;
  monthsData: any[];
}): string {
  const bd = data.assembledFromBD;
  const period = `${format(data.startDate, 'dd MMMM yyyy', { locale: es })} al ${format(data.endDate, 'dd MMMM yyyy', { locale: es })}`;

  return `# GENERA TEXTO NARRATIVO para la Agenda Astrológica de ${data.userName}

## CONTEXTO (YA INTERPRETADO — NO regenerar, solo usar como base)
- Nombre: ${data.userName}, ${data.userAge} años
- Sol: ${bd.sol_signo} Casa ${bd.sol_casa} | Luna: ${bd.luna_signo} Casa ${bd.luna_casa} | Ascendente: ${bd.ascendente_signo}
- Tema del año: ${bd.tema_central_anio}
- Mantra del año: ${bd.declaracion_poder}
- Superpoderes: ${Array.isArray(bd.super_poderes) ? bd.super_poderes.slice(0, 3).join(', ') : bd.super_poderes}
- Desafíos: ${Array.isArray(bd.desafios_evolutivos) ? bd.desafios_evolutivos.slice(0, 3).join(', ') : bd.desafios_evolutivos}
- Período: ${period}

## MESES DEL AÑO (para mes_a_mes)
${data.monthsData.map((m, i) => `${i + 1}. ${m.nombreCorto}: ${m.lunas_nuevas.length} Luna Nueva, ${m.lunas_llenas.length} Luna Llena, ${m.eclipses.length} Eclipse, ${m.total_eventos} eventos total`).join('\n')}

## GENERA SOLO ESTE JSON (texto narrativo nuevo):

{
  "portada": {
    "titulo": "Tu Vuelta al Sol ${data.startDate.getFullYear()}-${data.endDate.getFullYear()}",
    "subtitulo": "30-40 palabras: Frase-mantra del año basada en: ${bd.tema_central_anio}",
    "dedicatoria": "Para ${data.userName}"
  },

  "antes_de_empezar": "80-100 palabras: Cómo usar esta agenda. Tono cálido, íntimo.",

  "carta_de_bienvenida": "150-200 palabras: Carta para ${data.userName}. Usa su nombre, edad (${data.userAge}), Sol en ${bd.sol_signo}. El tono del ciclo. Qué se abre.",

  "carta_natal_explicada": "150-180 palabras: Explica la carta de ${data.userName} para vivirla. Luna ${bd.luna_signo}, Sol ${bd.sol_signo}, Asc ${bd.ascendente_signo}. Lenguaje aplicado.",

  "que_soltar": "80-100 palabras: Lo que ${data.userName} necesita soltar este año según sus desafíos: ${Array.isArray(bd.desafios_evolutivos) ? bd.desafios_evolutivos.slice(0, 2).join(', ') : ''}",

  "ritual_de_inicio": "80-100 palabras: Ritual simbólico para abrir el año. Mantra en PRIMERA PERSONA.",

  "calendario_descripcion": "100-120 palabras: Cómo usar el calendario.",

  "meses_clave": "120-150 palabras: Los meses de mayor intensidad para ${data.userName}.",

  "lunas_nuevas_intro": "60-80 palabras: Qué son las Lunas Nuevas.",
  "lunas_llenas_intro": "60-80 palabras: Qué son las Lunas Llenas.",
  "eclipses_intro": "60-80 palabras: Qué son los eclipses.",

  "linea_tiempo_emocional": [
    ${data.monthsData.map(m => `{ "mes": "${m.nombreCorto}", "intensidad": "número 1-5 según ${m.eclipses.length} eclipses ${m.total_eventos} eventos", "palabra_clave": "1 palabra" }`).join(',\n    ')}
  ],

  "meses_clave_puntos_giro": [
    { "mes": "nombre del mes más intenso", "evento_astrologico": "30 palabras", "significado_para_ti": "60 palabras para ${data.userName}" },
    { "mes": "segundo mes", "evento_astrologico": "30 palabras", "significado_para_ti": "60 palabras" },
    { "mes": "tercer mes", "evento_astrologico": "30 palabras", "significado_para_ti": "60 palabras" }
  ],

  "mes_a_mes": [
    ${data.monthsData.map(m => `{ "mes": "${m.nombreCorto}", "portada_mes": "40-60 palabras: energía de ${m.nombreCorto}", "interpretacion_mensual": "120-150 palabras para ${data.userName}", "ritual_del_mes": "60-80 palabras", "mantra_mensual": "20-30 palabras en PRIMERA PERSONA" }`).join(',\n    ')}
  ],

  "ritual_de_cumpleanos": "80-100 palabras: Ritual de cumpleaños personalizado.",
  "mantra_del_anio": "30-40 palabras en PRIMERA PERSONA.",

  "nodo_sur": "80-100 palabras: De dónde viene ${data.userName}. Patrones pasados.",
  "nodo_norte": "80-100 palabras: Hacia dónde crece ${data.userName}.",

  "integrar_lo_vivido": "100-120 palabras: Preguntas guía para integrar el año.",
  "carta_de_cierre": "150-180 palabras: Carta de despedida del año.",
  "preparacion_proximo_ciclo": "80-100 palabras: Lo que queda sembrado.",

  "frase_final": "20-30 palabras: Frase para la contraportada."
}

## VOZ "TU VUELTA AL SOL"
- No impresionas → acompañas. No sentencias → explicas. No prometes → ofreces conciencia.
- Frases medias, pausas intencionales, preguntas que abren.
- Usa el nombre ${data.userName} al menos 3 veces.
- Palabras clave: proceso, conciencia, integración, habitar, transformar, anclar.
- EVITA: "karma", "misión" grandilocuente, "todo pasa por algo".`;
}
