import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              Tu Vuelta al Sol
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto mb-10">
              Agenda astrológica personalizada basada en tu carta natal y progresada, para guiar tu camino de autoconocimiento y desarrollo personal.
            </p>
            <Link 
              href="/register" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-md transition duration-300"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              ¿Qué incluye tu agenda?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Descubre todo lo que nuestra agenda astrológica personalizada puede ofrecerte.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Carta Natal Personalizada",
                description: "Análisis detallado de tu carta natal, revelando tus fortalezas, desafíos y potencial único.",
                icon: "🌟"
              },
              {
                title: "Agenda Mensual Detallada",
                description: "Calendario con eventos astrológicos relevantes para ti, incluyendo recomendaciones y rituales personalizados.",
                icon: "📅"
              },
              {
                title: "Rituales Personalizados",
                description: "Prácticas de sanación y manifestación diseñadas específicamente para tu carta astrológica.",
                icon: "✨"
              },
              {
                title: "Análisis de Relaciones",
                description: "Comprende mejor tus dinámicas relacionales y cómo mejorarlas basado en tu carta natal.",
                icon: "💖"
              },
              {
                title: "Orientación Profesional",
                description: "Descubre tu vocación y los mejores momentos para avanzar en tu carrera.",
                icon: "💼"
              },
              {
                title: "Desarrollo Personal",
                description: "Herramientas para superar bloqueos y manifestar tu verdadero potencial.",
                icon: "🌱"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-purple-900 sm:text-4xl mb-6">
            Tu guía personal para el próximo año
          </h2>
          <p className="text-xl text-purple-700 max-w-3xl mx-auto mb-10">
            No navegues solo en tu viaje de desarrollo personal. Déjate guiar por las estrellas con tu agenda astrológica personalizada.
          </p>
          <Link 
            href="/register" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-md transition duration-300"
          >
            Crear Mi Agenda
          </Link>
        </div>
      </section>
    </div>
  );
}