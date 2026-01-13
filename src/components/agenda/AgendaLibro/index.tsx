'use client';

import React, { useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStyle } from '@/context/StyleContext';
import { StyleSwitcher } from '@/components/agenda/StyleSwitcher';
import { Printer, X } from 'lucide-react';

// Secciones del libro
import { PortadaPersonalizada, PaginaIntencion } from './PortalEntrada';
import { CartaBienvenida, TemaCentralAnio, LoQueVieneAMover, LoQuePideSoltar, PaginaIntencionAnual } from './TuAnioTuViaje';
import { EsenciaNatal, NodoNorte, NodoSur, PlanetasDominantes, PatronesEmocionales } from './SoulChart';
import { QueEsRetornoSolar, AscendenteAnio, SolRetorno, LunaRetorno, EjesDelAnio, EjesDelAnio2, IntegracionEjes, RitualCumpleanos, MantraAnual } from './RetornoSolar';
import { IndiceNavegable } from './Indice';
import { CalendarioYMapaMes, LunasYEjercicios, SemanaConInterpretacion, CierreMes, PrimerDiaCiclo } from './MesCompleto';
import { CalendarioMensualTabla } from './CalendarioMensualTabla';
import '@/styles/print-libro.css';

interface AgendaLibroProps {
  onClose: () => void;
  userName: string;
  startDate: Date;
  endDate: Date;
}

export const AgendaLibro = ({ onClose, userName, startDate, endDate }: AgendaLibroProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { config } = useStyle();

  const handlePrint = () => {
    // Forzar el layout antes de imprimir
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="libro-container min-h-screen bg-gray-100">
      {/* Header de controles - NO se imprime */}
      <div className={`no-print sticky top-0 z-50 backdrop-blur border-b ${config.headerBg} ${config.headerText} p-4`}>
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20"
          >
            <X className="w-4 h-4" />
            Cerrar
          </button>

          <div className="flex items-center gap-4">
            <StyleSwitcher />
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-200 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              Imprimir Libro
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-2 opacity-90">
          Agenda de <span className="font-semibold">{userName}</span> · {format(startDate, "d MMM yyyy", { locale: es })} - {format(endDate, "d MMM yyyy", { locale: es })}
        </p>
      </div>

      {/* Contenido del libro */}
      <div ref={printRef} className="container mx-auto py-8 space-y-0 print:p-0">

        {/* 1. PORTAL DE ENTRADA */}
        <div id="portal-entrada">
          <div id="portada">
            <PortadaPersonalizada
              name={userName}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div id="intencion-anio">
            <PaginaIntencion />
          </div>
        </div>
        <IndiceNavegable />

        {/* 2. TU AÑO, TU VIAJE */}
        <div id="tu-anio-tu-viaje">
          <div id="carta-bienvenida">
            <CartaBienvenida name={userName} />
          </div>
          <div id="tema-central">
            <TemaCentralAnio />
          </div>
          <div id="viene-mover">
            <LoQueVieneAMover />
          </div>
          <div id="pide-soltar">
            <LoQuePideSoltar />
          </div>
          <PaginaIntencionAnual />
        </div>

        {/* 3. SOUL CHART */}
        <div id="soul-chart">
          <div id="esencia-natal">
            <EsenciaNatal />
          </div>
          <div id="nodo-norte">
            <NodoNorte />
          </div>
          <div id="nodo-sur">
            <NodoSur />
          </div>
          <div id="planetas-dominantes">
            <PlanetasDominantes />
          </div>
          <div id="patrones-emocionales">
            <PatronesEmocionales />
          </div>
        </div>

        {/* 4. RETORNO SOLAR */}
        <div id="retorno-solar">
          <div id="que-es-retorno">
            <QueEsRetornoSolar />
          </div>
          <div id="ascendente-anio">
            <AscendenteAnio />
          </div>
          <div id="sol-retorno">
            <SolRetorno />
          </div>
          <div id="luna-retorno">
            <LunaRetorno />
          </div>
          <div id="ejes-anio">
            <EjesDelAnio />
            <EjesDelAnio2 />
            <IntegracionEjes />
          </div>
          <div id="ritual-cumpleanos">
            <RitualCumpleanos />
          </div>
          <MantraAnual />
        </div>

        {/* 5. CALENDARIO MENSUAL (formato tabla profesional) */}
        <div id="calendario-mensual">
          <div id="mes-enero">
            <CalendarioMensualTabla
              monthDate={new Date(2026, 0, 1)}
              mesNumero={1}
              nombreZodiaco="Capicornio → Acuario"
              simboloZodiaco="♑"
              temaDelMes="Inicios conscientes"
          eventos={[
            {
              dia: 6,
              tipo: 'ingreso',
              titulo: 'Venus → Piscis',
              signo: 'Piscis',
              interpretacion: `🌊 VENUS INGRESA EN PISCIS - Activación de tu Casa [X]

Qué se activa en tu Natal:
Venus transitando por Piscis toca [área de vida según casa natal]. Con tu Venus en [signo], esto te invita a conectar desde una dimensión más espiritual y compasiva con [área específica]. Si tienes planetas en signos de agua (Cáncer, Escorpio, Piscis), este tránsito resonará especialmente contigo.

Cómo lo vives según tu Retorno Solar:
En tu carta de retorno solar, Venus está en [signo/casa], lo que indica que este año el amor y las relaciones están enfocados en [tema]. Este ingreso de Venus en Piscis activará [aspecto específico del retorno], potenciando tu necesidad de [acción concreta].

Qué hacer con esta energía:
• Dedica tiempo a actividades que nutran tu alma: arte, música, meditación
• Revisa tus relaciones: ¿estás dando desde el amor o desde la necesidad?
• Conecta con tu lado más intuitivo y empático
• Si hay algo que sanar en el terreno afectivo, este es el momento

Pregunta para reflexionar:
¿Cómo puedo amar de forma más incondicional, empezando por mí?`
            },
            {
              dia: 13,
              tipo: 'lunaLlena',
              titulo: 'Luna Llena en Cáncer',
              signo: 'Cáncer',
              interpretacion: `🌕 LUNA LLENA EN CÁNCER - Culminación Emocional en Casa [X]

Qué se activa en tu Natal:
Esta Luna Llena ilumina tu Casa [X] natal, el área de [tema de vida]. Con tu Luna natal en [signo], tienes una forma particular de gestionar las emociones: [descripción]. Esta lunación te pide integrar [aprendizaje específico].

Aspectos clave desde tu Natal:
• Tu Luna hace [aspecto] con [planeta], lo que significa que [interpretación]
• Esta Luna Llena activa tu eje [casas], conectando [área 1] con [área 2]
• Si tienes planetas en Cáncer o Capricornio, sentirás esta lunación con especial intensidad

Cómo lo vives según tu Retorno Solar:
La Luna Llena cae en la Casa [X] de tu retorno solar. Este año, el foco emocional está en [tema anual]. Esta culminación marca el punto medio de un proceso que comenzó en la Luna Nueva de [fecha anterior], relacionado con [tema específico].

Qué soltar ahora:
• Patrones familiares que ya no te sirven
• Necesidad de controlar cómo otros te cuidan
• Miedo a mostrar tus verdaderas necesidades emocionales
• Relaciones donde das más de lo que recibes

Ritual sugerido:
Escribe una carta a tu niño/a interior. Pregúntale qué necesita para sentirse seguro/a. Luego, comprométete a darle eso desde tu yo adulto.

Pregunta para reflexionar:
¿Qué necesito soltar para permitirme recibir el cuidado que merezco?`
            },
            {
              dia: 20,
              tipo: 'ingreso',
              titulo: 'Sol → Acuario',
              signo: 'Acuario',
              interpretacion: `⚡ SOL INGRESA EN ACUARIO - Nueva Temporada en Casa [X]

Qué se activa en tu Natal:
El Sol ilumina tu Casa [X] natal durante el próximo mes, el sector de [área de vida]. Con tu Sol natal en [signo], tu esencia es [cualidad]. Este tránsito te invita a brillar en [área específica] desde una perspectiva más innovadora y desapegada.

Conexión con tu propósito natal:
• Tu Sol natal hace [aspecto] con [planeta], lo que te da [cualidad]
• Este tránsito activa [configuración específica], favoreciendo [acción]
• Urano (regente de Acuario) está en tu Casa [X], conectando con [tema]

Cómo lo vives según tu Retorno Solar:
En tu retorno solar, el Sol está en Casa [X], indicando que este año tu identidad se está reconfigurando a través de [tema]. Este ingreso en Acuario activa [área del retorno], invitándote a [acción concreta].

Temas centrales del mes:
• Innovación y ruptura de estructuras obsoletas
• Conexión con tu comunidad y tribu afín
• Expresión auténtica de tu individualidad
• Proyectos colaborativos y visión de futuro

Qué hacer:
• Conecta con personas que compartan tu visión
• Atrévete a proponer ideas diferentes, aunque parezcan "raras"
• Revisa tus redes sociales: ¿reflejan quién eres realmente?
• Empieza ese proyecto innovador que tienes guardado

Pregunta para reflexionar:
¿En qué área de mi vida necesito más libertad para ser auténticamente yo?`
            },
            {
              dia: 29,
              tipo: 'lunaNueva',
              titulo: 'Luna Nueva en Acuario',
              signo: 'Acuario',
              interpretacion: `🌑 LUNA NUEVA EN ACUARIO - Siembra de Intenciones en Casa [X]

Qué se activa en tu Natal:
Esta Luna Nueva planta semillas en tu Casa [X] natal, el área de [tema de vida]. Es un ciclo de 6 meses (hasta la Luna Llena en Acuario de [fecha futura]) donde podrás manifestar [objetivo]. Tu Luna natal en [signo] te da una forma [cualidad] de procesar esta energía.

Configuración específica para ti:
• Esta lunación hace [aspecto] con tu [planeta natal], potenciando [cualidad]
• Se activa tu eje [casas], conectando [área 1] con [área 2]
• Urano cerca de esta Luna Nueva añade un factor de cambio inesperado

Cómo lo vives según tu Retorno Solar:
La Luna Nueva cae en la Casa [X] de tu retorno, señalando un nuevo comienzo en [área específica]. Este es uno de los momentos clave del año para [acción]. Tu Ascendente de retorno en [signo] sugiere que esto se manifestará a través de [forma concreta].

Intenciones poderosas para sembrar:
• "Me permito ser diferente y celebro mi autenticidad"
• "Atraigo a mi tribu, personas que me entienden sin explicaciones"
• "Confío en mi visión única del futuro"
• "Me libero de la necesidad de encajar en moldes ajenos"

Ritual de Luna Nueva:
1. Escribe 10 deseos relacionados con libertad, comunidad y autenticidad
2. Elige los 3 que más te resuenen
3. Para cada uno, escribe UN paso concreto que darás en los próximos 15 días
4. Enciende una vela blanca y lee tus intenciones en voz alta

Pregunta para reflexionar:
Si no tuviera miedo al rechazo, ¿qué aspecto de mí mostraría al mundo?

Fecha clave: Marca en tu agenda la Luna Llena en Acuario de [fecha] para hacer balance.`
            }
          ]}
        />

        <LunasYEjercicios
          monthDate={new Date(2026, 0, 1)}
          eventos={[
            {
              dia: 13,
              tipo: 'lunaLlena',
              titulo: 'Luna Llena en Cáncer',
              interpretacion: 'Culminación emocional. Momento para soltar lo que ya no te pertenece en el ámbito familiar y emocional.'
            },
            {
              dia: 29,
              tipo: 'lunaNueva',
              titulo: 'Luna Nueva en Acuario',
              interpretacion: 'Siembra intenciones sobre libertad, comunidad e innovación. Tiempo de conectar con tu visión única.'
            }
          ]}
          ejercicioCentral={{
            titulo: 'Revisar automatismos',
            descripcion: 'Durante este mes, identifica una acción que haces por inercia y pregúntate: ¿esto me sigue sirviendo?'
          }}
          mantra="Arranco desde mi verdad, no desde la prisa"
        />
        <SemanaConInterpretacion
          weekStart={new Date(2026, 0, 5)}
          weekNumber={1}
          mesNombre="Enero 2026"
          tematica="Pausa y revisión"
          eventos={[
            { dia: 6, tipo: 'ingreso', titulo: 'Venus → Piscis', signo: 'Piscis' }
          ]}
          interpretacionSemanal="Esta primera semana del año es para bajar el ritmo y revisar qué quieres cultivar realmente. No hay prisa."
          ejercicioSemana="Escribe 3 cosas que NO quieres repetir este año."
        />
            <CierreMes monthDate={new Date(2026, 0, 1)} />
          </div>
        </div>

      </div>
    </div>
  );
};
