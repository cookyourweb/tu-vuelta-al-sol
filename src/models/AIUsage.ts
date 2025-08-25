// src/models/AIUsage.ts
// Modelo para tracking de uso de IA y optimización de costos

import mongoose from 'mongoose';

const AIUsageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Control de llamadas anuales
  annualAICalls: {
    year: { type: Number, required: true },
    callsUsed: { type: Number, default: 0 },
    maxCallsAllowed: { type: Number, default: 1 },
    lastCallDate: Date,
    resetDate: Date
  },

  // Histórico de uso
  callHistory: [{
    date: { type: Date, default: Date.now },
    eventCount: Number,
    costEstimated: Number,
    callType: {
      type: String,
      enum: ['ANNUAL_PREMIUM', 'EMERGENCY', 'UPGRADE'],
      default: 'ANNUAL_PREMIUM'
    },
    tokensUsed: Number,
    model: String
  }],

  // Métricas de optimización
  optimization: {
    totalEventsSinceLastAI: { type: Number, default: 0 },
    localInterpretationsGenerated: { type: Number, default: 0 },
    costSaved: { type: Number, default: 0 },
    satisfactionRating: Number // 1-5 rating de interpretaciones locales
  },

  // Estado del perfil base
  baseProfile: {
    lastGenerated: Date,
    expirationDate: Date,
    natalDataHash: String, // Para detectar cambios en carta natal
    isValid: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Índices para optimización
AIUsageSchema.index({ userId: 1, 'annualAICalls.year': 1 });
AIUsageSchema.index({ 'baseProfile.expirationDate': 1 });

// Métodos del modelo
AIUsageSchema.methods.canUseAI = function(currentYear: number = new Date().getFullYear()) {
  if (!this.annualAICalls || this.annualAICalls.year !== currentYear) {
    return true; // Nuevo año, resetear
  }
  return this.annualAICalls.callsUsed < this.annualAICalls.maxCallsAllowed;
};

AIUsageSchema.methods.recordAICall = function(eventCount: number, cost: number, tokens: number) {
  const currentYear = new Date().getFullYear();
  
  if (!this.annualAICalls || this.annualAICalls.year !== currentYear) {
    this.annualAICalls = {
      year: currentYear,
      callsUsed: 0,
      maxCallsAllowed: 1,
      resetDate: new Date(currentYear + 1, 0, 1) // 1 enero del próximo año
    };
  }
  
  this.annualAICalls.callsUsed += 1;
  this.annualAICalls.lastCallDate = new Date();
  
  this.callHistory.push({
    eventCount,
    costEstimated: cost,
    tokensUsed: tokens,
    model: 'gpt-4o-mini'
  });
  
  return this.save();
};

export const AIUsage = mongoose.models.AIUsage || mongoose.model('AIUsage', AIUsageSchema);