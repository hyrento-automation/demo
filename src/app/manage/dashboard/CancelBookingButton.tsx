"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitCancellationRequest } from '@/src/lib/actions/manage.actions'
import { Loader2, Trash2 } from 'lucide-react'

export default function CancelBookingButton({ bookingId, canCancelFree }: { bookingId: string, canCancelFree: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    const msg = canCancelFree 
      ? "Are you sure you want to cancel this booking? This is free of charge." 
      : "Are you sure? A 1-day rental penalty will be deducted from your refund due to late cancellation."
      
    if (!confirm(msg)) return
    
    setLoading(true)
    try {
      await submitCancellationRequest(bookingId)
      alert("Your booking has been successfully cancelled. A confirmation email has been sent.")
      router.refresh()
    } catch (err: any) {
      alert("Failed to cancel: " + err.message)
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleCancel}
      disabled={loading}
      className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black transition-all ${
        canCancelFree ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
      }`}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      Cancel Booking
    </button>
  )
}
