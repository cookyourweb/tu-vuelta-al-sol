# Vapi + Zadarma - Sistema de Llamadas Automáticas para Leads

## Estado Actual: PENDIENTE DE VERIFICACIÓN

El número de Zadarma está pendiente de verificación. Una vez verificado, seguir los pasos de configuración final.

---

## Resumen del Sistema

Sistema automatizado de captación de leads para astrólogos interesados en formación de IA:

1. **Landing Page** (`/formacion-astrologos`): Formulario de captación
2. **API de Leads** (`/api/leads/astrologos`): Gestión de leads en MongoDB
3. **Servicio Vapi** (`vapiService.ts`): Integración con Vapi para llamadas de voz IA
4. **Asistente Sara**: Asistente de voz IA configurado en Vapi

---

## Credenciales y Configuración

### Vapi

```env
VAPI_API_KEY=f9d7b50c-23d7-4e1a-9f18-3026dbbaf3f0
VAPI_ASSISTANT_ID=ba294f7a-f44a-476f-ad37-6d31d9204797
VAPI_PHONE_NUMBER_ID=<pendiente - configurar después de verificación>
```

- **Dashboard**: https://dashboard.vapi.ai
- **Asistente creado**: "Sara - Formacion Astrologos"
- **ID del Asistente**: `ba294f7a-f44a-476f-ad37-6d31d9204797`

### Zadarma (SIP Trunk)

```
Número: +34919933516
Estado: PENDIENTE DE VERIFICACIÓN

SIP Server: sip.zadarma.com
Username: 381594
Password: c6Hq1Dpt9m
```

- **Panel Zadarma**: https://my.zadarma.com
- **Documentación SIP**: https://zadarma.com/es/support/docs/sip/

---

## Archivos del Sistema

### 1. Landing Page de Captación
**Ruta**: `src/app/formacion-astrologos/page.tsx`

Formulario con campos:
- Nombre
- Email
- Teléfono
- Experiencia en astrología
- Interés principal

### 2. Modelo de Lead
**Ruta**: `src/models/Lead.ts`

```typescript
interface ILead {
  nombre: string;
  email: string;
  telefono?: string;
  experiencia: 'principiante' | 'intermedio' | 'avanzado' | 'profesional';
  interes: string;
  source: string;
  status: 'nuevo' | 'contactado' | 'interesado' | 'cliente' | 'descartado';
  notas?: string;
  vapiCallId?: string;  // ID de la llamada de Vapi
}
```

### 3. API de Leads
**Ruta**: `src/app/api/leads/astrologos/route.ts`

- `POST`: Crear nuevo lead + disparar llamada Vapi
- `GET`: Listar leads (admin)
- `PATCH`: Actualizar estado del lead

### 4. Servicio Vapi
**Ruta**: `src/services/vapiService.ts`

Métodos disponibles:
- `createOutboundCall(phoneNumber, assistantId)`: Crear llamada saliente
- `createAssistant(config)`: Crear asistente
- `listAssistants()`: Listar asistentes
- `getCall(callId)`: Obtener detalles de llamada

### 5. API de Vapi
**Rutas**:
- `src/app/api/vapi/assistant/route.ts`: Gestión de asistentes
- `src/app/api/vapi/webhook/route.ts`: Webhook para eventos de llamada

---

## Configuración del Asistente Sara

El asistente "Sara - Formacion Astrologos" está configurado con:

```json
{
  "name": "Sara - Formacion Astrologos",
  "model": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "systemPrompt": "Eres Sara, asistente virtual de Tu Vuelta al Sol..."
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "EXAVITQu4vr4xnSDxMaL"
  },
  "firstMessage": "¡Hola! Soy Sara de Tu Vuelta al Sol. Gracias por tu interés en nuestra formación de inteligencia artificial para astrólogos. ¿Tienes un momento para que te cuente más sobre el programa?"
}
```

---

## Pasos para Completar la Configuración

### Cuando el número esté verificado:

#### 1. Configurar SIP Trunk en Vapi

1. Ir a https://dashboard.vapi.ai
2. Phone Numbers → BYO Phone Number → Import Via SIP Trunk
3. Rellenar:
   - **SIP Trunk Termination URI**: `sip.zadarma.com`
   - **Outbound Authentication**:
     - Username: `381594`
     - Password: `c6Hq1Dpt9m`
   - **SIP Registration (Inbound)**:
     - SIP URI: `sip:381594@sip.zadarma.com`
     - Username: `381594`
     - Password: `c6Hq1Dpt9m`
4. Guardar y obtener el `VAPI_PHONE_NUMBER_ID`

#### 2. Actualizar Variables de Entorno

Añadir en Vercel:
```
VAPI_API_KEY=f9d7b50c-23d7-4e1a-9f18-3026dbbaf3f0
VAPI_ASSISTANT_ID=ba294f7a-f44a-476f-ad37-6d31d9204797
VAPI_PHONE_NUMBER_ID=<el ID obtenido en el paso anterior>
```

#### 3. Configurar Webhook en Vapi

1. Ir a Settings en Vapi Dashboard
2. Añadir webhook URL: `https://www.tuvueltaalsol.es/api/vapi/webhook`
3. Seleccionar eventos:
   - call-started
   - call-ended
   - transcript

#### 4. Probar el Sistema

```bash
# Crear un lead de prueba
curl -X POST https://www.tuvueltaalsol.es/api/leads/astrologos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@test.com",
    "telefono": "+34612345678",
    "experiencia": "intermedio",
    "interes": "Crear mi propia IA astrológica"
  }'
```

---

## Flujo de la Llamada

1. Usuario rellena formulario en `/formacion-astrologos`
2. API crea lead en MongoDB con status `nuevo`
3. API dispara llamada a Vapi con el número del lead
4. Sara (IA) llama al lead y presenta la formación
5. Webhook actualiza el status del lead según resultado
6. Admin puede ver/gestionar leads en el panel

---

## Troubleshooting

### Error al guardar SIP Trunk
- Verificar que el número está activo en Zadarma
- Verificar credenciales SIP en panel de Zadarma
- Probar conexión SIP con un softphone primero

### Llamadas no salen
- Verificar VAPI_PHONE_NUMBER_ID en variables de entorno
- Verificar saldo en cuenta Zadarma
- Revisar logs en Vapi Dashboard → Call Logs

### Webhook no recibe eventos
- Verificar URL del webhook en Vapi Dashboard
- Verificar que la URL es accesible públicamente
- Revisar logs en Vercel

---

## Costos Estimados

- **Vapi**: $0.05/minuto de llamada (incluye IA + voz)
- **Zadarma**: Según tarifa de destino (~0.01-0.03€/min España)
- **ElevenLabs** (voz): Incluido en Vapi

---

## Contacto Soporte

- **Vapi**: support@vapi.ai | Discord: https://discord.gg/vapi
- **Zadarma**: soporte@zadarma.com | +34 93 122 06 00

---

**Última actualización**: Febrero 2026
**Estado**: Pendiente de verificación de número Zadarma
