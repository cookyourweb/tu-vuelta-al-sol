# Tu Vuelta al Sol 🌞
**Agenda Astrológica Personalizada con IA**

Una aplicación web que genera agendas astrológicas personalizadas basadas en la carta natal y progresada del usuario, combinando precisión astrológica máxima con inteligencia artificial para crear consejos personalizados y herramientas prácticas de planificación.

---

## 🚀 ESTADO ACTUAL DEL PROYECTO

**Fecha de actualización**: 18 Agosto 2025  
**Fase actual**: Foundation Astrológica + Agenda IA ✅  
**Estado**: 🔄 85% completo - **En desarrollo activo**

### ✅ **FUNCIONALIDAD COMPLETADA:**
- **Carta natal con precisión máxima** (datos exactos verificados)
- **Integración Prokerala API** optimizada y funcionando
- **Autenticación Firebase** configurada
- **Base de datos MongoDB** integrada
- **Despliegue Vercel** sin errores
- **Parámetros astrológicos** corregidos (ayanamsa=0, coordenadas precisas)
- **Sistema de agenda con IA** personalizada funcional
- **Interpretación de eventos** astrológicos con OpenAI

### 🔄 **EN DESARROLLO INMEDIATO:**
- **Corrección eventos astrológicos** (endpoints Prokerala limitados)
- **Optimización interpretación IA** personalizada
- **Mejora UX formulario** de nacimiento

---

## 🎯 FUNCIONALIDADES PRINCIPALES

### **🌟 Agenda Astrológica Personalizada**
- Generación automática de agendas anuales usando IA
- Interpretaciones personalizadas basadas en carta natal
- Consejos específicos según tránsitos personales
- Eventos reales de Prokerala + interpretación IA

### **📊 Cartas Astrológicas Precisas**
- **Carta natal occidental** con precisión máxima verificada
- **Carta progresada** para análisis evolutivo
- Sistema tropical (ayanamsa=0) para astrología occidental
- Coordenadas precisas (4 decimales) para máxima exactitud

### **🤖 Inteligencia Artificial Integrada**
- Prompt engineering optimizado para astrología personalizada
- Interpretaciones disruptivas y transformadoras
- Análisis de patrones astrológicos individuales
- Consejos accionables específicos por persona

### **📅 Próximamente**
- **Integración Google Calendar** (Agosto 2025) 🚀
- **Sistema de pagos** y suscripciones
- **Eventos astrológicos completos** (retrogradaciones, eclipses)
- **Notificaciones personalizadas**

---

## 🔍 ANÁLISIS TÉCNICO - PROKERALA API

### ✅ **ENDPOINTS QUE FUNCIONAN PERFECTAMENTE:**
```bash
# ✅ CONFIRMADOS Y FUNCIONANDO:
/v2/astrology/planet-position        # Carta natal occidental
/v2/astrology/panchang               # Fases lunares incluidas  
/v2/astrology/birth-details          # Nakshatra y detalles
/v2/astrology/kundli/advanced        # Carta completa
/v2/astrology/auspicious-period      # Períodos auspiciosos
/v2/astrology/inauspicious-period    # Períodos no auspiciosos
```

### ❌ **ENDPOINTS QUE NO EXISTEN (documentados como problemáticos):**
```bash
# ❌ ESTOS NO EXISTEN EN PROKERALA:
/astrology/planetary-aspects          # → 404 Error
/astrology/planet-retrograde         # → 404 Error  
/astrology/planet-transit            # → 404 Error
/astrology/moon-calendar/{year}/{month} # → 404 Error
```

### 🔧 **CONFIGURACIÓN CORRECTA PROKERALA:**
```typescript
// ✅ CONFIGURACIÓN VERIFICADA:
const CORRECT_CONFIG = {
  ayanamsa: 0,           // Tropical/Occidental (no sideral)
  coordinates: "40.4164,-3.7025", // Precisión 4 decimales
  house_system: "placidus",        // Sistema de casas occidental
  birth_time_rectification: "flat-chart",
  la: "es"               // Idioma español
}
```

---

## 🛠️ ARQUITECTURA TÉCNICA

### **Stack Tecnológico:**
```bash
Frontend:     Next.js 15.2.3 + TypeScript + Tailwind CSS
Backend:      Next.js API Routes + MongoDB + Mongoose  
Autenticación: Firebase Authentication
APIs:         Prokerala (Swiss Ephemeris) + OpenAI GPT-4
Despliegue:   Vercel (configurado sin errores)
```

### **Estructura de Archivos:**
```
tu-vuelta-al-sol/
├── src/app/
│   ├── (dashboard)/agenda/          # Página principal agenda
│   ├── api/astrology/
│   │   ├── generate-agenda-ai/      # ✅ IA personalizada
│   │   ├── complete-events/         # ✅ Eventos + interpretación
│   │   ├── interpret-events/        # ✅ IA interpretación
│   │   ├── events/                  # 🔄 Eventos astrológicos
│   │   ├── natal-chart/             # ✅ Carta natal precisa
│   │   └── progressed/              # 🔄 Carta progresada
│   └── charts/natal/                # ✅ Endpoint carta natal
├── src/components/astrology/
│   ├── AstrologicalAgenda.tsx       # ✅ Calendario moderno
│   └── AgendaAIDisplay.tsx          # ✅ Display interpretación IA
├── src/services/
│   ├── astrologicalEventsService.ts # 🔄 Eventos (en corrección)
│   └── progressedChartService.ts    # ✅ Carta progresada
└── README.md                        # 📝 Este archivo
```

---

## 📋 CASOS DE PRUEBA VERIFICADOS

### **Datos de Referencia: Verónica (10/02/1974)**
```bash
Fecha: 10 febrero 1974, 07:30 CET
Lugar: Madrid (40.4164, -3.7025)
```

**Resultados Exactos Verificados:**
- **Sol**: 21°08'22" Acuario Casa 1 ✅
- **Luna**: 06°03'31" Libra Casa 8 ✅  
- **Ascendente**: 04°09'26" Acuario ✅
- **Sistema**: Tropical/Placidus ✅
- **Precisión**: Máxima (coincide 100% con carta de referencia)

---

## 🔧 CONFIGURACIÓN DE DESARROLLO

### **Variables de Entorno OBLIGATORIAS:**
```bash
# Prokerala API (FUNCIONANDO)
NEXT_PUBLIC_PROKERALA_CLIENT_ID=tu_client_id
NEXT_PUBLIC_PROKERALA_CLIENT_SECRET=tu_client_secret

# OpenAI para interpretación IA
OPENAI_API_KEY=tu_openai_key

# MongoDB
MONGODB_URI=tu_mongodb_uri

# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id

# Próximamente
STRIPE_SECRET_KEY=tu_stripe_secret           # Fase 3
GOOGLE_CLIENT_ID=tu_google_client_id         # Fase 4
```

### **Instalación y Desarrollo:**
```bash
# Clonar e instalar
npm install

# Desarrollo local
npm run dev

# Build de producción
npm run build

# Deploy automático en Vercel
git push origin main
```

---

## 🎯 ROADMAP COMPLETO

### **FASE 1: FOUNDATION ASTROLÓGICA** *(Mayo-Agosto 2025)*
**Estado**: 🔄 85% completo

#### ✅ **Completado:**
- Carta natal con precisión máxima verificada
- Integración Prokerala API optimizada
- Sistema de autenticación y base de datos
- Deploy Vercel configurado
- Agenda IA básica funcional

#### 🔄 **En desarrollo inmediato:**
- Corrección eventos astrológicos (endpoints limitados en Prokerala)
- Optimización interpretación IA personalizada
- Mejora UX formulario de nacimiento

---

### **FASE 2: GENERACIÓN INTELIGENTE CON IA** *(Septiembre 2025)*
**Objetivo**: Agenda astrológica completa y personalizada

#### **2.1 Core de IA Astrológica** 🤖
- [x] Prompt engineering optimizado para astrología personalizada
- [x] Generación de interpretaciones basadas en carta natal
- [x] Consejos específicos según tránsitos personales
- [ ] Análisis de patrones astrológicos avanzados
- [ ] Endpoint: `/api/astrology/generate-agenda-ai` ✅

#### **2.2 Eventos Astrológicos Completos** 🌟
- [ ] **Solución híbrida**: Prokerala + cálculos astronómicos
- [ ] **Retrogradaciones detalladas**: Mercurio (3-4/año), Venus, Marte
- [ ] **Fases lunares**: Lunas nuevas, llenas, cuartos (12+ eventos/año)
- [ ] **Eclipses**: Solares y lunares con impacto personal (2-4/año)
- [ ] **Tránsitos importantes**: Planetas lentos sobre puntos natales
- [ ] **Aspectos temporales**: Conjunciones, oposiciones críticas

---

### **FASE 3: MONETIZACIÓN Y SISTEMA DE PAGOS** *(Octubre 2025)*
**Objetivo**: Convertir en producto rentable

#### **3.1 Sistema de Pagos Stripe** 💳
- [ ] Integración Stripe completa con webhooks
- [ ] **Planes de suscripción**:
  - **Básico** (€19/año): Agenda anual completa
  - **Premium** (€39/año): + Google Calendar + actualizaciones mensuales
  - **VIP** (€79/año): + consultas personales + informes especiales

#### **3.2 Productos Adicionales** 🎁
- [ ] **Compatibilidad de pareja** (€29): Carta sinastría
- [ ] **Informes temáticos** (€15 c/u): Amor, carrera, salud

---

### **FASE 4: INTEGRACIÓN GOOGLE CALENDAR** *(Noviembre 2025)* 🚀
**¡FUNCIONALIDAD ESTRELLA ÚNICA EN EL MERCADO!**

#### **4.1 Sincronización Bidireccional**
- [ ] OAuth2 Google Calendar integration
- [ ] Eventos astrológicos automáticos en calendario personal
- [ ] Notificaciones push personalizadas
- [ ] Recordatorios basados en tránsitos importantes

---

## 🚨 PROBLEMAS IDENTIFICADOS Y SOLUCIONADOS

### **✅ CRÍTICOS RESUELTOS:**

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

### **🔄 EN RESOLUCIÓN:**

#### **⚠️ → 🔄 Eventos astrológicos limitados**
- **Causa**: Prokerala no tiene endpoints específicos para eventos occidentales
- **Análisis**: Endpoints como `/planetary-aspects`, `/planet-retrograde` no existen
- **Solución propuesta**: Estrategia híbrida (Prokerala + cálculos astronómicos)
- **Estado**: **EN DESARROLLO** - Implementando solución mixta

#### **⚠️ → 🔄 Interpretación IA optimizable**
- **Causa**: Prompt puede ser más personalizado según carta específica
- **Solución**: Mejorar prompt engineering con análisis más profundo
- **Estado**: **EN OPTIMIZACIÓN** - Funcional pero mejorable

---

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

---

## 📊 MÉTRICAS DE ÉXITO

### **KPIs Principales** 📈
- **Conversión**: Visitante → Usuario registrado (objetivo: 15%)
- **Activación**: Usuario → Genera primera agenda (objetivo: 60%)
- **Retención**: Usuarios activos mes 2 (objetivo: 60%)
- **Monetización**: Freemium → Pago (objetivo: 8%)
- **NPS**: Net Promoter Score (objetivo: >50)

### **Métricas Técnicas** ⚡
- **Performance**: Carga < 3 segundos
- **Uptime**: 99.9% disponibilidad
- **Precisión astrológica**: 100% (verificado con casos de prueba)

---

## 📞 CONTACTO Y RECURSOS

**Email**: wunjocreations@gmail.com  
**Proyecto**: Tu Vuelta al Sol - Agenda Astrológica Personalizada  
**Repositorio**: Privado  
**Despliegue**: Vercel  
**Documentación API Prokerala**: https://api.prokerala.com/docs

---

## 🔄 PRÓXIMOS PASOS INMEDIATOS

### **Esta Semana (18-25 Agosto 2025)**
1. **🔧 Corregir eventos astrológicos** usando endpoints válidos de Prokerala
2. **🤖 Optimizar interpretación IA** con prompts más específicos
3. **📱 Mejorar UX agenda** con mejor visualización de eventos
4. **📋 Documentar estrategia híbrida** para eventos astrológicos

### **Próximo Mes (Septiembre 2025)**
1. **🌟 Implementar eventos anuales completos** con estrategia mixta
2. **💳 Preparar sistema de pagos** Stripe
3. **📅 Diseñar integración Google Calendar**
4. **👥 Beta testing** con usuarios reales

---

**Última actualización**: 18 Agosto 2025  
**Estado del proyecto**: Foundation astrologica + Agenda IA ✅  
**Próximo hito**: Eventos astrológicos completos (Septiembre 2025) 🎯  
**Funcionalidad estrella**: Google Calendar Integration (Noviembre 2025) 🚀  
**Visión**: La app de astrología más práctica y útil del mercado hispanohablante 🌟