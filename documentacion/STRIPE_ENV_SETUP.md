# 🚀 Configuración Profesional de Variables de Entorno - Stripe

## 📋 **Paso 1: Obtener Claves de Stripe**

### **Para Desarrollo Local (Test Mode):**
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Asegúrate de estar en **modo TEST** (arriba derecha)
3. Copia:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### **Para Producción (Live Mode):**
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Cambia a **modo LIVE** (arriba derecha)
3. Copia:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`

## 🔧 **Paso 2: Configurar Variables de Entorno**

### **❌ SECRETAS (NO llevan NEXT_PUBLIC_)**
Estas **NUNCA** deben exponerse al navegador:
- `STRIPE_SECRET_KEY` (sk_test_..., sk_live_...)
- `STRIPE_WEBHOOK_SECRET` (whsec_...)

### **✔ PÚBLICAS (PUEDEN llevar NEXT_PUBLIC_)**
Estas sí pueden exponerse (solo identifican precios):
- `NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_VIP_PLAN_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_AGENDA_DIGITAL_PRICE_ID`

### **Archivo `.env.local` (Desarrollo Local - Test Mode)**

```env
# ========== STRIPE - TEST MODE (Desarrollo) ==========
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# ========== STRIPE - PRICE IDs (Test Products) ==========
NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID=price_1SY6ksKpDmcm0ATyFFS3MRm7
NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID=price_1SY6myKpDmcm0ATyGg4SolM0
NEXT_PUBLIC_STRIPE_VIP_PLAN_PRICE_ID=price_1SY6oIKpDmcm0ATys7o2AcAR
NEXT_PUBLIC_STRIPE_AGENDA_DIGITAL_PRICE_ID=price_1SY7MNKpDmcm0ATymEIjxzcn
```

### **Variables de Producción en Vercel**

En tu dashboard de Vercel → Project → Settings → Environment Variables:

```env
# ========== STRIPE - LIVE MODE (Producción) ==========
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_live_...

# ========== STRIPE - PRICE IDs (Live Products) ==========
NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID=price_live_...
NEXT_PUBLIC_STRIPE_PREMIUM_PLAN_PRICE_ID=price_live_...
NEXT_PUBLIC_STRIPE_VIP_PLAN_PRICE_ID=price_live_...
NEXT_PUBLIC_STRIPE_AGENDA_DIGITAL_PRICE_ID=price_live_...
```

## 🎯 **Paso 3: Configurar Webhooks**

### **Desarrollo Local:**
```bash
# Instala Stripe CLI y ejecuta:
stripe listen --forward-to localhost:3000/api/webhook
# Te dará un webhook secret temporal
```

### **Webhook Handler (MongoDB):**
```typescript
// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import Payment from '@/models/Payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await Payment.create({
        stripeSessionId: session.id,
        stripeCustomerId: session.customer,
        amountTotal: session.amount_total,
        currency: session.currency,
        status: session.payment_status,
        userId: session.metadata?.userId,
        createdAt: new Date(),
      });
      break;
  }

  return NextResponse.json({ received: true });
}
```

## ✅ **Paso 4: Verificación**

Ejecuta este comando para verificar:

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
console.log('🔍 Verificación Profesional:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅' : '❌');
console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅' : '❌');
console.log('NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID:', process.env.NEXT_PUBLIC_STRIPE_BASIC_PLAN_PRICE_ID ? '✅' : '❌');
console.log('Modo:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST ✅' : 'LIVE ⚠️');
console.log('NEXT_PUBLIC_ correcto:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_STRIPE') && !k.includes('SECRET')).length === 4 ? '✅' : '❌');
"
```

## 🚀 **Paso 5: Deploy Seguro**

1. **Nunca commits .env files** (ya están en .gitignore)
2. **Local → siempre test keys**
3. **Vercel → siempre live keys**
4. **Price IDs diferentes** entre test/live
5. **Webhooks apuntando correctamente**

## 📊 **MongoDB Schema para Pagos**

```typescript
// models/Payment.ts
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  stripeSessionId: { type: String, required: true, unique: true },
  stripeCustomerId: String,
  amountTotal: Number,
  currency: String,
  status: String,
  userId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', PaymentSchema);
```

## 🧠 **Buenas Prácticas**

- ✅ **Price IDs con NEXT_PUBLIC_**: Correcto y recomendado
- ❌ **Secret keys con NEXT_PUBLIC_**: NUNCA
- ✅ **Webhooks manejan estado**: No confíes en frontend
- ✅ **Separa test/live**: Nunca mezcles entornos
- ✅ **Guarda solo lo necesario**: session.id, customer, amount, status

¿Necesitas ayuda implementando algún paso específico?
