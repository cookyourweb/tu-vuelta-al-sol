# Tu Vuelta al Sol - Agenda Astrológica Personalizada

## 🌞 Sobre el Producto

**"Tu Vuelta al Sol"** es una aplicación web que genera agendas astrológicas personalizadas basadas en la carta natal y progresada del usuario. La aplicación combina precisión astrológica máxima con inteligencia artificial para crear consejos personalizados y herramientas prácticas de planificación.

### Estructura de Archivos del Proyecto

El proyecto está organizado de la siguiente manera:

```
/ (raíz del proyecto)
├── .gitignore
├── .vercelignore
├── eslint.config.mjs
├── next.config.js
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── vercel.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── fix-quotes.sh
│   └── professional-quote-fix.sh
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   │   ├── astrology/
│   │   │   │   ├── ChartLoader.tsx
│   │   │   │   ├── natal-chart/
│   │   │   │   │   └── route.ts
│   │   │   │   └── test-postman/
│   │   │   │       └── route.ts
│   │   │   ├── birth-data/
│   │   │   │   └── route.ts
│   │   │   ├── charts/
│   │   │   │   ├── natal/
│   │   │   │   │   └── route.ts
│   │   │   │   └── progressed/
│   │   │   │       └── route.ts
│   │   │   ├── events/
│   │   │   │   └── astrological/
│   │   │   │       └── route.ts
│   │   │   ├── prokerala/
│   │   │   │   ├── client-v2.ts
│   │   │   │   ├── utils.ts
│   │   │   │   ├── chart/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── direct-test/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── location-search/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── natal-chart/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── natal-horoscope/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── test/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── test-page/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── token/
│   │   │   │   │   └── route.ts
│   │   │   ├── test-mongodb/
│   │   │   │   └── route.ts
│   │   │   ├── users/
│   │   │   │   └── route.ts
│   │   ├── clear-chart-cache/
│   │   │   └── route.ts
│   │   ├── debug/
│   │   │   └── page.tsx
│   │   ├── postman-test/
│   │   │   └── page.tsx
│   │   ├── test-api/
│   │   │   └── page.tsx
│   │   ├── test-natal-chart/
│   │   │   └── page.tsx
│   │   ├── test-timezone/
│   │   │   └── page.tsx
│   │   └── types/
│   │       └── astrology.ts
│   ├── components/
│   │   ├── astrology/
│   │   │   ├── AspectLines.tsx
│   │   │   ├── AstrologicalAgenda.tsx
│   │   │   ├── AstrologicalAgendaGenerator.tsx
│   │   │   ├── ChartDisplay.tsx
│   │   │   ├── HouseGrid.tsx
│   │   │   ├── NatalChartWheel.tsx
│   │   │   └── PlanetSymbol.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── dashboard/
│   │   │   ├── BirthDataForm.tsx
│   │   │   └── NatalChartCard.tsx
│   │   ├── debug/
│   │   │   └── ForceRegenerateChart.tsx
│   │   ├── forms/
│   │   │   └── EnhancedBirthDataForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAspects.ts
│   │   │   ├── useChart.ts
│   │   │   ├── usePlanets.ts
│   │   │   └── useProkeralaApi.ts
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── PrimaryHeader.tsx
│   │   ├── test/
│   │   │   ├── NatalChartTest.tsx
│   │   │   ├── PostmanTest.tsx
│   │   │   ├── ProkeralaNatalTest.tsx
│   │   │   ├── SimpleTimezonetest.tsx
│   │   │   └── TimezoneTestComponent.tsx
│   │   └── ui/
│   │       ├── Alert.tsx
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── firebase.ts
│   │   ├── utils.ts
│   │   └── prokerala/
│   │       ├── client.ts
│   │       ├── endpoints.ts
│   │       └── types.ts
│   ├── models/
│   │   ├── BirthData.ts
│   │   ├── Chart.ts
│   │   └── User.ts
│   ├── services/
│   │   ├── astrologyService.ts
│   │   ├── progressedChartService.ts
│   │   └── prokeralaService.ts
│   ├── utils/
│   │   ├── dateTimeUtils.ts
│   │   └── astrology/
│   │       ├── aspectCalculations.ts
│   │       ├── coordinateUtils.ts
│   │       ├── degreeConverter.ts
│   │       └── planetPositions.ts
├── types/
│   └── astrology/
│       ├── aspects.ts
│       ├── basic.ts
│       ├── chart.ts
│       └── utils.ts
```

### Funcionalidades Principales:
1. **Carta natal con precisión máxima** usando Swiss Ephemeris
2. **Carta progresada** para el año actuala
3. **Eventos astrológicos anuales** completos (retrogradaciones, lunas, eclipses)
4. **Agenda personalizada con IA** usando prompts específicos
5. **Integración Google Calendar** (funcionalidad estrella única)
6. **Consejos accionables** basados en tránsitos personales
7. **Sistema de pagos** y suscripciones
8. **Generación PDF** de alta calidad

## ⚠️ AJUSTES CRÍTICOS PARA PROKERALA API

### 🔑 Parámetros obligatorios para precisión máxima:

```javascript
// ✅ CONFIGURACIÓN CORRECTA (OBLIGATORIA)
const criticalParams = {
  'profile[datetime]': '1974-02-10T07:30:00+01:00',  // Formato ISO con timezone
  'profile[coordinates]': '40.4164,-3.7025',          // Coordenadas precisas (4 decimales)
  'ayanamsa': '0',                                    // 🚨 CRÍTICO: 0=Tropical, 1=Sideral
  'house_system': 'placidus',                         // Sistema de casas
  'birth_time_rectification': 'flat-chart',           // flat-chart | true-sunrise-chart
  'aspect_filter': 'all',                             // all | major | minor
  'la': 'es'                                          // Idioma español
};

// ❌ ERRORES COMUNES QUE EVITAR:
// - ayanamsa: '1' (Lahiri/Sideral) → Usa '0' (Tropical/Occidental)
// - datetime sin timezone → Siempre incluir +01:00 o usar Z para UTC
// - Coordenadas imprecisas → Usar máximo 4 decimales
// - birth_time_rectification: 'none' → No válido, usar 'flat-chart'
```

### 🌟 Endpoints Prokerala funcionando correctamente:

#### **Carta Natal:**
```bash
GET https://api.prokerala.com/v2/astrology/natal-aspect-chart?profile[datetime]=YYYY-MM-DDTHH:mm:ss+01:00&profile[coordinates]=LAT,LON&ayanamsa=0&house_system=placidus&birth_time_rectification=flat-chart&aspect_filter=all&la=es
```

#### **Carta Progresada:**
```bash
GET https://api.prokerala.com/v2/astrology/progression-chart?profile[datetime]=YYYY-MM-DDTHH:mm:ss+01:00&profile[coordinates]=LAT,LON&progression_year=2025&ayanamsa=0&house_system=placidus&birth_time_rectification=flat-chart&aspect_filter=all&la=es
```

## 🎯 ROADMAP COMPLETO - TU VUELTA AL SOL

### **FASE 1: FOUNDATION ASTROLÓGICA** *(Mayo 2025 - ACTUAL)*
**Estado**: 🔄 85% completo

#### ✅ Completado y Verificado
- **Carta natal con precisión máxima** (datos exactos verificados)
- **Integración Prokerala API** optimizada y funcionando
- **Autenticación Firebase** configurada
- **Base de datos MongoDB** integrada
- **Despliegue Vercel** sin errores
- **Parámetros astrológicos** corregidos (ayanamsa=0, coordenadas precisas)

#### 🔄 En Progreso INMEDIATO (Esta semana)
- [ ] **Corregir carta progresada** con parámetros exactos (ayanamsa=0)
- [ ] **Implementar prompt de IA** para generación de agenda personalizada
- [ ] **Eventos astrológicos anuales** completos
- [ ] **Mejorar UX formulario de nacimiento**:
  - [ ] **Búsqueda de lugares** con autocompletado
  - [ ] **Entrada manual de coordenadas** (opción avanzada)
  - [ ] **Manejo de hora desconocida** (mediodía por defecto + advertencia)
  - [ ] **Validación de coordenadas** y timezones automáticos
- [ ] **Deploy con últimas correcciones**

---

### **FASE 2: GENERACIÓN INTELIGENTE CON IA** *(Junio 2025)*
**Objetivo**: Agenda astrológica completa y personalizada

#### **2.1 Core de IA Astrológica** 🤖
- [ ] **Prompt engineering** optimizado para astrología personalizada
- [ ] **Generación de interpretaciones** basadas en carta natal + progresada
- [ ] **Consejos específicos** según tránsitos personales
- [ ] **Análisis de patrones** astrológicos individuales
- [ ] **Endpoint**: `/api/astrology/generate-agenda-ai`

#### **2.2 Eventos Astrológicos Anuales Completos** 🌟
- [ ] **Retrogradaciones detalladas**: Mercurio (3-4/año), Venus, Marte
- [ ] **Fases lunares**: Lunas nuevas, llenas, cuartos (12+ eventos/año)
- [ ] **Eclipses**: Solares y lunares con impacto personal (2-4/año)
- [ ] **Tránsitos importantes**: Planetas lentos sobre puntos natales
- [ ] **Aspectos temporales**: Conjunciones, oposiciones críticas
- [ ] **Estaciones astrológicas**: Solsticios, equinoccios
- [ ] **Ingresos planetarios**: Cambios de signo importantes
- [ ] **Endpoint**: `/api/astrology/annual-events`

---

### **FASE 3: MONETIZACIÓN Y SISTEMA DE PAGOS** *(Julio 2025)*
**Objetivo**: Convertir en producto rentable

#### **3.1 Sistema de Pagos Stripe** 💳
- [ ] **Integración Stripe** completa con webhooks
- [ ] **Planes de suscripción**:
  - **Básico** (€19/año): Agenda anual completa
  - **Premium** (€39/año): + Google Calendar + actualizaciones mensuales
  - **VIP** (€79/año): + consultas personales + informes especiales
- [ ] **Pagos únicos** para productos específicos
- [ ] **Sistema de cupones** y descuentos
- [ ] **Dashboard de suscripciones** para usuarios

#### **3.2 Productos Adicionales** 🎁
- [ ] **Compatibilidad de pareja** (€29): Carta sinastría
- [ ] **Carta para bebés** (€24): Regalo para padres
- [ ] **Informes temáticos** (€15 c/u): Amor, carrera, salud
- [ ] **Calendario lunar físico** (€35): Producto físico personalizado
- [ ] **Consultas 1:1** (€75/hora): Con astrólogos certificados

---

### **FASE 4: INTEGRACIÓN GOOGLE CALENDAR** *(Agosto 2025)* 🚀
**¡FUNCIONALIDAD ESTRELLA ÚNICA EN EL MERCADO!**

#### **4.1 Integración Básica** 📅
- [ ] **OAuth Google** para autorización segura
- [ ] **Sincronización automática** de eventos astrológicos
- [ ] **Recordatorios personalizados**:
  - "Hoy Mercurio sale de retrógrado"
  - "Luna nueva en tu signo - tiempo de intenciones"
- [ ] **Eventos recurrentes**: Fases lunares, aspectos importantes

#### **4.2 Funcionalidades Avanzadas** ⭐
- [ ] **Smart scheduling**: Sugerir mejores días para reuniones importantes
- [ ] **Alertas proactivas**: "Evita decisiones grandes mañana (Mercurio Rx)"
- [ ] **Rituales automáticos**: Recordatorios de ceremonias lunares
- [ ] **Sincronización bidireccional**: Análisis de eventos del usuario
- [ ] **Análisis de productividad** basado en tránsitos personales

#### **4.3 Valor Agregado Premium** 💎
- [ ] **Planificación estratégica**: Mejores fechas para proyectos importantes
- [ ] **Optimización de horarios** según energía astrológica personal
- [ ] **Integración múltiple**: Outlook, Apple Calendar
- [ ] **Widget personalizado** para escritorio/móvil

---

### **FASE 5: EXPANSIÓN Y OPTIMIZACIÓN** *(Sept-Dic 2025)*

#### **5.1 Funcionalidades Premium** 🌟
- [ ] **App móvil nativa** (React Native)
- [ ] **Notificaciones push** astrológicas personalizadas
- [ ] **Widget de escritorio** con tránsitos diarios
- [ ] **Comunidad de usuarios** (foro astrológico)
- [ ] **Sistema de referidos** con recompensas

#### **5.2 Integraciones Adicionales** 🔗
- [ ] **Spotify**: Playlists según estado astrológico
- [ ] **Notion**: Templates de planificación astrológica
- [ ] **Apple Health**: Correlación con ciclos lunares
- [ ] **Slack Bot**: Astrología para equipos de trabajo

---

## 🧪 ENDPOINTS DISPONIBLES

### **✅ Funcionando Perfectamente:**

#### **1. Test de Conectividad**
```bash
GET /api/prokerala/test
POST /api/prokerala/test
```
**Estado**: ✅ Funcionando - Verifica autenticación OAuth2

#### **2. Carta Natal Precisa** ⭐
```bash
POST /api/astrology/natal-chart-accurate
```
**Estado**: ✅ **Precisión máxima verificada**
**Datos verificados**: Sol, Luna, Mercurio, Venus coinciden exactamente con carta de referencia

**Opciones de entrada de ubicación**:
```json
// Opción 1: Coordenadas manuales (máxima precisión)
{
  "birthDate": "1974-02-10",
  "birthTime": "07:30:00", 
  "latitude": 40.4164,
  "longitude": -3.7025,
  "timezone": "Europe/Madrid",
  "fullName": "Nombre Completo",
  "inputMethod": "coordinates"
}

// Opción 2: Lugar de nacimiento (búsqueda automática)
{
  "birthDate": "1974-02-10",
  "birthTime": "07:30:00",
  "birthPlace": "Madrid, España",
  "fullName": "Nombre Completo", 
  "inputMethod": "location"
}

// Opción 3: Datos incompletos (hora aproximada)
{
  "birthDate": "1974-02-10",
  "birthTime": "12:00:00", // Mediodía por defecto
  "birthTimeKnown": false,
  "birthPlace": "Madrid, España",
  "fullName": "Nombre Completo",
  "inputMethod": "location"
}
```

### **🔄 Próximos a Implementar:**

#### **3. Carta Progresada Corregida**
```bash
POST /api/astrology/progressed-chart-accurate
```
**Acción**: Aplicar mismos parámetros corregidos (ayanamsa=0)

#### **4. Eventos Astrológicos Anuales**
```bash
GET /api/astrology/annual-events?year=2025&latitude=40.4164&longitude=-3.7025
```
**Incluye**: Fases lunares, retrogradaciones, eclipses, tránsitos

#### **6. Búsqueda de Lugares** ⚡
```bash
GET /api/astrology/location-search?q=Madrid
```
**Función**: Autocompletar lugares y obtener coordenadas automáticamente
**Incluye**: Coordenadas precisas, timezone, país, región

#### **7. Validador de Datos de Nacimiento**
```bash
POST /api/astrology/validate-birth-data
```
**Función**: Validar y completar datos de nacimiento incompletos
**Maneja**: Hora desconocida, coordenadas aproximadas, timezone automático

## 💰 ESTRATEGIA DE MONETIZACIÓN

### **Modelo Freemium** 📊
- **Gratis**: Carta natal básica + preview de agenda (1 mes)
- **Básico** (€19/año): Agenda anual completa
- **Premium** (€39/año): + Google Calendar + actualizaciones mensuales
- **VIP** (€79/año): + consultas personales + informes especiales

### **Proyección de Ingresos** 📈
- **Año 1**: 1,000 usuarios → €30,000 (mix de planes)
- **Año 2**: 5,000 usuarios → €150,000
- **Año 3**: 15,000 usuarios → €450,000

### **Diferenciadores Únicos** 🌟
1. **Google Calendar Integration** - Único en el mercado
2. **Precisión máxima** - Swiss Ephemeris + parámetros corregidos  
3. **IA personalizada** - Consejos específicos, no genéricos
4. **Enfoque práctico** - Qué hacer, no solo qué va a pasar

## 🚀 PRÓXIMOS PASOS INMEDIATOS

### **Esta Semana (3-9 Junio 2025)**
#### **Prioridad 1: Completar Foundation**
- [ ] **Deploy actual** con correcciones de carta natal
- [ ] **Corregir carta progresada** con ayanamsa=0
- [ ] **Verificar precisión** comparando con datos de referencia
- [ ] **Implementar eventos anuales básicos** (fases lunares)
- [ ] **Mejorar formulario de nacimiento**:
  - [ ] **Component de búsqueda de lugares** con API de geocoding
  - [ ] **Toggle coordenadas manuales** vs búsqueda automática
  - [ ] **Checkbox "No sé mi hora exacta"** → usar mediodía + advertencia
  - [ ] **Validación en tiempo real** de coordenadas y fechas
  - [ ] **Preview de ubicación** en mapa (opcional)

#### **Prioridad 2: IA Integration**  
- [ ] **Integrar prompt personalizado** para generación de agenda
- [ ] **Crear endpoint** `/api/astrology/generate-agenda`
- [ ] **Testing con datos reales** (caso Verónica 1974→2025)

- [ ] **Eventos astrológicos completos** (retrogradaciones, eclipses)
- [ ] **Interfaz de usuario** para generación de agendas
- [ ] **Sistema de pagos básico** (Stripe integration)
- [ ] **Beta testing** con usuarios reales

### **Junio 2025 - Objetivos del Mes**
- [ ] **Producto funcional completo** (cartas + IA + eventos)
- [ ] **50 usuarios beta** testeando el producto
- [ ] **Feedback loop** implementado
- [ ] **Preparación para Google Calendar** integration

## 📊 CASOS DE PRUEBA VERIFICADOS

### **Datos de Referencia: Verónica (10/02/1974)**
- **Fecha**: 10 febrero 1974, 07:30 CET
- **Lugar**: Madrid (40.4164, -3.7025)
- **Carta natal**: ✅ **100% verificada y precisa**
- **Carta progresada 2025**: 🔄 Pendiente corrección

### **Resultados Exactos Verificados**:
- **Sol**: 21°08'22" Acuario Casa 1 ✅
- **Luna**: 06°03'31" Libra Casa 8 ✅
- **Ascendente**: 04°09'26" Acuario ✅
- **Sistema**: Tropical/Placidus ✅
- **Precisión**: Máxima (coincide 100% con carta de referencia)

## 🔧 CONFIGURACIÓN TÉCNICA

### **Variables de Entorno OBLIGATORIAS**:
```bash
# Prokerala API (FUNCIONANDO)
NEXT_PUBLIC_PROKERALA_CLIENT_ID=tu_client_id
NEXT_PUBLIC_PROKERALA_CLIENT_SECRET=tu_client_secret

# MongoDB
MONGODB_URI=tu_mongodb_uri

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id

# Stripe (Próximamente)
STRIPE_SECRET_KEY=tu_stripe_secret
STRIPE_PUBLISHABLE_KEY=tu_stripe_public

# Google Calendar (Fase 4)  
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### **Stack Tecnológico Actual**:
- **Frontend**: Next.js 15.2.3 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + MongoDB + Mongoose
- **Autenticación**: Firebase Authentication
- **APIs**: Prokerala (Swiss Ephemeris) configurado perfectamente
- **Despliegue**: Vercel (sin errores)

## 🎯 MÉTRICAS DE ÉXITO

### **KPIs Principales** 📊
- **Conversión**: Visitante → Usuario registrado (objetivo: 15%)
- **Activación**: Usuario → Genera primera agenda (objetivo: 60%)
- **Retención**: Usuarios activos mes 2 (objetivo: 60%)
- **Monetización**: Freemium → Pago (objetivo: 8%)
- **NPS**: Net Promoter Score (objetivo: >50)

### **Métricas Google Calendar** (Fase 4) 📅
- **Adopción**: % usuarios premium que conectan calendar
- **Engagement**: Interacciones con eventos astrológicos
- **Retention boost**: Mejora en retención vs usuarios sin integración

## 🔍 PROBLEMAS RESUELTOS

### **✅ CRÍTICOS SOLUCIONADOS:**

#### **❌ → ✅ Carta natal imprecisa**
- **Causa**: `ayanamsa=1` (Lahiri/Sideral)
- **Solución**: `ayanamsa=0` (Tropical/Occidental)
- **Estado**: **RESUELTO** - Precisión 100%

#### **❌ → ✅ Luna en signo incorrecto**  
- **Causa**: Coordenadas imprecisas + sistema sideral
- **Solución**: Coordenadas exactas (4 decimales) + tropical
- **Estado**: **RESUELTO** - Datos exactos verificados

#### **❌ → ✅ Build fails en Vercel**
- **Causa**: Exportaciones inválidas en route handlers
- **Solución**: Limpiar exports incorrectos
- **Estado**: **RESUELTO** - Deploy sin errores

#### **❌ → ✅ Timezone parsing error**
- **Causa**: URL encoding incorrecto de `+` → espacio
- **Solución**: Usar `%2B` para `+` en URL encoding
- **Estado**: **RESUELTO** - Formato ISO correcto

## 📞 CONTACTO Y RECURSOS

**Email**: wunjocreations@gmail.com  
**Proyecto**: Tu Vuelta al Sol - Agenda Astrológica Personalizada  
**Repositorio**: Privado  
**Despliegue**: Vercel  

---

**Última actualización**: 27 Mayo 2025  
**Estado del proyecto**: Foundation astrológica completa ✅  
**Próximo hito**: IA + Eventos anuales (Junio 2025) 🎯  
**Funcionalidad estrella**: Google Calendar Integration (Agosto 2025) 🚀  
**Visión**: La app de astrología más práctica y útil del mercado hispanohablante 🌟