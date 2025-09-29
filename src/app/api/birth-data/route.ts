// src/app/api/birth-data/route.ts
// 🚀 API ACTUALIZADA PARA MANEJAR UBICACIÓN ACTUAL

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BirthData, { castBirthData } from '@/models/BirthData';

// ==========================================
// 📥 GET: OBTENER DATOS DE NACIMIENTO
// ==========================================

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    console.log('🔍 [BIRTH-DATA] Buscando datos para userId:', userId);

    const birthDataRaw = await BirthData.findOne({
      $or: [
        { userId: userId },
        { uid: userId }
      ]
    }).lean();

    if (!birthDataRaw) {
      console.log('❌ [BIRTH-DATA] No se encontraron datos para userId:', userId);
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos de nacimiento'
      }, { status: 404 });
    }

    const birthData = castBirthData(birthDataRaw);

    if (!birthData) {
      return NextResponse.json({
        success: false,
        error: 'Error procesando datos de nacimiento'
      }, { status: 500 });
    }

    console.log('✅ [BIRTH-DATA] Datos encontrados:', {
      userId: birthData.userId,
      fullName: birthData.fullName,
      birthPlace: birthData.birthPlace,
      livesInSamePlace: birthData.livesInSamePlace,
      hasCurrentLocation: !!(birthData.currentPlace || birthData.currentLatitude)
    });

    // ✅ ESTRUCTURA DE RESPUESTA ACTUALIZADA
    return NextResponse.json({
      success: true,
      data: {
        // Datos básicos
        id: birthData._id.toString(),
        userId: birthData.userId,
        fullName: birthData.fullName,
        date: birthData.birthDate.toISOString().split('T')[0],
        time: birthData.birthTime,
        location: birthData.birthPlace,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
        
        // ✅ DATOS DE UBICACIÓN ACTUAL
        livesInSamePlace: birthData.livesInSamePlace,
        currentPlace: birthData.currentPlace,
        currentLatitude: birthData.currentLatitude,
        currentLongitude: birthData.currentLongitude,
        
        // Datos computados
        birthDate: birthData.birthDate,
        birthPlace: birthData.birthPlace,
        
        // Metadatos
        createdAt: birthData.createdAt,
        updatedAt: birthData.updatedAt
      }
    });

  } catch (error: unknown) {
    console.error('❌ [BIRTH-DATA] Error en GET:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// ==========================================
// 📤 POST: GUARDAR/ACTUALIZAR DATOS
// ==========================================

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    console.log('📝 [BIRTH-DATA] Datos recibidos:', {
      userId: body.userId || body.uid,
      fullName: body.fullName,
      birthPlace: body.birthPlace,
      livesInSamePlace: body.livesInSamePlace,
      currentPlace: body.currentPlace,
      hasCurrentCoords: !!(body.currentLatitude && body.currentLongitude)
    });

    // Validar campos requeridos
    const requiredFields = ['userId', 'fullName', 'birthDate', 'birthPlace', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !body[field] && !body[field.replace('userId', 'uid')]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Campos requeridos faltantes',
        missingFields: missingFields
      }, { status: 400 });
    }

    const userId = body.userId || body.uid;

    // ✅ VALIDAR UBICACIÓN ACTUAL
    if (!body.livesInSamePlace) {
      // Si no vive en el mismo lugar, debe tener ubicación actual
      if (!body.currentPlace && (!body.currentLatitude || !body.currentLongitude)) {
        return NextResponse.json({
          success: false,
          error: 'Ubicación actual requerida si no vives donde naciste'
        }, { status: 400 });
      }
    }

    // Buscar registro existente
    const existingData = await BirthData.findOne({
      $or: [
        { userId: userId },
        { uid: userId }
      ]
    });

    // ✅ COMBINAR FECHA Y HORA PARA GUARDAR EN birthDate
    const birthTimeToUse = body.birthTime && body.birthTime.trim() ? body.birthTime : (existingData ? existingData.birthTime : '12:00:00');
    const birthDateTime = new Date(`${body.birthDate}T${birthTimeToUse}`);

    // ✅ DATOS PREPARADOS PARA GUARDAR
    const dataToSave = {
      userId: userId,
      uid: userId,
      fullName: body.fullName,
      birthDate: birthDateTime, // ✅ FECHA COMPLETA CON HORA
      birthTime: birthTimeToUse, // ✅ HORA POR SEPARADO PARA COMPATIBILIDAD
      birthPlace: body.birthPlace,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
      timezone: body.timezone || 'Europe/Madrid',

      // ✅ UBICACIÓN ACTUAL
      livesInSamePlace: body.livesInSamePlace !== false, // Default true
      currentPlace: body.livesInSamePlace ? undefined : body.currentPlace,
      currentLatitude: body.livesInSamePlace ? undefined : (body.currentLatitude ? parseFloat(body.currentLatitude) : undefined),
      currentLongitude: body.livesInSamePlace ? undefined : (body.currentLongitude ? parseFloat(body.currentLongitude) : undefined),
    };

    let savedData;

    if (existingData) {
      // Actualizar registro existente
      console.log('🔄 [BIRTH-DATA] Actualizando registro existente');
      
      Object.assign(existingData, dataToSave);
      savedData = await existingData.save();
    } else {
      // Crear nuevo registro
      console.log('🆕 [BIRTH-DATA] Creando nuevo registro');
      
      const newBirthData = new BirthData(dataToSave);
      savedData = await newBirthData.save();
    }

    console.log('✅ [BIRTH-DATA] Datos guardados exitosamente:', {
      id: savedData._id.toString(),
      userId: savedData.userId,
      livesInSamePlace: savedData.livesInSamePlace,
      hasCurrentLocation: !!(savedData.currentPlace || savedData.currentLatitude)
    });

    // ✅ RESPUESTA ACTUALIZADA
    return NextResponse.json({
      success: true,
      data: {
        id: savedData._id.toString(),
        userId: savedData.userId,
        fullName: savedData.fullName,
        date: savedData.birthDate.toISOString().split('T')[0],
        time: savedData.birthTime,
        location: savedData.birthPlace,
        latitude: savedData.latitude,
        longitude: savedData.longitude,
        timezone: savedData.timezone,
        
        // ✅ UBICACIÓN ACTUAL EN RESPUESTA
        livesInSamePlace: savedData.livesInSamePlace,
        currentPlace: savedData.currentPlace,
        currentLatitude: savedData.currentLatitude,
        currentLongitude: savedData.currentLongitude,
        
        birthDate: savedData.birthDate,
        birthPlace: savedData.birthPlace,
        createdAt: savedData.createdAt,
        updatedAt: savedData.updatedAt,
        
        // ✅ COORDENADAS PARA SOLAR RETURN (TEMPORALMENTE COMENTADO)
        // solarReturnCoordinates: savedData.getSolarReturnCoordinates()
      },
      message: existingData ? 'Datos actualizados correctamente' : 'Datos guardados correctamente'
    });

  } catch (error: unknown) {
    console.error('❌ [BIRTH-DATA] Error en POST:', error);

    // Error específico de MongoDB
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe un registro para este usuario'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// ==========================================
// 🗑️ DELETE: ELIMINAR DATOS
// ==========================================

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId es requerido'
      }, { status: 400 });
    }

    console.log('🗑️ [BIRTH-DATA] Eliminando datos para userId:', userId);

    const deletedData = await BirthData.findOneAndDelete({
      $or: [
        { userId: userId },
        { uid: userId }
      ]
    });

    if (!deletedData) {
      return NextResponse.json({
        success: false,
        error: 'No se encontraron datos para eliminar'
      }, { status: 404 });
    }

    console.log('✅ [BIRTH-DATA] Datos eliminados exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Datos eliminados correctamente'
    });

  } catch (error: unknown) {
    console.error('❌ [BIRTH-DATA] Error en DELETE:', error);

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}