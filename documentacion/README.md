# 📚 DOCUMENTACIÓN - TU VUELTA AL SOL

Índice completo de toda la documentación del proyecto.

---

## 🎯 INICIO RÁPIDO

### Para Desarrolladores Nuevos

1. **Leer primero:** `../CLAUDE.md` - Instrucciones generales del proyecto
2. **Configuración:** `STRIPE_SETUP.md`, `STRIPE_ENV_SETUP.md`
3. **Arquitectura:** `estructura e archios.md`
4. **Bugs conocidos:** `BUGDEAPIS/README.md`

### Para Testing

1. **Caso de prueba estándar:** `BUGDEAPIS/GUIA_TESTING_OSCAR.md` ⭐
2. **Limpieza de caché:** `LIMPIAR_CACHE_VEDICO.md`
3. **Verificación tropical:** `/api/test/tropical-verification`

---

## 📁 ESTRUCTURA DE DOCUMENTACIÓN

```
documentacion/
├── README.md                          # Este archivo - Índice general
├── BUGDEAPIS/                         # Bugs de ProKerala API
│   ├── README.md                      # Índice de bugs
│   ├── GUIA_TESTING_OSCAR.md         # ⭐ Testing con caso Oscar
│   ├── ANALISIS_MATEMATICO_DEFINITIVO.md
│   ├── ANALISIS_OSCAR_CORRECCIONES.md
│   ├── ResumenEjecutivoBuyMedioCielo.md
│   └── PRUEBA_VISUAL_SIMPLE.md
├── ANALISIS_CARTA_NATAL_COMPLETA.md
├── SISTEMA_INTERPRETACIONES.md
├── SISTEMA_INTERPRETACIONES_LLM.md
├── PROMPT_POETICO_ANTIFRAGIL.md
├── GUIA_INTERPRETACIONES_COMPLETA.md
├── INTERPRETACIONES_EVENTOS_AGENDA.md
├── PERSONALIZACION_AGENDA.md
├── ANALISIS_AGENDA_COMPLETO.md
├── ANALISIS_PROBLEMAS_DETECTADOS.md
├── PLAN_ACCION_INTERPRETACION.md
├── TRABAJO_EN_PROGRESO_CARGA_LAZY.md
├── LECCIONES_APRENDIDAS.md
├── PROGRESO_SESION.md
├── RESUMEN_COMPLETO_PARA_MERGE.md
├── RESUMEN_MERGE_MAIN.md
├── RESUMEN_SESION_COMPLETO.md
├── INSTRUCCIONES_MERGE_FIXES.md
├── FIX_BUILD_MERGE_CONFLICTS.md
├── TODO.md
├── PROKERALA_TROPICAL_CONFIG.md      # Configuración tropical ProKerala
├── LIMPIAR_CACHE_VEDICO.md           # Limpieza de caché védico
├── STRIPE_SETUP.md                   # Configuración Stripe
├── STRIPE_ENV_SETUP.md               # Variables de entorno Stripe
├── STRIPE_PRODUCTOS.md               # Productos y precios Stripe
├── SISTEMA_COMPRA_AGENDA.md
├── ESTRATEGIA_PREVIEW_PAGO.md
├── Guialogos.md                      # Guía de logos
└── estructura e archios.md           # Estructura del proyecto
```

---

## 🔴 BUGS Y CORRECCIONES

### 📂 BUGDEAPIS/
**Documentación sobre bugs críticos de ProKerala API**

#### Documentos principales:
- `README.md` - Índice y resumen ejecutivo
- `GUIA_TESTING_OSCAR.md` ⭐ - **LEER SIEMPRE** antes de testing
- `ANALISIS_MATEMATICO_DEFINITIVO.md` - Prueba matemática

**Cuándo consultar:**
- ✅ Antes de cualquier merge
- ✅ Después de modificar cálculos astrológicos
- ✅ Si los valores parecen incorrectos

**Caso de prueba estándar:**
```
Nombre: Oscar
Fecha: 25/11/1966, 02:34 AM
Lugar: Madrid, España
MC esperado: Virgo 23° (NO Géminis)
```

---

## 🎨 INTERPRETACIONES

### Sistema de Interpretaciones

#### `SISTEMA_INTERPRETACIONES.md`
Arquitectura general del sistema de interpretaciones

#### `SISTEMA_INTERPRETACIONES_LLM.md`
Integración con LLMs (OpenAI, Anthropic)

#### `GUIA_INTERPRETACIONES_COMPLETA.md`
Guía completa para escribir y estructurar interpretaciones

#### `PROMPT_POETICO_ANTIFRAGIL.md`
Estilo de escritura para interpretaciones

---

### Interpretaciones Específicas

#### `ANALISIS_CARTA_NATAL_COMPLETA.md`
Análisis completo de carta natal

#### `INTERPRETACIONES_EVENTOS_AGENDA.md`
Interpretaciones de eventos astrológicos en agenda

#### `PLAN_ACCION_INTERPRETACION.md`
Plan de mejora de interpretaciones

---

## 📅 AGENDA

### `PERSONALIZACION_AGENDA.md`
Plan para personalizar eventos de agenda según carta natal

### `ANALISIS_AGENDA_COMPLETO.md`
Análisis técnico completo de la agenda

### `TRABAJO_EN_PROGRESO_CARGA_LAZY.md`
Implementación de carga lazy (diciembre + enero inicialmente)

---

## 💳 STRIPE (PAGOS)

### Configuración
- `STRIPE_SETUP.md` - Setup inicial de Stripe
- `STRIPE_ENV_SETUP.md` - Variables de entorno
- `STRIPE_PRODUCTOS.md` - Productos y precios

### Flujos
- `SISTEMA_COMPRA_AGENDA.md` - Flujo de compra de agenda
- `ESTRATEGIA_PREVIEW_PAGO.md` - Preview gratuito antes de pago

---

## 🔧 PROBLEMAS Y SOLUCIONES

### `ANALISIS_PROBLEMAS_DETECTADOS.md`
Lista completa de problemas detectados y su estado

### `LECCIONES_APRENDIDAS.md`
Lecciones de sesiones anteriores

### `FIX_BUILD_MERGE_CONFLICTS.md`
Solución de conflictos de merge y builds

---

## 📝 SESIONES Y PROGRESO

### `PROGRESO_SESION.md`
Progreso de la sesión actual

### `RESUMEN_SESION_COMPLETO.md`
Resumen completo de sesiones

### `RESUMEN_COMPLETO_PARA_MERGE.md`
Resumen preparado para merge a main

### `RESUMEN_MERGE_MAIN.md`
Resultado de merges a main

### `INSTRUCCIONES_MERGE_FIXES.md`
Instrucciones para hacer merges seguros

---

## 🌍 CONFIGURACIÓN ASTROLÓGICA

### `PROKERALA_TROPICAL_CONFIG.md`
**Configuración completa de ProKerala para astrología tropical occidental**

Contenido:
- Parámetros obligatorios: `ayanamsa=0`, `house_system=placidus`
- Todos los endpoints verificados
- Test de coherencia tropical vs sideral

**Cuándo consultar:**
- ✅ Al añadir nuevos endpoints de ProKerala
- ✅ Si los signos parecen "retrasados" ~24°
- ✅ Para verificar configuración correcta

---

### `LIMPIAR_CACHE_VEDICO.md`
**Guía para limpiar datos védicos cacheados**

Contenido:
- Problema: datos descargados con `ayanamsa=1` (védico)
- Solución: herramientas de limpieza
- Endpoints: `/clear-browser-cache.html`, `/api/admin/clear-cache`

**Cuándo usar:**
- ⚠️ Después de corregir configuración ayanamsa
- ⚠️ Si eventos tienen fechas incorrectas
- ⚠️ Si signos parecen siderales/védicos

---

## 🎨 DISEÑO

### `Guialogos.md`
Guía de uso de logos:
- `LogoSimple` - Sol amarillo/naranja (móvil)
- `LogoSimpleGold` - Sol dorado (alternativa)
- `Logo` - Logo completo (desktop)

### `estructura e archios.md`
Estructura completa de archivos y carpetas del proyecto

---

## ✅ TAREAS

### `TODO.md`
Lista de tareas pendientes y completadas

---

## 🧪 TESTING Y VALIDACIÓN

### Guía Principal
`BUGDEAPIS/GUIA_TESTING_OSCAR.md` ⭐

### Tests Automáticos
```bash
# Test de Oscar (caso estándar)
npm test -- oscar-natal-chart.test.ts

# Verificación tropical vs sideral
GET /api/test/tropical-verification
```

### Tests Manuales
1. Generar carta de Oscar
2. Verificar:
   - MC = Virgo 23° (NO Géminis)
   - Mercurio = Virgo 17°R (NO Escorpio)
   - Júpiter = Cáncer 04°R (NO Leo)

---

## 🔗 ENLACES ÚTILES

### APIs
- ProKerala API: https://api.prokerala.com/docs/
- astronomy-engine: https://github.com/cosinekitty/astronomy

### Testing
- `/api/test/tropical-verification` - Verificar tropical vs sideral
- `/clear-browser-cache.html` - Limpiar caché del navegador
- `/api/admin/clear-cache` - Limpiar caché de MongoDB

---

## 📊 ESTADO DEL PROYECTO

### ✅ Completado
- Bugs de ProKerala API corregidos
- Sistema de interpretaciones funcionando
- Agenda con carga lazy
- Integración con Stripe
- Configuración tropical verificada

### 🔄 En Progreso
- Personalización de agenda según carta natal
- Mejora de interpretaciones con LLM
- Limpieza de caché védico en usuarios existentes

### ⏳ Pendiente
- Ver `TODO.md` para lista completa

---

## 🚀 DESPLIEGUE

### Verificación Pre-Deploy
```bash
# 1. Ejecutar test de Oscar
npm test -- oscar-natal-chart.test.ts

# 2. Verificar configuración tropical
cat documentacion/PROKERALA_TROPICAL_CONFIG.md

# 3. Build
npm run build

# 4. Verificar que no hay errores
npm run lint
```

---

## 📞 SOPORTE Y CONTACTO

### Problemas Comunes

**MC aparece como Géminis en lugar de Virgo:**
- Consultar: `BUGDEAPIS/README.md`
- Solución: Usar `getSignFromLongitude()` siempre

**Eventos con fechas incorrectas:**
- Consultar: `LIMPIAR_CACHE_VEDICO.md`
- Solución: Limpiar caché y verificar `ayanamsa=0`

**Mercurio/Júpiter en signo incorrecto:**
- Consultar: `BUGDEAPIS/ANALISIS_OSCAR_CORRECCIONES.md`
- Solución: Verificar que NO se usa campo `.sign` del API

---

## 📈 MÉTRICAS

### Precisión de Cálculos
- **Tu Vuelta al Sol:** 100% ✅ (después de correcciones)
- Carta-natal.es: 96.15% (MC incorrecto)
- AstroSeek: 96.15% (MC incorrecto)

### Cobertura de Tests
- Tests unitarios: En progreso
- Test de integración: Oscar 100% ✅
- Tests E2E: Pendiente

---

## 🎓 PARA APRENDER

### Orden Recomendado de Lectura

1. **Introducción:**
   - `../README.md`
   - `../CLAUDE.md`

2. **Arquitectura:**
   - `estructura e archios.md`
   - `SISTEMA_INTERPRETACIONES.md`

3. **Problemas y Soluciones:**
   - `BUGDEAPIS/README.md`
   - `ANALISIS_PROBLEMAS_DETECTADOS.md`

4. **Testing:**
   - `BUGDEAPIS/GUIA_TESTING_OSCAR.md`

5. **Configuración:**
   - `PROKERALA_TROPICAL_CONFIG.md`
   - `STRIPE_SETUP.md`

---

**Última actualización:** 2025-12-17
**Mantenido por:** Equipo de desarrollo
**Versión de documentación:** 2.0
