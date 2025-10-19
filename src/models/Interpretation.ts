// src/models/Interpretation.ts
// 🔥 MODELO MONGOOSE PARA INTERPRETACIONES

import mongoose, { Schema, Document } from 'mongoose';

// 📊 INTERFACE TYPESCRIPT
export interface IInterpretation extends Document {
  userId: string;
  chartType: 'natal' | 'solar-return' | 'progressed';
  
  // Datos de entrada
  natalChart?: any;
  solarReturnChart?: any;
  progressedChart?: any;
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  
  // Interpretación generada
  interpretation: {
    // SOLAR RETURN
    esencia_revolucionaria_anual?: string;
    proposito_vida_anual?: string;
    tema_central_del_anio?: string;
    analisis_tecnico_profesional?: any;
    plan_accion?: any;
    calendario_lunar_anual?: any[];
    declaracion_poder_anual?: string;
    advertencias?: string[];
    eventos_clave_del_anio?: any[];
    insights_transformacionales?: string[];
    rituales_recomendados?: string[];
    integracion_final?: any;
    
    // NATAL
    esencia_revolucionaria?: string;
    proposito_vida?: string;
    poder_magnetico?: string;
    patron_energetico?: string;
    planeta_dominante?: string;
    elemento_dominante?: string;
    analisis_planetas?: any;
    super_poderes?: string[];
    desafios_evolutivos?: string[];
    mision_vida?: string;
    activacion_talentos?: any;
    
    // PROGRESSED
    tema_anual?: string;
    evolucion_personalidad?: string;
  };
  
  // Metadata
  generatedAt: Date;
  expiresAt: Date;
  method: 'openai' | 'fallback' | 'cached';
  cached: boolean;
}

// 📦 SCHEMA MONGOOSE
const InterpretationSchema = new Schema<IInterpretation>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  chartType: {
    type: String,
    enum: ['natal', 'solar-return', 'progressed'],
    required: true,
    index: true
  },
  
  natalChart: {
    type: Schema.Types.Mixed,
    required: false
  },
  
  solarReturnChart: {
    type: Schema.Types.Mixed,
    required: false
  },
  
  progressedChart: {
    type: Schema.Types.Mixed,
    required: false
  },
  
  userProfile: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    birthPlace: { type: String, required: true },
    birthDate: { type: String, required: true },
    birthTime: { type: String, required: true }
  },
  
  interpretation: {
    type: Schema.Types.Mixed,
    required: true
  },
  
  generatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiresAt: {
    type: Date,
    required: true,
    index: true // ✅ Para limpiar automáticamente con TTL
  },
  
  method: {
    type: String,
    enum: ['openai', 'fallback', 'cached'],
    default: 'openai'
  },
  
  cached: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'interpretations'
});

// 🔍 ÍNDICES COMPUESTOS
InterpretationSchema.index({ userId: 1, chartType: 1, generatedAt: -1 });
InterpretationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // ✅ TTL automático

// 🚀 MÉTODOS ESTÁTICOS
InterpretationSchema.statics.findLatest = function(userId: string, chartType: string) {
  return this.findOne({ 
    userId, 
    chartType,
    expiresAt: { $gt: new Date() } 
  })
  .sort({ generatedAt: -1 })
  .exec();
};

InterpretationSchema.statics.findAllByUser = function(userId: string, chartType?: string) {
  const query: any = { 
    userId,
    expiresAt: { $gt: new Date() }
  };
  
  if (chartType) {
    query.chartType = chartType;
  }
  
  return this.find(query)
    .sort({ generatedAt: -1 })
    .exec();
};

// 📤 EXPORTAR MODELO
export default mongoose.models.Interpretation || 
  mongoose.model<IInterpretation>('Interpretation', InterpretationSchema);