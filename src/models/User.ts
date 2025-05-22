//src/models/User.ts
import  { Schema, Document, models, model } from 'mongoose';

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

export default models.User || model<IUser>('User', UserSchema);