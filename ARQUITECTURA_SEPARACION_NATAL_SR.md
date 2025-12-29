# 🏗️ ARQUITECTURA DEFINITIVA - Separación Carta Natal vs Solar Return

## 📅 Fecha: 2025-12-26

---

## 🎯 PRINCIPIO FUNDAMENTAL

**NUNCA mezclar Carta Natal con Solar Return**

- **Carta Natal**: Describe QUIÉN ERES (permanente, sin años específicos)
- **Solar Return**: Describe QUÉ SE ACTIVA ESTE AÑO (temporal, comparando con natal)

---

## 📊 CARTA NATAL - Identidad Permanente

### 🎯 Función:
Mapa de **IDENTIDAD ESTRUCTURAL PERMANENTE**

### 📍 Ubicación en la App:
`/natal-chart`

### 🏗️ Estructura:

```
┌─────────────────────────────────────────────────┐
│ CARTA NATAL                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1️⃣ INTERPRETACIÓN COMPLETA                     │
│    Endpoint: /api/astrology/interpret-natal     │
│    Archivo: natalChartPrompt_clean.ts           │
│                                                 │
│    Contenido:                                   │
│    • Esencia Personal (Sol, Luna, Asc)         │
│    • Formación Temprana (infancia)             │
│    • Nodos Lunares (camino evolutivo)          │
│    • Síntesis Final                             │
│                                                 │
│    ⚠️ SIN:                                      │
│    ❌ Rituales                                  │
│    ❌ Mantras                                   │
│    ❌ Predicciones                              │
│    ❌ Referencias a años específicos            │
│    ❌ "Este año..." o "En 2025..."              │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ 2️⃣ PÁGINA CHART VISUAL                         │
│    Componente: ChartDisplay.tsx                 │
│    Tono: "Poético Antifrágil & Rebelde"        │
│                                                 │
│    A) PLANETAS INDIVIDUALES (click)             │
│       Endpoint: /api/astrology/interpret-planet │
│       Drawer: 5 secciones POÉTICAS              │
│                                                 │
│       • Educativo (¿qué es esto?)               │
│       • Poderoso (tu superpoder)                │
│       • Poético (metáforas, "Eres como...")     │
│       • Sombras (trampa + regalo)               │
│       • Síntesis (declaración de poder)         │
│                                                 │
│       Ejemplo:                                  │
│       "Eres como un volcán dormido que          │
│       despierta cuando alguien toca tu          │
│       seguridad..."                             │
│                                                 │
│    B) ASPECTOS INDIVIDUALES (click)             │
│       Drawer: Interpretación de aspectos        │
│       (Sol-Luna, Venus-Marte, etc.)             │
│                                                 │
│    C) SECCIONES SEPARADAS                       │
│       • Elementos (Fuego, Tierra, Aire, Agua)   │
│       • Modalidades (Cardinal, Fijo, Mutable)   │
│       • Casas (áreas de vida)                   │
│                                                 │
│ ⚠️ REGLA CRÍTICA:                               │
│ AQUÍ NO PUEDE ENTRAR NADA DE SOLAR RETURN       │
│ - No mencionar "este año"                       │
│ - No comparar con SR                            │
│ - Solo identidad permanente                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### ✅ PERMITIDO en Carta Natal:
- Describir quién eres permanentemente
- Metáforas poéticas ("Eres como...")
- Patrones de personalidad estructurales
- Referencias a infancia y formación
- Lenguaje emocional y transformador

### ❌ PROHIBIDO en Carta Natal:
- Mencionar años específicos (2025, este año, etc.)
- Predicciones ("vas a...", "tendrás...")
- Rituales o prácticas ("haz esto...")
- Mantras o afirmaciones
- Referencias a Solar Return
- Comparaciones temporales

---

## 🔄 SOLAR RETURN - Activación Anual

### 🎯 Función:
Mapa de **ACTIVACIÓN ANUAL** (qué parte de ti se entrena este año)

### 📍 Ubicación en la App:
`/solar-return`

### 🏗️ Estructura:

```
┌─────────────────────────────────────────────────┐
│ SOLAR RETURN                                    │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1️⃣ INTERPRETACIÓN COMPLETA SR                  │
│    Endpoint: /api/astrology/interpret-solar-    │
│              return                             │
│    Archivo: solarReturnPrompt_3layers.ts        │
│                                                 │
│    Contenido:                                   │
│    • apertura_anual (tema del año)              │
│    • como_se_vive_siendo_tu (personalizado)     │
│    • comparaciones_planetarias (RESUMEN)        │
│      └─ 7 planetas con 4 campos:                │
│         • natal (quién eres - 80-100 palabras)  │
│         • solar_return (qué se activa - 80-100) │
│         • choque (tensión/sinergia - 120-150)   │
│         • que_hacer (acción - 100-120)          │
│         • uso_agenda (lunas)                    │
│         • error_automatico                      │
│         • frase_clave                           │
│    • linea_tiempo_anual                         │
│    • sintesis_final                             │
│                                                 │
│    Tono: Profesional equilibrado               │
│                                                 │
│    ⚠️ SIN:                                      │
│    ❌ Lenguaje revolucionario agresivo          │
│    ❌ Predicciones fatalistas                   │
│    ❌ Describir natal sin comparar              │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ 2️⃣ PÁGINA CHART VISUAL SR                      │
│    Componente: ChartDisplay.tsx (chartType=SR)  │
│    Tono: Profesional y concreto                 │
│                                                 │
│    A) PLANETAS INDIVIDUALES SR (click)          │
│       Endpoint: /api/astrology/interpret-       │
│                 planet-sr                       │
│       Componente: PlanetIndividualDrawerSR.tsx  │
│       Hook: usePlanetIndividualSR.ts            │
│                                                 │
│       Drawer: 8 secciones PROFESIONALES         │
│                                                 │
│       • 🧬 QUIÉN ERES (Base Natal)              │
│         80-100 palabras                         │
│         Usa natal como referencia               │
│                                                 │
│       • ⚡ QUÉ SE ACTIVA ESTE AÑO               │
│         80-100 palabras                         │
│         Describe área/energía SR                │
│                                                 │
│       • 🔄 EL CRUCE CLAVE (Natal + Año)         │
│         120-150 palabras                        │
│         Comparación específica                  │
│         Identifica tensión o sinergia           │
│                                                 │
│       • 🎯 IMPACTO REAL EN TU VIDA ⭐ NUEVO     │
│         120-150 palabras                        │
│         Decisiones concretas del día a día      │
│         NO metáforas, SÍ ejemplos reales        │
│         "Durante este período: te vuelves..."   │
│                                                 │
│       • 💡 CÓMO USAR ESTA ENERGÍA ⭐ NUEVO      │
│         Acción concreta: 100-120 palabras       │
│         Ejemplo práctico: 50-70 palabras        │
│         Debe ser ACCIONABLE                     │
│                                                 │
│       • ⚠️ SOMBRAS A TRABAJAR ⭐ EXPANDIDO      │
│         Trampa automática: 60-80 palabras       │
│         Antídoto: 60-80 palabras                │
│         Directo, sin dramatismo                 │
│                                                 │
│       • 📌 SÍNTESIS ⭐ NUEVO                    │
│         30-40 palabras                          │
│         Resume el año para este planeta         │
│         Tono: claro, sin poesía                 │
│                                                 │
│       • 📅 CÓMO ESTO ENCAJA EN TU AGENDA        │
│         Luna Nueva: 40-50 palabras              │
│         Luna Llena: 40-50 palabras              │
│         Retrogradaciones: 40-50 palabras        │
│                                                 │
│       Ejemplo:                                  │
│       "Durante este período: te vuelves más     │
│       consciente de dónde inviertes tu energía, │
│       qué relaciones drenan recursos..."        │
│                                                 │
│    B) ASPECTOS INDIVIDUALES SR (click)          │
│       Drawer: Interpretación aspectos SR        │
│       (Futuro - no implementado aún)            │
│                                                 │
│    C) SECCIONES SEPARADAS                       │
│       • Timeline anual                          │
│       • Integración                             │
│       • Regenerate                              │
│                                                 │
│ ⚠️ REGLA CRÍTICA:                               │
│ AQUÍ NO PUEDE ENTRAR NADA DE CARTA NATAL        │
│ (excepto para COMPARAR)                         │
│ - Siempre comparar: "Normalmente eres X         │
│   (natal), pero este año se activa Y (SR)"      │
│ - No describir natal sin conectar con SR        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### ✅ PERMITIDO en Solar Return:
- Mencionar años específicos (2025, este año)
- Comparar natal vs SR ("Normalmente eres X, pero este año...")
- Acciones concretas y decisiones
- Referencias a ciclos lunares y timing
- Tono profesional y directo

### ❌ PROHIBIDO en Solar Return:
- Describir natal sin comparar con SR
- Lenguaje poético largo ("Eres como un volcán...")
- Metáforas extensas
- Describir identidad sin conectar con activación anual
- Predicciones fatalistas o deterministas

---

## 🔄 DIFERENCIAS ENTRE comparaciones_planetarias vs Interpretación Individual

### **comparaciones_planetarias** (Informe Completo SR)

**Ubicación**: Parte del JSON de Solar Return completo
**Endpoint**: `/api/astrology/interpret-solar-return` (POST)
**Cuándo se genera**: Al crear el informe anual completo

**Estructura**:
```json
{
  "comparaciones_planetarias": {
    "sol": {
      "natal": {
        "posicion": "Aries Casa 1",
        "descripcion": "80-100 palabras sobre quién eres"
      },
      "solar_return": {
        "posicion": "Aries Casa 10",
        "descripcion": "80-100 palabras sobre qué se activa"
      },
      "choque": "120-150 palabras comparando",
      "que_hacer": "100-120 palabras de acción",
      "uso_agenda": {
        "luna_nueva": "40-50 palabras",
        "luna_llena": "40-50 palabras",
        "retrogradaciones": "40-50 palabras"
      },
      "error_automatico": "Trampa común del año",
      "frase_clave": "Mantra funcional"
    }
  }
}
```

**Propósito**: Vista RESUMIDA para lectura de corrido
**Longitud total**: ~400-500 palabras por planeta
**Uso**: Lectura rápida del informe completo

---

### **Interpretación Individual** (Click en Planeta SR)

**Ubicación**: Endpoint separado
**Endpoint**: `/api/astrology/interpret-planet-sr` (POST/GET)
**Cuándo se genera**: Al hacer click en un planeta específico en el chart visual

**Estructura**:
```json
{
  "tooltip": {
    "simbolo": "☀️",
    "titulo": "Sol en Aries Casa 10",
    "grado": "0.5°",
    "area_activada": "carrera, liderazgo, visibilidad",
    "tipo_energia": "dinámica-iniciadora",
    "frase_clave": "Esto no es bueno ni malo. Es una ACTIVACIÓN."
  },
  "drawer": {
    "quien_eres": { ... },        // 80-100 palabras
    "que_se_activa": { ... },      // 80-100 palabras
    "cruce_clave": { ... },        // 120-150 palabras
    "impacto_real": { ... },       // 120-150 palabras ⭐ NUEVO
    "como_usar": { ... },          // 100-120 + 50-70 ⭐ NUEVO
    "sombras": { ... },            // 60-80 + 60-80 ⭐ EXPANDIDO
    "sintesis": { ... },           // 30-40 palabras ⭐ NUEVO
    "encaja_agenda": { ... }       // 40-50 x 3 = 120-150
  }
}
```

**Propósito**: Vista DETALLADA para estudio profundo
**Longitud total**: ~800-1000 palabras por planeta
**Uso**: Análisis individual en profundidad

---

## 📊 Comparación Lado a Lado

| Aspecto | comparaciones_planetarias | Interpretación Individual |
|---------|---------------------------|---------------------------|
| **Ubicación** | Informe completo SR | Endpoint separado |
| **Cuándo** | Al generar SR completo | Al click en planeta |
| **Propósito** | Vista resumida | Análisis profundo |
| **Secciones** | 4 campos esenciales | 8 secciones expandidas |
| **Longitud** | ~400 palabras | ~800-1000 palabras |
| **Tono** | Profesional conciso | Profesional expansivo |
| **Uso** | Lectura rápida | Estudio detallado |
| **Tooltip** | ❌ No tiene | ✅ Sí tiene |
| **Impacto Real** | ❌ No (está en choque) | ✅ Sí (sección separada) |
| **Ejemplos Prácticos** | ❌ No | ✅ Sí (en como_usar) |
| **Sombras Detalladas** | ⚠️ Solo error_automatico | ✅ Trampa + Antídoto |
| **Síntesis** | ❌ No | ✅ Sí |

---

## 🎯 SON COMPLEMENTARIAS, NO DUPLICADAS

**Flujo del usuario**:

1. **Lee informe completo SR** → Ve `comparaciones_planetarias` (resumen de 7 planetas)
2. **Hace click en Sol** → Se abre drawer con **8 secciones detalladas**
3. **Estudia en profundidad** → Obtiene ejemplos prácticos, sombras detalladas, síntesis

**Analogía**:
- `comparaciones_planetarias` = Índice de un libro (vista rápida)
- Interpretación individual = Capítulo completo (lectura profunda)

---

## 🔑 REGLAS DE ORO

### 1. Separación Estricta
- **Natal**: Nunca mencionar años específicos
- **SR**: Siempre comparar con natal

### 2. Tono Diferenciado
- **Natal**: Poético, emocional, metafórico
- **SR**: Profesional, concreto, directo

### 3. Función Clara
- **comparaciones_planetarias**: Resumen para lectura rápida
- **Interpretación individual**: Detalle para estudio profundo

### 4. No Mezclar Capas
- Cada estructura tiene su propósito
- No duplicar contenido innecesariamente
- Mantener coherencia entre ambas

---

## 📂 Archivos Clave

### Carta Natal:
- Prompt: `src/utils/prompts/natalChartPrompt_clean.ts`
- Endpoint: `src/app/api/astrology/interpret-natal/route.ts`
- Componente: `src/components/astrology/ChartTooltipsWithDrawer.tsx`
- Drawer: `src/components/astrology/InterpretationDrawer.tsx`

### Solar Return - Informe Completo:
- Prompt: `src/utils/prompts/solarReturnPrompt_3layers.ts`
- Endpoint: `src/app/api/astrology/interpret-solar-return/route.ts`
- Drawer: `src/components/solar-return/SolarReturnPlanetDrawer.tsx`

### Solar Return - Planetas Individuales:
- Prompt: `src/utils/prompts/planetIndividualSolarReturnPrompt.ts`
- Endpoint: `src/app/api/astrology/interpret-planet-sr/route.ts`
- Hook: `src/hooks/usePlanetIndividualSR.ts`
- Drawer: `src/components/solar-return/PlanetIndividualDrawerSR.tsx`
- Wrapper: `src/components/solar-return/PlanetClickableSR.tsx`
- Demo: `src/components/solar-return/PlanetListInteractiveSR.tsx`

### Types:
- `src/types/astrology/interpretation.ts`
  - `ComparacionPlanetaria` (para comparaciones_planetarias)
  - `PlanetIndividualSRInterpretation` (para interpretación individual)

---

## ✅ CHECKLIST de Verificación

Al desarrollar nuevas features, verificar:

- [ ] ¿Estoy en Carta Natal? → NO mencionar años específicos
- [ ] ¿Estoy en Solar Return? → SIEMPRE comparar con natal
- [ ] ¿Es informe completo SR? → Usar `comparaciones_planetarias` (resumen)
- [ ] ¿Es click en planeta SR? → Usar interpretación individual (detallada)
- [ ] ¿El tono es correcto? → Natal=poético, SR=profesional
- [ ] ¿La longitud es apropiada? → Resumen=400, Detalle=800

---

**Última actualización**: 2025-12-26
**Branch**: `claude/fix-solar-return-endpoints-vLCCr`
**Autor**: Claude Code Session
