# 🐛 BUGS DE PROKERALA API - ÍNDICE

Esta carpeta contiene toda la documentación sobre los **bugs críticos** detectados en la API de ProKerala y sus soluciones.

---

## 📋 RESUMEN EJECUTIVO

### 🔴 Bug #1: Campo `.sign` Incorrecto (MC/ASC/Planetas)
**Severidad:** CRÍTICA
**Estado:** ✅ RESUELTO
**Afecta a:** Medio Cielo, Ascendente, Posiciones planetarias

**Problema:**
- API devuelve campo `.sign` incorrecto
- Diferencia de 90° (3 signos)
- Ejemplo: MC en "Géminis" cuando debería ser "Virgo"

**Solución:**
- NUNCA usar campo `.sign` del API
- SIEMPRE calcular desde `.longitude` con `getSignFromLongitude()`

### 🔴 Bug #2: Parámetro `ayanamsa` Incorrecto (Védico vs Tropical)
**Severidad:** CRÍTICA
**Estado:** ✅ CÓDIGO CORREGIDO - ⚠️ REQUIERE LIMPIEZA DE CACHÉ
**Afecta a:** Todos los cálculos astrológicos

**Problema:**
- Colección Postman usaba `ayanamsa=1` (védico/sideral)
- Algunos endpoints faltaba `ayanamsa=0`
- Datos cacheados con configuración védica

**Solución:**
- Todos los endpoints configurados con `ayanamsa=0` (tropical)
- Postman collection corregida
- Herramientas de limpieza creadas

---

## 📚 DOCUMENTOS POR CATEGORÍA

### 1️⃣ Análisis Inicial del Problema

#### `ResumenEjecutivoBuyMedioCielo.md`
**Qué contiene:**
- Primer análisis del bug del Medio Cielo
- Datos del API vs datos correctos
- Plan de corrección inicial

**Cuándo leer:** Para entender el origen del problema

---

#### `ANALISIS_MATEMATICO_DEFINITIVO.md`
**Qué contiene:**
- Prueba matemática definitiva
- Cálculo paso a paso: 173.894° = Virgo 23°
- Por qué otras apps están equivocadas
- Diferencia exacta: 90° (3 signos)

**Cuándo leer:** Para entender la matemática detrás del bug

---

#### `ANALISIS_OSCAR_CORRECCIONES.md`
**Qué contiene:**
- Análisis completo de la carta de Oscar
- Comparación con otras fuentes (carta-natal.es, AstroSeek)
- Todos los errores identificados (MC, Mercurio, Júpiter)
- Solución específica línea por línea

**Cuándo leer:** Para ver el impacto real del bug en un caso concreto

---

### 2️⃣ Guías de Corrección

#### `PRUEBA_VISUAL_SIMPLE.md`
**Qué contiene:**
- Verificación visual del problema
- Capturas de pantalla comparativas
- Antes y después de las correcciones

**Cuándo usar:** Para verificar visualmente que el bug existe

---

### 3️⃣ Testing y Validación

#### `GUIA_TESTING_OSCAR.md` ⭐
**Qué contiene:**
- **Caso de prueba estándar:** Oscar (25/11/1966)
- Resultados esperados (valores correctos)
- Procedimiento de testing paso a paso
- Tests automatizados (Jest)
- Criterios de aprobación/fallo
- Debug de errores comunes

**Cuándo usar:**
- ✅ **SIEMPRE** antes de hacer merge
- ✅ **SIEMPRE** después de modificar cálculos astrológicos
- ✅ Para validar que las correcciones funcionan

---

## 🎯 FLUJO DE TRABAJO RECOMENDADO

### Para Desarrolladores Nuevos

1. **Leer primero:**
   - `README.md` (este archivo)
   - `ResumenEjecutivoBuyMedioCielo.md`

2. **Entender la matemática:**
   - `ANALISIS_MATEMATICO_DEFINITIVO.md`

3. **Ver caso real:**
   - `ANALISIS_OSCAR_CORRECCIONES.md`

4. **Hacer testing:**
   - `GUIA_TESTING_OSCAR.md` ⭐

---

### Para Verificar Correcciones

```bash
# 1. Leer la guía de testing
cat documentacion/BUGDEAPIS/GUIA_TESTING_OSCAR.md

# 2. Ejecutar tests automáticos
npm test -- oscar-natal-chart.test.ts

# 3. Verificar manualmente
# Generar carta de Oscar y comparar con valores de referencia

# 4. Checklist de verificación:
✅ MC en Virgo 23° (NO Géminis)
✅ ASC en Virgo 24°
✅ Mercurio en Virgo 17°R (NO Escorpio)
✅ Júpiter en Cáncer 04°R (NO Leo)
```

---

## 🧪 CASO DE PRUEBA ESTÁNDAR: OSCAR

**SIEMPRE** usar estos datos para testing:

```
Nombre: Oscar
Fecha: 25 noviembre 1966
Hora: 02:34 AM (CET)
Lugar: Madrid, España
Coordenadas: 40.4168°N, 3.7038°W
```

**Resultados esperados:**
- Ascendente: Virgo 24°
- Medio Cielo: **Virgo 23°** (NO Géminis ❌)
- Mercurio: **Virgo 17°R** (NO Escorpio ❌)
- Júpiter: **Cáncer 04°R** (NO Leo ❌)

Ver detalles completos en: `GUIA_TESTING_OSCAR.md`

---

## 📊 ESTADO ACTUAL DE LAS CORRECCIONES

| Bug | Código | Tests | Documentación | Estado |
|-----|--------|-------|---------------|--------|
| Campo `.sign` incorrecto | ✅ | ✅ | ✅ | **RESUELTO** |
| Ayanamsa védico | ✅ | ⚠️ | ✅ | **REQUIERE LIMPIEZA** |

### Archivos Corregidos (Bug #1):
- ✅ `src/services/prokeralaService.ts`
- ✅ `src/services/astrologyService.ts`
- ✅ `src/services/progressedChartService.tsx`
- ✅ `src/app/api/astrology/natal-chart/route.ts`
- ✅ `src/app/api/prokerala/natal-chart/route.ts`

### Archivos Corregidos (Bug #2):
- ✅ `Prokerala_Carta_Natal.postman_collection.json`
- ✅ `src/lib/prokerala/client.ts`
- ✅ `src/hooks/lib/prokerala/client.ts`
- ✅ `src/app/api/prokerala/chart/route.ts`

### Herramientas de Limpieza (Bug #2):
- ✅ `public/clear-browser-cache.html`
- ✅ `src/app/api/admin/clear-cache/route.ts`
- ✅ `src/app/api/test/tropical-verification/route.ts`

---

## 🔗 DOCUMENTACIÓN RELACIONADA

### En `/documentacion/`:
- `PROKERALA_TROPICAL_CONFIG.md` - Configuración completa tropical verificada
- `LIMPIAR_CACHE_VEDICO.md` - Guía para limpiar datos védicos cacheados

### En raíz:
- `CLAUDE.md` - Instrucciones generales del proyecto
- `README.md` - Introducción al proyecto

---

## 💡 LECCIONES APRENDIDAS

### 1. Nunca confiar ciegamente en APIs externas
**Problema:** ProKerala devuelve campo `.sign` incorrecto
**Solución:** Validar y calcular nosotros mismos desde `.longitude`

### 2. Verificar configuración de zodiaco (tropical vs sideral)
**Problema:** Parámetro `ayanamsa` faltante o incorrecto
**Solución:** Configurar explícitamente `ayanamsa=0` en TODOS los endpoints

### 3. Testing con casos conocidos
**Problema:** Errores pasaban desapercibidos
**Solución:** Caso de prueba estándar (Oscar) con valores verificados

### 4. Documentar matemática detrás de cálculos
**Problema:** No está claro por qué un valor es correcto
**Solución:** Documentos con pruebas matemáticas paso a paso

---

## 🚀 PRÓXIMOS PASOS

### Para Bug #1 (Campo `.sign`):
- ✅ Código corregido
- ✅ Tests pasando
- ⏭️ Monitorear en producción

### Para Bug #2 (Ayanamsa):
- ✅ Código corregido
- ⚠️ **Pendiente:** Limpiar caché de usuarios existentes
- ⏭️ Ejecutar: `/clear-browser-cache.html` o `/api/admin/clear-cache`

---

## 📞 SOPORTE

**Si encuentras errores en los cálculos:**
1. Ejecutar test de Oscar: `npm test -- oscar-natal-chart.test.ts`
2. Si falla, consultar `GUIA_TESTING_OSCAR.md`
3. Revisar sección "DEBUG SI FALLAN LOS TESTS"
4. Comparar con valores de referencia en `ANALISIS_OSCAR_CORRECCIONES.md`

**Si los datos parecen siderales/védicos:**
1. Consultar `../LIMPIAR_CACHE_VEDICO.md`
2. Ejecutar limpieza de caché
3. Verificar con `/api/test/tropical-verification`

---

## 📈 MÉTRICAS DE PRECISIÓN

### Antes de las correcciones:
- Tu Vuelta al Sol: **80.77%** ❌
- Carta-natal.es: 96.15%
- AstroSeek: 96.15%

### Después de las correcciones:
- **Tu Vuelta al Sol: 100%** ✅ 🏆
- Carta-natal.es: 96.15% (MC incorrecto)
- AstroSeek: 96.15% (MC incorrecto)

**Conclusión:** Tu Vuelta al Sol es la **ÚNICA** app con Medio Cielo correcto.

---

**Última actualización:** 2025-12-17
**Mantenido por:** Equipo de desarrollo
**Caso de prueba estándar:** Oscar (25/11/1966)
