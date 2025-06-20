// src/components/ui/Card.tsx
'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'pink' | 'indigo' | 'teal';
  variant?: 'default' | 'outlined' | 'glass' | 'solid';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  gradient = 'purple',
  variant = 'default',
  hover = false,
  clickable = false,
  onClick,
  className = "",
  headerClassName = "",
  contentClassName = "",
  size = 'md'
}) => {
  const gradientClasses = {
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-400/30',
    purple: 'from-purple-500/10 to-indigo-500/10 border-purple-400/30',
    green: 'from-green-500/10 to-emerald-500/10 border-green-400/30',
    yellow: 'from-yellow-500/10 to-orange-500/10 border-yellow-400/30',
    red: 'from-red-500/10 to-pink-500/10 border-red-400/30',
    pink: 'from-pink-500/10 to-rose-500/10 border-pink-400/30',
    indigo: 'from-indigo-500/10 to-purple-500/10 border-indigo-400/30',
    teal: 'from-teal-500/10 to-cyan-500/10 border-teal-400/30'
  };

  const iconColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400',
    teal: 'text-teal-400'
  };

  const variantClasses = {
    default: `bg-gradient-to-br ${gradientClasses[gradient]} backdrop-blur-sm border`,
    outlined: `bg-transparent border-2 ${gradientClasses[gradient].split(' ')[1]}`,
    glass: `bg-white/5 backdrop-blur-md border border-white/20`,
    solid: `bg-gradient-to-br ${gradientClasses[gradient].replace('/10', '/20')} border`
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const handleClick = () => {
    if (onClick && (clickable || onClick)) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && (clickable || onClick)) {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-2xl 
        ${hover ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl' : ''}
        ${clickable || onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable || onClick ? 0 : undefined}
      role={clickable || onClick ? 'button' : undefined}
    >
      {/* Header */}
      {(title || subtitle || icon) && (
        <div className={`flex items-start mb-4 ${headerClassName}`}>
          {icon && (
            <div className={`mr-3 mt-1 ${iconColors[gradient]} flex-shrink-0`}>
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-lg font-bold text-white mb-1 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-300 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className={`text-white ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

// Componentes especializados
export const InfoCard: React.FC<Omit<CardProps, 'gradient'>> = (props) => (
  <Card {...props} gradient="blue" />
);

export const SuccessCard: React.FC<Omit<CardProps, 'gradient'>> = (props) => (
  <Card {...props} gradient="green" />
);

export const WarningCard: React.FC<Omit<CardProps, 'gradient'>> = (props) => (
  <Card {...props} gradient="yellow" />
);

export const ErrorCard: React.FC<Omit<CardProps, 'gradient'>> = (props) => (
  <Card {...props} gradient="red" />
);

export const AstrologyCard: React.FC<Omit<CardProps, 'gradient'>> = (props) => (
  <Card {...props} gradient="purple" />
);

export default Card;
