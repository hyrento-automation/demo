"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Filter, Plus, ChevronLeft, ChevronRight,
  Calendar, Car, User, CreditCard, CheckCircle, Clock,
  XCircle, AlertTriangle, Eye, Edit, Ban, RefreshCw
} from 'lucide-react'
import { getBookingsDashboard } from '@/src/lib/actions/admin.actions'
import ManualBookingModal from '@/src/app/admin/components/ManualBookingModal'

const STATUSES = ['', 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']
const PAYMENT_STATUSES = ['', 'PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED', 'FAILED']

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    CONFIRMED: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <CheckCircle size={10} /> },
    ACTIVE: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <Car size={10} /> },
    PENDING: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock size={10} /> },
    COMPLETED: { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: <CheckCircle size={10} /> },
    CANCELLED: { color: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle size={10} /> },
  }
  const s = map[status] || { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: null }
  return (
    <span className={['inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border', s.color].join(' ')}>
      {s.icon} {status}
    </span>
  )
}

const PaymentBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PARTIALLY_PAID: 'bg-orange-50 text-orange-700 border-orange-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    REFUNDED: 'bg-blue-50 text-blue-700 border-blue-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
  }
  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border', map[status] || 'bg-gray-50 text-gray-600 border-gray-200'].join(' ')}>
      {status?.replace('_', ' ')}
    </span>
  )
}

export default function BookingsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    page: 1,
  })
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getBookingsDashboard(filters)
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const setFilter = (key: string, value: any) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }))

  const inputCls = 'bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] outline-none w-full'

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Booking Management</h1>
          <p className="text-gray-500 font-medium mt-1">Full control over all reservations — live from your database.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0D9B84] text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-[#b08e36] transition-all active:scale-95 shadow-lg shadow-[#0D9B84]/30"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: data.total, color: 'text-[#1E293B]', bg: 'bg-white' },
            { label: 'This Month', value: data.monthlyCount, color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'Monthly Revenue', value: 'MUR ' + (data.monthlyRevenue || 0).toLocaleString(), color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Pages', value: data.pages + ' pages', color: 'text-gray-500', bg: 'bg-gray-50' },
          ].map((s, i) => (
            <div key={i} className={['rounded-2xl p-5 border border-gray-100 shadow-sm', s.bg].join(' ')}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
              <p className={['text-2xl font-black mt-1', s.color].join(' ')}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ref, name, phone, email, vehicle..."
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] outline-none w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={['flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors', showFilters ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0D9B84]'].join(' ')}
          >
            <Filter size={14} /> Filters
          </button>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-gray-200 bg-white text-gray-600 hover:border-[#0D9B84] transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Booking Status</p>
              <select value={filters.status} onChange={e => setFilter('status', e.target.value)} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">Payment Status</p>
              <select value={filters.paymentStatus} onChange={e => setFilter('paymentStatus', e.target.value)} className={inputCls}>
                {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s || 'All Payments'}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">From Date</p>
              <input type="date" value={filters.startDate} onChange={e => setFilter('startDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">To Date</p>
              <input type="date" value={filters.endDate} onChange={e => setFilter('endDate', e.target.value)} className={inputCls} />
            </div>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-[#1E293B] uppercase tracking-wide text-sm">
            Bookings {loading ? '...' : `(${data?.total || 0})`}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0D9B84] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data?.bookings?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Calendar size={40} className="mb-3 opacity-30" />
            <p className="font-bold">No bookings found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-[10px] uppercase font-black text-gray-400 tracking-wider bg-gray-50">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4">Booking Ref</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.bookings.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded font-bold text-[#1E293B]">
                        {booking.bookingRef}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#1E293B]">{booking.driverName || booking.user?.name || '—'}</p>
                        <p className="text-xs text-gray-400">{booking.driverPhone || booking.user?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#1E293B]">{booking.car?.make} {booking.car?.model}</p>
                        <p className="text-xs text-gray-400">{booking.car?.category} · {booking.car?.plateNumber || 'No Plate'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <p><span className="text-gray-400">Pick:</span> <span className="font-bold text-[#1E293B]">{new Date(booking.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span></p>
                        <p><span className="text-gray-400">Drop:</span> <span className="font-bold text-[#1E293B]">{new Date(booking.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span></p>
                        <p className="text-gray-400">{booking.totalDays} day{booking.totalDays !== 1 ? 's' : ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5 max-w-[140px]">
                        <p className="truncate font-semibold text-[#1E293B]" title={booking.pickupLocation}>{booking.pickupLocation}</p>
                        {booking.returnLocation !== booking.pickupLocation && (
                          <p className="truncate text-orange-600 font-semibold" title={booking.returnLocation}>→ {booking.returnLocation}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-black text-[#1E293B]">MUR {booking.totalPrice?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={'/admin/bookings/' + booking.id}>
                          <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View & Manage">
                            <Eye size={14} />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="p-5 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Page <span className="font-black text-[#1E293B]">{data.currentPage}</span> of <span className="font-black">{data.pages}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={data.currentPage <= 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#0D9B84] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                disabled={data.currentPage >= data.pages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#0D9B84] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ManualBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} />
    </div>
  )
}
