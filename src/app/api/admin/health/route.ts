import { NextResponse } from 'next/server'
import db from '@/src/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Check both our variable names AND Vercel's Supabase integration variable names
  const envStatus: Record<string, boolean> = {
    DATABASE_URL: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL),
    DIRECT_URL: !!(process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING),
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  }

  try {
    // Test DB by counting cars table (fastest possible query)
    const carCount = await db.car.count()
    const bookingCount = await db.booking.count()

    return NextResponse.json({
      status: 'connected',
      tableCount: 14, // Our schema has 14 models
      carCount,
      bookingCount,
      envStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Database connection failed',
        envStatus,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
