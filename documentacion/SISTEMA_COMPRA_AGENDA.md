# Sistema de Compra de Agenda Astrológica

**Última actualización:** 2025-12-09
**Estado:** En desarrollo

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Productos](#productos)
3. [Datos Requeridos](#datos-requeridos)
4. [Flujos de Compra](#flujos-de-compra)
5. [Estructura de Datos](#estructura-de-datos)
6. [API Endpoints](#api-endpoints)
7. [Páginas](#páginas)
8. [Panel Admin](#panel-admin)
9. [Emails](#emails)
10. [Fases de Implementación](#fases-de-implementación)

---

## 🎯 Visión General

Sistema de e-commerce para venta de Agenda Astrológica Personalizada en dos formatos:
- **Digital**: Acceso online inmediato (cuando esté desarrollada)
- **Física**: Libro impreso y enviado a domicilio + acceso digital

### Características principales:
- ✅ Compra para uno mismo o como regalo
- ✅ Regalos digitales (destinatario completa datos)
- ✅ Regalos físicos (comprador completa datos, se envía a destinatario)
- ✅ Código de activación para acceso digital
- ✅ Gestión manual de pedidos físicos (imprenta + envío)
- ✅ Panel admin para fulfillment

---

## 💰 Productos

### **Agenda Digital**
- **Precio:** 29€
- **Price ID Stripe:** `price_1ScNTX38AWMGo4dl1cKJrv3y`
- **Variable env:** `NEXT_PUBLIC_STRIPE_AGENDA_DIGITAL_PRICE_ID`
- **Entrega:** Inmediata (acceso online cuando esté lista)
- **SKU:** `agenda-digital`

### **Agenda Física (Libro)**
- **Precio:** 80€ (incluye envío península)
- **Price ID Stripe:** `price_1ScLUZ38AWMGo4dlG0l4xn8b`
- **Variable env:** `NEXT_PUBLIC_STRIPE_AGENDA_LIBRO_PRICE_ID`
- **Entrega:** 5-7 días (impresión bajo demanda + envío)
- **SKU:** `agenda-libro`
- **Incluye:** Libro físico + acceso digital

---

## 📝 Datos Requeridos

### **Datos de Nacimiento**
```typescript
{
  name: string,              // "María García López"
  birthDate: string,         // "1990-05-15"
  birthTime: string,         // "14:30"
  birthPlace: string,        // "Madrid, España"
  birthLat: number,          // 40.4168
  birthLng: number           // -3.7038
}
```

### **Lugar de Residencia Actual** ⭐ **NUEVO**
```typescript
{
  currentCity: string,       // "Barcelona"
  currentCountry: string,    // "España"
  currentLat: number,        // 41.3851
  currentLng: number         // 2.1734
}
```

### **Dirección de Envío** (solo para físicos)
```typescript
{
  fullName: string,          // "María García López"
  address: string,           // "Calle Mayor 15, 2º B"
  city: string,              // "Barcelona"
  postalCode: string,        // "08001"
  province: string,          // "Barcelona"
  country: string,           // "España"
  phone: string              // "+34 666 777 888"
}
```

---

## 🔄 Flujos de Compra

### **Flujo 1: Digital - Para mí**
```
1. Usuario selecciona "Agenda Digital" (29€)
2. Selecciona "Para mí"
3. Completa formulario:
   ├─ Datos de nacimiento (6 campos)
   └─ Lugar de residencia actual (4 campos)
4. Pago con Stripe
5. ✅ Confirmación:
   ├─ Email con código de activación
   ├─ Guardado en BD
   └─ Mensaje: "Tu agenda estará lista pronto"
6. Cuando agenda esté desarrollada → acceso con código
```

### **Flujo 2: Digital - Regalo**
```
1. Usuario selecciona "Agenda Digital" (29€)
2. Selecciona "Es un regalo"
3. Completa formulario:
   ├─ Email del destinatario
   └─ Mensaje de regalo (opcional)
4. Pago con Stripe
5. ✅ Confirmación:
   ├─ Email al destinatario con código de activación
   ├─ Email al comprador confirmando regalo
   └─ Guardado en BD (status: pending_data)
6. Destinatario accede a /activar/[codigo]
7. Destinatario completa:
   ├─ Datos de nacimiento (6 campos)
   └─ Lugar de residencia actual (4 campos)
8. Status cambia a: ready (esperando desarrollo agenda)
```

### **Flujo 3: Física - Para mí**
```
1. Usuario selecciona "Agenda Física" (80€)
2. Selecciona "Para mí"
3. Completa formulario:
   ├─ Datos de nacimiento (6 campos)
   ├─ Lugar de residencia actual (4 campos)
   └─ Dirección de envío (7 campos)
4. Pago con Stripe
5. ✅ Confirmación:
   ├─ Email confirmación con código de activación
   ├─ Guardado en BD (status: pending_fulfillment)
   └─ Aparece en panel admin
6. [ADMIN] Ve pedido en panel
7. [ADMIN] Cuando agenda esté lista → genera PDF
8. [ADMIN] Envía a imprenta con datos del pedido
9. [ADMIN] Cuando recibe libro impreso:
   ├─ Imprime tarjeta de activación
   └─ Empaqueta y envía
10. [ADMIN] Marca como "Enviado" + tracking number
11. Email al usuario: "Tu pedido ha sido enviado 📦"
12. Usuario recibe libro + tarjeta con código
```

### **Flujo 4: Física - Regalo (Opción A: Tengo los datos)**
```
1. Usuario selecciona "Agenda Física" (80€)
2. Selecciona "Es un regalo"
3. Selecciona "Tengo los datos del destinatario"
4. Completa formulario:
   ├─ Datos de nacimiento del DESTINATARIO (6 campos)
   ├─ Lugar de residencia actual del DESTINATARIO (4 campos)
   ├─ Dirección de envío del DESTINATARIO (7 campos)
   └─ Mensaje de regalo (opcional)
5. Pago con Stripe
6. ✅ Confirmación:
   ├─ Email al comprador confirmando regalo
   ├─ Guardado en BD (status: pending_fulfillment)
   └─ Aparece en panel admin
7-12. [Igual que Flujo 3, pero se envía al destinatario]
```

### **Flujo 5: Física - Regalo (Opción B: Destinatario completa datos)**
```
1. Usuario selecciona "Agenda Física" (80€)
2. Selecciona "Es un regalo"
3. Selecciona "El destinatario completará los datos"
4. Completa formulario:
   ├─ Email del destinatario
   ├─ Dirección de envío del DESTINATARIO (7 campos)
   └─ Mensaje de regalo (opcional)
5. Pago con Stripe
6. ✅ Confirmación:
   ├─ Email al comprador confirmando regalo
   ├─ Email al destinatario con link activación
   ├─ Guardado en BD (status: pending_data)
   └─ NO aparece en panel admin aún
7. Destinatario accede a /activar/[codigo]
8. Destinatario completa:
   ├─ Datos de nacimiento (6 campos)
   └─ Lugar de residencia actual (4 campos)
9. Status cambia a: pending_fulfillment
10. AHORA aparece en panel admin
11-12. [Igual que Flujo 3]
```

---

## 💾 Estructura de Datos

### **Colección: `agenda_orders`**

```typescript
{
  // Identificación
  orderId: string,                    // "AG-2025-001"
  activationCode: string,             // "ABC123XYZ" (único)

  // Producto
  productType: "digital" | "physical",
  productSku: "agenda-digital" | "agenda-libro",
  price: 29 | 80,
  currency: "EUR",

  // Tipo de compra
  purchaseType: "for_me" | "gift",

  // Comprador
  buyerId: string | null,             // Firebase UID (si está logueado)
  buyerEmail: string,                 // "comprador@mail.com"

  // Destinatario (si es regalo)
  isGift: boolean,
  recipientEmail: string | null,      // "maria@mail.com"
  recipientName: string | null,       // "María García"
  giftMessage: string | null,         // "¡Feliz cumpleaños!"

  // Datos astrológicos (pueden estar null si pending_data)
  birthData: {
    name: string,                     // "María García López"
    birthDate: string,                // "1990-05-15"
    birthTime: string,                // "14:30"
    birthPlace: string,               // "Madrid, España"
    birthLat: number,                 // 40.4168
    birthLng: number                  // -3.7038
  } | null,

  // Residencia actual ⭐ NUEVO
  currentResidence: {
    city: string,                     // "Barcelona"
    country: string,                  // "España"
    lat: number,                      // 41.3851
    lng: number                       // 2.1734
  } | null,

  // Dirección de envío (solo si productType === "physical")
  shippingAddress: {
    fullName: string,                 // "María García López"
    address: string,                  // "Calle Mayor 15, 2º B"
    city: string,                     // "Barcelona"
    postalCode: string,               // "08001"
    province: string,                 // "Barcelona"
    country: string,                  // "España"
    phone: string                     // "+34666777888"
  } | null,

  // Estado del pedido
  status: "pending_data" |            // Esperando datos (regalo sin completar)
          "ready" |                   // Datos completos, esperando desarrollo agenda
          "pending_fulfillment" |     // Físico: listo para imprimir
          "printing" |                // Físico: en imprenta
          "shipped" |                 // Físico: enviado
          "delivered" |               // Físico: entregado
          "completed",                // Digital: activado y acceso dado

  // Activación digital
  digitalActivated: boolean,
  digitalActivatedAt: Date | null,

  // Fulfillment (solo físicos)
  pdfGenerated: boolean,
  pdfUrl: string | null,              // URL del PDF cuando se genere

  // Tracking (solo físicos)
  trackingNumber: string | null,      // "PKG123456789ES"
  carrier: string | null,             // "Correos" | "SEUR"
  shippedAt: Date | null,
  estimatedDelivery: string | null,   // "2025-12-16"
  deliveredAt: Date | null,

  // Pago
  stripeSessionId: string,            // "cs_..."
  stripePaymentIntentId: string,      // "pi_..."
  paid: boolean,
  paidAt: Date,

  // Metadatos
  createdAt: Date,
  updatedAt: Date,
  notes: string | null                // Notas admin
}
```

### **Índices necesarios:**
```typescript
// MongoDB
db.agenda_orders.createIndex({ activationCode: 1 }, { unique: true });
db.agenda_orders.createIndex({ buyerEmail: 1 });
db.agenda_orders.createIndex({ recipientEmail: 1 });
db.agenda_orders.createIndex({ status: 1 });
db.agenda_orders.createIndex({ productType: 1, status: 1 });
db.agenda_orders.createIndex({ createdAt: -1 });
```

---

## 🔌 API Endpoints

### **POST `/api/agenda/checkout`**
Crear sesión de checkout de Stripe

**Request:**
```typescript
{
  productType: "digital" | "physical",
  purchaseType: "for_me" | "gift",

  // Si for_me o gift con datos
  birthData?: {
    name: string,
    birthDate: string,
    birthTime: string,
    birthPlace: string,
    birthLat: number,
    birthLng: number
  },
  currentResidence?: {
    city: string,
    country: string,
    lat: number,
    lng: number
  },

  // Si gift
  recipientEmail?: string,
  giftMessage?: string,

  // Si physical
  shippingAddress?: {
    fullName: string,
    address: string,
    city: string,
    postalCode: string,
    province: string,
    country: string,
    phone: string
  },

  // Usuario actual
  userId?: string,
  userEmail: string,

  // URLs
  successUrl: string,
  cancelUrl: string
}
```

**Response:**
```typescript
{
  sessionId: string,
  url: string  // Redirect URL para Stripe Checkout
}
```

---

### **POST `/api/agenda/activate`**
Activar código y completar datos (para regalos digitales)

**Request:**
```typescript
{
  activationCode: string,
  birthData: {
    name: string,
    birthDate: string,
    birthTime: string,
    birthPlace: string,
    birthLat: number,
    birthLng: number
  },
  currentResidence: {
    city: string,
    country: string,
    lat: number,
    lng: number
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  order: {
    orderId: string,
    status: string,
    message: string
  }
}
```

---

### **GET `/api/agenda/order/[orderId]`**
Obtener detalles de un pedido

**Auth:** Usuario debe ser el comprador o admin

**Response:**
```typescript
{
  order: AgendaOrder  // Objeto completo
}
```

---

### **POST `/api/admin/agenda/orders/[orderId]/ship`**
Marcar pedido como enviado

**Auth:** Solo admin

**Request:**
```typescript
{
  trackingNumber: string,
  carrier: string,
  estimatedDelivery?: string
}
```

**Response:**
```typescript
{
  success: boolean,
  order: AgendaOrder
}
```

---

### **GET `/api/admin/agenda/orders`**
Listar pedidos (con filtros)

**Auth:** Solo admin

**Query params:**
- `status` - Filtrar por estado
- `productType` - Filtrar por tipo de producto
- `limit` - Número de resultados
- `offset` - Paginación

**Response:**
```typescript
{
  orders: AgendaOrder[],
  total: number,
  hasMore: boolean
}
```

---

### **POST `/api/webhooks/stripe`** (Webhook)
Recibir eventos de Stripe

**Eventos manejados:**
- `checkout.session.completed` - Pago completado
  - Crear registro en `agenda_orders`
  - Generar código de activación
  - Enviar emails correspondientes

---

## 📄 Páginas

### **1. `/compra/agenda` - Página de Compra**

**Secciones:**

#### **A. Selector de Producto**
```tsx
<div className="product-selector">
  <ProductCard
    type="digital"
    price={29}
    features={[
      "Acceso online inmediato",
      "Visualiza en todos tus dispositivos",
      "Actualizaciones incluidas"
    ]}
  />

  <ProductCard
    type="physical"
    price={80}
    badge="MÁS POPULAR"
    features={[
      "Libro impreso profesionalmente",
      "Encuadernación de calidad",
      "Envío incluido (península)",
      "+ Acceso digital"
    ]}
  />
</div>
```

#### **B. Selector de Destinatario**
```tsx
<div className="recipient-selector">
  <RadioGroup>
    <Radio value="for_me">Para mí</Radio>
    <Radio value="gift">Es un regalo</Radio>
  </RadioGroup>
</div>
```

#### **C. Formulario Condicional**

**Si "Para mí" O "Regalo con datos":**
```tsx
<BirthDataForm>
  <Input name="name" label="Nombre completo" />
  <Input name="birthDate" label="Fecha de nacimiento" type="date" />
  <Input name="birthTime" label="Hora de nacimiento" type="time" />
  <LocationPicker name="birthPlace" label="Lugar de nacimiento" />
</BirthDataForm>

<CurrentResidenceForm>
  <Input name="currentCity" label="Ciudad donde vives actualmente" />
  <Input name="currentCountry" label="País" />
  <LocationPicker name="currentLocation" />
</CurrentResidenceForm>
```

**Si "Regalo digital sin datos":**
```tsx
<GiftForm>
  <Input name="recipientEmail" label="Email del destinatario" />
  <Textarea name="giftMessage" label="Mensaje de regalo (opcional)" />
</GiftForm>
```

**Si producto físico:**
```tsx
<ShippingForm>
  <Input name="fullName" label="Nombre completo" />
  <Input name="address" label="Dirección" />
  <Input name="city" label="Ciudad" />
  <Input name="postalCode" label="Código postal" />
  <Input name="province" label="Provincia" />
  <Input name="country" label="País" />
  <Input name="phone" label="Teléfono" />
</ShippingForm>
```

#### **D. Botón de Pago**
```tsx
<PaymentButton
  productType={selectedProduct}
  onCheckout={handleCheckout}
/>
```

---

### **2. `/compra/agenda/success` - Confirmación**

**Contenido según tipo:**

#### **Digital - Para mí:**
```tsx
<SuccessPage>
  <Icon>✅</Icon>
  <Title>¡Pago confirmado!</Title>
  <Message>
    Tu Agenda Astrológica Digital está en camino.
    Recibirás un email cuando esté lista para acceder.
  </Message>

  <ActivationCard>
    <Label>Tu código de activación:</Label>
    <Code>ABC-123-XYZ</Code>
    <Button>Copiar código</Button>
  </ActivationCard>

  <InfoBox>
    Estamos trabajando en tu agenda personalizada.
    Recibirás un email en cuanto esté lista.
  </InfoBox>

  <Actions>
    <Button href="/dashboard">Ir al Dashboard</Button>
    <Button href="/" variant="secondary">Volver al inicio</Button>
  </Actions>
</SuccessPage>
```

#### **Digital - Regalo:**
```tsx
<SuccessPage>
  <Icon>🎁</Icon>
  <Title>¡Regalo enviado!</Title>
  <Message>
    Hemos enviado un email a {recipientEmail} con
    instrucciones para activar su regalo.
  </Message>

  <GiftDetails>
    <Label>Destinatario:</Label>
    <Value>{recipientEmail}</Value>

    <Label>Código de activación:</Label>
    <Value>ABC-123-XYZ</Value>
  </GiftDetails>

  <InfoBox>
    El destinatario podrá completar sus datos y
    recibirá acceso cuando la agenda esté lista.
  </InfoBox>
</SuccessPage>
```

#### **Físico - Para mí:**
```tsx
<SuccessPage>
  <Icon>📦</Icon>
  <Title>¡Pedido confirmado!</Title>

  <OrderDetails>
    <Label>Nº Pedido:</Label>
    <Value>#AG-2025-001</Value>

    <Label>Estado:</Label>
    <Status>Pendiente de producción</Status>

    <Label>Envío estimado:</Label>
    <Value>5-7 días hábiles</Value>
  </OrderDetails>

  <ShippingInfo>
    <Label>Envío a:</Label>
    <Address>{fullAddress}</Address>
  </ShippingInfo>

  <ActivationCard>
    <Title>Acceso digital incluido</Title>
    <Label>Tu código:</Label>
    <Code>ABC-123-XYZ</Code>
    <Message>
      También recibirás este código con tu libro.
      Podrás acceder online cuando esté listo.
    </Message>
  </ActivationCard>

  <Actions>
    <Button href="/pedidos/AG-2025-001">Ver estado del pedido</Button>
    <Button href="/" variant="secondary">Volver al inicio</Button>
  </Actions>
</SuccessPage>
```

#### **Físico - Regalo:**
```tsx
<SuccessPage>
  <Icon>🎁📦</Icon>
  <Title>¡Regalo confirmado!</Title>

  <Message>
    Tu regalo será impreso y enviado a {recipientName}.
  </Message>

  <OrderDetails>
    <Label>Nº Pedido:</Label>
    <Value>#AG-2025-001</Value>

    <Label>Envío a:</Label>
    <Value>{recipientName}</Value>
    <Address>{fullAddress}</Address>

    <Label>Tu mensaje:</Label>
    <GiftMessage>{giftMessage}</GiftMessage>
  </OrderDetails>

  <InfoBox>
    El libro incluirá:
    • Tu mensaje de regalo
    • Tarjeta con código de acceso digital

    Tiempo estimado: 5-7 días hábiles
  </InfoBox>

  <Actions>
    <Button href="/pedidos/AG-2025-001">Ver estado del pedido</Button>
  </Actions>
</SuccessPage>
```

---

### **3. `/activar/[codigo]` - Activación de Regalo**

**Flujo:**

#### **Paso 1: Validar código**
```tsx
// Automático al cargar página
const order = await validateActivationCode(codigo);

if (!order) {
  return <ErrorPage>Código inválido</ErrorPage>;
}

if (order.status === "completed" || order.digitalActivated) {
  return <AlreadyActivatedPage order={order} />;
}
```

#### **Paso 2: Mostrar formulario**
```tsx
<ActivationPage>
  <Header>
    <Icon>🎁</Icon>
    <Title>¡Activa tu regalo!</Title>
    {order.giftMessage && (
      <GiftMessage>
        <Author>Mensaje de {order.buyerEmail}:</Author>
        <Message>{order.giftMessage}</Message>
      </GiftMessage>
    )}
  </Header>

  <Message>
    Para generar tu Agenda Astrológica necesitamos
    algunos datos sobre ti:
  </Message>

  <Form onSubmit={handleActivate}>
    <BirthDataForm />
    <CurrentResidenceForm />

    <Button type="submit">Activar mi agenda</Button>
  </Form>
</ActivationPage>
```

#### **Paso 3: Confirmación**
```tsx
<ActivationSuccess>
  <Icon>✅</Icon>
  <Title>¡Activación completa!</Title>

  {order.productType === "digital" ? (
    <Message>
      Hemos recibido tus datos. Recibirás un email
      cuando tu agenda esté lista para acceder.
    </Message>
  ) : (
    <Message>
      Hemos recibido tus datos. Tu agenda está siendo
      impresa y será enviada a:

      <Address>{order.shippingAddress}</Address>

      Recibirás un email cuando sea enviada.
    </Message>
  )}

  <Actions>
    <Button href="/dashboard">Ir al Dashboard</Button>
  </Actions>
</ActivationSuccess>
```

---

### **4. `/pedidos/[orderId]` - Estado del Pedido**

```tsx
<OrderStatusPage>
  <Header>
    <BackButton />
    <OrderNumber>Pedido #{orderId}</OrderNumber>
  </Header>

  <StatusTimeline>
    <Step completed={true}>
      <Icon>✅</Icon>
      <Label>Pedido confirmado</Label>
      <Date>{order.createdAt}</Date>
    </Step>

    <Step completed={order.status !== "pending_fulfillment"}>
      <Icon>🖨️</Icon>
      <Label>En producción</Label>
      {order.status === "printing" && <Date>{now}</Date>}
    </Step>

    <Step completed={order.status === "shipped" || order.status === "delivered"}>
      <Icon>📦</Icon>
      <Label>Enviado</Label>
      {order.shippedAt && <Date>{order.shippedAt}</Date>}
      {order.trackingNumber && (
        <TrackingLink href={getTrackingUrl(order.carrier, order.trackingNumber)}>
          Seguir envío: {order.trackingNumber}
        </TrackingLink>
      )}
    </Step>

    <Step completed={order.status === "delivered"}>
      <Icon>🎉</Icon>
      <Label>Entregado</Label>
      {order.deliveredAt && <Date>{order.deliveredAt}</Date>}
    </Step>
  </StatusTimeline>

  <OrderDetails>
    <Section>
      <Title>Detalles del pedido</Title>
      <Detail label="Producto" value={getProductName(order.productType)} />
      <Detail label="Precio" value={`${order.price}€`} />
      <Detail label="Fecha de compra" value={order.createdAt} />
    </Section>

    {order.shippingAddress && (
      <Section>
        <Title>Dirección de envío</Title>
        <Address>{formatAddress(order.shippingAddress)}</Address>
      </Section>
    )}

    {order.estimatedDelivery && (
      <Section>
        <Title>Entrega estimada</Title>
        <Date>{order.estimatedDelivery}</Date>
      </Section>
    )}
  </OrderDetails>

  <DigitalAccess>
    <Title>Acceso digital</Title>
    <Code>{order.activationCode}</Code>
    <Button href={`/activar/${order.activationCode}`}>
      Acceder online
    </Button>
  </DigitalAccess>

  <Support>
    <Message>¿Necesitas ayuda?</Message>
    <Button href="mailto:contacto@tuvueltaalsol.es">
      Contactar soporte
    </Button>
  </Support>
</OrderStatusPage>
```

---

## 👨‍💼 Panel Admin

### **Página: `/admin/pedidos-agenda`**

#### **Vista de Lista:**
```tsx
<AdminPage>
  <Header>
    <Title>Pedidos de Agenda</Title>
    <Stats>
      <Stat label="Pendientes" value={pendingCount} color="orange" />
      <Stat label="En producción" value={printingCount} color="blue" />
      <Stat label="Enviados" value={shippedCount} color="green" />
    </Stats>
  </Header>

  <Filters>
    <Select name="status" options={statusOptions} />
    <Select name="productType" options={productTypeOptions} />
    <DateRangePicker name="dateRange" />
    <SearchInput placeholder="Buscar por email, nombre..." />
  </Filters>

  <OrdersList>
    {orders.map(order => (
      <OrderCard key={order.orderId}>
        <Header>
          <OrderNumber>#{order.orderId}</OrderNumber>
          <StatusBadge status={order.status} />
          <ProductBadge type={order.productType} />
        </Header>

        <CustomerInfo>
          {order.isGift ? (
            <>
              <Label>De:</Label> <Email>{order.buyerEmail}</Email>
              <Label>Para:</Label> <Name>{order.recipientName || order.recipientEmail}</Name>
            </>
          ) : (
            <>
              <Label>Cliente:</Label>
              <Email>{order.buyerEmail}</Email>
            </>
          )}
        </CustomerInfo>

        {order.productType === "physical" && order.shippingAddress && (
          <ShippingInfo>
            <Icon>📍</Icon>
            <Address>{order.shippingAddress.city}, {order.shippingAddress.province}</Address>
          </ShippingInfo>
        )}

        <Footer>
          <Date>{formatDate(order.createdAt)}</Date>
          <Price>{order.price}€</Price>
          <Actions>
            <Button href={`/admin/pedidos-agenda/${order.orderId}`}>
              Ver detalles
            </Button>
          </Actions>
        </Footer>
      </OrderCard>
    ))}
  </OrdersList>

  <Pagination />
</AdminPage>
```

#### **Vista de Detalle: `/admin/pedidos-agenda/[orderId]`**

```tsx
<AdminOrderDetailPage>
  <Header>
    <BackButton />
    <OrderNumber>Pedido #{order.orderId}</OrderNumber>
    <StatusBadge status={order.status} />
  </Header>

  <Grid>
    {/* Columna izquierda */}
    <Column>
      <Card>
        <Title>Cliente</Title>
        <Info>
          <Label>Email comprador:</Label>
          <Value>{order.buyerEmail}</Value>

          {order.isGift && (
            <>
              <Label>Tipo:</Label>
              <Badge>Regalo</Badge>

              <Label>Destinatario:</Label>
              <Value>{order.recipientName || "Pendiente de datos"}</Value>
              <Value>{order.recipientEmail}</Value>

              {order.giftMessage && (
                <>
                  <Label>Mensaje de regalo:</Label>
                  <GiftMessage>{order.giftMessage}</GiftMessage>
                </>
              )}
            </>
          )}

          <Label>Producto:</Label>
          <Value>{getProductName(order.productType)} - {order.price}€</Value>

          <Label>Fecha de compra:</Label>
          <Value>{formatDateTime(order.createdAt)}</Value>

          <Label>Stripe Session:</Label>
          <Link href={`https://dashboard.stripe.com/payments/${order.stripePaymentIntentId}`}>
            Ver en Stripe ↗
          </Link>
        </Info>
      </Card>

      {order.birthData && (
        <Card>
          <Title>Datos Astrológicos</Title>
          <Info>
            <Label>Nombre:</Label>
            <Value>{order.birthData.name}</Value>

            <Label>Fecha de nacimiento:</Label>
            <Value>{formatDate(order.birthData.birthDate)}</Value>

            <Label>Hora:</Label>
            <Value>{order.birthData.birthTime}</Value>

            <Label>Lugar de nacimiento:</Label>
            <Value>{order.birthData.birthPlace}</Value>
            <Value>({order.birthData.birthLat}, {order.birthData.birthLng})</Value>
          </Info>
        </Card>
      )}

      {order.currentResidence && (
        <Card>
          <Title>Residencia Actual</Title>
          <Info>
            <Label>Ciudad:</Label>
            <Value>{order.currentResidence.city}</Value>

            <Label>País:</Label>
            <Value>{order.currentResidence.country}</Value>

            <Label>Coordenadas:</Label>
            <Value>({order.currentResidence.lat}, {order.currentResidence.lng})</Value>
          </Info>
        </Card>
      )}

      {!order.birthData && order.status === "pending_data" && (
        <Card variant="warning">
          <Icon>⏳</Icon>
          <Title>Esperando datos</Title>
          <Message>
            El destinatario aún no ha completado sus datos.
            Se le ha enviado el código de activación a {order.recipientEmail}.
          </Message>
          <Button onClick={resendActivationEmail}>
            Reenviar email de activación
          </Button>
        </Card>
      )}
    </Column>

    {/* Columna derecha */}
    <Column>
      {order.productType === "physical" && (
        <>
          <Card>
            <Title>Dirección de Envío</Title>
            <Address>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
              {order.shippingAddress.province}<br />
              {order.shippingAddress.country}<br />
              Tel: {order.shippingAddress.phone}
            </Address>
            <Button onClick={copyAddress}>
              Copiar dirección
            </Button>
          </Card>

          <Card>
            <Title>Archivos</Title>

            {order.pdfGenerated ? (
              <>
                <FileItem>
                  <Icon>📄</Icon>
                  <FileName>agenda-{order.orderId}.pdf</FileName>
                  <FileSize>{order.pdfSize}</FileSize>
                  <Actions>
                    <Button href={order.pdfUrl} download>
                      Descargar
                    </Button>
                    <Button href={order.pdfUrl} target="_blank">
                      Ver
                    </Button>
                  </Actions>
                </FileItem>

                <FileItem>
                  <Icon>🎫</Icon>
                  <FileName>tarjeta-activacion-{order.orderId}.pdf</FileName>
                  <Actions>
                    <Button onClick={generateActivationCard}>
                      Generar tarjeta
                    </Button>
                  </Actions>
                </FileItem>
              </>
            ) : (
              <EmptyState>
                <Icon>📭</Icon>
                <Message>
                  El PDF se generará cuando la agenda esté desarrollada.
                </Message>
              </EmptyState>
            )}
          </Card>

          <Card>
            <Title>Estado del Envío</Title>

            {order.status === "pending_fulfillment" && (
              <StatusForm>
                <Message>
                  Este pedido está listo para producción.
                </Message>
                <Button onClick={markAsPrinting}>
                  Marcar como "En producción"
                </Button>
              </StatusForm>
            )}

            {order.status === "printing" && (
              <StatusForm>
                <Message>
                  Cuando hayas enviado el pedido, introduce
                  los datos del envío:
                </Message>
                <Form onSubmit={handleMarkAsShipped}>
                  <Select
                    name="carrier"
                    label="Transportista"
                    options={[
                      { value: "correos", label: "Correos" },
                      { value: "seur", label: "SEUR" },
                      { value: "otro", label: "Otro" }
                    ]}
                  />
                  <Input
                    name="trackingNumber"
                    label="Número de seguimiento"
                    placeholder="PKG123456789ES"
                  />
                  <Input
                    name="estimatedDelivery"
                    label="Fecha estimada de entrega"
                    type="date"
                  />
                  <Button type="submit">
                    Marcar como enviado
                  </Button>
                </Form>
              </StatusForm>
            )}

            {order.status === "shipped" && (
              <ShippingInfo>
                <Icon>✅</Icon>
                <Label>Enviado</Label>
                <Date>{formatDate(order.shippedAt)}</Date>

                <Label>Transportista:</Label>
                <Value>{order.carrier}</Value>

                <Label>Tracking:</Label>
                <TrackingNumber>{order.trackingNumber}</TrackingNumber>
                <Link href={getTrackingUrl(order.carrier, order.trackingNumber)}>
                  Ver seguimiento ↗
                </Link>

                {order.estimatedDelivery && (
                  <>
                    <Label>Entrega estimada:</Label>
                    <Date>{formatDate(order.estimatedDelivery)}</Date>
                  </>
                )}

                <Button onClick={markAsDelivered}>
                  Marcar como entregado
                </Button>
              </ShippingInfo>
            )}

            {order.status === "delivered" && (
              <DeliveryInfo>
                <Icon>🎉</Icon>
                <Label>Entregado</Label>
                <Date>{formatDate(order.deliveredAt)}</Date>
              </DeliveryInfo>
            )}
          </Card>
        </>
      )}

      <Card>
        <Title>Acceso Digital</Title>
        <Info>
          <Label>Código de activación:</Label>
          <Code>{order.activationCode}</Code>
          <CopyButton onClick={copyCode}>Copiar</CopyButton>

          <Label>Estado:</Label>
          <Value>
            {order.digitalActivated ? (
              <Badge color="green">
                ✅ Activado el {formatDate(order.digitalActivatedAt)}
              </Badge>
            ) : (
              <Badge color="gray">
                Pendiente de activación
              </Badge>
            )}
          </Value>

          <Link href={`/activar/${order.activationCode}`}>
            Ver página de activación ↗
          </Link>
        </Info>
      </Card>

      <Card>
        <Title>Notas internas</Title>
        <Textarea
          value={order.notes || ""}
          onChange={handleNotesChange}
          placeholder="Añade notas sobre este pedido..."
        />
        <Button onClick={saveNotes}>Guardar notas</Button>
      </Card>
    </Column>
  </Grid>
</AdminOrderDetailPage>
```

---

## 📧 Emails

### **Email 1: Confirmación Digital (Para mí)**
```
Asunto: ✅ Tu Agenda Astrológica está en camino

Hola [Nombre],

¡Gracias por tu compra! Tu Agenda Astrológica Digital está siendo preparada.

💫 TU CÓDIGO DE ACTIVACIÓN
ABC-123-XYZ

Guarda este código. Lo necesitarás para acceder a tu agenda
cuando esté lista.

📋 DATOS RECIBIDOS
• Nombre: [Nombre]
• Fecha de nacimiento: [Fecha]
• Lugar de nacimiento: [Lugar]
• Residencia actual: [Ciudad], [País]

🔔 ¿QUÉ SIGUE?
Estamos trabajando en tu agenda personalizada. Recibirás
otro email cuando esté lista para acceder.

Si tienes alguna pregunta, responde a este email.

Un abrazo,
Tu Vuelta al Sol

───────────────────────────
Nº Pedido: AG-2025-001
Fecha: [Fecha y hora]
```

---

### **Email 2: Confirmación Regalo Digital (Al comprador)**
```
Asunto: 🎁 Tu regalo ha sido enviado

Hola [Comprador],

Tu regalo ha sido enviado a [Destinatario Email].

🎁 DETALLES DEL REGALO
Producto: Agenda Astrológica Digital
Destinatario: [Email]
Tu mensaje: "[Mensaje de regalo]"

📧 ¿QUÉ SIGUE?
El destinatario recibirá un email con instrucciones
para activar su regalo y completar sus datos.

Código de activación: ABC-123-XYZ
(El destinatario también lo recibirá por email)

Recibirás una notificación cuando active su regalo.

Gracias por compartir la magia de la astrología ✨

Un abrazo,
Tu Vuelta al Sol

───────────────────────────
Nº Pedido: AG-2025-001
```

---

### **Email 3: Activación Regalo Digital (Al destinatario)**
```
Asunto: 🎁 ¡Te han regalado una Agenda Astrológica!

Hola,

[Comprador] te ha enviado un regalo muy especial:
una Agenda Astrológica Personalizada de Tu Vuelta al Sol.

💌 MENSAJE DE [COMPRADOR]:
"[Mensaje de regalo]"

🎁 ACTIVA TU REGALO
Para recibir tu agenda necesitamos que completes tus
datos de nacimiento:

👉 Haz clic aquí para activar:
   https://tuvueltaalsol.es/activar/ABC-123-XYZ

También puedes visitar:
tuvueltaalsol.es/activar

Y usar el código: ABC-123-XYZ

📝 NECESITARÁS:
• Tu fecha de nacimiento
• Hora de nacimiento
• Lugar de nacimiento
• Ciudad donde vives actualmente

Una vez completes tus datos, recibirás acceso a tu
agenda personalizada.

¿No conoces tu hora de nacimiento exacta?
No te preocupes, podemos trabajar con aproximaciones.

Un abrazo,
Tu Vuelta al Sol

───────────────────────────
¿No esperabas este email? Puede que alguien haya
escrito mal tu dirección. Puedes ignorar este mensaje.
```

---

### **Email 4: Confirmación Pedido Físico (Para mí)**
```
Asunto: 📦 Pedido confirmado #AG-2025-001

Hola [Nombre],

¡Gracias por tu pedido! Tu Agenda Astrológica está
en producción.

📦 DETALLES DEL PEDIDO
Nº Pedido: #AG-2025-001
Producto: Agenda Astrológica (Libro físico)
Precio: 80€

📍 ENVÍO A:
[Nombre completo]
[Dirección]
[Código Postal] [Ciudad]
[Provincia], [País]

⏱️ TIEMPO ESTIMADO
Tu agenda será enviada en 5-7 días hábiles.

💫 ACCESO DIGITAL INCLUIDO
Mientras esperas tu libro físico, ya puedes guardar
tu código de acceso digital:

Código: ABC-123-XYZ

Podrás acceder a tu agenda online cuando esté lista.
El libro también incluirá una tarjeta con este código.

🔔 SEGUIMIENTO
Recibirás otro email con el número de seguimiento
cuando tu pedido sea enviado.

📋 Datos registrados:
• Fecha de nacimiento: [Fecha]
• Hora: [Hora]
• Lugar de nacimiento: [Lugar]
• Residencia actual: [Ciudad], [País]

¿Alguna pregunta? Responde a este email.

Un abrazo,
Tu Vuelta al Sol

───────────────────────────
Ver estado del pedido:
https://tuvueltaalsol.es/pedidos/AG-2025-001
```

---

### **Email 5: Pedido Enviado**
```
Asunto: 📦 Tu pedido #AG-2025-001 ha sido enviado

Hola [Nombre],

¡Buenas noticias! Tu Agenda Astrológica ya está en camino.

📦 INFORMACIÓN DE ENVÍO
Transportista: [Correos/SEUR]
Nº Seguimiento: PKG123456789ES
Fecha de envío: [Fecha]
Entrega estimada: [Fecha]

🔍 SEGUIR TU PEDIDO
[Link de seguimiento del transportista]

📍 ENVIADO A:
[Dirección completa]

📦 EL PAQUETE INCLUYE:
• Tu Agenda Astrológica (libro impreso)
• Tarjeta con código de acceso digital (ABC-123-XYZ)

💫 ACCESO DIGITAL
Recuerda que también tienes acceso online a tu agenda.
Usa el código que encontrarás en la tarjeta.

¿Algún problema con la entrega?
Responde a este email y te ayudaremos.

Un abrazo,
Tu Vuelta al Sol

───────────────────────────
Ver estado del pedido:
https://tuvueltaalsol.es/pedidos/AG-2025-001
```

---

### **Email 6: Pedido Entregado**
```
Asunto: 🎉 Tu Agenda Astrológica ha sido entregada

Hola [Nombre],

¡Tu pedido ha sido entregado!

Esperamos que disfrutes tu Agenda Astrológica.

💫 ACCESO DIGITAL
Recuerda que también puedes acceder online:

Visita: https://tuvueltaalsol.es/activar
Código: ABC-123-XYZ

📖 COMPARTE TU EXPERIENCIA
¿Te gustaría compartir tu experiencia con otros?
[Link a reseñas/testimonios]

❓ ¿NECESITAS AYUDA?
Si tienes alguna pregunta sobre tu agenda o cómo
interpretarla, estamos aquí para ayudarte.

Responde a este email o visita nuestro centro de ayuda:
https://tuvueltaalsol.es/ayuda

Gracias por confiar en Tu Vuelta al Sol ✨

Un abrazo,
El equipo de Tu Vuelta al Sol

───────────────────────────
Nº Pedido: AG-2025-001
```

---

### **Email 7: Datos de Regalo Completados (Al comprador)**
```
Asunto: 🎁 Tu regalo ha sido activado

Hola [Comprador],

Buenas noticias: [Destinatario] ha activado el regalo
que le enviaste.

🎁 ESTADO DEL REGALO
Destinatario: [Nombre/Email]
Código: ABC-123-XYZ
Estado: ✅ Activado

[Si es físico:]
Tu regalo está ahora en producción y será enviado a
la dirección proporcionada en 5-7 días hábiles.

[Si es digital:]
El destinatario recibirá acceso a su agenda cuando
esté lista.

Gracias por compartir la magia de Tu Vuelta al Sol ✨

Un abrazo,
El equipo de Tu Vuelta al Sol
```

---

## 🚀 Fases de Implementación

### **FASE 1: Setup Inicial** ⏱️ 1 día
- [x] Productos creados en Stripe
  - Digital: `price_1ScNTX38AWMGo4dl1cKJrv3y`
  - Físico: `price_1ScLUZ38AWMGo4dlG0l4xn8b`
- [ ] Variables de entorno configuradas
- [ ] Modelo de datos en MongoDB
- [ ] Colección `agenda_orders` creada con índices

---

### **FASE 2: Página de Compra** ⏱️ 2-3 días
- [ ] Modificar `/compra/agenda/page.tsx`
  - [ ] Selector de producto (digital vs físico)
  - [ ] Selector "Para mí / Regalo"
  - [ ] Formulario datos de nacimiento
  - [ ] Formulario residencia actual ⭐
  - [ ] Formulario dirección de envío (condicional)
  - [ ] Integración con Stripe Checkout
- [ ] Crear componentes reutilizables:
  - [ ] `<ProductSelector />`
  - [ ] `<RecipientTypeSelector />`
  - [ ] `<BirthDataForm />`
  - [ ] `<CurrentResidenceForm />` ⭐
  - [ ] `<ShippingAddressForm />`
  - [ ] `<LocationPicker />` (con geocoding)

---

### **FASE 3: API de Checkout** ⏱️ 1-2 días
- [ ] Crear `/api/agenda/checkout/route.ts`
  - [ ] Validación de datos
  - [ ] Creación de sesión Stripe
  - [ ] Generación de código de activación único
  - [ ] Guardar en metadata de Stripe
- [ ] Crear `/api/webhooks/stripe/route.ts`
  - [ ] Manejar `checkout.session.completed`
  - [ ] Crear orden en `agenda_orders`
  - [ ] Enviar emails correspondientes
  - [ ] Actualizar estado

---

### **FASE 4: Páginas de Confirmación** ⏱️ 1 día
- [ ] Crear `/compra/agenda/success/page.tsx`
  - [ ] Vista para digital (para mí)
  - [ ] Vista para digital (regalo)
  - [ ] Vista para físico (para mí)
  - [ ] Vista para físico (regalo)
  - [ ] Mostrar código de activación
  - [ ] Link a seguimiento de pedido

---

### **FASE 5: Activación de Regalos** ⏱️ 2 días
- [ ] Crear `/activar/[codigo]/page.tsx`
  - [ ] Validación de código
  - [ ] Detección de estado (ya activado, pendiente, etc.)
  - [ ] Formulario de datos de nacimiento
  - [ ] Formulario de residencia actual ⭐
  - [ ] Confirmación de activación
- [ ] Crear `/api/agenda/activate/route.ts`
  - [ ] Validar código
  - [ ] Actualizar orden con datos
  - [ ] Cambiar estado
  - [ ] Enviar email de confirmación
  - [ ] Notificar al comprador (si es regalo)

---

### **FASE 6: Seguimiento de Pedidos** ⏱️ 1 día
- [ ] Crear `/pedidos/[orderId]/page.tsx`
  - [ ] Timeline de estados
  - [ ] Información de envío
  - [ ] Tracking number
  - [ ] Link a transportista
  - [ ] Código de activación digital
- [ ] Crear `/api/agenda/order/[orderId]/route.ts`
  - [ ] Obtener detalles del pedido
  - [ ] Autorización (solo comprador o admin)

---

### **FASE 7: Panel Admin** ⏱️ 2-3 días
- [ ] Crear `/admin/pedidos-agenda/page.tsx`
  - [ ] Lista de pedidos
  - [ ] Filtros (estado, tipo, fecha)
  - [ ] Búsqueda
  - [ ] Stats/métricas
- [ ] Crear `/admin/pedidos-agenda/[orderId]/page.tsx`
  - [ ] Detalle completo del pedido
  - [ ] Datos del cliente
  - [ ] Datos astrológicos
  - [ ] Dirección de envío
  - [ ] Gestión de estados
  - [ ] Notas internas
- [ ] Crear APIs admin:
  - [ ] `/api/admin/agenda/orders/route.ts` (list)
  - [ ] `/api/admin/agenda/orders/[id]/ship/route.ts`
  - [ ] `/api/admin/agenda/orders/[id]/status/route.ts`
  - [ ] `/api/admin/agenda/orders/[id]/notes/route.ts`

---

### **FASE 8: Sistema de Emails** ⏱️ 2 días
- [ ] Setup servicio de email (Resend/SendGrid)
- [ ] Crear plantillas HTML:
  - [ ] Confirmación digital (para mí)
  - [ ] Confirmación digital (regalo al comprador)
  - [ ] Activación regalo (al destinatario)
  - [ ] Confirmación físico (para mí)
  - [ ] Confirmación físico (regalo al comprador)
  - [ ] Pedido enviado
  - [ ] Pedido entregado
  - [ ] Regalo activado (al comprador)
- [ ] Crear utilidad de envío de emails
- [ ] Testing de todos los emails

---

### **FASE 9: Testing & Polish** ⏱️ 2 días
- [ ] Testing end-to-end:
  - [ ] Digital para mí
  - [ ] Digital regalo
  - [ ] Físico para mí
  - [ ] Físico regalo (con datos)
  - [ ] Físico regalo (sin datos)
- [ ] Testing de errores:
  - [ ] Código inválido
  - [ ] Pago fallido
  - [ ] Campos vacíos
- [ ] Responsive design
- [ ] Accesibilidad
- [ ] SEO
- [ ] Analytics tracking

---

### **FASE 10: Generación de PDF** ⏱️ TBD (futuro)
> Esta fase se implementará cuando la agenda esté completamente
> desarrollada y diseñada.

- [ ] Sistema de generación de PDF
- [ ] Diseño de la agenda en PDF
- [ ] Tarjeta de activación imprimible
- [ ] Storage de PDFs
- [ ] Integración con flujo de pedidos

---

### **FASE 11: Integraciones Avanzadas** ⏱️ TBD (opcional)
> Estas features son opcionales y para el futuro.

- [ ] API de envíos (Packlink/Correos)
- [ ] Tracking automático
- [ ] Notificaciones push
- [ ] Sistema de reseñas
- [ ] Programa de afiliados
- [ ] Descuentos y cupones

---

## 📊 Resumen de Esfuerzo

| Fase | Tiempo Estimado | Prioridad |
|------|-----------------|-----------|
| FASE 1: Setup | 1 día | 🔴 Alta |
| FASE 2: Página Compra | 2-3 días | 🔴 Alta |
| FASE 3: API Checkout | 1-2 días | 🔴 Alta |
| FASE 4: Confirmación | 1 día | 🔴 Alta |
| FASE 5: Activación | 2 días | 🔴 Alta |
| FASE 6: Seguimiento | 1 día | 🟠 Media |
| FASE 7: Panel Admin | 2-3 días | 🔴 Alta |
| FASE 8: Emails | 2 días | 🔴 Alta |
| FASE 9: Testing | 2 días | 🔴 Alta |
| **TOTAL MVP** | **14-18 días** | |
| FASE 10: PDF | TBD | 🟢 Baja (futuro) |
| FASE 11: Integraciones | TBD | 🟢 Baja (futuro) |

---

## 🎯 Próximos Pasos Inmediatos

1. **Revisar y aprobar esta documentación**
2. **Crear modelo de datos en MongoDB**
3. **Empezar FASE 2: Modificar página de compra**

---

## 📝 Notas Importantes

### **Lugar de Residencia Actual** ⭐
Este campo es **crítico** para la generación de la agenda.
Se usa para:
- Calcular tránsitos actuales
- Hora local correcta
- Eventos astronómicos según ubicación

**Siempre se debe recopilar junto con los datos de nacimiento.**

### **Códigos de Activación**
- Formato sugerido: `XXX-XXX-XXX` (9 caracteres + 2 guiones)
- Generación: UUID o nanoid para garantizar unicidad
- Validez: Sin caducidad (el usuario decide cuándo activar)
- Uso único: Una vez activado, no se puede reutilizar

### **Estados de Pedido**
```
Digital:
  pending_data → ready → completed

Físico (con datos):
  pending_fulfillment → printing → shipped → delivered → completed

Físico (sin datos - regalo):
  pending_data → pending_fulfillment → printing → shipped → delivered → completed
```

### **Precios en Stripe**
- Digital: 29€
- Físico: 80€ (incluye envío península)
- Envíos internacionales: A cobrar aparte según proveedor

### **Gestión Manual vs Automática**
**Ahora (manual):**
- Ver pedidos en admin
- Descargar PDF cuando esté disponible
- Enviar a imprenta
- Crear envío manualmente en web transportista
- Copiar tracking a admin panel
- Sistema envía email automático

**Futuro (automático):**
- API de imprenta bajo demanda
- API de transportista
- Tracking automático
- Todo integrado

---

**FIN DE LA DOCUMENTACIÓN**

*Documento vivo - se actualizará según avance el desarrollo*
