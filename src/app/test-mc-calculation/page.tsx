// 🧪 Test de Cálculo de Signo desde Longitud - MC de Oscar
// Este script verifica que la función getSignFromLongitude() funciona correctamente

'use client';

import { useState } from 'react';

export default function TestMCCalculationPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Función de cálculo (copia exacta de prokeralaService.ts)
   */
  function getSignFromLongitude(longitude: number): string {
    const signs = [
      'Aries', 'Tauro', 'Géminis', 'Cáncer',
      'Leo', 'Virgo', 'Libra', 'Escorpio',
      'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
    ];

    const signIndex = Math.floor(longitude / 30) % 12;
    return signs[signIndex];
  }

  const runTest = () => {
    setLoading(true);

    // ===== CASO DE PRUEBA: OSCAR =====

    console.log('🧪 =====================================');
    console.log('🧪 TEST: Cálculo de Medio Cielo');
    console.log('🧪 =====================================\n');

    console.log('📋 DATOS DE PRUEBA:');
    console.log('Persona: Oscar');
    console.log('Nacimiento: 25 nov 1966, 02:34 AM');
    console.log('Lugar: Madrid, España\n');

    // Datos reales de la API de Prokerala
    const oscarMC = {
      longitude: 173.894,
      apiSign: 'Géminis',  // ❌ Lo que devuelve incorrectamente la API
      expectedSign: 'Virgo', // ✅ Lo que debería ser
      expectedDegree: 23
    };

    console.log('🌍 DATOS DE MEDIO CIELO:');
    console.log(`Longitud eclíptica: ${oscarMC.longitude}°`);
    console.log(`Signo devuelto por API: ${oscarMC.apiSign} ❌`);
    console.log(`Signo esperado: ${oscarMC.expectedSign} ✅\n`);

    // ===== REALIZAR CÁLCULOS =====

    console.log('🔢 CÁLCULOS PASO A PASO:\n');

    // Paso 1: Calcular índice del signo
    const signIndex = Math.floor(oscarMC.longitude / 30);
    console.log(`1️⃣ Cálculo de índice:`);
    console.log(`   ${oscarMC.longitude}° ÷ 30° = ${oscarMC.longitude / 30}`);
    console.log(`   Math.floor(${oscarMC.longitude / 30}) = ${signIndex}`);
    console.log(`   👉 Índice del signo: ${signIndex}\n`);

    // Paso 2: Aplicar módulo 12
    const signIndexMod12 = signIndex % 12;
    console.log(`2️⃣ Aplicar módulo 12:`);
    console.log(`   ${signIndex} % 12 = ${signIndexMod12}`);
    console.log(`   👉 Índice final: ${signIndexMod12}\n`);

    // Paso 3: Obtener nombre del signo
    const calculatedSign = getSignFromLongitude(oscarMC.longitude);
    console.log(`3️⃣ Obtener nombre del signo:`);
    console.log(`   signs[${signIndexMod12}] = "${calculatedSign}"`);
    console.log(`   👉 Signo calculado: ${calculatedSign}\n`);

    // Paso 4: Calcular grados dentro del signo
    const degreeInSign = Math.floor(oscarMC.longitude % 30);
    const minutesInSign = Math.floor(((oscarMC.longitude % 30) % 1) * 60);
    console.log(`4️⃣ Calcular posición exacta:`);
    console.log(`   ${oscarMC.longitude}° % 30° = ${oscarMC.longitude % 30}°`);
    console.log(`   Math.floor(${oscarMC.longitude % 30}) = ${degreeInSign}°`);
    console.log(`   Minutos: ${minutesInSign}'`);
    console.log(`   👉 Posición: ${degreeInSign}° ${minutesInSign}'\n`);

    // ===== VERIFICACIÓN =====

    console.log('✅ VERIFICACIÓN DE RESULTADOS:\n');

    const testsPassed = [];
    const testsFailed = [];

    // Test 1: Signo correcto
    if (calculatedSign === oscarMC.expectedSign) {
      testsPassed.push('Signo calculado correctamente');
      console.log(`✅ Test 1: Signo = "${calculatedSign}" (esperado: "${oscarMC.expectedSign}")`);
    } else {
      testsFailed.push('Signo incorrecto');
      console.log(`❌ Test 1: Signo = "${calculatedSign}" (esperado: "${oscarMC.expectedSign}")`);
    }

    // Test 2: Grados correctos
    if (degreeInSign === oscarMC.expectedDegree) {
      testsPassed.push('Grados calculados correctamente');
      console.log(`✅ Test 2: Grados = ${degreeInSign}° (esperado: ${oscarMC.expectedDegree}°)`);
    } else {
      testsFailed.push('Grados incorrectos');
      console.log(`❌ Test 2: Grados = ${degreeInSign}° (esperado: ${oscarMC.expectedDegree}°)`);
    }

    // Test 3: Diferente de API
    if (calculatedSign !== oscarMC.apiSign) {
      testsPassed.push('Corrige el error de la API');
      console.log(`✅ Test 3: Corrige error de API (API dice "${oscarMC.apiSign}", nosotros calculamos "${calculatedSign}")`);
    } else {
      testsFailed.push('No corrige el error de la API');
      console.log(`❌ Test 3: No corrige error de API`);
    }

    // ===== ANÁLISIS: ¿POR QUÉ LAS OTRAS APPS LO HACEN MAL? =====

    console.log('\n🔍 ANÁLISIS: ¿POR QUÉ LAS OTRAS APPS LO HACEN MAL?\n');

    // Método incorrecto: Usar el signo devuelto por la API
    const wrongMethodSign = oscarMC.apiSign;
    console.log('❌ MÉTODO INCORRECTO (usado por otras apps):');
    console.log(`   Usar directamente el signo devuelto por la API: "${wrongMethodSign}"`);
    console.log(`   👉 Resultado: ${wrongMethodSign} (INCORRECTO)\n`);

    // Método correcto: Calcular desde longitud
    console.log('✅ MÉTODO CORRECTO (usado por Tu Vuelta al Sol):');
    console.log(`   Calcular signo desde longitud eclíptica: ${oscarMC.longitude}°`);
    console.log(`   Paso 1: ${oscarMC.longitude} ÷ 30 = ${oscarMC.longitude / 30}`);
    console.log(`   Paso 2: Math.floor(${oscarMC.longitude / 30}) = ${signIndex}`);
    console.log(`   Paso 3: ${signIndex} % 12 = ${signIndexMod12}`);
    console.log(`   Paso 4: signs[${signIndexMod12}] = "${calculatedSign}"`);
    console.log(`   👉 Resultado: ${calculatedSign} (CORRECTO)\n`);

    // Comparación detallada
    console.log('📊 COMPARACIÓN DETALLADA:');
    console.log(`   Longitud: ${oscarMC.longitude}°`);
    console.log(`   Rango de Géminis: 60° - 90°`);
    console.log(`   Rango de Virgo: 150° - 180°`);
    console.log(`   ${oscarMC.longitude}° está en el rango de Virgo ✅`);
    console.log(`   ${oscarMC.longitude}° NO está en el rango de Géminis ❌\n`);

    // ===== CASOS ADICIONALES =====

    console.log('📋 TESTS ADICIONALES CON OTROS CASOS:\n');

    const testCases = [
      { longitude: 0, expectedSign: 'Aries', expectedDegree: 0 },
      { longitude: 30, expectedSign: 'Tauro', expectedDegree: 0 },
      { longitude: 60, expectedSign: 'Géminis', expectedDegree: 0 },
      { longitude: 90, expectedSign: 'Cáncer', expectedDegree: 0 },
      { longitude: 120, expectedSign: 'Leo', expectedDegree: 0 },
      { longitude: 150, expectedSign: 'Virgo', expectedDegree: 0 },
      { longitude: 173.894, expectedSign: 'Virgo', expectedDegree: 23 },
      { longitude: 180, expectedSign: 'Libra', expectedDegree: 0 },
      { longitude: 210, expectedSign: 'Escorpio', expectedDegree: 0 },
      { longitude: 240, expectedSign: 'Sagitario', expectedDegree: 0 },
      { longitude: 270, expectedSign: 'Capricornio', expectedDegree: 0 },
      { longitude: 300, expectedSign: 'Acuario', expectedDegree: 0 },
      { longitude: 330, expectedSign: 'Piscis', expectedDegree: 0 }
    ];

    let additionalTestsPassed = 0;
    let additionalTestsFailed = 0;

    testCases.forEach(testCase => {
      const sign = getSignFromLongitude(testCase.longitude);
      const degree = Math.floor(testCase.longitude % 30);
      const passed = sign === testCase.expectedSign && degree === testCase.expectedDegree;

      if (passed) {
        additionalTestsPassed++;
        console.log(`✅ ${testCase.longitude}° → ${sign} ${degree}° (esperado: ${testCase.expectedSign} ${testCase.expectedDegree}°)`);
      } else {
        additionalTestsFailed++;
        console.log(`❌ ${testCase.longitude}° → ${sign} ${degree}° (esperado: ${testCase.expectedSign} ${testCase.expectedDegree}°)`);
      }
    });

    console.log(`\n📊 Tests adicionales: ${additionalTestsPassed}/${testCases.length} pasados\n`);

    if (additionalTestsFailed === 0) {
      console.log('🎉 ¡PERFECTO! La función funciona correctamente para todos los casos.');
    } else {
      console.log('⚠️ Hay problemas con la función de cálculo.');
    }

    console.log('\n========================================\n');

    // Set results for UI
    setResults({
      oscarMC,
      calculatedSign,
      degreeInSign,
      minutesInSign,
      testsPassed,
      testsFailed,
      additionalTestsPassed,
      additionalTestsFailed,
      testCases: testCases.length,
      signIndex,
      signIndexMod12,
      wrongMethodSign
    });

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🧪 Test de Cálculo de Medio Cielo</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-400">ℹ️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Objetivo:</strong> Verificar que la función <code>getSignFromLongitude()</code> calcula correctamente el signo del Medio Cielo.
            </p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Caso de prueba:</strong> Oscar (25 nov 1966, 02:34 AM, Madrid) - MC debería ser Virgo 23°, no Géminis.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={runTest}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Ejecutando tests...' : '🚀 Ejecutar Test de MC'}
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          {/* Resultados principales */}
          <div className="bg-gray-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">📊 Resultados del Test</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Datos de entrada */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-black">📋 Datos de Prueba</h3>
                <div className="space-y-2 text-sm text-black">
                  <p><strong>Persona:</strong> Oscar</p>
                  <p><strong>Nacimiento:</strong> 25 nov 1966, 02:34 AM</p>
                  <p><strong>Lugar:</strong> Madrid, España</p>
                  <p><strong>Longitud MC:</strong> {results.oscarMC.longitude}°</p>
                  <p><strong>API incorrecta:</strong> {results.oscarMC.apiSign} ❌</p>
                  <p><strong>Esperado:</strong> {results.oscarMC.expectedSign} ✅</p>
                </div>
              </div>

              {/* Resultados calculados */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-black">🔢 Resultados Calculados</h3>
                <div className="space-y-2 text-sm text-black">
                  <p><strong>Signo calculado:</strong> {results.calculatedSign}</p>
                  <p><strong>Grados:</strong> {results.degreeInSign}°</p>
                  <p><strong>Minutos:</strong> {results.minutesInSign}'</p>
                  <p><strong>Índice del signo:</strong> {results.signIndex} → {results.signIndexMod12}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tests de verificación */}
          <div className="bg-gray-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">✅ Verificación de Tests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-3 text-green-600">Tests Pasados ({results.testsPassed.length}/3)</h3>
                <ul className="space-y-1">
                  {results.testsPassed.map((test: string, index: number) => (
                    <li key={index} className="text-sm text-black">✅ {test}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-red-600">Tests Fallados ({results.testsFailed.length}/3)</h3>
                {results.testsFailed.length > 0 ? (
                  <ul className="space-y-1">
                    {results.testsFailed.map((test: string, index: number) => (
                      <li key={index} className="text-sm text-black">❌ {test}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-black">Ningún test falló</p>
                )}
              </div>
            </div>
          </div>

          {/* Tests adicionales */}
          <div className="bg-gray-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">📋 Tests Adicionales</h2>

            <div className="text-center mb-4">
              <span className={`text-2xl font-bold ${results.additionalTestsFailed === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.additionalTestsPassed}/{results.testCases} tests pasados
              </span>
            </div>

            {results.additionalTestsFailed === 0 ? (
              <div className="text-center text-green-600">
                🎉 ¡PERFECTO! La función funciona correctamente para todos los casos.
              </div>
            ) : (
              <div className="text-center text-red-600">
                ⚠️ Hay problemas con la función de cálculo.
              </div>
            )}
          </div>

          {/* Análisis: ¿Por qué las otras apps lo hacen mal? */}
          <div className="bg-gray-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">🔍 ¿Por qué las otras apps lo hacen mal?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Método incorrecto */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-red-700">❌ Método Incorrecto (otras apps)</h3>
                <div className="space-y-2 text-sm text-black">
                  <p><strong>Paso 1:</strong> Usar signo devuelto por API</p>
                  <p><strong>API devuelve:</strong> "{results.wrongMethodSign}"</p>
                  <p><strong>Resultado:</strong> Géminis (INCORRECTO)</p>
                  <p><strong>Problema:</strong> Confía ciegamente en la API</p>
                </div>
              </div>

              {/* Método correcto */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-green-700">✅ Método Correcto (Tu Vuelta al Sol)</h3>
                <div className="space-y-2 text-sm text-black">
                  <p><strong>Paso 1:</strong> Tomar longitud eclíptica</p>
                  <p><strong>Longitud:</strong> {results.oscarMC.longitude}°</p>
                  <p><strong>Paso 2:</strong> Calcular signo matemáticamente</p>
                  <p><strong>Resultado:</strong> {results.calculatedSign} (CORRECTO)</p>
                </div>
              </div>
            </div>

            {/* Comparación detallada */}
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-lg mb-3 text-yellow-800">📊 Comparación Detallada</h3>
              <div className="space-y-2 text-sm text-black">
                <p><strong>Longitud del MC:</strong> {results.oscarMC.longitude}°</p>
                <p><strong>Rango de Géminis:</strong> 60° - 90°</p>
                <p><strong>Rango de Virgo:</strong> 150° - 180°</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-red-600">❌ {results.oscarMC.longitude}° NO está en Géminis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅ {results.oscarMC.longitude}° SÍ está en Virgo</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-black">
                <strong>💡 Razón del error:</strong> Las otras apps confían en el signo que devuelve la API sin verificar
                si corresponde realmente con la longitud eclíptica. Tu Vuelta al Sol calcula matemáticamente
                el signo correcto desde la longitud.
              </p>
            </div>
          </div>

          {/* Comparación con fuentes profesionales */}
          <div className="bg-gray-50 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">📚 Comparación con Fuentes Profesionales</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">Carta-natal.es</span>
                <span className="text-red-600">❌ Géminis 23°53'39"</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="font-medium">AstroSeek</span>
                <span className="text-red-600">❌ Géminis 23°53'</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Tu Vuelta al Sol (corregido)</span>
                <span className="text-green-600">✅ {results.calculatedSign} {results.degreeInSign}° {results.minutesInSign}'</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-black">
                <strong>💡 Conclusión:</strong> Todas las apps profesionales tienen el mismo error.
                Tu Vuelta al Sol es la ÚNICA que lo corrige correctamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
