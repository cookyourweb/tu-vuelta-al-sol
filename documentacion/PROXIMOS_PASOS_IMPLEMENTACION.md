# 🚀 Próximos Pasos de Implementación

## 📅 Fecha: 2025-12-25
## 🌟 Estado Actual: Capa 2 Completada + Capa 3 Preparada

---

## ✅ YA IMPLEMENTADO

### 1. Arquitectura de 3 Capas ✅

```
CAPA 1: CARTA NATAL
   └─ Prompt limpio sin rituales (natalChartPrompt_clean.ts)
   └─ Servicio de interpretación (cleanNatalInterpretationService.ts)
   └─ Endpoint actualizado (interpret-natal-complete/route.ts)
   └─ Interfaces TypeScript (CartaNatalLimpia)

CAPA 2: RETORNO SOLAR ✅ COMPLETADO
   └─ Comparaciones planetarias implementadas
   └─ Prompt actualizado (solarReturnPrompts_v2.ts)
   └─ Endpoint con lookup de natal (interpret-solar-return/route.ts)
   └─ Interfaces TypeScript (ComparacionPlanetaria, ComparacionesPlanetarias)
   └─ Drawer específico (SolarReturnPlanetDrawer.tsx)

CAPA 3: AGENDA ⏳ PREPARADA
   └─ Interfaces de objetos simbólicos (ObjetoSimbolico, KitMensual)
   └─ Servicio generador de kits (kitGenerator.ts)
   └─ Documentación completa (OBJETOS_SIMBOLICOS_Y_TIENDA.md)
```

---

## 📂 ARCHIVOS CREADOS/MODIFICADOS

### ✅ Completados

1. **Prompts**:
   - `src/utils/prompts/natalChartPrompt_clean.ts` (NUEVO)
   - `src/utils/prompts/solarReturnPrompts_v2.ts` (ACTUALIZADO)

2. **Servicios**:
   - `src/services/cleanNatalInterpretationService.ts` (NUEVO)
   - `src/services/kitGenerator.ts` (NUEVO)

3. **Endpoints**:
   - `src/app/api/astrology/interpret-natal-complete/route.ts` (ACTUALIZADO)
   - `src/app/api/astrology/interpret-solar-return/route.ts` (ACTUALIZADO)

4. **Tipos**:
   - `src/types/astrology/interpretation.ts` (ACTUALIZADO)
     - ComparacionPlanetaria
     - ComparacionesPlanetarias
     - UsoAgenda
     - ObjetoSimbolico
     - KitMensual
     - MicroRitual

5. **Componentes**:
   - `src/components/solar-return/SolarReturnPlanetDrawer.tsx` (NUEVO)

6. **Documentación**:
   - `ARQUITECTURA_3_CAPAS.md`
   - `ACTUALIZACION_NATAL_LIMPIA.md`
   - `COMPARACIONES_PLANETARIAS_3_CAPAS.md`
   - `OBJETOS_SIMBOLICOS_Y_TIENDA.md`
   - `PROXIMOS_PASOS_IMPLEMENTACION.md` (este archivo)

---

## ⏳ PENDIENTE DE IMPLEMENTAR

### 1. Frontend - Solar Return

#### A. Integrar SolarReturnPlanetDrawer en páginas SR

**Archivo**: `src/app/(dashboard)/solar-return/page.tsx` o similar

**Tarea**:
- Importar `SolarReturnPlanetDrawer`
- Reemplazar drawer antiguo con nuevo drawer
- Conectar con datos de `comparaciones_planetarias`

**Ejemplo de uso**:
```tsx
import { SolarReturnPlanetDrawer } from '@/components/solar-return/SolarReturnPlanetDrawer';

const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
const [drawerOpen, setDrawerOpen] = useState(false);

// En el render:
<SolarReturnPlanetDrawer
  isOpen={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  planetName={selectedPlanet || ''}
  comparacion={interpretation?.comparaciones_planetarias?.[selectedPlanet]}
/>
```

#### B. Crear Tooltips para Planetas SR

**Componente nuevo**: `src/components/solar-return/PlanetTooltip.tsx`

**Debe mostrar**:
- Frase clave (comparacion.frase_clave)
- Error automático (comparacion.error_automatico)
- Botón "Ver más" → abre drawer

**Diferencia con Drawer**:
- **Tooltip** = Resumen rápido (hover)
- **Drawer** = Comparación completa (click)

---

### 2. Frontend - Agenda (Layer 3 - FUNCIONAL)

#### A. Crear página de Agenda ⏳

**Archivo nuevo**: `src/app/(dashboard)/agenda/page.tsx`

**Debe incluir**:
- Vista mensual/semanal
- Ciclos lunares (Luna Nueva, Luna Llena) con fechas
- Rituales de 2 minutos (SIN objetos necesarios)
- 5 tipos de ejercicios personalizados
- Frase clave del mes destacada
- Error a evitar
- **Banner opcional**: "Potencia tu práctica" (link a tienda)

#### B. Componente EntrenamientoDelMes ⏳

**Archivo nuevo**: `src/components/agenda/EntrenamientoDelMes.tsx`

**Debe mostrar**:
```tsx
interface EntrenamientoDelMesProps {
  agenda: AgendaMensual;
}

// Secciones:
- Planeta activo del mes (icon + nombre)
- Frase clave (destacada)
- Error a evitar (warning box)
- Entrenamiento principal (qué_hacer)
- 5 ejercicios personalizados:
  1. Conciencia (journaling)
  2. Acción guiada (micro-acción)
  3. Mantra funcional
  4. Meditación breve (2 min)
  5. Pregunta de integración
```

#### C. Componente CicloLunar ⏳

**Archivo nuevo**: `src/components/agenda/CicloLunar.tsx`

**Debe mostrar**:
- Próxima Luna Nueva (fecha, guía específica, ejercicio sugerido)
- Próxima Luna Llena (fecha, guía específica, ejercicio sugerido)
- Ritual práctico (2 min, pasos sin objetos)
- **NO** menciona velas ni piedras (funciona sin comprar nada)

---

### 3. Backend - Generación de Agenda (Prioridad)

#### A. Endpoint de Agenda Mensual ⏳ PRIORIDAD ALTA

**Archivo nuevo**: `src/app/api/agenda/mensual/route.ts`

**Funcionalidad**:
```typescript
// GET /api/agenda/mensual
// Query params: userId, mes (opcional - default: mes actual)

export async function GET(request: Request) {
  // 1. Obtener userId de params
  // 2. Buscar interpretación SR más reciente
  // 3. Identificar planeta dominante del mes
  // 4. Extraer comparacion del planeta
  // 5. Generar AgendaMensual usando agendaGenerator.ts:
  //    - Rituales de 2 min (sin objetos)
  //    - 5 ejercicios personalizados
  //    - Guías lunares con fechas
  // 6. Retornar agenda completa
  // 7. TODO funciona SIN necesidad de comprar nada
}
```

#### B. Servicio de Ciclos Lunares ⏳

**Ya existe base**: `astronomy-engine` (instalada)

**Archivo nuevo**: `src/services/lunarCycleService.ts`

**Funcionalidad**:
```typescript
export function calcularProximaLunaNueva(): Date
export function calcularProximaLunaLlena(): Date
export function calcularLunasCicloMes(mes: number, año: number): {
  luna_nueva: Date;
  luna_llena: Date;
}[]
```

---

### 4. Backend - Kits (Tienda - Opcional)

**⚠️ IMPORTANTE**: Los kits son OPCIONALES y se implementan DESPUÉS de la agenda funcional.

#### A. Endpoint de Kits Mensuales ⏳ PRIORIDAD BAJA

**Archivo nuevo**: `src/app/api/tienda/kit-sugerido/route.ts`

**Funcionalidad**:
```typescript
// GET /api/tienda/kit-sugerido
// Query params: userId

export async function GET(request: Request) {
  // 1. Obtener SR del usuario
  // 2. Identificar planeta activo
  // 3. Generar kit sugerido usando kitGenerator.ts
  // 4. Retornar kit como OFERTA opcional
  // 5. Usuario puede ignorarlo (agenda funciona igual)
}
```

---

### 5. Testing

#### A. Testing de Generación de Agenda ⏳

**Archivo**: `__tests__/services/agendaGenerator.test.ts`

**Tests necesarios**:
- ✅ Generar agenda mensual con 5 ejercicios
- ✅ Verificar que rituales NO requieren objetos
- ✅ Validar guías lunares incluyen uso_agenda
- ✅ Confirmar que todo funciona sin comprar nada

#### B. Testing de Generación de Kits ⏳ OPCIONAL

**Archivo**: `__tests__/services/kitGenerator.test.ts`

**Tests necesarios**:
- ✅ Generar kit para cada planeta
- ✅ Verificar que incluye vela + piedra + micro-ritual
- ✅ Validar que frase_ancla coincide con frase_clave de comparación
- ✅ Generar kits anuales (12 meses)

#### B. Testing de Comparaciones

**Archivo**: `__tests__/prompts/solarReturnComparisons.test.ts`

**Tests necesarios**:
- ✅ Verificar que JSON generado incluye comparaciones_planetarias
- ✅ Validar estructura de cada comparación (4 partes obligatorias)
- ✅ Confirmar que usa interpretaciones natales cuando existen

---

### 6. Futura Tienda (E-commerce)

#### A. Base de Datos de Productos

**Modelo nuevo**: `src/models/Product.ts`

```typescript
interface Product {
  _id: ObjectId;
  tipo: 'kit-mensual' | 'kit-lunar' | 'kit-anual' | 'vela' | 'piedra';
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenes: string[];
  planeta?: string; // Si es específico de planeta
  activo: boolean;
}
```

#### B. Endpoint de Productos

**Archivo nuevo**: `src/app/api/tienda/productos/route.ts`

**Funcionalidad**:
- GET /api/tienda/productos → Listar productos
- GET /api/tienda/productos/[id] → Detalle producto
- POST /api/tienda/productos → Crear producto (admin)

#### C. Integración con Stripe

**Ya existe**: `STRIPE_SETUP.md`, `STRIPE_PRODUCTOS.md`

**Próximo paso**:
- Crear productos en Stripe para kits
- Vincular con página de checkout
- Generar órdenes personalizadas (kit del mes del usuario)

---

## 🎯 PRIORIDADES SUGERIDAS (ACTUALIZADAS)

### 🔥 Prioridad ALTA (Esta Semana)

1. **Integrar SolarReturnPlanetDrawer** en página SR
   - Reemplazar drawer antiguo
   - Conectar con comparaciones
   - Testing básico

2. **Crear Tooltips de Planetas SR**
   - Frase clave + error automático
   - Click → abrir drawer

3. **Testing de generación actual**
   - Probar que comparaciones se generan correctamente
   - Verificar que natal interpretations se usan

### 🟡 Prioridad MEDIA (Próximas 2 Semanas)

4. **Servicio de ciclos lunares**
   - Cálculo automático Luna Nueva/Llena usando astronomy-engine
   - Integrar con comparaciones

5. **Endpoint de Agenda Mensual** (`/api/agenda/mensual`)
   - Generar AgendaMensual usando agendaGenerator.ts
   - Incluir fechas lunares reales
   - TODO funciona sin objetos

6. **Crear página Agenda básica**
   - Vista mensual
   - Entrenamiento del mes (planeta activo)
   - 5 ejercicios personalizados
   - Rituales de 2 min (sin objetos)
   - Guías lunares con fechas

7. **Componente EntrenamientoDelMes**
   - Frase clave destacada
   - Error a evitar
   - 5 ejercicios (tabs o accordion)

### 🟢 Prioridad BAJA (Futuro)

8. **Banner de Tienda** en Agenda
   - "Potencia tu práctica con objetos simbólicos"
   - Link a página de tienda (futura)

9. **Endpoint de Kits Sugeridos** (`/api/tienda/kit-sugerido`)
   - Generar kit basado en planeta activo
   - Como OFERTA opcional

10. **E-commerce completo**
    - Productos en base de datos
    - Checkout con Stripe
    - Envío físico de kits
    - Página de tienda

11. **Audio guiados**
    - Meditaciones de 2 minutos
    - QR codes en kits físicos

---

## 📊 Métricas de Progreso

### Capa 1: Natal Chart ✅ 100%
- [x] Prompt limpio
- [x] Servicio de generación
- [x] Endpoint actualizado
- [x] Interfaces TypeScript
- [x] Documentación

### Capa 2: Solar Return ✅ 90%
- [x] Comparaciones en prompt
- [x] Endpoint con natal lookup
- [x] Interfaces TypeScript
- [x] Drawer nuevo creado
- [ ] Integrar drawer en frontend (10%)
- [x] Documentación

### Capa 3: Agenda ⏳ 40%
- [x] Interfaces de objetos simbólicos
- [x] Servicio generador de kits
- [x] Documentación completa
- [ ] Página de Agenda (0%)
- [ ] Componente KitDelMes (0%)
- [ ] Endpoint de kits (0%)
- [ ] Servicio lunar (0%)

### Tienda ⏳ 10%
- [x] Documentación de concepto
- [ ] Modelo de productos (0%)
- [ ] Endpoints de productos (0%)
- [ ] Integración Stripe (0%)
- [ ] Checkout personalizado (0%)

---

## 🧪 Cómo Probar lo Implementado

### 1. Probar Interpretación Natal Limpia

```bash
# Solicitar interpretación natal
curl -X POST http://localhost:3000/api/astrology/interpret-natal-complete \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "chartData": {...},
    "userProfile": {...}
  }'

# Verificar que NO incluye rituales ni mantras
# Verificar estructura CartaNatalLimpia
```

### 2. Probar Comparaciones SR

```bash
# Solicitar interpretación SR
curl -X POST http://localhost:3000/api/astrology/interpret-solar-return \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "natalChart": {...},
    "solarReturnChart": {...},
    "userProfile": {...},
    "returnYear": 2025
  }'

# Verificar que incluye comparaciones_planetarias
# Verificar que usa interpretaciones natales
# Verificar 4 partes obligatorias en cada comparación
```

### 3. Probar Generador de Kits (Node)

```typescript
import { generarKitDelMes } from '@/services/kitGenerator';

const comparacion: ComparacionPlanetaria = {
  natal: {
    posicion: "Marte en Tauro Casa 2",
    descripcion: "Actúas con paciencia..."
  },
  solar_return: {
    posicion: "Marte en Acuario Casa 11",
    descripcion: "Debes actuar rápido..."
  },
  choque: "Normalmente esperas...",
  que_hacer: "No pospongas decisiones...",
  uso_agenda: {
    luna_nueva: "Inicia acciones...",
    luna_llena: "Revisa si estás evitando...",
    retrogradaciones: "Pausa antes de decidir..."
  },
  error_automatico: "Esperar el momento perfecto",
  frase_clave: "Decido con lo que tengo"
};

const kit = generarKitDelMes(comparacion, 'Marte', 'Enero 2025');
console.log(JSON.stringify(kit, null, 2));

// Verificar que incluye vela, piedra, micro_ritual
```

---

## 📚 Recursos y Referencias

### Documentación Creada
1. `ARQUITECTURA_3_CAPAS.md` - Visión general del sistema
2. `COMPARACIONES_PLANETARIAS_3_CAPAS.md` - Sistema de comparaciones
3. `OBJETOS_SIMBOLICOS_Y_TIENDA.md` - Objetos simbólicos y tienda
4. `ACTUALIZACION_NATAL_LIMPIA.md` - Cambios en interpretación natal

### Archivos Clave
- Prompts: `src/utils/prompts/solarReturnPrompts_v2.ts`
- Servicios: `src/services/kitGenerator.ts`
- Tipos: `src/types/astrology/interpretation.ts`
- Componentes: `src/components/solar-return/SolarReturnPlanetDrawer.tsx`

### Commits Relevantes
- `7786a57` - Sistema de comparaciones planetarias Natal vs SR
- (Próximo) - Integración frontend + drawer SR
- (Futuro) - Sistema de Agenda + Kits mensuales

---

## 🎓 Principios a Mantener

### 1. Separación de Capas
- Natal = Identidad (SIN temporalidad)
- SR = Activación (CON comparación)
- Agenda = Práctica (CON timing)

### 2. Personalización Real
- SIEMPRE basado en datos astronómicos reales
- NUNCA consejos genéricos
- Comparaciones específicas de casas/signos

### 3. Objetos Simbólicos
- NO son magia
- SÍ son anclajes conductuales
- Prometen ENFOQUE, no resultados externos

### 4. Escalabilidad
- Diseñar pensando en tienda futura
- Kits fácilmente replicables
- Estructura de datos clara

---

**Última actualización**: 2025-12-25
**Branch**: `claude/fix-solar-return-endpoints-vLCCr`
**Próximo commit**: Frontend integration + Agenda foundation
