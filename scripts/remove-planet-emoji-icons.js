/**
 * Remove emoji repetition from planet titles in InterpretationButton
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/astrology/InterpretationButton.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove emojis from planet titles - keep only text
const replacements = [
  ['☀️ {data.sol.titulo || \'Tu Propósito de Vida\'}', '{data.sol.titulo || \'Tu Propósito de Vida\'}'],
  ['🌙 {data.luna.titulo || \'Tus Emociones\'}', '{data.luna.titulo || \'Tus Emociones\'}'],
  ['⬆️ {data.ascendente.titulo || \'Tu Personalidad\'}', '{data.ascendente.titulo || \'Tu Personalidad\'}'],
  ['🗣️ {data.mercurio.titulo || \'Cómo Piensas y Cómo Hablas\'}', '{data.mercurio.titulo || \'Cómo Piensas y Cómo Hablas\'}'],
  ['💕 {data.venus.titulo || \'Cómo Amas\'}', '{data.venus.titulo || \'Cómo Amas\'}'],
  ['🔥 {data.marte.titulo || \'Cómo Enfrentas la Vida\'}', '{data.marte.titulo || \'Cómo Enfrentas la Vida\'}'],
  ['🌱 {data.jupiter.titulo || \'Tu Suerte y Tus Ganancias\'}', '{data.jupiter.titulo || \'Tu Suerte y Tus Ganancias\'}'],
  ['🪐 {data.saturno.titulo || \'Tu Karma y Responsabilidades\'}', '{data.saturno.titulo || \'Tu Karma y Responsabilidades\'}']
];

let changes = 0;
replacements.forEach(([from, to]) => {
  const before = content;
  content = content.replace(from, to);
  if (before !== content) changes++;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ Removed ${changes} emoji icons from planet titles`);
console.log('✅ Headers with numbers (1️⃣, 2️⃣, 3️⃣, 4️⃣) kept as visual guides');
