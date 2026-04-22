# PrimeShine Detail Co.

Full-stack booking and management platform for a mobile auto detailing business. Customers book details, manage vehicles, and leave reviews. Admins manage bookings, customers, and operations from a real-time dashboard with AI-powered follow-ups and CSV reporting.

**Live:** https://primeshine.vercel.app

---

## What it does

- **Customer-facing site:** service catalog, weather-aware booking flow with dynamic calendar, Stripe checkout, FAQ, contact form.
- **Customer portal:** upcoming/past bookings, reschedule modal, vehicle garage, leave-a-review form, payment history, notification preferences.
- **Admin dashboard:** KPIs from live data, booking management, customer CRM with search/tags, review management with reply, service/pricing editor, reports with CSV export.
- **AI follow-ups:** Anthropic Claude generates personalized re-engagement texts per customer, based on booking history and vehicle data.
- **Stripe payments:** server-side price calculation with tax, PaymentIntent flow via Edge Functions — no secrets in the browser.
- **Auth:** Supabase Auth with magic link (customers) and email/password (admin), role-based route guards, auto-profile creation on signup.

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 18, Vite, React Router DOM |
| Styling | Custom CSS design system (CSS variables, no framework) |
| Data | Supabase (Postgres + Auth + RLS + Edge Functions) |
| Payments | Stripe (PaymentIntent flow via Edge Function) |
| AI | Anthropic Claude Haiku 4.5 (via Edge Function) |
| Charts | Custom SVG (Sparkline, BarChart, LineChart) |
| Deploy | Vercel (frontend) + Supabase (backend) |

---

## Quick start

```bash
git clone <this repo>
cd primeshine
npm install
cp .env.example .env       # fill in Supabase + Stripe keys
npm run dev                 # http://localhost:5173
```

Required env (`.env`):

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (test mode) |

Server-side secrets (set via `npx supabase secrets set`):

| Secret | Purpose |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key for PaymentIntent creation |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI follow-up generation |

Migrations live in `supabase/migrations/` and apply in timestamp order:

```bash
npx supabase db push
```

---

## Routes

### Public pages

| Path | Purpose |
|---|---|
| `/` | Home — hero, services preview, testimonials, CTA |
| `/services` | Full service catalog with features and pricing |
| `/pricing` | Pricing grid by vehicle type |
| `/weather` | 7-day forecast for planning detail days |
| `/about` | Company story and team |
| `/faq` | Frequently asked questions |
| `/contact` | Contact form (saves to `contact_messages` table) |

### Booking flow

| Path | Purpose |
|---|---|
| `/book/1` | Step 1 — pick service package + add-ons |
| `/book/2` | Step 2 — vehicle type, make/model/year/color |
| `/book/3` | Step 3 — dynamic calendar, time slots, weather dots, service address |
| `/book/4` | Step 4 — Stripe checkout (card, Apple Pay, Link) |
| `/book/5` | Confirmation with booking number |

### Auth + portals

| Path | Purpose |
|---|---|
| `/login` | Sign in (magic link or email/password) |
| `/portal` | Customer portal — requires auth |
| `/admin` | Admin dashboard — requires auth + admin role |

---

## Customer portal

| Tab | Features |
|---|---|
| Overview | Next booking card, KPIs (completed, spend, review, loyalty), recent bookings, weather widget |
| Bookings | Full booking list, reschedule modal (calendar + time picker), cancel |
| Vehicles | Vehicle garage with add/remove, vehicle type icons |
| Payments | Payment methods, receipt history |
| Reviews | Leave-a-review form (star rating + comment), view past reviews with admin replies |
| Settings | Profile editor (persists to DB), notification toggles (persists to JSONB column) |

---

## Admin dashboard

| Tab | Features |
|---|---|
| Dashboard | Revenue/bookings/customers/rating KPIs with sparklines, revenue chart, service mix, today's schedule, weather ops widget, recent reviews, top customers, jobs-per-day bar chart |
| Bookings | Full table with CSV export |
| Customers | Search by name/email/phone, VIP/Repeat/Regular tags, CSV export, customer detail view with booking history + AI follow-up generation |
| Reviews | Rating distribution, reply form, "needs reply" badges |
| Services | Service and add-on management tables |
| Reports | Avg ticket, repeat rate, cancel rate, total revenue (all computed from real data), bookings by day of week, service breakdown, CSV export |

---

## Edge Functions

| Function | Purpose |
|---|---|
| `create-payment` | Server-side Stripe PaymentIntent creation with hardcoded price matrix + 7% GA sales tax. No prices from the client. |
| `ai-followup` | Reads customer profile + booking history + vehicles from DB, calls Anthropic Claude Haiku 4.5, returns personalized follow-up text. Falls back to demo text if API key not set. |

Both functions use shared CORS headers from `_shared/cors.ts` and require a valid Supabase auth token in the `Authorization` header.

---

## Database

6 migrations in `supabase/migrations/`, applied in order:

| Migration | Purpose |
|---|---|
| `000001_initial_schema` | Core tables: profiles, vehicles, bookings (with sequence), reviews, referrals, contact_messages. RLS policies, indexes, auto-profile trigger. |
| `000002_fix_schema` | Referrals table, services seed data, AI follow-up columns on bookings. |
| `000003_fix_rls_recursion` | `is_admin()` SECURITY DEFINER function to prevent infinite recursion in admin RLS policies. |
| `000004_fix_trigger` | Exception handler on `handle_new_user` trigger so auth signup never fails silently. |
| `000005_admin_update_reviews` | RLS policy for admin review replies. |
| `000006_notification_prefs` | `notification_prefs` JSONB column on profiles with sensible defaults. |

All admin policies use `is_admin()` — a `SECURITY DEFINER` function that bypasses RLS to check the `profiles.role` column without recursion.

---

## Repo layout

```
src/
  components/          Design-system primitives (Button, Icon, Charts, Stars, etc.)
  data/                Static service/vehicle/mock data
  lib/
    api.js             Supabase CRUD (bookings, vehicles, reviews, customers, stats)
    ai.js              AI follow-up client (calls Edge Function)
    stripe.js          Stripe loader + PaymentIntent client (calls Edge Function)
    supabase.js        Supabase client init
    AuthContext.jsx     React auth context (session, profile, role)
  pages/
    booking/           4-step booking flow + confirmation
    portal/            Customer portal (6 tabs)
    admin/             Admin dashboard (7 tabs)
    HomePage.jsx       Landing page
    ServicesPage.jsx   Service catalog
    PricingPage.jsx    Pricing grid
    WeatherPage.jsx    Weather forecast
    AboutPage.jsx      About page
    FaqPage.jsx        FAQ
    ContactPage.jsx    Contact form
    AuthPage.jsx       Login / signup
  App.jsx              Router, auth guards, demo-mode fallback
supabase/
  migrations/          6 SQL migrations (timestamp-ordered)
  functions/
    create-payment/    Stripe Edge Function
    ai-followup/       Anthropic Edge Function
    _shared/           CORS headers
```

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (Vite, port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npx supabase db push` | Apply pending migrations to remote DB |
| `npx supabase functions serve` | Run Edge Functions locally |
| `npx supabase secrets set KEY=value` | Set server-side secrets for Edge Functions |

---

## Security

- **No secrets in the browser.** Stripe secret key and Anthropic API key live as Supabase Edge Function secrets, never in `VITE_`-prefixed env vars.
- **RLS on every table.** Customers see only their own data. Admin policies use `is_admin()` SECURITY DEFINER to avoid recursion.
- **Server-side price calculation.** The `create-payment` Edge Function computes prices from a hardcoded matrix — the client never sends a price.
- **Auth guards.** `/portal` requires authentication. `/admin` requires authentication + `admin` role on the profile.

---

## Status

Production-ready. All features wired to live Supabase + Stripe (test mode). Open item: Anthropic API key rotation (previous key was exposed and needs replacement).

## License

Proprietary. All rights reserved.
