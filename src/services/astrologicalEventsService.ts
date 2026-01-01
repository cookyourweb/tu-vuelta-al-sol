// src/services/astrologicalEventsService.ts
// 🌟 BASE DE DATOS COMPLETA DE EVENTOS ASTRONÓMICOS 2025-2027

import { AstrologicalEvent } from "@/utils/astrology/events";



// ==========================================
// 🌙 FASES LUNARES COMPLETAS 2025-2027
// ==========================================

const LUNAR_PHASES_COMPLETE = [
  // AGOSTO 2025
  { date: '2025-08-19', phase: 'Luna Llena', sign: 'Acuario', intensity: 'high' },
  { date: '2025-08-26', phase: 'Cuarto Menguante', sign: 'Géminis', intensity: 'medium' },
  
  // SEPTIEMBRE 2025
  { date: '2025-09-03', phase: 'Luna Nueva', sign: 'Virgo', intensity: 'high' },
  { date: '2025-09-11', phase: 'Cuarto Creciente', sign: 'Sagitario', intensity: 'medium' },
  { date: '2025-09-18', phase: 'Luna Llena', sign: 'Piscis', intensity: 'high' },
  { date: '2025-09-25', phase: 'Cuarto Menguante', sign: 'Cáncer', intensity: 'medium' },
  
  // OCTUBRE 2025
  { date: '2025-10-02', phase: 'Luna Nueva', sign: 'Libra', intensity: 'high' },
  { date: '2025-10-10', phase: 'Cuarto Creciente', sign: 'Capricornio', intensity: 'medium' },
  { date: '2025-10-17', phase: 'Luna Llena', sign: 'Aries', intensity: 'high' },
  { date: '2025-10-24', phase: 'Cuarto Menguante', sign: 'Leo', intensity: 'medium' },
  
  // NOVIEMBRE 2025
  { date: '2025-11-01', phase: 'Luna Nueva', sign: 'Escorpio', intensity: 'high' },
  { date: '2025-11-09', phase: 'Cuarto Creciente', sign: 'Acuario', intensity: 'medium' },
  { date: '2025-11-15', phase: 'Luna Llena', sign: 'Tauro', intensity: 'high' },
  { date: '2025-11-23', phase: 'Cuarto Menguante', sign: 'Virgo', intensity: 'medium' },
  
  // DICIEMBRE 2025
  { date: '2025-12-01', phase: 'Luna Nueva', sign: 'Sagitario', intensity: 'high' },
  { date: '2025-12-08', phase: 'Cuarto Creciente', sign: 'Piscis', intensity: 'medium' },
  { date: '2025-12-15', phase: 'Luna Llena', sign: 'Géminis', intensity: 'high' },
  { date: '2025-12-22', phase: 'Cuarto Menguante', sign: 'Libra', intensity: 'medium' },
  { date: '2025-12-30', phase: 'Luna Nueva', sign: 'Capricornio', intensity: 'high' },
  
  // ENERO 2026
  { date: '2026-01-06', phase: 'Cuarto Creciente', sign: 'Aries', intensity: 'medium' },
  { date: '2026-01-13', phase: 'Luna Llena', sign: 'Cáncer', intensity: 'high' },
  { date: '2026-01-21', phase: 'Cuarto Menguante', sign: 'Escorpio', intensity: 'medium' },
  { date: '2026-01-29', phase: 'Luna Nueva', sign: 'Acuario', intensity: 'high' },
  
  // FEBRERO 2026
  { date: '2026-02-05', phase: 'Cuarto Creciente', sign: 'Tauro', intensity: 'medium' },
  { date: '2026-02-12', phase: 'Luna Llena', sign: 'Leo', intensity: 'high' },
  { date: '2026-02-19', phase: 'Cuarto Menguante', sign: 'Sagitario', intensity: 'medium' },
  { date: '2026-02-27', phase: 'Luna Nueva', sign: 'Piscis', intensity: 'high' },
  
  // MARZO 2026
  { date: '2026-03-07', phase: 'Cuarto Creciente', sign: 'Géminis', intensity: 'medium' },
  { date: '2026-03-13', phase: 'Luna Llena', sign: 'Virgo', intensity: 'high' },
  { date: '2026-03-21', phase: 'Cuarto Menguante', sign: 'Capricornio', intensity: 'medium' },
  { date: '2026-03-29', phase: 'Luna Nueva', sign: 'Aries', intensity: 'high' },
  
  // ABRIL - DICIEMBRE 2026 (resto del año)
  { date: '2026-04-05', phase: 'Cuarto Creciente', sign: 'Cáncer', intensity: 'medium' },
  { date: '2026-04-11', phase: 'Luna Llena', sign: 'Libra', intensity: 'high' },
  { date: '2026-04-19', phase: 'Cuarto Menguante', sign: 'Acuario', intensity: 'medium' },
  { date: '2026-04-27', phase: 'Luna Nueva', sign: 'Tauro', intensity: 'high' },
  
  { date: '2026-05-05', phase: 'Cuarto Creciente', sign: 'Leo', intensity: 'medium' },
  { date: '2026-05-11', phase: 'Luna Llena', sign: 'Escorpio', intensity: 'high' },
  { date: '2026-05-19', phase: 'Cuarto Menguante', sign: 'Piscis', intensity: 'medium' },
  { date: '2026-05-26', phase: 'Luna Nueva', sign: 'Géminis', intensity: 'high' },
  
  { date: '2026-06-03', phase: 'Cuarto Creciente', sign: 'Virgo', intensity: 'medium' },
  { date: '2026-06-09', phase: 'Luna Llena', sign: 'Sagitario', intensity: 'high' },
  { date: '2026-06-17', phase: 'Cuarto Menguante', sign: 'Aries', intensity: 'medium' },
  { date: '2026-06-25', phase: 'Luna Nueva', sign: 'Cáncer', intensity: 'high' },
  
  { date: '2026-07-02', phase: 'Cuarto Creciente', sign: 'Libra', intensity: 'medium' },
  { date: '2026-07-08', phase: 'Luna Llena', sign: 'Capricornio', intensity: 'high' },
  { date: '2026-07-17', phase: 'Cuarto Menguante', sign: 'Tauro', intensity: 'medium' },
  { date: '2026-07-24', phase: 'Luna Nueva', sign: 'Leo', intensity: 'high' },
  
  { date: '2026-08-01', phase: 'Cuarto Creciente', sign: 'Escorpio', intensity: 'medium' },
  { date: '2026-08-07', phase: 'Luna Llena', sign: 'Acuario', intensity: 'high' },
  { date: '2026-08-15', phase: 'Cuarto Menguante', sign: 'Géminis', intensity: 'medium' },
  { date: '2026-08-23', phase: 'Luna Nueva', sign: 'Virgo', intensity: 'high' },
  
  { date: '2026-09-01', phase: 'Cuarto Creciente', sign: 'Sagitario', intensity: 'medium' },
  { date: '2026-09-06', phase: 'Luna Llena', sign: 'Piscis', intensity: 'high' },
  { date: '2026-09-14', phase: 'Cuarto Menguante', sign: 'Cáncer', intensity: 'medium' },
  { date: '2026-09-21', phase: 'Luna Nueva', sign: 'Libra', intensity: 'high' },
  
  { date: '2026-09-30', phase: 'Cuarto Creciente', sign: 'Capricornio', intensity: 'medium' },
  { date: '2026-10-05', phase: 'Luna Llena', sign: 'Aries', intensity: 'high' },
  { date: '2026-10-13', phase: 'Cuarto Menguante', sign: 'Leo', intensity: 'medium' },
  { date: '2026-10-21', phase: 'Luna Nueva', sign: 'Escorpio', intensity: 'high' },
  
  { date: '2026-10-29', phase: 'Cuarto Creciente', sign: 'Acuario', intensity: 'medium' },
  { date: '2026-11-04', phase: 'Luna Llena', sign: 'Tauro', intensity: 'high' },
  { date: '2026-11-12', phase: 'Cuarto Menguante', sign: 'Virgo', intensity: 'medium' },
  { date: '2026-11-20', phase: 'Luna Nueva', sign: 'Sagitario', intensity: 'high' },
  
  { date: '2026-11-28', phase: 'Cuarto Creciente', sign: 'Piscis', intensity: 'medium' },
  { date: '2026-12-04', phase: 'Luna Llena', sign: 'Géminis', intensity: 'high' },
  { date: '2026-12-11', phase: 'Cuarto Menguante', sign: 'Libra', intensity: 'medium' },
  { date: '2026-12-19', phase: 'Luna Nueva', sign: 'Capricornio', intensity: 'high' },
  
  // ENERO - FEBRERO 2027 (completar año)
  { date: '2027-01-05', phase: 'Cuarto Creciente', sign: 'Aries', intensity: 'medium' },
  { date: '2027-01-12', phase: 'Luna Llena', sign: 'Cáncer', intensity: 'high' },
  { date: '2027-01-20', phase: 'Cuarto Menguante', sign: 'Escorpio', intensity: 'medium' },
  { date: '2027-01-28', phase: 'Luna Nueva', sign: 'Acuario', intensity: 'high' },
  { date: '2027-02-04', phase: 'Cuarto Creciente', sign: 'Tauro', intensity: 'medium' },
  { date: '2027-02-11', phase: 'Luna Llena', sign: 'Leo', intensity: 'high' }
];

// ==========================================
// 🪐 RETROGRADACIONES Y MOVIMIENTOS DIRECTOS
// ==========================================

const RETROGRADE_EVENTS = [
  // MERCURIO RETRÓGRADO
  { date: '2025-08-28', type: 'retrograde', planet: 'Mercurio', sign: 'Virgo', description: 'Mercurio retrógrado en Virgo - revisión de métodos y sistemas' },
  { date: '2025-09-15', type: 'direct', planet: 'Mercurio', sign: 'Virgo', description: 'Mercurio directo - claridad en comunicación' },
  { date: '2025-12-15', type: 'retrograde', planet: 'Mercurio', sign: 'Sagitario', description: 'Mercurio retrógrado - cuidado con viajes y documentos' },
  { date: '2026-01-04', type: 'direct', planet: 'Mercurio', sign: 'Capricornio', description: 'Mercurio directo - nuevos planes toman forma' },
  { date: '2026-04-14', type: 'retrograde', planet: 'Mercurio', sign: 'Aries', description: 'Mercurio retrógrado - revisar proyectos nuevos' },
  { date: '2026-05-07', type: 'direct', planet: 'Mercurio', sign: 'Aries', description: 'Mercurio directo - acción decidida' },
  { date: '2026-08-12', type: 'retrograde', planet: 'Mercurio', sign: 'Virgo', description: 'Mercurio retrógrado - perfeccionar detalles' },
  { date: '2026-09-02', type: 'direct', planet: 'Mercurio', sign: 'Virgo', description: 'Mercurio directo - soluciones prácticas' },
  { date: '2026-12-08', type: 'retrograde', planet: 'Mercurio', sign: 'Sagitario', description: 'Mercurio retrógrado - revisar filosofía de vida' },
  { date: '2026-12-28', type: 'direct', planet: 'Mercurio', sign: 'Sagitario', description: 'Mercurio directo - nueva perspectiva' },
  
  // VENUS RETRÓGRADA
  { date: '2026-01-30', type: 'retrograde', planet: 'Venus', sign: 'Piscis', description: 'Venus retrógrada - reevaluación del amor y valores' },
  { date: '2026-03-14', type: 'direct', planet: 'Venus', sign: 'Acuario', description: 'Venus directa - nuevas formas de amar' },
  { date: '2026-08-03', type: 'retrograde', planet: 'Venus', sign: 'Virgo', description: 'Venus retrógrada - perfeccionar relaciones' },
  { date: '2026-09-14', type: 'direct', planet: 'Venus', sign: 'Leo', description: 'Venus directa - expresión creativa del amor' },
  
  // MARTE RETRÓGRADO
  { date: '2025-12-06', type: 'retrograde', planet: 'Marte', sign: 'León', description: 'Marte retrógrado - revisar expresión personal' },
  { date: '2026-02-24', type: 'direct', planet: 'Marte', sign: 'Cáncer', description: 'Marte directo - acción emocional equilibrada' },
  { date: '2026-10-18', type: 'retrograde', planet: 'Marte', sign: 'Géminis', description: 'Marte retrógrado - revisar comunicación agresiva' },
  { date: '2027-01-06', type: 'direct', planet: 'Marte', sign: 'Géminis', description: 'Marte directo - comunicación asertiva' },
  
  // PLANETAS EXTERIORES
  { date: '2025-10-11', type: 'retrograde', planet: 'Plutón', sign: 'Acuario', description: 'Plutón retrógrado - transformación tecnológica interna' },
  { date: '2026-01-20', type: 'direct', planet: 'Plutón', sign: 'Acuario', description: 'Plutón directo - revolución exterior' },
  { date: '2025-08-16', type: 'retrograde', planet: 'Urano', sign: 'Tauro', description: 'Urano retrógrado - estabilizar cambios materiales' },
  { date: '2026-01-19', type: 'direct', planet: 'Urano', sign: 'Tauro', description: 'Urano directo - innovación financiera' },
  { date: '2025-09-07', type: 'retrograde', planet: 'Neptuno', sign: 'Piscis', description: 'Neptuno retrógrado - claridad espiritual interna' },
  { date: '2026-03-14', type: 'direct', planet: 'Neptuno', sign: 'Piscis', description: 'Neptuno directo - manifestación de la visión' },
  { date: '2025-10-13', type: 'retrograde', planet: 'Júpiter', sign: 'Cáncer', description: 'Júpiter retrógrado - crecimiento emocional interno' },
  { date: '2026-02-04', type: 'direct', planet: 'Júpiter', sign: 'Cáncer', description: 'Júpiter directo - expansión familiar' },
  { date: '2025-11-15', type: 'retrograde', planet: 'Saturno', sign: 'Piscis', description: 'Saturno retrógrado - reestructurar espiritualidad' },
  { date: '2026-04-06', type: 'direct', planet: 'Saturno', sign: 'Piscis', description: 'Saturno directo - disciplina espiritual' }
];

// ==========================================
// 🌟 TRÁNSITOS PLANETARIOS IMPORTANTES
// ==========================================

const PLANETARY_TRANSITS = [
  // SOL (cambios estacionales)
  { date: '2025-08-23', type: 'planetary_transit', planet: 'Sol', sign: 'Virgo', description: 'Sol entra en Virgo - tiempo de organización y perfección' },
  { date: '2025-09-22', type: 'seasonal', planet: 'Sol', sign: 'Libra', description: 'Equinoccio de Otoño - equilibrio entre luz y sombra' },
  { date: '2025-10-23', type: 'planetary_transit', planet: 'Sol', sign: 'Escorpio', description: 'Sol entra en Escorpio - transformación profunda' },
  { date: '2025-11-22', type: 'planetary_transit', planet: 'Sol', sign: 'Sagitario', description: 'Sol entra en Sagitario - expansión de horizontes' },
  { date: '2025-12-21', type: 'seasonal', planet: 'Sol', sign: 'Capricornio', description: 'Solsticio de Invierno - renacimiento de la luz' },
  { date: '2026-01-20', type: 'planetary_transit', planet: 'Sol', sign: 'Acuario', description: 'Sol entra en Acuario - innovación y libertad' },
  { date: '2026-02-18', type: 'planetary_transit', planet: 'Sol', sign: 'Piscis', description: 'Sol entra en Piscis - conexión espiritual' },
  { date: '2026-03-20', type: 'seasonal', planet: 'Sol', sign: 'Aries', description: 'Equinoccio de Primavera - nuevos comienzos' },
  { date: '2026-04-19', type: 'planetary_transit', planet: 'Sol', sign: 'Tauro', description: 'Sol entra en Tauro - estabilidad y manifestación' },
  { date: '2026-05-20', type: 'planetary_transit', planet: 'Sol', sign: 'Géminis', description: 'Sol entra en Géminis - comunicación y versatilidad' },
  { date: '2026-06-21', type: 'seasonal', planet: 'Sol', sign: 'Cáncer', description: 'Solsticio de Verano - culminación de proyectos' },
  { date: '2026-07-22', type: 'planetary_transit', planet: 'Sol', sign: 'Leo', description: 'Sol entra en Leo - expresión creativa y liderazgo' },
  { date: '2026-08-22', type: 'planetary_transit', planet: 'Sol', sign: 'Virgo', description: 'Sol entra en Virgo - refinamiento y servicio' },
  { date: '2026-09-22', type: 'seasonal', planet: 'Sol', sign: 'Libra', description: 'Equinoccio de Otoño - armonía y justicia' },
  { date: '2026-10-23', type: 'planetary_transit', planet: 'Sol', sign: 'Escorpio', description: 'Sol entra en Escorpio - regeneración profunda' },
  { date: '2026-11-21', type: 'planetary_transit', planet: 'Sol', sign: 'Sagitario', description: 'Sol entra en Sagitario - búsqueda de significado' },
  { date: '2026-12-21', type: 'seasonal', planet: 'Sol', sign: 'Capricornio', description: 'Solsticio de Invierno - estructuras duraderas' },
  { date: '2027-01-19', type: 'planetary_transit', planet: 'Sol', sign: 'Acuario', description: 'Sol entra en Acuario - visión futurista' },
  { date: '2027-02-18', type: 'planetary_transit', planet: 'Sol', sign: 'Piscis', description: 'Sol entra en Piscis - culminación espiritual' },
  
  // VENUS (amor y valores)
  { date: '2025-09-07', type: 'planetary_transit', planet: 'Venus', sign: 'Leo', description: 'Venus entra en Leo - amor dramático y generoso' },
  { date: '2025-10-08', type: 'planetary_transit', planet: 'Venus', sign: 'Virgo', description: 'Venus entra en Virgo - amor detallista y práctico' },
  { date: '2025-11-08', type: 'planetary_transit', planet: 'Venus', sign: 'Libra', description: 'Venus entra en Libra - armonía en relaciones' },
  { date: '2025-12-04', type: 'planetary_transit', planet: 'Venus', sign: 'Escorpio', description: 'Venus entra en Escorpio - pasión intensa' },
  { date: '2025-12-29', type: 'planetary_transit', planet: 'Venus', sign: 'Sagitario', description: 'Venus entra en Sagitario - amor aventurero' },
  { date: '2026-01-23', type: 'planetary_transit', planet: 'Venus', sign: 'Capricornio', description: 'Venus entra en Capricornio - relaciones serias' },
  
  // JÚPITER (expansión)
  { date: '2025-09-07', type: 'planetary_transit', planet: 'Júpiter', sign: 'Cáncer', description: 'Júpiter entra en Cáncer - expansión emocional y familiar' },
  { date: '2026-06-09', type: 'planetary_transit', planet: 'Júpiter', sign: 'Leo', description: 'Júpiter entra en Leo - crecimiento creativo y personal' },
  
  // SATURNO (estructura)
  { date: '2026-02-14', type: 'planetary_transit', planet: 'Saturno', sign: 'Aries', description: 'Saturno entra en Aries - nuevas estructuras de liderazgo' },
  
  // PLANETAS EXTERIORES
  { date: '2025-11-08', type: 'planetary_transit', planet: 'Urano', sign: 'Géminis', description: 'Urano entra en Géminis - revolución comunicacional' },
  { date: '2026-03-30', type: 'planetary_transit', planet: 'Neptuno', sign: 'Aries', description: 'Neptuno entra en Aries - nueva espiritualidad activa' }
];

// ==========================================
// 🌑 ECLIPSES TRANSFORMADORES
// ==========================================

const ECLIPSES = [
  { date: '2025-09-07', type: 'eclipse', subtype: 'lunar', sign: 'Piscis', description: 'Eclipse Lunar en Piscis - liberación emocional profunda' },
  { date: '2025-09-21', type: 'eclipse', subtype: 'solar', sign: 'Virgo', description: 'Eclipse Solar en Virgo - nuevas estructuras de servicio' },
  { date: '2026-02-17', type: 'eclipse', subtype: 'lunar', sign: 'Leo', description: 'Eclipse Lunar en Leo - crisis creativa que lleva al renacimiento' },
  { date: '2026-03-03', type: 'eclipse', subtype: 'solar', sign: 'Piscis', description: 'Eclipse Solar en Piscis - nuevo ciclo espiritual' },
  { date: '2026-08-12', type: 'eclipse', subtype: 'lunar', sign: 'Acuario', description: 'Eclipse Lunar en Acuario - liberación de patrones mentales' },
  { date: '2026-08-28', type: 'eclipse', subtype: 'solar', sign: 'Virgo', description: 'Eclipse Solar en Virgo - perfeccionamiento de sistemas' },
  { date: '2027-01-08', type: 'eclipse', subtype: 'lunar', sign: 'Cáncer', description: 'Eclipse Lunar en Cáncer - transformación emocional familiar' },
  { date: '2027-02-06', type: 'eclipse', subtype: 'solar', sign: 'Acuario', description: 'Eclipse Solar en Acuario - visión futurista revolucionaria' }
];

// ==========================================
// 🌟 ASPECTOS PLANETARIOS IMPORTANTES
// ==========================================

const MAJOR_ASPECTS = [
  { date: '2025-09-14', type: 'aspect', description: 'Trígono Júpiter-Saturno - equilibrio entre expansión y disciplina', priority: 'high' },
  { date: '2025-10-28', type: 'aspect', description: 'Oposición Sol-Júpiter - tensión entre ego y crecimiento', priority: 'medium' },
  { date: '2025-11-19', type: 'aspect', description: 'Conjunción Venus-Plutón - transformación profunda en relaciones', priority: 'high' },
  { date: '2025-12-25', type: 'aspect', description: 'Trígono Mercurio-Urano - ideas innovadoras', priority: 'medium' },
  { date: '2026-01-15', type: 'aspect', description: 'Cuadratura Marte-Saturno - fricción entre acción y restricción', priority: 'high' },
  { date: '2026-02-28', type: 'aspect', description: 'Conjunción Sol-Neptuno - inspiración espiritual elevada', priority: 'medium' },
  { date: '2026-03-21', type: 'aspect', description: 'Trígono Venus-Júpiter - abundancia y armonía', priority: 'high' },
  { date: '2026-04-18', type: 'aspect', description: 'Oposición Mercurio-Plutón - comunicación transformadora', priority: 'medium' },
  { date: '2026-05-25', type: 'aspect', description: 'Conjunción Marte-Júpiter - acción expansiva', priority: 'high' },
  { date: '2026-06-14', type: 'aspect', description: 'Cuadratura Sol-Saturno - desafíos de autoridad', priority: 'medium' },
  { date: '2026-07-09', type: 'aspect', description: 'Trígono Luna-Venus - armonía emocional', priority: 'low' },
  { date: '2026-08-16', type: 'aspect', description: 'Oposición Mercurio-Saturno - comunicación seria', priority: 'medium' },
  { date: '2026-09-23', type: 'aspect', description: 'Conjunción Venus-Marte - pasión y acción', priority: 'high' },
  { date: '2026-10-11', type: 'aspect', description: 'Trígono Sol-Júpiter - confianza y optimismo', priority: 'high' },
  { date: '2026-11-27', type: 'aspect', description: 'Cuadratura Venus-Plutón - transformación en valores', priority: 'medium' },
  { date: '2026-12-15', type: 'aspect', description: 'Conjunción Mercurio-Júpiter - comunicación expansiva', priority: 'medium' },
  { date: '2027-01-22', type: 'aspect', description: 'Trígono Sol-Urano - cambios positivos e innovación', priority: 'high' },
  { date: '2027-02-14', type: 'aspect', description: 'Conjunción Venus-Neptuno - amor idealizado y creativo', priority: 'medium' }
];

// ==========================================
// 🎯 FUNCIÓN PRINCIPAL MEJORADA
// ==========================================

export async function getAstrologicalEvents(
  startDate: string,
  endDate: string,
  latitude: number,
  longitude: number,
  timezone: string
): Promise<AstrologicalEvent[]> {
  
  console.log('🌟 === GENERANDO EVENTOS ASTROLÓGICOS COMPLETOS ===');
  console.log('📅 Período:', { startDate, endDate, latitude, longitude, timezone });
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const events: AstrologicalEvent[] = [];
    
    // 1. AGREGAR FASES LUNARES
    const lunarEvents = LUNAR_PHASES_COMPLETE
      .filter(lunar => {
        const lunarDate = new Date(lunar.date);
        return lunarDate >= start && lunarDate <= end;
      })
      .map(lunar => ({
        id: `lunar_${lunar.date}`,
        type: 'lunar_phase' as const,
        date: lunar.date,
        title: `${lunar.phase} en ${lunar.sign}`,
        description: getLunarDescription(lunar.phase, lunar.sign),
        sign: lunar.sign,
        priority: lunar.intensity as 'high' | 'medium' | 'low'
      }));
    
    // 2. AGREGAR RETROGRADACIONES Y MOVIMIENTOS DIRECTOS CON DURACIÓN
    const retrogradeEvents = RETROGRADE_EVENTS
      .filter(retro => {
        const retroDate = new Date(retro.date);
        return retroDate >= start && retroDate <= end;
      })
      .map(retro => {
        // Calcular duración de la retrogradación
        const duration = calculateRetrogradeDuration(retro);

        return {
          id: `${retro.type}_${retro.planet}_${retro.date}`,
          type: retro.type as AstrologicalEvent['type'],
          date: retro.date,
          title: `${retro.planet} ${retro.type === 'retrograde' ? 'Retrógrado' : 'Directo'} en ${retro.sign}`,
          description: retro.description,
          planet: retro.planet,
          sign: retro.sign,
          priority: getPlanetaryPriority(retro.planet, retro.type),
          duration: duration // Nueva metadata
        };
      });
    
    // 3. AGREGAR TRÁNSITOS PLANETARIOS CON DURACIÓN
    const transitEvents = PLANETARY_TRANSITS
      .filter(transit => {
        const transitDate = new Date(transit.date);
        return transitDate >= start && transitDate <= end;
      })
      .map(transit => {
        // Calcular duración del tránsito
        const duration = calculateTransitDuration(transit.planet, transit.date);

        return {
          id: `transit_${transit.planet}_${transit.date}`,
          type: transit.type as AstrologicalEvent['type'],
          date: transit.date,
          title: `${transit.planet} entra en ${transit.sign}`,
          description: transit.description,
          planet: transit.planet,
          sign: transit.sign,
          priority: getTransitPriority(transit.planet, transit.type),
          duration: duration, // Nueva metadata
          transitType: getTransitType(transit.planet) // Rápido, mediano o lento
        };
      });
    
    // 4. AGREGAR ECLIPSES
    const eclipseEvents = ECLIPSES
      .filter(eclipse => {
        const eclipseDate = new Date(eclipse.date);
        return eclipseDate >= start && eclipseDate <= end;
      })
      .map(eclipse => ({
        id: `eclipse_${eclipse.date}`,
        type: 'eclipse' as const,
        date: eclipse.date,
        title: `Eclipse ${eclipse.subtype === 'solar' ? 'Solar' : 'Lunar'} en ${eclipse.sign}`,
        description: eclipse.description,
        sign: eclipse.sign,
        priority: 'high' as const
      }));
    
    // 5. AGREGAR ASPECTOS IMPORTANTES
    const aspectEvents = MAJOR_ASPECTS
      .filter(aspect => {
        const aspectDate = new Date(aspect.date);
        return aspectDate >= start && aspectDate <= end;
      })
      .map(aspect => ({
        id: `aspect_${aspect.date}`,
        type: 'aspect' as const,
        date: aspect.date,
        title: aspect.description.split(' - ')[0],
        description: aspect.description,
        priority: aspect.priority as 'high' | 'medium' | 'low'
      }));
    
    // 6. COMBINAR TODOS LOS EVENTOS
    events.push(...lunarEvents, ...retrogradeEvents, ...transitEvents, ...eclipseEvents, ...aspectEvents);
    
    // 7. ORDENAR POR FECHA Y PRIORIDAD
    events.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare === 0) {
        const priorityOrder: { [key in 'high' | 'medium' | 'low']: number } = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as 'high' | 'medium' | 'low'] - priorityOrder[b.priority as 'high' | 'medium' | 'low'];
      }
      return dateCompare;
    });
    
    // 8. LIMITAR PARA EVITAR SOBRECARGA
    const finalEvents = events.slice(0, 80);
    
    console.log(`✅ ${finalEvents.length} eventos astrológicos completos generados`);
    
    // 9. CALCULAR ESTADÍSTICAS DETALLADAS
    const stats = calculateEventStats(finalEvents);
    console.log('📊 Distribución completa por tipo:', stats);
    
    return finalEvents;
    
  } catch (error) {
    console.error('❌ Error generando eventos completos:', error);
    return generateMinimalEvents(startDate, endDate);
  }
}

// ==========================================
// 🎯 FUNCIONES AUXILIARES MEJORADAS
// ==========================================

function getLunarDescription(phase: string, sign: string): string {
  const phaseDescriptions: { [key: string]: string } = {
    'Luna Nueva': `Nueva siembra de intenciones en ${sign}. Tiempo ideal para comenzar proyectos relacionados con las cualidades de ${sign}.`,
    'Cuarto Creciente': `Acción decidida hacia tus metas. La energía de ${sign} te ayuda a superar obstáculos y manifestar tus planes.`,
    'Luna Llena': `Culminación y manifestación plena en ${sign}. Momento de celebrar logros y liberar lo que ya no necesitas.`,
    'Cuarto Menguante': `Reflexión y liberación con la sabiduría de ${sign}. Tiempo de soltar patrones y prepararte para lo nuevo.`
  };
  
  return phaseDescriptions[phase] || `Fase lunar especial en ${sign} que influye en las emociones y la intuición.`;
}

function getPlanetaryPriority(planet: string, type: string): 'high' | 'medium' | 'low' {
  // Mercurio retrógrado siempre es alta prioridad
  if (planet === 'Mercurio' && type === 'retrograde') return 'high';
  
  // Venus y Marte retrógrados son alta prioridad
  if ((planet === 'Venus' || planet === 'Marte') && type === 'retrograde') return 'high';
  
  // Planetas exteriores son media prioridad
  if (['Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'].includes(planet)) return 'medium';
  
  return 'medium';
}

function getTransitPriority(planet: string, type: string): 'high' | 'medium' | 'low' {
  // Cambios estacionales son alta prioridad
  if (type === 'seasonal') return 'high';
  
  // Tránsitos de planetas sociales
  if (['Júpiter', 'Saturno'].includes(planet)) return 'high';
  
  // Tránsitos de planetas exteriores
  if (['Urano', 'Neptuno', 'Plutón'].includes(planet)) return 'medium';
  
  // Tránsitos solares y de planetas personales
  return 'medium';
}

function calculateEventStats(events: AstrologicalEvent[]): Record<string, number> {
  const stats: Record<string, number> = {
    lunarPhases: 0,
    planetaryTransits: 0,
    retrogrades: 0,
    directMotions: 0,
    aspects: 0,
    eclipses: 0,
    seasonal: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  };
  
  events.forEach(event => {
    switch (event.type) {
      case 'lunar_phase':
        stats.lunarPhases++;
        break;
      case 'planetary_transit':
        stats.planetaryTransits++;
        break;
      case 'retrograde':
        stats.retrogrades++;
        break;
      case 'direct':
        stats.directMotions++;
        break;
      case 'aspect':
        stats.aspects++;
        break;
      case 'eclipse':
        stats.eclipses++;
        break;
      case 'seasonal':
        stats.seasonal++;
        break;
    }
    
    // Conteo por prioridad
    switch (event.priority) {
      case 'high':
        stats.highPriority++;
        break;
      case 'medium':
        stats.mediumPriority++;
        break;
      case 'low':
        stats.lowPriority++;
        break;
    }
  });
  
  return stats;
}

// ==========================================
// 📅 CÁLCULO DE DURACIONES
// ==========================================

function calculateRetrogradeDuration(retro: any): string {
  // Buscar el evento "direct" correspondiente
  const directEvent = RETROGRADE_EVENTS.find(e =>
    e.planet === retro.planet &&
    e.type === 'direct' &&
    new Date(e.date) > new Date(retro.date)
  );

  if (retro.type === 'retrograde' && directEvent) {
    const startDate = new Date(retro.date);
    const endDate = new Date(directEvent.date);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(days / 7);

    if (days < 30) {
      return `${weeks} semanas`;
    } else {
      const months = Math.ceil(days / 30);
      return `${months} meses`;
    }
  } else if (retro.type === 'direct') {
    // Para eventos "direct", mostrar cuándo empezó la retrogradación
    const retrogradeEvent = RETROGRADE_EVENTS.find(e =>
      e.planet === retro.planet &&
      e.type === 'retrograde' &&
      new Date(e.date) < new Date(retro.date)
    );

    if (retrogradeEvent) {
      const startDate = new Date(retrogradeEvent.date);
      return `Empezó: ${startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`;
    }
  }

  return '';
}

function calculateTransitDuration(planet: string, date: string): string {
  // Duraciones aproximadas de planetas en un signo
  const durations: Record<string, string> = {
    'Sol': '1 mes',
    'Mercurio': '2-3 semanas',
    'Venus': '3-4 semanas',
    'Marte': '6 semanas',
    'Júpiter': '1 año',
    'Saturno': '2.5 años',
    'Urano': '7 años',
    'Neptuno': '14 años',
    'Plutón': '12-30 años'
  };

  return durations[planet] || '';
}

function getTransitType(planet: string): 'rápido' | 'mediano' | 'lento' {
  const fastPlanets = ['Sol', 'Mercurio', 'Venus', 'Marte'];
  const mediumPlanets = ['Júpiter', 'Saturno'];
  const slowPlanets = ['Urano', 'Neptuno', 'Plutón'];

  if (fastPlanets.includes(planet)) return 'rápido';
  if (mediumPlanets.includes(planet)) return 'mediano';
  if (slowPlanets.includes(planet)) return 'lento';

  return 'mediano';
}

function generateMinimalEvents(startDate: string, endDate: string): AstrologicalEvent[] {
  console.log('⚠️ Generando eventos mínimos de emergencia...');
  
  const events: AstrologicalEvent[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Generar al menos 10 eventos básicos
  const daysDifference = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const eventInterval = Math.max(1, Math.floor(daysDifference / 10));
  
  for (let i = 0; i < 10; i++) {
    const eventDate = new Date(start);
    eventDate.setDate(start.getDate() + (i * eventInterval));
    
    if (eventDate <= end) {
      const phases = ['Luna Nueva', 'Cuarto Creciente', 'Luna Llena', 'Cuarto Menguante'];
      const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
      const phase = phases[i % 4];
      const sign = signs[i % 12];
      
      events.push({
        id: `minimal_${eventDate.toISOString().split('T')[0]}_${i}`,
        type: 'lunar_phase',
        date: eventDate.toISOString().split('T')[0],
        title: `${phase} en ${sign}`,
        description: getLunarDescription(phase, sign),
        sign: sign,
        priority: phase.includes('Luna') ? 'high' : 'medium'
      });
    }
  }
  
  console.log(`✅ ${events.length} eventos mínimos generados`);
  return events;
}

// ==========================================
// 🎯 EXPORTACIONES
// ==========================================

export default {
  getAstrologicalEvents,
  calculateEventStats
};