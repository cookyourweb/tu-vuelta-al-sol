# ✅ CONFIGURACIÓN PROKERALA - ASTROLOGÍA TROPICAL OCCIDENTAL

## 🎯 PARÁMETRO CRÍTICO

**`ayanamsa=0`** → **OBLIGATORIO** para usar zodiaco **TROPICAL** (occidental)

Sin este parámetro, ProKerala devuelve datos **SIDERALES** (védicos) por defecto.

---

## 📋 CONFIGURACIÓN COMPLETA VERIFICADA

### ✅ Todos los Endpoints Configurados Correctamente

| Archivo | Método/Endpoint | ayanamsa | Estado |
|---------|----------------|----------|--------|
| `src/lib/prokerala/client.ts` | `getNatalChart()` | ✅ 0 | Tropical |
| `src/lib/prokerala/client.ts` | `getAstronomicalEvents()` | ✅ 0 | **CORREGIDO** |
| `src/lib/prokerala/endpoints.ts` | `commonParams` | ✅ 0 | Tropical |
| `src/hooks/lib/prokerala/client.ts` | `getNatalChart()` | ✅ 0 | Tropical |
| `src/hooks/lib/prokerala/client.ts` | `getAstronomicalEvents()` | ✅ 0 | **CORREGIDO** |
| `src/hooks/lib/prokerala/endpoints.ts` | `commonParams` | ✅ 0 | Tropical |
| `src/services/astrologyService.ts` | `getNatalChart()` | ✅ 0 | Tropical |
| `src/services/astrologyService.ts` | `getPlanetPositions()` | ✅ 0 | Tropical |
| `src/services/astrologyService.ts` | `getAstronomicalEvents()` | ✅ 0 | Tropical |
| `src/services/prokeralaService.ts` | `getNatalChartFromProkerala()` | ✅ 0 | Tropical |
| `src/services/prokeralaService.ts` | `getProgressedChartFromProkerala()` | ✅ 0 | Tropical |
| `src/app/api/charts/natal/route.ts` | POST endpoint | ✅ 0 | Tropical |
| `src/app/api/charts/solar-return/route.ts` | POST endpoint | ✅ 0 | Tropical |
| `src/app/api/astrology/natal-chart/route.ts` | POST endpoint | ✅ 0 | Tropical |
| `src/app/api/prokerala/natal-chart/route.ts` | GET endpoint | ✅ 0 | Tropical |
| `src/app/api/prokerala/client-v2.ts` | `getNatalChart()` | ✅ 0 | Tropical |
| `src/app/api/prokerala/chart/route.ts` | `planet-position` | ✅ 0 | **CORREGIDO** |
| `src/app/api/prokerala/progressed-chart/route.ts` | POST endpoint | ✅ 0 | Tropical |
| `src/app/api/astrology/progressed-chart-accurate/route.ts` | POST endpoint | ✅ 0 | Tropical |
| `src/utils/dateTimeUtils.ts` | `buildProkeralaUrl()` | ✅ 0 | Tropical |

---

## 🔧 CONFIGURACIÓN ESTÁNDAR COMPLETA

```typescript
// Parámetros obligatorios para astrología tropical occidental
const params = {
  ayanamsa: '0',                         // ✅ TROPICAL (occidental)
  house_system: 'placidus',              // ✅ Sistema de casas Placidus
  birth_time_rectification: 'flat-chart', // ✅ Carta plana (no védica)
  orb: 'default',                        // ✅ Orbes occidentales
  aspect_filter: 'major',                // ✅ Aspectos mayores
  la: 'es'                               // Idioma español
};
```

---

## ❌ VALORES INCORRECTOS (EVITAR)

| Parámetro | Valor Incorrecto | Sistema | Correcto |
|-----------|-----------------|---------|----------|
| ayanamsa | `1` | ❌ Lahiri (védico) | `0` |
| ayanamsa | `3` | ❌ Raman (védico) | `0` |
| ayanamsa | `5` | ❌ KP (védico) | `0` |
| ayanamsa | `'lahiri'` | ❌ Védico | `'0'` |
| birth_time_rectification | `'true-sunrise-chart'` | ❌ Védico | `'flat-chart'` |

---

## 🧪 TEST DE COHERENCIA

Para validar que los datos son **tropicales**:

### ✅ Checkpoints

1. **Sol en Capricornio**: ¿Entra el **21-22 de diciembre**?
   - ✅ Sí → Tropical correcto
   - ❌ No (días antes) → Sideral incorrecto

2. **Plutón**: ¿Está en **Acuario** (2024-2025)?
   - ✅ Sí → Tropical correcto
   - ❌ No (Capricornio) → Sideral incorrecto

3. **Mercurio**: ¿Las posiciones coinciden con efemérides occidentales?
   - ✅ Sí → Tropical correcto
   - ❌ No (~24° de diferencia) → Sideral incorrecto

---

## 🔍 CAMBIOS REALIZADOS EN ESTA SESIÓN

### 1. **`src/lib/prokerala/client.ts`**
   - **Antes**: `getAstronomicalEvents()` sin `ayanamsa`
   - **Después**: Añadido `&ayanamsa=0`
   - **Impacto**: Eventos astronómicos ahora usan zodiaco tropical

### 2. **`src/hooks/lib/prokerala/client.ts`**
   - **Antes**: `getAstronomicalEvents()` sin `ayanamsa`
   - **Después**: Añadido `&ayanamsa=0`
   - **Impacto**: Hooks ahora devuelven eventos tropicales

### 3. **`src/app/api/prokerala/chart/route.ts`**
   - **Antes**: `ayanamsa: 'lahiri'` (VÉDICO)
   - **Después**: `ayanamsa: '0'` (TROPICAL)
   - **Impacto**: Posiciones planetarias corregidas a tropical

---

## 📊 DIFERENCIA TROPICAL vs SIDERAL

El zodiaco **sideral** está ~24° **desfasado** respecto al tropical:

| Fecha Real | Tropical (Occidental) | Sideral (Védico) |
|------------|----------------------|------------------|
| 21 Dic | Sol → Capricornio ♑ | Sol → Sagitario ♐ |
| 20 Mar | Sol → Aries ♈ | Sol → Piscis ♓ |
| 21 Jun | Sol → Cáncer ♋ | Sol → Géminis ♊ |
| 23 Sep | Sol → Libra ♎ | Sol → Virgo ♍ |

**Desfase**: ~24° (Ayanamsa de Lahiri ≈ 24°10')

---

## 🎯 CONCLUSIÓN

✅ **TODA** la configuración de ProKerala ahora usa **ayanamsa=0** (TROPICAL)

✅ **NO** quedan endpoints con configuración sideral/védica

✅ Las fechas de eventos ahora coinciden con efemérides **occidentales**

✅ Los signos de planetas usan el **zodiaco tropical** (equinoccio de primavera)

---

**Última actualización**: 2025-12-17
**Commit**: Fix ProKerala tropical configuration (ayanamsa=0)
