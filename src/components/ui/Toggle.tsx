// src/components/ui/Toggle.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  color?: 'yellow' | 'purple' | 'green' | 'blue';
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  size = 'md',
  disabled = false,
  color = 'yellow',
  className
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!disabled && (event.key === ' ' || event.key === 'Enter')) {
      event.preventDefault();
      onChange(!checked);
    }
  };

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      toggle: 'w-8 h-4',
      ball: 'w-3 h-3',
      translate: 'translate-x-4',
      label: 'text-sm'
    },
    md: {
      toggle: 'w-11 h-6',
      ball: 'w-5 h-5',
      translate: 'translate-x-5',
      label: 'text-base'
    },
    lg: {
      toggle: 'w-14 h-8',
      ball: 'w-7 h-7',
      translate: 'translate-x-6',
      label: 'text-lg'
    }
  };

  // Configuración de colores
  const colorConfig = {
    yellow: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    green: 'bg-gradient-to-r from-green-400 to-emerald-500',
    blue: 'bg-gradient-to-r from-blue-400 to-cyan-500'
  };

  const config = sizeConfig[size];

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className
      )}
    >
      {/* Label izquierdo */}
      {label && labelPosition === 'left' && (
        <span className={cn('text-white select-none', config.label)}>
          {label}
        </span>
      )}

      {/* Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex items-center rounded-full',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-yellow-400/50',
          config.toggle,
          checked ? colorConfig[color] : 'bg-gray-600',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 inline-block rounded-full',
            'bg-white shadow-lg transform transition-transform duration-200',
            config.ball,
            checked && config.translate
          )}
        />
      </button>

      {/* Label derecho */}
      {label && labelPosition === 'right' && (
        <span className={cn('text-white select-none', config.label)}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;