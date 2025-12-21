// src/services/solarReturnInterpretationService.ts
// 🚀 SERVICIO DE INTERPRETACIONES IA PARA SOLAR RETURN

import OpenAI from 'openai';
import { generateSolarReturnMasterPrompt } from '@/utils/prompts/solarReturnPrompts';
import { calculateSolarReturnComparison } from '@/utils/astrology/solarReturnComparison';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SolarReturnProfile {
  natalChart: any;
  solarReturnChart: any;
  userProfile: {
    name: string;
    currentAge: number;
    age?: number;
    birthDate?: string;
    birthTime?: string;
    birthPlace: string;
    currentPlace?: string;
    livesInSamePlace?: boolean;
    locationContext?: any;
  };
  returnYear: number;
}

/**
 * ✅ FUNCIÓN PRINCIPAL: Generar interpretación IA del Solar Return
 *
 * Genera una interpretación completa y personalizada del Solar Return usando:
 * - Posiciones reales de la carta natal
 * - Posiciones reales del Solar Return
 * - Comparación detallada entre ambas
 * - Prompt maestro profesional
 * - OpenAI GPT-4o
 *
 * El resultado es una interpretación al mismo nivel de calidad que la carta natal.
 */
export async function generateSolarReturnInterpretation(profile: SolarReturnProfile): Promise<{
  success: boolean;
  interpretation?: any;
  error?: string;
}> {
  try {
    console.log('🌅 [SOLAR RETURN AI] Generando interpretación personalizada con OpenAI...');

    // 1. Calcular comparación entre Natal y Solar Return
    const srComparison = calculateSolarReturnComparison(
      profile.natalChart,
      profile.solarReturnChart
    );

    console.log('📊 [SOLAR RETURN] Comparación calculada:', {
      ascSRInNatalHouse: srComparison.ascSRInNatalHouse,
      mcSRInNatalHouse: srComparison.mcSRInNatalHouse,
      planetaryChangesCount: srComparison.planetaryChanges?.length || 0
    });

    // 2. Generar prompt maestro usando posiciones reales
    const promptData = {
      natalChart: profile.natalChart,
      solarReturnChart: profile.solarReturnChart,
      userProfile: {
        ...profile.userProfile,
        age: profile.userProfile.currentAge || profile.userProfile.age || 0
      },
      returnYear: profile.returnYear,
      srComparison
    };

    const masterPrompt = generateSolarReturnMasterPrompt(promptData);

    console.log('📝 [SOLAR RETURN] Prompt generado, longitud:', masterPrompt.length, 'caracteres');

    // 3. Llamar a OpenAI con el prompt completo
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo experto. Respondes ÚNICAMENTE con JSON válido, sin markdown, sin backticks, sin comentarios.'
        },
        {
          role: 'user',
          content: masterPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 16000
    });

    const rawContent = response.choices[0]?.message?.content || '';

    console.log('📥 [SOLAR RETURN] Respuesta de OpenAI recibida, longitud:', rawContent.length);

    // 4. Parsear JSON
    let interpretationData;
    try {
      // Limpiar markdown si existe
      const cleanedContent = rawContent
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      interpretationData = JSON.parse(cleanedContent);
      console.log('✅ [SOLAR RETURN] JSON parseado exitosamente');
    } catch (parseError) {
      console.error('❌ [SOLAR RETURN] Error parseando JSON:', parseError);
      console.error('📄 Contenido recibido:', rawContent.substring(0, 500));
      throw new Error('Error parseando respuesta de OpenAI');
    }

    // 5. Retornar interpretación completa
    return {
      success: true,
      interpretation: {
        ...interpretationData,
        srComparison,
        _metadata: {
          generatedAt: new Date().toISOString(),
          model: 'gpt-4o',
          returnYear: profile.returnYear
        }
      }
    };

  } catch (error) {
    console.error('❌ [SOLAR RETURN AI] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
