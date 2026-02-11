# Lecciones Aprendidas - No Volver a Romper Producción

## 🚨 INCIDENTE 1: Middleware causando 404 en APIs críticas (REVERTIDO)

### 📅 Fecha
Diciembre 11, 2025

### ❌ Commits que causaron problemas
- **da9b5d4:** "🔧 FIX: Remove /api/astrology and /api/interpretations from middleware"
- **ac0d2a0:** "🔧 FIX: Remove /api/birth-data and /api/charts from middleware"

### 🎯 Qué intentábamos solucionar
- **504 Gateway Timeout** en `/api/astrology/interpret-solar-return`
- **504 Gateway Timeout** en `/api/astrology/interpret-natal-complete`
- Pensamos que el middleware estaba bloqueando las llamadas

### ❌ Qué salió mal
Al quitar rutas del middleware:
1. **404 Not Found** en `/api/interpretations/save` (antes funcionaba)
2. Los **504 timeouts persistieron** (no se solucionó nada)
3. Las rutas SÍ necesitan protección de autenticación

### 🔍 Causa raíz REAL
Los **504 timeouts** NO son causados por el middleware, sino por:
- **OpenAI tarda >60 segundos** en generar interpretaciones completas
- Vercel Hobby tiene límite de **60 segundos** por función
- Los prompts son muy largos (>3000 tokens)
- Se usa GPT-4 que es más lento

### ✅ Solución aplicada
**REVERTIR** ambos commits del middleware:
```bash
git revert da9b5d4  # Commit 989aeba
git revert ac0d2a0  # Commit de0b996
```

### 💡 Lección Aprendida
**NO modificar el middleware para solucionar timeouts de OpenAI**

**Soluciones correctas para 504 timeouts:**
1. Dividir llamadas a OpenAI en chunks más pequeños
2. Usar streaming de OpenAI para respuestas incrementales
3. Cachear interpretaciones pre-calculadas
4. Reducir tamaño de prompts y tokens
5. Usar GPT-3.5-turbo en lugar de GPT-4

**El middleware DEBE proteger:**
- `/api/interpretations/*` - Contiene datos sensibles del usuario
- `/api/astrology/*` - Cálculos personalizados que requieren autenticación
- `/api/charts/*` - Datos de cartas natales del usuario
- `/api/birth-data` - Información personal protegida

### 📝 Archivos guardados para uso futuro
Trabajo en progreso documentado en `TRABAJO_EN_PROGRESO_CARGA_LAZY.md`:
- `src/app/api/astrology/monthly-events/route.ts` - Carga eventos por mes (útil después)
- `src/components/astrology/EventsLoadingModal.tsx` - Modal de loading (reutilizable)

---

## 🚨 INCIDENTE 2: Build fallando después de commit a512618

### 📅 Fecha
Diciembre 10, 2025

### ✅ Commit que FUNCIONA
**Commit:** `a512618`
**Mensaje:** "feat: FASE 3 (completa) - integración sistema preview + interpretaciones AI"
**Estado:** ✅ Build exitoso, producción estable

### ❌ Commit que ROMPIÓ producción
**Commit:** `b1cb08d`
**Mensaje:** "agenda impllementation solar"
**Cambios problemáticos:** Modificación de `src/services/userDataService.ts`

---

## 🔍 Qué Causó el Problema

### Archivo modificado: `src/services/userDataService.ts`

**ANTES (a512618 - FUNCIONA):**
```typescript
// Versión simple con fetch() HTTP
export async function getUserBirthData(userId: string): Promise<UserBirthData | null> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/birth-data?userId=${userId}`);
  // ... proceso simple
}
```

**DESPUÉS (b1cb08d - SE ROMPE):**
```typescript
// Detección server/client
function isServer() { return typeof window === 'undefined'; }

// Dynamic imports que FALLAN en build
async function getAuthHeaders() {
  const { getAuth } = await import('firebase/auth'); // ❌ FALLA
}

export async function getUserBirthDataDirect(userId: string) {
  const { default: connectDB } = await import('@/lib/db');     // ❌ FALLA
  const { default: BirthData } = await import('@/models/BirthData'); // ❌ FALLA
}
```

### 🎯 Razón del fallo

**Dynamic imports** se intentan ejecutar durante **BUILD TIME** (no solo runtime):
- Next.js pre-renderiza páginas durante el build
- Al importar dinámicamente Firebase Auth y MongoDB, intenta inicializarlos
- Las variables de entorno no están correctamente disponibles en build context
- Resultado: `Error: Service account object must contain a string "project_id" property`

---

## 🛡️ REGLAS PARA NO ROMPER PRODUCCIÓN

### ✅ DO: Cosas Seguras

1. **Usa imports estáticos** cuando sea posible
   ```typescript
   import connectDB from '@/lib/db';
   ```

2. **Lazy initialization solo en runtime**
   ```typescript
   // ✅ BUENO - Solo se ejecuta cuando se llama
   export function getClient() {
     if (!client) {
       client = new SomeClient();
     }
     return client;
   }
   ```

3. **Variables de entorno con defaults**
   ```typescript
   const apiKey = process.env.OPENAI_API_KEY || '';
   if (!apiKey) throw new Error('Missing API key'); // Falla en runtime, no en build
   ```

4. **Fetch HTTP para acceso a datos**
   ```typescript
   // ✅ Simple, funciona siempre
   const response = await fetch('/api/endpoint');
   ```

### ❌ DON'T: Cosas Peligrosas

1. **NO uses dynamic imports para servicios core**
   ```typescript
   // ❌ MAL - Se ejecuta en build time
   const { default: Something } = await import('@/lib/something');
   ```

2. **NO inicialices servicios en top-level**
   ```typescript
   // ❌ MAL - Se ejecuta al importar el módulo
   const firebase = initializeApp(config);
   export default firebase;
   ```

3. **NO detectes server/client con typeof window**
   ```typescript
   // ❌ PELIGROSO - Causa problemas en build
   if (typeof window === 'undefined') {
     // código server-side que puede fallar en build
   }
   ```

4. **NO accedas a MongoDB directamente desde servicios compartidos**
   ```typescript
   // ❌ MAL - Puede causar build errors
   export async function getData() {
     const db = await connectToDatabase();
     return db.collection('users').find();
   }
   ```

---

## 📋 Checklist Antes de Pushear

Antes de hacer `git push`, verifica:

- [ ] ¿Modifiqué `userDataService.ts`? → **CUIDADO EXTRA**
- [ ] ¿Añadí dynamic imports? → **¿Son realmente necesarios?**
- [ ] ¿Inicializo servicios (Firebase, OpenAI, DB) en top-level? → **NO LO HAGAS**
- [ ] ¿El código funciona en dev local? → **`npm run build` exitoso**
- [ ] ¿Pusheé a branch de prueba primero? → **NO directamente a main**

---

## 🔧 Cómo Recuperarse de un Build Roto

Si el build falla en Vercel:

### Opción 1: Rollback en Vercel (30 segundos)
1. Ve a Vercel Dashboard → Deployments
2. Busca último deployment exitoso (ej: `a512618`)
3. Click "..." → **"Promote to Production"**

### Opción 2: Revert en Git
```bash
# Identificar commit bueno
git log --oneline

# Crear branch desde commit bueno
git checkout -b fix/rollback-to-stable <commit-sha>

# Push
git push -u origin fix/rollback-to-stable
```

### Opción 3: Revert específico de archivo
```bash
# Restaurar archivo específico desde commit bueno
git checkout <commit-sha> -- src/services/userDataService.ts
git commit -m "fix: revert userDataService to working version"
git push
```

---

## 📚 Archivos Sensibles (ALTO RIESGO)

Estos archivos requieren **EXTRA CUIDADO** al modificar:

| Archivo | Por qué es sensible | Precaución |
|---------|-------------------|------------|
| `src/services/userDataService.ts` | Usado en build-time y runtime | NO dynamic imports |
| `src/lib/firebase/admin.ts` | Inicialización de Firebase Admin | Solo lazy initialization |
| `src/lib/db.ts` | Conexión MongoDB | NO inicializar en top-level |
| `middleware.ts` | Se ejecuta en edge runtime | Sin Node.js APIs |
| `next.config.ts` | Afecta build completo | Probar local primero |

---

## ✅ Commit de Referencia Estable

**Para futuros desarrollos, partir SIEMPRE de:**

```bash
git checkout a512618
git checkout -b feature/nueva-feature
```

**Commit:** `a512618`
**Branch recomendada:** `claude/stable-base-a512618-018yVirvPCdaUMFpETP4HATz`

---

## 🎓 Aprendizajes Clave

1. **Simple es mejor** - El código simple con `fetch()` funciona mejor que optimizaciones complejas
2. **Build-time vs Runtime** - Entiende cuándo se ejecuta cada parte del código
3. **Test local no es suficiente** - `npm run dev` puede funcionar pero `npm run build` fallar
4. **Dynamic imports con cuidado** - Solo para code-splitting, no para servicios core
5. **Branches de prueba** - NUNCA pushear cambios grandes directamente a main

---

---

## 🚨 INCIDENTE 3: SR Chart devolviendo datos de año anterior (11 feb 2026)

### 📅 Fecha
Febrero 11, 2026

### ❌ Qué pasaba
El Retorno Solar del ciclo 2026-2027 mostraba el mismo ascendente y planetas que el ciclo 2025-2026.
La interpretacion SR tambien era identica entre ciclos.

### 🔍 Causa raiz

**Bug 1 - Cache SR sin año:**
El modelo `Chart` tiene UN solo campo `solarReturnChart` (tipo Mixed). Al buscar el SR existente:
```typescript
// ❌ ANTES: devuelve el chart cached SIN verificar el año
if (existingChart?.solarReturnChart) {
  return existingChart.solarReturnChart; // Siempre el mismo!
}
```

**Bug 2 - Interpretacion SR sin ciclo:**
El modelo `Interpretation` no tenia campo `cycleYear`. Todas las queries devolvian la SR mas reciente:
```typescript
// ❌ ANTES: devuelve la interpretacion mas reciente sin filtrar año
Interpretation.findOne({ userId, chartType: 'solar-return' }).sort({ generatedAt: -1 })
```

### ✅ Solución aplicada

**Fix 1 - Cache SR con verificacion de año:**
```typescript
// ✅ DESPUES: verificar año antes de devolver cache
const cachedYear = existingChart.solarReturnChart?.solarReturnInfo?.year;
if (cachedYear === solarReturnInfo.year) {
  return existingChart.solarReturnChart; // Solo si mismo año
}
// Si no coincide → regenerar con ProKerala
```

**Fix 2 - Interpretacion SR con cycleYear:**
- Añadido `cycleYear` (number) y `yearLabel` (string) al modelo Interpretation
- Todos los endpoints filtran por `cycleYear`
- Backwards compat: fallback para documentos antiguos sin campo

### 💡 Lección Aprendida
**SIEMPRE incluir identificador temporal en datos que cambian anualmente.**
Un campo `solarReturnChart: Mixed` sin año es una bomba de relojeria.
Ideal: cambiar a array `solarReturnCharts: [{ year, chart }]` (como `progressedCharts`).

### 📝 Archivos modificados
- `src/app/api/charts/solar-return/route.ts` (cache con verificacion año)
- `src/models/Interpretation.ts` (campos cycleYear, yearLabel)
- `src/app/api/astrology/interpret-solar-return/route.ts` (filtro por año)
- `src/app/api/interpretations/route.ts` (filtro por yearLabel)

---

**Última actualización:** Febrero 11, 2026
**Mantenido por:** Claude Code Sessions
