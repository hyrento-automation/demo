"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Users, Car, Calendar, BarChart3, RefreshCw, DollarSign } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { getAnalyticsReport } from '@/src/lib/actions/admin.actions'

const PERIODS = [
  { label: '7 Days', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'This Year', value: 'year' },
]

const UTIL_COLORS = ['#0D9B84', '#0D9B84', '#1E293B', '#F59E0B', '#EF4444']

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await getAnalyticsReport(period)
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [period])

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Revenue & Analytics</h1>
          <p className="text-gray-500 font-medium mt-1">Full business intelligence across fleet & bookings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value as any)}
                className={['px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all', period === p.value ? 'bg-[#1E293B] text-white' : 'text-gray-500 hover:text-[#1E293B]'].join(' ')}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#0D9B84] transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-40">
          <div className="w-10 h-10 border-4 border-[#0D9B84] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !data ? (
        <p className="text-center text-gray-400 py-20">No data available</p>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: 'Total Revenue', value: 'MUR ' + (data.currentRevenue || 0).toLocaleString(),
                growth: data.revenueGrowth, icon: <DollarSign size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50'
              },
              {
                label: 'Bookings', value: data.totalBookings, icon: <Calendar size={20} />, color: 'text-blue-600', bg: 'bg-blue-50',
                sub: data.cancelledBookings + ' cancelled'
              },
              {
                label: 'New Customers', value: data.newCustomers, icon: <Users size={20} />, color: 'text-[#0D9B84]', bg: 'bg-yellow-50',
                sub: 'registered this period'
              },
              {
                label: 'Fleet Tracked', value: data.fleetUtilisation?.length || 0, icon: <Car size={20} />, color: 'text-[#1E293B]', bg: 'bg-gray-100',
                sub: 'vehicles in system'
              },
            ].map((kpi, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:-translate-y-1 transition-all">
                <div className={['w-10 h-10 rounded-2xl flex items-center justify-center mb-4', kpi.bg, kpi.color].join(' ')}>
                  {kpi.icon}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{kpi.label}</p>
                <p className="text-3xl font-black text-[#1E293B] mt-1">{kpi.value}</p>
                {kpi.growth !== undefined && (
                  <div className={['flex items-center gap-1 text-xs font-bold mt-2', kpi.growth >= 0 ? 'text-emerald-600' : 'text-red-600'].join(' ')}>
                    {kpi.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {kpi.growth >= 0 ? '+' : ''}{kpi.growth}% vs prior
                  </div>
                )}
                {kpi.sub && <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>}
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="font-black text-[#1E293B] uppercase tracking-tight mb-6 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#0D9B84]" /> Revenue Over Time
            </h2>
            {data.revenueChart?.length > 0 ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D9B84" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0D9B84" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 'bold' }} width={70} tickFormatter={(v: number) => 'MUR ' + (v / 1000).toFixed(0) + 'k'} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }} formatter={(v: number) => ['MUR ' + v.toLocaleString(), 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#0D9B84" strokeWidth={3} fillOpacity={1} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-10">No payment data for this period yet.</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Vehicles */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="font-black text-[#1E293B] uppercase tracking-tight mb-6">Top Performing Vehicles</h2>
              {data.topVehicles?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No bookings data yet for this period.</p>
              ) : (
                <div className="space-y-4">
                  {data.topVehicles?.map((v: any, i: number) => (
                    <div key={v.carId} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white" style={{ background: UTIL_COLORS[i] || '#666' }}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#1E293B] text-sm">{v.car?.make} {v.car?.model}</p>
                        <p className="text-xs text-gray-400">{v.car?.category} · {v.bookings} booking{v.bookings !== 1 ? 's' : ''}</p>
                      </div>
                      <p className="font-black text-[#1E293B] text-sm">MUR {(v.revenue || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fleet Utilisation */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="font-black text-[#1E293B] uppercase tracking-tight mb-6">Fleet Utilisation Rates</h2>
              {data.fleetUtilisation?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No fleet data available.</p>
              ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {data.fleetUtilisation?.map((car: any) => (
                    <div key={car.id}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-bold text-[#1E293B]">{car.make} {car.model}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-gray-400">{car.rentedDays}d rented · {car.idleDays}d idle</p>
                          <p className={'text-xs font-black ' + (car.utilRate >= 70 ? 'text-emerald-600' : car.utilRate >= 40 ? 'text-yellow-600' : 'text-red-500')}>
                            {car.utilRate}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={'h-full rounded-full transition-all ' + (car.utilRate >= 70 ? 'bg-emerald-500' : car.utilRate >= 40 ? 'bg-yellow-400' : 'bg-red-400')}
                          style={{ width: car.utilRate + '%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
