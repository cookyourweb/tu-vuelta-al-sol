tu-vuelta-al-sol/
├── src/app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── agenda/page.tsx              # Página principal agenda
│   │   └── progressed-chart/page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin/
│   │   │   ├── birth-data/route.ts
│   │   │   ├── delete-user/route.ts
│   │   │   └── users/route.ts
│   │   ├── astrology/
│   │   │   ├── generate-agenda-ai/      # ✅ IA personalizada
│   │   │   ├── complete-events/         # ✅ Eventos + interpretación
│   │   │   ├── interpret-events/        # ✅ IA interpretación
│   │   │   ├── events/                  # 🔄 Eventos astrológicos
│   │   │   └── ChartLoader.tsx
│   │   ├── birth-data/route.ts
│   │   ├── cache/route.ts
│   │   ├── charts/route.ts
│   │   ├── debug/route.ts
│   │   ├── debug-credentials/route.ts
│   │   ├── events/route.ts
│   │   ├── pdf/route.ts
│   │   ├── prokerala/route.ts
│   │   ├── test-mongodb/route.ts
│   │   └── users/route.ts
│   ├── clear-chart-cache/route.ts
│   ├── debug/page.tsx
│   ├── postman-test/page.tsx
│   ├── test-agenda-ai/page.tsx
│   ├── test-api/page.tsx
│   ├── test-chart-display/page.tsx
│   ├── test-natal-chart/page.tsx
│   ├── test-progressed/page.tsx
│   ├── test-timezone/page.tsx
│   ├── types/astrology.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── src/components/
│   ├── admin/DeleteUserForm.tsx
│   ├── astrology/
│   │   ├── AgendaAIDisplay.tsx
│   │   ├── AgendaLoadingStates.tsx
│   │   ├── AscendantCard.tsx
│   │   ├── AspectControlPanel.tsx
│   │   ├── AspectLines.tsx
│   │   ├── AstrologicalAgenda.tsx
│   │   ├── AstrologicalAgendaGenerator.tsx
│   │   ├── AstrologicalCalendar.tsx
│   │   ├── BirthDataCard.tsx
│   │   ├── BirthDataForm.tsx
│   │   ├── ChartDisplay.tsx
│   │   ├── ChartDisplaycompletosinrefactorizar.tsx
│   │   ├── ChartDisplayrefactorizadSinLineasniAspeectos.tsx
│   │   ├── ChartTooltips.tsx
│   │   ├── ChartWheel.tsx
│   │   ├── CombinedAscendantMCCard.tsx
│   │   ├── CosmicFootprint.tsx
│   │   ├── ElementsModalitiesCard.tsx
│   │   ├── HouseGrid.tsx
│   │   ├── MidheavenCard.tsx
│   │   ├── NatalChartWheel.tsx
│   │   ├── PlanetSymbol.tsx
│   │   ├── ProgressedChartVisual.tsx
│   │   ├── SectionMenu.tsx
│   │   └── tooltips/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/
│   │   ├── BirthDataForm.tsx
│   │   └── NatalChartCard.tsx
│   ├── debug/ForceRegenerateChart.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── PrimaryHeader.tsx
│   ├── test/
│   │   ├── AgendaAITest.tsx
│   │   ├── MongoDBTest.tsx
│   │   ├── NatalChartTest.tsx
│   │   ├── PostmanTest.tsx
│   │   ├── ProkeralaNatalTest.tsx
│   │   ├── SimpleTimezonetest.tsx
│   │   └── TimezoneTestComponent.tsx
│   └── ui/
│       ├── Alert.tsx
│       ├── Button.tsx
│       └── Input.tsx
├── src/constants/
│   ├── astrology.ts
│   └── astrology/
│       ├── chartConstants.ts
│       └── progressedChartConstants.ts
├── src/context/
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── src/hooks/
│   ├── useAspects.ts
│   ├── useChart.ts
│   ├── useChartDisplay.ts
│   ├── usePlanets.ts
│   ├── useProkeralaApi.ts
│   └── astrology/
│   └── lib/
│       ├── db.ts
│       ├── firebase.ts
│       └── utils.ts
├── src/lib/
│   ├── db.ts
│   ├── firebase.ts
│   ├── firebaseAdmin.ts
│   ├── utils.ts
│   └── prokerala/
│       ├── client.ts
│       ├── endpoints.ts
│       ├── types.ts
│       └── utils.ts
├── src/models/
│   ├── BirthData.ts
│   ├── Chart.ts
│   └── User.ts
├── src/services/
│   ├── astrologicalEventsService.ts
│   ├── astrologyService.ts
│   ├── chartCalculationsService.ts
│   ├── chartInterpretationsService.ts
│   ├── chartRenderingService.tsx
│   ├── progressedChartService.ts
│   ├── prokeralaService.ts
│   ├── trainedAssistantService.ts
│   └── userDataService.ts
├── src/types/
│   └── astrology/
│       ├── aspects.ts
│       ├── basic.ts
│       ├── chart.ts
│       ├── chartConstants.ts
│       ├── chartDisplay.ts
│       ├── index.ts
│       └── utils.ts
├── src/utils/
│   ├── agendaCalculator.ts
│   ├── dateTimeUtils.ts
│   └── astrology/
│       ├── aspectCalculations.ts
│       ├── coordinateUtils.ts
│       ├── degreeConverter.ts
│       ├── events.ts
│       └── planetPositions.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── site.webmanifest
│   ├── vercel.svg
│   └── window.svg
├── scripts/
│   ├── fix-quotes.sh
│   └── professional-quote-fix.sh
├── .gitignore
├── .vercelignore
├── debug-token.js
├── eslint.config.mjs
├── fix-import-PostmanTest.txt
├── jest.config.js
├── jest.setup.ts
├── next.config.js
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── Prokerala_Carta_Natal.postman_collection.json
├── prokerala-token-test.js
├── README.md
├── tsconfig.json
└── vercel.json
