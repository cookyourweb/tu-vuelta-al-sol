# Tu Vuelta al Sol — TODO

**Ultima actualizacion:** 7 febrero 2026

---

## EN CURSO

### Sincronizacion interpretaciones libro (todos los meses)
- [x] Fix `useInterpretaciones.ts` — campo `startDate`/`endDate` undefined (7 feb)
- [x] Unificar sistema de interpretaciones (SolarCycle como fuente unica)
- [ ] Verificar que los 12 meses generan interpretaciones correctas
- [ ] Verificar que TransitosDelMes muestra interpretaciones personalizadas en todos los meses
- [ ] Probar generacion batch completa para un usuario real

---

## PENDIENTE — PRIORIDAD ALTA

### Google Calendar + iCal export
- [ ] Crear `src/utils/generateICS.ts` (generador .ics)
- [ ] Crear endpoint `src/app/api/agenda/export-calendar/route.ts`
- [ ] Crear componente `ExportCalendarButton.tsx`
- [ ] Probar importacion en Google Calendar
- [ ] Probar importacion en Apple Calendar / Outlook
- **Fase 1:** Gratis para todos (atrae usuarios)
- **Fase 2:** Premium (cuando todo este listo)

### VAPI + Zadarma — Automatizacion astrologos
- [x] Numero de telefono activo
- [x] Cuenta VAPI configurada
- [x] Cuenta Zadarma con SIP trunk
- [ ] Verificar flujo completo llamada entrante
- [ ] Configurar asistente VAPI con script de captacion
- [ ] Conectar webhook → guardar lead en MongoDB
- [ ] Probar end-to-end con llamadas reales
- [ ] Dashboard admin para ver leads

### Modelo freemium — 2 meses gratis
- [ ] Logica de bloqueo en `AgendaLibro/index.tsx`
- [ ] Blur/candado visual en meses 3-12
- [ ] CTA "Desbloquea tu ciclo completo"
- [ ] Verificacion de compra en `agenda/page.tsx`

---

## PENDIENTE — PRIORIDAD MEDIA

### Webhook Stripe
- [ ] Endpoint webhook para `checkout.session.completed`
- [ ] Activar `hasPurchasedAgenda` automaticamente
- [ ] Flujo completo: pago → webhook → acceso 12 meses

### Contenido personalizado libro
- [ ] Espacios para escribir DESPUES de interpretaciones
- [ ] Ejes del Año con signo especifico del usuario
- [ ] Planetas Dominantes con datos personalizados
- [ ] Lunas con casa donde cae para el usuario
- [ ] Sincronizar TXT con orden del libro visual

### PDF e impresion
- [ ] Verificar estilos A5 en impresion real
- [ ] Verificar saltos de pagina correctos
- [ ] Mejorar formato TXT (evitar redundancias)

---

## PENDIENTE — PRIORIDAD BAJA

### Mejoras de UI
- [ ] Reemplazar emojis de eventos con iconos Lucide React
- [ ] Limpiar console.log con emojis del codigo
- [ ] Cambiar "Mandato" por "Invitacion" en copy

### Futuro
- [ ] PDF server-side con Puppeteer (libro fisico 80€)
- [ ] Objetos simbolicos y tienda (ver `OBJETOS_SIMBOLICOS_Y_TIENDA.md`)
- [ ] Feature "Explorar Mas" (ver `IDEAS_EXPLORAR_MAS.md`)

---

## COMPLETADO RECIENTEMENTE

- [x] Fix `useInterpretaciones.ts` — startDate/endDate undefined (7 feb 2026)
- [x] Unificar documentacion — INDICE, HECHO, PENDIENTE (3 feb 2026)
- [x] Fix consistencia casas libro vs agenda (27 ene 2026)
- [x] Sprint 4 calendario automatizado 12 meses (ene 2026)
- [x] Fix Luna Llena (SearchMoonPhase 180)
- [x] Fix calendario dinamico desde cumpleaños
- [x] Correccion tropical ProKerala (ayanamsa=0)
- [x] Fix Prokerala getSignFromLongitude (sin || fallback)

---

**Mantenido por**: Claude Code Sessions
