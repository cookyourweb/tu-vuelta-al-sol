# Tu Vuelta al Sol — LO QUE FALTA

**Última actualización:** 3 febrero 2026

---

## VISIÓN DE LA AGENDA TOP

La agenda debe ser una **guía hiper-personalizada** que:
1. **PRIMERO** te cuente QUIÉN ERES (Carta Natal)
2. **SEGUNDO** te explique QUÉ SE ACTIVA ESTE AÑO (Retorno Solar)
3. **TERCERO** te deje REFLEXIONAR y poner intención (después de entender)
4. **CUARTO** te GUÍE mes a mes con eventos personalizados (no genéricos)
5. **QUINTO** te permita CERRAR el ciclo con reflexión

**Principio fundamental**: Espacios para escribir SIEMPRE después de la interpretación.

---

## PRIORIDAD 1 — CONTENIDO PERSONALIZADO DEL LIBRO

### 1.1 Espacios para escribir DESPUÉS de interpretaciones
**Estado:** PENDIENTE - CRÍTICO
**Problema actual:** "Primer día de tu ciclo" con espacio para escribir intención aparece ANTES de las interpretaciones.
**Solución:**
- Mover "Primer día del ciclo" DESPUÉS de Carta Natal + Retorno Solar
- Nuevo copy: "Ahora que ya has leído quién eres y qué se activa este año..."
- "Mi intención para esta vuelta al sol" también va DESPUÉS de interpretaciones

**Archivos a modificar:**
- `src/components/agenda/AgendaLibro/index.tsx` (orden de secciones)
- `src/components/agenda/AgendaLibro/PaginasEspeciales.tsx` (copy PrimerDiaCiclo)

### 1.2 Sincronizar TXT con libro visual
**Estado:** PENDIENTE - CRÍTICO
**Problema:** El TXT (`handleExportTXT`) tiene un orden diferente al libro renderizado:
- TXT: Primer día → Guía → SR → Natal → Ejes → Calendario
- Libro: Bienvenida → Natal → SR → Ritual → Calendario

**Solución:**
- Reescribir `handleExportTXT()` para seguir el mismo orden que el libro visual
- Incluir contenido de Carta Natal (actualmente vacío en TXT)

### 1.3 Ejes del Año personalizados
**Estado:** PENDIENTE
**Problema:** El contenido de "LOS EJES DEL AÑO" es genérico.
**Solución:** Mostrar el signo específico de cada eje del usuario:
- "Ascendente en [SIGNO]: Tu nueva máscara es [descripción específica]"
- Usar datos de `integracion_ejes` de la BD

### 1.4 Planetas Dominantes personalizados
**Estado:** PENDIENTE
**Problema:** Página de Planetas Dominantes no muestra datos personalizados.
**Solución:** Pasar props desde la interpretación natal a `PlanetasDominantes.tsx`

### 1.5 Interpretaciones de Lunas personalizadas
**Estado:** PENDIENTE
**Descripción:** Cada luna debería decir en qué CASA del usuario cae.
- "Luna Nueva en Acuario CAE EN TU CASA 5 - momento para [aplicación personal]"

---

## PRIORIDAD 2 — PDF E IMPRESIÓN

### 2.1 Verificar estilos A5 en impresión
**Estado:** CSS importado, VERIFICAR funcionamiento
**Problema reportado:** Se perdieron ajustes de saltos de línea y A5.
**Verificar:**
- Cada `print-page` ocupa exactamente 1 hoja A5
- No se cortan contenidos entre páginas
- Gradientes y colores se imprimen correctamente

### 2.2 Mejorar formato TXT
**Estado:** PENDIENTE
**Mejoras:**
- Evitar redundancia "Luna Nueva: Luna Nueva" → "Luna Nueva en Acuario ♒"
- Incluir secciones de terapia creativa
- Formatear eventos más legibles

---

## PRIORIDAD 3 — SISTEMA DE PAGOS

### 3.1 Webhook Stripe
**Estado:** PENDIENTE
**Descripción:** Activar `hasPurchasedAgenda` automáticamente tras pago exitoso.

### 3.2 Límite 2 meses usuarios gratuitos
**Estado:** PENDIENTE
**Descripción:** Solo mostrar 2 meses del ciclo a usuarios gratuitos.
- Blur/candado en meses bloqueados
- CTA: "Desbloquea tu ciclo completo" → /compra/agenda

---

## PRIORIDAD 4 — MEJORAS DE UX

### 4.1 Exportar a Google Calendar/Outlook (iCal)
**Estado:** PENDIENTE - DIFERENCIADOR
**Descripción:** Generar archivo .ics con todos los eventos del año solar.

### 4.2 Cambiar "Mandato" por "Invitación"
**Estado:** PENDIENTE - COPY
**Descripción:** La palabra "mandato" choca con el tono invitador.

---

## PRIORIDAD 5 — FUTURO

### 5.1 PDF server-side con Puppeteer
**Estado:** PENDIENTE
**Descripción:** Para libro físico (80€), generar PDF en servidor.

### 5.2 Objetos simbólicos y tienda
**Estado:** DISEÑADO (ver `OBJETOS_SIMBOLICOS_Y_TIENDA.md`)

---

## BUGS CONOCIDOS

### Bug: Luna Nueva y Luna Llena mismo día
**Estado:** ✅ CORREGIDO (commit `6fab685`)
**Fix:** `SearchMoonPhase(2)` → `SearchMoonPhase(180)`

### Bug: Calendario empieza en enero
**Estado:** ✅ CORREGIDO
**Fix:** Calendario dinámico desde mes de cumpleaños

---

## ORDEN DE TRABAJO PROPUESTO

1. ✅ Unificar documentación (HECHO)
2. ⏳ Corregir flujo libro (espacios después de interpretaciones)
3. ⏳ Sincronizar TXT con libro visual
4. ⏳ Personalizar contenido genérico (Ejes, Planetas)
5. ⏳ Verificar PDF/A5
6. ⏳ Sistema de pagos completo

---

**Mantenido por**: Claude Code Sessions
