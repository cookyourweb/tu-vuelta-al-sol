// src/app/layout.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import WelcomeModal from '@/components/modals/WelcomeModal';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Tu Vuelta al Sol - Descubre tu Destino Astrológico',
  description: 'Genera tu agenda astrológica personalizada basada en tu carta natal. Descubre tu propósito, sana tu alma y conecta con la sabiduría de las estrellas.',
  keywords: 'astrología, carta natal, agenda astrológica, horóscopo personalizado, vuelta al sol, astrología evolutiva',
  authors: [{ name: 'Wunjo Creations' }],
  creator: 'Wunjo Creations',
  openGraph: {
    title: 'Tu Vuelta al Sol - Descubre tu Destino Astrológico',
    description: 'Descubre tu camino astrológico con una agenda personalizada basada en tu carta natal y progresada.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tu Vuelta al Sol - Agenda Astrológica Personalizada',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tu Vuelta al Sol - Descubre tu Destino Astrológico',
    description: 'Conecta con la sabiduría de las estrellas y descubre tu verdadero propósito.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KL65QQ2T');`}
        </Script>

        {/* Optimizaciones de rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon y iconos de la app */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Tema de color para mobile */}
        <meta name="theme-color" content="#4c1d95" />
        <meta name="msapplication-TileColor" content="#4c1d95" />
        
        {/* Viewport optimizado */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      
      <body className="min-h-screen font-sans antialiased bg-gradient-to-br from-indigo-950 via-purple-900 to-black text-white relative overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KL65QQ2T"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* 🌟 FONDO MÁGICO GLOBAL */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Gradientes mágicos superpuestos */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/5 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent"></div>
          
          {/* ✨ CONSTELACIÓN DE ESTRELLAS ANIMADAS */}
          
          {/* Estrellas principales - grandes y brillantes */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50" 
               style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)' }}></div>
          <div className="absolute top-32 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300 shadow-lg shadow-blue-400/50"
               style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.6)' }}></div>
          <div className="absolute top-64 left-1/4 w-5 h-5 bg-purple-400 rounded-full animate-pulse delay-1000 shadow-lg shadow-purple-400/50"
               style={{ boxShadow: '0 0 25px rgba(196, 181, 253, 0.6)' }}></div>
          <div className="absolute top-96 right-1/3 w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-700 shadow-lg shadow-pink-400/50"
               style={{ boxShadow: '0 0 20px rgba(244, 114, 182, 0.6)' }}></div>
          
          {/* Estrellas medianas - constelaciones */}
          <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-500 shadow-md shadow-yellow-300/40"
               style={{ boxShadow: '0 0 12px rgba(253, 224, 71, 0.5)' }}></div>
          <div className="absolute bottom-48 right-1/4 w-4 h-4 bg-blue-300 rounded-full animate-bounce delay-1200 shadow-md shadow-blue-300/40"
               style={{ boxShadow: '0 0 15px rgba(147, 197, 253, 0.5)' }}></div>
          <div className="absolute top-1/2 left-20 w-3 h-3 bg-purple-300 rounded-full animate-pulse delay-800 shadow-md shadow-purple-300/40"
               style={{ boxShadow: '0 0 12px rgba(216, 180, 254, 0.5)' }}></div>
          <div className="absolute bottom-64 right-10 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-400 shadow-md shadow-yellow-400/40"
               style={{ boxShadow: '0 0 12px rgba(251, 191, 36, 0.5)' }}></div>
          
          {/* Estrellas pequeñas - polvo cósmico */}
          <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-pulse delay-600 opacity-70"></div>
          <div className="absolute bottom-1/3 left-1/5 w-2 h-2 bg-cyan-300 rounded-full animate-bounce delay-900 opacity-60"></div>
          <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-pink-300 rounded-full animate-pulse delay-1100 opacity-75"></div>
          <div className="absolute top-1/6 right-2/5 w-2 h-2 bg-purple-200 rounded-full animate-bounce delay-1300 opacity-65"></div>
          <div className="absolute bottom-1/6 left-2/5 w-2 h-2 bg-yellow-200 rounded-full animate-pulse delay-1500 opacity-70"></div>
          
          {/* Estrellas dinámicas adicionales para más magia */}
          <div className="absolute top-1/4 left-3/4 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse delay-200 shadow-sm"></div>
          <div className="absolute bottom-1/4 right-3/4 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-bounce delay-1000 shadow-sm"></div>
          <div className="absolute top-2/3 left-1/6 w-3 h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-pulse delay-1400 shadow-sm"></div>
          
          {/* ✨ DESTELLOS SUTILES - ondas de luz */}
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping delay-2000 opacity-50"></div>
          <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-2500 opacity-40"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-3000 opacity-45"></div>
        </div>

        {/* 🔮 APLICACIÓN PRINCIPAL - Solo proveedores */}
        <AuthProvider>
          <NotificationProvider>
            <div className="relative z-10 min-h-screen">
              {/* IMPORTANTE: No header aquí - cada layout maneja el suyo */}
              <WelcomeModal />
              {children}
            </div>
          </NotificationProvider>
        </AuthProvider>

        {/* 🌙 EFECTOS ADICIONALES DE INMERSIÓN */}
        <div className="fixed inset-0 pointer-events-none">
          {/* Resplandor sutil en los bordes */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-400/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent"></div>
        </div>
      </body>
    </html>
  );
}