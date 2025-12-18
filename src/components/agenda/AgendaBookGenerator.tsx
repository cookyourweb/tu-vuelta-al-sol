'use client';

import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';

export default function AgendaBookGenerator() {
  const router = useRouter();

  const handleGenerateBook = () => {
    router.push('/agenda/libro');
  };

  return (
    <button
      onClick={handleGenerateBook}
      className="bg-gradient-to-r from-amber-500/80 to-yellow-500/80 hover:from-amber-400/90 hover:to-yellow-400/90 transition-all duration-200 shadow-lg hover:shadow-amber-500/25 border border-white/10 p-3 rounded-full group"
      title="Generar libro completo de la agenda"
    >
      <BookOpen className="h-5 w-5 text-white group-hover:scale-110 transition-transform inline mr-2" />
      <span className="text-white text-sm font-semibold">Generar Libro Completo</span>
    </button>
  );
}
