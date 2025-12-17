// src/app/api/agenda/generate-book/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import connectDB from '@/lib/db';
import NatalChart from '@/models/NatalChart';
import Interpretation from '@/models/Interpretation';
import User from '@/models/User';
import { calculateSolarYearEvents } from '@/utils/astrology/solarYearEvents';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ POST: Generar contenido completo del libro-agenda
export async function POST(request: NextRequest) {
  try {
    console.log('📘 ===== GENERATE BOOK REQUEST =====');

    // 🔒 AUTHENTICATION
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - No authentication token provided'
      }, { status: 401 });
    }

    // Initialize Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    console.log('👤 User authenticated:', userId);

    await connectDB();

    // 1. Obtener datos del usuario
    const user = await User.findOne({ userId }).lean().exec() as any;
    const birthData = await require('@/models/BirthData').default.findOne({ userId }).lean().exec() as any;

    if (!birthData) {
      return NextResponse.json({
        success: false,
        error: 'No birth data found for user'
      }, { status: 404 });
    }

    const userName = user?.fullName || user?.name || birthData?.name || 'Usuario';
    const userAge = calculateAge(birthData.birthDate);

    console.log(`📊 User data: ${userName}, ${userAge} años`);

    // 2. Obtener carta natal
    const natalChart = await NatalChart.findOne({ userId }).lean().exec() as any;
    if (!natalChart) {
      return NextResponse.json({
        success: false,
        error: 'No natal chart found for user'
      }, { status: 404 });
    }

    // 3. Obtener interpretación natal
    const natalInterpretation = await Interpretation.findOne({
      userId,
      chartType: 'natal',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec() as any;

    // 4. Obtener retorno solar
    const solarReturn = await Interpretation.findOne({
      userId,
      chartType: 'solar-return',
      expiresAt: { $gt: new Date() }
    })
    .sort({ generatedAt: -1 })
    .lean()
    .exec() as any;

    if (!solarReturn) {
      return NextResponse.json({
        success: false,
        error: 'No solar return found. User must generate solar return first.'
      }, { status: 404 });
    }

    // 5. Calcular eventos del año (de cumpleaños a cumpleaños)
    const currentYear = new Date().getFullYear();
    const birthMonth = new Date(birthData.birthDate).getMonth();
    const birthDay = new Date(birthData.birthDate).getDate();

    const startDate = new Date(currentYear, birthMonth, birthDay);
    const endDate = new Date(currentYear + 1, birthMonth, birthDay);

    console.log(`📅 Calculating events from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const yearEvents = await calculateSolarYearEvents(
      userId,
      birthData,
      natalChart.natalChart || natalChart,
      startDate,
      endDate
    );

    console.log(`✅ Events calculated: ${yearEvents.length} total events`);

    // 6. Generar contenido del libro con OpenAI
    console.log('🤖 Generating book content with OpenAI...');

    const bookPrompt = generateBookPrompt({
      userName,
      userAge,
      birthData,
      natalChart: natalChart.natalChart || natalChart,
      natalInterpretation: natalInterpretation?.interpretation || {},
      solarReturn: solarReturn.interpretation || {},
      yearEvents,
      startDate,
      endDate
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un astrólogo evolutivo y terapeuta simbólico experto en crear agendas astrológicas personalizadas. Respondes ÚNICAMENTE con JSON válido en español, sin markdown ni comentarios. Tu voz es cálida, directa, terapéutica y motivadora.'
        },
        {
          role: 'user',
          content: bookPrompt
        }
      ],
      temperature: 0.85,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content;

    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    console.log('✅ OpenAI response received');

    // 7. Parsear JSON
    let bookContent;
    try {
      bookContent = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      throw new Error('Failed to parse OpenAI response as JSON');
    }

    console.log('✅ Book content generated successfully');

    return NextResponse.json({
      success: true,
      book: {
        ...bookContent,
        yearEvents: yearEvents.slice(0, 100), // Primeros 100 eventos
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error generating book:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// ✅ HELPER: Calcular edad
function calculateAge(birthDate: string | Date): number {
  if (!birthDate) return 30;

  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age || 30;
}

// ✅ GENERAR PROMPT COMPLETO DEL LIBRO
function generateBookPrompt(data: {
  userName: string;
  userAge: number;
  birthData: any;
  natalChart: any;
  natalInterpretation: any;
  solarReturn: any;
  yearEvents: any[];
  startDate: Date;
  endDate: Date;
}): string {
  const sol = data.natalChart.planets?.find((p: any) => p.name === 'Sol' || p.name === 'Sun');
  const luna = data.natalChart.planets?.find((p: any) => p.name === 'Luna' || p.name === 'Moon');
  const ascendente = data.natalChart.ascendant;

  return `
# 📘 GENERA UNA AGENDA ASTROLÓGICA PERSONALIZADA COMPLETA

## 👤 DATOS DEL USUARIO

**Nombre:** ${data.userName}
**Edad:** ${data.userAge} años
**Fecha de nacimiento:** ${data.birthData.birthDate}
**Lugar de nacimiento:** ${data.birthData.city || data.birthData.birthPlace}

**Año de la agenda:** ${data.startDate.getFullYear()}-${data.endDate.getFullYear()}
**Período:** Del ${format(data.startDate, 'dd MMMM yyyy', { locale: es })} al ${format(data.endDate, 'dd MMMM yyyy', { locale: es })}

## 🌟 CARTA NATAL

**Sol:** ${sol?.sign} Casa ${sol?.house}
**Luna:** ${luna?.sign} Casa ${luna?.house}
**Ascendente:** ${ascendente?.sign}

**Tema del Retorno Solar:** ${data.solarReturn.tema_anual || data.solarReturn.esencia_revolucionaria_anual || 'Transformación personal'}

## 📋 ESTRUCTURA JSON REQUERIDA

Responde ÚNICAMENTE con JSON válido (sin markdown, sin backticks):

{
  "portada": {
    "titulo": "Tu Vuelta al Sol ${data.startDate.getFullYear()}-${data.endDate.getFullYear()}",
    "subtitulo": "String 30-40 palabras: Frase-mantra personalizada del año basada en el retorno solar",
    "dedicatoria": "Para ${data.userName}"
  },

  "apertura_del_viaje": {
    "antes_de_empezar": "String 80-100 palabras: Cómo usar esta agenda. Tono cálido, íntimo. No es un libro para 'hacer bien', es un espacio para habitarte.",

    "carta_de_bienvenida": "String 150-200 palabras: Carta personalizada para ${data.userName}. Este año empieza aquí. El tono del ciclo. Qué se abre, qué se cierra. Usa su nombre, su edad, su signo solar. Voz cercana, no sentenciosa.",

    "tema_central_del_año": "String 100-120 palabras: La pregunta que acompaña a ${data.userName} este año. La energía que atraviesa. El aprendizaje que insiste. Basado en su Retorno Solar y Nodo Norte.",

    "ritual_de_inicio": "String 80-100 palabras: Ritual simbólico para preparar el año. Anclar una intención consciente. Mantra de apertura personalizado en PRIMERA PERSONA."
  },

  "tu_mapa_interior": {
    "carta_natal_explicada": "String 150-180 palabras: Explica la carta natal de ${data.userName} para vivirla. Su forma de sentir (Luna en ${luna?.sign}), su forma de decidir (Sol en ${sol?.sign}), su manera de vincularse, su ritmo natural. Lenguaje aplicado, no técnico.",

    "soul_chart": {
      "nodo_sur": "String 80-100 palabras: De dónde vienes. Los patrones que se repiten. El aprendizaje del pasado.",
      "nodo_norte": "String 80-100 palabras: Hacia dónde creces. El aprendizaje que madura.",
      "patrones_inconscientes": "String 60-80 palabras: Los patrones emocionales que se repiten y piden conciencia."
    },

    "integrar_proposito": "String 100-120 palabras: Cómo integrar tu propósito en la vida real. Trabajo, relaciones, decisiones, límites y deseo. Concreto, accionable."
  },

  "tu_año_astrologico": {
    "retorno_solar": {
      "ascendente_del_año": "String 60-80 palabras: Clima emocional del año. Área de mayor movimiento. Dónde se pide presencia.",
      "tema_principal": "String 80-100 palabras: El tema principal del año según el Retorno Solar. Qué viene a mover, qué pide soltar.",
      "ritual_de_cumpleaños": "String 80-100 palabras: Ritual para cerrar el ciclo anterior y nombrar lo que empieza.",
      "mantra_del_año": "String 30-40 palabras en PRIMERA PERSONA: Mantra personalizado para el año completo."
    }
  },

  "calendario_personalizado": {
    "descripcion": "String 100-120 palabras: Cómo usar el calendario. Fechas clave, momentos de inicio, momentos de cierre. Eventos que no pasan desapercibidos.",

    "lunas_nuevas_intro": "String 60-80 palabras: Qué son las Lunas Nuevas. Sembrar conciencia. Qué iniciar, qué intención plantar.",

    "lunas_llenas_intro": "String 60-80 palabras: Qué son las Lunas Llenas. Iluminar y soltar. Qué se revela, qué se integra.",

    "eclipses_intro": "String 60-80 palabras: Qué son los eclipses. Cambios que no negocian. Qué se mueve, qué se transforma."
  },

  "cierre_del_ciclo": {
    "integrar_lo_vivido": "String 100-120 palabras: Preguntas guía para integrar: Qué aprendiste, qué soltaste, qué se transformó.",

    "carta_de_cierre": "String 150-180 palabras: Carta personalizada para despedirte del año. Honrar el proceso. Tono de cierre emocional, validación, gratitud.",

    "preparar_proxima_vuelta": "String 80-100 palabras: Lo que queda sembrado. Lo que continúa. Preparación para la próxima vuelta al Sol."
  },

  "frase_final": "String 20-30 palabras: Frase para la contraportada. 'Nada de lo que viviste fue en vano. Todo fue parte del camino de regreso a ti.' (puedes adaptar pero mantén ese espíritu)."
}

---

## ⚠️ INSTRUCCIONES CRÍTICAS - VOZ "TU VUELTA AL SOL"

**IDENTIDAD DE VOZ:**
- No impresionas → acompañas
- No sententcias → explicas
- No prometes milagros → ofreces conciencia
- No hablas desde arriba → caminas al lado

**RITMO:**
- Frases medias
- Pausas intencionales
- Preguntas que abren
- Silencios implícitos

**PALABRAS CLAVE:**
proceso, conciencia, integración, maduración, sostener, permitir, observar, elegir, habitar, transformar, cerrar ciclo, anclar, escucha interna

**EVITA:**
- "karma" sin contexto
- "misión" grandilocuente
- "todo pasa por algo" sin explicación
- Lenguaje esotérico/críptico

**ESTRUCTURA EMOCIONAL:**
1. Reconozco lo que sientes
2. Explico por qué ocurre (astrológicamente)
3. Abro una posibilidad de conciencia
4. Te devuelvo el poder de elegir

**PERSONALIZACIÓN:**
- Usa el nombre ${data.userName} al menos 3 veces
- Menciona su edad, su Sol, su Luna
- Referencias concretas a su carta
- NO genérico

**TONO:**
Cálido, íntimo, directo, terapéutico, motivador sin exagerar, disruptivo suave.

---

**AHORA GENERA EL CONTENIDO COMPLETO DE LA AGENDA PARA ${data.userName.toUpperCase()}.**
`;
}
