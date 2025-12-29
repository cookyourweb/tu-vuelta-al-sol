# 🪐 Interpretación Individual de Planetas - Retorno Solar

## 📅 Fecha: 2025-12-26

---

## 🎯 Objetivo

Implementar interpretaciones INDIVIDUALES de planetas en contexto de **Retorno Solar** con estructura tooltip/drawer diferenciada de la Carta Natal.

**DIFERENCIACIÓN CRÍTICA**:
- **Carta Natal** → Tono "Poético Antifrágil & Rebelde" (metáforas, emocional, permanente)
- **Retorno Solar** → Tono **PROFESIONAL y CONCRETO** (sin metáforas largas, anual, accionable)

---

## 🏗️ Arquitectura Implementada

### 1. Prompt
**Archivo**: `/src/utils/prompts/planetIndividualSolarReturnPrompt.ts`

**Función principal**:
```typescript
generatePlanetIndividualSolarReturnPrompt(data: PlanetSolarReturnData): string
```

**Parámetros de entrada**:
```typescript
interface PlanetSolarReturnData {
  planetName: string;        // "sol", "luna", "mercurio"
  planetSymbol: string;      // "☀️", "🌙", "☿"

  // Natal
  natalSign: string;         // "Aries"
  natalHouse: number;        // 1-12
  natalDegree: number;       // 0-30
  natalInterpretation?: string; // Interpretación guardada

  // Solar Return
  srSign: string;            // "Tauro"
  srHouse: number;           // 1-12
  srDegree: number;          // 0-30

  // Usuario
  userFirstName: string;
  returnYear: number;        // 2025
}
```

**Output**: Prompt completo que genera JSON con estructura tooltip/drawer

---

### 2. API Endpoint
**Archivo**: `/src/app/api/astrology/interpret-planet-sr/route.ts`

**Métodos**:

#### POST - Generar interpretación
```bash
POST /api/astrology/interpret-planet-sr
```

**Request Body**:
```json
{
  "userId": "abc123",
  "planetName": "urano",
  "returnYear": 2025,

  "natalSign": "Aries",
  "natalHouse": 3,
  "natalDegree": 15.2,
  "natalInterpretation": "Tu Urano natal...", // Opcional

  "srSign": "Tauro",
  "srHouse": 2,
  "srDegree": 23.3,

  "userFirstName": "Ana"
}
```

**Response**:
```json
{
  "success": true,
  "interpretation": {
    "tooltip": {...},
    "drawer": {...}
  },
  "planetKey": "urano-sr-2025",
  "message": "Interpretación de URANO para Retorno Solar 2025 generada correctamente"
}
```

#### GET - Obtener interpretación cacheada
```bash
GET /api/astrology/interpret-planet-sr?userId=abc123&planetName=urano&returnYear=2025
```

---

### 3. TypeScript Interfaces
**Archivo**: `/src/types/astrology/interpretation.ts`

**Interfaces añadidas**:

```typescript
// Tooltip (ficha técnica rápida)
export interface PlanetTooltipSR {
  simbolo: string;          // "♅"
  titulo: string;           // "Urano en Tauro en Casa 2"
  subtitulo: string;        // "Seguridad y recursos"
  grado: string;            // "23.3°"
  area_activada: string;    // "valores, recursos, seguridad"
  tipo_energia: string;     // "disruptiva – transformadora"
  frase_clave: string;      // "Esto no es bueno ni malo. Es una ACTIVACIÓN."
}

// Drawer - Sección 1: ¿Quién eres? (Base Natal)
export interface PlanetDrawerQuienEres {
  titulo: string;           // "🧬 QUIÉN ERES (Base Natal)"
  posicion_natal: string;   // "Urano en Aries en Casa 3"
  descripcion: string;      // 80-100 palabras
}

// Drawer - Sección 2: ¿Qué se activa?
export interface PlanetDrawerQueSeActiva {
  titulo: string;           // "⚡ QUÉ SE ACTIVA ESTE AÑO"
  posicion_sr: string;      // "Urano en Tauro en Casa 2"
  descripcion: string;      // 80-100 palabras
}

// Drawer - Sección 3: El cruce clave
export interface PlanetDrawerCruceClave {
  titulo: string;           // "🔄 EL CRUCE CLAVE (Natal + Año)"
  descripcion: string;      // 120-150 palabras - tensión o sinergia
}

// Drawer - Sección 4: Impacto real ⚠️ SIN METÁFORAS
export interface PlanetDrawerImpactoReal {
  titulo: string;           // "🎯 IMPACTO REAL EN TU VIDA"
  descripcion: string;      // 120-150 palabras - decisiones concretas
}

// Drawer - Sección 5: Cómo usar esta energía
export interface PlanetDrawerComoUsar {
  titulo: string;           // "💡 CÓMO USAR ESTA ENERGÍA A TU FAVOR"
  accion_concreta: string;  // 100-120 palabras - accionable
  ejemplo_practico: string; // 50-70 palabras - ejemplo del día a día
}

// Drawer - Sección 6: Sombras
export interface PlanetDrawerSombras {
  titulo: string;           // "⚠️ SOMBRAS A TRABAJAR"
  trampa_automatica: string; // 60-80 palabras - error automático
  antidoto: string;          // 60-80 palabras - solución concreta
}

// Drawer - Sección 7: Síntesis
export interface PlanetDrawerSintesis {
  titulo: string;           // "📌 SÍNTESIS"
  frase_resumen: string;    // 30-40 palabras - directo, sin poesía
}

// Drawer - Sección 8: Encaja en agenda
export interface PlanetDrawerEncajaAgenda {
  titulo: string;           // "📅 CÓMO ESTO ENCAJA EN TU AGENDA"
  luna_nueva: string;       // 40-50 palabras - acción Luna Nueva
  luna_llena: string;       // 40-50 palabras - revisión Luna Llena
  retrogradaciones: string; // 40-50 palabras - uso retrogradaciones
}

// Drawer completo (8 secciones)
export interface PlanetDrawerSR {
  quien_eres: PlanetDrawerQuienEres;
  que_se_activa: PlanetDrawerQueSeActiva;
  cruce_clave: PlanetDrawerCruceClave;
  impacto_real: PlanetDrawerImpactoReal;
  como_usar: PlanetDrawerComoUsar;
  sombras: PlanetDrawerSombras;
  sintesis: PlanetDrawerSintesis;
  encaja_agenda: PlanetDrawerEncajaAgenda;
}

// Interpretación completa (tooltip + drawer)
export interface PlanetIndividualSRInterpretation {
  tooltip: PlanetTooltipSR;
  drawer: PlanetDrawerSR;
}
```

---

## 📋 Ejemplo de Output

### Tooltip (Vista rápida al hacer hover)

```json
{
  "simbolo": "♅",
  "titulo": "Urano en Tauro en Casa 2",
  "subtitulo": "Seguridad y recursos",
  "grado": "23.3°",
  "area_activada": "valores, recursos, seguridad material y autoestima",
  "tipo_energia": "disruptiva – transformadora",
  "frase_clave": "Esto no es bueno ni malo. Es una ACTIVACIÓN."
}
```

### Drawer (Vista completa al hacer clic en "Ver detalles")

```json
{
  "quien_eres": {
    "titulo": "🧬 QUIÉN ERES (Base Natal)",
    "posicion_natal": "Urano en Aries en Casa 3",
    "descripcion": "Normalmente tu innovación surge en la comunicación y el aprendizaje. Eres rápido para captar nuevas ideas, te aburren las conversaciones rutinarias y necesitas experimentar con diferentes formas de expresarte. Tu mente es inquieta, innovadora y valora la independencia intelectual."
  },
  "que_se_activa": {
    "titulo": "⚡ QUÉ SE ACTIVA ESTE AÑO",
    "posicion_sr": "Urano en Tauro en Casa 2",
    "descripcion": "Este año el cambio no está en cómo piensas, sino en cómo te relacionas con tus recursos, valores y seguridad material. Casa 2 pide revisar qué te sostiene económicamente, qué valoras realmente y cómo generas estabilidad. Urano aquí significa que lo conocido puede volverse inestable."
  },
  "cruce_clave": {
    "titulo": "🔄 EL CRUCE CLAVE (Natal + Año)",
    "descripcion": "El choque es claro: normalmente innovas con ideas y comunicación (Aries Casa 3), pero este año el laboratorio es tu economía y valores (Tauro Casa 2). Como tu Urano natal es rápido y mental, sentirás fricción cuando los cambios materiales no respondan a la velocidad de tus ideas. Tauro exige lentitud, paciencia y tangibilidad — lo opuesto a Aries."
  },
  "impacto_real": {
    "titulo": "🎯 IMPACTO REAL EN TU VIDA",
    "descripcion": "Durante este período: te vuelves más consciente de dónde inviertes tu energía, qué relaciones drenan recursos, qué hábitos sostienen o erosionan tu estabilidad material. Puedes sentir urgencia por cambiar tu fuente de ingresos, reevaluar qué compras, o cuestionar si tus valores actuales reflejan quién eres ahora. Es probable que algo que considerabas estable ya no lo sea, y necesites experimentar con nuevas formas de generar seguridad."
  },
  "como_usar": {
    "titulo": "💡 CÓMO USAR ESTA ENERGÍA A TU FAVOR",
    "accion_concreta": "No fuerces estabilidad donde hay cambio. Observa qué necesita renovarse en tus finanzas, valores o autoestima. Prueba pequeños experimentos con recursos: diversifica ingresos, revisa gastos automáticos, cuestiona qué compras por hábito. No te resistas a la incomodidad — está señalando dónde tu seguridad necesita actualizarse.",
    "ejemplo_practico": "Si trabajas en un empleo fijo, investiga opciones freelance o ingresos pasivos. Si compras siempre las mismas cosas, pregunta: '¿Esto sigue alineado con mis valores actuales?' No se trata de destruir estabilidad, sino de experimentar con nuevas bases."
  },
  "sombras": {
    "titulo": "⚠️ SOMBRAS A TRABAJAR",
    "trampa_automatica": "Resistirte al cambio por miedo a perder seguridad, o cambiar todo impulsivamente sin construir nuevas bases. Otro error: intelectualizar el cambio sin hacerlo tangible (hablar de emprender pero no actuar).",
    "antidoto": "Cambios pequeños, tangibles y sostenidos. No destruyas lo que funciona antes de tener alternativas reales. Experimenta sin abandonar. Escucha la incomodidad como información, no como amenaza."
  },
  "sintesis": {
    "titulo": "📌 SÍNTESIS",
    "frase_resumen": "Este año no se trata de mantener lo conocido, sino de experimentar con nuevos valores y recursos que se alineen con quien estás siendo ahora. La seguridad que buscas no está en lo fijo, sino en tu capacidad de adaptarte."
  },
  "encaja_agenda": {
    "titulo": "📅 CÓMO ESTO ENCAJA EN TU AGENDA",
    "luna_nueva": "Inicia pequeños experimentos con recursos: abre una cuenta de ahorro, investiga nuevas fuentes de ingreso, revisa suscripciones automáticas.",
    "luna_llena": "Revisa si estás resistiendo cambios necesarios o cambiando impulsivamente sin construir bases. Evalúa qué experimentos funcionaron.",
    "retrogradaciones": "Si Urano retrograda este año, es momento de revisar cambios materiales que iniciaste. ¿Fueron sostenibles? ¿Reflejan tus valores reales?"
  }
}
```

---

## 🔑 Diferencias Críticas vs Carta Natal

### ❌ CARTA NATAL (Tooltip/Drawer)
```
Tono: "Poético Antifrágil & Rebelde"
Ejemplo: "Eres como un volcán dormido que despierta cuando alguien toca tu
seguridad. Tu Urano es la chispa que enciende revoluciones internas..."

Función: Describir QUIÉN ERES permanentemente
Lenguaje: Metáforas, emocional, transformador
```

### ✅ RETORNO SOLAR (Tooltip/Drawer)
```
Tono: Profesional y concreto
Ejemplo: "Durante este período: te vuelves más consciente de dónde inviertes
tu energía, qué relaciones drenan recursos, qué hábitos sostienen o erosionan
tu estabilidad material."

Función: Describir QUÉ SE ACTIVA este año
Lenguaje: Directo, accionable, sin metáforas largas
```

---

## 🔄 Flujo de Uso

### 1. Usuario hace clic en planeta del Retorno Solar

```javascript
// Frontend detecta clic en Urano del Solar Return Chart
onClick={() => {
  fetchPlanetInterpretationSR({
    userId: user.uid,
    planetName: 'urano',
    returnYear: 2025,
    natalSign: 'Aries',
    natalHouse: 3,
    natalDegree: 15.2,
    srSign: 'Tauro',
    srHouse: 2,
    srDegree: 23.3,
    userFirstName: 'Ana'
  });
}}
```

### 2. Backend verifica caché

```typescript
// Busca en MongoDB si ya existe interpretación generada
const cached = await db.collection('interpretations').findOne({
  userId,
  chartType: 'solar-return',
  returnYear: 2025,
  'interpretations.planets_individual.urano-sr-2025': { $exists: true }
});
```

### 3. Si no existe, genera con OpenAI

```typescript
// Genera prompt con datos natal vs SR
const prompt = generatePlanetIndividualSolarReturnPrompt({...});

// Llama OpenAI con response_format: json_object
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  response_format: { type: 'json_object' }
});

// Parse y guarda en MongoDB
const interpretation = JSON.parse(completion.choices[0].message.content);
```

### 4. Frontend muestra tooltip/drawer

```tsx
// Tooltip (hover)
<Tooltip>
  <TooltipSymbol>{interpretation.tooltip.simbolo}</TooltipSymbol>
  <TooltipTitle>{interpretation.tooltip.titulo}</TooltipTitle>
  <TooltipGrade>Grado: {interpretation.tooltip.grado}</TooltipGrade>
  <TooltipArea>{interpretation.tooltip.area_activada}</TooltipArea>
  <TooltipKey>{interpretation.tooltip.frase_clave}</TooltipKey>
</Tooltip>

// Drawer (clic)
<Drawer>
  <Section>{interpretation.drawer.quien_eres}</Section>
  <Section>{interpretation.drawer.que_se_activa}</Section>
  <Section>{interpretation.drawer.cruce_clave}</Section>
  <Section>{interpretation.drawer.impacto_real}</Section>
  <Section>{interpretation.drawer.como_usar}</Section>
  <Section>{interpretation.drawer.sombras}</Section>
  <Section>{interpretation.drawer.sintesis}</Section>
  <Section>{interpretation.drawer.encaja_agenda}</Section>
</Drawer>
```

---

## 🧪 Testing

### Probar endpoint con curl

```bash
curl -X POST http://localhost:3000/api/astrology/interpret-planet-sr \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "planetName": "urano",
    "returnYear": 2025,
    "natalSign": "Aries",
    "natalHouse": 3,
    "natalDegree": 15.2,
    "srSign": "Tauro",
    "srHouse": 2,
    "srDegree": 23.3,
    "userFirstName": "Ana"
  }'
```

### Verificar en MongoDB

```javascript
db.interpretations.findOne({
  userId: "test123",
  chartType: "solar-return",
  returnYear: 2025
})

// Debería tener:
// interpretations.planets_individual.urano-sr-2025 = { tooltip, drawer }
```

### Obtener interpretación cacheada

```bash
curl "http://localhost:3000/api/astrology/interpret-planet-sr?userId=test123&planetName=urano&returnYear=2025"
```

---

## 📊 Comparación de Estructuras

### ANTES (Sin tooltip/drawer individual)

El usuario veía solo la comparación planetaria del informe completo:

```json
{
  "comparaciones_planetarias": {
    "urano": {
      "natal": { "posicion": "...", "descripcion": "..." },
      "solar_return": { "posicion": "...", "descripcion": "..." },
      "choque": "...",
      "que_hacer": "..."
    }
  }
}
```

**Problema**: No había tooltip/drawer específico para cada planeta.

### DESPUÉS (Con tooltip/drawer individual)

Ahora el usuario puede hacer clic en Urano y ver:

**Tooltip** (vista rápida):
- Símbolo, título, grado, área activada, tipo de energía

**Drawer** (vista completa - 8 secciones):
1. QUIÉN ERES (Base Natal)
2. QUÉ SE ACTIVA ESTE AÑO
3. EL CRUCE CLAVE (Natal + Año)
4. **IMPACTO REAL EN TU VIDA** (decisiones concretas, NO metáforas)
5. **CÓMO USAR ESTA ENERGÍA A TU FAVOR** (accionable con ejemplo)
6. SOMBRAS A TRABAJAR (trampa + antídoto)
7. SÍNTESIS (directa)
8. CÓMO ESTO ENCAJA EN TU AGENDA

---

## ⚠️ Reglas de Tono Críticas

### ❌ NO HACER (estilo Natal - poético):

> "Eres como un volcán dormido que despierta cuando alguien toca tu seguridad.
> Tu Urano es la chispa que enciende revoluciones internas, el rayo que
> parte el cielo de lo conocido..."

**Problema**: Metáforas largas, tono emocional, enfoque en identidad permanente.

### ✅ SÍ HACER (estilo SR - profesional):

> "Durante este período: te vuelves más consciente de dónde inviertes tu
> energía, qué relaciones drenan recursos, qué hábitos sostienen o erosionan
> tu estabilidad material. Puedes sentir urgencia por cambiar tu fuente de
> ingresos o reevaluar si tus valores actuales reflejan quién eres ahora."

**Correcto**: Directo, concreto, decisiones específicas, sin metáforas largas.

---

## 🚀 Próximos Pasos

### ✅ Completado
1. Prompt creado: `planetIndividualSolarReturnPrompt.ts`
2. Endpoint creado: `interpret-planet-sr/route.ts`
3. Interfaces TypeScript añadidas
4. Documentación completa

### ⏳ Pendiente
1. **Actualizar Frontend**:
   - Modificar componente de planeta en Solar Return Chart
   - Añadir handler `onClick` para llamar endpoint
   - Crear componente `PlanetTooltipSR` (tooltip hover)
   - Crear componente `PlanetDrawerSR` (drawer clic)
   - Diferenciar visualmente de tooltip/drawer Natal

2. **Testing Completo**:
   - Probar con todos los planetas (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno)
   - Verificar calidad de respuestas de OpenAI
   - Ajustar prompt si es necesario
   - Validar longitudes de texto

3. **Optimizaciones**:
   - Añadir caché con TTL (time-to-live)
   - Implementar retry logic si OpenAI falla
   - Añadir loading states en frontend
   - Considerar generación batch de todos los planetas

---

## 📂 Archivos Creados/Modificados

### Creados
1. `/src/utils/prompts/planetIndividualSolarReturnPrompt.ts` ✅
2. `/src/app/api/astrology/interpret-planet-sr/route.ts` ✅
3. `/PLANETA_INDIVIDUAL_SR.md` ✅ (este archivo)

### Modificados
1. `/src/types/astrology/interpretation.ts` ✅
   - Añadidas interfaces: `PlanetTooltipSR`, `PlanetDrawerSR`, `PlanetIndividualSRInterpretation`, etc.

### Por Modificar
1. Frontend component para Solar Return Chart
2. Tooltip component específico para SR
3. Drawer component específico para SR

---

## 🎓 Filosofía del Sistema

> **"La Carta Natal describe quién eres con poesía. El Retorno Solar describe qué se activa este año con profesionalidad. La diferencia está en el lenguaje, no en la profundidad."**

**Separación de tonos**:
- **Natal** = Identidad permanente (metáforas, emocional, "Eres como...")
- **Solar Return** = Activación anual (directo, concreto, "Durante este período...")

**Personalización real**:
- Cada interpretación es única
- Basada en datos astronómicos reales (natal vs SR)
- Sin predicciones genéricas
- Tono diferenciado según contexto

---

**Última actualización**: 2025-12-26
**Branch**: `claude/fix-solar-return-endpoints-vLCCr`
**Autor**: Claude Code Session
