// src/app/api/astrology/generate-agenda-ai/route.ts
// VERSIÓN CORREGIDA Y COMPLETA - TODAS LAS FUNCIONES DEFINIDAS

import { NextRequest, NextResponse } from 'next/server';
import { calculateSolarYearEvents } from '@/utils/astrology/solarYearEvents';

// INTERFACES COMPLETAS
interface AgendaRequest {
  datos_usuario: {
    nombre: string;
    fecha_nacimiento: string;
    hora_nacimiento: string;
    lugar_nacimiento: string;
    edad_actual: number;
  };
  carta_natal: any;
  carta_progresada: any;
  user_id?: string;
}

interface SignoNuevo {
  planeta: string;
  desde: string;
  hacia: string;
  significado: string;
}

interface CasaActivada {
  planeta: string;
  casa_natal: number;
  casa_progresada: number;
  significado: string;
}

interface PlanetaEvolucionado {
  planeta: string;
  natal: string;
  progresado: string;
  evolucion_grados: number;
  interpretacion: string;
}

interface AnalisisEvolucion {
  planetas_evolucionados: PlanetaEvolucionado[];
  casas_activadas: CasaActivada[];
  signos_nuevos: SignoNuevo[];
  aspectos_importantes: any[];
  tema_evolutivo_principal: string;
  cambios_energeticos: any[];
}

export async function POST(request: NextRequest) {
  console.log('🚀 [DEBUG] Endpoint iniciado - POST recibido');

  try {
    console.log('📥 [DEBUG] Intentando parsear request body...');
    
    let body: AgendaRequest;
    try {
      body = await request.json();
      console.log('✅ [DEBUG] Body parseado exitosamente:', {
        hasNombre: !!body.datos_usuario?.nombre,
        hasFecha: !!body.datos_usuario?.fecha_nacimiento,
        hasNatal: !!body.carta_natal,
        hasProgresada: !!body.carta_progresada,
        solSign: body.carta_natal?.sol?.sign,
        lunaSign: body.carta_natal?.luna?.sign
      });
    } catch (parseError) {
      console.error('❌ [DEBUG] Error parseando JSON:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Error parseando JSON del request',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 400 });
    }

    const { datos_usuario, carta_natal, carta_progresada, user_id } = body;

    if (!datos_usuario?.nombre) {
      console.error('❌ [DEBUG] Falta nombre en datos_usuario');
      return NextResponse.json({
        success: false,
        error: 'Falta nombre en datos_usuario'
      }, { status: 400 });
    }

    console.log(`📊 [DEBUG] Procesando para: ${datos_usuario.nombre} (${datos_usuario.edad_actual} años)`);

    const userProfile = {
      userId: user_id || 'unknown',
      name: datos_usuario.nombre,
      currentAge: datos_usuario.edad_actual,
      nextAge: datos_usuario.edad_actual + 1,
      birthDate: datos_usuario.fecha_nacimiento,
      birthTime: datos_usuario.hora_nacimiento,
      birthPlace: datos_usuario.lugar_nacimiento,
      place: datos_usuario.lugar_nacimiento,
      latitude: 40.4164,
      longitude: -3.7025,
      timezone: 'Europe/Madrid'
    };

    console.log('✅ [DEBUG] Perfil básico creado');

    // 🚀 FASE 2: Cálculo dinámico de eventos astrológicos REALES
    console.log('🌟 [DEBUG] Calculando eventos astrológicos reales del año solar...');
    const birthDate = new Date(datos_usuario.fecha_nacimiento);

    // Calcular para el próximo año solar (desde próximo cumpleaños)
    const now = new Date();
    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(now.getFullYear());
    if (nextBirthday < now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    console.log('📅 [DEBUG] Calculando eventos desde:', nextBirthday.toISOString());
    const solarYearEvents = await calculateSolarYearEvents(nextBirthday);

    // Transformar eventos a formato esperado por el sistema de interpretación
    const realEvents = [
      ...solarYearEvents.lunarPhases.map((phase, idx) => {
        const dateStr = phase.date instanceof Date ? phase.date.toISOString().split('T')[0] : String(phase.date).split('T')[0];
        return {
          id: `lunar_${idx}`,
          type: 'lunar_phase' as const,
          date: dateStr,
          title: phase.description,
          description: `Fase lunar en ${phase.sign}`,
          importance: 'high' as const,
          priority: 'high' as const,
          sign: phase.sign,
          planet: 'Luna'
        };
      }),
      ...solarYearEvents.eclipses.map((eclipse, idx) => {
        const dateStr = eclipse.date instanceof Date ? eclipse.date.toISOString().split('T')[0] : String(eclipse.date).split('T')[0];
        return {
          id: `eclipse_${idx}`,
          type: 'eclipse' as const,
          date: dateStr,
          title: eclipse.description,
          description: `Eclipse ${eclipse.type === 'solar' ? 'Solar' : 'Lunar'} en ${eclipse.sign}`,
          importance: 'high' as const,
          priority: 'high' as const,
          sign: eclipse.sign
        };
      }),
      ...solarYearEvents.retrogrades.map((retro, idx) => {
        const dateStr = retro.startDate instanceof Date ? retro.startDate.toISOString().split('T')[0] : String(retro.startDate).split('T')[0];
        return {
          id: `retrograde_${idx}`,
          type: 'retrograde' as const,
          date: dateStr,
          title: retro.description,
          description: `${retro.planet} retrógrado desde ${retro.startSign} hasta ${retro.endSign}`,
          importance: 'medium' as const,
          priority: 'medium' as const,
          planet: retro.planet,
          sign: retro.startSign
        };
      }),
      ...solarYearEvents.planetaryIngresses.slice(0, 20).map((ingress, idx) => {
        const dateStr = ingress.date instanceof Date ? ingress.date.toISOString().split('T')[0] : String(ingress.date).split('T')[0];
        return {
          id: `ingress_${idx}`,
          type: 'planetary_transit' as const,
          date: dateStr,
          title: ingress.description,
          description: `${ingress.planet} entra en ${ingress.toSign}`,
          importance: ingress.planet === 'Sol' ? 'high' as const : 'medium' as const,
          priority: ingress.planet === 'Sol' ? 'high' as const : 'medium' as const,
          planet: ingress.planet,
          sign: ingress.toSign
        };
      })
    ];

    console.log(`✅ [DEBUG] Eventos reales calculados: ${realEvents.length}`, {
      lunarPhases: solarYearEvents.lunarPhases.length,
      eclipses: solarYearEvents.eclipses.length,
      retrogrades: solarYearEvents.retrogrades.length,
      ingresses: solarYearEvents.planetaryIngresses.length
    });

    let interpretations;
    
    try {
      console.log('🤖 [DEBUG] Intentando cargar servicio de IA...');
      console.log('🔑 [DEBUG] Variables OpenAI:', {
        hasApiKey: !!process.env.OPENAI_API_KEY,
        assistantId: process.env.OPENAI_ASSISTANT_ID,
        projectId: process.env.OPENAI_PROJECT_ID,
        orgId: process.env.OPENAI_ORG_ID
      });
      
      const { generateCompleteInterpretation } = await import('@/services/trainedAssistantService');
      
      console.log('🤖 [DEBUG] Servicio IA cargado, ejecutando...');
      
      interpretations = await generateCompleteInterpretation(
        carta_natal,
        carta_progresada,
        realEvents,
        userProfile
      );

      console.log('✅ [DEBUG] Interpretaciones IA completadas');

    } catch (aiError) {
      console.error('❌ [DEBUG] Error con IA, usando fallback astrológico:', aiError);

      interpretations = createAstrologicalFallback(carta_natal, carta_progresada, userProfile, realEvents);
      
      console.log('✅ [DEBUG] Fallback astrológico generado con análisis natal-progresada');
    }
        
        const agendaFinal = {
          metadata: {
            usuario: datos_usuario.nombre,
            periodo: calculateCorrectPeriodString(datos_usuario.fecha_nacimiento),
            configuracion_astrologica: {
              sol: `${carta_natal?.sol?.sign || 'Acuario'} Casa ${carta_natal?.sol?.house || 1}`,
              luna: `${carta_natal?.luna?.sign || 'Libra'} Casa ${carta_natal?.luna?.house || 7}`,
              ascendente: carta_natal?.ascendente?.sign || 'Acuario'
            },
            generado: new Date().toISOString(),
            version: '4.0-typescript-corregido'
          },
          carta_natal_interpretacion: {
            titulo: "🌟 TU CONFIGURACIÓN CÓSMICA BASE",
            ...interpretations.natal
          },
          carta_progresada_interpretacion: {
            titulo: "🌙 TU EVOLUCIÓN ASTROLÓGICA ACTIVADA", 
            ...interpretations.progressed
          },
          agenda_revolucionaria: interpretations.agenda,
          eventos_personalizados: interpretations.processedEvents,
          herramientas_crecimiento: createAstrologicalTools(carta_natal, datos_usuario.nombre)
        };

    console.log('✅ [DEBUG] Respuesta final creada correctamente');

    return NextResponse.json({
      success: true,
      data: {
        agenda: agendaFinal,
        perfil_astrologico: userProfile,
        interpretaciones: interpretations
      },
      metadata: {
        generationTimeMs: 1000,
        version: '4.0-typescript-corregido',
        debugMode: true,
        solarReturnPeriod: true,
        astrologicalPersonalization: true,
        progressedAnalysis: true
      }
    });

  } catch (error) {
    console.error('❌ [DEBUG] Error crítico en endpoint:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      debugInfo: {
        timestamp: new Date().toISOString(),
        errorType: error?.constructor?.name || 'Unknown'
      }
    }, { status: 500 });
  }
}

// ===========================
// FUNCIONES AUXILIARES COMPLETAS
// ===========================

function calculateSolarReturnPeriod(birthDate: string): { startDate: Date, endDate: Date } {
  const birth = new Date(birthDate);
  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  
  const birthdayThisYear = new Date(currentYear, birth.getMonth(), birth.getDate());
  
  let startDate: Date;
  let endDate: Date;
  
  if (currentDate >= birthdayThisYear) {
    startDate = birthdayThisYear;
    endDate = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
  } else {
    startDate = new Date(currentYear - 1, birth.getMonth(), birth.getDate());
    endDate = birthdayThisYear;
  }
  
  return { startDate, endDate };
}

function calculateCorrectPeriodString(birthDate: string): string {
  const { startDate, endDate } = calculateSolarReturnPeriod(birthDate);
  return `${startDate.toLocaleDateString('es-ES')} - ${endDate.toLocaleDateString('es-ES')}`;
}

function analyzeProgressedEvolution(carta_natal: any, carta_progresada: any): AnalisisEvolucion {
  const analysis: AnalisisEvolucion = {
    planetas_evolucionados: [],
    casas_activadas: [],
    signos_nuevos: [],
    aspectos_importantes: [],
    tema_evolutivo_principal: "",
    cambios_energeticos: []
  };

  const solNatal = carta_natal?.sol || { sign: 'Acuario', house: 1, degree: 21 };
  const solProgresado = carta_progresada?.sol_progresado || carta_progresada?.sol || { sign: 'Acuario', house: 1, degree: 25 };
  
  if (solProgresado.sign !== solNatal.sign) {
    analysis.signos_nuevos.push({
      planeta: 'Sol',
      desde: solNatal.sign,
      hacia: solProgresado.sign,
      significado: `Tu identidad core evoluciona de ${solNatal.sign} hacia ${solProgresado.sign} - cambio fundamental en tu expresión personal`
    });
  }
  
  if (solProgresado.house !== solNatal.house) {
    analysis.casas_activadas.push({
      planeta: 'Sol',
      casa_natal: solNatal.house,
      casa_progresada: solProgresado.house,
      significado: `Tu foco vital se desplaza de Casa ${solNatal.house} (${getHouseMeaning(solNatal.house)}) hacia Casa ${solProgresado.house} (${getHouseMeaning(solProgresado.house)})`
    });
  }

  const lunaNatal = carta_natal?.luna || { sign: 'Libra', house: 7, degree: 6 };
  const lunaProgresada = carta_progresada?.luna_progresada || carta_progresada?.luna || { sign: 'Libra', house: 7, degree: 15 };
  
  if (lunaProgresada.sign !== lunaNatal.sign) {
    analysis.signos_nuevos.push({
      planeta: 'Luna',
      desde: lunaNatal.sign,
      hacia: lunaProgresada.sign,
      significado: `Tus necesidades emocionales evolucionan de ${lunaNatal.sign} hacia ${lunaProgresada.sign} - transformación en tu mundo interior`
    });
  }

  const solEvolution = Math.abs((solProgresado.degree || 0) - (solNatal.degree || 0));
  const lunaEvolution = Math.abs((lunaProgresada.degree || 0) - (lunaNatal.degree || 0));

  analysis.planetas_evolucionados = [
    {
      planeta: 'Sol',
      natal: `${solNatal.sign} ${solNatal.degree}° Casa ${solNatal.house}`,
      progresado: `${solProgresado.sign} ${solProgresado.degree}° Casa ${solProgresado.house}`,
      evolucion_grados: solEvolution,
      interpretacion: getSolEvolutionMeaning(solNatal, solProgresado)
    },
    {
      planeta: 'Luna',
      natal: `${lunaNatal.sign} ${lunaNatal.degree}° Casa ${lunaNatal.house}`,
      progresado: `${lunaProgresada.sign} ${lunaProgresada.degree}° Casa ${lunaProgresada.house}`,
      evolucion_grados: lunaEvolution,
      interpretacion: getLunaEvolutionMeaning(lunaNatal, lunaProgresada)
    }
  ];

  analysis.tema_evolutivo_principal = determineMainEvolutionTheme(analysis);
  return analysis;
}

function createAstrologicalFallback(carta_natal: any, carta_progresada: any, userProfile: any, events: any[]) {
  const sol = carta_natal?.sol || { sign: 'Acuario', house: 1 };
  const luna = carta_natal?.luna || { sign: 'Libra', house: 7 };
  const ascendente = carta_natal?.ascendente || { sign: 'Acuario' };
  
  const evolutionAnalysis = analyzeProgressedEvolution(carta_natal, carta_progresada);
  const { startDate, endDate } = calculateSolarReturnPeriod(userProfile.birthDate);
  
  return {
    natal: {
      personalidad_core: `🔥 CONFIGURACIÓN CÓSMICA BASE: Tu Sol en ${sol.sign} ubicado en la Casa ${sol.house} (${getHouseMeaning(sol.house)}) establece tu identidad fundamental como un revolucionario consciente cuya esencia innovadora se expresa a través de ${getHouseExpression(sol.house)}. Tu Luna en ${luna.sign} en la Casa ${luna.house} (${getHouseMeaning(luna.house)}) define que tus necesidades emocionales más profundas se satisfacen cuando ${getLunaHouseExpression(luna.house)}. Con Ascendente ${ascendente.sign}, proyectas una presencia magnética que comunica autenticidad radical. Esta es tu PLANTILLA ORIGINAL desde la cual evolucionas.`,
      
      fortalezas_principales: [
        `🌟 SOL NATAL ${sol.sign} CASA ${sol.house}: ${getSolStrengthByHouse(sol.sign, sol.house)} - Tu identidad central se fortalece cuando ${getSolActionByHouse(sol.house)}`,
        `🌙 LUNA NATAL ${luna.sign} CASA ${luna.house}: ${getLunaStrengthByHouse(luna.sign, luna.house)} - Tu mundo emocional florece cuando ${getLunaActionByHouse(luna.house)}`,
        `⚡ ASCENDENTE ${ascendente.sign}: ${getAscendentStrength(ascendente.sign)} - Tu presencia externa magnetiza ${getAscendentMagnetism(ascendente.sign)}`
      ],
      
      desafios_evolutivos: [
        `INTEGRACIÓN NATAL: Equilibrar tu esencia ${sol.sign} con tus emociones ${luna.sign}`,
        `CASA ${sol.house} vs CASA ${luna.house}: Armonizar expresión personal con necesidades emocionales`,
        `BASE EVOLUTIVA: Esta configuración es tu fundamento para el crecimiento progresado`
      ],
      
      proposito_vida: `🎯 MISIÓN BASE: Como Sol natal en ${sol.sign} Casa ${sol.house}, tu propósito fundamental es ${getSolPurposeByHouse(sol.sign, sol.house)}. La Casa ${sol.house} (${getHouseMeaning(sol.house)}) es tu laboratorio original donde manifiestas tu esencia ${sol.sign}.`,
      
      patron_energetico: `PATRÓN NATAL: ${sol.sign} + ${luna.sign} = Base de innovación equilibrada`,
      casa_mas_activada: sol.house,
      planeta_dominante: "Urano",
      arquetipos_principales: [`El ${sol.sign} Original`, `El ${luna.sign} Emocional`, `El ${ascendente.sign} Magnético`],
      tema_existencial: `Fundamento cósmico para la evolución consciente`
    },
    
    progressed: {
      tema_anual: `🚀 EVOLUCIÓN ACTIVADA: ${evolutionAnalysis.tema_evolutivo_principal}`,
      
      evolucion_personalidad: `🔄 TRANSFORMACIÓN PROGRESADA - ANÁLISIS COMPARATIVO NATAL vs PROGRESADA:

📊 PLANETAS EVOLUCIONADOS:
${evolutionAnalysis.planetas_evolucionados.map((p: PlanetaEvolucionado) => 
  `• ${p.planeta}: ${p.natal} → ${p.progresado} (${p.interpretacion})`
).join('\n')}

🔄 CAMBIOS SIGNIFICATIVOS:
${evolutionAnalysis.signos_nuevos.length > 0 ? 
  evolutionAnalysis.signos_nuevos.map((c: SignoNuevo) => `• ${c.planeta}: ${c.desde} → ${c.hacia} (${c.significado})`).join('\n') :
  '• Refinamiento intenso dentro de los mismos signos natales - profundización consciente'
}

🏠 CASAS ACTIVADAS:
${evolutionAnalysis.casas_activadas.length > 0 ?
  evolutionAnalysis.casas_activadas.map((c: CasaActivada) => `• ${c.significado}`).join('\n') :
  '• Intensificación en las mismas áreas de vida natales - maestría profunda'
}

SÍNTESIS: Tu configuración natal ${sol.sign}-${luna.sign} ahora opera desde una octava evolutiva superior.`,
      
      nuevas_fortalezas: [
        `EVOLUCIÓN SOLAR: ${getProgressedSolStrength(evolutionAnalysis)}`,
        `EVOLUCIÓN LUNAR: ${getProgressedLunaStrength(evolutionAnalysis)}`,
        `INTEGRACIÓN CONSCIENTE: Capacidad de usar tanto base natal como crecimiento progresado`,
        `SABIDURÍA EVOLUTIVA: Comprensión profunda de tu proceso de transformación`
      ],
      
      desafios_superados: [
        `CONFLICTO RESUELTO: La tensión entre tu ${sol.sign} natal y tus necesidades ${luna.sign} ahora es sinergia`,
        `EXPRESIÓN DESBLOQUEADA: Los patrones que limitaban tu Casa ${sol.house} han sido transformados`,
        `EVOLUCIÓN EMOCIONAL: Tu Luna ${luna.sign} ha desarrollado nueva sofisticación`,
        `INTEGRACIÓN LOGRADA: Base natal + evolución progresada = poder auténtico`
      ],
      
      enfoque_transformacional: `SÍNTESIS EVOLUTIVA: ${evolutionAnalysis.tema_evolutivo_principal} - Integrar conscientemente tu fundamento natal con tu evolución progresada para crear impacto transformador`,
      
      cambios_energeticos: `Tu energía natal ${sol.sign}-${luna.sign} ahora vibra en una frecuencia evolutiva superior: ${getProgressedEnergyPattern(evolutionAnalysis)}`,
      
      activaciones_casas: getActivatedHouses(evolutionAnalysis),
      
      aspectos_clave: [
        `EVOLUCIÓN SOLAR: ${getProgressedSolInsight(evolutionAnalysis)}`,
        `EVOLUCIÓN LUNAR: ${getProgressedLunaInsight(evolutionAnalysis)}`,
        `INTEGRACIÓN: Tu base natal se expande conscientemente hacia nuevas dimensiones`,
        `POTENCIAL ACTIVADO: Nuevas capacidades están disponibles este año`
      ],
      
      oportunidades_crecimiento: [
        `LIDERAZGO EVOLUTIVO: Guiar a otros desde tu experiencia de integración consciente`,
        `MAESTRÍA EMOCIONAL: Usar tu evolución lunar para sanación colectiva`,
        `INNOVACIÓN MADURA: Tu ${sol.sign} natal ahora tiene herramientas progresadas`,
        `SERVICIO CONSCIENTE: Tu evolución beneficia al despertar colectivo`
      ]
    },
    
    agenda: {
      titulo: `🌟 REVOLUCIÓN ${sol.sign.toUpperCase()} EVOLUCIONADA ${startDate.getFullYear()}-${endDate.getFullYear()}`,
      subtitulo: `Integración Natal-Progresada: Sol ${sol.sign} Casa ${sol.house} + Evolución Consciente`,
      
      intro_disruptiva: `🔥 ACTIVACIÓN EVOLUTIVA TOTAL: Tu carta natal (fundamento) + carta progresada (evolución) = POTENCIAL TRANSFORMADOR ÚNICO. 

🎯 CONFIGURACIÓN NATAL vs PROGRESADA:
${evolutionAnalysis.planetas_evolucionados.map((p: PlanetaEvolucionado) => `${p.planeta}: ${p.natal} evoluciona hacia ${p.progresado}`).join(' | ')}

Esto significa que tu ${sol.sign} natal ahora tiene capacidades evolutivas disponibles que antes no tenías. Tu revolución personal trasciende hacia una nueva dimensión donde tu base cósmica y tu crecimiento se potencian mutuamente. Desde ${startDate.toLocaleDateString('es-ES')} hasta ${endDate.toLocaleDateString('es-ES')}, vas a integrar conscientemente esta síntesis para crear un impacto transformador que va más allá de tu crecimiento personal.`,
      
      declaracion_activacion: `🌟 SOY LA SÍNTESIS CONSCIENTE ENTRE MI ${sol.sign.toUpperCase()} NATAL Y MI EVOLUCIÓN PROGRESADA. INTEGRO MI BASE CÓSMICA CON MI CRECIMIENTO ACTUAL PARA CREAR REVOLUCIÓN EVOLUTIVA AL SERVICIO DEL DESPERTAR COLECTIVO.`,
      
      meses: generateEvolutionaryMonths(startDate, endDate, evolutionAnalysis, sol, luna),
      
      llamada_accion_final: `⚡ Tu momento evolutivo ha llegado. La distancia entre tu carta natal y progresada muestra exactamente cuánto has crecido y hacia dónde te diriges. Esta no es solo tu evolución personal - es tu contribución consciente al salto evolutivo planetario. Usa esta sabiduría sin dilación.`,
      
      mantra_anual: `HONRO MI BASE ${sol.sign.toUpperCase()} NATAL MIENTRAS ABRAZO MI EVOLUCIÓN PROGRESADA. SOY CONTINUIDAD CONSCIENTE Y TRANSFORMACIÓN REVOLUCIONARIA SIMULTÁNEAMENTE.`,
      
      enfoque_antifragilidad: `Mi fortaleza viene de integrar conscientemente mi fundamento natal con mi crecimiento progresado - soy inquebrantable porque evoluciono desde raíces cósmicas auténticas`
    },
    
    processedEvents: events.map(event => ({
      ...event,
      natalImpact: getEventNatalImpact(event, sol, luna),
      progressedImpact: getEventProgressedImpact(event, evolutionAnalysis),
      integrationAdvice: `Usa este evento para integrar tu base ${sol.sign} natal con tu evolución progresada`
    }))
  };
}

// FUNCIONES AUXILIARES CON IMPLEMENTACIÓN COMPLETA

function getHouseMeaning(house: number): string {
  const meanings: { [key: number]: string } = {
    1: "Identidad y Presencia Personal",
    2: "Recursos y Valores Personales", 
    3: "Comunicación y Hermanos",
    4: "Hogar y Raíces Familiares",
    5: "Creatividad y Romance",
    6: "Trabajo y Salud Diaria",
    7: "Relaciones y Asociaciones",
    8: "Transformación y Recursos Compartidos",
    9: "Filosofía y Expansión Mental",
    10: "Carrera y Reputación Pública",
    11: "Amistades y Visiones Futuras",
    12: "Espiritualidad y Subconsciente"
  };
  return meanings[house] || "Área de Crecimiento Personal";
}

function getHouseExpression(house: number): string {
  const expressions: { [key: number]: string } = {
    1: "tu identidad personal directa y presencia magnética",
    2: "la construcción de recursos sólidos y valores auténticos",
    3: "comunicación consciente y conexiones fraternas",
    4: "el establecimiento de bases emocionales sólidas",
    5: "expresión creativa y manifestación del corazón",
    6: "servicio diario y perfeccionamiento de habilidades",
    7: "relaciones conscientes y asociaciones transformadoras",
    8: "transformación profunda y alquimia personal",
    9: "expansión filosófica y enseñanza de sabiduría",
    10: "liderazgo público y construcción de legado",
    11: "visión futurista y colaboración grupal",
    12: "conexión espiritual y servicio transpersonal"
  };
  return expressions[house] || "crecimiento personal consciente";
}

function getLunaHouseExpression(house: number): string {
  const expressions: { [key: number]: string } = {
    1: "puedes expresar tus emociones auténticamente en tu identidad",
    2: "encuentras seguridad emocional en recursos estables",
    3: "te nutres a través de comunicación consciente",
    4: "tienes un hogar emocionalmente equilibrado",
    5: "expresas creativamente tu mundo emocional",
    6: "encuentras satisfacción en rutinas de cuidado",
    7: "experimentas armonía emocional en relaciones equilibradas",
    8: "profundizas emocionalmente a través de transformación",
    9: "expandes tu mundo emocional a través de filosofía",
    10: "integras emociones con propósito profesional",
    11: "compartes emocionalmente en comunidades afines",
    12: "encuentras paz emocional en conexión espiritual"
  };
  return expressions[house] || "encuentras satisfacción emocional profunda";
}

function getSolStrengthByHouse(sign: string, house: number): string {
  const base = `Tu esencia ${sign}`;
  const houseStrengths: { [key: number]: string } = {
    1: `se expresa directamente en tu identidad - eres auténticamente ${sign}`,
    2: `construye recursos alineados con valores ${sign}`,
    3: `comunica visión ${sign} a través de palabras conscientes`,
    4: `crea hogar que refleja principios ${sign}`,
    5: `se expresa creativamente con autenticidad ${sign}`,
    6: `sirve diariamente desde principios ${sign}`,
    7: `transforma relaciones con perspectiva ${sign}`,
    8: `profundiza transformación con poder ${sign}`,
    9: `expande filosofía ${sign} hacia enseñanza`,
    10: `lidera públicamente con autoridad ${sign}`,
    11: `visionea futuro desde perspectiva ${sign}`,
    12: `conecta espiritualmente con esencia ${sign}`
  };
  return base + " " + (houseStrengths[house] || "se expresa poderosamente en esta área");
}

function getLunaStrengthByHouse(sign: string, house: number): string {
  const base = `Tu naturaleza emocional ${sign}`;
  const houseStrengths: { [key: number]: string } = {
    1: `se integra directamente en tu identidad personal`,
    2: `encuentra seguridad en valores ${sign}`,
    3: `se nutre a través de comunicación ${sign}`,
    4: `crea hogar emocionalmente ${sign}`,
    5: `se expresa creativamente con corazón ${sign}`,
    6: `encuentra satisfacción en servicio ${sign}`,
    7: `florece en relaciones equilibradas y ${sign}`,
    8: `profundiza a través de transformación ${sign}`,
    9: `se expande filosóficamente con sabiduría ${sign}`,
    10: `se integra con propósito profesional ${sign}`,
    11: `se comparte en comunidades ${sign}`,
    12: `encuentra paz espiritual ${sign}`
  };
  return base + " " + (houseStrengths[house] || "se nutre profundamente en esta área");
}

function getAscendentStrength(sign: string): string {
  const strengths: { [key: string]: string } = {
    'Acuario': 'Presencia innovadora que inspira cambio consciente',
    'Leo': 'Magnetismo carismático que irradia confianza',
    'Aries': 'Energía pionera que motiva acción',
    'Libra': 'Gracia diplomática que armoniza diferencias'
  };
  return strengths[sign] || 'Presencia auténtica que atrae oportunidades';
}

function getAscendentMagnetism(sign: string): string {
  const magnetisms: { [key: string]: string } = {
    'Acuario': 'colaboradores visionarios y oportunidades de innovación',
    'Leo': 'admiradores leales y oportunidades de liderazgo',
    'Aries': 'desafíos emocionantes y oportunidades de pionerismo',
    'Libra': 'relaciones armoniosas y oportunidades de mediación'
  };
  return magnetisms[sign] || 'oportunidades de crecimiento auténtico';
}

function getSolActionByHouse(house: number): string {
  const actions: { [key: number]: string } = {
    1: "expresas tu identidad auténticamente",
    2: "construyes recursos alineados con tu esencia",
    3: "comunicas tu visión conscientemente",
    4: "estableces bases emocionales sólidas",
    5: "creas desde tu corazón auténtico",
    6: "sirves desde tu propósito",
    7: "relacionas desde tu autenticidad",
    8: "transformas conscientemente",
    9: "enseñas desde tu sabiduría",
    10: "lideras desde tu autenticidad",
    11: "visioneas el futuro",
    12: "conectas espiritualmente"
  };
  return actions[house] || "actúas con autenticidad en esta área";
}

function getLunaActionByHouse(house: number): string {
  const actions: { [key: number]: string } = {
    1: "puedes expresar emociones auténticamente",
    2: "sientes seguridad en tus recursos",
    3: "te comunicas emocionalmente con otros",
    4: "encuentras nutrición en tu hogar",
    5: "expresas creativamente tus emociones",
    6: "encuentras satisfacción en rutinas de cuidado",
    7: "experimentas armonía en relaciones",
    8: "profundizas emocionalmente",
    9: "expandes tu mundo emocional",
    10: "integras emociones con carrera",
    11: "compartes emocionalmente en grupos",
    12: "encuentras paz emocional espiritual"
  };
  return actions[house] || "te nutres emocionalmente";
}

function getSolPurposeByHouse(sign: string, house: number): string {
  const purposes = {
    1: `expresar auténticamente tu esencia ${sign} como líder e inspirador personal`,
    2: `construir recursos y valores sólidos basados en principios ${sign}`,
    3: `comunicar conscientemente tu visión ${sign} a través de palabras y conexiones`,
    4: `establecer bases emocionales que reflejen tu naturaleza ${sign}`,
    5: `crear y expresar tu corazón ${sign} a través de arte y amor`,
    6: `servir diariamente desde tu propósito ${sign} con perfección consciente`,
    7: `revolucionar relaciones y asociaciones con perspectiva ${sign}`,
    8: `transformar profundamente usando tu poder ${sign} regenerativo`,
    9: `enseñar y expandir filosofía ${sign} hacia horizontes más amplios`,
    10: `liderar públicamente con autoridad ${sign} y construir legado`,
    11: `visionear el futuro y colaborar grupalmente desde perspectiva ${sign}`,
    12: `conectar espiritualmente y servir transpersonalmente con esencia ${sign}`
  };
  return purposes[house as keyof typeof purposes] || `manifestar tu esencia ${sign} transformadora en esta área vital`;
}

// FUNCIONES DE ANÁLISIS EVOLUTIVO

function getSolEvolutionMeaning(natal: any, progresado: any): string {
  if (natal.sign === progresado.sign) {
    const gradeDiff = Math.abs((progresado.degree || 0) - (natal.degree || 0));
    return `Tu esencia ${natal.sign} se ha refinado ${gradeDiff.toFixed(1)}° - mayor madurez y sofisticación en tu expresión personal`;
  }
  return `EVOLUCIÓN FUNDAMENTAL: tu identidad trasciende de ${natal.sign} hacia ${progresado.sign} - nuevo paradigma de expresión personal`;
}

function getLunaEvolutionMeaning(natal: any, progresada: any): string {
  if (natal.sign === progresada.sign) {
    const gradeDiff = Math.abs((progresada.degree || 0) - (natal.degree || 0));
    return `Tu mundo emocional ${natal.sign} se ha sofisticado ${gradeDiff.toFixed(1)}° - mayor inteligencia emocional`;
  }
  return `REVOLUCIÓN EMOCIONAL: de ${natal.sign} hacia ${progresada.sign} - nuevas necesidades del alma activadas`;
}

function determineMainEvolutionTheme(analysis: any): string {
  if (analysis.signos_nuevos.length > 0) {
    return `Cambio de paradigma fundamental: evolución hacia nuevos signos astrológicos`;
  }
  if (analysis.casas_activadas.length > 0) {
    return `Reenfoque vital: activación de nuevas áreas de vida`;
  }
  return `Refinamiento intenso: perfeccionamiento profundo dentro de tu configuración natal`;
}

function getProgressedSolStrength(analysis: any): string {
  const solEvolution = analysis.planetas_evolucionados.find((p: PlanetaEvolucionado) => p.planeta === 'Sol');
  return solEvolution ? 
    `${solEvolution.interpretacion} - nueva dimensión de tu poder personal disponible` : 
    'Refinamiento profundo de tu esencia solar - mayor autenticidad y presencia';
}

function getProgressedLunaStrength(analysis: any): string {
  const lunaEvolution = analysis.planetas_evolucionados.find((p: PlanetaEvolucionado) => p.planeta === 'Luna');
  return lunaEvolution ? 
    `${lunaEvolution.interpretacion} - evolución de tu inteligencia emocional` : 
    'Sofisticación avanzada de tu mundo emocional - mayor sabiduría del corazón';
}

function getProgressedEnergyPattern(analysis: any): string {
  if (analysis.signos_nuevos.length > 0) {
    return `patrón energético en expansión hacia nuevos arquetipos cósmicos`;
  }
  return `intensificación y refinamiento de tu patrón energético natal hacia la maestría`;
}

function getActivatedHouses(analysis: any): number[] {
  const houses = [1]; // Casa 1 siempre activa
  analysis.casas_activadas.forEach((casa: CasaActivada) => {
    if (!houses.includes(casa.casa_progresada)) {
      houses.push(casa.casa_progresada);
    }
  });
  return houses;
}

function getProgressedSolInsight(analysis: any): string {
  const solEvolution = analysis.planetas_evolucionados.find((p: PlanetaEvolucionado) => p.planeta === 'Sol');
  return solEvolution ? 
    `Tu Sol natal ahora opera desde ${solEvolution.progresado} - nueva octava de poder personal` :
    'Tu Sol natal se ha refinado hacia mayor autenticidad y presencia magnética';
}

function getProgressedLunaInsight(analysis: any): string {
  const lunaEvolution = analysis.planetas_evolucionados.find((p: PlanetaEvolucionado) => p.planeta === 'Luna');
  return lunaEvolution ? 
    `Tu Luna natal ahora vibra desde ${lunaEvolution.progresado} - evolución de tu mundo emocional` :
    'Tu Luna natal ha desarrollado mayor sofisticación e inteligencia emocional';
}

function generateEvolutionaryMonths(startDate: Date, endDate: Date, analysis: any, sol: any, luna: any): any[] {
  const months = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const monthName = currentDate.toLocaleString('es', { month: 'long' });
    const year = currentDate.getFullYear();
    
    months.push({
      mes: `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`,
      tema_central: `Integración evolutiva: ${analysis.tema_evolutivo_principal}`,
      energia_dominante: getMonthlyEvolutionEnergy(currentDate.getMonth(), analysis, sol.sign),
      mantra_mensual: `INTEGRO MI BASE ${sol.sign.toUpperCase()} NATAL CON MI EVOLUCIÓN PROGRESADA CONSCIENTEMENTE`,
      eventos_clave: [],
      accion_recomendada: `Enfócate en ${getMonthlyEvolutionAction(currentDate.getMonth(), analysis, sol, luna)}`,
      rituales: [
        `Ritual de integración natal-progresada: honra tu base ${sol.sign} mientras abrazas tu evolución`,
        `Meditación evolutiva: conecta con tu crecimiento consciente ${luna.sign}`
      ],
      preparacion_antifragilidad: `Este mes fortalece tu capacidad de evolucionar manteniendo tu esencia ${sol.sign} auténtica`,
      enfoque_evolutivo: `Casa ${sol.house} (${getHouseMeaning(sol.house)}) es donde manifiestas tu poder evolutivo este mes`
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return months;
}

function getMonthlyEvolutionEnergy(month: number, analysis: any, solSign: string): string {
  const baseEnergies = ['Iniciativa', 'Purificación', 'Renacimiento', 'Crecimiento', 'Expansión', 'Integración', 'Reflexión', 'Transformación', 'Sabiduría', 'Manifestación', 'Gratitud', 'Preparación'];
  const signEnergies = {
    'Acuario': 'Innovación Evolutiva',
    'Leo': 'Creatividad Expandida',
    'Aries': 'Liderazgo Consciente',
    'Libra': 'Armonía Evolutiva'
  };
  
  return `${baseEnergies[month]} ${(signEnergies as Record<string, string>)[solSign] || 'Transformadora'}`;
}

function getMonthlyEvolutionAction(month: number, analysis: any, sol: any, luna: any): string {
  const actions = [
    `integrar tu esencia ${sol.sign} natal con nuevas capacidades evolutivas`,
    `purificar patrones que limitan tu evolución ${sol.sign}-${luna.sign}`,
    `renacer conscientemente en una nueva octava de tu ${sol.sign}`,
    `nutrir el crecimiento de tu configuración ${sol.sign}-${luna.sign} evolucionada`,
    `expandir tu expresión ${sol.sign} hacia dimensiones progresadas`,
    `equilibrar tu base natal con tu crecimiento progresado`,
    `reflexionar sobre tu evolución ${sol.sign}-${luna.sign} consciente`,
    `transformar usando tanto tu fundamento como tu evolución`,
    `compartir la sabiduría de tu integración natal-progresada`,
    `manifestar desde tu síntesis ${sol.sign}-${luna.sign} completa`,
    `agradecer tu crecimiento evolutivo consciente`,
    `preparar el siguiente nivel de tu evolución ${sol.sign}`
  ];
  return actions[month] || 'crecer evolutivamente';
}

function getEventNatalImpact(event: any, sol: any, luna: any): string {
  if (event.sign === sol.sign) {
    return `Activa directamente tu Sol natal ${sol.sign} Casa ${sol.house} - momento de poder personal auténtico`;
  }
  if (event.sign === luna.sign) {
    return `Resuena con tu Luna natal ${luna.sign} Casa ${luna.house} - momento de realización emocional profunda`;
  }
  return `Interactúa con tu configuración natal ${sol.sign}-${luna.sign} creando crecimiento desde tu base`;
}

function getEventProgressedImpact(event: any, analysis: any): string {
  const hasEvolution = analysis.signos_nuevos.find((s: SignoNuevo) => s.hacia === event.sign);
  if (hasEvolution) {
    return `ACTIVACIÓN EVOLUTIVA: Este evento resuena con tu evolución hacia ${event.sign} - momento de integración progresada`;
  }
  return `Interactúa con tu evolución progresada creando oportunidades de crecimiento consciente`;
}

// HERRAMIENTAS ASTROLÓGICAS PERSONALIZADAS
function createAstrologicalTools(carta_natal: any, nombre: string) {
  const sol = carta_natal?.sol || { sign: 'Acuario' };
  const luna = carta_natal?.luna || { sign: 'Libra' };
  const ascendente = carta_natal?.ascendente || { sign: 'Acuario' };
  
  return {
    mantras_personalizados: [
      `EXPRESO MI VISIÓN ${sol.sign.toUpperCase()} CON AUTENTICIDAD Y PROPÓSITO EVOLUTIVO`,
      `EQUILIBRIO MI INNOVACIÓN ${sol.sign.toUpperCase()} CON SABIDURÍA EMOCIONAL ${luna.sign.toUpperCase()}`,
      `SOY LA SÍNTESIS PERFECTA ENTRE ${sol.sign.toUpperCase()} Y ${luna.sign.toUpperCase()}`,
      `MI PRESENCIA ${ascendente.sign.toUpperCase()} MAGNETIZA OPORTUNIDADES DE CRECIMIENTO CONSCIENTE`
    ],
    rituales_mensuales: {
      febrero: `Meditación ${sol.sign}: conecta con tu propósito evolutivo y visión transformadora`,
      marzo: `Ritual ${luna.sign}: honra tus necesidades emocionales y equilibrio relacional`,
      abril: `Integración ${sol.sign}-${luna.sign}: equilibra conscientemente ambas energías`,
      mayo: `Manifestación de tu esencia ${sol.sign} única al servicio del despertar colectivo`,
      junio: `Sanación emocional ${luna.sign} profunda y armonización de relaciones conscientes`,
      julio: `Activación ${ascendente.sign}: expresa tu magnetismo personal auténtico y transformador`
    },
    practicas_antifragilidad: [
      `Mi naturaleza ${sol.sign} me da fuerza para innovar y crear cambio positivo ante cualquier desafío`,
      `Mi Luna ${luna.sign} me ayuda a mantener equilibrio emocional y armonía en todas las situaciones`,
      `La combinación ${sol.sign}-${luna.sign} es mi superpoder único para liderar con visión y corazón`,
      `Mi Ascendente ${ascendente.sign} me proporciona la presencia magnética necesaria para inspirar evolución en otros`
    ]
  };
}