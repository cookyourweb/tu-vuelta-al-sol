// Script para borrar TODAS las colecciones de MongoDB
// USO: node scripts/clear-mongodb.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function clearAllCollections() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI no está configurada en .env.local');
      process.exit(1);
    }

    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('\n📋 Colecciones encontradas:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`  - ${collection.name}: ${count} documentos`);
    }

    console.log('\n⚠️  BORRANDO TODAS LAS COLECCIONES...\n');

    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`✅ Borrada: ${collection.name}`);
    }

    console.log('\n🎉 ¡MongoDB limpia! Todas las colecciones eliminadas.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

clearAllCollections();
