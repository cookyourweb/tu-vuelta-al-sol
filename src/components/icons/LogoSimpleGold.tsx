import React from 'react';

interface LogoSimpleGoldProps {
  className?: string;
  size?: number;
}

export default function LogoSimpleGold({ className = '', size = 40 }: LogoSimpleGoldProps) {
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
        {/* Gradiente dorado para el sol */}
        <radialGradient id="sunGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>

        {/* Gradiente dorado para órbita */}
        <linearGradient id="orbitGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFA500" stopOpacity="0.3" />
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

      {/* Resplandor del sol */}
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="url(#sunGold)"
        opacity="0.3"
      />

      {/* Sol central */}
      <circle
        cx="50"
        cy="50"
        r="14"
        fill="url(#sunGold)"
      />

      {/* Rayos del sol - más prominentes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(radians) * 16;
        const y1 = 50 + Math.sin(radians) * 16;
        const x2 = 50 + Math.cos(radians) * 24;
        const y2 = 50 + Math.sin(radians) * 24;

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FFD700"
            strokeWidth="3"
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
