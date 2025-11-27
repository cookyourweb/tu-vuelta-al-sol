# 🎯 GUÍA: Crear Productos en Stripe Dashboard

## Producto 1: Agenda Astrológica Digital (€15)

### Paso a Paso:
1. Ve a: https://dashboard.stripe.com/products
2. Click en "Add product"
3. Completa:
   - **Name**: Agenda Astrológica Digital Personalizada
   - **Description**: Tu agenda cósmica con eventos personalizados basada en tu carta natal. Incluye PDF descargable e integración con Google Calendar.
   - **Pricing**:
     - Amount: €15.00
     - Billing: One time
     - Currency: EUR
   - **Tax category**: Digital goods
   - **Statement descriptor**: TU VUELTA AL SOL

4. Click "Save product"
5. **COPIA EL PRICE ID** → Empieza con `price_...`

---

## Producto 2: Suscripción Premium Mensual (€9.99/mes) - OPCIONAL

### Paso a Paso:
1. Click en "Add product"
2. Completa:
   - **Name**: Suscripción Premium - Tu Vuelta al Sol
   - **Description**: Acceso a agenda mensual automática, actualizaciones de tránsitos y rituales exclusivos.
   - **Pricing**:
     - Amount: €9.99
     - Billing: Recurring - Monthly
     - Currency: EUR
   - **Tax category**: Digital goods
   - **Statement descriptor**: TU VUELTA AL SOL

3. Click "Save product"
4. **COPIA EL PRICE ID** → `price_...`

---

## 📦 FUTUROS PRODUCTOS FÍSICOS (Cuando estés listo):

### Producto 3: Kit de Rituales Personalizado (€35)
- Name: Kit de Rituales Astrológicos Personalizado
- Description: Velas, cristales y guía de rituales según tu carta natal
- Pricing: €35.00 (one-time)
- **Tax category**: Physical goods
- **Shipping**: Enabled
- Statement descriptor: TU VUELTA AL SOL

### Producto 4: Vela Astrológica Individual (€12)
- Name: Vela Astrológica Personalizada
- Description: Vela creada según tu signo solar/lunar con aromas y colores personalizados
- Pricing: €12.00 (one-time)
- Tax category: Physical goods
- Shipping: Enabled

---

## 🔧 Después de crear los productos:

### Paso 1: Copiar Price IDs
Cada producto tendrá un Price ID único. Ejemplo:
- Agenda Digital: `price_1A2B3C4D5E6F7G8H`
- Suscripción: `price_9I8J7K6L5M4N3O2P`

### Paso 2: Actualizar .env.local
Añade los Price IDs en tu archivo .env.local:

```bash
# Productos
STRIPE_AGENDA_DIGITAL_PRICE_ID=price_TU_ID_AQUI
STRIPE_SUBSCRIPTION_PRICE_ID=price_TU_ID_AQUI
STRIPE_KIT_RITUALES_PRICE_ID=price_TU_ID_AQUI (cuando lo crees)
STRIPE_VELA_PRICE_ID=price_TU_ID_AQUI (cuando lo crees)
```

### Paso 3: Configurar Webhook
- URL: https://tu-dominio.vercel.app/api/webhook
- Eventos necesarios:
  - ✅ checkout.session.completed
  - ✅ customer.subscription.created
  - ✅ customer.subscription.updated
  - ✅ customer.subscription.deleted
  - ✅ payment_intent.succeeded (para productos físicos)

---

## 💡 RECOMENDACIONES:

### Para productos digitales (Agenda):
- Activa "Automatically send receipt emails"
- Configura email de contacto en Settings
- Añade términos y condiciones

### Para productos físicos (cuando los añadas):
- Activa "Collect shipping address"
- Configura zonas de envío (España, EU, etc.)
- Añade costos de envío si aplica
- Integra con sistema de fulfillment

### Precios psicológicos recomendados:
- Agenda Digital: €15 (precio de entrada accesible)
- Suscripción: €9.99/mes (menos de €10 psicológico)
- Kit Rituales: €35 (premium pero razonable)
- Velas: €12 (impulse buy)
- Bundle (Agenda + Kit): €45 (ahorro €5)

---

## 🎁 BUNDLES FUTUROS (Mayor valor):

Cuando tengas productos físicos, crea bundles:

### Bundle Completo (€45 - ahorro €5)
- Agenda Digital
- Kit Rituales básico
- 1 Vela personalizada

### Bundle Premium (€75 - ahorro €15)
- Agenda Digital
- Kit Rituales completo
- 3 Velas personalizadas
- Consulta 30 min
