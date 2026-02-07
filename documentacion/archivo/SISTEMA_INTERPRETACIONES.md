# Sistema de Interpretaciones - Tu Vuelta al Sol

## Resumen General

El sistema genera interpretaciones astrológicas personalizadas usando GPT-4o con un enfoque "disruptivo" y transformacional.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE INTERPRETACIÓN                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Usuario clickea "Interpretar Carta Natal Disruptiva"         │
│                           ↓                                      │
│  2. InterpretationButton verifica caché (GET /api/interpretations/save)
│                           ↓                                      │
│  3a. Si hay caché válido (< 24h) → Mostrar modal con datos       │
│  3b. Si NO hay caché → Llamar API de generación                  │
│                           ↓                                      │
│  4. API /api/astrology/interpret-natal-clean                     │
│     - Usa generateDisruptiveNatalPrompt()                        │
│     - Modelo: gpt-4o, max_tokens: 16000                          │
│                           ↓                                      │
│  5. Guardar en MongoDB (PUT /api/interpretations/save)           │
│     - Usa findOneAndUpdate con upsert                            │
│     - REEMPLAZA la anterior, no crea duplicados                  │
│                           ↓                                      │
│  6. Mostrar modal con todas las secciones                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Componentes Principales

### 1. InterpretationButton.tsx
**Ubicación:** `src/components/astrology/InterpretationButton.tsx`

**Función:** Botón que:
- Verifica si hay interpretación en caché
- Genera nueva interpretación si no existe
- Muestra modal con contenido
- Permite regenerar (admin)

**Endpoints que usa:**
- GET `/api/interpretations/save?userId=X&chartType=natal` → Cargar caché
- POST `/api/astrology/interpret-natal-clean` → Generar nueva
- PUT `/api/interpretations/save` → Guardar/reemplazar

---

### 2. API interpret-natal-clean
**Ubicación:** `src/app/api/astrology/interpret-natal-clean/route.ts`

**Función:** Genera interpretación natal completa con GPT-4o

**Configuración:**
```javascript
{
  model: "gpt-4o",
  max_tokens: 16000,
  temperature: 0.8
}
```

**Prompt:** Usa `generateDisruptiveNatalPrompt()` de `disruptivePrompts.ts`

---

### 3. API interpretations/save
**Ubicación:** `src/app/api/astrology/interpretations/save/route.ts`

**Métodos:**
- **GET:** Recuperar interpretación cacheada por userId + chartType
- **PUT:** Guardar/actualizar interpretación (upsert - reemplaza existente)
- **POST:** Solo para Solar Return (genera + guarda)

---

## Estructura JSON de Interpretación Natal

```json
{
  "esencia_revolucionaria": "Texto sobre naturaleza única del usuario",

  "proposito_vida": "Misión en este planeta",

  "formacion_temprana": {
    "casa_lunar": { "planeta", "infancia_emocional", "patron_formado", "impacto_adulto" },
    "casa_saturnina": { "planeta", "limites_internalizados", "mensaje_recibido", "impacto_adulto" },
    "casa_venusina": { "planeta", "amor_aprendido", "modelo_relacional", "impacto_adulto" }
  },

  "patrones_psicologicos": [
    {
      "nombre_patron": "Nombre del patrón",
      "planeta_origen": "Planeta que lo causa",
      "como_se_manifiesta": ["Manifestación 1", "Manifestación 2"],
      "origen_infancia": "Cómo se formó",
      "dialogo_interno": ["Frase 1", "Frase 2"],
      "ciclo_karmico": ["Paso 1", "Paso 2"],
      "sombra_junguiana": "La sombra del patrón",
      "superpoder_integrado": "Cuando se integra luz y sombra",
      "pregunta_reflexion": "Pregunta para reflexionar"
    }
  ],

  "planetas_profundos": {
    "urano": "Interpretación de Urano",
    "neptuno": "Interpretación de Neptuno",
    "pluton": "Interpretación de Plutón"
  },

  "angulos_vitales": {
    "ascendente": {
      "posicion": "Signo y grado",
      "mascara_social": "Primera impresión",
      "cuerpo_fisico": "Manifestación física",
      "enfoque_vida": "Lente de experiencia",
      "desafio_evolutivo": "Qué integrar",
      "superpoder": "Poder cuando se usa conscientemente"
    },
    "medio_cielo": {
      "posicion": "Signo y grado",
      "vocacion_soul": "Vocación del alma",
      "imagen_publica": "Cómo te ve el mundo",
      "legado": "Huella a dejar",
      "carrera_ideal": "Roles ideales",
      "autoridad_interna": "Liderazgo natural"
    }
  },

  "nodos_lunares": {
    "nodo_sur": {
      "signo_casa": "Signo en Casa X",
      "zona_comfort": "Habilidades dominadas",
      "patron_repetitivo": "Patrones a soltar"
    },
    "nodo_norte": {
      "signo_casa": "Signo en Casa X",
      "direccion_evolutiva": "Hacia dónde crecer",
      "desafio": "Miedo a atravesar"
    },
    "eje_completo": "GPS evolutivo completo"
  },

  "planetas": {
    "sol": { "titulo", "descripcion", "poder_especifico", "accion_inmediata", "ritual" },
    "luna": { "titulo", "descripcion", "poder_especifico", "accion_inmediata", "ritual" },
    "mercurio": { "titulo", "descripcion", "poder_especifico", "accion_inmediata" },
    "venus": { "titulo", "descripcion", "poder_especifico", "accion_inmediata" },
    "marte": { "titulo", "descripcion", "poder_especifico", "accion_inmediata" },
    "jupiter": { "titulo", "descripcion", "poder_especifico", "accion_inmediata" },
    "saturno": { "titulo", "descripcion", "poder_especifico", "accion_inmediata" },
    "urano": { "titulo", "descripcion", "poder_especifico" },
    "neptuno": { "titulo", "descripcion", "poder_especifico" },
    "pluton": { "titulo", "descripcion", "poder_especifico" }
  },

  "plan_accion": {
    "hoy_mismo": ["Acción 1", "Acción 2", "Acción 3"],
    "esta_semana": ["Acción 1", "Acción 2", "Acción 3"],
    "este_mes": ["Acción 1", "Acción 2", "Acción 3"]
  },

  "declaracion_poder": "YO, [NOMBRE], SOY...",

  "advertencias": [
    "⚠️ Advertencia 1",
    "⚠️ Advertencia 2",
    "⚠️ Advertencia 3"
  ],

  "insights_transformacionales": [
    "💡 Insight 1",
    "💡 Insight 2",
    "💡 Insight 3",
    "💡 Insight 4",
    "💡 Insight 5"
  ],

  "rituales_recomendados": [
    "🕯️ Ritual 1",
    "🕯️ Ritual 2",
    "🕯️ Ritual 3"
  ],

  "pregunta_final_reflexion": "Pregunta transformadora para cerrar"
}
```

---

## Secciones del Modal de Interpretación

| Sección | Descripción | Campo JSON |
|---------|-------------|------------|
| **Esencia Revolucionaria** | Naturaleza única y disruptiva del usuario | `esencia_revolucionaria` |
| **Propósito de Vida** | Misión cósmica en este planeta | `proposito_vida` |
| **Formación Temprana** | Casas Lunar, Saturnina, Venusina - raíces psicológicas | `formacion_temprana` |
| **Patrones Psicológicos** | Patrones actuales, sombras, ciclos kármicos | `patrones_psicologicos` |
| **Planetas Profundos** | Urano, Neptuno, Plutón - fuerzas transformadoras | `planetas_profundos` |
| **Ángulos Vitales** | Ascendente y Medio Cielo | `angulos_vitales` |
| **Nodos Lunares** | Nodo Norte/Sur - evolución kármica | `nodos_lunares` |
| **Mapa Planetario** | Cada planeta con descripción, poder, acción | `planetas` |
| **Plan de Acción** | Acciones para hoy, esta semana, este mes | `plan_accion` |
| **Declaración de Poder** | Afirmación personal poderosa | `declaracion_poder` |
| **Advertencias** | Patrones limitantes a evitar (mínimo 3) | `advertencias` |
| **Insights Transformacionales** | Revelaciones profundas (mínimo 5) | `insights_transformacionales` |
| **Rituales Recomendados** | Prácticas espirituales sugeridas | `rituales_recomendados` |
| **Pregunta Final** | Pregunta para reflexión profunda | `pregunta_final_reflexion` |

---

## Sistema de Caché

### Cómo funciona:
1. **Duración:** 24 horas
2. **Almacenamiento:** MongoDB (colección `interpretations`)
3. **Identificador único:** `userId` + `chartType`
4. **Comportamiento:**
   - PUT reemplaza la interpretación existente (no crea duplicados)
   - GET busca la más reciente no expirada
   - Regenerar crea nueva y reemplaza la anterior

### Campos en MongoDB:
```javascript
{
  userId: String,
  chartType: 'natal' | 'solar-return' | 'progressed',
  interpretation: Object,
  userProfile: Object,
  generatedAt: Date,
  expiresAt: Date,  // generatedAt + 24h
  method: 'openai' | 'fallback' | 'api',
  cached: Boolean
}
```

---

## Tipos de Carta Soportados

| Tipo | Endpoint | Descripción |
|------|----------|-------------|
| `natal` | `/api/astrology/interpret-natal-clean` | Carta natal completa |
| `solar-return` | `/api/astrology/interpret-solar-return` | Revolución solar anual |
| `progressed` | `/api/astrology/interpret-progressed` | Carta progresada |

---

## Archivos Clave

```
src/
├── components/astrology/
│   └── InterpretationButton.tsx    # Botón y modal de interpretación
│
├── app/api/astrology/
│   ├── interpret-natal-clean/route.ts   # API natal disruptiva
│   ├── interpret-solar-return/route.ts  # API solar return
│   └── interpretations/save/route.ts    # GET/PUT/POST caché
│
├── utils/prompts/
│   ├── disruptivePrompts.ts        # Prompt natal disruptivo
│   ├── solarReturnPrompts.ts       # Prompt solar return
│   └── tripleFusedPrompts.ts       # Prompts para tooltips individuales
│
└── models/
    └── Interpretation.ts           # Modelo MongoDB
```

---

## Prompt de OpenAI (Custom Instructions)

El prompt largo que tienes en OpenAI es **documentación de referencia**.
El código usa `generateDisruptiveNatalPrompt()` que está en `disruptivePrompts.ts`.

**NO necesitas modificar el prompt de OpenAI** - solo sirve como guía de estilo.

---

## Actualizaciones Recientes (Nov 2024)

1. **Endpoint corregido:** Ahora usa `interpret-natal-clean` que tiene el prompt disruptivo completo
2. **max_tokens aumentado:** De 2000 a 16000 para JSON completo
3. **GET dinámico:** Busca por `chartType` (natal, solar-return, progressed)
4. **PUT con upsert:** Reemplaza interpretación existente, no crea duplicados
5. **Nuevas secciones:** `angulos_vitales`, `pregunta_final_reflexion`
6. **Modelo actualizado:** gpt-4o en lugar de gpt-4-turbo-preview
