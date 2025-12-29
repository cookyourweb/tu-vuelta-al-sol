/**
 * Script para borrar interpretaciones natales de un usuario específico
 * Útil cuando:
 * - Las interpretaciones tienen tono antiguo (épico/místico)
 * - Las casas han cambiado en los cálculos
 * - Se necesita regenerar con el nuevo prompt observador
 *
 * USAGE:
 * node scripts/reset-user-natal-interpretations.js <userId>
 *
 * EJEMPLO:
 * node scripts/reset-user-natal-interpretations.js abc123def456
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function resetUserNatalInterpretations() {
  const userId = process.argv[2];

  if (!userId) {
    console.error('❌ Error: Debes proporcionar un userId');
    console.log('\nUSAGE:');
    console.log('  node scripts/reset-user-natal-interpretations.js <userId>');
    console.log('\nEJEMPLO:');
    console.log('  node scripts/reset-user-natal-interpretations.js abc123def456');
    process.exit(1);
  }

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

    // Contar interpretaciones natales del usuario antes de borrar
    const countBefore = await collection.countDocuments({
      chartType: 'natal',
      userId: userId
    });

    console.log(`\n📊 Usuario: ${userId}`);
    console.log(`📊 Interpretaciones de Carta Natal encontradas: ${countBefore}`);

    if (countBefore === 0) {
      console.log('ℹ️  No hay interpretaciones de Carta Natal para este usuario');
      return;
    }

    // Mostrar las interpretaciones antes de borrar
    const interpretations = await collection.find({
      chartType: 'natal',
      userId: userId
    }).toArray();

    console.log('\n📋 Interpretaciones que serán eliminadas:');
    interpretations.forEach((interp, index) => {
      console.log(`\n  ${index + 1}. ${interp._id}`);
      console.log(`     - Creada: ${interp.createdAt}`);
      console.log(`     - Actualizada: ${interp.updatedAt || 'N/A'}`);

      // Mostrar algunas claves de planets si existen
      if (interp.interpretation?.planets) {
        const planetKeys = Object.keys(interp.interpretation.planets);
        console.log(`     - Planetas: ${planetKeys.length} configuraciones`);
        if (planetKeys.length > 0) {
          console.log(`       Ejemplos: ${planetKeys.slice(0, 3).join(', ')}`);
        }
      }
    });

    // Confirmar antes de borrar
    console.log('\n⚠️  ADVERTENCIA: Esta acción eliminará todas las interpretaciones natales de este usuario');
    console.log('   Las interpretaciones se regenerarán automáticamente con:');
    console.log('   ✅ Nuevo tono observador (sin "SUPERPODER", "misión cósmica")');
    console.log('   ✅ Casas correctas según cálculos actuales');
    console.log('   ✅ Prompt actualizado y validado');

    // Borrar interpretaciones natales del usuario
    const result = await collection.deleteMany({
      chartType: 'natal',
      userId: userId
    });

    console.log(`\n✅ ${result.deletedCount} interpretaciones de Carta Natal borradas`);
    console.log('🔄 La próxima vez que este usuario acceda a su Carta Natal:');
    console.log('   - Se generarán nuevas interpretaciones');
    console.log('   - Usarán el tono observador correcto');
    console.log('   - Reflejarán las casas correctas');
    console.log('   - El botón mostrará "Ver interpretación" después de generar');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

resetUserNatalInterpretations();
