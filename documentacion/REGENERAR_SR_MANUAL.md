# 🔄 Script para Regenerar Solar Return Manualmente

## Pasos:

### 1. Abre la consola del navegador
- Chrome/Edge: `F12` o `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- Firefox: `F12` o `Ctrl+Shift+K`

### 2. Copia y pega este script completo:

```javascript
(async function regenerarSR() {
  const userId = 'uZEcmOdconMjtcz81RIP7kweBGl2'; // Tu userId

  console.log('🔄 Iniciando regeneración de Solar Return...');

  try {
    // 1. Borrar interpretación antigua
    console.log('🗑️ Borrando interpretación antigua...');
    const deleteRes = await fetch(`/api/interpretations/save?userId=${userId}&chartType=solar-return`, {
      method: 'DELETE'
    });

    if (deleteRes.ok) {
      console.log('✅ Interpretación antigua borrada');
    } else {
      console.warn('⚠️ No se pudo borrar (quizá no existe)');
    }

    // 2. Obtener birth data
    console.log('📍 Obteniendo datos de nacimiento...');
    const birthDataRes = await fetch(`/api/birth-data?userId=${userId}`);
    const birthDataJson = await birthDataRes.json();
    const birthData = birthDataJson.data || birthDataJson.birthData;

    if (!birthData) {
      throw new Error('No se encontraron datos de nacimiento');
    }
    console.log('✅ Datos de nacimiento obtenidos');

    // 3. Obtener carta natal
    console.log('🌟 Obteniendo carta natal...');
    const natalRes = await fetch(`/api/charts/natal?userId=${userId}`);
    const natalJson = await natalRes.json();
    const natalChart = natalJson.natalChart || natalJson.chart || natalJson.data?.chart;

    if (!natalChart) {
      throw new Error('No se encontró carta natal');
    }
    console.log('✅ Carta natal obtenida');

    // 4. Generar carta Solar Return
    console.log('☀️ Generando carta Solar Return...');
    const srChartRes = await fetch(`/api/charts/solar-return?userId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, force: true })
    });
    const srChartJson = await srChartRes.json();
    const solarReturnChart = srChartJson.data?.solarReturnChart || srChartJson.solarReturnChart;

    if (!solarReturnChart) {
      throw new Error('No se pudo generar carta Solar Return');
    }
    console.log('✅ Carta Solar Return generada');

    // 5. Construir userProfile
    const birthDateStr = birthData.date || birthData.birthDate;
    const birthDateObj = new Date(birthDateStr);
    const now = new Date();
    let age = now.getFullYear() - birthDateObj.getFullYear();
    const hasHadBirthdayThisYear = (now.getMonth() > birthDateObj.getMonth()) ||
      (now.getMonth() === birthDateObj.getMonth() && now.getDate() >= birthDateObj.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;

    const userProfile = {
      name: birthData.fullName || 'Usuario',
      birthDate: birthDateStr,
      birthPlace: birthData.location || birthData.birthPlace,
      age: age
    };

    console.log('👤 Perfil de usuario:', userProfile);

    // 6. Generar interpretación con IA
    console.log('🤖 Generando interpretación con IA (esto puede tardar 1-2 minutos)...');
    const interpretRes = await fetch(`/api/astrology/interpret-solar-return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        natalChart,
        solarReturnChart,
        userProfile,
        birthData,
        regenerate: true
      })
    });

    if (!interpretRes.ok) {
      const errorData = await interpretRes.json();
      throw new Error(errorData.error || 'Error al generar interpretación');
    }

    const interpretData = await interpretRes.json();
    console.log('✅ Interpretación generada exitosamente');

    // 7. Verificar que los campos están presentes
    console.log('🔍 Verificando campos...');
    const checkRes = await fetch(`/api/interpretations?userId=${userId}&chartType=solar-return`);
    const checkData = await checkRes.json();

    if (checkData.interpretation?.linea_tiempo_emocional) {
      console.log('✅ linea_tiempo_emocional: PRESENTE');
    } else {
      console.warn('⚠️ linea_tiempo_emocional: FALTA');
    }

    if (checkData.interpretation?.meses_clave_puntos_giro) {
      console.log('✅ meses_clave_puntos_giro: PRESENTE');
    } else {
      console.warn('⚠️ meses_clave_puntos_giro: FALTA');
    }

    console.log('🎉 ¡REGENERACIÓN COMPLETADA! Recarga la página para ver los cambios.');
    alert('✅ Solar Return regenerado exitosamente. Recarga la página (F5) para ver los cambios.');

  } catch (error) {
    console.error('❌ ERROR:', error);
    alert('❌ Error: ' + error.message);
  }
})();
```

### 3. Presiona Enter

### 4. Espera 1-2 minutos

Verás mensajes en la consola mostrando el progreso.

### 5. Cuando termine, recarga la página (F5)

### 6. Abre el libro agenda nuevamente

Las páginas 16 y 17 deberían tener contenido ahora.

---

## Verificación rápida:

Si quieres verificar si ya tiene los campos SIN regenerar, ejecuta esto en la consola:

```javascript
fetch('/api/interpretations?userId=uZEcmOdconMjtcz81RIP7kweBGl2&chartType=solar-return')
  .then(r => r.json())
  .then(data => {
    console.log('linea_tiempo_emocional:', data.interpretation?.linea_tiempo_emocional);
    console.log('meses_clave_puntos_giro:', data.interpretation?.meses_clave_puntos_giro);
  });
```

Si ambos muestran `undefined`, entonces necesitas regenerar.
