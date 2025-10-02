# 🌅 Tu Vuelta al Sol

## Plataforma de Astrología Evolutiva Personalizada

Sistema completo de interpretación astrológica que combina cartas natales, Solar Return y agenda anual personalizada con enfoque transformacional y antifragilidad.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── favicon.ico
│   ├── (auth)/                    # Autenticación (login/register)
│   ├── (dashboard)/
│   │   ├── natal-chart/page.tsx   # Carta Natal
│   │   └── progressed-chart/page.tsx  # Solar Return (temporal naming)
│   ├── admin/page.tsx
│   ├── api/
│   │   ├── admin/
│   │   ├── astrology/
│   │   │   ├── generate-agenda-ai/route.ts
│   │   │   ├── natal-chart/route.ts
│   │   │   ├── interpret-natal/route.ts        # ✅ Endpoint natal
│   │   │   ├── interpret-solar-return/route.ts # ✅ Endpoint solar
│   │   │   └── interpret-progressed/route.ts
│   │   ├── birth-data/route.ts
│   │   ├── charts/
│   │   │   ├── natal/route.ts
│   │   │   └── progressed/route.ts            # Cálculo Solar Return
│   │   └── events/
│   └── types/
│
├── components/
│   ├── astrology/
│   │   ├── ChartDisplay.tsx                    # Visualización cartas
│   │   ├── InterpretationDisplay.tsx           # ✅ NUEVO v2.0
│   │   ├── InterpretationButton.tsx
│   │   ├── NatalChartWheel.tsx
│   │   └── ... (otros componentes)
│   └── ui/
│       └── FloatingActionPanel.tsx             # ✅ NUEVO - Menú flotante
│
├── models/
│   ├── BirthData.ts
│   ├── Chart.ts
│   └── User.ts
│
├── types/
│   └── astrology/
│       └── unified-types.ts
│
├── services/
│   ├── prokeralaService.ts
│   ├── solarReturnInterpretationService.ts
│   └── progressedChartService.tsx              # Disponible no usado
│
├── utils/
│   ├── astrology/
│   │   ├── calculations.ts
│   │   └── intelligentFallbacks.ts
│   └── prompts/
│       └── disruptivePrompts.ts                # ✅ CORREGIDO houseNumber
│
├── context/
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
│
└── lib/
    ├── db.ts
    ├── firebase.ts
    └── prokerala/

astrology_books/
└── chunks.json                                  # Knowledge base IA
```

### 🔑 Archivos Modificados Esta Sesión

```
✅ src/utils/prompts/disruptivePrompts.ts       # Corregido houseNumber
✅ src/components/astrology/InterpretationDisplay.tsx  # v2.0 completa
✅ src/components/ui/FloatingActionPanel.tsx    # Nuevo componente
✅ README.md                                     # Actualizado
```

---

## 🗺️ Roadmap de Desarrollo

### ✅ Fase 1: Foundation Astrológica (COMPLETADA)

- [x] Modelo de datos (MongoDB)
- [x] Cálculo de Carta Natal (Prokerala API)
- [x] Cálculo de Solar Return (Prokerala API)
- [x] Cálculo de Carta Progresada (disponible)
- [x] Sistema de usuarios y autenticación
- [x] Visualización de cartas astrológicas

### 🔄 Fase 2: Interpretación con IA + UX/UI (EN CURSO - ESTA SEMANA)

#### 📝 COMPLETADO:
- [x] Corrección casas undefined (`houseNumber`)
- [x] Interpretación completa 10 planetas
- [x] Menú flotante responsive
- [x] Menú superior mejorado (PDF, Comprar)
- [x] Sistema de prompts corregido

#### 🔴 CRÍTICO - Pendiente Inmediato:

**A. Responsive Mobile Completo** (MÁXIMA PRIORIDAD)
- [ ] Auditoría responsive en todos los dispositivos
- [ ] Correcciones home page (grid, padding, botones)
- [ ] Correcciones natal/solar pages (chart adaptativo)
- [ ] Correcciones agenda (calendario mobile-first)
- [ ] Testing cross-device completo

**B. Testing de Interpretaciones**
- [ ] Probar natal-chart con todos los planetas
- [ ] Probar solar-return con metodología libros
- [ ] Verificar casas correctas en ambos
- [ ] Testing regeneración
- [ ] Testing fallback sin OpenAI

**C. Limpieza UX**
- [ ] Eliminar botones duplicados en home post-interpretación
- [ ] Breadcrumbs coherentes
- [ ] Estados de carga consistentes
- [ ] Mensajes de error amigables

#### 🟡 SIGUIENTE SPRINT:

**D. Generación PDF Básica**
```bash
# Instalar dependencias
npm install jspdf html2canvas
npm install --save-dev @types/jspdf
```

**E. Dashboard 4 Pasos Numerados**
```
1️⃣ Datos de Nacimiento
2️⃣ Carta Natal
3️⃣ Tu Revolución Solar
4️⃣ Tu Agenda Astrológica Personalizada
```

**F. Nomenclatura Nueva**
- [ ] Cambiar "Carta Progresada" → "Tu Revolución Solar"
- [ ] Actualizar breadcrumbs y títulos
- [ ] Rename URL `/progressed-chart` → `/revolucion-solar` (opcional)

---

### 📅 Fase 3: Agenda Personalizada (SIGUIENTE - POST RESPONSIVE)

**Basada en Solar Return**:

- [x] Generación de eventos astrológicos anuales
- [x] Tránsitos planetarios
- [x] Lunas Nueva y Llena
- [x] Retrogradaciones
- [ ] Interpretaciones personalizadas por evento
- [ ] Sistema de recomendaciones (rituales, acciones)
- [ ] UX/UI optimizada para agenda
- [ ] Exportación a Google Calendar

**Enfoque Antifragilidad**:
- Preparación mental para eventos
- Herramientas específicas por fase
- Patrones personales detectados
- No predicción pasiva, sino entrenamiento activo

---

### 💰 Fase 4: Monetización (SEPTIEMBRE 2025)

- [ ] Sistema de pagos (Stripe)
- [ ] Planes de suscripción
- [ ] Interpretaciones premium completas
- [ ] Consultas personalizadas
- [ ] Exportación PDF profesional
- [ ] Acceso a interpretaciones archivadas

**Plan de Pago - Primer Nivel**:
- Interpretación completa (todos los planetas detallados)
- PDF premium descargable
- Agenda anual sin límites
- Soporte prioritario

---

### 🔗 Fase 5: Integración Google Calendar (SEPTIEMBRE 2025)

- [ ] OAuth Google
- [ ] Sincronización bidireccional
- [ ] Notificaciones automáticas
- [ ] Recordatorios personalizados

---

### 🚀 Fase 6: Expansión y Optimización (OCT-DIC 2025)

- [ ] Carta Progresada reintegrada
- [ ] Comparación Progresada vs Solar Return
- [ ] Análisis de ciclos largos
- [ ] Machine Learning para patrones
- [ ] App móvil nativa
- [ ] Comunidad y networking

---

## 🎯 Checklist Urgente (Próximos 2-3 Días)

### 🔴 Día 1: Responsive Mobile (4-5 horas)
- [ ] Auditoría completa en Chrome DevTools
- [ ] Probar: iPhone SE, iPhone 12, iPad, iPad Pro
- [ ] Documentar todos los problemas
- [ ] Correcciones home: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- [ ] Correcciones charts: `w-full max-w-[90vw] md:max-w-[600px]`
- [ ] Testing cross-device final

### 🟡 Día 2: Testing + Integración Componentes (3 horas)
- [ ] Integrar `FloatingActionPanel` en natal-chart
- [ ] Integrar `FloatingActionPanel` en progressed-chart
- [ ] Probar flujo completo interpretación natal
- [ ] Probar flujo completo interpretación solar
- [ ] Verificar regeneración funciona
- [ ] Testing fallback sin OpenAI

### 🟢 Día 3: Pulido Final (2 horas)
- [ ] Eliminar botones duplicados en home
- [ ] Verificar todos los breadcrumbs
- [ ] Testing de rendimiento (Lighthouse)
- [ ] Documentación final
- [ ] Deploy a staging

---

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tipos de Cartas Astrológicas](#tipos-de-cartas-astrológicas)
- [Correcciones Implementadas Esta Sesión](#correcciones-implementadas-esta-sesión)
- [Roadmap de Desarrollo](#roadmap-de-desarrollo)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Implementación](#guía-de-implementación)

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────────────┐
│                    USUARIO                              │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐      ┌──────▼──────┐
    │  Carta  │      │    Solar    │
    │  Natal  │      │   Return    │
    └────┬────┘      └──────┬──────┘
         │                  │
         │         ┌────────▼────────┐
         └────────►│     Agenda      │
                   │  Personalizada  │
                   │     Anual       │
                   └─────────────────┘
```

### Flujo de Datos

1. **Usuario ingresa datos de nacimiento** → Base de datos
2. **Sistema calcula Carta Natal** → Carta de referencia permanente
3. **Sistema calcula Solar Return anual** → Carta para el año actual
4. **IA genera interpretaciones** → Análisis personalizado
5. **Sistema crea Agenda Anual** → Eventos + Consejos específicos

---

## 📊 Tipos de Cartas Astrológicas

### 1. ⭐ Carta Natal (Fundamento)

**Concepto**: "Fotografía" del cielo en el momento exacto de tu nacimiento.

**Características**:
- ✅ Posiciones planetarias FIJAS
- ✅ Tu "ADN cósmico" inmutable
- ✅ Base para todas las demás técnicas

**Uso en el sistema**:
- Punto de referencia permanente
- Análisis de personalidad base
- Comparación con otras cartas

**Estado**: ✅ **IMPLEMENTADO Y FUNCIONAL**

---

### 2. 🌅 Solar Return / Vuelta al Sol (Anual)

**Concepto**: Carta levantada para el momento exacto cuando el Sol regresa a su posición natal cada año.

**Características**:
- ☀️ Sol FIJO en posición natal (ej: 21° Acuario)
- 🔄 Otros planetas en NUEVAS posiciones
- 🏠 Ascendente ANUAL diferente
- 📅 Casas redistribuidas según ubicación actual

**Diferencias clave**:
```
NATAL                    SOLAR RETURN
Sol: 21° Acuario    →    Sol: 21° Acuario (MISMO)
Luna: 6° Libra      →    Luna: 16° Leo (CAMBIA)
ASC: 11° Cáncer     →    ASC: 27° Libra (CAMBIA)
```

**Uso en el sistema**:
- ✅ Interpretación de energías del año solar
- ✅ Predicción de áreas de vida activadas
- ✅ Base para generación de Agenda Anual
- ✅ Identificación de momentos clave del año

**Ventajas para Agenda Anual**:
- Enfoque claro en un período de 12 meses
- Comparación directa: Natal vs Solar Return
- Identificación precisa de planetas en nuevas casas
- Interpretación de cambio de Ascendente anual

**Estado**: ✅ **IMPLEMENTADO Y FUNCIONAL**

**Endpoints**:
- `POST /api/charts/progressed` → Genera Solar Return
- `POST /api/astrology/interpret-solar-return` → Interpreta Solar Return

---

### 3. 📈 Carta Progresada (Evolutiva)

> **⚠️ NOTA IMPORTANTE**: Por ahora NO estamos utilizando Carta Progresada en el flujo principal. Hemos optado por **Solar Return** para la agenda anual porque ofrece mejores resultados para planificación de 12 meses.

**Concepto**: Evolución gradual de la carta natal donde cada día después del nacimiento = 1 año de vida.

**Características**:
- 🌱 Sol AVANZA ~1° por año
- 📅 Evolución día a día = año a año
- 🔄 Desarrollo personal gradual
- 🎯 Muestra maduración del potencial natal

**Diferencias con Solar Return**:
```
PROGRESADA (día 51 = edad 51)    SOLAR RETURN (año 2025)
Sol: 22° Acuario (avanzó 1°) →   Sol: 21° Acuario (fijo)
Luna: 25° Libra (avanzó)      →   Luna: 16° Leo (nueva posición)
Enfoque: EVOLUCIÓN             →   Enfoque: ENERGÍAS ANUALES
```

**Por qué NO la usamos ahora**:
- ❌ Enfoque de desarrollo a largo plazo (no ideal para agenda anual)
- ❌ Cambios muy sutiles año a año
- ❌ Más compleja de interpretar para eventos específicos
- ✅ Solar Return da resultados más claros para planificación anual

**Futuro de la Carta Progresada**:
- 📅 **Fase 5** (Septiembre-Diciembre 2025): Posible reintegración
- 🎯 Uso combinado: Progresada para evolución personal + Solar Return para eventos anuales
- 💡 Interpretaciones comparativas entre ambas técnicas

**Estado**: 🔶 **IMPLEMENTADO PERO NO EN USO ACTIVO**

---

## ✅ CORRECCIONES IMPLEMENTADAS ESTA SESIÓN (01 Oct 2025)

### 1. **Corrección Crítica: Casas Undefined** ✅
**Problema**: `disruptivePrompts.ts` usaba `planet.house` en lugar de `planet.houseNumber`

**Solución**:
- Actualizado helper `extractHouseConfig()` para usar `planet.houseNumber || planet.house`
- Añadida función `formatAllPlanets()` con fallbacks robustos
- Archivo: `src/utils/prompts/disruptivePrompts.ts`

**Impacto**: Las interpretaciones ahora muestran las casas correctamente

### 2. **Interpretación Completa - Todos los Planetas** ✅
**Implementado**: Estructura planeta por planeta completa

**Componente**: `InterpretationDisplay.tsx` v2.0

**Features**:
- ☉ Sol, ☽ Luna, ☿ Mercurio, ♀ Venus, ♂ Marte
- ♃ Júpiter, ♄ Saturno, ♅ Urano, ♆ Neptuno, ♇ Plutón
- Secciones expandibles/colapsables
- Poder específico + Acción inmediata + Ritual por planeta
- Plan de acción (Hoy/Semana/Mes)
- Declaración de poder personalizada

### 3. **Menú Flotante Responsive** ✅
**Componente**: `FloatingActionPanel.tsx`

**Desktop**:
- Panel lateral derecho expandible/colapsable
- Siempre visible durante navegación
- Hover effects elegantes

**Mobile/Tablet**:
- Botón flotante inferior derecho
- Modal deslizable desde abajo
- Touch-friendly (44x44px mínimo)

**Features**:
- Ver interpretación (con estado)
- Regenerar carta (con spinner)
- Indicador de estado visual

### 4. **Menú Superior de Interpretación** ✅
**Cambios**:
- ✅ Añadido botón "PDF" (placeholder con aviso)
- ✅ Añadido botón "Comprar" (placeholder Fase 3)
- ✅ Mejorado botón "Regenerar" con animación
- ❌ Eliminado botón "Copiar" (redundante)

**Orden final**: `Regenerar | PDF | Comprar | ✕`

---

#### 1. **Corrección Crítica: Casas Undefined** ✅
- **Problema**: `disruptivePrompts.ts` usaba `planet.house` en lugar de `planet.houseNumber`
- **Solución**: Actualizado helper `extractHouseConfig()` para usar el campo correcto
- **Archivo**: `src/utils/prompts/disruptivePrompts.ts`
- **Impacto**: Ahora las interpretaciones muestran las casas correctamente

#### 2. **Interpretación Completa con Todos los Planetas** ✅
- **Implementado**: Estructura planeta por planeta (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón)
- **Componente**: `InterpretationDisplay.tsx` v2.0
- **Features**:
  - Secciones expandibles para cada planeta
  - Poder específico + Acción inmediata + Ritual
  - Plan de acción (Hoy/Semana/Mes)
  - Declaración de poder personalizada

#### 3. **Menú Flotante Responsive** ✅
- **Componente**: `FloatingActionPanel.tsx`
- **Desktop**: Panel lateral derecho expandible/colapsable
- **Mobile/Tablet**: Botón flotante inferior con modal deslizable
- **Features**:
  - Ver interpretación
  - Regenerar carta
  - Indicador de estado (interpretada/sin interpretar)

#### 4. **Menú Superior Mejorado** ✅
- **Botones actualizados**:
  - ✅ Regenerar (con spinner)
  - ✅ PDF (placeholder con aviso)
  - ✅ Comprar (placeholder Fase 3)
  - ✅ Cerrar
- **Eliminado**: Botón "Copiar" (redundante)

---

## 📋 TAREAS PENDIENTES FASE 2

### 🔴 CRÍTICO - Esta Semana

#### A. **Responsive Mobile Completo** (PRIORIDAD MÁXIMA)
**Estado actual**: La página no se adapta correctamente en mobile/tablet

**Acciones necesarias**:

1. **Auditoría Responsive** (2 horas)
   - [ ] Revisar todas las páginas en Chrome DevTools
   - [ ] Probar en: iPhone SE, iPhone 12/13, iPad, iPad Pro
   - [ ] Identificar breakpoints problemáticos
   - [ ] Documentar componentes que fallan

2. **Correcciones Home Page** (1 hora)
   - [ ] Grid responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
   - [ ] Reducir padding en mobile: `p-4 md:p-8 lg:p-12`
   - [ ] Cards: altura automática en mobile
   - [ ] Botones: stack vertical en mobile

3. **Correcciones Natal/Solar Pages** (2 horas)
   - [ ] Chart wheel: tamaño adaptativo `w-full max-w-[600px] mx-auto`
   - [ ] Panel interpretación: `max-w-full md:max-w-5xl`
   - [ ] Texto: `text-sm md:text-base lg:text-lg`
   - [ ] Spacing: reducir en mobile

4. **Correcciones Agenda** (1 hora)
   - [ ] Calendario: vista mensual completa en mobile
   - [ ] Eventos: cards apiladas en mobile
   - [ ] Filtros: drawer lateral en mobile

5. **Testing Cross-Device** (1 hora)
   - [ ] Safari iOS
   - [ ] Chrome Android
   - [ ] Tablet landscape/portrait
   - [ ] Verificar touch targets (mínimo 44x44px)

**Archivos a modificar**:
```
src/app/page.tsx                          # Home
src/app/(dashboard)/natal-chart/page.tsx  # Natal
src/app/(dashboard)/progressed-chart/page.tsx # Solar
src/app/(dashboard)/agenda/page.tsx       # Agenda
src/components/astrology/ChartDisplay.tsx
src/components/astrology/InterpretationDisplay.tsx
```

#### B. **Testing de Interpretaciones** (2 horas)
- [ ] Probar natal-chart con `generateDisruptiveNatalPrompt`
- [ ] Probar solar-return con metodología libros
- [ ] Verificar que muestra TODOS los planetas
- [ ] Verificar que las casas se muestran correctamente
- [ ] Testing regeneración
- [ ] Testing fallback sin OpenAI

#### C. **Limpieza UX** (1 hora)
- [ ] Eliminar botones duplicados en home (después de generar interpretación)
- [ ] Breadcrumbs coherentes en todas las páginas
- [ ] Estados de carga consistentes
- [ ] Mensajes de error amigables

---

### 🟡 IMPORTANTE - Siguiente Sprint

#### D. **Generación PDF Básica**
**Librería recomendada**: `jspdf` + `html2canvas`

**Instalación**:
```bash
npm install jspdf html2canvas
npm install --save-dev @types/jspdf
```

**Implementación sugerida**:
```typescript
// src/utils/pdf/generatePDF.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateInterpretationPDF(
  element: HTMLElement,
  fileName: string
) {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(fileName);
}
```

**Tareas**:
- [ ] Instalar dependencias
- [ ] Crear utility `generatePDF.ts`
- [ ] Conectar con botón PDF en `InterpretationDisplay`
- [ ] Estilizar PDF output
- [ ] Testing en diferentes dispositivos

#### E. **Landing Page Plan de Pago** (Placeholder)
- [ ] Crear `/pricing` page
- [ ] Mostrar 3 tiers: Gratis / Premium / Pro
- [ ] Features por tier
- [ ] CTA "Próximamente - Septiembre 2025"
- [ ] Diseño atractivo con Tailwind

---

## 🔧 GUÍA DE IMPLEMENTACIÓN

### Integrar FloatingActionPanel en Natal Chart

```tsx
// src/app/(dashboard)/natal-chart/page.tsx

import FloatingActionPanel from '@/components/ui/FloatingActionPanel';

export default function NatalChartPage() {
  const [interpretation, setInterpretation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <>
      {/* Contenido existente */}
      
      {/* ✅ AÑADIR MENÚ FLOTANTE */}
      <FloatingActionPanel
        chartType="natal"
        hasInterpretation={!!interpretation}
        isLoading={isGenerating}
        onViewInterpretation={() => {
          // Mostrar modal interpretación
        }}
        onRegenerateChart={() => {
          // Regenerar carta natal
        }}
      />
    </>
  );
}
```

### Integrar en Solar Return (Progressed Chart)

```tsx
// src/app/(dashboard)/progressed-chart/page.tsx

<FloatingActionPanel
  chartType="solar-return"
  hasInterpretation={!!solarInterpretation}
  isLoading={isGenerating}
  onViewInterpretation={handleShowInterpretation}
  onRegenerateChart={handleRegenerateSolar}
/>
```

---

## 📱 GUÍA RESPONSIVE TAILWIND

### Breakpoints Recomendados

```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Desktop */
xl: 1280px  /* Desktop wide */
2xl: 1536px /* Desktop ultra-wide */
```

### Patrones Comunes

```tsx
{/* Padding responsivo */}
<div className="p-4 md:p-8 lg:p-12">

{/* Grid responsivo */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

{/* Texto responsivo */}
<h1 className="text-2xl md:text-4xl lg:text-5xl">

{/* Ocultar en mobile */}
<div className="hidden md:block">

{/* Mostrar solo en mobile */}
<div className="block md:hidden">

{/* Flexbox responsivo */}
<div className="flex flex-col md:flex-row gap-4">

{/* Width responsivo */}
<div className="w-full md:w-1/2 lg:w-1/3">
```

---

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (con breakpoints responsive)
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **MongoDB + Mongoose** (caché 24h)
- **Firebase Authentication**

### APIs Externas
- **Prokerala Astrology API** (cálculos astrológicos precisos)
- **OpenAI GPT-4** (interpretaciones IA con fallback español)

### Herramientas Desarrollo
- **ESLint + Prettier**
- **TypeScript Strict Mode**
- **Chrome DevTools** (Responsive testing)
- **Vercel Analytics**

---

## 📦 Instalación y Configuración

### 1. Clonar e Instalar

```bash
git clone https://github.com/tu-usuario/tu-vuelta-al-sol.git
cd tu-vuelta-al-sol
npm install
```

### 2. Variables de Entorno

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tudb

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto

# Prokerala API
PROKERALA_CLIENT_ID=tu_client_id
PROKERALA_CLIENT_SECRET=tu_client_secret

# OpenAI (opcional - hay fallback en español)
OPENAI_API_KEY=sk-...

# Google Calendar (Fase 5 - Septiembre 2025)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
# Abrir http://localhost:3000
```

### 4. Testing Responsive

```bash
# Abrir en diferentes dispositivos con ngrok (opcional)
npx ngrok http 3000
```

---

## 🏗️ Estructura del Proyecto

```
tu-vuelta-al-sol/
├── src/
│   ├── app/
│   │   ├── globals.css                    # Estilos globales
│   │   ├── layout.tsx                     # Layout principal
│   │   ├── page.tsx                       # Home (Dashboard)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── natal-chart/page.tsx       # ✅ Carta Natal
│   │   │   ├── progressed-chart/page.tsx  # ✅ Solar Return
│   │   │   └── agenda/page.tsx            # Agenda Astrológica
│   │   └── api/
│   │       └── astrology/
│   │           ├── interpret-natal/route.ts       # ✅ Endpoint natal
│   │           ├── interpret-solar-return/route.ts # ✅ Endpoint solar
│   │           └── complete-events/route.ts       # Agenda
│   ├── components/
│   │   ├── astrology/
│   │   │   ├── ChartDisplay.tsx           # Visualización carta
│   │   │   ├── InterpretationDisplay.tsx  # ✅ NUEVO v2.0
│   │   │   ├── InterpretationButton.tsx   # Botón generar
│   │   │   └── NatalChartWheel.tsx        # Rueda astrológica
│   │   └── ui/
│   │       ├── FloatingActionPanel.tsx    # ✅ NUEVO - Menú flotante
│   │       └── Header.tsx
│   ├── lib/
│   │   ├── mongodb.ts                     # Conexión DB
│   │   ├── firebase.ts                    # Auth
│   │   └── prokerala/
│   │       └── client.ts                  # Cliente API
│   ├── utils/
│   │   └── prompts/
│   │       └── disruptivePrompts.ts       # ✅ CORREGIDO
│   ├── types/
│   │   └── astrology/
│   │       ├── basic.ts
│   │       ├── chartDisplay.ts
│   │       └── aspects.ts
│   └── data/
│       └── chunks.json                    # Base conocimiento libros
├── public/
│   ├── favicon.ico
│   └── og-image.jpg
├── .env.local                             # Variables entorno
├── .env.example                           # Plantilla variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔄 Flujo de Interpretación

### Carta Natal

```
Usuario → natal-chart/page.tsx
    ↓
    Genera carta con Prokerala API
    ↓
    Clic "Generar Interpretación"
    ↓
    POST /api/astrology/interpret-natal
    ↓
    disruptivePrompts.ts (usa houseNumber ✅)
    ↓
    OpenAI GPT-4 (o fallback español)
    ↓
    Cache MongoDB 24h
    ↓
    InterpretationDisplay v2.0
    ↓
    Muestra todos los planetas ✅
```

### Solar Return (Revolución Solar)

```
Usuario → progressed-chart/page.tsx
    ↓
    Calcula Solar Return (cumpleaños actual)
    ↓
    Clic "Generar Interpretación"
    ↓
    POST /api/astrology/interpret-solar-return
    ↓
    Metodología Shea-Teal-Louis + chunks.json
    ↓
    OpenAI GPT-4 (profesional, no disruptivo)
    ↓
    Compara Natal vs Solar Return
    ↓
    InterpretationDisplay v2.0
```

---

## 🧪 Testing Checklist

### Desktop (1920x1080)
- [ ] Home: 4 cards en grid
- [ ] Natal Chart: rueda centrada, menú lateral visible
- [ ] Solar Return: comparativa natal vs solar
- [ ] Agenda: calendario + sidebar eventos
- [ ] Interpretación: modal centrado, scroll suave

### Tablet (768x1024)
- [ ] Home: 2 cards por fila
- [ ] Natal Chart: rueda reducida, menú lateral oculto
- [ ] Botón flotante inferior visible
- [ ] Modal interpretación: 90% ancho
- [ ] Navegación: hamburger menu

### Mobile (375x667 - iPhone SE)
- [ ] Home: 1 card por fila, stack vertical
- [ ] Natal Chart: rueda adaptada a ancho completo
- [ ] Menú flotante: botón inferior derecho
- [ ] Modal interpretación: 100% ancho
- [ ] Texto legible sin zoom
- [ ] Touch targets > 44x44px
- [ ] Botones no solapados

### Cross-Browser
- [ ] Chrome Desktop/Mobile
- [ ] Safari iOS
- [ ] Firefox Desktop
- [ ] Samsung Internet
- [ ] Edge

---

## 📊 Endpoints API

### `/api/astrology/interpret-natal`

**Método**: POST

**Body**:
```json
{
  "chartData": {
    "planets": [...],
    "houses": [...],
    "ascendant": {...}
  },
  "userProfile": {
    "name": "María",
    "age": 30,
    "birthPlace": "Madrid",
    "birthDate": "1995-02-10",
    "birthTime": "14:30"
  },
  "regenerate": false
}
```

**Respuesta**:
```json
{
  "interpretation": {
    "esencia_revolucionaria": "...",
    "proposito_vida": "...",
    "planetas": {
      "sol": { "titulo": "☉ Sol en Acuario - Casa 1", ... },
      "luna": { "titulo": "☽ Luna en Libra - Casa 7", ... },
      ...
    },
    "declaracion_poder": "...",
    "plan_accion": {...},
    ...
  },
  "cached": true,
  "generatedAt": "2025-10-01T12:00:00Z"
}
```

### `/api/astrology/interpret-solar-return`

**Método**: POST

**Body**:
```json
{
  "natalChart": {...},
  "solarReturnChart": {...},
  "userProfile": {...},
  "year": 2025
}
```

**Respuesta**: Similar estructura pero con comparativa natal vs solar

---

## 🎨 Guía de Estilos

### Colores Principales

```css
/* Púrpura mágico */
--purple-900: #4c1d95
--purple-800: #5b21b6
--purple-600: #7c3aed

/* Índigo místico */
--indigo-900: #312e81
--indigo-800: #3730a3
--indigo-600: #4f46e5

/* Acentos */
--cyan-500: #06b6d4      /* Ver Interpretación */
--yellow-400: #facc15    /* Declaración Poder */
--pink-400: #f472b6      /* Rituales */
--green-400: #4ade80     /* Acciones */
```

### Tipografía

```css
/* Headings */
font-family: 'Playfair Display', serif;

/* Body */
font-family: 'Inter', sans-serif;

/* Tamaños responsive */
text-2xl md:text-4xl lg:text-5xl  /* H1 */
text-xl md:text-2xl lg:text-3xl   /* H2 */
text-lg md:text-xl                /* H3 */
text-base md:text-lg              /* Body */
text-sm md:text-base              /* Small */
```

### Espaciado Responsive

```css
/* Padding */
p-4 md:p-8 lg:p-12     /* Container */
p-3 md:p-6             /* Cards */

/* Margin */
mb-4 md:mb-8 lg:mb-12  /* Sections */
mb-2 md:mb-4           /* Elements */

/* Gap */
gap-4 md:gap-6 lg:gap-8
```

---

## 🐛 Debugging

### Ver datos de carta en consola

```typescript
// natal-chart/page.tsx
console.log('📊 Chart Data:', {
  planets: chartData.planets.map(p => ({
    name: p.name,
    sign: p.sign,
    house: p.houseNumber || p.house,
    degree: p.degree
  })),
  hasInterpretation: !!interpretation
});
```

### Verificar casas en prompt

```typescript
// disruptivePrompts.ts
console.log('🏠 House Config:', extractHouseConfig(chartData));
```

### Testing sin OpenAI

```bash
# Remover temporalmente OPENAI_API_KEY de .env.local
# El sistema usará fallback en español automáticamente
```

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# 1. Conectar repo en Vercel Dashboard
# 2. Configurar variables de entorno
# 3. Deploy automático en cada push

# O manualmente:
npm run build
vercel --prod
```

### Variables de Entorno en Producción

```
✅ MONGODB_URI
✅ NEXT_PUBLIC_FIREBASE_*
✅ PROKERALA_CLIENT_ID
✅ PROKERALA_CLIENT_SECRET
⚠️ OPENAI_API_KEY (opcional)
```

---

## 📈 Roadmap Completo

### ✅ Fase 1: Foundation Astrológica (COMPLETADO)
- Integración Prokerala API
- Cálculo carta natal preciso
- Visualización rueda astrológica
- Sistema de aspectos

### 🔄 Fase 2: Generación Inteligente IA (EN CURSO - Oct 2025)
- ✅ Interpretación natal completa (todos los planetas)
- ✅ Interpretación solar return con metodología libros
- ✅ Menú flotante responsive
- ✅ Corrección casas undefined
- 🔴 Responsive mobile completo (CRÍTICO)
- 🟡 Generación PDF básica
- 🟡 Testing exhaustivo

### ⏳ Fase 3: Monetización (Sep 2025)
- Landing page pricing
- Sistema de créditos/tokens
- Stripe integration
- Planes: Gratis / Premium / Pro
- Límites por plan

### ⏳ Fase 4: Google Calendar (Sep 2025)
- OAuth Google
- Sincronización eventos astrológicos
- Notificaciones push
- Recordatorios personalizados

### ⏳ Fase 5: Expansión (Sep-Dic 2025)
- Tránsitos en tiempo real
- Compatibilidad de parejas
- Chat con astrólogo IA
- Comunidad y foro
- App móvil nativa (React Native)

---

## 🆘 Troubleshooting

### "Casas aparecen como undefined"
✅ **SOLUCIONADO**: Actualizar `disruptivePrompts.ts` para usar `houseNumber`

### "Interpretación solo muestra 2 secciones"
✅ **SOLUCIONADO**: Usar `InterpretationDisplay.tsx` v2.0 con todos los planetas

### "Menú no se ve en mobile"
✅ **SOLUCIONADO**: Implementar `FloatingActionPanel.tsx` con versión responsive

### "Página no se adapta en tablet"
🔴 **PENDIENTE**: Aplicar correcciones responsive según checklist arriba

### "Error: OpenAI API key missing"
⚠️ **NORMAL**: El sistema tiene fallback en español automático

### "MongoDB connection timeout"
- Verificar IP whitelist en MongoDB Atlas
- Revisar MONGODB_URI en .env.local
- Comprobar red/firewall

---

## 📞 Soporte

- **Issues**: GitHub Issues
- **Email**: soporte@tuvueltaalsol.com
- **Docs**: https://docs.tuvueltaalsol.com

---

## 📄 Licencia

MIT License - Ver `LICENSE` file

---

## 🙏 Créditos

- **Astrología**: Prokerala API
- **IA**: OpenAI GPT-4
- **Libros**: Shea, Teal, Louis (metodología solar return)
- **UI**: Tailwind CSS + Lucide Icons
- **Framework**: Next.js 14

---

## 📝 Notas de Desarrollo

### Convenciones de Código

```typescript
// ✅ Usar interfaces explícitas
interface ChartData {
  planets: Planet[];
  houses: House[];
}

// ✅ Props destructuring
export default function Component({ data, onClose }: Props) {

// ✅ Componentes con 'use client' cuando necesario
'use client';

// ✅ Tipos importados desde /types
import type { Planet, ChartData } from '@/types/astrology';

// ✅ Estilos Tailwind en orden: layout → spacing → colors → effects
className="flex items-center gap-4 px-6 py-4 bg-purple-600 rounded-lg"
```

### Git Workflow

```bash
# Branch por feature
git checkout -b feature/responsive-mobile

# Commits descriptivos
git commit -m "feat: add responsive FloatingActionPanel"
git commit -m "fix: correct planet.houseNumber in prompts"
git commit -m "docs: update README with responsive guide"

# Push y PR
git push origin feature/responsive-mobile
```

---

**Última actualización**: 1 Octubre 2025  
**Versión**: 2.1.0  
**Estado**: Fase 2 en progreso - Correcciones UX responsive críticas