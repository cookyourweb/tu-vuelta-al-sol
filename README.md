# Tu Vuelta al Sol

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

El proyecto está organizado de la siguiente manera:

```
/ (raíz del proyecto)
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
│   │   │   │   ├── test-postman/
│   │   │   │   │   └── route.ts
│   │   │   ├── birth-data/
│   │   │   │   └── route.ts
│   │   │   ├── charts/
│   │   │   │   ├── natal/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── progressed/
│   │   │   │   │   └── route.ts
│   │   │   ├── events/
│   │   │   │   ├── astrological/
│   │   │   │   │   └── route.ts
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
│   │   │   ├── token/
│   │   │   │   └── route.ts
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
│   │   ├── test-progressed/
│   │   │   └── page.tsx
│   │   ├── test-timezone/
│   │   │   └── page.tsx
│   │   ├── types/
│   │   │   └── astrology.ts
│   ├── components/
│   │   ├── astrology/
│   │   │   ├── AspectLines.tsx
│   │   │   ├── AstrologicalAgenda.tsx
│   │   │   ├── AstrologicalAgendaGenerator.tsx
│   │   │   ├── BirthDataForm.tsx
│   │   │   ├── ChartDisplay.tsx
│   │   │   ├── ChartTooltips.tsx
│   │   │   ├── ChartWheel.tsx
│   │   │   ├── CosmicFootprint.tsx
│   │   │   ├── HouseGrid.tsx
│   │   │   ├── NatalChartWheel.tsx
│   │   │   ├── PlanetSymbol.tsx
│   │   │   ├── ProgressedChartVisual.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   ├── dashboard/
│   │   │   ├── BirthDataForm.tsx
│   │   │   ├── NatalChartCard.tsx
│   │   ├── debug/
│   │   │   ├── ForceRegenerateChart.tsx
│   │   ├── forms/
│   │   │   ├── EnhancedBirthDataForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAspects.ts
│   │   │   ├── useChart.ts
│   │   │   ├── usePlanets.ts
│   │   │   ├── useProkeralaApi.ts
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── PrimaryHeader.tsx
│   │   ├── test/
│   │   │   ├── NatalChartTest.tsx
│   │   │   ├── PostmanTest.tsx
│   │   │   ├── ProkeralaNatalTest.tsx
│   │   │   ├── SimpleTimezonetest.tsx
│   │   │   ├── TimezoneTestComponent.tsx
│   │   ├── ui/
│   │   │   ├── Alert.tsx
│   │   │   ├── Button.tsx
│   ├── constants/
│   │   └── astrology.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── NotificationContext.tsx
│   ├── hooks/
│   │   ├── useChartDisplay.ts
│   ├── lib/
│   │   ├── db.ts
│   │   ├── firebase.ts
│   │   ├── utils.ts
│   │   ├── prokerala/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   ├── types.ts
│   │   │   ├── utils.ts
│   ├── models/
│   │   ├── BirthData.ts
│   │   ├── Chart.ts
│   │   ├── User.ts
│   ├── services/
│   │   ├── astrologyService.ts
│   │   ├── chartCalculationsService.ts
│   │   ├── chartInterpretationsService.ts
│   │   ├── progressedChartService.ts
│   │   ├── prokeralaService.ts
│   ├── types/
│   │   ├── astrology/
│   │   │   ├── chartDisplay.ts
│   │   ├── astrology.ts
│   ├── utils/
│   │   ├── dateTimeUtils.ts
│   │   ├── astrology/
│   │   │   ├── aspectCalculations.ts
│   │   │   ├── coordinateUtils.ts
│   │   │   ├── degreeConverter.ts
│   │   │   ├── planetPositions.ts
├── types/
│   ├── astrology/
│   │   ├── aspects.ts
│   │   ├── basic.ts
│   │   ├── chart.ts
│   │   ├── index.ts
│   │   ├── utils.ts


```

### Funcionalidades Principales:
1. Carta natal con precisión máxima usando Swiss Ephemeris
2. Carta progresada para el año actual desde la fecha de nacimiento del año en curso, hasta la fecha de nacimiento del año siguiente.
3. Eventos astrológicos anuales completos (retrogradaciones, lunas, eclipses)
4. Agenda personalizada con IA usando prompts específicos
5. Integración Google Calendar (funcionalidad estrella única)
6. Consejos accionables basados en tránsitos personales
7. Sistema de pagos y suscripciones
8. Generación PDF de alta calidad

## Ajustes Críticos para Prokerala API

### Parámetros obligatorios para precisión máxima:

```javascript
const criticalParams = {
  'profile[datetime]': '1974-02-10T07:30:00+01:00',  // Formato ISO con timezone
  'profile[coordinates]': '40.4164,-3.7025',          // Coordenadas precisas (4 decimales)
  'ayanamsa': '0',                                    // 0=Tropical, 1=Sideral
  'house_system': 'placidus',                         // Sistema de casas
  'birth_time_rectification': 'flat-chart',          // flat-chart | true-sunrise-chart
  'aspect_filter': 'all',                             // all | major | minor
  'la': 'es'                                          // Idioma español
};
```

### Endpoints Prokerala funcionando correctamente:

- Carta Natal: `POST /api/astrology/natal-chart-accurate`
- Carta Progresada: `POST /api/astrology/progressed-chart-accurate`
- Eventos Astrológicos Anuales: `GET /api/astrology/annual-events?year=2025&latitude=40.4164&longitude=-3.7025`
- Búsqueda de Lugares: `GET /api/astrology/location-search?q=Madrid`
- Validador de Datos de Nacimiento: `POST /api/astrology/validate-birth-data`

## Roadmap Completo

- Fase 1: Foundation Astrológica (Mayo 2025 - Actual)
- Fase 2: Generación Inteligente con IA (Julio 2025)
- Fase 3: Monetización y Sistema de Pagos (Julio 2025)
- Fase 4: Integración Google Calendar (Agosto 2025)
- Fase 5: Expansión y Optimización (Septiembre - Diciembre 2025)

## Contacto

Email: wunjocreations@gmail.com  
Repositorio: Privado  
Despliegue: Vercel  

Última actualización: 27 Mayo 2025  
Estado del proyecto: Foundation astrológica completa  
Próximo hito: IA + Eventos anuales (Junio 2025)  
Funcionalidad estrella: Google Calendar Integration (Agosto 2025)  
Visión: La app de astrología más práctica y útil del mercado hispanohablante
