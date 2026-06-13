import { NextResponse } from 'next/server'
import { stripe } from '@/src/lib/stripe'

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      return NextResponse.json(
        { error: 'Stripe Secret Key is not configured on the server. Please set STRIPE_SECRET_KEY in your .env or server environment.' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { amount, currency = 'mur' } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Attempt to parse amount to smallest currency unit (MUR has no cents in Stripe theoretically, 
    // but Stripe standard expects integers. For MUR, amount is in MUR, but standard practice is *100 if it supports decimals... Wait. 
    // MUR is a zero-decimal currency in Stripe. 
    // See Stripe zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal
    // MUR does have cents (cents) in real life, but maybe in Stripe it's zero-decimal or 100-based?
    // According to Stripe, MUR is NOT in the zero-decimal list. So it's * 100.
    
    const amountInCents = Math.round(amount * 100)

    // Create a PaymentIntent with the exact calculated amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error: any) {
    console.error('Stripe API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
