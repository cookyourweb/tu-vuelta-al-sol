// src/components/ui/Modal.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Manejo de tecla ESC
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, closeOnEsc]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div
          ref={modalRef}
          className={cn(
            'relative w-full',
            sizeClasses[size],
            'bg-gradient-to-br from-indigo-950 via-purple-900 to-black',
            'border border-purple-400/30 rounded-2xl shadow-2xl',
            'animate-in zoom-in-95 duration-200',
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-purple-500/20 transition-colors ml-auto"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;