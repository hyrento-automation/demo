"use client"

import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Loader2 } from 'lucide-react'

// Use placeholder explicitly if .env is missing to allow UI rendering without immediate crash
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

export default function StripeCheckoutProvider({
  amount,
  children,
}: {
  amount: number
  children: React.ReactNode
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only hit API if amount is positive
    if (amount <= 0) return

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Network error trying to contact Stripe endpoint.')
        return res.json()
      })
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setClientSecret(data.clientSecret)
      })
      .catch((err) => {
        console.error('Failed to initialize payment:', err)
        setError('Failed to initialize payment gateway. Please try again.')
      })
  }, [amount])

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm font-bold">
        {error}
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-gray-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D9B84]" />
        <p className="text-sm font-medium">Connecting to secure checkout...</p>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0D9B84',
            colorBackground: '#ffffff',
            colorText: '#1E293B',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '8px',
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}
