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
- **APIs Astrológicas**: Integración con Prokerala API (usando Swiss Ephemeris)

### Estructura del Proyecto
```
/
├── public/                     # Recursos estáticos
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/             # Grupo de rutas de autenticación
│   │   │   ├── login/          # Página de inicio de sesión
│   │   │   ├── register/       # Página de registro
│   │   ├── (dashboard)/        # Grupo de rutas del panel
│   │   │   ├── agenda-generator/# Página para generar agenda
│   │   │   ├── birth-data/     # Página para ingresar datos de nacimiento
│   │   │   ├── dashboard/      # Dashboard principal
│   │   │   ├── natal-chart/    # Página para visualizar carta natal
│   │   ├── api/                # API routes de Next.js
│   │   │   ├── birth-data/     # API para gestionar datos de nacimiento
│   │   │   ├── astrology/      # APIs para cartas astrológicas
│   │   │   │   ├── natal-chart/# API para carta natal
│   │   │   │   ├── progressed/ # API para carta progresada
│   │   │   │   ├── events/     # API para eventos astrológicos
│   │   │   ├── users/          # API para gestión de usuarios
│   │   │   ├── payments/       # API para procesamiento de pagos
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página principal (Home)
│   ├── components/             # Componentes React reutilizables
│   │   ├── astrology/          # Componentes específicos de astrología
│   │   │   ├── AstrologicalAgendaGenerator.tsx # Generador de agenda
│   │   │   ├── ChartDisplay.tsx # Visualizador de carta natal
│   │   ├── auth/               # Componentes de autenticación
│   │   │   ├── LoginForm.tsx   # Formulario de login
│   │   │   ├── RegisterForm.tsx# Formulario de registro
│   │   ├── dashboard/          # Componentes del dashboard
│   │   │   ├── BirthDataForm.tsx # Formulario de datos de nacimiento
│   │   ├── ui/                 # Componentes de UI genéricos
│   │   │   ├── Button.tsx      # Componente de botón
│   │   │   ├── Input.tsx       # Componente de input
│   ├── context/                # Proveedores de contexto (Auth, etc.)
│   │   ├── AuthContext.tsx     # Contexto de autenticación
│   ├── lib/                    # Utilidades y funciones auxiliares
│   │   ├── firebase.ts         # Configuración de Firebase
│   │   ├── db.ts               # Conexión con MongoDB
│   │   ├── analytics.ts        # Funciones de analítica
│   ├── services/               # Servicios para lógica de negocio
│   │   ├── astrologyService.ts # Servicio para cálculos astrológicos
│   │   ├── prokeralaService.ts # Cliente optimizado para API de Prokerala
│   ├── types/                  # Definiciones de tipos de TypeScript
│   │   ├── astrology.ts        # Tipos para datos astrológicos
│   ├── utils/                  # Utilidades generales
│   │   ├── chartFallback.ts    # Generador de fallback para cartas natales
│   └── models/                 # Modelos de datos de MongoDB
│       ├── BirthData.ts        # Modelo para datos de nacimiento
│       ├── Chart.ts            # Modelo para cartas astrológicas
│       ├── User.ts             # Modelo para usuarios
├── .env.local                  # Variables de entorno locales
└── package.json                # Dependencias y scripts
```

## Modelos de Datos

### Usuario
```typescript
{
  _id: ObjectId,
  uid: string,        // ID de Firebase
  email: string,
  fullName: string,
  createdAt: Date,
  lastLogin: Date,
  role: "user" | "admin",
  isVerified: boolean,
  subscriptionStatus: "free" | "premium" | "none"
}
```

### Datos de Nacimiento
```typescript
{
  _id: ObjectId,
  userId: string,
  fullName: string,
  birthDate: Date,
  birthTime: string,
  birthPlace: string,
  latitude: number,
  longitude: number,
  timezone: string
}
```

### Carta Astral
```typescript
{
  _id: ObjectId,
  userId: string,
  birthDataId: string,
  natalChart: object, // JSON con la carta natal
  progressedCharts: array, // Array de cartas progresadas con fechas
  createdAt: Date,
  lastUpdated: Date
}
```

### Agenda
```typescript
{
  _id: ObjectId,
  userId: string,
  chartId: string,
  startDate: Date,
  endDate: Date,
  content: object, // JSON con el contenido de la agenda
  pdfUrl: string,
  createdAt: Date,
  status: "draft" | "published"
}
```

### Pagos
```typescript
{
  _id: ObjectId,
  userId: string,
  agendaId: string,
  amount: number,
  currency: string,
  paymentMethod: string,
  status: "pending" | "completed" | "failed",
  transactionId: string,
  createdAt: Date
}
```

## Integración de API de Prokerala

La aplicación utiliza la API de Prokerala para realizar cálculos astrológicos precisos basados en Swiss Ephemeris. Hemos implementado un cliente optimizado con las siguientes características:

### Cliente de Prokerala Optimizado

- **Manejo de Tokens**: Gestión automática de tokens de autenticación con caché para reducir solicitudes.
- **Reintentos Inteligentes**: Reintentos automáticos con backoff exponencial para fallos temporales.
- **Sistema de Fallback**: Generación de cartas natales alternativas cuando la API no está disponible.
- **Transformación de Datos**: Conversión automática entre formatos de la API y la aplicación.
- **Cálculos Locales**: Funciones para calcular distribuciones elementales, modalidades y aspectos relevantes.

```typescript
// Ejemplo de uso del cliente de Prokerala
import { prokeralaClient } from '@/services/prokeralaService';

// Generar carta natal
const natalChart = await prokeralaClient.getNatalChart(
  '1990-01-01',   // Fecha de nacimiento
  '12:00:00',     // Hora de nacimiento
  40.4168,        // Latitud
  -3.7038,        // Longitud
  'Europe/Madrid' // Timezone
);

// Buscar ubicación
const locations = await prokeralaClient.searchLocation('Madrid');

// Obtener eventos astrológicos
const events = await prokeralaClient.getAstronomicalEvents(
  '2025-01-01',
  '2025-01-31'
);
```

### Endpoints Configurados

El cliente está optimizado para los siguientes endpoints:

- **Carta Natal**: Obtiene posiciones planetarias, casas y aspectos.
- **Posiciones Planetarias**: Para cartas progresadas y tránsitos.
- **Eventos Astrológicos**: Fases lunares, entradas planetarias, retrogradaciones, etc.
- **Búsqueda de Ubicaciones**: Para autocompletar ubicaciones con coordenadas precisas.

### Sistema de Fallback

Hemos implementado un sistema de fallback robusto para garantizar que la aplicación funcione incluso cuando la API de Prokerala no está disponible:

1. **Detección de Errores**: Identifica automáticamente fallos en la API.
2. **Generación Determinista**: Crea cartas natales plausibles basadas en la fecha de nacimiento.
3. **Consistencia**: Asegura que las mismas entradas siempre produzcan las mismas cartas.
4. **Transparencia**: Notifica al usuario cuando se utiliza el sistema de fallback.

## Visualización de Carta Natal

El componente `ChartDisplay` proporciona una visualización detallada de la carta natal con:

1. **Información Básica**: Ascendente, medio cielo y otros ángulos principales.
2. **Distribución Elemental**: Porcentajes de fuego, tierra, aire y agua.
3. **Modalidades**: Distribución entre cardinal, fijo y mutable.
4. **Planetas**: Posiciones detalladas con signos, grados y retrogradución.
5. **Casas**: Información sobre las 12 casas astrológicas.
6. **Aspectos Clave**: Relaciones importantes entre planetas.

```tsx
// Ejemplo de uso del componente ChartDisplay
<ChartDisplay 
  planets={chartData.planets}
  houses={chartData.houses}
  angles={chartData.angles}
  aspects={chartData.aspects}
  elementDistribution={chartData.elementDistribution}
  modalityDistribution={chartData.modalityDistribution}
  keyAspects={chartData.keyAspects}
/>
```

## Formulario de Datos de Nacimiento

El componente `BirthDataForm` permite a los usuarios ingresar sus datos de nacimiento con:

1. **Validación Avanzada**: Utiliza Zod para validación de datos.
2. **Autocompletado de Ubicaciones**: Busca lugares y obtiene coordenadas automáticamente.
3. **Carga de Datos Existentes**: Carga automáticamente datos guardados del usuario.
4. **Generación de Carta**: Crea una carta natal al enviar el formulario.

## Seguridad y Protección de Datos

- **Autenticación Segura**: Firebase Authentication para gestión de usuarios.
- **Encriptación de Datos**: Datos sensibles protegidos en la base de datos.
- **Validación de Entradas**: Validación estricta en cliente y servidor.
- **Variables de Entorno**: Credenciales de API protegidas con variables de entorno.
- **Prevención de DDOS**: Límites de tasa para proteger las APIs.

## Optimizaciones de Rendimiento

- **Caché de Tokens**: Reduce llamadas innecesarias a la API de autenticación.
- **Caché de Cartas**: Almacena cartas natales para evitar recálculos.
- **Procesamiento por Lotes**: Agrupa múltiples solicitudes para eventos astrológicos.
- **Renderizado Optimizado**: Componentes eficientes para visualización de cartas.
- **Lazy Loading**: Carga diferida de componentes pesados.

## Monetización

- **Compra Única**: Pago por agenda astrológica personalizada.
- **Suscripción**: Actualización mensual de predicciones astrológicas.
- **Niveles de Detalle**: Diferentes opciones de profundidad (básico, estándar, premium).

## Analítica y Métricas de Éxito

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

## Gestión de Errores y Situaciones Excepcionales

La aplicación está diseñada para manejar fallos de manera elegante:

1. **Errores de API**: Sistema de fallback para generar cartas natales cuando la API falla.
2. **Datos Incompletos**: Valores predeterminados para datos faltantes (como hora de nacimiento).
3. **Problemas de Conectividad**: Reintentos automáticos y caché local.
4. **Errores de Validación**: Mensajes claros y ayudas contextuales para datos inválidos.
5. **Errores de Servidor**: Página de error con opciones para recuperación.

## Estado de desarrollo

### Completado
- ✅ Configuración inicial de Next.js con TypeScript y Tailwind CSS
- ✅ Autenticación con Firebase
- ✅ Integración con MongoDB
- ✅ Cliente optimizado para API de Prokerala
- ✅ Sistema de fallback para cartas astrológicas
- ✅ Formulario de datos de nacimiento
- ✅ Visualización de carta natal

### En progreso
- 🔄 Generación de carta progresada
- 🔄 Calendario de eventos astrológicos
- 🔄 Generador de agenda personalizada

### Pendiente
- ⬜ Integración de pasarela de pagos
- ⬜ Generación y descarga de PDF
- ⬜ Panel de administración
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
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# MongoDB
MONGODB_URI=

# Prokerala API (Astrología)
NEXT_PUBLIC_PROKERALA_CLIENT_ID=
NEXT_PUBLIC_PROKERALA_CLIENT_SECRET=
NEXT_PUBLIC_PROKERALA_BEARER_TOKEN=

# Stripe (Pagos)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

5. Acceder a la aplicación en http://localhost:3000

## Solución de problemas comunes

### Error de autenticación con Prokerala
- Tengo las llamaddas desde postman funcionando

### Errores con la API de carta natal
- hay que consegir replicar las llamadas de postmann a procreala que ya funcionan en la app,ahora tengo errores varios .
- Asegúrate de que los datos de nacimiento son válidos (fecha, hora, coordenadas).
- Verifica conexión a internet y estado de la API de Prokerala.
- Si persiste, el sistema de fallback debería activarse automáticamente.

### Problemas de despliegue en Vercel
- Asegúrate de configurar todas las variables de entorno en la plataforma.
- Verifica los logs de construcción para identificar posibles errores.
- Activa mayor nivel de logging para depuración.

## Licencia

Todos los derechos reservados. Este proyecto y su contenido es propiedad exclusiva de Wunjo Creations.

## Contacto

Para más información, contactar a wunjocreations@gmail.com# Tu Vuelta al Sol - Agenda Astrológica Personalizada

