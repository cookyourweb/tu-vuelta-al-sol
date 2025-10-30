'use client';

import { useState, useCallback } from 'react';
import { DrawerContent } from '@/types/interpretations';

export function useInterpretationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<DrawerContent | null>(null);
  
  const open = useCallback((newContent: DrawerContent) => {
    console.log('=== HOOK: ABRIENDO DRAWER ===');
    console.log('newContent:', newContent);
    console.log('newContent.titulo:', newContent.titulo);
    setContent(newContent);
    setIsOpen(true);
    console.log('HOOK: setContent y setIsOpen llamados - drawer debería renderizarse');
  }, []);
  
  const close = useCallback(() => {
    console.log('=== HOOK: CERRANDO DRAWER ===');
    setIsOpen(false);
    // Limpieza con delay para animación
    setTimeout(() => {
      setContent(null);
      console.log('HOOK: Content limpiado después de animación');
    }, 300);
  }, []);

  const closeWithTooltipReset = useCallback((resetTooltip: () => void) => {
    setIsOpen(false);
    // Reset tooltip immediately when drawer closes
    resetTooltip();
    // Limpieza con delay para animación
    setTimeout(() => setContent(null), 300);
  }, []);
  
  return {
    isOpen,
    content,
    open,
    close,
    closeWithTooltipReset
  };
}

// USO:
// const drawer = useInterpretationDrawer();
// <button onClick={() => drawer.open(interpretation.drawer)}>Ver más</button>
// <InterpretationDrawer {...drawer} onClose={drawer.close} />