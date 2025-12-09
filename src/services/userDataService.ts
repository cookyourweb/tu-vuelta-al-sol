// src/services/userDataService.ts
// 🧑‍💼 SERVICIO PARA OBTENER DATOS DEL USUARIO - COMPATIBLE CON TU SISTEMA
// ✅ FIXED: Soporte para llamadas server-side y client-side

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
// 🔧 HELPER: Detectar si estamos en el servidor
// ==========================================
function isServer(): boolean {
  return typeof window === 'undefined';
}

// ==========================================
// 🔧 HELPER: Obtener headers de auth (solo client-side)
// ==========================================
async function getAuthHeaders(): Promise<Record<string, string>> {
  if (isServer()) {
    // En el servidor, no necesitamos auth headers para llamadas internas
    return {
      'Content-Type': 'application/json',
    };
  }

  // En el cliente, obtener token de Firebase
  try {
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn('⚠️ Usuario no autenticado en cliente');
      return {
        'Content-Type': 'application/json',
      };
    }

    const idToken = await user.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    };
  } catch (error) {
    console.error('❌ Error obteniendo headers de auth:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
}

// ==========================================
// 📋 OBTENER DATOS DE NACIMIENTO (SERVER-SIDE - Directo a MongoDB)
// ==========================================

export async function getUserBirthDataDirect(userId: string): Promise<UserBirthData | null> {
  try {
    console.log(`🔍 [SERVER] Obteniendo datos de nacimiento directo para usuario: ${userId}`);

    // Importar dinámicamente para evitar errores en build time
    const { default: connectDB } = await import('@/lib/db');
    const { default: BirthData } = await import('@/models/BirthData');

    await connectDB();

    const birthDataRaw = await BirthData.findOne({
      $or: [
        { userId: userId },
        { uid: userId }
      ]
    }).lean() as any;

    if (!birthDataRaw) {
      console.log(`❌ [SERVER] No se encontraron datos para userId: ${userId}`);
      return null;
    }

    return {
      date: birthDataRaw.birthDate instanceof Date
        ? birthDataRaw.birthDate.toISOString().split('T')[0]
        : String(birthDataRaw.birthDate).split('T')[0],
      time: birthDataRaw.birthTime || '12:00',
      location: birthDataRaw.birthPlace,
      latitude: birthDataRaw.latitude,
      longitude: birthDataRaw.longitude,
      timezone: birthDataRaw.timezone || 'Europe/Madrid'
    };

  } catch (error) {
    console.error('❌ [SERVER] Error obteniendo datos de nacimiento:', error);
    return null;
  }
}

// ==========================================
// 📋 OBTENER DATOS DE NACIMIENTO (UNIVERSAL - API o MongoDB)
// ==========================================

export async function getUserBirthData(userId: string): Promise<UserBirthData | null> {
  try {
    // Si estamos en el servidor, usar acceso directo a MongoDB
    if (isServer()) {
      return await getUserBirthDataDirect(userId);
    }

    // Si estamos en el cliente, usar API endpoint
    console.log(`🔍 [CLIENT] Obteniendo datos de nacimiento para usuario: ${userId}`);

    const headers = await getAuthHeaders();
    const response = await fetch(`/api/birth-data?userId=${userId}`, {
      headers
    });

    if (!response.ok) {
      console.log(`❌ [CLIENT] No se encontraron datos de nacimiento para usuario: ${userId}`);
      return null;
    }

    const data = await response.json();

    if (data.success && data.data) {
      console.log(`✅ [CLIENT] Datos de nacimiento encontrados para usuario: ${userId}`);
      return {
        date: data.data.date,
        time: data.data.time,
        location: data.data.location,
        latitude: data.data.latitude,
        longitude: data.data.longitude,
        timezone: data.data.timezone
      };
    }

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

    // Obtener datos de nacimiento (usa la función universal)
    const birthData = await getUserBirthData(userId);

    // Verificar si tiene cartas generadas
    let hasNatalChart = false;
    let hasProgressedChart = false;

    if (isServer()) {
      // En servidor, podríamos verificar directamente en MongoDB
      // Por ahora dejamos en false para no hacer más queries
      console.log('ℹ️ [SERVER] Verificación de cartas omitida en servidor');
    } else {
      // En cliente, usar endpoints
      try {
        const headers = await getAuthHeaders();
        const natalResponse = await fetch(`/api/charts/natal?userId=${userId}`, {
          headers
        });
        hasNatalChart = natalResponse.ok;
      } catch (error) {
        console.log('❌ Error verificando carta natal:', error);
      }

      try {
        const headers = await getAuthHeaders();
        const progressedResponse = await fetch(`/api/charts/progressed?userId=${userId}`, {
          headers
        });
        hasProgressedChart = progressedResponse.ok;
      } catch (error) {
        console.log('❌ Error verificando carta progresada:', error);
      }
    }

    const profile: UserProfile = {
      name: 'Usuario',
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

    const headers = await getAuthHeaders();
    const baseUrl = isServer()
      ? (process.env.NEXTAUTH_URL || 'http://localhost:3000')
      : '';

    const response = await fetch(`${baseUrl}/api/birth-data`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        fullName: birthData.location, // Ajustar según tus necesidades
        birthDate: birthData.date,
        birthTime: birthData.time,
        birthPlace: birthData.location,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone
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
  getUserBirthDataDirect,
  getUserProfile,
  saveUserBirthData,
  checkUserDataCompleteness,
  migrateLegacyUserData
};
