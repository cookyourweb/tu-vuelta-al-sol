# 📚 API de Interpretaciones de Eventos - Guía Rápida

## Descripción General

Sistema de 3 capas para generar interpretaciones personalizadas de eventos astrológicos, optimizado para costo y experiencia de usuario.

---

## 🔧 Endpoints Disponibles

### 1. **POST** `/api/astrology/interpretations/generate-month`

Genera interpretaciones para eventos importantes de un mes específico (Capa 2).

#### Request Body
```json
{
  "userId": "abc123",
  "yearLabel": "2025-2026",
  "month": 1,
  "year": 2025
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "month": 1,
    "year": 2025,
    "yearLabel": "2025-2026",
    "totalEvents": 15,
    "generated": 8,
    "skipped": 7,
    "errors": 0,
    "estimatedCost": 0.08,
    "estimatedTime": 20,
    "events": [...]
  }
}
```

#### Uso Recomendado
- **Cuándo**: Al cargar la agenda por primera vez o cambiar de mes
- **Background**: Ejecutar en segundo plano mientras el usuario ve el calendario
- **Frecuencia**: Una vez por mes visitado

---

### 2. **GET** `/api/astrology/interpretations/check-missing`

Verifica qué interpretaciones faltan para un ciclo solar completo.

#### Query Parameters
- `userId`: ID del usuario
- `yearLabel`: Etiqueta del ciclo (ej: "2025-2026")

#### Response
```json
{
  "success": true,
  "data": {
    "yearLabel": "2025-2026",
    "totalEvents": 84,
    "importantEvents": 48,
    "withInterpretation": 35,
    "missing": 13,
    "missingEventIds": ["evt1", "evt2", ...],
    "missingByMonth": {
      "2025-01": 3,
      "2025-02": 5,
      "2025-03": 5
    },
    "completionPercentage": 73,
    "estimatedCost": {
      "amount": 0.13,
      "formatted": "$0.1300"
    },
    "estimatedTime": {
      "seconds": 32.5,
      "formatted": "~1 min"
    },
    "needsGeneration": true
  }
}
```

#### Uso Recomendado
- **Cuándo**: Antes de abrir el Agenda Libro
- **Propósito**: Decidir si mostrar loading o abrir directamente
- **Decisión**: Si `missing > 0`, mostrar botón "Completar interpretaciones"

---

### 3. **POST** `/api/astrology/interpretations/generate-batch`

Genera TODAS las interpretaciones faltantes de un ciclo (Capa 3).

#### Request Body
```json
{
  "userId": "abc123",
  "yearLabel": "2025-2026",
  "maxConcurrent": 3  // Opcional, default: 3, max: 5
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "yearLabel": "2025-2026",
    "totalEvents": 84,
    "importantEvents": 48,
    "generated": 13,
    "skipped": 35,
    "errors": 0,
    "estimatedCost": 0.13,
    "actualCost": 0.13,
    "duration": {
      "seconds": 42,
      "formatted": "42s"
    },
    "completionPercentage": 100
  }
}
```

#### Uso Recomendado
- **Cuándo**: Al hacer clic en "Abrir Agenda Libro" si faltan interpretaciones
- **UI**: Mostrar barra de progreso o spinner con mensaje
- **Polling**: Usar GET `/api/astrology/interpretations/generate-batch` para consultar progreso

---

### 4. **GET** `/api/astrology/interpretations/generate-batch`

Consulta el progreso de generación batch (útil para polling).

#### Query Parameters
- `userId`: ID del usuario
- `yearLabel`: Etiqueta del ciclo (ej: "2025-2026")

#### Response
```json
{
  "success": true,
  "data": {
    "yearLabel": "2025-2026",
    "importantEvents": 48,
    "completed": 48,
    "remaining": 0,
    "completionPercentage": 100,
    "isComplete": true
  }
}
```

---

## 🎯 Estrategia de las 3 Capas

### Capa 1: Generación Base (Instantáneo)
```
Endpoint: /api/astrology/solar-cycles/generate
- Genera eventos básicos SIN interpretaciones
- Tiempo: ~1 minuto
- Costo: $0
```

### Capa 2: Generación Incremental del Mes Actual (30 seg)
```
Endpoint: /api/astrology/interpretations/generate-month
- Genera 10-12 interpretaciones del mes en curso
- Ejecutar en background al cargar la agenda
- Tiempo: ~30 segundos
- Costo: ~$0.05-$0.06
```

### Capa 3: Completar al Abrir Libro (1-2 min primera vez)
```
Endpoint: /api/astrology/interpretations/generate-batch
- Genera interpretaciones faltantes
- Loading con progreso visual
- Primera vez: ~1-2 min, $0.25-$0.40
- Siguientes veces: Instantáneo, $0 (ya está completo)
```

---

## 📊 Costos y Performance

### Comparativa
| Estrategia | Costo Total | Tiempo Max Espera | UX |
|------------|-------------|-------------------|-----|
| **Todo de golpe** | $0.48-$0.60 | 2-3 min inicial | ❌ Malo |
| **3 Capas (IMPLEMENTADO)** | $0.40-$0.60 | 2 min máx | ✅ Excelente |
| **On-demand puro** | $0.48-$0.60 | 3-5 seg cada evento | ⚠️ Regular |

### Ahorro Estimado
- **Costo**: Similar o 10-20% menos que "todo de golpe"
- **Experiencia**: 3x mejor (nunca esperas más de 2 minutos)
- **Eficiencia**: Caché evita regenerar interpretaciones existentes

---

## 🔄 Flujo Recomendado de Implementación

### Frontend: Al Cargar Agenda
```typescript
// 1. Cargar ciclo actual
const cycle = await fetch(`/api/astrology/solar-cycles?userId=${userId}&yearLabel=${yearLabel}`);

// 2. En background: Generar interpretaciones del mes actual
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

fetch('/api/astrology/interpretations/generate-month', {
  method: 'POST',
  body: JSON.stringify({
    userId,
    yearLabel,
    month: currentMonth,
    year: currentYear
  })
}).then(() => {
  // Recargar eventos del mes para mostrar interpretaciones
  loadMonthEvents();
});
```

### Frontend: Al Abrir Agenda Libro
```typescript
// 1. Verificar qué falta
const checkResponse = await fetch(
  `/api/astrology/interpretations/check-missing?userId=${userId}&yearLabel=${yearLabel}`
);
const { data } = await checkResponse.json();

if (data.missing > 0) {
  // 2. Mostrar modal de generación
  setShowGeneratingModal(true);
  setProgress(0);

  // 3. Iniciar generación batch
  const batchResponse = await fetch('/api/astrology/interpretations/generate-batch', {
    method: 'POST',
    body: JSON.stringify({ userId, yearLabel, maxConcurrent: 3 })
  });

  // 4. Polling para actualizar progreso (opcional)
  const pollProgress = setInterval(async () => {
    const progressResponse = await fetch(
      `/api/astrology/interpretations/generate-batch?userId=${userId}&yearLabel=${yearLabel}`
    );
    const progressData = await progressResponse.json();

    setProgress(progressData.data.completionPercentage);

    if (progressData.data.isComplete) {
      clearInterval(pollProgress);
      setShowGeneratingModal(false);
      openAgendaLibro();
    }
  }, 2000);
} else {
  // Ya está completo, abrir directamente
  openAgendaLibro();
}
```

---

## 🛡️ Manejo de Errores

### Error: Usuario sin datos astrológicos
```json
{
  "success": false,
  "error": "No se encontraron datos astrológicos del usuario",
  "status": 404
}
```
**Solución**: Verificar que el usuario tenga carta natal generada primero.

### Error: Ciclo no encontrado
```json
{
  "success": false,
  "error": "Ciclo 2025-2026 no encontrado",
  "status": 404
}
```
**Solución**: Generar el ciclo primero con `/api/astrology/solar-cycles/generate`.

### Error: Fallo parcial en batch
```json
{
  "success": true,
  "data": {
    "generated": 35,
    "errors": 5,
    ...
  }
}
```
**Solución**: Los errores individuales se logean pero no detienen el proceso. Revisar logs del servidor.

---

## 📈 Métricas y Monitoreo

### Logs a Revisar
```bash
✅ [GENERATED] Interpretación creada para Luna Nueva en Acuario
⏭️ [SKIP] Event evt_123 no necesita interpretación
❌ [ERROR] Error generando interpretación para evt_456: OpenAI timeout
💰 [COST] Costo estimado: $0.0800 (~20.0s)
```

### KPIs Importantes
- **Cache Hit Rate**: % de interpretaciones servidas desde caché
- **Costo por Usuario**: Promedio de costo real vs estimado
- **Tiempo Promedio**: Tiempo real de generación vs estimado
- **Tasa de Errores**: % de interpretaciones que fallan

---

## 🚀 Próximos Pasos

Según el roadmap en `SISTEMA_INTERPRETACIONES_AGENDA_COMPLETO.md`:

1. ✅ **Sprint 1 (Semana 1)**: Backend Core - COMPLETADO
2. **Sprint 2 (Semana 2)**: Sistema de generación automática en background
3. **Sprint 3 (Semana 3)**: Integración Frontend Agenda Online
4. **Sprint 4 (Semana 4)**: Integración Agenda Libro
5. **Sprint 5 (Semana 5)**: Optimizaciones
6. **Sprint 6 (Semana 6)**: Exportación a Calendario (iCal, Google Calendar)
7. **Sprint 7 (Semana 7)**: Monetización (Stripe, modelos de pago)

---

## 📞 Soporte

Para dudas o problemas:
- Revisar logs del servidor: `console.log` de cada endpoint
- Verificar documentación completa: `SISTEMA_INTERPRETACIONES_AGENDA_COMPLETO.md`
- Testear con Postman/Insomnia antes de integrar al frontend

---

**Última actualización**: 2026-01-17
**Versión**: 1.0.0
**Estado**: Sprint 1 completado ✅
