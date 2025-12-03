import { useTranslations } from 'next-intl';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tu Vuelta al Sol - Agenda Astrológica Personalizada',
  description: 'Descubre tu propósito astrológico con una agenda personalizada basada en tu carta natal. Sana tu alma y conecta con la sabiduría de las estrellas.',
};

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Testimonials />
    </>
  );
}
