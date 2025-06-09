// src/components/astrology/NatalChartWheel.tsx - VERSIÓN COMPLETA
'use client';

import React, { useState } from 'react';

interface Planet {
  name: string;
  sign: string;
  longitude: number;
  symbol?: string;
  isRetrograde?: boolean;
}

interface House {
  number: number;
  longitude: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile' | 'quincunx';
  orb: number;
  exact_angle: number;
}

interface NatalChartWheelProps {
  planets: Planet[];
  houses: House[];
  aspects?: Aspect[];
  ascendant?: { longitude: number };
  midheaven?: { longitude: number };
  width?: number;
  height?: number;
  showAspects?: boolean;
  showDegreeMarkers?: boolean;
}

const NatalChartWheel: React.FC<NatalChartWheelProps> = ({
  planets = [],
  houses = [],
  aspects = [],
  ascendant,
  midheaven,
  width = 600,
  height = 600,
  showAspects = true,
  showDegreeMarkers = true
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);

  // Constantes para dibujar el gráfico
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) * 0.88;
  const innerRadius = outerRadius * 0.45;
  const middleRadius = outerRadius * 0.7;
  const planetRadius = outerRadius * 0.55;
  
  // 🔄 Función para convertir grados/minutos a longitud decimal
  const convertToLongitude = (angleData: any): number | null => {
    if (!angleData) return null;
    
    // Si ya viene como número (formato esperado)
    if (typeof angleData === 'number') {
      return angleData;
    }
    
    // Si viene como objeto con longitude
    if (angleData.longitude && typeof angleData.longitude === 'number') {
      return angleData.longitude;
    }
    
    // Si viene en formato sign/degree/minutes (formato actual)
    if (angleData.sign && angleData.degree) {
     const signLongitudes: Record<string, number> = {
       'Aries': 0, 'Tauro': 30, 'Géminis': 60, 'Cáncer': 90,
       'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Escorpio': 210,
       'Sagitario': 240, 'Capricornio': 270, 'Acuario': 300, 'Piscis': 330
     };
     
     const signOffset = signLongitudes[angleData.sign] || 0;
     const degrees = parseFloat(angleData.degree) || 0;
     const minutes = parseFloat(angleData.minutes) || 0;
     
     // Convertir minutos a fracción decimal
     const decimalDegrees = degrees + (minutes / 60);
     const totalLongitude = signOffset + decimalDegrees;
     
     console.log(`🔄 Convertido ${angleData.sign} ${angleData.degree}°${angleData.minutes}' = ${totalLongitude}°`);
     return totalLongitude;
   }
   
   console.warn('⚠️ Formato de ángulo no reconocido:', angleData);
   return null;
 };

 // 🧭 Obtener longitud del ascendente
 const ascendantLongitude = convertToLongitude(ascendant);
 
 // 🎯 Obtener longitud del medio cielo
 const midheavenLongitude = convertToLongitude(midheaven);
 
 // 🌟 Símbolos de los signos zodiacales
 const zodiacSymbols = [
   { symbol: '♈', name: 'Aries', longitude: 0, element: 'fire' },
   { symbol: '♉', name: 'Tauro', longitude: 30, element: 'earth' },
   { symbol: '♊', name: 'Géminis', longitude: 60, element: 'air' },
   { symbol: '♋', name: 'Cáncer', longitude: 90, element: 'water' },
   { symbol: '♌', name: 'Leo', longitude: 120, element: 'fire' },
   { symbol: '♍', name: 'Virgo', longitude: 150, element: 'earth' },
   { symbol: '♎', name: 'Libra', longitude: 180, element: 'air' },
   { symbol: '♏', name: 'Escorpio', longitude: 210, element: 'water' },
   { symbol: '♐', name: 'Sagitario', longitude: 240, element: 'fire' },
   { symbol: '♑', name: 'Capricornio', longitude: 270, element: 'earth' },
   { symbol: '♒', name: 'Acuario', longitude: 300, element: 'air' },
   { symbol: '♓', name: 'Piscis', longitude: 330, element: 'water' }
 ];
 
 // 🪐 Símbolos de los planetas
 const planetSymbols: Record<string, { symbol: string; color: string }> = {
   'Sol': { symbol: '☉', color: '#FFC107' },
   'Luna': { symbol: '☽', color: '#E1F5FE' },
   'Mercurio': { symbol: '☿', color: '#FFE082' },
   'Venus': { symbol: '♀', color: '#E91E63' },
   'Marte': { symbol: '♂', color: '#F44336' },
   'Júpiter': { symbol: '♃', color: '#9C27B0' },
   'Saturno': { symbol: '♄', color: '#3F51B5' },
   'Urano': { symbol: '♅', color: '#00BCD4' },
   'Neptuno': { symbol: '♆', color: '#009688' },
   'Plutón': { symbol: '♇', color: '#795548' },
   'Quirón': { symbol: '⚷', color: '#FF9800' },
   'Nodo Norte': { symbol: '☊', color: '#4CAF50' },
   'Nodo Sur': { symbol: '☋', color: '#8BC34A' },
   'Lilith': { symbol: '⚸', color: '#9E9E9E' }
 };
 
 // 🎨 Colores para elementos
 const elementColors: Record<string, { primary: string; secondary: string; gradient: string }> = {
   'fire': { 
     primary: '#FF5722', 
     secondary: '#FF8A65', 
     gradient: 'url(#fireGradient)' 
   },
   'earth': { 
     primary: '#4CAF50', 
     secondary: '#81C784', 
     gradient: 'url(#earthGradient)' 
   },
   'air': { 
     primary: '#2196F3', 
     secondary: '#64B5F6', 
     gradient: 'url(#airGradient)' 
   },
   'water': { 
     primary: '#9C27B0', 
     secondary: '#BA68C8', 
     gradient: 'url(#waterGradient)' 
   }
 };

 // ⚡ Estilos de aspectos MEJORADOS - MÁS VISIBLES
 const aspectStyles: Record<string, { color: string; width: number; style: string; opacity: number }> = {
   'conjunction': { 
     color: '#FFD700', 
     width: 4, 
     style: 'solid', 
     opacity: 1.0 
   },
   'opposition': { 
     color: '#FF4444', 
     width: 3.5, 
     style: 'solid', 
     opacity: 0.9 
   },
   'trine': { 
     color: '#4CAF50', 
     width: 3, 
     style: 'solid', 
     opacity: 0.8 
   },
   'square': { 
     color: '#FF9800', 
     width: 3, 
     style: 'solid', 
     opacity: 0.8 
   },
   'sextile': { 
     color: '#2196F3', 
     width: 2.5, 
     style: 'dashed', 
     opacity: 0.7 
   },
   'quincunx': { 
     color: '#9C27B0', 
     width: 2, 
     style: 'dotted', 
     opacity: 0.6 
   }
 };
 
 // 📐 Calcular posición - VALIDACIÓN ULTRA ROBUSTA
 const getPositionFromLongitude = (longitude: number, radius: number) => {
   // ✅ VALIDACIÓN EXHAUSTIVA de longitude
   if (longitude === null || longitude === undefined) {
     console.warn('⚠️ Longitud es null/undefined:', longitude);
     return { x: centerX, y: centerY };
   }
   
   if (typeof longitude !== 'number') {
     console.warn('⚠️ Longitud no es número:', typeof longitude, longitude);
     return { x: centerX, y: centerY };
   }
   
   if (isNaN(longitude)) {
     console.warn('⚠️ Longitud es NaN:', longitude);
     return { x: centerX, y: centerY };
   }
   
   if (!isFinite(longitude)) {
     console.warn('⚠️ Longitud no es finita:', longitude);
     return { x: centerX, y: centerY };
   }

   // Calcular la posición
   const adjustedAngle = (longitude + 270) % 360;
   const angleInRadians = (adjustedAngle * Math.PI) / 180;
   
   const x = centerX + radius * Math.cos(angleInRadians);
   const y = centerY + radius * Math.sin(angleInRadians);
   
   // ✅ VALIDACIÓN FINAL: Verificar resultado
   if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
     console.warn('⚠️ Posición calculada inválida:', { 
       x, y, longitude, radius, adjustedAngle, angleInRadians 
     });
     return { x: centerX, y: centerY };
   }
   
   return { x, y };
 };

 // 🎯 Renderizar marcadores de grados
 const renderDegreeMarkers = () => {
   if (!showDegreeMarkers) return null;

   const markers = [];
   
   for (let degree = 0; degree < 360; degree += 10) {
     const innerPos = getPositionFromLongitude(degree, outerRadius * 0.92);
     const outerPos = getPositionFromLongitude(degree, outerRadius * 0.98);
     
     markers.push(
       <line
         key={`major-marker-${degree}`}
         x1={innerPos.x}
         y1={innerPos.y}
         x2={outerPos.x}
         y2={outerPos.y}
         stroke="#666"
         strokeWidth="1.5"
         opacity="0.7"
       />
     );
     
     if (degree % 30 === 0) {
       const textPos = getPositionFromLongitude(degree, outerRadius * 0.85);
       markers.push(
         <text
           key={`degree-text-${degree}`}
           x={textPos.x}
           y={textPos.y}
           textAnchor="middle"
           dominantBaseline="middle"
           fontSize="10"
           fill="#888"
           fontWeight="500"
         >
           {degree}°
         </text>
       );
     }
   }
   
   return markers;
 };
 
 // 🏠 Renderizar líneas de casas
 const renderHouseLines = () => {
   if (houses.length === 0) return null;
   
   return houses.map((house, index) => {
     if (typeof house.longitude !== 'number' || isNaN(house.longitude)) {
       console.warn('⚠️ Casa con longitud inválida:', house);
       return null;
     }

     const innerPos = getPositionFromLongitude(house.longitude, innerRadius);
     const outerPos = getPositionFromLongitude(house.longitude, outerRadius);
     
     return (
       <line
         key={`house-line-${index}`}
         x1={innerPos.x}
         y1={innerPos.y}
         x2={outerPos.x}
         y2={outerPos.y}
         stroke="#4A5568"
         strokeWidth="1.5"
         strokeDasharray="6 3"
         opacity="0.8"
       />
     );
   });
 };
 
 // 🔢 Renderizar números de casas
 const renderHouseNumbers = () => {
   if (houses.length === 0) return null;
   
   return houses.map((house, index) => {
     if (typeof house.longitude !== 'number' || isNaN(house.longitude)) {
       return null;
     }

     const nextHouse = houses[(index + 1) % houses.length];
     const nextLongitude = nextHouse && typeof nextHouse.longitude === 'number' && !isNaN(nextHouse.longitude) 
       ? nextHouse.longitude 
       : house.longitude + 30;
     
     let midAngle = (house.longitude + nextLongitude) / 2;
     
     if (nextLongitude < house.longitude) {
       midAngle = ((house.longitude + nextLongitude + 360) / 2) % 360;
     }
     
     const position = getPositionFromLongitude(midAngle, middleRadius);
     
     return (
       <g key={`house-${index}`}>
         <circle
           cx={position.x}
           cy={position.y}
           r="16"
           fill="rgba(74, 85, 104, 0.1)"
           stroke="#4A5568"
           strokeWidth="1"
           opacity="0.8"
         />
         <text
           x={position.x}
           y={position.y}
           textAnchor="middle"
           dominantBaseline="middle"
           fontSize="12"
           fill="#2D3748"
           fontWeight="bold"
         >
           {house.number}
         </text>
       </g>
     );
   });
 };
 
 // ♈ Renderizar símbolos del zodíaco
 const renderZodiacSigns = () => {
   return zodiacSymbols.map((zodiacSign, index) => {
     const position = getPositionFromLongitude(zodiacSign.longitude + 15, outerRadius * 1.05);
     const elementColor = elementColors[zodiacSign.element];
     
     return (
       <g key={`zodiac-${index}`}>
         <circle
           cx={position.x}
           cy={position.y}
           r="18"
           fill={elementColor.gradient}
           opacity="0.2"
         />
         <text
           x={position.x}
           y={position.y}
           textAnchor="middle"
           dominantBaseline="middle"
           fontSize="18"
           fill={elementColor.primary}
           fontWeight="bold"
           style={{
             filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.3))',
             textShadow: '0 0 2px rgba(255,255,255,0.5)'
           }}
         >
           {zodiacSign.symbol}
         </text>
       </g>
     );
   });
 };
 
 // 🪐 Renderizar planetas - CON DEBUG ADICIONAL
 const renderPlanets = () => {
   console.log('🪐 Renderizando planetas. Total:', planets.length, planets);
   
   return planets.map((planet, index) => {
     console.log(`🪐 Procesando planeta ${index}:`, planet);
     
     if (typeof planet.longitude !== 'number' || isNaN(planet.longitude)) {
       console.warn('⚠️ Planeta con longitud inválida:', planet);
       return null;
     }

     const position = getPositionFromLongitude(planet.longitude, planetRadius);
     const planetData = planetSymbols[planet.name] || { symbol: planet.name.charAt(0), color: '#666' };
     const isHovered = hoveredPlanet === planet.name;
     const scale = isHovered ? 1.3 : 1;
     
     console.log(`🪐 Planeta ${planet.name} - Posición:`, position, 'Datos:', planetData);
     
     return (
       <g 
         key={`planet-${index}`}
         style={{ cursor: 'pointer' }}
         onMouseEnter={() => setHoveredPlanet(planet.name)}
         onMouseLeave={() => setHoveredPlanet(null)}
       >
         {isHovered && (
           <circle
             cx={position.x}
             cy={position.y}
             r="20"
             fill={planetData.color}
             opacity="0.3"
             style={{
               filter: 'blur(3px)',
               animation: 'pulse 2s infinite'
             }}
           />
         )}
         
         <circle
           cx={position.x}
           cy={position.y}
           r={12 * scale}
           fill="rgba(255,255,255,0.9)"
           stroke={planetData.color}
           strokeWidth="2"
           style={{
             filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
             transition: 'all 0.3s ease'
           }}
         />
         
         <text
           x={position.x}
           y={position.y}
           textAnchor="middle"
           dominantBaseline="middle"
           fontSize={14 * scale}
           fill={planetData.color}
           fontWeight="bold"
           style={{
             transition: 'all 0.3s ease',
             textShadow: '0 0 2px rgba(255,255,255,0.8)'
           }}
         >
           {planetData.symbol}
         </text>
         
         {planet.isRetrograde && (
           <text
             x={position.x + 15}
             y={position.y - 10}
             fontSize="8"
             fill="#FF6B6B"
             fontWeight="bold"
           >
             ℞
           </text>
         )}
         
         {isHovered && (
           <g>
             <rect
               x={position.x + 20}
               y={position.y - 25}
               width="120"
               height="50"
               fill="rgba(0,0,0,0.8)"
               rx="5"
               ry="5"
             />
             <text
               x={position.x + 25}
               y={position.y - 10}
               fontSize="12"
               fill="white"
               fontWeight="bold"
             >
               {planet.name}
             </text>
             <text
               x={position.x + 25}
               y={position.y + 5}
               fontSize="10"
               fill="#FFD700"
             >
               {planet.sign}
             </text>
             <text
               x={position.x + 25}
               y={position.y + 18}
               fontSize="10"
               fill="#87CEEB"
             >
               {Math.round(planet.longitude)}°
             </text>
           </g>
         )}
       </g>
     );
   });
 };

 // ⚡ Renderizar líneas de aspectos - VERSIÓN ULTRA MEJORADA
 const renderAspectLines = () => {
   console.log('⚡ === DEBUG ASPECTOS COMPLETO ===');
   console.log('⚡ showAspects:', showAspects);
   console.log('⚡ aspects length:', aspects.length);
   console.log('⚡ aspects array:', aspects);
   console.log('⚡ planetas disponibles:', planets.map(p => p.name));
   
   if (!showAspects) {
     console.log('⚡ showAspects es false - no renderizando aspectos');
     return null;
   }
   
   if (!aspects || aspects.length === 0) {
     console.log('⚡ No hay aspectos para renderizar');
     return null;
   }

   return aspects.map((aspect, index) => {
     console.log(`⚡ Procesando aspecto ${index}:`, aspect);
     
     const planet1 = planets.find(p => p.name === aspect.planet1);
     const planet2 = planets.find(p => p.name === aspect.planet2);
     
     console.log(`⚡ Planetas encontrados - P1:`, planet1, 'P2:', planet2);
     
     if (!planet1 || !planet2) {
       console.warn('⚠️ No se encontraron planetas para aspecto:', aspect);
       return null;
     }

     if (typeof planet1.longitude !== 'number' || isNaN(planet1.longitude) ||
         typeof planet2.longitude !== 'number' || isNaN(planet2.longitude)) {
       console.warn('⚠️ Longitudes inválidas en aspecto:', planet1.longitude, planet2.longitude);
       return null;
     }

     const pos1 = getPositionFromLongitude(planet1.longitude, planetRadius);
     const pos2 = getPositionFromLongitude(planet2.longitude, planetRadius);
     const style = aspectStyles[aspect.type];
     const aspectId = `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;
     const isHovered = hoveredAspect === aspectId;
     
     console.log(`⚡ Aspecto ${aspect.type} - Pos1:`, pos1, 'Pos2:', pos2, 'Style:', style);
     
     if (!style) {
       console.warn('⚠️ No se encontró estilo para aspecto:', aspect.type);
       return null;
     }

     return (
       <g key={`aspect-${index}`}>
         {/* Línea de sombra para mayor visibilidad */}
         <line
           x1={pos1.x}
           y1={pos1.y}
           x2={pos2.x}
           y2={pos2.y}
           stroke="rgba(0,0,0,0.3)"
           strokeWidth={(style.width + 1) * (isHovered ? 1.5 : 1)}
           strokeDasharray={
             style.style === 'dashed' ? '8,4' : 
             style.style === 'dotted' ? '3,3' : 
             ''
           }
           opacity="0.5"
           style={{
             pointerEvents: 'none'
           }}
         />
         
         {/* Línea de aspecto principal */}
         <line
           x1={pos1.x}
           y1={pos1.y}
           x2={pos2.x}
           y2={pos2.y}
           stroke={style.color}
           strokeWidth={style.width * (isHovered ? 1.5 : 1)}
           strokeDasharray={
             style.style === 'dashed' ? '8,4' : 
             style.style === 'dotted' ? '3,3' : 
             ''
           }
           opacity={style.opacity * (isHovered ? 1.2 : 1)}
           style={{
             cursor: 'pointer',
             filter: isHovered ? `drop-shadow(0 0 6px ${style.color})` : `drop-shadow(0 0 2px ${style.color})`,
             transition: 'all 0.3s ease'
           }}
           onMouseEnter={() => setHoveredAspect(aspectId)}
           onMouseLeave={() => setHoveredAspect(null)}
         />
         
         {/* Tooltip mejorado */}
         {isHovered && (
           <g>
             <rect
               x={(pos1.x + pos2.x) / 2 - 50}
               y={(pos1.y + pos2.y) / 2 - 25}
               width="100"
               height="50"
               fill="rgba(0,0,0,0.9)"
               rx="5"
               ry="5"
               stroke={style.color}
               strokeWidth="1"
             />
             <text
               x={(pos1.x + pos2.x) / 2}
               y={(pos1.y + pos2.y) / 2 - 10}
               textAnchor="middle"
               dominantBaseline="middle"
               fontSize="12"
               fill="white"
               fontWeight="bold"
             >
               {aspect.type.toUpperCase()}
             </text>
             <text
               x={(pos1.x + pos2.x) / 2}
               y={(pos1.y + pos2.y) / 2 + 5}
               textAnchor="middle"
               dominantBaseline="middle"
               fontSize="10"
               fill={style.color}
             >
               {aspect.planet1} → {aspect.planet2}
             </text>
             <text
               x={(pos1.x + pos2.x) / 2}
               y={(pos1.y + pos2.y) / 2 + 18}
               textAnchor="middle"
               dominantBaseline="middle"
               fontSize="9"
               fill="#FFD700"
             >
               {Math.round(aspect.orb * 100) / 100}°
             </text>
           </g>
         )}
       </g>
     );
   });
 };
 
 // 🧭 Renderizar Ascendente
 const renderAscendant = () => {
   if (!ascendant || !ascendant.longitude) {
     console.warn('⚠️ Ascendente no disponible');
     return null;
   }
   
   if (typeof ascendant.longitude !== 'number' || isNaN(ascendant.longitude)) {
     console.warn('⚠️ Ascendente.longitude inválido:', ascendant.longitude);
     return null;
   }
   
   const position = getPositionFromLongitude(ascendant.longitude, outerRadius * 1.12);
   
   return (
     <g>
       <circle
         cx={position.x}
         cy={position.y}
         r="8"
         fill="#FFD700"
         stroke="#FFA000"
         strokeWidth="2"
       />
       <text
         x={position.x}
         y={position.y + 20}
         textAnchor="middle"
         fontSize="12"
         fill="#FFA000"
         fontWeight="bold"
       >
         AC
       </text>
     </g>
   );
 };
 
 // 🎯 Renderizar Medio Cielo
 const renderMidheaven = () => {
   if (!midheaven || !midheaven.longitude) {
     console.warn('⚠️ Midheaven no disponible');
     return null;
   }
   
   if (typeof midheaven.longitude !== 'number' || isNaN(midheaven.longitude)) {
     console.warn('⚠️ Midheaven.longitude inválido:', midheaven.longitude);
     return null;
   }
   
   const position = getPositionFromLongitude(midheaven.longitude, outerRadius * 1.12);
   
   return (
     <g>
       <circle
         cx={position.x}
         cy={position.y}
         r="8"
         fill="#E91E63"
         stroke="#C2185B"
         strokeWidth="2"
       />
       <text
         x={position.x}
         y={position.y + 20}
         textAnchor="middle"
         fontSize="12"
         fill="#C2185B"
         fontWeight="bold"
       >
         MC
       </text>
     </g>
   );
 };

 return (
   <div className="flex flex-col items-center space-y-6">
     {/* Debug info - Mostrar datos recibidos */}
     {process.env.NODE_ENV === 'development' && (
       <div className="p-3 bg-yellow-100 rounded-lg text-xs max-w-4xl">
         <strong>🔍 DEBUG COMPLETO:</strong>
         <br />
         <strong>Planetas:</strong> {planets.length} | <strong>Con longitude válida:</strong> {planets.filter(p => typeof p.longitude === 'number' && !isNaN(p.longitude)).length}
         <br />
         <strong>Casas:</strong> {houses.length} | <strong>Aspectos:</strong> {aspects.length}
         <br />
         <strong>AC:</strong> {ascendantLongitude ? `${ascendantLongitude.toFixed(2)}°` : '❌'} | <strong>MC:</strong> {midheavenLongitude ? `${midheavenLongitude.toFixed(2)}°` : '❌'}
         <br />
         <strong>Show Aspects:</strong> {showAspects ? '✅' : '❌'} | <strong>Estado aspectos:</strong> {aspects.length > 0 ? `✅ ${aspects.length} listos` : '❌ Sin aspectos'}
       </div>
     )}
     
     <svg 
       width={width} 
       height={height} 
       className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-2xl border border-purple-200/50"
       style={{
         filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.15))'
       }}
     >
       <defs>
         <radialGradient id="fireGradient" cx="50%" cy="50%" r="50%">
           <stop offset="0%" stopColor="#FFE0B2" />
           <stop offset="100%" stopColor="#FF5722" />
         </radialGradient>
         <radialGradient id="earthGradient" cx="50%" cy="50%" r="50%">
           <stop offset="0%" stopColor="#E8F5E8" />
           <stop offset="100%" stopColor="#4CAF50" />
         </radialGradient>
         <radialGradient id="airGradient" cx="50%" cy="50%" r="50%">
           <stop offset="0%" stopColor="#E3F2FD" />
           <stop offset="100%" stopColor="#2196F3" />
         </radialGradient>
         <radialGradient id="waterGradient" cx="50%" cy="50%" r="50%">
           <stop offset="0%" stopColor="#F3E5F5" />
           <stop offset="100%" stopColor="#9C27B0" />
         </radialGradient>
         <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
           <stop offset="0%" stopColor="#FFFFFF" />
           <stop offset="70%" stopColor="#F8F9FA" />
           <stop offset="100%" stopColor="#E9ECEF" />
         </radialGradient>
       </defs>

       {/* Círculos base */}
       <circle
         cx={centerX}
         cy={centerY}
         r={outerRadius + 20}
         fill="url(#centerGradient)"
         opacity="0.3"
       />
       
       <circle
         cx={centerX}
         cy={centerY}
         r={outerRadius}
         fill="none"
         stroke="url(#fireGradient)"
         strokeWidth="3"
         opacity="0.8"
       />
       
       <circle
         cx={centerX}
         cy={centerY}
         r={middleRadius}
         fill="none"
         stroke="#718096"
         strokeWidth="1"
         strokeDasharray="4 4"
         opacity="0.6"
       />
       
       <circle
         cx={centerX}
         cy={centerY}
         r={innerRadius}
         fill="rgba(255,255,255,0.1)"
         stroke="#A0AEC0"
         strokeWidth="2"
         opacity="0.8"
       />
       
       {/* Marcadores de grados */}
       {renderDegreeMarkers()}
       
       {/* Líneas zodiacales */}
       {zodiacSymbols.map((_, index) => {
         const innerPos = getPositionFromLongitude(index * 30, innerRadius);
         const outerPos = getPositionFromLongitude(index * 30, outerRadius);
         
         return (
           <line
             key={`zodiac-line-${index}`}
             x1={innerPos.x}
             y1={innerPos.y}
             x2={outerPos.x}
             y2={outerPos.y}
             stroke="#CBD5E0"
             strokeWidth="1.5"
          opacity="0.7"
           />
         );
       })}
       
       {/* Símbolos zodiacales */}
       {renderZodiacSigns()}
       
       {/* Líneas de casas */}
       {renderHouseLines()}
       
       {/* Números de casas */}
       {renderHouseNumbers()}
       
       {/* ASPECTOS - RENDERIZAR PRIMERO (DETRÁS DE LOS PLANETAS) */}
       {renderAspectLines()}
       
       {/* Planetas - ENCIMA DE LOS ASPECTOS */}
       {renderPlanets()}
       
       {/* Ascendente */}
       {renderAscendant()}
       
       {/* Medio Cielo */}
       {renderMidheaven()}
       
       {/* Centro */}
       <circle
         cx={centerX}
         cy={centerY}
         r="6"
         fill="url(#centerGradient)"
         stroke="#4A5568"
         strokeWidth="2"
       />
     </svg>
     
     {/* Panel de información mejorado */}
     <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200/50 max-w-4xl">
       <h3 className="font-bold mb-4 text-gray-800 text-center">Información de la Carta Natal</h3>
       
       {/* Información del planeta seleccionado */}
       {hoveredPlanet && (
         <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
           <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
             <span className="mr-2">{planetSymbols[hoveredPlanet]?.symbol || ''}</span>
             {hoveredPlanet}
           </h4>
           {(() => {
             const planet = planets.find(p => p.name === hoveredPlanet);
             if (planet) {
               return (
                 <div className="text-sm text-blue-700 grid grid-cols-2 gap-4">
                   <div>
                     <p><strong>Signo:</strong> {planet.sign}</p>
                     <p><strong>Longitud:</strong> {planet.longitude.toFixed(2)}°</p>
                   </div>
                   <div>
                     {planet.isRetrograde && <p><strong>Estado:</strong> <span className="text-red-600">Retrógrado ℞</span></p>}
                     <p><strong>Elemento:</strong> {
                       ['Aries', 'Leo', 'Sagitario'].includes(planet.sign) ? '🔥 Fuego' :
                       ['Tauro', 'Virgo', 'Capricornio'].includes(planet.sign) ? '🌍 Tierra' :
                       ['Géminis', 'Libra', 'Acuario'].includes(planet.sign) ? '💨 Aire' :
                       '💧 Agua'
                     }</p>
                   </div>
                 </div>
               );
             }
             return null;
           })()}
         </div>
       )}
       
       {/* Información del aspecto hovereado */}
       {hoveredAspect && (
         <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
           <h4 className="font-semibold text-purple-800 mb-2">
             Aspecto: {hoveredAspect.split('-')[2].toUpperCase()}
           </h4>
           <p className="text-sm text-purple-700">
             <strong>Entre:</strong> {hoveredAspect.split('-')[0]} y {hoveredAspect.split('-')[1]}
           </p>
           <p className="text-xs text-purple-600 mt-1">
             {
               hoveredAspect.includes('conjunction') ? 'Unión y fusión de energías planetarias' :
               hoveredAspect.includes('opposition') ? 'Tensión y polaridad que requiere equilibrio' :
               hoveredAspect.includes('trine') ? 'Flujo armonioso y talento natural' :
               hoveredAspect.includes('square') ? 'Desafío y motivación para el crecimiento' :
               hoveredAspect.includes('sextile') ? 'Oportunidad y cooperación fácil' :
               'Ajuste y reorientación necesaria'
             }
           </p>
         </div>
       )}
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Elementos */}
         <div>
           <h4 className="font-semibold mb-3 text-gray-700">Elementos</h4>
           <div className="space-y-2 text-sm">
             <div className="flex items-center">
               <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.fire.gradient }}></div>
               <span>Fuego (♈♌♐)</span>
             </div>
             <div className="flex items-center">
               <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.earth.gradient }}></div>
               <span>Tierra (♉♍♑)</span>
             </div>
             <div className="flex items-center">
               <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.air.gradient }}></div>
               <span>Aire (♊♎♒)</span>
             </div>
             <div className="flex items-center">
               <div className="w-4 h-4 rounded mr-3" style={{ background: elementColors.water.gradient }}></div>
               <span>Agua (♋♏♓)</span>
             </div>
           </div>
         </div>
         
         {/* Aspectos */}
         <div>
           <h4 className="font-semibold mb-3 text-gray-700">Aspectos ({aspects.length})</h4>
           <div className="space-y-2 text-sm">
             {Object.entries(aspectStyles).map(([aspect, style]) => (
               <div key={aspect} className="flex items-center">
                 <div 
                   className="w-6 h-1 mr-3 rounded"
                   style={{ 
                     backgroundColor: style.color,
                     height: `${style.width}px`,
                     opacity: style.opacity
                   }}
                 ></div>
                 <span className="capitalize">{aspect}</span>
               </div>
             ))}
           </div>
         </div>
         
         {/* Controles */}
         <div>
           <h4 className="font-semibold mb-3 text-gray-700">Símbolos y Controles</h4>
           <div className="space-y-2 text-xs">
             <p><strong className="text-yellow-600">AC:</strong> Ascendente {ascendantLongitude ? `(${ascendantLongitude.toFixed(1)}°)` : ''}</p>
             <p><strong className="text-pink-600">MC:</strong> Medio Cielo {midheavenLongitude ? `(${midheavenLongitude.toFixed(1)}°)` : ''}</p>
             <p><strong className="text-red-600">℞:</strong> Retrogradación</p>
             <p><strong>Círculos:</strong> Casas astrológicas (1-12)</p>
             <p><strong>Líneas punteadas:</strong> Divisiones de casas</p>
             <p><strong>Hover:</strong> Pasa cursor sobre planetas/aspectos</p>
           </div>
         </div>
       </div>
       
       {/* Estadísticas */}
       <div className="mt-6 pt-4 border-t border-gray-200">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
           <div className="bg-gray-50 p-3 rounded-lg">
             <div className="font-bold text-gray-800">{planets.length}</div>
             <div className="text-gray-600">Planetas</div>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg">
             <div className="font-bold text-gray-800">{houses.length}</div>
             <div className="text-gray-600">Casas</div>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg">
             <div className="font-bold text-gray-800">{aspects.length}</div>
             <div className="text-gray-600">Aspectos</div>
           </div>
           <div className="bg-gray-50 p-3 rounded-lg">
             <div className="font-bold text-gray-800">{planets.filter(p => p.isRetrograde).length}</div>
             <div className="text-gray-600">Retrógrados</div>
           </div>
         </div>
       </div>
       
       {/* Botones de acción */}
       <div className="mt-6 pt-4 border-t border-gray-200">
         <div className="flex justify-center space-x-4 text-sm">
           <button 
             onClick={() => {
               setHoveredPlanet(null);
               setHoveredAspect(null);
             }}
             className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
           >
             Limpiar selección
           </button>
           <div className="flex items-center text-gray-600">
             <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
             Carta natal activa e interactiva
           </div>
         </div>
       </div>
     </div>

     {/* Debug extendido para desarrollo */}
     {process.env.NODE_ENV === 'development' && (
       <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs max-w-4xl">
         <h4 className="font-bold mb-2">🔧 Debug Técnico Extendido:</h4>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <p><strong>Configuración SVG:</strong></p>
             <p>• Tamaño: {width}x{height}</p>
             <p>• Radio externo: {outerRadius.toFixed(1)}</p>
             <p>• Radio planetas: {planetRadius.toFixed(1)}</p>
             <p>• Centro: ({centerX}, {centerY})</p>
           </div>
           <div>
             <p><strong>Estado actual:</strong></p>
             <p>• Planetas válidos: {planets.filter(p => typeof p.longitude === 'number' && !isNaN(p.longitude)).length}/{planets.length}</p>
             <p>• Casas válidas: {houses.filter(h => typeof h.longitude === 'number' && !isNaN(h.longitude)).length}/{houses.length}</p>
             <p>• Aspectos renderizables: {aspects.length}</p>
             <p>• Planeta hover: {hoveredPlanet || 'Ninguno'}</p>
             <p>• Aspecto hover: {hoveredAspect ? hoveredAspect.split('-')[2] : 'Ninguno'}</p>
           </div>
         </div>
         
         {/* Lista de aspectos para debug */}
         {aspects.length > 0 && (
           <div className="mt-4 pt-4 border-t border-gray-300">
             <p><strong>📋 Aspectos detectados:</strong></p>
             <div className="mt-2 text-xs">
               {aspects.map((aspect, i) => (
                 <span key={i} className="inline-block bg-white px-2 py-1 rounded mr-2 mb-1 border">
                   {aspect.planet1} {aspect.type} {aspect.planet2} ({aspect.orb.toFixed(1)}°)
                 </span>
               ))}
             </div>
           </div>
         )}
       </div>
     )}
   </div>
 );
};

export default NatalChartWheel;