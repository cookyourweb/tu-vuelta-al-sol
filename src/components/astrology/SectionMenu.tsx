// src/components/astrology/SectionMenu.tsx
// Componente de menú de navegación extraído del ChartDisplay

import React from 'react';
import type { MenuItemConfig } from '../../types/astrology/chartDisplay';

interface SectionMenuProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const SectionMenu: React.FC<SectionMenuProps> = ({ activeSection, scrollToSection }) => {
  const menuItems: MenuItemConfig[] = [
    { 
      id: 'carta-visual', 
      label: 'Carta', 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10,8 16,12 10,16"/>
        </svg>
      )
    },
    { 
      id: 'aspectos-detectados', 
      label: 'Aspectos', 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
        </svg>
      )
    },
    { 
      id: 'posiciones-planetarias', 
      label: 'Planetas', 
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeSection === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 text-blue-300' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <IconComponent />
            <span>{item.label}</span>
            {isActive && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SectionMenu;