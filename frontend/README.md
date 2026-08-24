# TradeSlot Frontend ⚡

Modern, responsive web application for the **TradeSlot** on-demand tradesperson booking platform. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🚀 Key Features

* **High-Converting Landing Page:**
  * Interactive Service Categories with dynamic prompt selectors.
  * 30-minute buffer guarantee explanation.
  * Customer testimonials, FAQ accordion, and customer support showcase.
* **Live Customer WebChat Widget:**
  * Instant intake form with name, phone number, location / postcode, and quick prompts.
  * Automatic historical chat restoration for returning customers.
  * Live slot proposal cards and instant Stripe checkout redirection.
* **Trader Dashboard (Next.js Nested Routing):**
  * `/dashboard/messages`: Customer Messages queue, real-time message stream, slot proposal sender, and Stripe link generator.
  * `/dashboard/bookings`: Filterable directory table of all bookings with status updates, direct payment link trigger, and deletion.
  * `/dashboard/customers`: Comprehensive customer directory.
  * `/dashboard/workareas`: Daily service coverage zone manager with creation, editing, and deletion.
* **Live Stripe Status Indicator:**
  * Real-time live blinking green dot when Stripe Connect is active with a quick "Remove Account" button.
* **Accessible Custom UI Components:**
  * Custom `DatePicker` with past date prevention and clean spacious layout.
  * Sonner toast notifications with custom styling.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Library:** React 19
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4, Lucide React Icons
* **UI Utilities:** `@radix-ui/react-popover`, `react-day-picker`, `clsx`, `tailwind-merge`, `sonner`

---

## 📁 Directory Structure

```
frontend/
├── public/
│   ├── worker.png              # Platform logo & tab favicon
│   ├── tools.png               # Animated loading graphic
│   ├── images.png              # Default avatar
│   └── customer_care_man.jpg   # Support showcase image
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Dashboard shell, Sidebar, Header & Stats cards
│   │   │   ├── page.tsx        # Redirects to /dashboard/messages
│   │   │   ├── messages/       # Messages queue & live chat panel
│   │   │   ├── bookings/       # Bookings directory table
│   │   │   ├── customers/      # Customers table
│   │   │   └── workareas/      # Work Area zones grid & edit modals
│   │   ├── payment/
│   │   │   ├── success/        # Stripe payment success callback page
│   │   │   └── cancel/         # Stripe payment cancellation page
│   │   ├── globals.css         # Tailwind directives & custom CSS
│   │   ├── layout.tsx          # Root HTML layout with Sonner Toaster
│   │   └── page.tsx            # Main Landing Page
│   ├── components/
│   │   ├── Home/               # Navbar, Hero, Services, WebChat, Auth modals
│   │   ├── dashboard/
│   │   │   ├── messages/       # CustomerMessages, ChatHeader, ChatInputBar, etc.
│   │   │   └── modals/         # SlotsModal, BookingModal
│   │   └── ui/                 # DatePicker, Calendar popovers
│   ├── lib/
│   │   ├── api.ts              # Fetch wrapper with auto Authorization headers
│   │   ├── cookies.ts          # Client-side cookie handlers
│   │   └── utils.ts            # ClassName merging utilities
│   └── types/                  # TypeScript interfaces (Booking, Message, etc.)
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🏃 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production build
npm run start
```

Access the app at: `http://localhost:3000`
