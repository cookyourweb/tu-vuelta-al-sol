#!/bin/bash
# Script para reiniciar el servidor limpiando caché de Next.js

echo "🧹 Limpiando caché de Next.js..."
rm -rf .next

echo "✅ Caché limpiado"
echo ""
echo "▶️  Ahora ejecuta: npm run dev"
echo ""
echo "📝 Después de reiniciar:"
echo "   1. Ve a /agenda"
echo "   2. Genera el ciclo 2025-2026"
echo "   3. Espera a que termine"
echo "   4. Abre 'Ver Agenda Libro'"
