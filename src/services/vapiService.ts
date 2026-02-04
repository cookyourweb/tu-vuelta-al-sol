/**
 * Servicio de integración con Vapi.ai
 * Para llamadas automáticas a leads
 */

const VAPI_API_URL = 'https://api.vapi.ai';

interface VapiCallOptions {
  phoneNumber: string;
  assistantId: string;
  customerName?: string;
  metadata?: Record<string, any>;
}

interface VapiAssistantConfig {
  name: string;
  voice: {
    provider: string;
    voiceId: string;
  };
  model: {
    provider: string;
    model: string;
    messages: Array<{
      role: string;
      content: string;
    }>;
  };
  firstMessage: string;
  endCallMessage?: string;
  transcriber?: {
    provider: string;
    model?: string;
    language?: string;
  };
}

class VapiService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.VAPI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ [VAPI] API Key no configurada. Añade VAPI_API_KEY a .env');
    }
  }

  /**
   * Crear una llamada saliente a un lead
   */
  async createOutboundCall(options: VapiCallOptions): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY no configurada');
    }

    const { phoneNumber, assistantId, customerName, metadata } = options;

    // Formatear número de teléfono (asegurar formato E.164)
    const formattedPhone = this.formatPhoneNumber(phoneNumber);

    const response = await fetch(`${VAPI_API_URL}/call/phone`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistantId,
        customer: {
          number: formattedPhone,
          name: customerName
        },
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID, // Tu número de Zadarma en Vapi
        metadata: {
          source: 'tu-vuelta-al-sol',
          ...metadata
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ [VAPI] Error al crear llamada:', error);
      throw new Error(error.message || 'Error al crear llamada');
    }

    const data = await response.json();
    console.log('📞 [VAPI] Llamada creada:', data.id);
    return data;
  }

  /**
   * Crear un asistente de voz para captación de astrólogos
   */
  async createAssistant(config?: Partial<VapiAssistantConfig>): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY no configurada');
    }

    const defaultConfig: VapiAssistantConfig = {
      name: 'Asistente Formación Astrólogos',
      voice: {
        provider: 'elevenlabs',
        voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah - voz femenina profesional
      },
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres una asistente amable y profesional de Tu Vuelta al Sol.
Tu objetivo es:
1. Agradecer al lead por su interés en la formación de IA para astrólogos
2. Confirmar que han recibido su solicitud
3. Preguntarles brevemente qué les interesa más (interpretaciones con IA, automatización, o marca blanca)
4. Agendar una llamada de seguimiento con Vero para los próximos días
5. Despedirte cordialmente

Sé cálida pero profesional. No hagas la llamada muy larga (máximo 2-3 minutos).
Si el usuario no puede hablar, ofrece enviarle información por email o WhatsApp.

Datos importantes:
- La formación incluye: prompts especializados, automatización, y opción de marca blanca
- El precio se discutirá en la llamada de seguimiento con Vero
- La web es tuvueltaalsol.es`
          }
        ]
      },
      firstMessage: 'Hola, soy Sara de Tu Vuelta al Sol. Te llamo porque has mostrado interés en nuestra formación de inteligencia artificial para astrólogos. ¿Es buen momento para hablar un par de minutos?',
      endCallMessage: 'Gracias por tu tiempo. Vero se pondrá en contacto contigo pronto. ¡Que tengas un excelente día!',
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'es'
      }
    };

    const finalConfig = { ...defaultConfig, ...config };

    const response = await fetch(`${VAPI_API_URL}/assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalConfig)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ [VAPI] Error al crear asistente:', error);
      throw new Error(error.message || 'Error al crear asistente');
    }

    const data = await response.json();
    console.log('🤖 [VAPI] Asistente creado:', data.id);
    return data;
  }

  /**
   * Obtener lista de asistentes
   */
  async listAssistants(): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY no configurada');
    }

    const response = await fetch(`${VAPI_API_URL}/assistant`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener asistentes');
    }

    return response.json();
  }

  /**
   * Obtener detalles de una llamada
   */
  async getCall(callId: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('VAPI_API_KEY no configurada');
    }

    const response = await fetch(`${VAPI_API_URL}/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener llamada');
    }

    return response.json();
  }

  /**
   * Formatear número de teléfono a E.164
   */
  private formatPhoneNumber(phone: string): string {
    // Eliminar espacios y caracteres no numéricos excepto +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Si no empieza con +, asumir España
    if (!cleaned.startsWith('+')) {
      // Si empieza con 34, añadir +
      if (cleaned.startsWith('34')) {
        cleaned = '+' + cleaned;
      } else {
        // Asumir número español
        cleaned = '+34' + cleaned;
      }
    }

    return cleaned;
  }
}

export const vapiService = new VapiService();
export default vapiService;
