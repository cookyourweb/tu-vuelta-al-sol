import React from 'react';

// Componente de navegación reutilizable para secciones
interface SectionNavigationProps {
  currentSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function SectionNavigation({ currentSection, onSectionChange }: SectionNavigationProps) {
  const sections = [
    { id: 'carta', label: '🌟 Carta' },
    { id: 'aspectos', label: '✨ Aspectos' },
    { id: 'planetas', label: '🪐 Planetas' },
    { id: 'linea-tiempo', label: '📅 Línea de Tiempo' },
    { id: 'integracion', label: '💫 Integración' }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-400/20">
      <nav className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
        {sections.map((section, idx) => {
          const displayId = section.id;
          const isActive = currentSection === displayId;
          return (
            <a
              key={`${section.id}-${idx}`}
              href={`#${section.id}`}
              className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-purple-700/50'
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
