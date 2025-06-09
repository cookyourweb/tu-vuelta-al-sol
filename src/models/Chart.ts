// src/models/Chart.ts - ACTUALIZADO PARA PERÍODOS DINÁMICOS

import { model, models, Schema, Document } from "mongoose";

// ⭐ INTERFAZ ACTUALIZADA con períodos personalizados
export interface IChart extends Document {
  userId: string;
  birthDataId: string;
  natalChart: object;  // JSON con la carta natal
  progressedCharts: {  // ⭐ ARRAY MEJORADO - múltiples períodos por usuario
    period: string;        // "10 febrero 2025 - 10 febrero 2026"
    year: number;          // 2025 (año de inicio)
    startDate: Date;       // Fecha exacta de inicio del período
    endDate: Date;         // Fecha exacta de fin del período
    chart: object;         // Datos de la carta progresada
    isActive: boolean;     // Si es el período actual activo
    createdAt: Date;       // Cuándo se generó
  }[];
  createdAt: Date;
  lastUpdated: Date;
}

// ⭐ SCHEMA ACTUALIZADO con validaciones mejoradas
const ChartSchema: Schema = new Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Índice para búsquedas rápidas
  },
  birthDataId: { 
    type: Schema.Types.ObjectId, 
    ref: 'BirthData', 
    required: true 
  },
  natalChart: { 
    type: Object, 
    required: true 
  },
  progressedCharts: [{
    period: { 
      type: String, 
      required: true,
      // Ejemplo: "10 febrero 2025 - 10 febrero 2026"
    },
    year: { 
      type: Number, 
      required: true,
      min: 2020, // Validación básica
      max: 2050
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true,
      validate: {
        validator: function(this: any, endDate: Date) {
          return endDate > this.startDate;
        },
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
    },
    chart: { 
      type: Object, 
      required: true 
    },
    isActive: { 
      type: Boolean, 
      default: function(this: any) {
        const now = new Date();
        return now >= this.startDate && now < this.endDate;
      }
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// ⭐ MIDDLEWARE para actualizar lastUpdated automáticamente
ChartSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

ChartSchema.pre('findOneAndUpdate', function(next) {
  this.set({ lastUpdated: new Date() });
  next();
});

// ⭐ MÉTODOS DE INSTANCIA útiles
ChartSchema.methods.getCurrentProgressedChart = function() {
  const now = new Date();
  return this.progressedCharts.find((chart: any) => 
    now >= chart.startDate && now < chart.endDate
  );
};

ChartSchema.methods.getProgressedChartByPeriod = function(period: string) {
  return this.progressedCharts.find((chart: any) => chart.period === period);
};

ChartSchema.methods.addOrUpdateProgressedChart = function(progressedData: {
  period: string;
  year: number;
  startDate: Date;
  endDate: Date;
  chart: object;
}) {
  // Buscar si ya existe una carta para este período
  const existingIndex = this.progressedCharts.findIndex(
    (chart: any) => chart.period === progressedData.period
  );
  
  if (existingIndex !== -1) {
    // Actualizar existente
    this.progressedCharts[existingIndex] = {
      ...this.progressedCharts[existingIndex],
      ...progressedData,
      createdAt: new Date()
    };
  } else {
    // Agregar nuevo
    this.progressedCharts.push({
      ...progressedData,
      isActive: false, // Se calculará automáticamente
      createdAt: new Date()
    });
  }
  
  // Actualizar estados activos
  this.updateActiveStates();
  
  return this.save();
};

ChartSchema.methods.updateActiveStates = function() {
  const now = new Date();
  this.progressedCharts.forEach((chart: any) => {
    chart.isActive = now >= chart.startDate && now < chart.endDate;
  });
};

// ⭐ MÉTODOS ESTÁTICOS útiles
ChartSchema.statics.findByUserId = function(userId: string) {
  return this.findOne({ userId });
};

ChartSchema.statics.findCurrentProgressedChart = function(userId: string) {
  const now = new Date();
  return this.findOne({
    userId,
    'progressedCharts.startDate': { $lte: now },
    'progressedCharts.endDate': { $gt: now }
  });
};

ChartSchema.statics.findProgressedChartByYear = function(userId: string, year: number) {
  return this.findOne({
    userId,
    'progressedCharts.year': year
  });
};

// ⭐ ÍNDICES para mejor performance
ChartSchema.index({ userId: 1 });
ChartSchema.index({ 'progressedCharts.period': 1 });
ChartSchema.index({ 'progressedCharts.year': 1 });
ChartSchema.index({ 'progressedCharts.startDate': 1, 'progressedCharts.endDate': 1 });

export default models.Chart || model<IChart>('Chart', ChartSchema);

// ⭐ TIPOS ADICIONALES para TypeScript
export interface ProgressedChartPeriod {
  period: string;
  year: number;
  startDate: Date;
  endDate: Date;
  chart: any;
  isActive: boolean;
  createdAt: Date;
}

export interface ChartMethods {
  getCurrentProgressedChart(): ProgressedChartPeriod | undefined;
  getProgressedChartByPeriod(period: string): ProgressedChartPeriod | undefined;
  addOrUpdateProgressedChart(data: Omit<ProgressedChartPeriod, 'isActive' | 'createdAt'>): Promise<IChart>;
  updateActiveStates(): void;
}

export interface ChartStatics {
  findByUserId(userId: string): Promise<IChart | null>;
  findCurrentProgressedChart(userId: string): Promise<IChart | null>;
  findProgressedChartByYear(userId: string, year: number): Promise<IChart | null>;
}