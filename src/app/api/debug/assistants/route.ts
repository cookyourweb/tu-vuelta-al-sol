// src/app/api/debug/assistants/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// ==========================================
// 🔧 CONFIGURACIÓN OPENAI CON ORGANIZACIÓN
// ==========================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,     // wunjo-rcyvpv
  project: process.env.OPENAI_PROJECT_ID,      // proj_MfpxlisuxKqjN7eIKrGHZqw4
});

// ==========================================
// 🎯 ENDPOINT GET (EXPORTACIÓN CORRECTA)
// ==========================================

export async function GET() {
  try {
    console.log('🔍 Diagnosticando acceso a Assistants...');
    
    // Verificar configuración
    const config = {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
      project: process.env.OPENAI_PROJECT_ID,
      assistantId: process.env.OPENAI_ASSISTANT_ID
    };
    
    console.log('📋 Configuración:', config);
    
    // 1. Listar assistants disponibles
    console.log('🔍 Listando assistants disponibles...');
    const assistants = await openai.beta.assistants.list({
      order: 'desc',
      limit: 10
    });
    
    console.log(`📋 Encontrados ${assistants.data.length} assistants`);
    
    // 2. Verificar el assistant específico
    const targetId = process.env.OPENAI_ASSISTANT_ID || 'asst_2RiAp8rkMTnCqipvIYyS4jpT';
    let specificAssistant = null;
    let assistantError = null;
    
    try {
      console.log(`🎯 Verificando assistant: ${targetId}`);
      specificAssistant = await openai.beta.assistants.retrieve(targetId);
      console.log('✅ Assistant específico encontrado:', specificAssistant.name);
    } catch (error) {
      console.log('❌ Assistant específico no encontrado');
      assistantError = error instanceof Error ? error.message : 'Error desconocido';
    }
    
    // 3. Preparar respuesta
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      config,
      stats: {
        totalAssistants: assistants.data.length,
        targetFound: !!specificAssistant
      },
      assistants: assistants.data.map(a => ({
        id: a.id,
        name: a.name || 'Sin nombre',
        model: a.model,
        isTarget: a.id === targetId,
        created: new Date(a.created_at * 1000).toISOString()
      })),
      targetAssistant: specificAssistant ? {
        found: true,
        id: specificAssistant.id,
        name: specificAssistant.name,
        model: specificAssistant.model,
        instructions: specificAssistant.instructions?.substring(0, 200) + '...'
      } : {
        found: false,
        error: assistantError,
        searchedId: targetId
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Error en diagnóstico completo:', error);
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Error desconocido',
      config: {
        hasApiKey: !!process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORG_ID,
        project: process.env.OPENAI_PROJECT_ID
      },
      details: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 5)
      } : 'Error no identificado'
    }, { 
      status: 500 
    });
  }
}