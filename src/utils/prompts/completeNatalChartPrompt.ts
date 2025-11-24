// =============================================================================
// 🎯 COMPLETE NATAL CHART PROMPT - ESTRUCTURA DETALLADA
// src/utils/prompts/completeNatalChartPrompt.ts
// Genera interpretación completa con todas las secciones en estilo DISRUPTIVO
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
}

// =============================================================================
// ELEMENT AND MODALITY CALCULATIONS
// =============================================================================

const FIRE_SIGNS = ['Aries', 'Leo', 'Sagittarius', 'Sagitario'];
const EARTH_SIGNS = ['Taurus', 'Tauro', 'Virgo', 'Capricorn', 'Capricornio'];
const AIR_SIGNS = ['Gemini', 'Géminis', 'Libra', 'Aquarius', 'Acuario'];
const WATER_SIGNS = ['Cancer', 'Cáncer', 'Scorpio', 'Escorpio', 'Pisces', 'Piscis'];

const CARDINAL_SIGNS = ['Aries', 'Cancer', 'Cáncer', 'Libra', 'Capricorn', 'Capricornio'];
const FIXED_SIGNS = ['Taurus', 'Tauro', 'Leo', 'Scorpio', 'Escorpio', 'Aquarius', 'Acuario'];
const MUTABLE_SIGNS = ['Gemini', 'Géminis', 'Virgo', 'Sagittarius', 'Sagitario', 'Pisces', 'Piscis'];

export function calculateElementDistribution(planets: ChartData['planets']) {
  const elements = { fire: [] as string[], earth: [] as string[], air: [] as string[], water: [] as string[] };

  planets.forEach(p => {
    const sign = p.sign;
    if (FIRE_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.fire.push(p.name);
    else if (EARTH_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.earth.push(p.name);
    else if (AIR_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.air.push(p.name);
    else if (WATER_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) elements.water.push(p.name);
  });

  const total = planets.length || 1;
  return {
    fire: { count: elements.fire.length, percentage: Math.round((elements.fire.length / total) * 100), planets: elements.fire },
    earth: { count: elements.earth.length, percentage: Math.round((elements.earth.length / total) * 100), planets: elements.earth },
    air: { count: elements.air.length, percentage: Math.round((elements.air.length / total) * 100), planets: elements.air },
    water: { count: elements.water.length, percentage: Math.round((elements.water.length / total) * 100), planets: elements.water },
  };
}

export function calculateModalityDistribution(planets: ChartData['planets']) {
  const modalities = { cardinal: [] as string[], fixed: [] as string[], mutable: [] as string[] };

  planets.forEach(p => {
    const sign = p.sign;
    if (CARDINAL_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.cardinal.push(p.name);
    else if (FIXED_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.fixed.push(p.name);
    else if (MUTABLE_SIGNS.some(s => sign.toLowerCase().includes(s.toLowerCase()))) modalities.mutable.push(p.name);
  });

  const total = planets.length || 1;
  return {
    cardinal: { count: modalities.cardinal.length, percentage: Math.round((modalities.cardinal.length / total) * 100), planets: modalities.cardinal },
    fixed: { count: modalities.fixed.length, percentage: Math.round((modalities.fixed.length / total) * 100), planets: modalities.fixed },
    mutable: { count: modalities.mutable.length, percentage: Math.round((modalities.mutable.length / total) * 100), planets: modalities.mutable },
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function findPlanet(planets: ChartData['planets'], ...names: string[]) {
  return planets.find(p => names.some(n => p.name.toLowerCase().includes(n.toLowerCase())));
}

function formatPlanetsForPrompt(planets: ChartData['planets']): string {
  return planets.map(p =>
    `- ${p.name}: ${p.sign} ${p.degree}° Casa ${p.house}${p.retrograde ? ' (R)' : ''}`
  ).join('\n');
}

function formatAspectsForPrompt(aspects: ChartData['aspects']): string {
  if (!aspects || aspects.length === 0) return 'No hay aspectos calculados';
  return aspects.slice(0, 15).map(a => `- ${a.planet1} ${a.type} ${a.planet2} (orbe: ${a.orb}°)`).join('\n');
}

// =============================================================================
// MAIN PROMPT GENERATOR
// =============================================================================

export function generateCompleteNatalChartPrompt(chartData: ChartData, userProfile: UserProfile): string {
  const elementos = calculateElementDistribution(chartData.planets);
  const modalidades = calculateModalityDistribution(chartData.planets);

  const sun = findPlanet(chartData.planets, 'sol', 'sun');
  const moon = findPlanet(chartData.planets, 'luna', 'moon');
  const mercury = findPlanet(chartData.planets, 'mercurio', 'mercury');
  const venus = findPlanet(chartData.planets, 'venus');
  const mars = findPlanet(chartData.planets, 'marte', 'mars');
  const jupiter = findPlanet(chartData.planets, 'júpiter', 'jupiter');
  const saturn = findPlanet(chartData.planets, 'saturno', 'saturn');
  const uranus = findPlanet(chartData.planets, 'urano', 'uranus');
  const neptune = findPlanet(chartData.planets, 'neptuno', 'neptune');
  const pluto = findPlanet(chartData.planets, 'plutón', 'pluto');
  const northNode = findPlanet(chartData.planets, 'nodo norte', 'north node', 'rahu');
  const chiron = findPlanet(chartData.planets, 'quirón', 'chiron');
  const lilith = findPlanet(chartData.planets, 'lilith');

  return `Eres un ASTRÓLOGO REVOLUCIONARIO con estilo ÚNICO que combina:
- EDUCATIVO: Explicas qué significa cada posición astrológica
- PODEROSO: Lenguaje DISRUPTIVO que DESPIERTA ("NO viniste a...", "Tu misión es...")
- POÉTICO: Imágenes evocadoras y frases memorables
- PRÁCTICO: Rituales vinculados a FASES LUNARES (NUNCA a días de semana como lunes, martes...)

═══════════════════════════════════════════════
DATOS DE LA CARTA NATAL DE ${userProfile.name.toUpperCase()}
═══════════════════════════════════════════════

PERSONA:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age} años
- Fecha: ${userProfile.birthDate}
- Hora: ${userProfile.birthTime}
- Lugar: ${userProfile.birthPlace}

PUNTOS CARDINALES:
- Ascendente: ${chartData.ascendant.sign} ${chartData.ascendant.degree}°
- Medio Cielo: ${chartData.midheaven.sign} ${chartData.midheaven.degree}°

POSICIONES PLANETARIAS:
${formatPlanetsForPrompt(chartData.planets)}

ASPECTOS PRINCIPALES:
${formatAspectsForPrompt(chartData.aspects)}

DISTRIBUCIÓN ELEMENTAL (calculada):
🔥 Fuego: ${elementos.fire.percentage}% (${elementos.fire.planets.join(', ') || 'ninguno'})
🌍 Tierra: ${elementos.earth.percentage}% (${elementos.earth.planets.join(', ') || 'ninguno'})
💨 Aire: ${elementos.air.percentage}% (${elementos.air.planets.join(', ') || 'ninguno'})
🌊 Agua: ${elementos.water.percentage}% (${elementos.water.planets.join(', ') || 'ninguno'})

DISTRIBUCIÓN MODAL (calculada):
🚀 Cardinal: ${modalidades.cardinal.percentage}% (${modalidades.cardinal.planets.join(', ') || 'ninguno'})
🗿 Fijo: ${modalidades.fixed.percentage}% (${modalidades.fixed.planets.join(', ') || 'ninguno'})
🌊 Mutable: ${modalidades.mutable.percentage}% (${modalidades.mutable.planets.join(', ') || 'ninguno'})

═══════════════════════════════════════════════
GENERA LA INTERPRETACIÓN COMPLETA EN JSON
═══════════════════════════════════════════════

Responde ÚNICAMENTE con un JSON válido:

{
  "puntos_fundamentales": {
    "sol": { "signo": "${sun?.sign}", "grado": ${sun?.degree || 0}, "casa": ${sun?.house || 1}, "poder": "[Descripción del poder solar]" },
    "luna": { "signo": "${moon?.sign}", "grado": ${moon?.degree || 0}, "casa": ${moon?.house || 1}, "poder": "[Descripción emocional]" },
    "ascendente": { "signo": "${chartData.ascendant.sign}", "grado": ${chartData.ascendant.degree}, "casa": 1, "poder": "[Máscara al mundo]" },
    "medio_cielo": { "signo": "${chartData.midheaven.sign}", "grado": ${chartData.midheaven.degree}, "casa": 10, "poder": "[Vocación]" },
    "nodo_norte": { "signo": "${northNode?.sign || 'No disponible'}", "grado": ${northNode?.degree || 0}, "casa": ${northNode?.house || 1}, "poder": "[Destino evolutivo]" }
  },

  "sintesis_elemental": {
    "fuego": { "porcentaje": ${elementos.fire.percentage}, "planetas": ${JSON.stringify(elementos.fire.planets)}, "significado": "[Qué significa este % de fuego para ${userProfile.name}]" },
    "tierra": { "porcentaje": ${elementos.earth.percentage}, "planetas": ${JSON.stringify(elementos.earth.planets)}, "significado": "[Significado]" },
    "aire": { "porcentaje": ${elementos.air.percentage}, "planetas": ${JSON.stringify(elementos.air.planets)}, "significado": "[Significado]" },
    "agua": { "porcentaje": ${elementos.water.percentage}, "planetas": ${JSON.stringify(elementos.water.planets)}, "significado": "[Significado]" },
    "configuracion_alquimica": "[Párrafo PODEROSO de 4-5 líneas: 'Eres un ser de X DOMINANTE con Y como aliado - esto significa que tu naturaleza es ACTUAR, CREAR... No viniste a contemplar desde la barrera...']",
    "elemento_escaso": "[Si hay elemento <15%, explicar qué significa esa carencia y cómo trabajarla]"
  },

  "modalidades": {
    "cardinal": { "porcentaje": ${modalidades.cardinal.percentage}, "significado": "[Cómo inicia]" },
    "fijo": { "porcentaje": ${modalidades.fixed.percentage}, "significado": "[Cómo sostiene]" },
    "mutable": { "porcentaje": ${modalidades.mutable.percentage}, "significado": "[Cómo se adapta]" },
    "ritmo_accion": "[Párrafo: CÓMO ${userProfile.name} toma acción en la vida según su distribución modal]"
  },

  "esencia_revolucionaria": "[4-5 líneas PODEROSAS: 'Eres un Alma [adjetivo] con el Sol en ${sun?.sign} y la Luna en ${moon?.sign}, destinada a... NO viniste a este mundo a pasar desapercibida...']",

  "interpretaciones_planetarias": {
    "sol": {
      "posicion": "${sun?.sign} Casa ${sun?.house}",
      "titulo_arquetipo": "[Título creativo: 'La Mística que Transforma' o similar]",
      "proposito_vida": "[3-4 párrafos PROFUNDOS sobre propósito de vida. Incluir: DISOLVER, SANAR, TRANSFORMAR, CONECTAR...]",
      "trampa": "[La trampa específica de esta posición - qué hacer MAL]",
      "superpoder": "[El superpoder cuando se usa BIEN]",
      "afirmacion": "[Mantra para este Sol]"
    },
    "luna": {
      "posicion": "${moon?.sign} Casa ${moon?.house}",
      "titulo_arquetipo": "[Título: 'La Diplomática del Alma' o similar]",
      "mundo_emocional": "[2-3 párrafos: cómo funciona emocionalmente]",
      "como_se_nutre": "[4-5 formas en que se nutre emocionalmente]",
      "patron_infancia": "[Patrón aprendido en infancia]",
      "sanacion_emocional": "[Qué necesita sanar]"
    },
    "ascendente": {
      "posicion": "${chartData.ascendant.sign} Casa 1",
      "titulo_arquetipo": "[Título: 'La Reina que Brilla sin Pedir Permiso']",
      "personalidad_visible": "[2-3 párrafos: cómo se presenta al mundo]",
      "presencia": "[Qué tipo de presencia tiene]",
      "mascara_vs_esencia": "[Diferencia entre lo que muestra y lo que ES]"
    },
    "mercurio": {
      "posicion": "${mercury?.sign} Casa ${mercury?.house}",
      "titulo_arquetipo": "[Título: 'La Mente Relámpago']",
      "como_piensa": "[2 párrafos: forma de pensar y comunicar]",
      "fortalezas_mentales": "[4 fortalezas]",
      "desafio": "[Principal desafío comunicativo]"
    },
    "venus": {
      "posicion": "${venus?.sign} Casa ${venus?.house}",
      "titulo_arquetipo": "[Título: 'El Amor que Conquista']",
      "como_ama": "[2 párrafos: forma de amar]",
      "que_necesita_en_pareja": "[Párrafo específico]",
      "trampa_amorosa": "[Patrón negativo]",
      "valores": "[Qué considera bello/valioso]"
    },
    "marte": {
      "posicion": "${mars?.sign} Casa ${mars?.house}",
      "titulo_arquetipo": "[Título: 'La Guerrera Nata']",
      "como_actua": "[2 párrafos: cómo toma acción]",
      "energia_vital": "[Motor interno]",
      "ira": "[Cómo maneja la ira]",
      "desafio": "[Qué canalizar mejor]"
    },
    "jupiter": {
      "posicion": "${jupiter?.sign} Casa ${jupiter?.house}",
      "titulo_arquetipo": "[Título: 'La Suerte del Rebelde']",
      "donde_viene_suerte": "[De dónde viene su fortuna]",
      "expansion": "[Cómo y dónde expandirse]",
      "consejo": "[Consejo específico]"
    },
    "saturno": {
      "posicion": "${saturn?.sign} Casa ${saturn?.house}",
      "titulo_arquetipo": "[Título: 'La Maestra de las Profundidades']",
      "karma_lecciones": "[2 párrafos: lecciones kármicas]",
      "responsabilidad": "[Responsabilidad principal]",
      "recompensa": "[Qué gana después de los 29-30]"
    },
    "urano": {
      "posicion": "${uranus?.sign} Casa ${uranus?.house}",
      "donde_revoluciona": "[Dónde rompe moldes]",
      "genialidad": "[Su forma única de genialidad]"
    },
    "neptuno": {
      "posicion": "${neptune?.sign} Casa ${neptune?.house}",
      "espiritualidad": "[Conexión espiritual]",
      "ilusion_vs_inspiracion": "[Dónde puede engañarse vs inspirarse]"
    },
    "pluton": {
      "posicion": "${pluto?.sign} Casa ${pluto?.house}",
      "transformacion": "[Poder transformador]",
      "sombra_y_poder": "[Sombra y cómo convertirla en poder]"
    },
    "quiron": {
      "posicion": "${chiron?.sign || 'No disponible'} Casa ${chiron?.house || 'N/A'}",
      "herida_principal": "[Herida de Quirón]",
      "don_sanador": "[Don que emerge de la herida]"
    }
  },

  "aspectos_destacados": {
    "stelliums": "[Si hay 3+ planetas en mismo signo, describir el SÚPER-PODER]",
    "aspectos_tensos": "[2-3 cuadraturas/oposiciones y su significado transformador]",
    "aspectos_armoniosos": "[2-3 trígonos/sextiles y los dones que otorgan]",
    "patron_dominante": "[Patrón astrológico dominante de la carta]"
  },

  "integracion_carta": {
    "hilo_de_oro": "[Párrafo que UNE todas las posiciones en narrativa coherente: 'Tu carta cuenta una historia de FUSIÓN DE OPUESTOS...']",
    "sintesis": "[Frase síntesis: 'Eres una GUERRERA MÍSTICA - alguien que lucha por causas espirituales...']",
    "polaridades": [
      { "polo_a": "[Ej: Acción]", "polo_b": "[Ej: Contemplación]", "integracion": "[Cómo integrar]" }
    ]
  },

  "fortalezas_educativas": {
    "como_aprende_mejor": ["[Condición 1]", "[Condición 2]", "[Condición 3]", "[Condición 4]"],
    "inteligencias_dominantes": [
      { "tipo": "[Tipo]", "descripcion": "[Descripción]", "planeta_origen": "[Planeta]" }
    ],
    "modalidades_estudio": ["[Modalidad 1]", "[Modalidad 2]", "[Modalidad 3]"]
  },

  "areas_especializacion": [
    { "area": "[Área 1]", "origen_astrologico": "[Posiciones]", "profesiones": ["Prof1", "Prof2", "Prof3"], "descripcion": "[Por qué es natural]" },
    { "area": "[Área 2]", "origen_astrologico": "[Posiciones]", "profesiones": ["Prof1", "Prof2"], "descripcion": "[Descripción]" },
    { "area": "[Área 3]", "origen_astrologico": "[Posiciones]", "profesiones": ["Prof1", "Prof2"], "descripcion": "[Descripción]" }
  ],

  "patrones_sanacion": {
    "heridas": [
      { "nombre": "[Herida 1]", "origen_astrologico": "[Posición]", "patron": "[Patrón negativo]", "origen_infancia": "[Qué aprendió]", "sanacion": "[Práctica]" },
      { "nombre": "[Herida 2]", "origen_astrologico": "[Posición]", "patron": "[Patrón]", "origen_infancia": "[Origen]", "sanacion": "[Sanación]" }
    ],
    "ciclos_sanacion_lunar": {
      "luna_nueva": "[Ritual específico para Luna Nueva]",
      "luna_creciente": "[Práctica luna creciente]",
      "luna_llena": "[Ritual Luna Llena]",
      "luna_menguante": "[Práctica de soltar]"
    },
    "practicas_integracion": [
      { "practica": "[Práctica 1]", "duracion": "[Tiempo]", "beneficio": "[Beneficio para su carta]", "fase_lunar": "[Mejor fase]" },
      { "practica": "[Práctica 2]", "duracion": "[Tiempo]", "beneficio": "[Beneficio]", "fase_lunar": "[Fase]" }
    ]
  },

  "manifestacion_amor": {
    "patron_amoroso": "[Párrafo: patrón en amor según Venus, Marte, Luna, Casa 7]",
    "que_atrae": "[Qué tipo de personas atrae]",
    "que_necesita": "[Qué necesita realmente en pareja]",
    "trampa_amorosa": "[Patrón negativo en amor]",
    "ritual_luna_nueva_venus": {
      "preparacion": "[Instrucciones - Luna Nueva en Libra o signo de Venus]",
      "activacion_28_dias": "[Práctica durante ciclo lunar]",
      "entrega_luna_llena": "[Ritual de entrega]"
    },
    "declaracion_amor": "[Declaración: 'Merezco un amor que iguale mi fuego sin quemarme...']"
  },

  "visualizacion_guiada": {
    "titulo": "Encuentro con tu Carta Natal",
    "duracion": "15-20 minutos",
    "mejor_momento": "Luna Llena o cumpleaños solar",
    "preparacion": ["Espacio tranquilo, luz de vela", "Carta natal visible", "Cuaderno cerca"],
    "texto": "[Texto COMPLETO de visualización de 250-300 palabras personalizado. Incluir: encuentro con Sol en ${sun?.sign}, Luna en ${moon?.sign}, Ascendente ${chartData.ascendant.sign}. Terminar con preguntas reflexivas: '¿Qué necesito integrar hoy?']"
  },

  "datos_para_agenda": {
    "eventos_lunares_personalizados": [
      { "evento": "Luna Nueva en ${sun?.sign}", "significado": "[Significado personal]", "ritual": "[Ritual]", "intencion": "[Intención a sembrar]" },
      { "evento": "Luna Llena en ${moon?.sign}", "significado": "[Significado]", "ritual": "[Ritual]", "intencion": "[Intención]" }
    ],
    "practicas_por_fase": {
      "luna_nueva": ["[Práctica 1]", "[Práctica 2]"],
      "cuarto_creciente": ["[Práctica 1]", "[Práctica 2]"],
      "luna_llena": ["[Práctica 1]", "[Práctica 2]"],
      "cuarto_menguante": ["[Práctica 1]", "[Práctica 2]"]
    },
    "dias_poder": [
      { "cuando": "Luna transita ${sun?.sign}", "que_hacer": "[Actividades de poder]", "que_evitar": "[Qué evitar]" },
      { "cuando": "Luna transita ${chartData.ascendant.sign}", "que_hacer": "[Actividades]", "que_evitar": "[Evitar]" }
    ],
    "advertencias_cosmicas": [
      { "situacion": "Mercurio Retrógrado", "como_afecta": "[Específico para Mercurio en ${mercury?.sign}]", "precauciones": "[Cuidar]" }
    ]
  },

  "declaracion_poder_final": "[Declaración ÉPICA de 5-6 líneas en primera persona para ${userProfile.name}. Incluir esencia, propósito. Terminar con: 'Este es mi mapa. Esta es mi magia. Esta SOY YO.']",

  "mantra_personal": "[Frase corta de mantra: 'SOY FUEGO que transforma, AGUA que sana, LUZ que guía...']"
}

INSTRUCCIONES CRÍTICAS:
1. TODOS los campos con contenido REAL y PERSONALIZADO para ${userProfile.name}
2. Lenguaje DISRUPTIVO: "TÚ", "NO viniste a...", "Tu misión es..."
3. Prácticas SIEMPRE vinculadas a FASES LUNARES, NUNCA a días de semana
4. Usa los DATOS ESPECÍFICOS de las posiciones (signos, casas, grados)
5. JSON válido y completo sin [...] ni comentarios
6. Cada interpretación planetaria debe tener TÍTULO ARQUETIPO creativo`;
}

export default generateCompleteNatalChartPrompt;
