# 🌟 SISTEMA DE INTERPRETACIONES ASTROLÓGICAS

## 📚 Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Comparativa de Enfoques](#comparativa-de-enfoques)
3. [Sistema Híbrido Elegido](#sistema-híbrido-elegido)
4. [Metodología](#metodología)
5. [Prompts y Ejemplos](#prompts-y-ejemplos)
6. [Plan de Implementación](#plan-de-implementación)
7. [Referencias](#referencias)

---

## 🏗️ Arquitectura del Sistema

### Flujo Actual

```
Usuario → UI → POST /api/astrology/interpret-natal
                      ↓
                   Genera 15+ interpretaciones individuales:
                      - 2 ángulos (ASC, MC)
                      - 10 planetas (Sol a Plutón)
                      - Asteroides (Lilith, Quirón)
                      - Nodos (Norte, Sur)
                      - Elementos (Fuego, Tierra, Aire, Agua)
                      - Modalidades (Cardinal, Fijo, Mutable)
                      - Aspectos (conjunciones, oposiciones, etc.)
                      ↓
                   MongoDB (cada una por separado)
                      ↓
                   GET → UI muestra tooltips/drawers
```

### Flujo Propuesto (Sistema Híbrido)

```
Usuario → UI → POST /api/astrology/interpret-natal-global
                      ↓
                   Genera SECCIONES PSICOLÓGICAS GLOBALES:
                      - formacion_temprana
                      - patrones_psicologicos
                      - planetas_profundos
                      - nodos_lunares
                      ↓
                   MongoDB (sección: "global")

              + POST /api/astrology/interpret-natal
                      ↓
                   Genera ELEMENTOS INDIVIDUALES (actual)
                      - Planetas, ángulos, aspectos
                      ↓
                   MongoDB (sección: "individual")
                      ↓
                   UI → Análisis Psicológico + Tooltips/Drawers
```

---

## 📊 Comparativa de Enfoques

### 1. Prompt OpenAI (Interpretación Completa)

**Ubicación:** Custom GPT en OpenAI
**Scope:** Carta COMPLETA en 1 solo call

#### Fortalezas

✅ **4 secciones psicológicas únicas:**
- `formacion_temprana` - Luna, IC/Casa 4, Saturno → raíces psicológicas
- `patrones_psicologicos` - Luna, Mercurio, Plutón → patrones actuales
- `planetas_profundos` - Plutón, Urano, Neptuno → fuerzas transformadoras
- `nodos_lunares` - Nodo Norte/Sur → evolución kármica

✅ Coherencia narrativa (toda la carta como historia)
✅ Más económico (1 call vs 15+)
✅ Glosario integrado
✅ Ejemplos antes/después
✅ Checklist de validación

#### Limitaciones

❌ No compatible con sistema actual de tooltips individuales
❌ Requiere refactorización completa de UI
❌ Menos granular (no puedes regenerar 1 planeta)

#### Estructura JSON

```json
{
  "esencia_revolucionaria": "2-3 párrafos",
  "proposito_vida": "2-3 párrafos",
  "formacion_temprana": "2-3 párrafos (Luna, IC, Saturno)",
  "patrones_psicologicos": "2-3 párrafos (Luna, Mercurio, Plutón)",
  "planetas_profundos": "2-3 párrafos (Plutón, Urano, Neptuno)",
  "nodos_lunares": "2 párrafos (Norte + Sur con casa y signo)",
  "planetas": {
    "sol": {
      "titulo": "☉ Sol en [Signo] - Casa [X]",
      "descripcion": "3 párrafos",
      "poder_especifico": "...",
      "accion_inmediata": "...",
      "ritual": "..."
    }
    // ... resto de planetas
  },
  "plan_accion": {
    "hoy_mismo": [],
    "esta_semana": [],
    "este_mes": []
  },
  "declaracion_poder": "SOY [NOMBRE], ...",
  "advertencias": [],
  "insights_transformacionales": [],
  "rituales_recomendados": []
}
```

---

### 2. Sistema Actual (route.ts)

**Ubicación:** `src/app/api/astrology/interpret-natal/route.ts`
**Scope:** Elementos INDIVIDUALES (15+ calls)

#### Fortalezas

✅ Tooltips/Drawers individuales (UX granular)
✅ Regeneración selectiva (1 planeta a la vez)
✅ Carga incremental (mejor UX)
✅ Ya funciona en producción

#### Limitaciones

❌ Sin secciones psicológicas globales
❌ Prompts cortos (~40 líneas)
❌ No menciona metodología explícita
❌ max_tokens: 2500 (puede cortar)
❌ Sin análisis de infancia/patrones

#### Estructura JSON (por elemento)

```json
{
  "tooltip": {
    "titulo": "🌟 ...",
    "descripcionBreve": "...",
    "significado": "2-3 líneas",
    "efecto": "1 frase",
    "tipo": "Arquetipo"
  },
  "drawer": {
    "titulo": "🌟 ...",
    "educativo": "3-5 párrafos",
    "poderoso": "4-6 párrafos",
    "poetico": "2-3 párrafos",
    "sombras": [{
      "nombre": "...",
      "descripcion": "...",
      "trampa": "❌ ...",
      "regalo": "✅ ..."
    }],
    "sintesis": {
      "frase": "máx 15 palabras",
      "declaracion": "'Yo soy...' 2-4 líneas"
    }
  }
}
```

---

### 3. Prompts Evolutivos (natalEvolutivePrompts.ts)

**Ubicación:** `src/utils/prompts/natalEvolutivePrompts.ts`
**Scope:** Elementos INDIVIDUALES con enfoque psicológico

#### Fortalezas

✅ **Metodología explícita:**
- Astrología Evolutiva (Jeffrey Wolf Green)
- Psicología Transpersonal (Jung, Grof)
- Teoría del Apego (Bowlby, Ainsworth)
- Trauma y Sistema Nervioso (Levine, van der Kolk)

✅ **3 CAPAS por interpretación:**
1. TÉCNICA: Qué es astrológicamente
2. PSICOLÓGICA: Patrón infancia + limitaciones actuales
3. EVOLUTIVA: Hacia dónde evolucionar + prácticas

✅ MÍNIMOS obligatorios (120-200 palabras/sección)
✅ Incluye aspectos (tensos + armónicos)
✅ Preguntas guía psicológicas
✅ Ejemplos de tono integrados

#### Limitaciones

❌ Sin secciones globales (formacion_temprana, etc.)
❌ Prompts MUY largos (~150 líneas c/u)
❌ Puede ser "demasiado" para OpenAI procesar

#### Estructura JSON (igual que actual pero más profundo)

```json
{
  "tooltip": { /* igual */ },
  "drawer": {
    "titulo": "...",
    "educativo": "MÍNIMO 120-150 palabras. CAPA TÉCNICA...",
    "poderoso": "MÍNIMO 150-200 palabras. CAPA PSICOLÓGICA:
                 - Patrón de infancia
                 - Cómo te limita hoy
                 - Evolución consciente",
    "poetico": "MÍNIMO 100-120 palabras. TRANSFORMACIONAL...",
    "sombras": [/* más detalladas */],
    "sintesis": { /* igual */ }
  }
}
```

---

## 🎯 Sistema Híbrido Elegido

### Por qué Híbrido

Combina lo mejor de los 3 enfoques:

1. **Del Prompt OpenAI:**
   - 4 secciones psicológicas globales
   - Tono disruptivo y empoderador
   - Glosario integrado

2. **Del Sistema Actual:**
   - Tooltips/drawers individuales (UX funciona)
   - Granularidad (regenerar 1 elemento)
   - Arquitectura probada

3. **De Prompts Evolutivos:**
   - Metodología explícita
   - 3 capas (técnica, psicológica, evolutiva)
   - Enfoque trauma/apego

### Arquitectura Híbrida

```
┌─────────────────────────────────────────┐
│   ANÁLISIS PSICOLÓGICO PROFUNDO         │
│   (1 call - Secciones globales)         │
├─────────────────────────────────────────┤
│ • Formación Temprana                    │
│ • Patrones Psicológicos                 │
│ • Planetas Profundos                    │
│ • Nodos Lunares                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   ELEMENTOS INDIVIDUALES                │
│   (15+ calls - Tooltips/Drawers)        │
├─────────────────────────────────────────┤
│ • Planetas (Sol a Plutón)               │
│ • Ángulos (ASC, MC)                     │
│ • Aspectos                              │
│ • Asteroides                            │
└─────────────────────────────────────────┘
```

---

## 📚 Metodología

### Bases Teóricas

#### 1. Astrología Evolutiva (Jeffrey Wolf Green)

**Premisa:**
La carta natal no es destino fijo sino **mapa evolutivo del alma**.

**Herramientas clave:**
- Plutón = transformación profunda, poder bloqueado
- Nodo Sur = karma, talentos pasados, zona de confort
- Nodo Norte = propósito evolutivo, cualidades a desarrollar

**Aplicación:**
Identificar patrones kármicos y dirigir conscientemente la evolución.

---

#### 2. Psicología Transpersonal (Jung, Grof)

**Premisa:**
La psique humana trasciende el ego personal e incluye lo colectivo/espiritual.

**Conceptos aplicados:**
- **Arquetipos** = Planetas como fuerzas universales
- **Sombra** = Aspectos rechazados (cuadraturas, oposiciones)
- **Individuación** = Proceso de integración (tránsitos, progresiones)

**Aplicación:**
- Cuadraturas = Sombras a integrar
- Conjunciones con planetas lentos = Arquetipos activados
- Casa 12 = Inconsciente colectivo

---

#### 3. Teoría del Apego (Bowlby, Ainsworth)

**Premisa:**
Los vínculos tempranos determinan patrones relacionales adultos.

**Estilos de apego astrológicos:**
- **Seguro** = Luna en trígono a Venus, aspecto armónico Saturno
- **Evitativo** = Venus-Urano (miedo a dependencia), Saturno-Luna
- **Ansioso** = Luna-Plutón (intensidad emocional), Luna en Casa 8
- **Desorganizado** = Aspectos complejos Luna-Saturno-Urano

**Aplicación:**
- Luna = Figura materna, necesidades emocionales
- Casa 4 = Ambiente familiar
- Saturno = Límites y estructura recibidos
- Venus = Cómo damos/recibimos amor

---

#### 4. Trauma y Sistema Nervioso (Levine, van der Kolk)

**Premisa:**
El trauma vive en el cuerpo y crea respuestas automáticas de supervivencia.

**Respuestas astrológicas:**
- **Lucha** = Marte dominante, Aries fuerte
- **Huida** = Neptuno fuerte, Piscis, Casa 12
- **Congelación** = Saturno-Luna, Capricornio en planetas personales
- **Apaciguamiento** = Libra dominante, Venus-Luna

**Aplicación:**
- Marte = Cómo respondemos a amenaza
- Saturno = Miedo, rigidez, control
- Plutón = Traumas profundos, crisis regenerativas
- Casa 8 = Zona de muerte/renacimiento

---

### Principios de Interpretación

#### 1. La Carta como Proceso (no personalidad fija)

**Pregunta guía:**
"¿Cómo aprendiste a sobrevivir y qué te impide vivir ahora?"

**Análisis:**
- **Sol** = Cómo aprendiste a ser visto/validado
- **Luna** = Cómo aprendiste a sentir/pedir
- **Ascendente** = Máscara de supervivencia desarrollada
- **Casa 4** = Ambiente que moldeó tus respuestas

---

#### 2. Todo Aspecto "Difícil" es Oportunidad

**Cuadraturas:**
- NO son castigos
- SON tensiones que empujan al crecimiento
- El "problema" es el material de la evolución

**Ejemplo:**
```
Luna cuadratura Saturno
❌ Tradicional: "Dificultad emocional, frialdad"
✅ Evolutivo: "Aprendiste que tus emociones eran 'demasiado'
              o 'inconvenientes'. Tu evolución: honrar tus
              sentimientos sin disculparte."
```

---

#### 3. Planetas = Necesidades Psicológicas

| Planeta | Necesidad Psicológica |
|---------|----------------------|
| ☉ Sol | Ser visto, validado, tener propósito |
| ☽ Luna | Seguridad emocional, nutrición, conexión |
| ☿ Mercurio | Ser escuchado, comprendido, aprender |
| ♀ Venus | Amor, belleza, placer, valorarse |
| ♂ Marte | Actuar, defenderse, afirmar deseos |
| ♃ Júpiter | Significado, expansión, fe |
| ♄ Saturno | Estructura, maestría, límites sanos |
| ♅ Urano | Individualidad, libertad, autenticidad |
| ♆ Neptuno | Conexión espiritual, trascendencia |
| ♇ Plutón | Transformación, poder personal, regeneración |

---

## 🎨 Prompts y Ejemplos

### Tono Disruptivo (del Prompt OpenAI)

#### ✅ IDEAL: Sol en Acuario Casa 1

```
¿Te dijeron que eras "rara"? Perfecto.

María, tu Sol (tu propósito vital, lo que te da sentido) está en
Acuario, el signo que no vino a encajar sino a cambiar las reglas.
Y lo tienes en Casa 1 (tu identidad visible).

Mientras el mundo se repite, tú ves lo que nadie ve.
No estás fuera de lugar. Estás fuera del molde.
Y ahí comienza tu poder.
```

**Estructura:**
1. **Gancho emocional** - "¿Te dijeron que eras rara?"
2. **Educación integrada** - "(tu propósito vital...)"
3. **Reencuadre poderoso** - "No estás fuera de lugar..."

---

#### ❌ EVITAR: Genérico

```
"Tu Sol en Acuario indica originalidad e independencia."
```

**Por qué no funciona:**
- Pasivo ("indica")
- Sin conexión emocional
- Sin explicación de términos
- Genérico (podría ser cualquier persona)

---

### Formación Temprana (Sección Global)

#### ✅ IDEAL

```
María, tu Luna en Libra en Casa 7 revela que desde pequeña
aprendiste que tu seguridad emocional dependía de mantener
la paz con otros.

Tu Fondo del Cielo (IC, el punto más bajo de tu carta que
representa tus raíces) en Cáncer sugiere un hogar que
valoraba la armonía por encima de la autenticidad.

Saturno en Casa 4 añade otra capa: es posible que sintieras
responsabilidad emocional temprana, quizás cuidando de otros
o siendo "la fuerte" de la familia.

Estos patrones no son tu culpa - son lo que absorbiste.
Pero ahora, reconocerlos te da poder de elegir:
¿sigues manteniendo la paz a costa de tu autenticidad?
```

**Elementos clave:**
- Menciona **Luna, IC/Casa 4, Saturno** (planetas de infancia)
- Explica qué aprendió de niño
- Conecta con patrón actual
- Empodera con pregunta final

---

### Glosario Integrado

**Términos que SIEMPRE se explican:**

```
- Sol = tu propósito vital, esencia, lo que te da sentido
- Luna = mundo emocional, necesidades, respuestas automáticas
- Ascendente (ASC) = máscara social, cómo te presentas
- Medio Cielo (MC) = vocación, lo que el mundo ve de ti
- Fondo del Cielo (IC) = raíces, hogar, familia de origen
- Casa 1 = identidad visible, personalidad
- Casa 4 = hogar, familia, raíces emocionales
- Casa 7 = relaciones, parejas, asociaciones
- Casa 8 = transformación, crisis, profundidades
- Nodo Norte = hacia dónde evolucionas
- Nodo Sur = de dónde vienes, karma
```

**Formato:**
```
"tu Luna (mundo emocional, necesidades básicas)"
"Tu Fondo del Cielo (IC, raíces familiares)"
```

---

## 🚀 Plan de Implementación

### Fase 1: Secciones Globales

#### 1.1 Crear endpoint nuevo

**Archivo:** `src/app/api/astrology/interpret-natal-global/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // Recibe: userId, chartData, userProfile
  // Genera: formacion_temprana, patrones_psicologicos,
  //         planetas_profundos, nodos_lunares
  // 1 solo call a OpenAI
  // Guarda en MongoDB con chartType: 'natal-global'
}

export async function GET(request: NextRequest) {
  // Recibe: userId
  // Retorna: secciones globales si existen
}
```

---

#### 1.2 Crear prompt global

**Archivo:** `src/utils/prompts/natalGlobalPrompts.ts`

```typescript
export function generateNatalGlobalPrompt(data: {
  chartData: any;
  userProfile: any;
}): string {
  // Basado en prompt OpenAI
  // Genera SOLO las 4 secciones psicológicas
  // Analiza: Luna, IC, Saturno, Plutón, Urano, Neptuno, Nodos
}
```

---

### Fase 2: Mejorar Prompts Individuales

#### 2.1 Actualizar route.ts

**Cambios:**
- Aumentar max_tokens: 2500 → 4000
- Integrar tono del prompt OpenAI
- Añadir glosario inline
- Mejorar estructura de preguntas guía

---

#### 2.2 Híbrido de prompts

**Combinar:**
- Tono disruptivo (OpenAI)
- 3 capas (Evolutivos)
- Longitud moderada (compromiso)

```typescript
const prompt = `
Eres un astrólogo revolucionario especializado en transformación cósmica.

${planet.name} en ${planet.sign} en Casa ${planet.house}

GENERA 3 CAPAS:

1. TÉCNICA (2 párrafos):
   - Qué significa ${planet.name}
   - Qué añade ${planet.sign}
   - Qué activa Casa ${planet.house}
   - Explica términos inline

2. PSICOLÓGICA (3 párrafos):
   - ¿Qué aprendiste de niño con este ${planet.name}?
   - ¿Cómo te protegió y cómo te limita hoy?
   - ¿Qué necesidad emocional representa?

3. TRANSFORMACIONAL (2 párrafos):
   - ¿Hacia dónde evolucionar?
   - Práctica concreta HOY
   - Afirmación en primera persona

TONO: "¿Te dijeron que...? NO. [Reencuadre poderoso]"
`;
```

---

### Fase 3: UI

#### 3.1 Nueva sección en página Carta Natal

```tsx
{/* ANÁLISIS PSICOLÓGICO PROFUNDO */}
<section className="mb-12">
  <h2>🧠 Análisis Psicológico Profundo</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <h3>👶 Formación Temprana</h3>
      {globalAnalysis.formacion_temprana}
    </Card>

    <Card>
      <h3>🔁 Patrones Psicológicos</h3>
      {globalAnalysis.patrones_psicologicos}
    </Card>

    <Card>
      <h3>💎 Planetas Profundos</h3>
      {globalAnalysis.planetas_profundos}
    </Card>

    <Card>
      <h3>🧭 Nodos Lunares</h3>
      {globalAnalysis.nodos_lunares}
    </Card>
  </div>
</section>

{/* PLANETAS INDIVIDUALES (actual) */}
<section>
  <h2>🪐 Tus Planetas</h2>
  {/* Tooltips/Drawers actuales */}
</section>
```

---

### Fase 4: Testing

#### 4.1 Checklist de validación

```
☐ Secciones globales se generan correctamente
☐ Mencionan Luna, IC, Saturno en formacion_temprana
☐ Mencionan Plutón, Urano, Neptuno en planetas_profundos
☐ Nodos incluyen casa Y signo explícitamente
☐ Tono disruptivo pero comprensible
☐ Términos explicados inline
☐ Acciones específicas (no vagas)
☐ Nombre usado 1-2 veces por sección
☐ JSON válido
☐ Elementos individuales siguen funcionando
```

---

## 📖 Referencias

### Astrología Evolutiva
- **Jeffrey Wolf Green** - "Pluto: The Evolutionary Journey of the Soul"
- **Steven Forrest** - "The Inner Sky"

### Psicología Transpersonal
- **Carl Jung** - "El Hombre y Sus Símbolos"
- **Stanislav Grof** - "Psicología Transpersonal"

### Teoría del Apego
- **John Bowlby** - "Attachment and Loss"
- **Mary Ainsworth** - "Patterns of Attachment"

### Trauma y Sistema Nervioso
- **Peter Levine** - "Waking the Tiger"
- **Bessel van der Kolk** - "The Body Keeps the Score"

### Astrología Técnica
- **Mary Fortier Shea** - "The Progressed Horoscope"
- **Celeste Teal** - "Predicting Events with Astrology"
- **Anthony Louis** - "Horary Astrology"

---

## 📝 Notas de Implementación

### Consideraciones Técnicas

**max_tokens recomendados:**
- Secciones globales: 6000-8000 (4 secciones x ~1500 palabras c/u)
- Elementos individuales: 3000-4000 (más que actual 2500)

**Temperature:**
- Mantener 0.8 (creativo pero coherente)

**Model:**
- `gpt-4o` (actual)
- Considerar `gpt-4o-2024-08-06` para JSON mode más confiable

**Caching:**
- Secciones globales: 7 días (cambian menos)
- Elementos individuales: 24h (pueden regenerarse más)

---

**Última actualización:** 2025-01-19
**Versión:** 1.0
**Autor:** Sistema Híbrido (OpenAI + route.ts + Evolutivo)
