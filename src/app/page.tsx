// src/app/page.tsx
import Link from 'next/link';
import { 
  Star, 
  Sparkles, 
  Moon, 
  Sun, 
  Users, 
  Calendar, 
  Heart, 
  Briefcase, 
  Sprout,
  ArrowRight,
  Quote,
  CheckCircle,
  Zap,
  Clock
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

      {/* Hero Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            
            {/* Icono principal */}
            <div className="flex justify-center items-center mb-12">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-12 backdrop-blur-sm relative">
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
                <Star className="w-16 h-16 text-yellow-400" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              ¿Y si las estrellas ya
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> saben tu futuro</span>?
            </h1>

            <p className="text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto mb-12 leading-relaxed text-gray-300">
              Las estrellas saben cómo eres,<br />
              qué se te da bien y cómo reaccionas ante la vida.<br />
              Cada año los ciclos cambian,<br />
              y tu cumpleaños marca el inicio de uno nuevo.
            </p>

            <div className="bg-gradient-to-r from-pink-400/10 to-red-500/10 border border-pink-400/30 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-pink-400 mr-3" />
                <span className="font-bold text-pink-300 text-lg">Agenda astrológica personalizada</span>
              </div>
              <p className="text-gray-400">
                con consejos y guía práctica<br />
                para vivir tu año de una manera única: <strong className="text-white">la tuya</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Link
                href="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-6 px-12 rounded-2xl text-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Descubrir mi destino
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

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 border border-purple-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <Moon className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
              Lo que ya venía 
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> escrito sobre ti</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Al nacer, el cosmos escribió tu historia. Tu carta natal revela quién eres, 
              y tu carta progresada te muestra qué te espera este año.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Tu Carta Natal: El ADN Cósmico",
                description: "Lo que ya venía escrito cuando naciste: tu personalidad, talentos, miedos, el tipo de amor que necesitas y cómo vas a conseguir dinero. Todo estaba ahí desde el segundo cero.",
                icon: Star,
                gradient: "from-yellow-400/20 to-orange-500/20",
                border: "border-yellow-400/30",
                iconColor: "text-yellow-400"
              },
              {
                title: "Tu Agenda Cósmica Digital",
                description: "Desde tu último cumpleaños hasta el próximo, tu calendario personalizado te guía con tu carta progresada, eventos astrológicos del año, consejos según tu personalidad y rituales de poder.",
                icon: Calendar,
                gradient: "from-blue-400/20 to-cyan-500/20",
                border: "border-blue-400/30",
                iconColor: "text-blue-400"
              },
              {
                title: "Tu Vuelta al Sol - Guía Transformacional",
                description: "Descubre el poder transformador de tu nueva vuelta al sol. Una guía astrológica anual personalizada que te acompañará en tu evolución, sanación emocional y manifestación de tus sueños más profundos.",
                icon: Sparkles,
                gradient: "from-purple-400/20 to-pink-500/20",
                border: "border-purple-400/30",
                iconColor: "text-purple-400"
              },
              {
                title: "Sanación Emocional Profunda",
                description: "Libera patrones kármicos ancestrales y sana heridas del alma que han bloqueado tu crecimiento. Tu carta natal revela exactamente qué necesitas sanar y cuándo hacerlo.",
                icon: Heart,
                gradient: "from-pink-400/20 to-red-500/20",
                border: "border-pink-400/30",
                iconColor: "text-pink-400"
              },
              {
                title: "Tu Propósito de Vida Revelado",
                description: "Conecta con tu misión evolutiva y destino único en esta encarnación. No más dudas sobre tu camino: tu carta natal te muestra exactamente para qué viniste a este mundo.",
                icon: Briefcase,
                gradient: "from-green-400/20 to-emerald-500/20",
                border: "border-green-400/30",
                iconColor: "text-green-400"
              },
              {
                title: "Abundancia Consciente",
                description: "Manifiesta prosperidad alineada con tu alma y propósito superior. Descubre los momentos cósmicos perfectos para atraer riqueza material y espiritual a tu vida.",
                icon: Zap,
                gradient: "from-red-400/20 to-pink-500/20",
                border: "border-red-400/30",
                iconColor: "text-red-400"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} rounded-3xl p-8 hover:scale-105 transition-all duration-300 relative group`}>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                  
                  <div className={`bg-gradient-to-r ${feature.gradient} border ${feature.border} rounded-full p-4 backdrop-blur-sm mb-6 w-fit`}>
                    <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 border border-green-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <Zap className="w-10 h-10 text-green-400" />
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
              ¿Cómo 
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"> funciona</span>?
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tres simples pasos para obtener tu agenda astrológica personalizada y comenzar tu transformación.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                title: "Descifra tu código",
                description: "Ingresa tu fecha, hora y lugar de nacimiento. En segundos, desbloquearemos los secretos que el universo escribió sobre ti.",
                icon: Users,
                number: "1",
                gradient: "from-blue-400/20 to-cyan-500/20",
                border: "border-blue-400/30",
                iconColor: "text-blue-400"
              },
              {
                title: "Revelaciones instantáneas",
                description: "Tu carta natal se genera automáticamente, revelando patrones de amor, dinero, carrera y destino que nunca imaginaste.",
                icon: Moon,
                number: "2",
                gradient: "from-purple-400/20 to-pink-500/20",
                border: "border-purple-400/30",
                iconColor: "text-purple-400"
              },
              {
                title: "Tu hoja de ruta",
                description: "Recibe fechas exactas, estrategias personalizadas y tu agenda del destino impresa para llevar contigo toda la sabiduría cósmica.",
                icon: Sun,
                number: "3",
                gradient: "from-yellow-400/20 to-orange-500/20",
                border: "border-yellow-400/30",
                iconColor: "text-yellow-400"
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${step.gradient} backdrop-blur-sm border ${step.border} rounded-3xl p-10 hover:scale-105 transition-all duration-300 relative`}>
                  <div className="absolute -top-6 -left-6 bg-gradient-to-r from-white to-gray-200 text-black w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black shadow-2xl">
                    {step.number}
                  </div>
                  <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                  
                  <div className={`bg-gradient-to-r ${step.gradient} border ${step.border} rounded-full p-6 backdrop-blur-sm mb-8 w-fit mx-auto`}>
                    <IconComponent className={`w-10 h-10 ${step.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-center">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
              ¿Qué incluye tu
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> agenda astrológica personalizada</span>?
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
              Cada agenda se crea desde cero a partir de tus datos natales.<br />
              <strong className="text-white">No hay dos iguales.</strong>
            </p>

            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Tu Vuelta al Sol es una combinación de interpretación profunda y guía práctica,<br />
              diseñada para acompañarte durante todo tu año solar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {[
              {
                title: "🔮 Interpretación de tu carta natal",
                description: "Una lectura clara y profunda de tu carta natal para entender cómo eres, cuáles son tus talentos naturales y qué patrones influyen en tu vida.",
                gradient: "from-yellow-400/20 to-orange-500/20",
                border: "border-yellow-400/30"
              },
              {
                title: "🌞 Análisis de tu retorno solar",
                description: "Un estudio detallado del año que comienzas en tu cumpleaños: qué áreas se activan, qué retos aparecen y dónde están las oportunidades de crecimiento.",
                gradient: "from-orange-400/20 to-red-500/20",
                border: "border-orange-400/30"
              },
              {
                title: "📅 Agenda organizada por tu año solar",
                description: "Una agenda diseñada desde tu cumpleaños hasta el siguiente, donde integramos los tránsitos y eventos astrológicos más relevantes aplicados a tu carta.",
                gradient: "from-blue-400/20 to-cyan-500/20",
                border: "border-blue-400/30"
              },
              {
                title: "🧭 Consejos personalizados",
                description: "Orientación práctica adaptada a tus fortalezas y bloqueos, para ayudarte a tomar decisiones más alineadas contigo en cada etapa del año.",
                gradient: "from-green-400/20 to-emerald-500/20",
                border: "border-green-400/30"
              },
              {
                title: "🎁 Formato ideal para ti o para regalar",
                description: "Una experiencia única y significativa, perfecta tanto para uso personal como para sorprender a alguien especial con un regalo diferente y consciente.",
                gradient: "from-pink-400/20 to-red-500/20",
                border: "border-pink-400/30"
              }
            ].map((item, index) => (
              <div key={index} className={`bg-gradient-to-br ${item.gradient} backdrop-blur-sm border ${item.border} rounded-3xl p-8 hover:scale-105 transition-all duration-300 relative`}>
                <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Bloque diferencial */}
          <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-8 backdrop-blur-sm max-w-4xl mx-auto mb-8 text-center">
            <p className="text-xl text-white leading-relaxed mb-2">
              Tu agenda no te dice qué "deberías" hacer.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Te ayuda a comprender qué se mueve en tu vida y cómo aprovecharlo según quién eres.
            </p>
            <p className="text-base text-gray-400 italic mt-4">
              Es una guía, no una imposición.
            </p>
          </div>

          {/* CTA suave */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl text-lg hover:from-purple-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              Quiero mi agenda personalizada
            </Link>
          </div>

        </div>
      </section>

      {/* Testimonials Section - COMENTADO PARA EL FUTURO */}
      {/*
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-20">
            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-pink-400/20 to-red-500/20 border border-pink-400/30 rounded-full p-6 backdrop-blur-sm relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                <Quote className="w-10 h-10 text-pink-400" />
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
              Testimonios que te van a 
              <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent"> impactar</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Personas reales que cambiaron su vida usando información que estaba esperándolos en las estrellas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "No podía creer cuando vi que mi carta decía que encontraría el amor en octubre... ¡y fue exactamente cuando conocí a mi actual pareja! Escalofriante y hermoso.",
                author: "Elena S.",
                role: "Encontró el amor",
                gradient: "from-pink-400/10 to-red-500/10",
                border: "border-pink-400/30"
              },
              {
                quote: "Mi agenda me dijo que abril sería perfecto para cambiar de trabajo. Lo hice y ahora gano el doble. Esto no es casualidad, es ciencia cósmica.",
                author: "Miguel R.",
                role: "Duplicó sus ingresos",
                gradient: "from-green-400/10 to-emerald-500/10",
                border: "border-green-400/30"
              },
              {
                quote: "Llevaba años repitiendo los mismos errores en relaciones. Mi carta me mostró exactamente por qué y cómo romper el patrón. Ahora soy libre.",
                author: "Carmen L.",
                role: "Rompió patrones tóxicos",
                gradient: "from-purple-400/10 to-pink-500/10",
                border: "border-purple-400/30"
              }
            ].map((testimonial, index) => (
              <div key={index} className={`bg-gradient-to-br ${testimonial.gradient} backdrop-blur-sm border ${testimonial.border} rounded-3xl p-8 hover:scale-105 transition-all duration-300 relative`}>
                <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white font-bold text-2xl">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xl font-bold text-white">{testimonial.author}</h4>
                    <p className="text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-300 leading-relaxed italic text-lg">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 relative">
            <div className="absolute top-6 right-6 w-5 h-5 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
            
            <div className="flex justify-center items-center mb-8">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-8 backdrop-blur-sm relative">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8">
              Tu vida va a cambiar 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> para siempre</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              En 2 minutos sabrás más sobre tu futuro que en años de terapia. 
              Las respuestas están en las estrellas, nosotros solo las traducimos.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-6 px-12 rounded-2xl text-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center"
              >
                <Zap className="w-6 h-6 mr-3" />
                Revelar mi destino AHORA
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center text-gray-400">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>Resultados inmediatos • Sin trucos • Información que cambia vidas</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}