#!/usr/bin/env node

/**
 * Mostrar el contenido EXACTO de la interpretación Solar Return
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function showSolarReturnContent(userId = null) {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI no configurado');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB\n');

    const db = client.db();
    const collection = db.collection('interpretations');

    const query = userId
      ? { userId, chartType: 'solar-return' }
      : { chartType: 'solar-return' };

    const doc = await collection.findOne(query, { sort: { generatedAt: -1 } });

    if (!doc) {
      console.log('⚠️ No se encontró interpretación Solar Return');
      return;
    }

    console.log('📄 ===== DOCUMENTO COMPLETO =====\n');
    console.log('_id:', doc._id);
    console.log('userId:', doc.userId);
    console.log('chartType:', doc.chartType);
    console.log('generatedAt:', doc.generatedAt);
    console.log('method:', doc.method);
    console.log('\n📊 ===== ESTRUCTURA DE interpretation =====\n');

    if (doc.interpretation) {
      console.log('Keys en interpretation:', Object.keys(doc.interpretation));
      console.log('\n');

      // Mostrar primeros 500 caracteres de cada sección
      for (const key of Object.keys(doc.interpretation)) {
        const value = doc.interpretation[key];
        const type = typeof value;

        if (type === 'object' && value !== null) {
          if (Array.isArray(value)) {
            console.log(`${key}: Array con ${value.length} elementos`);
            if (value.length > 0) {
              console.log(`  Primer elemento:`, JSON.stringify(value[0]).substring(0, 200));
            }
          } else {
            console.log(`${key}: Object con keys:`, Object.keys(value));
          }
        } else if (type === 'string') {
          console.log(`${key}: String (${value.length} chars)`);
          console.log(`  Preview: ${value.substring(0, 150)}...`);
        } else {
          console.log(`${key}: ${type} = ${value}`);
        }
        console.log('');
      }
    } else {
      console.log('⚠️ interpretation está vacío o undefined');
    }

    console.log('\n📦 ===== JSON COMPLETO (primeros 2000 chars) =====\n');
    const jsonStr = JSON.stringify(doc.interpretation, null, 2);
    console.log(jsonStr.substring(0, 2000));
    if (jsonStr.length > 2000) {
      console.log(`\n... (${jsonStr.length - 2000} caracteres más)`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

const userId = process.argv[2];
showSolarReturnContent(userId);
