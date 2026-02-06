# 🎨 Frontend - Planetas Individuales Solar Return

## 📅 Fecha: 2025-12-26

---

## ✅ Componentes Implementados

### 1. **Hook: `usePlanetIndividualSR`**
**Archivo**: `/src/hooks/usePlanetIndividualSR.ts`

**Función**: Maneja la lógica de fetch de interpretaciones (caché o generación nueva)

**Uso**:
```typescript
import { usePlanetIndividualSR } from '@/hooks/usePlanetIndividualSR';

const { interpretation, isLoading, error, fetchInterpretation } = usePlanetIndividualSR();

// Llamar al endpoint
await fetchInterpretation({
  userId: 'abc123',
  planetName: 'urano',
  returnYear: 2025,
  userFirstName: 'Ana',
  natalSign: 'Aries',
  natalHouse: 3,
  natalDegree: 15.2,
  srSign: 'Tauro',
  srHouse: 2,
  srDegree: 23.3,
});
```

---

### 2. **Drawer: `PlanetIndividualDrawerSR`**
**Archivo**: `/src/components/solar-return/PlanetIndividualDrawerSR.tsx`

**Función**: Muestra las 8 secciones profesionales de la interpretación

**Características**:
- ✅ 8 secciones profesionales (NO poéticas)
- ✅ Animación desde la derecha
- ✅ Cierre con ESC
- ✅ Estados de loading y error
- ✅ Diseño responsive

**Secciones**:
1. 🧬 QUIÉN ERES (Base Natal)
2. ⚡ QUÉ SE ACTIVA ESTE AÑO
3. 🔄 EL CRUCE CLAVE (Natal + Año)
4. 🎯 IMPACTO REAL EN TU VIDA
5. 💡 CÓMO USAR ESTA ENERGÍA A TU FAVOR
6. ⚠️ SOMBRAS A TRABAJAR
7. 📌 SÍNTESIS
8. 📅 CÓMO ESTO ENCAJA EN TU AGENDA

---

### 3. **Componente Wrapper: `PlanetClickableSR`**
**Archivo**: `/src/components/solar-return/PlanetClickableSR.tsx`

**Función**: Componente reutilizable que integra hook + drawer

**Patrón Render Props**:
```typescript
<PlanetClickableSR
  planetName="urano"
  userId={user.uid}
  returnYear={2025}
  userFirstName="Ana"
  natalSign="Aries"
  natalHouse={3}
  natalDegree={15.2}
  srSign="Tauro"
  srHouse={2}
  srDegree={23.3}
>
  {({ onClick, isLoading }) => (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Cargando...' : 'Ver Urano'}
    </button>
  )}
</PlanetClickableSR>
```

**Ventajas**:
- Maneja todo el estado internamente
- Abre drawer automáticamente
- Muestra loading state
- Fetch automático si no está en caché

---

### 4. **Demo: `PlanetListInteractiveSR`**
**Archivo**: `/src/components/solar-return/PlanetListInteractiveSR.tsx`

**Función**: Componente de ejemplo listo para usar

**Uso simple**:
```typescript
import { PlanetListInteractiveSR } from '@/components/solar-return/PlanetListInteractiveSR';

<PlanetListInteractiveSR
  userId={user.uid}
  returnYear={2025}
  userFirstName="Ana"
  planets={[
    {
      name: 'Sol',
      natalSign: 'Aries',
      natalHouse: 1,
      natalDegree: 15,
      srSign: 'Aries',
      srHouse: 10,
      srDegree: 0.5
    },
    // ... más planetas
  ]}
/>
```

---

## 🚀 Cómo Integrar en la Página de Solar Return

### Opción 1: Usar el componente demo (Rápido)

**Archivo a modificar**: `/src/app/(dashboard)/solar-return/page.tsx`

```typescript
import { PlanetListInteractiveSR } from '@/components/solar-return/PlanetListInteractiveSR';

// Dentro del componente, después de cargar datos:
{solarReturnData && natalChart && (
  <section className="mb-8">
    <PlanetListInteractiveSR
      userId={user.uid}
      returnYear={solarReturnData.returnYear}
      userFirstName={user.displayName?.split(' ')[0] || 'Usuario'}
      planets={[
        {
          name: 'Sol',
          natalSign: natalChart.planets.find(p => p.name === 'Sol')?.sign || '',
          natalHouse: natalChart.planets.find(p => p.name === 'Sol')?.house || 1,
          natalDegree: natalChart.planets.find(p => p.name === 'Sol')?.degree || 0,
          srSign: solarReturnData.planets.find(p => p.name === 'Sol')?.sign || '',
          srHouse: solarReturnData.planets.find(p => p.name === 'Sol')?.house || 1,
          srDegree: solarReturnData.planets.find(p => p.name === 'Sol')?.degree || 0,
        },
        // Repetir para Luna, Mercurio, Venus, Marte, Júpiter, Saturno
      ]}
    />
  </section>
)}
```

---

### Opción 2: Integrar en el ChartDisplay existente (Avanzado)

Si quieres que los planetas del chart visual sean clicables:

**1. Modificar el renderizado de planetas en ChartWheel**

Envolver cada planeta con `PlanetClickableSR`:

```typescript
{planets.map((planet) => (
  <PlanetClickableSR
    key={planet.name}
    planetName={planet.name.toLowerCase()}
    userId={userId}
    returnYear={solarReturnYear}
    userFirstName={userFirstName}
    natalSign={getNatalPlanet(planet.name).sign}
    natalHouse={getNatalPlanet(planet.name).house}
    natalDegree={getNatalPlanet(planet.name).degree}
    srSign={planet.sign}
    srHouse={planet.house}
    srDegree={planet.degree}
  >
    {({ onClick, isLoading }) => (
      <g
        key={planet.name}
        onClick={onClick}
        style={{ cursor: isLoading ? 'wait' : 'pointer' }}
        onMouseEnter={() => setHoveredPlanet(planet.name)}
        onMouseLeave={() => setHoveredPlanet(null)}
      >
        {/* Renderizado del planeta en SVG */}
        <circle cx={x} cy={y} r={8} fill={PLANET_COLORS[planet.name]} />
        <text x={x} y={y}>{PLANET_SYMBOLS[planet.name]}</text>
      </g>
    )}
  </PlanetClickableSR>
))}
```

---

## 📋 Ejemplo Completo Funcional

Para probar rápidamente, puedes añadir esto a la página de Solar Return:

```typescript
'use client';

import { useState } from 'react';
import { PlanetClickableSR } from '@/components/solar-return/PlanetClickableSR';

export default function SolarReturnPage() {
  const [user, setUser] = useState({ uid: 'test123', displayName: 'Ana García' });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        ☀️ Retorno Solar 2025
      </h1>

      {/* Lista de planetas clicables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Ejemplo: Urano */}
        <PlanetClickableSR
          planetName="urano"
          userId={user.uid}
          returnYear={2025}
          userFirstName="Ana"
          natalSign="Aries"
          natalHouse={3}
          natalDegree={15.2}
          srSign="Tauro"
          srHouse={2}
          srDegree={23.3}
        >
          {({ onClick, isLoading }) => (
            <button
              onClick={onClick}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg p-4 transition-all shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">♅</span>
                  <div className="text-left">
                    <div className="font-bold text-lg">Urano</div>
                    <div className="text-xs text-indigo-200">Natal: Aries Casa 3</div>
                    <div className="text-xs text-purple-200">SR: Tauro Casa 2</div>
                  </div>
                </div>
                {isLoading ? (
                  <span className="animate-spin text-2xl">⏳</span>
                ) : (
                  <span className="text-2xl">→</span>
                )}
              </div>
            </button>
          )}
        </PlanetClickableSR>

        {/* Repetir para otros planetas... */}
      </div>
    </div>
  );
}
```

---

## 🎯 Flujo de Usuario

1. **Usuario hace clic en planeta** (Ej: Urano)
2. **Se abre drawer** (muestra "Generando interpretación..." si es la primera vez)
3. **Hook llama al endpoint** `/api/astrology/interpret-planet-sr`
   - Si existe en caché → retorna inmediatamente
   - Si NO existe → OpenAI genera + guarda en MongoDB
4. **Drawer muestra las 8 secciones** con interpretación profesional
5. **Usuario cierra drawer** (botón X o tecla ESC)

---

## 🔄 Diferencias vs Carta Natal

| Aspecto | Carta Natal | Retorno Solar |
|---------|-------------|---------------|
| **Tono** | Poético, emocional | Profesional, concreto |
| **Ejemplo** | "Eres como un volcán..." | "Durante este período: te vuelves más consciente..." |
| **Secciones** | 5 (Educativo, Poderoso, Poético, Sombras, Síntesis) | 8 (Quién eres, Qué se activa, Cruce, Impacto real, Cómo usar, Sombras, Síntesis, Agenda) |
| **Función** | Identidad permanente | Activación anual |
| **Color tema** | Purple/Pink gradients | Blue/Indigo gradients |

---

## 🐛 Testing

### 1. Probar endpoint directamente

```bash
curl -X POST http://localhost:3000/api/astrology/interpret-planet-sr \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "planetName": "urano",
    "returnYear": 2025,
    "natalSign": "Aries",
    "natalHouse": 3,
    "natalDegree": 15.2,
    "srSign": "Tauro",
    "srHouse": 2,
    "srDegree": 23.3,
    "userFirstName": "Ana"
  }'
```

### 2. Verificar en MongoDB

```javascript
db.interpretations.findOne({
  userId: "test123",
  chartType: "solar-return",
  returnYear: 2025
})

// Debe tener:
// interpretations.planets_individual.urano-sr-2025
```

### 3. Verificar en frontend

1. Abrir página Solar Return
2. Click en cualquier planeta
3. Verificar que se abre drawer con loading
4. Verificar que aparecen las 8 secciones
5. Cerrar drawer (X o ESC)
6. Volver a hacer click → debe abrir instantáneo (caché)

---

## 📦 Archivos Creados

| Archivo | Función |
|---------|---------|
| `/src/hooks/usePlanetIndividualSR.ts` | Hook para fetch de interpretaciones |
| `/src/components/solar-return/PlanetIndividualDrawerSR.tsx` | Drawer con 8 secciones |
| `/src/components/solar-return/PlanetClickableSR.tsx` | Wrapper con render props |
| `/src/components/solar-return/PlanetListInteractiveSR.tsx` | Componente demo listo para usar |
| `/FRONTEND_PLANETA_INDIVIDUAL_SR.md` | Esta documentación |

---

## 🚀 Próximos Pasos

1. **Añadir a página de Solar Return** (usar componente demo o integrar en chart visual)
2. **Probar con todos los planetas** (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno)
3. **Ajustar estilos** si es necesario
4. **Optimizar rendimiento** (pregenerar interpretaciones más comunes)

---

## 💡 Tips de Implementación

### Para Añadir Tooltips (Opcional)

Si quieres mostrar un tooltip rápido al hover ANTES del click:

```typescript
{({ onClick, isLoading }) => (
  <div className="relative group">
    <button onClick={onClick}>
      Ver Urano
    </button>

    {/* Tooltip al hover */}
    <div className="absolute hidden group-hover:block bg-black/90 text-white p-2 rounded text-xs">
      Click para ver interpretación completa
    </div>
  </div>
)}
```

### Para Deshabilitar Click Durante Carga

El componente ya maneja esto automáticamente a través del render prop `isLoading`.

### Para Manejar Errores

```typescript
const { interpretation, isLoading, error } = usePlanetIndividualSR();

{error && (
  <div className="text-red-400 text-sm">
    Error: {error}
  </div>
)}
```

---

**Última actualización**: 2025-12-26
**Branch**: `claude/fix-solar-return-endpoints-vLCCr`
**Autor**: Claude Code Session
