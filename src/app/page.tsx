// src/app/page.tsx
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
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/register" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-md transition duration-300"
              >
                Registrarse
              </Link>
              <Link 
                href="/login" 
                className="bg-white text-purple-800 hover:bg-purple-100 font-bold py-3 px-8 rounded-md transition duration-300"
              >
                Iniciar Sesión
              </Link>
            </div>
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

      {/* How It Works Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              ¿Cómo Funciona?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Tres simples pasos para obtener tu agenda astrológica personalizada.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Ingresa tus Datos",
                description: "Registra tu fecha, hora y lugar de nacimiento para calcular tu carta astrológica precisa.",
                icon: "📝",
                number: "1"
              },
              {
                title: "Genera tu Carta Natal",
                description: "Nuestro sistema calcula automáticamente tu carta natal con todos los elementos astrológicos clave.",
                icon: "🔮",
                number: "2"
              },
              {
                title: "Obtén tu Agenda",
                description: "Recibe una agenda personalizada con eventos astrológicos relevantes para tu carta natal.",
                icon: "📚",
                number: "3"
              }
            ].map((step, index) => (
              <div key={index} className="relative bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow">
                <div className="absolute -top-4 -left-4 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Experiencias reales de personas que usan Tu Vuelta al Sol.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "Esta agenda me ha ayudado a entender mejor los ciclos astrológicos y cómo afectan mi vida diaria. ¡Totalmente recomendada!",
                author: "María García",
                role: "Profesora de Yoga"
              },
              {
                quote: "Nunca pensé que la astrología podría ser tan práctica. Ahora planifico mis actividades importantes según mi carta natal y los resultados son sorprendentes.",
                author: "Carlos Rodríguez",
                role: "Emprendedor"
              },
              {
                quote: "La precisión de mi carta natal me dejó sin palabras. La agenda personalizada es una herramienta increíble para mi crecimiento personal.",
                author: "Laura Martínez",
                role: "Terapeuta Holística"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">{testimonial.author}</h4>
                    <p className="text-purple-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
            Comienza tu viaje astrológico hoy
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Descubre cómo los astros pueden guiarte en tu camino de crecimiento personal con una agenda astrológica única y personalizada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/register" 
              className="bg-white text-purple-900 hover:bg-purple-100 font-bold py-3 px-8 rounded-md transition duration-300"
            >
              Crear Mi Agenda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}