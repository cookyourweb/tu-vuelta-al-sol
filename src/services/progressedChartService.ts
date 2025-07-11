// 4. 🚨 CORRECCIÓN CRÍTICA: Usar token en HEADER, no en URL
const url = new URL(\`\${PROKERALA_API_BASE_URL}/astrology/progression-chart\`);

// ✅ Parámetros con formato correcto (profile[] para datetime y coordinates)
const params = {
  'profile[datetime]': formattedDateTime,
  'profile[coordinates]': coordinates,
  'profile[birth_time_unknown]': 'false',
  'progression_year': progressionYear.toString(),
  'current_coordinates': coordinates,
  'house_system': options.houseSystem || 'placidus',
  'orb': 'default',
  'birth_time_rectification': options.birthTimeRectification || 'flat-chart',
  'aspect_filter': options.aspectFilter || 'all',
  'la': options.language || 'es',
  'ayanamsa': options.ayanamsa || '0'
};

// Agregar parámetros a la URL
Object.entries(params).forEach(([key, value]) => {
  url.searchParams.append(key, value);
});

console.log('📡 Parámetros carta progresada CORREGIDOS:', params);
console.log('🌐 URL completa carta progresada CORREGIDA:', url.toString());

// 4. 🚨 CORRECCIÓN CRÍTICA: Usar token en HEADER, no en URL
const res = await axios.get(url.toString(), {
  headers: {
    'Authorization': \`Bearer \${token}\`,  // ✅ Token en header
    'Accept': 'application/json'
  }
});

console.log('✅ Carta progresada obtenida exitosamente');

// 5. Procesar y formatear la respuesta
return processProgressedChartData(res.data, {
  latitude,
  longitude,
  timezone,
  progressionYear,
  birthDate,
  birthTime
});
