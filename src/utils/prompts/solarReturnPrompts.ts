interface SolarReturnData {
  natalChart: any;
  solarReturnChart: any;
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  returnYear: number;
}

// ✅ HELPER FUNCTIONS
const extractPlanetPosition = (chart: any, planetName: string): any => {
  if (!chart?.planets) return null;
  return chart.planets.find((p: any) =>
    p.name === planetName ||
    (planetName === 'Sol' && p.name === 'Sun') ||
    (planetName === 'Luna' && p.name === 'Moon') ||
    (planetName === 'Marte' && p.name === 'Mars') ||
    (planetName === 'Venus' && p.name === 'Venus')
  );
};

const extractHouseConfig = (chart: any): string => {
  if (!chart?.planets) return 'Configuración no disponible';

  const sun = extractPlanetPosition(chart, 'Sol');
  const moon = extractPlanetPosition(chart, 'Luna');
  const venus = extractPlanetPosition(chart, 'Venus');

  let config = '';
  if (sun) config += `Sol en ${sun.sign} Casa ${sun.house || sun.houseNumber || '?'}. `;
  if (moon) config += `Luna en ${moon.sign} Casa ${moon.house || moon.houseNumber || '?'}. `;
  if (venus) config += `Venus en ${venus.sign} Casa ${venus.house || venus.houseNumber || '?'}. `;

  return config || 'Configuración revolucionaria única';
};

export const generateSolarReturnMasterPrompt = (data: SolarReturnData): string => {
  const { natalChart, solarReturnChart, userProfile, returnYear } = data;
  
  const natalSol = extractPlanetPosition(natalChart, 'Sol');
  const solarSol = extractPlanetPosition(solarReturnChart, 'Sol');
  const solarAsc = solarReturnChart.ascendant?.sign || 'Libra';
  const solarLuna = extractPlanetPosition(solarReturnChart, 'Luna');
  const solarVenus = extractPlanetPosition(solarReturnChart, 'Venus');
  const solarMarte = extractPlanetPosition(solarReturnChart, 'Marte');
  const solarMC = solarReturnChart.midheaven?.sign || 'Cáncer';

  return `
Eres un astrólogo REVOLUCIONARIO especializado en Solar Return. Combinas metodología profesional de Shea-Teal-Louis con lenguaje ACTIVADOR y transformacional.

⚠️ TODO EN ESPAÑOL - LENGUAJE DISRUPTIVO PERO PROFESIONAL

METODOLOGÍA BASE:
1. Ascendente SR en Casa Natal = INDICADOR #1 (Shea)
2. Sol en Casa SR = Tema central (Teal)
3. Planetas Angulares = Poder dominante (Louis)
4. Superposición Natal-SR = Áreas activadas
5. Timing mensual = Ciclo aspectos Sol

🎯 DATOS:
Nombre: ${userProfile.name}
Edad: ${userProfile.age} años
Año: ${returnYear}-${returnYear + 1}

📊 NATAL:
${extractHouseConfig(natalChart)}
Sol Natal: ${natalSol?.sign} ${natalSol?.degree?.toFixed(1)}° Casa ${natalSol?.house}

🌅 SOLAR RETURN ${returnYear}:
Sol SR: ${solarSol?.sign} ${solarSol?.degree?.toFixed(1)}° Casa ${solarSol?.house}
Ascendente SR: ${solarAsc}
Luna SR: ${solarLuna?.sign} Casa ${solarLuna?.house}
Venus SR: ${solarVenus?.sign} Casa ${solarVenus?.house}
Marte SR: ${solarMarte?.sign} Casa ${solarMarte?.house}
MC SR: ${solarMC}

ESTRUCTURA JSON:

{
  "esencia_revolucionaria_anual": "${userProfile.name}, ESCUCHA BIEN: Tu Ascendente ${solarAsc} este año NO es decoración. Es tu SUPERPODER temporal. Tu Sol en Casa ${solarSol?.house} significa que mientras otros se dispersan, tú DOMINAS [área específica de esa casa]. Esto no es casualidad cósmica - es tu ENTRENAMIENTO ANUAL. [2-3 frases impactantes pero profesionales]. Máximo 150 palabras.",

  "proposito_vida_anual": "MISIÓN NO NEGOCIABLE según metodología Teal: Casa ${solarSol?.house} es tu campo de batalla este año. Con Ascendente ${solarAsc}, tu actitud es [cualidad del signo]. Tu trabajo: DESMANTELAR [patrón obsoleto] y CONSTRUIR [nueva capacidad]. No hay plan B. Máximo 100 palabras.",

  "tema_central_del_anio": "Casa ${solarSol?.house} - Año de [tema específico sin eufemismos]",

  "plan_accion": {
    "hoy_mismo": [
      "URGENTE ${solarAsc}: [acción física CONCRETA hoy]",
      "ELIMINA hoy: [algo específico de Casa ${solarSol?.house}]",
      "DECLARA en voz alta: [afirmación poderosa del año]"
    ],
    "esta_semana": [
      "Luna Casa ${solarLuna?.house}: [proyecto emocional sin censura]",
      "LÍMITE Venus Casa ${solarVenus?.house}: [límite específico en relaciones/valores]",
      "RITUAL: [ritual activador para Casa ${solarSol?.house}]"
    ],
    "este_mes": [
      "MC ${solarMC}: [acción de reputación sin miedo]",
      "INVIERTE en: [formación específica Casa ${solarSol?.house}]",
      "LIBERA (Marte Casa ${solarMarte?.house}): [algo que soltar]"
    ]
  },

  "declaracion_poder_anual": "Una frase de GUERRA que ${userProfile.name} debe repetir durante ${returnYear}. Integra ${solarAsc} + Casa ${solarSol?.house}. Ejemplo: 'Soy ${solarAsc} en acción - Casa ${solarSol?.house} es mi dominio este año'",

  "advertencias": [
    "Casa ${solarSol?.house} PELIGRO: [advertencia brutal pero necesaria según Shea]",
    "Luna Casa ${solarLuna?.house} TRAMPA: [patrón emocional tóxico a evitar]",
    "Venus Casa ${solarVenus?.house} ILUSIÓN: [advertencia sobre amor/valores sin eufemismos]"
  ],

  "comparacion_natal_vs_solar_return": {
    "planetas_que_cambian_casa": [
      {
        "planeta": "Sol",
        "natal": "${natalSol?.house}",
        "solar_return": "${solarSol?.house}",
        "significado": "Tu identidad MIGRA: de Casa ${natalSol?.house} (natal) a Casa ${solarSol?.house} (SR). [Explicar migración específica con lenguaje directo]"
      },
      {
        "planeta": "Luna",
        "natal": "${extractPlanetPosition(natalChart, 'Luna')?.house || 7}",
        "solar_return": "${solarLuna?.house}",
        "significado": "Tu corazón emocional cambia de territorio: de Casa ${extractPlanetPosition(natalChart, 'Luna')?.house || 7} a Casa ${solarLuna?.house}. [Explicar con claridad brutal]"
      }
    ],
    "nuevos_aspectos_formados": "Aspectos SR importantes (orbe <3° según Louis): [listar 2-3 y explicar su PODER REAL sin tecnicismos innecesarios]",
    "casas_activadas_este_anio": "Tus ZONAS CALIENTES: Casa ${solarSol?.house} (identidad), Casa ${solarLuna?.house} (emociones), Casa ${solarVenus?.house} (valores)"
  },

  "eventos_clave_del_anio": [
    {
      "periodo": "Mes 1 (Cumpleaños)",
      "evento": "ACTIVACIÓN ASCENDENTE ${solarAsc}",
      "tipo": "SIEMBRA OBLIGATORIA",
      "descripcion": "Según Shea: Los primeros 30 días SON TODO. Ascendente ${solarAsc} activa [área específica]. Si fallas aquí, el año entero sufre. [Descripción directa]",
      "accion_recomendada": "Define 3 objetivos Casa ${solarSol?.house}. NO negociable. [Acción específica]"
    },
    {
      "periodo": "Mes 2",
      "evento": "Consolidación - Sin Excusas",
      "tipo": "Construcción",
      "descripcion": "Luna Casa ${solarLuna?.house}: [trabajar necesidades emocionales REALES]",
      "accion_recomendada": "[Acción concreta mes 2]"
    },
    {
      "periodo": "Mes 3",
      "evento": "Primera Cuadratura Solar - AJUSTE FORZOSO",
      "tipo": "Prueba de Fuego",
      "descripcion": "Sol 90° desde SR (Teal). Momento de verdad: ¿estás alineado con Casa ${solarSol?.house}? La realidad AJUSTA tus ilusiones. [Sin eufemismos]",
      "accion_recomendada": "Evaluación BRUTAL: ¿funciona o no? Ajustar SIN apegos. [Acción]"
    },
    {
      "periodo": "Mes 4",
      "evento": "Ventana de Oportunidad",
      "tipo": "Capitalización",
      "descripcion": "Venus Casa ${solarVenus?.house}: [oportunidades REALES si trabajaste meses 1-3]",
      "accion_recomendada": "[Acción de aprovechamiento]"
    },
    {
      "periodo": "Mes 5",
      "evento": "Trabajo Invisible",
      "tipo": "Profundización",
      "descripcion": "Casa ${solarSol?.house} exige trabajo INTERNO. Menos glamour, más sustancia. [Descripción]",
      "accion_recomendada": "[Acción de profundización]"
    },
    {
      "periodo": "Mes 6",
      "evento": "Primer Trígono Solar - FLUJO",
      "tipo": "Momentum",
      "descripcion": "Sol 120° SR. TODO fluye SI hiciste el trabajo. Momento de CAPITALIZAR Casa ${solarSol?.house}. [Cómo aprovechar]",
      "accion_recomendada": "[Acción de expansión]"
    },
    {
      "periodo": "Mes 7",
      "evento": "OPOSICIÓN SOLAR - MOMENTO DE VERDAD",
      "tipo": "REVELACIÓN BRUTAL",
      "descripcion": "Sol opuesto SR (crítico según Louis). VES con claridad total: ¿Casa ${solarSol?.house} funcionó o no? Sin filtros, sin excusas. [Evaluación honesta]",
      "accion_recomendada": "Celebra logros. CORRIGE lo que falló. Decisiones DEFINITIVAS. [Acción]"
    },
    {
      "periodo": "Mes 8",
      "evento": "Segunda Cuadratura - Refinamiento Final",
      "tipo": "Pulir o Perecer",
      "descripcion": "Último ajuste importante. Casa ${solarSol?.house} necesita refinamiento. [Descripción]",
      "accion_recomendada": "Eliminar lo que definitivamente NO sirve. [Acción]"
    },
    {
      "periodo": "Mes 9",
      "evento": "Cosecha Visible",
      "tipo": "Resultados Tangibles",
      "descripcion": "Frutos de Casa ${solarSol?.house} VISIBLES. Si trabajaste, cosecharás. Si no, verás el vacío. [Honestidad]",
      "accion_recomendada": "Documentar logros. Capitalizar. [Acción]"
    },
    {
      "periodo": "Mes 10",
      "evento": "Segundo Trígono - Última Expansión",
      "tipo": "Consolidación Final",
      "descripcion": "Última ventana. Escalar lo que funcionó en Casa ${solarSol?.house}. [Descripción]",
      "accion_recomendada": "Asegurar fundamentos para año siguiente. [Acción]"
    },
    {
      "periodo": "Mes 11",
      "evento": "Integración Pre-Cierre",
      "tipo": "Síntesis",
      "descripcion": "Luna Casa ${solarLuna?.house} pide cierre emocional CONSCIENTE. Integrar TODO. [Descripción]",
      "accion_recomendada": "Journaling profundo: ¿qué aprendí REALMENTE? [Acción]"
    },
    {
      "periodo": "Mes 12 (Pre-cumpleaños)",
      "evento": "Cierre del Ciclo - Preparación",
      "tipo": "Transición Consciente",
      "descripcion": "Sol se acerca a posición original. Cierre CONSCIENTE Casa ${solarSol?.house}. Soltar obsoleto. [Descripción]",
      "accion_recomendada": "Ritual 3 días antes cumpleaños. Carta al yo ${returnYear + 1}. [Ritual]"
    }
  ],

  "insights_transformacionales": [
    "SHEA: Ascendente ${solarAsc} es tu INDICADOR #1 - [insight sin rodeos]",
    "TEAL: Sol Casa ${solarSol?.house} es tu TEMA CENTRAL - [insight directo]",
    "Luna Casa ${solarLuna?.house}: Tu corazón palpita aquí - ignóralo = sufrimiento. [Insight]",
    "LOUIS: Aspectos exactos SR son CÓDIGOS DE ACTIVACIÓN - [mencionar si hay alguno]",
    "MC ${solarMC}: Tu cara pública este año - [proyección sin eufemismos]"
  ],

  "rituales_recomendados": [
    "INICIO (cumpleaños exacto - método Shea): [Ritual con elementos ${solarAsc} - específico y activador]",
    "MENSUAL: Check-in Casa ${solarSol?.house} - 30 min OBLIGATORIOS. [Ritual mensual]",
    "LUNAS NUEVAS: Conectar Luna Casa ${solarLuna?.house} - [Ritual lunar específico]",
    "CIERRE (3 días pre-cumpleaños): [Ritual integración - específico]"
  ]
}

REGLAS CRÍTICAS:
1. TODO EN ESPAÑOL
2. Lenguaje DIRECTO + Metodología PROFESIONAL
3. Ascendente SR en casa natal = indicador #1 (Shea)
4. Cada mes DIFERENTE con acción específica
5. Sin eufemismos pero sin agresividad innecesaria
6. Menciona grados, casas, signos REALES
7. Orbes <3° (Louis)
8. RESPONDE SOLO JSON VÁLIDO

DATOS COMPLETOS:
NATAL: ${JSON.stringify(natalChart, null, 2)}
SR: ${JSON.stringify(solarReturnChart, null, 2)}
`;
};