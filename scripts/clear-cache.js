// scripts/clear-cache.js
// 🗑️ SCRIPT PARA LIMPIAR CACHÉ DE MONGODB

require('dotenv').config();
const mongoose = require('mongoose');

async function clearCache() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado exitosamente');

    // 📊 ESTADÍSTICAS ANTES DE LIMPIAR
    const collections = ['user_agenda_cache', 'charts', 'cache'];
    const statsBefore = {};

    for (const collectionName of collections) {
      try {
        const count = await mongoose.connection.collection(collectionName).countDocuments();
        statsBefore[collectionName] = count;
        console.log(`📊 ${collectionName}: ${count} documentos`);
      } catch (error) {
        console.log(`⚠️ Colección ${collectionName} no existe o está vacía`);
        statsBefore[collectionName] = 0;
      }
    }

    // 🗑️ LIMPIAR CACHÉ DE APLICACIÓN
    console.log('\n🗑️ Limpiando caché...');

    let totalDeleted = 0;
    for (const collectionName of collections) {
      try {
        const result = await mongoose.connection.collection(collectionName).deleteMany({});
        console.log(`✅ ${collectionName}: eliminados ${result.deletedCount} documentos`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.log(`⚠️ Error limpiando ${collectionName}: ${error.message}`);
      }
    }

    // 📊 ESTADÍSTICAS DESPUÉS
    console.log('\n📊 Verificación después de limpiar:');
    for (const collectionName of collections) {
      try {
        const count = await mongoose.connection.collection(collectionName).countDocuments();
        console.log(`📊 ${collectionName}: ${count} documentos restantes`);
      } catch (error) {
        console.log(`⚠️ Colección ${collectionName} no accesible`);
      }
    }

    // 🔌 CERRAR CONEXIÓN
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');

    console.log(`\n🎉 ¡Caché limpiado exitosamente! Total eliminados: ${totalDeleted} documentos`);

  } catch (error) {
    console.error('❌ Error en clearCache:', error);
    process.exit(1);
  }
}

// 🚀 EJECUTAR SI SE LLAMA DIRECTAMENTE
if (require.main === module) {
  clearCache();
}

module.exports = { clearCache };
