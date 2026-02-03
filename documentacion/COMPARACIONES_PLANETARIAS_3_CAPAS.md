# 🔄 Sistema de Comparaciones Planetarias - Arquitectura de 3 Capas

## 📅 Fecha: 2025-12-25

---

## 🎯 Objetivo del Sistema

Implementar comparaciones personalizadas entre la **Carta Natal** y el **Retorno Solar** para generar interpretaciones únicas que reflejen:

1. **Quién eres** (Natal - identidad permanente)
2. **Qué se activa este año** (Solar Return - área/energía anual)
3. **Dónde choca o potencia** (Comparación - tensión o sinergia)
4. **Qué hacer** (Acción concreta - guía práctica)

---

## 🏗️ Arquitectura de 3 Capas

```
CAPA 1: CARTA NATAL
   ↓
   Solo identidad estructural
   SIN rituales, mantras, predicciones
   Válido permanentemente

CAPA 2: RETORNO SOLAR ← ESTAMOS AQUÍ
   ↓
   Qué se activa este año
   COMPARACIONES con natal
   Tono profesional

CAPA 3: AGENDA (Futuro)
   ↓
   Rituales y prácticas
   Timing lunar
   Ejercicios personalizados
```

---

## 🔥 Fórmula Obligatoria para Comparaciones

Cada planeta DEBE tener las **4 partes obligatorias**:

### 1️⃣ ¿QUIÉN ERES? (natal)
- **Posición**: Signo y Casa natal
- **Descripción**: 80-100 palabras sobre la identidad permanente
- **Fuente**: Interpretación natal guardada en MongoDB (si existe)

**Ejemplo:**
```json
{
  "natal": {
    "posicion": "Mercurio en Piscis Casa 1",
    "descripcion": "Tu mente es sensible, intuitiva, poética. Piensas a través de imágenes y sensaciones, no solo de lógica. Necesitas expresarte para aclararte. Tu forma de comunicar es empática y conecta emocionalmente."
  }
}
```

### 2️⃣ ¿QUÉ SE ACTIVA? (solar_return)
- **Posición**: Signo y Casa SR
- **Descripción**: 80-100 palabras sobre qué área/energía se entrena este año

**Ejemplo:**
```json
{
  "solar_return": {
    "posicion": "Mercurio en Acuario Casa 12",
    "descripcion": "Este año tu mente no funciona como siempre. Se activa el silencio, la distancia mental, la necesidad de pensar ANTES de hablar. Casa 12 pide retiro interno, procesar en privado, no comunicar todo."
  }
}
```

### 3️⃣ ¿DÓNDE CHOCA O POTENCIA? (choque)
- **120-150 palabras**
- Comparación específica entre natal y SR
- Identificar TENSIÓN o SINERGIA

**Ejemplo:**
```json
{
  "choque": "Aquí está el choque: normalmente necesitas hablar para pensar (Mercurio en Casa 1), pero este año se activa el silencio antes de comunicar (Casa 12). Como tu mente natal es sensible (Piscis), y este año Mercurio en Acuario te pide distanciamiento, vas a sentir que 'no puedes pensar claro'. NO ES QUE PIENSES MAL — es que estás aprendiendo a pensar de otra manera."
}
```

### 4️⃣ ¿QUÉ HACER? (que_hacer)
- **100-120 palabras**
- Acción concreta basada en el choque
- NO consejos genéricos
- Específico para las casas y signos reales

**Ejemplo:**
```json
{
  "que_hacer": "No fuerces claridad inmediata. Da espacio al silencio antes de hablar. No compartas cada pensamiento (tu zona cómoda Casa 1), espera a que madure internamente (Casa 12). Usa el distanciamiento de Acuario para observar tus patrones mentales sin juzgarlos. Escribe en privado antes de comunicar públicamente."
}
```

---

## 📂 Estructura Técnica Implementada

### TypeScript Interfaces

```typescript
// src/types/astrology/interpretation.ts

export interface UsoAgenda {
  luna_nueva: string;
  luna_llena: string;
  retrogradaciones: string;
}

export interface ComparacionPlanetaria {
  natal: {
    posicion: string;
    descripcion: string;
  };
  solar_return: {
    posicion: string;
    descripcion: string;
  };
  choque: string;
  que_hacer: string;
  uso_agenda: UsoAgenda;
  error_automatico: string;
  frase_clave: string;
}

export interface ComparacionesPlanetarias {
  sol: ComparacionPlanetaria;
  luna: ComparacionPlanetaria;
  mercurio: ComparacionPlanetaria;
  venus: ComparacionPlanetaria;
  marte: ComparacionPlanetaria;
  jupiter: ComparacionPlanetaria;
  saturno: ComparacionPlanetaria;
}
```

### Prompt Actualizado

**Archivo**: `src/utils/prompts/solarReturnPrompts_v2.ts`

**Cambios**:
1. ✅ Acepta parámetro `natalInterpretations?`
2. ✅ Genera sección `comparaciones_planetarias` en JSON
3. ✅ Usa interpretaciones natales si existen
4. ✅ Incluye `uso_agenda` para Layer 3

### Endpoint Actualizado

**Archivo**: `src/app/api/astrology/interpret-solar-return/route.ts`

**Cambios**:
1. ✅ Busca interpretaciones natales en MongoDB
2. ✅ Pasa `natalInterpretations` al prompt
3. ✅ Logs para debugging

**Código clave**:
```typescript
// Buscar interpretación natal
const natalDoc = await db.collection('interpretations_complete').findOne({
  userId,
  chartType: 'natal-complete'
});

if (natalDoc) {
  natalInterpretations = natalDoc.interpretation;
}

// Generar prompt con interpretaciones natales
const prompt = generateSolarReturnProfessionalPrompt({
  natalChart,
  solarReturnChart,
  userProfile,
  returnYear,
  srComparison,
  natalInterpretations  // ✅ NEW
});
```

---

## 🔄 Flujo Completo del Sistema

```
1. Usuario solicita Retorno Solar
   ↓
2. API verifica si existe interpretación natal guardada
   ↓
3. Si existe natal → usa sus interpretaciones planetarias
   Si NO existe → genera descripciones desde datos natales
   ↓
4. Genera prompt SR con comparaciones
   ↓
5. OpenAI genera JSON con estructura completa
   ↓
6. JSON incluye comparaciones_planetarias para cada planeta:
   - Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno
   ↓
7. Cada comparación tiene:
   - natal (quién eres)
   - solar_return (qué se activa)
   - choque (dónde choca/potencia)
   - que_hacer (acción concreta)
   - uso_agenda (para Layer 3)
   - error_automatico (trampa común)
   - frase_clave (mantra funcional)
   ↓
8. Respuesta guardada en MongoDB
   ↓
9. Frontend muestra comparaciones en Drawer
```

---

## 📋 Ejemplo Completo: Mercurio

### Carta Natal (Layer 1)
```json
{
  "mercurio": {
    "titulo": "🗣️ Tu Mente y Comunicación",
    "posicion": "Piscis Casa 1",
    "interpretacion": "Tu mente es sensible, intuitiva, poética. Piensas a través de imágenes y sensaciones..."
  }
}
```

### Retorno Solar (Layer 2)
```json
{
  "comparaciones_planetarias": {
    "mercurio": {
      "natal": {
        "posicion": "Piscis Casa 1",
        "descripcion": "Tu mente es sensible, intuitiva. Necesitas expresarte para aclararte."
      },
      "solar_return": {
        "posicion": "Acuario Casa 12",
        "descripcion": "Este año tu mente necesita distancia, silencio, retiro interno."
      },
      "choque": "Normalmente piensas sintiendo y hablas para aclararte (Piscis Casa 1), pero este año se activa el pensar en silencio (Acuario Casa 12). El choque es: expresión vs retiro.",
      "que_hacer": "No fuerces claridad inmediata. Da espacio al silencio. Escribe en privado antes de comunicar.",
      "uso_agenda": {
        "luna_nueva": "Inicia desde el silencio. Escribe sin compartir.",
        "luna_llena": "Revisa si estás forzando claridad o evitando procesar.",
        "retrogradaciones": "Mercurio retrógrado: tiempo de retiro mental profundo."
      },
      "error_automatico": "Hablar antes de pensar, forzar claridad inmediata",
      "frase_clave": "El silencio también es inteligencia"
    }
  }
}
```

### Agenda (Layer 3 - Futuro)
- **Luna Nueva Enero**: Ritual de escritura privada sin compartir
- **Luna Llena Enero**: Revisar si estás expresando o guardando todo
- **Mercurio Retrógrado**: Meditación de silencio mental

---

## 🧪 Testing del Sistema

### 1. Verificar interpretación natal existe
```bash
# Buscar en MongoDB
db.interpretations_complete.findOne({
  userId: "test123",
  chartType: "natal-complete"
})
```

### 2. Solicitar SR
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

### 3. Verificar JSON generado
```json
{
  "comparaciones_planetarias": {
    "sol": { ... },
    "luna": { ... },
    "mercurio": {
      "natal": { "posicion": "...", "descripcion": "..." },
      "solar_return": { "posicion": "...", "descripcion": "..." },
      "choque": "...",
      "que_hacer": "...",
      "uso_agenda": { ... },
      "error_automatico": "...",
      "frase_clave": "..."
    }
  }
}
```

---

## ⚠️ Limitaciones Actuales

### 1. Frontend NO actualizado
El componente `InterpretationDrawer.tsx` aún NO muestra las comparaciones planetarias.

**Próximo paso**: Actualizar drawer para mostrar:
- Tooltip: Frase clave + error automático
- Drawer completo: Las 4 partes + uso_agenda

### 2. Layer 3 (Agenda) NO implementado
El campo `uso_agenda` está preparado pero aún NO se usa en la Agenda Astrológica.

**Próximo paso**: Crear servicio de Agenda que consuma `comparaciones_planetarias.*.uso_agenda`

### 3. Ejercicios personalizados NO generados
Faltan los 5 tipos de ejercicios mencionados por el usuario:
1. Ejercicio de conciencia (journaling)
2. Acción guiada (micro-acción)
3. Mantra funcional (corrección conductual)
4. Meditación breve (funcional, no mística)
5. Pregunta de integración (reflexión)

**Próximo paso**: Añadir campo `ejercicios_personalizados` en `ComparacionPlanetaria`

---

## 📊 Antes y Después

### ❌ ANTES (Sin comparaciones)
```json
{
  "sol": "Este año tu Sol está en Casa 10...",
  "luna": "Tu Luna está en Casa 7...",
  // Sin relación con quién eres normalmente
}
```

### ✅ DESPUÉS (Con comparaciones)
```json
{
  "comparaciones_planetarias": {
    "sol": {
      "natal": "Normalmente brillas comunicando (Sol Casa 3)",
      "solar_return": "Este año debes brillar liderando (Sol Casa 10 SR)",
      "choque": "El choque es: expresión vs liderazgo público",
      "que_hacer": "No te quedes solo compartiendo ideas, comprométete con proyectos visibles"
    }
  }
}
```

---

## 🔑 Principios Clave

### 1. NO predicciones, sino personalizaciones
- ❌ "Este año tendrás éxito en el trabajo"
- ✅ "Normalmente brillas hablando (Casa 3), pero este año entrenas liderazgo público (Casa 10)"

### 2. Usar datos natales REALES
- ❌ "Tu Mercurio te hace comunicativo"
- ✅ "Tu Mercurio en Piscis Casa 1 te hace pensar sintiendo, pero este año (Acuario Casa 12) necesitas distancia mental"

### 3. Cada comparación es ÚNICA
- ❌ Consejos genéricos que sirven para todos
- ✅ Acción específica basada en TU natal vs TU SR

### 4. Preparar Layer 3 (Agenda)
- Campo `uso_agenda` ya incluido
- Luna Nueva, Luna Llena, Retrogradaciones
- Listo para consumir desde Agenda

---

## 📚 Archivos Modificados

### 1. Prompt
`src/utils/prompts/solarReturnPrompts_v2.ts`
- ✅ Acepta `natalInterpretations`
- ✅ Genera `comparaciones_planetarias`
- ✅ Instrucciones críticas añadidas

### 2. Endpoint
`src/app/api/astrology/interpret-solar-return/route.ts`
- ✅ Busca interpretaciones natales en MongoDB
- ✅ Pasa `natalInterpretations` al prompt

### 3. Tipos
`src/types/astrology/interpretation.ts`
- ✅ `ComparacionPlanetaria`
- ✅ `ComparacionesPlanetarias`
- ✅ `UsoAgenda`
- ✅ Añadido a `CompleteSolarReturnInterpretation`

---

## 🚀 Próximos Pasos

### 1. Actualizar Frontend ⏳
- Modificar `InterpretationDrawer.tsx`
- Mostrar comparaciones en lugar de estructura antigua
- Tooltip vs Drawer diferenciado

### 2. Implementar Layer 3 (Agenda) ⏳
- Crear prompt de Agenda
- Consumir `uso_agenda` de comparaciones
- Generar rituales y ejercicios personalizados

### 3. Añadir Ejercicios Personalizados ⏳
- 5 tipos de ejercicios basados en choque natal vs SR
- Integrar con ciclos lunares

### 4. Testing Completo ⏳
- Probar con usuarios reales
- Verificar calidad de comparaciones
- Ajustar prompts según feedback

---

## 🎓 Filosofía del Sistema

> "La carta natal describe quién eres. El retorno solar muestra qué parte de ti se entrena este año. La agenda te ayuda a elegir cómo responder."

**Separación de capas:**
- Natal = Identidad permanente (quién eres SIEMPRE)
- Solar Return = Activación anual (qué entrenas ESTE AÑO)
- Agenda = Prácticas concretas (cómo VIVES esto día a día)

**Personalización real:**
- Cada comparación es única
- Basada en datos astronómicos reales
- Sin predicciones genéricas

---

**Última actualización**: 2025-12-25
**Branch**: `claude/fix-solar-return-endpoints-vLCCr`
**Autor**: Claude Code Session
