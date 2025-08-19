// src/app/api/astrology/get-agenda/route.ts
// 🎯 ENDPOINT SIMPLIFICADO PARA OBTENER AGENDA COMPLETA

import { NextRequest, NextResponse } from 'next/server';
import { getAgendaWithCache } from '@/services/cacheService';
import { checkUserDataCompleteness, migrateLegacyUserData } from '@/services/userDataService';


export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { userId, forceRegenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido',
        action: 'login_required'
      }, { status: 400 });
    }

    console.log(`🚀 Obteniendo agenda para usuario: ${userId}`);

    // 🔍 VERIFICAR COMPLETITUD DE DATOS DEL USUARIO
    let userDataCheck = await checkUserDataCompleteness(userId);
    
    // 🔄 SI NO HAY DATOS, INTENTAR MIGRACIÓN LEGACY
    if (!userDataCheck.hasRequiredData && userDataCheck.missingData.includes('birth_data')) {
      console.log('🔄 Intentando migración de datos legacy...');
      const migrationSuccess = await migrateLegacyUserData(userId);
      
      if (migrationSuccess) {
        console.log('✅ Migración legacy exitosa, reverificando datos...');
        userDataCheck = await checkUserDataCompleteness(userId);
      }
    }

    // ❌ SI AÚN NO HAY DATOS COMPLETOS
    if (!userDataCheck.hasRequiredData) {
      const missingActions: Record<string, string> = {
        'birth_data': 'redirect_to_birth_data',
        'birth_data.date': 'configure_birth_date',
        'birth_data.time': 'configure_birth_time',
        'birth_data.location': 'configure_birth_location',
        'birth_data.latitude': 'configure_coordinates',
        'birth_data.longitude': 'configure_coordinates'
      };

      const primaryMissing = userDataCheck.missingData[0];
      
      return NextResponse.json({
        success: false,
        error: 'Datos de usuario incompletos',
        missingData: userDataCheck.missingData,
        action: missingActions[primaryMissing] || 'complete_user_data',
        message: generateMissingDataMessage(userDataCheck.missingData)
      }, { status: 400 });
    }

    // ✅ GENERAR/OBTENER AGENDA CON CACHÉ
    console.log('✅ Datos completos, generando agenda...');
    
    const agendaResult = await getAgendaWithCache(
      userId, 
      userDataCheck.birthData!, 
      forceRegenerate
    );

    if (!agendaResult.success) {
      return NextResponse.json({
        success: false,
        error: agendaResult.error || 'Error generando agenda',
        details: 'Error en el proceso de generación de agenda',
        action: 'retry_generation'
      }, { status: 500 });
    }

    const totalTime = Date.now() - startTime;

    console.log(`🌟 Agenda ${agendaResult.fromCache ? 'obtenida desde caché' : 'generada'} en ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      data: agendaResult.data,
      metadata: {
        fromCache: agendaResult.fromCache,
        generationTimeMs: totalTime,
        originalGenerationTime: agendaResult.generationTime,
        userDataComplete: true,
        version: 'v2.0'
      }
    });

  } catch (error) {
    console.error('❌ Error en get-agenda:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      details: 'Error procesando solicitud de agenda',
      action: 'contact_support'
    }, { status: 500 });
  }
}

// 🔧 FUNCIÓN AUXILIAR PARA MENSAJES DE DATOS FALTANTES
function generateMissingDataMessage(missingData: string[]): string {
  const messages: Record<string, string> = {
    'user_profile': 'No se encontró tu perfil de usuario. Por favor, inicia sesión nuevamente.',
    'birth_data': 'Necesitas configurar tus datos de nacimiento para generar tu agenda astrológica.',
    'birth_data.date': 'Falta tu fecha de nacimiento. Ve a configuración para completarla.',
    'birth_data.time': 'Falta tu hora de nacimiento. Ve a configuración para completarla.',
    'birth_data.location': 'Falta tu lugar de nacimiento. Ve a configuración para completarlo.',
    'birth_data.latitude': 'Faltan las coordenadas de tu lugar de nacimiento.',
    'birth_data.longitude': 'Faltan las coordenadas de tu lugar de nacimiento.'
  };

  const primaryMissing = missingData[0];
  return messages[primaryMissing] || `Faltan datos requeridos: ${missingData.join(', ')}`;
}

// ==========================================
// 📊 ENDPOINT PARA ESTADÍSTICAS DE AGENDA
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    // Verificar datos del usuario
    const userDataCheck = await checkUserDataCompleteness(userId);
    
    // Verificar si tiene agenda en caché
    let hasAgenda = false;
    let cacheAge = null;
    
    if (userDataCheck.hasRequiredData) {
      // Aquí podrías verificar si existe caché para este usuario
      // const cacheResult = await checkCache(userId, userDataCheck.birthData!);
      // hasAgenda = cacheResult.found;
    }

    return NextResponse.json({
      success: true,
      data: {
        userDataComplete: userDataCheck.hasRequiredData,
        missingData: userDataCheck.missingData,
        hasAgenda,
        cacheAge,
        recommendations: generateRecommendations(userDataCheck.hasRequiredData, hasAgenda)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo estadísticas'
    }, { status: 500 });
  }
}

// 🔧 FUNCIÓN AUXILIAR PARA RECOMENDACIONES
function generateRecommendations(hasCompleteData: boolean, hasAgenda: boolean): string[] {
  const recommendations: string[] = [];

  if (!hasCompleteData) {
    recommendations.push('Completa tus datos de nacimiento para poder generar tu agenda');
    recommendations.push('Asegúrate de incluir fecha, hora exacta y lugar de nacimiento');
  } else if (!hasAgenda) {
    recommendations.push('¡Todo listo! Puedes generar tu agenda astrológica personalizada');
    recommendations.push('La primera generación puede tomar 2-3 minutos');
  } else {
    recommendations.push('Tu agenda está lista y actualizada');
    recommendations.push('Puedes regenerarla si quieres nuevas interpretaciones');
  }

  return recommendations;
}