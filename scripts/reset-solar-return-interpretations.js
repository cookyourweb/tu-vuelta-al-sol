/**
 * Script para borrar interpretaciones viejas de Solar Return
 * Esto forzará la regeneración con el nuevo sistema de comparaciones planetarias
 *
 * USAGE:
 * node scripts/reset-solar-return-interpretations.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function resetSolarReturnInterpretations() {
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

    // Contar interpretaciones de Solar Return antes de borrar
    const countBefore = await collection.countDocuments({ chartType: 'solar-return' });
    console.log(`📊 Interpretaciones de Solar Return encontradas: ${countBefore}`);

    if (countBefore === 0) {
      console.log('ℹ️  No hay interpretaciones de Solar Return para borrar');
      return;
    }

    // Borrar SOLO interpretaciones de Solar Return
    const result = await collection.deleteMany({ chartType: 'solar-return' });

    console.log(`✅ ${result.deletedCount} interpretaciones de Solar Return borradas`);
    console.log('🔄 La próxima vez que generes una Solar Return, usará el nuevo sistema con comparaciones planetarias');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Desconectado de MongoDB');
  }
}

resetSolarReturnInterpretations();
