// src/components/ui/Label.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  variant?: 'default' | 'gradient' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

const Label: React.FC<LabelProps> = ({
  children,
  required = false,
  optional = false,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const variantClasses = {
    default: 'text-white',
    gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent',
    accent: 'text-purple-400'
  };

  return (
    <label
      className={cn(
        'block font-medium mb-1.5',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-400 ml-1" aria-label="Campo requerido">
          *
        </span>
      )}
      {optional && (
        <span className="text-gray-400 ml-1 text-xs font-normal">
          (opcional)
        </span>
      )}
    </label>
  );
};

export default Label;