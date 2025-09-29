# 🌅 Tu Vuelta al Sol

## Plataforma de Astrología Evolutiva Personalizada

Sistema completo de interpretación astrológica que combina cartas natales, Solar Return y agenda anual personalizada con enfoque transformacional y antifragilidad.

---

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tipos de Cartas Astrológicas](#tipos-de-cartas-astrológicas)
- [Roadmap de Desarrollo](#roadmap-de-desarrollo)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)

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

**Código disponible**:
- Backend: `/api/charts/progressed` (funcional)
- Frontend: `/progressed-chart` (disponible pero no en menú principal)
- Servicios: `progressedChartService.ts` (completo)

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

#### 📝 A. Sistema de Interpretación Solar Return

**Prioridad ALTA - Implementar primero**:

- [ ] **Crear archivo**: `src/utils/prompts/solarReturnPrompts.ts`
  - Prompts específicos Solar Return
  - Fallbacks locales inteligentes
  - Estructura planeta por planeta
  
- [ ] **Crear endpoint**: `src/app/api/astrology/interpret-solar-return/route.ts`
  - API interpretación Solar Return
  - Integración OpenAI
  - Sistema de caché
  
- [ ] **Actualizar**: `src/components/astrology/InterpretationButton.tsx`
  - Agregar soporte `type="solar-return"`
  - Modal específico Solar Return
  - Carga de carta natal automática

#### 🎨 B. Mejoras UX/UI Dashboard

**Dashboard - 4 Pasos Numerados**:

- [ ] Cambiar de 3 bloques a 4 bloques con números de paso:
  ```
  1️⃣ Datos de Nacimiento
  2️⃣ Carta Natal
  3️⃣ Tu Revolución Solar (nuevo nombre)
  4️⃣ Tu Agenda Astrológica Personalizada
  ```

**Nomenclatura Nueva**:
- [ ] Cambiar "Carta Progresada" → "Tu Revolución Solar" en menú superior
- [ ] Actualizar breadcrumbs y títulos de página
- [ ] Rename URL `/progressed-chart` → `/revolucion-solar` (opcional, no crítico)

#### 🎨 C. Sección Flotante Lateral

**En páginas**: Natal Chart y Solar Return

**Ubicación**: Panel flotante a la derecha (siempre visible)

**Contenido** (orden específico):
```
🔮 Interpretar Carta [Natal/Solar]
🔄 Regenerar Carta
```

**Implementación**:
- [ ] Crear componente `FloatingActionPanel.tsx`
- [ ] Integrar en `natal-chart/page.tsx`
- [ ] Integrar en `progressed-chart/page.tsx` (Revolución Solar)
- [ ] Diseño responsive (ocultar en móvil, mostrar en menú)

#### 🎨 D. Menú Superior de Interpretación

**Actualizar componente modal de interpretación**:

**Actual**:
```
Regenerar | Copiar | TXT | ✕
```

**Nuevo** (orden específico):
```
📄 Descargar | 🔄 Regenerar | 💳 Quiero verlo entero | ✕
```

**Cambios específicos**:
- [ ] Eliminar botón "Copiar"
- [ ] Cambiar "TXT" → "Descargar" (genera PDF)
- [ ] Agregar "💳 Quiero verlo entero" → Link a plan de pago
- [ ] Implementar generación PDF básica

#### 📊 E. Estructura Interpretación Mejorada

**Ampliar interpretación actual de**:
```
⭐ Tu Esencia Revolucionaria
🎯 Tu Propósito de Vida
```

**A estructura completa**:
```
⭐ Tu Esencia Revolucionaria
🎯 Tu Propósito de Vida

☉ Sol en [Signo] → Propósito de Vida
   - Posición: [Grado]° [Signo] - Casa [X]
   - Significado detallado

☽ Luna en [Signo] → Tus emociones
   - Posición: [Grado]° [Signo] - Casa [X]
   - Significado detallado

☿ Mercurio en [Signo] → Cómo piensas y hablas
♀ Venus en [Signo] → Cómo amas
♂ Marte en [Signo] → Cómo enfrentas la vida
♃ Júpiter en [Signo] → Tu suerte, tus ganancias
♄ Saturno en [Signo] → Karma, responsabilidades
♅ Urano en [Signo] → Tu revolución personal
♆ Neptuno en [Signo] → Tu conexión espiritual
♇ Plutón en [Signo] → Tu transformación profunda

🏠 Ascendente en [Signo] → Tu personalidad
```

**Implementación**:
- [ ] Actualizar prompts (natal + solar return)
- [ ] Actualizar componente modal interpretación
- [ ] Agregar iconos planetas
- [ ] Diseño visual mejorado con secciones colapsables

#### 🎨 F. Limpieza Home Post-Interpretación

**Problema**: Después de generar interpretación, aparecen botones duplicados en home

**Solución**:
- [ ] Eliminar botones "Regenerar" y "Ver Completo" que aparecen en dashboard después de interpretación
- [ ] Mantener solo los 4 bloques principales del dashboard
- [ ] Los botones de acción solo deben estar DENTRO del modal de interpretación

---

### 📅 Fase 3: Agenda Personalizada (SIGUIENTE - POST UX/UI)

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

## 🎯 Checklist Inmediato (Esta Semana)

### Día 1-2: Backend Solar Return
- [ ] Crear `solarReturnPrompts.ts` con estructura completa planeta por planeta
- [ ] Crear endpoint `interpret-solar-return/route.ts`
- [ ] Testing básico de interpretación

### Día 2-3: UX/UI Core
- [ ] Dashboard 4 bloques numerados
- [ ] Cambiar "Carta Progresada" → "Tu Revolución Solar" en menú
- [ ] Actualizar títulos y breadcrumbs

### Día 3-4: Interpretación Mejorada
- [ ] Modal con estructura planeta por planeta
- [ ] Menú superior nuevo: Descargar | Regenerar | Ver Completo | ✕
- [ ] Eliminar botones duplicados en home

### Día 4-5: Panel Flotante + Testing
- [ ] Componente `FloatingActionPanel.tsx`
- [ ] Integración en Natal Chart
- [ ] Integración en Solar Return
- [ ] Testing completo del flujo

### Opcional (si da tiempo):
- [ ] Generación PDF básica
- [ ] Landing page plan de pago
- [ ] Responsive mobile optimizations

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **MongoDB + Mongoose**
- **Firebase Authentication**

### APIs Externas
- **Prokerala Astrology API** (cálculos astrológicos)
- **OpenAI GPT-4** (interpretaciones IA)
- **Google Calendar API** (futura integración)

### Deployment
- **Vercel** (hosting y CI/CD)
- **MongoDB Atlas** (base de datos)

---

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/tu-vuelta-al-sol.git
cd tu-vuelta-al-sol

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

---

## ⚙️ Configuración

### Variables de Entorno Requeridas

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Prokerala API
PROKERALA_CLIENT_ID=...
PROKERALA_CLIENT_SECRET=...

# OpenAI (opcional - fallbacks disponibles)
OPENAI_API_KEY=sk-...

# Google Calendar (Fase 5)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

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
│   │   │   ├── generate-agenda-ai/route.ts  # Generación agenda IA
│   │   │   ├── natal-chart/route.ts
│   │   │   └── interpret-progressed/route.ts
│   │   ├── birth-data/route.ts
│   │   ├── cache/
│   │   ├── charts/
│   │   │   ├── natal/route.ts             # Cálculo carta natal
│   │   │   └── progressed/route.ts        # Cálculo Solar Return ✅
│   │   ├── debug/
│   │   ├── events/
│   │   ├── geocode/
│   │   ├── interpretations/
│   │   ├── pdf/
│   │   ├── prokerala/
│   │   ├── reverse-geocode/
│   │   ├── test-mongodb/
│   │   └── users/
│   ├── clear-chart-cache/
│   ├── debug/
│   ├── postman-test/
│   ├── test-agenda-ai/
│   ├── test-api/
│   ├── test-chart-display/
│   ├── test-mongodb/
│   ├── test-natal-chart/
│   ├── test-progressed/
│   ├── test-timezone/
│   ├── types/
│   └── cspell.config.js
│
├── components/
│   ├── admin/
│   │   ├── BirthDataAdminTable.tsx
│   │   └── DeleteUserForm.tsx
│   ├── astrology/
│   │   ├── AgendaAIDisplay.tsx
│   │   ├── AgendaLoadingStates.tsx
│   │   ├── AscendantCard.tsx
│   │   ├── AspectControlPanel.tsx
│   │   ├── AspectLines.tsx
│   │   ├── AstrologicalAgenda.tsx
│   │   ├── AstrologicalAgendaGenerator.tsx
│   │   ├── AstrologicalCalendar.tsx
│   │   ├── BirthDataCard.tsx
│   │   ├── BirthDataForm.tsx
│   │   ├── ChartComparisonComponent.tsx
│   │   ├── ChartDisplay.tsx              # Visualización cartas ✅
│   │   ├── ChartTooltips.tsx
│   │   ├── ChartWheel.tsx
│   │   ├── CombinedAscendantMCCard.tsx
│   │   ├── CosmicFootprint.tsx
│   │   ├── ElementsModalitiesCard.tsx
│   │   ├── HouseGrid.tsx
│   │   ├── InterpretationButton.tsx      # Botón interpretación ✅
│   │   ├── MidheavenCard.tsx
│   │   ├── NatalChartWheel.tsx
│   │   ├── PlanetSymbol.tsx
│   │   ├── ProgressedChartVisual.tsx
│   │   ├── ProgressedInterpretationDisplay.tsx
│   │   ├── SectionMenu.tsx
│   │   └── tooltips/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/
│   │   └── BirthDataForm.tsx
│   ├── debug/
│   │   └── ForceRegenerateChart.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── PrimaryHeader.tsx
│   ├── test/
│   │   ├── AgendaAITest.tsx
│   │   ├── GenerateAgendaAITest.tsx
│   │   ├── MongoDBTest.tsx
│   │   ├── NatalChartTest.tsx
│   │   ├── OpenAITest.tsx
│   │   ├── PostmanTest.tsx
│   │   ├── ProkeralaNatalTest.tsx
│   │   ├── SimpleTimezonetest.tsx
│   │   └── TimezoneTestComponent.tsx
│   └── ui/
│       ├── Alert.tsx
│       ├── Button.tsx
│       └── Input.tsx
│
├── models/
│   ├── AIUsage.ts
│   ├── BirthData.ts               # Modelo datos nacimiento
│   ├── Chart.ts                   # Modelo cartas (Natal/Solar Return)
│   └── User.ts                    # Modelo usuario
│
├── types/
│   ├── astrology/
│   │   └── unified-types.ts       # Tipos TypeScript
│   └── astrology.ts
│
├── services/
│   ├── astrologicalEventsService.ts
│   ├── astrologyService.ts
│   ├── batchInterpretations.ts
│   ├── cacheService.ts
│   ├── chartCalculationsService.ts
│   ├── chartInterpretationsService.ts
│   ├── chartRenderingService.tsx
│   ├── educationalInterpretationService.ts
│   ├── prokeralaService.ts
│   ├── solarReturnInterpretationService.ts  # Solar Return ✅
│   ├── trainedAssistantService.ts
│   ├── userDataService.ts
│   └── progressedChartService.tsx  # 🔶 Disponible pero no en uso
│
├── utils/
│   ├── agendaCalculator.ts
│   ├── dateTimeUtils.ts
│   ├── astrology/
│   │   ├── calculations.ts        # Cálculos astrológicos
│   │   └── intelligentFallbacks.ts # Fallbacks locales
│   └── prompts/
│       ├── disruptivePrompts.ts   # Prompts natales
│       └── solarReturnPrompts.ts  # Prompts Solar Return (NEW) 📝
│
├── context/
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
│
├── hooks/
│   ├── useAspects.ts
│   ├── useChart.ts
│   ├── useChartDisplay.ts
│   ├── usePlanets.ts
│   ├── useProkeralaApi.ts
│   ├── astrology/
│   └── lib/
│
└── lib/
    ├── db.ts                      # MongoDB connection
    ├── firebase.ts
    ├── firebaseAdmin.ts
    ├── firebase-client.ts
    ├── utils.ts
    ├── firebase/
    └── prokerala/

public/
├── file.svg
├── globe.svg
├── next.svg
├── site.webmanifest
├── vercel.svg
└── window.svg

scripts/
├── diagnose-mongodb.js
├── fix-quotes.sh
├── insert-test-user-birthdata.js
├── parse_and_chunk_pdfs.js
└── professional-quote-fix.sh

astrology_books/
└── chunks.json                    # Knowledge base para IA

📋 Key Files:
├── README.md                      # Documentación del proyecto
├── TODO.md                        # Lista de tareas
├── PLAN_ACCION_INTERPRETACION.md # Plan de interpretación
└── Prokerala_Carta_Natal.postman_collection.json # Testing API
```

### 🔑 Archivos Críticos para Solar Return

**Pendientes de crear** (según artifacts generados):
```
📝 src/utils/prompts/solarReturnPrompts.ts      # Prompts específicos
📝 src/app/api/astrology/interpret-solar-return/route.ts  # API endpoint
```

**Archivos a modificar**:
```
🔧 src/components/astrology/InterpretationButton.tsx  # Agregar soporte solar-return
🔧 src/app/(dashboard)/progressed-chart/page.tsx      # Cambiar de progressed a solar-return
```

### 📊 Estado de Implementación

| Componente | Estado | Prioridad |
|-----------|--------|-----------|
| Cálculo Solar Return | ✅ Funcional | Completado |
| Prompts Solar Return | 📝 Pendiente | Alta |
| API Interpretación | 📝 Pendiente | Alta |
| InterpretationButton | 🔧 Modificar | Alta |
| Página Solar Return | 🔧 Modificar | Media |
| Integración Agenda | ⏳ Siguiente fase | Media |

---

## 🎯 Decisiones de Arquitectura

### ¿Por qué Solar Return en lugar de Carta Progresada?

**Para Agenda Anual**:

1. **Claridad temporal**: Solar Return = exactamente 12 meses
2. **Comparación directa**: Fácil ver qué cambió vs carta natal
3. **Interpretación precisa**: Planetas en nuevas casas = áreas de vida activadas
4. **Experiencia usuario**: Más intuitivo entender "tu año solar"

**Carta Progresada** sigue siendo valiosa para:
- Desarrollo personal a largo plazo
- Evolución de la identidad
- Ciclos de maduración
- Análisis de vida completa

**Solución**: Usar ambas en fases futuras, cada una para su propósito específico.

---

## 📞 Contacto y Soporte

- **Email**: wunjocreations@gmail.com
- **Instagram**: @wunjocreations
- **Website**: [tu-vuelta-al-sol.com](#)

---

## 📄 Licencia

© 2025 Wunjo Creations. Todos los derechos reservados.

---

## 🙏 Agradecimientos

- Prokerala por la API de cálculos astrológicos
- OpenAI por las capacidades de interpretación
- Comunidad astrológica evolutiva

---

**Última actualización**: 29 de septiembre de 2025  
**Versión**: 2.0 (Solar Return Integration)  
**Estado**: 🚀 Desarrollo Activo - Agenda Anual con Solar Return# 🌅 Tu Vuelta al Sol

## Plataforma de Astrología Evolutiva Personalizada

Sistema completo de interpretación astrológica que combina cartas natales, Solar Return y agenda anual personalizada con enfoque transformacional y antifragilidad.

---

## 📋 Tabla de Contenidos

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tipos de Cartas Astrológicas](#tipos-de-cartas-astrológicas)
- [Roadmap de Desarrollo](#roadmap-de-desarrollo)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)

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

**Código disponible**:
- Backend: `/api/charts/progressed` (funcional)
- Frontend: `/progressed-chart` (disponible pero no en menú principal)
- Servicios: `progressedChartService.ts` (completo)

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

#### 📝 A. Sistema de Interpretación Solar Return

**Prioridad ALTA - Implementar primero**:

- [ ] **Crear archivo**: `src/utils/prompts/solarReturnPrompts.ts`
  - Prompts específicos Solar Return
  - Fallbacks locales inteligentes
  - Estructura planeta por planeta
  
- [ ] **Crear endpoint**: `src/app/api/astrology/interpret-solar-return/route.ts`
  - API interpretación Solar Return
  - Integración OpenAI
  - Sistema de caché
  
- [ ] **Actualizar**: `src/components/astrology/InterpretationButton.tsx`
  - Agregar soporte `type="solar-return"`
  - Modal específico Solar Return
  - Carga de carta natal automática

#### 🎨 B. Mejoras UX/UI Dashboard

**Dashboard - 4 Pasos Numerados**:

- [ ] Cambiar de 3 bloques a 4 bloques con números de paso:
  ```
  1️⃣ Datos de Nacimiento
  2️⃣ Carta Natal
  3️⃣ Tu Revolución Solar (nuevo nombre)
  4️⃣ Tu Agenda Astrológica Personalizada
  ```

**Nomenclatura Nueva**:
- [ ] Cambiar "Carta Progresada" → "Tu Revolución Solar" en menú superior
- [ ] Actualizar breadcrumbs y títulos de página
- [ ] Rename URL `/progressed-chart` → `/revolucion-solar` (opcional, no crítico)

#### 🎨 C. Sección Flotante Lateral

**En páginas**: Natal Chart y Solar Return

**Ubicación**: Panel flotante a la derecha (siempre visible)

**Contenido** (orden específico):
```
🔮 Interpretar Carta [Natal/Solar]
🔄 Regenerar Carta
```

**Implementación**:
- [ ] Crear componente `FloatingActionPanel.tsx`
- [ ] Integrar en `natal-chart/page.tsx`
- [ ] Integrar en `progressed-chart/page.tsx` (Revolución Solar)
- [ ] Diseño responsive (ocultar en móvil, mostrar en menú)

#### 🎨 D. Menú Superior de Interpretación

**Actualizar componente modal de interpretación**:

**Actual**:
```
Regenerar | Copiar | TXT | ✕
```

**Nuevo** (orden específico):
```
📄 Descargar | 🔄 Regenerar | 💳 Quiero verlo entero | ✕
```

**Cambios específicos**:
- [ ] Eliminar botón "Copiar"
- [ ] Cambiar "TXT" → "Descargar" (genera PDF)
- [ ] Agregar "💳 Quiero verlo entero" → Link a plan de pago
- [ ] Implementar generación PDF básica

#### 📊 E. Estructura Interpretación Mejorada

**Ampliar interpretación actual de**:
```
⭐ Tu Esencia Revolucionaria
🎯 Tu Propósito de Vida
```

**A estructura completa**:
```
⭐ Tu Esencia Revolucionaria
🎯 Tu Propósito de Vida

☉ Sol en [Signo] → Propósito de Vida
   - Posición: [Grado]° [Signo] - Casa [X]
   - Significado detallado

☽ Luna en [Signo] → Tus emociones
   - Posición: [Grado]° [Signo] - Casa [X]
   - Significado detallado

☿ Mercurio en [Signo] → Cómo piensas y hablas
♀ Venus en [Signo] → Cómo amas
♂ Marte en [Signo] → Cómo enfrentas la vida
♃ Júpiter en [Signo] → Tu suerte, tus ganancias
♄ Saturno en [Signo] → Karma, responsabilidades
♅ Urano en [Signo] → Tu revolución personal
♆ Neptuno en [Signo] → Tu conexión espiritual
♇ Plutón en [Signo] → Tu transformación profunda

🏠 Ascendente en [Signo] → Tu personalidad
```

**Implementación**:
- [ ] Actualizar prompts (natal + solar return)
- [ ] Actualizar componente modal interpretación
- [ ] Agregar iconos planetas
- [ ] Diseño visual mejorado con secciones colapsables

#### 🎨 F. Limpieza Home Post-Interpretación

**Problema**: Después de generar interpretación, aparecen botones duplicados en home

**Solución**:
- [ ] Eliminar botones "Regenerar" y "Ver Completo" que aparecen en dashboard después de interpretación
- [ ] Mantener solo los 4 bloques principales del dashboard
- [ ] Los botones de acción solo deben estar DENTRO del modal de interpretación

---

### 📅 Fase 3: Agenda Personalizada (SIGUIENTE - POST UX/UI)

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

## 🎯 Checklist Inmediato (Esta Semana)

### Día 1-2: Backend Solar Return
- [ ] Crear `solarReturnPrompts.ts` con estructura completa planeta por planeta
- [ ] Crear endpoint `interpret-solar-return/route.ts`
- [ ] Testing básico de interpretación

### Día 2-3: UX/UI Core
- [ ] Dashboard 4 bloques numerados
- [ ] Cambiar "Carta Progresada" → "Tu Revolución Solar" en menú
- [ ] Actualizar títulos y breadcrumbs

### Día 3-4: Interpretación Mejorada
- [ ] Modal con estructura planeta por planeta
- [ ] Menú superior nuevo: Descargar | Regenerar | Ver Completo | ✕
- [ ] Eliminar botones duplicados en home

### Día 4-5: Panel Flotante + Testing
- [ ] Componente `FloatingActionPanel.tsx`
- [ ] Integración en Natal Chart
- [ ] Integración en Solar Return
- [ ] Testing completo del flujo

### Opcional (si da tiempo):
- [ ] Generación PDF básica
- [ ] Landing page plan de pago
- [ ] Responsive mobile optimizations

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

### Backend
- **Next.js API Routes**
- **MongoDB + Mongoose**
- **Firebase Authentication**

### APIs Externas
- **Prokerala Astrology API** (cálculos astrológicos)
- **OpenAI GPT-4** (interpretaciones IA)
- **Google Calendar API** (futura integración)

### Deployment
- **Vercel** (hosting y CI/CD)
- **MongoDB Atlas** (base de datos)

---

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/tu-vuelta-al-sol.git
cd tu-vuelta-al-sol

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

---

## ⚙️ Configuración

### Variables de Entorno Requeridas

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Prokerala API
PROKERALA_CLIENT_ID=...
PROKERALA_CLIENT_SECRET=...

# OpenAI (opcional - fallbacks disponibles)
OPENAI_API_KEY=sk-...

# Google Calendar (Fase 5)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

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
│   │   │   ├── generate-agenda-ai/route.ts  # Generación agenda IA
│   │   │   ├── natal-chart/route.ts
│   │   │   └── interpret-progressed/route.ts
│   │   ├── birth-data/route.ts
│   │   ├── cache/
│   │   ├── charts/
│   │   │   ├── natal/route.ts             # Cálculo carta natal
│   │   │   └── progressed/route.ts        # Cálculo Solar Return ✅
│   │   ├── debug/
│   │   ├── events/
│   │   ├── geocode/
│   │   ├── interpretations/
│   │   ├── pdf/
│   │   ├── prokerala/
│   │   ├── reverse-geocode/
│   │   ├── test-mongodb/
│   │   └── users/
│   ├── clear-chart-cache/
│   ├── debug/
│   ├── postman-test/
│   ├── test-agenda-ai/
│   ├── test-api/
│   ├── test-chart-display/
│   ├── test-mongodb/
│   ├── test-natal-chart/
│   ├── test-progressed/
│   ├── test-timezone/
│   ├── types/
│   └── cspell.config.js
│
├── components/
│   ├── admin/
│   │   ├── BirthDataAdminTable.tsx
│   │   └── DeleteUserForm.tsx
│   ├── astrology/
│   │   ├── AgendaAIDisplay.tsx
│   │   ├── AgendaLoadingStates.tsx
│   │   ├── AscendantCard.tsx
│   │   ├── AspectControlPanel.tsx
│   │   ├── AspectLines.tsx
│   │   ├── AstrologicalAgenda.tsx
│   │   ├── AstrologicalAgendaGenerator.tsx
│   │   ├── AstrologicalCalendar.tsx
│   │   ├── BirthDataCard.tsx
│   │   ├── BirthDataForm.tsx
│   │   ├── ChartComparisonComponent.tsx
│   │   ├── ChartDisplay.tsx              # Visualización cartas ✅
│   │   ├── ChartTooltips.tsx
│   │   ├── ChartWheel.tsx
│   │   ├── CombinedAscendantMCCard.tsx
│   │   ├── CosmicFootprint.tsx
│   │   ├── ElementsModalitiesCard.tsx
│   │   ├── HouseGrid.tsx
│   │   ├── InterpretationButton.tsx      # Botón interpretación ✅
│   │   ├── MidheavenCard.tsx
│   │   ├── NatalChartWheel.tsx
│   │   ├── PlanetSymbol.tsx
│   │   ├── ProgressedChartVisual.tsx
│   │   ├── ProgressedInterpretationDisplay.tsx
│   │   ├── SectionMenu.tsx
│   │   └── tooltips/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/
│   │   └── BirthDataForm.tsx
│   ├── debug/
│   │   └── ForceRegenerateChart.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── PrimaryHeader.tsx
│   ├── test/
│   │   ├── AgendaAITest.tsx
│   │   ├── GenerateAgendaAITest.tsx
│   │   ├── MongoDBTest.tsx
│   │   ├── NatalChartTest.tsx
│   │   ├── OpenAITest.tsx
│   │   ├── PostmanTest.tsx
│   │   ├── ProkeralaNatalTest.tsx
│   │   ├── SimpleTimezonetest.tsx
│   │   └── TimezoneTestComponent.tsx
│   └── ui/
│       ├── Alert.tsx
│       ├── Button.tsx
│       └── Input.tsx
│
├── models/
│   ├── AIUsage.ts
│   ├── BirthData.ts               # Modelo datos nacimiento
│   ├── Chart.ts                   # Modelo cartas (Natal/Solar Return)
│   └── User.ts                    # Modelo usuario
│
├── types/
│   ├── astrology/
│   │   └── unified-types.ts       # Tipos TypeScript
│   └── astrology.ts
│
├── services/
│   ├── astrologicalEventsService.ts
│   ├── astrologyService.ts
│   ├── batchInterpretations.ts
│   ├── cacheService.ts
│   ├── chartCalculationsService.ts
│   ├── chartInterpretationsService.ts
│   ├── chartRenderingService.tsx
│   ├── educationalInterpretationService.ts
│   ├── prokeralaService.ts
│   ├── solarReturnInterpretationService.ts  # Solar Return ✅
│   ├── trainedAssistantService.ts
│   ├── userDataService.ts
│   └── progressedChartService.tsx  # 🔶 Disponible pero no en uso
│
├── utils/
│   ├── agendaCalculator.ts
│   ├── dateTimeUtils.ts
│   ├── astrology/
│   │   ├── calculations.ts        # Cálculos astrológicos
│   │   └── intelligentFallbacks.ts # Fallbacks locales
│   └── prompts/
│       ├── disruptivePrompts.ts   # Prompts natales
│       └── solarReturnPrompts.ts  # Prompts Solar Return (NEW) 📝
│
├── context/
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
│
├── hooks/
│   ├── useAspects.ts
│   ├── useChart.ts
│   ├── useChartDisplay.ts
│   ├── usePlanets.ts
│   ├── useProkeralaApi.ts
│   ├── astrology/
│   └── lib/
│
└── lib/
    ├── db.ts                      # MongoDB connection
    ├── firebase.ts
    ├── firebaseAdmin.ts
    ├── firebase-client.ts
    ├── utils.ts
    ├── firebase/
    └── prokerala/

public/
├── file.svg
├── globe.svg
├── next.svg
├── site.webmanifest
├── vercel.svg
└── window.svg

scripts/
├── diagnose-mongodb.js
├── fix-quotes.sh
├── insert-test-user-birthdata.js
├── parse_and_chunk_pdfs.js
└── professional-quote-fix.sh

astrology_books/
└── chunks.json                    # Knowledge base para IA

📋 Key Files:
├── README.md                      # Documentación del proyecto
├── TODO.md                        # Lista de tareas
├── PLAN_ACCION_INTERPRETACION.md # Plan de interpretación
└── Prokerala_Carta_Natal.postman_collection.json # Testing API
```

### 🔑 Archivos Críticos para Solar Return

**Pendientes de crear** (según artifacts generados):
```
📝 src/utils/prompts/solarReturnPrompts.ts      # Prompts específicos
📝 src/app/api/astrology/interpret-solar-return/route.ts  # API endpoint
```

**Archivos a modificar**:
```
🔧 src/components/astrology/InterpretationButton.tsx  # Agregar soporte solar-return
🔧 src/app/(dashboard)/progressed-chart/page.tsx      # Cambiar de progressed a solar-return
```

### 📊 Estado de Implementación

| Componente | Estado | Prioridad |
|-----------|--------|-----------|
| Cálculo Solar Return | ✅ Funcional | Completado |
| Prompts Solar Return | 📝 Pendiente | Alta |
| API Interpretación | 📝 Pendiente | Alta |
| InterpretationButton | 🔧 Modificar | Alta |
| Página Solar Return | 🔧 Modificar | Media |
| Integración Agenda | ⏳ Siguiente fase | Media |

---

## 🎯 Decisiones de Arquitectura

### ¿Por qué Solar Return en lugar de Carta Progresada?

**Para Agenda Anual**:

1. **Claridad temporal**: Solar Return = exactamente 12 meses
2. **Comparación directa**: Fácil ver qué cambió vs carta natal
3. **Interpretación precisa**: Planetas en nuevas casas = áreas de vida activadas
4. **Experiencia usuario**: Más intuitivo entender "tu año solar"

**Carta Progresada** sigue siendo valiosa para:
- Desarrollo personal a largo plazo
- Evolución de la identidad
- Ciclos de maduración
- Análisis de vida completa

**Solución**: Usar ambas en fases futuras, cada una para su propósito específico.

---

## 📞 Contacto y Soporte

- **Email**: wunjocreations@gmail.com
- **Instagram**: @wunjocreations
- **Website**: [tu-vuelta-al-sol.com](#)

---

## 📄 Licencia

© 2025 Wunjo Creations. Todos los derechos reservados.

---

## 🙏 Agradecimientos

- Prokerala por la API de cálculos astrológicos
- OpenAI por las capacidades de interpretación
- Comunidad astrológica evolutiva

---

**Última actualización**: 29 de septiembre de 2025  
**Versión**: 2.0 (Solar Return Integration)  
**Estado**: 🚀 Desarrollo Activo - Agenda Anual con Solar Return