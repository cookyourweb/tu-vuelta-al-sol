#!/bin/bash

# Script to reset interpretations via API endpoint
# Requires the dev server to be running (npm run dev)

BASE_URL="http://localhost:3000"

echo "🔄 Resetting Solar Return interpretations..."
curl -X POST "$BASE_URL/api/admin/reset-interpretations" \
  -H "Content-Type: application/json" \
  -d '{"chartType":"solar-return"}' | jq '.'

echo ""
echo "🔄 Resetting Natal Chart interpretations..."
curl -X POST "$BASE_URL/api/admin/reset-interpretations" \
  -H "Content-Type: application/json" \
  -d '{"chartType":"natal"}' | jq '.'

echo ""
echo "✅ Done! Next time you generate charts, they will use the new structure."
