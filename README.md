# Sabi Spice – Online Store
African dishes, small chops and spices. Built with Next.js 14, Prisma/PostgreSQL, NextAuth, Cloudinary and Resend.

Brand: leaf green `#284912`, antique gold `#B07A2A`, cream `#FBF7EE`. Fonts: Fraunces, DM Sans, Great Vibes.

## Quick start
    npm install
    cp .env.example .env.local   # fill in values
    npm run db:push && npm run db:seed
    npm run dev
Admin: /admin/login — admin@sabispice.com / Admin@SabiSpice2026 (change immediately).

## Status
- [x] Batch 1: rebrand (theme, logo, navbar/footer, home page), USD currency, food seed data
- [x] Batch 2: Stripe Checkout + webhook (/api/webhooks/stripe), pickup / local delivery / shipping (rules in lib/shipping.ts)
- [x] Batch 3: Catering requests (/catering, admin at /admin/catering), Training/Enrol/Paystack removed, copy rewritten for food & spices

## Payments (Stripe)
1. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PICKUP_ADDRESS`.
2. In Stripe → Developers → Webhooks add `https://YOUR_DOMAIN/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`; put the signing secret in `STRIPE_WEBHOOK_SECRET`.
3. Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
4. Existing databases: run `npm run db:push` (Order gains fulfillment, shippingFee, zip, stripeSessionId; paystackRef → paymentRef).

## Catering
Requests are saved to `CateringRequest` and emailed to `ADMIN_EMAIL` (with a copy to the customer). Manage them at `/admin/catering`. Run `npm run db:push` after pulling — Course and Enrolment tables are removed.
