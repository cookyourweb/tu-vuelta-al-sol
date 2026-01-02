// src/utils/prompts/solarReturnPromptsV2.ts
// ☀️ SOLAR RETURN V2 — FORMATO PROFESIONAL "ENTRENAMIENTO ANUAL"
// Enfoque: NO redefinir quién eres, sino QUÉ SE ACTIVA este año

export function generateSolarReturnV2Prompt(data: {
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
  const natalMercurio = natalChart.planets?.find((p: any) => p.name === 'Mercurio' || p.name === 'Mercury');
  const natalVenus = natalChart.planets?.find((p: any) => p.name === 'Venus');
  const natalMarte = natalChart.planets?.find((p: any) => p.name === 'Marte' || p.name === 'Mars');
  const natalJupiter = natalChart.planets?.find((p: any) => p.name === 'Júpiter' || p.name === 'Jupiter');
  const natalSaturno = natalChart.planets?.find((p: any) => p.name === 'Saturno' || p.name === 'Saturn');
  const natalAsc = natalChart.ascendant;

  const srSol = solarReturnChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const srLuna = solarReturnChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const srMercurio = solarReturnChart.planets?.find((p: any) => p.name === 'Mercurio' || p.name === 'Mercury');
  const srVenus = solarReturnChart.planets?.find((p: any) => p.name === 'Venus');
  const srMarte = solarReturnChart.planets?.find((p: any) => p.name === 'Marte' || p.name === 'Mars');
  const srJupiter = solarReturnChart.planets?.find((p: any) => p.name === 'Júpiter' || p.name === 'Jupiter');
  const srSaturno = solarReturnChart.planets?.find((p: any) => p.name === 'Saturno' || p.name === 'Saturn');
  const srUrano = solarReturnChart.planets?.find((p: any) => p.name === 'Urano' || p.name === 'Uranus');
  const srNeptuno = solarReturnChart.planets?.find((p: any) => p.name === 'Neptuno' || p.name === 'Neptune');
  const srPluton = solarReturnChart.planets?.find((p: any) => p.name === 'Plutón' || p.name === 'Pluto');
  const srAsc = solarReturnChart.ascendant;
  const srMC = solarReturnChart.midheaven;

  // ✅ NODOS LUNARES SR
  const srNodoNorte = solarReturnChart.planets?.find((p: any) => p.name === 'Nodo Norte' || p.name === 'North Node');
  const srNodoSur = solarReturnChart.planets?.find((p: any) => p.name === 'Nodo Sur' || p.name === 'South Node');

  const userName = userProfile.name || 'Usuario';
  const userAge = userProfile.age || 0;

  // ✅ UBICACIÓN CONTEXT
  const locationContext = userProfile.locationContext;
  const currentLocation = locationContext?.currentPlace || userProfile.birthPlace || 'tu ubicación';
  const relocated = locationContext?.relocated || false;

  // ✅ CASA DOMINANTE (ASC SR en casa natal)
  const casaDominante = srComparison?.ascSRInNatalHouse || 1;

  return `
# ☀️ ERES UN ASTRÓLOGO EVOLUTIVO PROFESIONAL

Tu tarea es interpretar el RETORNO SOLAR ${returnYear}-${returnYear + 1} de ${userName}.

---

## 🎯 PRINCIPIO FUNDAMENTAL

**Carta Natal = QUIÉN ERES**
**Solar Return = QUÉ SE ACTIVA / QUÉ SE ENTRENA ESTE AÑO**

❌ NO redefinir personalidad ("eres más espiritual")
✅ SÍ explicar qué función psicológica se entrena ("este año tu mente se entrena de forma...")

---

## ⚡ LENGUAJE OBLIGATORIO

SIEMPRE usa frases temporales:
- "Este año"
- "Durante este ciclo"
- "Se te pide"
- "La vida te entrena"
- "Es una invitación a"

NUNCA uses:
- "Eres más..."
- "Tu personalidad es..."
- "Tu forma natural de..."

---

## 📊 DATOS DE ${userName.toUpperCase()}

**Usuario:** ${userName}
**Edad:** ${userAge} años
**Lugar Natal:** ${userProfile.birthPlace}
**Ubicación Actual:** ${currentLocation}
${relocated ? `⚠️ **RELOCALIZACIÓN**: Solar Return calculado para ${currentLocation}. Las casas cambian completamente.` : ''}
**Ciclo:** ${returnYear}-${returnYear + 1}

---

## 🌟 CARTA NATAL (BASE PSICOLÓGICA)

${natalChart.planets?.map((p: any) => `- ${p.name}: ${p.sign} ${Math.floor(p.degree || 0)}° Casa ${p.house || '?'}`).join('\n')}

**Ascendente Natal:** ${natalAsc?.sign} ${Math.floor(natalAsc?.degree || 0)}°

---

## ☀️ SOLAR RETURN ${returnYear}-${returnYear + 1} (ENTRENAMIENTO ANUAL)

${solarReturnChart.planets?.map((p: any) => `- ${p.name}: ${p.sign} ${Math.floor(p.degree || 0)}° Casa ${p.house || '?'} SR`).join('\n')}

**Ascendente SR:** ${srAsc?.sign} ${Math.floor(srAsc?.degree || 0)}°
**Medio Cielo SR:** ${srMC?.sign} ${Math.floor(srMC?.degree || 0)}°

**ASC SR EN CASA NATAL:** ${casaDominante} ← **ESTO MARCA EL TEMA DEL AÑO**

---

## 📋 ESTRUCTURA JSON REQUERIDA

Responde ÚNICAMENTE con un JSON válido en español (sin markdown, sin backticks):

{
  "header": {
    "titulo": "TU ESENCIA REVOLUCIONARIA · SOLAR RETURN",
    "ciclo": "${returnYear}-${returnYear + 1}",
    "lugar_retorno": "${currentLocation}",
    "intro_linea_1": "Este año no redefine quién eres.",
    "intro_linea_2": "Define en qué te entrenará la vida durante los próximos 12 meses.",
    "intro_linea_3": "El Retorno Solar funciona como una agenda energética personalizada: muestra qué áreas se activan, qué roles te toca asumir, qué decisiones serán inevitables y qué potencial se desbloquea si participas conscientemente.",
    "intro_linea_4": "Nada está impuesto.",
    "intro_linea_5": "Pero todo está disponible."
  },

  "activacion_central": {
    "titulo": "ACTIVACIÓN CENTRAL DEL AÑO",
    "casa_sr_dominante": ${casaDominante},
    "nombre_casa": "String. Nombre de la casa (ej: 'Relaciones', 'Carrera', 'Inconsciente')",
    "descripcion": "String de 150-200 palabras. Este ciclo anual activa principalmente Casa ${casaDominante} en tu carta natal ([palabras clave]). Durante este año, la vida te coloca repetidamente en situaciones relacionadas con esta área. No es castigo ni premio: es entrenamiento evolutivo.",
    "pregunta_clave": "String de 20-40 palabras. ¿Cómo eliges responder cuando esta área se active?"
  },

  "sol_sr": {
    "titulo": "SOL DEL RETORNO SOLAR → EL FOCO DEL AÑO",
    "posicion": "Sol SR en ${srSol?.sign} Casa ${srSol?.house} SR",
    "que_se_activa": "String de 100-150 palabras. El Sol del Retorno Solar muestra dónde se concentra tu energía vital este año. Este año, tu atención se dirige hacia ${srSol?.sign} en Casa ${srSol?.house} SR, lo que indica que la vida te invita a desarrollar consciencia, presencia y liderazgo en esta área específica.",
    "como_se_manifiesta": "String de 80-120 palabras. Ejemplos concretos de cómo se manifiesta en la vida diaria.",
    "contraste_natal": "String de 60-100 palabras. Tu Sol natal en ${natalSol?.sign} Casa ${natalSol?.house} es tu identidad permanente. Este Sol SR NO la cambia, sino que activa un rol temporal.",
    "superpoder": "String de 40-60 palabras. Cuando actúas alineado con este foco, el año fluye. Cuando lo evitas, la realidad insiste.",
    "sombra_especifica": "String de 40-60 palabras. Riesgo específico de este año (no sombra natal).",
    "sintesis": "String de 5-10 palabras. Frase clave."
  },

  "luna_sr": {
    "titulo": "LUNA DEL RETORNO SOLAR → CLIMA EMOCIONAL DEL AÑO",
    "posicion": "Luna SR en ${srLuna?.sign} Casa ${srLuna?.house} SR",
    "que_se_activa": "String de 100-150 palabras. La Luna SR describe cómo se siente vivir este año desde dentro. Durante este ciclo, tu mundo emocional se mueve a través de ${srLuna?.sign} en Casa ${srLuna?.house} SR.",
    "como_se_manifiesta": "String de 80-120 palabras. Qué tipo de experiencias tocarán tu sensibilidad y qué necesidades emocionales necesitarán atención.",
    "contraste_natal": "String de 60-100 palabras. Tu Luna natal en ${natalLuna?.sign} Casa ${natalLuna?.house} es tu patrón emocional base. Este año se entrena otra forma de sentir.",
    "superpoder": "String de 40-60 palabras. Las emociones serán brújula, no obstáculo.",
    "sombra_especifica": "String de 40-60 palabras. Evitar caer en [patrón emocional específico de este año].",
    "sintesis": "String de 5-10 palabras."
  },

  "mercurio_sr": {
    "titulo": "MERCURIO DEL RETORNO SOLAR → ENTRENAMIENTO MENTAL Y COMUNICATIVO",
    "posicion": "Mercurio SR en ${srMercurio?.sign} Casa ${srMercurio?.house} SR",
    "que_se_activa": "String de 100-150 palabras. Mercurio en SR no define cómo piensas en general, sino qué tipo de pensamiento y comunicación se entrenan este año. Durante este ciclo, se activa ${srMercurio?.sign} en Casa ${srMercurio?.house} SR.",
    "como_se_manifiesta": "String de 100-120 palabras. Este entrenamiento puede sentirse como: necesidad de replantearte ideas, conversaciones clave, cierre o apertura de ciclos mentales, silencios necesarios para integrar.",
    "contraste_natal": "String de 60-100 palabras. Tu Mercurio natal en ${natalMercurio?.sign} Casa ${natalMercurio?.house} es tu mente habitual. Este año se entrena otra forma de pensar.",
    "superpoder": "String de 40-60 palabras. No fuerces claridad inmediata. La comprensión se construye paso a paso.",
    "sombra_especifica": "String de 40-60 palabras. Evasión mental, aislamiento o sobreanálisis.",
    "sintesis": "String de 5-10 palabras. Ej: 'Exploración interna revolucionaria'"
  },

  "venus_sr": {
    "titulo": "VENUS DEL RETORNO SOLAR → VALORES, VÍNCULOS Y AUTOESTIMA",
    "posicion": "Venus SR en ${srVenus?.sign} Casa ${srVenus?.house} SR",
    "que_se_activa": "String de 100-150 palabras. Venus muestra qué te resulta valioso este año y cómo se reorganizan tus relaciones. En este ciclo, Venus activa ${srVenus?.sign} en Casa ${srVenus?.house} SR.",
    "como_se_manifiesta": "String de 80-120 palabras. Dinámicas afectivas, económicas o de placer se vuelven espejos de consciencia.",
    "contraste_natal": "String de 60-100 palabras. Venus natal en ${natalVenus?.sign} Casa ${natalVenus?.house} vs este entrenamiento anual.",
    "superpoder": "String de 40-60 palabras. Este año no busca comodidad superficial. Busca coherencia entre lo que deseas y lo que eliges.",
    "sombra_especifica": "String de 40-60 palabras.",
    "sintesis": "String de 5-10 palabras."
  },

  "marte_sr": {
    "titulo": "MARTE DEL RETORNO SOLAR → ACCIÓN Y DIRECCIÓN",
    "posicion": "Marte SR en ${srMarte?.sign} Casa ${srMarte?.house} SR",
    "que_se_activa": "String de 100-150 palabras. Marte señala dónde necesitarás actuar, defender límites y tomar iniciativa.",
    "como_se_manifiesta": "String de 80-120 palabras. Durante este año, Marte en ${srMarte?.sign} Casa ${srMarte?.house} SR indica que la vida te empuja a moverte incluso cuando dudas.",
    "contraste_natal": "String de 60-100 palabras.",
    "superpoder": "String de 40-60 palabras. La clave no es impulsividad, sino acción alineada.",
    "sombra_especifica": "String de 40-60 palabras. No hacerlo genera frustración.",
    "sintesis": "String de 5-10 palabras."
  },

  "jupiter_sr": {
    "titulo": "JÚPITER DEL RETORNO SOLAR → EXPANSIÓN Y OPORTUNIDADES",
    "posicion": "Júpiter SR en ${srJupiter?.sign} Casa ${srJupiter?.house} SR",
    "que_se_activa": "String de 100-150 palabras. Júpiter muestra dónde el año se expande cuando confías.",
    "como_se_manifiesta": "String de 80-120 palabras. En ${srJupiter?.sign} Casa ${srJupiter?.house} SR, indica áreas donde el crecimiento ocurre si te permites aprender, arriesgar y salir de viejos límites.",
    "contraste_natal": "String de 60-100 palabras.",
    "superpoder": "String de 40-60 palabras. Este año la suerte no llega sola: aparece cuando dices 'sí' a la experiencia.",
    "sombra_especifica": "String de 40-60 palabras.",
    "sintesis": "String de 5-10 palabras."
  },

  "saturno_sr": {
    "titulo": "SATURNO DEL RETORNO SOLAR → RESPONSABILIDAD EVOLUTIVA",
    "posicion": "Saturno SR en ${srSaturno?.sign} Casa ${srSaturno?.house} SR",
    "que_se_activa": "String de 100-150 palabras. Saturno indica dónde el año pide madurez.",
    "como_se_manifiesta": "String de 80-120 palabras. En ${srSaturno?.sign} Casa ${srSaturno?.house} SR, muestra el área donde no hay atajos. Aquí se construye algo sólido, aunque lento.",
    "contraste_natal": "String de 60-100 palabras. Saturno natal en ${natalSaturno?.sign} Casa ${natalSaturno?.house} es tu patrón de miedo/responsabilidad base.",
    "superpoder": "String de 40-60 palabras. Este entrenamiento no busca castigarte, sino darte estructura interna real. Lo que sostengas aquí, permanece.",
    "sombra_especifica": "String de 40-60 palabras. Auto-sabotaje, rigidez o perfeccionismo.",
    "sintesis": "String de 5-10 palabras."
  },

  "planetas_profundos": {
    "titulo": "PLANETAS PROFUNDOS → CAMBIOS NO NEGOCIABLES",
    "urano": {
      "posicion": "Urano SR en ${srUrano?.sign} Casa ${srUrano?.house} SR",
      "descripcion": "String de 80-120 palabras. Urano SR muestra dónde el año rompe rutinas para liberarte."
    },
    "neptuno": {
      "posicion": "Neptuno SR en ${srNeptuno?.sign} Casa ${srNeptuno?.house} SR",
      "descripcion": "String de 80-120 palabras. Neptuno SR indica dónde necesitas confiar más en la intuición que en el control."
    },
    "pluton": {
      "posicion": "Plutón SR en ${srPluton?.sign} Casa ${srPluton?.house} SR",
      "descripcion": "String de 80-120 palabras. Plutón SR revela qué debe morir para que algo auténtico nazca."
    },
    "nota": "Estos procesos no se fuerzan. Se acompañan."
  },

  "nodos_sr": {
    "titulo": "NODOS DEL RETORNO SOLAR → DIRECCIÓN DEL AÑO",
    "nodo_norte": {
      "posicion": "${srNodoNorte?.sign || 'N/A'} Casa ${srNodoNorte?.house || '?'} SR",
      "descripcion": "String de 80-120 palabras. Hacia dónde crecer este año."
    },
    "nodo_sur": {
      "posicion": "${srNodoSur?.sign || 'N/A'} Casa ${srNodoSur?.house || '?'} SR",
      "descripcion": "String de 80-120 palabras. Patrones conocidos que ya no sostienen evolución."
    },
    "sintesis": "El año avanza cuando eliges lo incómodo consciente, no lo cómodo automático."
  },

  "linea_tiempo": {
    "titulo": "LÍNEA DE TIEMPO ANUAL · AGENDA ENERGÉTICA",
    "descripcion": "El año se despliega en fases claras. Cada Luna Nueva y Luna Llena activa micro-eventos relacionados con la casa dominante del año. Esta agenda no predice eventos. Propone momentos óptimos de consciencia y acción.",
    "mes_1": "Inicio del ciclo – siembra de intención",
    "mes_3": "Primer ajuste – choque con la realidad",
    "mes_6": "Fluidez – resultados del trabajo previo",
    "mes_7": "Revelación – claridad brutal",
    "mes_9": "Cosecha visible",
    "mes_12": "Integración y cierre"
  },

  "como_usar_este_anio": {
    "titulo": "CÓMO USAR ESTE AÑO A TU FAVOR",
    "instrucciones": [
      "observas patrones sin juicio",
      "actúas sin forzar",
      "ajustas sin victimismo",
      "eliges consciencia sobre automatismo"
    ],
    "nota": "No necesitas hacerlo perfecto. Necesitas hacerlo presente."
  },

  "integracion_final": {
    "titulo": "INTEGRACIÓN FINAL",
    "mensaje_1": "Este año no te cambia.",
    "mensaje_2": "Te entrena.",
    "mensaje_3": "El Retorno Solar no dicta destino.",
    "mensaje_4": "Te ofrece un mapa.",
    "mensaje_5": "Tú decides si lo ignoras… o si lo usas para vivir con mayor coherencia, poder interno y claridad.",
    "mensaje_6": "La revolución no es externa.",
    "mensaje_7": "Es la forma en que eliges responder."
  },

  "calendario_lunar": [
    {
      "mes": "Enero ${returnYear}",
      "luna_nueva": {
        "fecha": "String YYYY-MM-DD aproximada",
        "signo": "String. Signo zodiacal",
        "mensaje": "String de 40-80 palabras. Qué intención sembrar."
      },
      "luna_llena": {
        "fecha": "String YYYY-MM-DD aproximada",
        "signo": "String. Signo zodiacal",
        "mensaje": "String de 40-80 palabras. Qué soltar/celebrar."
      }
    }
    // Repetir para los 12 meses del ciclo
  ]
}

---

## ⚡ CRITERIOS DE CALIDAD

✅ TODO planeta debe conectarse con su posición natal
✅ TODO texto debe usar lenguaje temporal ("este año", "durante este ciclo")
✅ NUNCA redefinir personalidad, solo describir entrenamiento
✅ Ejemplos concretos de cómo se manifiesta
✅ Conectar astrología con vida cotidiana real

---

Genera el JSON ahora.
`;
}
