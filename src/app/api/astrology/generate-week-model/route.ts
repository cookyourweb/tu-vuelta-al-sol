// src/app/api/astrology/generate-week-model/route.ts
// 📅 SEMANA MODELO PERSONALIZADA
// Genera una semana tipo basada en natal + solar return del usuario
// Sigue ciclo lunar y está adaptada a la configuración astrológica específica

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/db';
import Interpretation from '@/models/Interpretation';

// ⏱️ Configurar timeout para Vercel (60 segundos en plan Pro)
export const maxDuration = 60;

// ✅ Lazy initialization
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días (semana)

// ==========================================
// 📊 SEMANA MODELO INTERFACE
// ==========================================

interface DiaModelo {
  dia: string; // "Lunes", "Martes", etc.
  fase_lunar: string; // "Luna Nueva", "Luna Creciente", etc.
  tema: string;
  energia: string; // "Baja · Silenciosa · Introspectiva"
  enfoque_del_dia: string;
  pregunta_guia: string;
  practica_concreta: string[];
  microaccion: string;
  evitar?: string; // Opcional
  alerta_retrogrado?: string; // Opcional si hay retrógrados
}

interface SemanaModelo {
  titulo: string;
  intencion_semanal: string;
  dias: DiaModelo[];
  seccion_fija: {
    retrogradaciones?: string[];
    recordatorio_clave: string;
  };
  por_que_funciona: string[];
}

// ==========================================
// 🎨 PROMPT DE SEMANA MODELO
// ==========================================

function generateWeekModelPrompt(
  natalData: any,
  solarReturnData: any,
  year: number
): string {
  return `Eres un astrólogo profesional especializado en crear herramientas prácticas de transformación personal.

Tu tarea es generar una SEMANA MODELO personalizada basada en la configuración astrológica del usuario.

CONTEXTO ASTROLÓGICO DEL USUARIO:
${JSON.stringify({ natal: natalData, solarReturn: solarReturnData }, null, 2)}

AÑO ACTUAL: ${year}

IMPORTANTE - PRINCIPIOS DE DISEÑO:

1. **Tono observador, NO imperativo**
   ❌ "Debes hacer", "Tienes que"
   ✅ "Suele funcionar", "Puede aparecer", "Conviene observar"

2. **Enfoque en EXPERIENCIA, no teoría**
   - Prácticas concretas (10 min escritura, no "reflexiona")
   - Microacciones específicas (cancelar algo no esencial, no "cuídate")

3. **Ritmo lunar SIN tecnicismos**
   - Usar fases lunares como metáfora del proceso interno
   - NO mencionar grados, aspectos técnicos, tránsitos

4. **Coherente con el año Solar Return**
   - Si hay énfasis en Casa 12: introspección, retiro consciente
   - Si hay énfasis en Casa 1: identidad, presencia
   - Adaptar el ritmo semanal al tema del año

ESTRUCTURA JSON EXACTA:

{
  "titulo": "Semana de [tema principal adaptado al usuario]",
  "intencion_semanal": "Frase ancla semanal observadora (ej: 'No reacciono. Observo, siento y luego actúo.')",

  "dias": [
    {
      "dia": "Lunes",
      "fase_lunar": "Luna Nueva / Fase de inicio interno",
      "tema": "Vaciamiento consciente",
      "energia": "Baja · Silenciosa · Introspectiva",
      "enfoque_del_dia": "Descripción breve del enfoque (2-3 líneas). Lenguaje observador.",
      "pregunta_guia": "Una pregunta profunda adaptada al usuario (ej: '¿Qué necesito soltar esta semana?')",
      "practica_concreta": [
        "Práctica específica 1 (ej: 10 minutos de escritura libre)",
        "Práctica específica 2 (ej: Ordenar un espacio pequeño)"
      ],
      "microaccion": "Acción muy concreta y pequeña (ej: 'Cancelar o posponer algo que no sea esencial')",
      "evitar": "Qué NO hacer este día (opcional, ej: 'Evita: iniciar conversaciones importantes')"
    },
    {
      "dia": "Martes",
      "fase_lunar": "Luna Creciente",
      "tema": "Escucha emocional",
      "energia": "Sensible · Receptiva",
      "enfoque_del_dia": "...",
      "pregunta_guia": "...",
      "practica_concreta": ["...", "..."],
      "microaccion": "..."
    },
    {
      "dia": "Miércoles",
      "fase_lunar": "Luna en Cuarto Creciente",
      "tema": "Tensión consciente",
      "energia": "Incomodidad útil",
      "enfoque_del_dia": "...",
      "pregunta_guia": "...",
      "practica_concreta": ["...", "..."],
      "microaccion": "...",
      "alerta_retrogrado": "Si hay planetas retrógrados activos: Revisa antes de decidir"
    },
    {
      "dia": "Jueves",
      "fase_lunar": "Luna Gibosa",
      "tema": "Claridad progresiva",
      "energia": "Más estable · Ordenadora",
      "enfoque_del_dia": "...",
      "pregunta_guia": "...",
      "practica_concreta": ["...", "..."],
      "microaccion": "..."
    },
    {
      "dia": "Viernes",
      "fase_lunar": "Luna Llena",
      "tema": "Conciencia emocional",
      "energia": "Alta · Reveladora",
      "enfoque_del_dia": "...",
      "pregunta_guia": "...",
      "practica_concreta": ["...", "..."],
      "microaccion": "...",
      "evitar": "Evita: confrontaciones directas"
    },
    {
      "dia": "Sábado",
      "fase_lunar": "Luna Menguante",
      "tema": "Integración",
      "energia": "Descendente · Reflexiva",
      "enfoque_del_dia": "...",
      "pregunta_guia": "...",
      "practica_concreta": ["...", "..."],
      "microaccion": "..."
    },
    {
      "dia": "Domingo",
      "fase_lunar": "Cuarto Menguante",
      "tema": "Cierre consciente",
      "energia": "Limpieza interna",
      "enfoque_del_dia": "...",
      "pregunta_guia": "...",
      "practica_concreta": ["...", "..."],
      "microaccion": "..."
    }
  ],

  "seccion_fija": {
    "retrogradaciones": [
      "Revisar antes de actuar",
      "Retomar temas antiguos",
      "No forzar definiciones"
    ],
    "recordatorio_clave": "Frase adaptada al año del usuario (ej: 'Este año no se trata de avanzar rápido, sino de avanzar alineada.')"
  },

  "por_que_funciona": [
    "Respeta tu ritmo interno",
    "Evita el autosabotaje por exigencia",
    "Convierte la introspección en estructura",
    "Permite acción sin traicionarte"
  ]
}

ADAPTACIONES CLAVE SEGÚN CONFIGURACIÓN:

- **Casa 12 activa**: Más énfasis en retiro, silencio, escritura privada
- **Casa 1 activa**: Más énfasis en identidad, límites, autenticidad visible
- **Luna en signos emocionales (Agua)**: Prácticas de escucha emocional
- **Mercurio Piscis/Casa 12**: Intuición, sueños, silencio mental
- **Venus en signos de acción (Aries)**: Microacciones de mostrar deseos
- **Saturno/Plutón activos**: Estructura, límites, transformación profunda

EJEMPLOS DE LENGUAJE CORRECTO:

✅ "Puede aparecer fricción interna. No es bloqueo: es ajuste."
✅ "Las emociones empiezan a aparecer. No se analizan, se registran."
✅ "Se ve con claridad algo que estaba oculto. No hace falta actuar hoy."

❌ "Debes hacer ejercicio de respiración"
❌ "Tienes que soltar lo que no te sirve"
❌ "La vida te pide que te muestres"

Devuelve SOLO el JSON completo, personalizado para este usuario específico.`;
}

// ==========================================
// 🚀 HANDLER PRINCIPAL
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    // 📊 Buscar interpretaciones
    const [natalInterpretation, solarReturnInterpretation] = await Promise.all([
      Interpretation.findOne({ userId, chartType: 'natal' }),
      Interpretation.findOne({
        userId,
        chartType: 'solar-return',
        expiresAt: { $gt: new Date() }
      }).sort({ generatedAt: -1 })
    ]);

    if (!natalInterpretation) {
      return NextResponse.json(
        { success: false, error: 'No se encontró interpretación natal' },
        { status: 404 }
      );
    }

    if (!solarReturnInterpretation) {
      return NextResponse.json(
        { success: false, error: 'No se encontró interpretación de Solar Return' },
        { status: 404 }
      );
    }

    // ✅ Verificar si ya existe semana modelo en caché
    if (solarReturnInterpretation.week_model) {
      const cacheAge = Date.now() - new Date(solarReturnInterpretation.updatedAt || 0).getTime();

      if (cacheAge < CACHE_DURATION) {
        console.log('✅ Semana modelo encontrada en caché');
        return NextResponse.json({
          success: true,
          data: solarReturnInterpretation.week_model,
          cached: true
        });
      }
    }

    // 🤖 Generar semana modelo con OpenAI
    console.log(`🤖 Generando semana modelo personalizada para año ${year}...`);

    const client = getOpenAI();
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'OpenAI no está configurado' },
        { status: 500 }
      );
    }

    const prompt = generateWeekModelPrompt(
      natalInterpretation.natalChart || natalInterpretation.interpretation,
      solarReturnInterpretation.solarReturnChart || solarReturnInterpretation.interpretation,
      parseInt(year)
    );

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo profesional experto en crear herramientas prácticas de transformación personal. Generas semanas modelo personalizadas con tono observador y enfoque experiencial.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85
    });

    const rawResponse = completion.choices[0].message.content;
    if (!rawResponse) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    const weekModel: SemanaModelo = JSON.parse(rawResponse);

    // 💾 Guardar en base de datos
    await Interpretation.findByIdAndUpdate(
      solarReturnInterpretation._id,
      {
        $set: {
          week_model: weekModel,
          updatedAt: new Date()
        }
      }
    );

    console.log('✅ Semana modelo generada y guardada');

    return NextResponse.json({
      success: true,
      data: weekModel,
      cached: false
    });

  } catch (error: any) {
    console.error('❌ Error en generate-week-model:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error generando semana modelo'
      },
      { status: 500 }
    );
  }
}

// ==========================================
// 🔄 POST - Regenerar semana modelo forzadamente
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, year } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId es requerido' },
        { status: 400 }
      );
    }

    const currentYear = year || new Date().getFullYear();

    await connectDB();

    // Invalidar caché eliminando semana modelo existente
    await Interpretation.findOneAndUpdate(
      {
        userId,
        chartType: 'solar-return',
        expiresAt: { $gt: new Date() }
      },
      {
        $unset: { week_model: 1 }
      },
      {
        sort: { generatedAt: -1 }
      }
    );

    // Redirigir a GET para regenerar
    const url = new URL(request.url);
    url.searchParams.set('userId', userId);
    url.searchParams.set('year', currentYear.toString());

    return GET(new NextRequest(url.toString()));

  } catch (error: any) {
    console.error('❌ Error en POST generate-week-model:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error regenerando semana modelo'
      },
      { status: 500 }
    );
  }
}
