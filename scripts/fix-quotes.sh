#!/bin/bash
# Script para arreglar comillas en archivos JSX/TSX

echo "🔍 Buscando archivos con comillas problemáticas..."

# Contador
fixed=0

# Buscar y procesar archivos .tsx y .jsx
find src -name "*.tsx" -o -name "*.jsx" | while read file; do
    echo "📝 Procesando: $file"
    
    # Crear backup
    cp "$file" "$file.backup"
    
    # Buscar líneas con comillas problemáticas y mostrarlas
    if grep -n '"' "$file" > /dev/null; then
        echo "  → Encontradas comillas en: $file"
        
        # Reemplazar comillas en contenido JSX
        # Patrón: texto entre > y < que contenga comillas
        sed -i.tmp 's/>\([^<]*\)"\([^<]*\)</>\1\&quot;\2</g' "$file"
        
        # Limpiar archivo temporal
        rm -f "$file.tmp"
        
        echo "  ✅ Corregido: $file"
        ((fixed++))
    else
        # No hay comillas, eliminar backup
        rm "$file.backup"
        echo "  ℹ️ Sin comillas: $file"
    fi
done

echo ""
echo "✅ Proceso completado. Archivos corregidos: $fixed"
echo "🧪 Ahora ejecuta: npm run build"
