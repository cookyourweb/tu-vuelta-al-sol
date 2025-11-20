# 🔧 DESARROLLO TÉCNICO - Sistema de Interpretación Astrológica

Documentación técnica para desarrolladores que trabajen en el sistema.

---

## 📚 TABLA DE CONTENIDOS

1. [Arquitectura General](#arquitectura-general)
2. [Cómo Funciona el Router de Prompts](#cómo-funciona-el-router-de-prompts)
3. [Crear un Nuevo Prompt Especializado](#crear-un-nuevo-prompt-especializado)
4. [Debugging y Testing](#debugging-y-testing)
5. [Optimización de Performance](#optimización-de-performance)
6. [Buenas Prácticas](#buenas-prácticas)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ ARQUITECTURA GENERAL

### Stack Tecnológico

```
Frontend:
- Next.js 15.3.5 (App Router)
- TypeScript
- React

Backend:
- Next.js API Routes
- OpenAI GPT-4o
- MongoDB + Mongoose (caché)

Astrología:
- Cálculos astrológicos (Swiss Ephemeris vía librería)
- Interpretaciones via LLM
```

### Flujo de Datos Completo

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USUARIO INTERACTÚA                                        │
│    - Click en planeta/ángulo en carta natal                  │
│    - Solicita sección global                                 │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. FRONTEND (React Component)                                │
│    - Detecta qué elemento se clickeó                         │
│    - Prepara payload con datos astrológicos                  │
│    - Hace fetch a API                                        │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. API ROUTE                                                 │
│    /api/astrology/interpret-natal (individual)               │
│    /api/astrology/interpret-natal-global (secciones)         │
│                                                              │
│    A) Valida request                                         │
│    B) Chequea caché MongoDB                                  │
│       ↓ Si existe → retorna cached                           │
│       ↓ Si NO existe → continúa                              │
│    C) Obtiene prompt especializado                           │
│    D) Llama a OpenAI                                         │
│    E) Parsea respuesta JSON                                  │
│    F) Guarda en caché                                        │
│    G) Retorna al frontend                                    │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. PROMPT ROUTER                                             │
│    natalElementPrompts.ts                                    │
│    natalGlobalPrompts.ts                                     │
│                                                              │
│    - Normaliza nombres de elementos                          │
│    - Detecta si hay prompt especializado                     │
│    - Si SÍ → retorna prompt específico                       │
│    - Si NO → retorna prompt genérico                         │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. OPENAI GPT-4o                                             │
│    - Recibe prompt (2000-3000 tokens)                        │
│    - Genera interpretación JSON (2000-3500 tokens)           │
│    - Sigue estructura exacta especificada en prompt          │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. FRONTEND RENDERIZA                                        │
│    - Drawer/Modal con pestañas                               │
│    - Secciones: Educativo | Poderoso | Poético              │
│    - Sombras expandibles                                     │
│    - Ejercicio descargable                                   │
│    - Declaración para imprimir                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧭 CÓMO FUNCIONA EL ROUTER DE PROMPTS

### Archivo: `src/utils/prompts/natalElementPrompts.ts`

#### Función Principal: `getSpecializedElementPrompt()`

```typescript
export function getSpecializedElementPrompt(
  elementType: 'planet' | 'angle' | 'asteroid' | 'node' | 'house',
  elementName: string,
  elementData: any,
  userProfile: any
): string {

  // PASO 1: Normalizar nombre
  // "Sun" → "Sol", "Chiron" → "Quirón", etc.
  const normalizedName = normalizeElementName(elementName);

  // PASO 2: Router con switch
  switch (normalizedName) {
    case 'Sol':
    case 'Sun':
      return getSolPrompt(elementData, userProfile);

    case 'Luna':
    case 'Moon':
      return getLunaPrompt(elementData, userProfile);

    // ... resto de casos

    default:
      // PASO 3: Fallback genérico si no hay especializado
      return getGenericPrompt(elementType, elementName, elementData, userProfile);
  }
}
```

#### ¿Por qué normalizar nombres?

**Problema:** Los datos astrológicos pueden venir en inglés o español dependiendo de:
- Librería de cálculo usada
- Configuración del usuario
- Migración de datos antiguos

**Solución:** Función `normalizeElementName()` que mapea todos los nombres posibles a un nombre canónico:

```typescript
function normalizeElementName(name: string): string {
  const normalizations: Record<string, string> = {
    // Inglés → Español
    'Sun': 'Sol',
    'Moon': 'Luna',
    'Mercury': 'Mercurio',
    'Mars': 'Marte',
    'Chiron': 'Quirón',
    'North Node': 'Nodo Norte',
    'Ascendant': 'Ascendente',
    'ASC': 'Ascendente',
    'MC': 'Medio Cielo',
    'Midheaven': 'Medio Cielo',
    // ... etc
  };

  return normalizations[name] || name;
}
```

**Resultado:** El switch case solo necesita manejar nombres canónicos.

---

### Integración en API Routes

#### Archivo: `src/app/api/astrology/interpret-natal/route.ts`

**Antes de la integración:**

```typescript
// ❌ ANTES: Solo prompt genérico
async function generatePlanetInterpretation(planet, userProfile, openai) {
  const prompt = `Interpreta ${planet.name} en ${planet.sign}...`;
  // ... llamada a OpenAI
}
```

**Después de la integración:**

```typescript
// ✅ AHORA: Intenta especializado primero
async function generatePlanetInterpretation(planet, userProfile, openai) {

  // 1. Determinar tipo de elemento
  const elementType = planet.name.includes('Node') || planet.name.includes('Nodo')
    ? 'node'
    : (planet.name === 'Chiron' || planet.name === 'Quirón')
      ? 'asteroid'
      : 'planet';

  // 2. Intentar obtener prompt especializado
  const specializedPrompt = getSpecializedElementPrompt(
    elementType,
    planet.name,
    planet,
    userProfile
  );

  // 3. Usar especializado si existe, genérico si no
  const finalPrompt = specializedPrompt || getGenericFallback();

  // 4. Logging para debugging
  console.log(`🎯 [DEBUG] ${planet.name}: Using specialized = ${!!specializedPrompt}`);

  // 5. Llamada a OpenAI con prompt correcto
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Eres un astrólogo evolutivo...' },
      { role: 'user', content: finalPrompt }
    ],
    temperature: 0.8,
    max_tokens: 3500, // ✅ Aumentado para contenido profundo
  });

  // ... parsear y retornar
}
```

**Ventajas de este approach:**
- ✅ Backwards compatible (si no hay especializado, usa genérico)
- ✅ Fácil de extender (añadir nuevo prompt = agregar case al switch)
- ✅ Zero breaking changes (todo sigue funcionando)
- ✅ Progressive enhancement (cada elemento nuevo mejora la experiencia)

---

## 🎨 CREAR UN NUEVO PROMPT ESPECIALIZADO

### Caso de uso: Quieres crear prompt especializado para **Mercurio**

#### PASO 1: Definir metodología psicológica

**Preguntas a responder:**
1. ¿Qué representa Mercurio psicológicamente? (No solo "comunicación")
2. ¿Qué frameworks psicológicos aplican? (PNL, neurociencia, teoría de sistemas)
3. ¿Cuáles son las sombras principales?
4. ¿Qué ejercicio terapéutico ayuda a integrarlo?

**Ejemplo de análisis:**

```
MERCURIO - Sistema Nervioso y Comunicación

Conceptos psicológicos clave:
- Neurolingüística (PNL)
- Sistema nervioso autónomo
- Patrones de pensamiento (CBT)
- Comunicación no violenta (Rosenberg)

Sombras principales:
1. Rumia mental (overthinking)
2. Comunicación pasivo-agresiva
3. Desconexión cuerpo-mente

Ejercicio terapéutico:
- Journaling estructurado
- Técnica de "parar el pensamiento"
- Comunicación asertiva
```

---

#### PASO 2: Crear función del prompt

**Archivo:** `src/utils/prompts/natalElementPrompts.ts`

**Ubicación:** Después de los prompts existentes, antes del `getGenericPrompt()`

```typescript
// =============================================================================
// ☿️ MERCURIO - Sistema Nervioso y Comunicación
// =============================================================================

function getMercurioPrompt(elementData: any, userProfile: any): string {
  return `Eres un astrólogo evolutivo experto especializado en psicología profunda.

**ELEMENTO:** Mercurio (sistema nervioso, comunicación, pensamiento)
**SIGNO:** ${elementData.sign}
**CASA:** ${elementData.house}
**GRADO:** ${elementData.degree}°
**RETRÓGRADO:** ${elementData.retrograde ? 'Sí' : 'No'}
**USUARIO:** ${userProfile.name}, ${userProfile.age} años

## ☿️ MERCURIO - TU SISTEMA NERVIOSO Y VOZ

Mercurio NO es solo "cómo hablas". Es:
1. **Tu SISTEMA NERVIOSO** - Cómo procesas información
2. **Tu VOZ** - Cómo expresas tu verdad (o la reprimes)
3. **Tus PATRONES MENTALES** - Bucles de pensamiento
4. **Tu COMUNICACIÓN** - Asertiva, pasiva, o agresiva

### ⚠️ CLAVE: Mercurio conecta CUERPO y MENTE

Un Mercurio disfuncional genera:
- Ansiedad (mente desconectada del cuerpo)
- Rumiación (pensamientos en loop sin resolver)
- Problemas digestivos (Mercurio rige intestinos - "segundo cerebro")
- Incapacidad de pedir lo que necesitas

---

## 🎯 ANÁLISIS PSICOLÓGICO PROFUNDO

### 1. TU SISTEMA NERVIOSO
Mercurio en ${elementData.sign} define cómo tu sistema nervioso procesa:

- **Fuego (Aries/Leo/Sagitario):** Sistema nervioso rápido, impulsivo
  - ✅ Respuestas rápidas, decisiones ágiles
  - ❌ Ansiedad por velocidad, saltar sin escuchar

- **Tierra (Tauro/Virgo/Capricornio):** Sistema nervioso lento, procesador
  - ✅ Análisis profundo, decisiones sólidas
  - ❌ Rumiación, parálisis por análisis

- **Aire (Géminis/Libra/Acuario):** Sistema nervioso multi-tasking
  - ✅ Conexiones rápidas entre ideas
  - ❌ Dispersión, shallow processing

- **Agua (Cáncer/Escorpio/Piscis):** Sistema nervioso emocional
  - ✅ Intuición, lectura entre líneas
  - ❌ Pensamientos contaminados por emociones no procesadas

**Para ${userProfile.name}:** Tu Mercurio en ${elementData.sign} significa [análisis específico].

${elementData.retrograde ? `
### ⚠️ MERCURIO RETRÓGRADO - Procesamiento Interno

Tu Mercurio retrógrado significa:
- Procesas información MÁS LENTO que otros (y está bien)
- Necesitas TIEMPO para formular respuestas
- Tu verdadera genialidad emerge en REVISIÓN, no en primera pasada
- Pensamiento NO-LINEAL (conectas cosas que otros no ven)

**Trampa:** Creer que "deberías" procesar tan rápido como otros.
**Regalo:** Profundidad de análisis que otros no alcanzan.
` : ''}

### 2. TU VOZ Y COMUNICACIÓN

Mercurio en Casa ${elementData.house} indica DÓNDE necesitas usar tu voz:
- Casa 1: Hablarte a TI mismo/a con compasión
- Casa 2: Pedir lo que VALES (negociar salario, límites)
- Casa 3: Comunicación cotidiana, hermanos, vecinos
- Casa 4: Hablar con tu familia de origen (sanación)
- Casa 5: Expresar creatividad, enseñar
- Casa 7: Comunicación en pareja (asertividad)
- Casa 10: Voz pública, autoridad profesional
- Casa 11: Comunicar visiones, ideas revolucionarias
- Casa 12: Diálogo interno, espiritualidad, inconsciente

**Para ${userProfile.name}:** Necesitas usar tu voz en [área específica].

### 3. PATRONES MENTALES (Shadow Work)

**Rumia mental:**
¿Tus pensamientos giran en bucle sin resolver?
Mercurio en ${elementData.sign} tiende a [patrón específico].

**Comunicación asertiva vs pasiva/agresiva:**
- ❌ Pasiva: No dices lo que piensas (Mercurio reprimido)
- ❌ Agresiva: Atacas sin filtro (Mercurio explosivo)
- ❌ Pasivo-agresiva: Indirectas, sarcasmo (Mercurio manipulador)
- ✅ Asertiva: "Yo siento/pienso/necesito..." (Mercurio integrado)

### 4. CONEXIÓN CUERPO-MENTE

Mercurio disfuncional genera síntomas físicos:
- Problemas digestivos (intestinos = "segundo cerebro")
- Tensión en hombros/cuello (reprimir voz)
- Insomnio (mente hiperactiva)
- Ansiedad generalizada

**Tu Mercurio en ${elementData.sign} necesita:** [práctica específica para integrar].

---

## 📋 ESTRUCTURA JSON REQUERIDA

Responde con este JSON (4-6 párrafos densos por sección):

{
  "educativo": "## ☿️ TU MERCURIO EN ${elementData.sign.toUpperCase()}

[4-6 párrafos explicando]:
- Qué es Mercurio más allá de 'comunicación'
- Sistema nervioso + patrones mentales + voz
- Mercurio en ${elementData.sign}: cómo piensas/procesas/comunicas
- Casa ${elementData.house}: DÓNDE necesitas usar tu voz
${elementData.retrograde ? '- Mercurio retrógrado: tu procesamiento único' : ''}
- Conexión cuerpo-mente (ansiedad, digestión, tensión)
- Ejemplos de vida diaria",

  "poderoso": "## 🔥 ${userProfile.name.toUpperCase()}, USA TU VOZ

[4-6 párrafos confrontativos]:
- ¿Estás reprimiendo tu voz en [área Casa]? ¿Cuál es el costo?
- Rumia mental vs acción: ¿pensar o HACER?
- Comunicación asertiva: Di lo que necesitas, sin culpa
- Tu sistema nervioso necesita [práctica específica]
- ¿Qué pasaría si dijeras tu verdad hoy?

Estilo: Directo, empoderador, llamado a la acción.",

  "poetico": "## ✨ EL MENSAJERO DE TU ALMA

[3-4 párrafos líricos]:
- Metáfora de Mercurio como puente (cuerpo-mente, tú-otros)
- Tu voz como instrumento único
- Imagen poética de tu comunicación en ${elementData.sign}
- Visión de tu Mercurio integrado

Estilo: Poético, metafórico, inspirador.",

  "sombras": [
    {
      "nombre": "Rumia Mental (Overthinking)",
      "trampa": "❌ 'No puedo parar de pensar en bucles sin resolver'",
      "regalo": "✅ 'Mis pensamientos son herramientas, no prisión'"
    },
    {
      "nombre": "Voz Reprimida",
      "trampa": "❌ 'No puedo decir lo que realmente pienso'",
      "regalo": "✅ 'Mi voz es válida y necesaria'"
    },
    {
      "nombre": "Comunicación Pasivo-Agresiva",
      "trampa": "❌ 'Uso indirectas/sarcasmo en lugar de ser directo'",
      "regalo": "✅ 'Practico comunicación asertiva: Yo siento/pienso/necesito'"
    },
    {
      "nombre": "Desconexión Cuerpo-Mente",
      "trampa": "❌ 'Vivo en mi cabeza, ignorando señales del cuerpo'",
      "regalo": "✅ 'Integro mente y cuerpo, escucho ambos'"
    }
  ],

  "ejercicio": {
    "titulo": "☿️ Ejercicio: Comunicación Asertiva en 3 Pasos",
    "instrucciones": "## PRÁCTICA DE VOZ ASERTIVA

**PASO 1: IDENTIFICA**
¿Hay algo que necesitas decir pero has estado reprimiendo?
Escribe en tu diario:
- ¿A quién necesito decírselo?
- ¿Qué temo que pase si lo digo?
- ¿Qué me cuesta NO decirlo?

**PASO 2: FORMULA ASERTIVAMENTE**
Estructura: 'YO siento/pienso/necesito... PORQUE... ¿PODEMOS...?'

Ejemplo:
❌ 'Siempre haces lo que quieres' (agresivo)
❌ 'No, está bien...' (pasivo)
✅ 'Yo siento frustración cuando cambiamos planes sin consultar. Necesito que consideremos ambos horarios. ¿Podemos acordar avisarnos con X horas de anticipación?' (asertivo)

**PASO 3: PRACTICA**
Di tu verdad esta semana, una vez mínimo.
Después, anota:
- ¿Qué pasó realmente?
- ¿Fue tan terrible como temías?
- ¿Cómo te sentiste después de usar tu voz?

**BONUS (para Mercurio retrógrado):**
Si tu Mercurio es retrógrado, date permiso de decir:
'Necesito tiempo para procesar esto. ¿Puedo responderte en [X tiempo]?'
No es debilidad - es tu superpoder.",

    "duracion": "15 minutos escritura + práctica en vivo",
    "frecuencia": "Semanal hasta que comunicación asertiva sea natural"
  },

  "declaracion": {
    "titulo": "Declaración de Voz Auténtica",
    "contenido": "YO, ${userProfile.name}, reconozco que mi voz es válida y necesaria. Mi Mercurio en ${elementData.sign} es mi forma única de procesar y comunicar, y dejo de compararla con otras. Me comprometo a: (1) Escuchar mi cuerpo tanto como mi mente, (2) Practicar comunicación asertiva sin culpa, (3) Dar a mi sistema nervioso lo que necesita para regularse. Mi voz es un puente entre mi alma y el mundo."
  }
}

ESTILO: Didáctico pero práctico, enfocado en integración cuerpo-mente, comunicación asertiva (Rosenberg), sistema nervioso (Porges).
RESPONDE SOLO JSON VÁLIDO.`;
}
```

---

#### PASO 3: Agregar al switch case

**Ubicación:** En la función `getSpecializedElementPrompt()`, antes del `default:`

```typescript
export function getSpecializedElementPrompt(...) {
  const normalizedName = normalizeElementName(elementName);

  switch (normalizedName) {
    // ... casos existentes (Sol, Luna, etc.)

    // ✅ NUEVO CASO
    case 'Mercurio':
    case 'Mercury':
      return getMercurioPrompt(elementData, userProfile);

    default:
      return getGenericPrompt(elementType, elementName, elementData, userProfile);
  }
}
```

---

#### PASO 4: Testing

```bash
# 1. Commit del cambio
git add src/utils/prompts/natalElementPrompts.ts
git commit -m "✨ FEAT: Añadir prompt especializado para Mercurio

- Sistema nervioso + comunicación
- Patrones mentales (rumia, asertividad)
- Conexión cuerpo-mente
- Ejercicio: Comunicación asertiva en 3 pasos"

# 2. Probar en local
# Hacer request a /api/astrology/interpret-natal con:
# { elementType: 'planet', elementName: 'Mercury', ... }

# 3. Verificar logs
# Debería aparecer: "🎯 [DEBUG] Mercury: Using specialized = true"

# 4. Verificar respuesta JSON
# Debe tener estructura completa: educativo, poderoso, poetico, sombras, ejercicio, declaracion
```

---

## 🐛 DEBUGGING Y TESTING

### Logging Estratégico

**Archivo:** `src/app/api/astrology/interpret-natal/route.ts`

```typescript
// ✅ Logs actuales
console.log(`🎯 [DEBUG] generatePlanetInterpretation called for ${planet.name}`);
console.log(`🎯 [DEBUG] Using specialized prompt: ${!!prompt}`);

// ✅ Logs adicionales recomendados
console.log(`🎯 [DEBUG] Element type detected: ${elementType}`);
console.log(`🎯 [DEBUG] Normalized name: ${normalizedName}`);
console.log(`🎯 [DEBUG] Prompt length: ${finalPrompt.length} chars`);
console.log(`🎯 [DEBUG] Max tokens: 3500`);
```

**Ver logs en desarrollo:**

```bash
# Terminal donde corre Next.js
npm run dev

# Los console.log() aparecen en la terminal, NO en el navegador
# Busca líneas que empiecen con "🎯 [DEBUG]"
```

---

### Testing Manual

**1. Crear request de prueba:**

```bash
# Archivo: test-natal-interpretation.sh
curl -X POST http://localhost:3000/api/astrology/interpret-natal \
  -H "Content-Type: application/json" \
  -d '{
    "elementType": "planet",
    "elementName": "Sun",
    "elementData": {
      "sign": "Aries",
      "house": 10,
      "degree": 15.3,
      "retrograde": false
    },
    "userProfile": {
      "name": "Test User",
      "age": 30,
      "birthDate": "1994-04-15",
      "birthTime": "14:30",
      "birthPlace": "Buenos Aires, Argentina"
    }
  }'
```

**2. Verificar respuesta:**

```json
// ✅ Respuesta correcta
{
  "success": true,
  "cached": false,
  "interpretation": {
    "educativo": "## ☀️ TU SOL EN ARIES...",
    "poderoso": "## 🔥 TEST USER, ESTE ES TU FUEGO...",
    "poetico": "## ✨ Eres la primera llama...",
    "sombras": [
      {
        "nombre": "Dependencia de Validación Externa",
        "trampa": "❌ ...",
        "regalo": "✅ ..."
      }
    ],
    "ejercicio": { ... },
    "declaracion": { ... }
  }
}

// ❌ Respuesta con error
{
  "success": false,
  "error": "Invalid JSON response from OpenAI",
  "details": "..."
}
```

---

### Testing de Caché

```bash
# Primera llamada (sin caché)
time curl -X POST http://localhost:3000/api/astrology/interpret-natal \
  -H "Content-Type: application/json" \
  -d '{ ... }'

# Output esperado:
# - "cached": false
# - Tiempo: 3-5 segundos

# Segunda llamada (con caché)
time curl -X POST http://localhost:3000/api/astrology/interpret-natal \
  -H "Content-Type: application/json" \
  -d '{ ... }'  # Mismos datos exactos

# Output esperado:
# - "cached": true
# - Tiempo: ~100ms
```

---

## ⚡ OPTIMIZACIÓN DE PERFORMANCE

### 1. Caché Strategy

**Actual:**
```typescript
// Hash basado en userId + elemento + datos astrológicos
const cacheKey = hash({
  userId: userProfile.id,
  elementType,
  elementName,
  sign: elementData.sign,
  house: elementData.house,
  degree: Math.round(elementData.degree) // Redondear para aumentar hit rate
});
```

**Optimización recomendada:**

```typescript
// Redondear grados a 1 decimal (balance entre precisión y hit rate)
degree: Math.round(elementData.degree * 10) / 10

// Ejemplo:
// 15.347° → 15.3° (agrupa 15.30-15.39° en mismo caché)
// Aumenta hit rate ~10x sin perder precisión significativa
```

---

### 2. Batch Generation

**Problema:** Generar 20 tooltips secuencialmente = 20 × 4 segundos = 80 segundos

**Solución:** Batch requests

```typescript
// ✅ RECOMENDADO: Generar en paralelo
async function generateAllTooltips(planets, userProfile) {
  const promises = planets.map(planet =>
    generatePlanetInterpretation(planet, userProfile, openai)
  );

  // Ejecuta todas las requests en paralelo
  const results = await Promise.all(promises);

  return results;
}

// Tiempo total: ~5-8 segundos (limitado por OpenAI rate limit)
```

**Límite de OpenAI:**
- Tier Free: 3 requests/min
- Tier 1: 3,500 requests/min
- Tier 2+: 5,000+ requests/min

**Strategy:**
```typescript
// Chunking para respetar rate limit
async function generateAllTooltipsSafe(planets, userProfile, maxConcurrent = 10) {
  const chunks = chunkArray(planets, maxConcurrent);
  const results = [];

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(p => generatePlanetInterpretation(p, userProfile, openai))
    );
    results.push(...chunkResults);
  }

  return results;
}
```

---

### 3. Streaming Responses (Future)

**Actual:** Esperar respuesta completa antes de mostrar

**Futuro:** Stream respuesta mientras se genera

```typescript
// Con OpenAI Streaming API
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  // Enviar chunk al frontend via Server-Sent Events (SSE)
  res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
}
```

**Ventaja:** Usuario ve contenido aparecer en tiempo real (mejor UX)

---

## ✅ BUENAS PRÁCTICAS

### 1. Estructura de Prompts

**DO:**
```typescript
✅ Separa en secciones claras (## headers)
✅ Usa ejemplos concretos
✅ Especifica estructura JSON exacta
✅ Incluye metodología psicológica (citar autores)
✅ Tono consistente (educativo + poderoso + poético)
✅ Longitud: 100-170 líneas (ni muy corto ni muy largo)
```

**DON'T:**
```typescript
❌ Prompts genéricos sin metodología específica
❌ "Interpreta este planeta" (muy vago)
❌ Sin estructura JSON (LLM inventará formato)
❌ Mezclar tonos (formal + casual en misma sección)
❌ Prompts demasiado largos (>300 líneas = LLM se pierde)
```

---

### 2. Manejo de Errores

```typescript
// ✅ RECOMENDADO: Try-catch con fallback
async function generatePlanetInterpretation(planet, userProfile, openai) {
  try {
    const prompt = getSpecializedElementPrompt(...);
    const completion = await openai.chat.completions.create({ ... });

    // Parsear JSON
    const interpretation = JSON.parse(completion.choices[0].message.content);

    // Validar estructura
    if (!interpretation.educativo || !interpretation.sombras) {
      throw new Error('Invalid interpretation structure');
    }

    return interpretation;

  } catch (error) {
    console.error(`❌ [ERROR] Failed to generate interpretation for ${planet.name}:`, error);

    // Fallback: retornar interpretación básica
    return {
      educativo: `Lo sentimos, no pudimos generar la interpretación completa para ${planet.name}. Por favor intenta de nuevo.`,
      poderoso: '',
      poetico: '',
      sombras: [],
      ejercicio: null,
      declaracion: null,
      error: true
    };
  }
}
```

---

### 3. Versionado de Prompts

**Problema:** Cambias un prompt → todas las interpretaciones cacheadas quedan obsoletas

**Solución:** Versionar prompts

```typescript
// natalElementPrompts.ts
const PROMPT_VERSION = 'v2'; // Incrementar cuando cambies prompts

function getSolPrompt(elementData, userProfile) {
  return `VERSION: ${PROMPT_VERSION}

Eres un astrólogo evolutivo...
...`;
}

// En caché key
const cacheKey = hash({
  promptVersion: PROMPT_VERSION, // ✅ Invalida caché al cambiar version
  userId,
  elementName,
  ...
});
```

---

### 4. Testing de JSON Parsing

**Problema:** OpenAI a veces retorna JSON con markdown wrapper:

````
```json
{
  "educativo": "..."
}
```
````

**Solución:** Limpiar antes de parsear

```typescript
function parseInterpretationJSON(rawContent: string) {
  // Remover markdown code blocks si existen
  let cleaned = rawContent.trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7); // Remove ```json
  }
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3); // Remove ```
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3); // Remove closing ```
  }

  cleaned = cleaned.trim();

  // Parsear JSON
  return JSON.parse(cleaned);
}
```

---

## 🚨 TROUBLESHOOTING

### Problema: "Using specialized prompt: false" cuando debería ser true

**Diagnóstico:**

```typescript
// Añadir más logging
console.log(`🔍 Element name received: "${elementName}"`);
console.log(`🔍 Normalized to: "${normalizedName}"`);
console.log(`🔍 Switch case hit: ${normalizedName === 'Sol' ? 'YES' : 'NO'}`);
```

**Posibles causas:**

1. **Nombre no normalizado:**
   - Solución: Añadir mapping en `normalizeElementName()`

2. **Case sensitivity:**
   - Solución: `normalizedName.toLowerCase()` en switch

3. **Espacios extra:**
   - Solución: `normalizedName.trim()`

---

### Problema: OpenAI retorna JSON inválido

**Síntomas:**
```
Error: Unexpected token '<' in JSON
```

**Causa:** OpenAI retornó HTML/texto en lugar de JSON

**Solución:**

```typescript
// Validar que response empieza con '{' o '['
const content = completion.choices[0].message.content.trim();

if (!content.startsWith('{') && !content.startsWith('[')) {
  console.error('❌ OpenAI did not return JSON:', content.slice(0, 200));

  // Reintentar con prompt más estricto
  const retryPrompt = `${originalPrompt}

CRÍTICO: Responde SOLO con JSON válido. No incluyas texto adicional, explicaciones, o markdown.
Comienza tu respuesta con '{' y termina con '}'.`;

  // ... retry logic
}
```

---

### Problema: max_tokens insuficiente (respuesta cortada)

**Síntomas:**
```json
{
  "educativo": "...",
  "poderoso": "...",
  "poetico": "## ✨ La metáfora de tu
```

**Causa:** `max_tokens: 3500` fue insuficiente, respuesta cortada a mitad

**Solución:**

```typescript
// Detectar respuesta cortada
const content = completion.choices[0].message.content;
const finishReason = completion.choices[0].finish_reason;

if (finishReason === 'length') {
  console.warn('⚠️ Response was cut off due to max_tokens limit');

  // Opción A: Aumentar max_tokens
  max_tokens: 4500

  // Opción B: Simplificar prompt (pedir 3-4 párrafos en vez de 4-6)
}
```

---

### Problema: Caché no invalida cuando debería

**Síntomas:** Cambias prompt pero sigue retornando interpretación vieja

**Causa:** Hash de caché no incluye versión de prompt

**Solución:** Ver [Versionado de Prompts](#3-versionado-de-prompts)

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación OpenAI
- [Chat Completions API](https://platform.openai.com/docs/api-reference/chat)
- [Best Practices for Prompting](https://platform.openai.com/docs/guides/prompt-engineering)
- [JSON Mode](https://platform.openai.com/docs/guides/text-generation/json-mode)

### Astrología Evolutiva
- Jeffrey Wolf Green - "Pluto: The Evolutionary Journey of the Soul"
- Steven Forrest - "The Inner Sky"
- Demetra George - "Asteroid Goddesses"

### Psicología Aplicada
- Carl Jung - "Man and His Symbols"
- John Bowlby - "Attachment and Loss"
- Peter Levine - "Waking the Tiger"
- Bessel van der Kolk - "The Body Keeps the Score"
- Marshall Rosenberg - "Nonviolent Communication"

---

**Última actualización:** 2025-11-20
**Mantenedor:** Equipo Tu Vuelta al Sol
