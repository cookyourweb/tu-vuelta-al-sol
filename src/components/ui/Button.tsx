//src/components/ui/Button.tsx
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Definir variantes de botón usando objeto simple
const buttonVariants = {
  default: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none bg-purple-600 text-white hover:bg-purple-700 h-10 py-2 px-4",
  outline: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none border border-purple-200 bg-white text-purple-700 hover:bg-purple-50 h-10 py-2 px-4",
  secondary: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none bg-purple-100 text-purple-900 hover:bg-purple-200 h-10 py-2 px-4",
  ghost: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none hover:bg-purple-100 hover:text-purple-900 h-10 py-2 px-4",
  link: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none text-purple-600 underline-offset-4 hover:underline h-10 py-2 px-4",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10"
};

// Extender las props del botón HTML con nuestras variantes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonVariants;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Componente de botón que soporta múltiples variantes
const Button = ({
  children,
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) => {
  const variantClass = buttonVariants[variant] || buttonVariants.default;
  const sizeClass = buttonVariants[size] || buttonVariants.default;

  return (
    <button
      className={cn(variantClass, sizeClass, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      
      {children}
      
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
