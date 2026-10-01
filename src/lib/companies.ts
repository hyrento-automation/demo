import { createClient } from '@supabase/supabase-js'
import { Company, getCompanyBySlug as getStaticCompanyBySlug, getCompanyByHost as getStaticCompanyByHost, extractSubdomain } from '@/src/data/companies'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwphulzhsebsrapfjwgy.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

/**
 * Fetch company by slug.
 * Tries Supabase first. If table does not exist or network/db fails,
 * falls back immediately to the pre-seeded static registry.
 */
export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  if (!slug) return null
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '')

  try {
    if (supabaseKey) {
      const { data, error } = await supabaseAdmin
        .from('companies')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle()

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          logo: data.logo || undefined,
          phone: data.phone,
          whatsapp: data.whatsapp,
          email: data.email,
          address: data.address,
          city: data.city,
          country: data.country,
          website: data.website || undefined,
          currency: data.currency || 'MUR',
          bookingRefPrefix: data.booking_ref_prefix || cleanSlug.slice(0, 3).toUpperCase(),
        }
      }
    }
  } catch (err) {
    console.warn(`Supabase company lookup error for slug [${cleanSlug}], using static fallback:`, err)
  }

  return getStaticCompanyBySlug(cleanSlug)
}

/**
 * Resolve company by incoming Host header or window.location.hostname
 */
export async function resolveCompany(host?: string | null): Promise<Company | null> {
  const sub = extractSubdomain(host)
  if (!sub) return null
  return await getCompanyBySlug(sub)
}
