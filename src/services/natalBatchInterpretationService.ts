// =============================================================================
// 🎯 NATAL BATCH INTERPRETATION SERVICE
// src/services/natalBatchInterpretationService.ts
// Generates 12 interpretations: 2 angles + 10 planets
// =============================================================================

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =============================================================================
// INTERFACES
// =============================================================================

interface TooltipData {
  titulo: string;
  significado: string;
  efecto: string;
  tipo: 'identidad' | 'emocion' | 'comunicacion' | 'amor' | 'accion' | 'expansion' | 'estructura' | 'innovacion' | 'espiritual' | 'transformacion' | 'fortaleza' | 'reto';
}

interface SombraData {
  nombre: string;
  descripcion: string;
  trampa: string;
  regalo: string;
}

interface DrawerData {
  titulo: string;
  educativo: string;
  poderoso: string;
  poetico: string;
  sombras: SombraData[];
  sintesis: {
    frase: string;
    declaracion: string;
  };
}

interface InterpretacionCompleta {
  tooltip: TooltipData;
  drawer: DrawerData;
}

export interface NatalInterpretations {
  angles: {
    Ascendente: InterpretacionCompleta & { signo: string; grado: number };
    MedioCielo: InterpretacionCompleta & { signo: string; grado: number };
  };
  planets: {
    [key: string]: InterpretacionCompleta; // e.g., "Sol-Sagitario-3"
  };
  aspects: {
    [key: string]: InterpretacionCompleta; // e.g., "Sol-Luna-Trigono" (filled on-demand)
  };
}

// =============================================================================
// PROMPT GENERATION
// =============================================================================

function generatePlanetPrompt(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  userName: string
): string {
  return `Generate a COMPLETE astrological interpretation for:

**PLANET**: ${planetName}
**SIGN**: ${sign}
**HOUSE**: ${house}
**DEGREE**: ${degree}°
**USER**: ${userName}

You MUST respond with VALID JSON in this EXACT structure:

{
  "tooltip": {
    "titulo": "🌟 ${planetName} en ${sign} Casa ${house}",
    "significado": "Brief 2-line explanation of what this placement means",
    "efecto": "1-line practical effect in user's life",
    "tipo": "identidad" | "emocion" | "comunicacion" | "amor" | "accion" | "expansion" | "estructura" | "innovacion" | "espiritual" | "transformacion"
  },
  "drawer": {
    "titulo": "☀️ ${planetName.toUpperCase()} EN ${sign.toUpperCase()} CASA ${house}: [Creative Title]",
    "educativo": "Educational explanation (3-4 sentences): What does ${planetName} represent fundamentally? What does ${sign} add? What area of life does House ${house} govern? Connect all three.",
    "poderoso": "DISRUPTIVE & EMPOWERING (3-4 sentences): Use ALL CAPS strategically, transformation language, antifragility approach. Make ${userName} feel POWERFUL about this placement. Example: '¡TRANSFORMA tu ${planetName} en ${sign} en un SUPERPODER de [specific quality]!'",
    "poetico": "Poetic metaphor (2-3 sentences): Beautiful, symbolic description. Example: 'Eres [metaphor related to planet/sign/house combination]...'",
    "sombras": [
      {
        "nombre": "Shadow pattern name",
        "descripcion": "What this shadow looks like in real life",
        "trampa": "The trap/pitfall of this shadow",
        "regalo": "The gift when you transform this shadow"
      }
    ],
    "sintesis": {
      "frase": "Memorable synthesis phrase",
      "declaracion": "Empowering I AM declaration in Spanish starting with 'YO SOY'"
    }
  }
}

**CRITICAL RULES**:
1. Use ${userName}'s name naturally in the text
2. EDUCATIVO: Professional, clear, educational
3. PODEROSO: Disruptive, motivational, uses strategic ALL CAPS
4. POÉTICO: Beautiful, metaphorical, inspiring
5. All text in Spanish
6. Be SPECIFIC to ${planetName} in ${sign} in House ${house}
7. Avoid generic interpretations - make it personal and unique

Generate the JSON now:`;
}

function generateAnglePrompt(
  angleName: 'Ascendente' | 'MedioCielo',
  sign: string,
  degree: number,
  userName: string
): string {
  const descriptions = {
    Ascendente: {
      emoji: '🌅',
      meaning: 'tu máscara social, cómo te presentas al mundo',
      area: 'identidad externa',
    },
    MedioCielo: {
      emoji: '🎯',
      meaning: 'tu vocación, carrera y propósito público',
      area: 'destino profesional',
    },
  };

  const desc = descriptions[angleName];

  return `Generate a COMPLETE astrological interpretation for:

**ANGLE**: ${angleName}
**SIGN**: ${sign}
**DEGREE**: ${degree}°
**USER**: ${userName}

You MUST respond with VALID JSON in this EXACT structure:

{
  "tooltip": {
    "titulo": "${desc.emoji} ${angleName} en ${sign}",
    "significado": "Brief 2-line explanation: ${angleName} represents ${desc.meaning}",
    "efecto": "1-line practical manifestation in ${userName}'s life",
    "tipo": "identidad"
  },
  "drawer": {
    "titulo": "${desc.emoji} ${angleName.toUpperCase()} EN ${sign.toUpperCase()}: [Creative Title]",
    "educativo": "Educational (3-4 sentences): What is ${angleName}? What does ${sign} bring to this angle? How does this shape ${userName}'s ${desc.area}?",
    "poderoso": "DISRUPTIVE & EMPOWERING (3-4 sentences): ¡Usa tu ${angleName} en ${sign} para [specific superpower]! Strategic ALL CAPS. Make ${userName} feel like their ${angleName} is their SECRET WEAPON.",
    "poetico": "Poetic metaphor (2-3 sentences): Beautiful description of ${userName} as [metaphor related to ${sign} ${angleName}]",
    "sombras": [
      {
        "nombre": "Main shadow of ${sign} ${angleName}",
        "descripcion": "How this manifests negatively",
        "trampa": "The trap",
        "regalo": "The gift when transformed"
      }
    ],
    "sintesis": {
      "frase": "Memorable synthesis about ${sign} ${angleName}",
      "declaracion": "Empowering declaration: 'YO SOY [related to ${sign} qualities]'"
    }
  }
}

**CRITICAL**: Use ${userName}'s name, be SPECIFIC to ${sign}, mix educational + disruptive + poetic styles. All Spanish.

Generate the JSON now:`;
}

// =============================================================================
// AI GENERATION FUNCTIONS
// =============================================================================

async function generateSingleInterpretation(prompt: string): Promise<InterpretacionCompleta> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a professional evolutionary astrologer combining:
- 📚 Educational clarity (Liz Greene style)
- 🔥 Disruptive empowerment (Antifragility approach)
- 🌙 Poetic depth (Rumi-like metaphors)

You MUST respond ONLY with valid JSON. No markdown, no explanations, JUST the JSON object.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.85,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    const parsed = JSON.parse(response);
    return parsed as InterpretacionCompleta;
  } catch (error) {
    console.error('Error generating interpretation:', error);
    throw error;
  }
}

// =============================================================================
// BATCH GENERATION
// =============================================================================

export async function generateNatalBatchInterpretations(
  chartData: any,
  userProfile: { name: string; age: number; birthPlace: string }
): Promise<NatalInterpretations> {
  console.log('🎯 Starting batch generation for', userProfile.name);

  const result: NatalInterpretations = {
    angles: {} as any,
    planets: {},
    aspects: {},
  };

  try {
    // =================================================================
    // ASCENDENTE
    // =================================================================
    console.log('🌅 Generating Ascendente...');
    const ascendente = await generateSingleInterpretation(
      generateAnglePrompt(
        'Ascendente',
        chartData.ascendant.sign,
        chartData.ascendant.degree,
        userProfile.name
      )
    );
    result.angles.Ascendente = {
      ...ascendente,
      signo: chartData.ascendant.sign,
      grado: chartData.ascendant.degree,
    };

    // =================================================================
    // MEDIO CIELO
    // =================================================================
    console.log('🎯 Generating Medio Cielo...');
    const medioCielo = await generateSingleInterpretation(
      generateAnglePrompt(
        'MedioCielo',
        chartData.midheaven.sign,
        chartData.midheaven.degree,
        userProfile.name
      )
    );
    result.angles.MedioCielo = {
      ...medioCielo,
      signo: chartData.midheaven.sign,
      grado: chartData.midheaven.degree,
    };

    // =================================================================
    // PLANETS (10)
    // =================================================================
    const planetNames = [
      'Sol',
      'Luna',
      'Mercurio',
      'Venus',
      'Marte',
      'Jupiter',
      'Saturno',
      'Urano',
      'Neptuno',
      'Pluton',
    ];

    for (const planetName of planetNames) {
      console.log(`🪐 Generating ${planetName}...`);

      const planet = chartData.planets.find(
        (p: any) => p.name.toLowerCase() === planetName.toLowerCase() || p.name === planetName
      );

      if (!planet) {
        console.warn(`⚠️ Planet ${planetName} not found in chart data`);
        continue;
      }

      const interpretation = await generateSingleInterpretation(
        generatePlanetPrompt(planetName, planet.sign, planet.house, planet.degree, userProfile.name)
      );

      const key = `${planetName}-${planet.sign}-${planet.house}`;
      result.planets[key] = interpretation;
    }

    console.log('✅ Batch generation complete!');
    return result;
  } catch (error) {
    console.error('❌ Error in batch generation:', error);
    throw error;
  }
}

// =============================================================================
// ASPECT GENERATION (ON-DEMAND)
// =============================================================================

export async function generateAspectInterpretation(
  planet1: string,
  planet2: string,
  aspectType: string,
  orb: number,
  userName: string
): Promise<InterpretacionCompleta> {
  const prompt = `Generate interpretation for aspect:

**ASPECT**: ${planet1} ${aspectType} ${planet2}
**ORB**: ${orb}°
**USER**: ${userName}

JSON structure (same as planets):
{
  "tooltip": {...},
  "drawer": {...}
}

Focus on HOW these two energies interact in ${userName}'s life.`;

  return await generateSingleInterpretation(prompt);
}
// =============================================================================
// SINGLE PLANET GENERATION (ON-DEMAND)
// =============================================================================

export async function generateSinglePlanetInterpretation(
  planetName: string,
  sign: string,
  house: number,
  degree: number,
  userName: string
): Promise<InterpretacionCompleta> {
  console.log(`🪐 Generating single interpretation: ${planetName} in ${sign} House ${house}`);

  const prompt = generatePlanetPrompt(planetName, sign, house, degree, userName);
  return await generateSingleInterpretation(prompt);
}

// =============================================================================
// SINGLE ANGLE GENERATION (ON-DEMAND)
// =============================================================================

export async function generateSingleAngleInterpretation(
  angleName: 'Ascendente' | 'MedioCielo',
  sign: string,
  degree: number,
  userName: string
): Promise<InterpretacionCompleta> {
  console.log(`🌅 Generating single angle interpretation: ${angleName} in ${sign}`);

  const prompt = generateAnglePrompt(angleName, sign, degree, userName);
  return await generateSingleInterpretation(prompt);
}
