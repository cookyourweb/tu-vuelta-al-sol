// =============================================================================
// 🔧 CORRECCIÓN CRÍTICA 2: Chart model - Estructura flexible
// src/models/Chart.ts

import { model, models, Schema, Document, Types } from "mongoose";

// ✅ INTERFAZ flexible que soporta AMBAS estructuras
export interface IChart extends Document {
  _id: Types.ObjectId;
  userId: string;
  uid?: string;
  birthDataId: Types.ObjectId;
  chartType?: string;
  
  // ✅ Carta natal
  natalChart: any;
  
  // ✅ AMBAS estructuras de progresadas
  progressedChart?: any;  // Estructura legacy (objeto directo)
  progressedCharts?: {    // Estructura nueva (array)
    period: string;
    year: number;
    startDate: Date;
    endDate: Date;
    chart: any;
    isActive: boolean;
    createdAt: Date;
  }[];
  
  createdAt: Date;
  lastUpdated: Date;
}

const ChartSchema = new Schema<IChart>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  uid: {
    type: String,
    index: true,
    sparse: true
  },
  birthDataId: {
    type: Schema.Types.ObjectId,
    ref: 'BirthData',
    required: true
  },
  chartType: {
    type: String,
    enum: ['natal', 'progressed', 'transit', 'composite'],
    default: 'natal'
  },
  
  // ✅ Carta natal (siempre presente)
  natalChart: {
    type: Schema.Types.Mixed,
    required: true,
    default: {}
  },
  
  // ✅ ESTRUCTURA LEGACY: progressedChart como objeto
  progressedChart: {
    type: Schema.Types.Mixed,
    required: false
  },
  
  // ✅ ESTRUCTURA NUEVA: progressedCharts como array
  progressedCharts: [{
    period: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    chart: {
      type: Schema.Types.Mixed,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'charts'
});

// ✅ ÍNDICES para performance
ChartSchema.index({ userId: 1, chartType: 1 });
ChartSchema.index({ uid: 1, chartType: 1 }, { sparse: true });
ChartSchema.index({ birthDataId: 1 });
ChartSchema.index({ createdAt: 1 });
ChartSchema.index({ 'progressedCharts.year': 1 });
ChartSchema.index({ 'progressedCharts.isActive': 1 });

// ✅ HOOK PRE-SAVE: Mantener sincronización
ChartSchema.pre('save', function() {
  // Sincronizar uid con userId
  if (this.userId && !this.uid) {
    this.uid = this.userId;
  }
  
  // Actualizar lastUpdated
  this.lastUpdated = new Date();
  
  // Gestionar estados activos de progresadas
  if (this.progressedCharts && this.progressedCharts.length > 0) {
    this.updateActiveStates();
  }
});

// ✅ MÉTODOS DE INSTANCIA
ChartSchema.methods.getCurrentProgressedChart = function() {
  if (this.progressedCharts && this.progressedCharts.length > 0) {
    return this.progressedCharts.find((chart: any) => chart.isActive);
  }
  return null;
};

ChartSchema.methods.getProgressedChartByPeriod = function(period: string) {
  if (this.progressedCharts && this.progressedCharts.length > 0) {
    return this.progressedCharts.find((chart: any) => chart.period === period);
  }
  return null;
};

ChartSchema.methods.addOrUpdateProgressedChart = async function(data: {
  period: string;
  year: number;
  startDate: Date;
  endDate: Date;
  chart: any;
}) {
  if (!this.progressedCharts) {
    this.progressedCharts = [];
  }
  
  // Buscar si ya existe para este período
  const existingIndex = this.progressedCharts.findIndex(
    (chart: any) => chart.period === data.period
  );
  
  if (existingIndex >= 0) {
    // Actualizar existente
    this.progressedCharts[existingIndex] = {
      ...data,
      isActive: true,
      createdAt: new Date()
    };
  } else {
    // Añadir nuevo
    this.progressedCharts.push({
      ...data,
      isActive: true,
      createdAt: new Date()
    });
  }
  
  // Actualizar estados activos
  if (typeof this.updateActiveStates === 'function') {
    this.updateActiveStates();
  }
  
  return this.save();
};

// Agregar el método correctamente al prototipo del documento
ChartSchema.method('updateActiveStates', function() {
  if (!this.progressedCharts) return;
  
  const now = new Date();
  this.progressedCharts.forEach((chart: any) => {
    chart.isActive = now >= chart.startDate && now < chart.endDate;
  });
});

// ✅ MÉTODOS ESTÁTICOS
ChartSchema.statics.findByUserId = function(userId: string) {
  return this.findOne({ 
    $or: [
      { userId: userId },
      { uid: userId }
    ] 
  });
};

ChartSchema.statics.findCurrentProgressedChart = function(userId: string) {
  const now = new Date();
  return this.findOne({
    $or: [
      { userId: userId },
      { uid: userId }
    ],
    'progressedCharts.startDate': { $lte: now },
    'progressedCharts.endDate': { $gt: now },
    'progressedCharts.isActive': true
  });
};

ChartSchema.statics.findProgressedChartByYear = function(userId: string, year: number) {
  return this.findOne({
    $or: [
      { userId: userId },
      { uid: userId }
    ],
    'progressedCharts.year': year
  });
};

const Chart = models.Chart || model<IChart>('Chart', ChartSchema);

// ✅ FUNCIÓN DE CASTING robusta
export function castChart(data: any): IChart | null {
  if (!data) {
    return null;
  }

  try {
    // ✅ NORMALIZAR datos
    const normalizedData = {
      ...data,
      _id: data._id || new Types.ObjectId(),
      userId: data.userId || data.uid,
      uid: data.uid || data.userId,
      birthDataId: data.birthDataId instanceof Types.ObjectId 
        ? data.birthDataId 
        : new Types.ObjectId(data.birthDataId),
      natalChart: data.natalChart || {},
      chartType: data.chartType || 'natal',
      createdAt: data.createdAt || new Date(),
      lastUpdated: data.lastUpdated || new Date()
    };

    // ✅ MANEJAR progressedCharts
    if (data.progressedCharts && Array.isArray(data.progressedCharts)) {
      normalizedData.progressedCharts = data.progressedCharts.map((pc: any) => ({
        ...pc,
        startDate: pc.startDate instanceof Date ? pc.startDate : new Date(pc.startDate),
        endDate: pc.endDate instanceof Date ? pc.endDate : new Date(pc.endDate),
        createdAt: pc.createdAt instanceof Date ? pc.createdAt : new Date(pc.createdAt)
      }));
    }

    // ✅ MANEJAR progressedChart legacy
    if (data.progressedChart) {
      normalizedData.progressedChart = data.progressedChart;
    }

    // ✅ VALIDACIÓN BÁSICA
    if (!normalizedData.userId || !normalizedData.birthDataId) {
      console.warn('⚠️ [Chart] Datos inválidos:', {
        userId: !!normalizedData.userId,
        birthDataId: !!normalizedData.birthDataId
      });
      return null;
    }

    return normalizedData as IChart;
    
  } catch (error) {
    console.error('❌ [Chart] Error en casting:', error);
    return null;
  }
}

// ✅ EXPORT por defecto
export default Chart;

// ✅ TIPOS ADICIONALES
export interface ProgressedChartPeriod {
  period: string;
  year: number;
  startDate: Date;
  endDate: Date;
  chart: any;
  isActive: boolean;
  createdAt: Date;
}

export interface ChartInput {
  userId: string;
  birthDataId: string | Types.ObjectId;
  chartType?: string;
  natalChart: any;
  progressedChart?: any;
  progressedCharts?: ProgressedChartPeriod[];
}

// ✅ HELPER FUNCTIONS
export const ChartHelpers = {
  createNatalChart: (input: ChartInput) => {
    return new Chart({
      ...input,
      uid: input.userId,
      chartType: 'natal'
    });
  },

  createProgressedChart: (input: ChartInput & { period: string; year: number }) => {
    const now = new Date();
    return new Chart({
      ...input,
      uid: input.userId,
      chartType: 'progressed',
      progressedCharts: [{
        period: input.period,
        year: input.year,
        startDate: now,
        endDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
        chart: input.natalChart, // Se usará como progresada
        isActive: true,
        createdAt: now
      }]
    });
  },

  validateChartData: (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.userId && !data.uid) errors.push('userId o uid es requerido');
    if (!data.birthDataId) errors.push('birthDataId es requerido');
    if (!data.natalChart) errors.push('natalChart es requerido');

    return {
      valid: errors.length === 0,
      errors
    };
  },

  formatForDisplay: (chart: IChart) => {
    return {
      id: chart._id.toString(),
      userId: chart.userId,
      chartType: chart.chartType,
      hasNatal: !!chart.natalChart,
      hasProgressed: !!(chart.progressedChart || chart.progressedCharts?.length),
      progressedChartsCount: chart.progressedCharts?.length || 0,
      activeProgressedChart: chart.progressedCharts?.find(pc => pc.isActive),
      lastUpdated: chart.lastUpdated,
      createdAt: chart.createdAt
    };
  }
};