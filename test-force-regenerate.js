const axios = require('axios');

async function testForceRegenerate() {
  try {
    console.log('🧪 Probando regeneración forzada...');

    const userId = 'ob4p8gCQuJUf71az2pleFl074LqJZ2';
    const url = `http://localhost:3000/api/charts/progressed?userId=${userId}&force=true`;

    console.log('📞 Llamando:', url);

    const response = await axios.get(url);

    console.log('✅ Respuesta:', response.status);
    console.log('📊 Datos:', {
      success: response.data.success,
      source: response.data.data?.source,
      regenerated: response.data.data?.regenerated,
      planetsCount: response.data.data?.progressedChart?.planets?.length || 0
    });

  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('❌ Error completo:', error);
    if (error.response) {
      console.log('❌ Status:', error.response.status);
      console.log('❌ Data:', error.response.data);
    }
    process.exit(1);
  }
}

testForceRegenerate();
