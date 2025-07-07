import { aspectMeanings, planetMeanings, signMeanings, houseMeanings, elementMeanings, modalityMeanings } from '../constants/astrology';

export const getPersonalizedPlanetInterpretation = (planet: any) => {
  const planetName = planet.name;
  const sign = planet.sign;
  const house = planet.house;

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

  return `Con ${planetName} en ${sign} en Casa ${house}, ${planetMeanings[planetName as keyof typeof planetMeanings]?.meaning.toLowerCase()} se manifiesta con las cualidades de ${signMeanings[sign as keyof typeof signMeanings]?.toLowerCase()} en el área de ${houseMeanings[house as keyof typeof houseMeanings]?.meaning.toLowerCase()}`;
};

export const getPersonalizedAspectInterpretation = (aspect: any) => {
  const planet1Name = aspect.planet1;
  const planet2Name = aspect.planet2;
  const aspectType = aspect.type;

  const planet1Desc = planetMeanings[planet1Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet1Name;
  const planet2Desc = planetMeanings[planet2Name as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || planet2Name;

  const specificInterpretations: { [key: string]: string } = {
    'Sol-Luna-conjunction': `Tu esencia masculina (Sol) y femenina (Luna) trabajan en perfecta armonía. Hay coherencia entre lo que eres y lo que sientes.`,
    'Mercurio-Venus-conjunction': `Tu forma de comunicarte se fusiona con tu capacidad de amar. Hablas con encanto, seduces con las palabras y tu intelecto se vuelve más artístico.`,
    'Marte-Venus-square': `Existe tensión entre tu forma de actuar (Marte) y tus valores amorosos (Venus). Esta fricción te impulsa a equilibrar pasión con armonía.`,
    'Sol-Saturno-square': `Tu ego y autoridad personal chocan con las estructuras y límites. Esta tensión te enseña disciplina y perseverancia.`
  };

  const key = `${planet1Name}-${planet2Name}-${aspectType}`;
  if (specificInterpretations[key]) return specificInterpretations[key];

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

export const getSpecificAspectName = (aspect: any) => {
  const planet1Desc = planetMeanings[aspect.planet1 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || aspect.planet1;
  const planet2Desc = planetMeanings[aspect.planet2 as keyof typeof planetMeanings]?.keywords.split(',')[0]?.trim() || aspect.planet2;
  
  return `${aspect.config.name} entre ${aspect.planet1} (${planet1Desc}) y ${aspect.planet2} (${planet2Desc})`;
};

export const getElementInterpretation = (element: string, percentage: number) => {
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

export const getModalityInterpretation = (modality: string, percentage: number) => {
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

export const getIntensityColor = (element: string, percentage: number) => {
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
