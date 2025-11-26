// src/utils/astrology/solarReturnComparison.ts

export interface HouseOverlay {
  srHouseNumber: number;
  fallsInNatalHouse: number;
  meaning: string;
}

export interface SRComparison {
  ascSRInNatalHouse: number;
  mcSRInNatalHouse: number;
  houseOverlays: HouseOverlay[];
  planetaryChanges: Array<{
    planet: string;
    natalHouse: number;
    srHouse: number;
    changed: boolean;
    interpretation: string;
  }>;
  stelliumsNatal: ReturnType<typeof detectarStelliums>;
  stelliumsSR: ReturnType<typeof detectarStelliums>;
  configuracionesNatal: ReturnType<typeof detectarConfiguraciones>;
  aspectosCruzados: Array<{
    planetaSR: string;
    planetaNatal: string;
    aspecto: string;
    orbe: string;
    interpretacion: string;
    importancia: 'alta' | 'media' | 'baja';
  }>;
  solarYearEvents?: {
    lunarPhases: Array<{
      type: 'new_moon' | 'full_moon';
      date: Date;
      sign: string;
      degree: number;
      description: string;
    }>;
    retrogrades: Array<{
      planet: string;
      startDate: Date;
      endDate: Date;
      startSign: string;
      endSign: string;
      description: string;
    }>;
    eclipses: Array<{
      type: 'solar' | 'lunar';
      date: Date;
      sign: string;
      degree: number;
      magnitude: number;
      description: string;
    }>;
    planetaryIngresses: Array<{
      planet: string;
      date: Date;
      fromSign: string;
      toSign: string;
      description: string;
    }>;
    seasonalEvents: Array<{
      type: 'spring_equinox' | 'summer_solstice' | 'autumn_equinox' | 'winter_solstice';
      date: Date;
      description: string;
    }>;
  };
}

/**
 * Calcula en qué casa natal cae el ASC del Solar Return
 */
export function calculateASCSRInNatalHouse(
  ascSRLongitude: number,
  natalHouses: Array<{ number: number; longitude: number }>
): number {
  for (let i = 0; i < natalHouses.length; i++) {
    const currentHouse = natalHouses[i];
    const nextHouse = natalHouses[(i + 1) % natalHouses.length];
    
    if (isLongitudeInHouse(ascSRLongitude, currentHouse.longitude, nextHouse.longitude)) {
      return currentHouse.number;
    }
  }
  return 1; // Fallback
}

/**
 * Calcula superposición completa de casas SR sobre casas natales
 */
export function calculateHouseOverlays(
  srHouses: Array<{ number: number; longitude: number }>,
  natalHouses: Array<{ number: number; longitude: number }>
): HouseOverlay[] {
  const overlays: HouseOverlay[] = [];
  
  srHouses.forEach(srHouse => {
    const fallsInNatalHouse = calculateHouseFromLongitude(srHouse.longitude, natalHouses);
    
    overlays.push({
      srHouseNumber: srHouse.number,
      fallsInNatalHouse,
      meaning: getHouseOverlayMeaning(srHouse.number, fallsInNatalHouse)
    });
  });
  
  return overlays;
}

/**
 * Compara posiciones planetarias natal vs SR
 */
export function comparePlanetaryPositions(
  natalChart: any,
  srChart: any
): SRComparison['planetaryChanges'] {
  const changes: SRComparison['planetaryChanges'] = [];
  const mainPlanets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'];
  
  mainPlanets.forEach(planetName => {
    const natalPlanet = natalChart.planets?.find((p: any) => p.name === planetName);
    const srPlanet = srChart.planets?.find((p: any) => p.name === planetName);
    
    if (natalPlanet && srPlanet) {
      const changed = natalPlanet.house !== srPlanet.house;
      
      changes.push({
        planet: planetName,
        natalHouse: natalPlanet.house || 0,
        srHouse: srPlanet.house || 0,
        changed,
        interpretation: changed 
          ? `${planetName} se mueve de Casa ${natalPlanet.house} (${getHouseMeaning(natalPlanet.house)}) a Casa ${srPlanet.house} SR (${getHouseMeaning(srPlanet.house)})`
          : `${planetName} permanece en Casa ${natalPlanet.house}`
      });
    }
  });
  
  return changes;
}

/**
 * Genera comparación completa Natal vs SR CON TODAS LAS CONFIGURACIONES
 */
export function generateSRComparison(
  natalChart: any,
  srChart: any
): SRComparison {
  const ascSRInNatalHouse = calculateASCSRInNatalHouse(
    srChart.ascendant?.longitude || 0,
    natalChart.houses || []
  );

  const mcSRInNatalHouse = calculateASCSRInNatalHouse(
    srChart.midheaven?.longitude || 0,
    natalChart.houses || []
  );

  const houseOverlays = calculateHouseOverlays(
    srChart.houses || [],
    natalChart.houses || []
  );

  const planetaryChanges = comparePlanetaryPositions(natalChart, srChart);

  // ✅ NUEVAS FUNCIONES
  const stelliumsNatal = detectarStelliums(natalChart);
  const stelliumsSR = detectarStelliums(srChart);
  const configuracionesNatal = detectarConfiguraciones(natalChart);
  const aspectosCruzados = calcularAspectosCruzados(natalChart, srChart);

  return {
    ascSRInNatalHouse,
    mcSRInNatalHouse,
    houseOverlays,
    planetaryChanges,
    stelliumsNatal,
    stelliumsSR,
    configuracionesNatal,
    aspectosCruzados
  };
}

// Helper functions

function isLongitudeInHouse(long: number, cusStart: number, cusEnd: number): boolean {
  long = ((long % 360) + 360) % 360;
  cusStart = ((cusStart % 360) + 360) % 360;
  cusEnd = ((cusEnd % 360) + 360) % 360;
  
  if (cusStart < cusEnd) {
    return long >= cusStart && long < cusEnd;
  } else {
    return long >= cusStart || long < cusEnd;
  }
}

function calculateHouseFromLongitude(
  longitude: number,
  houses: Array<{ number: number; longitude: number }>
): number {
  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];
    
    if (isLongitudeInHouse(longitude, currentHouse.longitude, nextHouse.longitude)) {
      return currentHouse.number;
    }
  }
  return 1;
}

function getHouseMeaning(houseNumber: number): string {
  const meanings: Record<number, string> = {
    1: 'Identidad y presencia',
    2: 'Recursos y autoestima',
    3: 'Comunicación y hermanos',
    4: 'Hogar y familia',
    5: 'Creatividad y romance',
    6: 'Salud y rutinas',
    7: 'Relaciones y socios',
    8: 'Transformación y recursos compartidos',
    9: 'Filosofía y viajes',
    10: 'Carrera y reconocimiento',
    11: 'Grupos y objetivos',
    12: 'Espiritualidad y finales'
  };
  return meanings[houseNumber] || 'área de vida';
}

function getHouseOverlayMeaning(srHouse: number, natalHouse: number): string {
  return `Casa ${srHouse} SR (${getHouseMeaning(srHouse)}) activa tu Casa ${natalHouse} natal (${getHouseMeaning(natalHouse)})`;
}

/**
 * Detecta stelliums en la carta (3+ planetas en mismo signo o casa)
 */
export function detectarStelliums(chart: any): Array<{
  tipo: string;
  ubicacion: string;
  planetas: string[];
  significado: string;
}> {
  const stelliums: Array<{
    tipo: string;
    ubicacion: string;
    planetas: string[];
    significado: string;
  }> = [];

  if (!chart.planets) return [];

  // Agrupar por casa
  const porCasa: Record<number, string[]> = {};
  chart.planets.forEach((p: any) => {
    if (p.house) {
      if (!porCasa[p.house]) porCasa[p.house] = [];
      porCasa[p.house].push(p.name);
    }
  });

  // Agrupar por signo
  const porSigno: Record<string, string[]> = {};
  chart.planets.forEach((p: any) => {
    if (p.sign) {
      if (!porSigno[p.sign]) porSigno[p.sign] = [];
      porSigno[p.sign].push(p.name);
    }
  });

  // Detectar stelliums en casas (3+ planetas)
  Object.entries(porCasa).forEach(([casa, planetas]) => {
    if (planetas.length >= 3) {
      stelliums.push({
        tipo: 'Casa',
        ubicacion: `Casa ${casa}`,
        planetas,
        significado: getStelliumCasaMeaning(parseInt(casa), planetas)
      });
    }
  });

  // Detectar stelliums en signos (3+ planetas)
  Object.entries(porSigno).forEach(([signo, planetas]) => {
    if (planetas.length >= 3) {
      stelliums.push({
        tipo: 'Signo',
        ubicacion: signo,
        planetas,
        significado: `Concentración de energía ${signo}: enfoque en ${getSignoElement(signo)}`
      });
    }
  });

  return stelliums;
}

function getStelliumCasaMeaning(casa: number, planetas: string[]): string {
  const meanings: Record<number, string> = {
    1: `Énfasis extremo en identidad y presencia personal (${planetas.length} planetas)`,
    2: `Enfoque vital en recursos, dinero y autoestima (${planetas.length} planetas)`,
    3: `Concentración en comunicación, aprendizaje y entorno cercano (${planetas.length} planetas)`,
    4: `Énfasis en hogar, familia y raíces emocionales (${planetas.length} planetas)`,
    5: `Enfoque en creatividad, romance y expresión personal (${planetas.length} planetas)`,
    6: `Concentración en salud, trabajo y rutinas diarias (${planetas.length} planetas)`,
    7: `Énfasis en relaciones, asociaciones y matrimonio (${planetas.length} planetas)`,
    8: `Enfoque en transformación, intimidad y recursos compartidos (${planetas.length} planetas)`,
    9: `Concentración en filosofía, viajes y expansión mental (${planetas.length} planetas)`,
    10: `Énfasis en carrera, vocación y reconocimiento público (${planetas.length} planetas)`,
    11: `Enfoque en grupos, amistades y objetivos colectivos (${planetas.length} planetas)`,
    12: `Concentración en espiritualidad, introspección y finales (${planetas.length} planetas)`
  };
  return meanings[casa] || `Énfasis en Casa ${casa}`;
}

function getSignoElement(signo: string): string {
  const elementos: Record<string, string> = {
    'Aries': 'acción y liderazgo (Fuego)',
    'Tauro': 'estabilidad y recursos (Tierra)',
    'Géminis': 'comunicación y versatilidad (Aire)',
    'Cáncer': 'emoción y cuidado (Agua)',
    'Leo': 'creatividad y autoexpresión (Fuego)',
    'Virgo': 'análisis y servicio (Tierra)',
    'Libra': 'armonía y relaciones (Aire)',
    'Escorpio': 'transformación e intimidad (Agua)',
    'Sagitario': 'expansión y filosofía (Fuego)',
    'Capricornio': 'estructura y ambición (Tierra)',
    'Acuario': 'innovación y humanitarismo (Aire)',
    'Piscis': 'espiritualidad y compasión (Agua)'
  };
  return elementos[signo] || 'energía específica';
}

/**
 * Detecta configuraciones geométricas importantes
 */
export function detectarConfiguraciones(chart: any): Array<{
  tipo: 'T-Cuadrada' | 'Gran Trígono' | 'Yod' | 'Gran Cruz';
  planetas: string[];
  descripcion: string;
  significado: string;
}> {
  const configuraciones: Array<{
    tipo: 'T-Cuadrada' | 'Gran Trígono' | 'Yod' | 'Gran Cruz';
    planetas: string[];
    descripcion: string;
    significado: string;
  }> = [];

  if (!chart.planets || !chart.aspects) return [];

  // Detectar T-Cuadradas (2 cuadraturas + 1 oposición)
  const tCuadradas = detectTCuadradas(chart);
  configuraciones.push(...tCuadradas);

  // Detectar Grandes Trígonos (3 trígonos formando triángulo)
  const grandesTrigonos = detectGrandesTrigonos(chart);
  configuraciones.push(...grandesTrigonos);

  // Detectar Yods (2 quincuncios + 1 sextil)
  const yods = detectYods(chart);
  configuraciones.push(...yods);

  return configuraciones;
}

function detectTCuadradas(chart: any): Array<{
  tipo: 'T-Cuadrada';
  planetas: string[];
  descripcion: string;
  significado: string;
}> {
  const tCuadradas: Array<{
    tipo: 'T-Cuadrada';
    planetas: string[];
    descripcion: string;
    significado: string;
  }> = [];
  const cuadraturas = chart.aspects?.filter((a: any) =>
    a.type === 'cuadratura' || a.type === 'square'
  ) || [];
  const oposiciones = chart.aspects?.filter((a: any) =>
    a.type === 'oposición' || a.type === 'opposition'
  ) || [];

  // Buscar patrones de T-Cuadrada
  cuadraturas.forEach((cuad1: any) => {
    cuadraturas.forEach((cuad2: any) => {
      if (cuad1 === cuad2) return;

      // Verificar si hay oposición entre los planetas extremos
      const planetaComun = cuad1.planet1 === cuad2.planet1 ? cuad1.planet1 :
                          cuad1.planet1 === cuad2.planet2 ? cuad1.planet1 :
                          cuad1.planet2 === cuad2.planet1 ? cuad1.planet2 :
                          cuad1.planet2 === cuad2.planet2 ? cuad1.planet2 : null;

      if (planetaComun) {
        const planeta1 = cuad1.planet1 === planetaComun ? cuad1.planet2 : cuad1.planet1;
        const planeta2 = cuad2.planet1 === planetaComun ? cuad2.planet2 : cuad2.planet1;

        const hayOposicion = oposiciones.some((op: any) =>
          (op.planet1 === planeta1 && op.planet2 === planeta2) ||
          (op.planet1 === planeta2 && op.planet2 === planeta1)
        );

        if (hayOposicion) {
          tCuadradas.push({
            tipo: 'T-Cuadrada' as const,
            planetas: [planeta1, planetaComun, planeta2],
            descripcion: `${planeta1} - ${planetaComun} - ${planeta2}`,
            significado: 'Tensión dinámica que genera acción y transformación. El planeta en el vértice (punto focal) muestra dónde se concentra la presión y cómo resolverla.'
          });
        }
      }
    });
  });

  return tCuadradas.slice(0, 2); // Máximo 2 T-Cuadradas para no saturar
}

function detectGrandesTrigonos(chart: any): Array<{
  tipo: 'Gran Trígono';
  planetas: string[];
  descripcion: string;
  significado: string;
}> {
  const grandesTrigonos: Array<{
    tipo: 'Gran Trígono';
    planetas: string[];
    descripcion: string;
    significado: string;
  }> = [];
  const trigonos = chart.aspects?.filter((a: any) =>
    a.type === 'trígono' || a.type === 'trine'
  ) || [];

  // Buscar 3 trígonos que formen un triángulo
  for (let i = 0; i < trigonos.length; i++) {
    for (let j = i + 1; j < trigonos.length; j++) {
      for (let k = j + 1; k < trigonos.length; k++) {
        const t1 = trigonos[i];
        const t2 = trigonos[j];
        const t3 = trigonos[k];

        const planetas = new Set([
          t1.planet1, t1.planet2,
          t2.planet1, t2.planet2,
          t3.planet1, t3.planet2
        ]);

        if (planetas.size === 3) {
          grandesTrigonos.push({
            tipo: 'Gran Trígono' as const,
            planetas: Array.from(planetas),
            descripcion: Array.from(planetas).join(' - '),
            significado: 'Facilidad natural y talento innato. Flujo armónico de energía que permite manifestar con poco esfuerzo. Cuidado con la complacencia.'
          });
        }
      }
    }
  }

  return grandesTrigonos.slice(0, 1);
}

function detectYods(chart: any): Array<{
  tipo: 'Yod';
  planetas: string[];
  descripcion: string;
  significado: string;
}> {
  const yods: Array<{
    tipo: 'Yod';
    planetas: string[];
    descripcion: string;
    significado: string;
  }> = [];
  const quincuncios = chart.aspects?.filter((a: any) =>
    a.type === 'quincuncio' || a.type === 'inconjunct'
  ) || [];
  const sextiles = chart.aspects?.filter((a: any) =>
    a.type === 'sextil' || a.type === 'sextile'
  ) || [];

  // Buscar patrón: 2 quincuncios desde base + 1 sextil entre base
  quincuncios.forEach((q1: any) => {
    quincuncios.forEach((q2: any) => {
      if (q1 === q2) return;

      const apice = q1.planet1 === q2.planet1 ? q1.planet1 :
                    q1.planet1 === q2.planet2 ? q1.planet1 :
                    q1.planet2 === q2.planet1 ? q1.planet2 :
                    q1.planet2 === q2.planet2 ? q1.planet2 : null;

      if (apice) {
        const base1 = q1.planet1 === apice ? q1.planet2 : q1.planet1;
        const base2 = q2.planet1 === apice ? q2.planet2 : q2.planet1;

        const haySextil = sextiles.some((s: any) =>
          (s.planet1 === base1 && s.planet2 === base2) ||
          (s.planet1 === base2 && s.planet2 === base1)
        );

        if (haySextil) {
          yods.push({
            tipo: 'Yod' as const,
            planetas: [base1, base2, apice],
            descripcion: `${base1} - ${base2} → ${apice}`,
            significado: `Dedo de Dios: Ajuste kármico. ${apice} es el punto de destino que requiere adaptación constante. Sensación de "llamado" o "misión" relacionada con este planeta.`
          });
        }
      }
    });
  });

  return yods.slice(0, 1);
}

/**
 * Calcula aspectos cruzados entre planetas SR y natales
 */
export function calcularAspectosCruzados(
  natalChart: any,
  srChart: any
): Array<{
  planetaSR: string;
  planetaNatal: string;
  aspecto: string;
  orbe: string;
  interpretacion: string;
  importancia: 'alta' | 'media' | 'baja';
}> {
  const aspectos: Array<{
    planetaSR: string;
    planetaNatal: string;
    aspecto: string;
    orbe: string;
    interpretacion: string;
    importancia: 'alta' | 'media' | 'baja';
  }> = [];

  if (!natalChart.planets || !srChart.planets) return [];

  const orbesPermitidos: Record<string, number> = {
    'conjunción': 8,
    'oposición': 8,
    'cuadratura': 6,
    'trígono': 6,
    'sextil': 4
  };

  // Solo analizar planetas principales en SR vs todos los natales
  const planetasSRImportantes = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'];

  srChart.planets
    .filter((p: any) => planetasSRImportantes.includes(p.name))
    .forEach((planetaSR: any) => {
      natalChart.planets.forEach((planetaNatal: any) => {
        const angulo = Math.abs((planetaSR.longitude - planetaNatal.longitude + 540) % 360 - 180);

        // Conjunción (0°)
        if (angulo <= orbesPermitidos['conjunción']) {
          aspectos.push({
            planetaSR: planetaSR.name,
            planetaNatal: planetaNatal.name,
            aspecto: 'conjunción',
            orbe: angulo.toFixed(2),
            interpretacion: getAspectoCruzadoInterpretacion(planetaSR.name, planetaNatal.name, 'conjunción'),
            importancia: angulo <= 3 ? 'alta' : 'media'
          });
        }

        // Oposición (180°)
        if (Math.abs(angulo - 180) <= orbesPermitidos['oposición']) {
          aspectos.push({
            planetaSR: planetaSR.name,
            planetaNatal: planetaNatal.name,
            aspecto: 'oposición',
            orbe: Math.abs(angulo - 180).toFixed(2),
            interpretacion: getAspectoCruzadoInterpretacion(planetaSR.name, planetaNatal.name, 'oposición'),
            importancia: Math.abs(angulo - 180) <= 3 ? 'alta' : 'media'
          });
        }

        // Cuadratura (90°)
        const cuadOrbe = Math.min(Math.abs(angulo - 90), Math.abs(angulo - 270));
        if (cuadOrbe <= orbesPermitidos['cuadratura']) {
          aspectos.push({
            planetaSR: planetaSR.name,
            planetaNatal: planetaNatal.name,
            aspecto: 'cuadratura',
            orbe: cuadOrbe.toFixed(2),
            interpretacion: getAspectoCruzadoInterpretacion(planetaSR.name, planetaNatal.name, 'cuadratura'),
            importancia: cuadOrbe <= 2 ? 'alta' : 'media'
          });
        }

        // Trígono (120°)
        const trigOrbe = Math.min(Math.abs(angulo - 120), Math.abs(angulo - 240));
        if (trigOrbe <= orbesPermitidos['trígono']) {
          aspectos.push({
            planetaSR: planetaSR.name,
            planetaNatal: planetaNatal.name,
            aspecto: 'trígono',
            orbe: trigOrbe.toFixed(2),
            interpretacion: getAspectoCruzadoInterpretacion(planetaSR.name, planetaNatal.name, 'trígono'),
            importancia: 'media'
          });
        }

        // Sextil (60°)
        const sextOrbe = Math.min(Math.abs(angulo - 60), Math.abs(angulo - 300));
        if (sextOrbe <= orbesPermitidos['sextil']) {
          aspectos.push({
            planetaSR: planetaSR.name,
            planetaNatal: planetaNatal.name,
            aspecto: 'sextil',
            orbe: sextOrbe.toFixed(2),
            interpretacion: getAspectoCruzadoInterpretacion(planetaSR.name, planetaNatal.name, 'sextil'),
            importancia: 'baja'
          });
        }
      });
    });

  // Ordenar por importancia y limitar a los 15 más relevantes
  return aspectos
    .sort((a, b) => {
      const importanciaOrder = { alta: 0, media: 1, baja: 2 };
      return importanciaOrder[a.importancia] - importanciaOrder[b.importancia];
    })
    .slice(0, 15);
}

function getAspectoCruzadoInterpretacion(
  planetaSR: string,
  planetaNatal: string,
  aspecto: string
): string {
  const interpretaciones: Record<string, Record<string, string>> = {
    'conjunción': {
      'Sol-Sol': 'Activación directa de tu identidad natal. Año de reafirmación personal.',
      'Luna-Luna': 'Resonancia emocional perfecta. Necesidades emocionales amplificadas.',
      'Mercurio-Mercurio': 'Año de comunicación intensa. Proyectos mentales prioritarios.',
      'Venus-Venus': 'Amor y valores personales en foco. Año romántico o creativo.',
      'Marte-Marte': 'Energía y acción multiplicadas. Año de conquistas personales.'
    },
    'oposición': {
      'default': `Tensión creativa entre ${planetaSR} SR y ${planetaNatal} natal. Necesidad de integrar polaridades.`
    },
    'cuadratura': {
      'default': `Desafío que activa ${planetaNatal} natal a través de ${planetaSR} SR. Motor de cambio.`
    },
    'trígono': {
      'default': `Facilidad natural entre ${planetaSR} SR y ${planetaNatal} natal. Flujo armónico.`
    },
    'sextil': {
      'default': `Oportunidad de conectar ${planetaSR} SR con ${planetaNatal} natal.`
    }
  };

  const key = `${planetaSR}-${planetaNatal}`;
  return interpretaciones[aspecto]?.[key] || interpretaciones[aspecto]?.['default'] ||
         `${planetaSR} SR ${aspecto} ${planetaNatal} natal`;
}
