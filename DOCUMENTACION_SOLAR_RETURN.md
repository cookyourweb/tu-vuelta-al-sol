# 📚 Documentación Completa: Sistema Solar Return

## 🎯 Índice

1. [Filosofía del Sistema](#filosofía-del-sistema)
2. [Arquitectura de 3 Capas](#arquitectura-de-3-capas)
3. [Natal vs Solar Return: Diferencias Clave](#natal-vs-solar-return-diferencias-clave)
4. [Arquitectura Técnica](#arquitectura-técnica)
5. [Flujo de Generación de Interpretaciones](#flujo-de-generación-de-interpretaciones)
6. [Ejemplos de Código](#ejemplos-de-código)
7. [Endpoints API](#endpoints-api)
8. [Checklist de Implementación](#checklist-de-implementación)
9. [Troubleshooting](#troubleshooting)

---

## 🧠 Filosofía del Sistema

### Regla de Oro

**Una interpretación de Retorno Solar NO define quién eres. Define CÓMO se activan ciertas energías DURANTE ESTE AÑO.**

### 6 Preguntas Clave que TODA Interpretación SR Debe Responder

1. ✅ **¿Qué tema se ACTIVA este año?**
2. ✅ **¿En qué área concreta de la vida?**
3. ✅ **¿Qué se te pide aprender?**
4. ✅ **¿Qué actitud te conviene adoptar?**
5. ✅ **¿Qué riesgo si reaccionas desde sombra?**
6. ✅ **¿Cómo convertirlo en ventaja?**

### Diferencia Fundamental

| Aspecto | Carta Natal | Solar Return |
|---------|-------------|--------------|
| **Qué es** | Mapa de identidad permanente | Mapa de entrenamiento anual |
| **Representa** | QUIÉN ERES | QUÉ SE ACTIVA ESTE AÑO |
| **Lenguaje** | Permanente ("Eres...", "Tu esencia es...") | Temporal ("Este año...", "Durante 2025...") |
| **Duración** | Toda la vida | 1 año solar |
| **Declaraciones** | "YO SOY..." | "ESTE AÑO ENTRENARÉ..." |

---

## 🏗️ Arquitectura de 3 Capas

### CAPA 1: Carta Natal - Quién Soy

**Propósito**: Identidad base, estructura permanente

**Características**:
- ✅ Lenguaje permanente
- ✅ Declaraciones "YO SOY..."
- ✅ Triple fusión: educativo + poderoso + poético
- ✅ Mantras y afirmaciones de identidad

**Ejemplo**:
```
Plutón en Aries Casa 1 (Natal):
"Eres un transformador nato. Tu esencia es revolucionaria.
Declaración: 'YO, [NOMBRE], SOY el fénix que renace de sus cenizas.'"
```

### CAPA 2: Retorno Solar - Qué Se Activa Este Año

**Propósito**: Activación anual, entrenamiento específico

**Características**:
- ✅ Lenguaje temporal ("este año", "durante 2025")
- ✅ Comparación con natal SIEMPRE
- ✅ Claves de integración prácticas (NO mantras de identidad)
- ✅ Enfoque en aprendizajes del año

**Ejemplo**:
```
Plutón en Acuario Casa 11 (Solar Return 2025):

Natalmente, tu Plutón en Aries Casa 1 te da una naturaleza de transformador
solitario, capaz de reinventarte desde cero sin ayuda externa.

Pero este año, con Plutón en Acuario Casa 11 SR, la vida te pide SOLTAR
el individualismo extremo y aprender a transformar EN RED, con otros.

Clave de integración 2025: "Pausa antes de imponer tu visión - escucha
la inteligencia colectiva."
```

### CAPA 3: Agenda Anual - Cómo Vivir el Año Conscientemente

**Propósito**: Timing, acciones concretas, rituales

**Características**:
- ✅ Eventos clave con fechas reales
- ✅ Acciones recomendadas específicas
- ✅ Rituales mensuales/trimestrales
- ✅ Timeline de transits importantes

**Ejemplo**:
```
Mes 3 (Primera Cuadratura Solar):
Evento: "Primer Ajuste de Realidad"
Descripción: "Sol transitando 90° desde posición SR. Momento de VERDAD:
¿estás alineado con tus intenciones?"
Acción Recomendada: "Evaluación brutal de progreso. Ajustar estrategia
SIN excusas."
```

---

## 🔄 Natal vs Solar Return: Diferencias Clave

### Planetas

#### Natal: Identidad
```
Tooltip:
  titulo: "🌟 Venus en Géminis en Casa 3"
  significado: "Tu forma natural de amar es comunicativa, versátil..."

Drawer:
  educativo: "Venus representa tu forma de amar..."
  poderoso: "¡NO VINISTE a amar de forma convencional!"
  sintesis:
    declaracion: "YO, [NOMBRE], AMO con palabras, ideas y libertad."
```

#### Solar Return: Activación Anual
```
Tooltip:
  titulo: "🌟 Venus en Capricornio Casa 10 - Año 2025"
  significado: "Este año, tu capacidad de relacionarte se activa
               en el ámbito profesional..."

Drawer:
  educativo: "Este año Venus en Capricornio Casa 10 activa..."
  poderoso: "Natalmente amas con ligereza y palabras (Venus Géminis),
             pero ESTE AÑO la vida te pide profesionalizar el amor,
             construir relaciones duraderas basadas en compromiso real."
  sintesis:
    declaracion: "Pausa antes de dispersarte - construye relaciones
                  que duren más allá del entusiasmo inicial."
```

### Aspectos

#### Natal: Diálogo Interno Permanente
```
Sol Trígono Luna (Natal):
"Este aspecto crea ARMONÍA NATURAL entre tu identidad consciente (Sol)
y tu mundo emocional (Luna). Es un diálogo fluido que siempre llevas contigo."

Declaración: "Yo integro mi mente y mi corazón con facilidad."
```

#### Solar Return: Qué Parte del Diálogo se Activa
```
Sol Cuadratura Luna (Solar Return 2025):

Natalmente, ya tienes Sol Trígono Luna - armonía emocional natural.
Pero este año, en Solar Return, aparece Sol Cuadratura Luna para que
APRENDAS a mantener esa armonía INCLUSO cuando el entorno te presiona.

Este año entrenará: Resiliencia emocional bajo presión.

Clave 2025: "Respira antes de reaccionar - tu paz interior no depende
del caos exterior."
```

---

## ⚙️ Arquitectura Técnica

### Estructura de Archivos

```
src/
├── app/api/astrology/
│   ├── interpret-natal/route.ts          # Natal + aspectos (GET/POST/PUT)
│   ├── interpret-planet/route.ts         # Planetas individuales (Natal + SR)
│   ├── interpret-solar-return/route.ts   # Interpretación SR completa
│   └── interpret-chunk/route.ts          # Generación por partes (Natal)
│
├── services/
│   └── tripleFusedInterpretationService.ts  # Servicio OpenAI compartido
│
├── utils/prompts/
│   ├── tripleFusedPrompts.ts             # Prompts Natal + SR (planetas/aspectos)
│   └── solarReturnPrompts.ts             # Prompt SR completo
│
├── components/
│   ├── astrology/
│   │   ├── ChartTooltips.tsx             # Tooltips con chartType
│   │   ├── ChartDisplay.tsx              # Rueda con chartType
│   │   └── InterpretationButton.tsx      # Generación SR completa
│   └── solar-return/
│       ├── SolarReturnTimelineSection.tsx
│       └── SolarReturnInterpretationSection.tsx
│
└── app/(dashboard)/
    ├── natal-chart/page.tsx              # Página Natal
    └── solar-return/page.tsx             # Página SR
```

### Flujo de Datos

```mermaid
graph TD
    A[Usuario en /solar-return] --> B[ChartDisplay chartType=solar-return]
    B --> C[ChartTooltips]
    C --> D{Click en Planeta/Aspecto}
    D -->|Planeta| E[/api/astrology/interpret-planet]
    D -->|Aspecto| F[/api/astrology/interpret-natal PUT]
    E --> G[Busca posición natal en MongoDB]
    F --> H[Busca aspecto natal en MongoDB]
    G --> I[generatePlanetInterpretation con natalPosition]
    H --> J[generateAspectInterpretation con natalAspect]
    I --> K[generateSolarReturnPlanetPrompt]
    J --> L[generateSolarReturnAspectPrompt]
    K --> M[OpenAI GPT-4]
    L --> M
    M --> N[Interpretación SR con comparación natal]
    N --> O[Guarda en MongoDB chartType=solar-return]
    O --> P[Muestra en Drawer/Tooltip]
```

---

## 🔄 Flujo de Generación de Interpretaciones

### 1. Planetas SR (con comparación natal)

**Frontend** (`ChartTooltips.tsx`):
```typescript
const handlePlanetClick = async (planetName, sign, house) => {
  const response = await fetch('/api/astrology/interpret-planet', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      planetName,
      sign,
      house,
      degree,
      chartType: 'solar-return',  // ⭐ Crítico
      year: solarReturnYear        // ⭐ Crítico
    })
  });
};
```

**Backend** (`interpret-planet/route.ts`):
```typescript
// 1. Buscar posición natal automáticamente
if (chartType === 'solar-return' && userId) {
  const natalInterpretation = await db.collection('interpretations').findOne({
    userId,
    chartType: 'natal'
  });

  const natalPlanet = natalInterpretation.natalChart.planets.find(
    p => p.name === planetName
  );

  natalPlanetPosition = {
    sign: natalPlanet.sign,
    house: natalPlanet.house
  };
}

// 2. Generar interpretación SR con comparación
const interpretation = await generatePlanetInterpretation(
  planetName,
  sign,
  house,
  degree,
  userProfile,
  chartType,          // 'solar-return'
  year,               // 2025
  natalPlanetPosition // { sign: 'Aries', house: 1 }
);
```

**Servicio** (`tripleFusedInterpretationService.ts`):
```typescript
export async function generatePlanetInterpretation(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  userProfile: UserProfile,
  chartType: string = 'natal',
  year?: number,
  natalPlanetPosition?: { sign: string; house: number }
) {
  // Usar prompt correcto según chartType
  const prompt = chartType === 'solar-return'
    ? generateSolarReturnPlanetPrompt(
        planetName,
        sign,
        house,
        degree,
        year!,
        natalPlanetPosition,
        userProfile
      )
    : generatePlanetTripleFusedPrompt(...);

  // System message temporal
  const systemMessage = chartType === 'solar-return'
    ? 'Eres un astrólogo evolutivo experto en Solar Return. Usas lenguaje TEMPORAL (este año, durante 2025).'
    : 'Eres un astrólogo evolutivo experto...';

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ]
  });
}
```

**Prompt** (`tripleFusedPrompts.ts`):
```typescript
export function generateSolarReturnPlanetPrompt(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  year: number,
  natalPlanetPosition?: { sign: string; house: number },
  userProfile?: any
): string {
  return `
⚡ REGLA DE ORO: RETORNO SOLAR NO ES IDENTIDAD

Retorno Solar = Mapa de entrenamiento anual
NO definas quién es la persona
SÍ describe qué se activa, qué se entrena ESTE año

PROHIBIDO:
❌ "Eres el guerrero poeta..."
❌ "Tu esencia es..."
❌ "Yo soy..."

OBLIGATORIO:
✅ "Este año se activa..."
✅ "Durante ${year} aprenderás..."
✅ "El reto este año es..."

Párrafo 4: CÓMO SE CRUZA CON TU FORMA DE SER
${natalPlanetPosition ? `
'Natalmente, tu ${planetName} en ${natalPlanetPosition.sign} Casa ${natalPlanetPosition.house}
te da una naturaleza [describe brevemente].

Pero este año, con ${planetName} en ${sign} Casa ${house} SR, la vida te pide
[contraste/complemento con natal].'
` : ''}

"sintesis": {
  "frase": "Tema del año en 1 frase",
  "declaracion": "Clave de integración para ${year}: [frase práctica sin 'Yo soy']"
}

✅ CHECKLIST ANTES DE ENVIAR:
□ ¿Usaste lenguaje temporal? (este año, durante ${year})
□ ¿Evitaste "Eres..." y "Yo soy..."?
□ ¿Comparaste con natal en Párrafo 4?
□ ¿La declaración es PRÁCTICA, no identitaria?
`;
}
```

### 2. Aspectos SR (con comparación natal)

**Frontend** (`ChartTooltips.tsx`):
```typescript
const response = await fetch('/api/astrology/interpret-natal', {
  method: 'PUT',
  body: JSON.stringify({
    userId,
    planet1,
    planet2,
    aspectType,
    orb,
    chartType: 'solar-return',  // ⭐ Crítico
    year: solarReturnYear        // ⭐ Crítico
  })
});
```

**Backend** (`interpret-natal/route.ts`):
```typescript
// Buscar aspecto natal
if (chartType === 'solar-return' && userId) {
  const natalInterpretation = await db.collection('interpretations').findOne({
    userId,
    chartType: 'natal'
  });

  const natalAspectFound = natalInterpretation.natalChart.aspects.find(
    a => (a.planet1 === planet1 && a.planet2 === planet2) ||
         (a.planet1 === planet2 && a.planet2 === planet1)
  );

  if (natalAspectFound) {
    natalAspect = {
      exists: true,
      type: natalAspectFound.type,
      orb: natalAspectFound.orb
    };
  } else {
    natalAspect = { exists: false };  // ⭐ Aspecto NO existe en natal
  }
}

// Generar con comparación
const aspectInterpretation = await generateAspectInterpretation(
  { planet1, planet2, type: aspectType, orb },
  userProfile,
  openai,
  chartType,    // 'solar-return'
  year,         // 2025
  natalAspect   // { exists: true/false, type?, orb? }
);
```

**Prompt** (`tripleFusedPrompts.ts`):
```typescript
export function generateSolarReturnAspectPrompt(
  planet1: string,
  planet2: string,
  aspectType: string,
  orb: number,
  year: number,
  natalAspect?: { exists: boolean; type?: string; orb?: number },
  userProfile?: any
): string {
  return `
⚡ REGLA DE ORO: ASPECTOS EN SOLAR RETURN

Aspecto Natal = Diálogo interno permanente
Aspecto SR = Qué parte de ese diálogo se ACTIVA este año

Párrafo 3: PARA QUÉ VIENE ESTE DIÁLOGO
${natalAspect?.exists ? `
'Natalmente, ya tienes este diálogo ${aspectTypeSpanish[natalAspect.type!]}.
Pero este año, en Solar Return, se REACTIVA con ${aspectName} para que
[qué aprendizaje específico del año].'
` : `
'Este aspecto NO existe en tu carta natal. Aparece SOLO este año para que
[qué aprendizaje temporal].'
`}

PROHIBIDO:
❌ "Este diálogo es tu identidad..."
❌ "Yo integro..."

OBLIGATORIO:
✅ "Este año este aspecto te pedirá..."
✅ "Durante ${year} entrenarás..."

"sintesis": {
  "declaracion": "Clave práctica para ${year}: [sin 'Yo soy/integro']"
}
`;
}
```

### 3. Interpretación SR Completa

**Frontend** (`InterpretationButton.tsx`):
```typescript
<InterpretationButton
  type="solar-return"
  userId={user.uid}
  chartData={solarReturnData}
  natalChart={natalChart}     // ⭐ Comparación
  userProfile={userProfile}
/>
```

**Endpoint**: `/api/astrology/interpret-solar-return`

**Estructura de Respuesta**:
```typescript
{
  esencia_revolucionaria_anual: { tooltip, drawer },
  proposito_vida_anual: { tooltip, drawer },
  tema_central_del_anio: { tooltip, drawer },

  eventos_clave_del_anio: [
    {
      periodo: 'Mes 3 (Primera Cuadratura Solar)',
      evento: 'Primer Ajuste de Realidad',
      tipo: 'Desafío',
      descripcion: 'Sol transitando 90° desde SR. ¿Estás alineado?',
      accion_recomendada: 'Evaluación brutal de progreso.'
    }
  ],

  calendario_lunar_anual: [
    {
      mes: 'Enero 2025',
      luna_nueva: { fecha: '29 Enero 2025', signo: 'Acuario', mensaje: '...' },
      luna_llena: { fecha: '13 Enero 2025', signo: 'Cáncer', mensaje: '...' }
    }
  ],

  rituales_recomendados: [
    '🕯️ RITUAL DE INICIO (Día exacto de cumpleaños): ...',
    '🌙 RITUAL LUNAR MENSUAL: ...'
  ]
}
```

---

## 💻 Ejemplos de Código

### Ejemplo 1: Comparación Natal vs SR en Prompt

```typescript
// INCORRECTO ❌ (sin comparación)
const prompt = `
Interpreta ${planetName} en ${sign} Casa ${house} para el año ${year}.
`;

// CORRECTO ✅ (con comparación)
const prompt = `
NATAL: ${planetName} en ${natalSign} Casa ${natalHouse}
→ Cómo transformas NATURALMENTE

SOLAR RETURN ${year}: ${planetName} en ${srSign} Casa ${srHouse}
→ Qué área específica se ACTIVA este año para entrenamiento

Natalmente, tu ${planetName} en ${natalSign} te da [característica permanente].
Pero este año, con ${planetName} en ${srSign} Casa ${srHouse} SR, la vida te pide
[aprendizaje temporal específico del año].
`;
```

### Ejemplo 2: System Message Temporal

```typescript
// INCORRECTO ❌ (lenguaje permanente)
const systemMessage = 'Eres un astrólogo evolutivo que describe la identidad de la persona.';

// CORRECTO ✅ (lenguaje temporal)
const systemMessage = chartType === 'solar-return'
  ? `Eres un astrólogo evolutivo experto en Solar Return.
     Respondes ÚNICAMENTE con JSON válido.
     Usas lenguaje TEMPORAL específico del año (este año, durante ${year}, etc.).
     NUNCA usas "Eres..." o "Tu esencia es...".
     SIEMPRE comparas con la carta natal.`
  : 'Eres un astrólogo evolutivo experto...';
```

### Ejemplo 3: Declaración Final

```typescript
// INCORRECTO ❌ (mantra de identidad)
{
  "sintesis": {
    "declaracion": "YO, MARÍA, SOY una transformadora revolucionaria del cambio grupal."
  }
}

// CORRECTO ✅ (clave práctica)
{
  "sintesis": {
    "declaracion": "Pausa antes de imponer tu visión - escucha la inteligencia colectiva este año."
  }
}
```

### Ejemplo 4: Aspecto que NO Existe en Natal

```typescript
// Aspecto SR: Sol Cuadratura Luna
// Aspecto Natal: NO EXISTE

const interpretation = `
📌 ASPECTO TEMPORAL 2025

Este aspecto entre Sol y Luna NO existe en tu carta natal.
Aparece SOLO durante este año solar para entrenar una habilidad específica.

¿Por qué aparece SOLO este año?
Durante 2025, la vida te pide desarrollar resiliencia emocional bajo presión.
Natalmente no tienes este conflicto (no es parte de tu naturaleza permanente),
pero ESTE AÑO específicamente entrenarás cómo mantener tu paz interior
incluso cuando el entorno te desafía.

Clave 2025: "Respira antes de reaccionar - tu paz no depende del caos exterior."
`;
```

---

## 📡 Endpoints API

### 1. `/api/astrology/interpret-planet` (POST)

**Propósito**: Generar interpretación individual de planeta (Natal o SR)

**Request**:
```json
{
  "userId": "abc123",
  "planetName": "Venus",
  "sign": "Capricornio",
  "house": 10,
  "degree": 15.5,
  "chartType": "solar-return",
  "year": 2025
}
```

**Proceso**:
1. Si `chartType === 'solar-return'`, busca carta natal en MongoDB
2. Extrae posición natal del mismo planeta
3. Llama a `generatePlanetInterpretation()` con comparación
4. Guarda en MongoDB con `chartType: 'solar-return'`

**Response**:
```json
{
  "success": true,
  "interpretation": {
    "tooltip": { ... },
    "drawer": { ... }
  }
}
```

### 2. `/api/astrology/interpret-natal` (PUT)

**Propósito**: Generar interpretación individual de aspecto (Natal o SR)

**Request**:
```json
{
  "userId": "abc123",
  "planet1": "Sol",
  "planet2": "Luna",
  "aspectType": "Cuadratura",
  "orb": 2.3,
  "chartType": "solar-return",
  "year": 2025
}
```

**Proceso**:
1. Si `chartType === 'solar-return'`, busca carta natal
2. Busca si existe aspecto natal entre mismos planetas
3. Si existe: `{ exists: true, type: 'Trígono', orb: 3.2 }`
4. Si NO existe: `{ exists: false }`
5. Genera con `generateAspectInterpretation()` + comparación

**Response**:
```json
{
  "success": true,
  "data": {
    "tooltip": { ... },
    "drawer": { ... }
  },
  "cached": false
}
```

### 3. `/api/astrology/interpret-solar-return` (POST)

**Propósito**: Generar interpretación SR completa (12 secciones)

**Request**:
```json
{
  "userId": "abc123",
  "chartData": { planets: [...], houses: [...], aspects: [...] },
  "natalChart": { planets: [...], houses: [...] },
  "userProfile": { name: "María", age: 32, birthDate: "1992-06-15" }
}
```

**Response**:
```json
{
  "success": true,
  "interpretation": {
    "esencia_revolucionaria_anual": { tooltip, drawer },
    "proposito_vida_anual": { tooltip, drawer },
    "tema_central_del_anio": { tooltip, drawer },
    "formacion_temprana": { ... },
    "patrones_psicologicos": [ ... ],
    "planetas_profundos": { ... },
    "angulos_vitales": { ... },
    "nodos_lunares": { ... },
    "analisis_tecnico_profesional": { ... },
    "plan_accion": { trimestre_1: {...}, ... },
    "calendario_lunar_anual": [ ... ],
    "eventos_clave_del_anio": [ ... ],
    "rituales_recomendados": [ ... ],
    "integracion_final": { ... }
  }
}
```

### 4. `/api/interpretations/save` (GET/POST/PUT/DELETE)

**Propósito**: CRUD de interpretaciones en MongoDB

**Estructura en MongoDB**:
```json
{
  "_id": "...",
  "userId": "abc123",
  "chartType": "solar-return",  // o "natal"
  "interpretation": { ... },
  "natalChart": { planets: [...], aspects: [...] },  // Solo para SR
  "generatedAt": "2025-01-15T10:30:00Z",
  "expiresAt": "2025-01-16T10:30:00Z",
  "method": "openai",
  "cached": false
}
```

---

## ✅ Checklist de Implementación

### Para Planetas SR

- [ ] Endpoint acepta `chartType` y `year`
- [ ] Busca posición natal automáticamente en MongoDB
- [ ] Llama a `generateSolarReturnPlanetPrompt()` si SR
- [ ] System message usa lenguaje temporal
- [ ] Logs muestran comparación: `Natal Aries Casa 1 → SR Acuario Casa 11`
- [ ] Prompt incluye comparación en Párrafo 4
- [ ] Declaración final es PRÁCTICA, no identitaria
- [ ] Frontend envía `chartType` y `year`

### Para Aspectos SR

- [ ] Endpoint acepta `chartType` y `year`
- [ ] Busca aspecto natal entre mismos planetas
- [ ] Diferencia entre `{ exists: true }` y `{ exists: false }`
- [ ] Llama a `generateSolarReturnAspectPrompt()` si SR
- [ ] Prompt explica si aspecto es permanente o temporal
- [ ] Comparación clara: "Natalmente ya tienes X, pero este año..."
- [ ] Frontend envía `chartType` y `year`

### Para Interpretación SR Completa

- [ ] Usa `generateSolarReturnMasterPrompt()`
- [ ] Incluye comparación con `natalChart` completo
- [ ] Estructura tiene 12+ secciones
- [ ] `eventos_clave_del_anio` tiene 6 eventos mínimo
- [ ] `calendario_lunar_anual` tiene 12 meses
- [ ] `rituales_recomendados` son prácticos
- [ ] Lenguaje 100% temporal (sin "eres", sin "yo soy")

---

## 🐛 Troubleshooting

### Problema 1: Interpretación SR suena como Natal

**Síntomas**:
- Usa "Eres...", "Tu esencia es..."
- Declaraciones "YO SOY..."
- No menciona "este año"

**Solución**:
```typescript
// Verificar system message
const systemMessage = chartType === 'solar-return'
  ? 'Usas lenguaje TEMPORAL (este año, durante 2025). NUNCA usas "Eres..."'
  : 'Lenguaje permanente permitido';

// Verificar prompt tiene PROHIBIDO/OBLIGATORIO
const prompt = `
PROHIBIDO:
❌ "Eres..."
❌ "Tu esencia..."

OBLIGATORIO:
✅ "Este año..."
✅ "Durante ${year}..."
`;
```

### Problema 2: No se Compara con Natal

**Síntomas**:
- Interpretación SR no menciona posición natal
- No hay contraste entre natal y SR

**Solución**:
```typescript
// Verificar que se busca natal
if (chartType === 'solar-return' && userId) {
  const natalInterpretation = await db.collection('interpretations').findOne({
    userId,
    chartType: 'natal'  // ⭐ Asegurarse de buscar 'natal'
  });

  if (!natalInterpretation) {
    console.error('❌ No se encontró carta natal para comparación');
  }
}

// Verificar logs
console.log('📊 Comparación:', {
  natal: `${planetName} en ${natalSign} Casa ${natalHouse}`,
  sr: `${planetName} en ${srSign} Casa ${srHouse}`
});
```

### Problema 3: Aspecto que NO Existe en Natal no se Explica

**Síntomas**:
- Aspecto solo en SR no dice "aparece SOLO este año"

**Solución**:
```typescript
// Prompt debe manejar ambos casos
${natalAspect?.exists ? `
  'Natalmente ya tienes este diálogo como ${natalAspect.type}...'
` : `
  '📌 Este aspecto NO existe en tu carta natal.
   Aparece SOLO este año para entrenamiento temporal de [habilidad].'
`}
```

### Problema 4: Frontend no Envía chartType/year

**Síntomas**:
- Backend recibe `chartType: undefined`
- Logs muestran `undefined` en año

**Solución**:
```typescript
// Verificar en ChartTooltips.tsx
const response = await fetch('/api/astrology/interpret-planet', {
  method: 'POST',
  body: JSON.stringify({
    userId,
    planetName,
    sign,
    house,
    degree,
    chartType,         // ⭐ Debe venir de props
    year: solarReturnYear  // ⭐ Debe existir en estado
  })
});

// Verificar props en componente padre
<ChartDisplay
  chartType="solar-return"  // ⭐ Explícito
  solarReturnYear={2025}    // ⭐ Explícito
/>
```

### Problema 5: MongoDB No Guarda chartType Correctamente

**Síntomas**:
- Búsquedas no encuentran interpretación SR
- chartType es `null` o `undefined`

**Solución**:
```typescript
// Verificar guardado
await db.collection('interpretations').updateOne(
  { userId, chartType: 'solar-return' },  // ⭐ Filtro correcto
  {
    $set: {
      userId,
      chartType: 'solar-return',  // ⭐ Explícito en $set
      interpretation: { ... },
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  },
  { upsert: true }
);

// Verificar búsqueda
const existing = await db.collection('interpretations').findOne({
  userId,
  chartType: 'solar-return'  // ⭐ Mismo valor exacto
});
```

---

## 🎓 Conceptos Clave para el Equipo

### 1. Lenguaje Temporal vs Permanente

| Tipo | Permanente (Natal) | Temporal (SR) |
|------|-------------------|---------------|
| Verbos | Eres, Tienes, Posees | Se activa, Entrenarás, Aprenderás |
| Pronombres | Tu esencia, Tu naturaleza | Este año, Durante 2025 |
| Declaraciones | "YO SOY..." | "Clave práctica: [acción]" |
| Enfoque | Identidad | Aprendizaje anual |

### 2. Comparación Natal-SR (Fórmula Maestra)

```
Natalmente, tu [PLANETA] en [SIGNO NATAL] Casa [CASA NATAL]
te da una naturaleza [CARACTERÍSTICA PERMANENTE].

Pero este año, con [PLANETA] en [SIGNO SR] Casa [CASA SR] SR,
la vida te pide [APRENDIZAJE TEMPORAL].

Clave ${YEAR}: "[ACCIÓN PRÁCTICA]"
```

### 3. Aspectos Permanentes vs Temporales

| Aspecto Natal | Aspecto SR |
|--------------|-----------|
| Diálogo interno permanente | Qué parte se activa este año |
| "Siempre llevas este conflicto/armonía" | "Este año entrenarás [habilidad]" |
| "YO integro..." | "Clave práctica: [acción]" |

### 4. Eventos Clave = Layer 3 (Agenda)

- **NO son interpretaciones de planetas**
- **SÍ son timing + acciones concretas**
- Incluyen: periodo, evento, tipo, descripción, acción_recomendada
- Lenguaje: "Sol transitando 90° desde SR...", "Momento de VERDAD"

---

## 📊 Métricas de Calidad

Una interpretación SR de calidad tiene:

✅ **Lenguaje Temporal**: 100% de frases usan "este año", "durante 2025", etc.
✅ **Comparación Natal**: Mínimo 1 párrafo compara con natal
✅ **Sin Identidad**: 0 instancias de "Eres...", "Tu esencia..."
✅ **Clave Práctica**: Declaración final es acción, no mantra
✅ **Logs Completos**: Console muestra comparación natal-SR

---

## 🔗 Referencias Rápidas

### Archivos Clave
- Prompts SR: `/src/utils/prompts/tripleFusedPrompts.ts`
- Servicio OpenAI: `/src/services/tripleFusedInterpretationService.ts`
- Endpoint Planetas: `/src/app/api/astrology/interpret-planet/route.ts`
- Endpoint Aspectos: `/src/app/api/astrology/interpret-natal/route.ts`
- Frontend Tooltips: `/src/components/astrology/ChartTooltips.tsx`

### Commits Importantes
- `03d011e` - Refactor prompt SR a plantilla maestra
- `56c15b4` - Implementar comparación Natal vs SR para planetas
- `ae56741` - Implementar comparación Natal vs SR para aspectos

### Testing
```bash
# Verificar que endpoint acepta chartType
curl -X POST http://localhost:3000/api/astrology/interpret-planet \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","planetName":"Venus","sign":"Capricornio","house":10,"chartType":"solar-return","year":2025}'

# Buscar interpretaciones SR en MongoDB
db.interpretations.find({ chartType: 'solar-return' }).pretty()
```

---

**Última Actualización**: 2025-01-22
**Versión**: 2.0
**Autor**: Claude Code
**Estado**: ✅ Sistema Completo e Implementado
