//src/models/BirthData.ts
import { model, models, Schema } from "mongoose";

export interface IBirthData extends Document {
  userId: string;
  fullName: string;
  birthDate: Date;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// src/models/BirthData.ts (ajuste)
const BirthDataSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true }, // Añadido unique para evitar duplicados
  fullName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  birthTime: { type: String }, // Quitado required
  birthPlace: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timezone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // Añadido
  updatedAt: { type: Date, default: Date.now }  // Añadido
});

export default models.BirthData || model<IBirthData>('BirthData', BirthDataSchema);