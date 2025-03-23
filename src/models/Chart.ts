// src/models/Chart.ts

import { model, models, Schema } from "mongoose";


export interface IChart extends Document {
  userId: string;
  birthDataId: string;
  natalChart: object;  // JSON con la carta natal
  progressedCharts: {  // Array de cartas progresadas con fechas
    date: Date;
    chart: object;
  }[];
  createdAt: Date;
  lastUpdated: Date;
}

const ChartSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  birthDataId: { type: String, required: true },
  natalChart: { type: Object, required: true },
  progressedCharts: [{
    date: { type: Date, required: true },
    chart: { type: Object, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

export default models.Chart || model<IChart>('Chart', ChartSchema);