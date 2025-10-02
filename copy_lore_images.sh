#!/bin/bash

# Script para copiar las imágenes del lore al directorio público
# Las imágenes deben estar guardadas como:
# - alvae-symbol.jpg (imagen 1)
# - cyberpunk-street.jpg (imagen 2) 
# - resistance-concert.jpg (imagen 3)
# - cyberpunk-city.jpg (imagen 4)
# - la-terminal.jpg (imagen 5)
# - ghost-studio.jpg (imagen 6)
# - nova-character.jpg (imagen 7)
# - bella-exe.jpg (imagen 8)
# - cipher-noctis.jpg (imagen 9)
# - characters-grid.jpg (imagen 10)
# - the-archive.jpg (imagen 11)
# - dead-zone.jpg (imagen 12)

echo "🎨 Copiando imágenes del lore de Son1kVers3..."

# Crear directorio si no existe
mkdir -p frontend/public/images/lore

# Crear imagen placeholder SVG para testing
cat > frontend/public/images/lore/placeholder.svg << 'EOF'
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#1a2333"/>
  <circle cx="200" cy="150" r="50" fill="none" stroke="#00FFE7" stroke-width="2"/>
  <polygon points="200,110 170,180 230,180" fill="none" stroke="#00FFE7" stroke-width="2"/>
  <circle cx="200" cy="150" r="15" fill="#00FFE7"/>
  <text x="200" y="250" text-anchor="middle" fill="#00FFE7" font-family="monospace" font-size="12">Son1kVers3 Lore</text>
</svg>
EOF

# Crear placeholders para todas las imágenes
images=(
  "alvae-symbol"
  "cyberpunk-street"
  "resistance-concert" 
  "cyberpunk-city"
  "la-terminal"
  "ghost-studio"
  "nova-character"
  "bella-exe"
  "cipher-noctis"
  "characters-grid"
  "the-archive"
  "dead-zone"
)

for img in "${images[@]}"; do
  if [ ! -f "frontend/public/images/lore/${img}.jpg" ]; then
    # Crear placeholder SVG específico para cada imagen
    cat > "frontend/public/images/lore/${img}.jpg" << EOF
<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#1a2333"/>
  <circle cx="200" cy="150" r="50" fill="none" stroke="#00FFE7" stroke-width="2"/>
  <polygon points="200,110 170,180 230,180" fill="none" stroke="#00FFE7" stroke-width="2"/>
  <circle cx="200" cy="150" r="15" fill="#00FFE7"/>
  <text x="200" y="200" text-anchor="middle" fill="#00FFE7" font-family="monospace" font-size="14">${img}</text>
  <text x="200" y="250" text-anchor="middle" fill="#888" font-family="monospace" font-size="10">Son1kVers3 Lore Image</text>
</svg>
EOF
    echo "📄 Creado placeholder para: ${img}.jpg"
  fi
done

echo "✅ Imágenes del lore preparadas!"
echo ""
echo "📋 Para usar las imágenes reales:"
echo "1. Guarda cada imagen con el nombre correspondiente en frontend/public/images/lore/"
echo "2. Las imágenes se cargarán automáticamente en la galería del lore"
echo "3. Accede a la galería desde el botón 🎨 en el modo Nexus"
echo ""
echo "🎮 Modo Nexus actualizado con:"
echo "  👁️  Símbolo ALVAE interactivo en el header"
echo "  🎨 Galería del lore completa con todas las locaciones"
echo "  🎭 Personajes del universo Son1kVers3"
echo "  🏛️ Locaciones: La Terminal, Ghost Studio, The Archive, Dead Zone"
echo "  ⚡ Easter eggs y efectos especiales"
