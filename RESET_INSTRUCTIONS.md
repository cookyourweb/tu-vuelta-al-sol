# 🔄 Cómo Resetear Interpretaciones Cacheadas

## Problema
Estás viendo interpretaciones VIEJAS de MongoDB que mezclan múltiples formatos incorrectamente.

## Solución

### Opción 1: Reset vía API (Recomendado)

**Paso 1:** Inicia el servidor de desarrollo
```bash
npm run dev
```

**Paso 2:** En otra terminal, ejecuta el reset
```bash
# Reset solo Solar Return
node scripts/reset-via-api.js solar-return

# Reset solo Natal Chart
node scripts/reset-via-api.js natal

# Reset TODO
node scripts/reset-via-api.js all
```

### Opción 2: Reset vía Script Bash
```bash
# Asegúrate que el dev server está corriendo
npm run dev

# En otra terminal
./scripts/reset-via-api.sh
```

### Opción 3: Reset Manual vía cURL

```bash
# Reset Solar Return
curl -X POST "http://localhost:3000/api/admin/reset-interpretations" \
  -H "Content-Type: application/json" \
  -d '{"chartType":"solar-return"}'

# Reset Natal
curl -X POST "http://localhost:3000/api/admin/reset-interpretations" \
  -H "Content-Type: application/json" \
  -d '{"chartType":"natal"}'
```

## Qué Pasa Después del Reset

1. **Interpretaciones viejas borradas** de MongoDB
2. **Próxima generación** usará la estructura NUEVA:
   - **Natal**: 4 secciones (Esencia Personal, Formación Temprana, Nodos, Síntesis)
   - **Solar Return**: comparaciones_planetarias (7 planetas comparados natal vs SR)

## Verificación

Después del reset, al generar una nueva interpretación deberías ver:

### ✅ Natal Chart (ya funciona)
```
Tu Esencia Natal
1️⃣ ESENCIA PERSONAL (Cómo funcionas en el día a día)
  - ☀️ Sol
  - 🌙 Luna
  - ⬆️ Ascendente
  - 🗣️ Mercurio
  - 💕 Venus
  - 🔥 Marte
  - 🌱 Júpiter
  - 🪐 Saturno

2️⃣ FORMACIÓN TEMPRANA (Por qué eres así emocionalmente)
  - 🌙 Formación Lunar
  - 🪐 Formación Saturnina
  - 💕 Formación Venusina

3️⃣ NODOS LUNARES (Hacia dónde creces)
  - ⬇️ Nodo Sur
  - ⬆️ Nodo Norte

4️⃣ SÍNTESIS FINAL (Todo integrado)
```

### ✅ Solar Return (después del reset)
```
📅 Tu Año Solar 2025-2026

🌟 Comparaciones Planetarias
  Para cada planeta (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno):
  - Natal: Cómo eres normalmente
  - Solar Return: Cómo se activa este año
  - Choque: La tensión entre ambos
  - Qué hacer: Acción práctica para la Agenda

🌙 Calendario Lunar Anual

📅 Eventos Clave del Año
```

## Troubleshooting

**Error: "Cannot connect to server"**
- Asegúrate que `npm run dev` está corriendo en http://localhost:3000

**Error: "MONGODB_URI not found"**
- Verifica que tienes configurado `.env.local` con tu conexión a MongoDB

**Error: "fetch is not defined"**
- Actualiza Node.js a v18+ o usa el script bash en su lugar
