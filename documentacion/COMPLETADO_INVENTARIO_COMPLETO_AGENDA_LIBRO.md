# 📚 INVENTARIO COMPLETO: Agenda Libro - Qué automatizar en cada sección

**Fecha:** 2026-01-19
**Objetivo:** Listado exhaustivo de TODAS las secciones del libro y qué datos necesitan para personalizarse

---

## 🎯 Resumen Ejecutivo

El Agenda Libro tiene **13 secciones principales** con **~60 páginas distintas**.

**Estado actual:**
- ✅ Estructura completa del libro creada
- ❌ Datos mayormente hardcodeados (placeholders genéricos)
- ❌ No conectado con Carta Natal ni Solar Return
- ❌ No conectado con interpretaciones de eventos

**Objetivo:** Automatizar datos para que cada usuario tenga un libro 100% personalizado.

---

## 📋 LISTADO COMPLETO DE SECCIONES

### **SECCIÓN 1: PORTAL DE ENTRADA**
**Páginas:** 2
**Estado:** ✅ Mayormente OK

#### 1.1. Portada Personalizada
**Componente:** `PortalEntrada.tsx` → `PortadaPersonalizada`
**Props actuales:**
```typescript
- name: string ✅
- startDate: Date ✅
- endDate: Date ✅
- sunSign?: string ✅
- moonSign?: string ✅
- ascendant?: string ✅
```

**Estado:** ✅ **FUNCIONA BIEN** - Ya recibe datos reales

**Datos necesarios:** Ninguno adicional

---

#### 1.2. Página de Intención
**Componente:** `PortalEntrada.tsx` → `PaginaIntencion`
**Contenido:** Página en blanco para que el usuario escriba su intención

**Estado:** ✅ **FIJO** - No necesita datos

---

### **SECCIÓN 2: ÍNDICE NAVEGABLE**
**Páginas:** 1
**Estado:** ✅ FIJO

#### 2.1. Índice
**Componente:** `Indice.tsx` → `IndiceNavegable`
**Contenido:** Índice de contenidos del libro

**Estado:** ✅ **FIJO** - No necesita datos

---

### **SECCIÓN 3: CARTA DE BIENVENIDA Y TEMA CENTRAL**
**Páginas:** 2
**Estado:** ⚠️ **PARCIALMENTE HARDCODEADO**

#### 3.1. Carta de Bienvenida
**Componente:** `TuAnioTuViaje.tsx` → `CartaBienvenida`
**Props actuales:**
```typescript
- name: string ✅
```

**Contenido actual (líneas 36-37):**
```
"Tu carta natal habla de una persona intuitiva, sensible y profundamente perceptiva.
Tu Retorno Solar confirma que este ciclo es menos visible, pero mucho más verdadero."
```

**❌ PROBLEMA:** Texto genérico, no personalizado

**✅ SOLUCIÓN:** Extraer estas frases de:
- **Interpretación Natal guardada** (`Interpretation` collection, `chartType: 'natal'`)
  - Campo: `interpretation.resumen_personalidad` o similar
- **Interpretación Solar Return** (`Interpretation` collection, `chartType: 'solar-return'`)
  - Campo: `interpretation.tema_anual`

**Datos necesarios:**
```typescript
interface CartaBienvenidaProps {
  name: string;
  personalidadResumen?: string; // De interpretación natal
  temaAnual?: string; // De interpretación SR
}
```

---

#### 3.2. Tema Central del Año
**Componente:** `TuAnioTuViaje.tsx` → `TemaCentralAnio`

**Contenido actual (línea 81):**
```
"Un año de introspección consciente para redefinir tu identidad desde dentro."
```

**❌ PROBLEMA:** Texto completamente hardcodeado, igual para todos

**✅ SOLUCIÓN:** Usar **tema del año del Solar Return**

**Datos necesarios:**
```typescript
interface TemaCentralAnioProps {
  temaAnual: string; // De Solar Return interpretation
}
```

**Ejemplo de dato real:**
```
"Un año para materializar tu autoridad profesional a través de la comunicación auténtica"
```

**Fuente:** `Interpretation` collection donde `chartType: 'solar-return'`
- Campo: `interpretation.tema_central` o `interpretation.proposito_anual`

---

### **SECCIÓN 4: PRIMER DÍA DEL CICLO**
**Páginas:** 1
**Estado:** ✅ **FUNCIONA BIEN**

#### 4.1. Primer Día del Ciclo
**Componente:** `PaginasEspeciales.tsx` → `PrimerDiaCiclo`
**Props actuales:**
```typescript
- name: string ✅
- fecha: Date ✅
```

**Estado:** ✅ **OK** - Recibe datos reales

---

### **SECCIÓN 5: LO QUE VIENE A MOVER Y SOLTAR**
**Páginas:** 3
**Estado:** ⚠️ **TOTALMENTE HARDCODEADO**

#### 5.1. Lo Que Viene a Mover
**Componente:** `TuAnioTuViaje.tsx` → `LoQueVieneAMover`

**Contenido actual (líneas 121-142):**
```
En tu interior:
• Silencios necesarios.
• Procesos inconscientes que por fin salen a la luz.
• Una redefinición profunda de quién eres cuando no te están mirando.

En tus relaciones:
• Menos personajes.
• Más verdad.
• Vínculos que respeten tu espacio interno.

En tu vida práctica:
• Pausas estratégicas.
• Decisiones que se gestan antes de ejecutarse.
• Cerrar ciclos antes de abrir otros.
```

**❌ PROBLEMA:** Completamente genérico

**✅ SOLUCIÓN:** Extraer de Solar Return

**Datos necesarios:**
```typescript
interface LoQueVieneAMoverProps {
  areasActivas: {
    interior: string[]; // 3 bullets
    relaciones: string[]; // 3 bullets
    vidaPractica: string[]; // 3 bullets
  }
}
```

**Fuente:** Interpretación Solar Return
- Buscar secciones específicas del SR que hablan de:
  - Planetas en casa 12 / 8 → Interior
  - Planetas en casa 7 / 11 → Relaciones
  - Planetas en casa 2 / 6 / 10 → Vida práctica

---

#### 5.2. Lo Que Pide Soltar
**Componente:** `TuAnioTuViaje.tsx` → `LoQuePideSoltar`

**Estado:** ⚠️ **HARDCODEADO** (similar a Lo Que Viene a Mover)

**Datos necesarios:**
```typescript
interface LoQuePideSoltarProps {
  bloqueosPrincipales: string[]; // Lista de 3-5 cosas a soltar
}
```

**Fuente:** Interpretación Natal
- Campo: `interpretation.bloqueos` o `interpretation.sombras_trabajar`

---

#### 5.3. Página Intención Anual
**Componente:** `TuAnioTuViaje.tsx` → `PaginaIntencionAnual`

**Estado:** ✅ **FIJO** - Página en blanco para escribir

---

### **SECCIÓN 6: TU AÑO OVERVIEW**
**Páginas:** 2
**Estado:** ⚠️ **USA FECHAS PERO NO INTERPRETACIONES**

#### 6.1. Tu Año Overview
**Componente:** `TuAnio.tsx` → `TuAnioOverview`
**Props actuales:**
```typescript
- startDate: Date ✅
- endDate: Date ✅
- userName: string ✅
```

**Estado:** 🟡 **PARCIALMENTE OK** - Usa fechas reales pero podría enriquecerse

**Mejora opcional:**
```typescript
interface TuAnioOverviewProps {
  startDate: Date;
  endDate: Date;
  userName: string;
  resumenAnual?: string; // Resumen de 2-3 líneas del año
}
```

---

#### 6.2. Tu Año Ciclos
**Componente:** `TuAnio.tsx` → `TuAnioCiclos`

**Estado:** 🟡 **SIMILAR** - Usa fechas pero podría enriquecerse

---

### **SECCIÓN 7: CICLOS ANUALES**
**Páginas:** 3
**Estado:** ⚠️ **HARDCODEADO**

#### 7.1. Línea Tiempo Emocional
**Componente:** `CiclosAnuales.tsx` → `LineaTiempoEmocional`
**Props actuales:**
```typescript
- startDate: Date ✅
- endDate: Date ✅
```

**Estado:** 🟡 **USA FECHAS** pero podría mostrar eventos importantes

**Mejora opcional:**
```typescript
interface LineaTiempoEmocionalProps {
  startDate: Date;
  endDate: Date;
  eventosDestacados?: {
    fecha: Date;
    titulo: string;
    intensidad: 'alta' | 'media' | 'baja';
  }[];
}
```

---

#### 7.2. Meses Clave y Puntos de Giro
**Componente:** `CiclosAnuales.tsx` → `MesesClavePuntosGiro`

**Estado:** ⚠️ **HARDCODEADO** - Dice "Febrero, Mayo, Septiembre" genéricamente

**✅ SOLUCIÓN:** Detectar meses con más eventos importantes

**Datos necesarios:**
```typescript
interface MesesClaveProps {
  mesesClave: {
    mes: string; // "Febrero"
    razon: string; // "Retorno Solar + Luna Nueva en tu Casa 7"
  }[];
}
```

**Fuente:** Análisis de eventos del `SolarCycle`

---

#### 7.3. Grandes Aprendizajes
**Componente:** `CiclosAnuales.tsx` → `GrandesAprendizajes`

**Estado:** ⚠️ **HARDCODEADO**

**Datos necesarios:**
```typescript
interface GrandesAprendizajesProps {
  aprendizajes: string[]; // 3-5 aprendizajes del año
}
```

**Fuente:** Solar Return interpretation
- Campo: `interpretation.aprendizajes_clave`

---

### **SECCIÓN 8: SOUL CHART (CARTA NATAL)**
**Páginas:** 5
**Estado:** ❌ **TOTALMENTE HARDCODEADO**

#### 8.1. Esencia Natal
**Componente:** `SoulChart.tsx` → `EsenciaNatal`

**Contenido actual (líneas 24-57):**
```
Sol en Acuario - Casa 1
Luna en Libra - Casa 8
Ascendente Acuario
Mercurio en Piscis - Casa 1
```

**❌ PROBLEMA:** Datos hardcodeados de UN usuario específico

**✅ SOLUCIÓN:** Leer datos de la Carta Natal

**Datos necesarios:**
```typescript
interface EsenciaNatalProps {
  sol: {
    signo: string;
    casa: number;
    descripcion: string;
  };
  luna: {
    signo: string;
    casa: number;
    descripcion: string;
  };
  ascendente: {
    signo: string;
    descripcion: string;
  };
  mercurio: {
    signo: string;
    casa: number;
    descripcion: string;
  };
  elementosBalance: {
    fuego: number;
    tierra: number;
    aire: number;
    agua: number;
  };
}
```

**Fuente:** `NatalChart` collection
- Campo: `natalChart.planets`
- Campo: `natalChart.ascendant`
- Campo: `natalChart.elementBalance` (si existe, o calcularlo)

---

#### 8.2. Nodo Norte
**Componente:** `SoulChart.tsx` → `NodoNorte`

**Estado:** ❌ **HARDCODEADO** - Dice "Géminis Casa 4"

**Datos necesarios:**
```typescript
interface NodoNorteProps {
  signo: string;
  casa: number;
  descripcion: string; // Qué aprender, hacia dónde evolucionar
}
```

**Fuente:** `NatalChart` collection
- Campo: `natalChart.northNode`

---

#### 8.3. Nodo Sur
**Componente:** `SoulChart.tsx` → `NodoSur`

**Estado:** ❌ **HARDCODEADO** - Dice "Sagitario Casa 10"

**Datos necesarios:**
```typescript
interface NodoSurProps {
  signo: string;
  casa: number;
  descripcion: string; // Qué soltar, patrones antiguos
}
```

**Fuente:** `NatalChart` collection
- Campo: `natalChart.southNode`

---

#### 8.4. Planetas Dominantes
**Componente:** `SoulChart.tsx` → `PlanetasDominantes`

**Estado:** ❌ **HARDCODEADO** - Dice "Saturno, Urano, Neptuno"

**Datos necesarios:**
```typescript
interface PlanetasDominantesProps {
  planetasDominantes: {
    planeta: string;
    razon: string; // Por qué es dominante
    significado: string;
  }[];
}
```

**Fuente:** Calcular desde `NatalChart`
- Planetas angulares (en casas 1, 4, 7, 10)
- Planetas en dignidad
- Planetas con más aspectos

---

#### 8.5. Patrones Emocionales
**Componente:** `SoulChart.tsx` → `PatronesEmocionales`

**Estado:** ❌ **HARDCODEADO**

**Datos necesarios:**
```typescript
interface PatronesEmocionalesProps {
  patrones: {
    patron: string;
    descripcion: string;
    comoTrabajar: string;
  }[];
}
```

**Fuente:** Interpretación Natal
- Campo: `interpretation.patrones_emocionales`

---

### **SECCIÓN 9: RETORNO SOLAR**
**Páginas:** 8
**Estado:** ❌ **TOTALMENTE HARDCODEADO**

#### 9.1. ¿Qué es Retorno Solar?
**Componente:** `RetornoSolar.tsx` → `QueEsRetornoSolar`

**Estado:** ✅ **FIJO** - Explicación general, no necesita datos

---

#### 9.2. Ascendente del Año
**Componente:** `RetornoSolar.tsx` → `AscendenteAnio`

**Contenido actual (línea 71):**
```
Acuario – Casa 1 (identidad, enfoque vital)
```

**❌ PROBLEMA:** Hardcodeado

**Datos necesarios:**
```typescript
interface AscendenteAnioProps {
  signo: string;
  casa: number;
  descripcion: string;
  activa: string; // Qué activa
  reta: string; // Qué reta
  comoTrabajar: string;
}
```

**Fuente:** Solar Return
- Campo: `solarReturn.ascendant`
- Campo de interpretación: `interpretation.ascendente_retorno`

---

#### 9.3. Sol del Retorno
**Componente:** `RetornoSolar.tsx` → `SolRetorno`

**Estado:** ❌ **HARDCODEADO** - Dice "Sol Casa 12"

**Datos necesarios:**
```typescript
interface SolRetornoProps {
  casa: number;
  signo: string;
  descripcion: string;
  proposito: string;
}
```

**Fuente:** Solar Return
- Campo: `solarReturn.planets.sun.house`
- Campo: `solarReturn.planets.sun.sign`

---

#### 9.4. Luna del Retorno
**Componente:** `RetornoSolar.tsx` → `LunaRetorno`

**Estado:** ❌ **HARDCODEADO** - Dice "Luna Casa 7"

**Datos necesarios:**
```typescript
interface LunaRetornoProps {
  casa: number;
  signo: string;
  descripcion: string;
  necesidadesEmocionales: string;
}
```

**Fuente:** Solar Return
- Campo: `solarReturn.planets.moon.house`
- Campo: `solarReturn.planets.moon.sign`

---

#### 9.5-9.7. Ejes del Año
**Componentes:** `EjesDelAnio`, `EjesDelAnio2`, `IntegracionEjes`

**Estado:** ❌ **HARDCODEADO**

**Datos necesarios:**
```typescript
interface EjesDelAnioProps {
  ejeAscDesc: {
    ascendente: string;
    descendente: string;
    tension: string;
    integracion: string;
  };
  ejeMCIC: {
    medioCielo: string;
    fondoCielo: string;
    tension: string;
    integracion: string;
  };
}
```

**Fuente:** Solar Return houses

---

#### 9.8. Ritual Cumpleaños
**Componente:** `RetornoSolar.tsx` → `RitualCumpleanos`

**Estado:** 🟡 **SEMI-GENÉRICO** - Podría personalizarse con datos del SR

---

#### 9.9. Mantra Anual
**Componente:** `RetornoSolar.tsx` → `MantraAnual`

**Estado:** ❌ **HARDCODEADO** - Dice un mantra genérico

**Datos necesarios:**
```typescript
interface MantraAnualProps {
  mantra: string; // Mantra personalizado del usuario
}
```

**Fuente:** Solar Return interpretation
- Campo: `interpretation.mantra_anual`

---

### **SECCIÓN 10: CALENDARIO MENSUAL** 🔥
**Páginas:** ~24 (2 por mes × 12 meses)
**Estado:** ❌ **EVENTOS HARDCODEADOS CON PLACEHOLDERS**

**⭐ ESTA ES LA SECCIÓN MÁS IMPORTANTE ⭐**

#### 10.1. Calendario Mensual Tabla (12 meses)
**Componente:** `CalendarioMensualTabla.tsx`

**Estado actual:**
- Solo muestra Enero y Febrero en `index.tsx`
- Eventos tienen placeholders: `[X]`, `[signo]`, `[casa natal]`

**Ejemplo de evento hardcodeado (líneas 213-228):**
```typescript
{
  dia: 6,
  tipo: 'ingreso',
  titulo: 'Venus → Piscis',
  signo: 'Piscis',
  interpretacion: `🌊 VENUS INGRESA EN PISCIS - Activación de tu Casa [X]

Qué se activa en tu Natal:
Venus transitando por Piscis toca [área de vida según casa natal].
Con tu Venus en [signo], esto te invita a...`
}
```

**❌ PROBLEMAS:**
1. Solo 2 de 12 meses están en el código
2. Eventos hardcodeados
3. Interpretaciones con placeholders `[X]`
4. No usa eventos reales del usuario

**✅ SOLUCIÓN COMPLETA:**

```typescript
// PASO 1: Obtener SolarCycle del usuario
const solarCycle = await fetch(`/api/astrology/solar-cycles?userId=${userId}&yearLabel=${yearLabel}`);

// PASO 2: Filtrar eventos por mes
const getEventosForMonth = (monthIndex: number) => {
  return solarCycle.events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === monthIndex && event.interpretation;
  });
};

// PASO 3: Mapear al formato del libro
const eventosMes = getEventosForMonth(0).map(event => ({
  dia: new Date(event.date).getDate(),
  tipo: mapEventType(event.type), // luna_nueva → lunaNueva
  titulo: event.title,
  signo: event.sign,
  interpretacion: formatInterpretationForBook(event.interpretation)
}));

// PASO 4: Pasar a CalendarioMensualTabla
<CalendarioMensualTabla
  monthDate={new Date(2026, 0, 1)}
  mesNumero={1}
  nombreZodiaco="Capicornio → Acuario"
  simboloZodiaco="♑"
  temaDelMes="Inicios conscientes"
  eventos={eventosMes} // ← DATOS REALES
/>
```

**Datos necesarios:**
```typescript
interface CalendarioMensualTablaProps {
  monthDate: Date;
  mesNumero: number;
  nombreZodiaco: string;
  simboloZodiaco: string;
  temaDelMes: string;
  birthday?: Date;
  eventos: {
    dia: number;
    tipo: 'lunaNueva' | 'lunaLlena' | 'ingreso' | 'retrogrado' | 'eclipse' | 'cumpleanos';
    titulo: string;
    signo?: string;
    interpretacion: string; // ← TEXTO FORMATEADO REAL
  }[];
}
```

**Fuente:** `SolarCycle` collection
- Campo: `events[]` (array de eventos)
- Filtrar por mes
- Usar `event.interpretation` (ya generada por sistema de 3 capas)

---

#### 10.2. Lunas y Ejercicios
**Componente:** `MesCompleto.tsx` → `LunasYEjercicios`

**Estado:** 🟡 **SEMI-OK** - Eventos con interpretaciones cortas

**Mejora:** Usar datos reales del SolarCycle

---

#### 10.3. Semana con Interpretación
**Componente:** `MesCompleto.tsx` → `SemanaConInterpretacion`

**Estado:** 🟡 **SEMI-OK** - Podría automatizarse

---

#### 10.4. Cierre de Mes
**Componente:** `MesCompleto.tsx` → `CierreMes`

**Estado:** ✅ **FIJO** - Página de reflexión, no necesita datos

---

#### 10.5. Página Especial de Cumpleaños
**Componente:** `TuAnio.tsx` → `PaginaCumpleanos`
**Props:**
```typescript
- birthDate: Date ✅
- userName: string ✅
```

**Estado:** ✅ **FUNCIONA BIEN**

---

### **SECCIÓN 11: TERAPIA ASTROLÓGICA CREATIVA**
**Páginas:** 4
**Estado:** ✅ **FIJO**

#### 11.1-11.4. Ejercicios Creativos
**Componentes:**
- `TerapiaCreativa.tsx` → `EscrituraTerapeutica`
- `TerapiaCreativa.tsx` → `Visualizacion`
- `TerapiaCreativa.tsx` → `RitualSimbolico`
- `TerapiaCreativa.tsx` → `TrabajoEmocional`

**Estado:** ✅ **FIJOS** - Ejercicios genéricos, no necesitan personalización

---

### **SECCIÓN 12: CIERRE DEL CICLO**
**Páginas:** 4
**Estado:** 🟡 **PARCIALMENTE PERSONALIZADO**

#### 12.1. Quién Era / Quién Soy
**Componente:** `PaginasEspeciales.tsx` → `QuienEraQuienSoy`

**Estado:** ✅ **FIJO** - Página de reflexión personal

---

#### 12.2. Preparación Próxima Vuelta
**Componente:** `PaginasEspeciales.tsx` → `PreparacionProximaVuelta`

**Estado:** ✅ **FIJO**

---

#### 12.3. Carta de Cierre
**Componente:** `PaginasEspeciales.tsx` → `CartaCierre`
**Props:**
```typescript
- name: string ✅
```

**Estado:** ✅ **OK** - Usa nombre del usuario

---

#### 12.4. Página Final Blanca
**Componente:** `PaginasEspeciales.tsx` → `PaginaFinalBlanca`

**Estado:** ✅ **FIJO**

---

### **SECCIÓN 13: CONTRAPORTADA**
**Páginas:** 1
**Estado:** ✅ **FIJO**

#### 13.1. Contraportada
**Componente:** `PaginasEspeciales.tsx` → `Contraportada`

**Estado:** ✅ **FIJO** - No necesita datos

---

## 📊 RESUMEN DE PRIORIDADES

### 🔥 **PRIORIDAD CRÍTICA** (Sprint 4)

#### 1. **Calendario Mensual - 12 meses**
**Componente:** `CalendarioMensualTabla`
**Impacto:** 🔥🔥🔥🔥🔥
**Estimación:** 1 semana

**Por qué es crítico:**
- Representa ~40% del contenido del libro
- Tiene 50-60 eventos con interpretaciones hardcodeadas
- Ya existe sistema completo de interpretaciones (Sprint 1)
- Solo requiere conectar datos que ya existen

**Tareas:**
1. Agregar 10 meses faltantes (Marzo-Diciembre) al código
2. Crear `useInterpretaciones` hook
3. Crear `formatInterpretationForBook` utility
4. Pasar eventos reales en lugar de hardcodeados
5. Testing completo

---

### 🟡 **PRIORIDAD ALTA** (Sprint 5)

#### 2. **Retorno Solar - 8 páginas**
**Componentes:** `RetornoSolar.tsx` (varios)
**Impacto:** 🔥🔥🔥
**Estimación:** 3-4 días

**Qué automatizar:**
- Ascendente del Año (signo, casa, descripción)
- Sol del Retorno (casa, significado)
- Luna del Retorno (casa, necesidades)
- Ejes del Año (ASC-DESC, MC-IC)
- Mantra Anual (personalizado)

**Fuente de datos:** Solar Return interpretation ya guardada

---

#### 3. **Soul Chart (Carta Natal) - 5 páginas**
**Componentes:** `SoulChart.tsx` (varios)
**Impacto:** 🔥🔥🔥
**Estimación:** 3-4 días

**Qué automatizar:**
- Esencia Natal (Sol, Luna, Ascendente, planetas)
- Nodo Norte/Sur (signo, casa, descripción)
- Planetas Dominantes (cálculo + descripción)
- Patrones Emocionales

**Fuente de datos:** Natal Chart + interpretación natal guardada

---

### 🟢 **PRIORIDAD MEDIA** (Sprint 6)

#### 4. **Tema Central y Viaje Interno - 5 páginas**
**Componentes:** `TuAnioTuViaje.tsx`
**Impacto:** 🔥🔥
**Estimación:** 2 días

**Qué automatizar:**
- Carta de Bienvenida (frases personalizadas)
- Tema Central del Año
- Lo Que Viene a Mover
- Lo Que Pide Soltar

**Fuente de datos:** Solar Return + Natal interpretations

---

#### 5. **Ciclos Anuales - 3 páginas**
**Componentes:** `CiclosAnuales.tsx`
**Impacto:** 🔥
**Estimación:** 2 días

**Qué automatizar:**
- Línea Tiempo Emocional (eventos destacados)
- Meses Clave (análisis de distribución de eventos)
- Grandes Aprendizajes

**Fuente de datos:** Análisis del SolarCycle

---

### ⚪ **PRIORIDAD BAJA** (Opcional)

#### 6. **Tu Año Overview - 2 páginas**
**Componentes:** `TuAnio.tsx`
**Impacto:** 🔥
**Estimación:** 1 día

Ya funciona con fechas, solo enriquecer con resumen anual.

---

## 📈 ROADMAP SUGERIDO

### **Fase 1: Fundamentos** (Semana 1)
- [ ] Crear `hooks/useInterpretaciones.ts`
- [ ] Crear `utils/formatInterpretationForBook.ts`
- [ ] Modificar `AgendaLibro/index.tsx` para aceptar `userId` y `yearLabel`
- [ ] Implementar loading/error states

### **Fase 2: Calendario Mensual** (Semana 1-2)
- [ ] Agregar 10 meses faltantes (Marzo-Diciembre) con estructura
- [ ] Conectar datos reales para los 12 meses
- [ ] Testing completo del flujo
- [ ] Verificar que interpretaciones son personalizadas

### **Fase 3: Retorno Solar** (Semana 3)
- [ ] Automatizar Ascendente del Año
- [ ] Automatizar Sol/Luna del Retorno
- [ ] Automatizar Ejes y Mantra
- [ ] Testing

### **Fase 4: Soul Chart** (Semana 3-4)
- [ ] Automatizar Esencia Natal
- [ ] Automatizar Nodos Norte/Sur
- [ ] Calcular Planetas Dominantes
- [ ] Automatizar Patrones Emocionales
- [ ] Testing

### **Fase 5: Resto de secciones** (Semana 4-5)
- [ ] Automatizar Tema Central y Viaje Interno
- [ ] Automatizar Ciclos Anuales
- [ ] Enriquecer Tu Año Overview
- [ ] Testing final completo

---

## 🎯 MÉTRICAS DE ÉXITO

### Automatización Completa:
- ✅ **0 placeholders `[X]` en el libro**
- ✅ **100% de interpretaciones personalizadas**
- ✅ **Datos reales de Carta Natal en Soul Chart**
- ✅ **Datos reales de Solar Return en sección correspondiente**
- ✅ **50-60 eventos con interpretaciones únicas del usuario**

### UX:
- ✅ **Primera generación < 2 minutos**
- ✅ **Siguientes aperturas < 3 segundos (caché)**
- ✅ **Loading states claros**
- ✅ **Manejo de errores amigable**

### Calidad:
- ✅ **2 usuarios distintos NO deben tener el mismo texto**
- ✅ **Interpretaciones mencionan posiciones planetarias reales**
- ✅ **Mantras y ejercicios específicos para cada usuario**

---

## 📝 NOTAS IMPORTANTES

1. **No crear APIs nuevas:** Todo el backend ya está (Sprint 1 completo)
2. **Solo frontend:** 100% de las tareas son de conexión de datos
3. **Reutilizar lógica:** Los 12 meses usan el mismo componente
4. **Caché funciona:** Interpretaciones NO se regeneran
5. **Coste bajo:** ~$0.40-$0.60 por usuario/año completo

---

**Última actualización:** 2026-01-19
**Estado:** ✅ Inventario completo
**Próximo paso:** Empezar Sprint 4 (Calendario Mensual)
