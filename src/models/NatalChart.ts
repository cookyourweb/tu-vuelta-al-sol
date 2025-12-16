// =============================================================================
// 🔧 NatalChart model - Alias for Chart model with natal-specific methods
// src/models/NatalChart.ts

import Chart, { IChart, ChartInput, ChartHelpers } from './Chart';

// ✅ Re-export the Chart model as NatalChart for backward compatibility
const NatalChart = Chart;

// ✅ Export interface
export interface INatalChart extends IChart {}

// ✅ Export helpers with natal-specific functions
export const NatalChartHelpers = {
  ...ChartHelpers,

  createNatalChart: (input: ChartInput) => {
    return ChartHelpers.createNatalChart(input);
  },

  validateNatalChartData: (data: any) => {
    return ChartHelpers.validateChartData(data);
  },

  findByUserId: function(userId: string) {
    return Chart.findOne({
      $or: [
        { userId: userId },
        { uid: userId }
      ],
      chartType: 'natal'
    });
  },

  findNatalChart: function(userId: string) {
    return Chart.findOne({
      $or: [
        { userId: userId },
        { uid: userId }
      ],
      chartType: 'natal'
    });
  }
};

export default NatalChart;
