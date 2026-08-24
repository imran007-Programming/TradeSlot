# TradeSlot ⚡ — Intelligent Booking & Scheduling Platform for Tradespeople

TradeSlot is an on-demand booking, scheduling, and payment management platform engineered specifically for tradespeople (plumbers, electricians, builders, HVAC technicians) and their clients. It automates customer intake through **WhatsApp** and **Live WebChat**, prevents schedule clashes with intelligent travel buffer windows, enforces daily work area zones, and automates payment collection via **Stripe Connect**.

---

## 🌟 Key Features

### 1. 💬 Omnichannel Customer Intake
* **WhatsApp Integration:** Conversational booking engine that parses natural language booking requests, suggests alternatives, and confirms time slots directly over WhatsApp.
* **Live WebChat Widget:** Interactive floating customer widget with quick prompt shortcuts, location collection, full historical chat sync, and live session updates.

### 2. 🗓️ Intelligent Scheduling & Buffer Protection
* **30-Minute Travel Buffer:** Automatically applies travel buffer protection between consecutive jobs to eliminate clashing and late arrivals.
* **Daily Work Area Zones:** Traders configure specific daily coverage zones (e.g., Camden, North London). Bookings can only be scheduled on dates with active coverage zones.
* **Instant Slot Recycling:** Deleted bookings and unconfirmed proposals immediately free up slots with zero delay.

### 3. 💳 Stripe Connect & Automated Checkout
* **Stripe Connect Onboarding:** Traders connect their Stripe accounts to receive direct customer payments.
* **Direct Payment Links:** Traders can send direct Stripe checkout links into the customer's chat with one click.
* **Automated Confirmation:** When payment succeeds, the system automatically marks the booking as confirmed and sends an ongoing service confirmation message to the customer.

### 4. 📊 High-Performance Trader Dashboard (App Router)
* **Modular URL-Based Nested Routing:** Clean, fast navigation across `/dashboard/messages`, `/dashboard/bookings`, `/dashboard/customers`, and `/dashboard/workareas`.
* **Real-time Live Sync:** Sidebar counts, stats bar cards, and conversation queues update immediately on actions without page reload.
* **Work Area Management:** Add, edit, and delete daily work area zones with full live sync.

---

## 🏗️ Architecture & Tech Stack

```
TradeSlot/
├── frontend/             # Next.js 16 (React 19, TypeScript, Tailwind CSS)
└── backend/              # Node.js, Express 5, TypeScript, Prisma ORM, PostgreSQL
```

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Sonner |
| **Backend** | Node.js, Express.js 5, TypeScript, Prisma ORM, PostgreSQL |
| **Payments** | Stripe API, Stripe Connect, Stripe Webhooks |
| **Channels** | WhatsApp (UltraMsg / Twilio API), Live WebChat API |
| **Authentication**| JWT (JSON Web Tokens), HTTP Cookies, Bcrypt Password Hashing |

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: `v18.x` or higher
* **PostgreSQL**: Running instance (Local or Supabase / Neon / Render)
* **Package Manager**: `npm` or `yarn`

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env

# Run Database Migrations & Generate Prisma Client
npx prisma generate --schema=prisma/models
npx prisma migrate dev --schema=prisma/models

# Start Backend Dev Server
npm run dev
```
> Backend runs on: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure Environment Variables
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start Frontend Dev Server
npm run dev
```
> Frontend runs on: `http://localhost:3000`

---

## 📂 Project Structure

```
TradeSlot/
├── backend/
│   ├── prisma/
│   │   └── models/               # Prisma Database Schema & Migrations
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/             # Login, Registration & JWT Auth
│   │   │   ├── booking/          # Booking CRUD & Slot Availability Engine
│   │   │   ├── channels/         # WebChat & WhatsApp Controllers/Services
│   │   │   ├── conversation/     # Chat Threads & Messaging
│   │   │   ├── payment/          # Stripe Checkout & Webhook Handlers
│   │   │   ├── trader/           # Trader Profiles & Stripe Connect
│   │   │   └── workArea/         # Work Area Zones (CRUD & Patch)
│   │   ├── services/
│   │   │   ├── booking-engine.service.ts  # Clash Detection & Auto-suggestions
│   │   │   ├── slot-detector.ts           # Natural Language Slot Parser
│   │   │   └── ultramsg.service.ts        # WhatsApp Dispatch Service
│   │   └── server.ts             # Express Entry Point
│   └── README.md
│
├── frontend/
│   ├── public/                   # Worker logo, tools animation, banner images
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/        # Modular Nested Routes (Messages, Bookings, etc.)
│   │   │   ├── payment/          # Payment Success & Cancel Handlers
│   │   │   └── page.tsx          # Landing Page
│   │   ├── components/
│   │   │   ├── Home/             # Landing page sections & WebChat widget
│   │   │   ├── dashboard/        # Reusable dashboard cards & modal components
│   │   │   └── ui/               # DatePicker, Calendar, Popover
│   │   └── lib/                  # API Client, Cookies & Utilities
│   └── README.md
│
└── README.md
```

---

## 🔒 Security & Best Practices
* **Zero Client-side Secret Exposure:** All Stripe secrets and WhatsApp credentials are strictly encapsulated on the backend.
* **Buffer & Conflict Prevention:** Atomic database checks ensure no two customers can double-book the same slot or violate travel buffers.
* **Authentication Guard:** Protected API routes enforce JWT Bearer/Cookie validation with role checks.

---

## 📄 License
This project is licensed under the MIT License.
