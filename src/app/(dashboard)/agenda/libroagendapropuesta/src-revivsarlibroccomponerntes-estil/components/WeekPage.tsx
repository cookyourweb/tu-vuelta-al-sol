import { format, addDays, startOfWeek, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { Star } from "lucide-react";

interface WeekPageProps {
  weekStart: Date;
  weekNumber: number;
  name: string;
}

const zodiacSigns = [
  { sign: "♈", name: "Aries", start: [3, 21], end: [4, 19] },
  { sign: "♉", name: "Tauro", start: [4, 20], end: [5, 20] },
  { sign: "♊", name: "Géminis", start: [5, 21], end: [6, 20] },
  { sign: "♋", name: "Cáncer", start: [6, 21], end: [7, 22] },
  { sign: "♌", name: "Leo", start: [7, 23], end: [8, 22] },
  { sign: "♍", name: "Virgo", start: [8, 23], end: [9, 22] },
  { sign: "♎", name: "Libra", start: [9, 23], end: [10, 22] },
  { sign: "♏", name: "Escorpio", start: [10, 23], end: [11, 21] },
  { sign: "♐", name: "Sagitario", start: [11, 22], end: [12, 21] },
  { sign: "♑", name: "Capricornio", start: [12, 22], end: [1, 19] },
  { sign: "♒", name: "Acuario", start: [1, 20], end: [2, 18] },
  { sign: "♓", name: "Piscis", start: [2, 19], end: [3, 20] },
];

const getZodiacSign = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const zodiac of zodiacSigns) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;

    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return zodiac;
    } else if (startMonth > endMonth) {
      // Capricorn case (Dec-Jan)
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return zodiac;
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return zodiac;
    }
  }

  return zodiacSigns[0];
};

export const WeekPage = ({ weekStart, weekNumber, name }: WeekPageProps) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const monthName = format(weekStart, "MMMM yyyy", { locale: es });
  const zodiac = getZodiacSign(weekStart);

  return (
    <div className="print-page w-full min-h-[297mm] bg-background p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cosmic-gold/30">
        <div className="flex items-center gap-3">
          <span className="text-3xl text-cosmic-gold">{zodiac.sign}</span>
          <div>
            <h2 className="font-display text-xl text-foreground capitalize">
              {monthName}
            </h2>
            <p className="text-muted-foreground text-sm">
              Semana {weekNumber} · {zodiac.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-cosmic-gold" fill="currentColor" />
          <span className="font-display text-sm text-cosmic-gold">{name}</span>
        </div>
      </div>

      {/* Days grid */}
      <div className="space-y-0">
        {days.map((day, index) => {
          const isWeekend = index >= 5;
          return (
            <div
              key={index}
              className={`border-b border-border/50 py-3 ${isWeekend ? "bg-muted/20" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-24 flex-shrink-0">
                  <p className={`font-display text-sm uppercase tracking-wide ${isWeekend ? "text-cosmic-gold" : "text-muted-foreground"}`}>
                    {format(day, "EEEE", { locale: es })}
                  </p>
                  <p className="font-display text-2xl text-foreground">
                    {format(day, "d")}
                  </p>
                </div>
                <div className="flex-1 min-h-[60px] border-l border-border/30 pl-4">
                  {/* Space for notes */}
                  <div className="h-[50px]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes section */}
      <div className="mt-4 pt-4 border-t border-cosmic-gold/30">
        <p className="font-display text-sm text-cosmic-gold mb-2">Notas de la semana</p>
        <div className="h-24 border border-border/30 rounded-lg" />
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-muted-foreground text-xs">
        <span>Tu Vuelta al Sol</span>
        <span className="text-cosmic-gold">✦</span>
        <span>Semana {weekNumber}</span>
      </div>
    </div>
  );
};
