# Tu Vuelta al Sol

## Sincronización de Datos de Usuario

### Actualización Automática de Nombres
- **Sincronización Completa**: Al actualizar el nombre completo en el formulario de datos de nacimiento, se sincroniza automáticamente en:
  - ✅ Firebase Authentication (displayName)
  - ✅ Colección de usuarios MongoDB (fullName) 
  - ✅ Colección BirthData MongoDB (fullName)
  - ✅ Panel de administración (interfaz actualizable)

### Panel de Administración Mejorado
- **Botón de Actualización**: Se ha añadido un botón "🔄 Actualizar" que permite a los administradores refrescar manualmente la lista de usuarios
- **Eventos Personalizados**: Los componentes escuchan eventos `birthDataSaved` para actualizaciones automáticas
- **Visualización en Tiempo Real**: Los cambios se reflejan inmediatamente después de guardar datos

### Endpoints de Sincronización
- **POST `/api/birth-data`**: Actualiza simultáneamente todos los sistemas
- **GET `/api/admin/users`**: Devuelve lista actualizada de usuarios
- **Eventos**: Sistema de eventos personalizados para sincronización cross-component

## Documentación de la funcionalidad de administración de usuarios

Se ha implementado una sección de administración para gestionar usuarios en la aplicación. A continuación se describen las funcionalidades y cómo usarlas:

### Endpoints API

#### Eliminar usuario

- **URL:** `/api/admin/delete-user`
- **Método:** POST
- **Descripción:** Elimina un usuario y todos sus datos relacionados (charts y birthdatas).
- **Parámetros JSON:**
  - `uid` (string, opcional): Identificador único del usuario.
  - `email` (string, opcional): Email del usuario.
- **Nota:** Se debe enviar al menos `uid` o `email`. Si se envía solo `email`, el sistema buscará el `uid` correspondiente para eliminar todos los datos relacionados.
- **Ejemplo de uso con curl:**
  ```bash
  curl -X POST http://localhost:3000/api/admin/delete-user \
    -H "Content-Type: application/json" \
    -d '{"email": "usuario@example.com"}'
  ```

#### Listar usuarios

- **URL:** `/api/admin/users`
- **Método:** GET
- **Descripción:** Devuelve una lista de usuarios con información básica (uid, email, fullName).
- **Ejemplo de uso con curl:**
  ```bash
  curl http://localhost:3000/api/admin/users
  ```

### Interfaz de administración

- **URL:** `/admin`
- **Descripción:** Página web que muestra la lista de usuarios existentes y un formulario para eliminar usuarios por `uid` o `email`.
- **Uso:**
  1. Navegar a `http://localhost:3000/admin`.
  2. Visualizar la lista de usuarios.
  3. Ingresar el `uid` o `email` del usuario a eliminar en el formulario.
  4. Presionar el botón "Eliminar Usuario".
  5. Ver el mensaje de confirmación o error.

### Notas adicionales

- La eliminación de un usuario borra también todos los charts y birthdatas asociados.
- El formulario y la página admin están implementados con React y Next.js, usando hooks y API routes.

---

## 🌞 Sobre el Producto

**"Tu Vuelta al Sol"** es una aplicación web que genera agendas astrológicas personalizadas basadas en la carta natal y progresada del usuario. La aplicación combina precisión astrológica máxima con inteligencia artificial para crear consejos personalizados y herramientas prácticas de planificación.

## 📅 ¿Qué es la Agenda Astrológica?

La **Agenda Astrológica Personalizada** es el corazón de "Tu Vuelta al Sol". Es un calendario único que combina:

### 🔮 **Predicciones Basadas en Tu Carta Natal**
- **Tránsitos personales**: Cómo los planetas en movimiento afectan tu carta natal específica
- **Aspectos importantes**: Conjunciones, oposiciones, trígonos y cuadraturas que impactan tu energía
- **Retrogradaciones**: Efectos personalizados de Mercurio, Venus y Marte retrógrados

### 🌙 **Eventos Astrológicos Anuales**
- **Fases lunares**: Lunas nuevas y llenas con rituales específicos
- **Eclipses**: Momentos de transformación y nuevos comienzos
- **Cambios de estación**: Equinoccios y solsticios con significado personal
- **Ingresos planetarios**: Cuando los planetas cambian de signo

### 🤖 **Consejos de IA Personalizados**
- **Acciones recomendadas**: Qué hacer en cada fase astrológica
- **Evitar decisiones**: Cuándo postergar decisiones importantes
- **Enfoque energético**: Dónde dirigir tu energía según los tránsitos
- **Rituales específicos**: Ceremonias y prácticas para cada evento

## 📊 **Características Únicas de la Agenda**
- **Generación con IA**: Usa inteligencia artificial para interpretaciones personalizadas
- **Integración Google Calendar**: Sincronización automática con tu calendario
- **Recordatorios proactivos**: Alertas antes de eventos importantes
- **Formato PDF descargable**: Agenda imprimible de alta calidad
- **Actualizaciones mensuales**: Contenido fresco y relevante
- **Base de conocimiento astrológico**: Sistema de búsqueda en libros de astrología procesados

## 📚 Sistema de Procesamiento de Libros Astrológicos

El proyecto incluye un sistema avanzado para procesar y buscar en libros de astrología:

### 🛠 **Script de Procesamiento**
- **`scripts/parse_and_chunk_pdfs.js`**: Convierte PDFs de astrología en chunks de texto
- **Genera `astrology_books/chunks.json`**: Archivo con fragmentos de texto procesados
- **Búsqueda por chunks**: Sistema optimizado para búsqueda rápida

### 🚀 **Integración con Vercel**

#### Opción 1: Incluir chunks.json en el proyecto (si es < 50MB)
```typescript
// src/lib/astrologyBooks.ts
import booksData from 'astrology_books/chunks.json';

export function searchInBooks(query: string) {
  const results = booksData.filter(chunk => 
    chunk.text.toLowerCase().includes(query.toLowerCase())
  );
  return results.slice(0, 5);
}
```

#### Opción 2: Cargar dinámicamente (para archivos grandes)
```typescript
// src/app/api/astrology/search-books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let chunksCache: any[] | null = null;

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!chunksCache) {
      const chunksPath = path.join(process.cwd(), 'astrology_books', 'chunks.json');
      const fileContent = fs.readFileSync(chunksPath, 'utf-8');
      chunksCache = JSON.parse(fileContent);
    }
    
    const results = chunksCache.filter(chunk =>
      chunk.text.toLowerCase().includes(query.toLowerCase())
    );
    
    return NextResponse.json({ success: true, results: results.slice(0, 10) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error buscando en libros' });
  }
}
```

### 🔍 **Verificación Rápida**
```bash
# Ejecutar script de procesamiento
node scripts/parse_and_chunk_pdfs.js

# Verificar tamaño del archivo
ls -lh astrology_books/chunks.json

# Si es mayor a 50MB, usar Git LFS
git lfs track "astrology_books/chunks.json"
git add .gitattributes
git add astrology_books/chunks.json
```

### 📦 **Para Desplegar en Vercel**
1. Generar chunks.json localmente
2. Verificar tamaño del archivo
3. Subir con el proyecto (o usar Git LFS si es grande)
4. El sistema de búsqueda estará disponible automáticamente

### 🎯 **Beneficios para el Usuario**
- **Planificación estratégica**: Mejores fechas para proyectos importantes
- **Autoconocimiento**: Entender tus patrones energéticos naturales
- **Prevención**: Evitar conflictos durante tránsitos difíciles
- **Aprovechamiento**: Maximizar oportunidades durante tránsitos favorables
- **Conexión cósmica**: Sentirse en sintonía con los ciclos naturales

La agenda cubre desde tu cumpleaños actual hasta tu próximo cumpleaños, creando un ciclo completo de "tu vuelta al sol" con guidance astrológico personalizado para cada mes.

## 🚀 Funcionalidades Futuras Planeadas

- **Carta Progresada Mejorada:** Corrección y optimización de la carta progresada para mayor precisión.
- **Agenda Anual Personalizada con IA:** Generación automática de agendas astrológicas anuales usando inteligencia artificial para predicciones y consejos personalizados.
- **Integración Completa con Google Calendar:** Sincronización bidireccional con Google Calendar para eventos astrológicos, recordatorios y alertas personalizadas.
- **Eventos Astrológicos Anuales Completos:** Inclusión de retrogradaciones, fases lunares, eclipses y tránsitos importantes.
- **Sistema de Pagos y Suscripciones:** Implementación de planes freemium y premium con funcionalidades exclusivas.
- **Mejoras en UX/UI:** Formularios avanzados, autocompletado de lugares, validación en tiempo real y manejo de datos incompletos.
- **Notificaciones y Alertas Personalizadas:** Alertas proactivas basadas en tránsitos y eventos astrológicos.
- **Expansión a Plataformas Móviles:** Desarrollo de app móvil nativa y widgets personalizados.
- **Integraciones Adicionales:** Spotify, Notion, Apple Health, Slack Bot y más.

Estas funcionalidades están planificadas para ser implementadas en los próximos meses, con un enfoque en ofrecer la experiencia astrológica más completa y personalizada del mercado.



### Estructura de Archivos del Proyecto

### Estructura de Archivos Actualizada

El proyecto está organizado de la siguiente manera:

```
tu-vuelta-al-sol/
├── .gitignore
├── .vercelignore
├── eslint.config.mjs
├── next.config.js
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── Prokerala_Carta_Natal.postman_collection.json
├── prokerala-token-test.js
├── README.md
├── tsconfig.json
├── vercel.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── site.webmanifest
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── fix-quotes.sh
│   ├── parse_and_chunk_pdfs.js
│   └── professional-quote-fix.sh
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── layout.tsx.backup
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── delete-user/
│   │   │   │   ├── update-role/
│   │   │   │   └── update-role.ts
│   │   │   ├── astrology/
│   │   │   │   ├── generate-agenda-ai/
│   │   │   │   └── generate-agenda-ai/route.ts
│   │   │   ├── birth-data/
│   │   │   │   └── route.ts
│   │   │   ├── cache/
│   │   │   ├── charts/
│   │   │   ├── debug/
│   │   │   │   ├── assistants/
│   │   │   │   ├── auth/
│   │   │   │   ├── auth-context/
│   │   │   │   ├── firebase/
│   │   │   │   └── route.ts
│   │   │   ├── events/
│   │   │   ├── geocode/
│   │   │   ├── pdf/
│   │   │   │   └── generate/
│   │   │   ├── prokerala/
│   │   │   ├── reverse-geocode/
│   │   │   ├── test-mongodb/
│   │   │   └── users/
│   │   │   │   └── route.ts
│   │   ├── clear-chart-cache/
│   │   │   └── route.ts
│   │   ├── debug/
│   │   │   └── page.tsx
│   │   ├── postman-test/
│   │   │   └── page.tsx
│   │   ├── test-agenda-ai/
│   │   │   └── page.tsx
│   │   ├── test-api/
│   │   │   └── page.tsx
│   │   ├── test-chart-display/
│   │   │   └── page.tsx
│   │   ├── test-mongodb/
│   │   │   └── page.tsx
│   │   ├── test-natal-chart/
│   │   │   ├── page.tsx
│   │   │   └── page.tsx.backup
│   │   ├── test-progressed/
│   │   │   ├── page.test.tsx
│   │   │   └── page.tsx
│   │   ├── test-timezone/
│   │   │   └── page.tsx
│   │   └── types/
│   │   │   └── astrology.ts
│   ├── components/
│   │   ├── admin/
│   │   │   ├── BirthDataAdminTable.tsx
│   │   │   └── DeleteUserForm.tsx
│   │   ├── astrology/
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
│   │   │   ├── ChartDisplay.tsx
│   │   │   ├── ChartDisplaycompletosinrefactorizar.tsx
│   │   │   ├── ChartDisplayrefactorizadSinLineasniAspeectos.tsx
│   │   │   ├── ChartTooltips.tsx
│   │   │   ├── ChartWheel.tsx
│   │   │   ├── CombinedAscendantMCCard.tsx
│   │   │   ├── CosmicFootprint.tsx
│   │   │   ├── ElementsModalitiesCard.tsx
│   │   │   ├── HouseGrid.tsx
│   │   │   ├── MidheavenCard.tsx
│   │   │   ├── NatalChartWheel.tsx
│   │   │   ├── PlanetSymbol.tsx
│   │   │   ├── ProgressedChartVisual.tsx
│   │   │   ├── SectionMenu.tsx
│   │   │   └── tooltips/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── dashboard/
│   │   │   ├── BirthDataForm.tsx
│   │   │   └── NatalChartCard.tsx
│   │   ├── debug/
│   │   │   └── ForceRegenerateChart.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.tsx.backup
│   │   │   └── PrimaryHeader.tsx
│   │   ├── test/
│   │   │   ├── AgendaAITest.tsx
│   │   │   ├── MongoDBTest.tsx
│   │   │   ├── NatalChartTest.tsx
│   │   │   ├── PostmanTest.tsx
│   │   │   ├── ProkeralaNatalTest.tsx
│   │   │   ├── SimpleTimezonetest.tsx
│   │   │   └── TimezoneTestComponent.tsx
│   │   └── ui/
│   │   │   ├── Alert.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   ├── constants/
│   │   ├── astrology.ts
│   │   └── astrology/
│   │   │   ├── chartConstants.ts
│   │   │   └── progressedChartConstants.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/
│   │   ├── useAspects.ts
│   │   ├── useChart.ts
│   │   ├── useChartDisplay.ts
│   │   ├── usePlanets.ts
│   │   ├── useProkeralaApi.ts
│   │   ├── astrology/
│   │   │   └── useChartDisplay.ts
│   │   └── lib/
│   │   │   ├── db.ts
│   │   │   ├── firebase.ts
│   │   │   ├── utils.ts
│   │   │   └── prokerala/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── firebase-client.ts
│   │   ├── firebase.ts
│   │   ├── firebaseAdmin.ts
│   │   ├── utils.ts
│   │   ├── firebase/
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   ├── config.ts
│   │   │   └── index.ts
│   │   └── prokerala/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   ├── models/
│   │   ├── AIUsage.ts
│   │   ├── BirthData.ts
│   │   ├── Chart.ts
│   │   └── User.ts
│   ├── services/
│   │   ├── astrologicalEventsService.ts
│   │   ├── astrologyService.ts
│   │   ├── cacheService.ts
│   │   ├── chartCalculationsService.ts
│   │   ├── chartInterpretationsService.ts
│   │   ├── chartRenderingService.tsx
│   │   ├── progressedChartService.ts
│   │   ├── prokeralaService.ts
│   │   ├── trainedAssistantService.ts
│   │   └── userDataService.ts
│   ├── types/
│   │   └── astrology/
│   │   │   ├── aspects.ts
│   │   │   ├── basic.ts
│   │   │   ├── chart.ts
│   │   │   ├── chartConstants.ts
│   │   │   ├── chartDisplay.ts
│   │   │   ├── chartDisplaycopy.ts
│   │   │   ├── index.ts
│   │   │   ├── unified-types.ts
│   │   │   └── utils.ts
│   └── utils/
│   │   ├── agendaCalculator.ts
│   │   ├── dateTimeUtils.ts
│   │   └── astrology/
│   │   │   ├── aspectCalculations.ts
│   │   │   ├── coordinateUtils.ts
│   │   │   ├── degreeConverter.ts
│   │   │   ├── disruptiveMotivationalSystem.ts
│   │   │   ├── events.ts
│   │   │   ├── extractAstroProfile.ts
│   │   │   ├── intelligentFallbacks.ts
│   │   │   └── planetPositions.ts
└── TODO.md
```

**Nota**: Esta estructura refleja la organización actual del proyecto con todos los archivos y directorios existentes.

### Funcionalidades Principales:
1. **Carta natal con precisión máxima** usando Swiss Ephemeris
2. **Carta progresada** para el año actual   desde la fecha  de nacimiento del  año en curso, hasta la fecha de nacimiento del año siguiente.
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
- [ ] **Corregir carta progresada** verificar que usa loparámetros exactos (ayanamsa=0) arreglar ux
- [ ] **Implementar prompt de IA** para generación de agenda personalizada
- [ ] **Eventos astrológicos anuales** completos
- [ ] **Mejorar UX formulario de nacimiento**:
  - [ ] **Búsqueda de lugares** con autocompletado
  - [ ] **Entrada manual de coordenadas** (opción avanzada)
  - [ ] **Manejo de hora desconocida** (mediodía por defecto + advertencia)
  - [ ] **Validación de coordenadas** y timezones automáticos
- [ ] **Deploy con últimas correcciones**

---

### **FASE 2: GENERACIÓN INTELIGENTE CON IA** *(julio 2025)*
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

### **3.2 Productos Adicionales** 🎁
- [ ] **Compatibilidad de pareja** (€29): Carta sinastría
- [ ] **Carta para bebés** (€24): Regalo para padres
- [ ] **Informes temáticos** (€15 c/u): Amor, carrera, salud
- [ ] **Calendario lunar físico** (€35): Producto físico personalizado
- [ ] **Consultas 1:1** (€75/hora): Con astrólogos certificados
- [ ] **Regalos Astrológicos** (€25-50): Crear cartas y agendas personalizadas para familiares y amigos como regalo especial
  - **Funcionalidad**: Los usuarios pueden ingresar datos de nacimiento de sus seres queridos
  - **Entrega**: Envío por email con diseño premium y mensaje personalizado
  - **Packaging**: PDF de alta calidad con diseño de regalo
  - **Personalización**: Mensaje personalizado del remitente
  - **Seguimiento**: Notificación cuando el regalo es abierto

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

### **Próximos Pasos Inmediatos (Esta Semana)**

#### **🔄 Prioridad 1: UX Carta Progresada y Agenda IA**
- [ ] **Arreglar UX carta progresada** - Mejorar interfaz y visualización
- [ ] **Corregir agenda IA** - Comprobar que está siendo alimentada correctamente por la IA
- [ ] **Generar todos los meses** - Asegurar que la agenda cubra todo el año astrológico
- [ ] **Arreglar UX general** - Mejorar experiencia de usuario en todo el flujo

#### **🌟 Prioridad 2: Generación Inteligente con IA (Septiembre 2025)**
- [ ] **Agenda astrológica completa** y personalizada con IA
- [ ] **Prompt engineering optimizado** para astrología personalizada
- [ ] **Generación de interpretaciones** basadas en carta natal + progresada
- [ ] **Consejos específicos** según tránsitos personales
- [ ] **Endpoint**: `/api/astrology/generate-agenda-ai`

#### **🚀 Prioridad 3: Deploy y Testing**
- [ ] **Deploy con últimas correcciones** - Implementar todas las mejoras
- [ ] **Testing exhaustivo** - Verificar funcionalidad completa
- [ ] **Optimización de performance** - Mejorar tiempos de carga

### **Septiembre 2025 - Objetivos del Mes**
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
**Próximo hito**: IA + Eventos anuales (Septiembre 2025) 🎯  
**Funcionalidad estrella**: Google Calendar Integration (Agosto 2025) 🚀  
**Visión**: La app de astrología más práctica y útil del mercado hispanohablante 🌟