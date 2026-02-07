# Tu Vuelta al Sol — Punto de Entrada

**Ultima actualizacion:** 7 febrero 2026

---

## Documentos principales

Lee estos en orden:

1. **[CLAUDE.md](../CLAUDE.md)** — Guia del proyecto, tech stack, convenciones
2. **[HECHO.md](HECHO.md)** — Que esta completo y funcionando (~80%)
3. **[PENDIENTE.md](PENDIENTE.md)** — Que falta por hacer (priorizado)
4. **[GUIA_RAPIDA_DESARROLLO.md](GUIA_RAPIDA_DESARROLLO.md)** — Cheatsheet para desarrollo

---

## Estado actual del proyecto

| Capa | Completado | Notas |
|------|-----------|-------|
| Carta Natal | 100% | ProKerala tropical + OpenAI GPT-4o |
| Retorno Solar | 100% | Comparaciones planetarias completas |
| Agenda/Calendario | 85% | Faltan lunas personalizadas por casa |
| Libro imprimible | 70% | Falta contenido personalizado + sync TXT |
| Stripe pagos | 50% | Falta webhook + limite freemium |
| Google Calendar | 0% | Pendiente — sera gratis primero, premium despues |
| VAPI/Zadarma | 40% | Numero activo, falta completar flujo |

---

## Setup rapido

```bash
git checkout main
npm install
# Configurar .env (pedir variables al propietario)
npm run dev
```

---

## Arquitectura de 3 capas

```
CAPA 1: CARTA NATAL (permanente — quien eres)
   ↓
CAPA 2: RETORNO SOLAR (anual — que se activa este año)
   ↓
CAPA 3: AGENDA (diario — como lo vives dia a dia)
```

**Documentacion detallada:** [ARQUITECTURA_3_CAPAS.md](ARQUITECTURA_3_CAPAS.md)

---

## Prioridades actuales (febrero 2026)

1. **Sincronizar interpretaciones libro** — que los 12 meses funcionen
2. **Google Calendar export** — gratis ahora, premium despues
3. **VAPI/Zadarma** — terminar con el numero activo
4. **Freemium 2 meses** — bloquear meses 3-12 para gratuitos
5. **Webhook Stripe** — activar acceso tras pago

**Ver [PENDIENTE.md](PENDIENTE.md) para detalles completos.**

---

## Documentacion tecnica

| Tema | Documento |
|------|-----------|
| Arquitectura completa | [ARQUITECTURA_3_CAPAS.md](ARQUITECTURA_3_CAPAS.md) |
| Sistema interpretaciones | [SISTEMA_INTERPRETACIONES_AGENDA_COMPLETO.md](SISTEMA_INTERPRETACIONES_AGENDA_COMPLETO.md) |
| API de eventos | [API_INTERPRETACIONES_EVENTOS.md](API_INTERPRETACIONES_EVENTOS.md) |
| Config ProKerala | [PROKERALA_TROPICAL_CONFIG.md](PROKERALA_TROPICAL_CONFIG.md) |
| Stripe | [STRIPE_SETUP.md](STRIPE_SETUP.md) |
| Errores pasados | [LECCIONES_APRENDIDAS.md](LECCIONES_APRENDIDAS.md) |
| Indice completo | [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) |

---

**Mantenido por**: Claude Code Sessions
