// src/models/PlanetaryCard.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPlanetaryCard extends Document {
  userId: string;
  planeta: string;
  simbolo: string;
  quien_eres_natal: {
    titulo?: string;
    posicion_completa: string;
    caracteristicas: string[];
    superpoder_natal: string;
    diferenciador_clave?: string;
  };
  que_se_activa_este_anio: {
    titulo?: string;
    periodo: string;
    posicion_completa: string;
    duracion_texto: string;
    introduccion: string;
    este_anio: string[];
    integracion_signo_casa?: string;
    contraste_con_natal?: string;
  };
  cruce_real: {
    titulo?: string;
    tu_naturaleza?: string;
    este_anio_pide?: string;
    el_conflicto?: string;
    la_clave?: string;
    natal_especifico?: string;
    sr_especifico?: string;
    contraste_directo?: string;
    aprendizaje_del_anio?: string;
    frase_potente_cierre?: string;
  };
  reglas_del_anio: {
    titulo?: string;
    reglas: string[];
    entrenamiento_anual: string;
  };
  como_se_activa_segun_momento: {
    titulo?: string;
    introduccion?: string;
    en_lunas_nuevas: string;
    en_lunas_llenas: string;
    durante_retrogradaciones: string;
    durante_eclipses: string;
  };
  sombras_a_vigilar: {
    titulo?: string;
    sombras: string[];
    equilibrio: string;
  };
  ritmo_de_trabajo: {
    titulo?: string;
    frecuencia: string;
    ejercicio_mensual: string;
    preguntas_mensuales: string[];
    claves_practicas_diarias?: string[];
    ritmos_semanales?: string;
  };
  apoyo_fisico: {
    titulo?: string;
    nota?: string;
    items: Array<{
      tipo: string;
      elemento: string;
      proposito: string;
    }>;
  };
  frase_ancla_del_anio: string;
  solarReturnYear: number; // Año del retorno solar (ej: 2025-2026)
  generatedAt: Date;
  expiresAt: Date; // Expira cuando pase el año solar
  createdAt: Date;
  updatedAt: Date;
}

const PlanetaryCardSchema = new Schema<IPlanetaryCard>({
  userId: { type: String, required: true, index: true },
  planeta: { type: String, required: true },
  simbolo: { type: String, required: true },
  quien_eres_natal: {
    titulo: String,
    posicion_completa: { type: String, required: true },
    caracteristicas: [String],
    superpoder_natal: { type: String, required: true },
    diferenciador_clave: String
  },
  que_se_activa_este_anio: {
    titulo: String,
    periodo: { type: String, required: true },
    posicion_completa: { type: String, required: true },
    duracion_texto: { type: String, required: true },
    introduccion: { type: String, required: true },
    este_anio: [String],
    integracion_signo_casa: String,
    contraste_con_natal: String
  },
  cruce_real: {
    titulo: String,
    tu_naturaleza: String,
    este_anio_pide: String,
    el_conflicto: String,
    la_clave: String,
    natal_especifico: String,
    sr_especifico: String,
    contraste_directo: String,
    aprendizaje_del_anio: String,
    frase_potente_cierre: String
  },
  reglas_del_anio: {
    titulo: String,
    reglas: [String],
    entrenamiento_anual: { type: String, required: true }
  },
  como_se_activa_segun_momento: {
    titulo: String,
    introduccion: String,
    en_lunas_nuevas: { type: String, required: true },
    en_lunas_llenas: { type: String, required: true },
    durante_retrogradaciones: { type: String, required: true },
    durante_eclipses: { type: String, required: true }
  },
  sombras_a_vigilar: {
    titulo: String,
    sombras: [String],
    equilibrio: { type: String, required: true }
  },
  ritmo_de_trabajo: {
    titulo: String,
    frecuencia: { type: String, required: true },
    ejercicio_mensual: { type: String, required: true },
    preguntas_mensuales: [String],
    claves_practicas_diarias: [String],
    ritmos_semanales: String
  },
  apoyo_fisico: {
    titulo: String,
    nota: String,
    items: [{
      tipo: { type: String, required: true },
      elemento: { type: String, required: true },
      proposito: { type: String, required: true }
    }]
  },
  frase_ancla_del_anio: { type: String, required: true },
  solarReturnYear: { type: Number, required: true, index: true },
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true }
}, {
  timestamps: true
});

// Índice compuesto para buscar fichas del usuario por año
PlanetaryCardSchema.index({ userId: 1, solarReturnYear: 1 });

// TTL Index: Eliminar documentos automáticamente cuando expiren
PlanetaryCardSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PlanetaryCard || mongoose.model<IPlanetaryCard>('PlanetaryCard', PlanetaryCardSchema);
