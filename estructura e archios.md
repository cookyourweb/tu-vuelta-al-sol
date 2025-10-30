

### Estructura de Archivos Actualizada

El proyecto está organizado de la siguiente manera:

```
tu-vuelta-al-sol/
├── .DS_Store
├── .env
├── .env.local
├── .gitignore
├── .vercelignore
├── debug-token.js
├── eslint.config.mjs
├── estructura e archios.md
├── fix-import-PostmanTest.txt
├── jest.config.js
├── jest.setup.ts
├── next-env.d.ts
├── next.config.js
├── next.config.ts
├── package-lock.json
├── package.json
├── PLAN_ACCION_INTERPRETACION.md
├── postcss.config.mjs
├── Prokerala_Carta_Natal.postman_collection.json
├── prokerala-response.json
├── prokerala-token-test.js
├── README.md
├── test-books.ts
├── test-build-no-openai.ts
├── test-force-regenerate.js
├── test-prokerala-connection.js
├── test-prokerala-fixed.js
├── test-simple-prokerala.js
├── TODO.md
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── vercel.env
├── vercel.json
├── .git/
├── .next/
├── .qodo/
├── .vscode/
├── astrology_books/
│   ├── chunks.json
│   ├── pdfcoffee.com_astrology-of-personality-dane-rudhyarpdf-pdf-free.pdf
│   ├── pdfcoffee.com_117800510-jan-spiller-astrology-for-the-soulpdf-4-pdf-free.pdf
│   ├── pdfcoffee.com_astrology-of-personality-dane-rudhyarpdf-pdf-free (3).pdf
│   ├── pdfcoffee.com-dane-rudhyar-las-casas-astrologicaspdf.pdf
│   ├── pdfcoffee.com_pluto-volume-1-the-evolutionary-journey-of-the-soul-by-green-jeffrey-wolf-z-liborgpdf-pdf-free.pdf
│   ├── pdfcoffee.com_steven-forrest-inner-sky-pdf-free.pdf
│   ├── Ptolomeo Claudius - Tetrabiblos.pdf
│   ├── kupdf.net_william-lilly-christian-astrology-3-books.pdf
├── documentacion/
│   └── BUGDEAPIS/
│       ├── ANALISIS_MATEMATICO_DEFINITIVO.md
│       ├── ANALISIS_OSCAR_CORRECCIONES.md
│       ├── PRUEBA_VISUAL_SIMPLE.md
│       └── ResumenEjecutivoBuyMedioCielo.md
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── site.webmanifest
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── check-chart-data.js
│   ├── cleanup-all-interpretations.js
│   ├── clear-cache.js
│   ├── compare-birth-data.js
│   ├── diagnose-collections.js
│   ├── diagnose-mongodb.js
│   ├── fix-quotes.sh
│   ├── insert-test-user-birthdata.js
│   ├── manage-cache.js
│   ├── migrate-test-to-astrology.js
│   ├── parse_and_chunk_pdfs.js
│   ├── professional-quote-fix.sh
│   ├── prokerala-diagnostic.js
│   ├── test-ascendant-mc-calculation.js
│   ├── test-ascendant-mc-fix.js
│   ├── test-ascendant-mc-verification-FIXED.js
│   ├── test-ascendant-wc-verification.js
│   ├── test-mc-calculation.js
│   ├── test-mc-direct.js
│   ├── test-oscar.js
│   ├── test-vero.js
│   ├── verification-script.js
│   └── verify-solar-return.ts
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── layout.tsx.backup
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │   └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── agenda/
│   │   │   │   └── page.tsx
│   │   │   ├── birth-data/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── natal-chart/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── solar-return/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── delete-user/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── update-role/
│   │   │   │   │   └── route.ts
│   │   │   │   └── users/
│   │   │   │   └── route.ts
│   │   │   ├── astrology/
│   │   │   │   ├── complete-events/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── generate-agenda-ai/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── get-agenda/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interpret-chunk/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interpret-events/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interpret-natal/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interpret-natal-clean/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interpret-solar/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interpret-solar-return/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── interpretations/
│   │   │   │   │   └── save/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── natal-chart/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── progressed-chart-accurate/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── progressed-interpretation/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── simple-agenda/
│   │   │   │   │   └── route.ts
│   │   │   ├── birth-data/
│   │   │   │   └── route.ts
│   │   │   ├── cache/
│   │   │   │   ├── check/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── invalidate/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── save/
│   │   │   │   │   └── route.ts
│   │   │   │   └── stats/
│   │   │   │   └── route.ts
│   │   │   ├── charts/
│   │   │   │   ├── natal/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── progressed/
│   │   │   │   │   └── route.ts
│   │   │   │   └── solar-return/
│   │   │   │   └── route.ts
│   │   │   ├── debug/
│   │   │   │   ├── assistant/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── assistants/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── auth/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── auth-context/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── credentials/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── firebase/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── mongodb/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── debug-auth/
│   │   │   │   └── route.ts
│   │   │   ├── debug-auth-context/
│   │   │   │   └── route.ts
│   │   │   ├── debug-credentials/
│   │   │   │   └── route.ts
│   │   │   ├── debug-firebase/
│   │   │   │   └── route.ts
│   │   │   ├── events/
│   │   │   │   └── astrological/
│   │   │   │   └── route.ts
│   │   │   ├── geocode/
│   │   │   │   └── route.ts
│   │   │   ├── interpretations/
│   │   │   │   ├── clear-cache/
│   │   │   │   │   └── route.ts
│   │   │   │   └── save/
│   │   │   │   └── route.ts
│   │   │   ├── pdf/
│   │   │   │   └── generate/
│   │   │   │   └── route.ts
│   │   │   ├── prokerala/
│   │   │   │   ├── chart/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── client-v2.ts
│   │   │   │   ├── direct-test/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── location-search/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── natal-chart/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── natal-horoscope/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── progressed-chart/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── test/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── test-page/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── token/
│   │   │   │   └── route.ts
│   │   │   ├── reverse-geocode/
│   │   │   │   └── route.ts
│   │   │   ├── test-mongodb/
│   │   │   │   └── route.ts
│   │   │   ├── test-mongodb2/
│   │   │   │   └── route.ts
│   │   │   ├── users/
│   │   │   │   └── route.ts
│   │   ├── clear-chart-cache/
│   │   │   └── route.ts
│   │   ├── debug/
│   │   │   └── page.tsx
│   │   ├── tests/
│   │   │   ├── postman-test/
│   │   │   │   └── page.tsx
│   │   │   ├── test-agenda-ai/
│   │   │   │   └── page.tsx
│   │   │   ├── test-api/
│   │   │   │   └── page.tsx
│   │   │   ├── test-chart-display/
│   │   │   │   └── page.tsx
│   │   │   ├── test-mc-calculation/
│   │   │   │   └── page.tsx
│   │   │   ├── test-mongodb/
│   │   │   │   └── page.tsx
│   │   │   ├── test-mongodb2/
│   │   │   │   └── page.tsx
│   │   │   ├── test-natal-chart/
│   │   │   │   ├── page.tsx
│   │   │   │   └── page.tsx.backup
│   │   │   ├── test-postman/
│   │   │   │   └── page.tsx
│   │   │   ├── test-progressed/
│   │   │   │   ├── page.test.tsx
│   │   │   │   └── page.tsx
│   │   │   └── test-timezone/
│   │   │   └── page.tsx
│   │   └── types/
│   │   └── astrology.ts
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
│   │   │   ├── ChartComparisonComponent.tsx
│   │   │   ├── ChartDisplay.tsx
│   │   │   ├── ChartTooltips.tsx
│   │   │   ├── ChartWheel.tsx
│   │   │   ├── CombinedAscendantMCCard.tsx
│   │   │   ├── CosmicFootprint.tsx
│   │   │   ├── ElementsModalitiesCard.tsx
│   │   │   ├── HouseGrid.tsx
│   │   │   ├── InterpretationButton.tsx
│   │   │   ├── InterpretationDisplay.tsx
│   │   │   ├── InterpretationDrawer.tsx
│   │   │   ├── MidheavenCard.tsx
│   │   │   ├── NatalChartWheel.tsx
│   │   │   ├── PlanetSymbol.tsx
│   │   │   ├── ProgressedChartVisual.tsx
│   │   │   ├── SectionMenu.tsx
│   │   │   └── tooltips/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── BirthDataForm.tsx
│   │   │   │   └── NatalChartCard.tsx
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
│   ├── data/
│   │   ├── astrology.ts
│   │   └── interpretations/
│   │   │   ├── aspectInterpretations.ts
│   │   │   ├── lunarInterpretations.ts
│   │   │   └── solarInterpretations.ts
│   ├── hooks/
│   │   ├── useAspects.ts
│   │   ├── useChart.ts
│   │   ├── useChartDisplay.ts
│   │   ├── useInterpretationDrawer.ts
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
│   │   ├── Interpretation.ts
│   │   └── User.ts
│   ├── services/
│   │   ├── astrologicalEventsService.ts
│   │   ├── astrologyService.ts
│   │   ├── batchInterpretations.ts
│   │   ├── cacheService.ts
│   │   ├── chartCalculationsService.ts
│   │   ├── chartInterpretationsService.ts
│   │   ├── chartRenderingService.tsx
│   │   ├── educationalInterpretationService.ts
│   │   ├── educationalInterpretationService.ts.backup
│   │   ├── progressedChartService.tsx
│   │   ├── prokeralaService.ts
│   │   ├── solarReturnInterpretationService.ts
│   │   ├── trainedAssistantService.ts
│   │   ├── trainedAssistantService.ts.bak
│   │   └── userDataService.ts
│   ├── types/
│   │   ├── interpretations.ts
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

### Estadísticas del Proyecto

- **Total de archivos**: 324 (excluyendo node_modules, .next, .git)
- **Total de directorios**: 126
- **Líneas de código totales**: 1,471,012
  - TypeScript/TSX: 109,446 líneas
  - JavaScript: 7,114 líneas
  - Markdown: 6,212 líneas
  - JSON: 52,482 líneas
  - TXT: 11 líneas

### Descripción de Directorios Principales

- **astrology_books/**: Contiene libros de astrología en PDF y un archivo de chunks procesados.
- **documentacion/**: Documentación técnica sobre bugs y análisis de APIs.
- **public/**: Archivos estáticos para el frontend (iconos, manifest, etc.).
- **scripts/**: Scripts de prueba, verificación y mantenimiento.
- **src/**: Código fuente de la aplicación Next.js.
  - **app/**: Páginas y rutas API de Next.js App Router.
  - **components/**: Componentes React reutilizables.
  - **constants/**: Constantes de astrología.
  - **context/**: Contextos de React para estado global.
  - **data/**: Datos estáticos de interpretaciones astrológicas.
  - **hooks/**: Hooks personalizados de React.
  - **lib/**: Utilidades y configuraciones de bibliotecas.
  - **models/**: Modelos de datos para MongoDB.
  - **services/**: Servicios de negocio y APIs externas.
  - **types/**: Definiciones de tipos TypeScript.
  - **utils/**: Utilidades generales y cálculos astrológicos.
