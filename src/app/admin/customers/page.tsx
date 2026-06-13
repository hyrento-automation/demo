"use client"

import React, { useState, useEffect, useCallback } from 'react'
import {
  Users, Search, Mail, Phone, Crown, ShieldAlert, Award,
  Ban, Star, Plus, Eye, Loader2, CheckCircle, AlertCircle,
  ChevronLeft, ChevronRight, X, StickyNote, Car, RefreshCw
} from 'lucide-react'
import {
  getCustomersDashboard, toggleCustomerVIP,
  toggleCustomerBlacklist, addCustomerNote, getCustomerProfile
} from '@/src/lib/actions/admin.actions'

export default function CustomersPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState<'all' | 'vip' | 'blacklisted'>('all')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string; id?: string } | null>(null)

  // Customer profile modal
  const [profileId, setProfileId] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [blacklistReason, setBlacklistReason] = useState('')

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getCustomersDashboard()
      setData(result)
    } catch {
      setData({ customers: [], stats: { total: 0, vip: 0, blacklisted: 0 } })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  const openProfile = async (id: string) => {
    setProfileId(id)
    setProfileLoading(true)
    try {
      const p = await getCustomerProfile(id)
      setProfile(p)
    } catch { setProfile(null) }
    finally { setProfileLoading(false) }
  }

  const closeProfile = () => { setProfileId(null); setProfile(null); setBlacklistReason('') }

  const handleVIP = async (id: string, current: boolean) => {
    setStatus(null)
    try {
      await toggleCustomerVIP(id, !current)
      setStatus({ type: 'success', msg: !current ? 'VIP status granted!' : 'VIP status removed.', id })
      fetchDashboard()
      if (profileId === id) openProfile(id)
      setTimeout(() => setStatus(null), 2500)
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message, id })
    }
  }

  const handleBlacklist = async (id: string, current: boolean) => {
    if (!current && !blacklistReason.trim()) {
      setStatus({ type: 'error', msg: 'Please enter a reason for blacklisting.', id })
      return
    }
    setStatus(null)
    try {
      await toggleCustomerBlacklist(id, !current, blacklistReason)
      setStatus({ type: 'success', msg: !current ? 'Customer blacklisted.' : 'Blacklist removed.', id })
      setBlacklistReason('')
      fetchDashboard()
      if (profileId === id) openProfile(id)
      setTimeout(() => setStatus(null), 2500)
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message, id })
    }
  }

  const handleAddNote = async (userId: string) => {
    if (!newNote.trim()) return
    setAddingNote(true)
    try {
      await addCustomerNote(userId, newNote, 'Admin')
      setNewNote('')
      openProfile(userId)
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setAddingNote(false)
    }
  }

  const filtered = data?.customers?.filter((c: any) => {
    const matchSearch = `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
    if (filterTab === 'vip') return matchSearch && c.isVIP
    if (filterTab === 'blacklisted') return matchSearch && c.isBlacklisted
    return matchSearch
  }) || []

  return (
    <div className="space-y-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Customer CRM</h1>
          <p className="text-gray-500 font-medium mt-1">Full profiles, contact history, VIP & blacklist management.</p>
        </div>
        <button onClick={fetchDashboard} className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#0D9B84] transition-colors">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Customers', value: data.stats.total, icon: <Users size={18} />, color: 'bg-blue-50 text-blue-600' },
            { label: 'VIP Clients', value: data.stats.vip, icon: <Crown size={18} />, color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Blacklisted', value: data.stats.blacklisted, icon: <Ban size={18} />, color: 'bg-red-50 text-red-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', s.color].join(' ')}>{s.icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.label}</p>
                <p className="text-2xl font-black text-[#1E293B]">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email, phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] outline-none w-full" />
        </div>
        <div className="flex gap-2">
          {(['all', 'vip', 'blacklisted'] as const).map(t => (
            <button key={t} onClick={() => setFilterTab(t)}
              className={['px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border transition-all', filterTab === t ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#0D9B84]'].join(' ')}>
              {t === 'blacklisted' ? '🚫 Blacklisted' : t === 'vip' ? '👑 VIP' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      {status && !profileId && (
        <div className={['p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border', status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'].join(' ')}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {status.msg}
        </div>
      )}

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#0D9B84] animate-spin" /></div>
        ) : !filtered.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="font-bold">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase font-black text-gray-400 tracking-wider bg-gray-50">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-center">Bookings</th>
                  <th className="px-6 py-4 text-left">Status & Points</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user: any) => (
                  <tr key={user.id} className={['hover:bg-gray-50/80 transition-colors', user.isBlacklisted ? 'bg-red-50/30' : ''].join(' ')}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={['w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white flex-shrink-0', user.isBlacklisted ? 'bg-red-600' : user.isVIP ? 'bg-[#0D9B84]' : 'bg-[#1E293B]'].join(' ')}>
                          {(user.name || user.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#1E293B]">{user.name || 'Unknown'}</p>
                          {user.isBlacklisted && <span className="text-[9px] font-black uppercase text-red-600 bg-red-100 px-1.5 py-0.5 rounded">BANNED</span>}
                          {user.isVIP && !user.isBlacklisted && <span className="text-[9px] font-black uppercase text-[#0D9B84] bg-yellow-50 px-1.5 py-0.5 rounded">VIP</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs"><Mail size={11} /> {user.email}</div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs"><Phone size={11} /> {user.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono bg-gray-100 px-3 py-1 rounded text-gray-700 font-black">{user._count?.bookings || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                        <Award size={12} className="text-blue-500" /> {user.loyaltyPoints || 0} pts
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openProfile(user.id)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="View Profile">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleVIP(user.id, user.isVIP)}
                          className={['p-2 rounded-lg transition-colors', user.isVIP ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600'].join(' ')}
                          title={user.isVIP ? 'Remove VIP' : 'Grant VIP'}>
                          <Crown size={14} />
                        </button>
                        <button onClick={() => {
                          if (user.isBlacklisted) { handleBlacklist(user.id, true) }
                          else { openProfile(user.id) }
                        }}
                          className={['p-2 rounded-lg transition-colors', user.isBlacklisted ? 'bg-red-200 text-red-700 hover:bg-red-300' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'].join(' ')}
                          title={user.isBlacklisted ? 'Remove from Blacklist' : 'Blacklist Customer'}>
                          <Ban size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      {profileId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeProfile} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Modal Header */}
            <div className="bg-[#1E293B] text-white p-6 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-black">Customer Profile</h2>
                <p className="text-sm text-white/60 mt-0.5">{profile?.name} · Full history & actions</p>
              </div>
              <button onClick={closeProfile} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                <X size={16} />
              </button>
            </div>

            {profileLoading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#0D9B84] animate-spin" /></div>
            ) : !profile ? (
              <p className="text-center py-12 text-gray-400 font-bold">Profile not found.</p>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">

                {/* Status */}
                {status && (
                  <div className={['p-3 rounded-xl flex items-center gap-2 text-sm font-bold border', status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'].join(' ')}>
                    {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {status.msg}
                  </div>
                )}

                {/* Profile Summary */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-5">
                  <div className={['w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white', profile.isBlacklisted ? 'bg-red-600' : profile.isVIP ? 'bg-[#0D9B84]' : 'bg-[#1E293B]'].join(' ')}>
                    {(profile.name || profile.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-[#1E293B] text-lg">{profile.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <p className="text-sm text-gray-500">{profile.phone || 'No phone'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#1E293B]">{profile.bookings?.length || 0}</p>
                    <p className="text-xs font-black text-gray-400 uppercase">Bookings</p>
                    <p className="text-sm font-black text-[#0D9B84] mt-1">{profile.loyaltyPoints || 0} pts</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleVIP(profile.id, profile.isVIP)}
                    className={['flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm border-2 transition-all', profile.isVIP ? 'border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'border-gray-200 bg-white text-gray-600 hover:border-yellow-400 hover:text-yellow-600'].join(' ')}>
                    <Crown size={16} /> {profile.isVIP ? 'Remove VIP' : 'Grant VIP'}
                  </button>
                  <div className="space-y-2">
                    {!profile.isBlacklisted && (
                      <input value={blacklistReason} onChange={e => setBlacklistReason(e.target.value)}
                        placeholder="Reason for blacklist..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:border-red-400 outline-none" />
                    )}
                    <button onClick={() => handleBlacklist(profile.id, profile.isBlacklisted)}
                      className={['flex items-center justify-center gap-2 py-2.5 rounded-2xl font-black text-sm border-2 w-full transition-all', profile.isBlacklisted ? 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'].join(' ')}>
                      <Ban size={15} /> {profile.isBlacklisted ? 'Remove Blacklist' : 'Blacklist'}
                    </button>
                  </div>
                </div>

                {/* Booking History */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide mb-4 flex items-center gap-2"><Car size={14} className="text-[#0D9B84]" /> Booking History</h3>
                  {!profile.bookings?.length ? (
                    <p className="text-xs text-gray-400 text-center py-4">No bookings yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {profile.bookings.map((b: any) => (
                        <div key={b.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                          <div>
                            <p className="text-xs font-mono font-bold text-[#1E293B]">{b.bookingRef}</p>
                            <p className="text-xs text-gray-400">{b.car?.make} {b.car?.model} · {b.totalDays}d</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-[#1E293B]">MUR {b.totalPrice?.toLocaleString()}</p>
                            <span className={['text-[9px] font-black px-1.5 py-0.5 rounded', b.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-700'].join(' ')}>{b.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide mb-4 flex items-center gap-2"><StickyNote size={14} className="text-[#0D9B84]" /> Internal Notes</h3>
                  <div className="flex gap-2 mb-4">
                    <input value={newNote} onChange={e => setNewNote(e.target.value)}
                      placeholder="Add a note about this customer..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-[#0D9B84] outline-none"
                      onKeyDown={e => e.key === 'Enter' && handleAddNote(profile.id)} />
                    <button onClick={() => handleAddNote(profile.id)} disabled={addingNote || !newNote.trim()}
                      className="bg-[#1E293B] text-white px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1 disabled:opacity-50">
                      {addingNote ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add
                    </button>
                  </div>
                  {!profile.notes?.length ? (
                    <p className="text-xs text-gray-400 text-center py-2">No notes yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {profile.notes.map((n: any) => (
                        <div key={n.id} className="bg-yellow-50 border border-yellow-100 p-3 rounded-xl">
                          <p className="text-xs text-gray-700">{n.note}</p>
                          <p className="text-[10px] text-gray-400 mt-1">By {n.createdBy} · {new Date(n.createdAt).toLocaleDateString('en-GB')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
