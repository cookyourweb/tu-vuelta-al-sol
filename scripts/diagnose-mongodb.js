// scripts/diagnose-mongodb.js - CREAR ESTE ARCHIVO

const { MongoClient } = require('mongodb');

// Configuración - AJUSTAR SEGÚN TU SETUP
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tu-base-datos';
const DB_NAME = process.env.DB_NAME || null; // Usar base de datos por defecto si no se especifica

async function diagnosticarMongoDB() {
  let client;
  
  try {
    console.log('🔍 Conectando a MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = DB_NAME ? client.db(DB_NAME) : client.db(); // Usar base de datos por defecto si no se especifica
    
    // 1. Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Colecciones encontradas:', collections.map(c => c.name));
    
    // 2. Analizar birthdatas
    if (collections.find(c => c.name === 'birthdatas')) {
      const birthCount = await db.collection('birthdatas').countDocuments();
      const sampleBirth = await db.collection('birthdatas').findOne();
      
      console.log('\n👶 BIRTHDATAS:');
      console.log(`   Total documentos: ${birthCount}`);
      console.log(`   Estructura: ${sampleBirth ? Object.keys(sampleBirth).join(', ') : 'Sin documentos'}`);
      
      if (sampleBirth) {
        console.log(`   Ejemplo: userId=${sampleBirth.userId}, uid=${sampleBirth.uid}`);
        
        const withUserId = await db.collection('birthdatas').countDocuments({ userId: { $exists: true } });
        const withUid = await db.collection('birthdatas').countDocuments({ uid: { $exists: true } });
        
        console.log(`   Con userId: ${withUserId}`);
        console.log(`   Con uid: ${withUid}`);
      }
    }
    
    // 3. Analizar charts
    if (collections.find(c => c.name === 'charts')) {
      const chartCount = await db.collection('charts').countDocuments();
      const sampleChart = await db.collection('charts').findOne();
      
      console.log('\n📊 CHARTS:');
      console.log(`   Total documentos: ${chartCount}`);
      console.log(`   Estructura: ${sampleChart ? Object.keys(sampleChart).join(', ') : 'Sin documentos'}`);
      
      if (sampleChart) {
        const withNatal = await db.collection('charts').countDocuments({ natalChart: { $exists: true } });
        const withProgressed = await db.collection('charts').countDocuments({ progressedChart: { $exists: true } });
        const withProgressedArray = await db.collection('charts').countDocuments({ 
          progressedCharts: { $exists: true, $ne: [] } 
        });
        
        console.log(`   Con carta natal: ${withNatal}`);
        console.log(`   Con carta progresada (objeto): ${withProgressed}`);
        console.log(`   Con carta progresada (array): ${withProgressedArray}`);
      }
    }
    
    console.log('\n✅ Diagnóstico completado');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Función para migrar datos
async function migrarDatos(tipo) {
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = DB_NAME ? client.db(DB_NAME) : client.db(); // Usar base de datos por defecto si no se especifica
    
    switch (tipo) {
      case 'add-uid':
        const resultado1 = await db.collection('birthdatas').updateMany(
          { uid: { $exists: false }, userId: { $exists: true } },
          [{ $set: { uid: '$userId' } }]
        );
        console.log(`✅ Añadido campo uid a ${resultado1.modifiedCount} documentos`);
        break;
        
      case 'add-userId':
        const resultado2 = await db.collection('birthdatas').updateMany(
          { userId: { $exists: false }, uid: { $exists: true } },
          [{ $set: { userId: '$uid' } }]
        );
        console.log(`✅ Añadido campo userId a ${resultado2.modifiedCount} documentos`);
        break;
        
      default:
        console.log('Tipos disponibles: add-uid, add-userId');
    }
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Ejecutar según argumentos
const args = process.argv.slice(2);
const comando = args[0];

if (comando === 'diagnostico') {
  diagnosticarMongoDB();
} else if (comando === 'migrar') {
  const tipo = args[1];
  migrarDatos(tipo);
} else {
  console.log(`
Uso:
  node scripts/diagnose-mongodb.js diagnostico
  node scripts/diagnose-mongodb.js migrar add-uid
  node scripts/diagnose-mongodb.js migrar add-userId
  `);
}