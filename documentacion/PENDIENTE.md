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

### 1.1 Planetas Dominantes (P18) — Interpretaciones personalizadas
**Estado:** PENDIENTE
**Problema:** `PlanetasDominantes` muestra contenido hardcoded genérico
**Solución:**
- Pasar props con datos de BD: `proposito_vida`, `emociones`, `como_piensas`, `como_amas`, `como_actuas`
- Mostrar: "☉ Sol en [SIGNO]: [interpretación personalizada de BD]"
- Ya existe helper `getPlanetasDominantes()` en index.tsx

### 1.2 Integración de Cuatro Ejes (P25) — Interpretación clara
**Estado:** PENDIENTE
**Problema:** `IntegracionEjes` muestra descripción genérica de ASC/DSC/MC/IC
**Solución:**
- Extraer de BD: `angulos_vitales.ascendente`, `angulos_vitales.medio_cielo`
- Mostrar signo específico: "Ascendente en [SIGNO]: [interpretación]"
- Añadir: "MC en [SIGNO]: Tu dirección vocacional este año..."

### 1.3 Interpretaciones de Lunas mensuales — Personalización
**Estado:** PENDIENTE
**Problema:** Las lunas en `LunasYEjercicios` no explican qué significan PARA EL USUARIO
**Solución:**
- Para cada Luna Nueva/Llena, añadir: "Cae en tu Casa [X]"
- Explicar: "Con tu [planeta] en [signo], esta luna activa..."
- Calcular casa donde cae la luna según ascendente natal

### 1.4 Tránsitos planetarios personalizados
**Estado:** PENDIENTE
**Problema:** Los ingresos planetarios son genéricos
**Solución:**
- Mostrar: "Mercurio entra en Piscis → afecta tu Casa [X]"
- Si el planeta transita sobre un planeta natal importante, destacarlo
- Requiere: cálculo de casas según ascendente del usuario

---

## PRIORIDAD 2 — SINCRONIZACIÓN TXT ↔ LIBRO VISUAL

### 2.1 TXT tiene orden diferente al libro
**Estado:** PENDIENTE
**Problema:** El TXT pone "PRIMER DÍA DE TU CICLO" con espacio para escribir ANTES de interpretaciones
**Solución:**
- Reorganizar `handleExportTXT()` para que coincida con libro visual:
  1. Portada
  2. Qué vas a encontrar (Carta Natal primero, luego Retorno Solar)
  3. Carta Natal completa (actualmente vacía!)
  4. Retorno Solar completo
  5. Ciclos y Overview
  6. Ritual + Primer día + Intención (DESPUÉS de interpretaciones)
  7. Calendario
  8. Cierre

### 2.2 Carta Natal vacía en TXT
**Estado:** PENDIENTE
**Problema:** El TXT no exporta contenido de Esencia Natal, Nodos, Planetas Dominantes
**Solución:**
- Añadir sección completa de Carta Natal en `handleExportTXT()`
- Usar mismos datos que se pasan a componentes visuales

### 2.3 Formato de eventos en TXT
**Estado:** PENDIENTE
**Problema:** Eventos muestran "Luna Nueva: Luna Nueva" (redundante)
**Solución:**
- Cambiar a: "Luna Nueva en [SIGNO]"
- Añadir casa si está disponible

---

## PRIORIDAD 3 — VERIFICAR PDF/IMPRESIÓN A5

### 3.1 Verificar page breaks en PDF
**Estado:** PENDIENTE VERIFICACIÓN
**Acción:**
- [ ] Generar PDF y verificar cada página
- [ ] Confirmar que `.print-page` ocupa exactamente 1 hoja A5
- [ ] Verificar que no se corta contenido entre páginas
- [ ] Ajustar padding si contenido desborda

---

## PRIORIDAD 4 — SISTEMA DE PAGOS

### 4.1 Completar flujo Stripe
**Estado:** PARCIALMENTE IMPLEMENTADO
**Falta:**
- Webhook de confirmación de pago
- Activar flag `hasPurchasedAgenda` tras pago exitoso
- Página de éxito post-pago (`/compra/success`)
- Página de cancelación (`/compra/cancel`)

### 4.2 Límite de 2 meses para usuarios gratuitos
**Estado:** PENDIENTE
**Descripción:** Mostrar solo 2 meses del ciclo solar a usuarios gratuitos
**Implementación:**
```
AGENDA CALENDARIO:
- Si NO ha comprado: mostrar solo 2 meses
- Deshabilitar navegación a meses futuros (blur + candado)
- CTA: "Desbloquea tu ciclo completo" → /compra/agenda

LIBRO AGENDA:
- Similar: solo generar/mostrar 2 meses si usuario gratuito
- CTA: "Desbloquea tu libro completo"
```
**Prioridad:** ALTA — incentivo directo a la compra

---

## PRIORIDAD 5 — NUEVAS FUNCIONALIDADES

### 5.1 Exportar calendario a Google Calendar/Outlook (iCal)
**Estado:** PENDIENTE — NUEVA FUNCIONALIDAD
**Descripción:** Generar archivo .ics con todos los eventos del año
**Implementación:**
```
POST /api/agenda/export-ics
- Recibe: userId, yearLabel
- Lee eventos del SolarCycle
- Genera archivo .ics (RFC 5545)
- Cada evento: SUMMARY, DTSTART, DESCRIPTION, VALARM (1 día antes)
- Botón "Exportar a Calendario" con opciones:
  - Descargar .ics
  - Link Google Calendar
  - Link Outlook
```
**Prioridad:** ALTA — diferenciador competitivo

### 5.2 PDF mejorado del libro
**Estado:** PENDIENTE
**Descripción:** Mejorar calidad de exportación PDF
**Implementación:**
- Verificar estilos de impresión
- Optimizar para impresión física
- Considerar Puppeteer para generación server-side (libro físico 80€)

### 5.3 Optimización de costes OpenAI
**Estado:** PARCIALMENTE IMPLEMENTADO (commit affc0b0)
**Descripción:** No regenerar datos que ya existen en BD
**Objetivo:** De ~$0.15-0.25 por libro → ~$0.06-0.10 (reducción 60-80%)

---

## PRIORIDAD 6 — MEJORAS FUTURAS

### 6.1 Objetos simbólicos y tienda
- Diseñado en `OBJETOS_SIMBOLICOS_Y_TIENDA.md`
- Objetos personalizados basados en carta natal

### 6.2 Generación PDF server-side con Puppeteer
- Para libro físico (80€) necesitamos PDF profesional
- Puppeteer ya está en `package.json`

### 6.3 Notificación email en cumpleaños
- Detectar `isDayAfterBirthday`
- Enviar email con link a nuevo ciclo

---

## BUGS CORREGIDOS (no reabrir)

| Bug | Estado | Commit |
|-----|--------|--------|
| Luna Llena SearchMoonPhase(180) | ✅ CORREGIDO | `6fab685` |
| Calendario empieza en enero | ✅ CORREGIDO | `65ec163`, `f858d27` |
| CSS A5 no importado | ✅ CORREGIDO | `6fab685` |
| Índice con meses hardcoded | ✅ CORREGIDO | `6fab685` |
| NodosLunares objeto→string | ✅ CORREGIDO | `a13159c` |
| Modal z-index detrás header | ✅ CORREGIDO | `f57042f` |
| Botón ASC/MC solo natal | ✅ CORREGIDO | `f57042f` |
| Eventos calendario sin signo | ✅ CORREGIDO | `b484eff` |

---

## ARCHIVOS CLAVE A MODIFICAR

| Tarea | Archivo(s) |
|-------|-----------|
| Planetas personalizados | `SoulChart.tsx`, `index.tsx` (getPlanetasDominantes) |
| Ejes personalizados | `RetornoSolar.tsx` (IntegracionEjes) |
| Lunas personalizadas | `MesPage.tsx`, `LunasYEjercicios.tsx` |
| TXT sincronizado | `index.tsx` (handleExportTXT) |
| Límite 2 meses | `agenda/page.tsx`, `libro/page.tsx` |
| Export iCal | Nueva API `/api/agenda/export-ics` |

---

## ORDEN DE TRABAJO SUGERIDO

1. **Personalizar contenido** (P1.1, P1.2, P1.3) — Valor para el usuario
2. **Sincronizar TXT** (P2.1, P2.2) — Coherencia
3. **Verificar PDF** (P3.1) — Calidad
4. **Pagos** (P4.1, P4.2) — Monetización
5. **iCal export** (P5.1) — Diferenciador
