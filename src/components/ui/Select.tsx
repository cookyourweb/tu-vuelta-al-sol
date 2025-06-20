// src/components/ui/Select.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string | React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  label,
  error,
  helperText,
  disabled = false,
  searchable = false,
  clearable = false,
  className,
  fullWidth = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus en el input de búsqueda cuando se abre
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = searchable
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={cn('space-y-1', fullWidth && 'w-full')}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-white mb-1">
          {label}
        </label>
      )}

      {/* Select */}
      <div ref={selectRef} className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-3 bg-white/10 border rounded-xl',
            'backdrop-blur-sm text-left',
            'focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-400 focus:ring-red-400/50' : 'border-white/20',
            className
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedOption ? (
                <>
                  {selectedOption.icon && (
                    <span className="flex-shrink-0">
                      {typeof selectedOption.icon === 'string' 
                        ? selectedOption.icon 
                        : selectedOption.icon}
                    </span>
                  )}
                  <span className="text-white truncate">{selectedOption.label}</span>
                </>
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center gap-2 ml-2">
              {clearable && value && !disabled && (
                <button
                  onClick={handleClear}
                  className="p-1 hover:bg-white/10 rounded"
                  aria-label="Limpiar selección"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <ChevronDown className={cn(
                'w-5 h-5 text-gray-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )} />
            </div>
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-gradient-to-br from-indigo-950 via-purple-900 to-black border border-purple-400/30 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-purple-400/20">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    className={cn(
                      'w-full px-4 py-2 text-left flex items-center gap-3',
                      'hover:bg-purple-500/20 transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      option.value === value && 'bg-purple-500/30'
                    )}
                  >
                    {option.icon && (
                      <span className="flex-shrink-0">
                        {typeof option.icon === 'string' 
                          ? option.icon 
                          : option.icon}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-400 truncate">{option.description}</div>
                      )}
                    </div>
                    {option.value === value && (
                      <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-center">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper text o error */}
      {(error || helperText) && (
        <p className={cn(
          'text-sm mt-1',
          error ? 'text-red-400' : 'text-gray-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;