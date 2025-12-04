// src/services/userDataService.ts
// 🧑‍💼 SERVICIO PARA OBTENER DATOS DEL USUARIO - COMPATIBLE CON TU SISTEMA

// ✅ IMPORTAR TU CONEXIÓN MONGODB EXISTENTE
// Ajusta esta importación según tu estructura actual
// import { connectToDatabase } from '@/lib/mongodb';
// O si usas mongoose:
// import mongoose from 'mongoose';

// Import Firebase auth for authentication
import { getAuth } from 'firebase/auth';

// Helper function to get authentication headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const idToken = await user.getIdToken();

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  };
}

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
  birthData?: UserBirthData | null; // ✅ PERMITIR TANTO undefined COMO null
  hasNatalChart?: boolean;
  hasProgressedChart?: boolean;
  lastUpdated?: string;
}

// 🔧 FUNCIÓN AUXILIAR PARA OBTENER CONEXIÓN DB
async function getDbConnection() {
  try {
    // ✅ OPCIÓN 1: Si tienes connectToDatabase funcionando
    // const { db } = await connectToDatabase();
    // return db;
    
    // ✅ OPCIÓN 2: Si usas mongoose y tienes modelos
    // return mongoose.connection.db;
    
    // ✅ OPCIÓN 3: Usar fetch para endpoints existentes (FALLBACK SEGURO)
    return null; // Usaremos endpoints existentes
  } catch (error) {
    console.error('❌ Error conectando a BD:', error);
    return null;
  }
}

// ==========================================
// 📋 OBTENER DATOS DE NACIMIENTO DEL USUARIO
// ==========================================

export async function getUserBirthData(userId: string): Promise<UserBirthData | null> {
  try {
    console.log(`🔍 Obteniendo datos de nacimiento para usuario: ${userId}`);

    // 🔄 USAR TU ENDPOINT EXISTENTE DE BIRTH-DATA
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/birth-data?userId=${userId}`, {
      headers
    });

    if (!response.ok) {
      console.log(`❌ No se encontraron datos de nacimiento para usuario: ${userId}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ Datos de nacimiento encontrados para usuario: ${userId}`);
      return {
        date: data.data.date,
        time: data.data.time,
        location: data.data.location,
        latitude: data.data.latitude,
        longitude: data.data.longitude,
        timezone: data.data.timezone
      };
    }

    console.log(`❌ No se encontraron datos de nacimiento para usuario: ${userId}`);
    return null;

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
    
    // Obtener datos de nacimiento
    const birthData = await getUserBirthData(userId);
    
    // Verificar si tiene cartas generadas usando tus endpoints existentes
    let hasNatalChart = false;
    let hasProgressedChart = false;
    
    try {
      const headers = await getAuthHeaders();
      const natalResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/charts/natal?userId=${userId}`, {
        headers
      });
      hasNatalChart = natalResponse.ok;
    } catch (error) {
      console.log('❌ Error verificando carta natal:', error);
    }

    try {
      const headers = await getAuthHeaders();
      const progressedResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/charts/progressed?userId=${userId}`, {
        headers
      });
      hasProgressedChart = progressedResponse.ok;
    } catch (error) {
      console.log('❌ Error verificando carta progresada:', error);
    }

    const profile: UserProfile = {
      name: 'Usuario', // Puedes obtener esto de Firebase Auth si lo necesitas
      email: undefined, // Puedes obtener esto de Firebase Auth si lo necesitas
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
// 💾 GUARDAR/ACTUALIZAR DATOS DE NACIMIENTO (OPCIONAL)
// ==========================================

export async function saveUserBirthData(userId: string, birthData: UserBirthData): Promise<boolean> {
  try {
    console.log(`💾 Guardando datos de nacimiento para usuario: ${userId}`);
    
    // Usar tu endpoint existente para guardar datos
    const headers = await getAuthHeaders();
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/birth-data`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        ...birthData
      })
    });

    if (response.ok) {
      console.log(`✅ Datos de nacimiento guardados para usuario: ${userId}`);
      return true;
    }

    return false;

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
// 🔄 MIGRAR DATOS LEGACY (FUNCIONAL PERO SIMPLE)
// ==========================================

export async function migrateLegacyUserData(userId: string): Promise<boolean> {
  try {
    console.log(`🔄 Intentando migración de datos legacy para usuario: ${userId}`);
    
    // En tu caso, probablemente los datos ya están en los endpoints correctos
    // Esta función es principalmente por compatibilidad
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