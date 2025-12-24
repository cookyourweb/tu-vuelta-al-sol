// =============================================================================
// 🌟 SOLAR RETURN PROMPT - VERSIÓN SUTIL Y PROFESIONAL
// Basado en metodología Shea + Teal + Louis
// Tono: Equilibrado, profesional, personalización discreta
// =============================================================================

export function generateSolarReturnProfessionalPrompt(data: {
  natalChart: any;
  solarReturnChart: any;
  userProfile: any;
  returnYear: number;
  srComparison?: any;
}): string {
  const { natalChart, solarReturnChart, userProfile, returnYear, srComparison } = data;

  // ✅ EXTRAER DATOS CLAVE
  const natalSol = natalChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const natalLuna = natalChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const natalAsc = natalChart.ascendant;

  const srSol = solarReturnChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const srLuna = solarReturnChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const srAsc = solarReturnChart.ascendant;
  const srMC = solarReturnChart.midheaven;

  // ✅ CALCULAR ASC SR EN CASA NATAL (INDICADOR #1 SHEA)
  const ascSRenCasaNatal = calculateHousePosition(srAsc?.longitude, natalChart.houses);

  // ✅ IDENTIFICAR PLANETAS ANGULARES SR
  const planetasAngularesSR = identificarPlanetasAngulares(solarReturnChart);

  // ✅ DETECTAR STELLIUMS
  const stelliumsSR = detectarStelliums(solarReturnChart);

  // ✅ EXTRAER COMPARACIÓN SR
  const srComparisonData = data.srComparison || {};

  // ✅ OBTENER PRIMER NOMBRE (sin apellidos, más sutil)
  const primerNombre = userProfile.name?.split(' ')[0] || 'Usuario';

  return `
# 🌟 ASTRÓLOGO PROFESIONAL - SOLAR RETURN (RETORNO SOLAR)

## 📚 METODOLOGÍA PROFESIONAL:

Sigues ESTRICTAMENTE la metodología de:
- **Mary Fortier Shea** (The Progressed Horoscope) - ASC SR en Casa Natal
- **Celeste Teal** (Predicting Events with Astrology) - Sol en Casa SR
- **Anthony Louis** (Horary Astrology) - Planetas Angulares

---

## 🎯 PRINCIPIOS FUNDAMENTALES:

### QUÉ ES SOLAR RETURN:
- Carta astral para el momento EXACTO en que el Sol regresa a su posición natal cada año
- El Sol SIEMPRE está en la misma posición zodiacal que en la carta natal
- Fotografía de energías disponibles para los próximos 12 meses
- Las casas se recalculan completamente para el año solar

### METODOLOGÍA DE ANÁLISIS (ORDEN DE IMPORTANCIA):

#### 🔥 PASO 1: ASC SOLAR RETURN EN CASA NATAL (Shea - Indicador #1)
**EL MÁS IMPORTANTE:**

El Ascendente del Solar Return ${srAsc?.sign} cae en **Casa ${ascSRenCasaNatal} de la carta natal**.

**Significado:**
- Marca el TEMA CENTRAL del año
- El área de vida que dominará los próximos 12 meses
- Define enfoque principal y prioridades del ciclo anual

#### 🔥 PASO 2: SOL EN CASA SOLAR RETURN (Teal - Centro Vital)
El Sol en el Solar Return está en **Casa ${srSol?.house} del SR**.

**Significado:**
- Área de vida donde se pone la ENERGÍA VITAL este año
- Centro de atención y desarrollo personal
- Donde se sentirá más vivo/a y con propósito

Comparar con Sol natal en Casa ${natalSol?.house}.

#### 🔥 PASO 3: PLANETAS ANGULARES SR (Louis - Dominantes del Año)
${planetasAngularesSR.length > 0 ? planetasAngularesSR.map(p => `
- **${p.planeta}** en ${p.angulo} SR (Casa ${p.casa})
`).join('\n') : '- No hay planetas angulares prominentes'}

Los planetas angulares (ASC, IC, DESC, MC del SR) serán IMPOSIBLES de ignorar este año.

---

## 📊 DATOS TÉCNICOS:

### PERFIL:
- Edad: ${userProfile.age} años
- Año Solar Return: ${returnYear}-${returnYear + 1}
- Naturaleza natal base: Sol ${natalSol?.sign}, Luna ${natalLuna?.sign}, Ascendente ${natalAsc?.sign}

### CARTA NATAL (Esencia Base):
- **Sol:** ${natalSol?.sign} Casa ${natalSol?.house}
- **Luna:** ${natalLuna?.sign} Casa ${natalLuna?.house}
- **Ascendente:** ${natalAsc?.sign}

**Planetas Natales:**
${natalChart.planets?.map((p: any) => `
- ${p.name}: ${p.sign} Casa ${p.house || 'N/A'}
`).join('\n')}

### SOLAR RETURN ${returnYear}-${returnYear + 1}:
- **Sol SR:** ${srSol?.sign} Casa ${srSol?.house} SR
- **Luna SR:** ${srLuna?.sign} Casa ${srLuna?.house} SR
- **Ascendente SR:** ${srAsc?.sign}
- **MC SR:** ${srMC?.sign}

**✨ DATO CRÍTICO:** ASC SR ${srAsc?.sign} cae en **Casa ${ascSRenCasaNatal} natal**

**Planetas Solar Return:**
${solarReturnChart.planets?.map((p: any) => `
- ${p.name}: ${p.sign} Casa ${p.house || 'N/A'} SR
`).join('\n')}

---

## 🎯 ESTRUCTURA JSON REQUERIDA:

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin backticks):

\`\`\`json
{
  "apertura_del_anio": {
    "anio_solar": "${returnYear}-${returnYear + 1}",
    "tema_central": "Una frase de 10-15 palabras. Ejemplo: 'Este es un año para aprender a [VERBO] sin perder [SUSTANTIVO]'",
    "clima_general": "150-200 palabras. Describe: ritmo del año, intensidad emocional, sensación interna, tipo de decisiones que se repiten. Lenguaje humano, reconocible, sin tecnicismos.",
    "conexion_con_esencia_natal": "80-100 palabras. 'Para una persona con una naturaleza como la tuya —[describir esencia: mental/emocional/práctica], [cualidad 2], [cualidad 3]— este año no viene a [ACCIÓN PASIVA]: viene a [ACCIÓN ACTIVA].'"
  },

  "como_se_vive_este_anio_siendo_tu": {
    "facil_para_ti": "60-80 palabras. Qué te resulta más natural este año según tu carta natal.",
    "incomodo_especialmente": "60-80 palabras. Qué te desafía más este año.",
    "reflejos_automaticos_obsoletos": "50-70 palabras. Qué patrones automáticos ya no funcionan.",
    "actitud_nueva_necesaria": "60-80 palabras. Qué actitud nueva necesitas entrenar."
  },

  "planetas_clave_del_anio": [
    {
      "planeta": "Nombre del planeta (ej: Saturno)",
      "signo": "Signo zodiacal",
      "casa_sr": "Casa SR (número)",
      "area_vida": "Nombre del área de vida (ej: 'creatividad y expresión personal')",
      "titulo_seccion": "Frase corta (ej: '♄ Saturno en Géminis en Casa 5 → Tu karma y responsabilidades este año')",
      "analisis": "200-250 palabras. Texto corrido que incluya: qué se activa, dónde se nota en lo cotidiano, qué aprendizaje insiste, cómo choca con tu forma natural de ser, riesgo si reaccionas en automático, oportunidad si actúas con consciencia.",
      "frase_clave": "Una frase memorable y reutilizable para la agenda. Ejemplo: 'Este año, expresar lo que piensas deja de ser opcional.'"
    }
    // Incluir solo 3-5 planetas MÁS IMPORTANTES del año
  ],

  "dinamica_evolutiva": {
    "titulo": "La Dinámica del Año",
    "analisis": "200-250 palabras. Texto continuo sin tecnicismos que explique: hacia dónde te empuja el año, de qué comodidad te saca, qué versión tuya está quedando obsoleta, cuál quiere entrenarse. SIN subtítulos internos."
  },

  "linea_tiempo_anual": {
    "inicio_del_anio": "100 palabras. Qué se activa, qué observar en los primeros 30 días post-cumpleaños.",
    "primer_desafio_mes_3_4": "80 palabras. Qué se pone a prueba en meses 3-4.",
    "punto_medio_mes_6_7": "80 palabras. Qué ya no puedes ignorar en mes 6-7.",
    "cosecha_mes_9_10": "80 palabras. Qué se vuelve visible en mes 9-10.",
    "cierre_mes_12": "80 palabras. Qué integrar y soltar al finalizar el ciclo.",
    "nota": "⚠️ IMPORTANTE: Esto NO es calendario. Son PROCESOS. La agenda luego lo traduce a días y eventos reales."
  },

  "sombras_del_anio": [
    "Reacción automática probable 1 (15-20 palabras)",
    "Reacción automática probable 2",
    "Reacción automática probable 3"
    // Sin juicio. Para reconocimiento consciente.
  ],

  "claves_integracion": [
    "Enfoque clave 1 (10-15 palabras, reutilizable en agenda)",
    "Recordatorio clave 2",
    "Ancla mental 3"
  ],

  "analisis_tecnico_profesional": {
    "asc_sr_en_casa_natal": {
      "casa_natal": ${ascSRenCasaNatal},
      "signo_asc_sr": "${srAsc?.sign}",
      "significado": "150-200 palabras. METODOLOGÍA SHEA. Explica POR QUÉ esta casa marca el tema del año. Cómo se manifestará la energía de ${srAsc?.sign} en esta área de vida. Qué cambios de identidad/presentación se esperan.",
      "area_vida_dominante": "Nombre del área de vida (ej: 'identidad personal y presencia')"
    },
    "sol_en_casa_sr": {
      "casa_sr": ${srSol?.house},
      "casa_natal_sol": ${natalSol?.house},
      "significado": "100-120 palabras. METODOLOGÍA TEAL. Centro vital del año. Comparar con Sol natal. ¿Cambió de casa o es la misma? ¿Qué implica?"
    },
    "planetas_angulares_sr": [
      ${planetasAngularesSR.map(p => `{
        "planeta": "${p.planeta}",
        "angulo": "${p.angulo}",
        "casa": "${p.casa}",
        "interpretacion": "80-100 palabras. METODOLOGÍA LOUIS. Por qué este planeta dominará el año."
      }`).join(',\n      ')}
    ],
    "configuraciones_especiales": [
      {
        "tipo": "Tipo de configuración (ej: 'Stellium en Casa 7')",
        "planetas_involucrados": ["Planeta1", "Planeta2"],
        "significado": "80 palabras. Qué implica esta configuración para el año."
      }
    ]
  },

  "angulos_vitales": {
    "ascendente": {
      "posicion": "${srAsc?.sign} en Casa ${ascSRenCasaNatal} natal",
      "mascara_social": "60-80 palabras. Cómo te presentas al mundo este año. Nueva imagen o identidad emergente.",
      "superpoder": "40-60 palabras. Capacidad que se activa este año para atraer lo que necesitas."
    },
    "medio_cielo": {
      "posicion": "${srMC?.sign}",
      "vocacion_soul": "60-80 palabras. Vocación o contribución que quiere emerger este año.",
      "legado": "40-60 palabras. Qué construyes para tu legado este año."
    }
  },

  "cierre_retorno_solar": "100-120 palabras. Sin tecnicismos. Mensaje final que recuerde: 'Este Retorno Solar no viene a decirte qué pasará. Viene a mostrarte cómo responder. El año te ofrece escenarios; tú eliges el personaje. La consciencia convierte cualquier tránsito en evolución.'",

  "pregunta_final_reflexion": "Una pregunta poderosa (15-25 palabras) para que la persona reflexione durante el año. Ejemplo: '¿Qué versión de ti quiere emerger este año, y qué estás dispuesto/a a soltar para que suceda?'",

  "integracion_final": {
    "sintesis": "150-180 palabras. Cómo integrar TODO lo anterior en un camino coherente. Cuál es el hilo conductor del año. Lenguaje humano, sin tecnicismos.",
    "pregunta_reflexion": "Una pregunta diferente a la anterior, enfocada en la acción: '¿Qué pequeño paso puedes dar HOY que honre la dirección de este año?'"
  }
}
\`\`\`

---

## ⚠️ INSTRUCCIONES CRÍTICAS:

### TONO Y ESTILO:
1. **PROFESIONAL Y EQUILIBRADO**: Sin gritos, sin "REVOLUCIÓN", sin mayúsculas excesivas
2. **PERSONALIZACIÓN SUTIL**: Usa solo el primer nombre, NO direcciones completas
3. **LENGUAJE HUMANO**: Reconocible, cercano, sin infantilizar
4. **SIN TECNICISMOS INNECESARIOS**: Explica con claridad, no demuestres conocimiento astrológico

### CONTENIDO:
5. **USA LA METODOLOGÍA PROFESIONAL**: Sigue Shea/Teal/Louis estrictamente
6. **ASC SR EN CASA NATAL ES LA CLAVE**: Dedica más atención a esto (200 palabras mínimo)
7. **SÉ ESPECÍFICO**: Usa grados, casas, signos reales. Nada genérico
8. **ENFOCADO EN LA EXPERIENCIA**: No en predicciones, sino en cómo vivir el año

### FORMATO:
9. **JSON VÁLIDO**: Sin comentarios, sin markdown dentro del JSON
10. **TODO EN ESPAÑOL**: Incluso nombres de planetas y signos
11. **RESPETA LA ESTRUCTURA**: No añadas ni quites campos del JSON

---

## 🚫 LO QUE NO DEBES HACER:

- ❌ No uses lenguaje "DISRUPTIVO" o "REVOLUCIONARIO"
- ❌ No incluyas direcciones completas del usuario
- ❌ No uses el nombre completo repetidamente (solo primer nombre)
- ❌ No uses frases genéricas que sirvan para cualquiera
- ❌ No ignores los datos técnicos proporcionados
- ❌ No uses lenguaje vago tipo "puede que", "tal vez"
- ❌ No confundas Solar Return con Carta Progresada
- ❌ No uses mayúsculas excesivas o lenguaje agresivo

---

## ✅ CHECKLIST ANTES DE RESPONDER:

□ ¿Analicé ASC SR en Casa Natal con 200 palabras?
□ ¿Identifiqué planetas angulares SR?
□ ¿El tono es profesional y equilibrado?
□ ¿La personalización es sutil (solo primer nombre)?
□ ¿El JSON es válido?
□ ¿Todo está en español?
□ ¿El lenguaje es humano y reconocible?
□ ¿No hay tecnicismos innecesarios?

**AHORA GENERA LA INTERPRETACIÓN PROFESIONAL.**
`;
}

// ✅ FUNCIONES AUXILIARES (mantener las mismas del prompt original)

function calculateHousePosition(longitude: number | undefined, houses: any[]): number {
  if (!longitude || !houses || houses.length === 0) return 1;

  for (let i = 0; i < houses.length; i++) {
    const house = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];

    if (isLongitudeInHouse(longitude, house.longitude, nextHouse.longitude)) {
      return house.number;
    }
  }
  return 1;
}

function isLongitudeInHouse(long: number, cusStart: number, cusEnd: number): boolean {
  long = ((long % 360) + 360) % 360;
  cusStart = ((cusStart % 360) + 360) % 360;
  cusEnd = ((cusEnd % 360) + 360) % 360;

  if (cusStart < cusEnd) {
    return long >= cusStart && long < cusEnd;
  } else {
    return long >= cusStart || long < cusEnd;
  }
}

function identificarPlanetasAngulares(chart: any): Array<{
  planeta: string;
  angulo: string;
  casa: number;
  orbe: string;
  significado: string;
}> {
  const angulares: Array<{
    planeta: string;
    angulo: string;
    casa: number;
    orbe: string;
    significado: string;
  }> = [];

  if (!chart.planets || !chart.ascendant || !chart.midheaven) return angulares;

  const ASC = chart.ascendant.longitude;
  const IC = (chart.midheaven.longitude + 180) % 360;
  const DESC = (ASC + 180) % 360;
  const MC = chart.midheaven.longitude;

  const ORB = 8; // Orbe de 8 grados

  chart.planets.forEach((planet: any) => {
    const pLong = planet.longitude;

    // Verificar cercanía a cada ángulo
    if (Math.abs(pLong - ASC) < ORB || Math.abs(pLong - ASC) > 360 - ORB) {
      angulares.push({
        planeta: planet.name,
        angulo: 'Ascendente',
        casa: 1,
        orbe: Math.min(Math.abs(pLong - ASC), 360 - Math.abs(pLong - ASC)).toFixed(2) + '°',
        significado: 'identidad y presencia personal'
      });
    }

    if (Math.abs(pLong - IC) < ORB || Math.abs(pLong - IC) > 360 - ORB) {
      angulares.push({
        planeta: planet.name,
        angulo: 'Fondo del Cielo (IC)',
        casa: 4,
        orbe: Math.min(Math.abs(pLong - IC), 360 - Math.abs(pLong - IC)).toFixed(2) + '°',
        significado: 'raíces y hogar'
      });
    }

    if (Math.abs(pLong - DESC) < ORB || Math.abs(pLong - DESC) > 360 - ORB) {
      angulares.push({
        planeta: planet.name,
        angulo: 'Descendente',
        casa: 7,
        orbe: Math.min(Math.abs(pLong - DESC), 360 - Math.abs(pLong - DESC)).toFixed(2) + '°',
        significado: 'relaciones y asociaciones'
      });
    }

    if (Math.abs(pLong - MC) < ORB || Math.abs(pLong - MC) > 360 - ORB) {
      angulares.push({
        planeta: planet.name,
        angulo: 'Medio Cielo (MC)',
        casa: 10,
        orbe: Math.min(Math.abs(pLong - MC), 360 - Math.abs(pLong - MC)).toFixed(2) + '°',
        significado: 'vocación y logros públicos'
      });
    }
  });

  return angulares;
}

function detectarStelliums(chart: any): Array<{
  tipo: string;
  ubicacion: string;
  planetas: string[];
  significado: string;
}> {
  const stelliums: Array<{
    tipo: string;
    ubicacion: string;
    planetas: string[];
    significado: string;
  }> = [];

  if (!chart.planets) return stelliums;

  // Detectar stellium por casa (3+ planetas en la misma casa)
  const planetasPorCasa: { [key: number]: string[] } = {};

  chart.planets.forEach((planet: any) => {
    if (planet.house) {
      if (!planetasPorCasa[planet.house]) {
        planetasPorCasa[planet.house] = [];
      }
      planetasPorCasa[planet.house].push(planet.name);
    }
  });

  Object.entries(planetasPorCasa).forEach(([casa, planetas]) => {
    if (planetas.length >= 3) {
      stelliums.push({
        tipo: 'Stellium por Casa',
        ubicacion: `Casa ${casa}`,
        planetas,
        significado: `Concentración de energía en el área de vida de Casa ${casa}`
      });
    }
  });

  return stelliums;
}

function calcularAspectosCruzados(natalChart: any, srChart: any): Array<{
  planetaSR: string;
  planetaNatal: string;
  aspecto: string;
  orbe: string;
  interpretacion: string;
}> {
  // Simplificado - la implementación completa requeriría cálculo de aspectos
  return [];
}
