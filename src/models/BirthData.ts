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

const BirthDataSchema: Schema = new Schema({
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  birthTime: { type: String, required: true },
  birthPlace: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timezone: { type: String, required: true }
});

export default models.BirthData || model<IBirthData>('BirthData', BirthDataSchema);