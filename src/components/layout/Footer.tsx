//src/components/layout/Footer.tsx

import Link from 'next/link';
import { 
  Star, 
  Calendar, 
  MapPin, 
  Moon, 
  Mail, 
  Instagram, 
  Heart, 
  Sparkles,
  Sun
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="text-white relative border-t border-white/10 backdrop-blur-sm">
      {/* Estrellas decorativas locales */}
      <div className="absolute top-8 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-16 right-32 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute bottom-12 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-700"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Sección principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full p-4 backdrop-blur-sm mr-4">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <Link href="/" className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Tu Vuelta al Sol
              </Link>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-lg">
              Descubre el poder transformador de tu nueva vuelta al sol. Una guía astrológica anual 
              personalizada que te acompañará en tu evolución, sanación emocional y manifestación 
              de tus sueños más profundos.
            </p>
            
            {/* CTA en footer */}
            <div className="bg-gradient-to-r from-purple-400/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center mb-3">
                <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                <span className="font-semibold text-purple-300">¿Listo para comenzar?</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Únete a miles de personas que han transformado sus vidas con la sabiduría de las estrellas.
              </p>
              <Link 
                href="/register"
                className="inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105"
              >
                <Star className="w-4 h-4 mr-2" />
                Comenzar mi viaje
              </Link>
            </div>
          </div>
          
          {/* Enlaces de navegación */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Moon className="w-5 h-5 mr-2 text-blue-400" />
              Explorar
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Star className="w-4 h-4 mr-2 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/birth-data" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 group-hover:text-green-400 transition-colors" />
                  Datos de Nacimiento
                </Link>
              </li>
              <li>
                <Link 
                  href="/natal-chart" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Moon className="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  Carta Natal
                </Link>
              </li>
              <li>
                <Link 
                  href="/agenda" 
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                >
                  <Sun className="w-4 h-4 mr-2 text-gray-500 group-hover:text-orange-400 transition-colors" />
                  Agenda Astrológica
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contacto y legal */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-400" />
              Conecta
            </h3>
            
            {/* Contacto */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Contacto</h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="mailto:wunjocreations@gmail.com" 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <Mail className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
                    wunjocreations@gmail.com
                  </a>
                </li>
                <li>
                  <a 
                    href="https://instagram.com/wunjocreations" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <Instagram className="w-4 h-4 mr-3 text-gray-500 group-hover:text-pink-400 transition-colors" />
                    @wunjocreations
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/terms" 
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-300 text-sm"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-gray-400 hover:text-gray-300 transition-colors duration-300 text-sm"
                  >
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Línea divisoria */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            
            {/* Copyright */}
            <div className="mb-6 md:mb-0">
              <p className="text-gray-400 text-sm flex items-center">
                <span>&copy; {new Date().getFullYear()} Wunjo Creations. Todos los derechos reservados.</span>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Hecho con <Heart className="w-3 h-3 inline mx-1 text-pink-400" /> para exploradores del cosmos
              </p>
            </div>
            
            {/* Redes sociales */}
            <div className="flex items-center space-x-6">
              <a 
                href="https://instagram.com/wunjocreations" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              
              <a 
                href="mailto:wunjocreations@gmail.com" 
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"
              >
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Mensaje inspiracional final */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="font-semibold text-yellow-300">Mensaje del Cosmos</span>
            </div>
            <p className="text-gray-300 text-sm italic">
              "Las estrellas que brillaron en tu nacimiento siguen guiándote. 
              Cada día es una oportunidad para alinearte con tu destino."
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;