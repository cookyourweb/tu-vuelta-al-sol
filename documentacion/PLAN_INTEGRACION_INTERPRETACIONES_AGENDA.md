# 🚀 PLAN DE INTEGRACIÓN: INTERPRETACIONES PERSONALIZADAS EN AGENDA

**Fecha:** 2026-01-01
**Branch:** `claude/update-event-interpretation-gr9VI`
**Objetivo:** Conectar el sistema avanzado de interpretaciones personalizadas con el calendario de la agenda
**Responsable:** Equipo de Desarrollo
**Estimación:** 4-6 horas de desarrollo + 2 horas de testing

---

## 📋 CONTEXTO Y PROBLEMA ACTUAL

### Estado Actual (ANTES)

La agenda tiene **dos sistemas desconectados**:

1. **Sistema de Calendario** (`src/app/(dashboard)/agenda/page.tsx`)
   - Muestra eventos astrológicos del año
   - Interpretaciones genéricas estáticas
   - Modal básico con información limitada

2. **Sistema de Interpretaciones Avanzadas** (NO conectado)
   - Prompts sofisticados (`src/utils/prompts/eventInterpretationPrompt.ts`)
   - API `/api/interpretations/event`
   - Cruza: Carta Natal + Solar Return + Evento
   - Extrae fortalezas/bloqueos de interpretaciones guardadas
   - Formato ultra detallado con ejercicios, mantras, timing evolutivo

**Problema:** Los usuarios ven eventos en el calendario pero NO obtienen interpretaciones personalizadas basadas en su carta natal única.

---

## 🎯 OBJETIVO FINAL

**Después de esta integración:**

```
Usuario hace click en evento del calendario
         ↓
Modal muestra interpretación básica (rápida)
         ↓
Botón "Ver Interpretación Personalizada"
         ↓
API genera interpretación cruzada (Natal + SR + Evento)
         ↓
Modal expandido muestra:
  ✓ Para ti específicamente
  ✓ Tu fortaleza a usar (de su carta natal)
  ✓ Tu bloqueo a transformar (reencuadre)
  ✓ Mantra personalizado (con posiciones planetarias)
  ✓ Ejercicio concreto para este evento
  ✓ Consejo específico (tránsitos SR actuales)
  ✓ Timing evolutivo (qué sembrar, cuándo actuar, resultado esperado)
```

---

## 📊 ARQUITECTURA ACTUAL

### Archivos Clave

```
src/
├── app/(dashboard)/agenda/
│   └── page.tsx                          # Calendario principal ⭐ MODIFICAR
│
├── components/agenda/
│   └── EventInterpretationButton.tsx     # Botón de interpretación ✅ YA EXISTE
│
├── utils/prompts/
│   └── eventInterpretationPrompt.ts      # Sistema de prompts ✅ YA EXISTE
│
├── app/api/
│   ├── astrology/solar-year-events/
│   │   └── route.ts                      # Genera eventos del año ⭐ MODIFICAR
│   └── interpretations/event/
│       └── route.ts                      # API interpretaciones ✅ YA EXISTE
│
└── services/
    ├── eventInterpretationService.ts     # Servicio básico (deprecated)
    └── astrologicalEventsService.ts      # Cálculo de eventos ⭐ MODIFICAR
```

### Flujo de Datos Actual

```mermaid
graph TD
    A[Usuario] -->|Navega a| B[Agenda Page]
    B -->|Fetch eventos| C[API /solar-year-events]
    C -->|Calcula eventos| D[astrologicalEventsService]
    D -->|Retorna eventos| C
    C -->|Retorna AstrologicalEvent[]| B
    B -->|Click en evento| E[Modal Básico]
    E -->|Muestra| F[Interpretación Genérica]
```

### Flujo de Datos OBJETIVO

```mermaid
graph TD
    A[Usuario] -->|Navega a| B[Agenda Page]
    B -->|Fetch eventos| C[API /solar-year-events]
    C -->|Calcula eventos CON casa natal| D[astrologicalEventsService]
    D -->|Retorna eventos + house| C
    C -->|Retorna AstrologicalEvent[]| B
    B -->|Click en evento| E[Modal Mejorado]
    E -->|Muestra| F[Interpretación Básica]
    E -->|Usuario click| G[EventInterpretationButton]
    G -->|POST con EventData| H[API /interpretations/event]
    H -->|Busca Natal + SR| I[MongoDB]
    I -->|Retorna cartas| H
    H -->|Genera prompt| J[eventInterpretationPrompt]
    J -->|Prompt completo| K[OpenAI GPT-4o]
    K -->|JSON personalizado| H
    H -->|Guarda caché| I
    H -->|Retorna interpretación| G
    G -->|Renderiza| L[Modal Expandido]
```

---

## 🔧 PLAN DE IMPLEMENTACIÓN (4 PASOS)

### ✅ **PASO 1: Integrar EventInterpretationButton en Modal de Eventos**

**Archivo:** `src/app/(dashboard)/agenda/page.tsx`

**Cambios:**

1. Importar componente:
```typescript
import EventInterpretationButton from '@/components/agenda/EventInterpretationButton';
```

2. Crear función de mapeo (temporal, luego mover a utils):
```typescript
const mapEventTypeToInterpretation = (event: AstrologicalEvent): {
  type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
  house: number;
} => {
  let type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
  let house = event.house || 1; // ⚠️ Temporal hasta implementar cálculo

  // Mapear tipo de evento
  if (event.type === 'lunar_phase') {
    type = event.title.toLowerCase().includes('nueva') ? 'luna_nueva' : 'luna_llena';
  } else if (event.type === 'retrograde' || event.type === 'planetary_transit') {
    type = 'transito';
  } else {
    type = 'aspecto';
  }

  return { type, house };
};
```

3. Agregar botón en el modal (dentro de `showEventModal`):
```tsx
{/* Interpretación personalizada */}
{user?.uid && modalEvent && (
  <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-400/30 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-purple-300 mb-2">
      ✨ ¿Quieres una interpretación ULTRA PERSONALIZADA?
    </h3>
    <p className="text-purple-200 text-sm mb-4">
      Genera una interpretación única basada en TU carta natal + Solar Return.
    </p>

    <EventInterpretationButton
      userId={user.uid}
      event={{
        type: mapEventTypeToInterpretation(modalEvent).type,
        date: modalEvent.date,
        sign: modalEvent.sign || 'Desconocido',
        house: mapEventTypeToInterpretation(modalEvent).house,
        planetsInvolved: modalEvent.planet ? [modalEvent.planet] : []
      }}
      className="w-full"
    />
  </div>
)}
```

**Testing:**
- [ ] Abrir agenda
- [ ] Click en cualquier evento
- [ ] Verificar que aparece botón "Ver Interpretación Personalizada"
- [ ] Click en botón → debe llamar a API (verificar en Network tab)

---

### ✅ **PASO 2: Crear Función de Mapeo AstrologicalEvent → EventData**

**Archivo:** `src/utils/eventMapping.ts` (NUEVO)

**Objetivo:** Convertir eventos del calendario al formato que espera el sistema de interpretaciones.

```typescript
// src/utils/eventMapping.ts

import type { AstrologicalEvent } from '@/types/astrology/unified-types';
import type { EventData } from '@/utils/prompts/eventInterpretationPrompt';

/**
 * Mapea un evento del calendario (AstrologicalEvent) al formato
 * requerido por el sistema de interpretaciones personalizadas (EventData)
 */
export function mapAstrologicalEventToEventData(
  event: AstrologicalEvent,
  options?: {
    userNatalChart?: any; // Para cálculo preciso de casa
    defaultHouse?: number; // Fallback si no se puede calcular
  }
): EventData {

  // 1. Mapear tipo de evento
  let type: EventData['type'];

  if (event.type === 'lunar_phase') {
    // Detectar si es Luna Nueva o Luna Llena por el título
    const isNewMoon = event.title.toLowerCase().includes('nueva');
    type = isNewMoon ? 'luna_nueva' : 'luna_llena';
  }
  else if (event.type === 'retrograde' || event.type === 'planetary_transit') {
    type = 'transito';
  }
  else if (event.type === 'eclipse' || event.type === 'aspect') {
    type = 'aspecto';
  }
  else {
    type = 'aspecto'; // Default
  }

  // 2. Calcular casa natal donde cae el evento
  // TODO: Implementar cálculo real basado en coordenadas
  const house = event.house || options?.defaultHouse || 1;

  // 3. Extraer planetas involucrados
  const planetsInvolved: string[] = [];
  if (event.planet) planetsInvolved.push(event.planet);

  // 4. Construir EventData
  const eventData: EventData = {
    type,
    date: event.date,
    sign: event.sign,
    house,
    planetsInvolved: planetsInvolved.length > 0 ? planetsInvolved : undefined
  };

  // 5. Si es tránsito, agregar planetas específicos
  if (type === 'transito' && event.planet) {
    eventData.transitingPlanet = event.planet;
    // TODO: Detectar planeta natal activado
  }

  // 6. Si es aspecto, agregar tipo de aspecto
  if (type === 'aspecto') {
    // TODO: Extraer tipo de aspecto del título o metadata
    eventData.aspectType = 'conjunción'; // Placeholder
  }

  return eventData;
}

/**
 * Calcula en qué casa natal cae un evento astrológico
 * basado en el signo del evento y la carta natal del usuario
 *
 * @param eventSign - Signo zodiacal del evento (ej: "Aries")
 * @param eventDegree - Grado del evento en el signo (0-30)
 * @param natalChart - Carta natal del usuario
 * @returns Número de casa (1-12)
 */
export function calculateHouseForEvent(
  eventSign: string,
  eventDegree: number,
  natalChart: any
): number {

  // TODO: Implementar cálculo real
  // Por ahora, retornar casa 1 como placeholder

  // Algoritmo simplificado:
  // 1. Convertir signo + grado a longitud eclíptica absoluta (0-360°)
  // 2. Buscar entre qué cúspides de casas cae esa longitud
  // 3. Retornar número de casa

  return 1; // Placeholder
}
```

**Testing:**
- [ ] Crear tests unitarios para `mapAstrologicalEventToEventData()`
- [ ] Verificar que Luna Nueva → `luna_nueva`
- [ ] Verificar que Luna Llena → `luna_llena`
- [ ] Verificar que Retrogradación → `transito`

---

### ✅ **PASO 3: Agregar Cálculo de Casas al Backend**

**Archivo:** `src/app/api/astrology/solar-year-events/route.ts`

**Objetivo:** Incluir el número de casa natal en cada evento generado.

**Cambios:**

1. En la función que transforma eventos, agregar cálculo de casa:

```typescript
// ANTES:
transformedEvents.push({
  id: `lunar-${phase.date}`,
  date: phase.date,
  title: `🌙 ${phase.phase}...`,
  type: 'lunar_phase',
  planet: 'Luna',
  sign: phase.zodiacSign || 'N/A',
  // ... otros campos
});

// DESPUÉS:
const eventHouse = await calculateEventHouse({
  sign: phase.zodiacSign,
  degree: phase.degree || 0,
  userId: birthData.userId,
  natalChart: userNatalChart
});

transformedEvents.push({
  id: `lunar-${phase.date}`,
  date: phase.date,
  title: `🌙 ${phase.phase}...`,
  type: 'lunar_phase',
  planet: 'Luna',
  sign: phase.zodiacSign || 'N/A',
  house: eventHouse, // ✅ NUEVO
  // ... otros campos
});
```

2. Crear función auxiliar:

```typescript
/**
 * Calcula en qué casa natal cae un evento astrológico
 */
async function calculateEventHouse(options: {
  sign: string;
  degree: number;
  userId: string;
  natalChart?: any;
}): Promise<number> {

  const { sign, degree, userId, natalChart } = options;

  // Si no tenemos carta natal, buscarla
  let chart = natalChart;
  if (!chart) {
    const NatalChart = (await import('@/models/NatalChart')).default;
    const natalDoc = await NatalChart.findOne({ userId }).lean();
    chart = natalDoc?.natalChart;
  }

  if (!chart || !chart.houses) {
    console.warn('No natal chart houses found, defaulting to house 1');
    return 1;
  }

  // Convertir signo + grado a longitud absoluta
  const longitude = signAndDegreeToLongitude(sign, degree);

  // Buscar en qué casa cae
  const houses = chart.houses;

  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % houses.length];

    const currentCusp = currentHouse.degree || 0;
    const nextCusp = nextHouse.degree || 0;

    // Manejar wrap-around en 360°
    if (nextCusp > currentCusp) {
      if (longitude >= currentCusp && longitude < nextCusp) {
        return i + 1;
      }
    } else {
      // Wrap around 0°
      if (longitude >= currentCusp || longitude < nextCusp) {
        return i + 1;
      }
    }
  }

  return 1; // Default fallback
}

/**
 * Convierte signo zodiacal + grado a longitud eclíptica absoluta (0-360°)
 */
function signAndDegreeToLongitude(sign: string, degree: number): number {
  const signs = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  const signIndex = signs.findIndex(s =>
    s.toLowerCase() === sign.toLowerCase()
  );

  if (signIndex === -1) return 0;

  return signIndex * 30 + degree;
}
```

**Testing:**
- [ ] Hacer request a `/api/astrology/solar-year-events`
- [ ] Verificar que cada evento tiene campo `house`
- [ ] Validar que `house` está entre 1-12
- [ ] Probar con diferentes cartas natales

---

### ✅ **PASO 4: Mejorar UX del Modal con Interpretaciones Progresivas**

**Archivo:** `src/app/(dashboard)/agenda/page.tsx`

**Objetivo:** Optimizar la experiencia para mostrar interpretación básica primero, luego avanzada bajo demanda.

**Cambios en el Modal:**

```tsx
{/* MODAL DE EVENTO MEJORADO */}
{showEventModal && modalEvent && (
  <>
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeEventModal} />

    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-sm border border-purple-400/40 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getEventIcon(modalEvent.type, modalEvent.priority)}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{modalEvent.title}</h2>
                <p className="text-purple-200 text-sm">
                  {new Date(modalEvent.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                {modalEvent.planet && modalEvent.sign && (
                  <p className="text-purple-300 text-xs mt-1">
                    {modalEvent.planet} en {modalEvent.sign}
                    {modalEvent.house && ` • Casa ${modalEvent.house}`}
                  </p>
                )}
              </div>
            </div>

            <button onClick={closeEventModal} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {modalEvent.priority === 'high' && (
            <div className="mt-4 inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2">
              <span className="text-red-300 text-sm font-medium">🔥 PRIORIDAD CRÍTICA</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">

          {/* Sección 1: Descripción Básica (Siempre visible) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="text-purple-300 mr-2">📝</span>
              Descripción del Evento
            </h3>
            <p className="text-gray-200 leading-relaxed">{modalEvent.description}</p>
          </div>

          {/* Sección 2: Interpretación AI Básica (Si existe) */}
          {modalEvent.aiInterpretation && (
            <div className="space-y-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-yellow-300 mb-3 flex items-center">
                  <span className="mr-2">🔥</span>SIGNIFICADO
                </h3>
                <p className="text-white leading-relaxed">{modalEvent.aiInterpretation.meaning}</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-2xl p-5">
                <h3 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center">
                  <span className="mr-2">⚡</span>CONSEJO
                </h3>
                <p className="text-white leading-relaxed">{modalEvent.aiInterpretation.advice}</p>
              </div>

              {modalEvent.aiInterpretation.mantra && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-2xl p-5 text-center">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center justify-center">
                    <span className="mr-2">✨</span>MANTRA
                  </h3>
                  <p className="text-white text-lg font-medium italic">"{modalEvent.aiInterpretation.mantra}"</p>
                </div>
              )}
            </div>
          )}

          {/* Sección 3: Upgrade a Interpretación Personalizada */}
          {user?.uid && (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-400/30 rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center">
                  <span className="mr-2">✨</span>
                  Interpretación ULTRA Personalizada
                </h3>
                <p className="text-purple-200 text-sm mb-4">
                  Genera una interpretación única basada en TU carta natal + Solar Return que analiza:
                </p>
                <ul className="text-purple-200 text-sm space-y-1 mb-4">
                  <li>✓ Cómo este evento te afecta específicamente</li>
                  <li>✓ Qué fortalezas de tu carta usar</li>
                  <li>✓ Qué bloqueos transformar</li>
                  <li>✓ Ejercicios concretos para este momento</li>
                  <li>✓ Mantra personalizado con tus posiciones planetarias</li>
                  <li>✓ Timing evolutivo preciso</li>
                </ul>
              </div>

              <EventInterpretationButton
                userId={user.uid}
                event={{
                  type: mapEventTypeToInterpretation(modalEvent).type,
                  date: modalEvent.date,
                  sign: modalEvent.sign || 'Desconocido',
                  house: modalEvent.house || mapEventTypeToInterpretation(modalEvent).house,
                  planetsInvolved: modalEvent.planet ? [modalEvent.planet] : []
                }}
                className="w-full"
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-6 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="text-purple-200 text-sm">
              <span className="font-medium">Tipo:</span> {modalEvent.type.replace('_', ' ').toUpperCase()}
            </div>
            <button
              onClick={closeEventModal}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
            >
              Cerrar ✨
            </button>
          </div>
        </div>

      </div>
    </div>
  </>
)}
```

**Testing:**
- [ ] Abrir evento sin interpretación personalizada
- [ ] Ver interpretación básica primero
- [ ] Click en "Ver Interpretación Personalizada"
- [ ] Verificar que modal se expande con contenido completo
- [ ] Verificar caché (segunda vez debe ser instantáneo)

---

## 🧪 PLAN DE TESTING COMPLETO

### Test 1: Integración Visual
- [ ] Abrir `/agenda`
- [ ] Verificar que eventos tienen campo `house`
- [ ] Click en evento → Modal aparece
- [ ] Botón "Ver Interpretación Personalizada" visible
- [ ] Estilo y diseño coherentes

### Test 2: API y Backend
- [ ] Network tab: Verificar request a `/api/interpretations/event`
- [ ] Verificar payload incluye `house` correcto
- [ ] Respuesta incluye interpretación completa
- [ ] Caché funciona (segunda llamada retorna `cached: true`)

### Test 3: Contenido de Interpretación
- [ ] Interpretación menciona nombre del usuario
- [ ] Menciona posiciones planetarias específicas (no genéricas)
- [ ] Incluye fortaleza de carta natal
- [ ] Incluye bloqueo con reencuadre
- [ ] Mantra incluye posiciones planetarias reales
- [ ] Ejercicio tiene pasos numerados y concretos
- [ ] Timing evolutivo tiene fechas/fases lunares

### Test 4: Edge Cases
- [ ] Usuario sin carta natal → mensaje de error claro
- [ ] Usuario sin Solar Return → funciona con solo natal
- [ ] Evento sin signo → usa placeholder
- [ ] API timeout → muestra mensaje amigable
- [ ] Regenerar interpretación → borra caché y genera nueva

### Test 5: Performance
- [ ] Primera carga de evento: < 5 segundos
- [ ] Eventos cacheados: < 500ms
- [ ] No bloquea UI durante carga
- [ ] Loading states visibles

---

## 📦 ENTREGABLES

Al final de esta implementación, tendremos:

1. **Código:**
   - [ ] `src/app/(dashboard)/agenda/page.tsx` actualizado
   - [ ] `src/utils/eventMapping.ts` creado
   - [ ] `src/app/api/astrology/solar-year-events/route.ts` actualizado
   - [ ] Tests unitarios para `eventMapping.ts`

2. **Documentación:**
   - [ ] Este archivo (PLAN_INTEGRACION_INTERPRETACIONES_AGENDA.md)
   - [ ] Comentarios inline en código
   - [ ] README actualizado con nueva feature

3. **Testing:**
   - [ ] Checklist de testing completado
   - [ ] Screenshots/videos de la feature funcionando
   - [ ] Reporte de bugs encontrados y solucionados

---

## 🚨 RIESGOS Y MITIGACIONES

### Riesgo 1: Costos de OpenAI
**Impacto:** Alto
**Probabilidad:** Alta
**Mitigación:**
- Cachear interpretaciones por 365 días
- Solo generar bajo demanda (no automático)
- Límite de 10 interpretaciones/mes en plan gratuito

### Riesgo 2: Cálculo de Casas Incorrecto
**Impacto:** Alto (interpretaciones incorrectas)
**Probabilidad:** Media
**Mitigación:**
- Usar biblioteca probada (astronomy-engine)
- Fallback a casa 1 si cálculo falla
- Validar manualmente con casos de prueba conocidos

### Riesgo 3: Performance en Móvil
**Impacto:** Medio
**Probabilidad:** Media
**Mitigación:**
- Loading states claros
- Optimizar tamaño de modal en móvil
- Lazy load del componente EventInterpretationButton

### Riesgo 4: Usuario Sin Carta Natal
**Impacto:** Alto
**Probabilidad:** Baja
**Mitigación:**
- Validar que usuario tenga natal antes de mostrar botón
- Mensaje claro: "Primero genera tu carta natal"
- Link directo a página de carta natal

---

## 📅 TIMELINE ESTIMADO

| Paso | Tarea | Tiempo Estimado | Dependencias |
|------|-------|-----------------|--------------|
| 1 | Integrar EventInterpretationButton | 1-2 horas | - |
| 2 | Crear función de mapeo | 1 hora | - |
| 3 | Agregar cálculo de casas | 2-3 horas | Paso 2 |
| 4 | Mejorar UX del modal | 1-2 horas | Paso 1 |
| 5 | Testing completo | 2 horas | Todos |
| 6 | Documentación final | 1 hora | Todos |
| **TOTAL** | | **8-11 horas** | |

---

## 🔄 PRÓXIMOS PASOS POST-IMPLEMENTACIÓN

Una vez completada esta integración, considerar:

1. **Optimizaciones:**
   - Pre-calcular interpretaciones de eventos de alta prioridad
   - Comprimir prompts para reducir costos de OpenAI
   - Implementar rate limiting por usuario

2. **Features Adicionales:**
   - Compartir interpretaciones en redes sociales
   - Descargar PDF de interpretación
   - Recordatorios push para eventos importantes
   - Vista de "Semana Astrológica" con eventos + interpretaciones

3. **Analytics:**
   - Tracking de eventos más consultados
   - Tasa de conversión de interpretaciones básicas → avanzadas
   - Feedback del usuario sobre calidad de interpretaciones

4. **Monetización:**
   - Plan premium con interpretaciones ilimitadas
   - Paquetes de consultoría 1:1 basados en interpretaciones
   - Cursos de astrología evolutiva

---

## 📞 CONTACTO Y SOPORTE

**Preguntas técnicas:** Crear issue en GitHub
**Bugs urgentes:** Slack #dev-team
**Revisión de código:** PR en branch `claude/update-event-interpretation-gr9VI`

---

**Última actualización:** 2026-01-01
**Versión del documento:** 1.0
**Autor:** Claude Code (AI Assistant)

