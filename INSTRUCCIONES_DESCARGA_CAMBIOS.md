# 📥 Instrucciones para Ver los Cambios del Libro Agenda

**Branch:** `claude/libro-agenda-portada-fix-2eRub`
**Fecha:** 2026-01-18
**Commits:** 4 commits nuevos

---

## 🚨 IMPORTANTE

Los cambios están **pusheados al repositorio remoto** pero necesitas descargarlos localmente para verlos.

---

## 📋 Pasos para Descargar los Cambios

### 1. Guarda tu trabajo actual (si tienes cambios sin guardar)
```bash
git stash
```

### 2. Cambia al branch correcto
```bash
git fetch origin
git checkout claude/libro-agenda-portada-fix-2eRub
```

### 3. Descarga los últimos cambios
```bash
git pull origin claude/libro-agenda-portada-fix-2eRub
```

### 4. Verifica que tienes los commits
```bash
git log --oneline -5
```

Deberías ver:
```
4ad24ce ✨ FEAT: Índice + Números de página visibles en pantalla
60f2c9b ✨ FEAT + 📖 REFACTOR: Números de página + Reorganización estructura libro
ab5e298 📖 REFACTOR: Reorganización Carta de Bienvenida - Ahora es la hoja 4
537b367 🎨 FIX + 📚 DOCS: Unificación fondos Portada/Contraportada
39d1318 📌 DOCS: Archivo START_HERE.md para onboarding rápido
```

### 5. Levanta el servidor de desarrollo
```bash
npm run dev
```

### 6. Abre en el navegador
```
http://localhost:3000/agenda
```

### 7. Haz clic en "Ver Libro Agenda"

---

## ✅ Qué Deberías Ver

### 1. **Portada**
- Fondo con color (igual que contraportada)
- Sin número de página

### 2. **Antes de Empezar**
- Solo "Cómo usar la agenda"
- Sin número de página

### 3. **Índice** (NUEVO)
- Página 2
- Lista completa de secciones del libro
- Números de página de cada sección

### 4. **Carta de Bienvenida**
- Página 3
- Número de página visible en el footer

### 5. **Tema Central del Año** (NUEVO)
- Página 4
- Tema central, qué soltar, ritual de inicio
- Número de página visible

### 6. **Primer Día del Ciclo**
- Página 5
- Intención del año
- Número de página visible

### 7. **Tu Año Tu Viaje**
- Página 6
- Reflexiones
- Número de página visible

### 8. **Resto de páginas**
- Soul Chart, Retorno Solar, Calendario, Meses...
- Todas con números de página visibles

---

## 🔍 Cómo Verificar que Todo Está Correcto

### Archivos nuevos que debes tener:
```bash
ls -la src/components/agenda/libro/
```

Deberías ver:
- ✅ `Indice.tsx` (NUEVO)
- ✅ `PageNumber.tsx` (NUEVO)
- ✅ `TemaCentral.tsx` (NUEVO)

### Verificar el código del libro:
```bash
grep -n "ÍNDICE" src/app/\(dashboard\)/agenda/libro/page.tsx
```

Debería aparecer:
```
269:        {/* ÍNDICE */}
```

---

## 🐛 Si Sigue Sin Verse

### Opción 1: Limpiar caché y reinstalar
```bash
rm -rf .next
npm install
npm run dev
```

### Opción 2: Forzar descarga completa
```bash
git fetch origin
git reset --hard origin/claude/libro-agenda-portada-fix-2eRub
npm install
npm run dev
```

### Opción 3: Verificar que estás en el branch correcto
```bash
git branch
```

Debería mostrar:
```
* claude/libro-agenda-portada-fix-2eRub
```

---

## 📊 Resumen de Cambios Implementados

### Commit 1: Unificación fondos
- Portada = Contraportada (mismo color de fondo)
- Ambas sin fondo en impresión (para cartulina)

### Commit 2: Reorganización estructura
- Carta de Bienvenida movida a página 3
- Tema Central separado en componente nuevo (página 4)
- Primer Día del Ciclo en página 5
- Números de página añadidos

### Commit 3: Reorganización final
- Sistema de números de página en todas las páginas

### Commit 4: Índice visible
- Componente Indice.tsx creado
- Añadido en página 2
- Números de página visibles en pantalla (no solo impresión)

---

## 💡 Si Necesitas Mergear a Main

**NO lo hagas todavía**. Primero:
1. Descarga los cambios localmente
2. Prueba que todo funciona
3. Revisa el libro completo
4. Cuando estés segura, entonces mergea

```bash
# Cuando estés lista:
git checkout main
git pull origin main
git merge claude/libro-agenda-portada-fix-2eRub
git push origin main
```

---

## 📞 Si Sigues Teniendo Problemas

1. Verifica que tienes los 4 commits: `git log --oneline -5`
2. Verifica que estás en el branch correcto: `git branch`
3. Limpia la caché: `rm -rf .next && npm run dev`
4. Revisa la consola del navegador (F12) para ver si hay errores

---

**Última actualización:** 2026-01-18
**Branch:** `claude/libro-agenda-portada-fix-2eRub`
**Estado:** ✅ Todo pusheado y listo para descargar
