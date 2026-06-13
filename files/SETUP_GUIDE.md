# ⚙️ SETUP & ENVIRONMENT GUIDE
## Car Hire Mauritius

---

## 📦 PACKAGE.JSON

```json
{
  "name": "car-hire-mauritius",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.10.0",
    "next-auth": "^4.24.0",
    "stripe": "^14.18.0",
    "@stripe/stripe-js": "^3.1.0",
    "@stripe/react-stripe-js": "^2.6.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.22.4",
    "react-day-picker": "^8.10.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "@types/leaflet": "^1.9.8",
    "embla-carousel-react": "^8.0.0",
    "framer-motion": "^11.0.8",
    "lucide-react": "^0.363.0",
    "recharts": "^2.12.3",
    "resend": "^3.2.0",
    "twilio": "^5.0.0",
    "cloudinary": "^2.2.0",
    "@react-pdf/renderer": "^3.3.0",
    "bcryptjs": "^2.4.3",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.2",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "prisma": "^5.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.4.2",
    "@types/react": "^18.2.73",
    "@types/node": "^20.11.30",
    "@types/bcryptjs": "^2.4.6",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

---

## 🔐 ENVIRONMENT VARIABLES (.env.local)

```bash
# Database (Supabase Postgres)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth (from console.cloud.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Razorpay (fallback payment)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-secret"

# Resend (transactional emails)
RESEND_API_KEY="re_..."
FROM_EMAIL="bookings@carhiremauritius.com"

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-token"
TWILIO_PHONE_NUMBER="+12345678"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

# Cloudinary (image hosting)
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Car Hire Mauritius"
```

---

## 🚀 QUICK START (Development)

```bash
# 1. Clone and install
git clone [repo]
cd car-hire-mauritius
npm install

# 2. Set up database
# Create a Supabase project at supabase.com
# Copy connection string to .env.local

# 3. Push schema
npx prisma db push

# 4. Seed with dummy data (20 cars + all config)
npm run db:seed

# 5. Install shadcn/ui components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select dialog sheet badge tabs

# 6. Start dev server
npm run dev
```

---

## 🌐 DEPLOYMENT (Vercel)

```bash
# 1. Push to GitHub
# 2. Connect repo to Vercel
# 3. Add all environment variables in Vercel dashboard
# 4. Set up Stripe webhook endpoint:
#    https://your-domain.vercel.app/api/webhooks/stripe
# 5. Run migration on production:
#    npx prisma migrate deploy
```

---

## 📱 SHADCN/UI COMPONENTS TO INSTALL

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add textarea
```

---

## 🔧 TAILWIND CONFIG

```js
// tailwind.config.ts
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1B2D4F', light: '#2A4A7F', dark: '#0F1E35' },
        gold: { DEFAULT: '#C9A84C', light: '#E8C97A', dark: '#A68432' },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(27, 45, 79, 0.08)',
        hover: '0 8px 32px rgba(27, 45, 79, 0.15)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
```
