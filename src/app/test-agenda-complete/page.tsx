// src/app/test-agenda-debug/page.tsx
'use client';

import { useState } from 'react';

interface TestStep {
  name: string;
  endpoint: string;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: any;
  error?: string;
  duration?: number;
}

export default function AgendaDebugTest() {
  const [steps, setSteps] = useState<TestStep[]>([
    { name: 'Test Básico Prokerala', endpoint: '/api/prokerala/test', status: 'pending' },
    { name: 'Test Exacto Postman', endpoint: '/api/astrology/test-postman', status: 'pending' },
    { name: 'Carta Natal Corregida', endpoint: '/api/prokerala/chart', status: 'pending' },
    { name: 'Carta Progresada', endpoint: '/api/charts/progressed', status: 'pending' },
    { name: 'Agenda Completa', endpoint: '/api/astrology/agenda-final', status: 'pending' }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  // Datos de test de Verónica (los mismos que usas en otros tests)
  const testData = {
    birthDate: "1974-02-10",
    birthTime: "07:30:00",
    latitude: 40.4164,
    longitude: -3.7025,
    timezone: "Europe/Madrid",
    startDate: "2025-02-10",
    endDate: "2026-02-10",
    fullName: "Verónica"
  };

  const updateStep = (index: number, updates: Partial<TestStep>) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, ...updates } : step
    ));
  };

  const runTest = async (stepIndex: number) => {
    const step = steps[stepIndex];
    const startTime = Date.now();
    
    setCurrentStep(stepIndex);
    updateStep(stepIndex, { status: 'running' });

    try {
      let response;
      
      if (step.endpoint === '/api/prokerala/test') {
        // Test básico (GET)
        response = await fetch(step.endpoint);
      } else if (step.endpoint === '/api/astrology/test-postman') {
        // Test Postman exacto (GET)
        response = await fetch(step.endpoint);
      } else {
        // Tests que requieren POST con datos
        response = await fetch(step.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });
      }

      const result = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok && (result.success !== false)) {
        updateStep(stepIndex, { 
          status: 'success', 
          result, 
          duration 
        });
        console.log(`✅ ${step.name} exitoso en ${duration}ms:`, result);
      } else {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      
      updateStep(stepIndex, { 
        status: 'error', 
        error: errorMsg, 
        duration 
      });
      console.error(`❌ ${step.name} falló en ${duration}ms:`, errorMsg);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (let i = 0; i < steps.length; i++) {
      await runTest(i);
      // Pausa entre tests para no saturar la API
      if (i < steps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsRunning(false);
    setCurrentStep(-1);
  };

  const resetTests = () => {
    setSteps(prev => prev.map(step => ({ 
      ...step, 
      status: 'pending', 
      result: undefined, 
      error: undefined, 
      duration: undefined 
    })));
    setCurrentStep(-1);
  };

  const getStatusIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const getStatusColor = (status: TestStep['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-500';
      case 'running': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-900">
        🔧 Debug de Agenda Astrológica
      </h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
        <h2 className="font-bold text-yellow-800">📋 Test de Diagnóstico</h2>
        <p className="text-yellow-700 text-sm mt-1">
          Este test ejecuta paso a paso todos los componentes necesarios para la agenda, 
          usando tus endpoints existentes para identificar exactamente dónde está el problema.
        </p>
      </div>

      {/* Datos de test */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">📅 Datos de Test (Verónica)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><strong>Fecha:</strong> {testData.birthDate}</div>
          <div><strong>Hora:</strong> {testData.birthTime}</div>
          <div><strong>Coordenadas:</strong> {testData.latitude}, {testData.longitude}</div>
          <div><strong>Timezone:</strong> {testData.timezone}</div>
          <div><strong>Período:</strong> {testData.startDate} - {testData.endDate}</div>
          <div><strong>Nombre:</strong> {testData.fullName}</div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {isRunning ? '🔄 Ejecutando Tests...' : '🚀 Ejecutar Todos los Tests'}
        </button>
        
        <button
          onClick={resetTests}
          disabled={isRunning}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          🔄 Resetear
        </button>
      </div>

      {/* Lista de tests */}
      <div className="space-y-4 mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              step.status === 'success' ? 'border-green-500' :
              step.status === 'error' ? 'border-red-500' :
              step.status === 'running' ? 'border-blue-500' :
              'border-gray-300'
            } ${currentStep === index ? 'ring-2 ring-blue-300' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getStatusIcon(step.status)}</span>
                <div>
                  <h4 className="font-bold text-lg">{step.name}</h4>
                  <p className="text-gray-600 text-sm">{step.endpoint}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${getStatusColor(step.status)}`}>
                  {step.status.toUpperCase()}
                </div>
                {step.duration && (
                  <div className="text-xs text-gray-500">
                    {step.duration}ms
                  </div>
                )}
              </div>
            </div>

            {/* Resultado exitoso */}
            {step.status === 'success' && step.result && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h5 className="font-semibold text-green-800 mb-2">✅ Resultado:</h5>
                <pre className="text-xs text-green-700 overflow-x-auto">
                  {JSON.stringify(step.result, null, 2)}
                </pre>
              </div>
            )}

            {/* Error */}
            {step.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h5 className="font-semibold text-red-800 mb-2">❌ Error:</h5>
                <p className="text-red-700 text-sm">{step.error}</p>
              </div>
            )}

            {/* Test individual */}
            <div className="mt-4">
              <button
                onClick={() => runTest(index)}
                disabled={isRunning}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                🔄 Ejecutar Solo Este Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-4">📊 Resumen del Diagnóstico</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-600">
              {steps.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-gray-600 text-sm">Pendientes</div>
          </div>
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {steps.filter(s => s.status === 'running').length}
            </div>
            <div className="text-blue-600 text-sm">Ejecutando</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">
              {steps.filter(s => s.status === 'success').length}
            </div>
            <div className="text-green-600 text-sm">Exitosos</div>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <div className="text-2xl font-bold text-red-600">
              {steps.filter(s => s.status === 'error').length}
            </div>
            <div className="text-red-600 text-sm">Con Error</div>
          </div>
        </div>
      </div>

      {/* Información técnica */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">🔧 Información Técnica</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Tests de Infraestructura:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Test Básico:</strong> Verifica autenticación Prokerala</li>
              <li>• <strong>Test Postman:</strong> Reproduce la llamada exacta que funciona</li>
              <li>• <strong>Carta Natal:</strong> Test con correcciones aplicadas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Tests de Agenda:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Carta Progresada:</strong> Verifica parámetros current_coordinates</li>
              <li>• <strong>Agenda Completa:</strong> Test del endpoint principal corregido</li>
              <li>• <strong>Diagnóstico:</strong> Identifica el paso exacto donde falla</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}