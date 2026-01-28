# Tu Vuelta al Sol — LO QUE FALTA

**Última actualización:** 28 enero 2026

---

## PRIORIDAD 1 — BUGS CRÍTICOS DEL LIBRO

### 1.1 Optimizar generación del libro (NO regenerar lo que ya existe)
**Estado:** DISEÑADO, pendiente implementar
**Problema:** `generate-book/route.ts` pide a OpenAI que regenere TODO (8000 tokens),
incluyendo datos que ya existen en BD (interpretación natal, retorno solar, eventos).
**Solución:**
- Extraer de BD: tema del año, planeta dominante, propósito, superpoderes,
  desafíos, rituales, mantra del año, insights, advertencias, comparaciones planetarias
- Pasar como CONTEXTO al prompt, no pedir que los regenere
- OpenAI solo genera: portada, carta bienvenida, 12 portadas mes, cierre, frase final
- Reducción estimada: de ~8000 tokens salida → ~3000 tokens (ahorro 60%)
- Coste actual: ~$0.15-0.25 por libro → Objetivo: ~$0.06-0.10

### 1.2 Calendario empieza en mes del cumpleaños
**Estado:** FIX PUSHEADO (commit `65ec163`)
- Si cumpleaños es febrero y hoy es enero 2026, ciclo = Feb 2025 → Feb 2026
- Corregido en `generate-book/route.ts`

### 1.3 Luna Nueva y Luna Llena en el mismo día
**Estado:** FIX PUSHEADO (commit `6fab685`)
- `SearchMoonPhase(2)` → `SearchMoonPhase(180)` (180° = Luna Llena)

### 1.4 Impresión A5 con page breaks
**Estado:** FIX PUSHEADO (commit `6fab685`)
- `print-libro.css` ahora se importa en `libro/page.tsx`

### 1.5 Índice con meses del ciclo solar (no Ene-Dic)
**Estado:** FIX PUSHEADO (commit `6fab685`)
- Indice recibe `startDate` y genera meses reales: Feb 2025, Mar 2025... Ene 2026

---

## PRIORIDAD 2 — FUNCIONALIDADES DEL LIBRO

### 2.1 Exportar calendario a Outlook/Gmail (iCal/ICS)
**Estado:** PENDIENTE — NUEVA FUNCIONALIDAD
**Descripción:** Generar archivo .ics con todos los eventos del año solar
para que el usuario pueda importarlo en Outlook, Google Calendar, Apple Calendar.
**Implementación:**
```
- Crear endpoint: POST /api/agenda/export-ics
- Recibe: userId, yearLabel
- Lee eventos del SolarCycle de BD
- Genera archivo .ics (formato iCalendar RFC 5545)
- Cada evento incluye:
  - SUMMARY: título (ej: "Luna Nueva en Acuario ♒")
  - DTSTART: fecha del evento
  - DESCRIPTION: interpretación personalizada resumida
  - CATEGORIES: tipo (luna-nueva, eclipse, retrogrado, ingreso)
  - VALARM: recordatorio 1 día antes
- Botón "Exportar a Calendario" en /agenda con opciones:
  - Descargar .ics (universal)
  - Link directo Google Calendar (gcal:// URL scheme)
  - Link directo Outlook (outlook:// URL scheme)
```
**Librerías:** `ics` (npm) o generación manual del formato
**Prioridad:** ALTA — diferenciador competitivo enorme

### 2.2 Completar exportación TXT del libro
**Estado:** PARCIAL
**Falta:**
- Secciones de terapia creativa en el TXT
- Interpretaciones de eventos por mes en el TXT
- Formato más limpio para los eventos (evitar duplicados Luna Nueva/Llena mismo día — ya corregido)

### 2.3 Mejorar separación de páginas en impresión PDF
**Estado:** CSS IMPORTADO, falta verificar
- Verificar que cada `print-page` ocupa exactamente 1 hoja A5
- Verificar que no se cortan contenidos entre páginas
- Ajustar padding/margin si contenido desborda

---

## PRIORIDAD 3 — SISTEMA DE PAGOS

### 3.1 Completar flujo Stripe
**Estado:** PARCIALMENTE IMPLEMENTADO
**Falta:**
- Webhook de confirmación de pago
- Activar flag `hasPurchasedAgenda` tras pago exitoso
- Página de éxito post-pago (`/compra/success`)
- Página de cancelación (`/compra/cancel`)
- Panel admin para ver pedidos

### 3.2 Sistema preview gratuita → pago
**Estado:** DISEÑADO (ver `ESTRATEGIA_PREVIEW_PAGO.md`)
**Implementación:**
- Usuarios gratuitos: 3 meses con interpretaciones AI
- Usuarios premium: 12 meses completos
- La lógica de límite ya existe en `generate-book/route.ts` (líneas 190-202)

---

## PRIORIDAD 4 — MEJORAS DE UX

### 4.1 Reemplazar emojis por iconos Lucide en eventos
**Estado:** PENDIENTE
- `getEventIcon()` en `agenda/page.tsx` usa emojis (🪐 🌙 ⏪)
- Reemplazar por componentes SVG de Lucide React

### 4.2 Lazy loading de componentes del libro
**Estado:** EN PROGRESO (ver `TRABAJO_EN_PROGRESO_CARGA_LAZY.md`)
- NO COMMITEAR hasta que esté completo

### 4.3 Regeneración automática del ciclo en cumpleaños
**Estado:** IMPLEMENTADO PARCIALMENTE
- Existe detección de `isDayAfterBirthday` en `agenda/page.tsx`
- Genera ciclo siguiente automáticamente
- Falta: notificación por email al usuario

---

## PRIORIDAD 5 — FUTURO

### 5.1 Generación PDF server-side con Puppeteer
**Estado:** PENDIENTE
- Actualmente se usa `window.print()` del navegador
- Para el libro físico (80€) necesitamos PDF generado en servidor
- Puppeteer ya está en `package.json` pero no se usa

### 5.2 Objetos simbólicos y tienda
**Estado:** DISEÑADO (ver `OBJETOS_SIMBOLICOS_Y_TIENDA.md`)
- Capa futura: objetos personalizados basados en carta natal
- Integración con tienda online

### 5.3 Modelo de datos Agenda dedicado
**Estado:** DISEÑADO (ver `ANALISIS_AGENDA_COMPLETO.md`)
- Modelo `Agenda` separado del `SolarCycle`
- Incluiría: agenda generada, eventos personalizados, metadata de generación
- No es urgente: `SolarCycle` + `EventInterpretation` cubren la funcionalidad actual

### 5.4 Limpiar documentación
**Estado:** PENDIENTE
- Archivar 5 archivos RESUMEN_SESION obsoletos
- Consolidar 3 archivos índice en 1 (`INDICE_DOCUMENTACION.md`)
- Mover docs completados a subcarpeta `documentacion/archivo/`

---

## PLAN OPTIMIZADO DE GENERACIÓN DEL LIBRO (detalle técnico)

### Estado actual (costoso):
```
generate-book/route.ts:
1. Lee NatalChart, Interpretation(natal), Interpretation(solar-return) de BD
2. Calcula eventos del año con astronomy-engine
3. Agrupa eventos por mes
4. Genera interpretaciones de eventos con OpenAI (loop de 24+ llamadas)
5. Genera contenido narrativo del libro con OpenAI (1 llamada grande, 8000 tokens)
6. Devuelve todo al frontend
```
**Coste total: ~$0.50-1.00 por libro + ~$0.78 por interpretaciones de eventos**

### Estado objetivo (optimizado):
```
generate-book/route.ts OPTIMIZADO:
1. Lee NatalChart, Interpretation(natal), Interpretation(solar-return) de BD
2. Lee SolarCycle con eventos ya calculados de BD (NO recalcular)
3. Lee EventInterpretation ya generadas de BD (NO regenerar)
4. Ensambla datos existentes en estructura del libro:
   - tu_mapa_interior.planeta_dominante = natal.planeta_dominante
   - tu_mapa_interior.soul_chart = natal.patron_energetico + desafios
   - tu_año_astrologico = solar-return.tema_central + comparaciones
   - calendario = SolarCycle.events + EventInterpretation
5. Pide a OpenAI SOLO texto narrativo nuevo (~3000 tokens):
   - portada (título, subtítulo, dedicatoria)
   - carta_de_bienvenida (150 palabras)
   - 12x portada_mes + ritual_del_mes + mantra (cortos)
   - cierre_del_ciclo (200 palabras)
   - frase_final (30 palabras)
6. Devuelve todo al frontend
```
**Coste objetivo: ~$0.06-0.10 por libro (reducción 80-90%)**
**Tiempo: de ~2-3 min → ~15-30 seg**

### Datos reutilizables (ya en BD):
| Campo del libro | Fuente en BD | Campo exacto |
|---|---|---|
| Planeta dominante | Interpretation(natal) | `planeta_dominante` |
| Propósito de vida | Interpretation(natal) | `proposito_vida` |
| Patrón energético | Interpretation(natal) | `patron_energetico` |
| Superpoderes | Interpretation(natal) | `super_poderes[]` |
| Desafíos evolutivos | Interpretation(natal) | `desafios_evolutivos[]` |
| Tema del año | Interpretation(SR) | `tema_central_del_anio` |
| Mantra del año | Interpretation(SR) | `declaracion_poder_anual` |
| Rituales | Interpretation(SR) | `rituales_recomendados[]` |
| Insights | Interpretation(SR) | `insights_transformacionales[]` |
| Advertencias | Interpretation(SR) | `advertencias[]` |
| Eventos clave | Interpretation(SR) | `eventos_clave_del_anio[]` |
| Comparaciones planetarias | Interpretation(SR) | Secciones por planeta (Sol, Luna, etc.) |
| Eventos del año | SolarCycle | `events[]` (78 eventos) |
| Interpretación por evento | EventInterpretation | `interpretation` por cada evento |
