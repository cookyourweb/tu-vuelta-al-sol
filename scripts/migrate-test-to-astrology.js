// scripts/migrate-test-to-astrology.js
// Migra todas las colecciones de 'test' → 'astrology'

const { MongoClient } = require('mongodb');

// Tu URI de MongoDB (sin nombre de base de datos al final)
const MONGODB_URI = 'mongodb+srv://wunjo:hALT8ATrwt76aXpL@cluster0.v22xl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Nombres de bases de datos
const SOURCE_DB = 'test';
const TARGET_DB = 'astrology';

// Colecciones a migrar
const COLLECTIONS_TO_MIGRATE = ['users', 'birthdatas', 'charts'];

async function migrateDatabase() {
  let client;
  
  try {
    console.log('🚀 Iniciando migración de MongoDB...\n');
    
    // Conectar a MongoDB
    console.log('📡 Conectando a MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado exitosamente\n');
    
    const sourceDb = client.db(SOURCE_DB);
    const targetDb = client.db(TARGET_DB);
    
    // Verificar que la base source existe
    const sourceDatabases = await client.db().admin().listDatabases();
    const sourceExists = sourceDatabases.databases.find(db => db.name === SOURCE_DB);
    
    if (!sourceExists) {
      console.error(`❌ ERROR: La base de datos "${SOURCE_DB}" no existe.`);
      return;
    }
    
    console.log(`📊 Base de datos origen: ${SOURCE_DB}`);
    console.log(`🎯 Base de datos destino: ${TARGET_DB}\n`);
    
    // Resumen antes de migrar
    console.log('📋 RESUMEN DE DATOS A MIGRAR:');
    console.log('━'.repeat(60));
    
    const summary = [];
    
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      const sourceCollection = sourceDb.collection(collectionName);
      const count = await sourceCollection.countDocuments();
      
      console.log(`   ${collectionName}: ${count} documentos`);
      summary.push({ name: collectionName, count });
    }
    
    console.log('━'.repeat(60));
    console.log('');
    
    // Confirmar migración
    console.log('⚠️  IMPORTANTE: Esta operación copiará los datos a "astrology".');
    console.log('   La base "test" NO se eliminará automáticamente (seguridad).\n');
    
    // Migrar cada colección
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      console.log(`\n🔄 Migrando colección: ${collectionName}`);
      console.log('─'.repeat(60));
      
      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);
      
      // Obtener todos los documentos
      const documents = await sourceCollection.find({}).toArray();
      
      if (documents.length === 0) {
        console.log(`   ⚠️  Colección vacía, omitiendo...`);
        continue;
      }
      
      console.log(`   📥 Obtenidos ${documents.length} documentos de "${SOURCE_DB}"`);
      
      // Verificar si ya existen datos en target
      const existingCount = await targetCollection.countDocuments();
      
      if (existingCount > 0) {
        console.log(`   ⚠️  Ya existen ${existingCount} documentos en "${TARGET_DB}.${collectionName}"`);
        console.log(`   🔄 Insertando documentos adicionales (sin eliminar existentes)...`);
      }
      
      // Insertar en target
      const result = await targetCollection.insertMany(documents, { ordered: false });
      console.log(`   ✅ Insertados ${result.insertedCount} documentos en "${TARGET_DB}"`);
      
      // Verificar
      const finalCount = await targetCollection.countDocuments();
      console.log(`   ✓ Total en "${TARGET_DB}.${collectionName}": ${finalCount} documentos`);
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ MIGRACIÓN COMPLETADA EXITOSAMENTE');
    console.log('═'.repeat(60));
    
    // Verificación final
    console.log('\n📊 VERIFICACIÓN FINAL:');
    console.log('━'.repeat(60));
    
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      const sourceCount = await sourceDb.collection(collectionName).countDocuments();
      const targetCount = await targetDb.collection(collectionName).countDocuments();
      
      const status = targetCount >= sourceCount ? '✅' : '❌';
      console.log(`   ${status} ${collectionName}:`);
      console.log(`      ${SOURCE_DB}: ${sourceCount} docs`);
      console.log(`      ${TARGET_DB}: ${targetCount} docs`);
    }
    
    console.log('━'.repeat(60));
    
    console.log('\n📌 PRÓXIMOS PASOS:');
    console.log('   1. Verifica los datos en MongoDB Atlas UI');
    console.log('   2. Actualiza tu .env con:');
    console.log(`      MONGODB_URI=...@cluster0.v22xl.mongodb.net/astrology?retryWrites=true&w=majority`);
    console.log('   3. Reinicia tu aplicación');
    console.log('   4. Prueba que todo funciona correctamente');
    console.log('   5. Cuando estés 100% seguro, elimina la base "test" manualmente desde Atlas UI\n');
    
    console.log('⚠️  RECORDATORIO: La base "test" NO fue eliminada automáticamente por seguridad.');
    console.log('   Elimínala manualmente desde MongoDB Atlas cuando estés seguro.\n');
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA MIGRACIÓN:');
    console.error(error);
    console.log('\n🔄 No se realizaron cambios destructivos. Tus datos en "test" están intactos.');
  } finally {
    if (client) {
      await client.close();
      console.log('\n📡 Conexión cerrada.');
    }
  }
}

// Ejecutar
migrateDatabase();