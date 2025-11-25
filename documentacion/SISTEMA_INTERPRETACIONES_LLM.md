# 🤖 Sistema de Interpretaciones con LLM

## 📚 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Flujo Completo de Interpretación](#flujo-completo-de-interpretación)
4. [El Prompt: "Poético Antifrágil & Rebelde Constructivo"](#el-prompt-poético-antifrágil--rebelde-constructivo)
5. [Manejo del LLM (OpenAI)](#manejo-del-llm-openai)
6. [Estructura JSON de Respuesta](#estructura-json-de-respuesta)
7. [Guía de Interpretación](#guía-de-interpretación)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visión General

**Tu Vuelta al Sol** usa OpenAI GPT-4o para generar interpretaciones astrológicas completas con un estilo único llamado **"Poético Antifrágil & Rebelde Constructivo"**.

### Características Clave

- ✨ **Interpretaciones Personalizadas**: Cada carta natal genera interpretaciones únicas
- 🎨 **Estilo Único**: Tono poético, empoderador y pedagógico
- 📊 **Estructura Completa**: Sol, Luna, planetas, aspectos, casas, elementos y modalidades
- 🔄 **OpenAI GPT-4o**: Modelo optimizado para generar contenido estructurado
- 📝 **Respuestas JSON**: Formato estructurado para fácil integración en UI

### Objetivos del Sistema

1. **Educativo**: Explicar conceptos astrológicos sin tecnicismos
2. **Empoderador**: Transformar sombras en oportunidades de crecimiento
3. **Práctico**: Ofrecer acciones concretas vinculadas a fases lunares
4. **Profundo**: Integrar psicología con astrología sin ser terapéutico

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO SOLICITA CARTA                   │
└───────────────────────────┬─────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │  /api/charts/natal (POST)         │
         │  Endpoint Principal                │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │  1. Calcula Carta con Prokerala   │
         │     - Posiciones planetarias      │
         │     - Casas                       │
         │     - Aspectos                    │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │  2. Genera Prompt Completo        │
         │     completeNatalChartPrompt.ts   │
         │     - Datos de usuario            │
         │     - Posiciones planeta          │
         │     - Distribución elemental      │
         │     - Instrucciones de estilo     │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │  3. Envía a OpenAI GPT-4o         │
         │     completeNatalInterpretation   │
         │     Service.ts                    │
         │     - Modelo: gpt-4o              │
         │     - Temperature: 0.7            │
         │     - Response: JSON              │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │  4. Procesa Respuesta JSON        │
         │     - Valida estructura           │
         │     - Sanitiza contenido          │
         │     - Guarda en MongoDB           │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │  5. Devuelve al Frontend          │
         │     - JSON estructurado           │
         │     - Listo para renderizar       │
         └───────────────────────────────────┘
```

### Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `/src/utils/prompts/completeNatalChartPrompt.ts` | **Genera el prompt maestro** con datos de carta y estilo |
| `/src/services/completeNatalInterpretationService.ts` | **Servicio LLM** que se comunica con OpenAI |
| `/src/app/api/charts/natal/route.ts` | **Endpoint API** que orquesta todo el proceso |
| `/src/components/astrology/InterpretationDisplay.tsx` | **Componente UI** que renderiza las interpretaciones |

---

## 🔄 Flujo Completo de Interpretación

### Paso a Paso Detallado

#### 1️⃣ **Usuario Completa Datos de Nacimiento**

```typescript
// Datos necesarios
{
  fullName: "María García",
  birthDate: "1990-03-15",
  birthTime: "14:30",
  birthPlace: "Madrid, España",
  latitude: 40.4168,
  longitude: -3.7038,
  timezone: "Europe/Madrid"
}
```

#### 2️⃣ **API Calcula Carta Natal**

```typescript
// /src/app/api/charts/natal/route.ts

// 1. Calcular carta con Prokerala
const chartData = await prokeralaService.getNatalChart({
  datetime: birthDateTime,
  coordinates: { lat, lon },
  ayanamsa: 0, // Tropical
  house_system: 'placidus'
});

// 2. Extraer datos
const planets = chartData.planets; // Sol, Luna, Mercurio, etc.
const houses = chartData.houses;   // Casas 1-12
const aspects = chartData.aspects; // Conjunciones, oposiciones, etc.
```

#### 3️⃣ **Generar Prompt Completo**

```typescript
// /src/utils/prompts/completeNatalChartPrompt.ts

const prompt = generateCompleteNatalChartPrompt(chartData, userProfile);

// El prompt incluye:
// - Instrucciones de estilo ("Poético Antifrágil")
// - Datos del usuario (nombre, edad, etc.)
// - Posiciones planetarias exactas
// - Estructura JSON esperada
// - Ejemplos de interpretación
```

#### 4️⃣ **Enviar a OpenAI**

```typescript
// /src/services/completeNatalInterpretationService.ts

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  temperature: 0.7,
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant that generates detailed astrological chart interpretations in valid JSON format.'
    },
    {
      role: 'user',
      content: prompt
    }
  ],
  response_format: { type: 'json_object' }
});

const interpretation = JSON.parse(response.choices[0].message.content);
```

#### 5️⃣ **Guardar y Devolver**

```typescript
// Guardar en MongoDB
await Chart.findOneAndUpdate(
  { userId },
  {
    natalChart: chartData,
    interpretation: interpretation
  }
);

// Devolver al frontend
return NextResponse.json({
  success: true,
  chart: chartData,
  interpretation: interpretation
});
```

---

## 🎨 El Prompt: "Poético Antifrágil & Rebelde Constructivo"

### Filosofía del Estilo

Este estilo combina:

1. **Poético**: Metáforas, lenguaje evocativo
2. **Antifrágil**: Sombras como oportunidades de crecimiento
3. **Rebelde**: Directo, sin espiritualidad "light"
4. **Constructivo**: Acciones prácticas, empoderamiento

### Estructura del Prompt

El prompt se genera en `/src/utils/prompts/completeNatalChartPrompt.ts`:

```typescript
export function generateCompleteNatalChartPrompt(
  chartData: ChartData,
  userProfile: UserProfile
): string {
  // 1. HEADER: Instrucciones de estilo
  // 2. DATOS: Información de la carta
  // 3. ESTRUCTURA: JSON esperado
  // 4. INSTRUCCIONES FINALES
}
```

### 1. Header - Instrucciones de Estilo

```typescript
`Eres un astrólogo con el estilo "Poético Antifrágil & Rebelde Constructivo".

🔥 TONO: Poético Antifrágil & Rebelde Constructivo
Escribes con fuerza, claridad y sabiduría. No es espiritualidad "light": es evolución, músculo emocional, crecimiento real.
Mezclas contundencia + compasión + claridad pedagógica.
Siempre muestras las sombras, pero desde un enfoque sanador, accionable, práctico.
Eres rebelde sin ser agresivo, inspirador sin ser cursi.

💬 VOZ NARRATIVA:
- Hablas directo al lector: "Tú eres...", "Tu energía..."
- Usas metáforas poderosas, pero comprensibles
- SIEMPRE explicas conceptos astrológicos sin tecnicismos
- Cada interpretación incluye: qué significa → cómo se vive → qué se potencia → qué se transforma

⚡ FILOSOFÍA ANTIFRÁGIL (obligatoria):
Cada interpretación debe incluir:
- Qué te fortalece
- Qué te entrena
- Qué te hace evolucionar
- Cómo usar tus puntos retadores como superpoderes
- Acción real → siempre un mini-protocolo o consejo concreto

📚 ESTRUCTURA PEDAGÓGICA (obligatoria):
Cada planeta/casa SIEMPRE debe incluir:
1. Qué significa esa casa/posición (en lenguaje humano claro)
2. ✨ Tu Esencia (interpretación poético-antifrágil)
3. ⚡ Tu Sombra TRANSFORMATIONAL (reescrita como oportunidad)
4. 🔥 Tu Regalo Evolutivo (fortalezas únicas)
5. 🎯 Mini-Coach (acción práctica y específica)
6. 🧬 Mantra (frase corta e inspiradora)`
```

### 2. Datos - Información de la Carta

```typescript
`═══════════════════════════════════════════════
DATOS DE LA CARTA NATAL DE ${userProfile.name.toUpperCase()}
═══════════════════════════════════════════════

PERSONA:
- Nombre: ${userProfile.name}
- Edad: ${userProfile.age} años
- Fecha: ${userProfile.birthDate}
- Hora: ${userProfile.birthTime}
- Lugar: ${userProfile.birthPlace}

PUNTOS CARDINALES:
- Ascendente: ${chartData.ascendant.sign} ${chartData.ascendant.degree}°
- Medio Cielo: ${chartData.midheaven.sign} ${chartData.midheaven.degree}°

POSICIONES PLANETARIAS:
${formatPlanetsForPrompt(chartData.planets)}

ASPECTOS PRINCIPALES:
${formatAspectsForPrompt(chartData.aspects)}

DISTRIBUCIÓN ELEMENTAL (calculada):
🔥 Fuego: ${elementos.fire.percentage}% (${elementos.fire.planets.join(', ')})
🌍 Tierra: ${elementos.earth.percentage}% (${elementos.earth.planets.join(', ')})
💨 Aire: ${elementos.air.percentage}% (${elementos.air.planets.join(', ')})
🌊 Agua: ${elementos.water.percentage}% (${elementos.water.planets.join(', ')})`
```

### 3. Estructura - JSON Esperado

Cada planeta tiene esta estructura:

```json
{
  "sol": {
    "posicion": "Acuario Casa 1",
    "que_significa_casa": "[Una línea pedagógica: 'Casa 1 = tu identidad visible']",
    "tu_esencia": "[2-3 párrafos poético-transformacionales]",
    "tu_sombra_transformational": "[2-3 líneas: sombra como oportunidad]",
    "tu_regalo_evolutivo": "[3 líneas de fortalezas]",
    "mini_coach": "[3-4 acciones prácticas bullet points]",
    "mantra": "[Frase corta y poderosa]"
  }
}
```

### Ejemplo de Interpretación Generada

**Sol en Acuario Casa 1:**

```markdown
**que_significa_casa**:
"Casa 1 = tu identidad visible; tu puerta de entrada al mundo; cómo impactas antes de hablar"

**tu_esencia**:
"Naciste con la frecuencia de quien viene a INNOVAR. Tu energía en Casa 1 no pide permiso: proyecta AUTENTICIDAD RADICAL. Donde otros siguen el guión social, tú escribes el tuyo. Tu presencia es un portal hacia el futuro. El mundo te percibe como diferente, visionario, inconfundible. Tu sola existencia cuestiona lo establecido..."

**tu_sombra_transformational**:
"A veces puedes sentirte demasiado raro o aislado. No es desconexión: es tu frecuencia buscando su tribu. Tu rareza no es defecto. Es tu forma de FILTRAR. Solo atraes a quienes pueden vibrar contigo..."

**tu_regalo_evolutivo**:
"Ver futuros que otros no imaginan. Liberar a los demás con tu ejemplo. Ser catalizador de cambio sin esforzarte, solo siendo tú."

**mini_coach**:
"• Durante Luna Nueva, siembra UNA idea disruptiva en tu vida
• Conecta con comunidad que comparta tu visión
• Cuando te sientas 'demasiado raro', pregúntate: ¿o estoy en el lugar equivocado?"

**mantra**:
"Mi rareza es mi frecuencia. Los míos me encontrarán."
```

---

## 🤖 Manejo del LLM (OpenAI)

### Configuración del Servicio

**Archivo**: `/src/services/completeNatalInterpretationService.ts`

```typescript
import OpenAI from 'openai';

// 1. Inicializar cliente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 2. Función principal
export async function generateCompleteNatalInterpretation(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<CompleteInterpretation> {

  // 2.1 Generar prompt
  const prompt = generateCompleteNatalChartPrompt(chartData, userProfile);

  // 2.2 Llamar a OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',              // Modelo optimizado
    temperature: 0.7,              // Balance creatividad/consistencia
    max_tokens: 16000,             // Respuesta larga permitida
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that generates detailed astrological chart interpretations in valid JSON format. Always respond with ONLY JSON, no additional text.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' } // Forzar JSON
  });

  // 2.3 Parsear respuesta
  const content = response.choices[0].message.content;
  const interpretation = JSON.parse(content);

  // 2.4 Validar estructura
  validateInterpretationStructure(interpretation);

  return interpretation;
}
```

### Parámetros Clave

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| **model** | `gpt-4o` | Modelo optimizado con mejor velocidad y menor costo que GPT-4 |
| **temperature** | `0.7` | Balance entre creatividad (> 0.7) y consistencia (< 0.7) |
| **max_tokens** | `16000` | Permite respuestas largas y detalladas |
| **response_format** | `json_object` | Garantiza que la respuesta sea JSON válido |

### Manejo de Errores

```typescript
try {
  const interpretation = await generateCompleteNatalInterpretation(chartData, userProfile);
  return interpretation;

} catch (error) {
  // 1. Error de OpenAI (API)
  if (error.code === 'insufficient_quota') {
    throw new Error('Quota de OpenAI excedida');
  }

  // 2. Error de contenido (moderación)
  if (error.code === 'content_filter') {
    throw new Error('Contenido rechazado por filtros de OpenAI');
  }

  // 3. Error de parsing JSON
  if (error instanceof SyntaxError) {
    throw new Error('Respuesta de OpenAI no es JSON válido');
  }

  // 4. Error de validación estructura
  if (error.name === 'ValidationError') {
    throw new Error('Estructura de interpretación inválida');
  }

  // 5. Otro error
  console.error('Error generando interpretación:', error);
  throw error;
}
```

### Sistema de Retry

Para manejar fallos temporales:

```typescript
async function generateWithRetry(
  chartData: ChartData,
  userProfile: UserProfile,
  maxRetries = 3
): Promise<CompleteInterpretation> {

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateCompleteNatalInterpretation(chartData, userProfile);
    } catch (error) {
      if (attempt === maxRetries) throw error;

      // Esperar antes de reintentar (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}
```

---

## 📋 Estructura JSON de Respuesta

### Respuesta Completa

```typescript
interface CompleteInterpretation {
  // 1. Síntesis de puntos fundamentales
  puntos_fundamentales: {
    sol: PuntoFundamental;
    luna: PuntoFundamental;
    ascendente: PuntoFundamental;
    medio_cielo: PuntoFundamental;
    nodo_norte: PuntoFundamental;
  };

  // 2. Análisis elemental
  sintesis_elemental: {
    fuego: ElementoAnalisis;
    tierra: ElementoAnalisis;
    aire: ElementoAnalisis;
    agua: ElementoAnalisis;
    configuracion_alquimica: string;
    elemento_escaso?: string;
  };

  // 3. Análisis modal
  modalidades: {
    cardinal: ModalidadAnalisis;
    fijo: ModalidadAnalisis;
    mutable: ModalidadAnalisis;
    ritmo_accion: string;
  };

  // 4. Esencia revolucionaria
  esencia_revolucionaria: string;

  // 5. Interpretaciones planetarias completas
  interpretaciones_planetarias: {
    sol: InterpretacionPlanetaria;
    luna: InterpretacionPlanetaria;
    ascendente: InterpretacionPlanetaria;
    mercurio: InterpretacionPlanetaria;
    venus: InterpretacionPlanetaria;
    marte: InterpretacionPlanetaria;
    jupiter: InterpretacionPlanetaria;
    saturno: InterpretacionPlanetaria;
    urano: InterpretacionPlanetaria;
    neptuno: InterpretacionPlanetaria;
    pluton: InterpretacionPlanetaria;
    quiron: InterpretacionPlanetaria;
    lilith: InterpretacionPlanetaria;
    nodo_norte: InterpretacionPlanetaria;
  };

  // 6. Aspectos destacados
  aspectos_destacados: {
    stelliums: string;
    aspectos_tensos: string;
    aspectos_armoniosos: string;
    patron_dominante: string;
  };

  // 7. Integración de carta
  integracion_carta: {
    hilo_de_oro: string;
    sintesis: string;
    polaridades: Polaridad[];
  };

  // 8. Áreas adicionales
  fortalezas_educativas: FortalezasEducativas;
  areas_especializacion: AreaEspecializacion[];
  patrones_sanacion: PatronesSanacion;
  manifestacion_amor: ManifestacionAmor;
  visualizacion_guiada: VisualizacionGuiada;
  datos_para_agenda: DatosAgenda;

  // 9. Declaración final
  declaracion_poder_final: string;
  mantra_personal: string;
}
```

### Estructura de Interpretación Planetaria

```typescript
interface InterpretacionPlanetaria {
  posicion: string;                    // "Acuario Casa 1"
  que_significa_casa: string;          // Pedagogía de una línea
  tu_esencia: string;                  // 2-3 párrafos poéticos
  tu_sombra_transformational: string;  // Sombra como oportunidad
  tu_regalo_evolutivo: string;         // Fortalezas únicas
  mini_coach: string;                  // 3-4 acciones prácticas
  mantra: string;                      // Frase empoderadora
}
```

---

## 📖 Guía de Interpretación

### Para Desarrolladores

#### ¿Cómo leer el prompt?

El prompt tiene 4 secciones principales:

1. **Header (líneas 126-164)**: Define el estilo y tono
2. **Datos (líneas 166-196)**: Información de la carta
3. **Estructura (líneas 198-406)**: JSON esperado con ejemplos
4. **Instrucciones (líneas 408-417)**: Reglas finales

#### ¿Cómo modificar el estilo?

Para cambiar el tono general, edita el header:

```typescript
// Archivo: /src/utils/prompts/completeNatalChartPrompt.ts
// Líneas: 126-164

return `Eres un astrólogo con el estilo "Poético Antifrágil & Rebelde Constructivo".

// MODIFICAR AQUÍ para cambiar el tono general
🔥 TONO: [TU DESCRIPCIÓN]
...
`;
```

#### ¿Cómo agregar nuevos campos?

1. Agregar al tipo TypeScript:

```typescript
// /src/types/interpretations.ts
export interface InterpretacionPlanetaria {
  // Campos existentes...
  nuevo_campo: string; // ← Agregar aquí
}
```

2. Agregar al prompt JSON:

```typescript
// /src/utils/prompts/completeNatalChartPrompt.ts
"sol": {
  // Campos existentes...
  "nuevo_campo": "[Instrucciones para el LLM]"
}
```

3. Actualizar componente de display:

```typescript
// /src/components/astrology/InterpretationDisplay.tsx
<div>
  <h3>Nuevo Campo</h3>
  <p>{interpretation.sol.nuevo_campo}</p>
</div>
```

### Para Astrólogos

#### ¿Cómo se interpretan los planetas?

Cada planeta sigue esta estructura:

1. **que_significa_casa**: Explicación pedagógica sin tecnicismos
2. **tu_esencia**: Interpretación profunda con metáforas
3. **tu_sombra_transformational**: Aspectos retadores como oportunidades
4. **tu_regalo_evolutivo**: Fortalezas y dones únicos
5. **mini_coach**: Acciones prácticas vinculadas a fases lunares
6. **mantra**: Afirmación empoderadora

#### ¿Cómo se equilibra luz y sombra?

El sistema siempre presenta:
- **Luz**: En "tu_esencia" y "tu_regalo_evolutivo"
- **Sombra**: En "tu_sombra_transformational" pero reencuadrada como oportunidad
- **Balance**: La sombra nunca se presenta como "defecto" sino como "entrenamiento"

#### Ejemplo de balance:

**❌ MAL (sombra como defecto):**
> "Tu Luna en Capricornio te hace frío y distante emocionalmente."

**✅ BIEN (sombra como oportunidad):**
> "A veces tu Luna en Capricornio puede sentirse como frialdad emocional. No es desconexión: es tu sistema pidiendo estructura emocional. Tu capacidad para mantener la calma en crisis emocionales es tu superpoder. Cuando otros colapsan, tú sostienes."

---

## 🔧 Troubleshooting

### Problema: OpenAI rechaza el contenido

**Error**: `"refusal": "I'm sorry, I can't assist with that request."`

**Causa**: Lenguaje demasiado agresivo o confrontacional

**Solución**:
1. Revisar header del prompt
2. Eliminar palabras como: GOLPEA, CRUDO, DISRUPTIVO en mayúsculas
3. Reemplazar con: transformacional, empoderador, claro
4. Ver commit `4418b26` para referencia

### Problema: Respuesta JSON inválida

**Error**: `SyntaxError: Unexpected token`

**Causa**: LLM devolvió texto plano o JSON mal formado

**Solución**:
```typescript
// Agregar validación antes de parsear
const content = response.choices[0].message.content;

// Intentar limpiar
const cleanedContent = content
  .replace(/```json\n/g, '')
  .replace(/```/g, '')
  .trim();

try {
  const interpretation = JSON.parse(cleanedContent);
} catch (error) {
  console.error('JSON inválido:', cleanedContent);
  throw new Error('No se pudo parsear la respuesta de OpenAI');
}
```

### Problema: Respuesta incompleta

**Error**: Faltan campos en la interpretación

**Causa**:
- Token limit alcanzado
- Instrucciones poco claras
- Temperatura muy alta

**Solución**:
1. Aumentar `max_tokens` a 16000
2. Ser más específico en las instrucciones
3. Bajar `temperature` a 0.6
4. Dividir en múltiples llamadas si es necesario

### Problema: Interpretaciones genéricas

**Error**: Todas las interpretaciones suenan iguales

**Causa**:
- No se están usando los datos específicos
- Temperature muy baja

**Solución**:
1. Verificar que el prompt incluye datos específicos:
   ```typescript
   `Sol en ${sun?.sign} Casa ${sun?.house}`
   ```
2. Subir temperature a 0.8
3. Agregar más ejemplos específicos al prompt

### Problema: Timeout

**Error**: Request timeout después de 60s

**Causa**: Respuesta muy larga o API lenta

**Solución**:
```typescript
// Aumentar timeout
const response = await fetch('/api/charts/natal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  signal: AbortSignal.timeout(120000) // 2 minutos
});
```

---

## 📊 Métricas y Performance

### Tiempos Esperados

| Operación | Tiempo |
|-----------|--------|
| Cálculo de carta (Prokerala) | 2-5 segundos |
| Generación prompt | < 1 segundo |
| Llamada OpenAI | 30-60 segundos |
| Parsing y validación | < 1 segundo |
| Guardado MongoDB | 1-2 segundos |
| **TOTAL** | **35-70 segundos** |

### Costos OpenAI

| Modelo | Input | Output | Costo por Carta |
|--------|-------|--------|----------------|
| GPT-4o | $0.0025/1K tokens | $0.01/1K tokens | ~$0.50-0.80 |

**Cálculo**:
- Input: ~10K tokens (prompt)
- Output: ~15K tokens (interpretación)
- Costo = (10 × 0.0025) + (15 × 0.01) = $0.175

### Optimizaciones

1. **Cache de interpretaciones**: Guardar en MongoDB
2. **Reutilizar para Solar Return**: Misma carta base
3. **Batch processing**: Generar múltiples secciones en paralelo
4. **Modelo más barato para regeneraciones**: Usar GPT-4o-mini

---

## 🚀 Próximos Pasos

### Mejoras Planificadas

- [ ] **Streaming**: Mostrar interpretación mientras se genera
- [ ] **Regeneración parcial**: Solo regenerar secciones específicas
- [ ] **Múltiples idiomas**: Soporte para inglés, portugués
- [ ] **Personalización de tono**: Permitir al usuario elegir estilo
- [ ] **Feedback loop**: Mejorar con ratings de usuarios

### Experimentación

- [ ] Probar GPT-4o-mini para secciones menos críticas
- [ ] A/B testing de diferentes temperatures
- [ ] Comparar respuestas con/sin examples en prompt
- [ ] Medir impacto de longitud del prompt en calidad

---

**Última actualización**: 2025-11-25
**Versión**: 1.0.0
**Mantenedor**: Equipo Tu Vuelta al Sol
