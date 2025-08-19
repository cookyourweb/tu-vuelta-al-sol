// src/app/test-agenda-ai/page.tsx
'use client';

import { Suspense } from 'react';
import AgendaAITest from '@/components/test/AgendaAITest';

function TestAgendaAIContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧪 Test de Agenda IA</h1>
          <p className="text-xl text-gray-300 mb-2">
            Prueba del endpoint de generación de agenda astrológica con IA
          </p>
          <p className="text-gray-400">
            Endpoint: <code className="bg-gray-800 px-2 py-1 rounded">/api/astrology/generate-agenda-ai</code>
          </p>
        </div>

        {/* Información del sistema */}
        <div className="max-w-4xl mx-auto mb-8 grid md:grid-cols-3 gap-6">
          <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
            <h3 className="font-bold text-green-300 mb-2">✅ Configurado</h3>
            <ul className="text-green-200 text-sm space-y-1">
              <li>• OpenAI API integrada</li>
              <li>• Prompt optimizado</li>
              <li>• Datos automáticos</li>
              <li>• Error handling</li>
            </ul>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
            <h3 className="font-bold text-blue-300 mb-2">🔮 Funcionalidades</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Agenda personalizada</li>
              <li>• Tono disruptivo</li>
              <li>• Análisis de carta natal</li>
              <li>• Fechas poder</li>
            </ul>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
            <h3 className="font-bold text-purple-300 mb-2">📊 Análisis</h3>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• Tokens utilizados</li>
              <li>• Costo estimado</li>
              <li>• Tiempo generación</li>
              <li>• Calidad respuesta</li>
            </ul>
          </div>
        </div>

        {/* Componente de test */}
        <AgendaAITest />
        
        {/* Enlaces útiles */}
        <div className="max-w-4xl mx-auto mt-8 bg-gray-800/50 border border-gray-600/50 rounded-lg p-6">
          <h3 className="font-bold text-white mb-4">🔗 Enlaces Útiles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Para Usuarios:</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <a href="/birth-data" className="text-blue-400 hover:underline">Configurar datos de nacimiento</a></li>
                <li>• <a href="/natal-chart" className="text-blue-400 hover:underline">Generar carta natal</a></li>
                <li>• <a href="/progressed-chart" className="text-blue-400 hover:underline">Carta progresada</a></li>
                <li>• <a href="/agenda" className="text-blue-400 hover:underline">Ver agenda astrológica</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Para Desarrolladores:</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• <a href="/debug" className="text-blue-400 hover:underline">Herramientas de debug</a></li>
                <li>• <a href="/test-api" className="text-blue-400 hover:underline">Test de APIs</a></li>
                <li>• <a href="/dashboard" className="text-blue-400 hover:underline">Dashboard principal</a></li>
                <li>• <a href="/" className="text-blue-400 hover:underline">Página de inicio</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notas importantes */}
        <div className="max-w-4xl mx-auto mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
          <h4 className="font-bold text-yellow-300 mb-2">⚠️ Notas Importantes</h4>
          <ul className="text-yellow-200 text-sm space-y-1">
            <li>• Este es un entorno de desarrollo - los datos son reales pero el endpoint está en modo test</li>
            <li>• La agenda generada usa tu carta natal real para máxima personalización</li>
            <li>• El prompt está optimizado para generar contenido disruptivo y motivador</li>
            <li>• Los costos de OpenAI se muestran para monitoreo de uso</li>
          </ul>
        </div>

        {/* Estado del sistema */}
        <div className="max-w-4xl mx-auto mt-6 bg-indigo-500/10 border border-indigo-400/30 rounded-lg p-4">
          <h4 className="font-bold text-indigo-300 mb-2">🔍 Estado del Sistema</h4>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-1">✅</div>
              <p className="text-indigo-200">OpenAI API</p>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-1">✅</div>
              <p className="text-indigo-200">MongoDB</p>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-1">✅</div>
              <p className="text-indigo-200">Firebase Auth</p>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-2xl mb-1">✅</div>
              <p className="text-indigo-200">Prokerala API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestAgendaAIPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Cargando test de agenda IA...</h2>
        </div>
      </div>
    }>
      <TestAgendaAIContent />
    </Suspense>
  );
}