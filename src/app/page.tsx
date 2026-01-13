// src/app/page.tsx
import Link from 'next/link';
import {
  Star,
  Sparkles,
  Moon,
  Sun,
  Calendar,
  Heart,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Zap,
  Book,
  Compass,
  TrendingUp,
  Gift
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-hidden">
      {/* Fondo mágico */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent"></div>

      {/* Estrellas decorativas */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-64 left-1/4 w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-96 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-48 right-1/4 w-4 h-4 bg-blue-300 rounded-full animate-bounce delay-1200"></div>
      <div className="absolute top-1/2 left-20 w-3 h-3 bg-purple-300 rounded-full animate-pulse delay-800"></div>
      <div className="absolute bottom-64 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-400"></div>

      {/* HERO – BLOQUE PRINCIPAL */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">

            {/* Icono principal */}
            <div className="flex justify-center items-center mb-12">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-12 backdrop-blur-sm relative">
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
                <Sun className="w-16 h-16 text-yellow-400" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              ¿Estás lista/o para tu
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> VUELTA AL SOL</span>?
            </h1>

            <div className="text-xl sm:text-2xl lg:text-3xl max-w-5xl mx-auto mb-8 leading-relaxed text-gray-200 space-y-4">
              <p className="font-bold">No es solo un nuevo año.</p>
              <p>Es un portal. Un ciclo. Una renovación real.</p>
            </div>

            <p className="text-lg sm:text-xl max-w-4xl mx-auto mb-6 leading-relaxed text-gray-300">
              Cada año, el día de tu cumpleaños, tu energía se reinicia.<br />
              Y esta vez, puedes elegir no vivirlo en automático.
            </p>

            <p className="text-lg sm:text-xl max-w-4xl mx-auto mb-8 leading-relaxed text-gray-300">
              <strong className="text-white">Tu Vuelta al Sol</strong> es una agenda astrológica personalizada,<br />
              creada a partir de tu carta natal y tu retorno solar,<br />
              que te acompaña desde tu cumpleaños hasta el siguiente.
            </p>

            <p className="text-xl max-w-3xl mx-auto mb-12 leading-relaxed text-gray-200 font-medium">
              Una herramienta profunda, clara y transformadora<br />
              para entender tu momento vital… y activarlo.
            </p>

            <p className="text-lg text-gray-300 mb-12">
              👉 Para ti o para regalar a alguien especial.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Link
                href="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-6 px-12 rounded-2xl text-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Crear mi Vuelta al Sol
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>

              <Link
                href="/login"
                className="bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-6 px-12 rounded-2xl text-xl hover:from-white/20 hover:to-white/30 transition-all duration-300 transform hover:scale-105"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE DE CONEXIÓN EMOCIONAL */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full p-6 backdrop-blur-sm relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <Heart className="w-10 h-10 text-purple-400" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 leading-tight">
            No es una agenda
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> cualquiera</span>
          </h2>

          <p className="text-2xl sm:text-3xl text-white mb-8 font-medium">
            Es una guía viva para tu nuevo ciclo.
          </p>

          <div className="space-y-4 text-xl text-gray-300 leading-relaxed">
            <p className="font-bold text-white">No predice.</p>
            <p className="font-bold text-white">No promete milagros.</p>
            <p className="font-bold text-white text-2xl">Te muestra el mapa.</p>
          </div>

          <div className="mt-12 space-y-3 text-lg text-gray-200">
            <p>Qué se mueve en tu vida.</p>
            <p>Qué se activa.</p>
            <p>Qué necesitas soltar.</p>
            <p className="text-xl font-semibold text-white">Y hacia dónde avanzar con más conciencia.</p>
          </div>
        </div>
      </section>

      {/* BLOQUE EXPLICATIVO – QUÉ ES */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-blue-400/20 to-cyan-500/20 border border-blue-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <Compass className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
              ¿Qué es
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent"> Tu Vuelta al Sol</span>?
            </h2>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-10 md:p-12 space-y-6 text-lg text-gray-200 leading-relaxed">
            <p className="text-xl font-medium text-white">
              <strong>Tu Vuelta al Sol</strong> es una agenda astrológica personalizada por cumpleaños
              que comienza el día de tu cumpleaños
              y finaliza el día anterior a tu siguiente cumpleaños.
            </p>

            <p className="text-lg">
              Se crea a partir de tu información natal real
              y analiza tu año solar completo para ayudarte a:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[
                {
                  text: "Comprender quién eres y cómo funcionas",
                  icon: Star,
                  gradient: "from-yellow-400/20 to-orange-500/20",
                  iconColor: "text-yellow-400"
                },
                {
                  text: "Ver qué áreas de tu vida se activan este año",
                  icon: TrendingUp,
                  gradient: "from-green-400/20 to-emerald-500/20",
                  iconColor: "text-green-400"
                },
                {
                  text: "Tomar decisiones con más conciencia y alineación",
                  icon: Compass,
                  gradient: "from-blue-400/20 to-cyan-500/20",
                  iconColor: "text-blue-400"
                },
                {
                  text: "Acompañar tu proceso emocional, mental y energético",
                  icon: Heart,
                  gradient: "from-pink-400/20 to-red-500/20",
                  iconColor: "text-pink-400"
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex items-start space-x-4`}>
                    <IconComponent className={`w-8 h-8 ${item.iconColor} flex-shrink-0 mt-1`} />
                    <p className="text-white font-medium">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE DE CONTENIDO – QUÉ INCLUYE */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <Book className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
              ¿Qué incluye tu
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> Vuelta al Sol</span>?
            </h2>

            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Todo está explicado con un lenguaje directo, emocional y entendible,<br />
              sin jerga compleja ni tecnicismos innecesarios.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Tu carta natal explicada con claridad",
                description: "Planetas, casas y energías que definen tu personalidad y tu forma de vivir.",
                icon: Star,
                gradient: "from-yellow-400/20 to-orange-500/20",
                border: "border-yellow-400/30",
                iconColor: "text-yellow-400"
              },
              {
                title: "Tu retorno solar",
                description: "Qué áreas se activan en tu nuevo año y cómo aprovecharlas.",
                icon: Sun,
                gradient: "from-orange-400/20 to-red-500/20",
                border: "border-orange-400/30",
                iconColor: "text-orange-400"
              },
              {
                title: "Carta progresada",
                description: "Cómo ha evolucionado tu propósito, emociones y forma de relacionarte con la vida.",
                icon: TrendingUp,
                gradient: "from-blue-400/20 to-cyan-500/20",
                border: "border-blue-400/30",
                iconColor: "text-blue-400"
              },
              {
                title: "Nodo Norte y Nodo Sur",
                description: "Qué etapa estás cerrando y hacia dónde necesitas avanzar.",
                icon: Compass,
                gradient: "from-green-400/20 to-emerald-500/20",
                border: "border-green-400/30",
                iconColor: "text-green-400"
              },
              {
                title: "Heridas y sombras a sanar",
                description: "Análisis de Quirón y Lilith: bloqueos, patrones y procesos de liberación.",
                icon: Heart,
                gradient: "from-pink-400/20 to-red-500/20",
                border: "border-pink-400/30",
                iconColor: "text-pink-400"
              },
              {
                title: "Eventos astrológicos clave del año",
                description: "Eclipses, retrogradaciones y tránsitos importantes aplicados a tu carta.",
                icon: Zap,
                gradient: "from-purple-400/20 to-pink-500/20",
                border: "border-purple-400/30",
                iconColor: "text-purple-400"
              },
              {
                title: "Lunas nuevas y lunas llenas",
                description: "Cómo influyen en tus emociones, cuerpo, vínculos y decisiones.",
                icon: Moon,
                gradient: "from-indigo-400/20 to-blue-500/20",
                border: "border-indigo-400/30",
                iconColor: "text-indigo-400"
              },
              {
                title: "Agenda mensual personalizada",
                description: "Con claves, momentos de acción, pausas conscientes y portales de transformación.",
                icon: Calendar,
                gradient: "from-cyan-400/20 to-blue-500/20",
                border: "border-cyan-400/30",
                iconColor: "text-cyan-400"
              },
              {
                title: "Rituales, afirmaciones y prácticas energéticas",
                description: "Indicadas por fechas para acompañar cada proceso del año.",
                icon: Sparkles,
                gradient: "from-yellow-400/20 to-orange-500/20",
                border: "border-yellow-400/30",
                iconColor: "text-yellow-400"
              },
              {
                title: "Tu energía con el dinero y la abundancia",
                description: "Bloqueos, talentos, rituales y consejos financieros conscientes.",
                icon: TrendingUp,
                gradient: "from-green-400/20 to-emerald-500/20",
                border: "border-green-400/30",
                iconColor: "text-green-400"
              },
              {
                title: "Vocación y propósito laboral",
                description: "Trabajo, dirección profesional y misión vital.",
                icon: Briefcase,
                gradient: "from-blue-400/20 to-indigo-500/20",
                border: "border-blue-400/30",
                iconColor: "text-blue-400"
              },
              {
                title: "Visualizaciones astrológicas",
                description: "Para alinear mente, cuerpo y alma.",
                icon: Heart,
                gradient: "from-pink-400/20 to-purple-500/20",
                border: "border-pink-400/30",
                iconColor: "text-pink-400"
              },
              {
                title: "Cierre del ciclo",
                description: "Con afirmaciones de poder y visión clara de tu nueva versión.",
                icon: CheckCircle,
                gradient: "from-purple-400/20 to-pink-500/20",
                border: "border-purple-400/30",
                iconColor: "text-purple-400"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} rounded-3xl p-8 hover:scale-105 transition-all duration-300 relative group`}>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>

                  <div className={`bg-gradient-to-r ${feature.gradient} border ${feature.border} rounded-full p-4 backdrop-blur-sm mb-6 w-fit`}>
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 leading-snug">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOQUE DE CONFIANZA */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 text-center relative">
            <div className="absolute top-6 right-6 w-5 h-5 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>

            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-blue-400/20 to-cyan-500/20 border border-blue-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <CheckCircle className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black mb-8 leading-tight">
              Diseñada para
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent"> entenderte</span>,
              <br />no para confundirte
            </h2>

            <div className="space-y-6 text-xl text-gray-200 leading-relaxed">
              <p className="text-white font-medium">No necesitas saber astrología.</p>
              <p>Todo está explicado paso a paso, de forma clara y práctica.</p>

              <div className="mt-8 space-y-3">
                <p className="text-white font-semibold">Es espiritual.</p>
                <p className="text-white font-semibold">Es emocional.</p>
                <p className="text-white font-semibold text-2xl">Y también es aplicable a tu vida real.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE REGALO */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-900/20 to-purple-900/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="bg-gradient-to-r from-pink-400/20 to-red-500/20 border border-pink-400/30 rounded-full p-6 backdrop-blur-sm relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
              <Gift className="w-10 h-10 text-pink-400" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 leading-tight">
            Un regalo que
            <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"> acompaña todo un año</span>
          </h2>

          <div className="space-y-6 text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            <p className="text-white font-medium text-2xl">
              Tu Vuelta al Sol es un regalo consciente, íntimo y transformador.
            </p>
            <p className="text-white font-semibold">No se guarda en un cajón.</p>
            <p className="text-white font-semibold text-2xl">Se vive.</p>

            <p className="mt-8 text-gray-300">
              Ideal para cumpleaños, cierres de ciclo o momentos de cambio.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 relative">
            <div className="absolute top-6 right-6 w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>

            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-8 backdrop-blur-sm relative">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                <Sun className="w-12 h-12 text-yellow-400" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 leading-tight">
              Tu nuevo ciclo
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> ya empezó</span>
            </h2>

            <div className="space-y-4 text-2xl lg:text-3xl text-gray-200 mb-12 leading-relaxed">
              <p>La pregunta es:</p>
              <p className="text-white font-bold">¿vas a vivirlo igual que siempre…</p>
              <p className="text-white font-bold text-3xl">o con conciencia?</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Link
                href="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-6 px-12 rounded-2xl text-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Crear mi Vuelta al Sol
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center text-gray-400">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>Agenda personalizada • Para ti o para regalar • Acompañamiento todo el año</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
