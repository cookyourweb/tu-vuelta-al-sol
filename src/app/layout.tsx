// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
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
  title: 'Tu Vuelta al Sol - Agenda Astrológica Personalizada',
  description: 'Genera agendas astrológicas personalizadas basadas en tu carta natal y progresada.',
  keywords: 'astrología, carta natal, agenda astrológica, horóscopo personalizado',
  authors: [{ name: 'Wunjo Creations' }],
  creator: 'Wunjo Creations',
  openGraph: {
    title: 'Tu Vuelta al Sol - Agenda Astrológica Personalizada',
    description: 'Descubre tu camino astrológico con una agenda personalizada basada en tu carta natal.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans">
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}