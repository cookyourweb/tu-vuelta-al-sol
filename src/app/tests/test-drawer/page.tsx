'use client';

import React, { useState } from 'react';
import { InterpretationDrawer } from '@/components/astrology/InterpretationDrawer';

type DrawerContent = {
  titulo: string;
  educativo: string;
  observador: string;
  impacto_real: string;
  sombras: {
    nombre: string;
    descripcion: string;
    trampa: string;
    regalo: string;
  }[];
  sintesis: {
    frase: string;
    declaracion: string;
  };
};

// =============================================================================
// 🎨 TEST PAGE PARA EL DRAWER DE INTERPRETACIONES
// =============================================================================

export default function TestDrawerPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);

  // Contenido de ejemplo para testing
  const sampleContent: DrawerContent = {
    titulo: "🌟 Júpiter en Casa 9 - La Expansión Cósmica",
    educativo: `Júpiter en la Casa 9 representa la expansión espiritual y filosófica. Esta posición indica una búsqueda natural de significado más profundo en la vida, con una inclinación hacia el aprendizaje superior, los viajes largos y la exploración de diferentes culturas y sistemas de creencias.

    La Casa 9 es tradicionalmente la casa de la filosofía, la educación superior, los viajes al extranjero y la espiritualidad. Cuando Júpiter, el planeta de la expansión y la abundancia, reside aquí, amplifica estas cualidades, creando una personalidad que naturalmente busca crecer a través del conocimiento y la experiencia.`,
    observador: `Puedes haber notado que buscas constantemente significado y propósito en todo lo que haces. Esta configuración se manifiesta en tu tendencia natural a ver el panorama general, a conectar conceptos aparentemente inconexos, y a encontrar patrones filosóficos en la experiencia diaria.

    Cuando trabajas con esta energía, te sientes más vivo y auténtico. Tu mente funciona mejor cuando explora nuevas ideas, cuando aprende sobre culturas diferentes, o cuando considera preguntas existenciales. Esta no es una necesidad superficial - es parte de tu configuración fundamental.`,
    impacto_real: `Esta configuración no se vive en ideas ni teorías: se nota en decisiones concretas.

Durante tu vida:
- No toleras trabajos o proyectos que no tengan un propósito más grande
- Sientes urgencia física por viajar cuando pasas demasiado tiempo en un solo lugar
- Buscas formación académica o espiritual de forma natural y constante
- Atraes oportunidades internacionales o multiculturales sin buscarlas activamente
- Las personas te consultan cuando necesitan perspectiva filosófica o consejo de vida

Esta energía jupiteriana en Casa 9 no es abstracta: es tu forma de respirar significado en todo lo que haces.`,
    sombras: [
      {
        nombre: "📖 El Intelectual Arrogante",
        descripcion: "La tendencia a creer que tu conocimiento es superior al de los demás, creando barreras en lugar de puentes.",
        trampa: "⚠️ Trampa: Creer que solo tu filosofía es la correcta, rechazando otras perspectivas.",
        regalo: "🎁 Regalo: Aprender que la verdadera sabiduría incluye la humildad de escuchar a otros."
      },
      {
        nombre: "🗺️ El Viajero Perdido",
        descripcion: "Buscar constantemente nuevos horizontes sin nunca llegar a puerto, evitando el compromiso profundo.",
        trampa: "⚠️ Trampa: Usar los viajes como excusa para evitar responsabilidades emocionales.",
        regalo: "🎁 Regalo: Descubrir que el viaje más importante es hacia el interior de tu propio corazón."
      }
    ],
    sintesis: {
      frase: "La expansión es tu naturaleza divina",
      declaracion: `Júpiter en Casa 9 te recuerda que eres un ser de luz infinita, diseñado para expandir consciencia donde quiera que vayas. Tu propósito es llevar esperanza y visión ampliada a todos los que encuentres en tu camino. Confía en que el universo te guía hacia experiencias que te harán crecer, y abraza cada lección como un regalo divino.`
    }
  };

  const openDrawer = () => {
    console.log('=== ABRIENDO DRAWER MANUALMENTE ===');
    setDrawerContent(sampleContent);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    console.log('=== CERRANDO DRAWER ===');
    setIsDrawerOpen(false);
    setDrawerContent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🧪 Test del Drawer de Interpretaciones
        </h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Controles de Test</h2>

          <div className="space-y-4">
            <button
              onClick={openDrawer}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
            >
              🎨 Abrir Drawer con Contenido de Ejemplo
            </button>

            <button
              onClick={closeDrawer}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 text-lg"
            >
              ❌ Cerrar Drawer
            </button>
          </div>

          <div className="mt-8 p-4 bg-black/20 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-2">Estado Actual:</h3>
            <div className="text-gray-300 space-y-1">
              <p><strong>isDrawerOpen:</strong> {isDrawerOpen ? '✅ True' : '❌ False'}</p>
              <p><strong>drawerContent:</strong> {drawerContent ? '✅ Tiene contenido' : '❌ Null'}</p>
              <p><strong>Título del contenido:</strong> {drawerContent?.titulo || 'N/A'}</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">📋 Instrucciones de Test:</h3>
            <ul className="text-gray-200 space-y-2 text-sm">
              <li>• Haz clic en "Abrir Drawer" para ver el componente en acción</li>
              <li>• Verifica que el drawer se anime desde la derecha</li>
              <li>• Prueba cerrar con el botón X o haciendo clic fuera</li>
              <li>• Prueba la tecla ESC para cerrar</li>
              <li>• Verifica que el scroll del body esté bloqueado cuando está abierto</li>
              <li>• Revisa la consola del navegador para logs de debug</li>
            </ul>
          </div>
        </div>

        {/* El Drawer se renderiza aquí */}
        <InterpretationDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          content={drawerContent}
        />
      </div>
    </div>
  );
}
