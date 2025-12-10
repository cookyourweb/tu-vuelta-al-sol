import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai';

interface ChunkRequest {
  userId: string;
  chartData: any;
  section: string;
  userProfile: {
    name: string;
    age: number;
    birthPlace: string;
    birthDate: string;
    birthTime: string;
  };
  type: 'natal' | 'progressed' | 'solar-return';
  natalChart?: any;
}

function getSectionPrompt(section: string, request: ChunkRequest): string {
  const { chartData, userProfile, type, natalChart } = request;

  const baseContext = `
Usuario: ${userProfile.name} (${userProfile.age} años)
Fecha nacimiento: ${userProfile.birthDate}
Lugar nacimiento: ${userProfile.birthPlace}
Hora nacimiento: ${userProfile.birthTime}

Datos astrológicos:
${JSON.stringify(chartData, null, 2)}
`;

  const sectionPrompts: Record<string, string> = {
    esencia_revolucionaria: `
${baseContext}

Genera ÚNICAMENTE la "Esencia Revolucionaria" del usuario. Esta debe ser una declaración poderosa de 2-3 frases que capture la esencia única y revolucionaria de su ser astrológico.

Ejemplo: "Eres un Visionario Cósmico con un Sol en Acuario y una Luna en Sagitario, destinado a revolucionar sistemas obsoletos con tu mente innovadora y tu corazón aventurero."

IMPORTANTE: Responde ÚNICAMENTE con el texto de la esencia revolucionaria, sin formato JSON ni etiquetas adicionales.`,

    proposito_vida: `
${baseContext}

Genera ÚNICAMENTE el "Propósito de Vida" del usuario. Esta debe ser una declaración clara de 2-3 frases sobre su propósito fundamental en esta vida.

Ejemplo: "Tu propósito es catalizar transformación colectiva a través de la innovación tecnológica, guiando a otros hacia un futuro más consciente y conectado."

IMPORTANTE: Responde ÚNICAMENTE con el texto del propósito de vida, sin formato JSON ni etiquetas adicionales.`,

    formacion_temprana: `
${baseContext}

Genera ÚNICAMENTE la sección "Formación Temprana" que incluye análisis de las casas Lunar, Saturnina y Venusina. Debe ser un objeto JSON con esta estructura exacta:

{
  "casa_lunar": {
    "signo_casa": "Signo de la Luna",
    "interpretacion": "Análisis detallado de la infancia y raíces emocionales",
    "influencia": "Cómo influye en la vida adulta"
  },
  "casa_saturnina": {
    "signo_casa": "Signo de Saturno",
    "interpretacion": "Análisis de lecciones y disciplina aprendidas",
    "leccion": "Lección principal de vida"
  },
  "casa_venusina": {
    "signo_casa": "Signo de Venus",
    "interpretacion": "Análisis de valores y relaciones aprendidas",
    "valores": "Sistema de valores fundamental"
  }
}

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`,

    nodos_lunares: `
${baseContext}

Genera ÚNICAMENTE la sección "Nodos Lunares" que incluye análisis del Nodo Norte y Nodo Sur. Debe ser un objeto JSON con esta estructura exacta:

{
  "nodo_norte": {
    "signo_casa": "Signo y casa del Nodo Norte",
    "direccion_evolutiva": "Dirección de crecimiento espiritual",
    "desafio": "Desafío principal a superar"
  },
  "nodo_sur": {
    "signo_casa": "Signo y casa del Nodo Sur",
    "zona_comfort": "Patrones cómodos pero limitantes",
    "patron_repetitivo": "Patrón que se repite y debe ser trascendido"
  }
}

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`,

    declaracion_poder: `
${baseContext}

Genera ÚNICAMENTE la "Declaración de Poder Personal". Esta debe ser una afirmación poderosa de 1-2 frases que el usuario puede usar como mantra personal.

Ejemplo: "Yo, [Nombre], declaro mi poder como puente entre lo humano y lo divino, transformando consciencia colectiva con cada acción que tomo."

IMPORTANTE: Responde ÚNICAMENTE con el texto de la declaración de poder, sin formato JSON ni etiquetas adicionales.`,

    patrones_psicologicos: `
${baseContext}

Genera ÚNICAMENTE la sección "Patrones Psicológicos Profundos" que incluye análisis de los planetas Urano, Neptuno y Plutón. Debe ser un array de objetos JSON con esta estructura:

[
  {
    "planeta": "Urano",
    "infancia_emocional": "Cómo se manifestó en la infancia",
    "patron_formado": "Patrón psicológico formado",
    "impacto_adulto": "Cómo impacta en la vida adulta"
  },
  {
    "planeta": "Neptuno",
    "infancia_emocional": "Cómo se manifestó en la infancia",
    "patron_formado": "Patrón psicológico formado",
    "impacto_adulto": "Cómo impacta en la vida adulta"
  },
  {
    "planeta": "Plutón",
    "infancia_emocional": "Cómo se manifestó en la infancia",
    "patron_formado": "Patrón psicológico formado",
    "impacto_adulto": "Cómo impacta en la vida adulta"
  }
]

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`,

    planetas_profundos: `
${baseContext}

Genera ÚNICAMENTE la sección "Planetas Profundos" con análisis individual de Urano, Neptuno y Plutón. Debe ser un objeto JSON con esta estructura exacta:

{
  "urano": "Análisis detallado de Urano en la carta",
  "neptuno": "Análisis detallado de Neptuno en la carta",
  "pluton": "Análisis detallado de Plutón en la carta"
}

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`
  };

  return sectionPrompts[section] || '';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChunkRequest = await request.json();
    const { userId, chartData, section, userProfile, type, natalChart } = body;

    console.log(`🔄 ===== GENERANDO CHUNK: ${section} =====`);
    console.log(`👤 Usuario: ${userProfile.name}`);
    console.log(`📊 Tipo: ${type}`);

    const startTime = Date.now();

    // Get the specific prompt for this section
    const prompt = getSectionPrompt(section, body);

    if (!prompt) {
      return NextResponse.json({
        success: false,
        error: `Sección no reconocida: ${section}`
      }, { status: 400 });
    }

    // Generate with OpenAI - use faster model and limited tokens
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Faster than GPT-4
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo experto y terapeuta astrológico. Genera interpretaciones profundas, precisas y transformadoras. Responde ÚNICAMENTE con el contenido solicitado, sin introducciones ni explicaciones adicionales."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: section.includes('formacion_temprana') || section.includes('nodos_lunares') || section.includes('patrones_psicologicos') ? 800 : 400, // More tokens for complex sections
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Chunk ${section} generado en ${duration}ms`);

    let data;
    const content = completion.choices[0].message.content?.trim();

    if (!content) {
      return NextResponse.json({
        success: false,
        error: 'No se recibió contenido de OpenAI'
      }, { status: 500 });
    }

    // Parse JSON sections
    if (['formacion_temprana', 'nodos_lunares', 'patrones_psicologicos', 'planetas_profundos'].includes(section)) {
      try {
        // Clean the response if it has markdown code blocks
        let cleanContent = content;
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/```json\s*/, '').replace(/```\s*$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/```\s*/, '').replace(/```\s*$/, '');
        }

        data = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error(`❌ Error parseando JSON para ${section}:`, parseError);
        console.error('Contenido recibido:', content);
        return NextResponse.json({
          success: false,
          error: `Error parseando respuesta JSON para ${section}`,
          rawContent: content
        }, { status: 500 });
      }
    } else {
      // Text sections
      data = content;
    }

    return NextResponse.json({
      success: true,
      section,
      data,
      duration,
      model: 'gpt-3.5-turbo'
    });

  } catch (error) {
    console.error('❌ Error en interpret-chunk:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
