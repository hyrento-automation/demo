"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Car, User, Calendar, MapPin, CreditCard, Clock,
  Edit, XCircle, CheckCircle, AlertTriangle, Loader2, Plus, RefreshCw
} from 'lucide-react'
import {
  getBookingById,
  modifyBooking,
  cancelBooking,
  recordPayment,
  getAvailableCars
} from '@/src/lib/actions/admin.actions'

const LOCATIONS = [
  'SSR International Airport (MRU)',
  'Port Louis City Centre',
  'Grand Baie',
  'Flic en Flac',
  'Le Morne',
  'Tamarin',
  'Mahebourg',
  'Hotel Delivery (Specify in Notes)',
]

const TIME_SLOTS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    COMPLETED: 'bg-gray-100 text-gray-600 border-gray-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <span className={['inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border', map[status] || 'bg-gray-50 text-gray-600 border-gray-200'].join(' ')}>
      {status}
    </span>
  )
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'modify' | 'cancel' | 'payment'>('overview')

  // Modification state
  const [modifyForm, setModifyForm] = useState({
    pickupDate: '', pickupTime: '09:00',
    returnDate: '', returnTime: '09:00',
    pickupLocation: '', returnLocation: '',
    carId: '', totalPrice: 0,
    specialRequests: '', internalNotes: '',
    oneWay: false,
  })
  const [availableCars, setAvailableCars] = useState<any[]>([])
  const [carsLoading, setCarsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // Cancel state
  const [cancelReason, setCancelReason] = useState('')
  const [refundPreview, setRefundPreview] = useState<{ policy: string; amount: number } | null>(null)
  const [cancelling, setCancelling] = useState(false)

  // Payment state
  const [paymentForm, setPaymentForm] = useState({ amount: 0, provider: 'cash', type: 'full', notes: '' })
  const [paymentSaving, setPaymentSaving] = useState(false)

  const fetchBooking = async () => {
    setLoading(true)
    try {
      const b = await getBookingById(id)
      setBooking(b)
      if (b) {
        const pd = new Date(b.pickupDate)
        const rd = new Date(b.returnDate)
        setModifyForm({
          pickupDate: pd.toISOString().split('T')[0],
          pickupTime: pd.toTimeString().slice(0, 5),
          returnDate: rd.toISOString().split('T')[0],
          returnTime: rd.toTimeString().slice(0, 5),
          pickupLocation: b.pickupLocation,
          returnLocation: b.returnLocation,
          carId: b.carId,
          totalPrice: b.totalPrice,
          specialRequests: b.specialRequests || '',
          internalNotes: b.internalNotes || '',
          oneWay: b.pickupLocation !== b.returnLocation,
        })
        setPaymentForm(prev => ({ ...prev, amount: b.totalPrice - (b.payments?.reduce((s: number, p: any) => s + (p.status === 'PAID' ? p.amount : 0), 0) || 0) }))

        // Compute refund preview
        const now = new Date()
        const days = Math.ceil((pd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (days > 7) setRefundPreview({ policy: 'Full Refund (>7 days notice)', amount: b.totalPrice })
        else if (days >= 3) setRefundPreview({ policy: '50% Refund (3–7 days notice)', amount: b.totalPrice * 0.5 })
        else setRefundPreview({ policy: 'No Refund (<3 days notice)', amount: 0 })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooking() }, [id])

  // Live availability check when dates change
  useEffect(() => {
    if (!modifyForm.pickupDate || !modifyForm.returnDate) return
    setCarsLoading(true)
    getAvailableCars(modifyForm.pickupDate, modifyForm.returnDate)
      .then(cars => {
        setAvailableCars(cars)
        // Include current car even if not strictly "available" (it's this booking's car)
        if (booking && !cars.find((c: any) => c.id === booking.carId)) {
          setAvailableCars(prev => [{ id: booking.carId, make: booking.car?.make, model: booking.car?.model, category: booking.car?.category, plateNumber: booking.car?.plateNumber, pricePerDay: booking.car?.pricePerDay }, ...prev])
        }
      })
      .catch(() => setAvailableCars([]))
      .finally(() => setCarsLoading(false))
  }, [modifyForm.pickupDate, modifyForm.returnDate])

  // Auto-calculate price when car or dates change
  useEffect(() => {
    if (!modifyForm.carId || !modifyForm.pickupDate || !modifyForm.returnDate) return
    const car = availableCars.find((c: any) => c.id === modifyForm.carId)
    if (!car) return
    const days = Math.ceil((new Date(modifyForm.returnDate).getTime() - new Date(modifyForm.pickupDate).getTime()) / (1000 * 60 * 60 * 24)) || 1
    const rate = days >= 7 ? (car.pricePerWeek || car.pricePerDay * 6) / 7 : car.pricePerDay
    setModifyForm(prev => ({ ...prev, totalPrice: Math.round(rate * days) }))
  }, [modifyForm.carId, modifyForm.pickupDate, modifyForm.returnDate, availableCars])

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setResult(null)
    try {
      await modifyBooking(id, {
        ...modifyForm,
        totalPrice: Number(modifyForm.totalPrice),
        returnLocation: modifyForm.oneWay ? modifyForm.returnLocation : modifyForm.pickupLocation,
      })
      setResult({ type: 'success', msg: 'Booking updated successfully!' })
      fetchBooking()
    } catch (err: any) {
      setResult({ type: 'error', msg: err.message || 'Failed to update booking.' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) { setResult({ type: 'error', msg: 'Please enter a cancellation reason.' }); return }
    setCancelling(true)
    setResult(null)
    try {
      const res = await cancelBooking(id, cancelReason)
      setResult({ type: 'success', msg: 'Booking cancelled. ' + (refundPreview ? 'Refund due: MUR ' + refundPreview.amount.toLocaleString() : '') })
      fetchBooking()
    } catch (err: any) {
      setResult({ type: 'error', msg: err.message })
    } finally {
      setCancelling(false)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (paymentForm.amount <= 0) { setResult({ type: 'error', msg: 'Enter a valid amount.' }); return }
    setPaymentSaving(true)
    setResult(null)
    try {
      await recordPayment(id, paymentForm)
      setResult({ type: 'success', msg: 'Payment recorded successfully!' })
      fetchBooking()
    } catch (err: any) {
      setResult({ type: 'error', msg: err.message })
    } finally {
      setPaymentSaving(false)
    }
  }

  const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] focus:ring-2 focus:ring-[#0D9B84]/10 outline-none transition-all'
  const labelCls = 'text-[10px] uppercase font-black text-gray-400 tracking-widest'

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <Loader2 className="w-10 h-10 text-[#0D9B84] animate-spin" />
    </div>
  )

  if (!booking) return (
    <div className="text-center py-20">
      <p className="text-gray-500 font-bold">Booking not found.</p>
      <Link href="/admin/bookings" className="text-[#0D9B84] font-bold mt-4 inline-flex items-center gap-2"><ArrowLeft size={14} /> Back to Bookings</Link>
    </div>
  )

  const totalPaid = booking.payments?.filter((p: any) => p.status === 'PAID').reduce((s: number, p: any) => s + p.amount, 0) || 0
  const balanceDue = booking.totalPrice - totalPaid

  return (
    <div className="space-y-8 pb-12 max-w-6xl">

      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href="/admin/bookings" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1E293B] transition-colors">
          <ArrowLeft size={16} /> All Bookings
        </Link>
        <button onClick={fetchBooking} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-[#0D9B84] transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Booking Header Card */}
      <div className="bg-[#1E293B] text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-2">Booking Reference</p>
              <h1 className="text-3xl font-black tracking-tight font-mono text-[#0D9B84]">{booking.bookingRef}</h1>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <StatusBadge status={booking.status} />
                <span className={['inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border', booking.paymentStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'].join(' ')}>
                  {booking.paymentStatus?.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Total Value</p>
              <p className="text-4xl font-black text-white">MUR {booking.totalPrice?.toLocaleString()}</p>
              <p className="text-sm text-white/50 mt-1">{booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''} rental</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-white/50 font-bold mb-1 flex items-center gap-1"><User size={12} /> Customer</p>
              <p className="font-black text-white">{booking.driverName || booking.user?.name || '—'}</p>
              <p className="text-xs text-white/50">{booking.driverPhone || booking.user?.email || ''}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-bold mb-1 flex items-center gap-1"><Car size={12} /> Vehicle</p>
              <p className="font-black text-white">{booking.car?.make} {booking.car?.model}</p>
              <p className="text-xs text-white/50">{booking.car?.plateNumber} · {booking.car?.category}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-bold mb-1 flex items-center gap-1"><MapPin size={12} /> Pickup</p>
              <p className="font-bold text-white text-sm">{booking.pickupLocation}</p>
              <p className="text-xs text-white/50">{new Date(booking.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-bold mb-1 flex items-center gap-1"><MapPin size={12} /> Return</p>
              <p className="font-bold text-white text-sm">{booking.returnLocation}</p>
              <p className="text-xs text-white/50">{new Date(booking.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'overview', label: 'Overview & Payments', icon: <CreditCard size={14} /> },
          { key: 'modify', label: 'Modify Booking', icon: <Edit size={14} /> },
          { key: 'payment', label: 'Record Payment', icon: <Plus size={14} /> },
          { key: 'cancel', label: 'Cancel Booking', icon: <XCircle size={14} /> },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key as any); setResult(null) }}
            className={[
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border',
              tab === t.key
                ? t.key === 'cancel' ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'bg-[#1E293B] border-[#1E293B] text-white shadow-lg'
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#0D9B84]'
            ].join(' ')}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Status/Result Banner */}
      {result && (
        <div className={['p-4 rounded-2xl flex items-start gap-3 text-sm font-bold border', result.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'].join(' ')}>
          {result.type === 'success' ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />}
          {result.msg}
        </div>
      )}

      {/* Tab: Overview */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
            <h3 className="font-black text-[#1E293B] uppercase tracking-wide text-sm border-b border-gray-100 pb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total Value</span><span className="font-black text-[#1E293B]">MUR {booking.totalPrice?.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Total Paid</span><span className="font-black text-emerald-600">MUR {totalPaid.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm border-t border-gray-100 pt-3"><span className="font-black text-gray-700">Balance Due</span><span className={'font-black text-xl ' + (balanceDue > 0 ? 'text-red-600' : 'text-emerald-600')}>MUR {balanceDue.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-4">
            <h3 className="font-black text-[#1E293B] uppercase tracking-wide text-sm border-b border-gray-100 pb-4">Payment History</h3>
            {booking.payments?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {booking.payments?.map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                    <div>
                      <p className="text-xs font-black text-[#1E293B] uppercase">{p.provider} · {p.type}</p>
                      <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                    <p className="font-black text-[#1E293B]">MUR {p.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {(booking.specialRequests || booking.internalNotes) && (
            <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-4">
              <h3 className="font-black text-[#1E293B] uppercase tracking-wide text-sm border-b border-gray-100 pb-4">Notes</h3>
              {booking.specialRequests && <div><p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Customer Requests</p><p className="text-sm text-gray-700">{booking.specialRequests}</p></div>}
              {booking.internalNotes && <div><p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Internal Notes</p><p className="text-sm text-gray-700 font-semibold">{booking.internalNotes}</p></div>}
            </div>
          )}
        </div>
      )}

      {/* Tab: Modify */}
      {tab === 'modify' && (
        <form onSubmit={handleModify} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <h3 className="font-black text-[#1E293B] uppercase tracking-wide border-b border-gray-100 pb-4">Modify Booking</h3>

          {/* Dates & Times */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={labelCls}>Pickup Date</p>
              <input type="date" value={modifyForm.pickupDate} onChange={e => setModifyForm(p => ({ ...p, pickupDate: e.target.value }))} className={inputCls + ' mt-1'} required />
            </div>
            <div>
              <p className={labelCls}>Pickup Time</p>
              <select value={modifyForm.pickupTime} onChange={e => setModifyForm(p => ({ ...p, pickupTime: e.target.value }))} className={inputCls + ' mt-1'}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className={labelCls}>Return Date</p>
              <input type="date" value={modifyForm.returnDate} onChange={e => setModifyForm(p => ({ ...p, returnDate: e.target.value }))} className={inputCls + ' mt-1'} required />
            </div>
            <div>
              <p className={labelCls}>Return Time</p>
              <select value={modifyForm.returnTime} onChange={e => setModifyForm(p => ({ ...p, returnTime: e.target.value }))} className={inputCls + ' mt-1'}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <p className={labelCls}>One-Way Rental (Different Return Location)</p>
              <button type="button" onClick={() => setModifyForm(p => ({ ...p, oneWay: !p.oneWay }))}
                className={['w-12 h-6 rounded-full transition-colors relative', modifyForm.oneWay ? 'bg-[#0D9B84]' : 'bg-gray-200'].join(' ')}>
                <div className={['w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow', modifyForm.oneWay ? 'translate-x-6' : 'translate-x-0.5'].join(' ')} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={labelCls}>Pickup Location</p>
                <select value={modifyForm.pickupLocation} onChange={e => setModifyForm(p => ({ ...p, pickupLocation: e.target.value }))} className={inputCls + ' mt-1'}>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              {modifyForm.oneWay && (
                <div>
                  <p className={labelCls}>Return Location (Different Branch)</p>
                  <select value={modifyForm.returnLocation} onChange={e => setModifyForm(p => ({ ...p, returnLocation: e.target.value }))} className={inputCls + ' mt-1'}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <p className={labelCls}>Vehicle {carsLoading ? '(checking availability...)' : availableCars.length > 0 ? '(' + availableCars.length + ' available)' : ''}</p>
            <select value={modifyForm.carId} onChange={e => setModifyForm(p => ({ ...p, carId: e.target.value }))} className={inputCls + ' mt-1'} disabled={carsLoading}>
              <option value="">-- Select Vehicle --</option>
              {availableCars.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.make} {c.model} ({c.category}) · {c.plateNumber || 'No Plate'} · MUR {c.pricePerDay}/day
                </option>
              ))}
            </select>
          </div>

          {/* Total Price */}
          <div>
            <p className={labelCls}>Total Price (MUR) — Auto-calculated, can override</p>
            <input type="number" value={modifyForm.totalPrice} onChange={e => setModifyForm(p => ({ ...p, totalPrice: Number(e.target.value) }))} className={inputCls + ' mt-1'} />
          </div>

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={labelCls}>Special Requests</p>
              <textarea rows={2} value={modifyForm.specialRequests} onChange={e => setModifyForm(p => ({ ...p, specialRequests: e.target.value }))} className={inputCls + ' mt-1'} />
            </div>
            <div>
              <p className={labelCls}>Internal Notes</p>
              <textarea rows={2} value={modifyForm.internalNotes} onChange={e => setModifyForm(p => ({ ...p, internalNotes: e.target.value }))} className={inputCls + ' mt-1'} />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="bg-[#1E293B] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#0D9B84] transition-colors disabled:opacity-50">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Edit size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      )}

      {/* Tab: Record Payment */}
      {tab === 'payment' && (
        <form onSubmit={handlePayment} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <h3 className="font-black text-[#1E293B] uppercase tracking-wide border-b border-gray-100 pb-4">Record New Payment</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm">
            <p className="font-black text-yellow-700">Balance Due: <span className="text-xl">MUR {balanceDue.toLocaleString()}</span></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className={labelCls}>Amount (MUR)</p>
              <input type="number" required min={1} value={paymentForm.amount} onChange={e => setPaymentForm(p => ({ ...p, amount: Number(e.target.value) }))} className={inputCls + ' mt-1'} />
            </div>
            <div>
              <p className={labelCls}>Payment Method</p>
              <select value={paymentForm.provider} onChange={e => setPaymentForm(p => ({ ...p, provider: e.target.value }))} className={inputCls + ' mt-1'}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="stripe">Stripe / Online</option>
                <option value="juice">Juice / Mobile Pay</option>
              </select>
            </div>
            <div>
              <p className={labelCls}>Payment Type</p>
              <select value={paymentForm.type} onChange={e => setPaymentForm(p => ({ ...p, type: e.target.value }))} className={inputCls + ' mt-1'}>
                <option value="full">Full Payment</option>
                <option value="deposit">Deposit</option>
                <option value="balance">Balance Payment</option>
                <option value="refund">Refund Issued</option>
              </select>
            </div>
          </div>
          <div>
            <p className={labelCls}>Notes</p>
            <input type="text" value={paymentForm.notes} onChange={e => setPaymentForm(p => ({ ...p, notes: e.target.value }))} className={inputCls + ' mt-1'} placeholder="e.g. Cash received at airport, receipt #1234" />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={paymentSaving} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50">
              {paymentSaving ? <><Loader2 size={16} className="animate-spin" /> Recording...</> : <><CheckCircle size={16} /> Record Payment</>}
            </button>
          </div>
        </form>
      )}

      {/* Tab: Cancel */}
      {tab === 'cancel' && (
        <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-8 space-y-6">
          <h3 className="font-black text-red-700 uppercase tracking-wide border-b border-red-100 pb-4 flex items-center gap-2">
            <XCircle size={18} /> Cancel Booking
          </h3>

          {booking.status === 'CANCELLED' ? (
            <div className="text-center py-8 text-gray-500">
              <XCircle size={40} className="mx-auto mb-3 text-red-300" />
              <p className="font-bold">This booking has already been cancelled.</p>
            </div>
          ) : (
            <>
              {/* Refund Policy Preview */}
              {refundPreview && (
                <div className={['p-5 rounded-2xl border', refundPreview.amount > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'].join(' ')}>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Refund Policy Applied</p>
                  <p className="font-black text-lg text-[#1E293B]">{refundPreview.policy}</p>
                  <p className={['text-2xl font-black mt-1', refundPreview.amount > 0 ? 'text-emerald-700' : 'text-red-600'].join(' ')}>
                    MUR {refundPreview.amount.toLocaleString()} {refundPreview.amount === 0 ? '(No refund)' : 'to refund'}
                  </p>
                </div>
              )}

              <div>
                <p className={labelCls}>Cancellation Reason *</p>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Customer request — travel plans changed"
                  className={inputCls + ' mt-1'}
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm font-bold text-red-700 flex items-center gap-2">
                  <AlertTriangle size={16} /> This action cannot be undone. The car will be freed back to available status.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelling ? <><Loader2 size={16} className="animate-spin" /> Cancelling...</> : <><XCircle size={16} /> Confirm Cancellation</>}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
