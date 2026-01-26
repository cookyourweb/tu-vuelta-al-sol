# 🌟 ARQUITECTURA DE 3 CAPAS - Tu Vuelta al Sol

## 📚 CONCEPTO FUNDAMENTAL

La interpretación astrológica se divide en **3 capas complementarias**:

```
CARTA NATAL (Quién eres)
    ↓
RETORNO SOLAR (Qué se activa este año)
    ↓
AGENDA MENSUAL (Cómo vivir esto día a día)
```

**Cada capa cumple una función específica y NO se repiten.**

---

## 🧬 CAPA 1: CARTA NATAL

### Función:
Mapa de **IDENTIDAD ESTRUCTURAL**

### ¿Qué responde?
- ¿Quién soy?
- ¿Por qué funciono así?
- ¿Cuál es mi naturaleza básica?

### Características:
✅ **Permanente** (válido para siempre)
✅ **Estructural** (describe cómo eres)
✅ **Psicológico** (patrones de personalidad)

❌ **NO incluye:**
- Rituales
- Mantras
- Planes de acción
- Predicciones
- Referencias temporales (años, meses)

### Estructura de contenido:

```
☀️ SOL → Tu propósito de vida
🌙 LUNA → Tus emociones y necesidades
⬆️ ASCENDENTE → Tu personalidad visible
🗣️ MERCURIO → Cómo piensas y hablas
💕 VENUS → Cómo amas y qué valoras
🔥 MARTE → Cómo enfrentas la vida
🌱 JÚPITER → Tu expansión y oportunidades
🪐 SATURNO → Tus lecciones y responsabilidades
⚡ URANO → Tu innovación
🌊 NEPTUNO → Tu sensibilidad
🔮 PLUTÓN → Tu poder de transformación
🧭 NODOS LUNARES → Tu camino evolutivo
```

### Archivo prompt:
📄 `src/utils/prompts/natalChartPrompt_clean.ts`

### Uso:
- Lectura base del usuario
- Fundamento para entender todo lo demás
- Consulta permanente

---

## 🔄 CAPA 2: RETORNO SOLAR

### Función:
Mapa de **ACTIVACIÓN ANUAL**

### ¿Qué responde?
- ¿Qué parte de mi identidad se activa este año?
- ¿Qué áreas de vida están en foco?
- ¿Qué está emergiendo ahora?

### Características:
✅ **Temporal** (válido para 1 año solar)
✅ **Evolutivo** (qué se está desarrollando)
✅ **Profesional** (tono equilibrado, sin drama)

❌ **NO es:**
- Una carta natal repetida
- Predicciones fatalistas
- Lenguaje revolucionario agresivo

### Estructura de contenido:

```
🎯 TEMA CENTRAL DEL AÑO
📍 ASCENDENTE SR EN CASA NATAL (Metodología Shea)
☀️ SOL EN CASA SR (Metodología Teal)
🔥 PLANETAS ANGULARES SR (Metodología Louis)
🌙 ENERGÍA EMOCIONAL DEL AÑO (Luna SR)
🧭 DIRECCIÓN EVOLUTIVA (Nodos)
📊 ANÁLISIS TÉCNICO PROFESIONAL
📅 CALENDARIO TRIMESTRAL
⚠️ SOMBRAS DEL AÑO (sin dramatismo)
💫 INTEGRACIÓN FINAL
```

### Tono:
- **Profesional y equilibrado**
- **Personalización sutil** (solo primer nombre)
- **SIN mayúsculas excesivas**
- **SIN lenguaje "revolucionario"**

### Archivo prompt:
📄 `src/utils/prompts/solarReturnPrompts_v2.ts` ✅ (ACTUALMENTE EN USO)

### Uso:
- Informe anual personalizado
- Planificación del año
- PDF de Retorno Solar

---

## 📅 CAPA 3: AGENDA MENSUAL

### Función:
Mapa de **APLICACIÓN PRÁCTICA**

### ¿Qué responde?
- ¿Qué hago hoy/esta semana/este mes?
- ¿Cómo aplico lo que sé?
- ¿Qué rituales, prácticas, acciones concretas?

### Características:
✅ **Práctico** (acciones específicas)
✅ **Cotidiano** (día a día)
✅ **Accionable** (rituales, mantras, recordatorios)

✅ **SÍ incluye:**
- Rituales por fase lunar
- Mantras y afirmaciones
- Acciones diarias/semanales
- Recordatorios prácticos

### Estructura de contenido (propuesta):

```
🌙 FASE LUNAR ACTUAL
✨ ENERGÍA DEL MES
🎯 ENFOQUE PRINCIPAL
💡 RITUAL DE LUNA NUEVA
🌕 RITUAL DE LUNA LLENA
📝 ACCIONES DE LA SEMANA
🧘 PRÁCTICA RECOMENDADA
💬 MANTRA DEL DÍA
⚠️ TRÁNSITOS IMPORTANTES
```

### Archivo prompt:
📄 `src/utils/prompts/agendaPrompts.ts` (POR CREAR)

### Uso:
- Agenda astrológica mensual
- Notificaciones diarias
- Prácticas y rituales

---

## 🔗 CÓMO SE RELACIONAN LAS 3 CAPAS

### Ejemplo práctico:

#### CARTA NATAL dice:
> "Tienes Sol en Aries Casa 10. Tu propósito es liderar y ser visible profesionalmente."

#### RETORNO SOLAR dice:
> "Este año, tu Ascendente SR cae en Casa 6 natal. El tema central es organizar tu vida diaria antes de brillar públicamente."

#### AGENDA MENSUAL dice:
> "Esta semana, con Luna en Capricornio, establece 1 rutina que te acerque a tu visibilidad profesional. Ritual: escribe tu plan de trabajo en Luna Nueva."

### Flujo de información:

```
NATAL (estructura permanente)
    ↓ alimenta a
SOLAR RETURN (activación anual)
    ↓ alimenta a
AGENDA (práctica mensual/diaria)
```

---

## 📂 ARCHIVOS DE PROMPTS - RESUMEN

| Capa | Archivo | Estado | Uso |
|------|---------|--------|-----|
| **Natal** | `natalChartPrompt_clean.ts` | ✅ Nuevo (limpio) | Interpretación base |
| **Natal** | `completeNatalChartPrompt.ts` | ⚠️ Antiguo (con rituales) | Deprecado |
| **Solar Return** | `solarReturnPrompts_v2.ts` | ✅ Activo (profesional) | Informe anual |
| **Solar Return** | `solarReturnPrompts.ts` | ❌ Antiguo (agresivo) | NO usar |
| **Agenda** | `agendaPrompts.ts` | 🔲 Por crear | Prácticas diarias |

---

## 🎯 REGLAS DE ORO

### Para Carta Natal:
1. **NUNCA** incluir rituales, mantras, o acciones
2. **NUNCA** hablar de tiempo o predicciones
3. **SIEMPRE** describir identidad permanente
4. Debe ser válido en 10 años

### Para Retorno Solar:
1. **NUNCA** repetir lo que ya dice la Natal
2. **SIEMPRE** conectar con la base natal
3. Tono profesional y equilibrado
4. Válido solo para el año solar

### Para Agenda:
1. **AQUÍ SÍ** van rituales y prácticas
2. **AQUÍ SÍ** van mantras y afirmaciones
3. Conectar con Natal + Solar Return
4. Actualizar mensualmente

---

## 🚫 ERRORES COMUNES A EVITAR

❌ **Mezclar capas:**
- NO poner rituales en Carta Natal
- NO repetir descripciones de identidad en Agenda

❌ **Repetir información:**
- Si Natal ya explicó cómo ama (Venus), Solar Return NO debe repetirlo, solo decir qué área de amor se activa este año

❌ **Tono inconsistente:**
- Natal: Pedagógico y estructural
- Solar Return: Profesional y equilibrado
- Agenda: Práctico y accionable

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Prompt Natal limpio creado
- [x] Prompt Solar Return profesional verificado
- [ ] Prompt Agenda por crear
- [ ] Actualizar endpoints API para usar prompts correctos
- [ ] Actualizar frontend para mostrar 3 capas separadas
- [ ] Documentar flujo de datos entre capas

---

## 📖 PRÓXIMOS PASOS

1. **Actualizar endpoint de Carta Natal** para usar `natalChartPrompt_clean.ts`
2. **Crear prompt de Agenda** con rituales y prácticas
3. **Separar vistas en frontend** para cada capa
4. **Diseñar flujo de navegación** Natal → Solar → Agenda

---

**Última actualización:** 2025-12-24
**Versión:** 1.0
**Autor:** Claude Code Session
