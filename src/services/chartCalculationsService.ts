import { ASPECTS } from '../constants/astrology';

export const convertAstrologicalDegreeToPosition = (degree: number, sign: string): number => {
  const signPositions: { [key: string]: number } = {
    'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
    'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
    'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
  };

  const signBase = signPositions[sign] || 0;
  return signBase + degree;
};

export const calculateAspects = (planets: any[]): any[] => {
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
        const aspectConfig = config as { angle: number; orb: number; color: string; name: string; difficulty: string };
        const orb = Math.abs(angle - aspectConfig.angle);
        if (orb <= aspectConfig.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            angle: angle,
            type: aspectType,
            orb: orb,
            config: aspectConfig,
            exact: orb < 1
          });
        }
      });
    }
  }
  
  return aspects.sort((a, b) => a.orb - b.orb);
};

export const getCirclePosition = (angle: number, radius: number) => {
  const radian = (angle - 90) * (Math.PI / 180);
  return {
    x: 250 + Math.cos(radian) * radius,
    y: 250 + Math.sin(radian) * radius
  };
};
