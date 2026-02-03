# 📚 ÍNDICE DE DOCUMENTACIÓN - Tu Vuelta al Sol

## 🗂️ Guía Completa de Documentación del Proyecto

---

## 🚀 INICIO RÁPIDO

### Para Nuevos Desarrolladores:
1. **Lee primero**: `CLAUDE.md` (visión general del proyecto)
2. **Luego**: `GUIA_RAPIDA_DESARROLLO.md` (cheatsheet de desarrollo)
3. **Después**: `ARQUITECTURA_SEPARACION_NATAL_SR.md` (reglas críticas)

---

## 📖 DOCUMENTACIÓN PRINCIPAL

### 🎯 Configuración del Proyecto
| Archivo | Descripción |
|---------|-------------|
| **CLAUDE.md** | Configuración completa del proyecto, tech stack, estructura de archivos, convenciones |
| **package.json** | Dependencies, scripts, configuración NPM |
| **tsconfig.json** | Configuración TypeScript |

---

### 🏗️ Arquitectura del Sistema

#### Conceptos Fundamentales
| Archivo | Descripción |
|---------|-------------|
| **ARQUITECTURA_3_CAPAS.md** | Sistema de 3 capas: Natal → Solar Return → Agenda |
| **ARQUITECTURA_SEPARACION_NATAL_SR.md** | ⭐ **CRÍTICO** - Separación estricta entre Carta Natal y Solar Return |
| **COMPARACIONES_PLANETARIAS_3_CAPAS.md** | Sistema de comparaciones Natal vs SR |

#### Guías de Desarrollo
| Archivo | Descripción |
|---------|-------------|
| **GUIA_RAPIDA_DESARROLLO.md** | ⭐ Cheatsheet para desarrollo diario |
| **PLAN_ACCION_INTERPRETACION.md** | Plan de acción para sistema de interpretaciones |

---

### 🪐 Interpretaciones de Planetas

#### Solar Return - Planetas Individuales
| Archivo | Descripción |
|---------|-------------|
| **PLANETA_INDIVIDUAL_SR.md** | Backend: endpoint, prompt, tipos para planetas individuales SR |
| **FRONTEND_PLANETA_INDIVIDUAL_SR.md** | Frontend: componentes, hooks, integración |

#### Natal Chart
| Archivo | Descripción |
|---------|-------------|
| **GUIA_INTERPRETACIONES_COMPLETA.md** | Estilo "Poético Antifrágil & Rebelde" para Carta Natal |
| `src/utils/prompts/natalChartPrompt_clean.ts` | Prompt para interpretación completa natal |

---

### 💳 Pagos y Stripe

| Archivo | Descripción |
|---------|-------------|
| **STRIPE_SETUP.md** | Configuración inicial de Stripe |
| **STRIPE_PRODUCTOS.md** | Productos y precios en Stripe |
| **STRIPE_ENV_SETUP.md** | Variables de entorno para Stripe |

---

### 🎨 Diseño y UI

| Archivo | Descripción |
|---------|-------------|
| **Guialogos.md** | Guía de uso de logos (LogoSimple, LogoSimpleGold) |
| **OBJETOS_SIMBOLICOS_Y_TIENDA.md** | Sistema de objetos simbólicos y tienda (futuro Layer 3) |

---

### 🔧 Utilidades y Scripts

| Archivo | Descripción |
|---------|-------------|
| **RESET_INSTRUCTIONS.md** | Instrucciones para resetear interpretaciones cacheadas |
| `scripts/reset-via-api.js` | Script para resetear via API |
| `scripts/reset-interpretations-direct.js` | Script para resetear directamente en MongoDB |

---

### 📝 Otros Documentos

| Archivo | Descripción |
|---------|-------------|
| **TODO.md** | Lista de tareas pendientes del proyecto |
| **estructura e archios.md** | Documentación de estructura de archivos |
| `documentacion/` | Directorio con documentación extendida |

---

## 🎯 FLUJOS DE TRABAJO COMUNES

### 1. Implementar Nueva Interpretación

**Carta Natal**:
```
1. Lee: ARQUITECTURA_SEPARACION_NATAL_SR.md (reglas)
2. Modifica: src/utils/prompts/natalChartPrompt_clean.ts
3. Endpoint: src/app/api/astrology/interpret-natal/route.ts
4. Tono: Poético, emocional, metafórico
5. ❌ NO: mencionar años, rituales, predicciones
```

**Solar Return**:
```
1. Lee: ARQUITECTURA_SEPARACION_NATAL_SR.md (reglas)
2. Modifica: src/utils/prompts/solarReturnPrompt_3layers.ts
3. Endpoint: src/app/api/astrology/interpret-solar-return/route.ts
4. Tono: Profesional, concreto, directo
5. ✅ SÍ: comparar con natal, mencionar años
```

---

### 2. Añadir Planeta Individual SR

**Backend**:
```
1. Lee: PLANETA_INDIVIDUAL_SR.md
2. Prompt: src/utils/prompts/planetIndividualSolarReturnPrompt.ts
3. Endpoint: src/app/api/astrology/interpret-planet-sr/route.ts
4. Types: src/types/astrology/interpretation.ts
```

**Frontend**:
```
1. Lee: FRONTEND_PLANETA_INDIVIDUAL_SR.md
2. Hook: src/hooks/usePlanetIndividualSR.ts
3. Drawer: src/components/solar-return/PlanetIndividualDrawerSR.tsx
4. Wrapper: src/components/solar-return/PlanetClickableSR.tsx
5. Demo: src/components/solar-return/PlanetListInteractiveSR.tsx
```

---

### 3. Configurar Stripe

```
1. Lee: STRIPE_SETUP.md
2. Lee: STRIPE_ENV_SETUP.md
3. Lee: STRIPE_PRODUCTOS.md
4. Configura variables de entorno
5. Prueba en modo test
```

---

### 4. Resetear Interpretaciones

```
1. Lee: RESET_INSTRUCTIONS.md
2. Opción A: node scripts/reset-via-api.js [chartType]
3. Opción B: node scripts/reset-interpretations-direct.js [chartType]
4. Verifica en MongoDB que se eliminaron
```

---

## 📊 MAPA CONCEPTUAL

```
┌────────────────────────────────────────────────┐
│ ARQUITECTURA GENERAL                           │
├────────────────────────────────────────────────┤
│                                                │
│  CAPA 1: CARTA NATAL                          │
│  ├─ Identidad permanente                      │
│  ├─ Tono poético                              │
│  ├─ Sin años específicos                      │
│  └─ Docs: ARQUITECTURA_SEPARACION_NATAL_SR.md │
│                                                │
│  ↓                                             │
│                                                │
│  CAPA 2: SOLAR RETURN                         │
│  ├─ Activación anual                          │
│  ├─ Tono profesional                          │
│  ├─ Comparación natal vs SR                   │
│  ├─ comparaciones_planetarias (resumen)       │
│  │  └─ Docs: COMPARACIONES_PLANETARIAS...md   │
│  ├─ Planetas individuales (detalle)           │
│  │  └─ Docs: PLANETA_INDIVIDUAL_SR.md         │
│  └─ Docs: ARQUITECTURA_SEPARACION_NATAL_SR.md │
│                                                │
│  ↓                                             │
│                                                │
│  CAPA 3: AGENDA (Futuro)                      │
│  ├─ Rituales y prácticas                      │
│  ├─ Timing lunar                              │
│  ├─ Ejercicios personalizados                 │
│  └─ Docs: OBJETOS_SIMBOLICOS_Y_TIENDA.md      │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 🔍 BÚSQUEDA RÁPIDA

### "¿Cómo hago...?"

| Pregunta | Archivo |
|----------|---------|
| ¿Cómo diferencio natal de SR? | ARQUITECTURA_SEPARACION_NATAL_SR.md |
| ¿Cómo funciona el sistema de capas? | ARQUITECTURA_3_CAPAS.md |
| ¿Qué tono usar en natal? | GUIA_INTERPRETACIONES_COMPLETA.md |
| ¿Qué tono usar en SR? | GUIA_RAPIDA_DESARROLLO.md |
| ¿Cómo añadir planeta individual SR? | PLANETA_INDIVIDUAL_SR.md |
| ¿Cómo integrar en frontend? | FRONTEND_PLANETA_INDIVIDUAL_SR.md |
| ¿Cómo configurar Stripe? | STRIPE_SETUP.md |
| ¿Cómo resetear interpretaciones? | RESET_INSTRUCTIONS.md |
| ¿Cuál es el tech stack? | CLAUDE.md |
| ¿Dónde están los logos? | Guialogos.md |

---

## ⚠️ DOCUMENTOS CRÍTICOS (LEER PRIMERO)

### 1. **ARQUITECTURA_SEPARACION_NATAL_SR.md** ⭐⭐⭐
**Por qué**: Define las reglas más importantes del proyecto
- Carta Natal vs Solar Return
- Qué puede y qué NO puede estar en cada uno
- Diferencia entre comparaciones y planetas individuales

### 2. **GUIA_RAPIDA_DESARROLLO.md** ⭐⭐
**Por qué**: Cheatsheet diario para desarrollo
- Ejemplos de texto correcto/incorrecto
- Comandos rápidos
- Debugging

### 3. **CLAUDE.md** ⭐⭐
**Por qué**: Configuración general del proyecto
- Tech stack
- Estructura de archivos
- Convenciones de código

---

## 📝 CONVENCIONES DE DOCUMENTACIÓN

### Emojis Usados:
- 🏗️ Arquitectura
- 🪐 Planetas
- 🎯 Objetivos
- ⚠️ Advertencias
- ✅ Permitido
- ❌ Prohibido
- 📊 Comparaciones
- 🔧 Utilidades
- 💳 Pagos
- 🎨 Diseño
- ⭐ Crítico/Importante

### Formato de Archivos:
- **MAYUSCULAS.md**: Documentación principal
- `minusculas.md`: Documentación auxiliar
- `src/**/*.ts`: Código fuente

---

## 🔄 Última Actualización

**Fecha**: 2025-12-26
**Branch**: `claude/fix-solar-return-endpoints-vLCCr`
**Estado**: Sistema de interpretaciones individuales SR completo (backend + frontend)

---

## 📞 Soporte

Para preguntas sobre la documentación:
1. Busca en este índice
2. Lee el archivo correspondiente
3. Revisa ejemplos en GUIA_RAPIDA_DESARROLLO.md
4. Consulta el código fuente en `src/`

---

**Mantenido por**: Claude Code Sessions
**Proyecto**: Tu Vuelta al Sol (www.tuvueltaalsol.es)
