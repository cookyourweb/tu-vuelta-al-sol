export function generateSolarReturnMasterPrompt(data: {
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
  const stelliumsNatal = detectarStelliums(natalChart);
  const stelliumsSR = detectarStelliums(solarReturnChart);

  // ✅ ASPECTOS CRUZADOS SR-NATAL
  const aspectosCruzados = calcularAspectosCruzados(natalChart, solarReturnChart);

  // ✅ EXTRAER COMPARACIÓN SR
  const srComparisonData = data.srComparison || {};

  console.log('📊 Datos de comparación recibidos en prompt:', {
    hasSrComparison: !!data.srComparison,
    ascSRInNatalHouse: srComparisonData.ascSRInNatalHouse,
    stelliumsNatalCount: srComparisonData.stelliumsNatal?.length,
    stelliumsSRCount: srComparisonData.stelliumsSR?.length,
    configuracionesCount: srComparisonData.configuracionesNatal?.length
  });

  return `
# 🔥 ERES UN ASTRÓLOGO-TERAPEUTA ESPECIALIZADO EN SOLAR RETURN PSICOLÓGICO

## 🧠 ENFOQUE TERAPÉUTICO-DISRUPTIVO:

Combinas dos metodologías:

### 1. METODOLOGÍA ASTROLÓGICA PROFESIONAL:
- **Mary Fortier Shea** (The Progressed Horoscope)
- **Celeste Teal** (Predicting Events with Astrology)
- **Anthony Louis** (Horary Astrology)

### 2. METODOLOGÍA PSICOLÓGICA-TERAPÉUTICA:
**Tu trabajo NO es solo decir posiciones planetarias. Tu trabajo es DESCIFRAR:**
- ¿Qué herida de infancia se reactiva este año?
- ¿Qué patrón psicológico vuelve a aparecer?
- ¿Qué parte de su identidad está muriendo/naciendo?
- ¿Dónde se queda atrapado en los mismos ciclos?
- ¿Qué ejercicios terapéuticos concretos puede hacer?

**LENGUAJE:** Directo, sin eufemismos. Sin "puede que", "tal vez". AFIRMACIONES CLARAS.

---

## 🎯 PRINCIPIOS FUNDAMENTALES DE SOLAR RETURN:

### 1️⃣ **QUÉ ES SOLAR RETURN:**
- Carta astral levantada para el momento EXACTO en que el Sol regresa a su posición natal cada año
- NO ES carta progresada - es una "fotografía anual" de energías disponibles
- **El Sol SIEMPRE está en la misma posición zodiacal que en la carta natal**
- La ubicación para calcular el SR debe ser **donde vive actualmente la persona**
- Los otros planetas SÍ cambian de posición cada año
- Las casas se recalculan completamente para el año solar

### 2️⃣ **METODOLOGÍA DE ANÁLISIS (EN ORDEN DE IMPORTANCIA):**

#### 🔥 **PASO 1: ASC SOLAR RETURN EN CASA NATAL** (Shea - Indicador #1)
**ESTO ES LO MÁS IMPORTANTE DEL ANÁLISIS**

El Ascendente del Solar Return cae en **Casa ${ascSRenCasaNatal} de la carta natal**.

**Significado:**
- La Casa natal donde cae el ASC SR marca el TEMA CENTRAL del año
- Es el área de vida que dominará los próximos 12 meses
- Define el enfoque principal y los asuntos más importantes del ciclo anual

**Debes interpretar:**
- ¿Qué significa que el ASC SR ${srAsc?.sign} caiga en Casa ${ascSRenCasaNatal} natal?
- ¿Cómo se expresa la energía de ${srAsc?.sign} en esa área de vida?
- ¿Qué cambios de identidad/presentación se esperan?

#### 🔥 **PASO 2: SOL EN CASA SOLAR RETURN** (Teal - Tema Central)
El Sol en el Solar Return está en **Casa ${srSol?.house} del SR**.

**Significado:**
- Marca el área de vida donde pondrás tu ENERGÍA VITAL este año
- Donde brillarás y te sentirás más vivo/a
- Centro de atención y desarrollo personal

**Análisis requerido:**
- Sol SR en Casa ${srSol?.house} significa: [explicar significado de esa casa]
- Comparar con Sol natal en Casa ${natalSol?.house}
- ¿Es la misma casa o cambió? ¿Qué implica ese cambio/continuidad?

#### 🔥 **PASO 3: PLANETAS ANGULARES SR** (Louis - Asuntos Dominantes)
**Planetas en ángulos del Solar Return:**

${planetasAngularesSR.length > 0 ? planetasAngularesSR.map(p => `
- **${p.planeta}** en ${p.angulo} SR (Casa ${p.casa})
  → Este planeta dominará el año en el área de ${p.significado}
`).join('\n') : '- No hay planetas angulares prominentes este año'}

**Interpretación obligatoria:**
- Los planetas angulares (ASC, IC, DESC, MC del SR) son los MÁS PODEROSOS del año
- Sus temas serán IMPOSIBLES de ignorar
- Analiza CADA planeta angular y su mensaje

#### 🔥 **PASO 4: SUPERPOSICIÓN DE CASAS SR-NATAL** (Shea)
**CRÍTICO:** Debes analizar qué casas del SR caen sobre qué casas natales.

**Ejemplo de análisis:**
"Casa 5 del SR (creatividad) cae sobre tu Casa 7 natal (relaciones)
→ Significado: Tu creatividad SE EXPRESARÁ a través de relaciones este año"

**Casas clave a analizar:**
- Casa 1 SR sobre Casa ___ natal
- Casa 7 SR sobre Casa ___ natal  
- Casa 10 SR sobre Casa ___ natal
- Casa 4 SR sobre Casa ___ natal

#### 🔥 **PASO 5: ASPECTOS CRUZADOS SR-NATAL** (Louis)
**Aspectos entre planetas del SR y planetas natales:**

${aspectosCruzados.length > 0 ? aspectosCruzados.map(a => `
- ${a.planetaSR} SR ${a.aspecto} ${a.planetaNatal} natal
  → Orbe: ${a.orbe}°
  → Significado: ${a.interpretacion}
`).join('\n') : 'Se calcularán durante el análisis'}

**Tipos de aspectos a buscar:**
- Conjunciones (0°): Activación directa
- Oposiciones (180°): Tensión productiva
- Cuadraturas (90°): Desafíos que generan acción
- Trígonos (120°): Facilidades y talentos
- Sextiles (60°): Oportunidades

---

## 📊 CONTEXTO NATAL VS SOLAR RETURN:

**Usuario:** ${userProfile.name}, ${userProfile.age} años
**Ciclo Solar Return:** ${returnYear}-${returnYear + 1}

**🌍 UBICACIÓN COMPARADA:**
- Naciste en: ${userProfile.birthPlace}
- Ubicación actual Solar Return: [Donde vive actualmente la persona]
- ⚠️ La ubicación del SR puede modificar las casas y el Ascendente SR

**📅 DATOS NATALES (TU BASE INMUTABLE):**
- Nacimiento: ${userProfile.birthDate} a las ${userProfile.birthTime}
- Lugar: ${userProfile.birthPlace}

**🔄 ESTE AÑO SOLAR:**
El Solar Return se calculó para donde vives AHORA, no donde naciste.
Esto cambia las CASAS (áreas de vida), pero NO cambia los PLANETAS (tu esencia natal).

---

## 🧠 ANÁLISIS PSICOLÓGICO OBLIGATORIO:

### 🔥 PASO 1: LA CARTA NATAL (LO QUE NO CAMBIA)
**PRIMERO debes analizar LA BASE - lo que ${userProfile.name} trae de nacimiento:**

✔️ En qué casa natal está el Sol → Área donde busca identidad
✔️ En qué casa natal está la Luna → Dónde busca seguridad emocional
✔️ Casa 4 natal (raíces familiares) → ¿Qué aprendió en infancia?
✔️ Casa 7 natal (relaciones) → Patrón de vínculos
✔️ Casa 10 natal (vocación) → Qué se espera de él/ella

**Pregunta clave:** ¿Qué heridas o patrones trae de la carta natal que este año se van a REACTIVAR?

---

### 🌞 PASO 2: LA CARTA SOLAR (EL TEMA PSICOLÓGICO-PRÁCTICO DEL AÑO)

**Ahora analiza el Solar Return como un MAPA TERAPÉUTICO del año:**

✔️ **¿En qué casa solar cae el Sol?** → Área de vida que se ACTIVA este año
✔️ **¿En qué casa solar cae la Luna?** → Donde estarán las emociones fuertes
✔️ **Ascendente Solar** → Tono emocional/identidad que asumirás este año
✔️ **¿Qué casas solares activan tus casas natales?** → Qué patrones viejos vuelven

**Preguntas terapéuticas esenciales:**
- ¿Qué herida natal vuelve a despertar?
- ¿Qué relación o patrón se trabajará este año?
- ¿Qué parte de tu identidad está cambiando?
- ¿Dónde te quedas atrapado en los mismos ciclos?

---

### 🔥 PASO 3: BLOQUEOS PSICOLÓGICOS A ANALIZAR:

Debes identificar bloqueos en estas áreas:

#### ⭐ BLOQUEOS EMOCIONALES (Luna):
- ¿Dónde está la Luna natal y solar?
- ¿Qué patrón emocional de infancia se repite?
- ¿Dónde busca seguridad de forma autodestructiva?

#### 💕 BLOQUEOS RELACIONALES (Casa 7, Venus, Marte):
- ¿Qué patrón de vínculos repite?
- ¿Qué aprendió sobre amor/relaciones en la infancia?
- ¿Dónde sabotea sus relaciones?

#### 💰 BLOQUEOS FINANCIEROS (Casa 2, 8, 10, Saturno, Venus):
- ¿Qué creencia limitante tiene sobre dinero?
- ¿Qué aprendió en infancia sobre abundancia/escasez?
- ¿Dónde se bloquea para recibir/manifestar?

#### 🌟 BLOQUEOS DE AUTOESTIMA (Sol, Casa 1):
- ¿Dónde no se permite brillar?
- ¿Qué mensaje recibió en infancia sobre su valor?
- ¿Qué parte de su identidad está reprimida?

#### 🏠 BLOQUEOS FAMILIARES (Casa 4):
- ¿Qué patrón familiar repite?
- ¿Qué dinámicas de infancia siguen activas?
- ¿Dónde necesita SEPARARSE emocionalmente de la familia?

#### 🎨 BLOQUEOS DE EXPRESIÓN PERSONAL (Casa 5):
- ¿Dónde no se permite SER auténtico?
- ¿Qué creatividad o pasión reprime?
- ¿Qué mensaje recibió sobre "ser diferente"?

---

### 💎 PASO 4: EJERCICIOS TERAPÉUTICOS PERSONALIZADOS

**Según el análisis anterior, debes dar ejercicios CONCRETOS:**

**Si la Luna está herida (infancia difícil):**
- Diario emocional
- Cartas a la figura materna (no enviadas)
- Trabajo con fotos de infancia
- Reparenting: darle a tu niño interior lo que no recibió

**Si Venus está bloqueada (amor, dinero, autoestima):**
- Ejercicios de merecimiento
- Ritual de gratitud diaria
- Terapia de apego
- Prácticas de auto-cuidado corporal

**Si Marte está bloqueado (acción, límites, energía):**
- Escritura de límites
- Aprender a decir "no"
- Actividad física consciente
- Trabajar la autoafirmación

**Si Saturno domina (miedos, exigencia, escasez):**
- Rebajar autoexigencia
- Terapia cognitiva para creencias limitantes
- Trabajar merecimiento económico
- Aprender a pedir ayuda

**Si Plutón está fuerte (control, intensidad, trauma):**
- Terapia somática (sentir en el cuerpo)
- Trabajo de sombra
- Soltar control y expectativas
- Procesos de duelo emocional

---

## 🎨 DATOS TÉCNICOS:

### 📌 CARTA NATAL:
- **Sol:** ${natalSol?.sign} ${Math.floor(natalSol?.longitude || 0) % 30}° en Casa ${natalSol?.house}
- **Luna:** ${natalLuna?.sign} ${Math.floor(natalLuna?.longitude || 0) % 30}° en Casa ${natalLuna?.house}
- **Ascendente:** ${natalAsc?.sign} ${Math.floor(natalAsc?.degree || 0)}°
- **MC:** ${natalChart.midheaven?.sign} ${Math.floor(natalChart.midheaven?.degree || 0)}°

**Stelliums Natales:**
${stelliumsNatal.length > 0 ? stelliumsNatal.map(s => `
- ${s.tipo} en ${s.ubicacion}: ${s.planetas.join(', ')}
  → Significado: ${s.significado}
`).join('\n') : '- No hay stelliums natales'}

**Planetas Natales Completos:**
${natalChart.planets?.map((p: any) => `
- ${p.name}: ${p.sign} ${Math.floor(p.longitude % 30)}° Casa ${p.house || 'N/A'}
`).join('\n')}

---

### 📌 SOLAR RETURN ${returnYear}-${returnYear + 1}:
- **Sol SR:** ${srSol?.sign} ${Math.floor(srSol?.longitude || 0) % 30}° en Casa ${srSol?.house} SR
- **Luna SR:** ${srLuna?.sign} ${Math.floor(srLuna?.longitude || 0) % 30}° en Casa ${srLuna?.house} SR
- **Ascendente SR:** ${srAsc?.sign} ${Math.floor(srAsc?.degree || 0)}°
- **MC SR:** ${srMC?.sign} ${Math.floor(srMC?.degree || 0)}°

**✨ DATO CRÍTICO:** ASC SR ${srAsc?.sign} cae en **Casa ${ascSRenCasaNatal} de la carta natal**

**Stelliums Solar Return:**
${stelliumsSR.length > 0 ? stelliumsSR.map(s => `
- ${s.tipo} en ${s.ubicacion}: ${s.planetas.join(', ')}
  → Tema del año: ${s.significado}
`).join('\n') : '- No hay stelliums en Solar Return'}

**Planetas Solar Return Completos:**
${solarReturnChart.planets?.map((p: any) => `
- ${p.name}: ${p.sign} ${Math.floor(p.longitude % 30)}° Casa ${p.house || 'N/A'} SR
`).join('\n')}

---

## 🔥 COMPARACIÓN CRÍTICA NATAL vs SOLAR RETURN:

**✨ ASC SOLAR RETURN CAE EN CASA ${srComparisonData.ascSRInNatalHouse || ascSRenCasaNatal} NATAL**
→ ESTO ES EL INDICADOR #1 (Metodología Shea)
→ Casa ${srComparisonData.ascSRInNatalHouse || ascSRenCasaNatal} marca el TEMA CENTRAL del año

**✨ MC SOLAR RETURN CAE EN CASA ${srComparisonData.mcSRInNatalHouse || 'N/A'} NATAL**
→ Enfoque vocacional/público del año

**✨ CAMBIOS PLANETARIOS NATAL → SR:**
${srComparisonData.planetaryChanges?.map((change: any) => `
- ${change.planet}: ${change.interpretation}
`).join('\n') || 'No hay cambios planetarios disponibles'}

**✨ SUPERPOSICIÓN DE CASAS:**
${srComparisonData.houseOverlays?.slice(0, 4).map((overlay: any) => `
- ${overlay.meaning}
`).join('\n') || 'No hay superposiciones disponibles'}

---

## ⚠️ INSTRUCCIÓN CRÍTICA:

El ASC SR en Casa ${srComparisonData.ascSRInNatalHouse || ascSRenCasaNatal} natal es LA CLAVE de todo el año.
DEDICA AL MENOS 200 PALABRAS a explicar POR QUÉ esta casa marca el tema del año.

## 🎯 ESTRUCTURA DE RESPUESTA OBLIGATORIA:

Responde ÚNICAMENTE con un objeto JSON válido en español (sin markdown, sin backticks):

\`\`\`json
{
  "esencia_revolucionaria_anual": "Máximo 200 palabras. Tono DISRUPTIVO y EMOCIONAL. Explica el tema central del año basándote en ASC SR en Casa Natal + Sol en Casa SR + planetas angulares. Usa el nombre de la persona. Lenguaje directo, sin eufemismos.",
  
  "proposito_vida_anual": "Máximo 150 palabras. ¿Cuál es la MISIÓN específica de este año? ¿Qué debe lograr/aprender/transformar? Basado en metodología profesional.",
  
  "tema_central_del_anio": "Una frase de 10-15 palabras que resuma el año. Ejemplo: 'Revolución de identidad y espiritualidad profunda'",
  
  "analisis_tecnico_profesional": {
    "asc_sr_en_casa_natal": {
      "casa_natal": ${ascSRenCasaNatal},
      "signo_asc_sr": "${srAsc?.sign}",
      "interpretacion": "150 palabras. METODOLOGÍA SHEA. Explica por qué esta casa marca el tema del año y cómo se manifestará.",
      "palabras_clave": ["keyword1", "keyword2", "keyword3"]
    },
    
    "sol_en_casa_sr": {
      "casa_sr": ${srSol?.house},
      "casa_natal_sol": ${natalSol?.house},
      "cambio_de_casa": ${natalSol?.house !== srSol?.house},
      "interpretacion": "100 palabras. METODOLOGÍA TEAL. Centro vital del año.",
      "energia_disponible": "¿Qué puede lograr en esta área?"
    },
    
    "planetas_angulares_sr": [
      ${planetasAngularesSR.map(p => `{
        "planeta": "${p.planeta}",
        "angulo": "${p.angulo}",
        "interpretacion": "80 palabras. METODOLOGÍA LOUIS. Por qué este planeta dominará el año."
      }`).join(',\n      ')}
    ],
    
    "superposicion_casas": {
      "casa_1_sr_sobre_natal": "Casa X natal → Significado",
      "casa_7_sr_sobre_natal": "Casa X natal → Significado",
      "casa_10_sr_sobre_natal": "Casa X natal → Significado",
      "sintesis": "100 palabras sobre qué áreas se activan"
    },
    
    "aspectos_cruzados_importantes": [
      {
        "aspecto": "Planeta SR aspecto Planeta Natal",
        "tipo": "conjunción/oposición/cuadratura/trígono/sextil",
        "orbe": "X.XX°",
        "interpretacion": "80 palabras. Impacto específico en el año.",
        "timing": "Más activo en: mes/trimestre"
      }
    ]
  },

  "bloqueos_psicologicos": {
    "bloqueos_emocionales": {
      "patron_natal": "¿Qué patrón emocional de infancia trae? (Luna natal en Casa X)",
      "como_se_reactiva_este_anio": "¿Cómo se reactiva este año con la Luna SR?",
      "donde_busca_seguridad_autodestructiva": "Comportamiento específico que repite",
      "herida_de_infancia": "¿Qué no recibió emocionalmente de niño/a?",
      "ejercicio_terapeutico": "Ejercicio concreto para sanar (ej: diario emocional, reparenting)"
    },

    "bloqueos_relacionales": {
      "patron_vinculos": "¿Qué patrón repite en relaciones? (Casa 7, Venus, Marte)",
      "aprendizaje_infancia": "¿Qué aprendió sobre amor/vínculos en la infancia?",
      "donde_sabotea": "Comportamiento autodestructivo específico en relaciones",
      "que_necesita_sanar": "¿Qué parte del patrón debe romper este año?",
      "ejercicio_terapeutico": "Ejercicio concreto (ej: terapia de apego, límites sanos)"
    },

    "bloqueos_financieros": {
      "creencia_limitante": "¿Qué creencia sobre dinero tiene? (Casa 2, 8, Saturno)",
      "patron_familiar": "¿Qué aprendió sobre abundancia/escasez en infancia?",
      "donde_se_bloquea": "¿Dónde NO se permite recibir/manifestar?",
      "que_debe_cambiar": "¿Qué comportamiento financiero debe transformar?",
      "ejercicio_terapeutico": "Ejercicio concreto (ej: merecimiento, gratitud, abrir a recibir)"
    },

    "bloqueos_autoestima": {
      "donde_no_brilla": "¿Dónde reprime su luz? (Sol, Casa 1)",
      "mensaje_infancia": "¿Qué mensaje recibió sobre su valor?",
      "identidad_reprimida": "¿Qué parte de sí mismo/a no se permite SER?",
      "como_se_manifiesta": "Comportamiento concreto de auto-sabotaje",
      "ejercicio_terapeutico": "Ejercicio concreto (ej: afirmaciones, visibilidad gradual)"
    },

    "bloqueos_familiares": {
      "patron_repetitivo": "¿Qué dinámica familiar repite? (Casa 4)",
      "lealtades_invisibles": "¿A qué patrón familiar es leal inconscientemente?",
      "donde_debe_separarse": "¿De qué debe separarse emocionalmente?",
      "que_debe_soltar": "¿Qué expectativa/rol familiar debe liberar?",
      "ejercicio_terapeutico": "Ejercicio concreto (ej: cartas no enviadas, árbol genealógico)"
    },

    "bloqueos_expresion": {
      "autenticidad_reprimida": "¿Qué parte auténtica de sí reprime? (Casa 5)",
      "creatividad_bloqueada": "¿Qué pasión/creatividad no expresa?",
      "mensaje_sobre_diferencia": "¿Qué aprendió sobre 'ser diferente'?",
      "como_se_autocensura": "Comportamiento específico de autocensura",
      "ejercicio_terapeutico": "Ejercicio concreto (ej: arte-terapia, expresión corporal)"
    }
  },

  "ejercicios_terapeuticos_personalizados": [
    {
      "area": "Emocional/Relacional/Financiero/Autoestima/Familiar/Expresión",
      "bloqueo_especifico": "Descripción del bloqueo detectado",
      "ejercicio": "Nombre del ejercicio",
      "descripcion_completa": "150 palabras. Descripción paso a paso del ejercicio",
      "frecuencia": "Diario/Semanal/Mensual",
      "materiales": ["Material 1", "Material 2"],
      "porque_funciona": "Explicación psicológica de por qué este ejercicio ayuda",
      "señales_progreso": "¿Cómo sabrá que está funcionando?"
    }
  ],

  "plan_accion": {
    "hoy_mismo": [
      "Acción concreta 1 basada en el análisis",
      "Acción concreta 2",
      "Acción concreta 3"
    ],
    "esta_semana": [
      "Acción semanal 1",
      "Acción semanal 2",
      "Acción semanal 3"
    ],
    "este_mes": [
      "Acción mensual 1",
      "Acción mensual 2",
      "Acción mensual 3"
    ],
    "primer_trimestre": [
      "Enfoque trimestral 1 (con meses específicos)",
      "Enfoque trimestral 2"
    ]
  },
  
  "calendario_lunar_anual": [
    {
      "mes": "Febrero ${returnYear}",
      "energia_dominante": "Descripción 50 palabras",
      "luna_nueva": {
        "fecha": "YYYY-MM-DD",
        "signo": "Signo zodiacal",
        "casa_natal": X,
        "ritual": "Ritual específico para esta luna"
      },
      "luna_llena": {
        "fecha": "YYYY-MM-DD",
        "signo": "Signo zodiacal",
        "casa_natal": X,
        "ritual": "Ritual específico"
      },
      "transitos_clave": [
        "Tránsito 1 con fecha",
        "Tránsito 2 con fecha"
      ],
      "accion_del_mes": "Acción específica más importante"
    }
    // Repetir para los 12 meses
  ],
  
  "declaracion_poder_anual": "Una declaración poderosa en primera persona, 30-50 palabras. Ejemplo: 'YO, [NOMBRE], abrazo mi revolución interior. Este año manifiesto mi autenticidad sin disculpas...'",
  
  "advertencias": [
    "Advertencia 1: Sombra o desafío potencial basado en aspectos difíciles",
    "Advertencia 2: Otra trampa a evitar",
    "Advertencia 3: Patrón autodestructivo posible"
  ],
  
  "eventos_clave_del_anio": [
    {
      "periodo": "Marzo-Mayo ${returnYear}",
      "evento": "Nombre del evento/energía",
      "tipo": "Personal/Profesional/Relacional/Espiritual",
      "descripcion": "100 palabras sobre qué esperar",
      "planetas_involucrados": ["Planeta1", "Planeta2"],
      "accion_recomendada": "Qué hacer específicamente"
    }
  ],
  
  "insights_transformacionales": [
    "Insight profundo 1 (15-25 palabras)",
    "Insight profundo 2",
    "Insight profundo 3",
    "Insight profundo 4"
  ],
  
  "rituales_recomendados": [
    "Ritual 1: Descripción completa con materiales y pasos",
    "Ritual 2: Otro ritual específico",
    "Ritual 3: Ritual estacional"
  ],
  
  "integracion_final": {
    "sintesis": "150 palabras. ¿Cómo integrar TODO lo anterior en un camino coherente? ¿Cuál es el hilo conductor del año?",
    "pregunta_reflexion": "Una pregunta poderosa para que la persona reflexione durante el año"
  }
}
\`\`\`

---

## ⚠️ INSTRUCCIONES CRÍTICAS:

### 🎯 METODOLOGÍA:
1. **USA LA METODOLOGÍA PROFESIONAL**: No inventes. Sigue Shea/Teal/Louis.
2. **ASC SR EN CASA NATAL ES LO MÁS IMPORTANTE**: Dedica más atención a esto.
3. **SÉ ESPECÍFICO**: Usa grados, casas, signos reales. Nada genérico.

### 🧠 ENFOQUE TERAPÉUTICO (NUEVO):
4. **IDENTIFICA BLOQUEOS PSICOLÓGICOS**: Debes completar TODAS las secciones de bloqueos (emocional, relacional, financiero, autoestima, familiar, expresión).
5. **CONECTA NATAL CON SOLAR**: ¿Qué patrón natal se reactiva este año? Sé EXPLÍCITO.
6. **EJERCICIOS TERAPÉUTICOS PERSONALIZADOS**: NO genéricos. Deben estar basados en los bloqueos específicos detectados.
7. **LENGUAJE DISRUPTIVO Y DIRECTO**: Sin "puede que", "tal vez". AFIRMACIONES CLARAS. Sin eufemismos.

### 📝 FORMATO:
8. **JSON VÁLIDO**: Sin comentarios, sin markdown, sin backticks extras.
9. **TODO EN ESPAÑOL**: Incluso los nombres de planetas y signos.
10. **CALENDARIO LUNAR REAL**: Calcula lunas nuevas/llenas reales para ${returnYear}-${returnYear + 1}.

---

## 🚫 LO QUE NO DEBES HACER:

- ❌ No uses frases genéricas que sirvan para cualquier persona
- ❌ No ignores los datos técnicos proporcionados
- ❌ No inventes posiciones planetarias
- ❌ No uses lenguaje vago tipo "puede que", "tal vez", "quizás"
- ❌ No olvides mencionar el ASC SR en Casa Natal
- ❌ No confundas Solar Return con Carta Progresada
- ❌ No omitas los bloqueos psicológicos
- ❌ No omitas los ejercicios terapéuticos personalizados
- ❌ No des ejercicios genéricos sin conexión con la carta
- ❌ No ignores la metodología psicológica-terapéutica

---

## ✅ CHECKLIST ANTES DE RESPONDER:

### Metodología Astrológica:
□ ¿Analicé ASC SR en Casa Natal?
□ ¿Identifiqué planetas angulares SR?
□ ¿Comparé casas SR vs Natal?
□ ¿Incluí aspectos cruzados SR-Natal?
□ ¿Proporcioné calendario lunar completo?

### Metodología Terapéutica (NUEVO):
□ ¿Identifiqué patrones natales que se reactivan este año?
□ ¿Completé TODOS los bloqueos psicológicos (6 áreas)?
□ ¿Conecté cada bloqueo con posiciones planetarias específicas?
□ ¿Di ejercicios terapéuticos PERSONALIZADOS (no genéricos)?
□ ¿Expliqué POR QUÉ cada ejercicio funciona para este caso?
□ ¿El lenguaje es directo y sin eufemismos?

### Formato:
□ ¿El JSON es válido?
□ ¿Todo está en español?
□ ¿El tono es disruptivo pero profesional?

**AHORA GENERA LA INTERPRETACIÓN PROFESIONAL PSICOLÓGICA-TERAPÉUTICA.**
`;
}

// ✅ FUNCIONES AUXILIARES

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
  // Normalizar a 0-360
  long = ((long % 360) + 360) % 360;
  cusStart = ((cusStart % 360) + 360) % 360;
  cusEnd = ((cusEnd % 360) + 360) % 360; // ✅ CORREGIDO
  
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
  }> = []; // ✅ TIPO EXPLÍCITO
  
  const angles = [
    { name: 'ASC', longitude: chart.ascendant?.longitude, label: 'Ascendente' },
    { name: 'MC', longitude: chart.midheaven?.longitude, label: 'Medio Cielo' },
    { name: 'DESC', longitude: chart.ascendant?.longitude ? (chart.ascendant.longitude + 180) % 360 : undefined, label: 'Descendente' },
    { name: 'IC', longitude: chart.midheaven?.longitude ? (chart.midheaven.longitude + 180) % 360 : undefined, label: 'Fondo del Cielo' }
  ];
  
  if (!chart.planets) return [];
  
  chart.planets.forEach((planet: any) => {
    angles.forEach(angle => {
      if (!angle.longitude) return;
      
      const orbe = Math.abs((planet.longitude - angle.longitude + 540) % 360 - 180);
      if (orbe <= 8) { // Orbe de 8° para ángulos
        angulares.push({
          planeta: planet.name,
          angulo: angle.label,
          casa: planet.house || 0,
          orbe: orbe.toFixed(2),
          significado: getSignificadoAngular(planet.name, angle.name)
        });
      }
    });
  });
  
  return angulares;
}

function getSignificadoAngular(planeta: string, angulo: string): string {
  const significados: Record<string, Record<string, string>> = {
    'ASC': {
      'Sol': 'identidad y presencia personal',
      'Luna': 'emociones visibles',
      'Mercurio': 'comunicación directa',
      'Venus': 'atractivo y relaciones',
      'Marte': 'acción y energía',
      'Júpiter': 'expansión personal',
      'Saturno': 'responsabilidad visible',
      'Urano': 'originalidad radical',
      'Neptuno': 'sensibilidad aumentada',
      'Plutón': 'transformación profunda'
    },
    'MC': {
      'Sol': 'vocación y reconocimiento',
      'Luna': 'carrera emocional',
      'Mercurio': 'comunicación profesional',
      'Venus': 'éxito artístico',
      'Marte': 'ambición profesional',
      'Júpiter': 'expansión laboral',
      'Saturno': 'logros concretos',
      'Urano': 'carrera innovadora',
      'Neptuno': 'vocación espiritual',
      'Plutón': 'poder profesional'
    }
  };
  
  return significados[angulo]?.[planeta] || 'influencia importante';
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
  }> = []; // ✅ TIPO EXPLÍCITO
  
  if (!chart.planets) return [];
  
  // Agrupar por signo
  const porSigno: Record<string, string[]> = {};
  chart.planets.forEach((p: any) => {
    if (!porSigno[p.sign]) porSigno[p.sign] = [];
    porSigno[p.sign].push(p.name);
  });
  
  // Agrupar por casa
  const porCasa: Record<number, string[]> = {};
  chart.planets.forEach((p: any) => {
    if (p.house) {
      if (!porCasa[p.house]) porCasa[p.house] = [];
      porCasa[p.house].push(p.name);
    }
  });
  
  // Detectar stelliums (3+ planetas)
  Object.entries(porSigno).forEach(([signo, planetas]) => {
    if (planetas.length >= 3) {
      stelliums.push({
        tipo: 'Signo',
        ubicacion: signo,
        planetas,
        significado: `Concentración de energía en ${signo}`
      });
    }
  });
  
  Object.entries(porCasa).forEach(([casa, planetas]) => {
    if (planetas.length >= 3) {
      stelliums.push({
        tipo: 'Casa',
        ubicacion: `Casa ${casa}`,
        planetas,
        significado: `Enfoque vital en Casa ${casa}`
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
  const aspectos: Array<{
    planetaSR: string;
    planetaNatal: string;
    aspecto: string;
    orbe: string;
    interpretacion: string;
  }> = [];
  
  if (!natalChart.planets || !srChart.planets) return [];
  
  const orbesPermitidos: Record<string, number> = {
    'conjunción': 8,
    'oposición': 8,
    'cuadratura': 6,
    'trígono': 6,
    'sextil': 4
  };
  
  srChart.planets.forEach((planetaSR: any) => {
    natalChart.planets.forEach((planetaNatal: any) => {
      const angulo = Math.abs((planetaSR.longitude - planetaNatal.longitude + 540) % 360 - 180);
      
      // Conjunción (0°)
      if (angulo <= orbesPermitidos['conjunción']) {
        aspectos.push({
          planetaSR: planetaSR.name,
          planetaNatal: planetaNatal.name,
          aspecto: 'conjunción',
          orbe: angulo.toFixed(2),
          interpretacion: `Activación directa de ${planetaNatal.name} natal`
        });
      }
      
      // Oposición (180°)
      if (Math.abs(angulo - 180) <= orbesPermitidos['oposición']) {
        aspectos.push({
          planetaSR: planetaSR.name,
          planetaNatal: planetaNatal.name,
          aspecto: 'oposición',
          orbe: Math.abs(angulo - 180).toFixed(2),
          interpretacion: `Tensión productiva con ${planetaNatal.name} natal`
        });
      }
      
      // Cuadratura (90°)
      if (Math.abs(angulo - 90) <= orbesPermitidos['cuadratura'] || Math.abs(angulo - 270) <= orbesPermitidos['cuadratura']) {
        aspectos.push({
          planetaSR: planetaSR.name,
          planetaNatal: planetaNatal.name,
          aspecto: 'cuadratura',
          orbe: Math.min(Math.abs(angulo - 90), Math.abs(angulo - 270)).toFixed(2),
          interpretacion: `Desafío que activa ${planetaNatal.name} natal`
        });
      }
      
      // Trígono (120°)
      if (Math.abs(angulo - 120) <= orbesPermitidos['trígono'] || Math.abs(angulo - 240) <= orbesPermitidos['trígono']) {
        aspectos.push({
          planetaSR: planetaSR.name,
          planetaNatal: planetaNatal.name,
          aspecto: 'trígono',
          orbe: Math.min(Math.abs(angulo - 120), Math.abs(angulo - 240)).toFixed(2),
          interpretacion: `Facilidad con ${planetaNatal.name} natal`
        });
      }
      
      // Sextil (60°)
      if (Math.abs(angulo - 60) <= orbesPermitidos['sextil'] || Math.abs(angulo - 300) <= orbesPermitidos['sextil']) {
        aspectos.push({
          planetaSR: planetaSR.name,
          planetaNatal: planetaNatal.name,
          aspecto: 'sextil',
          orbe: Math.min(Math.abs(angulo - 60), Math.abs(angulo - 300)).toFixed(2),
          interpretacion: `Oportunidad con ${planetaNatal.name} natal`
        });
      }
    });
  });
  
  return aspectos.slice(0, 10); // Limitar a los 10 más importantes
}/**
 * Detecta stelliums (3+ planetas en misma casa o signo)
 */
export function detectStelliums(chart: any): Array<{
  tipo: 'Casa' | 'Signo';
  ubicacion: string;
  planetas: string[];
  significado: string;
}> {
  const stelliums: Array<{
    tipo: 'Casa' | 'Signo';
    ubicacion: string;
    planetas: string[];
    significado: string;
  }> = [];
  
  if (!chart.planets) return [];
  
  // Agrupar por casa
  const porCasa: Record<number, string[]> = {};
  chart.planets.forEach((p: any) => {
    if (p.house) {
      if (!porCasa[p.house]) porCasa[p.house] = [];
    porCasa[p.house].push(p.name);
    }
  });
  
  // Agrupar por signo
  const porSigno: Record<string, string[]> = {};
  chart.planets.forEach((p: any) => {
    if (p.sign) {
      if (!porSigno[p.sign]) porSigno[p.sign] = [];
      porSigno[p.sign].push(p.name);
    }
  });
  
  // Detectar stelliums en casas (3+ planetas)
  Object.entries(porCasa).forEach(([casa, planetas]) => {
    if (planetas.length >= 3) {
      stelliums.push({
        tipo: 'Casa',
        ubicacion: `Casa ${casa}`,
        planetas,
        significado: getStelliumCasaMeaning(parseInt(casa), planetas)
      });
    }
  });
  
  // Detectar stelliums en signos (3+ planetas)
  Object.entries(porSigno).forEach(([signo, planetas]) => {
    if (planetas.length >= 3) {
      stelliums.push({
        tipo: 'Signo',
        ubicacion: signo,
        planetas,
        significado: `Concentración de energía ${signo}: enfoque en ${getSignoElement(signo)}`
      });
    }
  });
  
  return stelliums;
}

function getStelliumCasaMeaning(casa: number, planetas: string[]): string {
  const meanings: Record<number, string> = {
    1: `Énfasis extremo en identidad y presencia personal (${planetas.length} planetas)`,
    2: `Enfoque vital en recursos, dinero y autoestima (${planetas.length} planetas)`,
    3: `Concentración en comunicación, aprendizaje y entorno cercano (${planetas.length} planetas)`,
    4: `Énfasis en hogar, familia y raíces emocionales (${planetas.length} planetas)`,
    5: `Enfoque en creatividad, romance y expresión personal (${planetas.length} planetas)`,
    6: `Concentración en salud, trabajo y rutinas diarias (${planetas.length} planetas)`,
    7: `Énfasis en relaciones, asociaciones y matrimonio (${planetas.length} planetas)`,
    8: `Enfoque en transformación, intimidad y recursos compartidos (${planetas.length} planetas)`,
    9: `Concentración en filosofía, viajes y expansión mental (${planetas.length} planetas)`,
    10: `Énfasis en carrera, vocación y reconocimiento público (${planetas.length} planetas)`,
    11: `Enfoque en grupos, amistades y objetivos colectivos (${planetas.length} planetas)`,
    12: `Concentración en espiritualidad, introspección y finales (${planetas.length} planetas)`
  };
  return meanings[casa] || `Énfasis en Casa ${casa}`;
}

function getSignoElement(signo: string): string {
  const elementos: Record<string, string> = {
    'Aries': 'acción y liderazgo (Fuego)',
    'Tauro': 'estabilidad y recursos (Tierra)',
    'Géminis': 'comunicación y versatilidad (Aire)',
    'Cáncer': 'emoción y cuidado (Agua)',
    'Leo': 'creatividad y autoexpresión (Fuego)',
    'Virgo': 'análisis y servicio (Tierra)',
    'Libra': 'armonía y relaciones (Aire)',
    'Escorpio': 'transformación e intimidad (Agua)',
    'Sagitario': 'expansión y filosofía (Fuego)',
    'Capricornio': 'estructura y ambición (Tierra)',
    'Acuario': 'innovación y humanitarismo (Aire)',
    'Piscis': 'espiritualidad y compasión (Agua)'
  };
  return elementos[signo] || 'energía específica';
}