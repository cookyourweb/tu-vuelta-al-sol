# 🌙 Sistema de Interpretaciones Personalizadas para Eventos de Agenda

## 📋 Documento de Diseño e Implementación

**Fecha:** 2025-12-15
**Versión:** 1.0.0
**Autor:** Claude Code Session

---

## 🎯 Objetivo

Crear interpretaciones **profundamente personalizadas** para cada evento astrológico en la Agenda (lunas nuevas, lunas llenas, tránsitos, aspectos) que analicen cómo ese evento específico afecta al usuario basándose en:

- Su carta natal completa
- Su Solar Return actual
- Sus fortalezas identificadas
- Sus bloqueos específicos
- Su propósito de vida
- Sus patrones de amor/trabajo/espiritualidad

## ❌ Qué NO queremos

```
Luna Nueva en Tauro - 15 Mayo 2025
"Es momento de plantar semillas de abundancia.
Conéctate con la tierra y cultiva paciencia."
```
→ **Esto es GENÉRICO. Sirve para cualquier persona.**

## ✅ Qué SÍ queremos

```
Luna Nueva en Tauro - 15 Mayo 2025

Para TI específicamente, María, con tu Sol en Géminis Casa 3
y tu Luna en Escorpio Casa 8:

Esta Luna Nueva activa tu Casa 2 natal (dinero, valores, autoestima).
Tu naturaleza Géminis te hace dispersar energía en mil ideas,
PERO tu Luna Escorpio Casa 8 te da el poder de TRANSFORMACIÓN PROFUNDA
cuando focalizas.

**Tu Fortaleza a Usar**: Tu Mercurio en Casa 1 (tu voz es tu poder).
Durante esta Luna Nueva, MONETIZA tu palabra: escribe 3 formas de
transformar tu conocimiento en ingresos.

**Tu Bloqueo a Trabajar**: Tu Saturno en Casa 2 te hace sentir que
'no mereces ganar dinero fácilmente'. NO. Con Júpiter transitando
tu Casa 10 ahora mismo, el universo te está PIDIENDO que expandas
tu autoridad profesional.

**Mantra Personalizado**: 'Mi palabra escorpiana tiene valor material.
Mi dispersión geminiana se enfoca cuando mi intensidad lo decide.'

**Ejercicio Para Ti**: Escribe 3 formas de monetizar tu habilidad
comunicativa (Mercurio Casa 1). Con tu Luna en Escorpio, bucea PROFUNDO
en qué conocimiento transformador tienes que el mundo necesita pagar.
```

→ **Esto es PERSONALIZADO. Solo sirve para María.**

---

## 🏗️ Arquitectura del Sistema

### Componentes a Crear

```
src/
├── app/
│   └── api/
│       └── interpretations/
│           └── event/
│               └── route.ts          ← NUEVO: API endpoint para eventos
│
├── components/
│   └── agenda/
│       └── EventInterpretationButton.tsx  ← NUEVO: Botón para eventos
│
├── utils/
│   └── prompts/
│       └── eventInterpretationPrompt.ts   ← NUEVO: Prompt especializado
│
└── models/
    └── EventInterpretation.ts              ← NUEVO: Modelo MongoDB
```

---

## 📊 Flujo de Datos

```
1. Usuario ve evento en Agenda (Luna Nueva, etc.)
   ↓
2. Click en "Ver interpretación personalizada"
   ↓
3. EventInterpretationButton hace POST a /api/interpretations/event
   ↓
4. Endpoint busca:
   - Carta natal del usuario (completa)
   - Solar Return actual
   - Interpretación natal guardada (fortalezas/bloqueos/propósito)
   ↓
5. Genera prompt con TODO ese contexto + datos del evento
   ↓
6. Envía a OpenAI gpt-4o
   ↓
7. Recibe JSON con interpretación personalizada
   ↓
8. Guarda en MongoDB (cache 7 días por evento)
   ↓
9. Devuelve interpretación al frontend
   ↓
10. Se renderiza en modal similar a InterpretationButton
```

---

## 🎨 Estilo de Lenguaje

### Triple Fusionado Aplicado a Eventos

#### 1️⃣ **Motivador**
- Empodera ("Tu [fortaleza] te da el poder de...")
- Valida ("Probablemente has sentido...")
- Anima a la acción ("ACTIVA esto haciendo...")

#### 2️⃣ **Disruptivo**
- Directo sin eufemismos ("Tu Saturno te hace sentir que no mereces...")
- Honesto con sombras ("Este bloqueo viene de...")
- Reencuadra problemas ("NO es debilidad, es...")

#### 3️⃣ **Explicativo**
- Pedagógico ("Casa 2 = dinero, valores, autoestima")
- Claro sin tecnicismos ("Tu Luna en Escorpio Casa 8 significa...")
- Conecta infancia → patrón adulto → evento actual

#### 4️⃣ **Transformador**
- Conecta evento con evolución personal ("Este evento te invita a...")
- Ofrece ejercicios específicos ("Escribe 3 formas de...")
- Da mantras personalizados basados en su carta

---

## 📋 Estructura de Datos

### Input del Prompt

```typescript
interface EventInterpretationInput {
  // Usuario
  userId: string;

  // Evento
  event: {
    type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
    date: string; // YYYY-MM-DD
    sign: string; // Signo donde ocurre
    house: number; // Casa natal donde cae (1-12)
    planetsInvolved: string[]; // Ej: ['Sol', 'Luna']

    // Para tránsitos
    transitingPlanet?: string; // Ej: "Júpiter"
    natalPlanet?: string; // Ej: "Venus"
    aspectType?: string; // Ej: "conjunción"
  };

  // Contexto completo del usuario
  natalChart: any; // Carta natal completa
  solarReturn: any; // Solar Return actual
  natalInterpretation: any; // Interpretación guardada con fortalezas/bloqueos
}
```

### Output del Prompt

```typescript
interface EventInterpretation {
  // Título del evento
  titulo_evento: string;

  // Intro personalizada (100-150 palabras)
  para_ti_especificamente: string;

  // Tu fortaleza específica a usar
  tu_fortaleza_a_usar: {
    fortaleza: string; // Extraído de interpretación natal
    como_usarla: string; // Acción específica
  };

  // Tu bloqueo específico a trabajar
  tu_bloqueo_a_trabajar: {
    bloqueo: string; // Extraído de interpretación natal
    reframe: string; // Reencuadre transformador
  };

  // Mantra personalizado
  mantra_personalizado: string;

  // Ejercicio concreto
  ejercicio_para_ti: string;

  // Consejo específico basado en tránsitos actuales
  consejo_especifico: string;

  // Timing evolutivo
  timing_evolutivo: {
    que_sembrar: string; // Para Luna Nueva
    cuando_actuar: string; // Fase lunar + posición
    resultado_esperado: string; // Basado en su configuración
  };

  // Análisis técnico (opcional, para admins)
  analisis_tecnico?: {
    evento_en_casa_natal: number;
    significado_casa: string;
    planetas_natales_activados: string[];
    aspectos_cruzados: string[];
  };
}
```

---

## 🔧 Implementación Técnica

### 1. Endpoint API: `/api/interpretations/event`

```typescript
// src/app/api/interpretations/event/route.ts

export async function POST(request: NextRequest) {
  // 1. Autenticar usuario (Firebase)
  // 2. Parsear body: userId + eventData
  // 3. Buscar en cache MongoDB (si existe y no expiró)
  // 4. Si no existe:
  //    - Buscar carta natal
  //    - Buscar solar return actual
  //    - Buscar interpretación natal guardada
  //    - Generar prompt con contexto completo
  //    - Enviar a OpenAI
  //    - Parsear JSON response
  //    - Guardar en MongoDB (cache 7 días)
  // 5. Devolver interpretación
}

export async function GET(request: NextRequest) {
  // Buscar interpretación guardada por userId + eventId
}

export async function DELETE(request: NextRequest) {
  // Borrar cache de evento específico (regenerar)
}
```

### 2. Modelo MongoDB

```typescript
// src/models/EventInterpretation.ts

const EventInterpretationSchema = new Schema({
  userId: { type: String, required: true, index: true },

  eventId: {
    type: String,
    required: true,
    // Format: "luna_nueva_2025-05-15_tauro"
  },

  eventType: {
    type: String,
    enum: ['luna_nueva', 'luna_llena', 'transito', 'aspecto'],
    required: true
  },

  eventDate: { type: Date, required: true, index: true },

  interpretation: {
    type: Object, // JSON completo
    required: true
  },

  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }, // +7 días

  method: { type: String, default: 'openai' },
  cached: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Índice compuesto para búsquedas rápidas
EventInterpretationSchema.index({
  userId: 1,
  eventId: 1
}, {
  unique: true
});

// Auto-eliminar documentos expirados
EventInterpretationSchema.index({
  expiresAt: 1
}, {
  expireAfterSeconds: 0
});
```

### 3. Prompt Especializado

```typescript
// src/utils/prompts/eventInterpretationPrompt.ts

export function generateEventInterpretationPrompt(data: {
  userName: string;
  userAge: number;
  event: EventData;
  natalChart: any;
  solarReturn: any;
  natalInterpretation: any; // ← KEY: Contiene fortalezas/bloqueos identificados
}): string {

  // Extraer fortalezas del usuario de su interpretación natal
  const fortalezas = extractFortalezas(data.natalInterpretation);

  // Extraer bloqueos del usuario
  const bloqueos = extractBloqueos(data.natalInterpretation);

  // Identificar qué planetas natales activa este evento
  const planetasActivados = identificarPlanetasActivados(
    data.event,
    data.natalChart
  );

  return `
# 🌙 ERES UN ASTRÓLOGO EVOLUTIVO ESPECIALIZADO EN INTERPRETACIONES PERSONALIZADAS DE EVENTOS

## 📚 TU ESTILO: "MOTIVADOR DISRUPTIVO EXPLICATIVO TRANSFORMADOR"

**Características obligatorias:**
- **Motivador**: Empodera, valida, anima a la acción
- **Disruptivo**: Directo, honesto, sin eufemismos
- **Explicativo**: Pedagógico, claro, sin tecnicismos
- **Transformador**: Conecta evento con evolución personal

---

## 📊 DATOS DEL USUARIO

**Nombre:** ${data.userName}
**Edad:** ${data.userAge} años

### 🌟 FORTALEZAS IDENTIFICADAS (de su carta natal):
${fortalezas.map(f => `- ${f.nombre}: ${f.descripcion}`).join('\n')}

### 🔒 BLOQUEOS IDENTIFICADOS (de su carta natal):
${bloqueos.map(b => `- ${b.nombre}: ${b.descripcion}`).join('\n')}

### 🎯 PROPÓSITO DE VIDA (de su carta natal):
${data.natalInterpretation.proposito_vida || 'No disponible'}

---

## 🌙 EVENTO A INTERPRETAR

**Tipo:** ${data.event.type}
**Fecha:** ${data.event.date}
**Signo:** ${data.event.sign}
**Casa Natal:** ${data.event.house} (${getHouseMeaning(data.event.house)})
**Planetas Involucrados:** ${data.event.planetsInvolved.join(', ')}

### 🔗 PLANETAS NATALES QUE ESTE EVENTO ACTIVA:
${planetasActivados.map(p => `- ${p.planeta} natal en ${p.signo} Casa ${p.casa}`).join('\n')}

---

## 🎨 CARTA NATAL COMPLETA

**Sol:** ${getNatalSun(data.natalChart)}
**Luna:** ${getNatalMoon(data.natalChart)}
**Ascendente:** ${getNatalAsc(data.natalChart)}
**Medio Cielo:** ${getNatalMC(data.natalChart)}

[... resto de posiciones planetarias ...]

---

## 🌅 SOLAR RETURN ACTUAL (${getCurrentYear()}-${getCurrentYear() + 1})

**Sol SR:** ${getSRSun(data.solarReturn)}
**Luna SR:** ${getSRMoon(data.solarReturn)}
**Ascendente SR:** ${getSRAsc(data.solarReturn)}
**Tema del Año:** ${data.solarReturn.tema_anual || 'No disponible'}

---

## 📋 ESTRUCTURA JSON REQUERIDA

Responde ÚNICAMENTE con JSON válido en español (sin markdown, sin backticks):

{
  "titulo_evento": "String: Título memorable del evento con nombre del usuario",

  "para_ti_especificamente": "String de 100-150 palabras:
    - Empieza con 'Para TI, [NOMBRE], con tu [configuración natal específica]:'
    - Explica qué casa natal activa este evento
    - Menciona su signo solar/lunar y cómo interactúa con el evento
    - Usa MAYÚSCULAS para énfasis en palabras clave
    - Ejemplo: 'Para TI, María, con tu Sol en Géminis Casa 3 y tu Luna en Escorpio Casa 8:
      Esta Luna Nueva activa tu Casa 2 natal (dinero, valores, autoestima). Tu naturaleza
      Géminis te hace dispersar energía, PERO tu Luna Escorpio te da el poder de
      TRANSFORMACIÓN PROFUNDA cuando focalizas.'",

  "tu_fortaleza_a_usar": {
    "fortaleza": "String: UNA fortaleza específica de su carta (extraída de su interpretación natal)
      que es relevante para este evento. Ejemplo: 'Tu Mercurio en Casa 1'",
    "como_usarla": "String de 80-100 palabras: Cómo ACTIVAR esa fortaleza específicamente durante
      este evento. Debe ser acción CONCRETA. Ejemplo: 'Tu Mercurio en Casa 1 te da voz poderosa.
      Durante esta Luna Nueva en tu Casa 2, MONETIZA tu palabra: escribe 3 formas de transformar
      tu conocimiento en ingresos. Con tu Luna en Escorpio, bucea PROFUNDO en qué sabiduría
      transformadora tienes que el mundo necesita pagar.'"
  },

  "tu_bloqueo_a_trabajar": {
    "bloqueo": "String: UN bloqueo específico de su carta (extraído de su interpretación natal)
      que este evento puede ayudar a transformar. Ejemplo: 'Tu Saturno en Casa 2 te hace sentir
      que no mereces ganar dinero fácilmente'",
    "reframe": "String de 80-100 palabras: Reencuadre DISRUPTIVO del bloqueo. Muestra por qué
      NO es debilidad y cómo este evento es oportunidad de transformarlo. Ejemplo: 'NO. Tu Saturno
      en Casa 2 no es limitación, es MAESTRÍA que se construye con paciencia. Con Júpiter transitando
      tu Casa 10 ahora mismo, el universo te está PIDIENDO que expandas tu autoridad profesional.
      Esta Luna Nueva es tu permiso cósmico para COBRAR por tu expertise.'"
  },

  "mantra_personalizado": "String de 15-30 palabras: Mantra que integre su configuración natal
    específica con el evento. Debe usar posiciones planetarias reales. Ejemplo: 'Mi palabra
    escorpiana tiene valor material. Mi dispersión geminiana se enfoca cuando mi intensidad
    lo decide.'",

  "ejercicio_para_ti": "String de 80-120 palabras: Ejercicio CONCRETO y ESPECÍFICO basado en
    su carta natal + el evento. NO genérico. Debe mencionar posiciones planetarias específicas.
    Ejemplo: 'Escribe 3 formas de monetizar tu habilidad comunicativa (Mercurio Casa 1). Con
    tu Luna en Escorpio Casa 8, bucea PROFUNDO en qué conocimiento transformador tienes que el
    mundo necesita pagar. Tu Sol en Géminis te da versatilidad - usa eso para crear múltiples
    streams de ingresos basados en tu expertise.'",

  "consejo_especifico": "String de 100-150 palabras: Consejo basado en tránsitos actuales del
    Solar Return + posiciones natales + el evento. Debe ser MUY específico con planetas, casas,
    aspectos. Ejemplo: 'Con Júpiter transitando tu Casa 10 (vocación pública) y Plutón en Casa 11
    (grupos, redes), conecta con comunidades de emprendedores durante esta Luna Nueva. Tu
    configuración Sol-Mercurio en Casa 1 + Luna Casa 8 = eres alquimista de palabras que transforman.
    Esta Luna Nueva en tu Casa 2 es el timing perfecto para COBRAR por eso. Júpiter te expande,
    Plutón te transforma, la Luna Nueva te da nuevo inicio.'",

  "timing_evolutivo": {
    "que_sembrar": "String de 60-80 palabras: Qué sembrar específicamente basado en su carta + evento",
    "cuando_actuar": "String de 40-60 palabras: Cuándo actuar (fase lunar + posición en su carta)",
    "resultado_esperado": "String de 60-80 palabras: Qué resultado esperar basado en su configuración"
  },

  "analisis_tecnico": {
    "evento_en_casa_natal": ${data.event.house},
    "significado_casa": "${getHouseMeaning(data.event.house)}",
    "planetas_natales_activados": [
      ${planetasActivados.map(p => `"${p.planeta} en ${p.signo} Casa ${p.casa}"`).join(',\n      ')}
    ],
    "aspectos_cruzados": [
      "String: Aspecto 1 del evento con planeta natal",
      "String: Aspecto 2",
      "String: Aspecto 3"
    ]
  }
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS

1. **USA EL NOMBRE** del usuario al menos 3 veces
2. **USA POSICIONES ESPECÍFICAS** de su carta natal (no inventes)
3. **EXTRAE FORTALEZAS Y BLOQUEOS** de su interpretación natal guardada
4. **CONECTA** evento → carta natal → solar return → evolución personal
5. **SÉ ESPECÍFICO**: Menciona planetas, signos, casas reales
6. **TONO**: Motivador + disruptivo + explicativo + transformador
7. **NO GENÉRICO**: Todo debe ser único para esta persona
8. **PEDAGÓGICO**: Explica qué significa cada casa (entre paréntesis)
9. **JSON VÁLIDO**: Sin comentarios, sin markdown, cierra todas las llaves

---

## 🚫 LO QUE NO DEBES HACER

- ❌ No uses frases genéricas que sirvan para cualquier persona
- ❌ No inventes posiciones planetarias
- ❌ No ignores las fortalezas/bloqueos de su interpretación natal
- ❌ No seas vago ("tal vez", "puede que")
- ❌ No des consejos superficiales
- ❌ No olvides conectar con su propósito de vida

---

**AHORA GENERA LA INTERPRETACIÓN PERSONALIZADA DEL EVENTO.**
`;
}
```

### 4. Componente EventInterpretationButton

```typescript
// src/components/agenda/EventInterpretationButton.tsx

interface EventInterpretationButtonProps {
  userId: string;
  event: {
    type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
    date: string;
    sign: string;
    house: number;
    planetsInvolved: string[];
  };
  className?: string;
}

export default function EventInterpretationButton({
  userId,
  event,
  className
}: EventInterpretationButtonProps) {
  const [interpretation, setInterpretation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleGenerateInterpretation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interpretations/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, event })
      });

      const data = await response.json();

      if (data.success) {
        setInterpretation(data.interpretation);
        setShowModal(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error generando interpretación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerateInterpretation}
        disabled={loading}
        className={className}
      >
        {loading ? 'Generando...' : 'Ver Interpretación Personalizada'}
      </button>

      {showModal && (
        <EventInterpretationModal
          interpretation={interpretation}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
```

---

## 📅 Plan de Implementación

### Fase 1: Backend (Prioridad Alta)
- [ ] Crear endpoint `/api/interpretations/event` (POST/GET/DELETE)
- [ ] Crear modelo `EventInterpretation.ts` en MongoDB
- [ ] Crear función `generateEventInterpretationPrompt.ts`
- [ ] Integrar con OpenAI (gpt-4o)
- [ ] Implementar cache (7 días por evento)

### Fase 2: Frontend (Prioridad Alta)
- [ ] Crear componente `EventInterpretationButton.tsx`
- [ ] Crear componente `EventInterpretationModal.tsx` (similar a InterpretationButton)
- [ ] Integrar en página de Agenda `/agenda/page.tsx`
- [ ] Styling consistente con diseño actual

### Fase 3: Testing (Prioridad Media)
- [ ] Test con Luna Nueva
- [ ] Test con Luna Llena
- [ ] Test con Tránsito (Júpiter conjunción Venus natal)
- [ ] Test con Aspecto (Saturno cuadratura Sol natal)
- [ ] Verificar personalización (¿realmente es único?)

### Fase 4: Optimizaciones (Prioridad Baja)
- [ ] Pre-generar interpretaciones para próximos 30 días
- [ ] Notificaciones push cuando hay evento relevante
- [ ] Export PDF de interpretación
- [ ] Compartir en redes sociales

---

## 🎨 Ejemplos de Output Esperado

### Ejemplo 1: Luna Nueva en Tauro

```json
{
  "titulo_evento": "Luna Nueva en Tauro - Tu Portal de Materialización, María",

  "para_ti_especificamente": "Para TI, María, con tu Sol en Géminis Casa 3 (comunicación, aprendizaje, entorno cercano) y tu Luna en Escorpio Casa 8 (transformación, intimidad, recursos compartidos): Esta Luna Nueva en Tauro activa tu Casa 2 natal (dinero, valores, autoestima). Tu naturaleza Géminis te hace dispersar energía en mil ideas brillantes, PERO tu Luna Escorpio Casa 8 te da el poder de TRANSFORMACIÓN PROFUNDA cuando focalizas esa energía mental en UN objetivo material. Esta Luna Nueva te dice: es hora de MATERIALIZAR tu conocimiento.",

  "tu_fortaleza_a_usar": {
    "fortaleza": "Tu Mercurio en Casa 1 - Tu Voz como Poder",
    "como_usarla": "Tu Mercurio en Casa 1 (identidad, presencia) te da una voz MAGNÉTICA que impacta antes de que termines de hablar. Durante esta Luna Nueva en tu Casa 2, MONETIZA tu palabra: escribe 3 formas concretas de transformar tu conocimiento en ingresos. Con tu Luna en Escorpio, bucea PROFUNDO en qué sabiduría transformadora tienes que el mundo necesita pagar. Tu Sol Géminis te da versatilidad - crea múltiples streams de ingresos basados en tu expertise comunicativa."
  },

  "tu_bloqueo_a_trabajar": {
    "bloqueo": "Tu Saturno en Casa 2 - 'No merezco ganar dinero fácilmente'",
    "reframe": "NO. Tu Saturno en Casa 2 no es limitación, es MAESTRÍA que se construye con paciencia y estructura. Ese mensaje de 'debes trabajar duro para merecer' viene de tu infancia, pero ahora tú eres quien redefine qué significa 'trabajo'. Con Júpiter transitando tu Casa 10 (vocación pública) ahora mismo, el universo te está PIDIENDO que expandas tu autoridad profesional. Esta Luna Nueva es tu permiso cósmico para COBRAR por tu expertise sin culpa. Saturno te enseñó el valor del trabajo; ahora úsalo para crear estructuras de ingresos sostenibles."
  },

  "mantra_personalizado": "Mi palabra escorpiana tiene valor material. Mi dispersión geminiana se enfoca cuando mi intensidad lo decide. COBRO por transformar mentes.",

  "ejercicio_para_ti": "Esta semana, escribe 3 formas de monetizar tu habilidad comunicativa (Mercurio Casa 1): 1) ¿Qué conocimiento profundo tienes que otros necesitan? (Luna Escorpio) 2) ¿Cómo puedes enseñarlo de forma versátil? (Sol Géminis) 3) ¿Qué estructura de ingresos sostenible puedes crear? (Saturno Casa 2). Luego, con esta Luna Nueva en Tauro, SIEMBRA UNA de esas 3 ideas: escribe el primer post, graba el primer video, envía el primer email. Tu Luna Escorpio Casa 8 sabe que la transformación empieza con UN paso profundo, no mil pasos superficiales.",

  "consejo_especifico": "Con Júpiter transitando tu Casa 10 (vocación, reconocimiento público) y Plutón en Casa 11 (grupos, redes, comunidades), conecta con comunidades de emprendedores o creadores de contenido durante esta Luna Nueva. Tu configuración Sol-Mercurio en Casa 1 + Luna Casa 8 = eres alquimista de palabras que TRANSFORMAN. Esta Luna Nueva en tu Casa 2 es el timing perfecto para COBRAR por eso. Júpiter te expande profesionalmente, Plutón te da poder en redes, la Luna Nueva te da nuevo inicio financiero. USA estos tres tránsitos simultáneamente: presenta tu expertise en un grupo nuevo, ofrece tu servicio, COBRA tu valor.",

  "timing_evolutivo": {
    "que_sembrar": "Siembra UNA forma específica de monetizar tu conocimiento. No disperses en mil ideas (trampa Géminis). Usa tu foco escorpiano para elegir la que más te transforma Y más transforma a otros. Esa es tu goldmine.",
    "cuando_actuar": "Durante los próximos 14 días (de Luna Nueva a Luna Llena), toma ACCIÓN material: escribe la oferta, graba el contenido, envía los emails. Tu Luna en Escorpio necesita VER resultados tangibles para creer.",
    "resultado_esperado": "En 6 meses (para tu próxima Luna Nueva en Escorpio), habrás creado UN stream de ingresos sostenible basado en tu palabra transformadora. Tu Saturno Casa 2 lo hará sólido, tu Mercurio Casa 1 lo hará visible, tu Luna Escorpio Casa 8 lo hará profundamente valioso."
  }
}
```

---

## 🔐 Seguridad y Privacidad

- **Autenticación obligatoria**: Firebase Auth en todos los endpoints
- **Rate limiting**: Máximo 10 interpretaciones de eventos por día por usuario
- **Cache inteligente**: 7 días por evento (eventos pasados no se regeneran)
- **Datos sensibles**: No se almacenan datos personales más allá de userId

---

## 📈 Métricas de Éxito

- **Personalización**: ¿El 90%+ de las interpretaciones mencionan posiciones planetarias específicas del usuario?
- **Engagement**: ¿Los usuarios leen más del 70% de la interpretación?
- **Utilidad**: ¿Los usuarios reportan que la interpretación es "útil" o "muy útil"?
- **Retención**: ¿Los usuarios regresan a ver interpretaciones de múltiples eventos?

---

## 🚀 Roadmap Futuro

### v1.1 - Notificaciones
- Push notifications cuando hay evento relevante próximo
- Email con interpretación personalizada 3 días antes del evento

### v1.2 - Comparación de Eventos
- Ver cómo evolucionó un tema (ej: todas las Lunas Nuevas en Casa 2 del último año)
- Timeline de eventos similares y cómo los manejó

### v1.3 - Rituales Personalizados
- Para cada evento, generar ritual específico basado en carta natal
- Incluir: hora exacta, elementos a usar, palabras a decir

### v1.4 - Comunidad
- Compartir interpretaciones (anónimamente) con otros usuarios con configuraciones similares
- Foro de discusión por evento

---

**Última actualización:** 2025-12-15
**Estado:** Listo para implementación
**Prioridad:** Alta
