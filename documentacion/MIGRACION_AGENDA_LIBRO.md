# 📖 MIGRACIÓN AGENDA LIBRO - Guía para Desarrolladores

**Fecha:** 2026-01-02
**Autor:** Claude (Sesión gr9VI)
**Estado:** En Progreso - Fase 1
**Prioridad:** Alta

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Origen vs Destino](#arquitectura-origen-vs-destino)
3. [Plan de Migración en 2 Fases](#plan-de-migración-en-2-fases)
4. [Fase 1: Estructura Base + Hardcode](#fase-1-estructura-base--hardcode)
5. [Fase 2: Personalización Progresiva](#fase-2-personalización-progresiva)
6. [Componentes a Migrar](#componentes-a-migrar)
7. [Dependencias y Conflictos](#dependencias-y-conflictos)
8. [Guía de Implementación](#guía-de-implementación)
9. [Testing y Validación](#testing-y-validación)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 RESUMEN EJECUTIVO

### Objetivo
Integrar el diseño de **Agenda Libro** (proyecto React/Vite standalone) en la **página agenda actual** (Next.js App Router) del proyecto Tu Vuelta al Sol.

### Contexto
- **Código origen**: `src/app/(dashboard)/agenda/libroagendapropuesta/` (proyecto Vite completo)
- **Destino**: `src/app/(dashboard)/agenda/page.tsx` (página Next.js existente)
- **Enfoque**: Migración progresiva en 2 fases (hardcode → personalización)

### Resultado Esperado
- ✅ Botón "Ver Agenda" en sidebar de agenda actual
- ✅ Modal fullscreen con diseño de libro imprimible
- ✅ 4 estilos visuales (elegante, creativo, minimalista, bohemio)
- ✅ Funcionalidad de impresión como libro A5
- ✅ Datos personalizados desde carta natal + solar return + eventos API

---

## 🏗️ ARQUITECTURA ORIGEN VS DESTINO

### **Proyecto Origen (libroagendapropuesta)**

```
Stack Técnico:
├── React 18.3.1 (standalone)
├── Vite 5.4.19
├── TypeScript 5.8.3
├── Tailwind CSS 3.4.17
├── shadcn-ui (50+ componentes completos)
├── React Router DOM 6.30.1 ❌ INCOMPATIBLE
├── date-fns 3.6.0
└── lucide-react 0.462.0

Arquitectura:
└── Single Page App con routing interno
    ├── BirthdayForm (entrada de datos) ❌ NO NECESARIO
    ├── PrintableAgenda (vista libro completo)
    ├── StyleSwitcher (selector de temas)
    └── StyleContext (React Context para estilos)
```

### **Proyecto Destino (Tu Vuelta al Sol - Next.js)**

```
Stack Técnico:
├── Next.js (latest) con App Router
├── React 18.2.0 (pinned)
├── TypeScript 5.0.4
├── Tailwind CSS 4.1.11
├── Firebase Auth + Admin
├── MongoDB (Mongoose 8.16.2)
├── OpenAI 5.12.2 (interpretaciones)
├── date-fns 4.1.0 ✅ COMPATIBLE
└── lucide-react 0.525.0 ✅ COMPATIBLE

Arquitectura:
└── Server + Client Components
    ├── AuthContext (Firebase)
    ├── NotificationContext
    ├── API Routes (/api/astrology/*)
    └── Dashboard protegido (dashboard)
```

---

## 📅 PLAN DE MIGRACIÓN EN 2 FASES

### **¿Por qué 2 Fases?**

**Ventajas del approach incremental:**
1. ✅ **Resultados rápidos**: En 2h ves agenda completa visual
2. ✅ **Debug aislado**: Separas problemas de diseño vs datos
3. ✅ **Validación UX temprana**: Revisas diseño antes de personalizar
4. ✅ **Sin bloqueos**: APIs/datos no frenan progreso visual
5. ✅ **Commits incrementales**: Cada paso añade valor

---

## 🚀 FASE 1: ESTRUCTURA BASE + HARDCODE

**Duración Estimada:** 1.5-2 horas
**Objetivo:** Agenda visual completa con datos de ejemplo

### Paso 1.1: Sistema de Estilos (30min)

**Archivos a crear:**

```typescript
// src/context/StyleContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AgendaStyle = 'elegante' | 'creativo' | 'minimalista' | 'bohemio';

interface StyleConfig {
  name: string;
  description: string;
  // Typography
  fontDisplay: string;
  fontBody: string;
  // Colors
  headerBg: string;
  headerText: string;
  cardBg: string;
  cardBorder: string;
  // ... (ver código completo en StyleContext.tsx origen)
}

export const styleConfigs: Record<AgendaStyle, StyleConfig> = {
  // Copiar configuraciones completas del archivo origen
};

interface StyleContextType {
  currentStyle: AgendaStyle;
  setStyle: (style: AgendaStyle) => void;
  config: StyleConfig;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStyle, setCurrentStyle] = useState<AgendaStyle>('creativo');

  useEffect(() => {
    // Aplicar clase CSS al root
    const root = document.documentElement;
    const prefix = 'agenda-style-';
    (Object.keys(styleConfigs) as AgendaStyle[]).forEach(s =>
      root.classList.remove(`${prefix}${s}`)
    );
    root.classList.add(`${prefix}${currentStyle}`);
  }, [currentStyle]);

  return (
    <StyleContext.Provider value={{
      currentStyle,
      setStyle: setCurrentStyle,
      config: styleConfigs[currentStyle]
    }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => {
  const context = useContext(StyleContext);
  if (!context) throw new Error('useStyle must be used within StyleProvider');
  return context;
};
```

```typescript
// src/components/agenda/StyleSwitcher.tsx
'use client';

import { useStyle, AgendaStyle, styleConfigs } from '@/context/StyleContext';
import { Palette, Sparkles, Minus, Feather } from 'lucide-react';

const styleIcons: Record<AgendaStyle, React.ReactNode> = {
  elegante: <Palette className="w-4 h-4" />,
  creativo: <Sparkles className="w-4 h-4" />,
  minimalista: <Minus className="w-4 h-4" />,
  bohemio: <Feather className="w-4 h-4" />,
};

export const StyleSwitcher = () => {
  const { currentStyle, setStyle } = useStyle();

  return (
    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-2 py-1.5 border border-gray-200">
      <span className="text-xs text-gray-500 font-medium px-1">Estilo:</span>
      {(Object.keys(styleConfigs) as AgendaStyle[]).map((style) => (
        <button
          key={style}
          onClick={() => setStyle(style)}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 text-xs
            ${currentStyle === style
              ? `bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md`
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          {styleIcons[style]}
          <span className="font-medium hidden sm:inline">
            {styleConfigs[style].name}
          </span>
        </button>
      ))}
    </div>
  );
};
```

**⚠️ IMPORTANTE - Conflictos de imports:**
- Todos los imports `@/components/...` del código origen apuntan a `libroagendapropuesta/src/`
- En Next.js `@/` apunta a `src/`
- **Solución**: Reescribir TODOS los imports al migrar componentes

---

### Paso 1.2: Componente AgendaLibro Base (30min)

**Archivo a crear:**

```typescript
// src/components/agenda/AgendaLibro/index.tsx
'use client';

import React, { useRef } from 'react';
import { useStyle } from '@/context/StyleContext';
import { StyleSwitcher } from '@/components/agenda/StyleSwitcher';
import { Button } from '@/components/ui/Button';
import { Printer, X } from 'lucide-react';

// Importar secciones (por ahora hardcodeadas)
import { PortadaPersonalizada } from './PortadaPersonalizada';
import { EjemploEneroCompleto } from './EjemploEnero';
// ... más importaciones

interface AgendaLibroProps {
  onClose: () => void;
  userName: string;
  startDate: Date;
  endDate: Date;
  // Fase 2: agregar events[], natalChart, solarReturn, etc.
}

export const AgendaLibro = ({ onClose, userName, startDate, endDate }: AgendaLibroProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { config } = useStyle();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      {/* Header de controles - NO se imprime */}
      <div className={`no-print sticky top-0 z-50 backdrop-blur border-b ${config.headerBg} ${config.headerText} p-4`}>
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" /> Cerrar
          </Button>

          <div className="flex items-center gap-4">
            <StyleSwitcher />
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" /> Imprimir Libro
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido del libro */}
      <div ref={printRef} className="container mx-auto py-8 space-y-0 print:p-0">
        {/* FASE 1: Secciones hardcodeadas */}
        <PortadaPersonalizada name={userName} startDate={startDate} endDate={endDate} />

        {/* Ejemplo Enero completo */}
        <EjemploEneroCompleto />

        {/* FASE 2: Aquí irán los otros 11 meses dinámicos */}
        <div className="print-page bg-white p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-600">
            📅 Meses Febrero - Diciembre
          </h2>
          <p className="text-gray-500 mt-4">
            En desarrollo - Próximamente con tus eventos personalizados
          </p>
        </div>
      </div>
    </div>
  );
};
```

**CSS para impresión (agregar a globals.css):**

```css
/* Estilos de impresión para libro A5 */
@media print {
  @page {
    size: A5;
    margin: 0;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .no-print {
    display: none !important;
  }

  .print-page {
    page-break-after: always;
    width: 148mm;
    height: 210mm;
    position: relative;
    overflow: hidden;
  }

  .print-page:last-child {
    page-break-after: auto;
  }
}
```

---

### Paso 1.3: Integrar Ejemplo Enero (30min)

**Estrategia:**
1. Copiar archivo completo `EjemploEnero2026.tsx` → `src/components/agenda/AgendaLibro/EjemploEnero.tsx`
2. Reescribir TODOS los imports:
   - `@/contexts/StyleContext` → `@/context/StyleContext`
   - `@/components/ui/...` → verificar que existan o copiarlos
3. Mantener TODO el contenido hardcodeado
4. Objetivo: Enero 2026 completo visible

**Componentes UI necesarios:**
- Los que ya tenemos: ✅ Button
- Los que faltan: copiar de `libroagendapropuesta/src/components/ui/`:
  - `badge.tsx`
  - `card.tsx`
  - `separator.tsx`

---

### Paso 1.4: Botón "Ver Agenda" en Sidebar (30min)

**Modificar archivo:**

```typescript
// src/app/(dashboard)/agenda/page.tsx

// Agregar imports
import { AgendaLibro } from '@/components/agenda/AgendaLibro';
import { StyleProvider } from '@/context/StyleContext';

// Agregar estado
const [showAgendaLibro, setShowAgendaLibro] = useState(false);

// En el sidebar (alrededor línea 1430), AGREGAR:
<div className="mt-6">
  <button
    onClick={() => setShowAgendaLibro(true)}
    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
  >
    <span className="text-xl">📖</span>
    Ver Agenda Libro
  </button>
</div>

// Antes del cierre del return principal, AGREGAR:
{showAgendaLibro && (
  <StyleProvider>
    <AgendaLibro
      onClose={() => setShowAgendaLibro(false)}
      userName={userProfile?.name || 'Usuario'}
      startDate={yearRange?.start || new Date()}
      endDate={yearRange?.end || new Date()}
    />
  </StyleProvider>
)}
```

---

## ✅ RESULTADO FASE 1

Después de completar estos 4 pasos, tendrás:

```
┌─────────────────────────────────────────────┐
│  PÁGINA AGENDA (existente)                  │
│  ├── PlanetaryCards                         │
│  ├── Calendario mensual                     │
│  └── Sidebar                                │
│      └── 📖 [Ver Agenda Libro] ← NUEVO     │
│                                              │
│  Al hacer click:                            │
│  ┌─────────────────────────────────────┐   │
│  │ 🎨 MODAL FULLSCREEN                 │   │
│  │ ├── StyleSwitcher (4 estilos)       │   │
│  │ ├── Botón Imprimir                  │   │
│  │ ├── Portada Personalizada           │   │
│  │ ├── ENERO 2026 COMPLETO             │   │
│  │ │   ├── Apertura                    │   │
│  │ │   ├── Calendario visual           │   │
│  │ │   ├── Interpretaciones Luna       │   │
│  │ │   ├── Ejercicios                  │   │
│  │ │   ├── 4 Semanas detalladas        │   │
│  │ │   └── Cierre mes                  │   │
│  │ └── Placeholder meses 2-12          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Cambiar entre 4 estilos visuales
- ✅ Imprimir como libro A5
- ✅ Ver diseño completo de un mes (Enero)
- ✅ Cerrar y volver a agenda normal

**Datos:**
- 🟡 Portada: nombre real + fechas reales
- 🔴 Enero: eventos hardcodeados (Luna Nueva 6 enero, etc.)
- 🔴 Meses 2-12: placeholder

---

## 🎨 FASE 2: PERSONALIZACIÓN PROGRESIVA

**Duración Estimada:** 4-6 horas
**Objetivo:** Reemplazar hardcode con datos reales de usuario

### Paso 2.1: Datos Básicos de Usuario (30min)

**Modificar:**
```typescript
// AgendaLibro/PortadaPersonalizada.tsx
// Reemplazar placeholders con props reales:
- userName (ya tenemos)
- birthDate real
- Calcular edad actual
- Lugar de nacimiento
```

**Datos necesarios:**
- `userProfile.name` ✅
- `userProfile.birthDate` ✅
- `userProfile.birthPlace` ✅
- `userProfile.currentAge` ✅

---

### Paso 2.2: Un Mes Dinámico (1.5h) ⭐ CRÍTICO

**Objetivo:** Crear `MesPageDinamico.tsx` que reciba eventos reales

**Input:**
```typescript
interface MesPageProps {
  monthDate: Date;  // Ej: new Date(2026, 0, 1) para Enero
  monthNumber: number;  // 1-12
  events: AstrologicalEvent[];  // Eventos del mes desde API
  userName: string;
}
```

**Lógica:**

```typescript
// src/components/agenda/AgendaLibro/MesPageDinamico.tsx

export const MesPageDinamico = ({ monthDate, monthNumber, events, userName }: MesPageProps) => {
  // 1. Filtrar eventos del mes
  const monthEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return isSameMonth(eventDate, monthDate);
  });

  // 2. Categorizar eventos
  const lunasNuevas = monthEvents.filter(e => e.type === 'lunar_phase' && e.title.includes('Nueva'));
  const lunasLlenas = monthEvents.filter(e => e.type === 'lunar_phase' && e.title.includes('Llena'));
  const eclipses = monthEvents.filter(e => e.type === 'eclipse');
  const transitos = monthEvents.filter(e => e.type === 'planetary_transit');

  // 3. Generar calendario visual
  const calendarDays = generateCalendarDays(monthDate);
  const daysWithEvents = calendarDays.map(day => ({
    date: day,
    events: monthEvents.filter(e => isSameDay(new Date(e.date), day))
  }));

  // 4. Renderizar estructura del mes (similar a EjemploEnero)
  return (
    <>
      {/* Apertura del mes (2 páginas) */}
      <AperturaMes
        monthDate={monthDate}
        monthNumber={monthNumber}
        mainEvent={lunasNuevas[0] || monthEvents[0]}
      />

      {/* Calendario visual con eventos */}
      <CalendarioMensual
        monthDate={monthDate}
        daysWithEvents={daysWithEvents}
      />

      {/* Interpretaciones de eventos importantes */}
      {lunasNuevas.map(luna => (
        <InterpretacionLunaNueva key={luna.id} event={luna} userName={userName} />
      ))}

      {/* 4 semanas del mes */}
      {generateWeeks(monthDate).map((week, idx) => (
        <SemanaPage
          key={idx}
          weekStart={week.start}
          weekNumber={week.number}
          events={getWeekEvents(week, monthEvents)}
        />
      ))}

      {/* Cierre del mes */}
      <CierreMes monthDate={monthDate} />
    </>
  );
};
```

**Componentes reutilizables del EjemploEnero:**
- `AperturaMesIzquierda` → adaptar con `mainEvent.title`
- `AperturaMesDerecha` → listar eventos reales del mes
- `CalendarioVisual` → marcar días con eventos reales
- `SemanaPage` → llenar con eventos de esa semana

---

### Paso 2.3: Secciones Carta Natal (1h)

**Modificar:**
```typescript
// AgendaLibro/SoulChart.tsx
// Reemplazar hardcode con datos reales:

interface SoulChartProps {
  natalChart: NatalChartData;  // Desde /api/charts/natal
}

export const SoulChart = ({ natalChart }: SoulChartProps) => {
  // Extraer datos reales:
  const { sun, moon, ascendant, planetaryPositions } = natalChart;

  return (
    <>
      <EsenciaNatal
        sun={sun}
        moon={moon}
        ascendant={ascendant}
      />

      <NodoNorte position={natalChart.northNode} />
      <NodoSur position={natalChart.southNode} />

      <PlanetasDominantes planets={calculateDominantPlanets(natalChart)} />

      <PatronesEmocionales
        moonAspects={natalChart.moonAspects}
        venusAspects={natalChart.venusAspects}
      />
    </>
  );
};
```

**APIs necesarias:**
- ✅ `/api/charts/natal` (ya existe)
- Extraer: `natalChart.planets`, `natalChart.houses`, `natalChart.aspects`

---

### Paso 2.4: Retorno Solar Real (1h)

**Modificar:**
```typescript
// AgendaLibro/RetornoSolar.tsx

interface RetornoSolarProps {
  solarReturn: SolarReturnData;  // Desde /api/charts/progressed
  birthDate: Date;
}

export const RetornoSolar = ({ solarReturn, birthDate }: RetornoSolarProps) => {
  return (
    <>
      <QueEsRetornoSolar birthDate={birthDate} />

      <AscendenteAnio
        ascendant={solarReturn.ascendant}
        sign={solarReturn.ascendantSign}
      />

      <SolRetorno
        position={solarReturn.sun}
        house={solarReturn.sunHouse}
        interpretation={solarReturn.interpretation?.sun}
      />

      <LunaRetorno
        position={solarReturn.moon}
        house={solarReturn.moonHouse}
        interpretation={solarReturn.interpretation?.moon}
      />

      <EjesDelAnio axes={solarReturn.houses} />

      <MantraAnual mantra={generateMantra(solarReturn)} />
    </>
  );
};
```

**APIs necesarias:**
- ✅ `/api/charts/progressed` (ya existe)
- Extraer: `solarReturn.planets`, `solarReturn.houses`, `solarReturn.interpretation`

---

### Paso 2.5: 12 Meses Completos (1h)

**En AgendaLibro/index.tsx:**

```typescript
// Generar 12 meses dinámicamente
const months = generateMonths(startDate, endDate);

return (
  <div ref={printRef}>
    <PortadaPersonalizada {...} />
    <TuAnioTuViaje {...} />
    <SoulChart natalChart={natalChart} />
    <RetornoSolar solarReturn={solarReturn} />

    {/* 12 meses dinámicos */}
    {months.map((monthDate, index) => (
      <MesPageDinamico
        key={index}
        monthDate={monthDate}
        monthNumber={index + 1}
        events={events}  // Pasar TODOS los eventos, filtrado interno
        userName={userName}
        natalChart={natalChart}
        solarReturn={solarReturn}
      />
    ))}

    <TerapiasCreativas />
    <CierreCiclo {...} />
  </div>
);
```

---

### Paso 2.6: Interpretaciones IA (1h)

**Conectar con sistema existente:**

```typescript
// En cada evento importante del mes
<EventInterpretationButton
  userId={userId}
  event={{
    type: mapEventType(event.type),
    date: event.date,
    sign: event.sign,
    house: event.house,
    planetsInvolved: [event.planet]
  }}
/>

// Generar textos personalizados usando:
// - src/utils/prompts/eventInterpretationPrompt.ts
// - Arquitectura ya establecida (NATAL + SR + Evento)
```

---

## 📦 COMPONENTES A MIGRAR

### Prioridad Alta (Fase 1)
| Componente | Origen | Destino | Notas |
|------------|--------|---------|-------|
| `StyleContext.tsx` | contexts/ | src/context/ | Client Component |
| `StyleSwitcher.tsx` | components/ | src/components/agenda/ | Client Component |
| `EjemploEnero2026.tsx` | components/agenda/ | src/components/agenda/AgendaLibro/ | Mantener hardcode |
| `PrintableAgenda.tsx` | components/ | src/components/agenda/AgendaLibro/index.tsx | Adaptar estructura |

### Prioridad Media (Fase 2)
| Componente | Origen | Destino | Acción |
|------------|--------|---------|--------|
| `MesPage.tsx` | agenda/ | AgendaLibro/MesPageDinamico.tsx | Crear versión dinámica |
| `SemanaConsciente.tsx` | agenda/ | AgendaLibro/SemanaPage.tsx | Recibir eventos como props |
| `PortalEntrada.tsx` | agenda/ | AgendaLibro/ | Personalizar nombre/fechas |
| `SoulChart.tsx` | agenda/ | AgendaLibro/ | Conectar con API natal |
| `RetornoSolar.tsx` | agenda/ | AgendaLibro/ | Conectar con API progressed |

### Componentes UI (shadcn)
| Componente | Necesario | Acción |
|------------|-----------|--------|
| `badge.tsx` | ✅ Sí | Copiar de libroagendapropuesta |
| `card.tsx` | ✅ Sí | Copiar de libroagendapropuesta |
| `separator.tsx` | ⚠️ Opcional | Puede usar `<hr>` simple |
| `tooltip.tsx` | ⚠️ Opcional | Nice to have |

---

## ⚠️ DEPENDENCIAS Y CONFLICTOS

### Dependencias Ya Compatibles ✅
```json
{
  "date-fns": "3.6.0 → 4.1.0" ✅ Compatible (minor changes),
  "lucide-react": "0.462.0 → 0.525.0" ✅ Compatible,
  "react": "18.3.1 → 18.2.0" ✅ Compatible (downgrade seguro),
  "tailwindcss": "3.4.17 → 4.1.11" ⚠️ Breaking changes menores
}
```

### Incompatibilidades ❌
```json
{
  "react-router-dom": "6.30.1" ❌ NO USAR - Next.js tiene routing propio,
  "vite": "5.4.19" ❌ NO NECESARIO - Next.js usa su bundler
}
```

### Nuevas Dependencias Necesarias
```bash
# NO necesitas instalar nada nuevo, todo ya está en package.json
# Solo verificar versiones:
npm list date-fns lucide-react
```

---

## 🛠️ GUÍA DE IMPLEMENTACIÓN

### Setup Inicial

```bash
# 1. Crear estructura de carpetas
mkdir -p src/context
mkdir -p src/components/agenda/AgendaLibro

# 2. Verificar dependencias
npm list date-fns lucide-react

# 3. Crear rama de desarrollo
git checkout -b feature/agenda-libro-migration
```

### Orden de Implementación Recomendado

**FASE 1:**
1. `src/context/StyleContext.tsx` (base del sistema)
2. `src/components/agenda/StyleSwitcher.tsx` (UI selector)
3. Copiar componentes UI faltantes (badge, card)
4. `src/components/agenda/AgendaLibro/index.tsx` (esqueleto)
5. `src/components/agenda/AgendaLibro/PortadaPersonalizada.tsx`
6. `src/components/agenda/AgendaLibro/EjemploEnero.tsx` (811 líneas)
7. Modificar `src/app/(dashboard)/agenda/page.tsx` (agregar botón)
8. Agregar estilos de impresión a `globals.css`

**Testing Fase 1:**
```bash
npm run dev
# Ir a /agenda
# Click en "Ver Agenda Libro"
# Verificar:
# - Modal abre fullscreen
# - StyleSwitcher cambia temas
# - Ejemplo Enero se ve completo
# - Impresión funciona (Ctrl+P)
```

**FASE 2:**
1. `AgendaLibro/MesPageDinamico.tsx` (componente más crítico)
2. Probar con UN mes antes de hacer loop de 12
3. `AgendaLibro/SoulChart.tsx` con datos reales
4. `AgendaLibro/RetornoSolar.tsx` con datos reales
5. Loop de 12 meses
6. Integración EventInterpretationButton

**Testing Fase 2:**
```bash
# Verificar que datos reales aparecen:
# - Nombre correcto en portada
# - Eventos del mes en calendario
# - Posiciones planetarias reales
# - Interpretaciones personalizadas
```

---

## 🧪 TESTING Y VALIDACIÓN

### Checklist Fase 1

```
□ StyleContext funciona sin errores
□ StyleSwitcher cambia entre 4 estilos correctamente
□ Botón "Ver Agenda" visible en sidebar
□ Modal abre y cierra sin errores
□ Ejemplo Enero se renderiza completo (811 líneas)
□ No hay errores en consola
□ Impresión genera libro A5 correcto
□ Responsive (mobile + desktop)
```

### Checklist Fase 2

```
□ Portada muestra nombre real del usuario
□ Fechas reales del año solar (cumpleaños a cumpleaños)
□ Eventos de API aparecen en meses correctos
□ Luna Nueva/Llena con interpretaciones
□ SoulChart con posiciones planetarias reales
□ Retorno Solar con datos del año actual
□ 12 meses generados dinámicamente
□ Eventos distribuidos correctamente en semanas
□ EventInterpretationButton funciona
□ Impresión incluye datos personalizados
```

### Test de Impresión

```javascript
// Verificar en navegador:
// 1. Ctrl + P (o Cmd + P)
// 2. Configurar:
//    - Tamaño: A5 (148mm x 210mm)
//    - Orientación: Vertical
//    - Márgenes: Ninguno
// 3. Vista previa debe mostrar:
//    - Cada sección en página separada
//    - Sin controles de UI (botones, etc.)
//    - Colores según estilo seleccionado
```

---

## 🚨 TROUBLESHOOTING

### Problema: "useStyle is not a function"

**Causa:** StyleContext no está envolviendo el componente
**Solución:**
```typescript
// En agenda/page.tsx, envolver AgendaLibro con StyleProvider
{showAgendaLibro && (
  <StyleProvider>  {/* <-- CRITICAL */}
    <AgendaLibro {...} />
  </StyleProvider>
)}
```

---

### Problema: "Module not found: @/contexts/StyleContext"

**Causa:** Import path incorrecto (código origen usa `@/contexts`, nuestro proyecto `@/context`)
**Solución:**
```typescript
// ❌ Incorrecto (del código origen)
import { useStyle } from '@/contexts/StyleContext';

// ✅ Correcto (Next.js)
import { useStyle } from '@/context/StyleContext';
```

---

### Problema: Estilos no se aplican / colores incorrectos

**Causa:** Clases Tailwind no generadas
**Solución:**
```typescript
// Verificar que tailwind.config incluye las rutas:
content: [
  './src/components/**/*.{js,ts,jsx,tsx}',
  './src/app/**/*.{js,ts,jsx,tsx}',
  './src/context/**/*.{js,ts,jsx,tsx}', // <-- Agregar si falta
]

// Limpiar cache y rebuild:
rm -rf .next
npm run dev
```

---

### Problema: Impresión no funciona / páginas cortadas

**Causa:** CSS @page no cargado
**Solución:**
```css
/* Verificar en src/app/globals.css */
@media print {
  @page {
    size: A5;
    margin: 0;
  }

  .print-page {
    page-break-after: always;
    width: 148mm;
    height: 210mm;
  }
}
```

---

### Problema: Componentes shadcn no se ven

**Causa:** Componentes UI faltantes
**Solución:**
```bash
# Opción 1: Copiar de libroagendapropuesta
cp src/app/(dashboard)/agenda/libroagendapropuesta/src/components/ui/badge.tsx \
   src/components/ui/Badge.tsx

# Opción 2: Instalar con shadcn CLI
npx shadcn-ui@latest add badge card separator
```

---

### Problema: "Cannot read property 'name' of undefined"

**Causa:** UserProfile aún no cargado
**Solución:**
```typescript
// Agregar verificaciones:
{showAgendaLibro && userProfile && (
  <StyleProvider>
    <AgendaLibro
      userName={userProfile.name || 'Usuario'}  {/* Fallback */}
      {...}
    />
  </StyleProvider>
)}
```

---

### Problema: Eventos no aparecen en calendario del libro

**Causa:** Eventos no se pasan correctamente o filtrado incorrecto
**Debug:**
```typescript
// En MesPageDinamico.tsx
console.log('📅 Eventos recibidos:', events.length);
console.log('📅 Eventos del mes:', monthEvents.length);
console.log('📅 Primer evento:', monthEvents[0]);

// Verificar fechas:
monthEvents.forEach(e => {
  console.log(e.date, 'isSameMonth?', isSameMonth(new Date(e.date), monthDate));
});
```

---

## 📊 MÉTRICAS DE ÉXITO

### Fase 1 Completada Cuando:
- ✅ Usuario puede hacer click en "Ver Agenda"
- ✅ Modal abre con diseño de libro
- ✅ Ejemplo Enero se ve completo y bien diseñado
- ✅ Puede cambiar entre 4 estilos visuales
- ✅ Impresión genera PDF A5 correcto
- ✅ Cero errores en consola
- ✅ Tiempo de carga < 2 segundos

### Fase 2 Completada Cuando:
- ✅ Portada tiene nombre real del usuario
- ✅ 12 meses generados con eventos reales
- ✅ Cada mes muestra eventos correctos
- ✅ SoulChart con datos de carta natal
- ✅ Retorno Solar con datos del año
- ✅ EventInterpretationButton integrado
- ✅ Impresión personalizada funciona
- ✅ Usuario puede compartir su agenda única

---

## 🔄 ESTRATEGIA DE COMMITS

### Fase 1:
```bash
git commit -m "feat(agenda): Add StyleContext and StyleSwitcher"
git commit -m "feat(agenda): Create AgendaLibro skeleton component"
git commit -m "feat(agenda): Integrate EjemploEnero hardcoded"
git commit -m "feat(agenda): Add Ver Agenda button to sidebar"
git commit -m "style(agenda): Add print CSS for A5 book format"
```

### Fase 2:
```bash
git commit -m "feat(agenda): Create dynamic MesPage component"
git commit -m "feat(agenda): Connect SoulChart to natal API"
git commit -m "feat(agenda): Connect RetornoSolar to progressed API"
git commit -m "feat(agenda): Generate 12 months dynamically"
git commit -m "feat(agenda): Integrate EventInterpretation system"
```

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Relevante
- `CLAUDE.md` - Guía del proyecto
- `PLAN_INTEGRACION_INTERPRETACIONES_AGENDA.md` - Sistema de interpretaciones
- `INTERPRETACIONES_EVENTOS_AGENDA.md` - Formato de eventos

### APIs Relacionadas
- `/api/charts/natal` - Carta natal del usuario
- `/api/charts/progressed` - Solar Return anual
- `/api/astrology/solar-year-events` - Eventos del año completo
- `/api/astrology/planetary-cards` - Fichas planetarias

### Componentes Existentes a Reutilizar
- `EventInterpretationButton.tsx` - Botón de interpretaciones
- `PlanetaryCards.tsx` - Fichas planetarias anuales
- `EventsLoadingModal.tsx` - Loading states

---

## ✅ SIGUIENTE PASO

**PARA DESARROLLADORES:**

1. **Leer esta documentación completa** (20min)
2. **Revisar código origen en** `src/app/(dashboard)/agenda/libroagendapropuesta/` (30min)
3. **Empezar Fase 1, Paso 1.1**: Crear StyleContext
4. **Seguir orden estricto** de pasos documentados arriba
5. **Testear cada paso** antes de continuar al siguiente
6. **Hacer commit** después de cada paso completado

**PREGUNTAS FRECUENTES:**

**Q: ¿Puedo empezar por Fase 2 directamente?**
A: ❌ NO. Fase 1 establece infraestructura crítica. Sin ella, Fase 2 fallará.

**Q: ¿Puedo modificar el diseño del libro?**
A: ⚠️ En Fase 1 NO. Mantén diseño exacto. En Fase 2, después de validar que funciona, sí.

**Q: ¿Qué hago si un componente shadcn falta?**
A: Cópialo de `libroagendapropuesta/src/components/ui/` a `src/components/ui/`

**Q: ¿Cómo debug problemas de estilos?**
A:
1. Verificar que StyleProvider envuelve componente
2. Console.log currentStyle y config
3. Inspeccionar elemento y verificar clases CSS aplicadas

---

## 📞 CONTACTO Y SOPORTE

**Creado por:** Claude (Sesión gr9VI)
**Fecha:** 2026-01-02
**Última actualización:** Fase 1 en progreso

**Para dudas o problemas:**
1. Revisar sección Troubleshooting arriba
2. Verificar consola del navegador (errores React)
3. Revisar Network tab (errores de API)
4. Documentar problema con screenshots

---

**🚀 ¡ÉXITO EN LA MIGRACIÓN!**

Recuerda: **Fase 1 primero = bases sólidas. Fase 2 después = personalización incremental.**
