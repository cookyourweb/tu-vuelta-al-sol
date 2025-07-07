// src/constants/astrology/chartConstants.ts
// Constantes para el componente ChartDisplay

import { AspectConfig, AspectMeaning, HouseMeaning, PlanetMeaning } from "./chartDisplay";

// =============================================================================
// CONFIGURACIÓN DE ASPECTOS ASTROLÓGICOS
// =============================================================================

export const ASPECTS: Record<string, AspectConfig> = {
  conjunction: { angle: 0, orb: 8, color: '#22c55e', name: 'Conjunción', difficulty: 'neutral' },
  sextile: { angle: 60, orb: 6, color: '#3b82f6', name: 'Sextil', difficulty: 'easy' },
  square: { angle: 90, orb: 8, color: '#ef4444', name: 'Cuadratura', difficulty: 'hard' },
  trine: { angle: 120, orb: 8, color: '#06b6d4', name: 'Trígono', difficulty: 'easy' },
  opposition: { angle: 180, orb: 8, color: '#dc2626', name: 'Oposición', difficulty: 'hard' },
  semisextile: { angle: 30, orb: 3, color: '#8b5cf6', name: 'Semisextil', difficulty: 'minor' },
  semisquare: { angle: 45, orb: 3, color: '#f59e0b', name: 'Semicuadratura', difficulty: 'minor' },
  sesquiquadrate: { angle: 135, orb: 3, color: '#f59e0b', name: 'Sesquicuadratura', difficulty: 'minor' },
  quincunx: { angle: 150, orb: 3, color: '#ec4899', name: 'Quincuncio', difficulty: 'minor' }
};

// =============================================================================
// SÍMBOLOS Y COLORES PLANETARIOS
// =============================================================================

export const PLANET_SYMBOLS: Record<string, string> = {
  'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀', 'Marte': '♂',
  'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅', 'Neptuno': '♆', 'Plutón': '♇',
  'Nodo Norte': '☊', 'Nodo Sur': '☋', 'Quirón': '⚷'
};

export const PLANET_COLORS: Record<string, string> = {
  'Sol': '#fbbf24', 'Luna': '#e5e7eb', 'Mercurio': '#06b6d4', 'Venus': '#22c55e',
  'Marte': '#ef4444', 'Júpiter': '#8b5cf6', 'Saturno': '#64748b', 'Urano': '#0ea5e9',
  'Neptuno': '#3b82f6', 'Plutón': '#7c2d12', 'Nodo Norte': '#f59e0b', 'Nodo Sur': '#f59e0b'
};

export const SIGN_SYMBOLS: Record<string, string> = {
  'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
  'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓'
};

// =============================================================================
// SIGNIFICADOS EDUCATIVOS COMPLETOS
// =============================================================================

export const aspectMeanings: Record<string, AspectMeaning> = {
  conjunction: {
    name: 'Conjunción',
    meaning: 'Fusión de energías. Los planetas trabajan como uno solo.',
    effect: 'Intensifica y unifica las cualidades planetarias',
    type: 'Neutral - puede ser armónico o tenso según los planetas',
    explanation: 'Es como si dos personas trabajaran en perfecta sincronía hacia el mismo objetivo. Las energías se mezclan completamente.'
  },
  sextile: {
    name: 'Sextil', 
    meaning: 'Oportunidad y facilidad. Energías que fluyen naturalmente.',
    effect: 'Facilita el desarrollo de talentos y oportunidades',
    type: 'Armónico - aspectos de crecimiento y facilidad',
    explanation: 'Como tener una conversación fluida. Las energías se apoyan mutuamente y crean oportunidades cuando decides actuar.'
  },
  square: {
    name: 'Cuadratura',
    meaning: 'Tensión creativa. Conflicto que genera crecimiento.',
    effect: 'Crea desafíos que impulsan el desarrollo personal',
    type: 'Tenso - genera fricción pero también evolución',
    explanation: 'Como hacer ejercicio: duele en el momento pero te hace más fuerte. Esta tensión te obliga a crecer y encontrar soluciones.'
  },
  trine: {
    name: 'Trígono',
    meaning: 'Armonía natural. Las energías fluyen sin esfuerzo.',
    effect: 'Aporta facilidad, talento natural y fluidez',
    type: 'Armónico - el aspecto más favorable y fluido',
    explanation: 'Como respirar: sucede de forma natural. Tienes talento innato cuando estas energías trabajan juntas.'
  },
  opposition: {
    name: 'Oposición',
    meaning: 'Polarización. Necesidad de encontrar equilibrio.',
    effect: 'Requiere integrar energías opuestas',
    type: 'Tenso - busca balance entre fuerzas contrarias',
    explanation: 'Como estar en una balanza. Necesitas encontrar el punto medio entre dos fuerzas que tiran en direcciones opuestas.'
  },
  semisextile: {
    name: 'Semisextil',
    meaning: 'Ajuste sutil. Pequeñas correcciones necesarias.',
    effect: 'Aporta refinamiento y ajustes menores',
    type: 'Menor - aspectos de matiz y sutileza',
    explanation: 'Como afinar un instrumento musical. Pequeños ajustes que perfeccionan el resultado final.'
  },
  semisquare: {
    name: 'Semicuadratura',
    meaning: 'Irritación menor. Pequeñas fricciones que molestan.',
    effect: 'Genera pequeñas tensiones que piden atención',
    type: 'Menor tenso - roces cotidianos que educan',
    explanation: 'Como una piedra en el zapato. Molesta lo suficiente para que prestes atención y hagas algo al respecto.'
  },
  sesquiquadrate: {
    name: 'Sesquicuadratura',
    meaning: 'Presión persistente. Tensión que busca liberación.',
    effect: 'Crea presión constante hasta encontrar solución',
    type: 'Menor tenso - insistencia que pide cambio',
    explanation: 'Como agua hirviendo en una olla tapada. La presión se acumula hasta que encuentras una válvula de escape.'
  },
  quincunx: {
    name: 'Quincuncio',
    meaning: 'Desajuste crónico. Energías que no encajan fácilmente.',
    effect: 'Requiere adaptación constante y flexibilidad',
    type: 'Menor complejo - aspectos de adaptación',
    explanation: 'Como intentar encajar piezas de rompecabezas diferentes. Requiere creatividad y adaptabilidad constante.'
  }
};

export const planetMeanings: Record<string, PlanetMeaning> = {
  'Sol': {
    meaning: 'Tu esencia, ego, vitalidad y propósito de vida',
    keywords: 'Identidad, creatividad, liderazgo, autoridad'
  },
  'Luna': {
    meaning: 'Emociones, intuición, necesidades emocionales y la madre',
    keywords: 'Sentimientos, memoria, hogar, nutrición'
  },
  'Mercurio': {
    meaning: 'Comunicación, pensamiento, aprendizaje y hermanos',
    keywords: 'Intelecto, palabras, viajes cortos, curiosidad'
  },
  'Venus': {
    meaning: 'Amor, belleza, valores, dinero y relaciones',
    keywords: 'Romance, arte, placer, armonía, atracción'
  },
  'Marte': {
    meaning: 'Acción, energía, agresión, sexualidad y guerra',
    keywords: 'Fuerza, deseo, conflicto, iniciativa'
  },
  'Júpiter': {
    meaning: 'Expansión, sabiduría, filosofía, suerte y crecimiento',
    keywords: 'Abundancia, enseñanza, viajes, optimismo'
  },
  'Saturno': {
    meaning: 'Disciplina, responsabilidad, límites y lecciones',
    keywords: 'Estructura, tiempo, autoridad, madurez'
  },
  'Urano': {
    meaning: 'Revolución, innovación, libertad y cambios súbitos',
    keywords: 'Originalidad, tecnología, rebeldía, genialidad'
  },
  'Neptuno': {
    meaning: 'Espiritualidad, ilusión, compasión y transcendencia',
    keywords: 'Intuición, arte, sacrificio, confusión'
  },
  'Plutón': {
    meaning: 'Transformación, poder, muerte-renacimiento y lo oculto',
    keywords: 'Regeneración, intensidad, control, psicología'
  },
  'Nodo Norte': {
    meaning: 'Tu propósito evolutivo y dirección de crecimiento',
    keywords: 'Destino, desarrollo, nuevas habilidades'
  },
  'Quirón': {
    meaning: 'La herida sanadora, donde duele pero también sanas',
    keywords: 'Sanación, enseñanza, vulnerabilidad'
  }
};

export const signMeanings: Record<string, string> = {
  'Aries': 'Iniciativa, liderazgo, impulso pionero',
  'Tauro': 'Estabilidad, sensualidad, perseverancia',
  'Géminis': 'Comunicación, versatilidad, curiosidad',
  'Cáncer': 'Protección, nutrición, emocionalidad',
  'Leo': 'Creatividad, drama, generosidad',
  'Virgo': 'Perfección, servicio, análisis',
  'Libra': 'Equilibrio, belleza, diplomacia',
  'Escorpio': 'Intensidad, transformación, misterio',
  'Sagitario': 'Aventura, filosofía, expansión',
  'Capricornio': 'Ambición, estructura, tradición',
  'Acuario': 'Innovación, humanitarismo, libertad',
  'Piscis': 'Compasión, intuición, espiritualidad'
};

export const houseMeanings: Record<number, HouseMeaning> = {
  1: { name: "Casa 1 - Personalidad", meaning: "Tu identidad, apariencia física y forma de presentarte al mundo", keywords: "Ego, imagen, primeras impresiones, vitalidad" },
  2: { name: "Casa 2 - Recursos", meaning: "Dinero, posesiones materiales, valores personales y autoestima", keywords: "Ingresos, talentos, seguridad material, valores" },
  3: { name: "Casa 3 - Comunicación", meaning: "Hermanos, estudios básicos, comunicación y entorno cercano", keywords: "Aprendizaje, viajes cortos, vecinos, escritura" },
  4: { name: "Casa 4 - Hogar", meaning: "Familia, hogar, raíces, tradiciones y el final de la vida", keywords: "Madre, infancia, propiedades, intimidad" },
  5: { name: "Casa 5 - Creatividad", meaning: "Hijos, romance, creatividad, diversión y autoexpresión", keywords: "Arte, juegos, noviazgo, especulación" },
  6: { name: "Casa 6 - Trabajo", meaning: "Trabajo diario, salud, rutinas, servicio y empleados", keywords: "Empleo, dieta, mascotas, obligaciones" },
  7: { name: "Casa 7 - Pareja", meaning: "Matrimonio, socios, enemigos abiertos y contratos", keywords: "Cónyuge, colaboraciones, justicia, otros" },
  8: { name: "Casa 8 - Transformación", meaning: "Muerte, renacimiento, sexualidad, dinero ajeno y ocultismo", keywords: "Herencias, crisis, psicología, recursos compartidos" },
  9: { name: "Casa 9 - Sabiduría", meaning: "Filosofía, religión, estudios superiores, viajes largos", keywords: "Universidad, extranjero, ley, espiritualidad" },
  10: { name: "Casa 10 - Carrera", meaning: "Profesión, reputación, autoridad, imagen pública y el padre", keywords: "Estatus, ambición, reconocimiento, gobierno" },
  11: { name: "Casa 11 - Amistades", meaning: "Amigos, grupos, esperanzas, sueños y organizaciones", keywords: "Ideales, clubes, benefactores, redes sociales" },
  12: { name: "Casa 12 - Espiritualidad", meaning: "Subconsciente, karma, sacrificio, hospitales y retiro", keywords: "Meditación, enemigos ocultos, autosabotaje, compasión" }
};