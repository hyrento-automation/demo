"use client"

import React, { useState, useEffect } from 'react'
import { Building2, Users, MapPin, Plus, Trash2, Shield, RefreshCw, Loader2, CheckCircle, AlertCircle, Edit2, Truck, Navigation, DollarSign } from 'lucide-react'
import { getBranchDashboard, createBranch, deleteBranch, getStaffList, updateStaffRole, updateBranch } from '@/src/lib/actions/admin.actions'

const ROLES = ['ADMIN', 'MANAGER', 'BRANCH_STAFF', 'CUSTOMER']
const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  MANAGER: 'bg-purple-100 text-purple-700',
  BRANCH_STAFF: 'bg-blue-100 text-blue-700',
  CUSTOMER: 'bg-gray-100 text-gray-500',
}

const emptyBranchForm = { name: '', address: '', phone: '', email: '', pickupCharge: '0', deliveryCharge: '0' }

export default function BranchesPage() {
  const [data, setData] = useState<any>(null)
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'branches' | 'staff'>('branches')
  const [showAddBranch, setShowAddBranch] = useState(false)
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const [branchForm, setBranchForm] = useState(emptyBranchForm)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [bData, sData] = await Promise.all([getBranchDashboard(), getStaffList()])
      setData(bData)
      setStaff(sData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!branchForm.name || !branchForm.address) { setStatus({ type: 'error', msg: 'Name and address are required.' }); return }
    setSaving(true)
    setStatus(null)
    try {
      if (editingBranchId) {
        await updateBranch(editingBranchId, branchForm)
        setStatus({ type: 'success', msg: 'Branch updated successfully!' })
      } else {
        await createBranch(branchForm)
        setStatus({ type: 'success', msg: 'Branch created successfully!' })
      }
      setBranchForm(emptyBranchForm)
      setShowAddBranch(false)
      setEditingBranchId(null)
      fetchAll()
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBranch = async (id: string, name: string) => {
    if (!confirm(`Delete branch "${name}"? Cars assigned to it will be unassigned.`)) return
    try {
      await deleteBranch(id)
      fetchAll()
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message })
    }
  }

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await updateStaffRole(id, role)
      setStaff(prev => prev.map(s => s.id === id ? { ...s, role } : s))
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message })
    }
  }

  const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] outline-none transition-all'

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Branches & Staff</h1>
          <p className="text-gray-500 font-medium mt-1">Manage locations, assign roles and permissions.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchAll} className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#0D9B84] transition-colors">
            <RefreshCw size={16} />
          </button>
          {tab === 'branches' && (
            <button onClick={() => { setBranchForm(emptyBranchForm); setEditingBranchId(null); setShowAddBranch(!showAddBranch); }} className="bg-[#0D9B84] text-white px-5 py-2.5 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-[#b08e36] transition-all shadow-lg shadow-[#0D9B84]/20">
              <Plus size={16} /> Add Branch
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Branches', value: data.branches?.length || 0, icon: <Building2 size={18} />, color: 'bg-blue-50 text-blue-600' },
            { label: 'Staff Members', value: data.staffCount, icon: <Users size={18} />, color: 'bg-purple-50 text-purple-600' },
            { label: 'Locations', value: data.locationCount, icon: <MapPin size={18} />, color: 'bg-emerald-50 text-emerald-600' },
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

      {/* Tab Nav */}
      <div className="flex gap-2">
        {[{ key: 'branches', label: 'Branches', icon: <Building2 size={14} /> }, { key: 'staff', label: 'Staff & Permissions', icon: <Shield size={14} /> }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={['flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border', tab === t.key ? 'bg-[#1E293B] border-[#1E293B] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#0D9B84]'].join(' ')}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Status */}
      {status && (
        <div className={['p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border', status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'].join(' ')}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {status.msg}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#0D9B84] animate-spin" /></div>
      ) : (
        <>
          {/* Add / Edit Branch Form */}
          {tab === 'branches' && showAddBranch && (
            <form onSubmit={handleCreateBranch} className="bg-white rounded-3xl border border-[#0D9B84]/30 shadow-sm p-8 space-y-6">
              <h3 className="font-black text-[#1E293B] uppercase tracking-wide border-b border-gray-100 pb-4">
                {editingBranchId ? 'Edit Branch' : 'New Branch'}
              </h3>

              {/* Basic Info */}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Branch Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Branch Name *</p><input required value={branchForm.name} onChange={e => setBranchForm(p => ({ ...p, name: e.target.value }))} className={inputCls} placeholder="e.g. Airport Branch" /></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Address *</p><input required value={branchForm.address} onChange={e => setBranchForm(p => ({ ...p, address: e.target.value }))} className={inputCls} placeholder="e.g. SSR Airport Terminal, Plaine Magnien" /></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone</p><input value={branchForm.phone} onChange={e => setBranchForm(p => ({ ...p, phone: e.target.value }))} className={inputCls} placeholder="+230 XXXX XXXX" /></div>
                  <div><p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p><input type="email" value={branchForm.email} onChange={e => setBranchForm(p => ({ ...p, email: e.target.value }))} className={inputCls} placeholder="branch@carhiremauritius.com" /></div>
                </div>
              </div>

              {/* Location-Based Charges */}
              <div className="bg-[#0D9B84]/5 rounded-2xl p-5 border border-[#0D9B84]/20">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={16} className="text-[#0D9B84]" />
                  <p className="text-sm font-black uppercase tracking-widest text-[#0D9B84]">Location-Based Charges (€)</p>
                </div>
                <p className="text-xs text-gray-500 mb-4">Set the pickup and delivery surcharge for customers choosing this branch location. Enter 0 for no charge.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Navigation size={12} className="text-[#0D9B84]" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pickup Charge (€)</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={branchForm.pickupCharge}
                      onChange={e => setBranchForm(p => ({ ...p, pickupCharge: e.target.value }))}
                      className={inputCls}
                      placeholder="0.00"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Charged when customer picks up from this branch</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Truck size={12} className="text-[#0D9B84]" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Charge (€)</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={branchForm.deliveryCharge}
                      onChange={e => setBranchForm(p => ({ ...p, deliveryCharge: e.target.value }))}
                      className={inputCls}
                      placeholder="0.00"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Charged when car is delivered to/from this branch</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowAddBranch(false); setEditingBranchId(null); }} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100">Cancel</button>
                <button type="submit" disabled={saving} className="bg-[#0D9B84] text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Building2 size={14} /> {editingBranchId ? 'Update Branch' : 'Create Branch'}</>}
                </button>
              </div>
            </form>
          )}

          {/* Branches List */}
          {tab === 'branches' && (
            <div className="space-y-4">
              {!data?.branches?.length ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-400">
                  <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-bold">No branches yet. Add your first branch above.</p>
                </div>
              ) : data.branches.map((branch: any) => {
                const available = branch.cars?.filter((c: any) => c.status === 'AVAILABLE').length || 0
                const rented = branch.cars?.filter((c: any) => c.status === 'RENTED').length || 0
                return (
                  <div key={branch.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#1E293B] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <p className="font-black text-[#1E293B] text-lg">{branch.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {branch.address}</p>
                          {branch.phone && <p className="text-xs text-gray-400 mt-1">{branch.phone} · {branch.email}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-black text-emerald-600">{available}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-yellow-600">{rented}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rented</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-[#1E293B]">{branch.cars?.length || 0}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Cars</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setBranchForm({
                              name: branch.name,
                              address: branch.address,
                              phone: branch.phone || '',
                              email: branch.email || '',
                              pickupCharge: String(branch.pickupCharge ?? 0),
                              deliveryCharge: String(branch.deliveryCharge ?? 0),
                            });
                            setEditingBranchId(branch.id);
                            setShowAddBranch(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} className="p-2 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteBranch(branch.id, branch.name)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Location Charges Row */}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs">
                        <Navigation size={13} className="text-[#0D9B84]" />
                        <span className="text-gray-500">Pickup Charge:</span>
                        {(branch.pickupCharge ?? 0) > 0 ? (
                          <span className="font-black text-[#0D9B84]">€ {Number(branch.pickupCharge).toFixed(2)}</span>
                        ) : (
                          <span className="font-bold text-emerald-600">Free</span>
                        )}
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <div className="flex items-center gap-2 text-xs">
                        <Truck size={13} className="text-[#0D9B84]" />
                        <span className="text-gray-500">Delivery Charge:</span>
                        {(branch.deliveryCharge ?? 0) > 0 ? (
                          <span className="font-black text-[#0D9B84]">€ {Number(branch.deliveryCharge).toFixed(2)}</span>
                        ) : (
                          <span className="font-bold text-emerald-600">Free</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Staff Table */}
          {tab === 'staff' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-black text-[#1E293B] uppercase tracking-wide">Staff & Role Permissions</h2>
                <p className="text-sm text-gray-400 mt-1">Change roles to grant or restrict admin access.</p>
              </div>
              {!staff.length ? (
                <p className="text-center py-12 text-gray-400 font-bold">No staff members found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-[10px] uppercase font-black text-gray-400 tracking-wider bg-gray-50">
                      <tr className="border-b border-gray-100">
                        <th className="px-6 py-4 text-left">Staff Member</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Current Role</th>
                        <th className="px-6 py-4 text-left">Change Role</th>
                        <th className="px-6 py-4 text-left">Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {staff.map(member => (
                        <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#1E293B] text-white flex items-center justify-center font-black text-xs">
                                {(member.name || member.email || 'U')[0].toUpperCase()}
                              </div>
                              <p className="font-bold text-[#1E293B]">{member.name || 'Unnamed'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-xs">{member.email}</td>
                          <td className="px-6 py-4">
                            <span className={['text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide', ROLE_COLORS[member.role] || 'bg-gray-100 text-gray-500'].join(' ')}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={member.role}
                              onChange={e => handleRoleChange(member.id, e.target.value)}
                              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1E293B] focus:border-[#0D9B84] outline-none"
                            >
                              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">{new Date(member.createdAt).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
