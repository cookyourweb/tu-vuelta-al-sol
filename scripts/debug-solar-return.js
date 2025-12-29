#!/usr/bin/env node

/**
 * Script de debugging para verificar interpretaciones Solar Return en MongoDB
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function debugSolarReturn(userId = null) {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI no configurado en .env.local');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db();
    const collection = db.collection('interpretations');

    // Buscar interpretación Solar Return más reciente
    const query = userId
      ? { userId, chartType: 'solar-return' }
      : { chartType: 'solar-return' };

    const interpretation = await collection
      .findOne(query, { sort: { generatedAt: -1 } });

    if (!interpretation) {
      console.log('⚠️ No se encontró interpretación Solar Return');
      if (!userId) {
        console.log('\nIntenta con un userId específico:');
        console.log('node scripts/debug-solar-return.js <userId>');
      }
      return;
    }

    console.log('\n📊 ===== INTERPRETACIÓN ENCONTRADA =====');
    console.log('Usuario:', interpretation.userId);
    console.log('Generada:', interpretation.generatedAt);
    console.log('Método:', interpretation.method);
    console.log('Cached:', interpretation.cached);

    const interp = interpretation.interpretation;

    console.log('\n📋 ===== SECCIONES PRESENTES =====');
    console.log('✓ apertura_anual:', !!interp.apertura_anual);
    console.log('✓ como_se_vive_siendo_tu:', !!interp.como_se_vive_siendo_tu);
    console.log('✓ comparaciones_planetarias:', !!interp.comparaciones_planetarias);
    console.log('✓ linea_tiempo_anual:', !!interp.linea_tiempo_anual);
    console.log('✓ sombras_del_ano:', !!interp.sombras_del_ano);
    console.log('✓ claves_integracion:', !!interp.claves_integracion);
    console.log('✓ calendario_lunar_anual:', !!interp.calendario_lunar_anual);
    console.log('✓ cierre_integracion:', !!interp.cierre_integracion);
    console.log('✓ analisis_tecnico:', !!interp.analisis_tecnico);

    // Secciones faltantes
    const requiredSections = [
      'apertura_anual',
      'como_se_vive_siendo_tu',
      'comparaciones_planetarias',
      'linea_tiempo_anual',
      'sombras_del_ano',
      'claves_integracion',
      'calendario_lunar_anual',
      'cierre_integracion',
      'analisis_tecnico'
    ];

    const missingSections = requiredSections.filter(s => !interp[s]);

    if (missingSections.length > 0) {
      console.log('\n❌ ===== SECCIONES FALTANTES =====');
      missingSections.forEach(s => console.log(`  - ${s}`));
    } else {
      console.log('\n✅ Todas las secciones presentes');
    }

    // Detalles de comparaciones_planetarias
    if (interp.comparaciones_planetarias) {
      console.log('\n🪐 ===== COMPARACIONES PLANETARIAS =====');
      const planets = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno'];

      planets.forEach(planet => {
        const comp = interp.comparaciones_planetarias[planet];
        if (comp) {
          console.log(`\n${planet.toUpperCase()}:`);
          console.log('  ✓ natal:', !!comp.natal);
          console.log('  ✓ solar_return:', !!comp.solar_return);
          console.log('  ✓ choque:', !!comp.choque);
          console.log('  ✓ que_hacer:', !!comp.que_hacer);

          if (comp.natal?.descripcion) {
            console.log(`  Natal desc length: ${comp.natal.descripcion.length} chars`);
          }
          if (comp.choque) {
            console.log(`  Choque length: ${comp.choque.length} chars`);
          }
        } else {
          console.log(`\n${planet.toUpperCase()}: ❌ FALTA`);
        }
      });
    }

    // Calendario lunar
    if (interp.calendario_lunar_anual) {
      console.log('\n📅 ===== CALENDARIO LUNAR =====');
      console.log(`Meses: ${interp.calendario_lunar_anual.length}`);
      if (interp.calendario_lunar_anual.length > 0) {
        const primer_mes = interp.calendario_lunar_anual[0];
        console.log('Primer mes:', primer_mes.mes);
        console.log('Luna Nueva:', !!primer_mes.luna_nueva);
        console.log('Luna Llena:', !!primer_mes.luna_llena);
      }
    }

    // Análisis técnico
    if (interp.analisis_tecnico) {
      console.log('\n🔧 ===== ANÁLISIS TÉCNICO =====');
      console.log('ASC SR en Casa Natal:', interp.analisis_tecnico.asc_sr_en_casa_natal?.casa);
      console.log('Sol en Casa SR:', interp.analisis_tecnico.sol_en_casa_sr?.casa);
    }

    // Tamaño total del JSON
    const jsonSize = JSON.stringify(interp).length;
    console.log('\n📦 ===== TAMAÑO TOTAL =====');
    console.log(`JSON size: ${jsonSize} chars (${(jsonSize / 1024).toFixed(2)} KB)`);

    console.log('\n✅ Debug completado\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Ejecutar
const userId = process.argv[2];
debugSolarReturn(userId);
