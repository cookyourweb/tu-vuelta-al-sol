// components/ui/MagicalUIComponents.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

// =============================================================================
// MAGICAL SELECT COMPONENT
// =============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface MagicalSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

export function MagicalSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  disabled = false,
  error,
  label,
  className = ""
}: MagicalSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all backdrop-blur-sm ${
            disabled
              ? 'bg-gray-800/50 border-gray-600/30 cursor-not-allowed opacity-50'
              : error
              ? 'bg-black/30 border-red-400/50 text-white focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
              : 'bg-black/30 border-purple-400/30 text-white hover:border-purple-300/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
          }`}
        >
          <div className="flex items-center">
            {selectedOption?.icon && (
              <span className="mr-3">{selectedOption.icon}</span>
            )}
            <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-black/90 backdrop-blur-sm border border-purple-400/30 rounded-xl shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-purple-400/20">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No se encontraron opciones
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    className={`w-full p-3 text-left flex items-center justify-between transition-colors ${
                      option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-purple-500/20'
                    } ${option.value === value ? 'bg-purple-500/30' : ''}`}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <span className="mr-3">{option.icon}</span>
                      )}
                      <span className="text-white">{option.label}</span>
                    </div>
                    {option.value === value && (
                      <Check className="w-4 h-4 text-yellow-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// MAGICAL MODAL COMPONENT
// =============================================================================

interface MagicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function MagicalModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ""
}: MagicalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }
      `}</style>
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        
        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative w-full ${sizeClasses[size]} bg-gradient-to-br from-indigo-950 via-purple-900 to-black border border-purple-400/30 rounded-2xl shadow-2xl overflow-hidden ${className}`}
          style={{
            animation: isOpen ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.3s ease-in'
          }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
              {title && (
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// MAGICAL CARD COMPONENT
// =============================================================================

interface MagicalCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'pink';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MagicalCard({
  title,
  subtitle,
  children,
  icon,
  gradient = 'purple',
  hover = true,
  onClick,
  className = ""
}: MagicalCardProps) {
  const gradientClasses = {
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-400/30',
    purple: 'from-purple-500/10 to-indigo-500/10 border-purple-400/30',
    green: 'from-green-500/10 to-emerald-500/10 border-green-400/30',
    yellow: 'from-yellow-500/10 to-orange-500/10 border-yellow-400/30',
    red: 'from-red-500/10 to-pink-500/10 border-red-400/30',
    pink: 'from-pink-500/10 to-rose-500/10 border-pink-400/30'
  };

  const iconColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    pink: 'text-pink-400'
  };

  return (
    <div
      className={`
        bg-gradient-to-br ${gradientClasses[gradient]} 
        backdrop-blur-sm border rounded-2xl p-6 
        ${hover ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      {(title || subtitle || icon) && (
        <div className="flex items-center mb-4">
          {icon && (
            <div className={`mr-3 ${iconColors[gradient]}`}>
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-bold text-white mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-300">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="text-white">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// MAGICAL ALERT COMPONENT
// =============================================================================

interface MagicalAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function MagicalAlert({
  type,
  title,
  children,
  onClose,
  className = ""
}: MagicalAlertProps) {
  const alertStyles = {
    info: {
      gradient: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-400/30',
      icon: <Info className="w-5 h-5 text-blue-400" />,
      titleColor: 'text-blue-300',
      textColor: 'text-blue-200'
    },
    success: {
      gradient: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-400/30',
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      titleColor: 'text-green-300',
      textColor: 'text-green-200'
    },
    warning: {
      gradient: 'from-yellow-500/10 to-orange-500/10',
      border: 'border-yellow-400/30',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      titleColor: 'text-yellow-300',
      textColor: 'text-yellow-200'
    },
    error: {
      gradient: 'from-red-500/10 to-pink-500/10',
      border: 'border-red-400/30',
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      titleColor: 'text-red-300',
      textColor: 'text-red-200'
    }
  };

  const style = alertStyles[type];

  return (
    <div className={`
      bg-gradient-to-r ${style.gradient} 
      border ${style.border} 
      rounded-2xl p-4 backdrop-blur-sm 
      ${className}
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {style.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold mb-2 ${style.titleColor}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${style.textColor}`}>
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAGICAL TOGGLE COMPONENT
// =============================================================================

interface MagicalToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MagicalToggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = ""
}: MagicalToggleProps) {
  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' }
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex items-center ${sizes.track} 
          border-2 border-transparent rounded-full 
          transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-yellow-400/50
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${checked 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
            : 'bg-gray-600'
          }
        `}
      >
        <span
          className={`
            ${sizes.thumb} inline-block rounded-full bg-white shadow-lg 
            transform transition-transform duration-200 ease-in-out
            ${checked ? sizes.translate : 'translate-x-0'}
          `}
        />
      </button>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-white cursor-pointer"
                   onClick={() => !disabled && onChange(!checked)}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// DEMO COMPONENT
// =============================================================================

export function MagicalUIDemo() {
  const [selectValue, setSelectValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);

  const selectOptions = [
    { value: 'madrid', label: 'Madrid, España', icon: '🇪🇸' },
    { value: 'barcelona', label: 'Barcelona, España', icon: '🇪🇸' },
    { value: 'mexico', label: 'Ciudad de México, México', icon: '🇲🇽' },
    { value: 'buenos-aires', label: 'Buenos Aires, Argentina', icon: '🇦🇷' },
    { value: 'bogota', label: 'Bogotá, Colombia', icon: '🇨🇴' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            🌟 Componentes UI Mágicos
          </h1>
          <p className="text-gray-300 text-lg">Select, Modal, Card, Alert y Toggle con efectos mágicos</p>
        </div>

        {/* Demo de Select */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">🎯 Magical Select</h2>
          <MagicalSelect
            label="Selecciona tu ciudad natal"
            options={selectOptions}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Buscar ciudad..."
          />
          {selectValue && (
            <p className="mt-4 text-green-300">
              ✅ Seleccionado: <strong>{selectOptions.find(o => o.value === selectValue)?.label}</strong>
            </p>
          )}
        </div>

        {/* Demo de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MagicalCard
            title="Carta Natal"
            subtitle="Tu mapa estelar personal"
            icon={<span>🌟</span>}
            gradient="purple"
            hover={true}
            onClick={() => alert('¡Carta Natal!')}
          >
            <p className="text-sm">Descubre los secretos que las estrellas revelaron el día de tu nacimiento.</p>
          </MagicalCard>

          <MagicalCard
            title="Tránsitos"
            subtitle="Energías actuales"
            icon={<span>🌙</span>}
            gradient="blue"
            hover={true}
          >
            <p className="text-sm">Conoce las influencias planetarias que te acompañan hoy.</p>
          </MagicalCard>

          <MagicalCard
            title="Compatibilidad"
            subtitle="Sinastría amorosa"
            icon={<span>💕</span>}
            gradient="pink"
            hover={true}
          >
            <p className="text-sm">Explora la química astrológica con tu pareja o crush.</p>
          </MagicalCard>
        </div>

        {/* Demo de Alerts */}
        <div className="space-y-4">
          <MagicalAlert type="info" title="Información Cósmica">
            Los tránsitos de hoy favorecen la creatividad y la comunicación. ¡Es un buen día para expresarte!
          </MagicalAlert>

          <MagicalAlert type="success" title="¡Carta Natal Generada!">
            Tu carta natal ha sido creada exitosamente. Ya puedes explorar tu mapa estelar personal.
          </MagicalAlert>

          <MagicalAlert type="warning" title="Mercurio Retrógrado">
            Cuidado con las comunicaciones y contratos durante este período. Revisa todo dos veces.
          </MagicalAlert>

          <MagicalAlert type="error" title="Error de Conexión">
            No se pudo conectar con las efemérides. Por favor, verifica tu conexión a internet.
          </MagicalAlert>
        </div>

        {/* Demo de Toggle */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">🔄 Magical Toggle</h2>
          <div className="space-y-4">
            <MagicalToggle
              checked={toggleValue}
              onChange={setToggleValue}
              label="Notificaciones astrológicas"
              description="Recibe alertas sobre eventos cósmicos importantes"
            />
            
            <MagicalToggle
              checked={false}
              onChange={() => {}}
              label="Modo privado"
              description="Oculta tu información astrológica de otros usuarios"
              size="sm"
            />
          </div>
        </div>

        {/* Demo de Modal */}
        <div className="text-center">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            🪄 Abrir Modal Mágico
          </button>
        </div>

        {/* Modal Demo */}
        <MagicalModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="✨ Bienvenido al Cosmos"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-white">
              Este es un modal mágico con efectos de transición suaves y un diseño cósmico.
            </p>
            <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-4">
              <p className="text-yellow-200 text-sm">
                ✨ Los modales pueden contener cualquier contenido: formularios, cartas natales, información detallada, etc.
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert('¡Acción confirmada!');
                  setModalOpen(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </MagicalModal>
      </div>
    </div>
  );
}