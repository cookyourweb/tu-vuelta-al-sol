# 📊 TU VUELTA AL SOL - PLAN DE ACCIÓN COMPLETO

## 🎯 Estado Actual del Proyecto
**Fecha**: 28 Noviembre 2025
**Estado General**: ✅ Arquitectura sólida, funcionalidades core implementadas
**PRIORIDAD INMEDIATA**: ✅ Completar Stripe Setup (ya iniciado)
**Próxima Prioridad**: Google Calendar Integration + Analytics

## 🚀 FASE 0: COMPLETAR STRIPE SETUP *(Esta Semana - 2-3 días)*
**Estado**: 🔄 EN PROGRESO (ya iniciado)
**Objetivo**: Finalizar configuración de Stripe y validar funcionamiento en producción

### **0.1 Verificar Configuración Actual**
- [x] **Revisar variables de entorno**
  - ✅ `STRIPE_SECRET_KEY` configurado (test mode)
  - ✅ `STRIPE_WEBHOOK_SECRET` configurado
  - ✅ Todos los `NEXT_PUBLIC_STRIPE_*_PRICE_ID` configurados (4/4)
  - ✅ Modo TEST correcto (no live keys en desarrollo)
  - ✅ Configuración de desarrollo COMPLETA

- [ ] **Validar configuración en Stripe Dashboard**
  - Productos y precios configurados
  - Webhooks configurados para eventos
  - Modo test vs live
  - API keys correctas

### **0.2 Testing Exhaustivo de Stripe**
- [x] **Configuración básica validada**
  - ✅ Variables de entorno cargadas correctamente
  - ✅ Stripe API connection test passed
  - ✅ Price IDs configurados correctamente
  - ✅ Código de integración actualizado

- [ ] **Test local (desarrollo)**
  - Ir a `http://localhost:3001/compra/agenda`
  - Probar flujo completo de compra
  - Verificar creación de checkout session
  - Probar success/cancel redirects
  - Validar webhook handling

- [ ] **Test en staging/production**
  - Deploy a staging environment
  - Probar con tarjetas de test de Stripe
  - Verificar integración con Firebase Auth
  - Validar actualización de subscription status

- [ ] **Edge cases y error handling**
  - Pago fallido
  - Usuario cancela en medio del proceso
  - Webhook failures
  - Rate limiting

### **0.3 Configuración de Producción**
- [ ] **Cambiar a modo LIVE**
  - Actualizar API keys a producción
  - Configurar productos reales en Stripe
  - Actualizar webhooks para producción
  - Configurar dominio de producción

- [ ] **Validar compliance**
  - Términos y condiciones
  - Política de privacidad
  - Información de contacto
  - SSL certificate válido

### **0.4 Monitoreo y Analytics Inicial**
- [ ] **Configurar Stripe Radar** (fraud prevention)
- [ ] **Dashboard de métricas** básicas
- [ ] **Alertas para fallos** de pago
- [ ] **Logs de transacciones**

---

## 📁 Estructura de Archivos Actualizada

```
tu-vuelta-al-sol/
├── 📁 .next/                          # Build output
├── 📁 .vscode/                        # IDE configuration
├── 📁 astrology_books/                # Astrology reference books
│   ├── chunks.json                    # Processed book content
│   └── *.pdf                         # Original PDF books
├── 📁 documentacion/                  # Project documentation
├── 📁 node_modules/                   # Dependencies
├── 📁 public/                         # Static assets
├── 📁 scripts/                        # Utility scripts
│   ├── parse_and_chunk_pdfs.js       # Book processing
│   ├── test-*.js                     # Testing scripts
│   └── verify-*.ts                   # Verification scripts
├── 📁 src/
│   ├── 📁 app/                       # Next.js App Router
│   │   ├── 📁 (auth)/                # Authentication routes
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── 📁 (dashboard)/           # Protected routes
│   │   │   ├── agenda/page.tsx
│   │   │   ├── birth-data/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── natal-chart/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── solar-return/page.tsx
│   │   ├── 📁 admin/                 # Admin panel
│   │   │   └── page.tsx
│   │   ├── 📁 api/                   # API routes
│   │   │   ├── 📁 admin/             # Admin endpoints
│   │   │   │   ├── delete-user/route.ts
│   │   │   │   ├── update-role/route.ts
│   │   │   │   └── users/route.ts
│   │   │   ├── 📁 astrology/         # Astrology APIs
│   │   │   │   ├── cleanup-interpretations/route.ts
│   │   │   │   ├── complete-events/route.ts
│   │   │   │   ├── generate-agenda-ai/route.ts
│   │   │   │   ├── interpret-chunk/route.ts
│   │   │   │   ├── interpret-events/route.ts
│   │   │   │   ├── interpret-natal/route.ts
│   │   │   │   ├── interpret-solar-return/route.ts
│   │   │   │   ├── natal-chart/route.ts
│   │   │   │   ├── progressed-chart-accurate/route.ts
│   │   │   │   └── simple-agenda/route.ts
│   │   │   ├── 📁 birth-data/        # Birth data management
│   │   │   │   └── route.ts
│   │   │   ├── 📁 cache/             # Caching system
│   │   │   │   ├── check/route.ts
│   │   │   │   ├── invalidate/route.ts
│   │   │   │   ├── save/route.ts
│   │   │   │   └── stats/route.ts
│   │   │   ├── 📁 charts/            # Chart generation
│   │   │   │   ├── natal/route.ts
│   │   │   │   ├── progressed/route.ts
│   │   │   │   └── solar-return/route.ts
│   │   │   ├── 📁 checkout/          # Payment processing
│   │   │   │   └── route.ts
│   │   │   ├── 📁 debug/             # Debug endpoints
│   │   │   │   ├── assistant/route.ts
│   │   │   │   ├── assistants/route.ts
│   │   │   │   ├── auth/route.ts
│   │   │   │   ├── credentials/route.ts
│   │   │   │   ├── firebase/route.ts
│   │   │   │   └── mongodb/route.ts
│   │   │   ├── 📁 events/            # Event management
│   │   │   │   └── astrological/route.ts
│   │   │   ├── 📁 geocode/           # Location services
│   │   │   │   └── route.ts
│   │   │   ├── 📁 interpretations/   # Interpretation management
│   │   │   │   ├── clear-cache/route.ts
│   │   │   │   ├── save/route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── 📁 pdf/               # PDF generation
│   │   │   │   └── generate/route.ts
│   │   │   ├── 📁 prokerala/         # Astrology API integration
│   │   │   │   ├── chart/route.ts
│   │   │   │   ├── direct-test/route.ts
│   │   │   │   ├── location-search/route.ts
│   │   │   │   ├── natal-chart/route.ts
│   │   │   │   ├── natal-horoscope/route.ts
│   │   │   │   ├── progressed-chart/route.ts
│   │   │   │   ├── test/route.ts
│   │   │   │   ├── test-page/page.tsx
│   │   │   │   └── token/route.ts
│   │   │   ├── 📁 reverse-geocode/   # Reverse geocoding
│   │   │   │   └── route.ts
│   │   │   ├── 📁 subscription/      # Subscription management
│   │   │   │   ├── cancel/route.ts
│   │   │   │   ├── create/route.ts
│   │   │   │   └── status/route.ts
│   │   │   ├── 📁 test-mongodb/      # Database testing
│   │   │   │   └── route.ts
│   │   │   ├── 📁 users/             # User management
│   │   │   │   └── route.ts
│   │   │   └── 📁 clear-chart-cache/ # Cache management
│   │   │       └── route.ts
│   │   ├── 📁 compra/                # Purchase flow
│   │   │   ├── agenda/page.tsx
│   │   │   ├── buy-agenda/page.tsx
│   │   │   ├── cancel/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── success/page.tsx
│   │   ├── 📁 tests/                 # Testing pages
│   │   │   ├── postman-test/page.tsx
│   │   │   ├── test-agenda-ai/page.tsx
│   │   │   ├── test-api/page.tsx
│   │   │   ├── test-chart-display/page.tsx
│   │   │   ├── test-mongodb/page.tsx
│   │   │   ├── test-mongodb2/page.tsx
│   │   │   ├── test-natal-chart/page.tsx
│   │   │   ├── test-postman/page.tsx
│   │   │   ├── test-progressed/page.tsx
│   │   │   └── test-timezone/page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── 📁 components/                # React components
│   │   ├── 📁 admin/                 # Admin components
│   │   │   ├── BirthDataAdminTable.tsx
│   │   │   └── DeleteUserForm.tsx
│   │   ├── 📁 astrology/             # Astrology components
│   │   │   ├── AgendaAIDisplay.tsx
│   │   │   ├── AgendaLoadingStates.tsx
│   │   │   ├── AscendantCard.tsx
│   │   │   ├── AspectControlPanel.tsx
│   │   │   ├── AspectLines.tsx
│   │   │   ├── AstrologicalAgenda.tsx
│   │   │   ├── AstrologicalAgendaGenerator.tsx
│   │   │   ├── AstrologicalCalendar.tsx
│   │   │   ├── BirthDataCard.tsx
│   │   │   ├── BirthDataForm.tsx
│   │   │   ├── ChartComparisonComponent.tsx
│   │   │   ├── ChartDisplay.tsx
│   │   │   ├── ChartProgressModal.tsx
│   │   │   ├── ChartTooltips.tsx
│   │   │   ├── ChartWheel.tsx
│   │   │   ├── CombinedAscendantMCCard.tsx
│   │   │   ├── CosmicFootprint.tsx
│   │   │   ├── ElementsModalitiesCard.tsx
│   │   │   ├── EnergyProfileTooltip.tsx
│   │   │   ├── HouseGrid.tsx
│   │   │   ├── InterpretationButton.tsx
│   │   │   ├── InterpretationDisplay.tsx
│   │   │   ├── InterpretationDrawer.tsx
│   │   │   ├── InterpretationProgressModal.tsx
│   │   │   ├── MidheavenCard.tsx
│   │   │   ├── NatalChartWheel.tsx
│   │   │   ├── PlanetSymbol.tsx
│   │   │   ├── ProgressedChartVisual.tsx
│   │   │   ├── SectionMenu.tsx
│   │   │   └── 📁 tooltips/
│   │   ├── 📁 auth/                  # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── 📁 dashboard/             # Dashboard components
│   │   │   ├── BirthDataForm.tsx
│   │   │   └── NatalChartCard.tsx
│   │   ├── 📁 debug/                 # Debug components
│   │   │   └── ForceRegenerateChart.tsx
│   │   ├── 📁 layout/                # Layout components
│   │   │   ├── Footer.tsx
│   │   │   └── PrimaryHeader.tsx
│   │   ├── 📁 stripe/                # Payment components
│   │   │   ├── PaymentButton.tsx
│   │   │   └── SubscriptionManager.tsx
│   │   ├── 📁 test/                  # Test components
│   │   │   ├── AgendaAITest.tsx
│   │   │   ├── MongoDBTest.tsx
│   │   │   ├── NatalChartTest.tsx
│   │   │   ├── PostmanTest.tsx
│   │   │   ├── ProkeralaNatalTest.tsx
│   │   │   └── TimezoneTestComponent.tsx
│   │   └── 📁 ui/                    # UI components
│   │       ├── Alert.tsx
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── 📁 constants/                 # Application constants
│   │   ├── astrology.ts
│   │   └── 📁 astrology/
│   │       ├── chartConstants.ts
│   │       └── progressedChartConstants.ts
│   ├── 📁 context/                   # React context providers
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── 📁 data/                      # Static data
│   │   ├── astrology.ts
│   │   └── 📁 interpretations/
│   │       ├── aspectInterpretations.ts
│   │       ├── lunarInterpretations.ts
│   │       └── solarInterpretations.ts
│   ├── 📁 hooks/                     # Custom React hooks
│   │   ├── useAspects.ts
│   │   ├── useChart.ts
│   │   ├── useChartDisplay.ts
│   │   ├── useInterpretationDrawer.ts
│   │   ├── usePlanets.ts
│   │   ├── useProkeralaApi.ts
│   │   └── 📁 astrology/
│   │       └── useChartDisplay.ts
│   ├── 📁 lib/                       # Library configurations
│   │   ├── db.ts
│   │   ├── firebase.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── stripe.ts
│   │   ├── utils.ts
│   │   ├── 📁 firebase/
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   ├── config.ts
│   │   │   └── index.ts
│   │   └── 📁 prokerala/
│   │       ├── client.ts
│   │       ├── endpoints.ts
│   │       └── types.ts
│   ├── 📁 models/                    # Database models
│   │   ├── AIUsage.ts
│   │   ├── BirthData.ts
│   │   ├── Chart.ts
│   │   ├── Interpretation.ts
│   │   └── User.ts
│   ├── 📁 services/                  # Business logic services
│   │   ├── astrologicalEventsService.ts
│   │   ├── astrologyService.ts
│   │   ├── batchInterpretations.ts
│   │   ├── cacheService.ts
│   │   ├── chartCalculationsService.ts
│   │   ├── chartInterpretationsService.ts
│   │   ├── chartRenderingService.tsx
│   │   ├── educationalInterpretationService.ts
│   │   ├── natalFullInterpretationService.ts
│   │   ├── personalizedEventsService.ts
│   │   ├── prokeralaService.ts
│   │   ├── progressedChartService.tsx
│   │   ├── solarReturnBatchService.ts
│   │   ├── solarReturnInterpretationService.ts
│   │   └── userDataService.ts
│   ├── 📁 types/                     # TypeScript type definitions
│   │   ├── interpretations.ts
│   │   └── 📁 astrology/
│   │       ├── aspects.ts
│   │       ├── basic.ts
│   │       ├── chart.ts
│   │       ├── chartConstants.ts
│   │       ├── chartDisplay.ts
│   │       ├── index.ts
│   │       ├── solarReturnTypes.ts
│   │       ├── unified-types.ts
│   │       └── utils.ts
│   └── 📁 utils/                     # Utility functions
│       ├── agendaCalculator.ts
│       ├── dateTimeUtils.ts
│       └── 📁 astrology/
│           ├── aspectCalculations.ts
│           ├── coordinateUtils.ts
│           ├── degreeConverter.ts
│           ├── disruptiveMotivationalSystem.ts
│           ├── events.ts
│           ├── extractAstroProfile.ts
│           ├── intelligentFallbacks.ts
│           └── planetPositions.ts
├── 📄 .env.local                     # Local environment variables
├── 📄 .gitignore                     # Git ignore rules
├── 📄 eslint.config.mjs              # ESLint configuration
├── 📄 jest.config.js                 # Jest testing configuration
├── 📄 next.config.js                 # Next.js configuration
├── 📄 package.json                   # Project dependencies
├── 📄 README.md                      # Project documentation
├── 📄 tailwind.config.js             # Tailwind CSS configuration
├── 📄 tsconfig.json                  # TypeScript configuration
└── 📄 vercel.json                    # Vercel deployment configuration
```

## 🎯 PLAN DE ACCIÓN - FASES PRIORITARIAS

### **FASE 1: GOOGLE CALENDAR INTEGRATION + ANALYTICS** *(Esta Semana)*
**Estado**: 🔄 PRÓXIMA PRIORIDAD
**Duración**: 1 semana
**Objetivo**: Implementar sincronización bidireccional con Google Calendar + Analytics completos

#### **1.1 Google Calendar Integration** 📅
**Estrategia**: Aprovechar Firebase Auth + OAuth 2.0 + Multi-provider architecture

- [ ] **Configurar Google Cloud Console**
  - Crear proyecto en Google Cloud
  - Habilitar Google Calendar API
  - Configurar OAuth 2.0 credentials
  - Agregar variables de entorno:
    - `GOOGLE_CLIENT_ID`
    - `GOOGLE_CLIENT_SECRET`
    - `GOOGLE_REDIRECT_URI`

- [ ] **Implementar OAuth Flow con Firebase**
  - Endpoint `/api/auth/google-calendar` para iniciar OAuth
  - Callback `/api/auth/google-calendar/callback` para intercambiar code por tokens
  - Custom claims en Firebase para calendar permissions
  - Token storage encriptado en MongoDB

- [ ] **Database Schema para Multi-Provider**
  ```javascript
  // Nueva colección: calendarIntegrations
  {
    userId: ObjectId,
    provider: 'google' | 'microsoft' | 'apple',
    connected: boolean,
    tokens: { accessToken, refreshToken, expiresAt }, // Encriptados
    settings: { autoSync, defaultCalendarId, eventTypes },
    lastSync: Date
  }

  // Nueva colección: calendarEvents
  {
    userId: ObjectId,
    integrationId: ObjectId,
    eventId: string, // Provider's event ID
    astrologicalEventId: string,
    status: 'synced' | 'modified' | 'deleted'
  }
  ```

- [ ] **Servicio Unificado de Calendarios**
  - `src/services/calendar/googleCalendarService.ts`
  - `src/services/calendar/calendarFactory.ts` (para múltiples proveedores)
  - Auto-refresh de tokens
  - Error handling y rate limiting

- [ ] **Sincronización Bidireccional**
  - Endpoint `/api/calendar/sync` para sincronización completa
  - Webhooks para cambios en tiempo real (Google Calendar)
  - Conflict resolution (usuario elige qué versión mantener)
  - Batch operations para performance

- [ ] **UI Components Multi-Provider**
  - `CalendarConnections.tsx` - Panel unificado de conexiones
  - `GoogleCalendarConnect.tsx` - Botón específico para Google
  - `CalendarSyncStatus.tsx` - Estado de sincronización por proveedor
  - `EventSyncModal.tsx` - Confirmación de sincronización

- [ ] **Expansión Futura a Otros Proveedores**
  - **Microsoft Outlook**: Graph API (siguiente fase)
  - **Apple Calendar**: iCloud API (fase posterior)
  - **Factory Pattern**: Para agregar nuevos proveedores fácilmente

#### **1.2 Analytics Implementation** 📊
**Recomendación**: Google Analytics 4 + Google Tag Manager (mejor que solo Tag Manager)

**Por qué GA4 + GTM:**
- ✅ **Mejor tracking**: Eventos customizados, conversiones avanzadas
- ✅ **Integración nativa**: Con Google Ads, Search Console
- ✅ **Privacy-first**: Cumple GDPR automáticamente
- ✅ **Real-time**: Datos en tiempo real
- ✅ **Advanced features**: Audiencias, remarketing, attribution

**Implementación:**
- [ ] **Google Analytics 4 Setup**
  - Crear propiedad GA4
  - Configurar data streams para web
  - Obtener Measurement ID

- [ ] **Google Tag Manager Setup**
  - Crear contenedor GTM
  - Instalar GTM en `layout.tsx`
  - Configurar triggers y variables

- [ ] **Event Tracking Implementation**
  - `src/lib/analytics.ts` - Servicio de analytics
  - Tracking de eventos clave:
    - User registration
    - Birth data completion
    - Chart generation
    - Interpretation views
    - Purchase funnel
    - Calendar sync events

- [ ] **E-commerce Tracking**
  - Purchase events con revenue
  - Subscription events
  - Refund tracking

- [ ] **Custom Events**
  - Astrology-specific events (planet clicks, aspect views)
  - User journey tracking
  - Feature usage analytics

#### **1.3 Testing & Deployment**
- [ ] **Testing completo** de integración
- [ ] **Deploy a staging** para validación
- [ ] **A/B testing setup** para features nuevas

---

### **FASE 2: OPTIMIZACIÓN UX/UI** *(Semana Siguiente)*
**Estado**: 📋 PLANIFICADO
**Duración**: 1 semana

#### **2.1 Responsive Design Fixes**
- [ ] **Mobile optimization** completa
- [ ] **Tablet layouts** mejorados
- [ ] **Desktop enhancements**

#### **2.2 Performance Optimization**
- [ ] **Core Web Vitals** optimization
- [ ] **Image optimization** con Next.js Image
- [ ] **Bundle size reduction**

#### **2.3 UX Improvements**
- [ ] **Loading states** mejorados
- [ ] **Error handling** más amigable
- [ ] **Progressive disclosure** para complejidad astrológica

---

### **FASE 3: EXPANSIÓN FUNCIONAL** *(Enero 2025)*
**Estado**: 📋 PLANIFICADO
**Duración**: 2-3 semanas

#### **3.1 Email Marketing Automation**
- [ ] **Sistema de newsletters** astrológicas
- [ ] **Triggers automáticos** por tránsitos
- [ ] **Welcome sequences** personalizadas

#### **3.2 Advanced AI Features**
- [ ] **Interpretaciones más profundas** con contexto histórico
- [ ] **Predicciones personalizadas** basadas en patrones
- [ ] **Recomendaciones de timing** para decisiones importantes

#### **3.3 Social Features**
- [ ] **Compatibilidad de parejas** (sinastría)
- [ ] **Grupos astrológicos** por signo solar
- [ ] **Comentarios en interpretaciones**

---

### **FASE 4: MONETIZACIÓN AVANZADA** *(Febrero 2025)*
**Estado**: 📋 PLANIFICADO

#### **4.1 Subscription Optimization**
- [ ] **Planes premium** diferenciados
- [ ] **Trial periods** optimizados
- [ ] **Churn prevention** strategies

#### **4.2 Additional Revenue Streams**
- [ ] **Consultas 1:1** con astrólogos
- [ ] **Cursos online** de astrología
- [ ] **Apps móviles** nativas

---

## 📊 MÉTRICAS DE ÉXITO POR FASE

### **Fase 1: Google Calendar + Analytics**
- **Calendar Adoption**: 40% de usuarios premium conectan calendar
- **Analytics Coverage**: 95% de eventos trackeados
- **Data Quality**: <5% missing data points

### **Fase 2: UX Optimization**
- **Core Web Vitals**: >90 scores
- **Mobile Conversion**: +25% vs desktop
- **User Satisfaction**: >4.5/5 rating

### **Fase 3: Feature Expansion**
- **Feature Adoption**: >60% usuarios usan nuevas features
- **Engagement Time**: +40% session duration
- **Retention**: +30% month-over-month

### **Fase 4: Monetization**
- **ARPU**: €45/month (objetivo)
- **Conversion Rate**: 12% free-to-paid
- **LTV**: €360 (3 años promedio)

---

## 🔧 TAREAS TÉCNICAS INMEDIATAS

### **Esta Semana - Día 1-2: Setup**
- [ ] Configurar Google Cloud Project
- [ ] Instalar dependencias de Google APIs
- [ ] Setup Google Analytics 4
- [ ] Configurar Google Tag Manager

### **Esta Semana - Día 3-4: Core Implementation**
- [ ] Implementar OAuth flow
- [ ] Crear calendar service
- [ ] Implementar analytics tracking
- [ ] Crear UI components

### **Esta Semana - Día 5-7: Integration & Testing**
- [ ] Integrar con agenda existente
- [ ] Testing exhaustivo
- [ ] Deploy a staging
- [ ] Validación con usuarios beta

---

## 💰 PRESUPUESTO ESTIMADO

### **Fase 1: Google Calendar + Analytics**
- **Google Cloud**: $50/month
- **Development Time**: 40 horas
- **Testing**: 20 horas
- **Total**: ~€2,000-3,000

### **Fase 2: UX Optimization**
- **Design Resources**: €500
- **Development Time**: 30 horas
- **Total**: ~€1,500

### **Fase 3: Feature Expansion**
- **AI API Costs**: €200/month
- **Development Time**: 60 horas
- **Total**: ~€4,000

### **Fase 4: Monetization**
- **Marketing**: €2,000/month
- **Development Time**: 40 horas
- **Total**: ~€3,000

**Total Estimado Q1 2025**: €10,000-12,000

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **¿Quieres que comience con la Fase 1 (Google Calendar + Analytics)?**
2. **¿Prefieres modificar alguna prioridad del plan?**
3. **¿Necesitas más detalles sobre alguna implementación específica?**

**Recomendación**: Empezar con Fase 1 ya que es la funcionalidad estrella que diferencia tu producto y los analytics son críticos para optimizar conversiones.
