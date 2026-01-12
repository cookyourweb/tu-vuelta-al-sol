import React from 'react';
import { 
  CalendarioYMapaMes, 
  LunasYEjercicios, 
  SemanaConInterpretacion, 
  CierreSemana,
  CierreMes,
  PrimerDiaCiclo,
  UltimoDiaCiclo 
} from './MesCompleto';

// ============ EJEMPLO 1: ENERO 2026 (Mes de inicio) ============
export const Enero2026Completo: React.FC<{ birthday?: Date }> = ({ birthday }) => {
  const eventosEnero = [
    { 
      dia: 6, 
      tipo: 'lunaNueva' as const, 
      titulo: 'Luna Nueva en Capricornio', 
      signo: 'Capricornio',
      interpretacion: 'Esta Luna Nueva cae en tu Casa 12, activando la necesidad de ordenar lo interno antes de exigirte metas externas. Te invita a revisar qué compromisos arrastras del año pasado y cuáles siguen vivos.',
      consejos: ['Medita antes de planificar', 'No te exijas metas, define intenciones']
    },
    { 
      dia: 21, 
      tipo: 'lunaLlena' as const, 
      titulo: 'Luna Llena en Leo', 
      signo: 'Leo',
      interpretacion: 'Luna Llena en tu Casa 7: culminación en relaciones y vínculos. Algo que empezaste con otros llega a su punto máximo. Pregúntate: ¿qué vínculos necesitan más luz y cuáles más espacio?',
      consejos: ['Celebra lo que funciona', 'Suelta lo que ya cumplió su propósito']
    },
    { 
      dia: 26, 
      tipo: 'ingreso' as const, 
      titulo: 'Neptuno → Aries',
      interpretacion: 'Neptuno entra en Aries por primera vez en tu vida. Comienza un ciclo de 14 años de inspiración, idealismo y posiblemente confusión creativa. En tu carta activa la Casa 2: tus valores, tu autoestima y tu relación con el dinero entran en una fase de redefinición espiritual.'
    }
  ];

  return (
    <>
      {/* Página 1: Calendario + Mapa del Mes */}
      <CalendarioYMapaMes
        monthDate={new Date(2026, 0, 1)}
        mesNumero={1}
        nombreZodiaco="Capricornio → Acuario"
        simboloZodiaco="♑"
        temaDelMes="Ordenar antes de exigir"
        energiaDelMes="Enero te pide que ordenes tus prioridades internas antes de lanzarte a las metas externas. La energía capricorniana es estructuradora, pero también puede ser exigente. Tu desafío: distinguir qué viene de ti y qué viene de la presión."
        preguntaGuia="¿Desde dónde estoy arrancando: desde la exigencia o desde la coherencia?"
        eventos={eventosEnero}
        birthday={birthday}
      />

      {/* Página 2: Lunas + Ejercicios + Mantra */}
      <LunasYEjercicios
        monthDate={new Date(2026, 0, 1)}
        eventos={eventosEnero}
        ejercicioCentral={{
          titulo: "Compromisos Vivos vs. Compromisos Muertos",
          descripcion: "Haz una lista de los compromisos que arrastras del año pasado. Marca con ✓ los que siguen vivos y con ✗ los que están muertos pero aún ocupan espacio mental. Tacha los muertos. Observa qué sientes."
        }}
        mantra="Este año viene a reordenarme, no a exigirme más"
      />

      {/* Semana 1 con interpretación */}
      <SemanaConInterpretacion
        weekStart={new Date(2026, 0, 5)}
        weekNumber={1}
        mesNombre="ENERO 2026"
        tematica="Revisar antes de arrancar"
        eventos={eventosEnero}
        interpretacionSemanal="La Luna Nueva del día 6 en Capricornio activa tu Casa 12. No es momento de exigirte productividad externa, sino de ordenar internamente. Esta semana es para revisar qué arrastras, qué sigue vivo, qué necesita soltar. Si sientes presión por 'arrancar fuerte', recuerda: ordenar ES arrancar."
        ejercicioSemana="Escribe 3 compromisos que arrastras del año pasado. ¿Cuáles siguen vivos? ¿Cuáles están muertos pero aún ocupan espacio? Tacha los que ya no te sirven."
        birthday={birthday}
      />

      {/* Semana 2 con interpretación */}
      <SemanaConInterpretacion
        weekStart={new Date(2026, 0, 12)}
        weekNumber={2}
        mesNombre="ENERO 2026"
        tematica="Construir sobre lo ordenado"
        eventos={eventosEnero}
        interpretacionSemanal="El impulso post-Luna Nueva se asienta. Esta semana es para empezar a construir, pero desde lo que realmente importa. No desde la lista de 'debería', sino desde la coherencia que encontraste la semana pasada. El Sol sigue en Capricornio: te pide compromiso, pero consciente."
        ejercicioSemana="Dibuja o escribe cómo te gustaría sentirte en tu día a día este año. No qué quieres lograr, sino cómo quieres sentirte mientras lo logras."
        birthday={birthday}
      />

      {/* Cierre de semana ejemplo */}
      <CierreSemana weekNumber={2} mesNombre="ENERO 2026" />

      {/* Cierre del mes */}
      <CierreMes monthDate={new Date(2026, 0, 1)} />
    </>
  );
};

// ============ EJEMPLO 2: FEBRERO 2026 (Mes del cumpleaños - Vero) ============
export const Febrero2026Completo: React.FC<{ birthday?: Date; nombre?: string }> = ({ birthday, nombre = "Vero" }) => {
  const eventosFebrero = [
    { 
      dia: 4, 
      tipo: 'lunaNueva' as const, 
      titulo: 'Luna Nueva en Acuario', 
      signo: 'Acuario',
      interpretacion: 'Luna Nueva en tu Casa 1: nuevo comienzo personal. Es tu momento de sembrar intenciones para quién quieres ser. Esta Luna te invita a honrar tu individualidad y soltar lo que ya no resuena con tu esencia.',
      consejos: ['Define una intención personal clara', 'Celebra tu unicidad']
    },
    { 
      dia: 10, 
      tipo: 'cumpleanos' as const, 
      titulo: 'RETORNO SOLAR',
      interpretacion: '¡Tu cumpleaños! El Sol vuelve al grado exacto donde estaba cuando naciste. Es el inicio de tu nuevo año personal. Todo lo que hagas hoy marca el tono del año.'
    },
    { 
      dia: 19, 
      tipo: 'lunaLlena' as const, 
      titulo: 'Luna Llena en Virgo', 
      signo: 'Virgo',
      interpretacion: 'Luna Llena en tu Casa 8: culminación emocional profunda. Algo que has estado procesando a nivel interno llega a su punto de máxima expresión. Es momento de soltar lo que ya hizo su trabajo.',
      consejos: ['Permite la catarsis', 'Agradece y libera']
    }
  ];

  return (
    <>
      {/* Página de primer día del ciclo (cumpleaños) */}
      {birthday && <PrimerDiaCiclo fecha={birthday} nombre={nombre} />}

      {/* Página 1: Calendario + Mapa del Mes */}
      <CalendarioYMapaMes
        monthDate={new Date(2026, 1, 1)}
        mesNumero={2}
        nombreZodiaco="Acuario → Piscis"
        simboloZodiaco="♒"
        temaDelMes="Renacimiento y nuevo ciclo"
        energiaDelMes="Febrero es tu mes. El Sol transita por tu signo, iluminando quién eres y quién quieres ser. Tu Retorno Solar marca el inicio de un nuevo ciclo de 12 meses. Este mes no se trata de logros externos, sino de sembrar la semilla de tu año."
        preguntaGuia="¿Qué semilla quiero plantar en este nuevo ciclo solar?"
        eventos={eventosFebrero}
        birthday={birthday}
      />

      {/* Página 2: Lunas + Ejercicios + Mantra */}
      <LunasYEjercicios
        monthDate={new Date(2026, 1, 1)}
        eventos={eventosFebrero}
        ejercicioCentral={{
          titulo: "Carta a mi Yo del Próximo Cumpleaños",
          descripcion: "Escribe una carta a la persona que serás dentro de un año. Cuéntale qué semilla plantaste hoy, qué intención pusiste, y qué le deseas. Guárdala y ábrela el próximo 10 de febrero."
        }}
        mantra="Honro mi regreso al Sol. Este año es mío."
      />

      {/* Semana del cumpleaños */}
      <SemanaConInterpretacion
        weekStart={new Date(2026, 1, 9)}
        weekNumber={6}
        mesNombre="FEBRERO 2026"
        tematica="Semana de Renacimiento Solar"
        eventos={eventosFebrero}
        interpretacionSemanal="Esta es LA semana de tu año. El día 10, el Sol vuelve al grado exacto donde estaba cuando naciste. Es tu Retorno Solar, el inicio de un nuevo ciclo de 12 meses. Todo lo que hagas, sientas e intenciones esta semana marca el tono de tu año. No es un día cualquiera: es tu portal de entrada."
        ejercicioSemana="El día de tu cumpleaños, despierta en silencio. Antes de mirar el teléfono, escribe: ¿Qué quiero cultivar este año? ¿Qué decido soltar? ¿Qué me comprometo a honrar de mí?"
        birthday={birthday}
      />

      {/* Cierre del mes */}
      <CierreMes monthDate={new Date(2026, 1, 1)} />
    </>
  );
};

// ============ EJEMPLO 3: JUNIO 2026 (Mes de mitad de año) ============
export const Junio2026Completo: React.FC<{ birthday?: Date }> = ({ birthday }) => {
  const eventosJunio = [
    { 
      dia: 3, 
      tipo: 'lunaNueva' as const, 
      titulo: 'Luna Nueva en Géminis', 
      signo: 'Géminis',
      interpretacion: 'Luna Nueva en tu Casa 5: creatividad, placer, expresión. Es momento de sembrar intenciones relacionadas con lo que te hace brillar. ¿Qué te divierte? ¿Qué te expresa? Ahí está tu semilla.',
      consejos: ['Juega más', 'Expresa sin filtro']
    },
    { 
      dia: 17, 
      tipo: 'lunaLlena' as const, 
      titulo: 'Luna Llena en Sagitario', 
      signo: 'Sagitario',
      interpretacion: 'Luna Llena en tu Casa 11: culminación en proyectos grupales, amistades, redes. Algo que empezaste con otros llega a un punto de cierre o celebración. Pregúntate: ¿qué comunidades me nutren y cuáles me drenan?',
      consejos: ['Agradece a tu tribu', 'Suelta conexiones vacías']
    },
    { 
      dia: 21, 
      tipo: 'especial' as const, 
      titulo: 'Solsticio de Verano',
      interpretacion: 'El día más largo del año. El Sol alcanza su máximo poder. Es un momento de plenitud externa, de luz máxima. Pregúntate: ¿qué está floreciendo en mi vida? ¿Qué está en su máximo brillo?'
    }
  ];

  return (
    <>
      {/* Página 1: Calendario + Mapa del Mes */}
      <CalendarioYMapaMes
        monthDate={new Date(2026, 5, 1)}
        mesNumero={6}
        nombreZodiaco="Géminis → Cáncer"
        simboloZodiaco="♊"
        temaDelMes="Expresar y conectar"
        energiaDelMes="Junio te invita a salir de la cabeza y expresarte. La energía geminiana es curiosa, comunicativa, versátil. El Solsticio de Verano marca el punto de máxima luz externa. Es momento de celebrar lo que has sembrado y dejarlo brillar."
        preguntaGuia="¿Qué me divierte? ¿Dónde está mi brillo?"
        eventos={eventosJunio}
        birthday={birthday}
      />

      {/* Página 2: Lunas + Ejercicios + Mantra */}
      <LunasYEjercicios
        monthDate={new Date(2026, 5, 1)}
        eventos={eventosJunio}
        ejercicioCentral={{
          titulo: "Mapa de Brillo",
          descripcion: "Dibuja un mapa con las áreas de tu vida que más brillan ahora mismo y las que necesitan más luz. ¿Hay alguna que estés ignorando? El Solsticio te invita a equilibrar."
        }}
        mantra="Me permito brillar sin pedir permiso"
      />

      {/* Semana del Solsticio */}
      <SemanaConInterpretacion
        weekStart={new Date(2026, 5, 15)}
        weekNumber={25}
        mesNombre="JUNIO 2026"
        tematica="Semana del Solsticio"
        eventos={eventosJunio}
        interpretacionSemanal="Esta semana contiene dos eventos mayores: la Luna Llena en Sagitario (día 17) y el Solsticio de Verano (día 21). Es una semana de máxima luz, máxima expansión. La Luna Llena cierra ciclos grupales mientras el Solsticio celebra lo que has cultivado. Permítete brillar."
        ejercicioSemana="El día del Solsticio (21), haz un ritual de celebración. Escribe 3 cosas que están floreciendo en tu vida y 3 cosas que agradeces de ti mismo/a."
        birthday={birthday}
      />

      {/* Cierre del mes */}
      <CierreMes monthDate={new Date(2026, 5, 1)} />
    </>
  );
};

// ============ EJEMPLO: ÚLTIMO DÍA DEL CICLO ============
export const UltimoDiaCicloEjemplo: React.FC<{ birthday?: Date; nombre?: string }> = ({ birthday, nombre = "Vero" }) => {
  // El día antes del cumpleaños
  const ultimoDia = birthday ? new Date(birthday.getFullYear(), birthday.getMonth(), birthday.getDate() - 1) : new Date(2027, 1, 9);
  
  return <UltimoDiaCiclo fecha={ultimoDia} nombre={nombre} />;
};

export default Enero2026Completo;
