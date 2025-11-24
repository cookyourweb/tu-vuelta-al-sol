// =============================================================================
// 🎯 COMPLETE NATAL CHART PROMPT - TODAS LAS SECCIONES
// src/utils/prompts/completeNatalChartPrompt.ts
// Genera interpretación completa con 17 secciones
// =============================================================================

export interface UserProfile {
  name: string;
  age: number;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface ChartData {
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: number;
    retrograde?: boolean;
  }>;
  houses: Array<{ number: number; sign: string; degree: number }>;
  aspects: Array<{
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  }>;
  elementDistribution?: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  modalityDistribution?: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
}

// =============================================================================
// HELPER: Calcular distribución de elementos si no viene
// =============================================================================

export function calculateElementDistribution(planets: ChartData['planets']): {
  fire: { count: number; percentage: number; planets: string[] };
  earth: { count: number; percentage: number; planets: string[] };
  air: { count: number; percentage: number; planets: string[] };
  water: { count: number; percentage: number; planets: string[] };
} {
  const fireSign = ['Aries', 'Leo', 'Sagitario', 'Sagittarius'];
  const earthSigns = ['Tauro', 'Taurus', 'Virgo', 'Capricornio', 'Capricorn'];
  const airSigns = ['Géminis', 'Gemini', 'Libra', 'Acuario', 'Aquarius'];
  const waterSigns = ['Cáncer', 'Cancer', 'Escorpio', 'Scorpio', 'Piscis', 'Pisces'];

  const result = {
    fire: { count: 0, percentage: 0, planets: [] as string[] },
    earth: { count: 0, percentage: 0, planets: [] as string[] },
    air: { count: 0, percentage: 0, planets: [] as string[] },
    water: { count: 0, percentage: 0, planets: [] as string[] },
  };

  const mainPlanets = planets.filter(p =>
    ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Jupiter', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Pluton', 'Plutón']
    .some(name => p.name.toLowerCase().includes(name.toLowerCase()))
  );

  mainPlanets.forEach(planet => {
    if (fireSign.some(s => planet.sign.toLowerCase().includes(s.toLowerCase()))) {
      result.fire.count++;
      result.fire.planets.push(planet.name);
    } else if (earthSigns.some(s => planet.sign.toLowerCase().includes(s.toLowerCase()))) {
      result.earth.count++;
      result.earth.planets.push(planet.name);
    } else if (airSigns.some(s => planet.sign.toLowerCase().includes(s.toLowerCase()))) {
      result.air.count++;
      result.air.planets.push(planet.name);
    } else if (waterSigns.some(s => planet.sign.toLowerCase().includes(s.toLowerCase()))) {
      result.water.count++;
      result.water.planets.push(planet.name);
    }
  });

  const total = result.fire.count + result.earth.count + result.air.count + result.water.count;
  if (total > 0) {
    result.fire.percentage = Math.round((result.fire.count / total) * 100);
    result.earth.percentage = Math.round((result.earth.count / total) * 100);
    result.air.percentage = Math.round((result.air.count / total) * 100);
    result.water.percentage = Math.round((result.water.count / total) * 100);
  }

  return result;
}

export function calculateModalityDistribution(planets: ChartData['planets']): {
  cardinal: { count: number; percentage: number; planets: string[] };
  fixed: { count: number; percentage: number; planets: string[] };
  mutable: { count: number; percentage: number; planets: string[] };
} {
  const cardinalSigns = ['Aries', 'Cáncer', 'Cancer', 'Libra', 'Capricornio', 'Capricorn'];
  const fixedSigns = ['Tauro', 'Taurus', 'Leo', 'Escorpio', 'Scorpio', 'Acuario', 'Aquarius'];
  const mutableSigns = ['Géminis', 'Gemini', 'Virgo', 'Sagitario', 'Sagittarius', 'Piscis', 'Pisces'];

  const result = {
    cardinal: { count: 0, percentage: 0, planets: [] as string[] },
    fixed: { count: 0, percentage: 0, planets: [] as string[] },
    mutable: { count: 0, percentage: 0, planets: [] as string[] },
  };

  const mainPlanets = planets.filter(p =>
    ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Jupiter', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Pluton', 'Plutón']
    .some(name => p.name.toLowerCase().includes(name.toLowerCase()))
  );

  mainPlanets.forEach(planet => {
    if (cardinalSigns.some(s => planet.sign.toLowerCase().includes(s.toLowerCase()))) {
      result.cardinal.count++;
      result.cardinal.planets.push(planet.name);
    } else if (fixedSigns.some(s => planet.sign.toLowerCase().includes(s.toLowerCase()))) {
      result.fixed.count++;
      result.fixed.planets.push(planet.name);
    } else if (mutableSigns.some(s => planet.sign.toLowerCase().includes(s.toLowerCase()))) {
      result.mutable.count++;
      result.mutable.planets.push(planet.name);
    }
  });

  const total = result.cardinal.count + result.fixed.count + result.mutable.count;
  if (total > 0) {
    result.cardinal.percentage = Math.round((result.cardinal.count / total) * 100);
    result.fixed.percentage = Math.round((result.fixed.count / total) * 100);
    result.mutable.percentage = Math.round((result.mutable.count / total) * 100);
  }

  return result;
}

// =============================================================================
// PROMPT PRINCIPAL: Genera TODA la carta natal
// =============================================================================

export function generateCompleteNatalChartPrompt(
  chartData: ChartData,
  userProfile: UserProfile
): string {

  // Encontrar planetas clave
  const sol = chartData.planets.find(p => p.name.toLowerCase().includes('sol') || p.name.toLowerCase() === 'sun');
  const luna = chartData.planets.find(p => p.name.toLowerCase().includes('luna') || p.name.toLowerCase() === 'moon');
  const mercurio = chartData.planets.find(p => p.name.toLowerCase().includes('mercurio') || p.name.toLowerCase() === 'mercury');
  const venus = chartData.planets.find(p => p.name.toLowerCase().includes('venus'));
  const marte = chartData.planets.find(p => p.name.toLowerCase().includes('marte') || p.name.toLowerCase() === 'mars');
  const jupiter = chartData.planets.find(p => p.name.toLowerCase().includes('jupiter') || p.name.toLowerCase().includes('júpiter'));
  const saturno = chartData.planets.find(p => p.name.toLowerCase().includes('saturno') || p.name.toLowerCase() === 'saturn');
  const urano = chartData.planets.find(p => p.name.toLowerCase().includes('urano') || p.name.toLowerCase() === 'uranus');
  const neptuno = chartData.planets.find(p => p.name.toLowerCase().includes('neptuno') || p.name.toLowerCase() === 'neptune');
  const pluton = chartData.planets.find(p => p.name.toLowerCase().includes('pluton') || p.name.toLowerCase().includes('plutón') || p.name.toLowerCase() === 'pluto');
  const quiron = chartData.planets.find(p => p.name.toLowerCase().includes('quiron') || p.name.toLowerCase().includes('quirón') || p.name.toLowerCase() === 'chiron');
  const lilith = chartData.planets.find(p => p.name.toLowerCase().includes('lilith'));
  const nodoNorte = chartData.planets.find(p => p.name.toLowerCase().includes('nodo norte') || p.name.toLowerCase().includes('north node') || p.name.toLowerCase().includes('rahu'));
  const nodoSur = chartData.planets.find(p => p.name.toLowerCase().includes('nodo sur') || p.name.toLowerCase().includes('south node') || p.name.toLowerCase().includes('ketu'));

  // Calcular elementos y modalidades
  const elementos = calculateElementDistribution(chartData.planets);
  const modalidades = calculateModalityDistribution(chartData.planets);

  // Determinar elemento dominante y escaso
  const elementosArray = [
    { name: 'Fuego', ...elementos.fire },
    { name: 'Tierra', ...elementos.earth },
    { name: 'Aire', ...elementos.air },
    { name: 'Agua', ...elementos.water },
  ];
  const elementoDominante = elementosArray.reduce((a, b) => a.percentage > b.percentage ? a : b);
  const elementoEscaso = elementosArray.reduce((a, b) => a.percentage < b.percentage ? a : b);

  return `Eres un astrólogo evolutivo DISRUPTIVO experto. Genera una interpretación COMPLETA y TRANSFORMACIONAL de la carta natal.

═══════════════════════════════════════════════════════════════════════════════
DATOS DE LA PERSONA
═══════════════════════════════════════════════════════════════════════════════
NOMBRE: ${userProfile.name}
EDAD: ${userProfile.age} años
NACIMIENTO: ${userProfile.birthDate} a las ${userProfile.birthTime}
LUGAR: ${userProfile.birthPlace}

═══════════════════════════════════════════════════════════════════════════════
DATOS ASTROLÓGICOS
═══════════════════════════════════════════════════════════════════════════════
ASCENDENTE: ${chartData.ascendant.sign} ${chartData.ascendant.degree}°
MEDIO CIELO: ${chartData.midheaven.sign} ${chartData.midheaven.degree}°

SOL: ${sol?.sign || 'N/A'} ${sol?.degree || 0}° Casa ${sol?.house || 'N/A'}
LUNA: ${luna?.sign || 'N/A'} ${luna?.degree || 0}° Casa ${luna?.house || 'N/A'}
MERCURIO: ${mercurio?.sign || 'N/A'} ${mercurio?.degree || 0}° Casa ${mercurio?.house || 'N/A'}
VENUS: ${venus?.sign || 'N/A'} ${venus?.degree || 0}° Casa ${venus?.house || 'N/A'}
MARTE: ${marte?.sign || 'N/A'} ${marte?.degree || 0}° Casa ${marte?.house || 'N/A'}
JÚPITER: ${jupiter?.sign || 'N/A'} ${jupiter?.degree || 0}° Casa ${jupiter?.house || 'N/A'}
SATURNO: ${saturno?.sign || 'N/A'} ${saturno?.degree || 0}° Casa ${saturno?.house || 'N/A'}
URANO: ${urano?.sign || 'N/A'} ${urano?.degree || 0}° Casa ${urano?.house || 'N/A'}
NEPTUNO: ${neptuno?.sign || 'N/A'} ${neptuno?.degree || 0}° Casa ${neptuno?.house || 'N/A'}
PLUTÓN: ${pluton?.sign || 'N/A'} ${pluton?.degree || 0}° Casa ${pluton?.house || 'N/A'}
QUIRÓN: ${quiron?.sign || 'N/A'} ${quiron?.degree || 0}° Casa ${quiron?.house || 'N/A'}
LILITH: ${lilith?.sign || 'N/A'} ${lilith?.degree || 0}° Casa ${lilith?.house || 'N/A'}
NODO NORTE: ${nodoNorte?.sign || 'N/A'} ${nodoNorte?.degree || 0}° Casa ${nodoNorte?.house || 'N/A'}
NODO SUR: ${nodoSur?.sign || 'N/A'} ${nodoSur?.degree || 0}° Casa ${nodoSur?.house || 'N/A'}

DISTRIBUCIÓN ELEMENTAL:
- Fuego: ${elementos.fire.percentage}% (${elementos.fire.planets.join(', ') || 'ninguno'})
- Tierra: ${elementos.earth.percentage}% (${elementos.earth.planets.join(', ') || 'ninguno'})
- Aire: ${elementos.air.percentage}% (${elementos.air.planets.join(', ') || 'ninguno'})
- Agua: ${elementos.water.percentage}% (${elementos.water.planets.join(', ') || 'ninguno'})
- Elemento dominante: ${elementoDominante.name} (${elementoDominante.percentage}%)
- Elemento escaso: ${elementoEscaso.name} (${elementoEscaso.percentage}%)

DISTRIBUCIÓN MODAL:
- Cardinal: ${modalidades.cardinal.percentage}% (${modalidades.cardinal.planets.join(', ') || 'ninguno'})
- Fijo: ${modalidades.fixed.percentage}% (${modalidades.fixed.planets.join(', ') || 'ninguno'})
- Mutable: ${modalidades.mutable.percentage}% (${modalidades.mutable.planets.join(', ') || 'ninguno'})

═══════════════════════════════════════════════════════════════════════════════
INSTRUCCIONES DE ESTILO
═══════════════════════════════════════════════════════════════════════════════

LENGUAJE DISRUPTIVO:
- Usa "¡NO VINISTE A...!" para romper creencias limitantes
- Usa "¡ESTO ES ENORME!" para enfatizar aspectos importantes
- Usa MAYÚSCULAS estratégicamente para ENFATIZAR palabras clave
- Habla DIRECTO a ${userProfile.name}, usa su nombre
- Mezcla: EDUCATIVO (claro) + PODEROSO (transformacional) + POÉTICO (metáforas)
- Las sombras tienen TRAMPA (reactiva) y REGALO (consciente)
- Declaraciones empiezan con "YO SOY..."

═══════════════════════════════════════════════════════════════════════════════
ESTRUCTURA JSON REQUERIDA
═══════════════════════════════════════════════════════════════════════════════

Responde ÚNICAMENTE con JSON válido. Sin texto adicional antes ni después.

{
  "puntos_fundamentales": {
    "sol": { "signo": "${sol?.sign}", "grado": ${sol?.degree || 0}, "casa": ${sol?.house || 0}, "superpoder": "descripción corta del superpoder" },
    "luna": { "signo": "${luna?.sign}", "grado": ${luna?.degree || 0}, "casa": ${luna?.house || 0}, "superpoder": "..." },
    "ascendente": { "signo": "${chartData.ascendant.sign}", "grado": ${chartData.ascendant.degree}, "superpoder": "..." },
    "medio_cielo": { "signo": "${chartData.midheaven.sign}", "grado": ${chartData.midheaven.degree}, "superpoder": "..." },
    "nodo_norte": { "signo": "${nodoNorte?.sign}", "grado": ${nodoNorte?.degree || 0}, "casa": ${nodoNorte?.house || 0}, "superpoder": "..." },
    "nodo_sur": { "signo": "${nodoSur?.sign}", "grado": ${nodoSur?.degree || 0}, "casa": ${nodoSur?.house || 0}, "superpoder": "..." }
  },

  "sintesis_elemental": {
    "fuego": { "porcentaje": ${elementos.fire.percentage}, "planetas": ${JSON.stringify(elementos.fire.planets)}, "significado": "qué significa tener este % de fuego" },
    "tierra": { "porcentaje": ${elementos.earth.percentage}, "planetas": ${JSON.stringify(elementos.earth.planets)}, "significado": "..." },
    "aire": { "porcentaje": ${elementos.air.percentage}, "planetas": ${JSON.stringify(elementos.air.planets)}, "significado": "..." },
    "agua": { "porcentaje": ${elementos.water.percentage}, "planetas": ${JSON.stringify(elementos.water.planets)}, "significado": "..." },
    "elemento_dominante": "${elementoDominante.name}",
    "elemento_escaso": "${elementoEscaso.name}",
    "configuracion_alquimica": "Texto de 4-6 líneas explicando la configuración elemental única de ${userProfile.name}. Ej: 'Eres FUEGO DOMINANTE con AIRE como aliado...'"
  },

  "modalidades": {
    "cardinal": { "porcentaje": ${modalidades.cardinal.percentage}, "significado": "qué significa ser X% cardinal" },
    "fijo": { "porcentaje": ${modalidades.fixed.percentage}, "significado": "..." },
    "mutable": { "porcentaje": ${modalidades.mutable.percentage}, "significado": "..." },
    "ritmo_accion": "Texto explicando el ritmo de acción de ${userProfile.name}"
  },

  "esencia_revolucionaria": "Texto DISRUPTIVO de 8-12 líneas sobre la esencia de ${userProfile.name}. Empieza con '¡${userProfile.name.toUpperCase()}, NO VINISTE A ENCAJAR!' Fusiona Sol + Ascendente + Luna. Explica su combinación ÚNICA.",

  "proposito_vida": {
    "nodo_norte": {
      "signo": "${nodoNorte?.sign}",
      "casa": ${nodoNorte?.house || 0},
      "mision": "Texto de 4-6 líneas sobre la misión evolutiva",
      "habilidades_activar": ["habilidad 1", "habilidad 2", "habilidad 3", "habilidad 4"]
    },
    "nodo_sur": {
      "signo": "${nodoSur?.sign}",
      "casa": ${nodoSur?.house || 0},
      "zona_confort": "Texto sobre la zona de confort kármica",
      "patrones_soltar": ["patrón 1", "patrón 2", "patrón 3"]
    },
    "salto_evolutivo": {
      "de": "De qué está evolucionando (ej: 'Gurú solitaria con LA verdad')",
      "a": "Hacia qué evoluciona (ej: 'Facilitadora de redes donde TODOS brillan')"
    }
  },

  "interpretaciones": {
    "sol": {
      "posicion": { "signo": "${sol?.sign}", "casa": ${sol?.house || 0}, "grado": ${sol?.degree || 0} },
      "educativo": "Texto EDUCATIVO de 6-8 líneas. Explica QUÉ es el Sol, QUÉ significa en ${sol?.sign}, QUÉ implica la Casa ${sol?.house}.",
      "poderoso": "Texto PODEROSO de 8-10 líneas. Usa '¡NO VINISTE A...!', 'Tu superpoder es...'. MAYÚSCULAS estratégicas.",
      "poetico": "Texto POÉTICO de 4-6 líneas. Metáfora hermosa sobre el Sol en ${sol?.sign} Casa ${sol?.house}.",
      "sombras": [
        {
          "nombre": "Nombre de la sombra 1",
          "patron": "Cómo se manifiesta este patrón",
          "trampa": "❌ La forma reactiva/inconsciente",
          "regalo": "✅ La forma consciente/transformada"
        },
        {
          "nombre": "Nombre de la sombra 2",
          "patron": "...",
          "trampa": "❌ ...",
          "regalo": "✅ ..."
        }
      ],
      "sintesis": {
        "frase": "Frase memorable de máximo 15 palabras",
        "declaracion": "YO SOY... (declaración de poder en 2-4 líneas)"
      }
    },
    "luna": {
      "posicion": { "signo": "${luna?.sign}", "casa": ${luna?.house || 0}, "grado": ${luna?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "ascendente": {
      "posicion": { "signo": "${chartData.ascendant.sign}", "casa": 1, "grado": ${chartData.ascendant.degree} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "medio_cielo": {
      "posicion": { "signo": "${chartData.midheaven.sign}", "casa": 10, "grado": ${chartData.midheaven.degree} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "mercurio": {
      "posicion": { "signo": "${mercurio?.sign}", "casa": ${mercurio?.house || 0}, "grado": ${mercurio?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "venus": {
      "posicion": { "signo": "${venus?.sign}", "casa": ${venus?.house || 0}, "grado": ${venus?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "marte": {
      "posicion": { "signo": "${marte?.sign}", "casa": ${marte?.house || 0}, "grado": ${marte?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "jupiter": {
      "posicion": { "signo": "${jupiter?.sign}", "casa": ${jupiter?.house || 0}, "grado": ${jupiter?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "saturno": {
      "posicion": { "signo": "${saturno?.sign}", "casa": ${saturno?.house || 0}, "grado": ${saturno?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "urano": {
      "posicion": { "signo": "${urano?.sign}", "casa": ${urano?.house || 0}, "grado": ${urano?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "neptuno": {
      "posicion": { "signo": "${neptuno?.sign}", "casa": ${neptuno?.house || 0}, "grado": ${neptuno?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "pluton": {
      "posicion": { "signo": "${pluton?.sign}", "casa": ${pluton?.house || 0}, "grado": ${pluton?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "quiron": {
      "posicion": { "signo": "${quiron?.sign}", "casa": ${quiron?.house || 0}, "grado": ${quiron?.degree || 0} },
      "educativo": "Explica Quirón como el sanador herido...",
      "poderoso": "Tu herida es tu portal de sanación para otros...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "lilith": {
      "posicion": { "signo": "${lilith?.sign}", "casa": ${lilith?.house || 0}, "grado": ${lilith?.degree || 0} },
      "educativo": "Explica Lilith como poder femenino oculto...",
      "poderoso": "Tu poder rechazado que espera ser reclamado...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    },
    "nodo_norte": {
      "posicion": { "signo": "${nodoNorte?.sign}", "casa": ${nodoNorte?.house || 0}, "grado": ${nodoNorte?.degree || 0} },
      "educativo": "...",
      "poderoso": "...",
      "poetico": "...",
      "sombras": [{ "nombre": "...", "patron": "...", "trampa": "...", "regalo": "..." }],
      "sintesis": { "frase": "...", "declaracion": "..." }
    }
  },

  "fortalezas_educativas": {
    "como_aprendes_mejor": [
      "Cuando el tema te APASIONA (no por obligación)",
      "Con aplicación PRÁCTICA inmediata",
      "A tu PROPIO ritmo",
      "..."
    ],
    "inteligencias_dominantes": [
      { "tipo": "Inteligencia Intuitiva", "descripcion": "Captas info de fuentes no-lineales", "planeta_origen": "Neptuno fuerte / Luna" },
      { "tipo": "...", "descripcion": "...", "planeta_origen": "..." }
    ],
    "modalidades_estudio": [
      "Cursos intensivos (mejor que largos semestres)",
      "Podcasts y audios (Casa 3 activa)",
      "..."
    ]
  },

  "areas_especializacion": [
    {
      "area": "Nombre del área (ej: Transformación y Sanación)",
      "planetas_origen": "Sol Piscis Casa 8 + Plutón",
      "profesiones_sugeridas": ["Psicología profunda", "Coaching transformacional", "Sanación energética"]
    },
    {
      "area": "...",
      "planetas_origen": "...",
      "profesiones_sugeridas": ["...", "...", "..."]
    },
    {
      "area": "...",
      "planetas_origen": "...",
      "profesiones_sugeridas": ["...", "...", "..."]
    }
  ],

  "patrones_sanacion": {
    "heridas": [
      {
        "nombre": "Nombre de la herida (ej: 'La Herida del Sacrificio')",
        "planeta_origen": "Sol Piscis Casa 8",
        "patron": "Descripción del patrón (ej: 'Creer que para ser amada debes DARTE hasta vaciarte')",
        "origen_infancia": "Qué pasó en la infancia que creó este patrón",
        "como_se_manifiesta": ["manifestación 1", "manifestación 2", "manifestación 3"],
        "sanacion": "Qué práctica o cambio de perspectiva sana esto"
      },
      {
        "nombre": "...",
        "planeta_origen": "...",
        "patron": "...",
        "origen_infancia": "...",
        "como_se_manifiesta": ["...", "..."],
        "sanacion": "..."
      }
    ]
  },

  "manifestacion_amor": {
    "patron_amoroso": "Descripción del patrón (ej: 'Con Venus Aries + Luna Libra, combinas fuego y aire...')",
    "que_atraes": "Qué tipo de personas atraes naturalmente",
    "que_necesitas": "Qué necesitas en una relación para sentirte plena",
    "trampa_amorosa": "Tu trampa recurrente en el amor",
    "leccion_amorosa": "Qué estás aprendiendo sobre el amor",
    "declaracion_amor": "Declaración de poder sobre el amor (3-4 líneas)"
  },

  "visualizacion": {
    "duracion": "15-20 minutos",
    "mejor_momento": "Luna Llena o tu cumpleaños solar",
    "preparacion": ["Espacio tranquilo, luz de vela", "Tu carta natal impresa o en pantalla", "Posición cómoda, ojos cerrados"],
    "texto_visualizacion": "Texto completo de la visualización guiada personalizada para ${userProfile.name}, mencionando su Sol en ${sol?.sign}, Luna en ${luna?.sign}, Ascendente ${chartData.ascendant.sign}..."
  },

  "declaracion_poder": "Texto completo de la declaración de poder final. 8-12 líneas. Empieza con 'YO SOY...' Fusiona todos los elementos de la carta. Termina con algo impactante como 'NO PIDO PERMISO PARA SER TODA YO.'",

  "datos_para_agenda": {
    "heridas_para_ciclos_lunares": ["nombre herida 1", "nombre herida 2"],
    "ritual_amor_luna_optima": "Luna Nueva en Libra",
    "temas_principales": ["tema 1 de la carta", "tema 2", "tema 3"]
  }
}

═══════════════════════════════════════════════════════════════════════════════
IMPORTANTE
═══════════════════════════════════════════════════════════════════════════════
- Responde SOLO con JSON válido
- NO agregues texto antes ni después del JSON
- USA el nombre ${userProfile.name} en los textos
- Sé ESPECÍFICO para esta carta, no genérico
- El tono es DISRUPTIVO, TRANSFORMACIONAL, EMPODERADOR
- Cada sección debe tener contenido SUSTANCIAL (no texto placeholder)
`;
}
