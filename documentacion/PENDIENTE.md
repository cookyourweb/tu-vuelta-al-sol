# Tu Vuelta al Sol — LO QUE FALTA

**Ultima actualizacion:** 7 febrero 2026

---

## VISION DE LA AGENDA TOP

La agenda debe ser una **guia hiper-personalizada** que:
1. **PRIMERO** te cuente QUIEN ERES (Carta Natal)
2. **SEGUNDO** te explique QUE SE ACTIVA ESTE AÑO (Retorno Solar)
3. **TERCERO** te deje REFLEXIONAR y poner intencion (despues de entender)
4. **CUARTO** te GUIE mes a mes con eventos personalizados (no genericos)
5. **QUINTO** te permita CERRAR el ciclo con reflexion

**Principio fundamental**: Espacios para escribir SIEMPRE despues de la interpretacion.

---

## PRIORIDAD 1 — SINCRONIZACION DATOS + LIBRO AGENDA (TODOS LOS MESES)

### 1.1 Sincronizar interpretaciones con el libro para TODOS los meses
**Estado:** EN PROGRESO
**Objetivo:** Que los 12 meses del ciclo solar tengan interpretaciones personalizadas completas en el libro.
**Problema actual:** Algunas interpretaciones no se sincronizan correctamente entre el SolarCycle y el libro.
**Fix reciente:** `useInterpretaciones.ts` ahora lee `cycle.start`/`cycle.end` en vez de `cycle.cycleStart`/`cycleEnd` (campo renombrado por `formatForDisplay`).
**Archivos clave:**
- `src/hooks/useInterpretaciones.ts`
- `src/app/api/agenda/generate-book/route.ts`
- `src/utils/formatInterpretationForBook.ts`
- `src/components/agenda/AgendaLibro/TransitosDelMes.tsx`

### 1.2 Modelo FREEMIUM: Solo 2 meses gratis
**Estado:** PENDIENTE
**Descripcion:** Cuando todo funcione, los usuarios gratuitos solo ven 2 meses del ciclo.
- Blur/candado en meses 3-12
- CTA: "Desbloquea tu ciclo completo" → /compra/agenda
- Los 2 meses gratis sirven como preview del valor real
**Archivos a modificar:**
- `src/components/agenda/AgendaLibro/index.tsx` (logica de bloqueo)
- `src/app/(dashboard)/agenda/page.tsx` (verificacion de compra)

### 1.3 Espacios para escribir DESPUES de interpretaciones
**Estado:** PENDIENTE
**Problema:** "Primer dia de tu ciclo" con espacio para escribir aparece ANTES de interpretaciones.
**Solucion:**
- Mover "Primer dia del ciclo" DESPUES de Carta Natal + Retorno Solar
- Copy: "Ahora que ya has leido quien eres y que se activa este año..."
**Archivos:**
- `src/components/agenda/AgendaLibro/index.tsx`
- `src/components/agenda/AgendaLibro/PaginasEspeciales.tsx`

### 1.4 Sincronizar TXT con libro visual
**Estado:** PENDIENTE
**Problema:** `handleExportTXT()` tiene orden diferente al libro renderizado.
**Solucion:** Reescribir para seguir mismo orden que libro visual.

### 1.5 Ejes del Año y Planetas Dominantes personalizados
**Estado:** PENDIENTE
**Descripcion:** Contenido generico → mostrar signo/datos especificos del usuario.

### 1.6 Lunas personalizadas por casa
**Estado:** PENDIENTE
**Descripcion:** Cada luna debe indicar en que CASA del usuario cae.
- "Luna Nueva en Acuario EN TU CASA 5 — momento para [aplicacion personal]"

---

## PRIORIDAD 2 — CALENDARIO + GOOGLE CALENDAR

### 2.1 Sincronizar agenda con Google Calendar y otros
**Estado:** PENDIENTE — DIFERENCIADOR CLAVE
**Descripcion:** Exportar todos los eventos del ciclo solar a calendarios externos.
**Fase 1 (AHORA - GRATIS):**
- Generar archivo .ics con todos los eventos del año solar
- Boton "Exportar a Google Calendar" / "Exportar a Outlook"
- Sincronizacion abierta para todos los usuarios (atrae usuarios)
**Fase 2 (FUTURO - DE PAGO):**
- Cuando tengamos todo listo, la sincronizacion pasa a ser feature premium
- Usuarios gratuitos: solo 2 meses de eventos
- Usuarios premium: ciclo completo sincronizado
**Archivos a crear/modificar:**
- `src/utils/generateICS.ts` (nuevo - generador de archivos .ics)
- `src/app/api/agenda/export-calendar/route.ts` (nuevo endpoint)
- `src/components/agenda/ExportCalendarButton.tsx` (nuevo componente)

---

## PRIORIDAD 3 — AUTOMATIZACION PARA ASTROLOGOS (VAPI + ZADARMA)

### 3.1 Terminar sistema de llamadas automatizadas
**Estado:** EN PROGRESO — NUMERO ACTIVO PARA PRUEBAS
**Descripcion:** Sistema de llamadas automatizadas para captar leads (astrologos).
**Lo que ya tenemos:**
- Numero de telefono activo y funcionando
- Cuenta VAPI configurada
- Cuenta Zadarma con SIP trunk
**Lo que falta:**
- Verificar flujo completo de llamada entrante
- Configurar asistente VAPI con script de captacion
- Conectar webhook para guardar datos del lead en MongoDB
- Probar end-to-end con llamadas reales
- Dashboard admin para ver leads capturados
**Documentacion:** `documentacion/VAPI_ZADARMA_SETUP.md`

---

## PRIORIDAD 4 — SISTEMA DE PAGOS STRIPE

### 4.1 Webhook Stripe
**Estado:** PENDIENTE
**Descripcion:** Activar `hasPurchasedAgenda` automaticamente tras pago exitoso.

### 4.2 Flujo completo compra → activacion
**Estado:** PENDIENTE
**Descripcion:** Usuario paga → webhook → se activa acceso a 12 meses + exportacion completa.

---

## PRIORIDAD 5 — PDF E IMPRESION

### 5.1 Verificar estilos A5 en impresion
**Estado:** CSS importado, VERIFICAR
**Verificar:**
- Cada `print-page` = 1 hoja A5
- Sin cortes de contenido entre paginas
- Gradientes y colores correctos

### 5.2 Mejorar formato TXT
**Estado:** PENDIENTE
- Evitar redundancia "Luna Nueva: Luna Nueva"
- Incluir secciones de terapia creativa

---

## PRIORIDAD 6 — FUTURO

### 6.1 PDF server-side con Puppeteer
**Estado:** PENDIENTE
**Descripcion:** Para libro fisico (80€), generar PDF en servidor.

### 6.2 Objetos simbolicos y tienda
**Estado:** DISEÑADO (ver `OBJETOS_SIMBOLICOS_Y_TIENDA.md`)

### 6.3 Cambiar "Mandato" por "Invitacion"
**Estado:** PENDIENTE — COPY

---

## BUGS CONOCIDOS

### Bug: startDate=undefined en useInterpretaciones
**Estado:** CORREGIDO (7 feb 2026)
**Fix:** `cycle.start || cycle.cycleStart` en vez de solo `cycle.cycleStart`
**Causa:** `formatForDisplay()` renombra `cycleStart` → `start`

### Bug: Luna Nueva y Luna Llena mismo dia
**Estado:** CORREGIDO (commit `6fab685`)
**Fix:** `SearchMoonPhase(2)` → `SearchMoonPhase(180)`

### Bug: Calendario empieza en enero
**Estado:** CORREGIDO
**Fix:** Calendario dinamico desde mes de cumpleaños

---

## ORDEN DE TRABAJO PROPUESTO

1. ✅ Unificar documentacion (HECHO)
2. ✅ Fix useInterpretaciones startDate/endDate (HECHO - 7 feb)
3. **EN CURSO** → Sincronizar interpretaciones libro (todos los meses)
4. ⏳ Google Calendar export (fase gratis)
5. ⏳ VAPI/Zadarma — terminar pruebas con numero activo
6. ⏳ Implementar limite 2 meses gratis
7. ⏳ Webhook Stripe + flujo de pago
8. ⏳ Personalizar contenido generico (Ejes, Planetas, Lunas)
9. ⏳ Verificar PDF/A5
10. ⏳ Google Calendar pasa a premium

---

**Mantenido por**: Claude Code Sessions
