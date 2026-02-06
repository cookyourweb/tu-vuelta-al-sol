// =============================================================================
// 🤖 AI MODELS CONFIGURATION - COST OPTIMIZATION
// src/config/aiModels.ts
// =============================================================================
// Centralized configuration for AI model selection to optimize costs.
//
// Cost comparison (per 1M tokens as of 2025):
// - gpt-4o: $5 input / $15 output
// - gpt-4o-mini: $0.15 input / $0.60 output (30x cheaper!)
// - gpt-4-turbo: $10 input / $30 output
// - gpt-3.5-turbo: $0.50 input / $1.50 output
//
// Strategy:
// - Use gpt-4o for complex, high-value interpretations (natal, solar return)
// - Use gpt-4o-mini for repetitive, simpler tasks (events, chunks)
// =============================================================================

export type AITask =
  | 'natal_interpretation_main'      // Core natal chart interpretation
  | 'natal_interpretation_chunk'     // Individual planet/aspect chunks
  | 'solar_return_interpretation'    // Annual solar return analysis
  | 'event_interpretation'           // Individual event interpretations
  | 'event_batch'                    // Batch event processing
  | 'synthesis_annual'               // Year synthesis
  | 'planetary_cards'                // Planet card generation
  | 'week_model'                     // Weekly model generation
  | 'aspect_interpretation'          // Individual aspects
  | 'general';                       // Default fallback

export interface ModelConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  description: string;
}

// =============================================================================
// MODEL CONFIGURATIONS BY TASK
// =============================================================================

const MODEL_CONFIGS: Record<AITask, ModelConfig> = {
  // HIGH VALUE TASKS - Use gpt-4o for best quality
  natal_interpretation_main: {
    model: 'gpt-4o',
    maxTokens: 4000,
    temperature: 0.7,
    description: 'Main natal chart interpretation - high value, one-time per user'
  },

  solar_return_interpretation: {
    model: 'gpt-4o',
    maxTokens: 4000,
    temperature: 0.7,
    description: 'Annual solar return - high value, once per year'
  },

  // MEDIUM VALUE TASKS - Use gpt-4o-mini for cost efficiency
  synthesis_annual: {
    model: 'gpt-4o-mini',
    maxTokens: 2000,
    temperature: 0.6,
    description: 'Year synthesis - combines existing data'
  },

  planetary_cards: {
    model: 'gpt-4o-mini',
    maxTokens: 800,
    temperature: 0.65,
    description: 'Planet cards - shorter, templated content'
  },

  // REPETITIVE TASKS - Use gpt-4o-mini (biggest savings!)
  event_interpretation: {
    model: 'gpt-4o-mini',
    maxTokens: 800,
    temperature: 0.6,
    description: 'Individual events - many per year, templated structure'
  },

  event_batch: {
    model: 'gpt-4o-mini',
    maxTokens: 1500,
    temperature: 0.5,
    description: 'Batch events - high volume processing'
  },

  natal_interpretation_chunk: {
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.6,
    description: 'Individual planet/aspect chunks'
  },

  week_model: {
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.6,
    description: 'Weekly model - repetitive, similar structure'
  },

  aspect_interpretation: {
    model: 'gpt-4o-mini',
    maxTokens: 600,
    temperature: 0.6,
    description: 'Individual aspects - many similar requests'
  },

  // FALLBACK
  general: {
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7,
    description: 'General fallback - cost optimized'
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the model configuration for a specific task
 */
export function getModelConfig(task: AITask): ModelConfig {
  return MODEL_CONFIGS[task] || MODEL_CONFIGS.general;
}

/**
 * Get just the model name for a task
 */
export function getModel(task: AITask): string {
  return getModelConfig(task).model;
}

/**
 * Get model parameters for OpenAI API call
 */
export function getModelParams(task: AITask): {
  model: string;
  max_tokens: number;
  temperature: number;
} {
  const config = getModelConfig(task);
  return {
    model: config.model,
    max_tokens: config.maxTokens,
    temperature: config.temperature
  };
}

/**
 * Estimate cost for a task (rough approximation)
 * Returns cost in USD cents
 */
export function estimateTaskCost(task: AITask, inputTokens: number, outputTokens: number): number {
  const config = getModelConfig(task);

  // Cost per 1K tokens (in cents)
  const costs: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.5, output: 1.5 },           // $5/15 per 1M = 0.5/1.5 cents per 1K
    'gpt-4o-mini': { input: 0.015, output: 0.06 },   // $0.15/0.60 per 1M
    'gpt-4-turbo': { input: 1.0, output: 3.0 },      // $10/30 per 1M
    'gpt-4-turbo-preview': { input: 1.0, output: 3.0 },
    'gpt-3.5-turbo': { input: 0.05, output: 0.15 }   // $0.50/1.50 per 1M
  };

  const modelCosts = costs[config.model] || costs['gpt-4o-mini'];

  return (inputTokens / 1000) * modelCosts.input + (outputTokens / 1000) * modelCosts.output;
}

/**
 * Log model usage for tracking
 */
export function logModelUsage(task: AITask, inputTokens: number, outputTokens: number): void {
  const config = getModelConfig(task);
  const cost = estimateTaskCost(task, inputTokens, outputTokens);

  console.log(`📊 AI Usage | Task: ${task} | Model: ${config.model} | Tokens: ${inputTokens}/${outputTokens} | Est. Cost: $${(cost/100).toFixed(4)}`);
}

// =============================================================================
// COST SAVINGS SUMMARY
// =============================================================================
// By switching from gpt-4o to gpt-4o-mini for repetitive tasks:
//
// Task                        | Before (gpt-4o) | After (gpt-4o-mini) | Savings
// ---------------------------|-----------------|---------------------|--------
// event_interpretation       | ~$0.02/event    | ~$0.0007/event      | 96%
// natal_interpretation_chunk | ~$0.01/chunk    | ~$0.0003/chunk      | 97%
// week_model                 | ~$0.01/week     | ~$0.0003/week       | 97%
// planetary_cards            | ~$0.01/card     | ~$0.0003/card       | 97%
//
// For a user with ~50 events/year + 12 weeks + 10 planet cards:
// Before: ~$1.50 per user
// After:  ~$0.10 per user (+ ~$0.50 for main natal/SR = ~$0.60 total)
//
// ESTIMATED SAVINGS: 60% overall
// =============================================================================

export default {
  getModelConfig,
  getModel,
  getModelParams,
  estimateTaskCost,
  logModelUsage,
  MODEL_CONFIGS
};
