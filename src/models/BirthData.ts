
// =============================================================================
// 🔧 CORRECCIÓN CRÍTICA 1: BirthData model - Campos consistentes
// src/models/BirthData.ts

import { model, models, Schema, Document, Types } from "mongoose";

// ✅ MANTENER COMPATIBILIDAD CON DATOS EXISTENTES
export interface IBirthData extends Document {
  _id: Types.ObjectId;
  userId: string;          // ✅ Campo PRINCIPAL
  uid?: string;            // ✅ Compatibilidad adicional
  fullName: string;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;

  // ✅ CAMPOS PARA UBICACIÓN ACTUAL (Solar Return)
  livesInSamePlace?: boolean;
  currentPlace?: string;
  currentLatitude?: number;
  currentLongitude?: number;

  createdAt: Date;
  updatedAt: Date;
}

const BirthDataSchema = new Schema<IBirthData>({
  // ✅ userId como campo principal
  userId: {
    type: String,
    required: true,
    index: true
  },
  // ✅ uid para compatibilidad adicional
  uid: {
    type: String,
    index: true,
    sparse: true  // Permite null/undefined
  },
  fullName: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  birthTime: {
    type: String,
    required: true,
    default: "12:00"
  },
  birthPlace: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timezone: {
    type: String,
    default: "Europe/Madrid"
  },

  // ✅ CAMPOS PARA UBICACIÓN ACTUAL (Solar Return)
  livesInSamePlace: {
    type: Boolean,
    default: true
  },
  currentPlace: {
    type: String,
    required: false
  },
  currentLatitude: {
    type: Number,
    required: false
  },
  currentLongitude: {
    type: Number,
    required: false
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  collection: 'birthdatas'
});

// ✅ ÍNDICES para búsquedas eficientes
// BirthDataSchema.index({ userId: 1 }); // ❌ REMOVIDO - ya definido en el campo
// BirthDataSchema.index({ uid: 1 }, { sparse: true }); // ❌ REMOVIDO - ya definido en el campo
BirthDataSchema.index({ createdAt: 1 });

// ✅ HOOK PRE-SAVE: Sincronizar uid con userId si no existe
BirthDataSchema.pre('save', function() {
  if (this.userId && !this.uid) {
    this.uid = this.userId;
  } else if (this.uid && !this.userId) {
    this.userId = this.uid;
  }
});

// ✅ MÉTODOS ESTÁTICOS útiles
BirthDataSchema.statics.findByUserId = function(userId: string) {
  return this.findOne({ 
    $or: [
      { userId: userId },
      { uid: userId }
    ] 
  });
};

BirthDataSchema.statics.findAllByUserId = function(userId: string) {
  return this.find({ 
    $or: [
      { userId: userId },
      { uid: userId }
    ] 
  });
};

// AGREGAR ESTA FUNCIÓN AL FINAL DEL SCHEMA
BirthDataSchema.methods.getSolarReturnCoordinates = function() {
  return {
    birth: {
      latitude: this.latitude,
      longitude: this.longitude,
      place: this.birthPlace
    },
    current: this.livesInSamePlace ? {
      latitude: this.latitude,
      longitude: this.longitude,
      place: this.birthPlace
    } : {
      latitude: this.currentLatitude || this.latitude,
      longitude: this.currentLongitude || this.longitude,
      place: this.currentPlace || this.birthPlace
    }
  };
};

const BirthData = models.BirthData || model<IBirthData>('BirthData', BirthDataSchema);

// ✅ FUNCIÓN DE CASTING robusta
export function castBirthData(data: any): IBirthData | null {
  if (!data) {
    return null;
  }

  try {
    // ✅ NORMALIZAR datos antes del casting
    const normalizedData = {
      ...data,
      _id: data._id || new Types.ObjectId(),
      userId: data.userId || data.uid,
      uid: data.uid || data.userId,
      birthDate: data.birthDate instanceof Date
        ? data.birthDate
        : new Date(data.birthDate),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      birthTime: data.birthTime || "12:00",
      timezone: data.timezone || "Europe/Madrid",

      // ✅ CAMPOS DE UBICACIÓN ACTUAL
      livesInSamePlace: data.livesInSamePlace !== undefined ? Boolean(data.livesInSamePlace) : true,
      currentPlace: data.currentPlace || undefined,
      currentLatitude: data.currentLatitude ? Number(data.currentLatitude) : undefined,
      currentLongitude: data.currentLongitude ? Number(data.currentLongitude) : undefined,

      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    };

    // ✅ VALIDACIONES BÁSICAS
    if (!normalizedData.userId || !normalizedData.birthDate || 
        isNaN(normalizedData.latitude) || isNaN(normalizedData.longitude)) {
      console.warn('⚠️ [BirthData] Datos inválidos:', {
        userId: !!normalizedData.userId,
        birthDate: !!normalizedData.birthDate,
        latitude: !isNaN(normalizedData.latitude),
        longitude: !isNaN(normalizedData.longitude)
      });
      return null;
    }

    return normalizedData as IBirthData;
    
  } catch (error) {
    console.error('❌ [BirthData] Error en casting:', error);
    return null;
  }
}

// ✅ EXPORT DEFAULT con función de casting incluida
export default BirthData;

// ✅ TIPOS ADICIONALES para TypeScript
export interface BirthDataInput {
  userId: string;
  uid?: string;
  fullName: string;
  birthDate: string | Date;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone?: string;

  // ✅ CAMPOS PARA UBICACIÓN ACTUAL
  livesInSamePlace?: boolean;
  currentPlace?: string;
  currentLatitude?: number;
  currentLongitude?: number;
}

export interface BirthDataQuery {
  userId?: string;
  uid?: string;
  fullName?: string;
  birthPlace?: string;
}

// ✅ HELPER FUNCTIONS
export const BirthDataHelpers = {
  // Crear BirthData desde input del usuario
  createFromInput: (input: BirthDataInput): IBirthData => {
    return new BirthData({
      ...input,
      uid: input.userId,
      birthDate: input.birthDate instanceof Date ? input.birthDate : new Date(input.birthDate),
      timezone: input.timezone || 'Europe/Madrid'
    });
  },

  // Validar datos de entrada
  validateInput: (input: Partial<BirthDataInput>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!input.userId) errors.push('userId es requerido');
    if (!input.fullName) errors.push('fullName es requerido');
    if (!input.birthDate) errors.push('birthDate es requerido');
    if (!input.birthPlace) errors.push('birthPlace es requerido');
    if (input.latitude === undefined || isNaN(Number(input.latitude))) errors.push('latitude válida es requerida');
    if (input.longitude === undefined || isNaN(Number(input.longitude))) errors.push('longitude válida es requerida');

    return {
      valid: errors.length === 0,
      errors
    };
  },

  // Formatear para display
  formatForDisplay: (birthData: IBirthData) => {
    return {
      id: birthData._id.toString(),
      fullName: birthData.fullName,
      birthDate: birthData.birthDate.toISOString().split('T')[0],
      birthTime: birthData.birthTime,
      birthPlace: birthData.birthPlace,
      coordinates: `${birthData.latitude}, ${birthData.longitude}`,
      timezone: birthData.timezone
    };
  }
};