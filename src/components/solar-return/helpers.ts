export function getAspectSymbol(aspectType: string): string {
  const symbols: Record<string, string> = {
    'Conjunción': '☌',
    'Oposición': '☍',
    'Trígono': '△',
    'Cuadratura': '□',
    'Sextil': '⚹'
  };
  return symbols[aspectType] || '◇';
}

export function getAspectColor(aspectType: string): string {
  const colors: Record<string, string> = {
    'Conjunción': 'bg-yellow-600/30 border border-yellow-400/40 text-yellow-200',
    'Oposición': 'bg-red-600/30 border border-red-400/40 text-red-200',
    'Trígono': 'bg-green-600/30 border border-green-400/40 text-green-200',
    'Cuadratura': 'bg-orange-600/30 border border-orange-400/40 text-orange-200',
    'Sextil': 'bg-blue-600/30 border border-blue-400/40 text-blue-200'
  };
  return colors[aspectType] || 'bg-purple-600/30 border border-purple-400/40 text-purple-200';
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

// Helper function to get month with year
export function getMonthWithYear(birthDate: string, monthOffset: number, currentYear: number): string {
  const monthName = getMonthName(birthDate, monthOffset);
  const date = new Date(birthDate);
  const birthMonth = date.getMonth();

  // Calculate if we're in the next year
  const yearsToAdd = Math.floor((birthMonth + monthOffset) / 12);
  const year = currentYear + yearsToAdd;

  return `${monthName} ${year}`;
}

// Helper function to get month name in Spanish from birthday
export function getMonthName(birthDate: string, monthOffset: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const date = new Date(birthDate);
  const birthMonth = date.getMonth(); // 0-11
  const targetMonth = (birthMonth + monthOffset) % 12;

  return months[targetMonth];
}
