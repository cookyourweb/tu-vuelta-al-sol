// 🔧 CORRECCIÓN 5: Actualizar User model (si necesario)
// src/models/User.ts

import { Schema, Document, models, model, Types } from 'mongoose';

// ✅ TIPO INLINE con _id
interface IUserWithId extends Document {
  _id: Types.ObjectId;
  uid: string;
  email: string;
  fullName: string;
  createdAt: Date;
  lastLogin: Date;
  role: 'user' | 'admin';
  isVerified: boolean;
  subscriptionStatus: 'free' | 'premium' | 'none';
}

export interface IUser extends Document {
  uid: string;
  email: string;
  fullName: string;
  createdAt: Date;
  lastLogin: Date;
  role: 'user' | 'admin';
  isVerified: boolean;
  subscriptionStatus: 'free' | 'premium' | 'none';
}

const UserSchema: Schema = new Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  subscriptionStatus: { type: String, enum: ['free', 'premium', 'none'], default: 'free' }
});

// ✅ HELPER INLINE para User
export function castUser(raw: any): IUserWithId | null {
  if (!raw) return null;
  
  if (raw._id || raw.id) {
    return {
      ...raw,
      _id: raw._id || raw.id
    } as IUserWithId;
  }
  
  return null;
}

export default models.User || model<IUser>('User', UserSchema);
