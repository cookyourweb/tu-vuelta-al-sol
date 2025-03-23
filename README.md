# Tu Vuelta al Sol - Agenda Astrológica Personalizada

## Resumen de la Aplicación

"Tu Vuelta al Sol" es una aplicación web que genera agendas astrológicas personalizadas basadas en la carta natal y progresada del usuario. La aplicación permite a los usuarios:

1. Registrarse y autenticarse en el sistema
2. Introducir sus datos de nacimiento precisos (fecha, hora y lugar)
3. Generar su carta natal y progresada
4. Personalizar las preferencias de su agenda astrológica
5. Previsualizar el contenido antes de la compra
6. Realizar el pago de su agenda personalizada
7. Acceder a una versión digital interactiva de su agenda
8. Descargar una versión PDF de alta calidad
9. Recibir interpretaciones detalladas de su carta y eventos astrológicos relevantes

La agenda incluye secciones personalizadas como:
- Puntos fundamentales y configuración elemental
- Propósito de vida y perfil emocional
- Análisis de personalidad y patrones de pensamiento
- Estilo de amor y toma de decisiones
- Análisis de la carta progresada
- Prácticas de sanación para traumas de vidas pasadas
- Calendario mensual detallado con eventos astrológicos personalizados
- Rituales recomendados basados en la configuración astrológica individual

## Flujo de Usuario

1. **Registro/Login**: El usuario se registra o inicia sesión
2. **Dashboard**: Accede a su panel personal donde puede ver sus agendas o crear una nueva
3. **Formulario**: Completa el formulario con datos de nacimiento precisos
4. **Procesamiento**: El sistema calcula la carta natal y progresada
5. **Personalización**: El usuario selecciona preferencias para su agenda
6. **Previsualización**: Se muestra una vista previa limitada de la agenda
7. **Pago**: El usuario realiza el pago a través de Stripe
8. **Generación**: El sistema genera la agenda completa (digital y PDF)
9. **Acceso**: El usuario accede a su agenda desde su área privada

## Arquitectura Técnica

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 14
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod
- **Cliente**: React 18

#### Backend
- **Servidor**: Next.js API Routes (App Router)
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: Firebase Authentication
- **Almacenamiento**: Firebase Storage para PDFs y recursos estáticos
- **Pagos**: Stripe
- **APIs Astrológicas**: Integración con servicios externos que usan Swiss Ephemeris

### Estructura del Proyecto
/
├── public/                     # Recursos estáticos
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/             # Grupo de rutas de autenticación
│   │   │   ├── login/          # Página de inicio de sesión
│   │   │   ├── register/       # Página de registro
│   │   │   └── forgot-password/ # Página de recuperación de contraseña
│   │   ├── (dashboard)/        # Grupo de rutas del panel
│   │   │   ├── dashboard/      # Página principal del dashboard
│   │   │   ├── birth-data/     # Página de datos de nacimiento
│   │   │   └── agenda/         # Página de agenda y vista previa
│   │   ├── api/                # API routes de Next.js
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página principal (Home)
│   ├── components/             # Componentes React reutilizables
│   │   ├── auth/               # Componentes de autenticación
│   │   ├── dashboard/          # Componentes del panel de usuario
│   │   ├── layout/             # Componentes de layout
│   │   ├── astrology/          # Componentes específicos de astrología
│   │   └── ui/                 # Componentes de UI básicos
│   ├── context/                # Proveedores de contexto (Auth, etc.)
│   ├── lib/                    # Utilidades y funciones auxiliares
│   │   ├── firebase.ts         # Configuración de Firebase
│   │   ├── db.ts               # Conexión con MongoDB
│   │   ├── analytics.ts        # Funciones de analítica
│   │   └── utils/              # Utilidades generales
│   └── models/                 # Modelos de datos de MongoDB
│       ├── User.ts             # Modelo de usuario
│       ├── BirthData.ts        # Modelo de datos de nacimiento
│       ├── Chart.ts            # Modelo de carta astral
│       ├── Agenda.ts           # Modelo de agenda
│       ├── Payment.ts          # Modelo de pagos
│       └── Analytics.ts        # Modelo de eventos de analítica
├── .env.local                  # Variables de entorno locales
├── next.config.js              # Configuración de Next.js
├── tailwind.config.ts          # Configuración de Tailwind CSS
├── tsconfig.json               # Configuración de TypeScript
└── package.json                # Dependencias y scripts

## Modelos de Datos

### Usuario
```typescript
{
  _id: ObjectId,
  email: string,
  password: string, // Hasheado
  fullName: string,
  createdAt: Date,
  lastLogin: Date,
  role: "user" | "admin",
  isVerified: boolean,
  subscriptionStatus: "free" | "premium" | "none"
}
## Modelos de Datos

### Usuario
```typescript
{
  _id: ObjectId,
  email: string,
  password: string, // Hasheado
  fullName: string,
  createdAt: Date,
  lastLogin: Date,
  role: "user" | "admin",
  isVerified: boolean,
  subscriptionStatus: "free" | "premium" | "none"
}
```

### Carta Astral
```typescript

{
  _id: ObjectId,
  userId: ObjectId,
  birthDataId: ObjectId,
  natalChart: object, // JSON con la carta natal
  progressedCharts: array, // Array de cartas progresadas con fechas
  createdAt: Date,
  lastUpdated: Date
}```


### Agenda
```typescript

{
  _id: ObjectId,
  userId: ObjectId,
  chartId: ObjectId,
  startDate: Date,
  endDate: Date,
  content: object, // JSON con el contenido de la agenda
  pdfUrl: string,
  createdAt: Date,
  status: "draft" | "published"
}```


### Pagos
```typescript

{
  _id: ObjectId,
  userId: ObjectId,
  agendaId: ObjectId,
  amount: number,
  currency: string,
  paymentMethod: string,
  status: "pending" | "completed" | "failed",
  transactionId: string,
  createdAt: Date
}```typescript

### Analítica de Usuario
```
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: string,
  event: string,  // "signup", "chart_created", "preview_viewed", "purchase", etc.
  page: string,
  referrer: string,
  timestamp: Date,
  metadata: object // Datos adicionales específicos del evento
}

```

## Integración de APIs Astrológicas

La aplicación se conectará a servicios astrológicos que utilizan Swiss Ephemeris para cálculos precisos, obteniendo:
- Posiciones planetarias y aspectos
- Casas astrológicas
- Aspectos entre planetas
- Cartas progresadas
- Tránsitos importantes
- Fases lunares y eclipses

## Seguridad y Protección de Datos

- Autenticación segura con Firebase Authentication
- Encriptación de datos sensibles
- Conformidad con GDPR para datos personales
- Conexiones seguras HTTPS
- Protección de rutas API con rate limiting
  ### Sistema de registro completo que utiliza:
- Firebase Authentication para el registro de usuarios
- MongoDB para almacenar datos adicionales del usuario
- React Hook Form y Zod para validación de formularios
- Next.js App Router para la navegación.

## Monetización

- Compra única de agenda personalizada
- Posibilidad de suscripción para actualizaciones mensuales
- Diferentes niveles de detalle (básico, estándar, premium)

## Analítica y Métricas de Éxito

### Herramientas de Análisis
- **Vercel Analytics**: Análisis integrado con el despliegue para métricas básicas
- **Google Analytics 4**: Seguimiento detallado de comportamiento y conversiones
- **Mixpanel**: Para análisis de embudo y seguimiento de eventos detallados
- **Hotjar**: Mapas de calor y grabaciones de sesiones para entender el comportamiento del usuario

### KPIs (Indicadores Clave de Rendimiento)
1. **Adquisición de Usuarios**
   - Tasa de conversión de visitantes a registros
   - Costo de adquisición de cliente (CAC)
   - Fuentes de tráfico más efectivas

2. **Engagement**
   - Tiempo de permanencia en la aplicación
   - Frecuencia de visitas
   - Tasa de retención (semanal/mensual)
   - Número de cartas astrales generadas por usuario

3. **Conversión**
   - Tasa de conversión de registro a compra
   - Valor promedio del pedido
   - Tasa de abandono en el proceso de compra
   - Tiempo entre registro y primera compra

4. **Retención y Satisfacción**
   - Tasa de retención después de la compra
   - Net Promoter Score (NPS)
   - Valoraciones y comentarios de usuarios
   - Tasa de usuarios que compran agendas adicionales

5. **Técnicos y Rendimiento**
   - Tiempo de carga de la página
   - Tasa de errores
   - Dispositivos y navegadores utilizados
   - Puntuación Core Web Vitals

### Implementación de Seguimiento

```javascript
// Ejemplo de seguimiento de eventos con Google Analytics 4
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
  
  // También enviar a nuestra base de datos para análisis propios
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, ...params, timestamp: new Date() })
  });
};
```
## Estado de desarrollo

### Completado
- ✅ Configuración inicial de Next.js con TypeScript y Tailwind CSS
- ✅ Estructuración del proyecto
- ✅ Configuración de estilos con Tailwind CSS

### En progreso
- 🔄 Implementación de autenticación con Firebase
- 🔄 Creación de componentes de UI básicos
- 🔄 Creación de formularios de autenticación

### Pendiente
- ⬜ Configuración de MongoDB y modelos de datos
- ⬜ Implementación de página de datos de nacimiento
- ⬜ Integración con APIs astrológicas
- ⬜ Implementación de página de dashboard
- ⬜ Visualización de carta natal
- ⬜ Generación de contenido personalizado
- ⬜ Integración de pasarela de pagos
- ⬜ Generación y descarga de PDF
- ⬜ Implementación de analítica
- ⬜ Despliegue a producción


## Estado de desarrollo

### Completado
- ✅ Configuración inicial de Next.js con TypeScript y Tailwind CSS
- ✅ Estructuración del proyecto
- ✅ Configuración de estilos con Tailwind CSS
- ✅  Implementación de autenticación con Firebase

### En progreso

- 🔄 Creación de componentes de UI básicos
- 🔄 Creación de formularios de autenticación

### Pendiente
- ⬜ Configuración de MongoDB y modelos de datos
- ⬜ Implementación de página de datos de nacimiento
- ⬜ Integración con APIs astrológicas
- ⬜ Implementación de página de dashboard
- ⬜ Visualización de carta natal
- ⬜ Generación de contenido personalizado
- ⬜ Integración de pasarela de pagos
- ⬜ Generación y descarga de PDF
- ⬜ Implementación de analítica
- ⬜ Despliegue a producción


## Instrucciones de instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tu-vuelta-al-sol.git
cd tu-vuelta-al-sol
```
2. Instalar dependencias
```bash
npm install
```
3. Configurar variables de entorno
Crea un archivo .env.local en la raíz del proyecto con las siguientes variables:
```bash

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
MONGODB_URI=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=

```
4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
5. Acceder a la aplicación en http://localhost:3000

## Configuración de GitHub (Repositorio Privado)

1. Inicializar el repositorio local
```bash
Copiar git init
```

2. Crear archivo .gitignore

```bash
Copiar 
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```
3. Agregar el archivo .gitignore a la raíz del proyecto
Añadir archivos y hacer commit inicial

```bash
Copiargit add .
git commit -m "Configuración inicial del proyecto"
```

4. Crear un nuevo repositorio privado en GitHub

Ir a https://github.com/new
- Nombrar el repositorio "tu-vuelta-al-sol"
- Seleccionar "Private"
-Crear repositorio sin README, .gitignore o licencia


Conectar y subir el repositorio local

```bash
Copiar git remote add origin git remote add origin https://github.com/tu-usuario/tu-vuelta-al-sol.git
git branch -M main
git push -u origin main
```
## Licencia
Todos los derechos reservados. Este proyecto y su contenido es propiedad exclusiva de Wunjo Creations.
## Contacto
Para más información, contactar a wunjocreations@gmail.com# tu-vuelta-al-sol
