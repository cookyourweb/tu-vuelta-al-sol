import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { RefreshCw, MoveRight, Sparkles, Star, PenLine, Flame, Wrench, AlertTriangle, Bookmark } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ============ TRÁNSITOS DEL MES ============
// Página dedicada a mostrar:
// - Retrogradaciones planetarias
// - Ingresos de planetas a signos
// - Aspectos destacados
// Con interpretaciones personalizadas V2
// ===========================================

interface InterpretacionV2 {
  que_se_activa?: string;
  como_se_siente?: string[];
  consejo?: string[];
  ritual_breve?: string;
  advertencias?: string[];
  oportunidades?: string[];
  mantra?: string;
  pregunta_clave?: string;
  // V1 fields fallback
  mensaje_sintesis?: string;
  como_te_afecta?: string;
  sintesis_practica?: string;
  frase_ancla?: string;
  accion_concreta?: { titulo: string; pasos: string[] };
  // Simple fields fallback
  personalMeaning?: string;
  actionSteps?: string[];
}

interface TransitoEvento {
  dia: number;
  tipo: 'retrogrado' | 'ingreso' | 'especial';
  titulo: string;
  planeta?: string;
  signo?: string;
  interpretacion?: string;
  interpretacionRaw?: InterpretacionV2;
}

interface TransitosDelMesProps {
  monthDate: Date;
  transitos: TransitoEvento[];
  reflexionMensual?: string;
}

const IconoTransito = ({ tipo, className = "w-4 h-4" }: { tipo: string; className?: string }) => {
  switch (tipo) {
    case 'retrogrado':
      return <RefreshCw className={className} />;
    case 'ingreso':
      return <MoveRight className={className} />;
    case 'especial':
      return <Sparkles className={className} />;
    default:
      return <Star className={className} />;
  }
};

const getTransitoColor = (tipo: string) => {
  switch (tipo) {
    case 'retrogrado':
      return {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        textLight: 'text-rose-600',
        icon: 'text-rose-500',
        label: 'Retrogradación'
      };
    case 'ingreso':
      return {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-teal-700',
        textLight: 'text-teal-600',
        icon: 'text-teal-500',
        label: 'Ingreso Planetario'
      };
    case 'especial':
      return {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        text: 'text-violet-700',
        textLight: 'text-violet-600',
        icon: 'text-violet-500',
        label: 'Aspecto Especial'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        textLight: 'text-gray-600',
        icon: 'text-gray-500',
        label: 'Tránsito'
      };
  }
};

// Líneas de escritura reutilizables
const LineasEscritura = ({ count = 3, spacing = 24 }: { count?: number; spacing?: number }) => (
  <div className="flex flex-col">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border-b border-gray-200" style={{ height: `${spacing}px` }} />
    ))}
  </div>
);

// Extraer texto principal de la interpretación (V2, V1 o Simple)
const getMainText = (raw?: InterpretacionV2): string | undefined => {
  if (!raw) return undefined;
  return raw.que_se_activa || raw.mensaje_sintesis || raw.personalMeaning || raw.como_te_afecta;
};

// Extraer consejos/acciones
const getConsejos = (raw?: InterpretacionV2): string[] => {
  if (!raw) return [];
  if (raw.consejo && Array.isArray(raw.consejo) && raw.consejo.length > 0) return raw.consejo;
  if (raw.accion_concreta?.pasos) return raw.accion_concreta.pasos;
  if (raw.actionSteps && Array.isArray(raw.actionSteps)) return raw.actionSteps;
  if (raw.sintesis_practica) return [raw.sintesis_practica];
  return [];
};

// Extraer mantra
const getMantra = (raw?: InterpretacionV2): string | undefined => {
  if (!raw) return undefined;
  return raw.mantra || raw.frase_ancla;
};

// Extraer pregunta clave
const getPreguntaClave = (raw?: InterpretacionV2): string | undefined => {
  if (!raw) return undefined;
  return raw.pregunta_clave;
};

// Componente para un tránsito individual con interpretación V2 rica
const TransitoCard: React.FC<{ transito: TransitoEvento }> = ({ transito }) => {
  const colors = getTransitoColor(transito.tipo);
  const raw = transito.interpretacionRaw;
  const mainText = getMainText(raw);
  const consejos = getConsejos(raw);
  const mantra = getMantra(raw);
  const pregunta = getPreguntaClave(raw);

  // Si tiene datos V2 estructurados, mostrar versión rica
  const hasStructuredData = raw && (mainText || consejos.length > 0 || mantra);

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
      {/* Header: día + título */}
      <div className="flex items-center gap-2 mb-2">
        <IconoTransito tipo={transito.tipo} className={`w-3 h-3 ${colors.icon}`} />
        <span className={`text-xs font-bold ${colors.text}`}>
          Día {transito.dia}
        </span>
        <span className={`text-xs font-medium ${colors.text}`}>
          {transito.titulo}
        </span>
      </div>

      {hasStructuredData ? (
        <div className="space-y-2">
          {/* Qué se activa - texto principal */}
          {mainText && (
            <div className="flex items-start gap-1.5">
              <Flame className={`w-3 h-3 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <p className={`text-xs ${colors.text} opacity-90 leading-relaxed`}>
                {mainText}
              </p>
            </div>
          )}

          {/* Consejos prácticos */}
          {consejos.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Wrench className={`w-3 h-3 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <div>
                {consejos.slice(0, 3).map((c, i) => (
                  <p key={i} className={`text-xs ${colors.textLight} leading-relaxed`}>
                    - {c}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Advertencias */}
          {raw?.advertencias && raw.advertencias.length > 0 && (
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
              <div>
                {raw.advertencias.map((a: string, i: number) => (
                  <p key={i} className="text-xs text-amber-700 leading-relaxed">- {a}</p>
                ))}
              </div>
            </div>
          )}

          {/* Mantra */}
          {mantra && (
            <div className="flex items-start gap-1.5">
              <Sparkles className={`w-3 h-3 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <p className={`text-xs italic ${colors.text} opacity-80`}>
                &ldquo;{mantra}&rdquo;
              </p>
            </div>
          )}

          {/* Pregunta clave */}
          {pregunta && (
            <div className="flex items-start gap-1.5">
              <Bookmark className={`w-3 h-3 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <p className={`text-xs ${colors.textLight} italic`}>
                {pregunta}
              </p>
            </div>
          )}
        </div>
      ) : transito.interpretacion ? (
        // Fallback: texto plano (sin truncar)
        <p className={`text-xs ${colors.text} opacity-90 leading-relaxed whitespace-pre-line`}>
          {transito.interpretacion}
        </p>
      ) : null}
    </div>
  );
};

export const TransitosDelMes: React.FC<TransitosDelMesProps> = ({
  monthDate,
  transitos,
  reflexionMensual
}) => {
  const { config } = useStyle();

  // Solo mostrar si hay tránsitos
  if (!transitos || transitos.length === 0) {
    return null;
  }

  // Agrupar por tipo
  const retrogrados = transitos.filter(t => t.tipo === 'retrogrado');
  const ingresos = transitos.filter(t => t.tipo === 'ingreso' || t.tipo === 'especial');

  return (
    <div className={`print-page bg-white flex flex-col relative ${config.pattern}`} style={{ padding: '15mm' }}>
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b border-gray-200">
        <span className={`text-xs uppercase tracking-wider ${config.iconSecondary}`}>
          {format(monthDate, 'MMMM yyyy', { locale: es })}
        </span>
        <h1 className={`text-xl font-display ${config.titleGradient}`}>
          Tránsitos Planetarios
        </h1>
        <p className={`text-xs italic ${config.iconSecondary} mt-1`}>
          Los movimientos del cielo que activan tu carta
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Sección Retrogradaciones */}
        {retrogrados.length > 0 && (
          <div className={`${config.highlightSecondary} p-4 rounded-lg`}>
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className={`w-4 h-4 ${config.iconSecondary}`} />
              <h2 className={`text-sm font-bold uppercase ${config.iconSecondary}`}>
                Retrogradaciones
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-3 italic">
              Momentos para revisar, repensar y reconectar con lo interno
            </p>

            <div className="space-y-3">
              {retrogrados.map((transito, idx) => (
                <TransitoCard key={idx} transito={transito} />
              ))}
            </div>
          </div>
        )}

        {/* Sección Ingresos Planetarios */}
        {ingresos.length > 0 && (
          <div className={`${config.highlightPrimary} p-4 rounded-lg`}>
            <div className="flex items-center gap-2 mb-3">
              <MoveRight className={`w-4 h-4 ${config.iconPrimary}`} />
              <h2 className={`text-sm font-bold uppercase ${config.iconPrimary}`}>
                Cambios de Energía
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-3 italic">
              Cuando un planeta cambia de signo, cambia el tono colectivo
            </p>

            <div className="space-y-3">
              {ingresos.map((transito, idx) => (
                <TransitoCard key={idx} transito={transito} />
              ))}
            </div>
          </div>
        )}

        {/* Espacio para Reflexión Personal */}
        <div className={`${config.highlightAccent} p-4 rounded-lg flex-1`}>
          <div className="flex items-center gap-2 mb-2">
            <PenLine className={`w-4 h-4 ${config.iconAccent}`} />
            <h3 className={`text-sm font-bold uppercase ${config.iconAccent}`}>
              Reflexión sobre estos tránsitos
            </h3>
          </div>
          {reflexionMensual && (
            <p className="text-xs text-gray-600 mb-3 italic">
              {reflexionMensual}
            </p>
          )}
          <p className="text-xs text-gray-500 mb-3">
            ¿Qué área de mi vida siento que necesita revisión? ¿Dónde percibo que algo se mueve?
          </p>
          <LineasEscritura count={5} spacing={26} />
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

export default TransitosDelMes;
