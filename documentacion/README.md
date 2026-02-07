# Documentacion - Tu Vuelta al Sol

**Ultima actualizacion:** 7 febrero 2026

---

## Inicio rapido

1. **[../CLAUDE.md](../CLAUDE.md)** — Guia principal del proyecto
2. **[START_HERE.md](START_HERE.md)** — Punto de partida
3. **[HECHO.md](HECHO.md)** — Que esta completo (~80%)
4. **[PENDIENTE.md](PENDIENTE.md)** — Que falta (priorizado)
5. **[GUIA_RAPIDA_DESARROLLO.md](GUIA_RAPIDA_DESARROLLO.md)** — Cheatsheet desarrollo

Indice completo: **[INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md)**

---

## Estructura

```
documentacion/
├── DOCUMENTOS PRINCIPALES
│   ├── START_HERE.md              # Punto de partida
│   ├── HECHO.md                   # Que esta completo
│   ├── PENDIENTE.md               # Que falta (priorizado)
│   ├── TODO.md                    # Checklist de tareas
│   └── GUIA_RAPIDA_DESARROLLO.md  # Cheatsheet
│
├── ARQUITECTURA
│   ├── ARQUITECTURA_3_CAPAS.md    # Natal → Solar → Agenda
│   ├── ARQUITECTURA_SEPARACION_NATAL_SR.md
│   ├── SISTEMA_INTERPRETACIONES_AGENDA_COMPLETO.md
│   └── PERSONALIZACION_AGENDA.md
│
├── CONFIGURACION TECNICA
│   ├── PROKERALA_TROPICAL_CONFIG.md  # ayanamsa=0, tropical
│   ├── STRIPE_SETUP.md
│   ├── STRIPE_PRODUCTOS.md
│   └── STRIPE_ENV_SETUP.md
│
├── GUIAS
│   ├── PROMPT_POETICO_ANTIFRAGIL.md  # Tono IA
│   ├── LECCIONES_APRENDIDAS.md       # Errores a no repetir
│   ├── MIGRACION_AGENDA_LIBRO.md
│   └── Guialogos.md
│
├── REFERENCIAS
│   ├── ANALISIS_AGENDA_COMPLETO.md
│   ├── ANALISIS_CARTA_NATAL_COMPLETA.md
│   ├── API_INTERPRETACIONES_EVENTOS.md
│   ├── COMPARACIONES_PLANETARIAS_3_CAPAS.md
│   ├── GUIA_INTERPRETACIONES_COMPLETA.md
│   ├── INTERPRETACIONES_EVENTOS_AGENDA.md
│   └── FIX_HOUSE_CONSISTENCY_TRANSITS_INTERPRETATIONS.md
│
├── AUTOMATIZACION
│   └── VAPI_ZADARMA_SETUP.md     # Llamadas automatizadas astrologos
│
├── IDEAS FUTURAS
│   ├── ESTRATEGIA_PREVIEW_PAGO.md
│   ├── OBJETOS_SIMBOLICOS_Y_TIENDA.md
│   └── IDEAS_EXPLORAR_MAS.md
│
├── BUGDEAPIS/                     # Bugs ProKerala API (resueltos)
│   ├── README.md
│   ├── GUIA_TESTING_OSCAR.md
│   └── ...
│
└── archivo/                       # Docs obsoletos archivados (23 archivos)
```

---

## Testing

**Caso de prueba estandar:**
```
Nombre: Oscar
Fecha: 25/11/1966, 02:34 AM
Lugar: Madrid, Espana
MC esperado: Virgo 23° (NO Geminis)
```

Guia completa: `BUGDEAPIS/GUIA_TESTING_OSCAR.md`

---

## Estado actual

| Capa | % | Estado |
|------|---|--------|
| Carta Natal | 100% | Completa |
| Retorno Solar | 100% | Completa |
| Agenda/Calendario | 85% | Faltan lunas personalizadas |
| Libro imprimible | 70% | Falta contenido personalizado |
| Stripe pagos | 50% | Falta webhook |
| Google Calendar | 0% | Pendiente |
| VAPI/Zadarma | 40% | Numero activo |

Ver [PENDIENTE.md](PENDIENTE.md) para prioridades detalladas.

---

**Mantenido por**: Claude Code Sessions
