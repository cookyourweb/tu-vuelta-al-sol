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
  const { userName, userAge, planetName, natalChart, solarReturn } = data;

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

**Duración:**
Todo el año solar (hasta el próximo cumpleaños de ${userName})

**Lo que esto significa:**
- Qué área de vida se activa este año con ${planetName.toLowerCase()}
- Qué te pide el universo este año en relación a ${planetName.toLowerCase()}
- Cómo cambia tu expresión natural de ${planetName.toLowerCase()}

---

## 📋 ESTRUCTURA JSON REQUERIDA

Responde ÚNICAMENTE con JSON válido en español (sin markdown, sin backticks, sin comentarios).

**IMPORTANTE:**
- Esta es una ficha para agenda física
- Lenguaje directo, no explica astrología
- Aplicable a la vida diaria
- Explica cómo este planeta MODULA cada tipo de evento del año

{
  "planeta": "${planetName}",
  "simbolo": "${planetSymbol}",

  "quien_eres_natal": {
    "posicion_completa": "${planetName} en ${natalSign} Casa ${natalHouse}",
    "caracteristicas": [
      "String: Característica 1 de cómo expresas ${planetName.toLowerCase()} naturalmente",
      "String: Característica 2",
      "String: Característica 3"
    ],
    "superpoder_natal": "String de 1-2 frases: Tu fortaleza natural con ${planetName.toLowerCase()}"
  },

  "transito_activo_este_anio": {
    "posicion_completa": "${planetName} en ${srSign} Casa ${srHouse}",
    "duracion": "Todo el año solar (hasta tu próximo cumpleaños)",
    "que_pide": [
      "String: Qué pide este tránsito en 1 frase",
      "String: Cómo cambia respecto al natal",
      "String: Qué área de vida activa"
    ]
  },

  "cruce_natal_mas_transito": {
    "tu_natal": "String de 2-3 frases: Resumen de cómo eres naturalmente con ${planetName.toLowerCase()} (${natalSign} Casa ${natalHouse})",
    "este_anio": "String de 2-3 frases: Qué pide ${planetName.toLowerCase()} este año (${srSign} Casa ${srHouse})",
    "el_conflicto": "String de 2-3 frases: Tensión entre tu naturaleza y lo que pide el año. Ejemplo: 'Tu naturaleza quiere X, pero este año el universo te pide Y.'",
    "la_solucion": "String de 2-3 frases: Cómo integrar ambos. Ejemplo: 'Construir en silencio (natal), mostrar con estrategia (SR).'"
  },

  "reglas_del_anio": [
    "String: Regla 1 para este año con ${planetName.toLowerCase()}. Ejemplo: 'Mejor constancia que impulso'",
    "String: Regla 2",
    "String: Regla 3"
  ],

  "como_afecta_a_eventos": {
    "lunas_nuevas": "String de 2-3 frases: Cómo este tránsito de ${planetName.toLowerCase()} modula las Lunas Nuevas del año. Ejemplo: 'Esa Luna te pedirá sembrar algo VISIBLE. Tu ${planetName.toLowerCase()} natal en ${natalSign} querrá hacerlo en privado. El ${planetName.toLowerCase()} del año te dirá: Siembra, pero que se note.'",

    "lunas_llenas": "String de 2-3 frases: Cómo este tránsito modula las Lunas Llenas del año",

    "retrogradaciones": "String de 2-3 frases: Cómo este tránsito modula las retrogradaciones del año",

    "eclipses": "String de 2-3 frases: Cómo este tránsito modula los eclipses del año"
  },

  "sombra_a_evitar": [
    "String: Sombra 1 de este tránsito. Ejemplo: 'Sobreexponerte por obligación (${srSign} forzado)'",
    "String: Sombra 2. Ejemplo: 'Esconderte por comodidad (${natalSign} cómodo)'",
    "String: Sombra 3"
  ],

  "ejercicio_anual": {
    "titulo": "String: Título del ejercicio. Ejemplo: 'Ejercicio mensual con ${planetName.toLowerCase()}'",
    "descripcion": "String de 3-5 frases: Ejercicio que se repite durante el año",
    "preguntas": [
      "String: Pregunta 1 mensual relacionada con ${natalSign}",
      "String: Pregunta 2 mensual relacionada con ${srSign}",
      "String: Pregunta 3 mensual que integra ambos"
    ]
  },

  "apoyo_fisico": [
    {
      "tipo": "🕯️ Vela",
      "elemento": "String: Color/tipo de vela apropiada para ${planetName.toLowerCase()}",
      "proposito": "String: Para qué sirve"
    },
    {
      "tipo": "🪨 Piedra",
      "elemento": "String: Piedra apropiada para ${planetName.toLowerCase()}",
      "proposito": "String: Para qué sirve"
    },
    {
      "tipo": "🧘 Práctica",
      "elemento": "String: Ejercicio físico/espiritual apropiado",
      "proposito": "String: Para qué sirve"
    }
  ],

  "frase_ancla_del_anio": "String de 8-15 palabras: Frase memorable para todo el año con ${planetName.toLowerCase()}. Ejemplo: 'Este año, mi ${natalSign.toLowerCase()} [característica] se expresa en ${srSign.toLowerCase()} [modo]'"
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS

1. **USA EL NOMBRE** ${userName} varias veces
2. **SÉ ESPECÍFICO** con las posiciones: ${natalSign} Casa ${natalHouse} vs ${srSign} Casa ${srHouse}
3. **EXPLICA EL CONFLICTO** entre natal y SR de forma clara
4. **CONECTA CON EVENTOS** - Explica cómo este tránsito largo MODULA cada tipo de evento
5. **LENGUAJE DIRECTO** - No expliques astrología, traduce a acción
6. **TONO COACH** - Como si fueras su guía personal del año
7. **APLICABLE** - Cada sección debe ser usable en la vida diaria
8. **JSON VÁLIDO** - Sin comentarios, sin markdown, cierra todas las llaves

---

## 🚫 LO QUE NO DEBES HACER

- ❌ No uses tecnicismos astrológicos sin traducir
- ❌ No seas genérico ("este año puede ser...")
- ❌ No olvides explicar cómo modula CADA tipo de evento
- ❌ No inventes posiciones planetarias
- ❌ No uses lenguaje abstracto

---

## ✅ CHECKLIST ANTES DE RESPONDER

□ ¿Mencioné el nombre ${userName}?
□ ¿Usé las posiciones reales (${natalSign} Casa ${natalHouse} natal, ${srSign} Casa ${srHouse} SR)?
□ ¿Expliqué el conflicto entre natal y SR?
□ ¿Expliqué cómo modula Lunas Nuevas, Llenas, Retrogradaciones y Eclipses?
□ ¿Di ejercicio concreto que se repite todo el año?
□ ¿La frase ancla es memorable?
□ ¿El JSON es válido?
□ ¿Esto es aplicable a la vida diaria de ${userName}?

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
