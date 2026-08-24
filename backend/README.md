# TradeSlot Backend API ⚡

Robust RESTful API and scheduling automation engine powering the **TradeSlot** platform. Built with **Node.js**, **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Core Functionalities

### 1. 🧠 Intelligent Booking Engine (`booking-engine.service.ts`)
* **Natural Language Slot Extraction:** Detects requested dates and times from customer text (e.g., *"tomorrow at 2pm"*, *"friday at 10:30am"*).
* **30-Minute Travel Buffer Check:** Enforces 30 minutes of travel time before and after every booking to eliminate scheduling clashes.
* **Work Area Guard:** Rejects slot reservations on dates where no active Work Area zone is assigned.
* **Automated Slot Suggestions:** When a requested slot clashes with existing jobs, it automatically calculates and suggests alternative open windows.

### 2. 💳 Stripe Connect & Payment Automation (`payment.service.ts`)
* **Stripe Connected Accounts:** Allows tradespeople to onboard their Stripe account and receive payouts directly.
* **Platform Fee Split:** Configurable platform fee per booking with automated transfer.
* **Webhook & Confirmation Pipeline:**
  * Catches `checkout.session.completed` and `payment_intent.succeeded`.
  * Instantly updates booking status to `CONFIRMED`.
  * Dispatches an automatic notification to the customer's chat: *"Payment Received! Your booking is confirmed and ongoing."*

### 3. 💬 Omnichannel Message Dispatch
* **WhatsApp Dispatch (`ultramsg.service.ts`):** Bidirectional messaging pipeline over WhatsApp.
* **WebChat Pipeline (`webchat.service.ts`):** Instant message ingestion, customer discovery, and full historical conversation restoration.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (`v18+`)
* **Framework:** Express.js 5
* **Language:** TypeScript
* **Database & ORM:** PostgreSQL & Prisma ORM (`v6.19`)
* **Payments:** Stripe Node SDK (`v22.5`)
* **Security:** Helmet, CORS, Cookie-Parser, Bcrypt, JWT

---

## 📁 Directory Structure

```
backend/
├── prisma/
│   ├── migrations/             # Database schema migration histories
│   └── models/
│       └── schema.prisma       # Prisma data schema (User, Trader, Booking, etc.)
├── src/
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── stripe.ts           # Stripe SDK instance
│   ├── middleware/
│   │   └── auth.middleware.ts  # JWT Bearer and Cookie authentication guard
│   ├── modules/
│   │   ├── auth/               # Trader registration, login, token refresh
│   │   ├── booking/            # Booking CRUD, slot queries, conversation conversion
│   │   ├── channels/
│   │   │   ├── webchat/        # WebChat message reception & history
│   │   │   └── whatsapp/       # WhatsApp webhook & incoming message parser
│   │   ├── conversation/       # Chat conversation threads & trader replies
│   │   ├── payment/            # Stripe checkout creation, verification, webhooks
│   │   ├── trader/             # Trader profiles & Stripe Connect account management
│   │   └── workArea/           # Daily service area zones (Add, Get, Patch, Delete)
│   ├── routes/
│   │   └── index.ts            # Central API route registration
│   ├── services/
│   │   ├── booking-engine.service.ts  # Clash prevention & slot alternatives
│   │   ├── slot-detector.ts           # Date/time natural language parser
│   │   └── ultramsg.service.ts        # WhatsApp API client
│   ├── utils/                  # AppError, response helpers
│   ├── app.ts                  # Express application setup
│   └── server.ts               # Server startup listener
└── package.json
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new trader account
* `POST /api/auth/login` — Trader login (returns JWT & sets cookie)
* `GET /api/auth/me` — Get authenticated trader profile
* `POST /api/auth/refresh-token` — Refresh access token

### 📅 Bookings & Slots (`/api/bookings`)
* `GET /api/bookings` — List all trader bookings
* `POST /api/bookings` — Create a new booking
* `POST /api/bookings/from-conversation` — Create and offer a booking slot to a conversation
* `GET /api/bookings/slots/available` — Calculate available 1-hour slots for a date (respects work areas & 30m buffers)
* `PATCH /api/bookings/:id/status` — Update booking status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`)
* `DELETE /api/bookings/:id` — Delete a booking (immediately frees up the slot)

### 💬 WebChat & WhatsApp (`/api/channels`)
* `POST /api/channels/webchat/message` — Send message from customer WebChat
* `GET /api/channels/webchat/messages?phone=...` — Retrieve full conversation history for customer phone
* `POST /api/channels/webchat/confirm-booking` — Confirm a proposed booking from WebChat
* `POST /api/channels/whatsapp/webhook` — Ingest incoming WhatsApp messages

### 💬 Conversations & Messages (`/api/conversations`)
* `GET /api/conversations` — List all active customer conversations for the trader
* `POST /api/conversations/:id/messages` — Send a trader reply or Stripe checkout link to a customer
* `PATCH /api/conversations/:id/status` — Update conversation status (`OPEN`, `BOOKED`, `CLOSED`)
* `DELETE /api/conversations/:id` — Delete conversation thread

### 📍 Work Area Zones (`/api/work-area`)
* `GET /api/work-area` — List all configured daily work area zones
* `POST /api/work-area/set-area` — Set a work area zone for a date
* `PATCH /api/work-area/:id` — Update date or location of a work area zone
* `DELETE /api/work-area/:id` — Delete a work area zone

### 💳 Payments & Stripe (`/api/payments`)
* `POST /api/payments/checkout/:bookingId` — Generate Stripe Checkout Session link for a booking
* `GET /api/payments/verify-session?session_id=...` — Verify session completion on success redirect
* `GET /api/payments/summary` — Trader earnings and pending payments summary
* `POST /api/payments/webhook` — Stripe webhook listener (`checkout.session.completed`, etc.)

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# PostgreSQL Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/tradeslot?schema=public"

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=30d

# Stripe Payments & Connect
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PLATFORM_FEE_AMOUNT=200

# WhatsApp Integration (UltraMsg)
ULTRAMSG_INSTANCE_ID=instance...
ULTRAMSG_TOKEN=...
```

---

## 🏃 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Run database migrations
npm run db:migrate

# 4. Start backend in development mode
npm run dev
```

Server runs on: `http://localhost:5000`
