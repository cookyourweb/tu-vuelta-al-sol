// =============================================================================
// 🪐 INTERPRET PLANET API ROUTE
// app/api/astrology/interpret-planet/route.ts
// Genera interpretación de UN SOLO planeta
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { generatePlanetInterpretation } from '@/services/tripleFusedInterpretationService';
import { getUserProfile } from '@/services/userDataService';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// =============================================================================
// Helper: Generate Planet Comparison (Natal vs Solar Return)
// =============================================================================
async function generatePlanetComparison(
  planetName: string,
  natal: { sign: string; house: number },
  solarReturn: { sign: string; house: number },
  year: number,
  userProfile: any
) {
  const prompt = `Eres un astrólogo experto en Solar Returns. Genera una comparación entre la posición natal de un planeta y su posición en Solar Return.

PLANETA: ${planetName}
NATAL: ${planetName} en ${natal.sign}, Casa ${natal.house}
SOLAR RETURN ${year}: ${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}

USUARIO:
- Nombre: ${userProfile.name || 'Usuario'}
- Edad: ${userProfile.age || 'N/A'}

INSTRUCCIONES:
Genera una comparación en formato JSON con esta estructura exacta:

{
  "natal": {
    "ubicacion": "${planetName} en ${natal.sign}, Casa ${natal.house}",
    "descripcion": "[Descripción de cómo es ${planetName} natal de forma permanente - 2-3 líneas]"
  },
  "solar_return": {
    "ubicacion": "${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}",
    "descripcion": "[Descripción de cómo se activa ${planetName} este año específico - 2-3 líneas]"
  },
  "comparacion": "[Explicación de cómo la energía natal se manifiesta diferente este año - dónde choca, dónde potencia - 3-4 líneas]",
  "accion": "[Acción concreta recomendada para aprovechar esta activación - 1-2 líneas, específica y práctica]",
  "frase_clave": "[Frase de máximo 15 palabras que resuma la activación de este año]",
  "drawer": {
    "titulo": "${planetName}: Natal vs Solar Return",
    "educativo": "🔹 CÓMO ERES NORMALMENTE (Natal)\\n\\n📍 ${planetName} en ${natal.sign}, Casa ${natal.house}\\n\\n[descripción natal]",
    "poderoso": "🔸 QUÉ SE ACTIVA ESTE AÑO (Solar Return)\\n\\n📍 ${planetName} en ${solarReturn.sign}, Casa ${solarReturn.house}\\n\\n[descripción SR]",
    "impacto_real": "🔁 DÓNDE CHOCA O POTENCIA\\n\\n[comparación]",
    "sombras": [{
      "nombre": "Acción Recomendada",
      "descripcion": "Este año ${year}",
      "trampa": "❌ Ignorar esta activación",
      "regalo": "✅ [acción]"
    }],
    "sintesis": {
      "frase": "[frase_clave]",
      "declaracion": "Mi ${planetName} natal se manifiesta este año de forma única. Uso conscientemente esta activación."
    }
  }
}

IMPORTANTE:
- Sé CONCRETO y PRÁCTICO
- La comparación debe mostrar DIFERENCIAS específicas
- La acción debe ser ACCIONABLE
- NO uses lenguaje poético o abstracto
- Usa segunda persona (tú) para dirigirte al usuario

Devuelve SOLO el JSON, sin explicaciones adicionales.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  return JSON.parse(content);
}


// =============================================================================
// POST - Generate single planet interpretation
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planetName, sign, house, degree, chartType, year } = body;

    console.log('🪐 [PLANET] Generating interpretation for:', planetName);
    console.log('🪐 [PLANET] Chart type:', chartType);
    console.log('🪐 [PLANET] Year:', year);

    if (!userId || !planetName || !sign || !house) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, planetName, sign, house' },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = (mongoose as any).connection?.db ?? (mongoose as any).db;

    // Fetch user profile
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      console.warn('⚠️ [PLANET] User profile not found, using defaults');
    }

    // ⭐ SOLAR RETURN: Generar comparación Natal vs SR
    if (chartType === 'solar-return') {
      console.log('🔄 [PLANET] Generando COMPARACIÓN Natal vs Solar Return');

      // Obtener carta natal del usuario
      const natalChart = await db.collection('users').findOne({ userId });
      if (!natalChart?.natalChart?.planets) {
        throw new Error('Carta natal no encontrada - se necesita para generar comparación');
      }

      // Buscar planeta en carta natal
      const natalPlanet = natalChart.natalChart.planets.find((p: any) => p.name === planetName);
      if (!natalPlanet) {
        throw new Error(`Planeta ${planetName} no encontrado en carta natal`);
      }

      console.log(`📍 NATAL: ${planetName} en ${natalPlanet.sign} Casa ${natalPlanet.house}`);
      console.log(`📍 SR ${year}: ${planetName} en ${sign} Casa ${house}`);

      // Generar comparación usando OpenAI
      const comparison = await generatePlanetComparison(
        planetName,
        { sign: natalPlanet.sign, house: natalPlanet.house },
        { sign, house },
        year,
        userProfile || { name: '', age: 0, birthDate: '', birthPlace: '' }
      );

      if (!comparison) {
        throw new Error('Failed to generate planet comparison');
      }

      // Guardar en comparaciones_planetarias de Solar Return
      const planetKeyLower = planetName.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quitar acentos

      console.log(`📝 [PLANET] Guardando comparación en: comparaciones_planetarias.${planetKeyLower}`);

      await db.collection('interpretations').updateOne(
        { userId, chartType: 'solar-return', year: year || new Date().getFullYear() },
        {
          $set: {
            [`interpretations.comparaciones_planetarias.${planetKeyLower}`]: comparison,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      console.log('✅ [PLANET] Comparación guardada:', planetKeyLower);

      return NextResponse.json({
        success: true,
        interpretation: comparison,
        planetKey: planetKeyLower,
        message: `Comparación de ${planetName} generada correctamente`,
      });
    }

    // ⭐ NATAL: Generar interpretación individual (lógica original)
    const interpretation = await generatePlanetInterpretation(
      planetName,
      sign,
      house,
      degree || 0,
      userProfile || { name: '', age: 0, birthDate: '', birthPlace: '' }
    );

    if (!interpretation) {
      throw new Error('Failed to generate planet interpretation');
    }

    console.log('✅ [PLANET] Generated interpretation for:', planetName);

    // Save to MongoDB
    const planetKey = `${planetName}-${sign}-${house}`;

    // Determinar categoría del planeta
    let section = 'planets'; // Por defecto

    // Nodos se guardan en "nodes"
    if (planetName.includes('Nodo')) {
      section = 'nodes';
      console.log('🎯 [PLANET] Detectado NODO - guardando en sección: nodes');
    }
    // Asteroides se guardan en "asteroids"
    else if (['Quirón', 'Lilith', 'Ceres', 'Pallas', 'Juno', 'Vesta'].includes(planetName)) {
      section = 'asteroids';
      console.log('🎯 [PLANET] Detectado ASTEROIDE - guardando en sección: asteroids');
    }

    console.log(`📝 [PLANET] Guardando en sección: ${section}`);
    console.log(`📝 [PLANET] Key completo: ${section}.${planetKey}`);

    await db.collection('interpretations').updateOne(
      { userId, chartType: 'natal' },
      {
        $set: {
          [`interpretations.${section}.${planetKey}`]: interpretation,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log('✅ [PLANET] Saved to MongoDB:', `${section}.${planetKey}`);

    return NextResponse.json({
      success: true,
      interpretation,
      planetKey,
      message: `Interpretación de ${planetName} generada correctamente`,
    });

  } catch (error) {
    console.error('❌ [PLANET] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    }, { status: 500 });
  }
}