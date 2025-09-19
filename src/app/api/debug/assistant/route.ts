import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      organization: process.env.OPENAI_ORG_ID,
      project: process.env.OPENAI_PROJECT_ID,
    });

    console.log('Variables OpenAI:', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      assistantId: process.env.OPENAI_ASSISTANT_ID,
      projectId: process.env.OPENAI_PROJECT_ID,
      orgId: process.env.OPENAI_ORG_ID
    });

    // Test directo del Assistant
    const assistant = await openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID!);

    return NextResponse.json({
      success: true,
      assistant_name: assistant.name,
      assistant_model: assistant.model,
      variables_ok: true
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      variables: {
        hasApiKey: !!process.env.OPENAI_API_KEY,
        assistantId: process.env.OPENAI_ASSISTANT_ID,
        projectId: process.env.OPENAI_PROJECT_ID,
        orgId: process.env.OPENAI_ORG_ID
      }
    });
  }
}
