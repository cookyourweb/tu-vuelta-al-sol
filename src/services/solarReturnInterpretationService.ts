// src/services/solarReturnInterpretationService.ts
// 🚀 SERVICIO DE INTERPRETACIONES IA PARA SOLAR RETURN

import { generateCompleteInterpretation } from './trainedAssistantService';

export interface SolarReturnProfile {
  natalChart: any;
  solarReturnChart: any;
  userProfile: {
    name: string;
    currentAge: number;
    birthPlace: string;
    currentPlace?: string;
    livesInSamePlace?: boolean;
  };
  returnYear: number;
}

// ✅ FUNCIÓN PRINCIPAL: Generar interpretación IA del Solar Return
export async function generateSolarReturnInterpretation(profile: SolarReturnProfile): Promise<{
  success: boolean;
  interpretation?: any;
  error?: string;
}> {
  try {
    console.log('🌅 [SOLAR RETURN AI] Generando interpretación personalizada...');

    // 1. Extraer cambios clave entre natal y solar return
    const keyChanges = extractSolarReturnChanges(profile);

    // 2. Crear contexto especializado para Solar Return
    const solarReturnContext = buildSolarReturnContext(profile, keyChanges);

    // 3. Generar interpretación con IA (usando servicio existente)
    // Nota: Por ahora usamos un enfoque simplificado hasta implementar Solar Return completo
    const interpretation = {
      success: true,
      data: {
        tema_anual: generateYearTheme(profile, {}),
        evolucion_personalidad: `A los ${profile.userProfile.currentAge} años, este Solar Return marca un período de crecimiento significativo y transformación personal.`,
        nuevas_fortalezas: ['Autoconocimiento expandido', 'Mayor claridad personal', 'Confianza en el proceso evolutivo'],
        desafios_superados: ['Inseguridades del pasado', 'Patrones limitantes', 'Miedos al cambio'],
        enfoque_transformacional: 'Integración consciente de experiencias pasadas con visión futura',
        cambios_energeticos: 'Energía más enfocada y auténtica',
        activaciones_casas: [1, 4, 10],
        aspectos_clave: ['Desarrollo de autoconfianza', 'Claridad en propósito vital'],
        oportunidades_crecimiento: ['Liderazgo personal', 'Expresión auténtica', 'Servicio consciente']
      }
    };

    if (interpretation.success) {
      console.log('✅ [SOLAR RETURN AI] Interpretación generada exitosamente');
      return {
        success: true,
        interpretation: {
          ...interpretation.data,
          solarReturnChanges: keyChanges,
          locationImpact: analyzeLivingLocationImpact(profile),
          yearTheme: generateYearTheme(profile, keyChanges)
        }
      };
    } else {
      throw new Error('Error en generación IA');
    }

  } catch (error) {
    console.error('❌ [SOLAR RETURN AI] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// ✅ EXTRAER CAMBIOS CLAVE entre Natal y Solar Return
function extractSolarReturnChanges(profile: SolarReturnProfile) {
  console.log('🔍 [SOLAR RETURN] Analizando cambios clave...');

  const changes = {
    ascendantChange: analyzeCuspChange(profile.natalChart.ascendant, profile.solarReturnChart.ascendant),
    solarHouseChange: analyzeSolarHouseChange(profile),
    planetaryEmphasize: analyzePlanetaryEmphasis(profile.solarReturnChart),
    newAspects: findNewAspects(profile),
    stelliumChanges: analyzeStelliums(profile.solarReturnChart)
  };

  console.log('📊 [SOLAR RETURN] Cambios identificados:', Object.keys(changes));
  return changes;
}

// ✅ CONSTRUIR CONTEXTO ESPECIALIZADO para IA
function buildSolarReturnContext(profile: SolarReturnProfile, changes: any): string {
  const { natalChart, solarReturnChart, userProfile, returnYear } = profile;

  return `
ANÁLISIS SOLAR RETURN ${returnYear} - ${userProfile.name.toUpperCase()}

=== INFORMACIÓN PERSONAL ===
• Nombre: ${userProfile.name}
• Edad actual: ${userProfile.currentAge} años
• Lugar de nacimiento: ${userProfile.birthPlace}
• Ubicación actual: ${userProfile.currentPlace || userProfile.birthPlace}
${userProfile.livesInSamePlace === false ? '• VIVE EN UBICACIÓN DIFERENTE (impacta las casas)' : '• Vive en el mismo lugar de nacimiento'}

=== SOLAR RETURN ${returnYear} ===
• Ascendente Solar Return: ${solarReturnChart.ascendant?.sign} ${solarReturnChart.ascendant?.degree}°
• Casa donde cae el Sol natal: Casa ${getSolarHousePosition(profile)}
• Planetas prominentes: ${getProminentPlanets(solarReturnChart)}

=== CAMBIOS CLAVE RESPECTO AL NATAL ===
${changes.ascendantChange ? `• ASCENDENTE CAMBIA: ${changes.ascendantChange}` : ''}
${changes.solarHouseChange ? `• SOL EN NUEVA CASA: ${changes.solarHouseChange}` : ''}
${changes.planetaryEmphasize ? `• ÉNFASIS PLANETARIO: ${changes.planetaryEmphasize}` : ''}

=== PLANETAS SOLAR RETURN ===
${solarReturnChart.planets?.map((p: any) =>
  `• ${p.name}: ${p.degree}° ${p.sign} Casa ${p.house}`
).join('\n') || ''}

=== CONTEXTO EVOLUTIVO ===
• A los ${userProfile.currentAge} años: ${getAgePhaseContext(userProfile.currentAge)}
• Ciclo de vida: ${getLifeCycleContext(userProfile.currentAge)}

=== INSTRUCCIONES PARA IA ===
Genera una interpretación Solar Return que sea:
1. TRANSFORMACIONAL (enfocado en crecimiento personal)
2. PRÁCTICA (qué hacer específicamente este año)
3. INSPIRADORA (lenguaje motivador y esperanzador)
4. PERSONALIZADA (usar nombre y edad específica)
5. EDUCATIVA (explicar conceptos astrológicos brevemente)

Estructura requerida:
• Tema central del año
• Áreas de vida principales
• Consejos específicos mensuales
• Rituales y prácticas recomendadas
• Declaración de activación personal
`;
}

// ✅ FUNCIONES AUXILIARES DE ANÁLISIS

function analyzeCuspChange(natalAsc: any, srAsc: any): string | null {
  if (!natalAsc || !srAsc) return null;

  if (natalAsc.sign !== srAsc.sign) {
    return `De ${natalAsc.sign} natal a ${srAsc.sign} (nueva energía de presentación al mundo)`;
  }

  const degreeDiff = Math.abs(natalAsc.degree - srAsc.degree);
  if (degreeDiff > 15) {
    return `Mismo signo ${srAsc.sign} pero grado muy diferente (${degreeDiff}° de diferencia)`;
  }

  return null;
}

function analyzeSolarHouseChange(profile: SolarReturnProfile): string | null {
  // En Solar Return, el Sol siempre está en la misma posición zodiacal natal
  // pero puede caer en diferente casa debido a cambio de ubicación
  const natalSolarHouse = profile.natalChart.sol?.house || 1;
  const srSolarHouse = profile.solarReturnChart.sol_progresado?.house ||
                       profile.solarReturnChart.planets?.find((p: any) => p.name === 'Sol')?.house || 1;

  if (natalSolarHouse !== srSolarHouse) {
    return `Sol natal Casa ${natalSolarHouse} → Solar Return Casa ${srSolarHouse}`;
  }

  return null;
}

function getSolarHousePosition(profile: SolarReturnProfile): number {
  return profile.solarReturnChart.sol_progresado?.house ||
         profile.solarReturnChart.planets?.find((p: any) => p.name === 'Sol')?.house || 1;
}

function analyzePlanetaryEmphasis(chart: any): string {
  if (!chart.planets) return '';

  // Contar planetas por casa
  const houseCounts: Record<number, number> = {};
  chart.planets.forEach((p: any) => {
    if (p.house) {
      houseCounts[p.house] = (houseCounts[p.house] || 0) + 1;
    }
  });

  // Encontrar casa con más planetas
  const maxHouse = Object.entries(houseCounts)
    .sort(([,a], [,b]) => b - a)[0];

  if (maxHouse && maxHouse[1] >= 3) {
    return `Stellium en Casa ${maxHouse[0]} (${maxHouse[1]} planetas)`;
  }

  return '';
}

function getProminentPlanets(chart: any): string {
  if (!chart.planets) return '';

  // Planetas en Casa 1 (muy prominentes en Solar Return)
  const house1Planets = chart.planets.filter((p: any) => p.house === 1);
  if (house1Planets.length > 0) {
    return house1Planets.map((p: any) => p.name).join(', ') + ' en Casa 1';
  }

  // Planetas en Casa 10 (también prominentes)
  const house10Planets = chart.planets.filter((p: any) => p.house === 10);
  if (house10Planets.length > 0) {
    return house10Planets.map((p: any) => p.name).join(', ') + ' en Casa 10';
  }

  return 'Distribución equilibrada';
}

function findNewAspects(profile: SolarReturnProfile): string[] {
  // Simplificado: en una implementación completa, compararías aspectos natal vs SR
  return ['Análisis de aspectos pendiente de implementación completa'];
}

function analyzeStelliums(chart: any): string {
  return analyzePlanetaryEmphasis(chart);
}

function analyzeLivingLocationImpact(profile: SolarReturnProfile): string {
  if (profile.userProfile.livesInSamePlace === false && profile.userProfile.currentPlace) {
    return `IMPORTANTE: Al vivir en ${profile.userProfile.currentPlace} (diferente a tu lugar de nacimiento ${profile.userProfile.birthPlace}), las casas astrológicas de tu Solar Return cambian, modificando las áreas de vida que se activarán este año.`;
  }

  return `Vives en el mismo lugar de nacimiento (${profile.userProfile.birthPlace}), manteniendo la estructura de casas original.`;
}

function generateYearTheme(profile: SolarReturnProfile, changes: any): string {
  const themes: string[] = [];

  // Basado en casa del Sol en Solar Return
  const solarHouse = getSolarHousePosition(profile);
  const houseThemes: Record<number, string> = {
    1: 'RENOVACIÓN PERSONAL - Año de reinvención y nueva identidad',
    2: 'RECURSOS Y VALORES - Año de consolidación material y autoestima',
    3: 'COMUNICACIÓN Y APRENDIZAJE - Año de nuevas conexiones y conocimientos',
    4: 'HOGAR Y RAÍCES - Año de bases familiares y seguridad emocional',
    5: 'CREATIVIDAD Y EXPRESIÓN - Año de proyectos creativos y diversión',
    6: 'SERVICIO Y SALUD - Año de rutinas saludables y mejora personal',
    7: 'RELACIONES Y ASOCIACIONES - Año de partnerships importantes',
    8: 'TRANSFORMACIÓN PROFUNDA - Año de cambios intensos y renacimiento',
    9: 'EXPANSIÓN Y SABIDURÍA - Año de viajes, estudios y crecimiento mental',
    10: 'CARRERA Y RECONOCIMIENTO - Año de logros profesionales y visibilidad',
    11: 'GRUPOS Y OBJETIVOS - Año de proyectos grupales y metas futuras',
    12: 'ESPIRITUALIDAD Y LIBERACIÓN - Año de introspección y trascendencia'
  };

  themes.push(houseThemes[solarHouse] || 'CRECIMIENTO PERSONAL');

  // Agregar tema por cambio de ascendente
  if (changes.ascendantChange) {
    themes.push('NUEVA FORMA DE SER EN EL MUNDO');
  }

  // Tema por edad
  const ageTheme = getAgeThemeContext(profile.userProfile.currentAge);
  if (ageTheme) themes.push(ageTheme);

  return themes[0]; // Tema principal
}

function getAgePhaseContext(age: number): string {
  if (age < 7) return 'Fase lunar - Desarrollo emocional básico';
  if (age < 14) return 'Fase mercurial - Desarrollo mental y comunicativo';
  if (age < 21) return 'Fase venusiana - Desarrollo de valores y relaciones';
  if (age < 28) return 'Fase marcial - Desarrollo de la voluntad y acción';
  if (age < 35) return 'Fase solar - Desarrollo de la autoridad personal';
  if (age < 42) return 'Fase jupiteriana - Expansión y búsqueda de significado';
  if (age < 49) return 'Fase uraniana - Crisis de medio camino y revolución';
  if (age < 56) return 'Fase saturnina - Madurez y responsabilidad';
  return 'Fase neptuno-plutoniana - Sabiduría y trascendencia';
}

function getLifeCycleContext(age: number): string {
  const saturnCycle = Math.floor(age / 29.5);
  const jupiterCycle = Math.floor(age / 12);

  return `Ciclo ${saturnCycle + 1} de Saturno, Ciclo ${jupiterCycle + 1} de Júpiter`;
}

function getAgeThemeContext(age: number): string | null {
  if (age === 29 || age === 30) return 'RETORNO DE SATURNO - Maduración fundamental';
  if (age === 58 || age === 59) return 'SEGUNDO RETORNO DE SATURNO - Sabiduría madura';
  if (age === 42) return 'OPOSICIÓN DE URANO - Revolución de medio camino';
  if (age === 50) return 'RETORNO DE QUIRÓN - Sanación del herido sanador';
  return null;
}

// ✅ FUNCIÓN PARA INTEGRAR EN EL ENDPOINT EXISTENTE
export async function addSolarReturnInterpretation(solarReturnData: any, natalChart: any, userProfile: any) {
  try {
    const profile: SolarReturnProfile = {
      natalChart,
      solarReturnChart: solarReturnData,
      userProfile: {
        name: userProfile.fullName || 'Usuario',
        currentAge: solarReturnData.currentAge || 30,
        birthPlace: userProfile.birthPlace || 'Lugar de nacimiento',
        currentPlace: userProfile.currentPlace,
        livesInSamePlace: userProfile.livesInSamePlace
      },
      returnYear: solarReturnData.solarReturnInfo?.startYear || new Date().getFullYear()
    };

    const interpretation = await generateSolarReturnInterpretation(profile);

    if (interpretation.success) {
      return {
        ...solarReturnData,
        aiInterpretation: interpretation.interpretation
      };
    } else {
      console.warn('⚠️ No se pudo generar interpretación IA, usando datos base');
      return solarReturnData;
    }

  } catch (error) {
    console.error('❌ Error agregando interpretación Solar Return:', error);
    return solarReturnData;
  }
}
