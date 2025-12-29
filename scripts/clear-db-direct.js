// Script para borrar TODAS las colecciones de MongoDB
// Usa la configuración directamente del código

const mongoose = require('mongoose');

async function clearAllCollections() {
  try {
    // Intentar obtener MONGODB_URI de diferentes fuentes
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('⚠️  MONGODB_URI no encontrada en variables de entorno');
      console.log('📝 Por favor, pega la URI de MongoDB aquí o presiona Ctrl+C para cancelar');
      console.log('\nEjemplo: mongodb+srv://user:password@cluster.mongodb.net/dbname');
      process.exit(1);
    }

    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log('\n✅ La base de datos ya está vacía');
      process.exit(0);
    }

    console.log('\n📋 Colecciones encontradas:');
    let totalDocs = 0;
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      totalDocs += count;
      console.log(`  - ${collection.name}: ${count} documentos`);
    }

    console.log(`\n📊 Total: ${collections.length} colecciones, ${totalDocs} documentos`);
    console.log('\n⚠️  BORRANDO TODAS LAS COLECCIONES...\n');

    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`✅ Borrada: ${collection.name}`);
    }

    console.log('\n🎉 ¡MongoDB limpia! Todas las colecciones eliminadas.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Consejo: Verifica que las credenciales de MongoDB sean correctas');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

clearAllCollections();
