// models/Subscription.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialEnd?: Date;
  lastPaymentDate?: Date;
  lastPaymentError?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid'],
      default: 'incomplete',
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: {
      type: Date,
      default: null,
    },
    trialEnd: {
      type: Date,
      default: null,
    },
    lastPaymentDate: {
      type: Date,
      default: null,
    },
    lastPaymentError: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Índices compuestos para consultas frecuentes
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ stripeCustomerId: 1, status: 1 });

// Método para verificar si la suscripción está activa
SubscriptionSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && new Date() < this.currentPeriodEnd;
};

// Método para verificar si está en período de prueba
SubscriptionSchema.methods.isTrialing = function(): boolean {
  return this.status === 'trialing' && this.trialEnd && new Date() < this.trialEnd;
};

// Método estático para obtener suscripción activa de un usuario
SubscriptionSchema.statics.findActiveByUserId = async function(userId: string) {
  return this.findOne({
    userId,
    status: { $in: ['active', 'trialing'] },
    currentPeriodEnd: { $gt: new Date() },
  });
};

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;