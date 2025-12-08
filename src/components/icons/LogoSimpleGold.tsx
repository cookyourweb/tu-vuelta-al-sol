// src/components/icons/LogoSimpleGold.tsx
import React from 'react';

interface LogoSimpleGoldProps {
  className?: string;
  size?: number;
}

export default function LogoSimpleGold({ className = '', size = 48 }: LogoSimpleGoldProps) {
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
        {/* Gradiente DORADO para el sol - Oro brillante */}
        <radialGradient id="sunGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />   {/* Oro brillante */}
          <stop offset="40%" stopColor="#FFA500" />  {/* Naranja dorado */}
          <stop offset="100%" stopColor="#FF8C00" /> {/* Naranja oscuro */}
        </radialGradient>

        {/* Gradiente para rayos - Brillo dorado */}
        <linearGradient id="raysGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>

        {/* Gradiente para órbita */}
        <linearGradient id="orbitGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Órbita */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="url(#orbitGold)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="6 4"
      />

      {/* Resplandor exterior - Brillo dorado difuso */}
      <circle
        cx="50"
        cy="50"
        r="28"
        fill="url(#sunGold)"
        opacity="0.2"
        filter="blur(2px)"
      />

      {/* Resplandor del sol - Más grande para mejor visibilidad */}
      <circle
        cx="50"
        cy="50"
        r="24"
        fill="url(#sunGold)"
        opacity="0.4"
      />

      {/* Sol central - Dorado brillante */}
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="url(#sunGold)"
      />

      {/* Círculo interior - Brillo central */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="#FFD700"
        opacity="0.8"
      />

      {/* Rayos del sol - Dorados y más largos */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(radians) * 20;
        const y1 = 50 + Math.sin(radians) * 20;
        const x2 = 50 + Math.cos(radians) * 30;
        const y2 = 50 + Math.sin(radians) * 30;

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#raysGold)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      })}

      {/* Rayos secundarios (más finos, entre los principales) */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(radians) * 22;
        const y1 = 50 + Math.sin(radians) * 22;
        const x2 = 50 + Math.cos(radians) * 28;
        const y2 = 50 + Math.sin(radians) * 28;

        return (
          <line
            key={`secondary-${index}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />
        );
      })}

      {/* Estrellas - Doradas sutiles */}
      <circle cx="75" cy="18" r="3" fill="#FFD700" opacity="0.8" />
      <circle cx="22" cy="30" r="2.5" fill="#FFA500" opacity="0.7" />
      <circle cx="78" cy="72" r="2.5" fill="#FFD700" opacity="0.8" />
      <circle cx="28" cy="75" r="3" fill="#FFA500" opacity="0.75" />
    </svg>
  );
}
