"use client"

import React, { useState, useEffect } from 'react'
import {
  Shield, Database, RefreshCw, KeyRound, Server, Cloud,
  CheckCircle, XCircle, Loader2, Settings, Bell, Globe,
  Lock, Zap, AlertTriangle
} from 'lucide-react'

type DbStatus = 'checking' | 'connected' | 'error'

export default function AdminSettingsPage() {
  const [dbStatus, setDbStatus] = useState<DbStatus>('checking')
  const [tableCount, setTableCount] = useState<number | null>(null)
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Check DB connectivity and env vars
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setDbStatus('checking')
    try {
      const res = await fetch('/api/admin/health')
      if (res.ok) {
        const data = await res.json()
        setDbStatus('connected')
        setTableCount(data.tableCount || null)
        setEnvStatus(data.envStatus || {})
      } else {
        setDbStatus('error')
      }
    } catch {
      setDbStatus('error')
    }
  }

  const ENV_KEYS = [
    { key: 'DATABASE_URL', label: 'Database URL (Supabase Postgres)', critical: true },
    { key: 'DIRECT_URL', label: 'Direct URL (Prisma migrations)', critical: true },
    { key: 'NEXTAUTH_SECRET', label: 'NextAuth Secret', critical: true },
    { key: 'NEXT_PUBLIC_SUPABASE_URL', label: 'Supabase Project URL', critical: false },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', label: 'Supabase Anon Key', critical: false },
    { key: 'STRIPE_SECRET_KEY', label: 'Stripe Secret Key', critical: false },
    { key: 'RESEND_API_KEY', label: 'Resend (Email)', critical: false },
    { key: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', label: 'Cloudinary (Image Upload)', critical: false },
  ]

  const HARDENING = [
    {
      title: 'Row Level Security',
      description: 'Run setup_supabase.sql in your Supabase SQL editor to enable RLS policies on all tables. This prevents unauthorized direct database access.',
      icon: Lock,
      status: envStatus['NEXT_PUBLIC_SUPABASE_URL'] ? 'ok' : 'pending',
    },
    {
      title: 'Admin Authentication',
      description: 'Admin access runs through NextAuth credentials with role-aware sessions. The seeded admin account is admin@carhiremauritius.com — change this in production.',
      icon: Shield,
      status: 'ok',
    },
    {
      title: 'Database Connectivity',
      description: 'Uses Prisma with PgBouncer pooling (DATABASE_URL) for runtime and directUrl for migrations. Auto-fallback to demo mode if DB is unreachable.',
      icon: Database,
      status: dbStatus === 'connected' ? 'ok' : 'error',
    },
    {
      title: 'Cache Invalidation',
      description: 'Fleet and booking mutations call revalidatePath() on all affected routes — dashboard, calendar, fleet, and booking detail stay in sync automatically.',
      icon: RefreshCw,
      status: 'ok',
    },
    {
      title: 'Audit Logging',
      description: 'Every admin mutation (booking create/cancel/modify, fleet add/delete, customer VIP/blacklist) is written to the AuditLog table with timestamp and diff.',
      icon: Bell,
      status: 'ok',
    },
    {
      title: 'Image Storage',
      description: 'Vehicle images are uploaded to Supabase Storage (vehicle-images bucket) acting as the primary image provider. Fallback to default placeholder on failure.',
      icon: Cloud,
      status: envStatus['NEXT_PUBLIC_SUPABASE_URL'] ? 'ok' : 'pending',
    },
  ]

  const statusColor = {
    ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    pending: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700',
  }

  return (
    <div className="space-y-10 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E293B] rounded-2xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#0D9B84]" />
            </div>
            System Settings
          </h1>
          <p className="text-gray-500 font-medium mt-1">Infrastructure health, environment configuration, and security hardening.</p>
        </div>
        <button
          onClick={checkStatus}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#0D9B84] font-bold text-sm transition-colors"
        >
          <RefreshCw size={15} /> Refresh Status
        </button>
      </div>

      {/* DB Connection Live Status */}
      <div className={[
        'rounded-3xl p-6 border-2 flex items-center justify-between gap-6',
        dbStatus === 'connected' ? 'bg-emerald-50 border-emerald-200' :
        dbStatus === 'error' ? 'bg-red-50 border-red-200' :
        'bg-blue-50 border-blue-200'
      ].join(' ')}>
        <div className="flex items-center gap-4">
          <div className={[
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            dbStatus === 'connected' ? 'bg-emerald-100' :
            dbStatus === 'error' ? 'bg-red-100' : 'bg-blue-100'
          ].join(' ')}>
            {dbStatus === 'checking' ? (
              <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
            ) : dbStatus === 'connected' ? (
              <Server className="w-7 h-7 text-emerald-600" />
            ) : (
              <XCircle className="w-7 h-7 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-black text-[#1E293B] text-lg">
              {dbStatus === 'checking' ? 'Checking database...' :
               dbStatus === 'connected' ? '✅ Supabase Connected' :
               '❌ Database Unreachable'}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              {dbStatus === 'connected'
                ? `Prisma ↔ Supabase PostgreSQL${tableCount ? ` · ${tableCount} tables active` : ''}`
                : dbStatus === 'error'
                ? 'Check DATABASE_URL and DIRECT_URL in your .env file'
                : 'Connecting to Supabase PostgreSQL via Prisma...'}
            </p>
          </div>
        </div>
        <div className={[
          'px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wide',
          dbStatus === 'connected' ? 'bg-emerald-200 text-emerald-800' :
          dbStatus === 'error' ? 'bg-red-200 text-red-800' :
          'bg-blue-200 text-blue-800'
        ].join(' ')}>
          {dbStatus === 'connected' ? 'LIVE' : dbStatus === 'error' ? 'ERROR' : 'CHECKING'}
        </div>
      </div>

      {/* Environment Variables Status */}
      <div>
        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap size={16} className="text-[#0D9B84]" /> Environment Variables
        </h2>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {ENV_KEYS.map((env) => {
              const isSet = envStatus[env.key]
              return (
                <div key={env.key} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={[
                      'w-2 h-2 rounded-full flex-shrink-0',
                      isSet ? 'bg-emerald-500' : env.critical ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
                    ].join(' ')} />
                    <div>
                      <p className="font-mono text-sm font-bold text-[#1E293B]">{env.key}</p>
                      <p className="text-xs text-gray-400">{env.label}</p>
                    </div>
                    {env.critical && (
                      <span className="text-[9px] font-black uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">Required</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isSet ? (
                      <span className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        <CheckCircle size={12} /> Set
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-black text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
                        <XCircle size={12} /> Not set
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="p-4 bg-blue-50 border-t border-blue-100">
            <p className="text-xs text-blue-700 font-bold flex items-start gap-2">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              Edit <code className="bg-blue-100 px-1 rounded">.env</code> in your project root and restart the dev server for changes to take effect.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Hardening */}
      <div>
        <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Shield size={16} className="text-[#0D9B84]" /> Security & Hardening Checklist
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {HARDENING.map((item) => (
            <div
              key={item.title}
              className={[
                'rounded-2xl p-5 border',
                statusColor[item.status as keyof typeof statusColor]
              ].join(' ')}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-sm">{item.title}</h3>
                    <span className={[
                      'text-[9px] font-black uppercase px-2 py-0.5 rounded-full',
                      item.status === 'ok' ? 'bg-emerald-200 text-emerald-800' :
                      item.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    ].join(' ')}>
                      {item.status === 'ok' ? '✓ DONE' : item.status === 'pending' ? '⚡ TODO' : '✗ ERROR'}
                    </span>
                  </div>
                  <p className="text-xs leading-5">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Setup Guide */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#121f38] rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D9B84]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-black uppercase tracking-tight text-lg flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-[#0D9B84]" /> Quick Supabase Setup Guide
          </h2>
          <ol className="space-y-4">
            {[
              {
                step: '1',
                title: 'Get Your Credentials',
                desc: 'supabase.com → Project → Settings → Database → Connection String. Copy both the Pooler (port 6543) and Direct (port 5432) URLs.',
              },
              {
                step: '2',
                title: 'Fill in .env',
                desc: 'Open .env in the project root. Replace [PROJECT-REF] and [PASSWORD] in DATABASE_URL and DIRECT_URL with your actual credentials.',
              },
              {
                step: '3',
                title: 'Push Schema',
                desc: 'Run: npm run db:push — This creates all 14 tables (Car, Booking, Payment, User, Branch, etc.) directly in your Supabase database.',
              },
              {
                step: '4',
                title: 'Apply RLS Policies',
                desc: 'Open setup_supabase.sql → copy all content → paste into Supabase SQL Editor → Run. This secures all tables.',
              },
              {
                step: '5',
                title: 'Seed Sample Data',
                desc: 'Run: npm run db:seed — Populates 12 vehicles, sample bookings, customers and branches so the dashboard has live data to display.',
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="w-7 h-7 bg-[#0D9B84] rounded-lg flex items-center justify-center font-black text-xs text-[#1E293B] flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-black text-sm text-white">{item.title}</p>
                  <p className="text-xs text-white/60 mt-0.5 leading-5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

    </div>
  )
}
