import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  nombre: string;
  email: string;
  telefono: string;
  experiencia?: string;
  interes?: string;
  source: string;
  status: 'nuevo' | 'contactado' | 'interesado' | 'cliente' | 'descartado';
  notas?: string;
  llamadaAgendada?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    telefono: {
      type: String,
      required: true,
      trim: true
    },
    experiencia: {
      type: String,
      enum: ['principiante', 'intermedio', 'avanzado', 'profesional', ''],
      default: ''
    },
    interes: {
      type: String,
      enum: ['interpretaciones', 'automatizacion', 'marca-blanca', 'todo', ''],
      default: ''
    },
    source: {
      type: String,
      required: true,
      default: 'formacion-astrologos'
    },
    status: {
      type: String,
      enum: ['nuevo', 'contactado', 'interesado', 'cliente', 'descartado'],
      default: 'nuevo'
    },
    notas: {
      type: String,
      default: ''
    },
    llamadaAgendada: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Índices para búsquedas eficientes
LeadSchema.index({ email: 1 });
LeadSchema.index({ telefono: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
