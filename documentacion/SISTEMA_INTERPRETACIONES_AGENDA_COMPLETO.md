# 📖 Sistema de Interpretaciones de Agenda - Arquitectura Completa

**Fecha:** 2026-01-17
**Versión:** 1.0.0
**Autor:** Equipo Tu Vuelta al Sol
**Estado:** Documentación Técnica - Lista para Implementación

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura de 3 Capas](#arquitectura-de-3-capas)
3. [Análisis de Costes y Performance](#análisis-de-costes-y-performance)
4. [Flujo de Datos Completo](#flujo-de-datos-completo)
5. [Implementación Técnica](#implementación-técnica)
6. [Sistema de Monetización](#sistema-de-monetización)
7. [Integración con Calendarios Externos](#integración-con-calendarios-externos)
8. [Roadmap de Desarrollo](#roadmap-de-desarrollo)

---

## 🎯 RESUMEN EJECUTIVO

### Problema a Resolver

Actualmente tenemos **DOS productos astrológicos separados**:
1. **Agenda Online**: Calendario interactivo con eventos astrológicos
2. **Agenda Libro**: Versión imprimible en formato libro A5

**Ambos necesitan interpretaciones personalizadas** de eventos (lunas nuevas, lunas llenas, eclipses, ingresos planetarios, etc.).

### Solución: Sistema de 3 Capas

**Generación inteligente de interpretaciones** que:
- Se reutilizan entre agenda online y libro
- Se generan bajo demanda (no todo de golpe)
- Se guardan en BD para reutilización
- Optimizan coste y tiempo de generación

### Resultado Esperado

- ✅ **Agenda online**: Interpretaciones disponibles mes a mes
- ✅ **Agenda libro**: Primera generación 1-2 min, después instantáneo
- ✅ **Coste por usuario**: ~$0.40-$0.60 (en lugar de $1.00)
- ✅ **UX optimizada**: Sin esperas largas nunca

---

## 🏗️ ARQUITECTURA DE 3 CAPAS

### 📊 Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO CREA CICLO SOLAR                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  CAPA 1: Generación Base (Instantáneo)                     │
│  - Eventos básicos sin interpretaciones                     │
│  - Estructura del ciclo                                     │
│  - ~80 eventos: lunas, ingresos, retrogradaciones          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  CAPA 2: Generación Incremental del Mes Actual (30 seg)   │
│  - Solo eventos del mes en curso                           │
│  - 10-12 interpretaciones                                  │
│  - Background mientras usuario ve agenda                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  CAPA 3: Completar al Abrir Libro (1-2 min primera vez)   │
│  - Genera interpretaciones faltantes                       │
│  - Loading elegante con progreso                           │
│  - Próximas veces: Instantáneo (todo en BD)               │
└─────────────────────────────────────────────────────────────┘
```

### Capa 1: Generación Base ⚡

**Cuándo:** Al crear ciclo solar (click en "Generar Ciclo")

**Qué se genera:**
```typescript
{
  userId: "user123",
  cycleStart: "2025-02-10",
  cycleEnd: "2026-02-09",
  yearLabel: "2025-2026",
  events: [
    {
      id: "lunar-2025-02-28",
      type: "new_moon",
      date: "2025-02-28",
      title: "Luna Nueva en Piscis",
      house: 3,
      // ❌ SIN interpretation todavía
    },
    // ... ~80 eventos más
  ],
  status: "active"
}
```

**Tiempo:** ~1 minuto
**Coste:** $0 (sin llamadas a OpenAI)
**Almacenamiento:** MongoDB `solarcycles` collection

---

### Capa 2: Generación Incremental del Mes 📅

**Cuándo:**
- Automáticamente después de crear ciclo (background)
- Al navegar a un mes nuevo en la agenda online

**Qué se genera:**

```typescript
// Para cada evento importante del mes actual
{
  id: "lunar-2025-02-28",
  type: "new_moon",
  date: "2025-02-28",
  title: "Luna Nueva en Piscis",
  house: 3,
  // ✅ CON interpretation generada
  interpretation: {
    titulo_evento: "Luna Nueva en Piscis - Tu Portal de Materialización",
    clima_del_dia: ["Renovación", "Inicio", "Siembra de intenciones"],
    mensaje_sintesis: "Para TI, María, con tu Sol en Géminis Casa 3...",
    como_te_afecta: "Esta Luna Nueva activa tu Casa 3 natal...",
    interpretacion_practica: [...],
    acciones_concretas: [...],
    preguntas_reflexion: [...],
    perspectiva_evolutiva: "..."
  }
}
```

**Criterio de eventos a interpretar:**
```typescript
function shouldGenerateInterpretation(event: AstrologicalEvent): boolean {
  const importantTypes = [
    'new_moon',      // Luna nueva ✅
    'full_moon',     // Luna llena ✅
    'eclipse',       // Eclipses ✅
    'retrograde',    // Solo Mercurio, Venus, Marte (no Plutón) ✅
  ];

  return importantTypes.includes(event.type);
}
```

**Eventos por mes típico:**
- 1 Luna nueva
- 1 Luna llena
- 0-1 Eclipse
- 2-3 Ingresos planetarios importantes
- 0-1 Retrogradación

**Total: 10-12 interpretaciones por mes**

**Tiempo:** ~30-40 segundos
**Coste:** ~$0.05-$0.06
**Almacenamiento:** Se actualiza el evento en `solarcycles.events[]`

---

### Capa 3: Completar al Abrir Libro 📚

**Cuándo:** Usuario hace click en "Ver Agenda Libro"

**Proceso:**

1. **Verificar qué falta:**
```typescript
async function checkMissingInterpretations(userId: string, yearLabel: string) {
  const cycle = await SolarCycle.findByYear(userId, yearLabel);

  const eventsNeedingInterpretation = cycle.events.filter(event =>
    shouldGenerateInterpretation(event) && !event.interpretation
  );

  return {
    total: cycle.events.length,
    interpreted: cycle.events.filter(e => e.interpretation).length,
    missing: eventsNeedingInterpretation.length,
    missingEvents: eventsNeedingInterpretation
  };
}
```

2. **Decisión de generación:**

```typescript
if (missingCount === 0) {
  // ✅ Todo listo - Abrir libro inmediatamente
  return openBook();
}

if (missingCount <= 10) {
  // ⏱️ Pocos eventos - Generar sin mostrar loading
  await generateInterpretationsBatch(missingEvents);
  return openBook();
}

if (missingCount > 10) {
  // 📊 Muchos eventos - Mostrar loading con progreso
  showLoadingModal("Preparando tu agenda personalizada...");
  await generateInterpretationsWithProgress(missingEvents);
  return openBook();
}
```

3. **Generación con progreso:**

```typescript
async function generateInterpretationsWithProgress(events: AstrologicalEvent[]) {
  let completed = 0;
  const total = events.length;

  for (const event of events) {
    await generateEventInterpretation(userId, event);
    completed++;

    // Actualizar UI
    updateProgress(completed, total);
    // "Generando interpretaciones... 23/45"
  }
}
```

**Tiempo primera vez:** 1-2 minutos (45-50 eventos)
**Tiempo siguientes veces:** Instantáneo (todo en BD)
**Coste primera vez:** ~$0.35-$0.40
**Coste siguientes veces:** $0

---

## 💰 ANÁLISIS DE COSTES Y PERFORMANCE

### Coste por Usuario - Comparativa

| Estrategia | Tiempo Generación | Coste OpenAI | UX |
|------------|------------------|--------------|-----|
| **Todo al crear ciclo** | 3 min espera | $1.00 | ❌ Mala |
| **Todo al abrir libro** | 3 min cada vez | $1.00 × N veces | ❌ Muy mala |
| **Sistema 3 Capas** ✅ | Distribuido | $0.40-$0.60 | ✅ Excelente |

### Desglose Sistema 3 Capas

```
Capa 1 - Crear ciclo:           $0.00  (0 seg)
Capa 2 - Mes 1:                 $0.05  (30 seg background)
Capa 2 - Mes 2:                 $0.05  (30 seg background)
Capa 2 - Mes 3:                 $0.05  (30 seg background)
...
Capa 3 - Completar libro:       $0.25  (1 min primera vez)
────────────────────────────────────────────────────────
Total primer año:               ~$0.55
Libro veces 2-N:                $0.00  (instantáneo)
```

### Performance Esperado

**Usuario nuevo (primer ciclo):**
- Generar ciclo: 1 min
- Ver agenda mes 1: Instantáneo (se genera en background)
- Ver libro primera vez: 1-2 min con loading
- Ver libro siguientes veces: Instantáneo

**Usuario recurrente (segundo año):**
- Generar nuevo ciclo: 1 min
- Todo lo demás: Igual que año 1

---

## 🔄 FLUJO DE DATOS COMPLETO

### 1. Crear Ciclo Solar

```
POST /api/astrology/solar-cycles/generate
{
  userId: "user123"
}

↓

1. Calcular eventos del año (solar-year-events API)
2. Transformar a formato AstrologicalEvent
3. Guardar en MongoDB SolarCycle
4. Retornar ciclo creado

↓

Response:
{
  success: true,
  data: {
    cycle: { yearLabel: "2025-2026", eventCount: 84 }
  }
}
```

### 2. Generar Interpretaciones del Mes (Background)

```
// Automático después de crear ciclo
POST /api/astrology/interpretations/generate-month
{
  userId: "user123",
  yearLabel: "2025-2026",
  month: 2, // Febrero (mes de cumpleaños)
  year: 2025
}

↓

1. Obtener eventos del mes desde SolarCycle
2. Filtrar eventos que necesitan interpretación
3. Para cada evento:
   - Obtener carta natal del usuario
   - Obtener solar return actual
   - Obtener interpretación natal (fortalezas/bloqueos)
   - Generar prompt personalizado
   - Llamar a OpenAI
   - Parsear respuesta JSON
   - Actualizar evento en BD con interpretation
4. Retornar eventos interpretados

↓

MongoDB Update:
SolarCycle.events[index].interpretation = { ... }
```

### 3. Ver Agenda Online

```
GET /api/astrology/solar-cycles?userId=user123&yearLabel=2025-2026

↓

Retorna ciclo con eventos (algunos con interpretation, otros no)

↓

Frontend renderiza:
- Calendario con iconos de eventos
- Click en evento → Modal con interpretación (si existe)
- Si no existe → Botón "Generar Interpretación"
```

### 4. Ver Agenda Libro

```
Usuario click "Ver Agenda Libro"

↓

Frontend:
1. Obtener ciclo actual
2. Llamar a checkMissingInterpretations()
3. Si hay interpretaciones faltantes:
   - Mostrar loading modal
   - Generar en batch con progreso
4. Cuando todo listo:
   - Renderizar AgendaLibro component
   - Pasar eventos con interpretaciones
   - Mapear a formato de libro

↓

AgendaLibro recibe:
{
  eventos: [
    {
      dia: 28,
      tipo: 'lunaNueva',
      titulo: 'Luna Nueva en Piscis',
      signo: 'Piscis',
      interpretacion: "Para TI, María..." // ✅ Texto completo
    }
  ]
}

↓

Renderiza:
- Página 1: Calendario del mes
- Página 2: Interpretaciones detalladas (si hay)
```

---

## 🛠️ IMPLEMENTACIÓN TÉCNICA

### Nuevos Endpoints API

#### 1. `/api/astrology/interpretations/generate-month`

```typescript
// src/app/api/astrology/interpretations/generate-month/route.ts

export async function POST(request: NextRequest) {
  const { userId, yearLabel, month, year } = await request.json();

  // 1. Obtener ciclo
  const cycle = await SolarCycle.findByYear(userId, yearLabel);

  // 2. Filtrar eventos del mes
  const monthEvents = cycle.events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === month - 1 &&
           eventDate.getFullYear() === year;
  });

  // 3. Filtrar eventos que necesitan interpretación
  const eventsToInterpret = monthEvents.filter(event =>
    shouldGenerateInterpretation(event) && !event.interpretation
  );

  // 4. Generar interpretaciones
  const results = [];
  for (const event of eventsToInterpret) {
    const interpretation = await generateEventInterpretation(userId, event);

    // Actualizar evento en BD
    await SolarCycle.updateOne(
      {
        _id: cycle._id,
        'events.id': event.id
      },
      {
        $set: { 'events.$.interpretation': interpretation }
      }
    );

    results.push({ eventId: event.id, success: true });
  }

  return NextResponse.json({
    success: true,
    generated: results.length,
    events: eventsToInterpret.map(e => e.id)
  });
}
```

#### 2. `/api/astrology/interpretations/check-missing`

```typescript
// src/app/api/astrology/interpretations/check-missing/route.ts

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const yearLabel = searchParams.get('yearLabel');

  const cycle = await SolarCycle.findByYear(userId, yearLabel);

  const importantEvents = cycle.events.filter(shouldGenerateInterpretation);
  const interpreted = importantEvents.filter(e => e.interpretation);
  const missing = importantEvents.filter(e => !e.interpretation);

  return NextResponse.json({
    success: true,
    stats: {
      total: importantEvents.length,
      interpreted: interpreted.length,
      missing: missing.length,
      percentage: (interpreted.length / importantEvents.length) * 100
    },
    missingEvents: missing.map(e => ({
      id: e.id,
      type: e.type,
      date: e.date,
      title: e.title
    }))
  });
}
```

#### 3. `/api/astrology/interpretations/generate-batch`

```typescript
// src/app/api/astrology/interpretations/generate-batch/route.ts

export async function POST(request: NextRequest) {
  const { userId, yearLabel, eventIds } = await request.json();

  const cycle = await SolarCycle.findByYear(userId, yearLabel);
  const eventsToInterpret = cycle.events.filter(e =>
    eventIds.includes(e.id)
  );

  const results = [];

  for (const event of eventsToInterpret) {
    try {
      const interpretation = await generateEventInterpretation(userId, event);

      await SolarCycle.updateOne(
        { _id: cycle._id, 'events.id': event.id },
        { $set: { 'events.$.interpretation': interpretation } }
      );

      results.push({
        eventId: event.id,
        success: true
      });

    } catch (error) {
      results.push({
        eventId: event.id,
        success: false,
        error: error.message
      });
    }
  }

  return NextResponse.json({
    success: true,
    results,
    generated: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  });
}
```

### Función Helper: `generateEventInterpretation`

```typescript
// src/utils/astrology/generateEventInterpretation.ts

import OpenAI from 'openai';
import { getUserProfile } from '@/services/userDataService';
import NatalChart from '@/models/NatalChart';
import Interpretation from '@/models/Interpretation';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEventInterpretation(
  userId: string,
  event: AstrologicalEvent
) {
  // 1. Obtener contexto del usuario
  const userProfile = await getUserProfile(userId);
  const natalChart = await NatalChart.findOne({ userId });
  const natalInterpretation = await Interpretation.findOne({
    userId,
    chartType: 'natal'
  });
  const solarReturn = await Interpretation.findOne({
    userId,
    chartType: 'solar-return',
    expiresAt: { $gt: new Date() }
  });

  // 2. Construir prompt personalizado
  const prompt = buildEventInterpretationPrompt({
    userName: userProfile.name,
    userAge: userProfile.currentAge,
    event,
    natalChart: natalChart.natalChart,
    natalInterpretation: natalInterpretation?.interpretation,
    solarReturn: solarReturn?.interpretation
  });

  // 3. Llamar a OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Eres un astrólogo evolutivo experto. Respondes ÚNICAMENTE con JSON válido en español.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 3000,
    response_format: { type: 'json_object' }
  });

  // 4. Parsear y retornar
  const interpretation = JSON.parse(response.choices[0].message.content);

  return interpretation;
}

function buildEventInterpretationPrompt(data: {
  userName: string;
  userAge: number;
  event: AstrologicalEvent;
  natalChart: any;
  natalInterpretation: any;
  solarReturn: any;
}): string {
  // Ver documentación INTERPRETACIONES_EVENTOS_AGENDA.md
  // para estructura completa del prompt

  return `
# 🌙 ERES UN ASTRÓLOGO EVOLUTIVO

## DATOS DEL USUARIO
Nombre: ${data.userName}
Edad: ${data.userAge} años

## EVENTO A INTERPRETAR
Tipo: ${data.event.type}
Fecha: ${data.event.date}
Título: ${data.event.title}
Casa Natal: ${data.event.house}

## CARTA NATAL
[... posiciones planetarias ...]

## FORTALEZAS Y BLOQUEOS
[... extraídos de natalInterpretation ...]

## ESTRUCTURA JSON REQUERIDA
{
  "titulo_evento": "...",
  "clima_del_dia": [...],
  "energias_activas": [...],
  "mensaje_sintesis": "...",
  "como_te_afecta": "...",
  "interpretacion_practica": [...],
  "acciones_concretas": [...],
  "preguntas_reflexion": [...],
  "perspectiva_evolutiva": "..."
}
`;
}
```

### Frontend: Preparar Agenda Libro

```typescript
// src/app/(dashboard)/agenda/page.tsx

async function prepareAgendaLibro() {
  if (!user?.uid || !selectedCycleLabel) return;

  // 1. Verificar interpretaciones faltantes
  const checkResponse = await fetch(
    `/api/astrology/interpretations/check-missing?userId=${user.uid}&yearLabel=${selectedCycleLabel}`
  );
  const { stats, missingEvents } = await checkResponse.json();

  // 2. Si no falta nada, abrir libro directamente
  if (stats.missing === 0) {
    setShowAgendaLibro(true);
    return;
  }

  // 3. Si faltan pocas (≤10), generar sin mostrar loading
  if (stats.missing <= 10) {
    await fetch('/api/astrology/interpretations/generate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        yearLabel: selectedCycleLabel,
        eventIds: missingEvents.map(e => e.id)
      })
    });

    setShowAgendaLibro(true);
    return;
  }

  // 4. Si faltan muchas, mostrar loading con progreso
  setShowLoadingModal(true);
  setLoadingMessage(`Preparando tu agenda personalizada... 0/${stats.missing}`);

  let completed = 0;
  for (const eventId of missingEvents.map(e => e.id)) {
    await fetch('/api/astrology/interpretations/generate-batch', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.uid,
        yearLabel: selectedCycleLabel,
        eventIds: [eventId]
      })
    });

    completed++;
    setLoadingMessage(`Preparando tu agenda... ${completed}/${stats.missing}`);
  }

  setShowLoadingModal(false);
  setShowAgendaLibro(true);
}
```

### AgendaLibro: Mapear Interpretaciones

```typescript
// src/components/agenda/AgendaLibro/index.tsx

// Al recibir eventos del ciclo
const formatEventsForBook = (cycleEvents: AstrologicalEvent[], month: number) => {
  return cycleEvents
    .filter(e => new Date(e.date).getMonth() === month)
    .filter(e => shouldGenerateInterpretation(e))
    .map(e => ({
      dia: new Date(e.date).getDate(),
      tipo: mapEventTypeToBookFormat(e.type),
      titulo: e.title,
      signo: e.sign,
      // ✅ Formatear interpretación para el libro
      interpretacion: e.interpretation
        ? formatInterpretationForBook(e.interpretation)
        : undefined
    }));
};

function formatInterpretationForBook(interp: any): string {
  // Combinar campos para crear texto legible en libro
  let text = '';

  if (interp.mensaje_sintesis) {
    text += `🔥 ${interp.mensaje_sintesis}\n\n`;
  }

  if (interp.como_te_afecta) {
    text += `${interp.como_te_afecta}\n\n`;
  }

  if (interp.acciones_concretas && interp.acciones_concretas.length > 0) {
    text += `✅ Acciones para hoy:\n`;
    interp.acciones_concretas.forEach((accion, i) => {
      text += `${i + 1}. ${accion}\n`;
    });
  }

  return text;
}

function mapEventTypeToBookFormat(type: string): EventoTipo {
  const map = {
    'new_moon': 'lunaNueva',
    'full_moon': 'lunaLlena',
    'eclipse': 'eclipse',
    'retrograde': 'retrogrado',
    'planetary_transit': 'ingreso'
  };
  return map[type] || 'especial';
}
```

---

## 💵 SISTEMA DE MONETIZACIÓN

### Modelos de Negocio Propuestos

#### Opción 1: Suscripción Freemium

```
GRATIS (Free Tier):
├── ✅ Carta Natal básica
├── ✅ Solar Return del año actual
├── ✅ Agenda online (solo eventos, sin interpretaciones)
└── ❌ Sin agenda libro

PREMIUM ($9.99/mes o $89/año):
├── ✅ Todo lo de Free
├── ✅ Agenda online con interpretaciones ilimitadas
├── ✅ Agenda libro completa con todas las interpretaciones
├── ✅ Descargar libro como PDF
└── ✅ Sincronización con Google Calendar / Apple Calendar

PRO ($19.99/mes o $179/año):
├── ✅ Todo lo de Premium
├── ✅ Libro físico enviado a domicilio (1 vez al año)
├── ✅ Actualizaciones mensuales impresas
├── ✅ Consultas astrológicas en vivo (2 al año)
└── ✅ Acceso anticipado a nuevas features
```

#### Opción 2: Pago Por Producto

```
CARTA NATAL: $29 (una vez)
├── Interpretación completa personalizada
├── PDF descargable
└── Acceso permanente

SOLAR RETURN: $39/año
├── Retorno solar del año
├── Interpretación completa
└── PDF descargable

AGENDA ONLINE: $49/año
├── Calendario interactivo 365 días
├── Interpretaciones de eventos ilimitadas
└── Notificaciones de eventos importantes

AGENDA LIBRO PDF: $79 (una vez al año)
├── Libro completo en PDF (200+ páginas)
├── Todas las interpretaciones incluidas
├── Listo para imprimir o leer en tablet

AGENDA LIBRO FÍSICO: $149 (una vez al año)
├── Libro impreso profesional (tapa dura)
├── Papel premium
├── Envío incluido
└── Incluye versión PDF
```

#### Opción 3: Marketplace Mixto ⭐ RECOMENDADA

```
BASE (Gratis):
├── ✅ Carta Natal básica (sin interpretación profunda)
├── ✅ 3 interpretaciones de eventos gratis al mes
└── ✅ Vista previa agenda libro (10 primeras páginas)

SUSCRIPCIÓN MENSUAL ($12.99/mes):
├── ✅ Interpretaciones ilimitadas
├── ✅ Agenda online completa
├── ✅ Agenda libro PDF completa
└── ✅ Sync calendarios

COMPRAS ÚNICAS:
├── Libro Físico: $119 (incluye envío)
├── Solo Interpretaciones 1 Mes: $9.99
├── Solo Interpretaciones 1 Año: $89
└── Consulta Astrológica 1:1: $149
```

### Análisis de Margen

**Coste por usuario/año:**
- Generación interpretaciones: $0.55
- Hosting/BD/Firebase: $0.20
- Total técnico: **$0.75/usuario/año**

**Precio venta:**
- Plan Premium: $89/año
- **Margen bruto: 99.2%** ($88.25 por usuario)

**Con libro físico (Plan Pro):**
- Coste interpretaciones: $0.55
- Coste impresión libro A5 200 págs: ~$15
- Coste envío: ~$8
- Total técnico: **$23.55**
- Precio venta: $179/año
- **Margen bruto: 86.8%** ($155.45 por usuario)

---

## 📅 INTEGRACIÓN CON CALENDARIOS EXTERNOS

### Objetivo

Permitir que eventos astrológicos aparezcan en el calendario personal del usuario (Google Calendar, Apple Calendar, Outlook).

### Casos de Uso

1. **Sincronización Automática**: Eventos astrológicos se añaden automáticamente
2. **Recordatorios**: Notificaciones antes de lunas nuevas/llenas
3. **Descripción Rica**: Interpretación personalizada en la descripción del evento
4. **Actualización Dinámica**: Si se regenera interpretación, se actualiza en el calendario

### Opciones de Implementación

#### Opción A: Calendario iCal (.ics) ⭐ MÁS SIMPLE

**Cómo funciona:**
1. Usuario exporta agenda como archivo `.ics`
2. Importa en Google Calendar / Apple Calendar
3. Se suscribe a la URL (se actualiza automáticamente)

**Ventajas:**
- ✅ Compatible con TODOS los calendarios
- ✅ No requiere OAuth ni permisos
- ✅ Fácil de implementar

**Desventajas:**
- ❌ No se actualiza en tiempo real (cada 24h)
- ❌ Usuario debe hacer paso manual de importar

**Implementación:**

```typescript
// src/app/api/calendar/export/route.ts

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const yearLabel = searchParams.get('yearLabel');

  const cycle = await SolarCycle.findByYear(userId, yearLabel);
  const user = await getUserProfile(userId);

  // Generar archivo iCal
  const ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tu Vuelta al Sol//Agenda Astrológica//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${user.name} - Agenda Astrológica ${yearLabel}
X-WR-TIMEZONE:Europe/Madrid
X-WR-CALDESC:Tu agenda astrológica personalizada

${cycle.events
  .filter(shouldGenerateInterpretation)
  .map(event => `
BEGIN:VEVENT
UID:${event.id}@tuvueltaalsol.es
DTSTAMP:${formatICalDate(new Date())}
DTSTART:${formatICalDate(event.date)}
SUMMARY:${event.title}
DESCRIPTION:${event.interpretation?.mensaje_sintesis || event.description}
LOCATION:Casa ${event.house}
CATEGORIES:ASTROLOGIA,${event.type.toUpperCase()}
STATUS:CONFIRMED
TRANSP:TRANSPARENT
END:VEVENT
`).join('\n')}

END:VCALENDAR`;

  return new Response(ical, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="agenda-${yearLabel}.ics"`
    }
  });
}

function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
```

**URL de suscripción:**
```
https://tuvueltaalsol.es/api/calendar/export?userId=USER_ID&yearLabel=2025-2026&token=SECURE_TOKEN
```

#### Opción B: Google Calendar API ⭐ MÁS POTENTE

**Cómo funciona:**
1. Usuario autoriza acceso a Google Calendar (OAuth)
2. App crea eventos directamente en su calendario
3. Se actualizan en tiempo real

**Ventajas:**
- ✅ Actualización en tiempo real
- ✅ Control total de eventos
- ✅ Puede editar/eliminar eventos

**Desventajas:**
- ❌ Requiere OAuth (proceso más complejo)
- ❌ Solo Google Calendar (no Apple/Outlook)

**Implementación:**

```typescript
// src/app/api/calendar/google/sync/route.ts

import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  const { userId, yearLabel, accessToken } = await request.json();

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const cycle = await SolarCycle.findByYear(userId, yearLabel);
  const eventsToSync = cycle.events.filter(shouldGenerateInterpretation);

  for (const event of eventsToSync) {
    // Verificar si evento ya existe
    const existingEvent = await calendar.events.list({
      calendarId: 'primary',
      q: event.id,
      singleEvents: true
    });

    const gcalEvent = {
      summary: event.title,
      description: formatDescriptionForGCal(event.interpretation),
      start: {
        dateTime: new Date(event.date).toISOString(),
        timeZone: 'Europe/Madrid'
      },
      end: {
        dateTime: new Date(new Date(event.date).getTime() + 3600000).toISOString(),
        timeZone: 'Europe/Madrid'
      },
      colorId: getColorForEventType(event.type),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 1440 }, // 1 día antes
          { method: 'email', minutes: 180 }   // 3 horas antes
        ]
      },
      extendedProperties: {
        private: {
          tuvueltaalsolId: event.id,
          eventType: event.type
        }
      }
    };

    if (existingEvent.data.items.length > 0) {
      // Actualizar evento existente
      await calendar.events.update({
        calendarId: 'primary',
        eventId: existingEvent.data.items[0].id,
        requestBody: gcalEvent
      });
    } else {
      // Crear nuevo evento
      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: gcalEvent
      });
    }
  }

  return NextResponse.json({
    success: true,
    synced: eventsToSync.length
  });
}

function formatDescriptionForGCal(interpretation: any): string {
  if (!interpretation) return '';

  let desc = '';

  if (interpretation.mensaje_sintesis) {
    desc += `🔥 ${interpretation.mensaje_sintesis}\n\n`;
  }

  if (interpretation.acciones_concretas) {
    desc += `✅ ACCIONES PARA HOY:\n`;
    interpretation.acciones_concretas.forEach((accion, i) => {
      desc += `${i + 1}. ${accion}\n`;
    });
    desc += '\n';
  }

  desc += `\n\n📖 Ver interpretación completa: https://tuvueltaalsol.es/agenda`;

  return desc;
}

function getColorForEventType(type: string): string {
  const colorMap = {
    'new_moon': '1',      // Lavanda
    'full_moon': '9',     // Azul
    'eclipse': '11',      // Rojo
    'retrograde': '8',    // Gris
    'planetary_transit': '5' // Amarillo
  };
  return colorMap[type] || '7'; // Default: cian
}
```

#### Opción C: Webhook / Zapier Integration

**Para usuarios avanzados que usan Notion, Todoist, etc.**

```typescript
// src/app/api/webhooks/calendar/route.ts

export async function POST(request: NextRequest) {
  const { userId, webhookUrl, events } = await request.json();

  for (const event of events) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: event.title,
        date: event.date,
        description: event.interpretation?.mensaje_sintesis,
        tags: ['astrologia', event.type],
        priority: event.importance
      })
    });
  }

  return NextResponse.json({ success: true });
}
```

### Recomendación de Implementación

**Fase 1 (MVP):**
- ✅ iCal export (.ics) - Más fácil, funciona con todos

**Fase 2 (Growth):**
- ✅ Google Calendar API - Usuarios más comprometidos
- ✅ Apple Calendar webhook - Si hay demanda

**Fase 3 (Scale):**
- ✅ Zapier/Make integration - Power users
- ✅ Outlook/Microsoft Graph API

---

## 🗓️ ROADMAP DE DESARROLLO

### Sprint 1: Backend Core (1 semana)

**Tareas:**
- [ ] Crear endpoint `/api/astrology/interpretations/generate-month`
- [ ] Crear endpoint `/api/astrology/interpretations/check-missing`
- [ ] Crear endpoint `/api/astrology/interpretations/generate-batch`
- [ ] Implementar función `generateEventInterpretation()`
- [ ] Implementar función `shouldGenerateInterpretation()`
- [ ] Tests unitarios de endpoints

**Entregables:**
- APIs funcionando
- Documentación de APIs
- Tests pasando

---

### Sprint 2: Generación Automática (1 semana)

**Tareas:**
- [ ] Modificar `/api/astrology/solar-cycles/generate` para trigger Capa 2
- [ ] Implementar generación background del mes actual
- [ ] Sistema de jobs para generación asíncrona
- [ ] Logging y monitoreo de generaciones

**Entregables:**
- Al crear ciclo, mes actual se genera en background
- Dashboard de monitoreo de interpretaciones

---

### Sprint 3: Frontend Agenda Online (1 semana)

**Tareas:**
- [ ] Actualizar `EventInterpretationButton` para usar interpretaciones guardadas
- [ ] Añadir indicador de "interpretación disponible" en calendario
- [ ] Mejorar modal de interpretación con nuevo formato
- [ ] Implementar botón "Regenerar interpretación"

**Entregables:**
- Agenda online muestra interpretaciones automáticamente
- UX mejorada

---

### Sprint 4: Integración Agenda Libro (1 semana)

**Tareas:**
- [ ] Implementar `prepareAgendaLibro()` con verificación de faltantes
- [ ] Crear loading modal con progreso
- [ ] Mapear interpretaciones a formato de libro
- [ ] Actualizar `CalendarioMensualTabla` para renderizar interpretaciones reales

**Entregables:**
- Agenda libro funciona con interpretaciones reales
- Primera generación con loading
- Siguientes veces instantáneo

---

### Sprint 5: Optimizaciones (1 semana)

**Tareas:**
- [ ] Cache de prompts (evitar regenerar iguales)
- [ ] Batch processing optimizado
- [ ] Retry logic para fallos de OpenAI
- [ ] Métricas de uso y coste

**Entregables:**
- Sistema robusto con manejo de errores
- Dashboard de métricas
- Optimización de costes

---

### Sprint 6: Calendario Export (1 semana)

**Tareas:**
- [ ] Implementar export iCal (.ics)
- [ ] Página de "Suscribirse a Calendario"
- [ ] Documentación para usuarios
- [ ] Tests de compatibilidad (Google, Apple, Outlook)

**Entregables:**
- Feature de export funcionando
- Docs de usuario

---

### Sprint 7: Monetización (1 semana)

**Tareas:**
- [ ] Diseñar planes de precios
- [ ] Implementar paywall (free vs premium)
- [ ] Integrar Stripe para suscripciones
- [ ] Página de pricing

**Entregables:**
- Sistema de pagos funcionando
- Landing page de pricing

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs Técnicos

```
✅ Performance:
- Tiempo de creación de ciclo: < 1 min
- Tiempo de generación mes: < 40 seg
- Tiempo primera apertura libro: < 2 min
- Tiempo siguientes aperturas libro: < 3 seg

✅ Coste:
- Coste por usuario/año: < $0.60
- Tasa de éxito generación: > 99%
- Errores de OpenAI: < 1%

✅ UX:
- Usuarios que abren libro: > 60%
- Usuarios que vuelven a abrir libro: > 80%
- Usuarios que exportan calendario: > 30%
```

### KPIs de Negocio

```
✅ Conversión:
- Free → Premium: > 15%
- Premium → Pro (libro físico): > 10%
- Churn mensual: < 5%

✅ Revenue:
- ARPU (Average Revenue Per User): > $50/año
- LTV (Lifetime Value): > $200
- CAC (Customer Acquisition Cost): < $30
```

---

## 🔐 SEGURIDAD Y PRIVACIDAD

### Datos Sensibles

**Información personal guardada:**
- Fecha/hora/lugar de nacimiento
- Nombre
- Email (Firebase Auth)
- Interpretaciones astrológicas personalizadas

**Protección:**
- ✅ Autenticación Firebase (tokens JWT)
- ✅ Encriptación en tránsito (HTTPS)
- ✅ Encriptación en reposo (MongoDB Atlas)
- ✅ Rate limiting en APIs (10 req/min por usuario)
- ✅ Validación de userId en TODOS los endpoints

### GDPR Compliance

**Derechos del usuario:**
- ✅ Ver todos sus datos (export JSON)
- ✅ Eliminar cuenta y todos los datos
- ✅ Modificar datos personales
- ✅ Opt-out de emails

**Implementación:**

```typescript
// src/app/api/user/export/route.ts
export async function GET(request: NextRequest) {
  const userId = await authenticateUser(request);

  const userData = {
    profile: await getUserProfile(userId),
    natalChart: await NatalChart.findOne({ userId }),
    cycles: await SolarCycle.find({ userId }),
    interpretations: await Interpretation.find({ userId })
  };

  return NextResponse.json(userData);
}

// src/app/api/user/delete/route.ts
export async function DELETE(request: NextRequest) {
  const userId = await authenticateUser(request);

  // Eliminar TODOS los datos del usuario
  await Promise.all([
    BirthData.deleteMany({ userId }),
    NatalChart.deleteMany({ userId }),
    SolarCycle.deleteMany({ userId }),
    Interpretation.deleteMany({ userId }),
    EventInterpretation.deleteMany({ userId }),
    User.deleteOne({ userId })
  ]);

  // Eliminar de Firebase Auth
  await admin.auth().deleteUser(userId);

  return NextResponse.json({ success: true });
}
```

---

## 🚀 PRÓXIMOS PASOS

### Esta Semana
1. ✅ Documentación completa (este archivo)
2. [ ] Revisión con equipo técnico
3. [ ] Estimación de tiempo de desarrollo
4. [ ] Asignación de tareas Sprint 1

### Próximas 2 Semanas
- Sprint 1: Backend Core
- Sprint 2: Generación Automática

### Próximo Mes
- Sprint 3-4: Frontend completo
- Primera versión funcional end-to-end

### Próximos 3 Meses
- Sprint 5-7: Optimizaciones + Calendar + Monetización
- Lanzamiento Beta cerrado
- Primeros usuarios pagando

---

## 📞 CONTACTO Y SOPORTE

**Equipo Técnico:**
- Backend: [Nombre desarrollador]
- Frontend: [Nombre desarrollador]
- DevOps: [Nombre desarrollador]

**Dudas Técnicas:**
- Revisar este documento primero
- Consultar documentación relacionada:
  - `INTERPRETACIONES_EVENTOS_AGENDA.md`
  - `MIGRACION_AGENDA_LIBRO.md`
  - `PLAN_INTEGRACION_INTERPRETACIONES_AGENDA.md`

**Feedback:**
- Issues en GitHub
- Slack channel: #agenda-desarrollo

---

**Última actualización:** 2026-01-17
**Versión:** 1.0.0
**Estado:** ✅ Listo para desarrollo
