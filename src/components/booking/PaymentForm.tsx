"use client"

import React, { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Loader2, Lock } from 'lucide-react'

interface PaymentFormProps {
  amount: number
  onSuccess: () => void
  disabled?: boolean
}

export default function PaymentForm({ amount, onSuccess, disabled }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || disabled) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Confirm the payment directly on this page without full redirect (if card supports it)
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // You ideally set a return_url for 3D secure redirects, but we want to stick to SPA
        },
        redirect: 'if_required',
      })

      if (submitError) {
        throw new Error(submitError.message || 'Payment failed')
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment went through directly. Execute our onSuccess callback to save to DB!
        onSuccess()
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // 3D secure is required but handled by elements
        // if redirect: "if_required" was passed, the iframe usually handles it inline
        setError('Additional authentication required.')
      } else {
        throw new Error('Unexpected payment status: ' + paymentIntent?.status)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred processing your card.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={16} className="text-[#0D9B84]" />
          Secure Credit Card Checkout
        </h3>
        {/* Stripe injects the native iframe fields here */}
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-semibold text-center border border-red-200">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || disabled}
        className="w-full bg-[#0D9B84] hover:bg-[#0aa38a] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0D9B84]/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing Securely...
          </>
        ) : (
          `Pay Rs ${(amount).toLocaleString()} & Confirm Booking`
        )}
      </button>
      
      <p className="text-center text-xs text-gray-400 font-medium">
        Payments processed securely via Stripe. 256-bit encryption.
      </p>
    </form>
  )
}
