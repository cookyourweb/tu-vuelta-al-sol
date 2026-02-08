// =============================================================================
// 🌞 MODELO: Solar Cycle - Ciclos Solares del Usuario
// src/models/SolarCycle.ts
// =============================================================================

import { model, models, Schema, Document, Types, Model } from "mongoose";

// Tipos para eventos astrológicos (reutilizar si existen en otro lugar)
export interface AstrologicalEvent {
  id: string;
  date: Date;
  title: string;
  type: string;
  description?: string;
  interpretation?: any;
  importance?: string;
  metadata?: any;
}

export interface ISolarCycle extends Document {
  _id: Types.ObjectId;
  userId: string;
  cycleStart: Date;        // Inicio del ciclo (cumpleaños año X)
  cycleEnd: Date;          // Fin del ciclo (cumpleaños año X+1)
  yearLabel: string;       // "2025-2026"
  events: AstrologicalEvent[];
  solarReturnData?: any;   // Datos del retorno solar calculados
  generatedAt: Date;
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Subdocument schema para eventos astrológicos
const AstrologicalEventSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  interpretation: {
    type: Schema.Types.Mixed,
    required: false
  },
  importance: {
    type: String,
    required: false
  },
  metadata: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { _id: false }); // Disable _id for subdocuments

const SolarCycleSchema = new Schema<ISolarCycle>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  cycleStart: {
    type: Date,
    required: true
  },
  cycleEnd: {
    type: Date,
    required: true
  },
  yearLabel: {
    type: String,
    required: true,
    index: true
  },
  events: {
    type: [AstrologicalEventSchema],
    default: []
  },
  solarReturnData: {
    type: Schema.Types.Mixed,
    required: false
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'solarcycles'
});

// Índices compuestos para búsquedas eficientes
SolarCycleSchema.index({ userId: 1, cycleStart: -1 });
SolarCycleSchema.index({ userId: 1, yearLabel: 1 }, { unique: true });
SolarCycleSchema.index({ userId: 1, status: 1 });

// ✅ MÉTODOS ESTÁTICOS

/**
 * Obtener ciclos activos del usuario (máximo 2)
 */
SolarCycleSchema.statics.getActiveCycles = function(userId: string) {
  return this.find({
    userId,
    status: 'active'
  })
  .sort({ cycleStart: -1 })
  .limit(2);
};

/**
 * Obtener ciclo por año específico
 */
SolarCycleSchema.statics.findByYear = function(userId: string, yearLabel: string) {
  return this.findOne({
    userId,
    yearLabel,
    status: 'active'
  });
};

/**
 * Verificar si existe el siguiente ciclo
 */
SolarCycleSchema.statics.hasNextCycle = async function(userId: string, currentEndYear: number) {
  const nextYearLabel = `${currentEndYear}-${currentEndYear + 1}`;
  const cycle = await this.findOne({
    userId,
    yearLabel: nextYearLabel,
    status: 'active'
  });
  return !!cycle;
};

/**
 * Obtener el ciclo más reciente
 */
SolarCycleSchema.statics.getLatestCycle = function(userId: string) {
  return this.findOne({
    userId,
    status: 'active'
  })
  .sort({ cycleStart: -1 });
};

/**
 * Marcar ciclos antiguos como completados
 */
SolarCycleSchema.statics.markOldCyclesAsCompleted = async function(userId: string) {
  const now = new Date();

  // Marcar como completados los ciclos cuya fecha de fin ya pasó hace más de 1 año
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  await this.updateMany(
    {
      userId,
      cycleEnd: { $lt: oneYearAgo },
      status: 'active'
    },
    {
      $set: { status: 'completed' }
    }
  );
};

// ✅ MÉTODOS DE INSTANCIA

/**
 * Verificar si el ciclo es el actual (basado en fecha de hoy)
 */
SolarCycleSchema.methods.isCurrent = function() {
  const now = new Date();
  return now >= this.cycleStart && now < this.cycleEnd;
};

/**
 * Verificar si el ciclo es futuro
 */
SolarCycleSchema.methods.isFuture = function() {
  const now = new Date();
  return now < this.cycleStart;
};

// ✅ EXTENDER INTERFACE DEL MODELO con statics
interface ISolarCycleModel extends Model<ISolarCycle> {
  getActiveCycles(userId: string): Promise<ISolarCycle[]>;
  findByYear(userId: string, yearLabel: string): Promise<ISolarCycle | null>;
  hasNextCycle(userId: string, currentEndYear: number): Promise<boolean>;
  getLatestCycle(userId: string): Promise<ISolarCycle | null>;
  markOldCyclesAsCompleted(userId: string): Promise<void>;
}

const SolarCycle: ISolarCycleModel =
  (models.SolarCycle as ISolarCycleModel) ||
  model<ISolarCycle, ISolarCycleModel>('SolarCycle', SolarCycleSchema);

export default SolarCycle;

// ✅ TIPOS ADICIONALES

export interface SolarCycleInput {
  userId: string;
  cycleStart: Date;
  cycleEnd: Date;
  yearLabel: string;
  events: AstrologicalEvent[];
  solarReturnData?: any;
}

export interface SolarCycleQuery {
  userId: string;
  yearLabel?: string;
  status?: 'active' | 'completed';
}

// ✅ HELPER FUNCTIONS

export const SolarCycleHelpers = {
  /**
   * Crear yearLabel desde fechas
   */
  createYearLabel: (startDate: Date, endDate: Date): string => {
    return `${startDate.getFullYear()}-${endDate.getFullYear()}`;
  },

  /**
   * Validar que no se salte más de 1 año
   */
  canGenerateNextCycle: (latestEndYear: number, targetStartYear: number): boolean => {
    const currentYear = new Date().getFullYear();

    // Solo permitir generar el año siguiente al último generado
    return targetStartYear === latestEndYear && targetStartYear <= currentYear + 1;
  },

  /**
   * Formatear ciclo para display
   */
  formatForDisplay: (cycle: ISolarCycle) => {
    return {
      id: cycle._id.toString(),
      yearLabel: cycle.yearLabel,
      start: cycle.cycleStart.toISOString().split('T')[0],
      end: cycle.cycleEnd.toISOString().split('T')[0],
      eventCount: cycle.events.length,
      status: cycle.status,
      isCurrent: (cycle as any).isCurrent(),
      isFuture: (cycle as any).isFuture()
    };
  }
};
