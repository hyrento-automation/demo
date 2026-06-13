"use client"

import React, { useState } from 'react'
import { Loader2, Lock, CreditCard } from 'lucide-react'

interface DemoPaymentFormProps {
  amount: number
  onSuccess: () => void
  disabled?: boolean
}

export default function DemoPaymentForm({ amount, onSuccess, disabled }: DemoPaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [expiry, setExpiry] = useState('12/26')
  const [cvc, setCvc] = useState('424')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return
    setLoading(true)

    // Simulate network delay to mimic payment processor securely establishing bank connection
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-blue-200 bg-blue-50/30">
        <h3 className="text-sm font-bold text-[#1E293B] mb-2 flex items-center gap-2">
          <Lock size={16} className="text-blue-500" />
          Virtual Demo Gateway Active
        </h3>
        <p className="text-xs text-gray-500 mb-6 font-medium">
          Stripe is not configured. We have securely dropped you into the Sandbox environment. Feel free to use the default 4242 Stripe testing inputs below.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Card Information</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono tracking-widest text-[#1E293B]"
                maxLength={19}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-center text-[#1E293B]"
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <input 
                type="text" 
                value={cvc}
                onChange={e => setCvc(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-center text-[#1E293B]"
                placeholder="CVC"
                maxLength={4}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || disabled}
        className="w-full bg-[#1E293B] hover:bg-[#111c34] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1E293B]/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing Sandbox Transaction...
          </>
        ) : (
          `Sandbox Pay Rs ${(amount).toLocaleString()} & Confirm Booking`
        )}
      </button>
      
      <p className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
        Test Mode — No Real Card Charged
      </p>
    </form>
  )
}
