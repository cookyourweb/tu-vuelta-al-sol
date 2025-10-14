// scripts/manage-cache.js
// 🛠️ SCRIPT COMPLETO PARA GESTIONAR CACHÉ DE MONGODB

require('dotenv').config();
const mongoose = require('mongoose');

// 📊 FUNCIONES DE GESTIÓN DE CACHÉ

async function showStats() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado exitosamente');

    const collections = ['user_agenda_cache', 'charts', 'cache', 'birthdatas'];
    console.log('\n📊 ESTADÍSTICAS DE COLECCIONES:');

    for (const collectionName of collections) {
      try {
        const count = await mongoose.connection.collection(collectionName).countDocuments();
        const sample = await mongoose.connection.collection(collectionName).findOne({}, { projection: { _id: 1, userId: 1, createdAt: 1, updatedAt: 1 } });

        console.log(`📁 ${collectionName}:`);
        console.log(`   📊 Documentos: ${count}`);
        if (sample) {
          console.log(`   👤 Ejemplo: userId=${sample.userId || 'N/A'}, _id=${sample._id}`);
          if (sample.createdAt) console.log(`   📅 Creado: ${sample.createdAt}`);
        }
        console.log('');
      } catch (error) {
        console.log(`⚠️ Colección ${collectionName}: no existe o error (${error.message})\n`);
      }
    }

    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');

  } catch (error) {
    console.error('❌ Error en showStats:', error);
  }
}

async function clearCache(collections = ['user_agenda_cache', 'charts', 'cache']) {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado exitosamente');

    console.log('\n🗑️ LIMPIANDO CACHÉ...');
    let totalDeleted = 0;

    for (const collectionName of collections) {
      try {
        const countBefore = await mongoose.connection.collection(collectionName).countDocuments();
        const result = await mongoose.connection.collection(collectionName).deleteMany({});
        console.log(`✅ ${collectionName}: ${countBefore} → 0 documentos (eliminados: ${result.deletedCount})`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.log(`⚠️ Error limpiando ${collectionName}: ${error.message}`);
      }
    }

    await mongoose.connection.close();
    console.log(`\n🎉 ¡Caché limpiado! Total eliminados: ${totalDeleted} documentos`);

  } catch (error) {
    console.error('❌ Error en clearCache:', error);
  }
}

async function clearUserCache(userId) {
  if (!userId) {
    console.error('❌ Se requiere userId. Uso: node scripts/manage-cache.js clear-user <userId>');
    return;
  }

  try {
    console.log(`🔗 Conectando a MongoDB para usuario: ${userId}...`);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado exitosamente');

    const collections = ['user_agenda_cache', 'charts'];
    let totalDeleted = 0;

    for (const collectionName of collections) {
      try {
        const result = await mongoose.connection.collection(collectionName).deleteMany({ userId });
        console.log(`✅ ${collectionName}: eliminados ${result.deletedCount} documentos para userId=${userId}`);
        totalDeleted += result.deletedCount;
      } catch (error) {
        console.log(`⚠️ Error limpiando ${collectionName}: ${error.message}`);
      }
    }

    await mongoose.connection.close();
    console.log(`\n🎉 ¡Caché de usuario limpiado! Total eliminados: ${totalDeleted} documentos`);

  } catch (error) {
    console.error('❌ Error en clearUserCache:', error);
  }
}

async function testConnection() {
  try {
    console.log('🔗 Probando conexión a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexión exitosa');

    // Verificar estado
    console.log(`📊 Estado: ${mongoose.connection.readyState} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
    console.log(`🗄️ Base de datos: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);

    await mongoose.connection.close();
    console.log('✅ Conexión cerrada correctamente');

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// 🎯 FUNCIÓN PRINCIPAL
async function main() {
  const command = process.argv[2];
  const param = process.argv[3];

  console.log('🛠️ GESTOR DE CACHÉ MONGODB\n');

  switch (command) {
    case 'stats':
      await showStats();
      break;

    case 'clear':
      await clearCache();
      break;

    case 'clear-user':
      await clearUserCache(param);
      break;

    case 'test':
      await testConnection();
      break;

    default:
      console.log('📖 USO:');
      console.log('  node scripts/manage-cache.js stats          # Ver estadísticas');
      console.log('  node scripts/manage-cache.js clear          # Limpiar todo el caché');
      console.log('  node scripts/manage-cache.js clear-user <userId>  # Limpiar caché de usuario específico');
      console.log('  node scripts/manage-cache.js test           # Probar conexión');
      console.log('\n📁 Colecciones afectadas: user_agenda_cache, charts, cache');
      break;
  }
}

// 🚀 EJECUTAR SI SE LLAMA DIRECTAMENTE
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { showStats, clearCache, clearUserCache, testConnection };
