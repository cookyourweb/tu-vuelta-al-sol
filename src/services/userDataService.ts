// src/services/userDataService.ts
// 🧑‍💼 SERVICIO PARA OBTENER DATOS DEL USUARIO

import connectDB from '@/lib/db';
import BirthData from '@/models/BirthData';

export interface UserBirthData {
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface UserProfile {
  name?: string;
  email?: string;
  birthData?: UserBirthData | null;
  hasNatalChart?: boolean;
  hasProgressedChart?: boolean;
  lastUpdated?: string;
}

// ==========================================
// 📋 OBTENER DATOS DE NACIMIENTO DEL USUARIO
// ==========================================

export async function getUserBirthData(userId: string): Promise<UserBirthData | null> {
  try {
    console.log(`🔍 Obteniendo datos de nacimiento para usuario: ${userId}`);

    // ✅ Usar directamente el modelo de Mongoose (NO fetch HTTP)
    await connectDB();
    const birthData = await BirthData.findByUserId(userId);

    if (!birthData) {
      console.log(`❌ No se encontraron datos de nacimiento para usuario: ${userId}`);
      return null;
    }

    console.log(`✅ Datos de nacimiento encontrados para usuario: ${userId}`);
    return {
      date: birthData.birthDate.toISOString().split('T')[0], // YYYY-MM-DD
      time: birthData.birthTime,
      location: birthData.birthPlace,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone
    };

  } catch (error) {
    console.error('❌ Error obteniendo datos de nacimiento:', error);
    return null;
  }
}

// ==========================================
// 👤 OBTENER PERFIL COMPLETO DEL USUARIO
// ==========================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log(`👤 Obteniendo perfil completo para usuario: ${userId}`);

    // Obtener datos de nacimiento directamente del modelo
    const birthData = await getUserBirthData(userId);

    // Obtener nombre del modelo si existe
    await connectDB();
    const birthDataDoc = await BirthData.findByUserId(userId);
    const name = birthDataDoc?.fullName || 'Usuario';

    // Para verificar cartas, podríamos consultar la DB directamente también
    // pero por ahora dejamos esto como está (no crítico)
    let hasNatalChart = false;
    let hasProgressedChart = false;

    const profile: UserProfile = {
      name,
      email: undefined,
      birthData,
      hasNatalChart,
      hasProgressedChart,
      lastUpdated: new Date().toISOString()
    };

    console.log(`✅ Perfil obtenido para usuario: ${userId}`, {
      hasBirthData: !!birthData,
      hasNatalChart,
      hasProgressedChart
    });

    return profile;

  } catch (error) {
    console.error('❌ Error obteniendo perfil de usuario:', error);
    return null;
  }
}

// ==========================================
// 💾 GUARDAR/ACTUALIZAR DATOS DE NACIMIENTO
// ==========================================

export async function saveUserBirthData(userId: string, birthData: UserBirthData): Promise<boolean> {
  try {
    console.log(`💾 Guardando datos de nacimiento para usuario: ${userId}`);

    await connectDB();

    // Buscar registro existente
    const existing = await BirthData.findByUserId(userId);

    if (existing) {
      // Actualizar existente
      existing.birthDate = new Date(birthData.date);
      existing.birthTime = birthData.time;
      existing.birthPlace = birthData.location;
      existing.latitude = birthData.latitude;
      existing.longitude = birthData.longitude;
      if (birthData.timezone) existing.timezone = birthData.timezone;
      await existing.save();
    } else {
      // Crear nuevo
      await BirthData.create({
        userId,
        fullName: 'Usuario', // Valor por defecto
        birthDate: new Date(birthData.date),
        birthTime: birthData.time,
        birthPlace: birthData.location,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone || 'Europe/Madrid'
      });
    }

    console.log(`✅ Datos de nacimiento guardados para usuario: ${userId}`);
    return true;

  } catch (error) {
    console.error('❌ Error guardando datos de nacimiento:', error);
    return false;
  }
}

// ==========================================
// 🔍 VERIFICAR COMPLETITUD DE DATOS DEL USUARIO
// ==========================================

export async function checkUserDataCompleteness(userId: string): Promise<{
  hasRequiredData: boolean;
  missingData: string[];
  birthData?: UserBirthData;
}> {
  try {
    const profile = await getUserProfile(userId);
    const missingData: string[] = [];

    if (!profile) {
      return {
        hasRequiredData: false,
        missingData: ['user_profile'],
      };
    }

    if (!profile.birthData) {
      missingData.push('birth_data');
    } else {
      // Verificar campos requeridos de birthData
      const requiredFields = ['date', 'time', 'location', 'latitude', 'longitude'];
      for (const field of requiredFields) {
        if (!profile.birthData[field as keyof UserBirthData]) {
          missingData.push(`birth_data.${field}`);
        }
      }
    }

    return {
      hasRequiredData: missingData.length === 0,
      missingData,
      birthData: profile.birthData ?? undefined
    };

  } catch (error) {
    console.error('❌ Error verificando completitud de datos:', error);
    return {
      hasRequiredData: false,
      missingData: ['verification_error']
    };
  }
}

// ==========================================
// 🔄 MIGRAR DATOS LEGACY
// ==========================================

export async function migrateLegacyUserData(userId: string): Promise<boolean> {
  try {
    console.log(`🔄 Intentando migración de datos legacy para usuario: ${userId}`);

    const birthData = await getUserBirthData(userId);

    if (birthData) {
      console.log(`✅ Datos encontrados, no necesita migración para usuario: ${userId}`);
      return true;
    }

    console.log(`❌ No hay datos para migrar para usuario: ${userId}`);
    return false;

  } catch (error) {
    console.error('❌ Error en migración legacy:', error);
    return false;
  }
}

export default {
  getUserBirthData,
  getUserProfile,
  saveUserBirthData,
  checkUserDataCompleteness,
  migrateLegacyUserData
};
