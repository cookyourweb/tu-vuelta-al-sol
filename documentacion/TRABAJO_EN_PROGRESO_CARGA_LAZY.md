# 🚧 TRABAJO EN PROGRESO: Carga Lazy de Eventos

**Fecha:** 2025-12-11
**Sesión:** claude/fix-charttooltips-conflicts-01D9YKGzw4x2TXkWyucstk5g

## 🎯 Objetivo Original

Implementar carga lazy de eventos mensuales en la agenda para evitar timeouts de 60 segundos en Vercel Hobby.

## ❌ Problema que Intentábamos Resolver

```
❌ 504 Gateway Timeout:
- POST /api/astrology/interpret-solar-return (>60s)
- POST /api/astrology/interpret-natal-complete (>60s)
- POST /api/astrology/solar-year-events (tarda mucho al cargar todo el año)

❌ 404 Not Found:
- GET /api/interpretations/save?userId=xxx&chartType=solar-return
```

## 🔧 Cambios Realizados (INCOMPLETOS - NO COMMITEAR)

### ✅ Archivos NUEVOS Creados

1. **`src/app/api/astrology/monthly-events/route.ts`**
   - API endpoint para cargar eventos de UN mes específico
   - Recibe: `{ birthDate, birthTime, birthPlace, month, year }`
   - Retorna eventos filtrados para ese mes
   - Evita calcular todo el año de golpe

2. **`src/components/astrology/EventsLoadingModal.tsx`**
   - Modal reutilizable con animación
   - Muestra progreso de cálculo de eventos
   - Similar a InterpretationProgressModal
   - Props: `isOpen`, `month`, `onClose`

### ⚠️ Archivos MODIFICADOS (PARCIALMENTE - REVERTIR)

3. **`src/app/(dashboard)/agenda/page.tsx`**
   - ✅ Agregado import de EventsLoadingModal
   - ✅ Agregados estados: `loadingMonthlyEvents`, `loadingMonthName`, `loadedMonths`
   - ✅ Creada función `fetchMonthlyEvents(month: Date)`
   - ❌ FALTA: Modificar useEffect inicial para cargar solo 2 meses
   - ❌ FALTA: Modificar goToNextMonth/goToPreviousMonth para carga lazy
   - ❌ FALTA: Agregar modal al render
   - ❌ FALTA: Conectar todo el flujo

## 📋 Implementación Completa Pendiente

### Paso 1: Modificar carga inicial (useEffect)
```typescript
// CAMBIAR DE:
const solarYearEvents = await fetchSolarYearEvents(); // Carga TODO el año

// A:
const currentMonthEvents = await fetchMonthlyEvents(new Date());
const nextMonthEvents = await fetchMonthlyEvents(addMonths(new Date(), 1));
setEvents([...currentMonthEvents, ...nextMonthEvents]);
```

### Paso 2: Modificar navegación de meses
```typescript
const goToNextMonth = async () => {
  const nextMonth = addMonths(currentMonth, 1);

  // Mostrar modal
  setLoadingMonthlyEvents(true);
  setLoadingMonthName(format(nextMonth, 'MMMM yyyy', { locale: es }));

  // Cargar eventos del mes
  const newEvents = await fetchMonthlyEvents(nextMonth);

  // Agregar a eventos existentes
  setEvents(prev => [...prev, ...newEvents]);

  // Ocultar modal y cambiar mes
  setLoadingMonthlyEvents(false);
  setCurrentMonth(nextMonth);
  setSelectedDate(null);
  setSelectedDayEvents([]);
};
```

### Paso 3: Agregar modal al render
```tsx
{/* Modal de carga de eventos */}
<EventsLoadingModal
  isOpen={loadingMonthlyEvents}
  month={loadingMonthName}
/>
```

## 🚨 PROBLEMA DESCUBIERTO

**Los cambios del middleware NO solucionan los errores 404/504:**

### Commits que causan problemas:
```bash
da9b5d4 - 🔧 FIX: Remove /api/astrology and /api/interpretations from middleware
ac0d2a0 - 🔧 FIX: Remove /api/birth-data and /api/charts from middleware
```

### Por qué causan problemas:
1. **404** en `/api/interpretations/save` - Quitamos protección pero Next.js no encuentra la ruta
2. **504** NO se soluciona quitando del middleware - Es un timeout de OpenAI (>60s)
3. Las rutas SÍ necesitan autenticación, solo que de forma diferente

### Solución correcta:
**REVERTIR** los commits del middleware y atacar el problema real:
- Los **504 timeouts** se solucionan dividiendo las llamadas a OpenAI en chunks
- Los **404** desaparecerán al revertir
- La **carga lazy** SÍ es buena idea, pero para la agenda, NO para interpretaciones

## 🔄 Pasos a Seguir (DESPUÉS DE REVERTIR)

1. **Revertir middleware:**
   ```bash
   git revert da9b5d4 ac0d2a0
   ```

2. **Descartar cambios parciales en agenda:**
   ```bash
   git checkout src/app/(dashboard)/agenda/page.tsx
   ```

3. **Guardar archivos nuevos (NO borrar):**
   - `src/app/api/astrology/monthly-events/route.ts` (GUARDAR)
   - `src/components/astrology/EventsLoadingModal.tsx` (GUARDAR)

4. **Solucionar problema REAL de timeouts:**
   - Investigar por qué interpret-solar-return tarda >60s
   - Opciones:
     - Dividir en chunks más pequeños
     - Usar streaming de OpenAI
     - Pre-calcular y cachear interpretaciones
     - Reducir tokens/prompts

5. **DESPUÉS implementar carga lazy completa:**
   - Terminar modificaciones en agenda/page.tsx
   - Probar flujo completo
   - Commitear cuando funcione

## 📝 Notas Importantes

- **NO tocar middleware** - Las rutas SÍ necesitan protección
- **El 504 es por OpenAI lento**, no por autenticación
- **La carga lazy de eventos SÍ tiene sentido** - Solo estábamos atacando el problema equivocado
- **Los archivos nuevos son útiles** - Guardarlos para usarlos después

## 🎯 Problema Real a Resolver

```typescript
// src/app/api/astrology/interpret-solar-return/route.ts
// Este endpoint tarda >60 segundos porque:
const completion = await openai.chat.completions.create({
  model: "gpt-4",  // Modelo lento
  messages: [{ role: "user", content: MASSIVE_PROMPT }],  // Prompt gigante
  max_tokens: 4000  // Muchos tokens
});
```

**Solución:** Dividir la interpretación en 3-4 llamadas más pequeñas y combinarlas.

---

**Estado:** TRABAJO PAUSADO - Revertir y atacar problema real primero
**Siguiente paso:** `git revert da9b5d4 ac0d2a0`
