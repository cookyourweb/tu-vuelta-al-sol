// src/app/api/astrology/interpretations/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';
import { generateSolarReturnMasterPrompt } from '@/utils/prompts/solarReturnPrompts';
import { generateSRComparison } from '@/utils/astrology/solarReturnComparison';
import type {
  CompleteSolarReturnInterpretation,
  UserProfile,
  APIResponse,
  InterpretationDocument
} from '@/types/astrology/interpretation'; // ✅ ADD THIS

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse>> {
  try {
    console.log('🌅 ===== SOLAR RETURN INTERPRETATION REQUEST =====');

    const body = await request.json();
    const {
      userId,
      natalChart,
      solarReturnChart,
      userProfile,
      regenerate = false
    }: {
      userId: string;
      natalChart: any;
      solarReturnChart: any;
      userProfile: UserProfile;
      regenerate?: boolean;
    } = body;

    // ✅ DETAILED LOGGING
    console.log('📋 Received data:', {
      userId,
      hasNatalChart: !!natalChart,
      natalPlanets: natalChart?.planets?.length,
      hasSolarReturnChart: !!solarReturnChart,
      srPlanets: solarReturnChart?.planets?.length,
      userProfile: {
        name: userProfile?.name,
        age: userProfile?.age,
        birthPlace: userProfile?.birthPlace,
        birthDate: userProfile?.birthDate
      }
    });

    // ✅ VALIDATION
    if (!userId) {
      console.error('❌ Missing userId');
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    if (!natalChart?.planets || natalChart.planets.length === 0) {
      console.error('❌ Invalid natal chart');
      return NextResponse.json(
        { success: false, error: 'Valid natal chart with planets is required' },
        { status: 400 }
      );
    }

    if (!solarReturnChart?.planets || solarReturnChart.planets.length === 0) {
      console.error('❌ Invalid solar return chart');
      return NextResponse.json(
        { success: false, error: 'Valid solar return chart with planets is required' },
        { status: 400 }
      );
    }

    if (!userProfile?.name || userProfile.name === 'Usuario') {
      console.error('❌ Invalid user profile name:', userProfile?.name);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Valid user profile with real name is required (not "Usuario")',
          debug: { receivedName: userProfile?.name }
        },
        { status: 400 }
      );
    }

    if (!userProfile?.age || userProfile.age === 0) {
      console.error('❌ Invalid user age:', userProfile?.age);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Valid user age is required (not 0)',
          debug: { receivedAge: userProfile?.age }
        },
        { status: 400 }
      );
    }

    console.log('✅ All validations passed');

    await connectDB();

    // ✅ GENERATE NEW INTERPRETATION
    console.log('🤖 Generating new interpretation...');

    const returnYear = solarReturnChart?.solarReturnInfo?.year || new Date().getFullYear();
    
    const srComparison = generateSRComparison(natalChart, solarReturnChart);

    let interpretation;

    // ✅ TRY OPENAI FIRST
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('🤖 Using OpenAI for generation...');
        
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
          userName: userProfile.name
        });

        const systemPrompt = `You are a professional astrologer specializing in Solar Return interpretations.

CRITICAL REQUIREMENTS:
1. Generate interpretation in Spanish
2. Use the real user name: ${userProfile.name} (age ${userProfile.age})
3. Return VALID JSON with these exact keys (ALL required):
   - esencia_revolucionaria_anual (must mention ${userProfile.name})
   - proposito_vida_anual
   - tema_central_del_anio
   - analisis_tecnico_profesional
   - plan_accion
   - calendario_lunar_anual (12 months array)
   - declaracion_poder_anual (must include ${userProfile.name.toUpperCase()})
   - advertencias (array)
   - eventos_clave_del_anio (array)
   - insights_transformacionales (array)
   - rituales_recomendados (array)
   - integracion_final (object with sintesis and pregunta_reflexion)

4. Use REAL astronomical data from charts (no generic placeholders)
5. NO text before/after JSON - ONLY the JSON object

Example start:
{
  "esencia_revolucionaria_anual": "${userProfile.name}, este año ${returnYear}-${returnYear + 1} marca tu REVOLUCIÓN PERSONAL...",
  ...
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
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

        console.log('📦 OpenAI response received:', {
          length: rawResponse.length,
          firstChars: rawResponse.substring(0, 100)
        });

        interpretation = JSON.parse(rawResponse);

        // ✅ VALIDATE USER NAME IS INCLUDED
        if (!interpretation.esencia_revolucionaria_anual?.includes(userProfile.name)) {
          console.warn('⚠️ User name not in interpretation, fixing...');
          interpretation.esencia_revolucionaria_anual = `${userProfile.name}, ${interpretation.esencia_revolucionaria_anual || 'este año marca tu revolución personal'}`;
        }

        console.log('✅ OpenAI interpretation generated successfully');

      } catch (openaiError) {
        console.error('❌ OpenAI error:', openaiError);
        console.log('⚠️ Falling back to template-based interpretation');
        interpretation = generateFallbackInterpretation(userProfile, returnYear, solarReturnChart, natalChart, srComparison);
      }
    } else {
      console.log('⚠️ No OpenAI key, using fallback');
      interpretation = generateFallbackInterpretation(userProfile, returnYear, solarReturnChart, natalChart, srComparison);
    }

    // ✅ FINAL VALIDATION BEFORE SAVING
    if (!interpretation.esencia_revolucionaria_anual) {
      throw new Error('Interpretation missing required field: esencia_revolucionaria_anual');
    }

    // ✅ SAVE TO MONGODB
    console.log('💾 Saving to MongoDB...');

    const savedInterpretation = await Interpretation.create({
      userId,
      chartType: 'solar-return',
      userProfile: {
        name: userProfile.name,
        age: userProfile.age,
        birthPlace: userProfile.birthPlace || 'Unknown',
        birthDate: userProfile.birthDate || 'Unknown',
        birthTime: userProfile.birthTime || 'Unknown'
      },
      interpretation,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + CACHE_DURATION),
      method: process.env.OPENAI_API_KEY ? 'openai' : 'fallback',
      cached: false
    });

    console.log('✅ Interpretation saved:', savedInterpretation._id);
    console.log('📊 Interpretation keys:', Object.keys(interpretation).join(', '));

    return NextResponse.json({
      success: true,
      interpretation,
      cached: false,
      generatedAt: savedInterpretation.generatedAt,
      method: savedInterpretation.method
    });

  } catch (error) {
    console.error('❌ Error in Solar Return interpretation:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate interpretation',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : null) : undefined
    }, { status: 500 });
  }
}

// ✅ GET: RETRIEVE CACHED INTERPRETATION
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
    .exec() as any;

    if (!interpretationDoc) {
      return NextResponse.json({
        success: false,
        message: 'No Solar Return interpretation available'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      interpretation: interpretationDoc.interpretation,
      cached: true,
      generatedAt: interpretationDoc.generatedAt,
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

// ==========================================
// 🎨 FALLBACK INTERPRETATION GENERATOR
// ==========================================

function generateFallbackInterpretation(
  userProfile: UserProfile,
  returnYear: number,
  solarReturnChart: any,
  natalChart: any,
  srComparison: any
): CompleteSolarReturnInterpretation {
  const userName = userProfile.name;
  const userAge = userProfile.age;
  const birthPlace = userProfile.birthPlace || 'tu ubicación';
  
  const ascSign = solarReturnChart?.ascendant?.sign || 'Sagitario';
  const ascDegree = Math.floor(solarReturnChart?.ascendant?.degree || 15);
  
  const sunPlanet = solarReturnChart?.planets?.find((p: any) => p.name === 'Sol');
  const sunHouse = sunPlanet?.house || 12;
  const sunSign = sunPlanet?.sign || 'Acuario';
  
  const moonPlanet = solarReturnChart?.planets?.find((p: any) => p.name === 'Luna');
  const moonHouse = moonPlanet?.house || 5;
  const moonSign = moonPlanet?.sign || 'Leo';

  // ✅ ASC SR in Natal House
  const ascSRInNatalHouse = srComparison?.ascSRInNatalHouse || 1;

  return {
    esencia_revolucionaria_anual: `${userName}, bienvenida a tu año ${returnYear}-${returnYear + 1}, un ciclo revolucionario que marca tu cumpleaños número ${userAge}. Con tu Ascendente de Solar Return en ${ascSign} (${ascDegree}°), este año representa una REINVENCIÓN TOTAL de tu identidad y presencia en el mundo. No es un ciclo más - es tu momento de REESCRIBIR tu narrativa desde la autenticidad más radical. El universo te invita a desmantelar las máscaras sociales y emerger como la versión más PODEROSA y SIN FILTROS de ti misma.`,

    proposito_vida_anual: `Tu misión NO NEGOCIABLE este año: Reclamar tu SOBERANÍA PERSONAL sin disculpas. Con el Sol en ${sunSign} Casa ${sunHouse} de tu Solar Return, tu energía vital se concentra en transformar esta área de vida con valentía disruptiva. Es tiempo de dejar de pedir permiso para brillar y comenzar a OCUPAR EL ESPACIO que te corresponde. Tu propósito es desmantelar limitaciones autoimpuestas y construir una vida que refleje tu VERDAD interior, no las expectativas externas.`,

    tema_central_del_anio: `"Revolución de Identidad y Empoderamiento Sin Filtros"`,

    analisis_tecnico_profesional: {
      asc_sr_en_casa_natal: {
        casa: ascSRInNatalHouse,
        signo_asc_sr: ascSign,
        significado: `Tu Ascendente de Solar Return en ${ascSign} cae en tu Casa ${ascSRInNatalHouse} natal, marcando esta área de vida como el EPICENTRO de tu revolución anual. Esta posición determina dónde concentrarás tu identidad renovada y desde dónde proyectarás tu nueva imagen al mundo. Es tu ZONA DE PODER dominante - donde cada acción tendrá TRIPLE IMPACTO.`,
        area_vida_dominante: getHouseMeaning(ascSRInNatalHouse)
      },
      sol_en_casa_sr: {
        casa: sunHouse,
        significado: `El Sol en Casa ${sunHouse} de tu Solar Return ilumina esta área como tu MISIÓN CENTRAL del año. Aquí es donde tu energía vital, creatividad y poder de manifestación alcanzarán su máxima expresión. Todo lo que inicies en este sector tendrá respaldo cósmico.`,
        energia_disponible: `Máxima vitalidad y creatividad en: ${getHouseMeaning(sunHouse)}`
      },
      planetas_angulares_sr: generateAngularPlanets(solarReturnChart),
      aspectos_cruzados_natal_sr: srComparison?.planetaryChanges?.slice(0, 3).map((change: any) => ({
        planeta_natal: change.planet,
        planeta_sr: change.planet,
        aspecto: 'Comparación',
        orbe: 0,
        significado: `${change.planet} cambió de Casa ${change.natalHouse} (natal) a Casa ${change.srHouse} (SR) - cambio de ${change.houseChange} casas`
      })) || [],
      configuraciones_especiales: [
        `Ascendente SR en ${ascSign} marca el tono emocional del año`,
        `Sol en Casa ${sunHouse} activa área de máximo protagonismo`,
        `Luna en ${moonSign} Casa ${moonHouse} define tu mundo emocional`
      ]
    },

    plan_accion: {
      trimestre_1: {
        foco: `Sembrar Semillas Revolucionarias (${getMonthName(returnYear, 0)}-${getMonthName(returnYear, 2)})`,
        acciones: [
          `Define tu DECLARACIÓN DE PODER anual y escríbela en primera persona`,
          `Identifica 3 patrones autodestructivos del año pasado que NO repetirás`,
          `Crea un ritual de Luna Nueva mensual conectado con tu Casa ${ascSRInNatalHouse} natal`,
          `Establece límites claros en relaciones que drenan tu energía`
        ]
      },
      trimestre_2: {
        foco: `Ejecutar con Valentía Disruptiva (${getMonthName(returnYear, 3)}-${getMonthName(returnYear, 5)})`,
        acciones: [
          `Toma ACCIÓN decisiva en tu Casa ${sunHouse} (zona de poder solar)`,
          `Expande tu zona de confort sin piedad - haz algo que te dé miedo cada semana`,
          `Manifiesta visibilidad pública sin filtros - muestra tu trabajo/talento abiertamente`,
          `Capitaliza oportunidades con timing preciso - cuando surjan, actúa INMEDIATAMENTE`
        ]
      },
      trimestre_3: {
        foco: `Ajustar con Honestidad Brutal (${getMonthName(returnYear, 6)}-${getMonthName(returnYear, 8)})`,
        acciones: [
          `Evalúa progreso con BRUTAL honestidad - sin autoengaño`,
          `Elimina lo que NO funciona sin apegos emocionales`,
          `Refina estrategia según resultados reales, no esperanzas`,
          `Prepara cosecha consciente de logros tangibles`
        ]
      },
      trimestre_4: {
        foco: `Consolidar y Celebrar Victorias (${getMonthName(returnYear, 9)}-${getMonthName(returnYear, 11)})`,
        acciones: [
          `Integra aprendizajes profundos del ciclo completo`,
          `Documenta transformaciones con evidencia tangible (fotos, logros, cambios)`,
          `Celebra victorias SIN minimizar tus logros`,
          `Prepara fundamentos sólidos para siguiente ciclo solar`
        ]
      }
    },

    calendario_lunar_anual: generateLunarCalendar(returnYear),

    declaracion_poder_anual: `YO, ${userName.toUpperCase()}, RECLAMO MI PODER SOBERANO EN ESTE AÑO ${returnYear}-${returnYear + 1}. SOY LA ARQUITECTA CONSCIENTE DE MI REALIDAD. MANIFIESTO MI AUTENTICIDAD SIN DISCULPAS, AVANZO CON VALENTÍA DISRUPTIVA, Y ABRAZO MI TRANSFORMACIÓN EVOLUTIVA CON CADA RESPIRACIÓN. MI ${ascSign.toUpperCase()} ASCENDENTE ME IMPULSA A SER VISIBLE, VALIENTE Y MAGNÉTICA. ASÍ ES, ASÍ SERÁ, ASÍ LO DECRETO.`,

    advertencias: [
      `⚠️ PATRÓN A ROMPER: No repitas los mismos errores de relación/trabajo del año pasado - ya sabes cómo termina`,
      `⚠️ AUTO-SABOTAJE: Cuando el éxito se acerque, NO huyas por miedo al juicio - mereces brillar`,
      `⚠️ FALSA MODESTIA: No minimices tu poder ni tus logros por "humildad" - eso es autodestrucción disfrazada`,
      `⚠️ DISPERSIÓN: No disperses energía en 10 proyectos - enfócate en tu Casa ${sunHouse} con LÁSER`,
      `⚠️ PROCRASTINACIÓN: Este año NO tolera demoras - decisiones importantes requieren ACCIÓN inmediata`
    ],

    eventos_clave_del_anio: generateKeyEvents(returnYear, sunHouse),

    insights_transformacionales: [
      `💎 Este año NO es ensayo ni práctica - es tu REVOLUCIÓN PERSONAL real y tangible`,
      `💎 Los primeros 30 días post-cumpleaños establecen el PATRÓN de todo el año - úsalos con intención radical`,
      `💎 Tu Ascendente SR en ${ascSign} marca tu MÁSCARA SOCIAL del año - cómo te verá el mundo`,
      `💎 La Casa ${ascSRInNatalHouse} donde cae tu ASC SR es tu ZONA DE PODER dominante - VIVE AHÍ`,
      `💎 No eres víctima de los astros - eres CO-CREADORA consciente de tu experiencia`,
      `💎 Las "crisis" son invitaciones disfrazadas para evolucionar - responde con valentía`,
      `💎 Tu autenticidad sin filtros es tu MAYOR ACTIVO este año - deja de esconderte`,
      `💎 El timing cósmico es perfecto - si algo llega AHORA, es porque estás lista AHORA`
    ],

    rituales_recomendados: [
      `🕯️ RITUAL DE INICIO (Día de cumpleaños): Quema carta de "excusas del año pasado". Escribe tu declaración de poder anual. Compromiso inquebrantable en altar personal.`,
      `🌙 RITUAL LUNAR MENSUAL: Cada Luna Nueva - conecta con tu Casa ${sunHouse} (zona solar). Establece 3 micro-intenciones específicas. Sin piedad, sin excusas.`,
      `☀️ RITUAL DIARIO (5 minutos AM): Meditación de PODER frente al sol. Visualiza tu versión ${userAge + 1} años más exitosa y auténtica. Siente la emoción como si ya fuera real.`,
      `📝 RITUAL DE EVALUACIÓN (Meses 3, 6, 9): Journaling brutal de honestidad total. ¿Qué está funcionando? ¿Qué NO? Ajustar estrategia sin apegos sentimentales.`,
      `🔥 RITUAL DE CIERRE (3 días pre-próximo cumpleaños): Escribe "Sangre, Sudor y Lágrimas del año". ¿Valió la pena? Integrar TODO antes del siguiente ciclo solar.`
    ],

    integracion_final: {
      sintesis: `${userName}, este año ${returnYear}-${returnYear + 1} es tu LABORATORIO DE TRANSFORMACIÓN CONSCIENTE. No es tiempo de víctimas ni espectadores - es tiempo de PROTAGONISTAS REVOLUCIONARIAS. Tu Ascendente en ${ascSign} te regala el coraje de SER VISTA, tu Sol en Casa ${sunHouse} te da el PODER para manifestar, y tu Luna en ${moonSign} te conecta con tu sabiduría emocional profunda. Cada Luna Nueva es un reinicio. Cada decisión cuenta. Cada acción crea tu realidad. El Solar Return te entrega el MAPA - tú decides si lo sigues con valentía disruptiva o lo ignoras por comodidad mediocre. La astrología no predice - PREPARA. Usa este conocimiento para volverse ANTIFRÁGIL: más fuerte ante cada desafío, más consciente ante cada oportunidad, más auténtica ante cada elección. Tu revolución personal ya comenzó el día de tu cumpleaños. Ahora solo queda VIVÍRLA con cada respiración.`,
      pregunta_reflexion: `¿Qué versión de ti misma elegirás manifestar este año, ${userName}: la VALIENTE y AUTÉNTICA que reclama su poder, o la cómoda y conocida que se esconde por miedo al juicio?`
    }
  };
}

// ==========================================
// 🛠️ HELPER FUNCTIONS
// ==========================================

function getHouseMeaning(house: number): string {
  const meanings: Record<number, string> = {
    1: 'Identidad personal, imagen pública, cuerpo físico',
    2: 'Recursos propios, autoestima, valores materiales',
    3: 'Comunicación, hermanos, entorno cercano, estudios',
    4: 'Hogar, familia, raíces, vida privada',
    5: 'Creatividad, hijos, romance, autoexpresión',
    6: 'Trabajo diario, salud, rutinas, servicio',
    7: 'Relaciones uno a uno, matrimonio, socios',
    8: 'Transformación, sexualidad, recursos compartidos',
    9: 'Filosofía, viajes largos, educación superior',
    10: 'Carrera profesional, estatus social, vocación pública',
    11: 'Amistades, grupos, proyectos colectivos, sueños',
    12: 'Espiritualidad, inconsciente, retiro, sanación'
  };
  return meanings[house] || 'Desarrollo personal';
}

function generateAngularPlanets(chart: any) {
  const angularHouses = [1, 4, 7, 10];
  const angularPlanets = chart?.planets?.filter((p: any) => 
    angularHouses.includes(p.house)
  ) || [];

  return angularPlanets.slice(0, 3).map((planet: any) => ({
    planeta: planet.name,
    angulo: `Casa ${planet.house}`,
    interpretacion: `${planet.name} en Casa ${planet.house} tiene PODER DOMINANTE este año - su energía se manifiesta con máxima intensidad`
  }));
}

function getMonthName(year: number, monthIndex: number): string {
  const date = new Date(year, monthIndex, 1);
  return date.toLocaleDateString('es-ES', { month: 'long' });
}

function generateLunarCalendar(year: number) {
  const meses = [
    'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'
  ];

  const signos = [
    'Acuario', 'Piscis', 'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio'
  ];

  return meses.map((mes, i) => ({
    mes: `${mes} ${year + (i === 11 ? 1 : 0)}`,
    luna_nueva: {
      fecha: `${mes} ${year + (i === 11 ? 1 : 0)}`,
      signo: signos[i],
      mensaje: `Momento de plantar intenciones nuevas en el área de ${signos[i]} - sembrar con intención radical`
    },
    luna_llena: {
      fecha: `${mes} ${year + (i === 11 ? 1 : 0)}`,
      signo: signos[(i + 6) % 12],
      mensaje: `Momento de culminación y liberación en ${signos[(i + 6) % 12]} - soltar lo que ya no sirve sin apegos`
    }
  }));
}

function generateKeyEvents(year: number, sunHouse: number) {
  return [
    {
      periodo: 'Mes 1 (Inicio Solar Return)',
      evento: 'Activación del Ciclo Anual',
      tipo: 'Iniciación Crítica',
      descripcion: `Las primeras 4 semanas post-cumpleaños marcan el TONO de todo el año. Cada acción cuenta DOBLE. Cada decisión establece precedentes. Cada compromiso se vuelve patrón.`,
      planetas_involucrados: ['Sol SR', 'Ascendente SR'],
      accion_recomendada: `Ritual de cumpleaños consciente. Escribir intenciones anuales con máxima claridad. Establecer compromiso inquebrantable con tu revolución personal.`
    },
    {
      periodo: 'Mes 3 (Primera Cuadratura Solar)',
      evento: 'Primer Checkpoint de Realidad',
      tipo: 'Desafío Necesario',
      descripcion: `Sol transitando 90° desde posición SR. MOMENTO DE VERDAD: ¿estás alineada con tus intenciones o solo hablando de ellas? La realidad te muestra sin filtros si estás ACTUANDO o solo soñando.`,
      accion_recomendada: `Evaluación brutal de progreso. Ajustar estrategia SIN excusas. Eliminar lo que no está funcionando AHORA.`
    },
    {
      periodo: 'Mes 6 (Primer Trígono Solar)',
      evento: 'Flujo y Momentum Cósmico',
      tipo: 'Ventana de Oportunidad',
      descripcion: `Sol transitando 120° desde SR. TODO fluye SI hiciste el trabajo previo. Las oportunidades se abren como dominó. Momento de CAPITALIZAR esfuerzos anteriores con acción decidida.`,
      accion_recomendada: `Expansión consciente. Aprovechar ventana de oportunidad con valentía. Decir SÍ a lo que antes te daba miedo.`
    },
    {
      periodo: 'Mes 7 (Oposición Solar)',
      evento: 'MOMENTO DE VERDAD DEFINITIVO',
      tipo: 'Revelación Total',
      descripcion: `Sol opuesto a posición SR (crítico según metodología Louis). VES con claridad TOTAL: ¿funcionó tu estrategia o no? Sin filtros, sin autoengaño, sin excusas. La realidad es tu espejo más honesto.`,
      accion_recomendada: `Celebrar logros auténticos SIN minimizar. CORREGIR lo que falló sin culpa. Decisiones DEFINITIVAS para segundo semestre basadas en HECHOS.`
    },
    { 
   
      periodo: 'Mes 9 (Cosecha Visible)',
      evento: 'Manifestación Tangible de Resultados',
      tipo: 'Culminación Observable',
      descripcion: `Frutos de tu trabajo se vuelven VISIBLES para todos. Si trabajaste con intención, cosecharás abundancia. Si no, verás el vacío con honestidad brutal. No hay trucos aquí - solo CONSECUENCIAS de elecciones previas.`,
      accion_recomendada: `Documentar logros tangibles con evidencia concreta. Capitalizar éxitos públicamente. Integrar aprendizajes profundos del ciclo.`
    },
    {
      periodo: 'Mes 12 (Cierre Pre-Cumpleaños)',
      evento: 'Integración y Preparación para Nuevo Ciclo',
      tipo: 'Transición Consciente',
      descripcion: `Sol se acerca a posición natal original. Último mes para cerrar ciclos conscientes, hacer balance real y preparar siguiente revolución solar. Tiempo de gratitud profunda por TODAS las experiencias - tanto victorias como lecciones dolorosas.`,
      accion_recomendada: `Ritual de cierre ceremonial. Journaling profundo: ¿Qué aprendí REALMENTE? ¿Quién soy AHORA vs hace un año? Gratitud radical por transformaciones vividas.`
    }
  ];
}