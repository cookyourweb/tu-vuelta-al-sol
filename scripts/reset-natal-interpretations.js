/**
 * Script para borrar interpretaciones viejas de Carta Natal
 * Esto forzará la regeneración con el nuevo sistema clean pedagógico
 *
 * USAGE:
 * node scripts/reset-natal-interpretations.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function resetNatalInterpretations() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Error: MONGODB_URI no encontrado en .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db();
    const collection = db.collection('interpretations_complete');

    // Contar interpretaciones de Natal antes de borrar
    const countBefore = await collection.countDocuments({ chartType: 'natal' });
    console.log(`📊 Interpretaciones de Carta Natal encontradas: ${countBefore}`);

    if (countBefore === 0) {
      console.log('ℹ️  No hay interpretaciones de Carta Natal para borrar');
      return;
    }

    // Borrar SOLO interpretaciones de Carta Natal
    const result = await collection.deleteMany({ chartType: 'natal' });

    console.log(`✅ ${result.deletedCount} interpretaciones de Carta Natal borradas`);
    console.log('🔄 La próxima vez que generes una Carta Natal, usará el nuevo sistema pedagógico:');
    console.log('   - Esencia Natal');
    console.log('   - ☀️ Tu Propósito de Vida (Sol)');
    console.log('   - 🌙 Tu Mundo Emocional (Luna)');
    console.log('   - ⬆️ Tu Personalidad Visible (Ascendente)');
    console.log('   - 🗣️ Cómo piensas (Mercurio)');
    console.log('   - 💕 Cómo amas (Venus)');
    console.log('   - 🔥 Cómo actúas (Marte)');
    console.log('   - + Planetas transpersonales y Nodos Lunares');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Desconectado de MongoDB');
  }
}

resetNatalInterpretations();
