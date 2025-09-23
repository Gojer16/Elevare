





1. Prisma Schema (Add Role/Plan)

Extend your User model to include a subscription tier:

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  role        String   @default("FREE") // or use enum
  paypalId    String?  // store PayPal subscriber ID
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}


Or better, use an enum:

enum Role {
  FREE
  PRO
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  role        Role     @default(FREE)
  paypalId    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

2. PayPal Subscription Flow

Unlike Stripe’s Checkout, PayPal uses subscription plans.

You’ll create a subscription Plan in the PayPal dashboard (e.g., “Elevare Pro – $5/mo”).

On your frontend, trigger a PayPal button (using their SDK).

After payment, PayPal gives you a subscription ID.

3. Webhook Handling

You need a backend webhook (e.g., /api/paypal/webhook) to listen to PayPal events:

BILLING.SUBSCRIPTION.ACTIVATED

BILLING.SUBSCRIPTION.CANCELLED

When you receive activated, update the user:

await prisma.user.update({
  where: { email: userEmail },
  data: { role: "PRO", paypalId: subscriptionId },
});


When you receive cancelled, downgrade them:

await prisma.user.update({
  where: { paypalId: subscriptionId },
  data: { role: "FREE" },
});
Anywhere you load features , just check:

if (user.role !== "PRO") {
  throw new Error("Upgrade required");
}


Or in React, hide Pro features behind:

{user.role === "PRO" && <ProFeature />}
PayPal handles billing.

Webhooks sync subscription status.

Prisma schema tracks role (FREE or PRO).

Your app enforces access automatically.