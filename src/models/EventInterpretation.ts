// src/models/EventInterpretation.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// ✅ INTERFAZ TYPESCRIPT PARA EVENTO
export interface IEventInterpretation extends Document {
  userId: string;
  eventId: string; // Format: "luna_nueva_2025-05-15_tauro" o "transito_jupiter_venus_2025-06-20"
  eventType: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
  eventDate: Date;
  eventDetails: {
    sign?: string; // Signo donde ocurre (para lunas)
    house?: number; // Casa natal donde cae (1-12)
    planetsInvolved?: string[]; // Para aspectos/tránsitos
    transitingPlanet?: string; // Para tránsitos
    natalPlanet?: string; // Para tránsitos
    aspectType?: string; // conjunción, oposición, etc.
  };
  interpretation: {
    titulo_evento: string;
    para_ti_especificamente: string;
    tu_fortaleza_a_usar: {
      fortaleza: string;
      como_usarla: string;
    };
    tu_bloqueo_a_trabajar: {
      bloqueo: string;
      reframe: string;
    };
    mantra_personalizado: string;
    ejercicio_para_ti: string;
    consejo_especifico: string;
    timing_evolutivo: {
      que_sembrar: string;
      cuando_actuar: string;
      resultado_esperado: string;
    };
    analisis_tecnico?: {
      evento_en_casa_natal: number;
      significado_casa: string;
      planetas_natales_activados: string[];
      aspectos_cruzados: string[];
    };
  };
  generatedAt: Date;
  expiresAt: Date;
  method: string;
  cached: boolean;
  lastModified?: Date;
  createdAt?: Date; // Added by Mongoose timestamps
  updatedAt?: Date; // Added by Mongoose timestamps

  // ✅ Instance methods
  isExpired(): boolean;
  getEventTypeName(): string;
}

// ✅ SCHEMA MONGOOSE
const EventInterpretationSchema = new Schema<IEventInterpretation>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },

    eventId: {
      type: String,
      required: true,
      index: true,
      // Examples:
      // - "luna_nueva_2025-05-15_tauro"
      // - "luna_llena_2025-06-01_sagitario"
      // - "transito_jupiter_venus_2025-06-20"
      // - "aspecto_saturno_sol_cuadratura_2025-07-10"
    },

    eventType: {
      type: String,
      enum: ['luna_nueva', 'luna_llena', 'transito', 'aspecto'],
      required: true
    },

    eventDate: {
      type: Date,
      required: true,
      index: true
    },

    eventDetails: {
      sign: { type: String }, // Ej: "Tauro", "Géminis"
      house: { type: Number, min: 1, max: 12 }, // Casa natal 1-12
      planetsInvolved: [{ type: String }], // Ej: ["Sol", "Luna"]
      transitingPlanet: { type: String }, // Ej: "Júpiter"
      natalPlanet: { type: String }, // Ej: "Venus"
      aspectType: { type: String } // Ej: "conjunción", "oposición"
    },

    interpretation: {
      type: Object,
      required: true
      // Structure defined in TypeScript interface above
    },

    generatedAt: {
      type: Date,
      default: Date.now
    },

    expiresAt: {
      type: Date,
      required: true
      // Típicamente: generatedAt + 7 días
    },

    method: {
      type: String,
      default: 'openai',
      enum: ['openai', 'anthropic', 'cached']
    },

    cached: {
      type: Boolean,
      default: false
    },

    lastModified: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// ✅ ÍNDICES COMPUESTOS para búsquedas rápidas
EventInterpretationSchema.index(
  { userId: 1, eventId: 1 },
  { unique: true } // Un usuario solo puede tener UNA interpretación por evento
);

EventInterpretationSchema.index(
  { userId: 1, eventDate: -1 },
  { background: true } // Para buscar eventos por usuario ordenados por fecha
);

// ✅ AUTO-ELIMINAR documentos expirados (TTL Index)
EventInterpretationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 } // MongoDB eliminará docs automáticamente cuando expiresAt < now
);

// ✅ STATICS: Métodos del modelo

EventInterpretationSchema.statics.findByUserAndEvent = function(
  userId: string,
  eventId: string
): Promise<IEventInterpretation | null> {
  return this.findOne({
    userId,
    eventId,
    expiresAt: { $gt: new Date() } // Solo devolver si no ha expirado
  }).exec();
};

EventInterpretationSchema.statics.findByUserAndDateRange = function(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<IEventInterpretation[]> {
  return this.find({
    userId,
    eventDate: {
      $gte: startDate,
      $lte: endDate
    },
    expiresAt: { $gt: new Date() }
  })
  .sort({ eventDate: 1 })
  .exec();
};

EventInterpretationSchema.statics.findUpcomingEvents = function(
  userId: string,
  daysAhead: number = 30
): Promise<IEventInterpretation[]> {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysAhead);

  return this.find({
    userId,
    eventDate: {
      $gte: now,
      $lte: futureDate
    },
    expiresAt: { $gt: new Date() }
  })
  .sort({ eventDate: 1 })
  .exec();
};

EventInterpretationSchema.statics.deleteExpiredForUser = function(
  userId: string
): Promise<any> {
  return this.deleteMany({
    userId,
    expiresAt: { $lt: new Date() }
  }).exec();
};

// ✅ METHODS: Métodos de instancia

EventInterpretationSchema.methods.isExpired = function(): boolean {
  return this.expiresAt < new Date();
};

EventInterpretationSchema.methods.getEventTypeName = function(): string {
  const names: Record<string, string> = {
    'luna_nueva': 'Luna Nueva',
    'luna_llena': 'Luna Llena',
    'transito': 'Tránsito',
    'aspecto': 'Aspecto'
  };
  return names[this.eventType] || this.eventType;
};

// ✅ MIDDLEWARE: Pre-save hook
EventInterpretationSchema.pre('save', function(next) {
  this.lastModified = new Date();

  // Si no tiene expiresAt, calcularlo (7 días desde generatedAt)
  if (!this.expiresAt) {
    const expiration = new Date(this.generatedAt);
    expiration.setDate(expiration.getDate() + 7);
    this.expiresAt = expiration;
  }

  next();
});

// ✅ EXTENDER INTERFACE DEL MODELO con statics
interface IEventInterpretationModel extends Model<IEventInterpretation> {
  findByUserAndEvent(userId: string, eventId: string): Promise<IEventInterpretation | null>;
  findByUserAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<IEventInterpretation[]>;
  findUpcomingEvents(userId: string, daysAhead?: number): Promise<IEventInterpretation[]>;
  deleteExpiredForUser(userId: string): Promise<any>;
}

// ✅ EXPORTAR MODELO
const EventInterpretation: IEventInterpretationModel =
  (mongoose.models.EventInterpretation as IEventInterpretationModel) ||
  mongoose.model<IEventInterpretation, IEventInterpretationModel>(
    'EventInterpretation',
    EventInterpretationSchema
  );

export default EventInterpretation;

// ✅ HELPER: Generar eventId único
export function generateEventId(event: {
  type: 'luna_nueva' | 'luna_llena' | 'transito' | 'aspecto';
  date: string; // YYYY-MM-DD
  sign?: string;
  transitingPlanet?: string;
  natalPlanet?: string;
  aspectType?: string;
}): string {
  if (event.type === 'luna_nueva' || event.type === 'luna_llena') {
    return `${event.type}_${event.date}_${event.sign?.toLowerCase()}`;
  }

  if (event.type === 'transito') {
    return `transito_${event.transitingPlanet?.toLowerCase()}_${event.natalPlanet?.toLowerCase()}_${event.date}`;
  }

  if (event.type === 'aspecto') {
    return `aspecto_${event.transitingPlanet?.toLowerCase()}_${event.natalPlanet?.toLowerCase()}_${event.aspectType?.toLowerCase()}_${event.date}`;
  }

  return `${event.type}_${event.date}`;
}

// ✅ HELPER: Calcular fecha de expiración (7 días)
export function calculateExpirationDate(generatedAt: Date = new Date()): Date {
  const expiration = new Date(generatedAt);
  expiration.setDate(expiration.getDate() + 7);
  return expiration;
}
