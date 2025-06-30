//src/components/astrology/ChartDisplay.tsx

'use client';

import React, { useState, useEffect } from 'react';

// ✅ INTERFACES CORREGIDAS Y OPTIMIZADAS
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
  birthData?: {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
  };
}

// 🎨 CONFIGURACIÓN DE ASPECTOS ASTROLÓGICOS
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

// 🌟 SÍMBOLOS Y COLORES
const PLANET_SYMBOLS: { [key: string]: string } = {
  'Sol': '☉', 'Luna': '☽', 'Mercurio': '☿', 'Venus': '♀', 'Marte': '♂',
  'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅', 'Neptuno': '♆', 'Plutón': '♇',
  'Nodo Norte': '☊', 'Nodo Sur': '☋', 'Quirón': '⚷'
};

const PLANET_COLORS: { [key: string]: string } = {
  'Sol': '#fbbf24', 'Luna': '#e5e7eb', 'Mercurio': '#06b6d4', 'Venus': '#22c55e',
  'Marte': '#ef4444', 'Júpiter': '#8b5cf6', 'Saturno': '#64748b', 'Urano': '#0ea5e9',
  'Neptuno': '#3b82f6', 'Plutón': '#7c2d12', 'Nodo Norte': '#f59e0b', 'Nodo Sur': '#f59e0b'
};

const SIGN_SYMBOLS: { [key: string]: string } = {
  'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
  'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓'
};

// 🧠 SIGNIFICADOS EDUCATIVOS COMPLETOS
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

const houseMeanings = {
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

// ✅ COMPONENTE DE MENÚ CORREGIDO CON ICONOS SVG
const SectionMenu: React.FC<{
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}> = ({ activeSection, scrollToSection }) => {
  const menuItems = [
    { 
      id: 'datos-nacimiento', 
      label: 'Datos', 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    { 
      id: 'carta-visual', 
      label: 'Carta', 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10,8 16,12 10,16"/>
        </svg>
      )
    },
    { 
      id: 'aspectos-detectados', 
      label: 'Aspectos', 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
        </svg>
      )
    },
    { 
      id: 'posiciones-planetarias', 
      label: 'Planetas', 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 text-blue-300' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <IconComponent />
            <span>{item.label}</span>
            {isActive && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

const ChartDisplay: React.FC<ChartDisplayProps> = ({
  houses = [],
  planets = [],
  elementDistribution = { fire: 0, earth: 0, air: 0, water: 0 },
  modalityDistribution = { cardinal: 0, fixed: 0, mutable: 0 },
  keyAspects = [],
  ascendant,
  midheaven,
  birthData
}) => {
  // Estados
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
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [hoveredModality, setHoveredModality] = useState<string | null>(null);
  const [hoveredNavGuide, setHoveredNavGuide] = useState(false);
  const [activeSection, setActiveSection] = useState('datos-nacimiento');

  // 🔄 FUNCIÓN PARA CAPTURAR POSICIÓN DEL MOUSE
  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ 
      x: event.clientX,
      y: event.clientY
    });
  };

  // 🧭 FUNCIÓN PARA SCROLL SUAVE A SECCIONES
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // 👀 DETECTAR SECCIÓN VISIBLE CON INTERSECTION OBSERVER
  useEffect(() => {
    const sections = ['datos-nacimiento', 'carta-visual', 'aspectos-detectados', 'posiciones-planetarias'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(sectionId => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveSection(sectionId);
            }
          });
        },
        { threshold: 0.5 }
      );

      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // 🎯 FUNCIÓN: Convertir grados astrológicos
  const convertAstrologicalDegreeToPosition = (degree: number, sign: string) => {
    const signPositions: { [key: string]: number } = {
      'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
      'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
      'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
    };

    const signBase = signPositions[sign] || 0;
    return signBase + degree;
  };

  // 🎯 FUNCIÓN: Normalizar datos de planetas
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

  // 🎯 FUNCIÓN: Normalizar datos de casas
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

  // 🎯 FUNCIÓN: Calcular aspectos entre planetas
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

  // 🎯 FUNCIÓN: Obtener posición en el círculo
  const getCirclePosition = (angle: number, radius: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: 250 + Math.cos(radian) * radius,
      y: 250 + Math.sin(radian) * radius
    };
  };

  // 🔄 FUNCIÓN: Obtener interpretación contextualizada del planeta
  const getPersonalizedPlanetInterpretation = (planet: any) => {
    const planetName = planet.name;
    const sign = planet.sign;
    const house = planet.house;

    // Ejemplos de interpretaciones contextualizadas
    const interpretations: { [key: string]: { [key: string]: { [key: number]: string } } } = {
      'Sol': {
        'Aries': {
          1: 'Tu identidad es pionera y líder natural. Te presentas al mundo con confianza y fuerza',
          5: 'Tu creatividad y expresión personal son tu motor vital. Brillas siendo auténtico',
          10: 'Tu carrera requiere liderazgo y autoridad. Naciste para dirigir proyectos importantes'
        },
        'Libra': {
          7: 'Tu identidad se define a través de las relaciones. Encuentras tu propósito en la armonía con otros'
        }
      },
      'Luna': {
        'Cáncer': {
          4: 'Tus emociones están profundamente conectadas con el hogar y la familia. Tu intuición maternal es extraordinaria'
        }
      },
      'Plutón': {
        'Libra': {
          8: 'Tu poder de transformación se enfoca en las relaciones y los recursos compartidos. Tienes una capacidad natural para transformar las dinámicas de pareja y manejar crisis financieras con elegancia.'
        }
      }
    };

    const specific = interpretations[planetName]?.[sign]?.[house];
    if (specific) return specific;

    // Interpretación general basada en planeta + casa
    const houseInterpretations: { [key: string]: { [key: number]: string } } = {
      'Sol': {
        1: `Tu ${planetName} en ${sign} en Casa 1 define tu personalidad externa con las cualidades de ${signMeanings[sign as keyof typeof signMeanings]}`,
        2: `Tu identidad solar se manifiesta a través de tus valores y recursos materiales`,
        3: `Tu esencia se expresa a través de la comunicación y el aprendizaje`,
        4: `Tu identidad está profundamente enraizada en el hogar y la familia`,
        5: `Tu creatividad y autoexpresión son fundamentales para tu identidad`,
        7: `Tu identidad se complementa y define a través de las relaciones de pareja`,
        10: `Tu propósito vital se realiza a través de tu carrera y reconocimiento público`
      }
    };

    const generalInterpretation = houseInterpretations[planetName]?.[house];
    if (generalInterpretation) return generalInterpretation;

    // Interpretación por defecto
    return `Con ${planetName} en ${sign} en Casa ${house}, ${planetMeanings[planetName as keyof typeof planetMeanings]?.meaning.toLowerCase()} se manifiesta con las cualidades de ${signMeanings[sign as keyof typeof signMeanings]?.toLowerCase()} en el área de ${houseMeanings[house as keyof typeof houseMeanings]?.meaning.toLowerCase()}`;
  };

  // 🔄 FUNCIÓN: Obtener interpretación contextualizada del aspecto
  const getPersonalizedAspectInterpretation = (aspect: any) => {
    const planet1Name = aspect.planet1;
    const planet2Name = aspect.planet2;
    const aspectType = aspect.type;

    const planet1Desc = planetMeanings[planet1Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet1Name;
    const planet2Desc = planetMeanings[planet2Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet2Name;

    // Interpretaciones específicas para combinaciones comunes
    const specificInterpretations: { [key: string]: string } = {
      'Sol-Luna-conjunction': `Tu esencia masculina (Sol) y femenina (Luna) trabajan en perfecta armonía. Hay coherencia entre lo que eres y lo que sientes.`,
      'Mercurio-Venus-conjunction': `Tu forma de comunicarte se fusiona con tu capacidad de amar. Hablas con encanto, seduces con las palabras y tu intelecto se vuelve más artístico.`,
      'Marte-Venus-square': `Existe tensión entre tu forma de actuar (Marte) y tus valores amorosos (Venus). Esta fricción te impulsa a equilibrar pasión con armonía.`,
      'Sol-Saturno-square': `Tu ego y autoridad personal chocan con las estructuras y límites. Esta tensión te enseña disciplina y perseverancia.`
    };

    const key = `${planet1Name}-${planet2Name}-${aspectType}`;
    if (specificInterpretations[key]) return specificInterpretations[key];

    // Interpretación general
    let baseInterpretation = aspectMeanings[aspectType as keyof typeof aspectMeanings]?.meaning || '';
    
    if (aspectType === 'conjunction') {
      return `Fusión de ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Los planetas trabajan como uno solo. Esto significa que tu ${planet1Desc.toLowerCase()} se fusiona con tu ${planet2Desc.toLowerCase()}, creando una energía unificada y potente.`;
    } else if (aspectType === 'opposition') {
      return `Polarización entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Necesitas encontrar equilibrio entre estas dos energías opuestas en tu vida.`;
    } else if (aspectType === 'trine') {
      return `Armonía natural entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Las energías fluyen sin esfuerzo, creando talento natural en la combinación de estas cualidades.`;
   } else if (aspectType === 'square') {
     return `Tensión creativa entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Esta fricción genera crecimiento y te impulsa a integrar ambas energías de forma constructiva.`;
   } else if (aspectType === 'sextile') {
     return `Oportunidad entre ${planet1Name} (${planet1Desc}) y ${planet2Name} (${planet2Desc}). Tienes facilidad para combinar estas energías cuando te lo propones conscientemente.`;
   }

   return `${baseInterpretation} entre ${planet1Name} y ${planet2Name}.`;
 };

 // 🎨 FUNCIÓN: Renderizar líneas de aspectos CON TOOLTIPS MEJORADOS
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
       <g key={index}>
         <line
           x1={pos1.x}
           y1={pos1.y}
           x2={pos2.x}
           y2={pos2.y}
           stroke={aspect.config.color}
           strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
           opacity={isHovered ? 1 : opacity}
           strokeDasharray={isMinor ? "3,3" : "none"}
           className="transition-all duration-200 cursor-pointer"
           onMouseEnter={(e) => {
             setHoveredAspect(aspectKey);
             handleMouseMove(e);
           }}
           onMouseMove={handleMouseMove}
           onMouseLeave={() => setHoveredAspect(null)}
         />
       </g>
     );
   });
 };

 // 🎨 FUNCIÓN: Renderizar planetas
 const renderPlanets = () => {
   return normalizedPlanets.map((planet, index) => {
     if (!planet || !planet.name) return null;

     const position = getCirclePosition(planet.position, 190);
     const symbol = PLANET_SYMBOLS[planet.name] || planet.name.charAt(0);
     const color = PLANET_COLORS[planet.name] || '#ffffff';
     const isHovered = hoveredPlanet === planet.name;
     
     return (
       <g key={index}>
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

 // 🎨 FUNCIÓN: Renderizar casas
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

 // 🎨 FUNCIÓN: Renderizar signos zodiacales
 const renderSigns = () => {
   const signs = [
     'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
     'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
   ];
   
   return signs.map((sign, index) => {
     const angle = index * 30;
     const symbolPosition = getCirclePosition(angle + 15, 270);
     const textPosition = getCirclePosition(angle + 15, 290);
     const symbol = SIGN_SYMBOLS[sign] || sign.charAt(0);
     
     return (
       <g key={index}>
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

 // 🎨 FUNCIÓN: Renderizar ángulos principales
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
   <div className="space-y-8 relative">
     {/* 🧭 HEADER CON ICONO DE AYUDA */}
     <div className="bg-gradient-to-r from-black/60 to-purple-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
           <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
           </svg>
           <h1 className="text-2xl font-bold text-white">Tu Carta Natal</h1>
           
           {/* 🎯 ICONO DE AYUDA CON TOOLTIP CORREGIDO */}
           <div className="relative" style={{ zIndex: 100000 }}>
             <svg 
               className="w-5 h-5 text-blue-400 cursor-help hover:text-blue-300 transition-colors duration-200"
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2"
               onMouseEnter={(e) => {
                 setHoveredNavGuide(true);
                 const rect = e.currentTarget.getBoundingClientRect();
                 setTooltipPosition({ 
                   x: rect.right + 15,
                   y: rect.top - 20
                 });
               }}
               onMouseLeave={() => setHoveredNavGuide(false)}
             >
               <circle cx="12" cy="12" r="10"/>
               <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
               <line x1="12" y1="17" x2="12.01" y2="17"/>
             </svg>
           </div>
         </div>
       </div>
     </div>

     {/* TOOLTIP SEPARADO FUERA DEL CONTENEDOR CON Z-INDEX MÁXIMO */}
     {hoveredNavGuide && (
       <div 
         className="fixed bg-gradient-to-r from-blue-500/95 to-purple-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-md pointer-events-none"
         style={{ 
           left: tooltipPosition.x, 
           top: tooltipPosition.y,
           zIndex: 100000,
           transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
         }}
       >
         <div className="text-white font-bold mb-2">Guía de navegación</div>
         <div className="text-gray-200 text-xs">
           Usa el menú para saltar entre secciones de tu carta natal.<br />
           Pasa el cursor sobre los íconos y elementos para ver interpretaciones y detalles.<br />
           ¡Explora cada sección para descubrir el significado de tu carta!
         </div>
       </div>
     )}

     {/* ✨ MENÚ DE NAVEGACIÓN PRINCIPAL */}
     <SectionMenu activeSection={activeSection} scrollToSection={scrollToSection} />

     {/* 🎯 SECCIÓN 1: DATOS DE NACIMIENTO */}
     <div id="datos-nacimiento" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
       {/* Columna 1: Datos de Nacimiento */}
       <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center mb-4">
           <svg className="w-5 h-5 text-green-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
             <line x1="16" y1="2" x2="16" y2="6"/>
             <line x1="8" y1="2" x2="8" y2="6"/>
             <line x1="3" y1="10" x2="21" y2="10"/>
           </svg>
           <h3 className="text-lg font-bold text-white">Datos de Nacimiento</h3>
         </div>
         
         <div className="space-y-4">
           <div className="flex items-center p-3 bg-black/20 rounded-lg">
             <svg className="w-6 h-6 text-green-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
               <line x1="16" y1="2" x2="16" y2="6"/>
               <line x1="8" y1="2" x2="8" y2="6"/>
               <line x1="3" y1="10" x2="21" y2="10"/>
             </svg>
             <div>
               <div className="text-white font-semibold text-sm">Fecha de Nacimiento</div>
               <div className="text-gray-300 text-xs">
                 {birthData?.birthDate ? new Date(birthData.birthDate).toLocaleDateString('es-ES', {
                   weekday: 'long',
                   day: 'numeric',
                   month: 'long',
                   year: 'numeric'
                 }) : 'domingo, 10 de febrero de 1974'}
               </div>
             </div>
           </div>
           
           <div className="flex items-center p-3 bg-black/20 rounded-lg">
             <svg className="w-6 h-6 text-blue-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="12" cy="12" r="10"/>
               <polyline points="12,6 12,12 16,14"/>
             </svg>
             <div>
               <div className="text-white font-semibold text-sm">Hora de Nacimiento</div>
               <div className="text-gray-300 text-xs">
                 {birthData?.birthTime || '07:30'}
               </div>
             </div>
           </div>
           
           <div className="flex items-center p-3 bg-black/20 rounded-lg">
             <svg className="w-6 h-6 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
               <circle cx="12" cy="10" r="3"/>
             </svg>
             <div>
               <div className="text-white font-semibold text-sm">Lugar de Nacimiento</div>
               <div className="text-gray-300 text-xs">
                 {birthData?.birthPlace || 'Madrid, España'}
               </div>
               <div className="text-gray-400 text-xs mt-1">
                 40.4168°N, 3.7038°W
               </div>
             </div>
           </div>
         </div>
       </div>

       {/* Columna 2: Ángulos Principales */}
       <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center mb-4">
           <svg className="w-5 h-5 text-blue-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <circle cx="12" cy="12" r="3"/>
             <path d="M12 1v6m0 6v6"/>
             <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/>
             <path d="M1 12h6m6 0h6"/>
             <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
           </svg>
           <h3 className="text-lg font-bold text-white">Ángulos</h3>
         </div>
         
         <div className="space-y-4">
           {ascendant && (
             <div 
               className="flex items-center p-3 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-all duration-200"
               onMouseEnter={(e) => {
                 setHoveredPlanet('Ascendente');
                 handleMouseMove(e);
               }}
               onMouseMove={handleMouseMove}
               onMouseLeave={() => setHoveredPlanet(null)}
               title={`Ascendente en ${ascendant.sign} - Tu personalidad externa`}
             >
               <svg className="w-6 h-6 text-green-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <line x1="12" y1="19" x2="12" y2="5"/>
                 <polyline points="5,12 12,5 19,12"/>
               </svg>
               <div>
                 <div className="text-white font-semibold text-sm">Ascendente</div>
                 <div className="text-gray-300 text-xs">
                   {ascendant.degree || 0}° {ascendant.sign || 'N/A'}
                 </div>
               </div>
             </div>
           )}
           
           {midheaven && (
             <div 
               className="flex items-center p-3 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-all duration-200"
               onMouseEnter={(e) => {
                 setHoveredPlanet('Medio Cielo');
                 handleMouseMove(e);
               }}
               onMouseMove={handleMouseMove}
               onMouseLeave={() => setHoveredPlanet(null)}
               title={`Medio Cielo en ${midheaven.sign} - Tu vocación`}
             >
               <svg className="w-6 h-6 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
                 <polyline points="16,7 22,7 22,13"/>
               </svg>
               <div>
                 <div className="text-white font-semibold text-sm">Medio Cielo</div>
                 <div className="text-gray-300 text-xs">
                   {midheaven.degree || 0}° {midheaven.sign || 'N/A'}
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>

       {/* Columna 3: Elementos */}
       <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center mb-4">
           <svg className="w-5 h-5 text-yellow-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
           </svg>
           <h3 className="text-lg font-bold text-white">Elementos</h3>
         </div>
         
         <div className="space-y-3">
           {Object.entries(elementDistribution).map(([element, count]) => {
             const total = Object.values(elementDistribution).reduce((a, b) => a + b, 0);
             const percentage = total > 0 ? (count / total) * 100 : 0;
             
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
             
             const elementNames = {
               fire: 'Fuego',
               earth: 'Tierra', 
               air: 'Aire',
               water: 'Agua'
             };
             
             return (
               <div key={element} className="space-y-2">
                 <div 
                   className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all duration-200"
                   onMouseEnter={(e) => {
                     setHoveredElement(element);
                     handleMouseMove(e);
                   }}
                   onMouseMove={handleMouseMove}
                   onMouseLeave={() => setHoveredElement(null)}
                 >
                   <span className="text-white font-medium flex items-center text-sm">
                     {icons[element as keyof typeof icons]} {elementNames[element as keyof typeof elementNames]}
                   </span>
                   <span className="text-gray-300 text-sm font-semibold">{percentage.toFixed(1)}%</span>
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

       {/* Columna 4: Modalidades */}
       <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center mb-4">
           <svg className="w-5 h-5 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
           </svg>
           <h3 className="text-lg font-bold text-white">Modalidades</h3>
         </div>
         
         <div className="space-y-3">
           {Object.entries(modalityDistribution).map(([modality, count]) => {
             const total = Object.values(modalityDistribution).reduce((a, b) => a + b, 0);
             const percentage = total > 0 ? (count / total) * 100 : 0;
             
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
             
             const modalityNames = {
               cardinal: 'Cardinal',
               fixed: 'Fijo',
               mutable: 'Mutable'
             };
             
             return (
               <div key={modality} className="space-y-2">
                 <div 
                   className="flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all duration-200"
                   onMouseEnter={(e) => {
                     setHoveredModality(modality);
                     handleMouseMove(e);
                   }}
                   onMouseMove={handleMouseMove}
                   onMouseLeave={() => setHoveredModality(null)}
                 >
                   <span className="text-white font-medium flex items-center text-sm">
                     {icons[modality as keyof typeof icons]} {modalityNames[modality as keyof typeof modalityNames]}
                   </span>
                   <span className="text-gray-300 text-sm font-semibold">{percentage.toFixed(1)}%</span>
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

     {/* ✨ MENÚ DE NAVEGACIÓN */}
     <SectionMenu activeSection={activeSection} scrollToSection={scrollToSection} />

     {/* 🎯 SECCIÓN 2: CARTA VISUAL */}
     <div id="carta-visual" className="space-y-8">
       {/* Controles de aspectos */}
       <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center justify-between mb-4">
           <div className="flex items-center">
             <svg className="w-5 h-5 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="13.5" cy="6.5" r=".5"/>
               <circle cx="17.5" cy="10.5" r=".5"/>
               <circle cx="8.5" cy="7.5" r=".5"/>
               <circle cx="6.5" cy="12.5" r=".5"/>
               <polyline points="13.5,6.5 8.5,7.5 6.5,12.5 17.5,10.5"/>
             </svg>
             <h3 className="text-lg font-bold text-white">Configuración de Aspectos de la Carta</h3>
             <div className="ml-2 text-gray-400 text-sm">
               (Líneas que conectan planetas en la carta visual)
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
             {showAspects ? (
               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                 <circle cx="12" cy="12" r="3"/>
               </svg>
             ) : (
               <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                 <line x1="1" y1="1" x2="23" y2="23"/>
               </svg>
             )}
             {showAspects ? 'Ocultar Aspectos' : 'Mostrar Aspectos'}
           </button>
         </div>
         
         {showAspects && (
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {Object.entries({
               major: { label: '🌟 Aspectos Mayores', tooltip: 'Los 5 aspectos principales: más fuertes y definitorios' },
               minor: { label: '✨ Aspectos Menores', tooltip: 'Influencias más sutiles pero importantes' },
               easy: { label: '💙 Aspectos Armónicos', tooltip: 'Facilidades, talentos y energías que fluyen' },
               hard: { label: '❤️ Aspectos Tensos', tooltip: 'Tensiones creativas que impulsan el desarrollo' }
             }).map(([key, config]) => (
               <div key={key} className="relative group">
                 <button
                   onClick={() => setSelectedAspectTypes({...selectedAspectTypes, [key]: !selectedAspectTypes[key as keyof typeof selectedAspectTypes]})}
                   className={`w-full p-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                     selectedAspectTypes[key as keyof typeof selectedAspectTypes]
                       ? `bg-gradient-to-r ${
                           key === 'major' ? 'from-blue-400/30 to-purple-500/30 border-blue-400/50 text-blue-300' :
                           key === 'minor' ? 'from-purple-400/30 to-pink-500/30 border-purple-400/50 text-purple-300' :
                           key === 'easy' ? 'from-cyan-400/30 to-blue-500/30 border-cyan-400/50 text-cyan-300' :
                           'from-red-400/30 to-pink-500/30 border-red-400/50 text-red-300'
                         } border`
                       : 'bg-gray-600/20 border border-gray-500/30 text-gray-400'
                   }`}
                 >
                   {config.label}
                 </button>
                 
                 {/* TOOLTIP CON Z-INDEX CORREGIDO */}
                 <div 
                   className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border border-white/30 rounded-xl p-3 shadow-2xl transition-opacity duration-200 pointer-events-none max-w-xs"
                   style={{ zIndex: 99999 }}
                 >
                   <div className="text-white text-xs font-semibold mb-1">{config.label}</div>
                   <div className="text-gray-300 text-xs">{config.tooltip}</div>
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>

       {/* 🎨 CARTA NATAL PRINCIPAL */}
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
             {/* Círculos concéntricos */}
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

       {/* Leyenda de aspectos CON SIGNIFICADOS COMPLETOS Y ESTILOS UNIFICADOS */}
       <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center mb-6">
           <svg className="w-6 h-6 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
           </svg>
           <h3 className="text-xl font-bold text-white">Guía de Aspectos Astrológicos</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {Object.entries(ASPECTS).map(([type, config]) => (
             <div 
               key={type} 
               className="bg-black/30 rounded-xl p-5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-black/40"
             >
               {/* HEADER CON COLOR Y NOMBRE */}
               <div className="flex items-center mb-3">
                 <div 
                   className="w-6 h-3 mr-3 rounded-full shadow-lg" 
                   style={{ backgroundColor: config.color, boxShadow: `0 0 10px ${config.color}40` }}
                 ></div>
                 <span className="text-white font-bold text-lg">{config.name}</span>
               </div>
               
               {/* INFORMACIÓN TÉCNICA */}
               <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                 <div className="text-gray-300 text-sm mb-1">
                   <span className="text-blue-300 font-semibold">Ángulo:</span> {config.angle}°
                 </div>
                 <div className="text-gray-300 text-sm mb-2">
                   <span className="text-blue-300 font-semibold">Orbe máximo:</span> ±{config.orb}°
                 </div>
                 <div className="text-xs text-gray-400">
                   <span className="text-yellow-300 font-semibold">EXACTO</span> cuando orbe &lt; 1°
                 </div>
               </div>
               
               {/* SIGNIFICADO COMPLETO */}
               <div className="space-y-3">
                 <div>
                   <div className="text-white text-sm font-semibold mb-1 flex items-center">
                     🎯 Significado
                   </div>
                   <div className="text-gray-200 text-xs leading-relaxed">
                     {aspectMeanings[type as keyof typeof aspectMeanings]?.meaning}
                   </div>
                 </div>
                 
                 <div>
                   <div className="text-white text-sm font-semibold mb-1 flex items-center">
                     ⚡ Efecto
                   </div>
                   <div className="text-gray-300 text-xs leading-relaxed">
                     {aspectMeanings[type as keyof typeof aspectMeanings]?.effect}
                   </div>
                 </div>
                 
                 <div>
                   <div className="text-white text-sm font-semibold mb-1 flex items-center">
                     📊 Naturaleza
                   </div>
                   <div className={`text-xs leading-relaxed px-2 py-1 rounded-full text-center font-medium ${
                     config.difficulty === 'easy' 
                       ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
                       : config.difficulty === 'hard'
                         ? 'bg-red-400/20 text-red-300 border border-red-400/30'
                         : config.difficulty === 'neutral'
                           ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                           : 'bg-purple-400/20 text-purple-300 border border-purple-400/30'
                   }`}>
                     {aspectMeanings[type as keyof typeof aspectMeanings]?.type}
                   </div>
                 </div>
               </div>
               
               {/* INTERPRETACIÓN ADICIONAL */}
               <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-400/20">
                 <div className="text-purple-200 text-xs leading-relaxed">
                   {type === 'conjunction' && '💫 Energías fusionadas que actúan como una sola fuerza'}
                   {type === 'opposition' && '⚖️ Tensión que busca equilibrio entre fuerzas opuestas'}
                   {type === 'trine' && '🌟 Flujo natural de energía, talentos innatos'}
                   {type === 'square' && '🔥 Fricción creativa que impulsa el crecimiento'}
                   {type === 'sextile' && '🤝 Oportunidades que requieren acción consciente'}
                   {type === 'quincunx' && '🔄 Necesidad constante de adaptación y ajuste'}
                   {type === 'semisextile' && '✨ Matices sutiles que refinan la personalidad'}
                   {type === 'semisquare' && '⚠️ Pequeñas tensiones que piden atención'}
                   {type === 'sesquiquadrate' && '🌪️ Presión persistente hasta encontrar liberación'}
                 </div>
               </div>
             </div>
           ))}
         </div>
         
         {/* RESUMEN EDUCATIVO */}
         <div className="mt-8 p-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-400/30">
           <div className="text-center mb-4">
             <h4 className="text-white font-bold text-lg mb-2">📚 Resumen de Aspectos</h4>
             <div className="text-indigo-200 text-sm">Comprende cómo interactúan las energías planetarias en tu carta natal</div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="text-center">
               <div className="text-green-300 font-bold text-lg mb-2">🌟 Armónicos</div>
               <div className="text-green-200 text-sm">Trígono, Sextil, Semisextil</div>
               <div className="text-gray-300 text-xs mt-1">Facilitan, aportan talentos</div>
             </div>
             
             <div className="text-center">
               <div className="text-red-300 font-bold text-lg mb-2">🔥 Tensos</div>
               <div className="text-red-200 text-sm">Cuadratura, Oposición, Quincuncio</div>
               <div className="text-gray-300 text-xs mt-1">Desafían, impulsan crecimiento</div>
             </div>
             
             <div className="text-center">
               <div className="text-yellow-300 font-bold text-lg mb-2">⚡ Especiales</div>
               <div className="text-yellow-200 text-sm">Conjunción, Aspectos Menores</div>
               <div className="text-gray-300 text-xs mt-1">Intensifican, matizan</div>
             </div>
           </div>
           
           {/* EXPLICACIÓN DE EXACTO */}
           <div className="mt-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
             <div className="text-center">
               <div className="text-yellow-300 font-bold text-lg mb-2">⭐ Aspectos EXACTOS</div>
               <div className="text-yellow-100 text-sm leading-relaxed max-w-2xl mx-auto">
                 Cuando el orbe es menor a <span className="font-semibold">1 grado</span>, el aspecto se considera 
                 <span className="bg-yellow-400 text-black px-1 rounded mx-1 font-bold">EXACTO</span>. 
                 Estos aspectos tienen <span className="text-yellow-200 font-semibold">máxima potencia energética</span> 
                 y representan las influencias <span className="text-yellow-200 font-semibold">más poderosas</span> en tu personalidad.
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* ✨ MENÚ DE NAVEGACIÓN */}
     <SectionMenu activeSection={activeSection} scrollToSection={scrollToSection} />

     {/* 🎯 SECCIÓN 3: ASPECTOS DETECTADOS */}
     {calculatedAspects.length > 0 && (
       <div id="aspectos-detectados" className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center mb-6">
           <svg className="w-6 h-6 text-yellow-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
           </svg>
           <h3 className="text-xl font-bold text-white">
             Aspectos Detectados ({calculatedAspects.length})
           </h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {calculatedAspects.slice(0, 20).map((aspect, index) => (
             <div 
               key={index}
               className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-200 group relative"
               onMouseEnter={(e) => {
                 setHoveredAspect(`${aspect.planet1}-${aspect.planet2}-${aspect.type}`);
                 handleMouseMove(e);
               }}
               onMouseMove={handleMouseMove}
               onMouseLeave={() => setHoveredAspect(null)}
               style={{ position: 'relative', zIndex: 1 }}
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

     {/* ✨ MENÚ DE NAVEGACIÓN */}
     <SectionMenu activeSection={activeSection} scrollToSection={scrollToSection} />

     {/* 🎯 SECCIÓN 4: POSICIONES PLANETARIAS */}
     <div id="posiciones-planetarias" className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
       <div className="flex items-center mb-6">
         <svg className="w-6 h-6 text-yellow-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
           <circle cx="12" cy="12" r="5"/>
           <line x1="12" y1="1" x2="12" y2="3"/>
           <line x1="12" y1="21" x2="12" y2="23"/>
           <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
           <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
           <line x1="1" y1="12" x2="3" y2="12"/>
           <line x1="21" y1="12" x2="23" y2="12"/>
           <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
           <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
         </svg>
         <h3 className="text-xl font-bold text-white">Posiciones Planetarias</h3>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {normalizedPlanets.map((planet, index) => (
           <div 
             key={index} 
             className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10 cursor-pointer hover:border-white/20 transition-all duration-200"
             onMouseEnter={(e) => {
               setHoveredPlanet(planet.name);
               handleMouseMove(e);
             }}
             onMouseMove={handleMouseMove}
             onMouseLeave={() => setHoveredPlanet(null)}
           >
             <div className="flex items-center mb-2">
               <span className="text-2xl mr-3">
                 {planet && PLANET_SYMBOLS[planet.name] || '●'}
               </span>
               <div>
                 <div className="text-white font-semibold">{planet.name}</div>
                 <div className="text-gray-400 text-sm">
                   {planet.degree || 0}° {planet.sign}
                   {planet.retrograde && <span className="text-red-400 ml-1">R</span>}
                 </div>
               </div>
             </div>
             <div className="text-gray-500 text-xs">
               Casa {planet.house} | {SIGN_SYMBOLS[planet.sign] || ''}
             </div>
           </div>
         ))}
       </div>
     </div>

     {/* Información de ascendente y medio cielo */}
     {(ascendant || midheaven) && (
       <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
         <div className="flex items-center mb-6">
           <svg className="w-6 h-6 text-blue-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <circle cx="12" cy="12" r="3"/>
             <path d="M12 1v6m0 6v6"/>
             <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"/>
             <path d="M1 12h6m6 0h6"/>
             <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"/>
           </svg>
           <h3 className="text-xl font-bold text-white">Ángulos Principales</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {ascendant && (
             <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
               <div className="flex items-center mb-2">
                 <svg className="w-6 h-6 text-green-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <line x1="12" y1="19" x2="12" y2="5"/>
                   <polyline points="5,12 12,5 19,12"/>
                 </svg>
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
           
           {midheaven && (
             <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/10">
               <div className="flex items-center mb-2">
                 <svg className="w-6 h-6 text-purple-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
                   <polyline points="16,7 22,7 22,13"/>
                 </svg>
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

     {/* 🎯 TOOLTIPS DINÁMICOS COMPLETOS - TODOS CON Z-INDEX CORREGIDO */}
     {/* TOOLTIP PLANETAS PERSONALIZADO */}
     {hoveredPlanet && hoveredPlanet !== 'Ascendente' && hoveredPlanet !== 'Medio Cielo' && (
       <div 
         className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
         style={{ 
           left: tooltipPosition.x + 25,
           top: tooltipPosition.y - 50,
           zIndex: 99999,
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
               {normalizedPlanets.find(p => p.name === hoveredPlanet)?.degree}° {normalizedPlanets.find(p => p.name === hoveredPlanet)?.sign}
             </div>
             <div className="text-gray-300 text-xs">
               Casa {normalizedPlanets.find(p => p.name === hoveredPlanet)?.house} • {signMeanings[normalizedPlanets.find(p => p.name === hoveredPlanet)?.sign as keyof typeof signMeanings]}
             </div>
           </div>
         </div>
         
         {planetMeanings[hoveredPlanet as keyof typeof planetMeanings] && (
           <div className="mb-2">
             <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
             <div className="text-gray-200 text-xs mb-2">
               {planetMeanings[hoveredPlanet as keyof typeof planetMeanings].meaning}
             </div>
             <div className="text-gray-300 text-xs mb-2">
               <strong>Palabras clave:</strong> {planetMeanings[hoveredPlanet as keyof typeof planetMeanings].keywords}
             </div>
             
             {/* INTERPRETACIÓN PERSONALIZADA */}
             <div className="text-white text-sm font-semibold mb-1">⚡ En tu carta:</div>
             <div className="text-cyan-200 text-xs leading-relaxed">
               {getPersonalizedPlanetInterpretation(normalizedPlanets.find(p => p.name === hoveredPlanet))}
             </div>
           </div>
         )}
         
         {normalizedPlanets.find(p => p.name === hoveredPlanet)?.retrograde && (
           <div className="bg-red-400/20 rounded-lg p-2 mt-2">
             <div className="text-red-300 text-xs font-semibold">⚠️ Retrógrado</div>
             <div className="text-red-200 text-xs">Energía internalizada, revisión de temas pasados</div>
           </div>
         )}
       </div>
     )}

     {/* 🎯 TOOLTIP ASPECTOS PERSONALIZADO */}
     {hoveredAspect && calculatedAspects.length > 0 && (
       <div 
         className="fixed bg-gradient-to-r from-purple-500/95 to-pink-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-lg pointer-events-none"
         style={{ 
           left: tooltipPosition.x, 
           top: tooltipPosition.y,
           zIndex: 99999,
           transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none'
         }}
       >
         {(() => {
           const currentAspect = calculatedAspects.find(aspect => 
             `${aspect.planet1}-${aspect.planet2}-${aspect.type}` === hoveredAspect
           );
           
           if (!currentAspect) return null;
           
           const planet1Desc = planetMeanings[currentAspect.planet1 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';
           const planet2Desc = planetMeanings[currentAspect.planet2 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || 'planeta';
           
           return (
             <>
               <div className="flex items-center mb-3">
                 <div 
                   className="w-6 h-6 rounded-full mr-3" 
                   style={{ backgroundColor: currentAspect.config.color }}
                 ></div>
                 <div>
                   <div className="text-white font-bold text-lg">{currentAspect.config.name}</div>
                   <div className="text-gray-200 text-sm">
                     entre {currentAspect.planet1} ({planet1Desc}) y {currentAspect.planet2} ({planet2Desc})
                   </div>
                 </div>
               </div>
               
               <div className="mb-3 p-3 bg-white/10 rounded-lg border border-white/10">
                 <div className="text-blue-300 text-xs mb-1">
                   <strong>Ángulo:</strong> {currentAspect.config.angle}°
                 </div>
                 <div className="text-blue-300 text-xs mb-1">
                   <strong>Orbe máximo:</strong> ±{currentAspect.config.orb}°
                 </div>
                 <div className="text-yellow-300 text-xs font-semibold">
                   {currentAspect.exact ? 'EXACTO' : `Orbe: ${currentAspect.orb.toFixed(2)}°`} cuando orbe &lt; 1°
                 </div>
               </div>
               
               <div className="mb-2">
                 <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
                 <div className="text-gray-200 text-xs mb-2">
                   {getPersonalizedAspectInterpretation(currentAspect)}
                 </div>
                 <div className="text-gray-300 text-xs mb-2">
                   <strong>Efecto:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.effect}
                 </div>
                 <div className="text-gray-300 text-xs">
                   <strong>Tipo:</strong> {aspectMeanings[currentAspect.type as keyof typeof aspectMeanings]?.type}
                 </div>
               </div>
               
               {/* 🌟 EXPLICACIÓN CUANDO ES EXACTO */}
               {currentAspect.exact && (
                 <div className="mt-2 p-2 bg-yellow-400/20 border border-yellow-400/40 rounded">
                   <div className="text-yellow-200 text-xs font-bold mb-1">⭐ Aspecto Exacto</div>
                   <div className="text-yellow-100 text-xs leading-relaxed">
                     Este aspecto tiene <strong>máxima potencia energética</strong> (orbe &lt; 1°). 
                     Es una de las influencias <strong>más poderosas</strong> en tu personalidad.
                   </div>
                 </div>
               )}
             </>
           );
         })()}
       </div>
     )}

     {/* 🎯 TOOLTIP ASCENDENTE */}
     {hoveredPlanet === 'Ascendente' && ascendant && (
       <div 
         className="fixed bg-gradient-to-r from-green-500/95 to-emerald-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
         style={{ 
           left: tooltipPosition.x + 25,
           top: tooltipPosition.y - 50,
           zIndex: 99999,
           transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
         }}
       >
         <div className="flex items-center mb-3">
           <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <line x1="12" y1="19" x2="12" y2="5"/>
             <polyline points="5,12 12,5 19,12"/>
           </svg>
           <div>
             <div className="text-white font-bold text-lg">Ascendente</div>
             <div className="text-gray-200 text-sm">
               {ascendant.degree}° {ascendant.sign}
             </div>
           </div>
         </div>
         
         <div className="mb-2">
           <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
           <div className="text-gray-200 text-xs mb-2">
             Tu máscara social, cómo te presentas al mundo y tu apariencia física. 
             La energía que proyectas en primeras impresiones.
           </div>
           <div className="text-gray-300 text-xs mb-2">
             <strong>En {ascendant.sign}:</strong> {signMeanings[ascendant.sign as keyof typeof signMeanings]}
           </div>
           <div className="text-cyan-200 text-xs leading-relaxed">
             <strong>⚡ En tu carta:</strong> Con Ascendente en {ascendant.sign}, te presentas al mundo con las cualidades de {signMeanings[ascendant.sign as keyof typeof signMeanings]?.toLowerCase()}. Tu personalidad externa refleja estas características de forma natural.
           </div>
           <div className="text-gray-300 text-xs mt-2">
             <strong>Palabras clave:</strong> Personalidad externa, imagen, vitalidad, enfoque de vida
           </div>
         </div>
       </div>
     )}

     {/* 🎯 TOOLTIP MEDIO CIELO */}
     {hoveredPlanet === 'Medio Cielo' && midheaven && (
       <div 
         className="fixed bg-gradient-to-r from-purple-500/95 to-violet-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
         style={{ 
           left: tooltipPosition.x + 25,
           top: tooltipPosition.y - 50,
           zIndex: 99999,
           transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
         }}
       >
         <div className="flex items-center mb-3">
           <svg className="w-8 h-8 text-white mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
             <polyline points="16,7 22,7 22,13"/>
           </svg>
           <div>
             <div className="text-white font-bold text-lg">Medio Cielo</div>
             <div className="text-gray-200 text-sm">
               {midheaven.degree}° {midheaven.sign}
             </div>
           </div>
         </div>
         
         <div className="mb-2">
           <div className="text-white text-sm font-semibold mb-1">🎯 Significado:</div>
           <div className="text-gray-200 text-xs mb-2">
             Tu vocación, carrera ideal, reputación pública y lo que quieres lograr 
             en el mundo. Tu propósito profesional.
           </div>
           <div className="text-gray-300 text-xs mb-2">
             <strong>En {midheaven.sign}:</strong> {signMeanings[midheaven.sign as keyof typeof signMeanings]}
           </div>
           <div className="text-cyan-200 text-xs leading-relaxed">
             <strong>⚡ En tu carta:</strong> Con Medio Cielo en {midheaven.sign}, tu vocación y carrera se expresan a través de {signMeanings[midheaven.sign as keyof typeof signMeanings]?.toLowerCase()}. Esta es la energía que quieres proyectar profesionalmente.
           </div>
           <div className="text-gray-300 text-xs mt-2">
             <strong>Palabras clave:</strong> Carrera, estatus, reconocimiento, autoridad
           </div>
         </div>
       </div>
     )}

     {/* 🎯 TOOLTIP CASAS */}
     {hoveredHouse && (
       <div 
         className="fixed bg-gradient-to-r from-blue-500/95 to-cyan-500/95 backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
         style={{ 
           left: tooltipPosition.x + 25,
           top: tooltipPosition.y - 50,
           zIndex: 99999,
           transform: tooltipPosition.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
         }}
       >
         <div className="flex items-start mb-3">
           <span className="text-3xl mr-3">🏠</span>
           <div>
             <div className="text-white font-bold text-lg">
               {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.name}
             </div>
             <div className="text-gray-200 text-sm mb-2">
               {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.meaning}
             </div>
             <div className="text-gray-300 text-xs">
               <strong>Temas:</strong> {houseMeanings[hoveredHouse as keyof typeof houseMeanings]?.keywords}
             </div>
           </div>
         </div>
       </div>
     )}

     {/* 🎯 TOOLTIP ELEMENTOS CON INTERPRETACIÓN CONTEXTUAL */}
     {hoveredElement && (
       <div 
         className="fixed backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
         style={{ 
           left: tooltipPosition.x + 25,
           top: tooltipPosition.y - 50,
           zIndex: 99999,
           transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none',
           backgroundColor: getIntensityColor(hoveredElement, (Object.values(elementDistribution).reduce((a, b) => a + b, 0) > 0 ? (elementDistribution[hoveredElement as keyof typeof elementDistribution] / Object.values(elementDistribution).reduce((a, b) => a + b, 0)) * 100 : 0))
         }}
       >
         <div className="flex items-center mb-3">
           <span className="text-3xl mr-3">
             {hoveredElement === 'fire' && '🔥'}
             {hoveredElement === 'earth' && '🌍'}
             {hoveredElement === 'air' && '💨'}
             {hoveredElement === 'water' && '🌊'}
           </span>
           <div>
             <div className="text-white font-bold text-lg">
               Elemento {elementMeanings[hoveredElement as keyof typeof elementMeanings]?.name}
             </div>
           </div>
         </div>
         
         <div className="mb-2">
           <div className="text-white text-xs leading-relaxed">
             {getElementInterpretation(
               hoveredElement, 
               Object.values(elementDistribution).reduce((a, b) => a + b, 0) > 0 
                 ? (elementDistribution[hoveredElement as keyof typeof elementDistribution] / Object.values(elementDistribution).reduce((a, b) => a + b, 0)) * 100 
                 : 0
             )}
           </div>
         </div>
       </div>
     )}

     {/* 🎯 TOOLTIP MODALIDADES CON INTERPRETACIÓN CONTEXTUAL */}
     {hoveredModality && (
       <div 
         className="fixed backdrop-blur-sm border border-white/30 rounded-xl p-4 shadow-2xl max-w-sm pointer-events-none"
         style={{ 
           left: tooltipPosition.x + 25,
           top: tooltipPosition.y - 50,
           zIndex: 99999,
           transform: tooltipPosition.x > window.innerWidth - 350 ? 'translateX(-100%)' : 'none',
           backgroundColor: getIntensityColor(hoveredModality, (Object.values(modalityDistribution).reduce((a, b) => a + b, 0) > 0 ? (modalityDistribution[hoveredModality as keyof typeof modalityDistribution] / Object.values(modalityDistribution).reduce((a, b) => a + b, 0)) * 100 : 0))
         }}
       >
         <div className="flex items-center mb-3">
           <span className="text-3xl mr-3">
             {hoveredModality === 'cardinal' && '⚡'}
             {hoveredModality === 'fixed' && '🛡️'}
             {hoveredModality === 'mutable' && '🔄'}
           </span>
           <div>
             <div className="text-white font-bold text-lg">
               Modalidad {modalityMeanings[hoveredModality as keyof typeof modalityMeanings]?.name}
             </div>
           </div>
         </div>
         
         <div className="mb-2">
           <div className="text-white text-xs leading-relaxed">
             {getModalityInterpretation(
               hoveredModality, 
               Object.values(modalityDistribution).reduce((a, b) => a + b, 0) > 0 
                 ? (modalityDistribution[hoveredModality as keyof typeof modalityDistribution] / Object.values(modalityDistribution).reduce((a, b) => a + b, 0)) * 100 
                 : 0
             )}
           </div>
         </div>
       </div>
     )}

     {/* Debug info LIMPIO */}
     <div className="bg-black/30 rounded-xl p-4 text-xs text-gray-400">
       <div>🔍 Planetas: {planets.length} | Casas: {houses.length} | Aspectos: {calculatedAspects.length}</div>
       <div>🔺 Ascendente: {ascendant?.sign || 'N/A'} | MC: {midheaven?.sign || 'N/A'}</div>
       <div className="mt-2 text-yellow-300">💡 <strong>Tip:</strong> Pasa el cursor sobre elementos para interpretaciones personalizadas</div>
     </div>
   </div>
 );
};

// 📊 FUNCIONES DE CÁLCULO DE DISTRIBUCIONES (necesarias para los tooltips)
const elementMeanings = {
 fire: {
   name: "Fuego",
   meaning: "Energía, acción, iniciativa y entusiasmo",
   keywords: "Aries, Leo, Sagitario - Inspiración, liderazgo, creatividad",
   characteristics: "Personas dinámicas, espontáneas y optimistas"
 },
 earth: {
   name: "Tierra", 
   meaning: "Estabilidad, practicidad, materialidad y perseverancia",
   keywords: "Tauro, Virgo, Capricornio - Recursos, trabajo, estructura",
   characteristics: "Personas realistas, trabajadoras y confiables"
 },
 air: {
   name: "Aire",
   meaning: "Comunicación, ideas, relaciones sociales y conocimiento",
   keywords: "Géminis, Libra, Acuario - Intelecto, sociabilidad, innovación",
   characteristics: "Personas mentales, sociables y adaptables"
 },
 water: {
   name: "Agua",
   meaning: "Emociones, intuición, sensibilidad y espiritualidad",
   keywords: "Cáncer, Escorpio, Piscis - Sentimientos, psiquismo, compasión",
   characteristics: "Personas empáticas, intuitivas y emocionales"
 }
};

const modalityMeanings = {
 cardinal: {
   name: "Cardinal",
   meaning: "Iniciación, liderazgo, comienzos y acción directa",
   keywords: "Aries, Cáncer, Libra, Capricornio - Emprendimiento, pioneros",
   characteristics: "Personas que inician proyectos y toman la iniciativa"
 },
 fixed: {
   name: "Fijo",
   meaning: "Estabilidad, persistencia, determinación y resistencia al cambio",
   keywords: "Tauro, Leo, Escorpio, Acuario - Constancia, lealtad",
   characteristics: "Personas que mantienen y consolidan lo iniciado"
 },
 mutable: {
   name: "Mutable",
   meaning: "Adaptabilidad, flexibilidad, cambio y transformación",
   keywords: "Géminis, Virgo, Sagitario, Piscis - Versatilidad, adaptación",
   characteristics: "Personas que se adaptan y completan los ciclos"
 }
};

// FUNCIONES DE INTERPRETACIÓN
const getElementInterpretation = (element: string, percentage: number) => {
 const base = elementMeanings[element as keyof typeof elementMeanings];
 
 if (percentage >= 50) {
   return `Con ${percentage.toFixed(1)}% de ${base.name}, tienes una naturaleza PREDOMINANTEMENTE ${element.toUpperCase()}. ${base.meaning} Este alto porcentaje indica que ${base.characteristics.toLowerCase()} definen tu personalidad de manera muy marcada.`;
 } else if (percentage >= 30) {
   return `Tu ${percentage.toFixed(1)}% de ${base.name} muestra una influencia SIGNIFICATIVA. ${base.meaning} ${base.characteristics} son características importantes en tu forma de ser.`;
 } else if (percentage >= 15) {
   return `Con ${percentage.toFixed(1)}% de ${base.name}, tienes una influencia MODERADA. ${base.meaning} Estas cualidades aparecen de forma equilibrada en tu personalidad.`;
 } else if (percentage > 0) {
   return `Tu ${percentage.toFixed(1)}% de ${base.name} representa una influencia MENOR pero presente. ${base.meaning} Estas cualidades pueden emerger en situaciones específicas.`;
 } else {
   return `La ausencia de ${base.name} (0%) puede indicar la necesidad de desarrollar más: ${base.keywords.toLowerCase()}. Esto representa un área de crecimiento potencial.`;
 }
};

const getModalityInterpretation = (modality: string, percentage: number) => {
 const base = modalityMeanings[modality as keyof typeof modalityMeanings];
 
 if (percentage >= 50) {
   return `Con ${percentage.toFixed(1)}% ${base.name}, eres PREDOMINANTEMENTE ${modality.toUpperCase()}. ${base.meaning} ${base.characteristics} son tu forma principal de actuar en la vida.`;
 } else if (percentage >= 30) {
   return `Tu ${percentage.toFixed(1)}% ${base.name} muestra una tendencia FUERTE. ${base.meaning} ${base.characteristics} son aspectos importantes de tu personalidad.`;
 } else if (percentage >= 15) {
   return `Con ${percentage.toFixed(1)}% ${base.name}, tienes una influencia EQUILIBRADA. ${base.meaning} Manifiestas estas cualidades de forma balanceada.`;
 } else if (percentage > 0) {
   return `Tu ${percentage.toFixed(1)}% ${base.name} es una influencia SUTIL. ${base.meaning} Estas características emergen ocasionalmente.`;
 } else {
   return `La falta de modalidad ${base.name} (0%) sugiere desarrollar: ${base.keywords.toLowerCase()}. Área de crecimiento personal.`;
 }
};

// 🎨 FUNCIÓN PARA OBTENER COLOR DINÁMICO SEGÚN PORCENTAJE
const getIntensityColor = (element: string, percentage: number) => {
 const baseColors = {
   fire: { r: 239, g: 68, b: 68 },     // red-500
   earth: { r: 34, g: 197, b: 94 },    // green-500  
   air: { r: 59, g: 130, b: 246 },     // blue-500
   water: { r: 99, g: 102, b: 241 },   // indigo-500
   cardinal: { r: 239, g: 68, b: 68 }, // red-500
   fixed: { r: 59, g: 130, b: 246 },   // blue-500
   mutable: { r: 34, g: 197, b: 94 }   // green-500
 };
 
 const color = baseColors[element as keyof typeof baseColors] || { r: 156, g: 163, b: 175 };
 const intensity = Math.min(percentage / 50, 1); // Máxima intensidad al 50%
 
 return `rgba(${color.r}, ${color.g}, ${color.b}, ${0.3 + intensity * 0.7})`;
};

export default ChartDisplay;