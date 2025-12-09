// src/components/icons/LogoSimple.tsx
import React from 'react';

interface LogoSimpleProps {
  className?: string;
  size?: number;
}

export default function LogoSimple({ className = '', size = 40 }: LogoSimpleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradiente para el sol */}
        <radialGradient id="sunSimple" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        
        {/* Gradiente para órbita */}
        <linearGradient id="orbitSimple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Órbita */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="url(#orbitSimple)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6 4"
      />

      {/* Resplandor del sol - Más grande para mejor visibilidad */}
      <circle
        cx="50"
        cy="50"
        r="24"
        fill="url(#sunSimple)"
        opacity="0.3"
      />

      {/* Sol central - Aumentado para mejor visibilidad en móvil */}
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="url(#sunSimple)"
      />

      {/* Rayos del sol - Más largos y visibles */}
      {[0, 90, 180, 270].map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(radians) * 20;
        const y1 = 50 + Math.sin(radians) * 20;
        const x2 = 50 + Math.cos(radians) * 28;
        const y2 = 50 + Math.sin(radians) * 28;
        
        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FCD34D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}

      {/* Estrellas - simplificadas */}
      <circle cx="75" cy="18" r="3" fill="#FFFFFF" />
      <circle cx="22" cy="30" r="2.5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="78" cy="72" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="28" cy="75" r="3" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}