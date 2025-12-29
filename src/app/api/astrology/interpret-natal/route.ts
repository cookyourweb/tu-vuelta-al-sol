// =============================================================================
// 🎯 NATAL INTERPRETATION API ROUTE - COMPLETELY FIXED VERSION
// src/app/api/astrology/interpret-natal/route.ts
// =============================================================================
// ✅ FIXED: Now returns proper JSON structure with OBJECTS not STRINGS
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import OpenAI from 'openai';
import {
  findPlanetByName,
  debugListPlanets,
  verifyExpectedPlanets,
} from '@/utils/planetNameUtils';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 10;

// =============================================================================
// TYPES
// =============================================================================

interface TooltipInterpretation {
  titulo: string;
  descripcionBreve: string;
  significado: string;
  efecto: string;
  tipo: string;
}

interface DrawerInterpretation {
  titulo: string;
  educativo: string;
  poderoso: string;
  impacto_real: string;
  sombras: Array<{
    nombre: string;
    descripcion: string;
    trampa: string;
    regalo: string;
  }>;
  sintesis: {
    frase: string;
    declaracion: string;
  };
}

interface PlanetInterpretation {
  tooltip: TooltipInterpretation;
  drawer: DrawerInterpretation;
}

interface NatalInterpretations {
  angles: {
    Ascendente: PlanetInterpretation;
    MedioCielo: PlanetInterpretation;
  };
  planets: Record<string, PlanetInterpretation>;
  asteroids: Record<string, PlanetInterpretation>; // Lilith, Chiron
  nodes: Record<string, PlanetInterpretation>; // North Node, South Node
  elements: Record<string, PlanetInterpretation>; // Fire, Earth, Air, Water
  modalities: Record<string, PlanetInterpretation>; // Cardinal, Fixed, Mutable
  aspects: Record<string, PlanetInterpretation>; // All major aspects
}

// =============================================================================
// OPENAI CLIENT
// =============================================================================

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// =============================================================================
// GET - Retrieve existing interpretations
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId required' 
      }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;
    
    const interpretation = await db.collection('interpretations').findOne({
      userId,
      chartType: 'natal',
    });

    if (!interpretation) {
      return NextResponse.json({
        success: false,
        needsGeneration: true,
        message: 'No interpretations found. Generate them first.',
      });
    }

    return NextResponse.json({
      success: true,
      data: interpretation.interpretations,
      cached: true,
      generatedAt: interpretation.generatedAt,
      stats: interpretation.stats,
    });
    
  } catch (error) {
    console.error('❌ Error fetching interpretations:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}

// =============================================================================
// POST - Generate all interpretations (2 angles + 10 planets + asteroids + nodes + elements + modalities + aspects) with progress updates
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chartData, userProfile } = body;

    console.log('🎯 [DEBUG] POST request received');
    console.log('🎯 [DEBUG] userId:', userId);
    console.log('🎯 [DEBUG] userProfile:', userProfile);
    console.log('🎯 [DEBUG] chartData keys:', Object.keys(chartData || {}));

    if (!userId || !chartData || !userProfile) {
      console.log('❌ [DEBUG] Missing required fields:', { userId: !!userId, chartData: !!chartData, userProfile: !!userProfile });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, chartData, userProfile' },
        { status: 400 }
      );
    }

    console.log('🎯 [DEBUG] Starting natal interpretations generation for:', userProfile.name);

    const startTime = Date.now();

    // Generate all interpretations
    console.log('🎯 [DEBUG] Calling generateNatalBatchInterpretations...');
    const interpretations = await generateNatalBatchInterpretations(chartData, userProfile);

    console.log('🎯 [DEBUG] Interpretations generated successfully');
    console.log('🎯 [DEBUG] Interpretation keys:', Object.keys(interpretations));
    console.log('🎯 [DEBUG] Planets count:', Object.keys(interpretations.planets || {}).length);
    console.log('🎯 [DEBUG] Angles count:', Object.keys(interpretations.angles || {}).length);

    const generationTime = ((Date.now() - startTime) / 1000).toFixed(0);

    // Save to MongoDB
    console.log('🎯 [DEBUG] Connecting to database...');
    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    const stats = {
      totalAngles: 2,
      totalPlanets: Object.keys(interpretations.planets).length,
      totalAsteroids: Object.keys(interpretations.asteroids).length,
      totalNodes: Object.keys(interpretations.nodes).length,
      totalElements: Object.keys(interpretations.elements).length,
      totalModalities: Object.keys(interpretations.modalities).length,
      totalAspects: Object.keys(interpretations.aspects).length,
      generationTime: `${generationTime}s`,
      totalCost: '$2.50', // Approximate for expanded interpretations
    };

    console.log('🎯 [DEBUG] Saving to MongoDB with stats:', stats);

    await db.collection('interpretations').updateOne(
      { userId, chartType: 'natal' },
      {
        $set: {
          userId,
          chartType: 'natal',
          interpretations,
          stats,
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      },
      { upsert: true }
    );

    console.log('✅ [DEBUG] Interpretations saved to MongoDB successfully');
    return NextResponse.json({
      success: true,
      data: interpretations,
      cached: false,
      generatedAt: new Date().toISOString(),
      stats,
    });
  } catch (error) {
    console.error('❌ Error in POST:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}

// =============================================================================
// PUT - Generate specific aspect interpretation
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planet1, planet2, aspectType, orb } = body;

    if (!userId || !planet1 || !planet2 || !aspectType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planet1, planet2, aspectType' },
        { status: 400 }
      );
    }

    console.log('🎯 [PUT] Generating aspect interpretation:', { userId, planet1, planet2, aspectType, orb });

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Check if interpretation already exists
    const existing = await db.collection('interpretations').findOne({
      userId,
      chartType: 'natal',
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'No natal interpretations found. Generate them first.' },
        { status: 404 }
      );
    }

    const aspectKey = `${planet1}-${planet2}-${aspectType}`;

    // Check if aspect interpretation already exists
    if (existing.interpretations.aspects?.[aspectKey]) {
      console.log('✅ [PUT] Aspect interpretation already exists');
      return NextResponse.json({
        success: true,
        data: existing.interpretations.aspects[aspectKey],
        cached: true,
      });
    }

    // Generate new aspect interpretation
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const aspectInterpretation = await generateAspectInterpretation(
      { planet1, planet2, type: aspectType, orb },
      { name: 'User', age: 30 }, // Default user profile
      openai
    );

    // Update the interpretations with the new aspect
    const updatedInterpretations = {
      ...existing.interpretations,
      aspects: {
        ...existing.interpretations.aspects,
        [aspectKey]: aspectInterpretation,
      },
    };

    // Save back to database
    await db.collection('interpretations').updateOne(
      { userId, chartType: 'natal' },
      {
        $set: {
          interpretations: updatedInterpretations,
          updatedAt: new Date(),
        },
      }
    );

    console.log('✅ [PUT] Aspect interpretation generated and saved');

    return NextResponse.json({
      success: true,
      data: aspectInterpretation,
      cached: false,
    });

  } catch (error) {
    console.error('❌ Error in PUT:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// =============================================================================
// DELETE - Remove cached interpretations (force regeneration)
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'userId required' 
      }, { status: 400 });
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;
    
    await db.collection('interpretations').deleteOne({
      userId,
      chartType: 'natal',
    });

    console.log('🗑️ Deleted cached interpretations for:', userId);
    return NextResponse.json({
      success: true,
      message: 'Cached interpretations deleted',
    });
    
  } catch (error) {
    console.error('❌ Error deleting interpretations:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json({ 
      success: false, 
      error: 'Server error' 
    }, { status: 500 });
  }
}

// =============================================================================
// GENERATION FUNCTIONS
// =============================================================================

async function generateNatalBatchInterpretations(
  chartData: any,
  userProfile: any,
  onProgress?: (message: string, progress: number) => void
): Promise<NatalInterpretations> {

  console.log('🎯 [DEBUG] generateNatalBatchInterpretations called');
  console.log('🎯 [DEBUG] chartData structure:', {
    hasAscendant: !!chartData.ascendant,
    hasMidheaven: !!chartData.midheaven,
    planetsCount: chartData.planets?.length || 0,
    hasElementDistribution: !!chartData.elementDistribution,
    hasModalityDistribution: !!chartData.modalityDistribution,
    aspectsCount: chartData.calculatedAspects?.length || 0
  });

  // Debug planet names
  console.log('🎯 [DEBUG] Planet names in chartData:');
  debugListPlanets(chartData.planets);

  const openai = getOpenAIClient();

  console.log('🎯 [DEBUG] OpenAI client initialized');

  onProgress?.('🌟 Generando tu Ascendente y Medio Cielo...', 5);

  const interpretations: NatalInterpretations = {
    angles: {
      Ascendente: await generateAngleInterpretation('Ascendente', chartData.ascendant, userProfile, openai),
      MedioCielo: await generateAngleInterpretation('MedioCielo', chartData.midheaven, userProfile, openai),
    },
    planets: {},
    asteroids: {},
    nodes: {},
    elements: {},
    modalities: {},
    aspects: {},
  };

  console.log('🎯 [DEBUG] Angles generated successfully');

  onProgress?.('✨ Generando interpretaciones de planetas...', 15);

  // Generate planet interpretations
  const planetNames = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Jupiter', 'Saturno', 'Urano', 'Neptuno', 'Pluton'];

  console.log('🎯 [DEBUG] Starting planet generation loop');

  for (let i = 0; i < planetNames.length; i++) {
    const planetName = planetNames[i];
    console.log(`🎯 [DEBUG] Looking for planet: ${planetName}`);

    const planet = findPlanetByName(chartData.planets, planetName);
    if (planet) {
      console.log(`🎯 [DEBUG] Found planet ${planetName}:`, { sign: planet.sign, house: planet.house, degree: planet.degree });

      const progress = 15 + (i / planetNames.length) * 30; // 15-45%
      onProgress?.(`🌟 Generando tu ${planetName} en ${planet.sign}...`, progress);

      const key = `${planet.name}-${planet.sign}-${planet.house}`;
      console.log(`🎯 [DEBUG] Generating interpretation for key: ${key}`);

      interpretations.planets[key] = await generatePlanetInterpretation(planet, userProfile, openai);

      console.log(`🎯 [DEBUG] Successfully generated interpretation for ${planetName}`);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } else {
      console.log(`❌ [DEBUG] Planet ${planetName} not found in chartData.planets`);
    }
  }

  console.log('🎯 [DEBUG] Planet generation completed');

  // Generate asteroid interpretations (Lilith, Chiron)
  onProgress?.('🌑 Generando tu Lilith y Chiron...', 50);
  const asteroidNames = ['Lilith', 'Chiron'];

  for (let i = 0; i < asteroidNames.length; i++) {
    const asteroidName = asteroidNames[i];
    const asteroid = findPlanetByName(chartData.planets, asteroidName);
    if (asteroid) {
      const progress = 50 + (i / asteroidNames.length) * 10; // 50-60%
      onProgress?.(`🌑 Generando tu ${asteroidName} en ${asteroid.sign}...`, progress);

      const key = `${asteroid.name}-${asteroid.sign}-${asteroid.house}`;
      interpretations.asteroids[key] = await generatePlanetInterpretation(asteroid, userProfile, openai);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate nodes interpretations (North Node, South Node)
  onProgress?.('🌙 Generando tus Nodos Lunares...', 65);
  const nodeNames = ['Nodo Norte', 'Nodo Sur'];

  for (let i = 0; i < nodeNames.length; i++) {
    const nodeName = nodeNames[i];
    const node = findPlanetByName(chartData.planets, nodeName);
    if (node) {
      const progress = 65 + (i / nodeNames.length) * 10; // 65-75%
      onProgress?.(`🌙 Generando tu ${nodeName} en ${node.sign}...`, progress);

      const key = `${node.name}-${node.sign}-${node.house}`;
      interpretations.nodes[key] = await generatePlanetInterpretation(node, userProfile, openai);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate elements interpretations
  onProgress?.('🔥 Generando tus Elementos (Fuego, Tierra, Aire, Agua)...', 80);
  const elements = [
    { name: 'Fuego', distribution: chartData.elementDistribution?.fire || 0 },
    { name: 'Tierra', distribution: chartData.elementDistribution?.earth || 0 },
    { name: 'Aire', distribution: chartData.elementDistribution?.air || 0 },
    { name: 'Agua', distribution: chartData.elementDistribution?.water || 0 }
  ];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.distribution > 0) {
      const progress = 80 + (i / elements.length) * 5; // 80-85%
      onProgress?.(`🔥 Generando tu Elemento ${element.name} (${element.distribution} planetas)...`, progress);

      const key = `Elemento-${element.name}`;
      interpretations.elements[key] = await generateElementInterpretation(element, userProfile, openai);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate modalities interpretations
  onProgress?.('⚡ Generando tus Modalidades (Cardinal, Fijo, Mutable)...', 90);
  const modalities = [
    { name: 'Cardinal', distribution: chartData.modalityDistribution?.cardinal || 0 },
    { name: 'Fijo', distribution: chartData.modalityDistribution?.fixed || 0 },
    { name: 'Mutable', distribution: chartData.modalityDistribution?.mutable || 0 }
  ];

  for (let i = 0; i < modalities.length; i++) {
    const modality = modalities[i];
    if (modality.distribution > 0) {
      const progress = 90 + (i / modalities.length) * 5; // 90-95%
      onProgress?.(`⚡ Generando tu Modalidad ${modality.name} (${modality.distribution} planetas)...`, progress);

      const key = `Modalidad-${modality.name}`;
      interpretations.modalities[key] = await generateModalityInterpretation(modality, userProfile, openai);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate aspects interpretations
  if (chartData.aspects && chartData.aspects.length > 0) {
    onProgress?.('🔗 Generando tus Aspectos principales...', 98);
    const aspectsToGenerate = chartData.aspects.slice(0, 10); // Limit to first 10 aspects

    for (let i = 0; i < aspectsToGenerate.length; i++) {
      const aspect = aspectsToGenerate[i];
      const progress = 98 + (i / aspectsToGenerate.length) * 2; // 98-100%
      onProgress?.(`🔗 Generando ${aspect.planet1} ${aspect.type} ${aspect.planet2}...`, progress);

      const key = `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;
      interpretations.aspects[key] = await generateAspectInterpretation(aspect, userProfile, openai);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  onProgress?.('✨ ¡Interpretaciones completadas! 🎉', 100);

  console.log('🎯 [DEBUG] All interpretations completed successfully');
  console.log('🎯 [DEBUG] Final interpretation counts:', {
    angles: Object.keys(interpretations.angles).length,
    planets: Object.keys(interpretations.planets).length,
    asteroids: Object.keys(interpretations.asteroids).length,
    nodes: Object.keys(interpretations.nodes).length,
    elements: Object.keys(interpretations.elements).length,
    modalities: Object.keys(interpretations.modalities).length,
    aspects: Object.keys(interpretations.aspects).length,
  });

  return interpretations;
}

// =============================================================================
// ✅ COMPLETELY FIXED: generateAngleInterpretation
// =============================================================================

async function generateAngleInterpretation(
  angleName: string,
  angleData: any,
  userProfile: any,
  openai: OpenAI
): Promise<PlanetInterpretation> {
  
  const prompt = `Eres un astrólogo evolutivo experto. Genera una interpretación DISRUPTIVA y TRANSFORMACIONAL para:

**ÁNGULO:** ${angleName}
**SIGNO:** ${angleData.sign}
**GRADO:** ${angleData.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON. NO agregues texto adicional:

{
  "tooltip": {
    "titulo": "🌟 [Título corto - máx 5 palabras]",
    "descripcionBreve": "${angleName} en ${angleData.sign} (${angleData.degree}°)",
    "significado": "[2-3 líneas explicando el significado con lenguaje disruptivo]",
    "efecto": "[1 frase del efecto principal]",
    "tipo": "[Arquetipo - ej: 'Revolucionario', 'Sanador']"
  },
  "drawer": {
    "titulo": "${angleName} en ${angleData.sign}: [Tema principal - ej: 'Identidad y Presencia']",
    "educativo": "[Explicación clara: QUÉ es el ${angleName}, CÓMO funciona en ${angleData.sign}. Usa lenguaje psicológico, no místico. Ejemplos desde la infancia hasta ahora con comportamientos observables. 3-5 párrafos claros]",
    "poderoso": "[Análisis psicológico profundo de cómo se manifiesta. Usa TONO OBSERVADOR, no directivo. Describe patrones estables. Ejemplo: 'Tu forma de presentarte al mundo está ligada a...' NO uses: 'superpoder', '¡NO VINISTE A...!'. SÍ usa: 'Desde temprano, puedes haber sentido...', 'Esta configuración se nota cuando...'. 3-4 párrafos observadores]",
    "impacto_real": "[Impacto concreto en tu vida. NO metáforas. SÍ decisiones y comportamientos reales. Usa lenguaje observador: 'Puedes notar que...', 'Se manifiesta cuando...'. 3-5 ejemplos concretos de cómo se vive día a día. 2-3 párrafos directos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra]",
        "descripcion": "[Cómo se manifiesta - tono observador]",
        "trampa": "❌ [Patrón reactivo - describe sin ordenar]",
        "regalo": "✅ [Patrón integrado - posibilidad, no mandato]"
      }
    ],
    "sintesis": {
      "frase": "[Resumen claro en máximo 15 palabras. PROHIBIDO: 'superpoder', 'misión cósmica', 'portal', metáforas. DEBE ser PSICOLÓGICO. Ejemplo: 'Tu forma de presentarte al mundo refleja independencia y autenticidad']",
      "declaracion": "[Afirmación en primera persona de máximo 2 líneas. PROHIBIDO lenguaje épico. DEBE ser OBSERVADOR. Ejemplo: 'Mi forma de estar en el mundo incluye autenticidad y espontaneidad. Esto se refleja en cómo me presento y relaciono.']"
    }
  }
}

ESTILO: Observador (NO directivo), psicológico, claro y adulto.
PROHIBIDO: "superpoder", "misión cósmica", "¡NO VINISTE A...!", mayúsculas enfáticas.
TONO: Describe cómo eres y cómo funciona, no órdenes.
RESPONDE SOLO CON JSON VÁLIDO.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto. Respondes EXCLUSIVAMENTE con JSON válido sin texto adicional.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from OpenAI');

    let cleanedResponse = response.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    // Validate structure
    if (!parsed.tooltip || typeof parsed.tooltip !== 'object') {
      throw new Error('Invalid tooltip structure');
    }
    if (!parsed.drawer || typeof parsed.drawer !== 'object') {
      throw new Error('Invalid drawer structure');
    }

    console.log(`✅ Generated ${angleName} interpretation`);
    return parsed as PlanetInterpretation;
    
  } catch (error) {
    console.error(`❌ Error generating ${angleName}:`, error);
    console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack');
    return generateFallbackAngleInterpretation(angleName, angleData);
  }
}

// =============================================================================
// ✅ COMPLETELY FIXED: generatePlanetInterpretation
// =============================================================================

async function generatePlanetInterpretation(
  planet: any,
  userProfile: any,
  openai: OpenAI
): Promise<PlanetInterpretation> {

  console.log(`🎯 [DEBUG] generatePlanetInterpretation called for ${planet.name}`);

  const prompt = `Eres un astrólogo evolutivo experto. Genera una interpretación DISRUPTIVA para:

**PLANETA:** ${planet.name}
**SIGNO:** ${planet.sign}
**CASA:** ${planet.house}
**GRADO:** ${planet.degree}°

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🌟 [Título impactante - máx 5 palabras]",
    "descripcionBreve": "${planet.name} en ${planet.sign} en Casa ${planet.house} (${planet.degree}°)",
    "significado": "[2-3 líneas claras del significado con lenguaje disruptivo]",
    "efecto": "[1 frase del efecto principal]",
    "tipo": "[Arquetipo - ej: 'Visionario', 'Guerrero']"
  },
  "drawer": {
    "titulo": "${planet.name} en ${planet.sign} en Casa ${planet.house}: [Tema principal - ej: 'Proceso de Maduración']",
    "educativo": "[QUÉ significa ${planet.name}, CÓMO funciona en ${planet.sign}, QUÉ implica Casa ${planet.house}. Usa lenguaje psicológico, no místico. Explica desde la infancia hasta ahora con comportamientos observables. 3-5 párrafos claros y directos]",
    "poderoso": "[Análisis psicológico profundo: Cómo se manifiesta esta configuración en tu forma de ser. Usa TONO OBSERVADOR, no directivo. Describe patrones estables, no órdenes. Ejemplo: 'Tu proceso de maduración está ligado a...' NO uses: 'superpoder', 'misión cósmica', '¡NO VINISTE A...!'. SÍ usa: 'Desde temprano, puedes haber sentido...', 'Esta configuración activa...'. 3-4 párrafos observadores]",
    "impacto_real": "[Impacto concreto en tu vida. NO metáforas. SÍ decisiones y comportamientos reales. Usa lenguaje observador: 'Puedes notar que...', 'Se manifiesta cuando...', 'Esta configuración aparece en situaciones donde...'. 4-6 ejemplos concretos de cómo se vive en el día a día. 2-3 párrafos directos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta - tono observador, no juicio]",
        "trampa": "❌ [Patrón reactivo - describe sin ordenar]",
        "regalo": "✅ [Patrón integrado - describe posibilidad, no mandato]"
      },
      {
        "nombre": "[Segunda sombra opcional]",
        "descripcion": "[Explicación - tono psicológico]",
        "trampa": "❌ [Trampa observable]",
        "regalo": "✅ [Regalo cuando se integra]"
      }
    ],
    "sintesis": {
      "frase": "[Resumen claro en máximo 15 palabras. PROHIBIDO: 'superpoder', 'misión cósmica', 'portal', 'puente', 'tejer', 'océano de', metáforas poéticas. DEBE ser PSICOLÓGICO y CONCRETO. Ejemplos: 'Tu proceso de desarrollo está ligado a la expresión creativa', 'Esta configuración activa patrones de independencia y autonomía']",
      "declaracion": "[Afirmación en primera persona de máximo 2 líneas. PROHIBIDO lenguaje épico o místico. DEBE ser OBSERVADOR y CLARO. Ejemplos: 'Mi forma de procesar emociones incluye profundidad e intensidad. Esta capacidad se manifiesta en mis relaciones y decisiones.', 'Esta configuración se refleja en mi necesidad de estructura y autonomía simultáneas.']"
    }
  }
}

ESTILO: Observador (NO directivo), psicológico (sombras/posibilidades), claro y adulto.
PROHIBIDO: "superpoder", "misión cósmica", "portal", "¡NO VINISTE A...!", mayúsculas enfáticas.
TONO: Describe cómo eres y cómo funciona, no órdenes de qué hacer.
RESPONDE SOLO JSON VÁLIDO. NO agregues texto antes/después.`;

  try {
    console.log(`🎯 [DEBUG] Calling OpenAI for ${planet.name} interpretation`);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto. Respondes EXCLUSIVAMENTE con JSON válido sin texto adicional ni markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const response = completion.choices[0]?.message?.content;

    console.log(`🎯 [DEBUG] OpenAI response received for ${planet.name}, length: ${response?.length || 0}`);

    if (!response) {
      console.log(`❌ [DEBUG] No response from OpenAI for ${planet.name}`);
      throw new Error('No response from OpenAI');
    }

    // Clean response
    let cleanedResponse = response.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    console.log(`🎯 [DEBUG] Cleaned response for ${planet.name}, first 200 chars:`, cleanedResponse.substring(0, 200));

    const parsed = JSON.parse(cleanedResponse);

    console.log(`🎯 [DEBUG] JSON parsed successfully for ${planet.name}`);

    // Validate structure
    if (!parsed.tooltip || typeof parsed.tooltip !== 'object') {
      console.error('❌ [DEBUG] Invalid tooltip structure for', planet.name);
      throw new Error('Invalid tooltip structure');
    }

    if (!parsed.drawer || typeof parsed.drawer !== 'object') {
      console.error('❌ [DEBUG] Invalid drawer structure for', planet.name);
      throw new Error('Invalid drawer structure');
    }

    // Validate required fields
    if (!parsed.tooltip.titulo || !parsed.tooltip.significado) {
      console.error('❌ [DEBUG] Missing required tooltip fields for', planet.name);
      throw new Error('Missing required tooltip fields');
    }

    if (!parsed.drawer.educativo || !parsed.drawer.poderoso || !parsed.drawer.poetico) {
      console.error('❌ [DEBUG] Missing required drawer fields for', planet.name);
      throw new Error('Missing required drawer fields');
    }

    console.log(`✅ [DEBUG] Generated ${planet.name} interpretation successfully`);
    return parsed as PlanetInterpretation;
  } catch (error) {
    console.error(`❌ Error generating ${planet.name}:`, error);
    console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack');
    if (error instanceof SyntaxError) {
      console.error('❌ JSON Parse Error:', error.message);
      console.error('❌ Raw response:', error);
    }
    console.log(`🎯 Falling back to static interpretation for ${planet.name}`);
    return generateFallbackPlanetInterpretation(planet);
  }
}

// =============================================================================
// FALLBACK FUNCTIONS (correct structure)
// =============================================================================

function generateFallbackAngleInterpretation(angleName: string, angleData: any): PlanetInterpretation {
  return {
    tooltip: {
      titulo: `✨ ${angleName} en ${angleData.sign}`,
      descripcionBreve: `${angleName} en ${angleData.sign} (${angleData.degree}°)`,
      significado: `Tu ${angleName} en ${angleData.sign} define aspectos fundamentales de tu identidad y propósito. Es una configuración poderosa que merece tu atención.`,
      efecto: 'Influencia significativa en tu vida',
      tipo: 'Energía fundamental',
    },
    drawer: {
      titulo: `✨ Tu ${angleName} en ${angleData.sign}`,
      educativo: `El ${angleName} representa un punto crucial en tu carta natal. Cuando está en ${angleData.sign}, adquiere las cualidades de este signo y se expresa de una manera única.\n\nDesde la infancia, esta configuración ha estado moldeando tu forma de ser, aunque quizás no fueras consciente de ello. Esta configuración actúa como filtro a través del cual percibes y te relacionas con el mundo.`,
      poderoso: `Tu ${angleName} en ${angleData.sign} se manifiesta en tu forma de presentarte y relacionarte con el entorno.\n\nEsta configuración actúa de manera constante en tu vida. Puedes notar que ciertos patrones de comportamiento se repiten, especialmente en cómo inicias nuevas situaciones o cómo te perciben los demás.\n\nCuando actúas alineado con las cualidades de ${angleData.sign}, experimentas mayor fluidez. Cuando resistes o intentas ser diferente a esta naturaleza, puede aparecer tensión o sensación de inautenticidad.`,
      impacto_real: `Durante tu vida:\n- Las personas perciben inmediatamente tu esencia ${angleData.sign} cuando te conocen\n- Tiendes a tomar decisiones que reflejan las cualidades de ${angleData.sign}\n- Tu forma de presentarte al mundo está profundamente influenciada por esta configuración\n- Cuando actúas alineado con ${angleData.sign}, sientes mayor autenticidad y fluidez`,
      sombras: [
        {
          nombre: 'Uso inconsciente',
          descripcion: 'Cuando no activamos esta energía conscientemente',
          trampa: '❌ Actúa automáticamente sin consciencia cuando no reconoces esta energía',
          regalo: '✅ Cuando reconoces conscientemente esta configuración, puedes usarla con mayor intención',
        },
      ],
      sintesis: {
        frase: `Mi ${angleName} en ${angleData.sign} define mi forma de presentarme al mundo.`,
        declaracion: `Mi ${angleName} en ${angleData.sign} se manifiesta en mi forma de ser y relacionarme. Esta configuración es parte integral de mi identidad.`,
      },
    },
  };
}

function generateFallbackPlanetInterpretation(planet: any): PlanetInterpretation {
  return {
    tooltip: {
      titulo: `✨ ${planet.name} en ${planet.sign}`,
      descripcionBreve: `${planet.name} en ${planet.sign} en Casa ${planet.house}`,
      significado: `Tu ${planet.name} en ${planet.sign} representa una energía fundamental. Esta configuración revela aspectos profundos de tu personalidad que mereces explorar.`,
      efecto: 'Influencia planetaria significativa',
      tipo: 'Energía transformadora',
    },
    drawer: {
      titulo: `✨ ${planet.name} en ${planet.sign} en Casa ${planet.house}`,
      educativo: `${planet.name} simboliza aspectos esenciales de tu ser. En ${planet.sign}, esta energía se expresa con las cualidades de este signo. La Casa ${planet.house} muestra dónde se manifiesta más intensamente en tu vida.\n\nDesde temprano en tu vida, esta configuración ha influido en tu forma de ser, aunque quizás no lo reconocieras. Esta posición actúa como patrón estable en tu personalidad.`,
      poderoso: `Tu ${planet.name} en ${planet.sign} se manifiesta en patrones observables de comportamiento.\n\nEsta configuración actúa de manera constante en tu vida, especialmente en las áreas relacionadas con la Casa ${planet.house}. Puedes notar que ciertas tendencias se repiten en cómo abordas estos temas.\n\nCuando actúas alineado con las cualidades de ${planet.sign} en estos temas, las cosas tienden a fluir. Cuando intentas forzar un enfoque que no resuena con esta naturaleza, puede aparecer resistencia o frustración.`,
      impacto_real: `Durante tu vida:\n- Tus decisiones en el área de la Casa ${planet.house} reflejan las cualidades de ${planet.sign}\n- Las personas notan en ti características asociadas con ${planet.name} en ${planet.sign}\n- Cuando esta energía está activa, experimentas mayor autenticidad y propósito\n- Tu forma de abordar los temas de la Casa ${planet.house} está profundamente influenciada por ${planet.sign}`,
      sombras: [
        {
          nombre: 'Uso reactivo de la energía',
          descripcion: 'Cuando esta configuración actúa automáticamente sin consciencia',
          trampa: '❌ Actúa de forma reactiva cuando no reconoces conscientemente este patrón',
          regalo: '✅ Cuando reconoces esta configuración, puedes trabajar con ella de manera más consciente',
        },
      ],
      sintesis: {
        frase: `Mi ${planet.name} en ${planet.sign} define cómo funciono en esta área de mi vida.`,
        declaracion: `Mi ${planet.name} en ${planet.sign} se manifiesta en patrones estables de comportamiento. Esta configuración es parte de mi naturaleza.`,
      },
    },
  };
}

// =============================================================================
// NEW GENERATION FUNCTIONS
// =============================================================================

// Generate element interpretation
async function generateElementInterpretation(
  element: any,
  userProfile: any,
  openai: OpenAI
): Promise<PlanetInterpretation> {

  const prompt = `Eres un astrólogo evolutivo experto. Genera una interpretación DISRUPTIVA para:

**ELEMENTO:** ${element.name}
**DISTRIBUCIÓN:** ${element.distribution} planetas

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🌟 [Título impactante - máx 5 palabras]",
    "descripcionBreve": "Elemento ${element.name} con ${element.distribution} planetas",
    "significado": "[2-3 líneas claras del significado con lenguaje disruptivo]",
    "efecto": "[1 frase del efecto principal]",
    "tipo": "[Arquetipo - ej: 'Flamígero', 'Terrestre']"
  },
  "drawer": {
    "titulo": "Elemento ${element.name}: [Tema principal - ej: 'Pasión y Acción']",
    "educativo": "[QUÉ significa el elemento ${element.name}, CÓMO funciona, ejemplos desde niño y ahora. 3-5 párrafos claros]",
    "poderoso": "[Análisis psicológico profundo de cómo se manifiesta el elemento ${element.name}. Usa TONO OBSERVADOR, no directivo. Describe patrones estables. Ejemplo: 'El elemento ${element.name} se manifiesta en tu tendencia a...' NO uses: 'superpoder', '¡NO VINISTE A...!'. SÍ usa: 'Puedes notar que...', 'Esta configuración elemental aparece cuando...'. 3-4 párrafos observadores]",
    "impacto_real": "[Impacto concreto en tu vida. NO metáforas. SÍ decisiones y comportamientos reales. Usa lenguaje observador: 'Puedes notar que cuando el elemento ${element.name} está activo...', 'Se manifiesta en situaciones donde...'. 3-5 ejemplos concretos de cómo se vive día a día. 2-3 párrafos directos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta]",
        "trampa": "❌ [Forma reactiva/inconsciente]",
        "regalo": "✅ [Forma consciente/transformada]"
      }
    ],
    "sintesis": {
      "frase": "[Resumen claro en máximo 15 palabras. PROHIBIDO: 'superpoder', 'misión cósmica', 'portal', metáforas. DEBE ser PSICOLÓGICO. Ejemplo: 'El elemento ${element.name} define mi forma de abordar la vida']",
      "declaracion": "[Afirmación en primera persona de máximo 2 líneas. PROHIBIDO lenguaje épico. DEBE ser OBSERVADOR. Ejemplo: 'Mi predominancia de ${element.name} se manifiesta en patrones observables. Esta configuración es parte de mi naturaleza.']"
    }
  }
}

ESTILO: Observador (NO directivo), psicológico (sombras/posibilidades), claro y adulto.
PROHIBIDO: "superpoder", "misión cósmica", "portal", "¡NO VINISTE A...!", mayúsculas enfáticas.
TONO: Describe cómo eres y cómo funciona el elemento, no órdenes.
RESPONDE SOLO JSON VÁLIDO. NO agregues texto antes/después.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto. Respondes EXCLUSIVAMENTE con JSON válido sin texto adicional ni markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let cleanedResponse = response.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    console.log(`✅ Generated ${element.name} element interpretation`);
    return parsed as PlanetInterpretation;
  } catch (error) {
    console.error(`❌ Error generating ${element.name} element:`, error);
    console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack');
    return generateFallbackElementInterpretation(element);
  }
}

// Generate modality interpretation
async function generateModalityInterpretation(
  modality: any,
  userProfile: any,
  openai: OpenAI
): Promise<PlanetInterpretation> {

  const prompt = `Eres un astrólogo evolutivo experto. Genera una interpretación DISRUPTIVA para:

**MODALIDAD:** ${modality.name}
**DISTRIBUCIÓN:** ${modality.distribution} planetas

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🌟 [Título impactante - máx 5 palabras]",
    "descripcionBreve": "Modalidad ${modality.name} con ${modality.distribution} planetas",
    "significado": "[2-3 líneas claras del significado con lenguaje disruptivo]",
    "efecto": "[1 frase del efecto principal]",
    "tipo": "[Arquetipo - ej: 'Iniciador', 'Estabilizador']"
  },
  "drawer": {
    "titulo": "Modalidad ${modality.name}: [Tema principal - ej: 'Iniciación y Liderazgo']",
    "educativo": "[QUÉ significa la modalidad ${modality.name}, CÓMO funciona, ejemplos desde niño y ahora. 3-5 párrafos claros]",
    "poderoso": "[Análisis psicológico profundo de cómo se manifiesta la modalidad ${modality.name}. Usa TONO OBSERVADOR, no directivo. Describe patrones estables. Ejemplo: 'La modalidad ${modality.name} se manifiesta en tu forma de abordar proyectos...' NO uses: 'superpoder', '¡NO VINISTE A...!'. SÍ usa: 'Puedes notar que...', 'Esta modalidad aparece cuando...'. 3-4 párrafos observadores]",
    "impacto_real": "[Impacto concreto en tu vida. NO metáforas. SÍ decisiones y comportamientos reales. Usa lenguaje observador: 'Puedes notar que tu forma de iniciar/mantener/adaptar proyectos...', 'En momentos críticos, esta modalidad se manifiesta...'. 3-5 ejemplos concretos de cómo se vive día a día. 2-3 párrafos directos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta]",
        "trampa": "❌ [Forma reactiva/inconsciente]",
        "regalo": "✅ [Forma consciente/transformada]"
      }
    ],
    "sintesis": {
      "frase": "[Resumen claro en máximo 15 palabras. PROHIBIDO: 'superpoder', 'misión cósmica', 'portal', metáforas. DEBE ser PSICOLÓGICO. Ejemplo: 'La modalidad ${modality.name} define mi ritmo de acción']",
      "declaracion": "[Afirmación en primera persona de máximo 2 líneas. PROHIBIDO lenguaje épico. DEBE ser OBSERVADOR. Ejemplo: 'Mi predominancia de modalidad ${modality.name} se manifiesta en mi forma de actuar. Esta configuración es parte de mi naturaleza.']"
    }
  }
}

ESTILO: Observador (NO directivo), psicológico (sombras/posibilidades), claro y adulto.
PROHIBIDO: "superpoder", "misión cósmica", "portal", "¡NO VINISTE A...!", mayúsculas enfáticas.
TONO: Describe cómo eres y cómo funciona la modalidad, no órdenes.
RESPONDE SOLO JSON VÁLIDO. NO agregues texto antes/después.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto. Respondes EXCLUSIVAMENTE con JSON válido sin texto adicional ni markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let cleanedResponse = response.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    console.log(`✅ Generated ${modality.name} modality interpretation`);
    return parsed as PlanetInterpretation;
  } catch (error) {
    console.error(`❌ Error generating ${modality.name} modality:`, error);
    console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack');
    return generateFallbackModalityInterpretation(modality);
  }
}

// Generate aspect interpretation
async function generateAspectInterpretation(
  aspect: any,
  userProfile: any,
  openai: OpenAI
): Promise<PlanetInterpretation> {

  const prompt = `Eres un astrólogo evolutivo experto. Genera una interpretación DISRUPTIVA para:

**ASPECTO:** ${aspect.planet1} ${aspect.type} ${aspect.planet2}
**GRADO:** ${aspect.orb}° de separación

**USUARIO:** ${userProfile.name}, ${userProfile.age} años

---

⚠️ IMPORTANTE: Responde EXACTAMENTE con este formato JSON sin texto adicional:

{
  "tooltip": {
    "titulo": "🌟 [Título impactante - máx 5 palabras]",
    "descripcionBreve": "${aspect.planet1} ${aspect.type} ${aspect.planet2} (${aspect.orb}°)",
    "significado": "[2-3 líneas claras del significado con lenguaje disruptivo]",
    "efecto": "[1 frase del efecto principal]",
    "tipo": "[Arquetipo - ej: 'Conflicto Creativo', 'Armonía Cósmica']"
  },
  "drawer": {
    "titulo": "${aspect.planet1} ${aspect.type} ${aspect.planet2}: [Tema principal - ej: 'Tensión entre Identidad y Emoción']",
    "educativo": "[QUÉ significa este aspecto ${aspect.type}, CÓMO funciona entre ${aspect.planet1} y ${aspect.planet2}, ejemplos desde niño y ahora. 3-5 párrafos claros]",
    "poderoso": "[Análisis psicológico profundo de cómo se manifiesta este aspecto ${aspect.type} entre ${aspect.planet1} y ${aspect.planet2}. Usa TONO OBSERVADOR, no directivo. Describe patrones estables. Ejemplo: 'Este aspecto se manifiesta en la forma en que estas dos energías interactúan...' NO uses: 'superpoder', '¡NO VINISTE A...!'. SÍ usa: 'Puedes notar que...', 'Esta conexión aparece cuando...'. 3-4 párrafos observadores]",
    "impacto_real": "[Impacto concreto en tu vida. NO metáforas. SÍ decisiones y comportamientos reales. Usa lenguaje observador: 'Puedes notar que cuando estas dos energías interactúan...', 'Se manifiesta en situaciones donde...', 'Las personas pueden percibir...'. 3-5 ejemplos concretos de cómo se vive día a día. 2-3 párrafos directos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta]",
        "trampa": "❌ [Forma reactiva/inconsciente]",
        "regalo": "✅ [Forma consciente/transformada]"
      }
    ],
    "sintesis": {
      "frase": "[Resumen claro en máximo 15 palabras. PROHIBIDO: 'superpoder', 'misión cósmica', 'portal', metáforas. DEBE ser PSICOLÓGICO. Ejemplo: 'Este aspecto ${aspect.type} define cómo interactúan estas dos energías en mi vida']",
      "declaracion": "[Afirmación en primera persona de máximo 2 líneas. PROHIBIDO lenguaje épico. DEBE ser OBSERVADOR. Ejemplo: 'Este aspecto ${aspect.type} entre ${aspect.planet1} y ${aspect.planet2} se manifiesta en patrones observables. Esta configuración es parte de mi naturaleza.']"
    }
  }
}

ESTILO: Observador (NO directivo), psicológico (sombras/posibilidades), claro y adulto.
PROHIBIDO: "superpoder", "misión cósmica", "portal", "¡NO VINISTE A...!", mayúsculas enfáticas.
TONO: Describe cómo funcionan estas energías en interacción, no órdenes.
RESPONDE SOLO JSON VÁLIDO. NO agregues texto antes/después.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto. Respondes EXCLUSIVAMENTE con JSON válido sin texto adicional ni markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let cleanedResponse = response.trim()
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResponse);

    console.log(`✅ Generated ${aspect.planet1} ${aspect.type} ${aspect.planet2} aspect interpretation`);
    return parsed as PlanetInterpretation;
  } catch (error) {
    console.error(`❌ Error generating aspect ${aspect.planet1} ${aspect.type} ${aspect.planet2}:`, error);
    console.error(`❌ Error stack:`, error instanceof Error ? error.stack : 'No stack');
    return generateFallbackAspectInterpretation(aspect);
  }
}

// =============================================================================
// FALLBACK FUNCTIONS FOR NEW INTERPRETATIONS
// =============================================================================

function generateFallbackElementInterpretation(element: any): PlanetInterpretation {
  return {
    tooltip: {
      titulo: `✨ Elemento ${element.name}`,
      descripcionBreve: `Elemento ${element.name} con ${element.distribution} planetas`,
      significado: `El elemento ${element.name} representa una energía fundamental en tu carta. Con ${element.distribution} planetas aquí, esta fuerza juega un rol significativo en tu personalidad.`,
      efecto: 'Influencia elemental poderosa',
      tipo: 'Energía primordial',
    },
    drawer: {
      titulo: `✨ Tu Elemento ${element.name}`,
      educativo: `El elemento ${element.name} es una de las cuatro fuerzas primordiales en astrología. Con ${element.distribution} planetas en este elemento, su influencia es notable en tu carta.\n\nDesde temprano en tu vida, esta energía elemental ha moldeado tu forma de relacionarte con el mundo. Esta configuración actúa como patrón estable en tu personalidad.`,
      poderoso: `Tu predominancia del elemento ${element.name} se manifiesta en patrones observables de comportamiento.\n\nEsta configuración actúa de manera constante en tu vida. Puedes notar que ciertas tendencias se repiten en cómo abordas situaciones y relaciones.\n\nCuando actúas alineado con las cualidades de ${element.name}, las cosas tienden a fluir. Cuando intentas forzar un enfoque que no resuena con esta naturaleza elemental, puede aparecer resistencia o agotamiento.`,
      impacto_real: `Durante tu vida:\n- Tu forma de tomar decisiones está profundamente influenciada por el elemento ${element.name}\n- Las personas notan en ti las cualidades asociadas con ${element.name}\n- En momentos de crisis o cambio, tiendes a recurrir a estrategias típicas de ${element.name}\n- Tu equilibrio emocional y energético depende de mantener activa la energía de ${element.name}`,
      sombras: [
        {
          nombre: 'Desequilibrio elemental',
          descripcion: 'Cuando la energía elemental actúa sin consciencia',
          trampa: '❌ Actúa de forma reactiva cuando no reconoces este patrón elemental',
          regalo: '✅ Cuando reconoces esta configuración, puedes trabajar con ella conscientemente',
        },
      ],
      sintesis: {
        frase: `Mi predominancia del elemento ${element.name} define mi forma de abordar la vida.`,
        declaracion: `Mi predominancia del elemento ${element.name} se manifiesta en patrones observables. Esta configuración es parte de mi naturaleza.`,
      },
    },
  };
}

function generateFallbackModalityInterpretation(modality: any): PlanetInterpretation {
  return {
    tooltip: {
      titulo: `✨ Modalidad ${modality.name}`,
      descripcionBreve: `Modalidad ${modality.name} con ${modality.distribution} planetas`,
      significado: `La modalidad ${modality.name} representa tu forma de iniciar, mantener o adaptar acciones. Con ${modality.distribution} planetas aquí, este patrón es fundamental en tu vida.`,
      efecto: 'Influencia modal significativa',
      tipo: 'Ritmo de acción',
    },
    drawer: {
      titulo: `✨ Tu Modalidad ${modality.name}`,
      educativo: `La modalidad ${modality.name} describe cómo te relacionas con el cambio, la estabilidad y la acción. Con ${modality.distribution} planetas en esta modalidad, su influencia es notable en tu carta.\n\nDesde temprano en tu vida, esta forma de actuar ha sido tu patrón natural. Esta configuración actúa como patrón estable en tu forma de abordar proyectos y cambios.`,
      poderoso: `Tu predominancia de la modalidad ${modality.name} se manifiesta en patrones observables de cómo abordas proyectos y cambios.\n\nEsta configuración actúa de manera constante en tu vida. Puedes notar que tu forma de iniciar, mantener o adaptar proyectos sigue ciertos patrones característicos de ${modality.name}.\n\nCuando honras este ritmo natural, las cosas tienden a funcionar mejor. Cuando intentas forzar un ritmo que no resuena con tu naturaleza modal, puede aparecer frustración o agotamiento.`,
      impacto_real: `Durante tu vida:\n- Tu forma de iniciar, mantener o adaptar proyectos refleja la modalidad ${modality.name}\n- Las personas notan tu tendencia a actuar de manera ${modality.name.toLowerCase()}\n- En momentos de cambio o estabilidad, tu respuesta natural es característica de ${modality.name}\n- Tu éxito y bienestar dependen de honrar tu ritmo ${modality.name}`,
      sombras: [
        {
          nombre: 'Ritmo automático',
          descripcion: 'Cuando la modalidad actúa sin consciencia',
          trampa: '❌ Actúa de forma reactiva cuando no reconoces conscientemente este ritmo',
          regalo: '✅ Cuando reconoces este patrón, puedes trabajar con él de manera más consciente',
        },
      ],
      sintesis: {
        frase: `Mi predominancia de modalidad ${modality.name} define mi ritmo de acción.`,
        declaracion: `Mi predominancia de modalidad ${modality.name} se manifiesta en mi forma de actuar. Esta configuración es parte de mi naturaleza.`,
      },
    },
  };
}

function generateFallbackAspectInterpretation(aspect: any): PlanetInterpretation {
  return {
    tooltip: {
      titulo: `✨ ${aspect.planet1} ${aspect.type} ${aspect.planet2}`,
      descripcionBreve: `${aspect.planet1} ${aspect.type} ${aspect.planet2} (${aspect.orb}°)`,
      significado: `Este aspecto entre ${aspect.planet1} y ${aspect.planet2} crea una conexión energética poderosa. La ${aspect.type} representa una relación específica entre estas dos fuerzas planetarias.`,
      efecto: 'Influencia aspectual significativa',
      tipo: 'Conexión cósmica',
    },
    drawer: {
      titulo: `✨ ${aspect.planet1} ${aspect.type} ${aspect.planet2}`,
      educativo: `El aspecto ${aspect.type} entre ${aspect.planet1} y ${aspect.planet2} crea una relación energética específica. Con una separación de ${aspect.orb} grados, esta conexión es notable en tu carta.\n\nDesde temprano en tu vida, esta dinámica planetaria ha influido en cómo integras estas dos energías. Esta configuración actúa como patrón estable en tu personalidad.`,
      poderoso: `Este aspecto ${aspect.type} entre ${aspect.planet1} y ${aspect.planet2} se manifiesta en patrones observables de comportamiento.\n\nEsta configuración actúa de manera constante en tu vida. Puedes notar que la interacción entre estas dos energías sigue ciertos patrones característicos.\n\nCuando ambas energías trabajan en sintonía, las cosas fluyen. Cuando están en tensión, puede aparecer conflicto interno o indecisión que requiere integración consciente.`,
      impacto_real: `Durante tu vida:\n- Cuando estas dos energías (${aspect.planet1} y ${aspect.planet2}) interactúan, manifiestas comportamientos característicos del aspecto ${aspect.type}\n- Las personas notan cómo integras o tensionas estas dos partes de tu personalidad\n- En situaciones que activan ambas energías, tu respuesta refleja la naturaleza del ${aspect.type}\n- Tu crecimiento personal depende de aprender a trabajar conscientemente con esta conexión`,
      sombras: [
        {
          nombre: 'Conexión inconsciente',
          descripcion: 'Cuando el aspecto actúa sin consciencia',
          trampa: '❌ Actúa de forma reactiva cuando estas energías están en tensión',
          regalo: '✅ Cuando reconoces esta dinámica, puedes integrar ambas energías conscientemente',
        },
      ],
      sintesis: {
        frase: `Mi ${aspect.type} entre ${aspect.planet1} y ${aspect.planet2} define cómo interactúan estas energías.`,
        declaracion: `Este aspecto ${aspect.type} entre ${aspect.planet1} y ${aspect.planet2} se manifiesta en patrones observables. Esta configuración es parte de mi naturaleza.`,
      },
    },
  };
}
