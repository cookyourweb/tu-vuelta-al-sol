// src/app/api/astrology/simple-agenda/route.ts
// 🎯 ENDPOINT COMPATIBLE CON EL COMPONENTE ACTUAL AgendaAIDisplay

import { NextRequest, NextResponse } from 'next/server';

import { getAgendaWithCache } from '@/services/cacheService';
import { checkUserDataCompleteness } from '@/services/userDataService';

export async function POST(request: NextRequest) {
  try {
    const { userId, regenerate = false } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido',
        action: 'login_required'
      });
    }

    console.log(`🔮 Generando agenda simple para usuario: ${userId}`);

    // 🔍 VERIFICAR DATOS DEL USUARIO
    const userDataCheck = await checkUserDataCompleteness(userId);
    
    if (!userDataCheck.hasRequiredData) {
      if (userDataCheck.missingData.includes('birth_data')) {
        return NextResponse.json({
          success: false,
          error: 'Necesitas configurar tus datos de nacimiento primero',
          action: 'redirect_to_birth_data'
        });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Datos de usuario incompletos',
        action: 'complete_user_data'
      });
    }

    // 🚀 INTENTAR OBTENER AGENDA NUEVA ESTRUCTURA
    try {
      const agendaResult = await getAgendaWithCache(
        userId, 
        userDataCheck.birthData!, 
        regenerate
      );

      if (agendaResult.success) {
        // ✅ AGENDA NUEVA ESTRUCTURA EXITOSA
        console.log(`✅ Agenda nueva estructura ${agendaResult.fromCache ? 'desde caché' : 'generada'}`);
        
        return NextResponse.json({
          success: true,
          data: {
            agenda: agendaResult.data.agenda, // La estructura nueva va aquí
            isNewFormat: true
          },
          metadata: {
            fromCache: agendaResult.fromCache,
            generationTimeMs: agendaResult.generationTime,
            version: 'v2.0'
          }
        });
      }
    } catch (newStructureError) {
      console.log('⚠️ Error con estructura nueva, intentando legacy...', newStructureError);
    }

    // 🔄 FALLBACK A ESTRUCTURA LEGACY
    console.log('🔄 Usando estructura legacy...');
    
    const legacyResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/astrology/generate-agenda-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        datos_usuario: {
          nombre: 'Usuario',
          fecha_nacimiento: userDataCheck.birthData!.date,
          hora_nacimiento: userDataCheck.birthData!.time,
          lugar_nacimiento: userDataCheck.birthData!.location,
          edad_actual: calculateAge(userDataCheck.birthData!.date)
        },
        carta_natal: {}, // Datos mock para compatibilidad
        carta_progresada: {}
      })
    });

    if (legacyResponse.ok) {
      const legacyData = await legacyResponse.json();
      
      if (legacyData.success && legacyData.data.agenda) {
        console.log('✅ Agenda legacy generada exitosamente');
        
        return NextResponse.json({
          success: true,
          data: {
            agenda: legacyData.data.agenda,
            isNewFormat: false
          },
          metadata: {
            fromCache: false,
            generationTimeMs: 0,
            version: 'v1.0-legacy'
          }
        });
      }
    }

    // ❌ TODOS LOS MÉTODOS FALLARON
    console.error('❌ Todos los métodos de generación fallaron');
    
    return NextResponse.json({
      success: false,
      error: 'No se pudo generar la agenda con ningún método disponible',
      action: 'retry_later'
    });

  } catch (error) {
    console.error('❌ Error en simple-agenda:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      action: 'contact_support'
    });
  }
}

// 🔧 FUNCIÓN AUXILIAR PARA CALCULAR EDAD
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}