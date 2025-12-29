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
  natalInterpretations?: any;
}): string {
  const { natalChart, solarReturnChart, userProfile, returnYear, srComparison, natalInterpretations } = data;

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
  "esencia_revolucionaria_anual": "Máximo 200 palabras. Tono PROFESIONAL Y EQUILIBRADO (no agresivo). Explica el tema central del año basándote en ASC SR en Casa Natal + Sol en Casa SR + planetas angulares. Usa solo el PRIMER NOMBRE de la persona. Lenguaje claro y directo, pero sin mayúsculas excesivas ni lenguaje 'revolucionario'. Sin mencionar direcciones completas. Personalización sutil. Ejemplo: 'Este año ${returnYear}-${returnYear + 1} marca un punto de inflexión importante. No es un ciclo más — es un momento para transformar...'",

  "proposito_vida_anual": "Máximo 150 palabras. ¿Cuál es la MISIÓN específica de este año? ¿Qué debe lograr/aprender/transformar? Basado en metodología profesional. Lenguaje equilibrado, sin gritos ni mayúsculas excesivas.",

  "tema_central_del_anio": "Una frase de 10-15 palabras que resuma el año. Sin usar 'REVOLUCIÓN'. Ejemplo: 'Un año para aprender a confiar sin perder autonomía'",

  "formacion_temprana": {
    "casa_lunar": {
      "signo_casa": "Describir casa y signo de Luna SR",
      "interpretacion": "80 palabras. Emociones y necesidades este año.",
      "influencia": "40 palabras. Cómo impacta en lo cotidiano."
    },
    "casa_saturnina": {
      "signo_casa": "Describir casa y signo de Saturno SR",
      "interpretacion": "80 palabras. Responsabilidades y estructuras.",
      "leccion": "40 palabras. Qué enseña este año."
    },
    "casa_venusina": {
      "signo_casa": "Describir casa y signo de Venus SR",
      "interpretacion": "80 palabras. Relaciones y valores.",
      "valores": "40 palabras. Qué se valora este año."
    }
  },

  "patrones_psicologicos": [
    {
      "planeta": "Nombre del planeta",
      "infancia_emocional": "60 palabras. Patrón emocional que se activa.",
      "patron_formado": "50 palabras. Cómo se manifiesta.",
      "impacto_adulto": "50 palabras. Efecto en la vida actual."
    }
    // 2-3 patrones clave del año
  ],

  "planetas_profundos": {
    "urano": "80 palabras. Cambios e innovación que trae Urano SR este año.",
    "neptuno": "80 palabras. Espiritualidad e intuición que activa Neptuno SR.",
    "pluton": "80 palabras. Transformación profunda que inicia Plutón SR."
  },

  "angulos_vitales": {
    "ascendente": {
      "posicion": "${srAsc?.sign} en Casa ${ascSRenCasaNatal} natal",
      "mascara_social": "60-80 palabras. Cómo te presentas al mundo este año. Nueva imagen o identidad emergente. Tono equilibrado.",
      "superpoder": "40-60 palabras. Capacidad que se activa este año."
    },
    "medio_cielo": {
      "posicion": "${srMC?.sign}",
      "vocacion_soul": "60-80 palabras. Vocación o contribución que quiere emerger este año.",
      "legado": "40-60 palabras. Qué construyes para tu legado."
    }
  },

  "nodos_lunares": {
    "nodo_norte": {
      "signo_casa": "Describir posición",
      "direccion_evolutiva": "80 palabras. Hacia dónde evolucionar.",
      "desafio": "40 palabras. Qué requiere esfuerzo consciente."
    },
    "nodo_sur": {
      "signo_casa": "Describir posición",
      "zona_comfort": "80 palabras. Qué dominas pero ya no sirve.",
      "patron_repetitivo": "40 palabras. Ciclo a romper."
    }
  },

  "comparaciones_planetarias": {
    "sol": {
      "natal": {
        "posicion": "Describir signo y casa natal del Sol (ej: Leo Casa 10)",
        "descripcion": "80-100 palabras. ¿QUIÉN ERES en tu esencia? Tu propósito de vida base según la carta natal. ${natalInterpretations?.sol ? 'USAR INTERPRETACIÓN NATAL: ' + JSON.stringify(natalInterpretations.sol.interpretacion).substring(0, 200) + '...' : 'Generar interpretación de identidad permanente.'}"
      },
      "solar_return": {
        "posicion": "Describir signo (siempre el mismo) y CASA SR del Sol",
        "descripcion": "80-100 palabras. ¿QUÉ ÁREA DE VIDA SE ACTIVA este año? Dónde pones tu energía vital. El Sol SIEMPRE está en el mismo signo natal, pero la CASA SR cambia."
      },
      "choque": "120-150 palabras. ¿DÓNDE CHOCA O POTENCIA? Comparar quién eres (natal) vs dónde debes brillar este año (SR). Si natal Sol Casa 3 (comunicación) y SR Sol Casa 10 (vocación pública) → el choque es: 'Normalmente brillas hablando/escribiendo, pero este año debes brillar liderando públicamente'. Ser MUY específico con las casas reales.",
      "que_hacer": "100-120 palabras. ¿QUÉ CONVIENE HACER AHORA? Acción concreta basada en el choque. NO consejos genéricos. Ejemplo: 'No te quedes solo compartiendo ideas (tu zona cómoda Casa 3), comprométete con proyectos visibles donde tengas que liderar (Casa 10 SR).'",
      "uso_agenda": {
        "luna_nueva": "60-80 palabras. ¿Qué iniciar en cada Luna Nueva para honrar este entrenamiento solar?",
        "luna_llena": "60-80 palabras. ¿Qué revisar/liberar en cada Luna Llena? ¿Estás evitando el área de vida activada?",
        "retrogradaciones": "60-80 palabras. ¿Cómo usar las retrogradaciones para integrar el cambio?"
      },
      "error_automatico": "Una frase de 15-25 palabras. El error más común que cometerás este año si actúas en automático. Ejemplo: 'Refugiarte en tu zona cómoda en lugar de asumir liderazgo visible.'",
      "frase_clave": "Una frase de 10-15 palabras. Mantra funcional del año. Ejemplo: 'Mi voz importa, pero este año la sostengo con presencia pública.'"
    },
    "luna": {
      "natal": {
        "posicion": "Signo y casa natal de Luna",
        "descripcion": "80-100 palabras. ¿CÓMO ERES EMOCIONALMENTE? Tu mundo emocional base. ${natalInterpretations?.luna ? 'USAR INTERPRETACIÓN NATAL: ' + JSON.stringify(natalInterpretations.luna.interpretacion).substring(0, 200) + '...' : 'Generar interpretación emocional permanente.'}"
      },
      "solar_return": {
        "posicion": "Signo y casa SR de Luna",
        "descripcion": "80-100 palabras. ¿QUÉ NECESITAS EMOCIONALMENTE este año? Dónde buscas seguridad emocional durante este ciclo."
      },
      "choque": "120-150 palabras. Comparar necesidad emocional natal vs necesidad emocional SR. Ejemplo: Natal Luna Cáncer Casa 4 (necesitas hogar/familia) vs SR Luna Capricornio Casa 10 (necesitas logros/estructura). El choque: 'Normalmente te sientes segura en casa, pero este año necesitas sentirte segura logrando cosas públicamente.'",
      "que_hacer": "100-120 palabras. ¿Qué hacer con esta tensión emocional? Ejemplo: 'No evites los compromisos profesionales por quedarte en casa. Tu nutrición emocional ESTE AÑO viene de construir algo sólido afuera.'",
      "uso_agenda": {
        "luna_nueva": "60-80 palabras. Rituales emocionales para Luna Nueva.",
        "luna_llena": "60-80 palabras. Liberación emocional en Luna Llena.",
        "retrogradaciones": "60-80 palabras. Integración emocional en retros."
      },
      "error_automatico": "15-25 palabras. Error emocional típico del año.",
      "frase_clave": "10-15 palabras. Mantra emocional."
    },
    "mercurio": {
      "natal": {
        "posicion": "Signo y casa natal de Mercurio",
        "descripcion": "80-100 palabras. ¿CÓMO PIENSAS Y TE COMUNICAS NORMALMENTE? ${natalInterpretations?.mercurio ? 'USAR INTERPRETACIÓN NATAL: ' + JSON.stringify(natalInterpretations.mercurio.interpretacion).substring(0, 200) + '...' : 'Generar interpretación mental permanente.'}"
      },
      "solar_return": {
        "posicion": "Signo y casa SR de Mercurio",
        "descripcion": "80-100 palabras. ¿DÓNDE Y CÓMO DEBES PENSAR/COMUNICAR este año?"
      },
      "choque": "120-150 palabras. Comparar estilo mental natal vs estilo mental SR. Ejemplo: Natal Mercurio Piscis Casa 1 (piensas intuitivamente, hablas desde la sensibilidad) vs SR Mercurio Acuario Casa 12 (este año tu mente necesita distancia, silencio, visión objetiva). Choque: 'Normalmente piensas sintiendo, pero este año necesitas pensar desde el distanciamiento.'",
      "que_hacer": "100-120 palabras. Acción mental concreta.",
      "uso_agenda": {
        "luna_nueva": "60-80 palabras.",
        "luna_llena": "60-80 palabras.",
        "retrogradaciones": "60-80 palabras. ESPECIALMENTE IMPORTANTE PARA MERCURIO."
      },
      "error_automatico": "15-25 palabras.",
      "frase_clave": "10-15 palabras."
    },
    "venus": {
      "natal": {
        "posicion": "Signo y casa natal de Venus",
        "descripcion": "80-100 palabras. ¿CÓMO AMAS Y QUÉ VALORAS? ${natalInterpretations?.venus ? 'USAR INTERPRETACIÓN NATAL: ' + JSON.stringify(natalInterpretations.venus.interpretacion).substring(0, 200) + '...' : 'Generar interpretación de valores permanente.'}"
      },
      "solar_return": {
        "posicion": "Signo y casa SR de Venus",
        "descripcion": "80-100 palabras. ¿QUÉ DEBES VALORAR Y CÓMO AMAR este año?"
      },
      "choque": "120-150 palabras. Comparar valores natales vs valores SR.",
      "que_hacer": "100-120 palabras.",
      "uso_agenda": {
        "luna_nueva": "60-80 palabras.",
        "luna_llena": "60-80 palabras.",
        "retrogradaciones": "60-80 palabras."
      },
      "error_automatico": "15-25 palabras.",
      "frase_clave": "10-15 palabras."
    },
    "marte": {
      "natal": {
        "posicion": "Signo y casa natal de Marte",
        "descripcion": "80-100 palabras. ¿CÓMO ACTÚAS Y ENFRENTAS LA VIDA? ${natalInterpretations?.marte ? 'USAR INTERPRETACIÓN NATAL: ' + JSON.stringify(natalInterpretations.marte.interpretacion).substring(0, 200) + '...' : 'Generar interpretación de acción permanente.'}"
      },
      "solar_return": {
        "posicion": "Signo y casa SR de Marte",
        "descripcion": "80-100 palabras. ¿DÓNDE Y CÓMO DEBES ACTUAR este año?"
      },
      "choque": "120-150 palabras. Comparar estilo de acción natal vs SR. Ejemplo: Natal Marte Tauro Casa 2 (actúas con paciencia, paso a paso) vs SR Marte Acuario Casa 11 (este año debes actuar rápido, experimentando, en grupo). Choque: 'Normalmente necesitas garantías antes de moverte, pero este año debes actuar sin certeza total.'",
      "que_hacer": "100-120 palabras.",
      "uso_agenda": {
        "luna_nueva": "60-80 palabras.",
        "luna_llena": "60-80 palabras.",
        "retrogradaciones": "60-80 palabras."
      },
      "error_automatico": "15-25 palabras.",
      "frase_clave": "10-15 palabras."
    },
    "jupiter": {
      "natal": {
        "posicion": "Signo y casa natal de Júpiter",
        "descripcion": "80-100 palabras. ¿DÓNDE CRECES Y QUÉ TE DA FE? ${natalInterpretations?.jupiter ? 'USAR INTERPRETACIÓN NATAL: ' + JSON.stringify(natalInterpretations.jupiter.interpretacion).substring(0, 200) + '...' : 'Generar interpretación de expansión permanente.'}"
      },
      "solar_return": {
        "posicion": "Signo y casa SR de Júpiter",
        "descripcion": "80-100 palabras. ¿DÓNDE SE EXPANDE TU VIDA este año?"
      },
      "choque": "120-150 palabras.",
      "que_hacer": "100-120 palabras.",
      "uso_agenda": {
        "luna_nueva": "60-80 palabras.",
        "luna_llena": "60-80 palabras.",
        "retrogradaciones": "60-80 palabras."
      },
      "error_automatico": "15-25 palabras.",
      "frase_clave": "10-15 palabras."
    },
    "saturno": {
      "natal": {
        "posicion": "Signo y casa natal de Saturno",
        "descripcion": "80-100 palabras. ¿DÓNDE ESTÁN TUS LÍMITES Y RESPONSABILIDADES BASE? ${natalInterpretations?.saturno ? 'USAR INTERPRETACIÓN NATAL: ' + JSON.stringify(natalInterpretations.saturno.interpretacion).substring(0, 200) + '...' : 'Generar interpretación de estructura permanente.'}"
      },
      "solar_return": {
        "posicion": "Signo y casa SR de Saturno",
        "descripcion": "80-100 palabras. ¿QUÉ DEBES ESTRUCTURAR/LIMITAR este año?"
      },
      "choque": "120-150 palabras.",
      "que_hacer": "100-120 palabras.",
      "uso_agenda": {
        "luna_nueva": "60-80 palabras.",
        "luna_llena": "60-80 palabras.",
        "retrogradaciones": "60-80 palabras."
      },
      "error_automatico": "15-25 palabras.",
      "frase_clave": "10-15 palabras."
    }
  },

  "analisis_tecnico_profesional": {
    "asc_sr_en_casa_natal": {
      "casa": ${ascSRenCasaNatal},
      "signo_asc_sr": "${srAsc?.sign}",
      "significado": "150-200 palabras. METODOLOGÍA SHEA. Explica POR QUÉ esta casa marca el tema del año. Cómo se manifestará. Lenguaje profesional pero accesible.",
      "area_vida_dominante": "Nombre del área de vida"
    },
    "sol_en_casa_sr": {
      "casa": ${srSol?.house},
      "significado": "100-120 palabras. METODOLOGÍA TEAL. Centro vital del año."
    },
    "planetas_angulares_sr": [
      ${planetasAngularesSR.length > 0 ? planetasAngularesSR.map(p => `{
        "planeta": "${p.planeta}",
        "angulo": "${p.angulo}",
        "casa": ${p.casa},
        "interpretacion": "80-100 palabras. METODOLOGÍA LOUIS. Por qué dominará el año."
      }`).join(',\n      ') : ''}
    ],
    "aspectos_cruzados_natal_sr": [
      {
        "aspecto": "Describir aspecto",
        "interpretacion": "80 palabras. Impacto en el año."
      }
    ],
    "configuraciones_especiales": [
      {
        "tipo": "Tipo de configuración",
        "planetas": ["Planeta1", "Planeta2"],
        "significado": "80 palabras."
      }
    ]
  },

  "plan_accion": {
    "trimestre_1": {
      "foco": "Enfoque principal Q1",
      "acciones": ["Acción 1", "Acción 2", "Acción 3"]
    },
    "trimestre_2": {
      "foco": "Enfoque principal Q2",
      "acciones": ["Acción 1", "Acción 2", "Acción 3"]
    },
    "trimestre_3": {
      "foco": "Enfoque principal Q3",
      "acciones": ["Acción 1", "Acción 2", "Acción 3"]
    },
    "trimestre_4": {
      "foco": "Enfoque principal Q4",
      "acciones": ["Acción 1", "Acción 2", "Acción 3"]
    }
  },

  "calendario_lunar_anual": [
    {
      "mes": "Mes ${returnYear}",
      "luna_nueva": {
        "fecha": "YYYY-MM-DD aproximada",
        "signo": "Signo",
        "mensaje": "50 palabras. Qué plantar/iniciar."
      },
      "luna_llena": {
        "fecha": "YYYY-MM-DD aproximada",
        "signo": "Signo",
        "mensaje": "50 palabras. Qué culmina/liberar."
      }
    }
    // Repetir para 12 meses
  ],

  "declaracion_poder_anual": "Una declaración en primera persona, 30-50 palabras. Usa SOLO el primer nombre. Ejemplo: 'Yo, [NOMBRE], abrazo este nuevo ciclo con apertura y valentía. Este año me comprometo a...' SIN mayúsculas excesivas.",

  "advertencias": [
    "Advertencia 1: Patrón autodestructivo posible. Lenguaje equilibrado.",
    "Advertencia 2: Sombra o desafío potencial.",
    "Advertencia 3: Trampa a evitar."
  ],

  "eventos_clave_del_anio": [
    {
      "periodo": "Mes X-Y ${returnYear}",
      "evento": "Nombre del evento",
      "tipo": "Personal/Profesional/Relacional",
      "descripcion": "100 palabras sobre qué esperar",
      "planetas_involucrados": ["Planeta1"],
      "accion_recomendada": "Qué hacer"
    }
  ],

  "insights_transformacionales": [
    "Insight 1 (15-25 palabras). Lenguaje equilibrado.",
    "Insight 2",
    "Insight 3",
    "Insight 4"
  ],

  "rituales_recomendados": [
    "Ritual 1: Descripción completa",
    "Ritual 2",
    "Ritual 3"
  ],

  "pregunta_final_reflexion": "Una pregunta poderosa (15-25 palabras) para reflexionar durante el año. Sin lenguaje agresivo.",

  "integracion_final": {
    "sintesis": "150-180 palabras. Cómo integrar TODO. Hilo conductor del año. Lenguaje humano, profesional, equilibrado. SIN gritos ni mayúsculas excesivas. Usa solo el primer nombre.",
    "pregunta_reflexion": "Una pregunta enfocada en la acción: '¿Qué pequeño paso puedes dar HOY que honre la dirección de este año?'"
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

### 🔥 COMPARACIONES PLANETARIAS (CRÍTICO):
9. **LAS COMPARACIONES SON OBLIGATORIAS**: Cada planeta debe tener las 4 partes:
   - ¿QUIÉN ERES? (natal - identidad permanente)
   - ¿QUÉ SE ACTIVA? (solar return - área del año)
   - ¿DÓNDE CHOCA O POTENCIA? (comparación específica)
   - ¿QUÉ HACER? (acción concreta, NO consejos genéricos)

10. **USA LAS INTERPRETACIONES NATALES SI EXISTEN**: ${natalInterpretations ? 'SE HAN PROPORCIONADO INTERPRETACIONES NATALES. ÚSALAS en la sección "natal.descripcion" de cada planeta. Extrae la esencia de la interpretación natal y úsala como base para la comparación.' : 'No hay interpretaciones natales guardadas. Genera descripciones de identidad permanente basándote en los datos de la carta natal.'}

11. **SÉ MUY ESPECÍFICO CON LAS CASAS**:
    - Natal Sol Casa 3 vs SR Sol Casa 10 → "Normalmente brillas comunicando (Casa 3), pero este año debes brillar liderando públicamente (Casa 10)"
    - Natal Luna Casa 4 vs SR Luna Casa 10 → "Normalmente te nutres en casa (Casa 4), pero este año necesitas logros públicos (Casa 10)"
    - Evita generalidades como "este año será intenso"

12. **USO_AGENDA ES PARA CAPA 3**: Esta sección prepara el contenido para la Agenda Astrológica (Layer 3). Debe indicar cómo usar cada ciclo lunar para integrar el aprendizaje del año.

### FORMATO:
13. **JSON VÁLIDO**: Sin comentarios, sin markdown dentro del JSON
14. **TODO EN ESPAÑOL**: Incluso nombres de planetas y signos
15. **RESPETA LA ESTRUCTURA**: No añadas ni quites campos del JSON

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
