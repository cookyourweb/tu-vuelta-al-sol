# Ideas para Botón "Explorar Más" 🔮✨

## Contexto

El botón "Explorar Más" está actualmente en:
- Sidebar de la agenda (CTA section)
- Otras secciones del dashboard

**Objetivo**: Convertir este botón en un formulario interactivo que permita a los usuarios solicitar servicios personalizados adicionales.

---

## 🎯 Propuesta de Funcionalidad

### 1. Modal con Formulario de Servicios Personalizados

Al hacer click en "Explorar Más", abrir un **modal fullscreen** con un formulario que permita al usuario seleccionar qué tipo de servicio adicional desea:

#### Opciones de Servicios:

```
┌─────────────────────────────────────────────────────┐
│  ¿Qué te gustaría explorar?  🌟                      │
│                                                      │
│  [✓] Consulta con astrólogo profesional             │
│  [✓] Interpretación de compatibilidad (pareja)      │
│  [✓] Carta natal de hijos                           │
│  [✓] Análisis de relaciones familiares              │
│  [✓] Orientación vocacional/profesional             │
│  [✓] Interpretación de sueños y símbolos            │
│  [✓] Otro (especificar)                             │
│                                                      │
│  📝 Cuéntanos más sobre tu consulta:                │
│  [                                                ]  │
│  [     Área de texto libre (máx 500 caracteres)  ]  │
│  [                                                ]  │
│                                                      │
│  📧 Email de contacto: [__________________]         │
│  📱 Teléfono (opcional): [__________________]        │
│                                                      │
│  [  Enviar Solicitud  ]  [  Cancelar  ]             │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Estructura de Datos

### Modelo: `ServiceRequest`

```typescript
interface ServiceRequest {
  userId: string;
  createdAt: Date;
  serviceType: string[]; // Array de servicios seleccionados
  customMessage: string; // Texto libre del usuario
  contactEmail: string;
  contactPhone?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes?: string; // Notas internas del admin
  resolvedAt?: Date;
  resolvedBy?: string; // Admin user ID
}
```

### Colección MongoDB

```
Collection: service_requests
Index: userId, createdAt, status
```

---

## 🔧 Implementación Técnica

### 1. Componente Modal: `ExplorarMasModal.tsx`

```typescript
// src/components/modals/ExplorarMasModal.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface ExplorarMasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExplorarMasModal({ isOpen, onClose }: ExplorarMasModalProps) {
  const { user } = useAuth();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceOptions = [
    { id: 'consulta_astrologo', label: '🔮 Consulta con astrólogo profesional' },
    { id: 'compatibilidad', label: '💕 Interpretación de compatibilidad (pareja)' },
    { id: 'carta_hijos', label: '👶 Carta natal de hijos' },
    { id: 'relaciones_familiares', label: '👨‍👩‍👧 Análisis de relaciones familiares' },
    { id: 'vocacional', label: '💼 Orientación vocacional/profesional' },
    { id: 'suenos', label: '🌙 Interpretación de sueños y símbolos' },
    { id: 'otro', label: '✨ Otro (especificar en el mensaje)' }
  ];

  const handleSubmit = async () => {
    // Implementación del envío
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
        {/* Formulario */}
      </div>
    </>
  );
}
```

---

### 2. API Endpoint: `/api/service-requests`

```typescript
// src/app/api/service-requests/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ServiceRequest from '@/models/ServiceRequest';

export async function POST(request: NextRequest) {
  // 1. Autenticar usuario
  // 2. Validar datos
  // 3. Guardar en MongoDB
  // 4. Enviar email al admin (opcional)
  // 5. Retornar confirmación
}

export async function GET(request: NextRequest) {
  // Para el panel admin: listar solicitudes
}
```

---

### 3. Modelo MongoDB: `ServiceRequest.ts`

```typescript
// src/models/ServiceRequest.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceRequest extends Document {
  userId: string;
  userEmail: string;
  serviceType: string[];
  customMessage: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

const ServiceRequestSchema = new Schema<IServiceRequest>({
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true },
  serviceType: [{ type: String, required: true }],
  customMessage: { type: String, required: true, maxlength: 500 },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  notes: { type: String },
  resolvedAt: { type: Date },
  resolvedBy: { type: String }
}, {
  timestamps: true
});

export default mongoose.models.ServiceRequest || mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);
```

---

## 🎨 Diseño UX/UI

### Estados del Modal

1. **Estado Inicial**: Formulario vacío con opciones
2. **Estado Loading**: Spinner mientras se envía
3. **Estado Success**: Mensaje de confirmación
4. **Estado Error**: Mensaje de error con opción de reintentar

### Confirmación de Envío

```
┌─────────────────────────────────────────────────────┐
│  ✅ ¡Solicitud Enviada!                              │
│                                                      │
│  Hemos recibido tu solicitud de:                    │
│  • Consulta con astrólogo profesional               │
│  • Interpretación de compatibilidad                 │
│                                                      │
│  Te contactaremos en las próximas 24-48 horas       │
│  al email: user@example.com                         │
│                                                      │
│  Mientras tanto, puedes:                            │
│  → Explorar tu Carta Natal                          │
│  → Ver tu Retorno Solar                             │
│  → Revisar tu Agenda Cósmica                        │
│                                                      │
│  [  Cerrar  ]                                       │
└─────────────────────────────────────────────────────┘
```

---

## 📧 Sistema de Notificaciones

### Email al Admin (cuando se recibe solicitud)

**Asunto**: Nueva solicitud de servicio - Tu Vuelta al Sol

**Cuerpo**:
```
Nueva Solicitud de Servicio Personalizado

Usuario: nombre@email.com (UserID: xyz123)
Fecha: 16/01/2026 - 10:30

Servicios solicitados:
✓ Consulta con astrólogo profesional
✓ Interpretación de compatibilidad (pareja)

Mensaje del usuario:
"Me gustaría explorar la compatibilidad con mi pareja y entender mejor cómo nuestras cartas interactúan..."

Contacto:
Email: nombre@email.com
Teléfono: +34 600 000 000

[Ver en Panel Admin] [Marcar como Contactado]
```

### Email al Usuario (confirmación)

**Asunto**: Tu solicitud ha sido recibida - Tu Vuelta al Sol

**Cuerpo**:
```
Hola [Nombre],

Hemos recibido tu solicitud de servicios personalizados.

Servicios seleccionados:
• Consulta con astrólogo profesional
• Interpretación de compatibilidad (pareja)

Nuestro equipo revisará tu solicitud y te contactará en las próximas 24-48 horas al email proporcionado.

Mientras tanto, puedes seguir explorando tu carta natal y agenda cósmica en tu panel.

Con luz y consciencia,
Equipo Tu Vuelta al Sol ✨
```

---

## 🔐 Panel Admin

### Nueva Sección: Solicitudes de Servicio

```
/admin/service-requests

┌─────────────────────────────────────────────────────┐
│  Solicitudes de Servicio  [Filtros ▼] [Exportar]   │
│                                                      │
│  ⏳ Pendientes (5)  ✅ Contactados (3)  🎯 Completadas (12)  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🟡 PENDIENTE                                  │  │
│  │ user@example.com • Hace 2 horas              │  │
│  │ Servicios: Consulta astrólogo, Compatibilidad│  │
│  │ "Me gustaría explorar la compatibilidad..."  │  │
│  │ [Contactar] [Ver Detalles] [Marcar Spam]    │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │ 🟢 CONTACTADO                                 │  │
│  │ otro@example.com • Hace 1 día                │  │
│  │ Servicios: Carta hijos                        │  │
│  │ Nota: "Enviado presupuesto por email"        │  │
│  │ [Marcar Completado] [Ver Detalles]          │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Roadmap de Implementación

### Fase 1: MVP (1-2 semanas)
- [ ] Crear componente `ExplorarMasModal.tsx`
- [ ] Crear modelo `ServiceRequest.ts`
- [ ] Crear API endpoint `/api/service-requests`
- [ ] Integrar modal en botón "Explorar Más"
- [ ] Testing básico

### Fase 2: Admin Panel (1 semana)
- [ ] Vista admin de solicitudes
- [ ] Filtros y búsqueda
- [ ] Marcar estados (pendiente/contactado/completado)
- [ ] Agregar notas internas

### Fase 3: Notificaciones (1 semana)
- [ ] Email al admin cuando llega solicitud
- [ ] Email de confirmación al usuario
- [ ] Email de seguimiento (24-48h después si no contactado)

### Fase 4: Analytics (opcional)
- [ ] Dashboard de métricas de solicitudes
- [ ] Tipos de servicios más solicitados
- [ ] Tiempo promedio de respuesta
- [ ] Tasa de conversión

---

## 💡 Ideas Adicionales Futuras

### 1. Integración con Calendly
- Permitir agendar citas directamente desde el modal
- Sincronizar disponibilidad del astrólogo

### 2. Sistema de Pagos
- Integrar Stripe para servicios premium
- Paquetes predefinidos con precios

### 3. Chat en Vivo
- Para consultas rápidas antes de solicitar servicio completo

### 4. Marketplace de Astrólogos
- Múltiples astrólogos disponibles
- Perfiles, reviews, especialidades
- Sistema de reservas

### 5. Video Consultas
- Integración con Zoom/Google Meet
- Grabación de sesiones

---

## 📋 Checklist de Validación

Antes de implementar, validar:

- [ ] ¿Los usuarios realmente quieren estos servicios?
- [ ] ¿Tenemos capacidad para atender las solicitudes?
- [ ] ¿Cuál es el modelo de negocio? (Gratis vs Pago)
- [ ] ¿Necesitamos términos y condiciones adicionales?
- [ ] ¿GDPR/privacidad: cómo manejamos los datos?
- [ ] ¿Quién será responsable de responder las solicitudes?

---

## 🎯 KPIs a Medir

1. **Número de solicitudes por semana**
2. **Tipo de servicios más solicitados**
3. **Tiempo promedio de primera respuesta**
4. **Tasa de conversión** (solicitudes → servicios contratados)
5. **Satisfacción del usuario** (encuesta post-servicio)

---

## 📝 Notas de Diseño

### Colores Sugeridos
- Botón CTA: Gradiente purple-to-pink (actual)
- Modal: Dark theme con gradientes cósmicos
- Estados: 🟡 Pendiente (yellow) | 🟢 Contactado (green) | ⚪ Completado (gray)

### Iconos
- 🔮 Consulta astrólogo
- 💕 Compatibilidad
- 👶 Carta hijos
- 👨‍👩‍👧 Relaciones familiares
- 💼 Vocacional
- 🌙 Sueños
- ✨ Otro

---

## 🔗 Referencias

- [Calendly API](https://developer.calendly.com/)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [SendGrid Email API](https://docs.sendgrid.com/)
- [Twilio for SMS](https://www.twilio.com/docs)

---

**Última actualización**: 2026-01-16
**Autor**: Claude Code
**Estado**: Propuesta para revisión y aprobación
