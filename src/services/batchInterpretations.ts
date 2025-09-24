import { AstrologicalEvent, UserProfile, PersonalizedInterpretation } from "@/types/astrology/unified-types";

export async function generateBatchInterpretations(
  events: AstrologicalEvent[],
  userProfile: UserProfile
): Promise<AstrologicalEvent[]> {
  console.log(`🤖 Generando interpretaciones para ${events.length} eventos`);

  // For now, return events with basic interpretations
  // In a full implementation, this would call OpenAI for each event
  return events.map(event => ({
    ...event,
    personalInterpretation: {
      meaning: `Interpretación personalizada para ${userProfile.name} en ${event.date}`,
      lifeAreas: [],
      advice: "Reflexiona sobre este tránsito",
      mantra: "Estoy abierto al cambio",
      ritual: "Meditación diaria",
      actionPlan: [
        {
          category: "crecimiento",
          action: "Reflexiona sobre este tránsito",
          timing: "inmediato",
          difficulty: "fácil",
          impact: "medio"
        }
      ],
      warningsAndOpportunities: {
        warnings: [],
        opportunities: ["Oportunidad de crecimiento personal"]
      }
    } as PersonalizedInterpretation
  }));
}

export function getInterpretationStats(events: AstrologicalEvent[]): {
  total: number;
  withInterpretation: number;
  averageQuality: number;
  withNatalContext: number;
  byPlanet: Record<string, number>;
} {
  const total = events.length;
  const withInterpretation = events.filter(e => e.personalInterpretation).length;
  const averageQuality = 85; // Placeholder
  const withNatalContext = events.filter(e => e.personalInterpretation?.meaning?.includes('natal')).length;

  const byPlanet: Record<string, number> = {};
  events.forEach(event => {
    // Simple planet extraction from title
    const planets = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'];
    planets.forEach(planet => {
      if (event.title.includes(planet)) {
        byPlanet[planet] = (byPlanet[planet] || 0) + 1;
      }
    });
  });

  return {
    total,
    withInterpretation,
    averageQuality,
    withNatalContext,
    byPlanet
  };
}
