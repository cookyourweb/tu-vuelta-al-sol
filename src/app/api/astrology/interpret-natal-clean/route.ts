// src/app/api/astrology/interpret-natal/route.ts
// ENDPOINT ACTUALIZADO PARA INTERPRETACIÓN NATAL DISRUPTIVA

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  generateDisruptiveNatalPrompt,
  formatChartForPrompt,
  type ChartData,
  type UserProfile
} from '@/utils/prompts/disruptivePrompts';

// Cache en memoria para evitar regenerar interpretaciones duplicadas
const interpretationCache = new Map<string, { interpretation: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

interface NatalInterpretationRequest {
  userId: string;
  natalChart: ChartData;
  userProfile: UserProfile;
  regenerate?: boolean;
  disruptiveMode?: boolean;
}

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no está configurada');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// ✅ FUNCIÓN: Generar interpretación disruptiva
async function generateDisruptiveInterpretation(
  chartData: ChartData,
  userProfile: UserProfile
): Promise<any> {
  const openai = getOpenAIClient();

  const prompt = generateDisruptiveNatalPrompt(chartData, userProfile);

  console.log('🔥 Generando interpretación disruptiva con prompt:', prompt.substring(0, 200) + '...');

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Eres un astrólogo evolutivo revolucionario EXPERTO. Respondes EXCLUSIVAMENTE con JSON válido, sin texto adicional, sin markdown. Tu enfoque es disruptivo, transformacional y activador de poder personal. SIEMPRE completas TODAS las secciones del JSON requerido: esencia_revolucionaria, proposito_vida, formacion_temprana, patrones_psicologicos, planetas_profundos, angulos_vitales, nodos_lunares, declaracion_poder, advertencias (MÍNIMO 3), insights_transformacionales (MÍNIMO 5), rituales_recomendados (MÍNIMO 4 rituales prácticos), y pregunta_final_reflexion."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 16000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No se recibió respuesta de OpenAI');
    }

    // Limpiar respuesta y parsear JSON
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);
      console.error('Respuesta recibida:', cleanedResponse);
      throw new Error('Respuesta de IA no válida');
    }

  } catch (error) {
    console.error('Error en OpenAI:', error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exceeded')) {
        throw new Error('Se ha excedido el límite de uso de la API de OpenAI. Por favor, contacta al administrador para actualizar el plan de facturación.');
      }

      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        throw new Error('Error de autenticación con OpenAI. La clave API puede ser inválida.');
      }

      if (error.message.includes('rate limit')) {
        throw new Error('Límite de velocidad excedido. Por favor, espera unos minutos antes de intentar nuevamente.');
      }
    }

    throw error;
  }
}

// ✅ FUNCIÓN: Interpretación de fallback - ESTRUCTURA COMPLETA
function generateFallbackInterpretation(userProfile: UserProfile): any {
  return {
    esencia_revolucionaria: `${userProfile.name}, eres una fuerza revolucionaria auténtica encarnada. Tu presencia cambia energías automáticamente. No viniste a este mundo a pasar desapercibido/a - viniste a ACTIVAR.`,
    proposito_vida: "Activar el potencial humano dormido a través de tu autenticidad radical y visión de futuro. Cada día que vives alineado/a con tu carta natal es un día que cumples tu misión cósmica.",
    formacion_temprana: {
      casa_lunar: {
        planeta: "Luna",
        infancia_emocional: "Tu infancia emocional fue marcada por experiencias que moldearon profundamente tu forma de sentir y procesar las emociones.",
        patron_formado: "Desarrollaste patrones emocionales que hoy te sirven como brújula interna.",
        impacto_adulto: "Hoy, estos patrones se manifiestan en cómo te relacionas con tus emociones y con los demás."
      },
      casa_saturnina: {
        planeta: "Saturno",
        limites_internalizados: "Internalizaste ciertos límites y estructuras que te dieron seguridad pero también restricciones.",
        mensaje_recibido: "Recibiste mensajes sobre responsabilidad, disciplina y cómo 'debías ser'.",
        impacto_adulto: "Hoy esos mensajes se manifiestan en tu voz interior crítica y en tus estándares personales."
      },
      casa_venusina: {
        planeta: "Venus",
        amor_aprendido: "Aprendiste una forma particular de dar y recibir amor basada en lo que observaste.",
        modelo_relacional: "El modelo de relaciones que viste de niño/a moldeó tus expectativas actuales.",
        impacto_adulto: "Hoy buscas o evitas ciertos patrones relacionales basándote en esa programación temprana."
      }
    },
    patrones_psicologicos: [
      {
        nombre_patron: "El Revolucionario Interior",
        planeta_origen: "Tu configuración natal única",
        como_se_manifiesta: [
          "Sientes una necesidad profunda de ser auténtico/a",
          "Te resistes a encajar en moldes predefinidos",
          "Buscas constantemente nuevas formas de expresarte"
        ],
        origen_infancia: "Este patrón se formó cuando aprendiste que ser diferente era tanto un regalo como un desafío.",
        dialogo_interno: [
          "'¿Por qué no puedo simplemente ser normal?'",
          "'Mi rareza es mi superpoder'"
        ],
        ciclo_karmico: [
          "Te sientes diferente",
          "Intentas encajar",
          "Te sientes asfixiado/a",
          "Explotas con autenticidad",
          "Repites el ciclo"
        ],
        sombra_junguiana: "La parte de ti que teme ser rechazado/a por ser demasiado 'diferente'.",
        superpoder_integrado: "Cuando integras luz y sombra, tu autenticidad se convierte en magnetismo que inspira a otros.",
        pregunta_reflexion: "¿Qué pasaría si dejaras de pedir permiso para ser quien realmente eres?"
      }
    ],
    planetas_profundos: {
      urano: "Tu Urano te conecta con la innovación y el cambio. Eres un/a catalizador/a de nuevas ideas.",
      neptuno: "Tu Neptuno te da acceso a la intuición y la espiritualidad profunda.",
      pluton: "Tu Plutón te otorga poder transformacional. Eres capaz de renacer de las cenizas."
    },
    angulos_vitales: {
      ascendente: {
        posicion: "Tu Ascendente",
        mascara_social: "Tu primera impresión en el mundo - la energía que proyectas antes de que te conozcan de verdad.",
        cuerpo_fisico: "Se manifiesta en tu presencia física y vitalidad.",
        enfoque_vida: "El lente a través del cual experimentas la vida.",
        desafio_evolutivo: "Integrar tu máscara con tu esencia solar.",
        superpoder: "Cuando usas tu Ascendente conscientemente, proyectas autenticidad magnética."
      },
      medio_cielo: {
        posicion: "Tu Medio Cielo",
        vocacion_soul: "Tu verdadera vocación del alma - no solo trabajo, sino CONTRIBUCIÓN.",
        imagen_publica: "Cómo el mundo te ve profesionalmente.",
        legado: "La huella que quieres dejar en el mundo.",
        carrera_ideal: "Roles donde tu autenticidad y visión son valoradas.",
        autoridad_interna: "Cómo desarrollas tu propio liderazgo natural."
      }
    },
    nodos_lunares: {
      nodo_sur: {
        signo_casa: "Tu Nodo Sur",
        zona_comfort: "Habilidades que ya dominas de vidas pasadas o aprendizajes tempranos.",
        patron_repetitivo: "Patrones que tiendes a repetir pero que ya no te sirven."
      },
      nodo_norte: {
        signo_casa: "Tu Nodo Norte",
        direccion_evolutiva: "Hacia dónde tu alma quiere crecer en esta vida.",
        desafio: "El miedo que necesitas atravesar para evolucionar."
      },
      eje_completo: "Tu eje nodal es tu GPS evolutivo - del pasado que dominas al futuro que te llama."
    },
    plan_accion: {
      hoy_mismo: [
        "Identifica UNA mentira que estás viviendo para 'encajar'",
        "Declara públicamente una verdad radical sobre ti",
        "Elimina UNA cosa/persona/compromiso que apaga tu fuego"
      ],
      esta_semana: [
        "Conecta con UNA persona que comparta tu visión de futuro",
        "Inicia UN proyecto que exprese tu naturaleza revolucionaria",
        "Rechaza UNA oportunidad que requiera que seas 'menos'"
      ],
      este_mes: [
        "Lanza algo al mundo que sea auténticamente tuyo",
        "Establece límites férricos con personas que no honren tu naturaleza",
        "Invierte en herramientas/educación que amplifiquen tu poder"
      ]
    },
    declaracion_poder: `YO, ${userProfile.name.toUpperCase()}, SOY REVOLUCIONARIO/A ENCARNADO/A. MI AUTENTICIDAD RADICAL ES MI SERVICIO A LA HUMANIDAD. NO VINE A ENCAJAR - VINE A DESPERTAR CONSCIENCIAS. MI RAREZA NO ES MI PROBLEMA - ES MI MISIÓN.`,
    advertencias: [
      "⚠️ Si estás en un trabajo que te aburre profundamente, tu alma se está muriendo lentamente. Tu carta natal NO te diseñó para conformarte.",
      "⚠️ Si escondes tu rareza por 'seguridad' o por miedo al rechazo, estás saboteando tu propósito de vida cósmico.",
      "⚠️ Si no estás incomodando a ALGUIEN con tu autenticidad, probablemente no estás siendo lo suficientemente real.",
      "⚠️ El autoengaño es tu mayor enemigo - tu carta natal siempre sabrá cuando no estás viviendo tu verdad."
    ],
    insights_transformacionales: [
      "💡 Tu configuración natal te diseñó para ser catalizador de evolución humana - no es casualidad.",
      "💡 Cada casa en tu carta contiene un aspecto específico de tu misión revolucionaria esperando ser activado.",
      "💡 Tu carta natal es literalmente tu mapa del tesoro para liberar potencial dormido en ti y en otros.",
      "💡 Los aspectos 'difíciles' de tu carta son en realidad tus mayores superpoderes esperando ser integrados.",
      "💡 Cuando vives alineado/a con tu carta, sincronicidades y oportunidades aparecen naturalmente.",
      "💡 Tu rareza no es tu defecto - es tu antena cósmica sintonizada con frecuencias que otros aún no captan."
    ],
    rituales_recomendados: [
      "🕯️ Declara diariamente tu declaración de poder frente al espejo, mirándote a los ojos",
      "🕯️ Dedica 20 minutos diarios a actividades que expresen tu esencia auténtica sin filtros",
      "🕯️ Establece un ritual semanal de revisión: ¿Estás viviendo tu carta natal o viviendo la vida de otro?",
      "🕯️ Cada Luna Nueva, escribe una intención que honre algún aspecto de tu carta natal"
    ],
    pregunta_final_reflexion: "Si supieras que tienes PERMISO CÓSMICO para ser exactamente quien eres, sin pedir disculpas ni explicaciones... ¿qué harías diferente MAÑANA?"
  };
}

export async function POST(request: NextRequest) {
  console.log('🌟 [INTERPRET-NATAL] Iniciando interpretación natal disruptiva');

  try {
    const body: NatalInterpretationRequest = await request.json();
    const { userId, natalChart, userProfile, regenerate = false, disruptiveMode = false } = body;

    // Validación
    if (!userId || !natalChart || !userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos: userId, natalChart y userProfile son requeridos'
      }, { status: 400 });
    }

    // Verificar caché (si no se fuerza regenerar)
    const cacheKey = `natal_${userId}_${disruptiveMode ? 'disruptive' : 'standard'}`;
    if (!regenerate) {
      const cached = interpretationCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
        console.log('✅ [INTERPRET-NATAL] Interpretación encontrada en caché');
        return NextResponse.json({
          success: true,
          data: {
            interpretation: cached.interpretation,
            cached: true,
            generatedAt: new Date(cached.timestamp).toISOString(),
            method: 'cached'
          }
        });
      }
    }

    let interpretation: any;

    // Generar interpretación
    if (disruptiveMode && process.env.OPENAI_API_KEY) {
      console.log('🔥 [INTERPRET-NATAL] Modo disruptivo activado con IA');
      try {
        interpretation = await generateDisruptiveInterpretation(natalChart, userProfile);
      } catch (error) {
        console.warn('⚠️ [INTERPRET-NATAL] IA falló, usando fallback:', error);
        interpretation = generateFallbackInterpretation(userProfile);
      }
    } else {
      console.log('📋 [INTERPRET-NATAL] Usando interpretación de fallback');
      interpretation = generateFallbackInterpretation(userProfile);
    }

    // Guardar en caché
    interpretationCache.set(cacheKey, {
      interpretation,
      timestamp: Date.now()
    });

    console.log('✅ [INTERPRET-NATAL] Interpretación generada exitosamente');

    return NextResponse.json({
      success: true,
      data: {
        interpretation,
        cached: false,
        generatedAt: new Date().toISOString(),
        method: disruptiveMode ? 'openai_disruptive' : 'fallback'
      }
    });

  } catch (error) {
    console.error('❌ [INTERPRET-NATAL] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
