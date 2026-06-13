"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { ClipboardList, Search, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { getAuditLog } from '@/src/lib/actions/admin.actions'

const ENTITIES = ['', 'Booking', 'Car', 'User', 'Branch', 'Payment']

const ACTION_COLORS: Record<string, string> = {
  created: 'bg-emerald-100 text-emerald-700',
  deleted: 'bg-red-100 text-red-700',
  updated: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  modified: 'bg-orange-100 text-orange-700',
  blacklisted: 'bg-red-200 text-red-800',
  vip: 'bg-yellow-100 text-yellow-700',
  payment: 'bg-purple-100 text-purple-700',
  status: 'bg-blue-100 text-blue-700',
}

function getActionColor(action: string): string {
  const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().includes(k))
  return key ? ACTION_COLORS[key] : 'bg-gray-100 text-gray-600'
}

export default function AuditLogPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ entity: '', action: '', page: 1 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAuditLog(filters)
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchData() }, [fetchData])

  const setFilter = (key: string, value: any) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }))

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Audit Log</h1>
          <p className="text-gray-500 font-medium mt-1">Every admin action timestamped for compliance.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#0D9B84] transition-colors">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Filter by Action</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="e.g. cancelled, created..." value={filters.action} onChange={e => setFilter('action', e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] outline-none w-full" />
          </div>
        </div>
        <div className="min-w-[160px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Entity Type</p>
          <select value={filters.entity} onChange={e => setFilter('entity', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] outline-none">
            {ENTITIES.map(e => <option key={e} value={e}>{e || 'All Entities'}</option>)}
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-[#1E293B] uppercase tracking-wide text-sm flex items-center gap-2">
            <ClipboardList size={16} className="text-[#0D9B84]" />
            Activity Log {loading ? '' : '(' + (data?.total || 0) + ' entries)'}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0D9B84] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !data?.logs?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ClipboardList size={40} className="mb-3 opacity-30" />
            <p className="font-bold">No audit logs found</p>
            <p className="text-sm mt-1">Admin actions will be recorded here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase font-black text-gray-400 tracking-wider bg-gray-50">
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left">Timestamp</th>
                  <th className="px-6 py-4 text-left">Action</th>
                  <th className="px-6 py-4 text-left">Entity</th>
                  <th className="px-6 py-4 text-left">Entity ID</th>
                  <th className="px-6 py-4 text-left">Changes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-bold text-[#1E293B]">{new Date(log.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
                      <p className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={['text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide', getActionColor(log.action)].join(' ')}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[#1E293B] bg-gray-100 px-2 py-1 rounded">
                        {log.entity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {log.entityId ? log.entityId.slice(0, 12) + '...' : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      {(log.newData || log.oldData) ? (
                        <div className="space-y-1">
                          {log.newData && Object.entries(log.newData).slice(0, 3).map(([k, v]) => (
                            <p key={k} className="text-[10px] text-gray-500">
                              <span className="font-black text-[#1E293B]">{k}:</span>{' '}
                              <span className="truncate">{String(v)?.slice(0, 40)}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
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
              <button disabled={data.currentPage <= 1} onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#0D9B84] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={14} /> Prev
              </button>
              <button disabled={data.currentPage >= data.pages} onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-[#0D9B84] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
