// src/lib/openai.ts
// Lazy-loaded OpenAI client to avoid build-time initialization errors

import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set. Please configure it in your environment.');
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });

    console.log('✅ OpenAI client initialized');
  }

  return openaiClient;
}

// For backward compatibility - but this will only error at runtime, not build time
export default getOpenAIClient;
