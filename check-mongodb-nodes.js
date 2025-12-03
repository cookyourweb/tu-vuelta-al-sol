// check-mongodb-nodes.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkNodes() {
  try {
    // Use environment variable from .env file
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please make sure your .env file contains MONGODB_URI');
      return;
    }

    console.log('🔌 Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db(); // Use default database from URI

    const interpretation = await db.collection('interpretations').findOne({
      userId: '1XJWLBXo6XOxeMMMkFTqlP2Bc7y1',
      chartType: 'natal'
    });

    console.log('📦 Interpretación completa:');
    console.log('- Tiene nodes?', !!interpretation?.nodes);
    console.log('- Nodes keys:', Object.keys(interpretation?.nodes || {}));
    console.log('- Nodo N Verdadero existe?', !!interpretation?.nodes?.['Nodo N Verdadero-Sagitario-11']);

    console.log('\n📦 Secciones disponibles:');
    console.log('- planets:', Object.keys(interpretation?.planets || {}));
    console.log('- asteroids:', Object.keys(interpretation?.asteroids || {}));
    console.log('- nodes:', Object.keys(interpretation?.nodes || {}));

    if (interpretation?.nodes?.['Nodo N Verdadero-Sagitario-11']) {
      console.log('\n🎯 Nodo N Verdadero encontrado:');
      console.log(JSON.stringify(interpretation.nodes['Nodo N Verdadero-Sagitario-11'], null, 2));
    }

    client.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkNodes();
