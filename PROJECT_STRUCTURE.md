# 📁 Estructura del Proyecto: Tu Vuelta al Sol

## 📋 Resumen General
Proyecto de astrología desarrollado con Next.js 15, TypeScript, MongoDB y Firebase. Incluye cálculo de cartas natales, solares return, interpretaciones con IA y agenda astrológica.

## 🏗️ Arquitectura Principal

### 📦 Raíz del Proyecto
```
/
├── 📄 Configuración
│   ├── next.config.js/ts          # Configuración Next.js
│   ├── tsconfig.json              # Configuración TypeScript
│   ├── package.json               # Dependencias y scripts
│   ├── eslint.config.mjs          # Configuración ESLint
│   ├── postcss.config.mjs         # Configuración PostCSS
│   ├── jest.config.js             # Configuración de pruebas
│   └── vercel.json                # Configuración de despliegue
│
├── 📚 Documentación
│   ├── README.md                  # Documentación principal
│   ├── TODO.md                    # Lista de tareas pendientes
│   └── PLAN_ACCION_INTERPRETACION.md
│
├── 🛠️ Scripts de Utilidad
│   ├── scripts/                   # Scripts de mantenimiento
│   │   ├── clear-cache.js
│   │   ├── diagnose-mongodb.js
│   │   ├── verify-solar-return.ts
│   │   └── parse_and_chunk_pdfs.js
│   └── astrology_books/           # Base de datos de libros
│
└── 📱 Código Fuente (src/)
```

## 🎯 Aplicación Principal (src/)

### 🏠 Páginas de la App (src/app/)
```
src/app/
├── 📄 layout.tsx                 # Layout principal
├── 📄 page.tsx                   # Página de inicio
├── 📄 globals.css                # Estilos globales
│
├── 🔐 Autenticación (auth)/
│   ├── login/                    # Página de login
│   └── register/                 # Página de registro
│
├── 📊 Dashboard (dashboard)/
│   ├── page.tsx                  # Dashboard principal
│   ├── natal-chart/              # Carta natal
│   ├── progressed-chart/         # Carta progresada/solar return
│   └── profile/                  # Perfil de usuario
│
├── ⚙️ Administración
│   ├── admin/                    # Panel de administración
│   └── debug/                    # Página de debug
│
├── 🧪 Páginas de Testing
│   ├── test-api/                 # Test de APIs
│   ├── test-mongodb/             # Test de MongoDB
│   ├── test-natal-chart/         # Test carta natal
│   ├── test-progressed/          # Test carta progresada
│   ├── test-agenda-ai/           # Test agenda con IA
│   ├── test-chart-display/       # Test visualización de cartas
│   ├── test-timezone/            # Test zonas horarias
│   └── postman-test/             # Tests con Postman
│
└── 🌐 APIs (api/)
```

### 🔌 APIs Backend (src/app/api/)

#### 🏥 APIs de Salud del Sistema
```
api/
├── 🔧 debug/                     # Endpoints de debug
│   ├── debug-auth/               # Debug autenticación
│   ├── debug-firebase/           # Debug Firebase
│   └── debug-credentials/        # Debug credenciales
│
├── 📊 cache/                     # Gestión de caché
│   ├── check/                    # Verificar caché
│   ├── save/                     # Guardar en caché
│   └── stats/                    # Estadísticas de caché
│
└── 🧪 test-mongodb/              # Test de conexión MongoDB
```

#### 👤 APIs de Usuarios
```
api/
├── 👥 users/                     # Gestión de usuarios
├── 👨‍👩‍👧‍👦 admin/                     # Administración de usuarios
│   ├── users/                    # Lista de usuarios
│   ├── delete-user/              # Eliminar usuario
│   └── update-role/              # Actualizar rol
│
└── 👶 birth-data/                # Datos de nacimiento
    ├── all/                      # Todos los datos
    └── [userId]                  # Datos por usuario
```

#### 🔮 APIs de Astrología
```
api/astrology/
├── 📈 natal-chart/               # Carta natal
├── 🔄 progressed-chart-accurate/ # Carta progresada precisa
├── ☀️ solar-return/              # Solar return
│
├── 🤖 generate-agenda-ai/        # Generar agenda con IA
├── 📅 get-agenda/                # Obtener agenda
├── 🔍 interpret-events/          # Interpretar eventos
│
├── 🌟 interpret-natal/           # Interpretación carta natal
├── 🌅 interpret-solar-return/    # Interpretación solar return
├── 🔄 interpret-progressed/      # Interpretación carta progresada
├── 🧹 interpret-natal-clean/     # Interpretación limpia
│
├── ✅ complete-events/           # Completar eventos
├── 📝 simple-agenda/             # Agenda simple
└── 🧪 test-postman/              # Tests con Postman
```

#### 🗺️ APIs de Ubicación
```
api/
├── 🗺️ geocode/                   # Geocodificación
├── 🗺️ reverse-geocode/           # Geocodificación inversa
└── 📍 events/astrological/       # Eventos astrológicos
```

#### 📊 APIs de Cartas
```
api/charts/
├── 🌟 natal/                     # Carta natal
├── ☀️ solar-return/              # Solar return
└── 🔄 progressed/                # Carta progresada
```

#### 💾 APIs de Persistencia
```
api/
├── 💾 interpretations/save/      # Guardar interpretaciones
└── 📄 pdf/generate/              # Generar PDFs
```

#### 🔗 APIs Externas
```
api/prokerala/
├── 🔑 token/                     # Obtener token
├── 🧪 test/                      # Test de conexión
├── 📍 location-search/           # Buscar ubicaciones
├── 🌟 natal-chart/               # Carta natal Prokerala
├── 🌟 natal-horoscope/           # Horóscopo natal
├── 🔄 progressed-chart/          # Carta progresada
├── ☀️ direct-test/               # Test directo
└── 📄 test-page/                 # Página de test
```

### 🧩 Componentes (src/components/)

#### 🎨 UI y Layout
```
components/
├── 🎨 ui/                        # Componentes base de UI
├── 🏗️ layout/                    # Layout components
│   ├── PrimaryHeader.tsx         # Header principal
│   └── Footer.tsx                # Footer
│
└── 🔐 auth/                      # Componentes de autenticación
    ├── LoginForm.tsx             # Formulario de login
    └── RegisterForm.tsx          # Formulario de registro
```

#### 🔮 Componentes de Astrología
```
components/astrology/
├── 📊 ChartDisplay.tsx           # Visualización de cartas
├── ☸️ ChartWheel.tsx             # Rueda zodiacal
├── 🌟 NatalChartWheel.tsx        # Rueda carta natal
├── 🔄 ProgressedChartVisual.tsx  # Visualización progresada
│
├── 🏠 HouseGrid.tsx              # Cuadrícula de casas
├── 🪐 PlanetSymbol.tsx           # Símbolos planetarios
├── 📏 AspectLines.tsx            # Líneas de aspectos
│
├── 💳 BirthDataCard.tsx          # Tarjeta datos nacimiento
├── 💳 BirthDataForm.tsx          # Formulario datos nacimiento
├── 🏠 AscendantCard.tsx          # Tarjeta ascendente
├── 🏠 MidheavenCard.tsx          # Tarjeta medio cielo
├── 🏠 CombinedAscendantMCCard.tsx # Tarjeta combinada
│
├── ⚖️ ElementsModalitiesCard.tsx # Elementos y modalidades
├── 🌌 CosmicFootprint.tsx        # Huella cósmica
│
├── 📅 AstrologicalCalendar.tsx   # Calendario astrológico
├── 📝 AstrologicalAgenda.tsx     # Agenda astrológica
├── 🤖 AstrologicalAgendaGenerator.tsx
│
├── 🎛️ AspectControlPanel.tsx     # Panel control aspectos
├── 📊 ChartComparisonComponent.tsx # Comparación de cartas
│
├── 💬 InterpretationButton.tsx   # Botón de interpretación
├── 💬 InterpretationDisplay.tsx  # Visualización interpretación
├── 💬 ProgressedInterpretationDisplay.tsx
│
├── 🤖 AgendaAIDisplay.tsx        # Display agenda IA
├── ⏳ AgendaLoadingStates.tsx    # Estados de carga agenda
│
└── 🔍 tooltips/                  # Tooltips
    └── ChartTooltips.tsx         # Tooltips de cartas
```

#### 🛠️ Componentes de Administración
```
components/admin/
├── 👶 BirthDataAdminTable.tsx    # Tabla admin datos nacimiento
└── 🗑️ DeleteUserForm.tsx         # Formulario eliminar usuario
```

#### 🧪 Componentes de Testing
```
components/test/
├── 🤖 AgendaAITest.tsx           # Test agenda IA
├── 🤖 GenerateAgendaAITest.tsx   # Test generar agenda IA
├── 🗄️ MongoDBTest.tsx            # Test MongoDB
├── 🌟 NatalChartTest.tsx         # Test carta natal
└── 🤖 OpenAITest.tsx             # Test OpenAI
```

#### 🐛 Componentes de Debug
```
components/debug/
└── 🔄 ForceRegenerateChart.tsx   # Forzar regeneración carta
```

#### 📊 Componentes de Dashboard
```
components/dashboard/
├── 💳 BirthDataForm.tsx          # Formulario datos nacimiento
└── 🌟 NatalChartCard.tsx         # Tarjeta carta natal
```

### 🎣 Hooks (src/hooks/)
```
hooks/
├── 📊 useChart.ts                # Hook para cartas
├── 📊 useChartDisplay.ts         # Hook visualización cartas
├── 🪐 usePlanets.ts              # Hook planetas
├── 📐 useAspects.ts              # Hook aspectos
├── 🔗 useProkeralaApi.ts         # Hook API Prokerala
│
├── 🔮 astrology/                 # Hooks específicos astrología
└── 📚 lib/                       # Hooks de librería
```

### 📚 Modelos de Datos (src/models/)
```
models/
├── 👤 User.ts                    # Modelo usuario
├── 👶 BirthData.ts               # Modelo datos nacimiento
├── 📊 Chart.ts                   # Modelo carta
├── 💬 Interpretation.ts          # Modelo interpretación
└── 🤖 AIUsage.ts                 # Modelo uso IA
```

### 🔧 Servicios (src/services/)
```
services/
├── 🔮 astrologyService.ts        # Servicio astrología general
├── 🗄️ cacheService.ts            # Servicio de caché
├── 📊 chartCalculationsService.ts # Cálculos de cartas
├── 💬 chartInterpretationsService.ts # Interpretaciones
├── 🎨 chartRenderingService.tsx  # Renderizado de cartas
│
├── 📅 astrologicalEventsService.ts # Eventos astrológicos
├── 🤖 batchInterpretations.ts    # Interpretaciones por lotes
├── 📚 educationalInterpretationService.ts # Interpretaciones educativas
│
├── 🔄 progressedChartService.tsx # Servicio cartas progresadas
├── ☀️ solarReturnInterpretationService.ts # Interpretaciones solar return
├── 🤖 trainedAssistantService.ts # Asistente entrenado
│
├── 👤 userDataService.ts         # Servicio datos usuario
└── 🌐 prokeralaService.ts        # Servicio Prokerala
```

### 🛠️ Utilidades (src/utils/)
```
utils/
├── 📅 agendaCalculator.ts        # Calculador de agenda
├── 🕐 dateTimeUtils.ts           # Utilidades fecha/hora
│
├── 🔮 astrology/                 # Utilidades astrología
└── 🤖 prompts/                   # Prompts para IA
```

### 📋 Tipos (src/types/)
```
types/
├── 🔮 astrology.ts               # Tipos astrología
└── 🔮 astrology/                 # Tipos específicos astrología
```

### 📚 Constantes (src/constants/)
```
constants/
├── 🔮 astrology.ts               # Constantes astrología
└── 🔮 astrology/                 # Constantes específicas
```

### 🔗 Librerías (src/lib/)
```
lib/
├── 🗄️ db.ts                      # Conexión base de datos
├── 🔥 firebase.ts                # Firebase cliente
├── 🔥 firebaseAdmin.ts           # Firebase admin
├── 🔥 firebase-client.ts         # Cliente Firebase
├── 🛠️ utils.ts                   # Utilidades generales
│
├── 🔥 firebase/                  # Utilidades Firebase
└── 🌐 prokerala/                 # Utilidades Prokerala
```

### 🔐 Contextos (src/context/)
```
context/
├── 🔐 AuthContext.tsx            # Contexto autenticación
└── 🔔 NotificationContext.tsx    # Contexto notificaciones
```

## 🚀 Tecnologías Utilizadas

### 🎨 Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos

### 🔧 Backend
- **Next.js API Routes** - APIs
- **MongoDB** - Base de datos
- **Firebase** - Autenticación y hosting

### 🤖 IA e Integraciones
- **OpenAI GPT-4** - Interpretaciones
- **Prokerala API** - Cálculos astrológicos
- **Google Maps API** - Geocodificación

### 🧪 Testing y Calidad
- **Jest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Formateo código

## 📊 Estadísticas del Proyecto

- **Total de archivos**: ~200+
- **Líneas de código**: ~15,000+
- **Componentes React**: ~50+
- **APIs**: ~30+
- **Modelos de datos**: 5
- **Servicios**: 15+

## 🎯 Funcionalidades Principales

1. **📊 Cálculo de Cartas Astrológicas**
   - Carta natal
   - Carta solar return
   - Carta progresada

2. **🤖 Interpretaciones con IA**
   - Interpretaciones detalladas
   - Comparaciones carta natal vs solar return
   - Agenda astrológica personalizada

3. **👤 Gestión de Usuarios**
   - Autenticación Firebase
   - Perfiles de usuario
   - Datos de nacimiento

4. **💾 Persistencia de Datos**
   - MongoDB para interpretaciones
   - Sistema de caché
   - Backup automático

5. **🗺️ Integración Geográfica**
   - Geocodificación
   - Zonas horarias
   - Ubicaciones precisas

6. **📱 Interfaz de Usuario**
   - Diseño responsive
   - Visualizaciones interactivas
   - Tooltips informativos

## 🔄 Flujo de Datos

```
Usuario → Autenticación → Datos Nacimiento → Cálculo Carta → Interpretación IA → Almacenamiento → Visualización
```

---

*Documento generado automáticamente - Última actualización: $(date)*
