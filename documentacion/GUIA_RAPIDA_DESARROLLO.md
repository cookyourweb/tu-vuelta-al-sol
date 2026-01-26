# 🚀 GUÍA RÁPIDA DE DESARROLLO

## 📋 Cheatsheet para Desarrolladores

---

## ❓ ¿Dónde Estoy Trabajando?

### CARTA NATAL
```bash
❌ NO mencionar: "este año", "2025", "el próximo mes"
❌ NO incluir: rituales, mantras, predicciones
✅ SÍ describir: quién eres permanentemente
✅ SÍ usar: metáforas poéticas ("Eres como un volcán...")
```

**Archivos principales**:
- Prompt: `src/utils/prompts/natalChartPrompt_clean.ts`
- Endpoint: `src/app/api/astrology/interpret-natal/route.ts`
- Tono: **Poético Antifrágil & Rebelde**

---

### SOLAR RETURN
```bash
✅ SÍ mencionar: "este año", "2025", años específicos
✅ SÍ comparar: "Normalmente eres X (natal), pero este año Y (SR)"
❌ NO usar: metáforas largas, lenguaje revolucionario agresivo
❌ NO describir: natal sin comparar con SR
```

**Archivos principales**:
- Prompt informe: `src/utils/prompts/solarReturnPrompt_3layers.ts`
- Prompt individual: `src/utils/prompts/planetIndividualSolarReturnPrompt.ts`
- Endpoint informe: `src/app/api/astrology/interpret-solar-return/route.ts`
- Endpoint individual: `src/app/api/astrology/interpret-planet-sr/route.ts`
- Tono: **Profesional y Concreto**

---

## 🎯 ¿Qué Estoy Implementando?

### Informe Completo (Natal o SR)
```typescript
// Vista GENERAL de todo el año/carta
// Longitud: 2000-3000 palabras total
// Usuario lee de corrido
```

**Estructura Natal**:
- Esencia Personal
- Formación Temprana
- Nodos Lunares
- Síntesis Final

**Estructura SR**:
- apertura_anual
- como_se_vive_siendo_tu
- comparaciones_planetarias (resumen)
- linea_tiempo_anual
- sintesis_final

---

### Click en Planeta Individual

#### NATAL:
```typescript
// Drawer: 5 secciones PROFESIONALES
{
  educativo: "¿Qué es esto?",
  poderoso: "Tu superpoder",
  impacto_real: "Cómo se manifiesta en tu vida",
  sombras: "Trampa + Regalo",
  sintesis: "Declaración de poder"
}
```

**Longitud**: ~400 palabras
**Tono**: Profesional con profundidad psicológica (NO poético excesivo)
**Ejemplo**: "Durante tu vida: - No toleras espacios donde tengas que esconder tu autenticidad..."

---

#### SOLAR RETURN:
```typescript
// Drawer: 8 secciones PROFESIONALES
{
  quien_eres: "Base natal (80-100 palabras)",
  que_se_activa: "Área SR (80-100 palabras)",
  cruce_clave: "Comparación (120-150 palabras)",
  impacto_real: "Decisiones concretas (120-150 palabras)",
  como_usar: "Acción + Ejemplo (100-120 + 50-70)",
  sombras: "Trampa + Antídoto (60-80 + 60-80)",
  sintesis: "Resumen (30-40 palabras)",
  encaja_agenda: "Lunas (40-50 x 3)"
}
```

**Longitud**: ~800-1000 palabras
**Tono**: Profesional, concreto
**Ejemplo**: "Durante este período: te vuelves más consciente de..."

---

## 🔄 comparaciones_planetarias vs Interpretación Individual

### comparaciones_planetarias (Resumen)
```json
// En informe completo SR
// 4 campos esenciales
{
  "natal": { "posicion": "...", "descripcion": "80-100 palabras" },
  "solar_return": { "posicion": "...", "descripcion": "80-100 palabras" },
  "choque": "120-150 palabras",
  "que_hacer": "100-120 palabras"
}
```

**Uso**: Lectura rápida (ver todos los planetas de un vistazo)

---

### Interpretación Individual (Detalle)
```json
// Endpoint separado al click en planeta
// 8 secciones expandidas
{
  "tooltip": { ... },
  "drawer": {
    "quien_eres": { ... },
    "que_se_activa": { ... },
    "cruce_clave": { ... },
    "impacto_real": { ... },  // ⭐ NUEVO
    "como_usar": { ... },      // ⭐ NUEVO
    "sombras": { ... },        // ⭐ EXPANDIDO
    "sintesis": { ... },       // ⭐ NUEVO
    "encaja_agenda": { ... }
  }
}
```

**Uso**: Estudio profundo (analizar UN planeta en detalle)

---

## ⚡ Comandos Rápidos

### Probar Endpoint Natal
```bash
curl -X POST http://localhost:3000/api/astrology/interpret-natal \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "natalChart": {...},
    "userProfile": {...}
  }'
```

### Probar Endpoint SR Completo
```bash
curl -X POST http://localhost:3000/api/astrology/interpret-solar-return \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "natalChart": {...},
    "solarReturnChart": {...},
    "userProfile": {...},
    "returnYear": 2025
  }'
```

### Probar Endpoint SR Individual
```bash
curl -X POST http://localhost:3000/api/astrology/interpret-planet-sr \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "planetName": "sol",
    "returnYear": 2025,
    "natalSign": "Aries",
    "natalHouse": 1,
    "natalDegree": 15.2,
    "srSign": "Aries",
    "srHouse": 10,
    "srDegree": 0.5,
    "userFirstName": "Ana"
  }'
```

### Verificar en MongoDB
```javascript
// Ver interpretación natal
db.interpretations_complete.findOne({
  userId: "test123",
  chartType: "natal-complete"
})

// Ver interpretación SR completa
db.interpretations.findOne({
  userId: "test123",
  chartType: "solar-return",
  returnYear: 2025
})

// Ver interpretación individual de planeta SR
db.interpretations.findOne({
  userId: "test123",
  chartType: "solar-return",
  returnYear: 2025
}, {
  "interpretations.planets_individual": 1
})
```

---

## 🎨 Estilos y Componentes

### Carta Natal
```tsx
// Drawer color: purple/pink gradients
className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900"

// Drawer component
<InterpretationDrawer
  isOpen={isOpen}
  onClose={onClose}
  content={drawerContent}
/>
```

### Solar Return
```tsx
// Drawer color: blue/indigo gradients
className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900"

// Drawer component (comparaciones)
<SolarReturnPlanetDrawer
  isOpen={isOpen}
  onClose={onClose}
  planetName={planetName}
  comparacion={comparacion}
/>

// Drawer component (individual)
<PlanetIndividualDrawerSR
  isOpen={isOpen}
  onClose={onClose}
  planetName={planetName}
  interpretation={interpretation}
  isLoading={isLoading}
/>
```

---

## 📝 Ejemplos de Texto

### ❌ MAL - Natal mencionando años
```
"Este año tu Sol en Aries te hará más valiente"
```

### ✅ BIEN - Natal permanente
```
"Eres como un guerrero que necesita retos constantes
para sentirse vivo. Tu naturaleza es pionera,
impulsiva, directa."
```

---

### ❌ MAL - SR sin comparar con natal
```
"Tu Sol está en Casa 10 este año"
```

### ✅ BIEN - SR comparando con natal
```
"Normalmente brillas comunicando ideas (Sol natal Casa 3),
pero este año se activa el liderazgo público (Sol SR Casa 10).
El choque es: expresión vs responsabilidad visible."
```

---

### ❌ MAL - SR con metáforas largas
```
"Eres como un águila que vuela alto sobre montañas
nevadas buscando su presa mientras el sol se oculta
en el horizonte..."
```

### ✅ BIEN - SR profesional y concreto
```
"Durante este período: te vuelves más consciente de
dónde inviertes tu energía, qué relaciones drenan
recursos, qué hábitos sostienen o erosionan tu
estabilidad material."
```

---

## 🔍 Debugging

### Ver logs en consola
```javascript
console.log('🪐 [PLANET-SR] Generating interpretation...')
console.log('✅ [PLANET-SR] Found in cache')
console.log('❌ [PLANET-SR] Error:', error)
```

### Verificar estructura JSON
```typescript
// Validar que el JSON tiene todos los campos requeridos
if (!interpretation.tooltip || !interpretation.drawer) {
  throw new Error('Invalid interpretation structure');
}

// Validar drawer tiene 8 secciones
const requiredSections = [
  'quien_eres', 'que_se_activa', 'cruce_clave',
  'impacto_real', 'como_usar', 'sombras',
  'sintesis', 'encaja_agenda'
];
```

---

## ⚠️ Errores Comunes

### 1. Mezclar tonos
```
❌ Natal: "Este año serás más valiente" (predicción)
❌ SR: "Eres como un volcán dormido" (metáfora larga)

✅ Natal: "Tu naturaleza es valiente y pionera"
✅ SR: "Este año entrenas liderazgo público"
```

### 2. No comparar en SR
```
❌ "Tu Sol está en Casa 10"

✅ "Normalmente brillas en Casa 3 (comunicación),
   pero este año se activa Casa 10 (liderazgo)"
```

### 3. Usar estructura incorrecta
```
❌ comparaciones_planetarias con 8 secciones
❌ Interpretación individual con 4 campos

✅ comparaciones_planetarias = 4 campos (resumen)
✅ Interpretación individual = 8 secciones (detalle)
```

---

## 📚 Documentación Completa

- `ARQUITECTURA_3_CAPAS.md` - Concepto de 3 capas
- `COMPARACIONES_PLANETARIAS_3_CAPAS.md` - Sistema de comparaciones
- `ARQUITECTURA_SEPARACION_NATAL_SR.md` - Separación estricta Natal vs SR
- `PLANETA_INDIVIDUAL_SR.md` - Backend individual planetas SR
- `FRONTEND_PLANETA_INDIVIDUAL_SR.md` - Frontend individual planetas SR
- `GUIA_RAPIDA_DESARROLLO.md` - Esta guía

---

**Última actualización**: 2025-12-26
