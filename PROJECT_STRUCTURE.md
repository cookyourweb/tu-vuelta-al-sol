# Proyecto Agenda Tu Vuelta al Sol - Estructura de Archivos

## Archivos Raíz
- `.gitignore`
- `.vercelignore`
- `debug-token.js`
- `eslint.config.mjs`
- `fix-import-PostmanTest.txt`
- `jest.config.js`
- `jest.setup.ts`
- `next.config.js`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `PLAN_ACCION_INTERPRETACION.md`
- `postcss.config.mjs`
- `PROJECT_STRUCTURE.md`
- `Prokerala_Carta_Natal.postman_collection.json`
- `prokerala-response.json`
- `prokerala-token-test.js`
- `README.md`
- `test-books.ts`
- `test-build-no-openai.ts`
- `test-force-regenerate.js`
- `test-prokerala-connection.js`
- `test-prokerala-fixed.js`
- `test-simple-prokerala.js`
- `TODO.md`
- `tsconfig.json`
- `vercel.env`
- `vercel.json`

## Directorio `astrology_books/`
- `chunks.json`

## Directorio `public/`
- `file.svg`
- `globe.svg`
- `next.svg`
- `site.webmanifest`
- `vercel.svg`
- `window.svg`

## Directorio `scripts/`
- `cleanup-all-interpretations.js`
- `clear-cache.js`
- `compare-birth-data.js`
- `diagnose-collections.js`
- `diagnose-mongodb.js`
- `fix-quotes.sh`
- `insert-test-user-birthdata.js`
- `manage-cache.js`
- `migrate-test-to-astrology.js`
- `parse_and_chunk_pdfs.js`
- `professional-quote-fix.sh`
- `prokerala-diagnostic.js`
- `verify-solar-return.ts`

## Directorio `src/`

### `src/app/`
- `favicon.ico`
- `globals.css`
- `layout.tsx`
- `page.tsx`

#### `src/app/(auth)/`
- `login/`
- `register/`

#### `src/app/(dashboard)/`
- `layout.tsx`
- `agenda/`
- `birth-data/`
- `dashboard/`
- `natal-chart/`
- `profile/`
- `solar-return/`

#### `src/app/admin/`
- `page.tsx`

#### `src/app/api/`

##### `src/app/api/admin/`
- *(vacío)*

##### `src/app/api/astrology/`
- `ChartLoader.tsx`
- `complete-events/`
- `generate-agenda-ai/`
- `get-agenda/`
- `interpret-chunk/`
- `interpret-events/`
- `interpret-natal/`
- `interpret-natal-clean/`
- `interpret-solar/`
- `interpret-solar-return/`
- `interpretations/`
- `natal-chart/`
- `progressed-chart-accurate/`
- `progressed-interpretation/`
- `simple-agenda/`
- `test-postman/`

##### `src/app/api/birth-data/`
- `route.ts`
- `all/`

##### `src/app/api/cache/`
- *(vacío)*

##### `src/app/api/charts/`
- `natal/`
- `progressed/`
- `solar-return/`

##### `src/app/api/debug/`
- *(vacío)*

##### `src/app/api/debug-auth/`
- *(vacío)*

##### `src/app/api/debug-auth-context/`
- *(vacío)*

##### `src/app/api/debug-credentials/`
- *(vacío)*

##### `src/app/api/debug-firebase/`
- *(vacío)*

##### `src/app/api/events/`
- *(vacío)*

##### `src/app/api/geocode/`
- *(vacío)*

##### `src/app/api/interpretations/`
- `clear-cache/`
- `save/`

##### `src/app/api/pdf/`
- *(vacío)*

##### `src/app/api/prokerala/`
- `client-v2.ts`
- `utils.ts`
- `chart/`
- `direct-test/`
- `location-search/`
- `natal-chart/`
- `natal-horoscope/`
- `progressed-chart/`
- `test/`
- `test-page/`
- `token/`

##### `src/app/api/reverse-geocode/`
- *(vacío)*

##### `src/app/api/test-mongodb/`
- *(vacío)*

##### `src/app/api/users/`
- `route.ts`

#### `src/app/clear-chart-cache/`
- `route.ts`

#### `src/app/debug/`
- `page.tsx`

#### `src/app/postman-test/`
- `page.tsx`

#### `src/app/test-agenda-ai/`
- `page.tsx`

#### `src/app/test-api/`
- `page.tsx`

#### `src/app/test-chart-display/`
- `page.tsx`

#### `src/app/test-mongodb/`
- `page.tsx`

#### `src/app/test-natal-chart/`
- `page.tsx`

#### `src/app/test-progressed/`
- `page.test.tsx`
- `page.tsx`

#### `src/app/test-timezone/`
- `page.tsx`

#### `src/app/types/`
- `astrology.ts`

### `src/components/`

#### `src/components/admin/`
- `BirthDataAdminTable.tsx`
- `DeleteUserForm.tsx`

#### `src/components/astrology/`
- `AgendaAIDisplay.tsx`
- `AgendaLoadingStates.tsx`
- `AscendantCard.tsx`
- `AspectControlPanel.tsx`
- `AspectLines.tsx`
- `AstrologicalAgenda.tsx`
- `AstrologicalAgendaGenerator.tsx`
- `AstrologicalCalendar.tsx`
- `BirthDataCard.tsx`
- `BirthDataForm.tsx`
- `ChartComparisonComponent.tsx`
- `ChartDisplay.tsx`
- `ChartTooltips.tsx`
- `ChartWheel.tsx`
- `CombinedAscendantMCCard.tsx`
- `CosmicFootprint.tsx`
- `ElementsModalitiesCard.tsx`
- `HouseGrid.tsx`
- `InterpretationButton.tsx`
- `InterpretationDisplay.tsx`
- `MidheavenCard.tsx`
- `NatalChartWheel.tsx`
- `PlanetSymbol.tsx`
- `ProgressedChartVisual.tsx`
- `ProgressedInterpretationDisplay.tsx`
- `SectionMenu.tsx`

##### `src/components/astrology/tooltips/`
- *(vacío)*

#### `src/components/auth/`
- `LoginForm.tsx`
- `RegisterForm.tsx`

#### `src/components/dashboard/`
- `BirthDataForm.tsx`
- `NatalChartCard.tsx`

#### `src/components/debug/`
- `ForceRegenerateChart.tsx`

#### `src/components/layout/`
- `Footer.tsx`
- `PrimaryHeader.tsx`

#### `src/components/test/`
- `AgendaAITest.tsx`

#### `src/components/ui/`
- `Alert.tsx`
- `Button.tsx`
- `FloatingActionPanel.tsx`
- `Input.tsx`

### `src/constants/`
- `astrology.ts`

#### `src/constants/astrology/`
- `chartConstants.ts`
- `progressedChartConstants.ts`
- `psychologicalTooltips.ts`

### `src/context/`
- `AuthContext.tsx`
- `NotificationContext.tsx`

### `src/hooks/`

#### `src/hooks/astrology/`
- `useChartDisplay.ts`

#### `src/hooks/lib/`
- `db.ts`
- `firebase.ts`
- `utils.ts`
- `prokerala/`

### `src/lib/`
- `db.ts`
- `firebase-client.ts`
- `firebase.ts`
- `firebaseAdmin.ts`
- `utils.ts`

#### `src/lib/firebase/`
- `admin.ts`
- `client.ts`
- `config.ts`
- `index.ts`

#### `src/lib/prokerala/`
- `client.ts`
- `endpoints.ts`
- `types.ts`
- `utils.ts`

### `src/models/`
- `AIUsage.ts`
- `BirthData.ts`
- `Chart.ts`
- `Interpretation.ts`
- `User.ts`

### `src/services/`
- `astrologicalEventsService.ts`
- `astrologyService.ts`
- `batchInterpretations.ts`
- `cacheService.ts`
- `chartCalculationsService.ts`
- `chartInterpretationsService.ts`
- `chartRenderingService.tsx`
- `educationalInterpretationService.ts`
- `educationalInterpretationService.ts.backup`
- `progressedChartService.tsx`
- `prokeralaService.ts`
- `solarReturnInterpretationService.ts`
- `trainedAssistantService.ts`
- `trainedAssistantService.ts.bak`
- `userDataService.ts`

### `src/types/`

#### `src/types/astrology/`
- `aspects.ts`
- `basic.ts`
- `chart.ts`
- `chartConstants.ts`
- `chartDisplay.ts`
- `chartDisplaycopy.ts`
- `index.ts`
- `interpretation.ts`
- `unified-types.ts`
- `utils.ts`

### `src/utils/`
- `agendaCalculator.ts`
- `dateTimeUtils.ts`

#### `src/utils/astrology/`
- `agendaDateCalculator.ts`
- `aspectCalculations.ts`
- `completeEventGenerator.ts`
- `coordinateUtils.ts`
- `degreeConverter.ts`
- `disruptiveMotivationalSystem.ts`
- `enrichUserProfile.ts`
- `events.ts`
- `extractAstroProfile.ts`
- `generateCharts.ts`
- `intelligentFallbacks.ts`
- `planetPositions.ts`
- `solarReturnComparison.ts`

#### `src/utils/prompts/`
- `disruptivePrompts.ts`
- `solarReturnPrompts.ts`
