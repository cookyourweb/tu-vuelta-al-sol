// src/services/cacheService.ts
// 🗄️ SERVICIO DE CACHÉ INTELIGENTE

export interface BirthData {
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface CacheMetadata {
  totalEvents: number;
  aiInterpretedEvents: number;
  generationTimeMs: number;
  aiCostUsd: number;
  version: string;
}

export interface CachedAgendaData {
  agenda: any;
  natalChart: any;
  progressedChart: any;
  metadata: CacheMetadata;
  createdAt: string;
  expiresAt: string;
}

// ==========================================
// 🔍 VERIFICAR SI EXISTE CACHÉ
// ==========================================

export async function checkCache(
  userId: string, 
  birthData: BirthData
): Promise<{ found: boolean; data?: CachedAgendaData; birthDataHash?: string }> {
  
  try {
    console.log(`🔍 Verificando caché para usuario: ${userId}`);
    
    const response = await fetch('/api/astrology/cache/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        birthData
      })
    });

    const result = await response.json();
    
    if (!result.success) {
      console.error('❌ Error verificando caché:', result.error);
      return { found: false };
    }

    if (result.data.found) {
      console.log(`✅ Caché encontrado para usuario ${userId}`);
      return {
        found: true,
        data: result.data
      };
    } else {
      console.log(`❌ No hay caché para usuario ${userId}`);
      return {
        found: false,
        birthDataHash: result.data.birthDataHash
      };
    }

  } catch (error) {
    console.error('❌ Error en checkCache:', error);
    return { found: false };
  }
}

// ==========================================
// 💾 GUARDAR DATOS EN CACHÉ
// ==========================================

export async function saveToCache(
  userId: string,
  birthDataHash: string,
  agenda: any,
  natalChart: any,
  progressedChart: any,
  metadata: CacheMetadata
): Promise<boolean> {
  
  try {
    console.log(`💾 Guardando en caché para usuario: ${userId}`);
    
    const response = await fetch('/api/astrology/cache/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        birthDataHash,
        agenda,
        natalChart,
        progressedChart,
        metadata
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Caché guardado exitosamente para usuario ${userId}`);
      return true;
    } else {
      console.error('❌ Error guardando caché:', result.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Error en saveToCache:', error);
    return false;
  }
}

// ==========================================
// 🗑️ INVALIDAR CACHÉ
// ==========================================

export async function invalidateCache(
  userId: string, 
  reason: string = 'manual'
): Promise<boolean> {
  
  try {
    console.log(`🗑️ Invalidando caché para usuario: ${userId}, razón: ${reason}`);
    
    const response = await fetch('/api/astrology/cache/invalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        reason
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Caché invalidado para usuario ${userId}`);
      return true;
    } else {
      console.error('❌ Error invalidando caché:', result.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Error en invalidateCache:', error);
    return false;
  }
}

// ==========================================
// 📊 OBTENER ESTADÍSTICAS DE CACHÉ
// ==========================================

export async function getCacheStats(): Promise<any> {
  
  try {
    const response = await fetch('/api/astrology/cache/stats');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      console.error('❌ Error obteniendo estadísticas:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error en getCacheStats:', error);
    return null;
  }
}

// ==========================================
// 🎯 FUNCIÓN PRINCIPAL: OBTENER AGENDA CON CACHÉ
// ==========================================

export async function getAgendaWithCache(
  userId: string,
  birthData: BirthData,
  forceRegenerate: boolean = false
): Promise<{
  success: boolean;
  data?: any;
  fromCache: boolean;
  generationTime?: number;
  error?: string;
}> {
  
  const startTime = Date.now();
  
  try {
    // 🔍 VERIFICAR CACHÉ EXISTENTE (a menos que se fuerce regeneración)
    if (!forceRegenerate) {
      const cacheResult = await checkCache(userId, birthData);
      
      if (cacheResult.found && cacheResult.data) {
        console.log(`⚡ Usando datos desde caché para usuario ${userId}`);
        return {
          success: true,
          data: cacheResult.data,
          fromCache: true,
          generationTime: Date.now() - startTime
        };
      }
    }

    // 🔄 GENERAR NUEVOS DATOS
    console.log(`🔄 Generando nuevos datos para usuario ${userId}`);
    
    // 1. Obtener carta natal
    const natalChartResponse = await fetch('/api/astrology/natal-chart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(birthData)
    });
    
    if (!natalChartResponse.ok) {
      throw new Error('Error obteniendo carta natal');
    }
    
    const natalChart = await natalChartResponse.json();
    
    // 2. Obtener carta progresada
    const progressedChartResponse = await fetch('/api/astrology/progressed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(birthData)
    });
    
    const progressedChart = progressedChartResponse.ok 
      ? await progressedChartResponse.json() 
      : null;
    
    // 3. Generar agenda completa
    const agendaResponse = await fetch('/api/astrology/complete-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthData,
        natalChart: natalChart.data,
        progressedChart: progressedChart?.data
      })
    });
    
    if (!agendaResponse.ok) {
      throw new Error('Error generando agenda');
    }
    
    const agenda = await agendaResponse.json();
    
    // 📊 CALCULAR METADATA
    const generationTimeMs = Date.now() - startTime;
    const metadata: CacheMetadata = {
      totalEvents: agenda.data?.events?.length || 0,
      aiInterpretedEvents: agenda.data?.events?.filter((e: any) => e.aiInterpretation)?.length || 0,
      generationTimeMs,
      aiCostUsd: calculateEstimatedCost(agenda.data?.events || []),
      version: '1.0'
    };
    
    // 💾 GUARDAR EN CACHÉ
    const cacheResult = await checkCache(userId, birthData);
    if (cacheResult.birthDataHash) {
      await saveToCache(
        userId,
        cacheResult.birthDataHash,
        agenda.data,
        natalChart.data,
        progressedChart?.data,
        metadata
      );
    }
    
    console.log(`✅ Agenda generada y guardada en caché para usuario ${userId} en ${generationTimeMs}ms`);
    
    return {
      success: true,
      data: {
        agenda: agenda.data,
        natalChart: natalChart.data,
        progressedChart: progressedChart?.data,
        metadata
      },
      fromCache: false,
      generationTime: generationTimeMs
    };

  } catch (error) {
    console.error('❌ Error en getAgendaWithCache:', error);
    return {
      success: false,
      fromCache: false,
      generationTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

// ==========================================
// 💰 CALCULAR COSTO ESTIMADO DE IA
// ==========================================

function calculateEstimatedCost(events: any[]): number {
  // Estimación basada en tokens promedio por interpretación
  const aiInterpretedEvents = events.filter(e => e.aiInterpretation).length;
  const tokensPerInterpretation = 500; // Estimación promedio
  const costPerToken = 0.00003; // GPT-4 pricing
  
  return aiInterpretedEvents * tokensPerInterpretation * costPerToken;
}

// ==========================================
// 🔧 UTILIDADES DE CACHÉ
// ==========================================

export const cacheUtils = {
  
  // 🕒 Verificar si el caché está cerca de expirar (menos de 7 días)
  isNearExpiration: (expiresAt: string): boolean => {
    const expireDate = new Date(expiresAt);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return expireDate < sevenDaysFromNow;
  },
  
  // 📏 Obtener el tamaño del caché en KB
  getCacheSize: (data: any): number => {
    return Math.round(JSON.stringify(data).length / 1024);
  },
  
  // 🔄 Verificar si necesita actualización (versión diferente)
  needsUpdate: (cachedVersion: string, currentVersion: string): boolean => {
    return cachedVersion !== currentVersion;
  },
  
  // 📊 Formatear estadísticas para mostrar
  formatStats: (stats: any) => ({
    totalCaches: stats.totalCaches || 0,
    activeCaches: stats.activeCaches || 0,
    hitRate: stats.activeCaches > 0 ? 
      ((stats.activeCaches / stats.totalCaches) * 100).toFixed(1) + '%' : '0%',
    avgEvents: Math.round(stats.avgEventsPerCache || 0),
    recentActivity: stats.recentCaches || []
  })
};

export default {
  checkCache,
  saveToCache,
  invalidateCache,
  getCacheStats,
  getAgendaWithCache,
  cacheUtils
};