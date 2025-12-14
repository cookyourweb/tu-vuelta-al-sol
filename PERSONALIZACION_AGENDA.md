# 🎯 Personalización de Agenda Astrológica

## 📊 Estado Actual

### ✅ Implementado
- ✅ Función `getPersonalizedAdvice()` que lee `userProfile.astrological`
- ✅ Consejos personalizados basados en:
  - `challenges`: Puntos a trabajar (aislamiento, comunicación, etc.)
  - `strengths`: Fortalezas naturales
- ✅ Integración en Planetary Ingresses y Retrogrades

### ❌ Problema Detectado
**Los datos `astrological` NO se guardan en BD**

**Evidencia:**
```
✅ [BIRTH-DATA] Datos encontrados: {
  userId: 'jRcwB1HuFofRz1PX4aJuuQZRkha2',
  fullName: 'test',
  birthPlace: 'Hospital La Milagrosa...',
  livesInSamePlace: false,
  hasCurrentLocation: true
}
```

**Falta:**
- `astrological.challenges`
- `astrological.strengths`
- `astrological.lifeThemes`
- `astrological.signs` (Sol, Luna, Ascendente, etc.)
- `astrological.houses`
- `astrological.dominantElements`

**Resultado:**
- Consejos genéricos: "Observa cómo este evento influye en tu vida."
- NO hay personalización real

---

## 🛠️ Solución Propuesta

### 1. Modificar Modelo BirthData

**Archivo:** `src/models/BirthData.ts`

Agregar campos:
```typescript
{
  // ... campos existentes ...

  // Datos astrológicos calculados
  astrological: {
    signs: {
      sun: String,
      moon: String,
      ascendant: String,
      mercury: String,
      venus: String,
      mars: String
    },
    houses: {
      sun: Number,
      moon: Number,
      mercury: Number,
      venus: Number,
      mars: Number
    },
    dominantElements: [String], // ['fuego', 'tierra', ...]
    dominantMode: String, // 'cardinal', 'fijo', 'mutable'
    lifeThemes: [String], // ['Liderazgo', 'Creatividad', ...]
    strengths: [String], // ['Comunicación natural', 'Optimismo', ...]
    challenges: [String] // ['Aislamiento', 'Procrastinación', ...]
  }
}
```

### 2. Guardar Datos al Calcular Carta Natal

**Archivo:** `src/app/(dashboard)/natal-chart/page.tsx`

Después de calcular la carta:
```typescript
// Calcular carta natal
const natalChart = await calculateNatalChart(birthData);

// Extraer challenges, strengths, lifeThemes
const astrological = {
  signs: {
    sun: natalChart.planets.sun.sign,
    moon: natalChart.planets.moon.sign,
    ascendant: natalChart.ascendant.sign,
    // ...
  },
  // ...
  challenges: extractChallenges(natalChart),
  strengths: extractStrengths(natalChart)
};

// Guardar en BD
await fetch('/api/birth-data', {
  method: 'PATCH',
  body: JSON.stringify({
    userId,
    astrological
  })
});
```

### 3. Actualizar API Birth-Data

**Archivo:** `src/app/api/birth-data/route.ts`

Modificar GET para incluir `astrological`:
```typescript
return NextResponse.json({
  success: true,
  data: {
    // ... campos existentes ...

    // AGREGAR:
    astrological: birthData.astrological || undefined
  }
});
```

Modificar POST/PATCH para aceptar `astrological`:
```typescript
const updateData = {
  // ... campos existentes ...

  // Si viene astrological, guardarlo
  ...(body.astrological && { astrological: body.astrological })
};
```

---

## 🎯 Extracción de Challenges y Strengths

### Lógica Propuesta

#### Challenges (basados en aspectos difíciles):
- **Cuadraturas (90°):** Planeta en cuadratura → Challenge
  - Sol-Saturno: "Autoduda", "Pesimismo"
  - Luna-Marte: "Impulsividad emocional"
  - Venus-Saturno: "Aislamiento en relaciones"

- **Oposiciones (180°):** Balance difícil
  - Marte-Neptuno: "Falta de dirección"
  - Mercurio-Júpiter: "Comunicación excesiva"

- **Planetas retrógrados:**
  - Mercurio R: "Dificultad comunicativa"
  - Venus R: "Desafíos en amor"

#### Strengths (basados en aspectos armónicos):
- **Trígonos (120°):** Talentos naturales
  - Sol-Júpiter: "Optimismo natural", "Liderazgo"
  - Luna-Venus: "Empatía", "Don para relaciones"

- **Sextiles (60°):** Oportunidades
  - Mercurio-Urano: "Pensamiento innovador"
  - Venus-Marte: "Carisma personal"

- **Conjunciones positivas:**
  - Sol-Júpiter: "Magnetismo", "Abundancia"

### Ejemplo de Función

```typescript
function extractChallenges(natalChart: NatalChart): string[] {
  const challenges: string[] = [];

  // Buscar aspectos difíciles
  natalChart.aspects.forEach(aspect => {
    if (aspect.type === 'square') {
      if (aspect.planet1 === 'Venus' && aspect.planet2 === 'Saturno') {
        challenges.push('Aislamiento en relaciones');
      }
      if (aspect.planet1 === 'Marte' && aspect.planet2 === 'Neptuno') {
        challenges.push('Procrastinación');
      }
    }
  });

  return challenges;
}
```

---

## 📝 Ejemplos de Personalización

### Antes (genérico):
```
⚡ CONSEJO REVOLUCIONARIO
Adapta tu enfoque en Comunicación según la nueva energía Sagitario.
```

### Después (con challenges guardados):
```
⚡ CONSEJO REVOLUCIONARIO
TEST, este tránsito es PERFECTO para trabajar tu tendencia al aislamiento.
ATRÉVETE a conectar con otros, es tu momento de vencer esa barrera.
```

---

## 🚀 Plan de Implementación

### Fase 1: Guardar Datos Básicos ✅
1. ✅ Modificar modelo BirthData
2. ✅ Actualizar API birth-data
3. ✅ Guardar al calcular carta natal

### Fase 2: Extracción Inteligente
1. Crear función `extractChallenges()`
2. Crear función `extractStrengths()`
3. Crear función `extractLifeThemes()`

### Fase 3: Integración Completa
1. Usar datos en Agenda (ya implementado)
2. Usar datos en Solar Return
3. Crear "Consejo del Día" personalizado

### Fase 4: Día de Cumpleaños Especial 🎂
1. Detectar si hoy es cumpleaños
2. Mostrar banner especial: "¡FELIZ VUELTA AL SOL!"
3. Botón: "Ver Resumen de tu Año Solar"
4. Generar informe AI del año pasado + predicciones año nuevo

---

## 🎂 Funcionalidad Cumpleaños

**Requisito:** Cuando es el día de cumpleaños, mostrar algo especial.

### Implementación Propuesta

**En agenda/page.tsx:**
```typescript
const isBirthday = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getMonth() === birth.getMonth() &&
         today.getDate() === birth.getDate();
};

// En el render
{isBirthday(userProfile.birthDate) && (
  <div className="birthday-banner">
    <h2>🎉 ¡FELIZ VUELTA AL SOL, {userProfile.name}! 🎂</h2>
    <p>Hoy comienzas un nuevo año solar lleno de posibilidades</p>
    <button onClick={handleShowSolarYearSummary}>
      Ver Resumen de tu Año Solar
    </button>
  </div>
)}
```

### Modal "Resumen Año Solar"
- 🌟 Eventos más importantes del año pasado
- 📊 Estadísticas: cuántas lunas llenas, retrogrades, eclipses viviste
- 🎯 Predicciones para el próximo año
- 🔮 Consejo principal para tu nuevo ciclo

---

## ✅ Próximos Pasos

1. **URGENTE:** Modificar BirthData model para guardar `astrological`
2. **ALTA:** Modificar natal-chart para guardar challenges/strengths
3. **MEDIA:** Implementar funcionalidad cumpleaños
4. **BAJA:** Expandir personalización a más eventos (lunas, eclipses)

---

**Última actualización:** 2025-12-12
**Estado:** Investigación completada, pendiente implementación
