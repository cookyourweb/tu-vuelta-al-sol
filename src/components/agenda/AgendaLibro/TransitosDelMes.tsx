import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { RefreshCw, MoveRight, Sparkles, Star, PenLine } from 'lucide-react';
import { FooterLibro } from './MesCompleto';

// ============ TRÁNSITOS DEL MES ============
// Página dedicada a mostrar:
// - Retrogradaciones planetarias
// - Ingresos de planetas a signos
// - Aspectos destacados
// Con interpretaciones personalizadas
// ===========================================

interface TransitoEvento {
  dia: number;
  tipo: 'retrogrado' | 'ingreso' | 'especial';
  titulo: string;
  planeta?: string;
  signo?: string;
  interpretacion?: string;
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
        icon: 'text-rose-500',
        label: 'Retrogradación'
      };
    case 'ingreso':
      return {
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        text: 'text-teal-700',
        icon: 'text-teal-500',
        label: 'Ingreso Planetario'
      };
    case 'especial':
      return {
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        text: 'text-violet-700',
        icon: 'text-violet-500',
        label: 'Aspecto Especial'
      };
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
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
              {retrogrados.map((transito, idx) => {
                const colors = getTransitoColor(transito.tipo);
                return (
                  <div key={idx} className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <IconoTransito tipo={transito.tipo} className={`w-3 h-3 ${colors.icon}`} />
                      <span className={`text-xs font-bold ${colors.text}`}>
                        Día {transito.dia}
                      </span>
                      <span className={`text-xs ${colors.text}`}>
                        {transito.titulo}
                      </span>
                    </div>
                    {transito.interpretacion && (
                      <p className={`text-xs ${colors.text} opacity-90 leading-relaxed`}>
                        {transito.interpretacion.length > 300
                          ? transito.interpretacion.substring(0, 300) + '...'
                          : transito.interpretacion}
                      </p>
                    )}
                  </div>
                );
              })}
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
              {ingresos.slice(0, 4).map((transito, idx) => {
                const colors = getTransitoColor(transito.tipo);
                return (
                  <div key={idx} className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <IconoTransito tipo={transito.tipo} className={`w-3 h-3 ${colors.icon}`} />
                      <span className={`text-xs font-bold ${colors.text}`}>
                        Día {transito.dia}
                      </span>
                      <span className={`text-xs ${colors.text}`}>
                        {transito.titulo}
                      </span>
                    </div>
                    {transito.interpretacion && (
                      <p className={`text-xs ${colors.text} opacity-90 leading-relaxed`}>
                        {transito.interpretacion.length > 200
                          ? transito.interpretacion.substring(0, 200) + '...'
                          : transito.interpretacion}
                      </p>
                    )}
                  </div>
                );
              })}
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
          <LineasEscritura count={6} spacing={26} />
        </div>
      </div>

      <FooterLibro />
    </div>
  );
};

export default TransitosDelMes;
