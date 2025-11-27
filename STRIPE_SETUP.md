# 🚀 Guía de Configuración de Stripe

## 1. Crear Cuenta en Stripe

1. Ve a [stripe.com](https://stripe.com) y crea una cuenta
2. Activa el modo de pruebas (test mode)

## 2. Obtener las Claves API

En el Dashboard de Stripe:

1. Ve a **Developers > API keys**
2. Copia la **Publishable key** (pk_test_...)
3. Copia la **Secret key** (sk_test_...)

## 3. Crear Precio de Suscripción

1. Ve a **Products** en el Dashboard
2. Crea un nuevo producto (ej: "Suscripción Mensual")
3. Añade un precio (ej: €9.99/mes)
4. Copia el **Price ID** (price_xxxxxxxxx)

## 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# Domain
NEXT_PUBLIC_DOMAIN=https://tu-dominio.vercel.app
```

## 5. Configurar Webhook

1. Ve a **Developers > Webhooks** en Stripe
2. Añade endpoint: `https://tu-dominio.vercel.app/api/webhook`
3. Selecciona eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
4. Copia el **Webhook signing secret** al `.env.local`

## 6. Actualizar Código

En `src/app/api/subscription/route.ts`, reemplaza `price_xxxxxxxxx` con tu Price ID real.

## 7. Probar

1. Ve a `/test-payments` para probar los botones
2. Usa tarjetas de prueba de Stripe:
   - **Éxito**: `4242 4242 4242 4242`
   - **Declinar**: `4000 0000 0000 0002`

## 🎯 Endpoints Disponibles

- `POST /api/checkout` - Pago único (€15)
- `POST /api/subscription` - Suscripción mensual
- `POST /api/webhook` - Webhook de Stripe

## 📱 Componentes

```tsx
import PaymentButton, { SubscriptionButton } from '@/components/PaymentButton';

// Pago único
<PaymentButton />

// Suscripción
<SubscriptionButton />
```

¡Listo! Tu integración de Stripe está completa. 🎉
