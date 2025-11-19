// src/app/api/astrology/interpret-solar-return/route.ts
// 🔥 COMPLETE SOLAR RETURN INTERPRETATION WITH 12 SECTIONS
// Methodology: Shea + Teal + Louis (Professional Astrology)
// Output: Full year prediction with actionable insights

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';
import { generateSolarReturnMasterPrompt } from '@/utils/prompts/solarReturnPrompts';
import { generateSRComparison } from '@/utils/astrology/solarReturnComparison';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ==========================================
// 📊 COMPLETE SOLAR RETURN INTERFACE
// ==========================================

interface CompleteSolarReturnInterpretation {
  // CORE ESSENCE (3 fields - you already have these)
  esencia_revolucionaria_anual: string;
  proposito_vida_anual: string;
  tema_central_del_anio: string;
  
  // TECHNICAL ANALYSIS (professional methodology)
  analisis_tecnico_profesional: {
    asc_sr_en_casa_natal: {
      casa: number;
      signo_asc_sr: string;
      significado: string;
      area_vida_dominante: string;
    };
    sol_en_casa_sr: {
      casa: number;
      significado: string;
    };
    planetas_angulares_sr: Array<{
      planeta: string;
      posicion: string;
      impacto: string;
    }>;
    aspectos_cruzados_natal_sr: Array<{
      planeta_natal: string;
      planeta_sr: string;
      aspecto: string;
      orbe: number;
      significado: string;
    }>;
    configuraciones_especiales: string[];
  };
  
  // ACTION PLAN (quarterly breakdown)
  plan_accion: {
    trimestre_1: { foco: string; acciones: string[] };
    trimestre_2: { foco: string; acciones: string[] };
    trimestre_3: { foco: string; acciones: string[] };
    trimestre_4: { foco: string; acciones: string[] };
  };
  
  // LUNAR CALENDAR (12 months)
  calendario_lunar_anual: Array<{
    mes: string;
    luna_nueva: { fecha: string; signo: string; mensaje: string };
    luna_llena: { fecha: string; signo: string; mensaje: string };
  }>;
  
  // POWER DECLARATION
  declaracion_poder_anual: string;
  
  // WARNINGS
  advertencias: string[];
  
  // KEY EVENTS (timeline)
  eventos_clave_del_anio: Array<{
    periodo: string;
    evento: string;
    tipo: string;
    descripcion: string;
    planetas_involucrados?: string[];
    accion_recomendada: string;
  }>;
  
  // INSIGHTS
  insights_transformacionales: string[];
  
  // RITUALS
  rituales_recomendados: string[];
  
  // INTEGRATION
  integracion_final: {
    sintesis: string;
    pregunta_reflexion: string;
  };
}

// ==========================================
// 🤖 GENERATE WITH OPENAI
// ==========================================

async function generateCompleteWithOpenAI(
  natalChart: any,
  solarReturnChart: any,
  userProfile: any,
  returnYear: number,
  srComparison?: any
): Promise<CompleteSolarReturnInterpretation> {

  console.log('🤖 ===== GENERATING WITH OPENAI =====');
  console.log('🤖 Input validation:', {
    userName: userProfile?.name,
    userAge: userProfile?.age,
    natalPlanets: natalChart?.planets?.length,
    srPlanets: solarReturnChart?.planets?.length,
    returnYear
  });

  // ✅ GENERATE PROMPT
  const prompt = generateSolarReturnMasterPrompt({
    natalChart,
    solarReturnChart,
    userProfile,
    returnYear,
    srComparison
  });

  console.log('📏 Prompt stats:', {
    length: prompt.length,
    containsUserName: prompt.includes(userProfile.name),
    containsReturnYear: prompt.includes(returnYear.toString())
  });

  // ✅ SYSTEM PROMPT WITH STRICT REQUIREMENTS
  let systemPrompt = `You are a PROFESSIONAL astrologer specializing in Solar Return (Annual Revolution) following Shea, Teal, and Louis methodology.

⚠️ CRITICAL REQUIREMENTS:
1. You MUST respond with VALID JSON containing ALL 12 required sections
2. Use the REAL astronomical data provided (planets, houses, signs, degrees)
3. Use the REAL user data: ${userProfile.name}, age ${userProfile.age}, from ${userProfile.birthPlace}
4. Reference SPECIFIC positions like "Sol en ${solarReturnChart?.planets?.find((p: any) => p.name === 'Sol')?.sign} Casa ${solarReturnChart?.planets?.find((p: any) => p.name === 'Sol')?.house}"
5. Calculate ASC SR position in NATAL houses using the comparison data provided
6. Use disruptive Spanish language but BE SPECIFIC with astronomical data
7. NO generic placeholders like "Libra" or "Casa 1" - use REAL data

Required JSON structure:
{
  "esencia_revolucionaria_anual": "string with SPECIFIC references to ${userProfile.name}'s chart",
  "proposito_vida_anual": "string",
  "tema_central_del_anio": "string",
  "analisis_tecnico_profesional": {
    "asc_sr_en_casa_natal": {
      "casa": number (from comparison data),
      "signo_asc_sr": "string (${solarReturnChart?.ascendant?.sign})",
      "significado": "string with REAL data",
      "area_vida_dominante": "string"
    },
    "sol_en_casa_sr": {
      "casa": number,
      "significado": "string"
    },
    "planetas_angulares_sr": [],
    "aspectos_cruzados_natal_sr": [],
    "configuraciones_especiales": []
  },
  "plan_accion": {
    "trimestre_1": {"foco": "string", "acciones": []},
    "trimestre_2": {"foco": "string", "acciones": []},
    "trimestre_3": {"foco": "string", "acciones": []},
    "trimestre_4": {"foco": "string", "acciones": []}
  },
  "calendario_lunar_anual": [...12 months with REAL 2025-2026 dates...],
  "declaracion_poder_anual": "string with ${userProfile.name.toUpperCase()}",
  "advertencias": [...],
  "eventos_clave_del_anio": [...],
  "insights_transformacionales": [...],
  "rituales_recomendados": [...],
  "integracion_final": {
    "sintesis": "string mentioning ${userProfile.name}",
    "pregunta_reflexion": "string"
  }
}

⚠️ OUTPUT ONLY JSON - NO markdown, NO explanations, NO text before/after`;

  // ✅ CALL OPENAI WITH RETRIES
  let attempts = 0;
  const MAX_ATTEMPTS = 2;
  let parsedResponse: any;

  while (attempts < MAX_ATTEMPTS) {
    try {
      console.log(`🤖 OpenAI attempt ${attempts + 1}/${MAX_ATTEMPTS}`);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-2024-08-06',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 6000,
        response_format: { type: "json_object" }
      });

      const rawResponse = completion.choices[0]?.message?.content;

      if (!rawResponse) {
        throw new Error('Empty response from OpenAI');
      }

      console.log('📦 Response received:', {
        length: rawResponse.length,
        first100: rawResponse.substring(0, 100)
      });

      // ✅ PARSE & VALIDATE
      parsedResponse = JSON.parse(rawResponse);

      // Required sections
      const requiredSections = [
        'esencia_revolucionaria_anual',
        'proposito_vida_anual',
        'tema_central_del_anio',
        'analisis_tecnico_profesional',
        'plan_accion',
        'calendario_lunar_anual',
        'declaracion_poder_anual',
        'advertencias',
        'eventos_clave_del_anio',
        'insights_transformacionales',
        'rituales_recomendados',
        'integracion_final'
      ];

      const missingSections = requiredSections.filter(
        section => !parsedResponse[section]
      );

      if (missingSections.length === 0) {
        // ✅ VALIDATE CONTENT QUALITY
        const hasUserName = parsedResponse.esencia_revolucionaria_anual.includes(userProfile.name) ||
                           parsedResponse.declaracion_poder_anual.includes(userProfile.name.toUpperCase());

        const hasRealData = parsedResponse.esencia_revolucionaria_anual !== "Usuario, este año 2025-2026 marca tu REVOLUCIÓN PERSONAL";

        if (!hasUserName || !hasRealData) {
          console.warn('⚠️ Response has all sections but uses generic data');
          throw new Error('OpenAI used generic fallback data instead of real user data');
        }

        console.log(`✅ Complete valid response on attempt ${attempts + 1}`);
        break;
      } else {
        console.warn(`⚠️ Attempt ${attempts + 1}: Missing ${missingSections.length} sections:`, missingSections);
        attempts++;

        if (attempts < MAX_ATTEMPTS) {
          systemPrompt += `\n\n🚨 RETRY: Previous response missing: ${missingSections.join(', ')}. Include them NOW with REAL data.`;
        }
      }

    } catch (error) {
      console.error(`❌ Attempt ${attempts + 1} failed:`, error);
      attempts++;

      if (attempts >= MAX_ATTEMPTS) {
        throw error;
      }
    }
  }

  if (!parsedResponse || attempts >= MAX_ATTEMPTS) {
    throw new Error('Failed to generate valid interpretation after retries');
  }

  console.log('✅ OpenAI interpretation validated:', {
    sections: Object.keys(parsedResponse).length,
    hasUserName: parsedResponse.esencia_revolucionaria_anual.includes(userProfile.name)
  });

  return parsedResponse;
}

// ==========================================
// 🔧 COMPLETE MISSING KEYS (FALLBACK)
// ==========================================

function completeMissingKeys(
  partial: any,
  userProfile: any,
  returnYear: number
): CompleteSolarReturnInterpretation {
  
  const userName = userProfile.name || 'Usuario';
  const locationContext = userProfile.locationContext;
  const relocated = locationContext?.relocated || false;
  const currentLocation = locationContext?.currentPlace || userProfile.birthPlace || 'tu ubicación actual';
  
  // ✅ RELOCATION MESSAGE (critical for Solar Return accuracy)
  const relocationNote = relocated 
    ? `⚠️ IMPORTANTE: Tu Solar Return está calculado para ${currentLocation}, NO para tu lugar de nacimiento (${locationContext.birthPlace}). La ubicación CAMBIA completamente la interpretación del año.`
    : '';
  
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  return {
    esencia_revolucionaria_anual: partial.esencia_revolucionaria_anual || 
      `${userName}, este año ${returnYear}-${returnYear + 1} marca tu REVOLUCIÓN PERSONAL en ${currentLocation}. No es un ciclo más - es tu momento de REESCRIBIR tu realidad desde la autenticidad radical. ${relocationNote}`,
    
    proposito_vida_anual: partial.proposito_vida_anual ||
      `Tu misión NO NEGOCIABLE: Desmantelar estructuras mentales limitantes y emerger como la AUTORIDAD de tu propia vida. Sin disculpas. Sin retrasos.`,
    
    tema_central_del_anio: partial.tema_central_del_anio ||
      `Reinvención Consciente y Empoderamiento Personal`,
    
    analisis_tecnico_profesional: partial.analisis_tecnico_profesional || {
      asc_sr_en_casa_natal: {
        casa: 1,
        signo_asc_sr: 'Libra',
        significado: 'El ascendente de tu Solar Return cae en tu Casa 1 natal, activando el eje de IDENTIDAD y PRESENCIA personal. Este año eres el PROTAGONISTA.',
        area_vida_dominante: 'Desarrollo de identidad auténtica y liderazgo personal'
      },
      sol_en_casa_sr: {
        casa: 1,
        significado: 'El Sol en Casa 1 de tu Solar Return amplifica tu VISIBILIDAD y poder de manifestación. Es tu año para SER VISTO sin filtros.'
      },
      planetas_angulares_sr: [
        {
          planeta: 'Luna',
          posicion: 'Casa 10 (MC)',
          impacto: 'Emociones públicas y reconocimiento profesional dominan este año'
        }
      ],
      aspectos_cruzados_natal_sr: [
        {
          planeta_natal: 'Sol Natal',
          planeta_sr: 'Luna SR',
          aspecto: 'Trígono',
          orbe: 3.5,
          significado: 'Flujo natural entre identidad esencial y expresión emocional anual'
        }
      ],
      configuraciones_especiales: [
        'Ascendente SR en Casa Angular Natal',
        'Sol SR en posición de alto impacto',
        'Énfasis en eje relacional Casa 1-7'
      ]
    },
    
    plan_accion: partial.plan_accion || {
      hoy_mismo: [
        'Reflexiona sobre tus intenciones para este nuevo ciclo solar',
        'Escribe 3 metas concretas para el año que comienza',
        'Identifica un patrón limitante que quieres transformar'
      ],
      esta_semana: [
        'Establece un ritual lunar para conectar con los ciclos mensuales',
        'Revisa áreas de vida activadas según tu Solar Return',
        'Crea un espacio sagrado para tu práctica astrológica'
      ],
      este_mes: [
        'Participa en un taller o curso de crecimiento personal',
        'Reorganiza tu entorno para alinearlo con tus intenciones anuales',
        'Conecta con un mentor o guía espiritual'
      ]
    },
    
    calendario_lunar_anual: partial.calendario_lunar_anual || [
      // Febrero 2025
      {
        mes: `Febrero ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-02-23`, signo: 'Piscis', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-02-10`, signo: 'Leo', mensaje: 'Momento de culminación y liberación' }
      },
      // Marzo 2025 - ECLIPSE SOLAR
      {
        mes: `Marzo ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-03-24`, signo: 'Aries', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-03-11`, signo: 'Virgo', mensaje: 'Momento de culminación y liberación' },
        evento_especial: {
          tipo: 'Eclipse Solar',
          fecha: `${returnYear}-03-29`,
          signo: 'Aries',
          descripcion: 'PORTAL CÓSMICO: Eclipse Solar en Aries. Nuevos comienzos llegan sin aviso.',
          que_hacer: 'Iniciar proyectos valientes, tomar decisiones audaces',
          que_evitar: 'Resistirse al cambio, aferrarse al pasado'
        }
      },
      // Abril 2025
      {
        mes: `Abril ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-04-22`, signo: 'Tauro', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-04-08`, signo: 'Libra', mensaje: 'Momento de culminación y liberación' }
      },
      // Mayo 2025 - MERCURIO RETRÓGRADO #1
      {
        mes: `Mayo ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-05-21`, signo: 'Géminis', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-05-07`, signo: 'Escorpio', mensaje: 'Momento de culminación y liberación' },
        evento_especial: {
          tipo: 'Mercurio Retrógrado',
          fecha_inicio: `${returnYear}-05-10`,
          fecha_fin: `${returnYear}-06-03`,
          signo: 'Géminis',
          descripcion: 'PRECAUCIÓN CÓSMICA: Comunicaciones y tecnología bajo tensión. Tiempo de RE-visar.',
          que_hacer: 'Revisar proyectos, reconectar con el pasado, reorganizar',
          que_evitar: 'Firmar contratos, comprar tecnología, iniciar negocios nuevos'
        }
      },
      // Junio 2025
      {
        mes: `Junio ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-06-20`, signo: 'Cáncer', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-06-05`, signo: 'Sagitario', mensaje: 'Momento de culminación y liberación' }
      },
      // Julio 2025
      {
        mes: `Julio ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-07-19`, signo: 'Leo', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-07-04`, signo: 'Capricornio', mensaje: 'Momento de culminación y liberación' }
      },
      // Agosto 2025 - MERCURIO RETRÓGRADO #2
      {
        mes: `Agosto ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-08-18`, signo: 'Virgo', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-08-02`, signo: 'Acuario', mensaje: 'Momento de culminación y liberación' },
        evento_especial: {
          tipo: 'Mercurio Retrógrado',
          fecha_inicio: `${returnYear}-08-05`,
          fecha_fin: `${returnYear}-08-28`,
          signo: 'Virgo',
          descripcion: 'Segunda retrogradación del año. Perfecciona sistemas, limpia lo que no funciona.',
          que_hacer: 'Optimizar procesos, depurar errores, mejorar eficiencia',
          que_evitar: 'No inicies, sino PERFECCIONA lo existente'
        }
      },
      // Septiembre 2025 - ECLIPSE LUNAR
      {
        mes: `Septiembre ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-09-17`, signo: 'Libra', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-09-01`, signo: 'Piscis', mensaje: 'Momento de culminación y liberación' },
        evento_especial: {
          tipo: 'Eclipse Lunar',
          fecha: `${returnYear}-09-07`,
          signo: 'Piscis',
          descripcion: 'LIBERACIÓN EMOCIONAL: Eclipse Lunar en Piscis. Los eclipses lunares revelan y liberan lo oculto.',
          que_hacer: 'Ritual de cierre, terapia emocional, perdón consciente',
          que_evitar: 'Emociones intensas - date espacio para procesar'
        }
      },
      // Octubre 2025
      {
        mes: `Octubre ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-10-16`, signo: 'Escorpio', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-10-31`, signo: 'Aries', mensaje: 'Momento de culminación y liberación' }
      },
      // Noviembre 2025 - MERCURIO RETRÓGRADO #3
      {
        mes: `Noviembre ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-11-15`, signo: 'Sagitario', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-11-29`, signo: 'Tauro', mensaje: 'Momento de culminación y liberación' },
        evento_especial: {
          tipo: 'Mercurio Retrógrado',
          fecha_inicio: `${returnYear}-11-25`,
          fecha_fin: `${returnYear}-12-15`,
          signo: 'Sagitario',
          descripcion: 'Última retrogradación del año. Cuestiona tus verdades, re-evalúa tu filosofía de vida.',
          que_hacer: 'Reflexionar sobre tu dirección, revisar metas de largo plazo',
          que_evitar: 'Viajes y estudios pueden retrasarse - paciencia cósmica'
        }
      },
      // Diciembre 2025
      {
        mes: `Diciembre ${returnYear}`,
        luna_nueva: { fecha: `${returnYear}-12-14`, signo: 'Capricornio', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear}-12-28`, signo: 'Géminis', mensaje: 'Momento de culminación y liberación' }
      },
      // Enero 2026
      {
        mes: `Enero ${returnYear + 1}`,
        luna_nueva: { fecha: `${returnYear + 1}-01-13`, signo: 'Acuario', mensaje: 'Momento de plantar intenciones y nuevos comienzos' },
        luna_llena: { fecha: `${returnYear + 1}-01-27`, signo: 'Cáncer', mensaje: 'Momento de culminación y liberación' }
      }
    ],
    
    declaracion_poder_anual: partial.declaracion_poder_anual ||
      `YO, ${userName.toUpperCase()}, RECLAMO MI PODER SOBERANO. ESTE AÑO ${returnYear}-${returnYear + 1} SOY EL ARQUITECTO CONSCIENTE DE MI REALIDAD. MANIFIESTO MI AUTENTICIDAD SIN DISCULPAS, AVANZO CON VALENTÍA DISRUPTIVA, Y ABRAZO MI TRANSFORMACIÓN EVOLUTIVA. ASÍ ES, ASÍ SERÁ.`,
    
    advertencias: partial.advertencias || [
      '⚠️ No repitas patrones autodestructivos de años anteriores - rompe el ciclo AHORA',
      '⚠️ Evita la auto-sabotaje cuando el éxito se acerque - mereces brillar',
      '⚠️ No minimices tu poder por miedo al juicio ajeno - tu autenticidad es tu superpoder',
      '⚠️ Cuidado con dispersión energética - enfócate en Casa SR dominante',
      '⚠️ No pospongas decisiones importantes - este año exige ACCIÓN valiente'
    ],
    
    eventos_clave_del_anio: partial.eventos_clave_del_anio || [
      {
        periodo: 'Mes 1 (Inicio Solar Return)',
        evento: 'Activación del Ciclo Anual',
        tipo: 'Iniciación',
        descripcion: 'Las primeras 4 semanas post-cumpleaños marcan el tono del año completo. Cada acción cuenta DOBLE.',
        planetas_involucrados: ['Sol SR', 'Ascendente SR'],
        accion_recomendada: 'Ritual de cumpleaños consciente. Escribir intenciones anuales. Establecer compromiso inquebrantable.'
      },
      {
        periodo: 'Mes 3 (Primera Cuadratura Solar)',
        evento: 'Primer Ajuste de Realidad',
        tipo: 'Desafío',
        descripcion: 'Sol transitando 90° desde posición SR. Momento de VERDAD: ¿estás alineado con tus intenciones? La realidad te muestra sin filtros.',
        accion_recomendada: 'Evaluación brutal de progreso. Ajustar estrategia SIN excusas.'
      },
      {
        periodo: 'Mes 6 (Primer Trígono Solar)',
        evento: 'Flujo y Momentum',
        tipo: 'Oportunidad',
        descripcion: 'Sol transitando 120° desde SR. TODO fluye SI hiciste el trabajo. Momento de CAPITALIZAR esfuerzos previos.',
        accion_recomendada: 'Expansión consciente. Aprovechar ventana de oportunidad con acción decidida.'
      },
      {
        periodo: 'Mes 7 (Oposición Solar)',
        evento: 'MOMENTO DE VERDAD DEFINITIVO',
        tipo: 'Revelación',
        descripcion: 'Sol opuesto a posición SR (crítico según Louis). VES con claridad TOTAL: ¿funcionó tu estrategia o no? Sin filtros, sin excusas.',
        accion_recomendada: 'Celebrar logros auténticos. CORREGIR lo que falló. Decisiones DEFINITIVAS para segundo semestre.'
      },
      {
        periodo: 'Mes 9 (Cosecha Visible)',
        evento: 'Manifestación de Resultados',
        tipo: 'Culminación',
        descripcion: 'Frutos de tu trabajo se vuelven VISIBLES. Si trabajaste, cosecharás. Si no, verás el vacío con honestidad brutal.',
        accion_recomendada: 'Documentar logros tangibles. Capitalizar éxitos. Integrar aprendizajes.'
      },
      {
        periodo: 'Mes 12 (Cierre Pre-Cumpleaños)',
        evento: 'Integración y Preparación',
        tipo: 'Transición',
        descripcion: 'Sol se acerca a posición natal original. Último mes para cerrar ciclos conscientes y preparar siguiente revolución.',
        accion_recomendada: 'Ritual de cierre. Journaling profundo: ¿Qué aprendí REALMENTE? Gratitud por transformaciones.'
      }
    ],
    
    insights_transformacionales: partial.insights_transformacionales || [
      '💎 Este año NO es ensayo - es tu REVOLUCIÓN PERSONAL real y tangible',
      '💎 Tu ubicación física durante el Solar Return determina PODER vs limitación - elige conscientemente',
      '💎 Los primeros 30 días post-cumpleaños marcan el patrón de todo el año - úsalos con intención radical',
      '💎 La Casa donde cae tu Ascendente SR en carta natal es tu ZONA DE PODER dominante - vive ahí',
      '💎 No eres víctima de los tránsitos - eres CO-CREADOR consciente de tu experiencia',
      '💎 Las "crisis" son invitaciones disfrazadas para evolucionar - responde con valentía',
      '💎 Tu autenticidad sin filtros es tu MAYOR activo este año - deja de esconderte'
    ],
    
    rituales_recomendados: partial.rituales_recomendados || [
      '🕯️ RITUAL DE INICIO (Día exacto de cumpleaños): Quemar carta de "excusas del año pasado". Escribir declaración de poder anual. Compromiso inquebrantable.',
      '🌙 RITUAL LUNAR MENSUAL: Cada Luna Nueva - conectar con Casa SR dominante. Establecer micro-intenciones mensuales. Sin piedad, sin excusas.',
      '☀️ RITUAL DIARIO (5 minutos): Meditación de PODER. Visualizar tu versión más auténtica y exitosa. Sentir la emoción de logros manifestados.',
      '📝 RITUAL DE EVALUACIÓN (Meses 3, 6, 9): Journaling brutal de honestidad. ¿Qué está funcionando? ¿Qué NO? Ajustar sin apegos emocionales.',
      '🔥 RITUAL DE CIERRE (3 días pre-cumpleaños): Escribir "Sangre, Sudor y Lágrimas del año". ¿Valió la pena? Integrar TODO antes del siguiente ciclo.'
    ],
    
    integracion_final: partial.integracion_final || {
      sintesis: `Este año ${returnYear}-${returnYear + 1} es tu LABORATORIO DE TRANSFORMACIÓN CONSCIENTE, ${userName}. No es tiempo de víctimas ni espectadores - es tiempo de PROTAGONISTAS REVOLUCIONARIOS. Cada Luna Nueva es un reinicio. Cada decisión cuenta. Cada acción crea tu realidad. El Solar Return te entrega el MAPA - tú decides si lo sigues con valentía disruptiva o lo ignoras por comodidad mediocre. La astrología no predice - PREPARA. Usa este conocimiento para volverse ANTIFRÁGIL: más fuerte ante cada desafío, más consciente ante cada oportunidad, más auténtico ante cada elección. Tu revolución personal ya comenzó.`,
      pregunta_reflexion: `¿Qué versión de ti mismo/a elegirás manifestar este año: la VALIENTE y AUTÉNTICA, o la cómoda y conocida?`
    }
  };
}

// ==========================================
// 🎯 MAIN POST HANDLER
// ==========================================

export async function POST(request: NextRequest) {
  try {
    console.log('🌅 ===== SOLAR RETURN INTERPRETATION REQUEST =====');

    const body = await request.json();
    const { userId, natalChart, solarReturnChart, userProfile, birthData, regenerate = false } = body;

    // ✅ LOG LOCATION DATA (important for Solar Return accuracy)
    if (birthData) {
      console.log('📍 Location data received:', {
        livesInSamePlace: birthData.livesInSamePlace,
        birthPlace: birthData.birthPlace,
        currentPlace: birthData.currentPlace || 'Same as birth',
        hasCurrentCoordinates: !!(birthData.currentLatitude && birthData.currentLongitude)
      });
    }

    // Validation
    if (!userId || !natalChart || !solarReturnChart) {
      return NextResponse.json(
        { error: 'userId, natalChart, and solarReturnChart are required' },
        { status: 400 }
      );
    }

    if (!userProfile || !userProfile.name) {
      return NextResponse.json(
        { error: 'Valid userProfile with name is required' },
        { status: 400 }
      );
    }

    // ✅ DETAILED VALIDATION & LOGGING
    console.log('🔍 ===== VALIDATING INPUT DATA =====');
    console.log('📋 userProfile received:', {
      name: userProfile?.name,
      age: userProfile?.age,
      birthPlace: userProfile?.birthPlace,
      birthDate: userProfile?.birthDate,
      birthTime: userProfile?.birthTime
    });

    console.log('📊 natalChart data:', {
      hasPlanets: !!natalChart?.planets,
      planetsCount: natalChart?.planets?.length,
      ascendant: natalChart?.ascendant?.sign,
      houses: natalChart?.houses?.length
    });

    console.log('📊 solarReturnChart data:', {
      hasPlanets: !!solarReturnChart?.planets,
      planetsCount: solarReturnChart?.planets?.length,
      ascendant: solarReturnChart?.ascendant?.sign,
      houses: solarReturnChart?.houses?.length,
      solarReturnYear: solarReturnChart?.solarReturnInfo?.year
    });

    // ✅ VALIDATION: Reject if critical data missing
    if (!userProfile?.name || userProfile.name === 'Usuario') {
      console.error('❌ CRITICAL: Invalid user name');
      return NextResponse.json({
        success: false,
        error: 'Invalid user profile: name is required and cannot be "Usuario"'
      }, { status: 400 });
    }

    if (!userProfile?.age || userProfile.age === 0) {
      console.error('❌ CRITICAL: Invalid user age');
      return NextResponse.json({
        success: false,
        error: 'Invalid user profile: age is required and cannot be 0'
      }, { status: 400 });
    }

    if (!natalChart?.planets || natalChart.planets.length === 0) {
      console.error('❌ CRITICAL: Invalid natal chart');
      return NextResponse.json({
        success: false,
        error: 'Invalid natal chart: planets data missing'
      }, { status: 400 });
    }

    if (!solarReturnChart?.planets || solarReturnChart.planets.length === 0) {
      console.error('❌ CRITICAL: Invalid solar return chart');
      return NextResponse.json({
        success: false,
        error: 'Invalid solar return chart: planets data missing'
      }, { status: 400 });
    }

    console.log('✅ All input data validated successfully');

    await connectDB();

    // Check cache (if not forcing regeneration)
    if (!regenerate) {
      console.log('🔍 Checking cache...');
      
      const cached = await Interpretation.findOne({
        userId,
        chartType: 'solar-return',
        expiresAt: { $gt: new Date() }
      })
      .sort({ generatedAt: -1 })
      .lean()
      .exec();

      if (cached) {
        console.log('✅ Cached interpretation found');
        const cachedObj = Array.isArray(cached) ? cached[0] : cached;
        return NextResponse.json({
          success: true,
          interpretation: cachedObj?.interpretation,
          cached: true,
          generatedAt: cachedObj?.generatedAt,
          method: 'mongodb_cache'
        });
      }
    }

    // Generate new interpretation
    console.log('🤖 Generating new complete interpretation...');

    const returnYear = solarReturnChart?.solarReturnInfo?.year || new Date().getFullYear();
    let interpretation: CompleteSolarReturnInterpretation;

    // ✅ PREPARE LOCATION DATA FOR INTERPRETATION
    const locationContext = birthData ? {
      livesInSamePlace: birthData.livesInSamePlace,
      birthPlace: birthData.birthPlace,
      currentPlace: birthData.livesInSamePlace
        ? birthData.birthPlace
        : (birthData.currentPlace || birthData.birthPlace),
      relocated: !birthData.livesInSamePlace,
      coordinates: {
        birth: {
          lat: birthData.latitude,
          lon: birthData.longitude
        },
        current: birthData.livesInSamePlace ? {
          lat: birthData.latitude,
          lon: birthData.longitude
        } : {
          lat: birthData.currentLatitude || birthData.latitude,
          lon: birthData.currentLongitude || birthData.longitude
        }
      }
    } : null;

    if (locationContext?.relocated) {
      console.log('🌍 RELOCATION DETECTED:', {
        from: locationContext.birthPlace,
        to: locationContext.currentPlace,
        distanceNote: 'Solar Return calculated for current location'
      });
    }

    // ✅ GENERAR COMPARACIÓN NATAL vs SR
    const srComparison = generateSRComparison(natalChart, solarReturnChart);

    console.log('📊 Comparación generada:', {
      ascSRInNatalHouse: srComparison.ascSRInNatalHouse,
      planetaryChanges: srComparison.planetaryChanges.length
    });

    if (process.env.OPENAI_API_KEY) {
      try {
        interpretation = await generateCompleteWithOpenAI(
          natalChart,
          solarReturnChart,
          { ...userProfile, locationContext }, // Pass location data
          returnYear,
          srComparison // ✅ PASAR COMPARACIÓN
        );
      } catch (openaiError) {
        console.warn('⚠️ OpenAI failed, using complete fallback:', openaiError);
        interpretation = completeMissingKeys({}, { ...userProfile, locationContext }, returnYear);
      }
    } else {
      console.log('⚠️ No OpenAI API key, using complete fallback');
      interpretation = completeMissingKeys({}, { ...userProfile, locationContext }, returnYear);
    }

    // Save to MongoDB
    console.log('💾 Saving to MongoDB...');

    const savedInterpretation = await Interpretation.create({
      userId,
      chartType: 'solar-return',
      natalChart,
      solarReturnChart,
      userProfile: {
        name: userProfile.name,
        age: userProfile.age || 0,
        birthPlace: userProfile.birthPlace || 'Unknown',
        birthDate: userProfile.birthDate || 'Unknown',
        birthTime: userProfile.birthTime || 'Unknown',
        // ✅ ADD LOCATION CONTEXT TO STORED DATA
        currentPlace: locationContext?.currentPlace,
        relocated: locationContext?.relocated || false
      },
      interpretation,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_DURATION),
      method: process.env.OPENAI_API_KEY ? 'openai' : 'fallback',
      cached: false
    });

    console.log('✅ Interpretation saved:', savedInterpretation._id);
    console.log('📊 Sections generated:', Object.keys(interpretation).length);

    return NextResponse.json({
      success: true,
      interpretation,
      cached: false,
      generatedAt: savedInterpretation.generatedAt,
      method: savedInterpretation.method
    });

  } catch (error) {
    console.error('❌ Error in Solar Return interpretation:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate interpretation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ==========================================
// 📖 GET: RETRIEVE EXISTING INTERPRETATION
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const interpretationDoc = await Interpretation.findOne({
      userId,
      chartType: 'solar-return',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec();

    if (!interpretationDoc) {
      return NextResponse.json({
        success: false,
        message: 'No Solar Return interpretation available'
      }, { status: 404 });
    }

    // Handle case where interpretationDoc could be an array
    const doc = Array.isArray(interpretationDoc) ? interpretationDoc[0] : interpretationDoc;

    return NextResponse.json({
      success: true,
      interpretation: doc?.interpretation,
      cached: true,
      generatedAt: doc?.generatedAt,
      method: 'mongodb_cached'
    });

  } catch (error) {
    console.error('❌ Error retrieving Solar Return:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve interpretation'
    }, { status: 500 });
  }
}