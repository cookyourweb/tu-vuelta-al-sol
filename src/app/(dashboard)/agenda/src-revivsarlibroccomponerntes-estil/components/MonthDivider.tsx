import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Star, Sparkles } from "lucide-react";

interface MonthDividerProps {
  date: Date;
  name: string;
}

const getZodiacForMonth = (month: number) => {
  const zodiacData: Record<number, { sign: string; name: string; element: string }> = {
    0: { sign: "♑♒", name: "Capricornio / Acuario", element: "Tierra / Aire" },
    1: { sign: "♒♓", name: "Acuario / Piscis", element: "Aire / Agua" },
    2: { sign: "♓♈", name: "Piscis / Aries", element: "Agua / Fuego" },
    3: { sign: "♈♉", name: "Aries / Tauro", element: "Fuego / Tierra" },
    4: { sign: "♉♊", name: "Tauro / Géminis", element: "Tierra / Aire" },
    5: { sign: "♊♋", name: "Géminis / Cáncer", element: "Aire / Agua" },
    6: { sign: "♋♌", name: "Cáncer / Leo", element: "Agua / Fuego" },
    7: { sign: "♌♍", name: "Leo / Virgo", element: "Fuego / Tierra" },
    8: { sign: "♍♎", name: "Virgo / Libra", element: "Tierra / Aire" },
    9: { sign: "♎♏", name: "Libra / Escorpio", element: "Aire / Agua" },
    10: { sign: "♏♐", name: "Escorpio / Sagitario", element: "Agua / Fuego" },
    11: { sign: "♐♑", name: "Sagitario / Capricornio", element: "Fuego / Tierra" },
  };
  return zodiacData[month];
};

export const MonthDivider = ({ date, name }: MonthDividerProps) => {
  const month = date.getMonth();
  const zodiac = getZodiacForMonth(month);

  return (
    <div className="print-page w-full h-[297mm] bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cosmic-gold"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Zodiac symbols */}
      <div className="text-6xl text-cosmic-gold mb-6 tracking-[0.5em]">
        {zodiac.sign}
      </div>

      {/* Month name */}
      <h1 className="font-display text-5xl text-foreground capitalize mb-2">
        {format(date, "MMMM", { locale: es })}
      </h1>
      <p className="font-display text-2xl text-cosmic-gold mb-8">
        {format(date, "yyyy")}
      </p>

      {/* Zodiac info */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground text-lg">
          {zodiac.name}
        </p>
        <p className="text-muted-foreground text-sm">
          Elementos: {zodiac.element}
        </p>
      </div>

      {/* Decorative line */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-px bg-gradient-to-r from-transparent to-cosmic-gold" />
        <Star className="w-6 h-6 text-cosmic-gold" fill="currentColor" />
        <div className="w-20 h-px bg-gradient-to-l from-transparent to-cosmic-gold" />
      </div>

      {/* Quote or intention space */}
      <div className="mt-12 text-center max-w-md">
        <p className="font-display text-cosmic-gold text-sm mb-4 tracking-widest uppercase">
          Intención del mes
        </p>
        <div className="h-16 border-b border-cosmic-gold/30" />
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cosmic-gold" />
        <span className="text-muted-foreground text-sm">{name}</span>
        <Sparkles className="w-4 h-4 text-cosmic-gold" />
      </div>
    </div>
  );
};
