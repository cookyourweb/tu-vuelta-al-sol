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
  poetico: string;
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
    const { userId, chartData, userProfile, regenerate = false } = body;

    console.log('🎯 [DEBUG] POST request received');
    console.log('🎯 [DEBUG] userId:', userId);
    console.log('🎯 [DEBUG] userProfile:', userProfile);
    console.log('🎯 [DEBUG] regenerate:', regenerate);
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

    // ✅ CACHÉ INTELIGENTE: Buscar primero en MongoDB
    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    let existingInterpretations: any = null;
    let fromCache = false;

    if (!regenerate) {
      console.log('💾 [CACHE] Buscando interpretaciones existentes...');
      const existing = await db.collection('interpretations').findOne({
        userId,
        chartType: 'natal',
      });

      if (existing && existing.interpretations) {
        existingInterpretations = existing.interpretations;
        fromCache = true;
        console.log('✅ [CACHE] Encontradas interpretaciones existentes');
        console.log('📊 [CACHE] Planetas existentes:', Object.keys(existingInterpretations.planets || {}).length);
        console.log('📊 [CACHE] Aspectos existentes:', Object.keys(existingInterpretations.aspects || {}).length);
      } else {
        console.log('ℹ️ [CACHE] No hay interpretaciones previas, generando desde cero');
      }
    } else {
      console.log('🔄 [REGENERATE] Regeneración forzada, ignorando caché');
    }

    // ✅ GENERAR (reutiliza existente si hay)
    console.log('🎯 [DEBUG] Calling generateNatalBatchInterpretations...');
    const interpretations = await generateNatalBatchInterpretations(
      chartData,
      userProfile,
      undefined, // onProgress callback
      existingInterpretations // ← PASA EXISTENTE PARA REUTILIZAR
    );

    console.log('🎯 [DEBUG] Interpretations generated successfully');
    console.log('🎯 [DEBUG] Interpretation keys:', Object.keys(interpretations));
    console.log('🎯 [DEBUG] Planets count:', Object.keys(interpretations.planets || {}).length);
    console.log('🎯 [DEBUG] Angles count:', Object.keys(interpretations.angles || {}).length);

    const generationTime = ((Date.now() - startTime) / 1000).toFixed(0);

    // ✅ CALCULAR AHORRO
    let newlyGenerated = 0;
    let reused = 0;

    if (fromCache && existingInterpretations) {
      // Contar cuántos se reutilizaron vs generaron
      const existingPlanets = Object.keys(existingInterpretations.planets || {}).length;
      const existingAspects = Object.keys(existingInterpretations.aspects || {}).length;
      const totalExisting = existingPlanets + existingAspects;

      const totalNow = Object.keys(interpretations.planets || {}).length + Object.keys(interpretations.aspects || {}).length;

      reused = Math.min(totalExisting, totalNow);
      newlyGenerated = Math.max(0, totalNow - totalExisting);

      console.log(`💰 [AHORRO] Reutilizados: ${reused}, Nuevos: ${newlyGenerated}`);
    } else {
      newlyGenerated = Object.keys(interpretations.planets || {}).length + Object.keys(interpretations.aspects || {}).length;
      console.log(`🆕 [NUEVO] Todo generado desde cero: ${newlyGenerated} items`);
    }

    const estimatedCost = (newlyGenerated * 0.15).toFixed(2); // $0.15 por interpretación
    const savedCost = (reused * 0.15).toFixed(2);

    const stats = {
      totalAngles: 2,
      totalPlanets: Object.keys(interpretations.planets).length,
      totalAsteroids: Object.keys(interpretations.asteroids).length,
      totalNodes: Object.keys(interpretations.nodes).length,
      totalElements: Object.keys(interpretations.elements).length,
      totalModalities: Object.keys(interpretations.modalities).length,
      totalAspects: Object.keys(interpretations.aspects).length,
      generationTime: `${generationTime}s`,
      newlyGenerated,
      reusedFromCache: reused,
      estimatedCost: `$${estimatedCost}`,
      savedCost: `$${savedCost}`,
      cacheHit: fromCache,
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
      cached: fromCache,
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
    const { userId, planet1, planet2, aspectType, orb, planetName, sign, house, degree } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Check if interpretation already exists
    const existing = await db.collection('interpretations').findOne({
      userId,
      chartType: 'natal',
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'No natal interpretations found. Generate them first with POST.' },
        { status: 404 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // =========================================================================
    // 🪐 PLANET INTERPRETATION
    // =========================================================================
    if (planetName && sign && house) {
      console.log('🪐 [PUT] Generating planet interpretation:', { userId, planetName, sign, house, degree });

      const planetKey = `${planetName}-${sign}-${house}`;

      // Check if planet interpretation already exists
      if (existing.interpretations.planets?.[planetKey]) {
        console.log('✅ [PUT] Planet interpretation already exists');
        return NextResponse.json({
          success: true,
          data: existing.interpretations.planets[planetKey],
          cached: true,
        });
      }

      // Generate new planet interpretation
      const planetInterpretation = await generatePlanetInterpretation(
        { name: planetName, sign, house, degree },
        { name: 'User', age: 30 }, // Default user profile
        openai
      );

      // Update the interpretations with the new planet
      const updatedInterpretations = {
        ...existing.interpretations,
        planets: {
          ...existing.interpretations.planets,
          [planetKey]: planetInterpretation,
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

      console.log('✅ [PUT] Planet interpretation generated and saved');

      return NextResponse.json({
        success: true,
        data: planetInterpretation,
        cached: false,
      });
    }

    // =========================================================================
    // 🎯 ASPECT INTERPRETATION
    // =========================================================================
    if (planet1 && planet2 && aspectType) {
      console.log('🎯 [PUT] Generating aspect interpretation:', { userId, planet1, planet2, aspectType, orb });

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
    }

    // =========================================================================
    // ❌ INVALID REQUEST
    // =========================================================================
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request: must provide either (planetName, sign, house) for planet OR (planet1, planet2, aspectType) for aspect'
      },
      { status: 400 }
    );

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
  onProgress?: (message: string, progress: number) => void,
  existingInterpretations?: NatalInterpretations | null
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

  // ✅ REUTILIZAR O GENERAR ANGLES
  onProgress?.('🌟 Verificando Ascendente y Medio Cielo...', 5);

  const interpretations: NatalInterpretations = {
    angles: existingInterpretations?.angles || {
      Ascendente: await generateAngleInterpretation('Ascendente', chartData.ascendant, userProfile, openai),
      MedioCielo: await generateAngleInterpretation('MedioCielo', chartData.midheaven, userProfile, openai),
    },
    planets: existingInterpretations?.planets || {},
    asteroids: existingInterpretations?.asteroids || {},
    nodes: existingInterpretations?.nodes || {},
    elements: existingInterpretations?.elements || {},
    modalities: existingInterpretations?.modalities || {},
    aspects: existingInterpretations?.aspects || {},
  };

  if (existingInterpretations?.angles) {
    console.log('💾 [CACHE] Reutilizando ángulos existentes');
  } else {
    console.log('🆕 [NEW] Ángulos generados');
  }

  onProgress?.('✨ Verificando interpretaciones de planetas...', 15);

  // Generate planet interpretations (SOLO SI NO EXISTEN)
  const planetNames = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Jupiter', 'Saturno', 'Urano', 'Neptuno', 'Pluton'];

  console.log('🎯 [DEBUG] Starting planet generation loop');

  for (let i = 0; i < planetNames.length; i++) {
    const planetName = planetNames[i];
    console.log(`🎯 [DEBUG] Looking for planet: ${planetName}`);

    const planet = findPlanetByName(chartData.planets, planetName);
    if (planet) {
      const key = `${planet.name}-${planet.sign}-${planet.house}`;

      // ✅ VERIFICAR SI YA EXISTE
      if (existingInterpretations?.planets?.[key]) {
        console.log(`💾 [CACHE] Reutilizando interpretación existente para ${planetName}`);
        interpretations.planets[key] = existingInterpretations.planets[key];
        continue; // ← SALTAR generación, ya existe
      }

      console.log(`🆕 [NEW] Generando ${planetName} (no existe en caché)`);

      const progress = 15 + (i / planetNames.length) * 30; // 15-45%
      onProgress?.(`🌟 Generando tu ${planetName} en ${planet.sign}...`, progress);

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

  // Generate asteroid interpretations (Lilith, Chiron) - REUTILIZAR SI EXISTE
  onProgress?.('🌑 Verificando Lilith y Chiron...', 50);
  const asteroidNames = ['Lilith', 'Chiron'];

  for (let i = 0; i < asteroidNames.length; i++) {
    const asteroidName = asteroidNames[i];
    const asteroid = findPlanetByName(chartData.planets, asteroidName);
    if (asteroid) {
      const key = `${asteroid.name}-${asteroid.sign}-${asteroid.house}`;

      // ✅ REUTILIZAR SI EXISTE
      if (existingInterpretations?.asteroids?.[key]) {
        console.log(`💾 [CACHE] Reutilizando ${asteroidName}`);
        interpretations.asteroids[key] = existingInterpretations.asteroids[key];
        continue;
      }

      console.log(`🆕 [NEW] Generando ${asteroidName}`);
      const progress = 50 + (i / asteroidNames.length) * 10; // 50-60%
      onProgress?.(`🌑 Generando tu ${asteroidName} en ${asteroid.sign}...`, progress);

      interpretations.asteroids[key] = await generatePlanetInterpretation(asteroid, userProfile, openai);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate nodes interpretations - REUTILIZAR SI EXISTE
  onProgress?.('🌙 Verificando Nodos Lunares...', 65);
  const nodeNames = ['Nodo Norte', 'Nodo Sur'];

  for (let i = 0; i < nodeNames.length; i++) {
    const nodeName = nodeNames[i];
    const node = findPlanetByName(chartData.planets, nodeName);
    if (node) {
      const key = `${node.name}-${node.sign}-${node.house}`;

      // ✅ REUTILIZAR SI EXISTE
      if (existingInterpretations?.nodes?.[key]) {
        console.log(`💾 [CACHE] Reutilizando ${nodeName}`);
        interpretations.nodes[key] = existingInterpretations.nodes[key];
        continue;
      }

      console.log(`🆕 [NEW] Generando ${nodeName}`);
      const progress = 65 + (i / nodeNames.length) * 10; // 65-75%
      onProgress?.(`🌙 Generando tu ${nodeName} en ${node.sign}...`, progress);

      interpretations.nodes[key] = await generatePlanetInterpretation(node, userProfile, openai);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate elements - REUTILIZAR SI EXISTE
  onProgress?.('🔥 Verificando Elementos...', 80);
  const elements = [
    { name: 'Fuego', distribution: chartData.elementDistribution?.fire || 0 },
    { name: 'Tierra', distribution: chartData.elementDistribution?.earth || 0 },
    { name: 'Aire', distribution: chartData.elementDistribution?.air || 0 },
    { name: 'Agua', distribution: chartData.elementDistribution?.water || 0 }
  ];

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.distribution > 0) {
      const key = `Elemento-${element.name}`;

      // ✅ REUTILIZAR SI EXISTE
      if (existingInterpretations?.elements?.[key]) {
        console.log(`💾 [CACHE] Reutilizando Elemento ${element.name}`);
        interpretations.elements[key] = existingInterpretations.elements[key];
        continue;
      }

      console.log(`🆕 [NEW] Generando Elemento ${element.name}`);
      const progress = 80 + (i / elements.length) * 5; // 80-85%
      onProgress?.(`🔥 Generando tu Elemento ${element.name} (${element.distribution} planetas)...`, progress);

      interpretations.elements[key] = await generateElementInterpretation(element, userProfile, openai);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate modalities - REUTILIZAR SI EXISTE
  onProgress?.('⚡ Verificando Modalidades...', 90);
  const modalities = [
    { name: 'Cardinal', distribution: chartData.modalityDistribution?.cardinal || 0 },
    { name: 'Fijo', distribution: chartData.modalityDistribution?.fixed || 0 },
    { name: 'Mutable', distribution: chartData.modalityDistribution?.mutable || 0 }
  ];

  for (let i = 0; i < modalities.length; i++) {
    const modality = modalities[i];
    if (modality.distribution > 0) {
      const key = `Modalidad-${modality.name}`;

      // ✅ REUTILIZAR SI EXISTE
      if (existingInterpretations?.modalities?.[key]) {
        console.log(`💾 [CACHE] Reutilizando Modalidad ${modality.name}`);
        interpretations.modalities[key] = existingInterpretations.modalities[key];
        continue;
      }

      console.log(`🆕 [NEW] Generando Modalidad ${modality.name}`);
      const progress = 90 + (i / modalities.length) * 5; // 90-95%
      onProgress?.(`⚡ Generando tu Modalidad ${modality.name} (${modality.distribution} planetas)...`, progress);

      interpretations.modalities[key] = await generateModalityInterpretation(modality, userProfile, openai);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate aspects - REUTILIZAR SI EXISTE
  if (chartData.aspects && chartData.aspects.length > 0) {
    onProgress?.('🔗 Verificando Aspectos...', 98);
    const aspectsToGenerate = chartData.aspects.slice(0, 10); // Limit to first 10 aspects

    for (let i = 0; i < aspectsToGenerate.length; i++) {
      const aspect = aspectsToGenerate[i];
      const key = `${aspect.planet1}-${aspect.planet2}-${aspect.type}`;

      // ✅ REUTILIZAR SI EXISTE
      if (existingInterpretations?.aspects?.[key]) {
        console.log(`💾 [CACHE] Reutilizando aspecto ${aspect.planet1} ${aspect.type} ${aspect.planet2}`);
        interpretations.aspects[key] = existingInterpretations.aspects[key];
        continue;
      }

      console.log(`🆕 [NEW] Generando aspecto ${aspect.planet1} ${aspect.type} ${aspect.planet2}`);
      const progress = 98 + (i / aspectsToGenerate.length) * 2; // 98-100%
      onProgress?.(`🔗 Generando ${aspect.planet1} ${aspect.type} ${aspect.planet2}...`, progress);

      interpretations.aspects[key] = await generateAspectInterpretation(aspect, userProfile, openai);
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
    "titulo": "🌟 [Título completo poderoso]",
    "educativo": "[Explicación clara: QUÉ es el ${angleName}, CÓMO funciona en ${angleData.sign}, ejemplos desde niño y ahora. 3-5 párrafos]",
    "poderoso": "[Mensaje transformacional: '¡NO VINISTE A...!', 'Tu superpoder es...'. Habla de trampas y regalos. 4-6 párrafos]",
    "poetico": "[Metáfora hermosa comparando con naturaleza/cosmos. 2-3 párrafos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra]",
        "descripcion": "[Explicación]",
        "trampa": "❌ [Forma reactiva]",
        "regalo": "✅ [Forma consciente]"
      }
    ],
    "sintesis": {
      "frase": "[Frase memorable de máximo 15 palabras]",
      "declaracion": "[Declaración 'Yo soy...' que el usuario puede repetir. 2-4 líneas]"
    }
  }
}

ESTILO: Disruptivo ("¡NO VINISTE A...!"), transformacional, directo.
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
    "titulo": "🌟 [Título completo poderoso]",
    "educativo": "[QUÉ significa ${planet.name}, CÓMO funciona en ${planet.sign}, QUÉ implica Casa ${planet.house}. Ejemplos desde niño y ahora. 3-5 párrafos claros]",
    "poderoso": "[Mensaje transformacional: '¡NO VINISTE A...!', '¡ESTO ES ENORME!', 'Tu superpoder es...'. Habla de trampas y regalos ocultos. 4-6 párrafos intensos]",
    "poetico": "[Metáfora HERMOSA. Compara ${planet.name} en ${planet.sign} con naturaleza, animales, cosmos. Crea imagen visual potente. 2-3 párrafos líricos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta]",
        "trampa": "❌ [Forma reactiva/inconsciente]",
        "regalo": "✅ [Forma consciente/transformada]"
      },
      {
        "nombre": "[Segunda sombra opcional]",
        "descripcion": "[Explicación]",
        "trampa": "❌ [Trampa]",
        "regalo": "✅ [Regalo]"
      }
    ],
    "sintesis": {
      "frase": "[Frase memorable máximo 15 palabras]",
      "declaracion": "[Declaración en primera persona: 'Yo soy...' o 'Mi ${planet.name}...'. 2-4 líneas que el usuario puede repetir como mantra]"
    }
  }
}

ESTILO: Disruptivo ("¡NO VINISTE A...!"), transformacional, psicológico (sombras/regalos), motivador.
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
      educativo: `El ${angleName} representa un punto crucial en tu carta natal. Cuando está en ${angleData.sign}, adquiere las cualidades de este signo y se expresa de una manera única.\n\nDesde la infancia, esta configuración ha estado moldeando tu forma de ser, aunque quizás no fueras consciente de ello. Ahora que lo comprendes, puedes activar conscientemente este poder.`,
      poderoso: `¡NO VINISTE a este mundo con esta configuración por casualidad!\n\nEsta posición es una de tus herramientas más poderosas. Tu verdadero superpoder está en reconocer y activar conscientemente esta energía.\n\nCada vez que actúas alineado con tu ${angleName} en ${angleData.sign}, estás cumpliendo tu propósito. No es accidental. Es intencional. Es cósmico.`,
      poetico: `Imagina que tu ${angleName} es como una puerta luminosa en el cielo.\n\nEn ${angleData.sign}, esta puerta brilla con una frecuencia especial que solo tú tienes. Es tu portal único hacia tu verdadero ser.`,
      sombras: [
        {
          nombre: 'Uso inconsciente',
          descripcion: 'Cuando no activamos esta energía conscientemente',
          trampa: '❌ Dejar que actúe automáticamente sin dirección',
          regalo: '✅ Usarla con intención y propósito claro',
        },
      ],
      sintesis: {
        frase: `Tu ${angleName} en ${angleData.sign} es tu superpoder único.`,
        declaracion: `Yo activo mi ${angleName} en ${angleData.sign} conscientemente. Esta configuración me define y me empodera para cumplir mi propósito.`,
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
      educativo: `${planet.name} simboliza aspectos esenciales de tu ser. En ${planet.sign}, esta energía se expresa con las cualidades de este signo. La Casa ${planet.house} muestra dónde se manifiesta más intensamente en tu vida.\n\nDesde niño, esta configuración ha influido en tu forma de ser, aunque quizás no lo reconocieras. Comprender esto te permite activar conscientemente este poder interior.`,
      poderoso: `¡NO VINISTE con ${planet.name} en ${planet.sign} por casualidad!\n\n¡ESTO ES ENORME! Esta posición es una de tus herramientas cósmicas más poderosas.\n\nTu verdadero superpoder es usar conscientemente la energía de ${planet.sign} en las áreas que gobierna la Casa ${planet.house}. Cuando lo haces, te conviertes en agente de tu propia transformación.`,
      poetico: `Tu ${planet.name} es como una gema brillando en ${planet.sign}.\n\nComo una estrella guía en la noche, ilumina tu camino hacia tu verdadero ser. En ${planet.sign}, proyecta colores únicos que solo tú puedes manifestar.`,
      sombras: [
        {
          nombre: 'Uso reactivo de la energía',
          descripcion: 'Cuando esta configuración actúa automáticamente sin consciencia',
          trampa: '❌ Dejar que te controle en lugar de dirigirla',
          regalo: '✅ Convertirla en superpoder con consciencia e intención',
        },
      ],
      sintesis: {
        frase: `Tu ${planet.name} en ${planet.sign} es poder esperando ser activado.`,
        declaracion: `Yo activo conscientemente mi ${planet.name} en ${planet.sign}. Esta energía no me limita, me empodera. La uso para mi máxima expresión.`,
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
    "titulo": "🌟 [Título completo poderoso]",
    "educativo": "[QUÉ significa el elemento ${element.name}, CÓMO funciona, ejemplos desde niño y ahora. 3-5 párrafos claros]",
    "poderoso": "[Mensaje transformacional: '¡NO VINISTE A...!', 'Tu superpoder es...'. Habla de trampas y regalos. 4-6 párrafos intensos]",
    "poetico": "[Metáfora HERMOSA. Compara el elemento ${element.name} con naturaleza, elementos. Crea imagen visual potente. 2-3 párrafos líricos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta]",
        "trampa": "❌ [Forma reactiva/inconsciente]",
        "regalo": "✅ [Forma consciente/transformada]"
      }
    ],
    "sintesis": {
      "frase": "[Frase memorable máximo 15 palabras]",
      "declaracion": "[Declaración en primera persona: 'Yo soy...' o 'Mi elemento...'. 2-4 líneas que el usuario puede repetir como mantra]"
    }
  }
}

ESTILO: Disruptivo ("¡NO VINISTE A...!"), transformacional, psicológico (sombras/regalos), motivador.
RESPONDE SOLO JSON VÁLIDO. NO agregues texto antes/después.

EJEMPLOS PARA ${element.name}:
${element.name === 'Fuego' ? '- Fuego: "¡NO VINISTE A APAGARTE!", "Tu superpoder es encender el mundo"' : ''}
${element.name === 'Tierra' ? '- Tierra: "¡NO VINISTE A DESMORONARTE!", "Tu superpoder es construir imperios"' : ''}
${element.name === 'Aire' ? '- Aire: "¡NO VINISTE A CALLARTE!", "Tu superpoder es revolucionar ideas"' : ''}
${element.name === 'Agua' ? '- Agua: "¡NO VINISTE A SECARTE!", "Tu superpoder es fluir con la vida"' : ''}`;

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
    "titulo": "🌟 [Título completo poderoso]",
    "educativo": "[QUÉ significa la modalidad ${modality.name}, CÓMO funciona, ejemplos desde niño y ahora. 3-5 párrafos claros]",
    "poderoso": "[Mensaje transformacional: '¡NO VINISTE A...!', 'Tu superpoder es...'. Habla de trampas y regalos. 4-6 párrafos intensos]",
    "poetico": "[Metáfora HERMOSA. Compara la modalidad ${modality.name} con naturaleza, movimientos. Crea imagen visual potente. 2-3 párrafos líricos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta]",
        "trampa": "❌ [Forma reactiva/inconsciente]",
        "regalo": "✅ [Forma consciente/transformada]"
      }
    ],
    "sintesis": {
      "frase": "[Frase memorable máximo 15 palabras]",
      "declaracion": "[Declaración en primera persona: 'Yo soy...' o 'Mi modalidad...'. 2-4 líneas que el usuario puede repetir como mantra]"
    }
  }
}

ESTILO: Disruptivo ("¡NO VINISTE A...!"), transformacional, psicológico (sombras/regalos), motivador.
RESPONDE SOLO JSON VÁLIDO. NO agregues texto antes/después.

EJEMPLOS PARA ${modality.name}:
${modality.name === 'Cardinal' ? '- Cardinal: "¡NO VINISTE A PARARTE!", "Tu superpoder es iniciar revoluciones"' : ''}
${modality.name === 'Fijo' ? '- Fijo: "¡NO VINISTE A RENDIRTE!", "Tu superpoder es mantener la visión"' : ''}
${modality.name === 'Mutable' ? '- Mutable: "¡NO VINISTE A QUEDARTE!", "Tu superpoder es adaptarte a todo"' : ''}`;

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
    "titulo": "🌟 [Título completo poderoso]",
    "educativo": "[QUÉ significa este aspecto ${aspect.type}, CÓMO funciona entre ${aspect.planet1} y ${aspect.planet2}, ejemplos desde niño y ahora. 3-5 párrafos claros]",
    "poderoso": "[Mensaje transformacional: '¡NO VINISTE A...!', 'Tu superpoder es...'. Habla de trampas y regalos. 4-6 párrafos intensos]",
    "poetico": "[Metáfora HERMOSA. Compara este aspecto con naturaleza, cosmos. Crea imagen visual potente. 2-3 párrafos líricos]",
    "sombras": [
      {
        "nombre": "[Nombre de la sombra principal]",
        "descripcion": "[Cómo se manifiesta]",
        "trampa": "❌ [Forma reactiva/inconsciente]",
        "regalo": "✅ [Forma consciente/transformada]"
      }
    ],
    "sintesis": {
      "frase": "[Frase memorable máximo 15 palabras]",
      "declaracion": "[Declaración en primera persona: 'Yo integro...' o 'Mi aspecto...'. 2-4 líneas que el usuario puede repetir como mantra]"
    }
  }
}

ESTILO: Disruptivo ("¡NO VINISTE A...!"), transformacional, psicológico (sombras/regalos), motivador.
RESPONDE SOLO JSON VÁLIDO. NO agregues texto antes/después.

EJEMPLOS PARA ${aspect.type}:
${aspect.type === 'Cuadratura' ? '- Cuadratura: "¡NO VINISTE A EVITAR EL CONFLICTO!", "Tu superpoder es transformar tensión en crecimiento"' : ''}
${aspect.type === 'Oposición' ? '- Oposición: "¡NO VINISTE A IGNORAR LA DICOTOMÍA!", "Tu superpoder es integrar opuestos"' : ''}
${aspect.type === 'Trígono' ? '- Trígono: "¡NO VINISTE A DESPERDICIAR TU TALENTO!", "Tu superpoder es fluir con facilidad"' : ''}
${aspect.type === 'Sextil' ? '- Sextil: "¡NO VINISTE A PERDER OPORTUNIDADES!", "Tu superpoder es crear oportunidades"' : ''}`;

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
      educativo: `El elemento ${element.name} es una de las cuatro fuerzas primordiales en astrología. Con ${element.distribution} planetas en este elemento, su influencia es notable en tu carta.\n\nDesde niño, esta energía elemental ha moldeado tu forma de relacionarte con el mundo. Ahora que lo comprendes, puedes activar conscientemente este poder.`,
      poderoso: `¡NO VINISTE con esta distribución elemental por casualidad!\n\n¡ESTO ES ENORME! Tu equilibrio de elementos es una de tus herramientas cósmicas más poderosas.\n\nTu verdadero superpoder es usar conscientemente la energía del elemento ${element.name}. Cuando lo haces, te conviertes en agente de tu propia transformación elemental.`,
      poetico: `El elemento ${element.name} es como una fuerza primordial danzando en tu ser.\n\nComo una corriente subterránea o un viento invisible, moldea tu realidad con su esencia única. En tu carta, proyecta una frecuencia especial que solo tú puedes manifestar.`,
      sombras: [
        {
          nombre: 'Desequilibrio elemental',
          descripcion: 'Cuando la energía elemental actúa sin consciencia',
          trampa: '❌ Dejar que te domine en lugar de dirigirla',
          regalo: '✅ Convertirla en superpoder con consciencia e intención',
        },
      ],
      sintesis: {
        frase: `Tu elemento ${element.name} es poder primordial esperando ser activado.`,
        declaracion: `Yo activo conscientemente mi elemento ${element.name}. Esta energía primordial no me limita, me empodera. La uso para mi máxima expresión.`,
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
      educativo: `La modalidad ${modality.name} describe cómo te relacionas con el cambio, la estabilidad y la acción. Con ${modality.distribution} planetas en esta modalidad, su influencia es notable en tu carta.\n\nDesde niño, esta forma de actuar ha sido tu patrón natural. Ahora que lo comprendes, puedes elegir conscientemente cuándo aplicarla.`,
      poderoso: `¡NO VINISTE con esta distribución modal por casualidad!\n\n¡ESTO ES ENORME! Tu ritmo de acción es una de tus herramientas cósmicas más poderosas.\n\nTu verdadero superpoder es usar conscientemente la modalidad ${modality.name}. Cuando lo haces, te conviertes en maestro de tu propio ritmo cósmico.`,
      poetico: `La modalidad ${modality.name} es como un ritmo primordial latiendo en tu ser.\n\nComo una danza cósmica o una corriente marina, establece el tempo de tu vida. En tu carta, marca el compás único que solo tú puedes bailar.`,
      sombras: [
        {
          nombre: 'Ritmo automático',
          descripcion: 'Cuando la modalidad actúa sin consciencia',
          trampa: '❌ Dejar que te lleve en lugar de dirigirla',
          regalo: '✅ Convertirla en superpoder con consciencia e intención',
        },
      ],
      sintesis: {
        frase: `Tu modalidad ${modality.name} es ritmo esperando ser dirigido.`,
        declaracion: `Yo activo conscientemente mi modalidad ${modality.name}. Este ritmo no me limita, me empodera. Lo uso para mi máxima expresión.`,
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
      educativo: `El aspecto ${aspect.type} entre ${aspect.planet1} y ${aspect.planet2} crea una relación energética específica. Con una separación de ${aspect.orb} grados, esta conexión es notable en tu carta.\n\nDesde niño, esta dinámica planetaria ha influido en cómo integras estas dos energías. Ahora que lo comprendes, puedes trabajar conscientemente con esta conexión.`,
      poderoso: `¡NO VINISTE con este aspecto por casualidad!\n\n¡ESTO ES ENORME! Esta conexión entre ${aspect.planet1} y ${aspect.planet2} es una de tus herramientas cósmicas más poderosas.\n\nTu verdadero superpoder es integrar conscientemente estas dos energías. Cuando lo haces, te conviertes en alquimista de tu propia transformación.`,
      poetico: `Este aspecto es como un puente luminoso entre dos mundos planetarios.\n\n${aspect.planet1} y ${aspect.planet2} danzan en una coreografía cósmica, creando música única que solo tu alma puede escuchar. En tu carta, tejen una sinfonía especial.`,
      sombras: [
        {
          nombre: 'Conexión inconsciente',
          descripcion: 'Cuando el aspecto actúa sin consciencia',
          trampa: '❌ Dejar que te divida en lugar de unirte',
          regalo: '✅ Convertirla en superpoder con consciencia e intención',
        },
      ],
      sintesis: {
        frase: `Tu aspecto ${aspect.type} es puente esperando ser cruzado.`,
        declaracion: `Yo integro conscientemente mi ${aspect.planet1} y ${aspect.planet2}. Esta conexión no me limita, me empodera. La uso para mi máxima expresión.`,
      },
    },
  };
}
