import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Star } from "lucide-react";

interface BirthdayFormProps {
  onSubmit: (name: string, birthday: Date) => void;
}

export const BirthdayForm = ({ onSubmit }: BirthdayFormProps) => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && birthday) {
      onSubmit(name, new Date(birthday));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 stars-bg">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-amber flex items-center justify-center shadow-glow">
            <Star className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
        </div>

        <div className="absolute -top-4 -left-4 w-2 h-2 rounded-full bg-cosmic-star animate-twinkle" />
        <div className="absolute top-20 -right-8 w-3 h-3 rounded-full bg-cosmic-gold-light animate-twinkle" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-10 -left-6 w-2 h-2 rounded-full bg-cosmic-star animate-twinkle" style={{ animationDelay: "2s" }} />

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-card border border-border/50 rounded-2xl p-8 shadow-cosmic backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <p className="text-cosmic-gold text-sm tracking-[0.3em] uppercase mb-2">
              Bienvenido a
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Tu Vuelta al Sol
            </h1>
            <p className="text-muted-foreground text-lg">
              Agenda Astrológica Imprimible
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-display tracking-wide">
                Tu Nombre
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Escribe tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-cosmic-gold focus:ring-cosmic-gold/30 font-body text-lg h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-foreground font-display tracking-wide">
                Tu Fecha de Cumpleaños
              </Label>
              <Input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
                className="bg-muted/50 border-border/50 text-foreground focus:border-cosmic-gold focus:ring-cosmic-gold/30 font-body text-lg h-12"
              />
            </div>

            <Button type="submit" variant="cosmic" size="xl" className="w-full mt-4">
              <Sparkles className="w-5 h-5" />
              Generar Mi Agenda
            </Button>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Tu agenda personal desde tu cumpleaños de este año hasta el próximo
          </p>
        </form>
      </div>
    </div>
  );
};
