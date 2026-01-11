# 📖 ÍNDICE DEL LIBRO "TU VUELTA AL SOL" - Estructura Real del Código

**Basado en**: `PrintableAgenda.tsx` (commit 33d1fc4)
**Fecha**: 2026-01-11
**Fuente**: Código real del proyecto `libroagendapropuesta`

---

## 📚 ESTRUCTURA COMPLETA

Esta es la estructura EXACTA del libro según el código `PrintableAgenda.tsx`.

---

## 🌟 PARTE I: PORTAL DE ENTRADA (2 páginas)

### 1. Portada Personalizada
**Componente**: `<PortadaPersonalizada name={name} startDate={startDate} endDate={endDate} />`
- Nombre personalizado del usuario
- Fechas del ciclo solar (cumpleaños a cumpleaños)
- Diseño visual con logo y gradientes

### 2. Página de Intención
**Componente**: `<PaginaIntencion />`
- Espacio en blanco para escribir tu intención del año
- Prompt guía para reflexión

---

## 🎯 PARTE II: TU AÑO, TU VIAJE (5 páginas)

### 3. Carta de Bienvenida
**Componente**: `<CartaBienvenida name={name} />`
- Mensaje personalizado de bienvenida
- Introducción al año astrológico

### 4. Tema Central del Año
**Componente**: `<TemaCentralAnio />`
- Tema principal basado en el Retorno Solar
- Qué energía domina este año

### 5. Lo Que Viene a Mover
**Componente**: `<LoQueVieneAMover />`
- Áreas de transformación
- Cambios que el año trae

### 6. Lo Que Pide Soltar
**Componente**: `<LoQuePideSoltar />`
- Patrones a liberar
- Lo que hay que dejar ir

### 7. Página de Intención Anual
**Componente**: `<PaginaIntencionAnual />`
- Espacio para intenciones específicas del año

---

## 🌙 PARTE III: SOUL CHART - Carta Natal (5 páginas)

### 8. Esencia Natal
**Componente**: `<EsenciaNatal />`
- Sol, Luna y Ascendente natal
- Tu identidad astrológica permanente

### 9. Nodo Norte
**Componente**: `<NodoNorte />`
- Propósito de vida
- Dirección evolutiva

### 10. Nodo Sur
**Componente**: `<NodoSur />`
- Talentos innatos
- Patrones del pasado

### 11. Planetas Dominantes
**Componente**: `<PlanetasDominantes />`
- Planetas más fuertes en tu carta
- Tus superpoderes astrológicos

### 12. Patrones Emocionales
**Componente**: `<PatronesEmocionales />`
- Luna y aspectos emocionales
- Tu mundo interior

---

## ☀️ PARTE IV: RETORNO SOLAR - Año Actual (9 páginas)

### 13. ¿Qué es un Retorno Solar?
**Componente**: `<QueEsRetornoSolar />`
- Explicación educativa del concepto

### 14. Ascendente del Año
**Componente**: `<AscendenteAnio />`
- Ascendente del Retorno Solar
- Cómo te presentas este año

### 15. Sol en el Retorno
**Componente**: `<SolRetorno />`
- Casa y aspectos del Sol SR
- Foco principal del año

### 16. Luna en el Retorno
**Componente**: `<LunaRetorno />`
- Casa y aspectos de la Luna SR
- Necesidades emocionales del año

### 17. Ejes del Año (Parte 1)
**Componente**: `<EjesDelAnio />`
- Eje Ascendente-Descendente
- Yo vs. Otro este año

### 18. Ejes del Año (Parte 2)
**Componente**: `<EjesDelAnio2 />`
- Eje MC-IC
- Vocación vs. Hogar este año

### 19. Integración de Ejes
**Componente**: `<IntegracionEjes />`
- Cómo trabajar ambos ejes
- Síntesis de polaridades

### 20. Ritual de Cumpleaños
**Componente**: `<RitualCumpleanos />`
- Ritual personalizado para tu cumpleaños
- Cómo celebrar conscientemente

### 21. Mantra Anual
**Componente**: `<MantraAnual />`
- Mantra personalizado para el año
- Frase que sintetiza tu año

---

## 📅 PARTE V: CALENDARIO ANUAL (3 páginas)

### 22. Línea de Tiempo Emocional
**Componente**: `<LineaTiempoEmocional startDate={startDate} endDate={endDate} />`
- Gráfico visual del año completo
- Vista panorámica del ciclo

### 23. Meses Clave y Puntos de Giro
**Componente**: `<MesesClaveYPuntosGiro />`
- Meses más importantes
- Momentos críticos del año

### 24. Grandes Aprendizajes
**Componente**: `<GrandesAprendizajes />`
- Lecciones principales del año
- Qué vendrá a enseñarte

---

## 📆 PARTE VI: EJEMPLO COMPLETO - ENERO 2026 (11 páginas)

**NOTA**: Este es un mes de EJEMPLO hardcodeado. En la implementación final, todos los meses seguirán esta estructura.

### 25-26. Apertura de Enero (2 páginas)
**Componentes**:
- `<AperturaEneroIzquierda />` - Página izquierda con título del mes
- `<AperturaEneroDerecha />` - Página derecha con eventos del mes

### 27. Calendario Visual de Enero
**Componente**: `<CalendarioVisualEnero />`
- Calendario mensual tradicional
- Eventos marcados por día

### 28. Interpretación Luna Nueva Enero
**Componente**: `<InterpretacionLunaNuevaEnero />`
- Luna Nueva del 6 de enero (ejemplo)
- Qué sembrar en esta luna

### 29. Interpretación Luna Llena Enero
**Componente**: `<InterpretacionLunaLlenaEnero />`
- Luna Llena del 20 de enero (ejemplo)
- Qué liberar en esta luna

### 30. Ejercicios de Enero
**Componente**: `<EjerciciosEnero />`
- 3-5 ejercicios prácticos del mes
- Journaling prompts

### 31. Mantra de Enero
**Componente**: `<MantraEnero />`
- Frase poderosa para el mes

### 32-35. Semanas de Enero (4 páginas)
**Componentes**:
- `<Semana1Enero />` - Semana 1 (días 1-7)
- `<Semana2Enero />` - Semana 2 (días 8-14)
- `<Semana3Enero />` - Semana 3 (días 15-21)
- `<Semana4Enero />` - Semana 4 (días 22-28/31)

### 36. Cierre de Enero
**Componente**: `<CierreEnero />`
- Reflexión del mes
- Preparación para febrero

---

## 📆 PARTE VII: RESTO DE MESES (Meses 2-12)

**LOOP**: `months.slice(1).map((monthDate, monthIndex) => { ... })`

Para cada uno de los 11 meses restantes (Febrero - Diciembre), se generan:

### A. Portada del Mes
**Componente**: `<PortadaMes monthDate={monthDate} monthNumber={actualMonthNumber} />`

### B. Calendario Mensual Completo
**Componente**: `<CalendarioMensualCompleto monthDate={monthDate} monthNumber={actualMonthNumber} birthday={birthday} />`

### C. Días del Mes
**Componente**: `<DiasDelMes monthDate={monthDate} monthNumber={actualMonthNumber} birthday={birthday} />`

### D. Interpretación Mensual
**Componente**: `<InterpretacionMensual monthDate={monthDate} monthNumber={actualMonthNumber} />`

### E. Ritual y Mantra del Mes
**Componente**: `<RitualYMantraMes monthDate={monthDate} monthNumber={actualMonthNumber} />`

### F. Intención del Mes
**Componente**: `<IntencionMes monthDate={monthDate} monthNumber={actualMonthNumber} />`

### G. Semanas del Mes (4 páginas por mes)
**LOOP**: `weeksInMonth.map((week, weekIdx) => { ... })`

**Componente**: `<SemanaConsciente weekStart={week.weekStart} weekNumber={(actualMonthNumber * 4) + weekIdx + 1} />`

Cada semana muestra:
- 7 días individuales
- Eventos de cada día
- Espacio para notas

### H. Eventos Lunares Intercalados
Distribuidos cada 3 meses:
- **Mes 2, 5, 8, 11**: `<PaginaLunaNueva />`
- **Mes 3, 6, 9, 12**: `<PaginaLunaLlena />`
- **Mes 4 solamente**: `<PaginaEclipse />`

### I. Integración Mensual
**Componente**: `<IntegracionMensual monthDate={monthDate} />`
- Espacio para reflexión del mes
- Preguntas guía

**Total meses 2-12**: 11 meses × (6 componentes base + 4 semanas + eventos lunares + integración) = ~110 páginas aproximadamente

---

## 🎨 PARTE VIII: TERAPIAS CREATIVAS (4 páginas)

### 131. Escritura Terapéutica
**Componente**: `<EscrituraTerapeutica />`
- Ejercicios de journaling profundo

### 132. Visualización
**Componente**: `<Visualizacion />`
- Meditaciones guiadas visuales

### 133. Ritual Simbólico
**Componente**: `<RitualSimbolico />`
- Rituales para momentos clave

### 134. Trabajo Emocional
**Componente**: `<TrabajoEmocional />`
- Ejercicios de inteligencia emocional

---

## 🌅 PARTE IX: CIERRE DE CICLO (5 páginas)

### 135. Quién Era / Quién Soy
**Componente**: `<QuienEraQuienSoy />`
- Comparación antes/después del año

### 136. Preparación para la Próxima Vuelta
**Componente**: `<PreparacionProximaVuelta />`
- Intenciones para el próximo ciclo

### 137. Carta de Cierre
**Componente**: `<CartaCierre name={name} />`
- Carta del usuario a sí mismo

### 138. Página Final en Blanco
**Componente**: `<PaginaFinalBlanca />`
- Espacio libre

### 139. Contraportada
**Componente**: `<Contraportada />`
- Información final, créditos

---

## 📊 RESUMEN ESTADÍSTICO

### Páginas Totales Estimadas: ~350-400

**Desglose**:
- Portal de Entrada: 2 páginas
- Tu Año Tu Viaje: 5 páginas
- Soul Chart: 5 páginas
- Retorno Solar: 9 páginas
- Calendario Anual: 3 páginas
- Ejemplo Enero: 11 páginas
- Resto de meses (11): ~110 páginas
- Terapias Creativas: 4 páginas
- Cierre de Ciclo: 5 páginas
- **Eventos lunares intercalados**: ~15 páginas adicionales
- **Semanas detalladas**: ~200 páginas (4 semanas × 12 meses × ~4 páginas/semana)

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Sistema de Generación de Meses

```typescript
// Generate months from birthday to next birthday
const generateMonths = () => {
  const months: Date[] = [];
  let currentMonth = startOfMonth(startDate);
  while (isBefore(currentMonth, endDate)) {
    months.push(currentMonth);
    currentMonth = addMonths(currentMonth, 1);
  }
  return months.slice(0, 12);
};
```

### Sistema de Generación de Semanas

```typescript
// Generate weeks for each month
const generateWeeksForMonth = (monthDate: Date) => {
  const weeks: { weekStart: Date; weekNumber: number }[] = [];
  const monthStart = startOfMonth(monthDate);
  const monthEnd = addMonths(monthStart, 1);
  let currentWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
  let weekNum = 1;

  while (isBefore(currentWeek, monthEnd)) {
    weeks.push({ weekStart: currentWeek, weekNumber: weekNum });
    currentWeek = addWeeks(currentWeek, 1);
    weekNum++;
  }
  return weeks.slice(0, 4);
};
```

---

## 🎨 ESTILOS VISUALES

El libro tiene **4 estilos intercambiables** (StyleContext):

1. **Elegante**: Dorado, negro, serif clásicas
2. **Creativo**: Púrpura, rosa, amarillo, mix de fuentes
3. **Minimalista**: Grises, negro, sans-serif limpias
4. **Bohemio**: Tierra, ocre, terracota, script decorativas

---

## 📏 ESPECIFICACIONES DE IMPRESIÓN

```css
@media print {
  @page {
    size: A5;
    margin: 0;
  }

  .print-page {
    page-break-after: always;
    width: 148mm;
    height: 210mm;
  }
}
```

---

## 🔄 IMPORTACIONES DEL CÓDIGO

```typescript
// Portal de Entrada
import { PortadaPersonalizada, PaginaIntencion } from "./agenda/PortalEntrada";

// Tu Año Tu Viaje
import { CartaBienvenida, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from "./agenda/TuAnioTuViaje";

// Soul Chart
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from "./agenda/SoulChart";

// Retorno Solar
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from "./agenda/RetornoSolar";

// Calendario Anual
import { LineaTiempoEmocional, MesesClaveYPuntosGiro, GrandesAprendizajes } from "./agenda/CalendarioAnual";

// Mes Pages
import { PortadaMes, CalendarioMensualCompleto, DiasDelMes, InterpretacionMensual, RitualYMantraMes, IntencionMes } from "./agenda/MesPage";

// Ejemplo completo Enero 2026
import {
  AperturaEneroIzquierda,
  AperturaEneroDerecha,
  CalendarioVisualEnero,
  InterpretacionLunaNuevaEnero,
  InterpretacionLunaLlenaEnero,
  EjerciciosEnero,
  MantraEnero,
  Semana1Enero,
  Semana2Enero,
  Semana3Enero,
  Semana4Enero,
  CierreEnero
} from "./agenda/EjemploEnero2026";

// Semanas
import { SemanaConsciente } from "./agenda/SemanaConsciente";

// Eventos Astrológicos
import { PaginaLunaNueva, PaginaLunaLlena, PaginaEclipse } from "./agenda/EventosAstrologicos";

// Terapias Creativas
import { EscrituraTerapeutica, Visualizacion, RitualSimbolico, TrabajoEmocional } from "./agenda/TerapiasCreativas";

// Integración
import { IntegracionMensual } from "./agenda/IntegracionMensual";

// Cierre
import { QuienEraQuienSoy, PreparacionProximaVuelta, CartaCierre, PaginaFinalBlanca, Contraportada } from "./agenda/CierreCiclo";
```

---

## 📝 NOTAS IMPORTANTES

1. **Primer mes**: Siempre empieza en tu cumpleaños, no en enero
2. **Ejemplo hardcodeado**: Enero 2026 es solo ejemplo, la implementación final debe generar dinámicamente todos los meses
3. **Semanas**: 4 semanas por mes (simplificado, algunos meses tienen 5)
4. **Eventos lunares**: Distribuidos estratégicamente cada 2-3 meses
5. **Personalización**: Nombre, fechas y datos del usuario se inyectan dinámicamente

---

**Este es el índice REAL basado en el código fuente actual.**
**Última actualización**: 2026-01-11
**Fuente**: `libroagendapropuesta/src/components/PrintableAgenda.tsx`
