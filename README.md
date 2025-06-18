# 🌟 Tu Vuelta al Sol - Agenda Astrológica Personalizada

<div align="center">

**La aplicación de astrología más práctica y útil del mercado hispanohablante**

![Estado del Proyecto](https://img.shields.io/badge/Estado-85%25%20Completo-brightgreen)
![Versión](https://img.shields.io/badge/Versión-v2.0-blue)
![Framework](https://img.shields.io/badge/Framework-Next.js%2015-black)
![Precisión](https://img.shields.io/badge/Precisión-Swiss%20Ephemeris-gold)

[🚀 Demo en Vivo](https://tu-vuelta-al-sol.vercel.app) | [📖 Documentación](https://github.com/cookyourweb/tu-vuelta-al-sol/wiki) | [🐛 Reportar Bug](https://github.com/cookyourweb/tu-vuelta-al-sol/issues)

</div>

---

## 🌙 Descripción

**Tu Vuelta al Sol** es una aplicación web revolucionaria que genera agendas astrológicas personalizadas combinando la máxima precisión astrológica (Swiss Ephemeris) con inteligencia artificial. Desde tu cumpleaños hasta el siguiente, obtienes una guía completa para navegar tu año con sabiduría cósmica.

### ✨ **¿Qué hace única esta aplicación?**

- 🎯 **Precisión Máxima**: Swiss Ephemeris via Prokerala API
- 🤖 **IA Personalizada**: Consejos específicos, no genéricos  
- 📅 **Google Calendar**: Integración única en el mercado
- 🌍 **Enfoque Práctico**: Qué hacer, no solo qué va a pasar
- 🇪🇸 **100% en Español**: Astrología occidental tropical

---

## 🚀 Funcionalidades Principales

### 🔮 **Motor Astrológico**
- **Carta Natal** con precisión máxima usando Swiss Ephemeris
- **Carta Progresada** para evolución anual
- **Eventos Astrológicos** completos (retrogradaciones, lunas, eclipses)
- **Tránsitos Personales** con análisis específico

### 📱 **Experiencia de Usuario**
- **Dashboard Intuitivo** con gradientes mágicos
- **Formulario Avanzado** de datos de nacimiento
- **Visualización Interactiva** de cartas astrológicas
- **Tests Integrados** para verificación de funcionalidades

### 🎨 **Características Técnicas**
- **Validación Automática** de coordenadas y timezones
- **Manejo Inteligente** de horario verano/invierno
- **Transformación Precisa** de coordenadas Google Maps → Prokerala
- **Cache Optimizado** de tokens y datos

### 🌟 **Funcionalidad Estrella**
- **Integración Google Calendar**: Única en el mercado
- **Sincronización Automática** de eventos astrológicos
- **Recordatorios Personalizados** basados en tu carta natal

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── 📱 app/                          # Next.js 15 App Router
│   ├── 🔌 api/                      # API Routes
│   │   ├── 🌟 astrology/            # Endpoints astrológicos
│   │   │   ├── agenda-final/        # ✨ Agenda consolidada
│   │   │   ├── natal-chart/         # Carta natal
│   │   │   └── test-postman/        # Tests de API
│   │   ├── 🔮 prokerala/            # Integración Prokerala
│   │   │   ├── chart/               # Cartas corregidas
│   │   │   ├── test/                # Test básico
│   │   │   └── location-search/     # Búsqueda de ubicaciones
│   │   └── 📊 charts/               # Cartas natales y progresadas
│   ├── 🏠 (dashboard)/              # Área privada de usuario
│   ├── 🔐 (auth)/                   # Autenticación
│   ├── 🧪 test-*/                   # Páginas de testing
│   └── 📄 page.tsx                  # Landing page
├── 🧩 components/                   # Componentes React
│   ├── 🌌 astrology/                # Componentes astrológicos
│   │   ├── NatalChartWheel.tsx      # Rueda astrológica
│   │   ├── AspectLines.tsx          # Líneas de aspectos
│   │   └── ChartDisplay.tsx         # Display de cartas
│   ├── 📝 forms/                    # Formularios avanzados
│   ├── 🧪 test/                     # Componentes de testing
│   │   ├── AgendaTest.tsx           # ✨ Test completo agenda
│   │   ├── NatalChartTest.tsx       # Test carta natal
│   │   └── PostmanTest.tsx          # Test Postman
│   └── 🎨 ui/                       # Componentes UI base
├── 🛠️ services/                     # Lógica de negocio
│   ├── prokeralaService.ts          # Servicio Prokerala
│   └── progressedChartService.ts    # Cartas progresadas
├── 🔧 utils/                        # Utilidades
│   ├── 🌟 prokeralaUtils.ts         # ✨ Utilidades consolidadas
│   ├── dateTimeUtils.ts             # Manejo de fechas/timezones
│   └── astrology/                   # Cálculos astrológicos
│       ├── aspectCalculations.ts    # Cálculo de aspectos
│       ├── coordinateUtils.ts       # Transformación coordenadas
│       └── planetPositions.ts       # Posiciones planetarias
├── 📊 types/                        # Tipos TypeScript
└── 🔗 lib/                          # Librerías y configuración
    ├── prokerala/                   # Cliente Prokerala API
    ├── firebase.ts                  # Configuración Firebase
    └── db.ts                        # Base de datos MongoDB
```

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- ⚛️ **Next.js 15.2.3** - Framework React con App Router
- 🎨 **Tailwind CSS** - Diseño moderno con gradientes mágicos
- 📝 **TypeScript** - Tipado estático para mayor confiabilidad
- 🎭 **Lucide React** - Iconografía moderna

### **Backend & APIs**
- 🌟 **Prokerala API** - Swiss Ephemeris para precisión máxima
- 🔥 **Firebase** - Autenticación de usuarios
- 🍃 **MongoDB** - Base de datos para almacenamiento
- 📍 **Google Maps** - Geocodificación de ubicaciones

### **Despliegue & DevOps**
- ☁️ **Vercel** - Despliegue sin errores
- 🔧 **OAuth2** - Autenticación segura con Prokerala
- 🌐 **API Routes** - Backend serverless integrado

---

## ⚙️ Configuración del Proyecto

### **1. Clonar el repositorio**
```bash
git clone https://github.com/cookyourweb/tu-vuelta-al-sol.git
cd tu-vuelta-al-sol
```

### **2. Instalar dependencias**
```bash
npm install
# o
yarn install
```

### **3. Variables de entorno**
Crear `.env.local` con las siguientes variables:

```env
# 🔮 Prokerala API (OBLIGATORIO)
NEXT_PUBLIC_PROKERALA_CLIENT_ID=tu_client_id
NEXT_PUBLIC_PROKERALA_CLIENT_SECRET=tu_client_secret

# 🔥 Firebase (Autenticación)
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id

# 🍃 MongoDB (Base de datos)
MONGODB_URI=tu_mongodb_uri

# 💳 Stripe (Próximamente)
STRIPE_SECRET_KEY=tu_stripe_secret
STRIPE_PUBLISHABLE_KEY=tu_stripe_public

# 📅 Google Calendar (Fase 4)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### **4. Ejecutar en desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Testing y Verificación

### **Páginas de Test Disponibles**

#### 🔮 **Astrología**
- `/test-natal-chart` - Test de carta natal completa
- `/test-aspects` - Verificación de aspectos astrológicos
- `/test-agenda-complete` - ✨ Test completo de agenda consolidada

#### 📊 **Datos y Coordenadas**
- `/test-birth-data` - Validación de datos de nacimiento
- `/postman-test` - Test con token directo de Postman

#### 🔌 **APIs**
- `/api/prokerala/test` - Test básico de conexión
- `/api/astrology/test-postman` - Test exacto de Postman
- `/api/astrology/agenda-final` - ✨ Endpoint principal de agenda

### **Comandos de Test**
```bash
# Test rápido de carta natal
curl http://localhost:3000/api/prokerala/test

# Test de agenda completa (POST)
curl -X POST http://localhost:3000/api/astrology/agenda-final \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1974-02-10",
    "birthTime": "07:30:00",
    "latitude": 40.4164,
    "longitude": -3.7025,
    "startDate": "2025-02-10",
    "endDate": "2026-02-10"
  }'
```

---

## 📈 Estado del Proyecto

### ✅ **Funcionalidades Completadas (85%)**
- [x] Carta natal con precisión máxima
- [x] Validación automática de coordenadas
- [x] Manejo inteligente de timezones
- [x] Autenticación Firebase
- [x] Base de datos MongoDB
- [x] Despliegue Vercel estable
- [x] Tests completos integrados
- [x] ✨ Utilidades consolidadas (v2.0)

### 🔄 **En Desarrollo**
- [ ] Carta progresada con parámetros exactos
- [ ] Eventos astrológicos anuales completos
- [ ] Prompt de IA para agenda personalizada
- [ ] Sistema de pagos Stripe

### 🚀 **Próximas Funcionalidades**
- [ ] **Google Calendar Integration** (funcionalidad estrella)
- [ ] App móvil React Native
- [ ] Sistema de suscripciones premium
- [ ] Análisis de compatibilidad de pareja

---

## 🎯 Casos de Uso Principales

### **Para Usuarios**
1. **Autoconocimiento**: Comprende tu personalidad astrológica
2. **Planificación**: Usa los tránsitos para tomar mejores decisiones
3. **Crecimiento Personal**: Rituales y recomendaciones personalizadas
4. **Organización**: Sincroniza eventos cósmicos con tu calendario

### **Para Astrólogos**
1. **Herramienta Profesional**: Precisión Swiss Ephemeris
2. **Cliente Integral**: Desde consulta hasta seguimiento anual
3. **Automatización**: Genera agendas personalizadas en minutos
4. **Escalabilidad**: Atiende más clientes con menos esfuerzo

---

## 🐛 Troubleshooting

### **Problemas Comunes**

#### **❌ Error de Autenticación Prokerala**
```bash
# Verificar credenciales
curl -X POST https://api.prokerala.com/token \
  -d "grant_type=client_credentials&client_id=TU_ID&client_secret=TU_SECRET"
```

#### **❌ Coordenadas Incorrectas**
- Asegúrate de usar máximo 4 decimales
- Formato: `40.4164,-3.7025` (sin espacios)
- Rango válido: latitud [-90,90], longitud [-180,180]

#### **❌ Timezone Incorrecto**
```javascript
// ✅ Correcto para Madrid
const datetime = "1974-02-10T07:30:00+01:00"; // Invierno
const datetime = "1985-07-15T14:20:00+02:00"; // Verano
```

### **Debugging**
```bash
# Ver logs en tiempo real
npm run dev

# Test de conectividad
curl http://localhost:3000/api/prokerala/test

# Verificar variables de entorno
echo $NEXT_PUBLIC_PROKERALA_CLIENT_ID
```

---

## 🤝 Contribuir

### **Cómo Contribuir**
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### **Áreas que Necesitan Ayuda**
- 🎨 **UI/UX**: Mejoras en la experiencia de usuario
- 🔮 **Astrología**: Nuevos cálculos y interpretaciones
- 🧪 **Testing**: Casos de test adicionales
- 📝 **Documentación**: Guías y tutoriales
- 🌍 **Internacionalización**: Soporte multiidioma

---

## 💰 Modelo de Negocio

### **Planes de Suscripción**
- 🆓 **Gratis**: Carta natal básica + preview agenda (1 mes)
- 💫 **Básico (€19/año)**: Agenda anual completa
- ⭐ **Premium (€39/año)**: + Google Calendar + actualizaciones mensuales
- 👑 **VIP (€79/año)**: + consultas personales + informes especiales

### **Proyección Financiera**
- 📊 **Año 1**: 1,000 usuarios → €30,000
- 📈 **Año 2**: 5,000 usuarios → €150,000  
- 🚀 **Año 3**: 15,000 usuarios → €450,000

---

## 📞 Contacto y Soporte

### **Desarrolladora Principal**
- 👩‍💻 **Verónica** - [wunjocreations@gmail.com](mailto:wunjocreations@gmail.com)
- 🌐 **Website**: [cookyourweb.es](https://cookyourweb.es)
- 💼 **LinkedIn**: [Verónica - Cook Your Web](https://linkedin.com/in/cookyweb)

### **Soporte Técnico**
- 🐛 **Issues**: [GitHub Issues](https://github.com/cookyourweb/tu-vuelta-al-sol/issues)
- 📖 **Documentación**: [Wiki del Proyecto](https://github.com/cookyourweb/tu-vuelta-al-sol/wiki)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/cookyourweb/tu-vuelta-al-sol/discussions)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- 🌟 **Prokerala API** - Por proporcionar Swiss Ephemeris de calidad
- 🔥 **Firebase** - Por la autenticación sin complicaciones
- ☁️ **Vercel** - Por el despliegue perfecto
- 🎨 **Tailwind CSS** - Por hacer el diseño mágico posible
- 🌙 **Comunidad Astrológica** - Por la inspiración constante

---

<div align="center">

**⭐ Si este proyecto te parece útil, ¡dale una estrella en GitHub! ⭐**

**✨ Desarrollado con amor y magia cósmica ✨**

[🌟 Dar Estrella](https://github.com/cookyourweb/tu-vuelta-al-sol) | [🐛 Reportar Bug](https://github.com/cookyourweb/tu-vuelta-al-sol/issues) | [💡 Sugerir Feature](https://github.com/cookyourweb/tu-vuelta-al-sol/issues/new)

</div>