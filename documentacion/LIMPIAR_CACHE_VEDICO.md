# 🧹 GUÍA: Limpiar Datos Védicos y Forzar Recalculo Tropical

## ⚠️ PROBLEMA IDENTIFICADO

La colección de Postman tenía configuración **VÉDICA** (sideral):
```json
"ayanamsa": "1"  ❌ VÉDICO (Lahiri)
"birth_time_rectification": "none"  ❌ Incorrecto
```

Esto causó que se descargaran y cachearan eventos con:
- Signos "atrasados" ~24° (Ayanamsa védico)
- Fechas incorrectas para Luna Nueva/Llena
- Posiciones planetarias en zodiaco sideral

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. Configuración Corregida

**Postman Collection** (`Prokerala_Carta_Natal.postman_collection.json`):
```json
"ayanamsa": "0"  ✅ TROPICAL (occidental)
"birth_time_rectification": "flat-chart"  ✅ Occidental
"house_system": "placidus"  ✅ Psicológico occidental
```

**Código (todos los endpoints)**:
- ✅ `src/lib/prokerala/client.ts`: `ayanamsa=0`
- ✅ `src/hooks/lib/prokerala/client.ts`: `ayanamsa=0`
- ✅ `src/services/astrologyService.ts`: `ayanamsa=0`
- ✅ Todos los archivos verificados en `PROKERALA_TROPICAL_CONFIG.md`

### 2. Verificación astronomy-engine

`astronomy-engine` usa **TROPICAL por defecto**:
- Referencia: Equinoccio vernal (0° Aries)
- NO usa ayanamsa (no es librería védica)
- Ya estaba correcto ✅

---

## 🧹 LIMPIEZA REQUERIDA

Dado que hay datos cacheados con parámetros védicos incorrectos, necesitas limpiar:

### OPCIÓN 1: Limpieza del Navegador (localStorage/sessionStorage)

**Método A: Usar herramienta HTML**
1. Abre: `http://localhost:3000/clear-browser-cache.html`
2. Click en "🗑️ Limpiar TODO el Caché"
3. Confirma
4. Recarga la página

**Método B: Consola del Navegador**
```javascript
// F12 → Console → Pega esto:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### OPCIÓN 2: Limpieza de Base de Datos (MongoDB)

**Endpoint de limpieza** (`/api/admin/clear-cache`):

```bash
# Ver estadísticas actuales
GET http://localhost:3000/api/admin/clear-cache

# Limpiar TODO (admin)
POST http://localhost:3000/api/admin/clear-cache
Content-Type: application/json

{
  "clearAll": true
}

# Limpiar solo para un usuario
POST http://localhost:3000/api/admin/clear-cache
Content-Type: application/json

{
  "userId": "USER_ID_AQUI",
  "clearEvents": true,
  "clearCharts": true,
  "clearInterpretations": true
}
```

### OPCIÓN 3: Hard Refresh del Navegador

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

---

## 🧪 VERIFICACIÓN POST-LIMPIEZA

### Test 1: Endpoint de Verificación

```bash
GET http://localhost:3000/api/test/tropical-verification
```

Deberías ver:
```json
{
  "sistema_usado": "🌍 ASTRONOMY-ENGINE (TROPICAL por defecto)",
  "tests": [
    {
      "name": "Luna Nueva Diciembre 2025",
      "verdict": "✅ astronomy-engine usa TROPICAL por defecto"
    },
    {
      "name": "Sol en Capricornio (Solsticio)",
      "verdict": "✅ CORRECTO: Sol en 270° = 0° Capricornio (TROPICAL)"
    }
  ]
}
```

### Test 2: Checkeo Manual

**☀️ Sol en Capricornio**
- Fecha: 21-22 diciembre
- ✅ TROPICAL: Sol entra en Capricornio el 21-22 dic
- ❌ SIDERAL: Sol estaría en Sagitario

**🌙 Luna Nueva**
- ✅ TROPICAL: Fechas coinciden con efemérides occidentales
- ❌ SIDERAL: Fechas adelantadas/atrasadas

**🪐 Plutón**
- ✅ TROPICAL: Plutón en Acuario (2024-2025)
- ❌ SIDERAL: Plutón en Capricornio

### Test 3: Logs de Consola

Al cargar `/agenda`, busca en consola:
```
🔍 [TROPICAL] Longitud eclíptica: 270.00° → Capricornio 0.0°
```

---

## 📋 CHECKLIST DE LIMPIEZA

- [ ] **Limpieza del navegador**
  - [ ] localStorage cleared
  - [ ] sessionStorage cleared
  - [ ] Cookies cleared
  - [ ] Hard refresh (Ctrl+Shift+R)

- [ ] **Limpieza de base de datos**
  - [ ] EventInterpretations eliminadas
  - [ ] Charts eliminadas
  - [ ] Interpretations eliminadas

- [ ] **Verificación**
  - [ ] Llamar `/api/test/tropical-verification`
  - [ ] Verificar Sol en Capricornio (21-22 dic)
  - [ ] Verificar fechas de Luna Nueva/Llena
  - [ ] Ver logs `[TROPICAL]` en consola

- [ ] **Recarga de datos**
  - [ ] Cargar `/agenda` y verificar eventos
  - [ ] Generar nueva carta natal
  - [ ] Verificar interpretaciones nuevas

---

## 🎯 RESULTADO ESPERADO

Después de la limpieza:

**ANTES (Védico - Incorrecto)**:
```
Luna Nueva en Sagitario - 20 diciembre ❌
Sol entra en Capricornio - 15 diciembre ❌
Mercurio en Escorpio - (retrasado ~24°) ❌
```

**DESPUÉS (Tropical - Correcto)**:
```
Luna Nueva en Capricornio - 30 diciembre ✅
Sol entra en Capricornio - 21 diciembre ✅
Mercurio en Sagitario - (posición correcta) ✅
```

---

## 🔧 ARCHIVOS MODIFICADOS

1. `Prokerala_Carta_Natal.postman_collection.json` → ayanamsa=0
2. `src/lib/prokerala/client.ts` → getAstronomicalEvents() + ayanamsa=0
3. `src/hooks/lib/prokerala/client.ts` → getAstronomicalEvents() + ayanamsa=0
4. `src/app/api/prokerala/chart/route.ts` → ayanamsa='0' (era 'lahiri')
5. **NUEVO**: `src/app/api/admin/clear-cache/route.ts`
6. **NUEVO**: `public/clear-browser-cache.html`
7. **NUEVO**: `src/app/api/test/tropical-verification/route.ts`

---

## 📞 SOPORTE

Si después de limpiar siguen apareciendo datos védicos:

1. Verifica que estés usando la rama correcta: `claude/fix-solar-return-endpoints-RhB2q`
2. Haz `git pull` para asegurarte de tener los últimos cambios
3. Reinicia el servidor de desarrollo: `npm run dev`
4. Abre modo incógnito y prueba
5. Revisa los logs de consola buscando `[TROPICAL]`

---

**Última actualización**: 2025-12-17
**Commit**: Fix Postman collection + Clear cache endpoints
