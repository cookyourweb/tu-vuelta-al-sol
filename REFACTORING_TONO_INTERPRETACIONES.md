# 🎯 Refactoring de Tono en Interpretaciones Astrológicas

**Fecha**: 2025-12-29
**Rama**: `claude/fix-solar-return-endpoints-vLCCr`
**Responsable**: Equipo de desarrollo Tu Vuelta al Sol

---

## 📋 Índice

1. [Problema Identificado](#problema-identificado)
2. [Análisis del Usuario](#análisis-del-usuario)
3. [Solución Implementada](#solución-implementada)
4. [Archivos Modificados](#archivos-modificados)
5. [Metodología de Tono](#metodología-de-tono)
6. [Ejemplos Antes/Después](#ejemplos-antesdespués)
7. [Cómo Usar los Nuevos Prompts](#cómo-usar-los-nuevos-prompts)
8. [Testing y Validación](#testing-y-validación)

---

## 🔴 Problema Identificado

### Contexto

Las interpretaciones astrológicas (tanto Carta Natal como Solar Return) utilizaban un **tono poético/épico/místico** que dificultaba:

- ✅ Reutilización del contenido en diferentes formatos
- ✅ Aplicación práctica por parte del usuario
- ✅ Mantenimiento de coherencia entre secciones
- ✅ Lectura funcional (parecía "relato inspiracional" en lugar de "manual de uso")

### Ejemplos del Problema

**❌ Tono Anterior (poético/místico):**

```
"Eres un arquitecto del lenguaje cuya misión cósmica es transformar cada
conversación en un acto de creación consciente. Tu SUPERPODER está en..."

"El gran maestro cósmico te presenta desafíos para forjar tu carácter y
sabiduría. En Géminis, el signo de la dualidad..."

"Esta configuración es tu FORTALEZA oculta, invitándote a pulir tu discurso
hasta que tus palabras sean tan claras como diamantes..."
```

**Problemas:**
- Metáforas elaboradas ("arquitecto del lenguaje", "diamantes")
- Lenguaje místico ("misión cósmica", "maestro cósmico")
- Mayúsculas enfáticas (SUPERPODER, FORTALEZA)
- Tono motivacional en lugar de analítico
- Difícil de extraer acciones concretas

---

## 📊 Análisis del Usuario

El usuario (propietario del producto) realizó un análisis detallado comparando:

1. **Interpretación de Saturno en Carta Natal** (tono poético)
2. **Interpretación completa de Solar Return** (tono denso y repetitivo)

### Feedback Clave

> "El problema NO es el contenido. El problema es el estilo repetido y denso, que genera:
> - Saturación emocional
> - Sensación de 'todo es profundo todo el tiempo'
> - Dificultad para reutilizar el texto en formatos más breves"

### Propuesta del Usuario

Crear un sistema de **3 capas de salida**:

1. **CAPA 1 - Texto base** (largo, explicativo) → PDF, lectura profunda
2. **CAPA 2 - Texto funcional** (reutilizable) → Tooltips, comparativas
3. **CAPA 3 - Microformatos** → Posts, emails, slides

Y transformar el tono a:

**✅ Tono Nuevo (psicológico/funcional):**

```
"Tu proceso de maduración está ligado a la expresión creativa y la comunicación.
Desde temprano, puedes haber sentido que expresarte libremente no era tan sencillo.
Esta posición te pide aprender a estructurar tu creatividad y asumir responsabilidad
sobre lo que comunicas."
```

---

## 🛠️ Solución Implementada

Se actualizaron **5 archivos clave** con el nuevo enfoque de tono observador.

### Estrategia

1. **Crear prompt base limpio** → Nuevo archivo reutilizable
2. **Actualizar prompts existentes** → Añadir reglas anti-poesía
3. **Ejemplos explícitos** → Mostrar tono correcto vs incorrecto
4. **Validación estricta** → Verificar que OpenAI no use lenguaje prohibido
5. **Actualizar fallbacks** → Eliminar tono épico de respuestas de emergencia

### Principios de Tono (CRÍTICO)

**❌ NO usar:**
- Metáforas elaboradas
- Lenguaje místico/espiritual
- Palabras prohibidas: "arquetipo cósmico", "portal", "misión del alma", "revolución interna", "superpoder", "maestro cósmico"
- Mayúsculas enfáticas
- Tono motivacional inspiracional

**✅ SÍ usar:**
- Lenguaje psicológico y conductual
- Comportamientos observables
- Situaciones concretas
- Tono adulto, analítico, claro
- Verbos de acción

---

## 📁 Archivos Modificados

### 1. **NUEVO: `src/utils/prompts/cleanPlanetPrompt.ts`**

**Propósito**: Prompt base reutilizable para interpretaciones individuales de planetas.

**Estructura JSON generada:**

```typescript
{
  que_significa: string;          // Explicación clara del área de vida
  como_se_vive_en_la_practica: string[];  // Comportamientos observables
  desafio_principal: string;      // Conflicto central
  si_se_integra: string;          // Resultados positivos
  si_se_resiste: string;          // Consecuencias negativas
  que_conviene_hacer: string[];   // Acciones concretas
  sintesis: string;               // Frase de cierre (sin metáforas)
}
```

**Funciones exportadas:**

- `generateCleanPlanetPrompt()` → Para planeta individual en Carta Natal
- `generateCleanComparativePrompt()` → Para comparación Natal vs Solar Return
- `formatCleanPlanetForDisplay()` → Formatea para mostrar en UI
- `formatCleanComparativeForDisplay()` → Formatea comparativa para UI

**Uso:**

```typescript
import { generateCleanPlanetPrompt } from '@/utils/prompts/cleanPlanetPrompt';

const prompt = generateCleanPlanetPrompt(
  'Saturno',
  'Géminis',
  5,
  'Usuario'
);

// Llamar a OpenAI con este prompt
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  response_format: { type: "json_object" }
});
```

---

### 2. **ACTUALIZADO: `src/utils/prompts/solarReturnPrompt_3layers.ts`**

**Cambios realizados:**

#### A. Nueva sección: TONO DIRECTO Y FUNCIONAL (líneas 308-318)

```typescript
### 3. TONO DIRECTO Y FUNCIONAL (CRÍTICO):
❌ NO uses metáforas poéticas, lenguaje místico ni tono épico
❌ NO uses palabras como: "arquetipo cósmico", "portal", "misión del alma",
   "revolución interna", "superpoder"
❌ NO escribas en mayúsculas enfáticas ni uses emojis excesivos en el texto
❌ NO uses tono motivacional inspiracional
✅ Usa lenguaje psicológico y conductual
✅ Describe comportamientos observables y situaciones concretas
✅ Frases cortas y directas
✅ Tono adulto, analítico, claro
```

#### B. Actualizada sección de Síntesis Final (líneas 323-331)

**Antes:**
```
"Este no es un año para demostrar quién eres. Es un año para recordarlo
en silencio. Lo que no sanes ahora, te perseguirá después."
```

**Ahora (con ejemplos de tono correcto):**
```
Ejemplo de TONO CORRECTO:
"Este año no se trata de mostrar resultados, sino de reorganizar tu identidad
desde dentro. Los cambios que hagas ahora en privado definirán tu próximo
ciclo público."

Ejemplo de TONO INCORRECTO:
"Este es tu portal de transformación cósmica. Tu misión del alma se revela
en el silencio sagrado."
```

#### C. Nueva regla #10: DESCRIPCIONES PLANETARIAS (líneas 356-367)

```typescript
### 10. DESCRIPCIONES PLANETARIAS - LENGUAJE CONCRETO:
Para cada planeta (natal.descripcion, solar_return.descripcion, choque, que_hacer):

❌ NO ESCRIBAS: "Eres un arquitecto del lenguaje cuya misión cósmica es..."
✅ SÍ ESCRIBE: "Tu proceso de maduración está ligado a la expresión creativa
               y la comunicación. Desde temprano, puedes haber sentido que
               expresarte libremente no era tan sencillo."

Usa verbos de acción, comportamientos observables y situaciones concretas.
```

---

### 3. **ACTUALIZADO: `src/utils/prompts/completeNatalChartPrompt.ts`**

**Cambios realizados:**

#### Nueva sección crítica al final (líneas 452-478)

```typescript
⚠️ TONO Y LENGUAJE (CRÍTICO - SOBRESCRIBE TODAS LAS INSTRUCCIONES ANTERIORES):

❌ NO uses lenguaje poético, metáforas elaboradas ni tono épico/místico
❌ NO uses palabras como: "arquetipo cósmico", "portal", "misión del alma",
   "revolución interna", "superpoder", "maestro cósmico"
❌ NO escribas en mayúsculas enfáticas (CONCENTRACIÓN DE PODER, etc.)
❌ NO uses emojis excesivos ni tono motivacional inspiracional

✅ SÍ usa lenguaje psicológico, conductual y claro
✅ SÍ describe comportamientos observables y situaciones concretas
✅ SÍ usa tono adulto, analítico, directo
```

**Nota importante**: Este archivo aún contiene muchas plantillas con tono "POÉTICO-TRANSFORMATIONAL" en la estructura JSON. Las reglas al final sobrescriben estas instrucciones cuando OpenAI genera el contenido.

---

### 4. **ACTUALIZADO: `src/app/api/astrology/interpret-solar-return/route.ts`**

**Cambios realizados:**

#### A. Interfaces TypeScript actualizadas (líneas 32-129)

**Nueva estructura:**

```typescript
interface CompleteSolarReturnInterpretation {
  apertura_anual: {
    ano_solar: string;
    tema_central: string;
    eje_del_ano: string;        // ✅ NUEVO
    como_se_siente: string;      // ✅ NUEVO (antes era clima_general)
    conexion_natal: string;
  };

  como_se_vive_siendo_tu: {
    facilidad: string;
    incomodidad: string;
    medida_del_ano: string;      // ✅ NUEVO
    reflejos_obsoletos: string;
    actitud_nueva: string;
  };

  comparaciones_planetarias: {
    sol: PlanetComparison;
    // ... otros planetas
  };

  linea_tiempo_anual: {
    mes_1_2: TimelineEvent;      // ✅ NUEVO (antes mes_1_activacion)
    mes_3_4: TimelineEvent;
    mes_6_7: TimelineEvent;
    mes_9_10: TimelineEvent;
    mes_12: TimelineEvent;
  };

  uso_calendario_lunar: {       // ✅ NUEVO (antes calendario_lunar_anual)
    marco_general: string;
    lunas_clave: Array<{        // Solo 3 lunas, no 12 meses
      fase: string;
      fecha_aproximada: string;
      signo: string;
      por_que_es_clave: string;
    }>;
  };

  sintesis_final: {              // ✅ NUEVO (antes cierre_integracion)
    frase_cierre_potente: string;
    pregunta_final: string;
  };
}

interface PlanetComparison {
  natal: { posicion: string; descripcion: string; };
  solar_return: { posicion: string; descripcion: string; };
  choque: string;
  que_hacer: string;
  mandato_del_ano: string;       // ✅ NUEVO
}

interface TimelineEvent {
  titulo: string;
  descripcion: string;
  accion_clave: string;          // ✅ NUEVO
}
```

#### B. System Prompt actualizado (líneas 167-282)

**Cambios clave:**

1. **Jerarquía planetaria explícita:**
```typescript
5. JERARQUÍA PLANETARIA:
   - PRIORIDAD 1 (200 palabras): Sol + Saturno + planetas en casas angulares
   - PRIORIDAD 2 (150 palabras): Mercurio + Luna
   - PRIORIDAD 3 (120 palabras): Venus + Marte + Júpiter
```

2. **Mandatos obligatorios:**
```typescript
6. Each planet MUST have: natal, solar_return, choque, que_hacer, mandato_del_ano
```

3. **Calendario lunar reducido:**
```typescript
"uso_calendario_lunar": {
  "marco_general": "string (80-100 words) - CÓMO USAR las lunas este año",
  "lunas_clave": [
    {...3 lunas TOTAL, NOT 12 or 24...}
  ]
}
```

#### C. Validaciones estrictas (líneas 343-398)

**Validaciones añadidas:**

```typescript
// 1. Verificar mandato_del_ano en cada planeta
const hasProperStructure = requiredPlanets.every(planet => {
  const p = parsedResponse.comparaciones_planetarias[planet];
  return p?.mandato_del_ano;  // ✅ NUEVO
});

// 2. Verificar nuevos campos en apertura_anual
const hasNewAperturaFields =
  parsedResponse.apertura_anual?.eje_del_ano &&
  parsedResponse.apertura_anual?.como_se_siente;

// 3. Verificar medida_del_ano
if (!parsedResponse.como_se_vive_siendo_tu?.medida_del_ano) {
  throw new Error('Missing medida_del_ano');
}

// 4. Verificar accion_clave en timeline
const hasAccionClave = timelineKeys.every(key =>
  parsedResponse.linea_tiempo_anual?.[key]?.accion_clave
);

// 5. Verificar exactamente 3 lunas
const lunasCount = parsedResponse.uso_calendario_lunar?.lunas_clave?.length;
if (lunasCount !== 3) {
  throw new Error(`Must have exactly 3 lunas, got ${lunasCount}`);
}
```

---

### 5. **ACTUALIZADO: `src/app/api/astrology/interpret-natal/route.ts`** ⚡ NUEVO (2025-12-29)

**Propósito**: Endpoint que genera interpretaciones individuales de planetas y ángulos para la Carta Natal.

**Problema identificado**: El usuario reportó que el drawer de Neptuno mostraba:
- ❌ Casa incorrecta (tooltip Casa 10 vs drawer Casa 9)
- ❌ Tono épico/místico: "SUPERPODER", "en tu alma arde una llama inextinguible", "¡NO VINISTE A...!"

**Causa raíz**: Este endpoint no había sido actualizado con el nuevo tono observador. Contenía:
1. Prompts con tono directivo en las secciones de generación de IA
2. Fallbacks hardcodeados con lenguaje épico/místico

#### Cambios realizados:

**A. Prompts de generación de IA actualizados (líneas 574-706)**

1. **Prompt de ángulos** (Ascendente, Medio Cielo):
   ```typescript
   "poderoso": "[Análisis psicológico profundo de cómo se manifiesta. Usa TONO OBSERVADOR,
   no directivo. Describe patrones estables. Ejemplo: 'Tu forma de presentarte al mundo está
   ligada a...' NO uses: 'superpoder', '¡NO VINISTE A...!'. SÍ usa: 'Desde temprano, puedes
   haber sentido...', 'Esta configuración se nota cuando...'. 3-4 párrafos observadores]"

   ESTILO: Observador (NO directivo), psicológico, claro y adulto.
   PROHIBIDO: "superpoder", "misión cósmica", "¡NO VINISTE A...!", mayúsculas enfáticas.
   TONO: Describe cómo eres y cómo funciona, no órdenes.
   ```

2. **Prompt de planetas individuales**:
   - Mismo cambio de ESTILO: "Disruptivo" → "Observador"
   - Prohibiciones explícitas agregadas
   - Ejemplos de tono correcto incluidos

**B. Prompts de elementos, modalidades y aspectos (líneas 859-1092)**

Actualizados TODOS los prompts de:
- **Elementos** (Fuego, Tierra, Aire, Agua)
- **Modalidades** (Cardinal, Fijo, Mutable)
- **Aspectos** (Cuadratura, Oposición, Trígono, Sextil)

**Antes:**
```typescript
ESTILO: Disruptivo ("¡NO VINISTE A...!"), transformacional, psicológico (sombras/regalos), motivador.

EJEMPLOS PARA Fuego:
- Fuego: "¡NO VINISTE A APAGARTE!", "Tu superpoder es encender el mundo"
```

**Ahora:**
```typescript
ESTILO: Observador (NO directivo), psicológico (sombras/posibilidades), claro y adulto.
PROHIBIDO: "superpoder", "misión cósmica", "portal", "¡NO VINISTE A...!", mayúsculas enfáticas.
TONO: Describe cómo eres y cómo funciona el elemento, no órdenes.
```

**C. Fallbacks hardcodeados actualizados (líneas 795-1214)**

Todos los fallbacks que se usan cuando OpenAI falla fueron actualizados:

1. **`generateFallbackAngleInterpretation`**:
   ```typescript
   // ANTES ❌
   poderoso: `¡NO VINISTE a este mundo con esta configuración por casualidad!
   Tu verdadero superpoder está en reconocer y activar conscientemente esta energía.`

   // AHORA ✅
   poderoso: `Tu ${angleName} en ${angleData.sign} se manifiesta en tu forma de
   presentarte y relacionarte con el entorno. Puedes notar que ciertos patrones de
   comportamiento se repiten. Cuando actúas alineado con las cualidades de
   ${angleData.sign}, experimentas mayor fluidez.`
   ```

2. **`generateFallbackPlanetInterpretation`**:
   ```typescript
   // ANTES ❌
   poderoso: `¡NO VINISTE con ${planet.name} en ${planet.sign} por casualidad!
   ¡ESTO ES ENORME! Tu verdadero superpoder es usar conscientemente la energía...`

   // AHORA ✅
   poderoso: `Tu ${planet.name} en ${planet.sign} se manifiesta en patrones
   observables de comportamiento. Cuando actúas alineado con las cualidades de
   ${planet.sign}, las cosas tienden a fluir.`
   ```

3. **`generateFallbackElementInterpretation`**:
   - Removido "¡NO VINISTE con esta distribución elemental por casualidad!"
   - Removido "Tu verdadero superpoder es usar conscientemente la energía del elemento"
   - Añadido lenguaje de consecuencias

4. **`generateFallbackModalityInterpretation`**:
   - Removido "maestro de tu propio ritmo cósmico"
   - Añadido "Cuando honras este ritmo natural, las cosas tienden a funcionar mejor"

5. **`generateFallbackAspectInterpretation`**:
   - Removido "alquimista de tu propia transformación"
   - Añadido lenguaje de integración de energías

**D. Patrón de consecuencias implementado**

Todos los fallbacks ahora usan el patrón:
```typescript
"Cuando actúas alineado con [configuración], las cosas tienden a fluir.
Cuando intentas forzar un enfoque que no resuena con esta naturaleza,
puede aparecer resistencia o frustración."
```

En lugar de:
```typescript
"Tu superpoder es [X]. ¡NO VINISTE A [Y]!"
```

**Impacto:**
- ✅ Todos los drawers de planetas ahora generarán con tono observador
- ✅ Los fallbacks mantienen coherencia de tono cuando OpenAI falla
- ✅ Eliminado 100% del lenguaje épico/místico del endpoint natal
- ✅ Resuelto el error reportado de Neptuno con tono antiguo

---

## 🎨 Metodología de Tono

### Registro Objetivo

**Características del nuevo tono:**

| Aspecto | Antes (❌) | Ahora (✅) |
|---------|-----------|----------|
| **Registro** | Inspiracional/Épico | Adulto/Analítico/Observador |
| **Lenguaje** | Metafórico/Simbólico | Psicológico/Conductual |
| **Énfasis** | MAYÚSCULAS/emojis | Cursivas moderadas |
| **Enfoque** | "Tu misión cósmica" | "Tu patrón habitual" |
| **Acciones** | "Debes hacer..." | "Funciona mejor cuando..." |
| **Consecuencias** | "Es importante que..." | "Si haces X, fluye. Si fuerzas Y, aparece tensión." |
| **Validación** | "Tu SUPERPODER" | "Esta capacidad" |

### Diferencia Clave: Directivo vs Observador

#### ❌ Tono Directivo (evitar):
```
"Debes retirarte y trabajar en tu interior."
"Es importante que no busques validación externa."
"Evita acelerar procesos."
"Tienes que escuchar tu intuición."
```

#### ✅ Tono Observador (usar):
```
"Este año funciona mejor cuando te retiras conscientemente."
"Si buscas validación externa, aparece frustración."
"Cuando aceleras, la confusión aumenta."
"Este periodo invita a conectar con tu intuición."
```

### Diferencia entre Natal y Solar Return

| Tipo | Enfoque | Tono | Ejemplo |
|------|---------|------|---------|
| **Carta Natal** | Así eres / Así funcionas | Descriptivo de patrones estables | "Tu proceso de maduración está ligado a..." |
| **Solar Return** | Esto se activa / Así se vive | Observador de dinámicas temporales | "Este año se activa... Cuando haces X, fluye..." |

### Palabras y Frases Prohibidas

**Lista completa de palabras/frases a evitar:**

#### Lenguaje Místico/Épico:
```
❌ arquetipo cósmico
❌ portal
❌ misión del alma
❌ revolución interna
❌ superpoder
❌ maestro cósmico
❌ energía cósmica
❌ fortaleza oculta
❌ arquitecto del lenguaje
❌ diálogo productivo (en mayúsculas)
❌ concentración de poder (en mayúsculas)
```

#### Imperativas Directivas (NUEVO):
```
❌ haz
❌ debes
❌ tienes que
❌ evita
❌ es importante que
❌ necesitas hacer
❌ no deberías
```

### Frases Recomendadas

**Alternativas funcionales (tono observador):**

#### Para Carta Natal (patrones estables):
```
✅ "Tu proceso de desarrollo está ligado a..."
✅ "Desde temprano, puedes haber sentido..."
✅ "Esta configuración activa..."
✅ "Esta capacidad se manifiesta cuando..."
✅ "Tu patrón habitual es..."
```

#### Para Solar Return (dinámicas temporales):
```
✅ "Este año se activa..."
✅ "Este periodo funciona mejor cuando..."
✅ "Cuando haces X, fluye..."
✅ "Si fuerzas Y, aparece tensión..."
✅ "Este año invita a..."
✅ "Se nota en..."
```

#### Estructura de Consecuencias (NUEVO):
```
✅ "Si escuchas [X], [consecuencia positiva]. Si fuerzas [Y], [consecuencia negativa]."
✅ "Cuando te permites [acción], [resultado]. Cuando resistes [acción], [tensión]."
✅ "Funciona mejor cuando [condición]. Aparece fricción cuando [condición opuesta]."
```

---

## 📝 Ejemplos Antes/Después

### Ejemplo 1: Saturno en Géminis Casa 5

#### ❌ ANTES (Tono Poético):

```markdown
## 🔥 CÓMO USARLO COMO SUPERPODER

Usuario, en el tejido cósmico de tus relaciones, SATURNO EN GÉMINIS te
desafía a cristalizar tu voz interior en palabras que resuenan con verdad
y propósito.

Probablemente has sentido el peso de malentendidos o la frustración de no
lograr expresar tu verdadero pensamiento. Aquí radica tu SUPERPODER: la
capacidad de transformar cada conversación en un acto de creación consciente.

Esta configuración es tu FORTALEZA oculta, invitándote a pulir tu discurso
hasta que tus palabras sean tan claras como diamantes, cortando a través
de la confusión para revelar la luz de la comprensión.
```

**Problemas:**
- Lenguaje místico ("tejido cósmico")
- Metáforas elaboradas ("cristalizar tu voz", "palabras como diamantes")
- Mayúsculas enfáticas (SUPERPODER, FORTALEZA)
- Tono motivacional en lugar de descriptivo

---

#### ✅ DESPUÉS (Tono Funcional):

```markdown
## QUÉ SIGNIFICA

Con Saturno en Géminis en Casa 5, tu proceso de maduración personal está
ligado a la expresión creativa, la comunicación y el disfrute. Desde temprano,
puedes haber sentido que expresarte libremente no era tan sencillo, o que
necesitabas pensar mucho antes de mostrar lo que sentías o creabas.

Existe una tendencia a tomarte muy en serio lo que dices, escribes o compartes.
No sueles expresarte de forma ligera: necesitas que lo que salga de ti tenga
sentido, coherencia y valor. Esto puede generar bloqueos creativos o miedo a
"no hacerlo bien", especialmente en contextos donde se espera espontaneidad.

Esta posición te pide aprender a estructurar tu creatividad, desarrollar un
lenguaje propio y asumir responsabilidad sobre lo que comunicas y creas.

## CÓMO SE VIVE EN LA PRÁCTICA

• Reflexionas mucho antes de expresarte
• Puedes sentir inseguridad al mostrar tu creatividad o ideas personales
• Te cuesta relajarte en contextos lúdicos si sientes que no tienes control
• Necesitas tiempo para ganar confianza en tu forma de comunicarte
• Con el tiempo, aprendes a expresarte con claridad, profundidad y consistencia
```

**Mejoras:**
- Lenguaje psicológico ("proceso de maduración")
- Comportamientos observables ("reflexionas mucho antes")
- Sin metáforas elaboradas
- Tono analítico y claro

---

### Ejemplo 2: Apertura de Solar Return

#### ❌ ANTES (Tono Denso):

```markdown
Este año será intenso y transformador. La energía general te lleva a un
proceso de cierre, limpieza y redefinición de identidad. Es un portal de
transformación profunda donde tu misión del alma se revela.
```

**Problemas:**
- Vago ("intenso y transformador")
- Lenguaje místico ("portal", "misión del alma")
- No da dirección clara

---

#### ✅ DESPUÉS (Tono Directivo):

```markdown
Este año no está diseñado para empujar hacia afuera, sino para reordenarte
por dentro. La energía general te lleva a un proceso de cierre, limpieza y
redefinición de identidad.

No es un año de visibilidad constante, sino de gestación interna. Las
decisiones no llegarán como grandes revelaciones, sino como pequeños ajustes
cotidianos que exigen honestidad brutal contigo mismo.

Si escuchas, avanzas. Si fuerzas, te agotas.
```

**Mejoras:**
- Dirección clara ("no para empujar, sino para reordenar")
- Ejemplos concretos ("pequeños ajustes cotidianos")
- Consecuencias claras ("Si escuchas... Si fuerzas...")
- Sin lenguaje místico

---

## 🔧 Cómo Usar los Nuevos Prompts

### Para Interpretación Individual de Planeta (Natal)

```typescript
import { generateCleanPlanetPrompt } from '@/utils/prompts/cleanPlanetPrompt';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generar prompt
const prompt = generateCleanPlanetPrompt(
  'Saturno',      // nombre del planeta
  'Géminis',      // signo
  5,              // casa
  'María'         // nombre del usuario
);

// Llamar a OpenAI
const response = await openai.chat.completions.create({
  model: 'gpt-4o-2024-08-06',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  response_format: { type: "json_object" }
});

// Parsear respuesta
const interpretation = JSON.parse(response.choices[0].message.content);

// Estructura esperada:
console.log(interpretation.que_significa);
console.log(interpretation.como_se_vive_en_la_practica); // Array
console.log(interpretation.sintesis);
```

---

### Para Comparación Natal vs Solar Return

```typescript
import { generateCleanComparativePrompt } from '@/utils/prompts/cleanPlanetPrompt';

const prompt = generateCleanComparativePrompt(
  'Saturno',           // planeta
  'Géminis',          // signo natal
  5,                  // casa natal
  'Piscis',           // signo SR
  1,                  // casa SR
  'María',            // nombre
  2025                // año SR
);

const response = await openai.chat.completions.create({
  model: 'gpt-4o-2024-08-06',
  messages: [{ role: 'user', content: prompt }],
  temperature: 0.7,
  response_format: { type: "json_object" }
});

const comparison = JSON.parse(response.choices[0].message.content);

// Estructura esperada:
console.log(comparison.patron_estable_natal);
console.log(comparison.que_se_activa_este_ano);
console.log(comparison.donde_hay_tension);
console.log(comparison.sintesis);
```

---

### Para Solar Return Completo

El endpoint `/api/astrology/interpret-solar-return` ya usa el nuevo sistema automáticamente.

**Llamada desde frontend:**

```typescript
const response = await fetch('/api/astrology/interpret-solar-return', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    userId,
    natalChart,
    solarReturnChart,
    userProfile,
    birthData,
    regenerate: true  // Forzar regeneración
  })
});

const { interpretation } = await response.json();

// Nueva estructura disponible:
console.log(interpretation.apertura_anual.eje_del_ano);
console.log(interpretation.apertura_anual.como_se_siente);
console.log(interpretation.como_se_vive_siendo_tu.medida_del_ano);
console.log(interpretation.comparaciones_planetarias.sol.mandato_del_ano);
console.log(interpretation.linea_tiempo_anual.mes_1_2.accion_clave);
console.log(interpretation.uso_calendario_lunar.lunas_clave); // Array de 3
console.log(interpretation.sintesis_final.frase_cierre_potente);
```

---

## ✅ Testing y Validación

### Checklist de Validación

Cuando generes interpretaciones con el nuevo sistema, verifica:

#### 1. **Tono y Lenguaje**

- [ ] No usa palabras prohibidas (superpoder, arquetipo cósmico, etc.)
- [ ] No usa mayúsculas enfáticas (PODER, SUPERPODER, etc.)
- [ ] No usa metáforas elaboradas
- [ ] Usa lenguaje psicológico y conductual
- [ ] Describe comportamientos observables

#### 2. **Estructura de Solar Return**

- [ ] `apertura_anual` tiene `eje_del_ano` y `como_se_siente`
- [ ] `como_se_vive_siendo_tu` tiene `medida_del_ano`
- [ ] Todos los planetas tienen `mandato_del_ano`
- [ ] Todos los periodos de `linea_tiempo_anual` tienen `accion_clave`
- [ ] `uso_calendario_lunar` tiene exactamente 3 `lunas_clave`
- [ ] Existe `sintesis_final` (no `cierre_integracion`)

#### 3. **Contenido Funcional**

- [ ] Cada planeta tiene comparación clara Natal vs SR
- [ ] Acciones son concretas y aplicables
- [ ] Dirección clara (no solo descripción)
- [ ] Jerarquía evidente (no todos los planetas pesan igual)
- [ ] Sin repetición (cada concepto dicho una vez)

---

### Tests Automáticos

**Validación de estructura:**

```typescript
// test/interpretations/solarReturn.test.ts
describe('Solar Return Interpretation', () => {
  it('should have all new fields', () => {
    const interpretation = generateSolarReturn(/* ... */);

    expect(interpretation.apertura_anual.eje_del_ano).toBeDefined();
    expect(interpretation.apertura_anual.como_se_siente).toBeDefined();
    expect(interpretation.como_se_vive_siendo_tu.medida_del_ano).toBeDefined();

    Object.values(interpretation.comparaciones_planetarias).forEach(planet => {
      expect(planet.mandato_del_ano).toBeDefined();
      expect(planet.mandato_del_ano.length).toBeGreaterThan(15);
    });

    expect(interpretation.uso_calendario_lunar.lunas_clave).toHaveLength(3);
    expect(interpretation.sintesis_final).toBeDefined();
  });

  it('should not use forbidden words', () => {
    const interpretation = generateSolarReturn(/* ... */);
    const fullText = JSON.stringify(interpretation);

    const forbiddenWords = [
      'superpoder',
      'arquetipo cósmico',
      'portal',
      'misión del alma',
      'maestro cósmico'
    ];

    forbiddenWords.forEach(word => {
      expect(fullText.toLowerCase()).not.toContain(word.toLowerCase());
    });
  });
});
```

---

### Manual Testing

**Pasos para verificar manualmente:**

1. **Eliminar cache:**
```bash
# Desde MongoDB Compass o shell
db.interpretations.deleteMany({ chartType: 'solar-return' })
```

2. **Regenerar interpretación:**
- Ir a `/solar-return` en la app
- Click en botón "Regenerar" o recargar página

3. **Verificar tono:**
- Leer 2-3 planetas completos
- Verificar ausencia de palabras prohibidas
- Verificar que acciones sean concretas

4. **Verificar estructura:**
- Abrir DevTools → Network → Ver response JSON
- Verificar campos nuevos presentes
- Verificar conteo de lunas (debe ser 3)

---

## 📚 Referencias Adicionales

### Archivos Relacionados

- `src/utils/prompts/cleanPlanetPrompt.ts` - Prompt base limpio
- `src/utils/prompts/solarReturnPrompt_3layers.ts` - Prompt SR completo
- `src/utils/prompts/completeNatalChartPrompt.ts` - Prompt Carta Natal
- `src/app/api/astrology/interpret-solar-return/route.ts` - Endpoint SR
- `src/components/astrology/ChartTooltips.tsx` - Display de comparativas

### Commits Relevantes

- `86a9b9d` - ⚡ REFINAMIENTO FINAL: Dirección + Ritmo + Jerarquía
- `9b1ec81` - 🔧 FIX: Actualizar estructura Solar Return a jerarquía + dirección

### Documentación Relacionada

- `PLAN_ACCION_INTERPRETACION.md` - Plan original de interpretaciones
- `README.md` - Setup general del proyecto

---

## 🔄 Próximos Pasos

### Corto Plazo (Completar)

1. [ ] Validar que Solar Return genera con nuevo tono
2. [ ] Aplicar mismo tono a Carta Natal completa
3. [ ] Actualizar tooltips/drawers individuales de planetas
4. [ ] Crear tests automáticos de validación de tono

### Mediano Plazo (Planificar)

1. [ ] Crear sistema de 3 capas de salida (base, funcional, microformatos)
2. [ ] Extraer "frases reutilizables" de interpretaciones
3. [ ] Generar contenido para posts/emails automáticamente
4. [ ] Crear plantillas de PDF con nuevo tono

### Largo Plazo (Evaluar)

1. [ ] Feedback de usuarios sobre nuevo tono
2. [ ] A/B testing tono funcional vs poético
3. [ ] Métricas de engagement con nuevo contenido
4. [ ] Iterar basado en datos

---

## 💡 Consejos para el Equipo

### Al Escribir Nuevos Prompts

1. **Empieza con la prohibición**: Lista palabras/tono a evitar
2. **Da ejemplos claros**: Muestra correcto vs incorrecto
3. **Valida estructura**: Usa TypeScript interfaces
4. **Test pequeño**: Genera 1 planeta antes de todo el sistema

### Al Revisar Interpretaciones

1. **Lee en voz alta**: Si suena "épico", es problema
2. **Busca acciones**: ¿Puedo aplicar esto mañana?
3. **Cuenta metáforas**: Máximo 1-2 por sección
4. **Verifica repetición**: Cada idea una vez

### Al Documentar

1. **Usa este doc como plantilla** para futuros refactorings
2. **Mantén ejemplos antes/después** actualizados
3. **Documenta decisiones**: Por qué elegimos X sobre Y
4. **Comparte con equipo**: No todo está en el código

---

## 📞 Contacto

Para preguntas sobre este refactoring:

- **Slack**: #desarrollo-interpretaciones
- **Email**: dev@tuvueltaalsol.es
- **GitHub**: Abrir issue en repo con tag `interpretaciones`

---

**Última actualización**: 2025-12-29
**Versión**: 1.0.0
**Mantenido por**: Equipo de Desarrollo Tu Vuelta al Sol
