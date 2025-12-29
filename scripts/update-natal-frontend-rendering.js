/**
 * Script to update InterpretationButton.tsx with new Natal Chart rendering
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/astrology/InterpretationButton.tsx');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Find the start and end of the NATAL CHART CLEAN STRUCTURE block
const startMarker = '{/* ✅ NATAL CHART: CLEAN STRUCTURE (New pedagogical format) */}';
const endMarker = '{/* ✅ OLD DISRUPTIVE STRUCTURE (fallback for old interpretations) */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('❌ Could not find markers in file');
  process.exit(1);
}

console.log(`✅ Found block at lines ${startIndex} to ${endIndex}`);

// New rendering code
const newBlock = `{/* ✅ NATAL CHART: CLEAN STRUCTURE (New pedagogical format) */}
        {type === 'natal' && data.esencia_natal && (
          <>
            {/* Introducción: Esencia Natal */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-400/30">
              <h4 className="text-purple-100 font-bold text-2xl mb-4">
                {data.esencia_natal.titulo || 'Tu Esencia Natal'}
              </h4>
              <p className="text-purple-50 text-lg leading-relaxed">
                {extractTextFromTooltipDrawer(data.esencia_natal.descripcion || data.esencia_natal)}
              </p>
            </div>

            {/* 1️⃣ ESENCIA PERSONAL */}
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 rounded-2xl p-6 border border-slate-400/30">
              <h3 className="text-slate-100 font-bold text-3xl mb-2 text-center">1️⃣ ESENCIA PERSONAL</h3>
              <p className="text-slate-300 text-center text-sm mb-6 italic">Cómo funcionas en el día a día</p>
            </div>

            {/* Sol */}
            {data.sol && (
              <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-2xl p-8 border border-yellow-400/30">
                <h4 className="text-yellow-100 font-bold text-2xl mb-2">☀️ {data.sol.titulo || 'Tu Propósito de Vida'}</h4>
                {data.sol.posicion && <p className="text-yellow-300 text-sm font-mono mb-2">📍 {data.sol.posicion}</p>}
                {data.sol.que_significa_casa && <p className="text-yellow-200 text-sm italic mb-4">💡 {data.sol.que_significa_casa}</p>}
                <p className="text-yellow-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.sol.interpretacion || data.sol)}</p>
                {data.sol.palabra_clave && (
                  <div className="bg-yellow-800/30 rounded-lg p-3 mt-3">
                    <p className="text-yellow-200 text-sm font-semibold">Palabra clave: {data.sol.palabra_clave}</p>
                  </div>
                )}
              </div>
            )}

            {/* Luna */}
            {data.luna && (
              <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl p-8 border border-blue-400/30">
                <h4 className="text-blue-100 font-bold text-2xl mb-2">🌙 {data.luna.titulo || 'Tus Emociones'}</h4>
                {data.luna.posicion && <p className="text-blue-300 text-sm font-mono mb-2">📍 {data.luna.posicion}</p>}
                {data.luna.que_significa_casa && <p className="text-blue-200 text-sm italic mb-4">💡 {data.luna.que_significa_casa}</p>}
                <p className="text-blue-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.luna.interpretacion || data.luna)}</p>
                {data.luna.necesidad_emocional && (
                  <div className="bg-blue-800/30 rounded-lg p-3 mt-3">
                    <p className="text-blue-200 text-sm"><strong>Necesidad emocional:</strong> {data.luna.necesidad_emocional}</p>
                  </div>
                )}
              </div>
            )}

            {/* Ascendente */}
            {data.ascendente && (
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl p-8 border border-green-400/30">
                <h4 className="text-green-100 font-bold text-2xl mb-2">⬆️ {data.ascendente.titulo || 'Tu Personalidad'}</h4>
                {data.ascendente.posicion && <p className="text-green-300 text-sm font-mono mb-4">📍 {data.ascendente.posicion}</p>}
                <p className="text-green-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.ascendente.interpretacion || data.ascendente)}</p>
                {data.ascendente.primera_impresion && (
                  <div className="bg-green-800/30 rounded-lg p-3 mt-3">
                    <p className="text-green-200 text-sm"><strong>Primera impresión:</strong> {data.ascendente.primera_impresion}</p>
                  </div>
                )}
              </div>
            )}

            {/* Mercurio */}
            {data.mercurio && (
              <div className="bg-gradient-to-br from-cyan-900/40 to-sky-900/40 rounded-2xl p-8 border border-cyan-400/30">
                <h4 className="text-cyan-100 font-bold text-2xl mb-2">🗣️ {data.mercurio.titulo || 'Cómo Piensas y Cómo Hablas'}</h4>
                {data.mercurio.posicion && <p className="text-cyan-300 text-sm font-mono mb-2">📍 {data.mercurio.posicion}</p>}
                {data.mercurio.que_significa_casa && <p className="text-cyan-200 text-sm italic mb-4">💡 {data.mercurio.que_significa_casa}</p>}
                <p className="text-cyan-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.mercurio.interpretacion || data.mercurio)}</p>
                {data.mercurio.estilo_mental && (
                  <div className="bg-cyan-800/30 rounded-lg p-3 mt-3">
                    <p className="text-cyan-200 text-sm"><strong>Estilo mental:</strong> {data.mercurio.estilo_mental}</p>
                  </div>
                )}
              </div>
            )}

            {/* Venus */}
            {data.venus && (
              <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 rounded-2xl p-8 border border-pink-400/30">
                <h4 className="text-pink-100 font-bold text-2xl mb-2">💕 {data.venus.titulo || 'Cómo Amas'}</h4>
                {data.venus.posicion && <p className="text-pink-300 text-sm font-mono mb-2">📍 {data.venus.posicion}</p>}
                {data.venus.que_significa_casa && <p className="text-pink-200 text-sm italic mb-4">💡 {data.venus.que_significa_casa}</p>}
                <p className="text-pink-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.venus.interpretacion || data.venus)}</p>
                {data.venus.lenguaje_amor && (
                  <div className="bg-pink-800/30 rounded-lg p-3 mt-3">
                    <p className="text-pink-200 text-sm"><strong>Lenguaje de amor:</strong> {data.venus.lenguaje_amor}</p>
                  </div>
                )}
              </div>
            )}

            {/* Marte */}
            {data.marte && (
              <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 rounded-2xl p-8 border border-red-400/30">
                <h4 className="text-red-100 font-bold text-2xl mb-2">🔥 {data.marte.titulo || 'Cómo Enfrentas la Vida'}</h4>
                {data.marte.posicion && <p className="text-red-300 text-sm font-mono mb-2">📍 {data.marte.posicion}</p>}
                {data.marte.que_significa_casa && <p className="text-red-200 text-sm italic mb-4">💡 {data.marte.que_significa_casa}</p>}
                <p className="text-red-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.marte.interpretacion || data.marte)}</p>
                {data.marte.estilo_accion && (
                  <div className="bg-red-800/30 rounded-lg p-3 mt-3">
                    <p className="text-red-200 text-sm"><strong>Estilo de acción:</strong> {data.marte.estilo_accion}</p>
                  </div>
                )}
              </div>
            )}

            {/* Júpiter */}
            {data.jupiter && (
              <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 rounded-2xl p-8 border border-purple-400/30">
                <h4 className="text-purple-100 font-bold text-2xl mb-2">🌱 {data.jupiter.titulo || 'Tu Suerte y Tus Ganancias'}</h4>
                {data.jupiter.posicion && <p className="text-purple-300 text-sm font-mono mb-2">📍 {data.jupiter.posicion}</p>}
                {data.jupiter.que_significa_casa && <p className="text-purple-200 text-sm italic mb-4">💡 {data.jupiter.que_significa_casa}</p>}
                <p className="text-purple-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.jupiter.interpretacion || data.jupiter)}</p>
                {data.jupiter.zona_abundancia && (
                  <div className="bg-purple-800/30 rounded-lg p-3 mt-3">
                    <p className="text-purple-200 text-sm"><strong>Zona de abundancia:</strong> {data.jupiter.zona_abundancia}</p>
                  </div>
                )}
              </div>
            )}

            {/* Saturno */}
            {data.saturno && (
              <div className="bg-gradient-to-br from-gray-900/40 to-slate-900/40 rounded-2xl p-8 border border-gray-400/30">
                <h4 className="text-gray-100 font-bold text-2xl mb-2">🪐 {data.saturno.titulo || 'Tu Karma y Responsabilidades'}</h4>
                {data.saturno.posicion && <p className="text-gray-300 text-sm font-mono mb-2">📍 {data.saturno.posicion}</p>}
                {data.saturno.que_significa_casa && <p className="text-gray-200 text-sm italic mb-4">💡 {data.saturno.que_significa_casa}</p>}
                <p className="text-gray-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.saturno.interpretacion || data.saturno)}</p>
                {data.saturno.leccion_principal && (
                  <div className="bg-gray-800/30 rounded-lg p-3 mt-3">
                    <p className="text-gray-200 text-sm"><strong>Lección principal:</strong> {data.saturno.leccion_principal}</p>
                  </div>
                )}
              </div>
            )}

            {/* 2️⃣ FORMACIÓN TEMPRANA */}
            {data.formacion_temprana && (
              <>
                <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 rounded-2xl p-6 border border-slate-400/30 mt-8">
                  <h3 className="text-slate-100 font-bold text-3xl mb-2 text-center">2️⃣ FORMACIÓN TEMPRANA</h3>
                  <p className="text-slate-300 text-center text-sm italic">Por qué eres así emocionalmente</p>
                </div>

                {/* Formación Lunar */}
                {data.formacion_temprana.lunar && (
                  <div className="bg-gradient-to-br from-blue-800/40 to-indigo-800/40 rounded-2xl p-8 border border-blue-400/30">
                    <h4 className="text-blue-100 font-bold text-2xl mb-1">{data.formacion_temprana.lunar.titulo || '🌙 Formación Lunar'}</h4>
                    <p className="text-blue-300 text-sm italic mb-4">{data.formacion_temprana.lunar.subtitulo || 'Cómo aprendiste a sentir y protegerte'}</p>
                    <p className="text-blue-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.formacion_temprana.lunar.interpretacion)}</p>
                    {data.formacion_temprana.lunar.aprendizaje_clave && (
                      <div className="bg-blue-900/30 rounded-lg p-3 mt-3">
                        <p className="text-blue-200 text-sm"><strong>Aprendizaje clave:</strong> {data.formacion_temprana.lunar.aprendizaje_clave}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Formación Saturnina */}
                {data.formacion_temprana.saturnina && (
                  <div className="bg-gradient-to-br from-gray-800/40 to-slate-800/40 rounded-2xl p-8 border border-gray-400/30">
                    <h4 className="text-gray-100 font-bold text-2xl mb-1">{data.formacion_temprana.saturnina.titulo || '🪐 Formación Saturnina'}</h4>
                    <p className="text-gray-300 text-sm italic mb-4">{data.formacion_temprana.saturnina.subtitulo || 'Las primeras exigencias y límites'}</p>
                    <p className="text-gray-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.formacion_temprana.saturnina.interpretacion)}</p>
                    {data.formacion_temprana.saturnina.leccion_principal && (
                      <div className="bg-gray-900/30 rounded-lg p-3 mt-3">
                        <p className="text-gray-200 text-sm"><strong>Lección principal:</strong> {data.formacion_temprana.saturnina.leccion_principal}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Formación Venusina */}
                {data.formacion_temprana.venusina && (
                  <div className="bg-gradient-to-br from-pink-800/40 to-rose-800/40 rounded-2xl p-8 border border-pink-400/30">
                    <h4 className="text-pink-100 font-bold text-2xl mb-1">{data.formacion_temprana.venusina.titulo || '💕 Formación Venusina'}</h4>
                    <p className="text-pink-300 text-sm italic mb-4">{data.formacion_temprana.venusina.subtitulo || 'Cómo aprendiste a amar y a valorarte'}</p>
                    <p className="text-pink-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.formacion_temprana.venusina.interpretacion)}</p>
                    {data.formacion_temprana.venusina.modelo_afectivo && (
                      <div className="bg-pink-900/30 rounded-lg p-3 mt-3">
                        <p className="text-pink-200 text-sm"><strong>Modelo afectivo:</strong> {data.formacion_temprana.venusina.modelo_afectivo}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 3️⃣ NODOS LUNARES - CAMINO DE VIDA */}
            {(data.nodo_sur || data.nodo_norte) && (
              <>
                <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 rounded-2xl p-6 border border-slate-400/30 mt-8">
                  <h3 className="text-slate-100 font-bold text-3xl mb-2 text-center">3️⃣ NODOS LUNARES - CAMINO DE VIDA</h3>
                  <p className="text-slate-300 text-center text-sm italic">Hacia dónde creces y de dónde vienes</p>
                </div>

                {/* Nodo Sur */}
                {data.nodo_sur && (
                  <div className="bg-gradient-to-br from-amber-800/40 to-yellow-800/40 rounded-2xl p-8 border border-amber-400/30">
                    <h4 className="text-amber-100 font-bold text-2xl mb-1">{data.nodo_sur.titulo || '⬇️ Nodo Sur'}</h4>
                    <p className="text-amber-300 text-sm italic mb-2">{data.nodo_sur.subtitulo || 'Zona cómoda / Talento innato'}</p>
                    {data.nodo_sur.posicion && <p className="text-amber-300 text-sm font-mono mb-4">📍 {data.nodo_sur.posicion}</p>}
                    <p className="text-amber-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.nodo_sur.interpretacion)}</p>
                    {data.nodo_sur.zona_comoda && (
                      <div className="bg-amber-900/30 rounded-lg p-3 mt-3">
                        <p className="text-amber-200 text-sm"><strong>Zona cómoda:</strong> {data.nodo_sur.zona_comoda}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Nodo Norte */}
                {data.nodo_norte && (
                  <div className="bg-gradient-to-br from-green-800/40 to-emerald-800/40 rounded-2xl p-8 border border-green-400/30">
                    <h4 className="text-green-100 font-bold text-2xl mb-1">{data.nodo_norte.titulo || '⬆️ Nodo Norte'}</h4>
                    <p className="text-green-300 text-sm italic mb-2">{data.nodo_norte.subtitulo || 'Dirección evolutiva del alma'}</p>
                    {data.nodo_norte.posicion && <p className="text-green-300 text-sm font-mono mb-4">📍 {data.nodo_norte.posicion}</p>}
                    <p className="text-green-50 leading-relaxed mb-4">{extractTextFromTooltipDrawer(data.nodo_norte.interpretacion)}</p>
                    {data.nodo_norte.direccion_evolutiva && (
                      <div className="bg-green-900/30 rounded-lg p-3 mt-3">
                        <p className="text-green-200 text-sm"><strong>Dirección evolutiva:</strong> {data.nodo_norte.direccion_evolutiva}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 4️⃣ SÍNTESIS FINAL */}
            {data.sintesis_final && (
              <>
                <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 rounded-2xl p-6 border border-slate-400/30 mt-8">
                  <h3 className="text-slate-100 font-bold text-3xl mb-2 text-center">4️⃣ SÍNTESIS FINAL</h3>
                  <p className="text-slate-300 text-center text-sm italic">Todo integrado, sin técnica</p>
                </div>

                <div className="bg-gradient-to-br from-purple-800/60 to-indigo-800/60 rounded-2xl p-8 border border-purple-400/30">
                  <h4 className="text-purple-100 font-bold text-2xl mb-4">{data.sintesis_final.titulo || '✨ Síntesis de Tu Carta Natal'}</h4>
                  <p className="text-purple-50 leading-relaxed text-lg">
                    {extractTextFromTooltipDrawer(data.sintesis_final.contenido || data.sintesis_final)}
                  </p>
                </div>
              </>
            )}
          </>
        )}

        `;

// Replace the block
const before = content.substring(0, startIndex);
const after = content.substring(endIndex);
const newContent = before + newBlock + after;

// Write back to file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('✅ Successfully updated InterpretationButton.tsx');
console.log(`📊 File size: ${newContent.length} bytes`);
