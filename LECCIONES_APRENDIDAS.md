# Lecciones Aprendidas - No Volver a Romper Producción

## 🚨 INCIDENTE: Build fallando después de commit a512618

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

**Última actualización:** Diciembre 10, 2025
**Mantenido por:** Claude Code Sessions
