# Car Hire Mauritius — Luxury Rental Platform

This is a premium Next.js 14 application for **Car Hire Mauritius**, featuring an elite fleet, AI concierge, and seamless island-wide booking.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Custom Luxury Theme)
- **Database**: Prisma with PostgreSQL
- **UI Components**: Radix UI & Lucide Icons
- **Animations**: Framer Motion & CSS Slow-Zoom

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a Supabase project and copy the Postgres connection strings into `.env.local` using `.env.example`.
4. Push the schema to your database: `npx prisma db push`
5. Apply the helper SQL policies in `setup_supabase.sql`
6. Seed the luxury fleet: `npm run db:seed`
7. Start the development server: `npm run dev`

## Supabase Notes
- Runtime database access uses Prisma over Supabase Postgres via `DATABASE_URL`.
- Prisma schema changes should use `DIRECT_URL` so migrations and `db push` talk to the direct database port instead of the pooled connection.
- Admin mutations now write audit entries to the `AuditLog` table, so fleet and booking edits are traceable once Supabase is connected.

## Admin Auth
- Admin routes now use NextAuth credentials instead of the old client-side session flag.
- Seeded development admin: `admin@carhiremauritius.com` with password `Admin@1234`
- Required env vars for login: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and a working `DATABASE_URL`

## Brand Identity
- **Primary Color**: Midnight Navy (#1B2D4F)
- **Accent Color**: Mauritian Gold (#C9A84C)
- **Typography**: Playfair Display (Luxury Headers) & Inter (Modern Body)
