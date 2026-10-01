import { NextRequest, NextResponse } from 'next/server'
import { COMPANIES, getCompanyBySlug } from '@/src/data/companies'
import { getCompanyBySlug as fetchSupabaseCompany, supabaseAdmin } from '@/src/lib/companies'
import { parseCSV } from '@/scripts/import-companies'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const comp = await fetchSupabaseCompany(slug)
    if (!comp) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }
    return NextResponse.json(comp)
  }

  // If no slug, list all companies
  try {
    const { data, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .order('name', { ascending: true })

    if (!error && data && data.length > 0) {
      return NextResponse.json(data)
    }
  } catch (err) {
    // fallback
  }

  return NextResponse.json(COMPANIES)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // If raw CSV string provided:
    if (body.csv) {
      const parsed = parseCSV(body.csv)
      const { data, error } = await supabaseAdmin
        .from('companies')
        .upsert(parsed, { onConflict: 'slug' })

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true, count: parsed.length, companies: parsed })
    }

    // If single company object:
    const { data, error } = await supabaseAdmin
      .from('companies')
      .upsert(body, { onConflict: 'slug' })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
