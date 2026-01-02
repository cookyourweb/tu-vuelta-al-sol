import { useStyle, AgendaStyle, styleConfigs } from '@/contexts/StyleContext';
import { Palette, Sparkles, Minus, Feather } from 'lucide-react';

const styleIcons: Record<AgendaStyle, React.ReactNode> = {
  elegante: <Palette className="w-4 h-4" />,
  creativo: <Sparkles className="w-4 h-4" />,
  minimalista: <Minus className="w-4 h-4" />,
  bohemio: <Feather className="w-4 h-4" />,
};

const styleColors: Record<AgendaStyle, string> = {
  elegante: 'from-slate-700 to-amber-600',
  creativo: 'from-fuchsia-600 to-indigo-600',
  minimalista: 'from-zinc-600 to-zinc-400',
  bohemio: 'from-orange-600 to-rose-500',
};

export const StyleSwitcher = () => {
  const { currentStyle, setStyle } = useStyle();

  return (
    <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-2 py-1.5 border border-gray-200">
      <span className="text-xs text-gray-500 font-medium px-1">Estilo:</span>
      {(Object.keys(styleConfigs) as AgendaStyle[]).map((style) => (
        <button
          key={style}
          onClick={() => setStyle(style)}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 text-xs
            ${currentStyle === style 
              ? `bg-gradient-to-br ${styleColors[style]} text-white shadow-md` 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          title={styleConfigs[style].description}
        >
          {styleIcons[style]}
          <span className="font-medium hidden sm:inline">
            {styleConfigs[style].name}
          </span>
        </button>
      ))}
    </div>
  );
};
