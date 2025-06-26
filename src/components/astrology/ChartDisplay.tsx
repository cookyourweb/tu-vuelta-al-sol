// src/components/astrology/ChartDisplay.tsx - VERSIÓN COMPLETA CON TOOLTIPS DINÁMICOS
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Sun, 
  Moon, 
  Zap, 
  Sparkles, 
  Eye, 
  EyeOff,
  Info,
  Palette
} from 'lucide-react';

// ✅ INTERFACES CORREGIDAS PARA COMPATIBILIDAD CON API
interface Planet {
  name: string;
  degree: number;
  sign: string;
  minutes?: number;
  longitude?: number;
  houseNumber?: number;
  housePosition?: number;
  isRetrograde?: boolean;
  retrograde?: boolean;
  position?: number;
  house?: number;
  element?: string;
  modality?: string;
}

interface House {
  number: number;
  sign: string;
  degree: number;
  minutes?: number;
  longitude?: number;
  position?: number;
  element?: string;
  modality?: string;
}

interface Aspect {
  planet1: string;
  planet2: string;
  angle?: number;
  type: string;
  orb: number;
  applying?: boolean;
}

interface ChartDisplayProps {
  houses: House[];
  planets: Planet[];
  elementDistribution: { fire: number; earth: number; air: number; water: number };
  modalityDistribution: { cardinal: number; fixed: number; mutable: number };
  keyAspects: Aspect[];
  aspects?: any[];
  angles?: any[];
  ascendant?: { longitude?: number; sign?: string; degree?: number };
  midheaven?: { longitude?: number; sign?: string; degree?: number };
}

// Configuración de aspectos astrológicos
const ASPECTS = {
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

// Símbolos de planetas
const PLANET_SYMBOLS: { [key: string]: string } = {
  'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀', 'Marte': '♂',
  'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅', 'Neptuno': '♆', 'Plutón': '♇',
  'Nodo Norte': '☊', 'Nodo Sur': '☋', 'Quirón': '⚷'
};

// Colores de planetas
const PLANET_COLORS: { [key: string]: string } = {
  'Sol': '#fbbf24', 'Luna': '#e5e7eb', 'Mercurio': '#06b6d4', 'Venus': '#22c55e',
  'Marte': '#ef4444', 'Júpiter': '#8b5cf6', 'Saturno': '#64748b', 'Urano': '#0ea5e9',
  'Neptuno': '#3b82f6', 'Plutón': '#7c2d12', 'Nodo Norte': '#f59e0b', 'Nodo Sur': '#f59e0b'
};

// Símbolos de signos
const SIGN_SYMBOLS: { [key: string]: string } = {
  'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
  'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓'
};

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  houses = [],
  planets = [],
  elementDistribution = { fire: 0, earth: 0, air: 0, water: 0 },
  modalityDistribution = { cardinal: 0, fixed: 0, mutable: 0 },
  keyAspects = [],
  ascendant,
  midheaven
}) => {
  const [showAspects, setShowAspects] = useState(true);
  const [selectedAspectTypes, setSelectedAspectTypes] = useState({
    major: true,
    minor: false,
    hard: true,
    easy: true
  });
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [calculatedAspects, setCalculatedAspects] = useState<any[]>([]);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // ✅ SIGNIFICADOS COMPLETOS DE ASPECTOS
  const aspectMeanings = {
    conjunction: {
      name: 'Conjunción',
      meaning: 'Fusión de energías. Los planetas trabajan como uno solo.',
      effect: 'Intensifica y unifica las cualidades planetarias',
      type: 'Neutral - puede ser armónico o tenso según los planetas'
    },
    sextile: {
      name: 'Sextil', 
      meaning: 'Oportunidad y facilidad. Energías que fluyen naturalmente.',
      effect: 'Facilita el desarrollo de talentos y oportunidades',
      type: 'Armónico - aspectos de crecimiento y facilidad'
    },
    square: {
      name: 'Cuadratura',
      meaning: 'Tensión creativa. Conflicto que genera crecimiento.',
      effect: 'Crea desafíos que impulsan el desarrollo personal',
      type: 'Tenso - genera fricción pero también evolución'
    },
    trine: {
      name: 'Trígono',
      meaning: 'Armonía natural. Las energías fluyen sin esfuerzo.',
      effect: 'Aporta facilidad, talento natural y fluidez',
      type: 'Armónico - el aspecto más favorable y fluido'
    },
    opposition: {
      name: 'Oposición',
      meaning: 'Polarización. Necesidad de encontrar equilibrio.',
      effect: 'Requiere integrar energías opuestas',
      type: 'Tenso - busca balance entre fuerzas contrarias'
    },
    semisextile: {
      name: 'Semisextil',
      meaning: 'Ajuste sutil. Pequeñas correcciones necesarias.',
      effect: 'Aporta refinamiento y ajustes menores',
      type: 'Menor - aspectos de matiz y sutileza'
    },
    semisquare: {
      name: 'Semicuadratura',
      meaning: 'Irritación menor. Pequeñas fricciones que molestan.',
      effect: 'Genera pequeñas tensiones que piden atención',
      type: 'Menor tenso - roces cotidianos que educan'
    },
    sesquiquadrate: {
      name: 'Sesquicuadratura',
      meaning: 'Presión persistente. Tensión que busca liberación.',
      effect: 'Crea presión constante hasta encontrar solución',
      type: 'Menor tenso - insistencia que pide cambio'
    },
    quincunx: {
      name: 'Quincuncio',
      meaning: 'Desajuste crónico. Energías que no encajan fácilmente.',
      effect: 'Requiere adaptación constante y flexibilidad',
      type: 'Menor complejo - aspectos de adaptación'
    }
  };

  // ✅ SIGNIFICADOS DE PLANETAS
  const planetMeanings = {
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

  // ✅ SIGNIFICADOS DE SIGNOS
  const signMeanings = {
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

  // ✅ SIGNIFICADOS DE CASAS EXTENDIDOS
  const housemeanings = {
    1: {
      name: "Casa 1 - Personalidad",
      meaning: "Tu identidad, apariencia física y forma de presentarte al mundo",
      keywords: "Ego, imagen, primeras impresiones, vitalidad"
    },
    2: {
      name: "Casa 2 - Recursos",
      meaning: "Dinero, posesiones materiales, valores personales y autoestima",
      keywords: "Ingresos, talentos, seguridad material, valores"
    },
    3: {
      name: "Casa 3 - Comunicación", 
      meaning: "Hermanos, estudios básicos, comunicación y entorno cercano",
      keywords: "Aprendizaje, viajes cortos, vecinos, escritura"
    },
    4: {
      name: "Casa 4 - Hogar",
      meaning: "Familia, hogar, raíces, tradiciones y el final de la vida",
      keywords: "Madre, infancia, propiedades, intimidad"
    },
    5: {
      name: "Casa 5 - Creatividad",
      meaning: "Hijos, romance, creatividad, diversión y autoexpresión",
      keywords: "Arte, juegos, noviazgo, especulación"
    },
    6: {
      name: "Casa 6 - Trabajo",
      meaning: "Trabajo diario, salud, rutinas, servicio y empleados",
      keywords: "Empleo, dieta, mascotas, obligaciones"
    },
    7: {
      name: "Casa 7 - Pareja",
      meaning: "Matrimonio, socios, enemigos abiertos y contratos",
      keywords: "Cónyuge, colaboraciones, justicia, otros"
    },
    8: {
      name: "Casa 8 - Transformación",
      meaning: "Muerte, renacimiento, sexualidad, dinero ajeno y ocultismo",
      keywords: "Herencias, crisis, psicología, recursos compartidos"
    },
    9: {
      name: "Casa 9 - Sabiduría",
      meaning: "Filosofía, religión, estudios superiores, viajes largos",
      keywords: "Universidad, extranjero, ley, espiritualidad"
    },
    10: {
      name: "Casa 10 - Carrera",
      meaning: "Profesión, reputación, autoridad, imagen pública y el padre",
      keywords: "Estatus, ambición, reconocimiento, gobierno"
    },
    11: {
      name: "Casa 11 - Amistades",
      meaning: "Amigos, grupos, esperanzas, sueños y organizaciones",
      keywords: "Ideales, clubes, benefactores, redes sociales"
    },
    12: {
      name: "Casa 12 - Espiritualidad",
      meaning: "Subconsciente, karma, sacrificio, hospitales y retiro",
      keywords: "Meditación, enemigos ocultos, autosabotaje, compasión"
    }
  };

  // ✅ FUNCIÓN PARA CAPTURAR POSICIÓN DEL MOUSE RELATIVA AL VIEWPORT
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({ 
      x: event.clientX,
      y: event.clientY
    });
  };

  // ✅ FUNCIÓN CORREGIDA: Convertir grados astrológicos
  const convertAstrologicalDegreeToPosition = (degree: number, sign: string) => {
    const signPositions: { [key: string]: number } = {
      'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
      'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
      'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
    };

    const signBase = signPositions[sign] || 0;
    return signBase + degree;
  };

  // ✅ FUNCIÓN CORREGIDA: Normalizar datos de planetas
  const normalizedPlanets = planets.map((planet, index) => {
    if (!planet) return null;

    const realPosition = convertAstrologicalDegreeToPosition(
      planet.degree || 0, 
      planet.sign || 'Aries'
    );

    return {
      ...planet,
      position: realPosition,
      house: planet.house || planet.houseNumber || planet.housePosition || 1,
      retrograde: planet.retrograde || planet.isRetrograde || false
    };
  }).filter(Boolean);

  // ✅ FUNCIÓN CORREGIDA: Normalizar datos de casas
  const normalizedHouses = houses.map((house, index) => {
    if (!house) return null;

    const realPosition = house.sign ? 
      convertAstrologicalDegreeToPosition(house.degree || 0, house.sign) :
      (index * 30);

    return {
      ...house,
      position: realPosition
    };
  }).filter(Boolean);

  // Calcular aspectos automáticamente
  useEffect(() => {
    if (normalizedPlanets.length > 0) {
      const aspects = calculateAspects(normalizedPlanets);
      setCalculatedAspects(aspects);
    }
  }, [planets]);

  // ✅ FUNCIÓN CORREGIDA: Calcular aspectos entre planetas
  const calculateAspects = (planets: any[]) => {
    const aspects: any[] = [];
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        if (!planet1 || !planet2 || !planet1.name || !planet2.name) {
          continue;
        }

        let angle = Math.abs(planet1.position - planet2.position);
        if (angle > 180) angle = 360 - angle;
        
        Object.entries(ASPECTS).forEach(([aspectType, config]) => {
          const orb = Math.abs(angle - config.angle);
          if (orb <= config.orb) {
            aspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              angle: angle,
              type: aspectType,
              orb: orb,
              config: config,
              exact: orb < 1
            });
          }
        });
      }
    }
    
    return aspects.sort((a, b) => a.orb - b.orb);
  };

  // ✅ FUNCIÓN CORREGIDA: Obtener posición en el círculo
  const getCirclePosition = (angle: number, radius: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: 250 + Math.cos(radian) * radius, // ✅ CENTRADO EN 250 PARA MEJOR VISIBILIDAD
      y: 250 + Math.sin(radian) * radius
    };
  };

  // ✅ FUNCIÓN CORREGIDA: Renderizar líneas de aspectos
  const renderAspectLines = () => {
    if (!showAspects || calculatedAspects.length === 0) return null;

    return calculatedAspects.map((aspect, index) => {
      const planet1 = normalizedPlanets.find(p => p?.name === aspect.planet1);
      const planet2 = normalizedPlanets.find(p => p?.name === aspect.planet2);
      
      if (!planet1 || !planet2) return null;

      const isHard = aspect.config.difficulty === 'hard';
      const isEasy = aspect.config.difficulty === 'easy';
      const isMajor = ['conjunction', 'sextile', 'square', 'trine', 'opposition'].includes(aspect.type);
      const isMinor = !isMajor;

      if (!selectedAspectTypes.hard && isHard) return null;
      if (!selectedAspectTypes.easy && isEasy) return null;
      if (!selectedAspectTypes.major && isMajor) return null;
      if (!selectedAspectTypes.minor && isMinor) return null;

      const pos1 = getCirclePosition(planet1.position, 170);
      const pos2 = getCirclePosition(planet2.position, 170);
      
      const strokeWidth = aspect.exact ? 3 : aspect.orb < 2 ? 2 : 1;
      const opacity = aspect.exact ? 0.9 : aspect.orb < 2 ? 0.7 : 0.5;
      
      const aspectKey = `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;
      const isHovered = hoveredAspect === aspectKey;

      return (
        <line
          key={index}
          x1={pos1.x}
          y1={pos1.y}
          x2={pos2.x}
          y2={pos2.y}
          stroke={aspect.config.color}
          strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
          opacity={isHovered ? 1 : opacity}
          strokeDasharray={isMinor ? "3,3" : "none"}
          className="transition-all duration-200 cursor-pointer"
          onMouseEnter={() => setHoveredAspect(aspectKey)}
          onMouseLeave={() => setHoveredAspect(null)}
        />
      );
    });
  };

  // ✅ FUNCIÓN CORREGIDA: Renderizar planetas CON POSICIONES EXTENDIDAS
  const renderPlanets = () => {
    return normalizedPlanets.map((planet, index) => {
      if (!planet || !planet.name) return null;

      const position = getCirclePosition(planet.position, 190); // ✅ RADIO EXTENDIDO
      const symbol = PLANET_SYMBOLS[planet.name] || planet.name.charAt(0);
      const color = PLANET_COLORS[planet.name] || '#ffffff';
      const isHovered = hoveredPlanet === planet.name;
      
      return (
        <g key={index}>
          {/* Círculo del planeta CON HOVER */}
          <circle
            cx={position.x}
            cy={position.y}
            r={isHovered ? "15" : "12"}
            fill={color}
            stroke={isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"}
            strokeWidth={isHovered ? "2" : "1"}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredPlanet(planet.name);
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
          
          {/* Símbolo del planeta */}
          <text
            x={position.x}
            y={position.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="black"
            fontSize="12"
            fontWeight="bold"
            className="pointer-events-none"
          >
            {symbol}
          </text>
          
          {/* Etiqueta del planeta */}
          <text
            x={position.x}
            y={position.y + 28}
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="semibold"
            className="pointer-events-none drop-shadow-lg"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {planet.name}
          </text>
          
          {/* Grado y signo */}
          <text
            x={position.x}
            y={position.y + 42}
            textAnchor="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize="9"
            className="pointer-events-none"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {planet.degree}° {planet.sign}
          </text>

          {/* Indicador de retrogradación */}
          {planet.retrograde && (
            <text
              x={position.x + 16}
              y={position.y - 8}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="10"
              fontWeight="bold"
              className="animate-pulse"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            >
              R
            </text>
          )}
        </g>
      );
    });
  };

  // ✅ FUNCIÓN CORREGIDA: Renderizar casas CON TOOLTIPS
  const renderHouses = () => {
    const houseLines = [];
    const houseLabels = [];
    
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      const startPos = getCirclePosition(angle, 130);
      const endPos = getCirclePosition(angle, 240);
      const labelPos = getCirclePosition(angle + 15, 115);
      const houseNumber = i + 1;
      
      houseLines.push(
        <line
          key={`house-line-${i}`}
          x1={startPos.x}
          y1={startPos.y}
          x2={endPos.x}
          y2={endPos.y}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
      );
      
      houseLabels.push(
        <g key={`house-label-${i}`}>
          {/* Círculo clickeable para tooltip de casa */}
          <circle
            cx={labelPos.x}
            cy={labelPos.y}
            r="16"
            fill="rgba(0,0,0,0.3)"
            stroke={hoveredHouse === houseNumber ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}
            strokeWidth="1"
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredHouse(houseNumber);
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          
          {/* Número de casa */}
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.9)"
            fontSize="14"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            className="pointer-events-none"
          >
            {houseNumber}
          </text>
        </g>
      );
    }
    
    return [...houseLines, ...houseLabels];
  };

  // ✅ FUNCIÓN CORREGIDA: Renderizar signos zodiacales MÁS SEPARADOS
  const renderSigns = () => {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
      'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];
    
    return signs.map((sign, index) => {
      const angle = index * 30;
      const symbolPosition = getCirclePosition(angle + 15, 270); // ✅ MÁS SEPARADO
      const textPosition = getCirclePosition(angle + 15, 290);
      const symbol = SIGN_SYMBOLS[sign] || sign.charAt(0);
      
      return (
        <g key={index}>
          {/* Símbolo del signo */}
          <text
            x={symbolPosition.x}
            y={symbolPosition.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fbbf24"
            fontSize="20"
            fontWeight="bold"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            {symbol}
          </text>
          
          {/* Nombre del signo */}
          <text
            x={textPosition.x}
            y={textPosition.y}
            textAnchor="middle"
            fill="rgba(251,191,36,0.9)"
            fontSize="12"
            fontWeight="semibold"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
          >
            {sign}
          </text>
        </g>
      );
    });
  };

  // ✅ RENDERIZAR ASCENDENTE CON TOOLTIP MEJORADO
  const renderAngles = () => {
    const angles = [];
    
    // Renderizar Ascendente
    if (ascendant && ascendant.sign) {
      const ascPosition = convertAstrologicalDegreeToPosition(
        ascendant.degree || 0, 
        ascendant.sign
      );
      const position = getCirclePosition(ascPosition, 220);
      
      angles.push(
        <g key="ascendant">
          {/* Línea del Ascendente */}
          <line
            x1={250}
            y1={250}
            x2={position.x}
            y2={position.y}
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
          
          {/* Marcador del Ascendente CON TOOLTIP */}
          <circle
            cx={position.x}
            cy={position.y}
            r="8"
            fill="#22c55e"
            stroke="white"
            strokeWidth="2"
            className="cursor-pointer hover:r-10 transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredPlanet('Ascendente');
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
          
          {/* Símbolo ASC */}
          <text
            x={position.x}
            y={position.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            className="pointer-events-none"
          >
            ASC
          </text>
          
          {/* Etiqueta del ascendente */}
          <text
            x={position.x}
            y={position.y + 25}
            textAnchor="middle"
            fill="#22c55e"
            fontSize="12"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            className="pointer-events-none"
          >
            Ascendente
          </text>
          
          <text
            x={position.x}
            y={position.y + 38}
            textAnchor="middle"
            fill="rgba(34,197,94,0.8)"
            fontSize="10"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
            className="pointer-events-none"
          >
            {ascendant.degree}° {ascendant.sign}
          </text>
        </g>
      );
    }
    
    // Renderizar Medio Cielo
    if (midheaven && midheaven.sign) {
      const mcPosition = convertAstrologicalDegreeToPosition(
        midheaven.degree || 0, 
        midheaven.sign
      );
      const position = getCirclePosition(mcPosition, 215);
      
      angles.push(
        <g key="midheaven">
          <circle
            cx={position.x}
            cy={position.y}
            r="6"
            fill="#8b5cf6"
            stroke="white"
            strokeWidth="1"
            className="cursor-pointer hover:r-8 transition-all duration-200"
            onMouseEnter={(e) => {
              setHoveredPlanet('Medio Cielo');
              handleMouseMove(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
          
          <text
            x={position.x}
            y={position.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="8"
            fontWeight="bold"
            className="pointer-events-none"
          >
            MC
          </text>
        </g>
      );
    }
    
    return angles;
  };

  return (
    <>
      <div className="space-y-8 relative">
        {/* ✅ TOOLTIPS DINÁMICOS MEJORADOS CON INFORMACIÓN COMPLETA */}
      {(() => {
        if (!hoveredPlanet) return null;
        const hovered = normalizedPlanets.find(p => p && p.name === hoveredPlanet);
        if (!hovered) return null;
        return (
          <div 
            className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 z-50 pointer-events-none shadow-2xl max-w-sm"
            style={{ 
              left: tooltipPosition.x + 15, 
              top: tooltipPosition.y - 120,
              transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">
                {PLANET_SYMBOLS[hoveredPlanet] || '●'}
              </span>
              <div>
                <div className="text-white font-bold text-lg">{hoveredPlanet}</div>
                <div className="text-gray-200 text-sm">
                  {hovered ? `${hovered.degree}° ${hovered.sign}` : ''}
                  <div className="text-gray-300 text-xs">
                    {hovered ? (
                      <>
                        Casa {hovered.house} • {signMeanings[hovered.sign as keyof typeof signMeanings]}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Significado del planeta */}
            {planetMeanings[hoveredPlanet as keyof typeof planetMeanings] && (
              <div className="mb-2">
                <div className="text-white text-sm font-semibold mb-1">Significado:</div>
                <div className="text-gray-200 text-xs mb-2">
                  {planetMeanings[hoveredPlanet as keyof typeof planetMeanings].meaning}
                </div>
                <div className="text-gray-300 text-xs">
                  <strong>Palabras clave:</strong> {planetMeanings[hoveredPlanet as keyof typeof planetMeanings].keywords}
                </div>
              </div>
            )}
            
            {/* Estado retrógrado */}
            {hovered && hovered.retrograde && (
              <div className="bg-red-400/20 rounded-lg p-2 mt-2">
                <div className="text-red-300 text-xs font-semibold">⚠️ Retrógrado</div>
                <div className="text-red-200 text-xs">Energía internalizada, revisión de temas pasados</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ✅ TOOLTIPS ESPECIALES PARA ASCENDENTE Y MEDIO CIELO */}
      {hoveredPlanet === 'Ascendente' && ascendant && (
        <div 
          className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 z-50 pointer-events-none shadow-2xl max-w-sm"
          style={{ 
            left: tooltipPosition.x + 15, 
            top: tooltipPosition.y - 130,
            transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">⬆️</span>
            <div>
              <div className="text-white font-bold text-lg">Ascendente</div>
              <div className="text-gray-200 text-sm">
                {ascendant.degree}° {ascendant.sign}
              </div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-white text-sm font-semibold mb-1">Significado:</div>
            <div className="text-gray-200 text-xs mb-2">
              Tu máscara social, cómo te presentas al mundo y tu apariencia física. 
              La energía que proyectas en primeras impresiones.
            </div>
            <div className="text-gray-300 text-xs mb-2">
              <strong>En {ascendant.sign}:</strong> {signMeanings[ascendant.sign as keyof typeof signMeanings]}
            </div>
          </div>
        </div>
      )}
      {hoveredPlanet === 'Medio Cielo' && midheaven && (
        <div 
          className="fixed bg-gradient-to-r from-purple-500/95 to-violet-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 z-50 pointer-events-none shadow-2xl max-w-sm"
          style={{ 
            left: tooltipPosition.x + 15, 
            top: tooltipPosition.y - 120,
            transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">🏔️</span>
            <div>
              <div className="text-white font-bold text-lg">Medio Cielo</div>
              <div className="text-gray-200 text-sm">
                {midheaven.degree}° {midheaven.sign}
              </div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-white text-sm font-semibold mb-1">Significado:</div>
            <div className="text-gray-200 text-xs mb-2">
              Tu vocación, carrera ideal, reputación pública y lo que quieres lograr 
              en el mundo. Tu propósito profesional.
            </div>
            <div className="text-gray-300 text-xs mb-2">
              <strong>En {midheaven.sign}:</strong> {signMeanings[midheaven.sign as keyof typeof signMeanings]}
            </div>
            <div className="text-gray-300 text-xs">
              <strong>Palabras clave:</strong> Carrera, estatus, reconocimiento, autoridad
            </div>
          </div>
        </div>
      )}

      {hoveredHouse && (
        <div 
          className="fixed bg-gradient-to-r from-blue-500/95 to-cyan-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 z-50 pointer-events-none shadow-2xl max-w-sm"
          style={{ 
            left: tooltipPosition.x + 15, 
            top: tooltipPosition.y - 100,
            transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
          }}
        >
          <div className="flex items-start mb-3">
            <span className="text-3xl mr-3">🏠</span>
            <div>
              <div className="text-white font-bold text-lg">
                {housemeanings[hoveredHouse as keyof typeof housemeanings]?.name}
              </div>
              <div className="text-gray-200 text-sm mb-2">
                {housemeanings[hoveredHouse as keyof typeof housemeanings]?.meaning}
              </div>
              <div className="text-gray-300 text-xs">
                <strong>Temas:</strong> {housemeanings[hoveredHouse as keyof typeof housemeanings]?.keywords}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      <div className="bg-black/30 rounded-xl p-4 text-xs text-gray-400">
        <div>🔍 Planetas: {planets.length} | Casas: {houses.length} | Aspectos: {calculatedAspects.length}</div>
        <div>🔺 Ascendente: {ascendant?.sign || 'N/A'} | 🌟 Primera carta: {planets[0]?.name} {planets[0]?.degree}° {planets[0]?.sign}</div>
        <div className="mt-2 text-yellow-300">💡 <strong>Tip:</strong> Pasa el cursor sobre planetas, casas, ascendente y aspectos para aprender más</div>
      </div>

      {/* Controles de aspectos CON TOOLTIPS EDUCATIVOS */}
      <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Palette className="w-5 h-5 text-purple-400 mr-3" />
            <h3 className="text-lg font-bold text-white">Configuración de Aspectos</h3>
            <div className="ml-2 text-gray-400 text-sm">
              (Líneas que conectan planetas)
            </div>
          </div>
          
          <button
            onClick={() => setShowAspects(!showAspects)}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              showAspects 
                ? 'bg-gradient-to-r from-green-400/20 to-blue-500/20 border border-green-400/30 text-green-300' 
                : 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/30 text-gray-400'
            }`}
          >
            {showAspects ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            {showAspects ? 'Ocultar Aspectos' : 'Mostrar Aspectos'}
          </button>
        </div>
        
        {showAspects && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSelectedAspectTypes({...selectedAspectTypes, major: !selectedAspectTypes.major})}
              className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                selectedAspectTypes.major 
                  ? 'bg-gradient-to-r from-blue-400/30 to-purple-500/30 border border-blue-400/50 text-blue-300' 
                  : 'bg-gray-600/20 border border-gray-500/30 text-gray-400'
              }`}
              title="Conjunción, Sextil, Cuadratura, Trígono, Oposición - Los aspectos más importantes y poderosos"
            >
              🌟 Aspectos Mayores
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs rounded p-2 whitespace-nowrap z-10 transition-opacity">
                Los 5 aspectos principales: más fuertes y definitorios
              </div>
            </button>
            
            <button
              onClick={() => setSelectedAspectTypes({...selectedAspectTypes, minor: !selectedAspectTypes.minor})}
              className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                selectedAspectTypes.minor 
                  ? 'bg-gradient-to-r from-purple-400/30 to-pink-500/30 border border-purple-400/50 text-purple-300' 
                  : 'bg-gray-600/20 border border-gray-500/30 text-gray-400'
              }`}
              title="Semisextil, Semicuadratura, Sesquicuadratura, Quincuncio - Aspectos sutiles pero significativos"
            >
              ✨ Aspectos Menores
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs rounded p-2 whitespace-nowrap z-10 transition-opacity">
                Influencias más sutiles pero importantes
              </div>
            </button>
            
            <button
              onClick={() => setSelectedAspectTypes({...selectedAspectTypes, easy: !selectedAspectTypes.easy})}
              className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                selectedAspectTypes.easy 
                  ? 'bg-gradient-to-r from-cyan-400/30 to-blue-500/30 border border-cyan-400/50 text-cyan-300' 
                  : 'bg-gray-600/20 border border-gray-500/30 text-gray-400'
              }`}
              title="Trígonos y Sextiles - Talentos naturales y facilidades"
            >
              💙 Aspectos Armónicos
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs rounded p-2 whitespace-nowrap z-10 transition-opacity">
                Facilidades, talentos y energías que fluyen
              </div>
            </button>
            
            <button
              onClick={() => setSelectedAspectTypes({...selectedAspectTypes, hard: !selectedAspectTypes.hard})}
              className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                selectedAspectTypes.hard 
                  ? 'bg-gradient-to-r from-red-400/30 to-pink-500/30 border border-red-400/50 text-red-300' 
                  : 'bg-gray-600/20 border border-gray-500/30 text-gray-400'
              }`}
              title="Cuadraturas y Oposiciones - Desafíos que generan crecimiento"
            >
              ❤️ Aspectos Tensos
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs rounded p-2 whitespace-nowrap z-10 transition-opacity">
                Tensiones creativas que impulsan el desarrollo
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Carta Natal Principal AMPLIADA */}
      <div className="bg-gradient-to-br from-black/50 to-purple-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        
        <div className="flex justify-center">
          <svg
            width="600"
            height="600"
            viewBox="0 0 500 500"
            className="border border-white/20 rounded-full bg-gradient-to-br from-indigo-950/50 via-purple-900/30 to-black/50 backdrop-blur-sm"
          >
            {/* Círculos concéntricos AMPLIADOS */}
            <circle cx="250" cy="250" r="130" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="250" cy="250" r="170" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <circle cx="250" cy="250" r="220" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            
            {/* Líneas de aspectos */}
            {renderAspectLines()}
            
            {/* Líneas de casas */}
            {renderHouses()}
            
            {/* Signos zodiacales */}
            {renderSigns()}
            
            {/* Ángulos (Ascendente, MC) */}
            {renderAngles()}
            
            {/* Planetas */}
            {renderPlanets()}
            
            {/* Centro */}
            <circle cx="250" cy="250" r="8" fill="#fbbf24" className="animate-pulse" />
            <text x="250" y="255" textAnchor="middle" dominantBaseline="middle" fill="black" fontSize="10" fontWeight="bold">
              ☉
            </text>
          </svg>
        </div>
      </div>

      {/* Información de aspectos hovereados */}
      {hoveredAspect && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-6">
          <div className="flex items-center mb-3">
            <Info className="w-5 h-5 text-blue-400 mr-3" />
            <h3 className="text-lg font-bold text-white">Información del Aspecto</h3>
          </div>
          <p className="text-gray-300">
            Detalles del aspecto seleccionado: {hoveredAspect}
          </p>
        </div>
      )}

      {/* Leyenda de aspectos CON SIGNIFICADOS COMPLETOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(ASPECTS).map(([type, config]) => (
          <div key={type} className="bg-black/30 rounded-2xl p-4 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-1 mr-3 rounded" 
                style={{ backgroundColor: config.color }}
              ></div>
              <span className="text-white font-semibold">{config.name}</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              {config.angle}° | Orbe: ±{config.orb}°
            </p>
            
            {/* Información expandida al hacer hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="text-gray-300 text-xs mb-1">
                <strong>Significado:</strong> {aspectMeanings[type as keyof typeof aspectMeanings]?.meaning}
              </div>
              <div className="text-gray-400 text-xs mb-1">
                <strong>Efecto:</strong> {aspectMeanings[type as keyof typeof aspectMeanings]?.effect}
              </div>
              <div className="text-gray-500 text-xs">
                <strong>Tipo:</strong> {aspectMeanings[type as keyof typeof aspectMeanings]?.type}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Distribuciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Elementos */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <Sparkles className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Distribución de Elementos</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(elementDistribution).map(([element, count]) => {
              const colors = {
                fire: 'from-red-400 to-orange-500',
                earth: 'from-green-400 to-emerald-500',
                air: 'from-blue-400 to-cyan-500',
                water: 'from-indigo-400 to-purple-500'
              };
              
              const icons = {
                fire: '🔥',
                earth: '🌍',
                air: '💨',
                water: '🌊'
              };
              
              const total = Object.values(elementDistribution).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={element} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold capitalize flex items-center">
                      {icons[element as keyof typeof icons]} {element}
                    </span>
                    <span className="text-gray-300">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${colors[element as keyof typeof colors]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modalidades */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-purple-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Distribución de Modalidades</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(modalityDistribution).map(([modality, count]) => {
              const colors = {
                cardinal: 'from-red-400 to-pink-500',
                fixed: 'from-blue-400 to-indigo-500',
                mutable: 'from-green-400 to-teal-500'
              };
              
              const icons = {
                cardinal: '⚡',
                fixed: '🛡️',
                mutable: '🔄'
              };
              
              const total = Object.values(modalityDistribution).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              
              return (
                <div key={modality} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold capitalize flex items-center">
                      {icons[modality as keyof typeof icons]} {modality}
                    </span>
                    <span className="text-gray-300">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${colors[modality as keyof typeof colors]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista de aspectos calculados */}
      {calculatedAspects && calculatedAspects.length > 0 && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <Star className="w-6 h-6 text-yellow-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Aspectos Detectados ({calculatedAspects.length})</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {calculatedAspects.slice(0, 20).map((aspect, index) => (
              <div 
                key={index}
                className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredAspect(`${aspect.planet1}-${aspect.planet2}-${aspect.type}`)}
                onMouseLeave={() => setHoveredAspect(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">
                    {aspect.planet1} - {aspect.planet2}
                  </span>
                  {aspect.exact && (
                    <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                      EXACTO
                    </span>
                  )}
                </div>
                
                <div className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: aspect.config.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{aspect.config.name}</span>
                </div>
                
                <div className="text-gray-400 text-xs">
                  Orbe: {aspect.orb.toFixed(2)}° | Ángulo: {aspect.angle.toFixed(1)}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de planetas con información detallada */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <Sun className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Posiciones Planetarias</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {normalizedPlanets.map((planet, index) => (
            planet ? (
              <div key={index} className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">
                    {PLANET_SYMBOLS[planet.name] || '●'}
                  </span>
                  <div>
                    <div className="text-white font-semibold">{planet.name}</div>
                    <div className="text-gray-400 text-sm">
                      {`${planet.degree || 0}° ${planet.sign}`}
                      {planet.retrograde && <span className="text-red-400 ml-1">R</span>}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  Casa {planet.house} | {SIGN_SYMBOLS[planet.sign] || ''}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Información de ascendente y medio cielo */}
      {(ascendant || midheaven) && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <Moon className="w-6 h-6 text-blue-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Ángulos Principales</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ascendant && (
              <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">⬆️</span>
                  <div>
                    <div className="text-white font-semibold">Ascendente</div>
                    <div className="text-gray-400 text-sm">
                      {ascendant.degree || 0}° {ascendant.sign || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  Personalidad y apariencia exterior
                </div>
              </div>
            )}
            
            {typeof midheaven !== 'undefined' && midheaven && (
              <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">⬆️</span>
                  <div>
                    <div className="text-white font-semibold">Medio Cielo</div>
                    <div className="text-gray-400 text-sm">
                      {midheaven.degree || 0}° {midheaven.sign || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  Vocación y propósito profesional
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};  


export default ChartDisplay;