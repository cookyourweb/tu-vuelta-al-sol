# 📋 Documentación: Sistema de Tooltips Draggables

**Fecha**: 2026-01-09
**Versión**: 1.0
**Estado**: ✅ Funcionando correctamente

---

## 📖 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Reglas Críticas - NO ROMPER](#reglas-críticas---no-romper)
4. [Problemas Resueltos](#problemas-resueltos)
5. [Cómo Funciona](#cómo-funciona)
6. [Debugging y Troubleshooting](#debugging-y-troubleshooting)

---

## 🎯 Resumen Ejecutivo

Los tooltips de la carta natal (planetas, aspectos, casas) son **draggables** y tienen un **delay de 2000ms** antes de cerrarse. Esto permite al usuario:

- Ver el tooltip cuando hace hover
- Mover el mouse hacia el tooltip sin que desaparezca
- Hacer clic en botones dentro del tooltip
- Arrastrar el tooltip a cualquier posición

**⚠️ IMPORTANTE**: Este sistema es delicado. Cualquier cambio en los timers puede romperlo.

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
ChartDisplay.tsx
├── Círculos de planetas (SVG)
├── Líneas de aspectos (SVG)
├── Planet cards (listado)
├── Aspect cards (listado)
└── Timers:
    ├── cardHoverTimer (150ms para mostrar)
    ├── aspectLineHoverTimer (2000ms para ocultar aspectos)
    └── planetCircleHoverTimer (2000ms para ocultar planetas)

ChartTooltips.tsx
├── Tooltip de planetas (Draggable)
├── Tooltip de aspectos (Draggable)
├── Tooltip de casas
└── Recibe timers de ChartDisplay para cancelarlos
```

### Flujo de Datos

```
Usuario hover → ChartDisplay inicia timer 150ms → Muestra tooltip
Usuario sale → ChartDisplay inicia timer 2000ms
Usuario entra al tooltip → ChartTooltips CANCELA timer 2000ms
Usuario sale del tooltip → Nuevo timer 2000ms → Cierra tooltip
```

---

## 🚨 Reglas Críticas - NO ROMPER

### ❌ NUNCA hacer esto:

#### 1. NO ejecutar `setHoveredPlanet(null)` o `setHoveredAspect(null)` sin delay

```typescript
// ❌ MAL - Cierra inmediatamente
onMouseLeave={() => {
  setHoveredPlanet(null);
}}

// ✅ BIEN - Delay de 2000ms
onMouseLeave={() => {
  const timer = setTimeout(() => {
    setHoveredPlanet(null);
  }, 2000);
  setPlanetCircleHoverTimer(timer);
}}
```

#### 2. NO cambiar los delays sin entender el impacto

```typescript
// ❌ MAL - Delay demasiado corto
}, 500); // Usuario no tiene tiempo

// ✅ BIEN - Delay adecuado
}, 2000); // 2 segundos es suficiente
```

#### 3. NO olvidar cancelar timers cuando el mouse entra

```typescript
// ❌ MAL - Timer sigue corriendo
onMouseEnter={(e) => {
  handleTooltipMouseEnter();
}}

// ✅ BIEN - Cancela todos los timers
onMouseEnter={(e) => {
  handleTooltipMouseEnter();
  if (planetCircleHoverTimer && setPlanetCircleHoverTimer) {
    clearTimeout(planetCircleHoverTimer);
    setPlanetCircleHoverTimer(null);
  }
}}
```

#### 4. NO usar `tooltipPosition.x/y` como dependencia en useEffect

```typescript
// ❌ MAL - Se recalcula cada vez que el mouse se mueve
useEffect(() => {
  setTooltipPosition2({ x: tooltipPosition.x, y: tooltipPosition.y });
}, [tooltipPosition.x, tooltipPosition.y]);

// ✅ BIEN - Usa un ref que no causa re-renders
const lastTooltipPositionRef = useRef({ x: 0, y: 0 });
useEffect(() => {
  lastTooltipPositionRef.current = tooltipPosition;
}, [tooltipPosition]);
```

#### 5. NO olvidar agregar `key` única al Draggable

```typescript
// ❌ MAL - No se remonta cuando cambia el tooltip
<Draggable>
  <div>...</div>
</Draggable>

// ✅ BIEN - Se remonta con nueva posición
<Draggable key={interpretationKey}>
  <div>...</div>
</Draggable>
```

---

## ✅ Problemas Resueltos

### Problema 1: React 18 Compatibility Error
**Error**: `findDOMNode is not a function`

**Solución**: Usar `nodeRef` pattern
```typescript
const draggableRef = useRef<HTMLDivElement>(null);

<Draggable nodeRef={draggableRef}>
  <div ref={draggableRef}>...</div>
</Draggable>
```

### Problema 2: Tooltips saltando de posición
**Causa**: `tooltipPosition.x/y` en dependencias de useEffect

**Solución**: Usar ref en lugar de estado
```typescript
const lastTooltipPositionRef = useRef({ x: 0, y: 0 });
// Actualizar ref sin causar re-render
useEffect(() => {
  lastTooltipPositionRef.current = tooltipPosition;
}, [tooltipPosition]);
```

### Problema 3: Flash desde top-left
**Causa**: `tooltipPosition2` inicializado en {0,0}

**Solución**: Calcular directamente del ref en el render
```typescript
<Draggable
  defaultPosition={{
    x: lastTooltipPositionRef.current.x - 80,
    y: lastTooltipPositionRef.current.y - 40
  }}
/>
```

### Problema 4: Tooltips cerrándose después de 1 segundo
**Causa**: Race condition - timer de ChartDisplay seguía corriendo

**Solución**: Pasar timer como prop y cancelarlo en ChartTooltips
```typescript
// ChartDisplay
<ChartTooltips
  aspectLineHoverTimer={aspectLineHoverTimer}
  setAspectLineHoverTimer={setAspectLineHoverTimer}
/>

// ChartTooltips
onMouseEnter={() => {
  if (aspectLineHoverTimer) {
    clearTimeout(aspectLineHoverTimer);
    setAspectLineHoverTimer(null);
  }
}}
```

### Problema 5: Círculos de planetas sin delay
**Causa**: onMouseLeave ejecutaba setHoveredPlanet(null) inmediatamente

**Solución**: Añadir planetCircleHoverTimer con delay de 2000ms

---

## 🔧 Cómo Funciona

### 1. Mostrar Tooltip

```typescript
// En ChartDisplay.tsx - Círculo de planeta
onMouseEnter={(e) => {
  // Cancelar cualquier timer existente
  if (planetCircleHoverTimer) clearTimeout(planetCircleHoverTimer);

  // Delay de 150ms antes de mostrar (evita tooltips accidentales)
  const timer = setTimeout(() => {
    setHoveredPlanet(planet.name);
    handleMouseMove(e);
  }, 150);

  setCardHoverTimer(timer);
}}
```

### 2. Ocultar Tooltip con Delay

```typescript
onMouseLeave={() => {
  // Cancelar timer de mostrar
  if (cardHoverTimer) {
    clearTimeout(cardHoverTimer);
    setCardHoverTimer(null);
  }

  // Delay de 2000ms antes de ocultar (tiempo para llegar al tooltip)
  const timer = setTimeout(() => {
    setHoveredPlanet(null);
  }, 2000);

  setPlanetCircleHoverTimer(timer);
}}
```

### 3. Cancelar Timer cuando Mouse Entra al Tooltip

```typescript
// En ChartTooltips.tsx
onMouseEnter={(e) => {
  // CRÍTICO: Cancelar timer de ChartDisplay
  if (planetCircleHoverTimer && setPlanetCircleHoverTimer) {
    clearTimeout(planetCircleHoverTimer);
    setPlanetCircleHoverTimer(null);
  }
}}
```

### 4. Hacer Tooltip Draggable

```typescript
const draggableRef = useRef<HTMLDivElement>(null);

<Draggable
  key={interpretationKey}  // Fuerza remount
  nodeRef={draggableRef}   // React 18 compatible
  defaultPosition={{
    x: lastTooltipPositionRef.current.x - 80,
    y: lastTooltipPositionRef.current.y - 40
  }}
  onStart={() => {
    // Cancelar timers al empezar a arrastrar
    if (planetCircleHoverTimer) {
      clearTimeout(planetCircleHoverTimer);
    }
  }}
>
  <div ref={draggableRef} className="...cursor-move">
    {/* Contenido del tooltip */}
  </div>
</Draggable>
```

---

## 🐛 Debugging y Troubleshooting

### Síntoma: Tooltips se cierran inmediatamente

**Diagnóstico**:
```typescript
// Añadir logs en onMouseLeave
onMouseLeave={() => {
  console.log('🔍 onMouseLeave ejecutado');
  console.log('   Timer actual:', planetCircleHoverTimer);

  const timer = setTimeout(() => {
    console.log('⏰ Timer ejecutado - cerrando tooltip');
    setHoveredPlanet(null);
  }, 2000);

  console.log('   Nuevo timer:', timer);
  setPlanetCircleHoverTimer(timer);
}}
```

**Causas comunes**:
1. ✅ Hay delay de 2000ms pero el timer no se cancela en ChartTooltips
2. ✅ onMouseLeave ejecuta setHoveredPlanet(null) directamente sin timer
3. ✅ Timer se crea pero no se pasa como prop a ChartTooltips

### Síntoma: Tooltips saltan de posición

**Diagnóstico**:
```typescript
// Verificar dependencias del useEffect
useEffect(() => {
  console.log('🔍 useEffect ejecutado');
  console.log('   Nueva key:', newKey);
  console.log('   Posición calculada:', { x, y });
}, [/* ⚠️ NO incluir tooltipPosition.x/y aquí */]);
```

**Causas comunes**:
1. ✅ tooltipPosition.x/y en dependencias de useEffect
2. ✅ No usar key única en Draggable
3. ✅ Calcular posición desde estado en lugar de ref

### Síntoma: Flash desde esquina superior izquierda

**Diagnóstico**:
```typescript
console.log('Posición inicial del tooltip:', {
  x: lastTooltipPositionRef.current.x,
  y: lastTooltipPositionRef.current.y
});
```

**Causas comunes**:
1. ✅ Usar estado inicializado en {0,0}
2. ✅ Calcular posición en useEffect después del render
3. ✅ No usar ref para guardar posición del mouse

---

## 📝 Checklist para Nuevos Tooltips

Si necesitas añadir un nuevo tipo de tooltip, sigue estos pasos:

- [ ] Crear timer específico en ChartDisplay (e.g., `newTooltipTimer`)
- [ ] onMouseEnter: Delay de 150ms antes de mostrar
- [ ] onMouseLeave: Delay de 2000ms antes de ocultar
- [ ] Pasar timer como prop a ChartTooltips
- [ ] ChartTooltips: Cancelar timer en onMouseEnter
- [ ] ChartTooltips: Cancelar timer en Draggable onStart
- [ ] Usar nodeRef para React 18 compatibility
- [ ] Usar key única para forzar remount
- [ ] Calcular posición inicial del ref, no del estado
- [ ] Añadir cleanup en useEffect para timers

---

## 🔗 Archivos Relacionados

- **ChartDisplay.tsx** (líneas 91-111): Definición de timers
- **ChartDisplay.tsx** (líneas 450-472): Tooltips de círculos de planetas
- **ChartDisplay.tsx** (líneas 378-402): Tooltips de líneas de aspectos
- **ChartDisplay.tsx** (líneas 2196-2206): Props a ChartTooltips
- **ChartTooltips.tsx** (líneas 50-56): Interface con props de timers
- **ChartTooltips.tsx** (líneas 547-600): Tooltip de planetas draggable
- **ChartTooltips.tsx** (líneas 1487-1559): Tooltip de aspectos draggable

---

## 🚀 Testing

Para verificar que todo funciona:

1. **Hover sobre círculo de planeta**
   - ✅ Tooltip aparece después de 150ms
   - ✅ Mueve mouse fuera del círculo
   - ✅ Tooltip permanece visible
   - ✅ Mueve mouse al tooltip dentro de 2 segundos
   - ✅ Tooltip NO se cierra
   - ✅ Arrastra el tooltip
   - ✅ Tooltip se mueve suavemente

2. **Hover sobre línea de aspecto**
   - ✅ Tooltip aparece después de 150ms
   - ✅ Mueve mouse fuera de la línea
   - ✅ Tooltip permanece visible
   - ✅ Mueve mouse al tooltip dentro de 2 segundos
   - ✅ Tooltip NO se cierra
   - ✅ Click en botones dentro del tooltip
   - ✅ Botones funcionan correctamente

3. **Test de múltiples tooltips**
   - ✅ Hover sobre planeta → tooltip aparece
   - ✅ Sin cerrar, hover sobre aspecto → tooltip de aspecto aparece
   - ✅ Primer tooltip se cierra correctamente
   - ✅ No hay race conditions ni timers colgados

---

## 📞 Contacto

Si algo se rompe o tienes dudas:
1. Lee esta documentación completa
2. Revisa los commits del 2026-01-09 en la rama `claude/update-event-interpretation-gr9VI`
3. Busca los console.log en el código para debugging
4. NO elimines los delays sin consultar primero

**Última actualización**: 2026-01-09
**Autor**: Claude (Sesión: claude/update-event-interpretation-gr9VI)
