// =============================================================================
// 🌟 PLANETARY CARDS PROMPT - FICHAS PLANETARIAS ANUALES
// src/utils/prompts/planetaryCardsPrompt.ts
// =============================================================================
// Genera fichas de planetas activos del año que explican cómo los tránsitos
// largos (SR) modulan TODOS los eventos del calendario
// =============================================================================

export interface PlanetaryCardPromptData {
  // Usuario
  userName: string;
  userAge: number;
  userBirthPlace: string;
  birthDate: string; // Para calcular año solar

  // Planeta a analizar
  planetName: string; // 'Marte', 'Venus', 'Mercurio', etc.

  // Cartas completas
  natalChart: any;
  solarReturn: any;

  // Interpretación natal (para contexto)
  natalInterpretation?: any;
}

/**
 * Genera prompt para crear ficha planetaria anual
 *
 * La ficha explica:
 * 1. Quién eres (natal)
 * 2. Qué tránsito largo está activo este año
 * 3. Cómo ese tránsito afecta TODOS los eventos del año
 */
export function generatePlanetaryCardPrompt(data: PlanetaryCardPromptData): string {
  const { userName, userAge, planetName, natalChart, solarReturn, birthDate } = data;

  // Extraer planeta natal
  const natalPlanet = natalChart.planets?.find((p: any) =>
    p.name === planetName || p.name.toLowerCase() === planetName.toLowerCase()
  );

  // Extraer planeta del Solar Return
  const srPlanet = solarReturn?.planets?.find((p: any) =>
    p.name === planetName || p.name.toLowerCase() === planetName.toLowerCase()
  );

  const natalSign = natalPlanet?.sign || 'Desconocido';
  const natalHouse = natalPlanet?.house || 1;
  const natalDegree = natalPlanet?.degree ? Math.floor(natalPlanet.degree) : 0;

  const srSign = srPlanet?.sign || 'Desconocido';
  const srHouse = srPlanet?.house || 1;
  const srDegree = srPlanet?.degree ? Math.floor(srPlanet.degree) : 0;

  // Significado de las casas
  const natalHouseMeaning = getHouseMeaning(natalHouse);
  const srHouseMeaning = getHouseMeaning(srHouse);

  // Símbolo del planeta
  const planetSymbol = getPlanetSymbol(planetName);

  // Calcular fechas del año solar (cumpleaños a cumpleaños)
  const birthDateObj = new Date(birthDate);
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  // Cumpleaños de este año
  const currentBirthday = new Date(currentYear, birthDateObj.getMonth(), birthDateObj.getDate());
  const now = new Date();

  // Determinar el año solar actual
  let solarYearStart: Date;
  let solarYearEnd: Date;

  if (now >= currentBirthday) {
    // Ya pasó el cumpleaños este año
    solarYearStart = currentBirthday;
    solarYearEnd = new Date(nextYear, birthDateObj.getMonth(), birthDateObj.getDate());
  } else {
    // Aún no ha cumplido este año
    solarYearStart = new Date(currentYear - 1, birthDateObj.getMonth(), birthDateObj.getDate());
    solarYearEnd = currentBirthday;
  }

  // Formatear fechas en español (ej: "marzo 2025 – marzo 2026")
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const startMonth = monthNames[solarYearStart.getMonth()];
  const endMonth = monthNames[solarYearEnd.getMonth()];
  const startYear = solarYearStart.getFullYear();
  const endYear = solarYearEnd.getFullYear();

  const solarYearPeriod = `${startMonth} ${startYear} – ${endMonth} ${endYear}`;

  return `
# 🌟 ERES UN ASTRÓLOGO EVOLUTIVO ESPECIALIZADO EN TRÁNSITOS LARGOS Y AGENDA FÍSICA

## 📚 TU MISIÓN:
Crear una FICHA PLANETARIA ANUAL para ${userName} que explique cómo ${planetName} modula TODOS los eventos de su año.

**IMPORTANTE:**
- Esta ficha es un "manual de uso del año"
- NO es un evento puntual, es un CONTEXTO que dura todo el año
- Explica cómo este tránsito largo TIÑE cada Luna Nueva, cada retrogradación, cada eclipse
- Lenguaje directo, sin tecnicismos, aplicable

---

## 📊 DATOS DEL USUARIO: ${userName.toUpperCase()}

**Nombre:** ${userName}
**Edad:** ${userAge} años
**Lugar de Nacimiento:** ${data.userBirthPlace}

---

## 🧬 ${planetSymbol} ${planetName.toUpperCase()} NATAL (QUIÉN ERES)

**Posición Natal:**
${planetName} en ${natalSign} ${natalDegree}° Casa ${natalHouse}

**Significado de Casa ${natalHouse} (natal):**
${natalHouseMeaning}

**Lo que esto significa:**
- Cómo naturalmente expresas ${planetName.toLowerCase()}
- Qué necesitas de esta área de vida
- Tu patrón por defecto

---

## 🌍 ${planetSymbol} ${planetName.toUpperCase()} EN RETORNO SOLAR (QUÉ SE ACTIVA ESTE AÑO)

**Posición en Solar Return:**
${planetName} en ${srSign} ${srDegree}° Casa ${srHouse}

**Significado de Casa ${srHouse} (solar return):**
${srHouseMeaning}

**Período de activación:**
${solarYearPeriod}

**Duración:**
Todo el año solar, no es puntual. Esto NO es un evento de un día, es el CONTEXTO de todo tu año.

**Lo que esto significa:**
- Qué área de vida se activa este año con ${planetName.toLowerCase()}
- Qué te pide el universo este año en relación a ${planetName.toLowerCase()}
- Cómo cambia tu expresión natural de ${planetName.toLowerCase()}

---

## 📋 ESTRUCTURA JSON REQUERIDA

Responde ÚNICAMENTE con JSON válido en español (sin markdown, sin backticks, sin comentarios).

**IMPORTANTE - 3 CAPAS TEMPORALES:**
1. **CAPA 1 (NATAL)**: Quién eres - NO cambia nunca
2. **CAPA 2 (RETORNO SOLAR)**: Qué se activa este año - Dura todo el año (${solarYearPeriod})
3. **CAPA 3 (EVENTOS)**: Cuándo se dispara - Lunas, retros, eclipses son interruptores

**TONO Y ESTILO:**
- Lenguaje directo, sin tecnicismos
- Como coach personal del año
- Aplicable a la vida diaria
- Primero duración, luego activación, después manifestación

{
  "planeta": "${planetName}",
  "simbolo": "${planetSymbol}",

  "quien_eres_natal": {
    "titulo": "🧬 QUIÉN ERES (NATAL – permanente)",
    "posicion_completa": "${planetName} en ${natalSign} Casa ${natalHouse}",
    "caracteristicas": [
      "String: Característica 1 directa. Ejemplo: 'No reaccionas impulsivamente: construyes'",
      "String: Característica 2",
      "String: Característica 3"
    ],
    "superpoder_natal": "String de 1 frase: Tu fuerza está en..."
  },

  "que_se_activa_este_anio": {
    "titulo": "🌍 QUÉ SE ACTIVA ESTE AÑO",
    "periodo": "${solarYearPeriod}",
    "posicion_completa": "${planetName} en ${srSign} Casa ${srHouse}",
    "duracion_texto": "Todo el año solar, no es puntual",
    "introduccion": "String de 2-3 frases. Ejemplo: 'Durante todo este año, la vida te empuja a [acción]. No se trata de cambiar quién eres, sino de poner tu energía en [área].'",
    "este_anio": [
      "String: Qué activa 1. Ejemplo: 'Tu iniciativa es visible'",
      "String: Qué activa 2",
      "String: Qué activa 3. Ejemplo: 'No pasar desapercibida ya no es una opción cómoda'"
    ]
  },

  "cruce_real": {
    "titulo": "🔄 CRUCE REAL: TU BASE + EL AÑO",
    "tu_naturaleza": "String de 1-2 frases: Tu naturaleza busca ${natalHouseMeaning}",
    "este_anio_pide": "String de 1-2 frases: Este año te pide ${srHouseMeaning}",
    "el_conflicto": "String de 1-2 frases. NO es debilidad: es crecimiento.",
    "la_clave": "String de 1-2 frases. Ejemplo: 'No es exponerte sin sentido, sino mostrar tu constancia en nuevos escenarios.'"
  },

  "reglas_del_anio": {
    "titulo": "🎯 REGLAS DE ${planetName.toUpperCase()} PARA TODO EL AÑO",
    "reglas": [
      "String: Regla 1. Ejemplo: 'No esperes sentirte lista para actuar'",
      "String: Regla 2. Ejemplo: 'No escondas tu fuerza por miedo a destacar'",
      "String: Regla 3. Ejemplo: 'Tu constancia necesita escenario'"
    ],
    "entrenamiento_anual": "String de 1 frase: La [acción consciente] es tu entrenamiento anual."
  },

  "como_se_activa_segun_momento": {
    "titulo": "⏱️ CÓMO SE ACTIVA ${planetName.toUpperCase()} SEGÚN EL MOMENTO",
    "introduccion": "Aquí está la clave de tu año 👇",
    "en_lunas_nuevas": "String de 2-3 frases. Ejemplo: 'Momento para sembrar acciones nuevas relacionadas con ${srHouseMeaning}. Este año no se siembra en silencio: se siembra con intención visible.'",
    "en_lunas_llenas": "String de 2-3 frases. Ejemplo: 'Punto de revisión: ¿Cómo estás siendo percibida? ¿Te estás mostrando o conteniendo? Ajuste, no juicio.'",
    "durante_retrogradaciones": "String de 2-3 frases. Ejemplo: 'La vida te pide revisar la forma, no la decisión. Reajustar cómo te muestras también es madurez.'",
    "durante_eclipses": "String de 2-3 frases. Ejemplo: 'Cierres y saltos de identidad. Viejas imágenes de ti dejan de servir. No fuerces el cambio: acompáñalo.'"
  },

  "sombras_a_vigilar": {
    "titulo": "⚠️ SOMBRAS A VIGILAR ESTE AÑO",
    "sombras": [
      "String: Sombra 1. Ejemplo: 'Exponerte por presión externa'",
      "String: Sombra 2. Ejemplo: 'Esconderte por inseguridad'",
      "String: Sombra 3. Ejemplo: 'Postergar cambios por miedo al juicio'"
    ],
    "equilibrio": "String de 1 frase: El equilibrio está en..."
  },

  "ritmo_de_trabajo": {
    "titulo": "✨ RITMO DE TRABAJO CON ${planetName.toUpperCase()} (agenda)",
    "frecuencia": "Una vez al mes",
    "ejercicio_mensual": "String de 2-3 frases explicando el ejercicio mensual",
    "preguntas_mensuales": [
      "String: Pregunta 1 relacionada con ${natalSign}/${natalHouseMeaning}",
      "String: Pregunta 2 relacionada con ${srSign}/${srHouseMeaning}",
      "String: Pregunta 3 que integra ambos"
    ]
  },

  "apoyo_fisico": {
    "titulo": "🔮 APOYO FÍSICO (conexión tienda futura)",
    "nota": "Herramientas, no obligaciones",
    "items": [
      {
        "tipo": "🕯️ Vela",
        "elemento": "String: Color/tipo apropiado para ${planetName.toLowerCase()}",
        "proposito": "String: Para qué sirve"
      },
      {
        "tipo": "🪨 Piedra",
        "elemento": "String: Piedra apropiada",
        "proposito": "String: Para qué sirve"
      },
      {
        "tipo": "🧘 Práctica",
        "elemento": "String: Práctica breve apropiada",
        "proposito": "String: Para qué sirve (volver al cuerpo, a la presencia...)"
      }
    ]
  },

  "frase_ancla_del_anio": "String de 8-12 palabras. Ejemplo: 'Mi constancia se expresa con valentía.'"
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS

1. **CLARIDAD TEMPORAL** - Deja claro que esto dura ${solarYearPeriod}, no es un evento puntual
2. **USA EL NOMBRE** ${userName} varias veces, hazlo personal
3. **SÉ ESPECÍFICO** con las posiciones: ${natalSign} Casa ${natalHouse} vs ${srSign} Casa ${srHouse}
4. **PRIMERO DURACIÓN, LUEGO ACTIVACIÓN** - El usuario necesita entender CUÁNTO dura antes de QUÉ hace
5. **3 CAPAS CLARAS**: Natal (permanente) → Retorno Solar (todo el año) → Eventos (cuándo se dispara)
6. **CONECTA CON EVENTOS** - Explica cómo este tránsito largo TIÑE cada Luna Nueva, retrogradación, eclipse
7. **LENGUAJE DIRECTO** - No expliques astrología, traduce a acción. "La vida te empuja a..." no "Tu Marte en Casa 1..."
8. **TONO COACH PERSONAL** - Como si fueras su entrenador del año que le escribe en su agenda física
9. **APLICABLE Y MENSUAL** - El ejercicio se repite cada mes, no es de una vez
10. **JSON VÁLIDO** - Sin comentarios, sin markdown, cierra todas las llaves

---

## 🚫 LO QUE NO DEBES HACER

- ❌ No uses tecnicismos astrológicos sin traducir ("aspectos", "tránsitos", etc.)
- ❌ No seas genérico ("este año puede ser...") - Sé específico con ${userName}
- ❌ No olvides las FECHAS explícitas (${solarYearPeriod})
- ❌ No digas "llegue" o "cuando venga" - Di "En cada Luna Nueva" (directo)
- ❌ No inventes posiciones planetarias - Usa SOLO las reales
- ❌ No uses lenguaje abstracto - Cada frase debe generar una acción mental o física
- ❌ No olvides explicar cómo modula CADA tipo de evento (4 tipos)

---

## ✅ CHECKLIST ANTES DE RESPONDER

□ ¿Incluí las fechas ${solarYearPeriod} en "que_se_activa_este_anio"?
□ ¿Dejé claro que esto NO es un evento puntual sino el CONTEXTO del año?
□ ¿Mencioné el nombre ${userName} múltiples veces?
□ ¿Usé las posiciones REALES (${natalSign} Casa ${natalHouse} natal, ${srSign} Casa ${srHouse} SR)?
□ ¿Expliqué el conflicto entre natal y SR de forma clara y humana?
□ ¿Expliqué cómo modula: Lunas Nuevas, Lunas Llenas, Retrogradaciones Y Eclipses?
□ ¿El ejercicio es mensual y repetible durante todo el año?
□ ¿La frase ancla es memorable (8-12 palabras)?
□ ¿El JSON es válido y sin comentarios?
□ ¿Esto es aplicable a la vida diaria de ${userName}?
□ ¿El lenguaje es directo y sin tecnicismos?

---

**AHORA GENERA LA FICHA PLANETARIA ANUAL DE ${planetName.toUpperCase()} PARA ${userName.toUpperCase()}.**
`;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Obtiene el símbolo del planeta
 */
function getPlanetSymbol(planetName: string): string {
  const symbols: Record<string, string> = {
    'Sol': '☉',
    'Sun': '☉',
    'Luna': '☽',
    'Moon': '☽',
    'Mercurio': '☿',
    'Mercury': '☿',
    'Venus': '♀',
    'Marte': '♂',
    'Mars': '♂',
    'Júpiter': '♃',
    'Jupiter': '♃',
    'Saturno': '♄',
    'Saturn': '♄',
    'Urano': '♅',
    'Uranus': '♅',
    'Neptuno': '♆',
    'Neptune': '♆',
    'Plutón': '♇',
    'Pluto': '♇'
  };

  return symbols[planetName] || '●';
}

/**
 * Obtiene el significado de una casa
 */
function getHouseMeaning(house: number): string {
  const meanings: Record<number, string> = {
    1: 'identidad, apariencia, cómo te presentas al mundo',
    2: 'dinero, valores, recursos propios, autoestima',
    3: 'comunicación, aprendizaje, hermanos, entorno cercano',
    4: 'hogar, familia, raíces, mundo interior',
    5: 'creatividad, romance, autoexpresión, hijos, placer',
    6: 'trabajo diario, salud, rutinas, servicio',
    7: 'relaciones, pareja, asociaciones, el otro',
    8: 'transformación profunda, intimidad, recursos compartidos, muerte/renacimiento',
    9: 'filosofía, viajes largos, educación superior, búsqueda de sentido',
    10: 'carrera, reputación pública, autoridad, legado',
    11: 'amistades, comunidad, sueños, causas colectivas',
    12: 'espiritualidad, subconsciente, karma, retiro, lo oculto'
  };

  return meanings[house] || 'área de vida significativa';
}

/**
 * Determina qué planetas deben tener ficha este año
 * basado en relevancia en el Solar Return
 */
export function determineActivePlanets(solarReturn: any): string[] {
  const activePlanets: string[] = [];

  // Siempre incluir planetas personales
  activePlanets.push('Marte', 'Venus', 'Mercurio');

  // Incluir Luna si está en casa angular (1, 4, 7, 10)
  const luna = solarReturn?.planets?.find((p: any) =>
    p.name === 'Luna' || p.name === 'Moon'
  );
  if (luna && [1, 4, 7, 10].includes(luna.house)) {
    activePlanets.push('Luna');
  }

  // Incluir Júpiter si está en casa angular o hace aspecto al Sol/Luna
  const jupiter = solarReturn?.planets?.find((p: any) =>
    p.name === 'Júpiter' || p.name === 'Jupiter'
  );
  if (jupiter && [1, 4, 7, 10].includes(jupiter.house)) {
    activePlanets.push('Júpiter');
  }

  // Incluir Saturno si está en casa angular
  const saturno = solarReturn?.planets?.find((p: any) =>
    p.name === 'Saturno' || p.name === 'Saturn'
  );
  if (saturno && [1, 4, 7, 10].includes(saturno.house)) {
    activePlanets.push('Saturno');
  }

  return activePlanets;
}
