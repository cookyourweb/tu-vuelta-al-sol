'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type AgendaStyle = 'elegante' | 'creativo' | 'minimalista' | 'bohemio';

interface StyleConfig {
  name: string;
  description: string;
  // Typography
  fontDisplay: string;
  fontBody: string;
  // Header styles
  headerBg: string;
  headerText: string;
  // Card styles
  cardBg: string;
  cardBorder: string;
  cardAccent: string;
  // Badge styles
  badgePrimary: string;
  badgeSecondary: string;
  badgeAccent: string;
  // Icon styles
  iconPrimary: string;
  iconSecondary: string;
  iconAccent: string;
  // Text styles
  titleGradient: string;
  // Divider
  divider: string;
  // Highlight boxes
  highlightPrimary: string;
  highlightSecondary: string;
  highlightAccent: string;
  // Pattern
  pattern: string;
}

export const styleConfigs: Record<AgendaStyle, StyleConfig> = {
  elegante: {
    name: 'Elegante',
    description: 'Sofisticado y refinado',
    fontDisplay: 'font-serif',
    fontBody: 'font-serif',
    headerBg: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800',
    headerText: 'text-amber-100',
    cardBg: 'bg-gradient-to-br from-white to-amber-50/50',
    cardBorder: 'border-l-4 border-amber-600',
    cardAccent: 'shadow-lg shadow-amber-900/10',
    badgePrimary: 'bg-gradient-to-r from-slate-700 to-slate-800 text-amber-100',
    badgeSecondary: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
    badgeAccent: 'bg-gradient-to-r from-rose-700 to-rose-800 text-white',
    iconPrimary: 'text-slate-700',
    iconSecondary: 'text-amber-600',
    iconAccent: 'text-rose-600',
    titleGradient: 'bg-gradient-to-r from-slate-800 via-amber-700 to-slate-800 bg-clip-text text-transparent',
    divider: 'bg-gradient-to-r from-transparent via-amber-500 to-transparent h-[2px]',
    highlightPrimary: 'bg-slate-50 border-2 border-slate-200',
    highlightSecondary: 'bg-amber-50 border-2 border-amber-200',
    highlightAccent: 'bg-rose-50 border-2 border-rose-200',
    pattern: 'bg-[radial-gradient(circle_at_20%_80%,rgba(180,83,9,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(51,65,85,0.05)_0%,transparent_50%)]',
  },
  creativo: {
    name: 'Creativo',
    description: 'Vibrante y expresivo',
    fontDisplay: 'font-sans',
    fontBody: 'font-sans',
    headerBg: 'bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600',
    headerText: 'text-white',
    cardBg: 'bg-gradient-to-br from-white to-fuchsia-50/30',
    cardBorder: 'border-l-4 border-fuchsia-500',
    cardAccent: 'shadow-lg shadow-fuchsia-500/20',
    badgePrimary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
    badgeSecondary: 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white',
    badgeAccent: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white',
    iconPrimary: 'text-violet-600',
    iconSecondary: 'text-fuchsia-500',
    iconAccent: 'text-cyan-500',
    titleGradient: 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent',
    divider: 'bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent h-[3px]',
    highlightPrimary: 'bg-violet-50 border-2 border-violet-300',
    highlightSecondary: 'bg-fuchsia-50 border-2 border-fuchsia-300',
    highlightAccent: 'bg-cyan-50 border-2 border-cyan-300',
    pattern: 'bg-[radial-gradient(circle_at_10%_20%,rgba(192,38,211,0.08)_0%,transparent_50%),radial-gradient(circle_at_90%_80%,rgba(6,182,212,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05)_0%,transparent_70%)]',
  },
  minimalista: {
    name: 'Minimalista',
    description: 'Limpio y sereno',
    fontDisplay: 'font-sans',
    fontBody: 'font-sans',
    headerBg: 'bg-gradient-to-r from-zinc-100 via-white to-zinc-100 border-b-2 border-zinc-300',
    headerText: 'text-zinc-800',
    cardBg: 'bg-white',
    cardBorder: 'border-l-2 border-zinc-400',
    cardAccent: 'shadow-sm shadow-zinc-200',
    badgePrimary: 'bg-zinc-800 text-white',
    badgeSecondary: 'bg-zinc-500 text-white',
    badgeAccent: 'bg-teal-600 text-white',
    iconPrimary: 'text-zinc-700',
    iconSecondary: 'text-zinc-500',
    iconAccent: 'text-teal-600',
    titleGradient: 'text-zinc-800',
    divider: 'bg-gradient-to-r from-transparent via-zinc-400 to-transparent h-[1px]',
    highlightPrimary: 'bg-zinc-50 border border-zinc-200',
    highlightSecondary: 'bg-white border border-zinc-300',
    highlightAccent: 'bg-teal-50 border border-teal-200',
    pattern: '',
  },
  bohemio: {
    name: 'Bohemio',
    description: 'Cálido y artístico',
    fontDisplay: 'font-serif',
    fontBody: 'font-sans',
    headerBg: 'bg-gradient-to-r from-orange-700 via-amber-600 to-rose-600',
    headerText: 'text-orange-50',
    cardBg: 'bg-gradient-to-br from-orange-50/50 to-amber-50/50',
    cardBorder: 'border-l-4 border-orange-500',
    cardAccent: 'shadow-lg shadow-orange-500/15',
    badgePrimary: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white',
    badgeSecondary: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
    badgeAccent: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white',
    iconPrimary: 'text-orange-600',
    iconSecondary: 'text-amber-600',
    iconAccent: 'text-teal-600',
    titleGradient: 'bg-gradient-to-r from-orange-700 via-amber-600 to-rose-600 bg-clip-text text-transparent',
    divider: 'bg-gradient-to-r from-transparent via-orange-500 to-transparent h-[2px]',
    highlightPrimary: 'bg-orange-50 border-2 border-orange-200',
    highlightSecondary: 'bg-amber-50 border-2 border-amber-200',
    highlightAccent: 'bg-teal-50 border-2 border-teal-200',
    pattern: 'bg-[radial-gradient(circle_at_30%_70%,rgba(234,88,12,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_30%,rgba(251,191,36,0.08)_0%,transparent_50%)]',
  },
};

interface StyleContextType {
  currentStyle: AgendaStyle;
  setStyle: (style: AgendaStyle) => void;
  config: StyleConfig;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const [currentStyle, setCurrentStyle] = useState<AgendaStyle>('creativo');

  useEffect(() => {
    const root = document.documentElement;
    const prefix = 'agenda-style-';
    (Object.keys(styleConfigs) as AgendaStyle[]).forEach((s) => root.classList.remove(`${prefix}${s}`));
    root.classList.add(`${prefix}${currentStyle}`);
  }, [currentStyle]);

  const setStyle = (style: AgendaStyle) => {
    setCurrentStyle(style);
  };

  return (
    <StyleContext.Provider value={{ currentStyle, setStyle, config: styleConfigs[currentStyle] }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
};
