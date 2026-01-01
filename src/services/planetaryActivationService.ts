// src/services/planetaryActivationService.ts
// 🌟 SERVICIO: Identificar planetas activos del año y generar fichas de activación
// Metodología: Planetas activos = planetas ENFATIZADOS en el retorno solar
// Uso: Para crear manuales planetarios del año en la agenda

import { AstrologyChart } from '@/types/astrology/charts';

// ==========================================
// 📊 INTERFACES
// ==========================================

/**
 * Ficha de activación planetaria para un año específico
 * Es un "manual de uso" del planeta para ese ciclo solar
 */
export interface PlanetaryActivationCard {
  planet: string;

  // Cómo eres tú (natal)
  natal: {
    posicion: string; // "Marte en Tauro Casa 2"
    descripcion: string; // Identidad permanente con este planeta
  };

  // Qué se activa este año (solar)
  activacion_anual: {
    posicion: string; // "Marte en Casa 10 (angular)"
    descripcion: string; // Qué está enfatizado este año
    razon_activacion: string; // Por qué este planeta está activo (casa angular, aspecto, etc.)
  };

  // Traducción práctica
  traduccion_practica: string; // "Este año no se te pide correr. Se te pide NO PARAR."

  // Regla del año
  regla_del_ano: string; // "Mejor constancia que impulso. Mejor sostener que empezar mil cosas."

  // Prioridad (1 = muy activo, 2 = activo, 3 = ligeramente activo)
  prioridad: 1 | 2 | 3;
}

/**
 * Resumen de planetas activos para un año solar
 */
export interface ActivePlanetsReport {
  year: number;
  planetas_activos: PlanetaryActivationCard[];
  resumen: string; // Resumen ejecutivo de qué planetas dominan el año
}

// ==========================================
// 🎯 IDENTIFICAR PLANETAS ACTIVOS
// ==========================================

/**
 * Identifica qué planetas están ACTIVOS (enfatizados) en un retorno solar
 *
 * Criterios de activación:
 * 1. Planetas en casas angulares (1, 4, 7, 10) - PRIORIDAD 1
 * 2. Planetas con aspectos exactos a los ángulos (ASC, MC) - PRIORIDAD 1
 * 3. Sol y Saturno SIEMPRE activos - PRIORIDAD 1
 * 4. Planetas regentes de casas angulares - PRIORIDAD 2
 * 5. Planetas retrógrados - PRIORIDAD 2
 * 6. Luna SIEMPRE activa - PRIORIDAD 2
 * 7. Planetas con aspectos tensos (cuadratura, oposición) al Sol - PRIORIDAD 3
 */
export function identifyActivePlanets(
  natalChart: AstrologyChart,
  solarReturnChart: AstrologyChart
): string[] {
  const activePlanets: Set<string> = new Set();

  // ✅ 1. Sol y Saturno SIEMPRE activos (estructuradores del año)
  activePlanets.add('Sol');
  activePlanets.add('Saturno');

  // ✅ 2. Luna SIEMPRE activa (emociones y ritmo)
  activePlanets.add('Luna');

  // ✅ 3. Planetas en casas angulares del SR (1, 4, 7, 10)
  const angularHouses = [1, 4, 7, 10];
  solarReturnChart.planets.forEach(planet => {
    if (angularHouses.includes(planet.house)) {
      activePlanets.add(planet.name);
      console.log(`✅ ${planet.name} activo (casa angular ${planet.house})`);
    }
  });

  // ✅ 4. Planetas retrógrados en SR
  solarReturnChart.planets.forEach(planet => {
    if (planet.retrograde) {
      activePlanets.add(planet.name);
      console.log(`✅ ${planet.name} activo (retrógrado)`);
    }
  });

  // ✅ 5. Planetas personales (Mercurio, Venus, Marte) si cambian de casa respecto a natal
  const personalPlanets = ['Mercurio', 'Venus', 'Marte'];
  personalPlanets.forEach(planetName => {
    const natalPlanet = natalChart.planets.find(p => p.name === planetName);
    const srPlanet = solarReturnChart.planets.find(p => p.name === planetName);

    if (natalPlanet && srPlanet) {
      // Si cambia de casa angular o se mueve a casa angular
      const wasAngular = angularHouses.includes(natalPlanet.house);
      const isAngular = angularHouses.includes(srPlanet.house);

      if (isAngular && !wasAngular) {
        activePlanets.add(planetName);
        console.log(`✅ ${planetName} activo (movimiento a casa angular)`);
      }
    }
  });

  // ✅ 6. Júpiter si está en casa angular o en signos de expansión
  const jupiterSR = solarReturnChart.planets.find(p => p.name === 'Júpiter');
  if (jupiterSR) {
    if (angularHouses.includes(jupiterSR.house)) {
      activePlanets.add('Júpiter');
      console.log(`✅ Júpiter activo (casa angular ${jupiterSR.house})`);
    }
  }

  return Array.from(activePlanets);
}

// ==========================================
// 📝 GENERAR FICHAS DE ACTIVACIÓN
// ==========================================

/**
 * Genera fichas de activación planetaria para los planetas activos del año
 * Estas fichas son "manuales de uso" que explican:
 * - Quién eres con este planeta (natal)
 * - Qué se activa este año (solar)
 * - Cómo usar esta energía (traducción práctica)
 */
export function generateActivationCards(
  natalChart: AstrologyChart,
  solarReturnChart: AstrologyChart,
  natalInterpretations?: any // Interpretaciones natales guardadas
): PlanetaryActivationCard[] {

  const activePlanets = identifyActivePlanets(natalChart, solarReturnChart);
  const cards: PlanetaryActivationCard[] = [];

  console.log(`🎯 Generando fichas para ${activePlanets.length} planetas activos:`, activePlanets);

  activePlanets.forEach(planetName => {
    const natalPlanet = natalChart.planets.find(p => p.name === planetName);
    const srPlanet = solarReturnChart.planets.find(p => p.name === planetName);

    if (!natalPlanet || !srPlanet) {
      console.warn(`⚠️ Planeta ${planetName} no encontrado en cartas`);
      return;
    }

    // Determinar prioridad
    let prioridad: 1 | 2 | 3 = 3;
    const angularHouses = [1, 4, 7, 10];

    if (planetName === 'Sol' || planetName === 'Saturno' || angularHouses.includes(srPlanet.house)) {
      prioridad = 1;
    } else if (planetName === 'Luna' || srPlanet.retrograde || ['Mercurio', 'Venus', 'Marte'].includes(planetName)) {
      prioridad = 2;
    }

    // Buscar descripción natal guardada (si existe)
    const natalDesc = natalInterpretations?.[planetName.toLowerCase()]?.descripcion_completa
      || getNatalDescription(planetName, natalPlanet);

    const card: PlanetaryActivationCard = {
      planet: planetName,
      natal: {
        posicion: `${planetName} en ${natalPlanet.sign} Casa ${natalPlanet.house}`,
        descripcion: natalDesc
      },
      activacion_anual: {
        posicion: `${planetName} en ${srPlanet.sign} Casa ${srPlanet.house}${angularHouses.includes(srPlanet.house) ? ' (angular)' : ''}${srPlanet.retrograde ? ' (retrógrado)' : ''}`,
        descripcion: getActivationDescription(planetName, srPlanet, natalPlanet),
        razon_activacion: getActivationReason(planetName, srPlanet, natalPlanet)
      },
      traduccion_practica: getPracticalTranslation(planetName, srPlanet, natalPlanet),
      regla_del_ano: getYearRule(planetName, srPlanet, natalPlanet),
      prioridad
    };

    cards.push(card);
  });

  // Ordenar por prioridad
  return cards.sort((a, b) => a.prioridad - b.prioridad);
}

// ==========================================
// 🛠️ HELPER FUNCTIONS
// ==========================================

/**
 * Descripción natal genérica (si no hay interpretación guardada)
 */
function getNatalDescription(planetName: string, planet: any): string {
  const descriptions: Record<string, string> = {
    'Sol': `Tu identidad se expresa a través de ${planet.sign}. Necesitas ${getSignNeed(planet.sign)} para sentirte vivo/a.`,
    'Luna': `Tu mundo emocional funciona en clave ${planet.sign}. Te sientes seguro/a cuando ${getSignSecurity(planet.sign)}.`,
    'Mercurio': `Tu mente procesa en modo ${planet.sign}. Aprendes y comunicas ${getSignMentalStyle(planet.sign)}.`,
    'Venus': `Valoras y te relacionas desde ${planet.sign}. Te atrae ${getSignAttraction(planet.sign)}.`,
    'Marte': `Actúas y te afirmas en clave ${planet.sign}. Tu motor es ${getSignMotivation(planet.sign)}.`,
    'Júpiter': `Creces y expandes a través de ${planet.sign}. Confías en ${getSignFaith(planet.sign)}.`,
    'Saturno': `Tu estructura y límites vienen de ${planet.sign}. Maduras ${getSignMaturity(planet.sign)}.`
  };

  return descriptions[planetName] || `${planetName} en ${planet.sign} Casa ${planet.house}.`;
}

/**
 * Descripción de qué se activa este año
 */
function getActivationDescription(planetName: string, srPlanet: any, natalPlanet: any): string {
  const isAngular = [1, 4, 7, 10].includes(srPlanet.house);
  const isRetrograde = srPlanet.retrograde;
  const changedSign = srPlanet.sign !== natalPlanet.sign;

  let desc = '';

  if (isAngular) {
    desc += `Este año ${planetName} está en una casa angular (${srPlanet.house}), lo que lo convierte en un eje central de tu experiencia. `;
  }

  if (isRetrograde) {
    desc += `Además, está retrógrado, lo que pide revisión interna y reintegración. `;
  }

  if (changedSign) {
    desc += `Ha cambiado de ${natalPlanet.sign} a ${srPlanet.sign}, activando un nuevo estilo de expresión. `;
  }

  return desc || `${planetName} se activa este año en ${srPlanet.sign}, pidiendo atención consciente.`;
}

/**
 * Razón de por qué este planeta está activo
 */
function getActivationReason(planetName: string, srPlanet: any, natalPlanet: any): string {
  const reasons = [];

  if ([1, 4, 7, 10].includes(srPlanet.house)) {
    reasons.push(`Casa angular ${srPlanet.house}`);
  }

  if (srPlanet.retrograde) {
    reasons.push('Retrógrado');
  }

  if (planetName === 'Sol' || planetName === 'Saturno') {
    reasons.push('Estructurador del año');
  }

  if (planetName === 'Luna') {
    reasons.push('Ritmo emocional');
  }

  return reasons.join(', ') || 'Planeta personal activo';
}

/**
 * Traducción práctica para la agenda (frase clave del año con este planeta)
 */
function getPracticalTranslation(planetName: string, srPlanet: any, natalPlanet: any): string {
  // TODO: Personalizar más según posiciones reales
  const translations: Record<string, string> = {
    'Sol': 'Este año no se trata de brillar para otros. Se trata de reconocerte en lo que construyes.',
    'Luna': 'Este año no se trata de controlar emociones. Se trata de permitir lo que sientes sin juzgarlo.',
    'Mercurio': 'Este año no se trata de convencer. Se trata de aprender a escuchar lo que aún no entiendes.',
    'Venus': 'Este año no se trata de agradar. Se trata de valorar lo que realmente quieres.',
    'Marte': 'Este año no se te pide correr. Se te pide NO PARAR.',
    'Júpiter': 'Este año no se trata de acumular más. Se trata de confiar en lo que ya tienes.',
    'Saturno': 'Este año no se trata de ser perfecto. Se trata de sostener lo que construyes.'
  };

  return translations[planetName] || `${planetName} pide atención consciente este año.`;
}

/**
 * Regla del año (mandato operativo)
 */
function getYearRule(planetName: string, srPlanet: any, natalPlanet: any): string {
  const rules: Record<string, string> = {
    'Sol': 'Mejor autenticidad que aprobación. Mejor menos aplausos y más coherencia.',
    'Luna': 'Mejor sentir que analizar. Mejor ritmo propio que velocidad externa.',
    'Mercurio': 'Mejor claridad que cantidad. Mejor decir menos y comunicar más.',
    'Venus': 'Mejor disfrute que sacrificio. Mejor placer consciente que obligación.',
    'Marte': 'Mejor constancia que impulso. Mejor sostener que empezar mil cosas.',
    'Júpiter': 'Mejor profundidad que dispersión. Mejor crecer en una dirección que probar todo.',
    'Saturno': 'Mejor límites claros que perfección. Mejor sostenible que brillante.'
  };

  return rules[planetName] || `${planetName} requiere presencia y consciencia.`;
}

// ==========================================
// 🌐 HELPERS POR SIGNO (para descripciones natales)
// ==========================================

function getSignNeed(sign: string): string {
  const needs: Record<string, string> = {
    'Aries': 'liderar y moverte',
    'Tauro': 'construir y disfrutar',
    'Géminis': 'aprender y conectar',
    'Cáncer': 'cuidar y sentir',
    'Leo': 'crear y expresarte',
    'Virgo': 'mejorar y servir',
    'Libra': 'relacionarte y armonizar',
    'Escorpio': 'transformar y profundizar',
    'Sagitario': 'explorar y expandir',
    'Capricornio': 'construir y lograr',
    'Acuario': 'innovar y liberar',
    'Piscis': 'disolver y trascender'
  };
  return needs[sign] || 'expresarte';
}

function getSignSecurity(sign: string): string {
  const security: Record<string, string> = {
    'Aries': 'actúas y avanzas',
    'Tauro': 'hay estabilidad y placer',
    'Géminis': 'hay variedad y aprendizaje',
    'Cáncer': 'hay cercanía y pertenencia',
    'Leo': 'te sientes visto y valorado',
    'Virgo': 'hay orden y utilidad',
    'Libra': 'hay equilibrio y compañía',
    'Escorpio': 'hay intensidad y verdad',
    'Sagitario': 'hay libertad y sentido',
    'Capricornio': 'hay logro y respeto',
    'Acuario': 'hay libertad y autenticidad',
    'Piscis': 'hay conexión y trascendencia'
  };
  return security[sign] || 'sientes que perteneces';
}

function getSignMentalStyle(sign: string): string {
  const styles: Record<string, string> = {
    'Aries': 'de forma directa y rápida',
    'Tauro': 'de forma práctica y lenta',
    'Géminis': 'de forma ágil y variada',
    'Cáncer': 'de forma intuitiva y emocional',
    'Leo': 'de forma creativa y dramática',
    'Virgo': 'de forma analítica y detallada',
    'Libra': 'de forma equilibrada y diplomática',
    'Escorpio': 'de forma profunda e investigativa',
    'Sagitario': 'de forma conceptual y expansiva',
    'Capricornio': 'de forma estructurada y estratégica',
    'Acuario': 'de forma innovadora y abstracta',
    'Piscis': 'de forma asociativa y simbólica'
  };
  return styles[sign] || 'según tu propio estilo';
}

function getSignAttraction(sign: string): string {
  return 'lo que refleja tu esencia';
}

function getSignMotivation(sign: string): string {
  return 'la necesidad de expresarte';
}

function getSignFaith(sign: string): string {
  return 'lo que expande tu sentido de vida';
}

function getSignMaturity(sign: string): string {
  return 'construyendo límites sanos';
}

// ==========================================
// 📊 GENERAR REPORTE COMPLETO
// ==========================================

/**
 * Genera un reporte completo de planetas activos para un año solar
 */
export function generateActivePlanetsReport(
  natalChart: AstrologyChart,
  solarReturnChart: AstrologyChart,
  year: number,
  natalInterpretations?: any
): ActivePlanetsReport {

  const cards = generateActivationCards(natalChart, solarReturnChart, natalInterpretations);

  // Generar resumen ejecutivo
  const prioridad1 = cards.filter(c => c.prioridad === 1).map(c => c.planet);
  const prioridad2 = cards.filter(c => c.prioridad === 2).map(c => c.planet);

  let resumen = `Este año (${year}) están activos ${cards.length} planetas. `;
  resumen += `Los planetas dominantes (máxima prioridad) son: ${prioridad1.join(', ')}. `;

  if (prioridad2.length > 0) {
    resumen += `También están activos: ${prioridad2.join(', ')}. `;
  }

  resumen += `Estos planetas marcarán el tono del año y serán referenciados en cada evento del calendario.`;

  return {
    year,
    planetas_activos: cards,
    resumen
  };
}
