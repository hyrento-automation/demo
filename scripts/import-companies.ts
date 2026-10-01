import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wwphulzhsebsrapfjwgy.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cGh1bHpoc2Vic3JhcGZqd2d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzMyMDg4MiwiZXhwIjoyMDk4ODk2ODgyfQ.rc9LwukXeMYGebD0QOmWKHtDaz5FaFYvP94g5GE01Uc'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

export function parseCSV(content: string) {
  const lines = content.split('\n').filter(l => l.trim().length > 0)
  if (lines.length === 0) return []

  // Check header
  const headerLine = lines[0].toLowerCase()
  const hasPhoneFirst = headerLine.startsWith('phone')

  const results: any[] = []

  for (let i = 1; i < lines.length; i++) {
    const row: string[] = []
    let inQuotes = false
    let current = ''

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    row.push(current.trim())

    if (row.length < 2) continue

    let phone = '', name = '', country = '', address = '', website = '', logo = '', email = '', city = ''

    if (hasPhoneFirst) {
      // Format: Phone,Company Name,Country,Address,Website
      phone = row[0] || ''
      name = row[1] || ''
      country = row[2] || 'Mauritius'
      address = row[3] || ''
      website = row[4] || ''
    } else {
      // Standard format: company_name,logo,phone,whatsapp,email,address,city,country
      name = row[0] || ''
      logo = row[1] || ''
      phone = row[2] || ''
      email = row[4] || ''
      address = row[5] || ''
      city = row[6] || ''
      country = row[7] || 'Mauritius'
    }

    if (!name) continue

    const slug = slugify(name)
    const bookingRefPrefix = slug.slice(0, 3).toUpperCase()

    // Determine city if not set
    if (!city && address) {
      const parts = address.split(',')
      city = parts[0].trim()
    }

    // Determine email if not set
    if (!email) {
      const domain = website ? website.replace(/https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '') : `${slug}.com`
      email = `info@${domain}`
    }

    results.push({
      id: `comp_${slug}`,
      name,
      slug,
      logo: logo || null,
      phone,
      whatsapp: phone,
      email,
      address,
      city: city || address,
      country,
      website: website || null,
      currency: country === 'India' ? 'INR' : country === 'Spain' ? 'EUR' : country === 'Switzerland' ? 'CHF' : country.toLowerCase().includes('emirates') ? 'AED' : 'MUR',
      booking_ref_prefix: bookingRefPrefix,
      is_active: true,
      updated_at: new Date().toISOString()
    })
  }

  return results
}

async function main() {
  const csvFile = process.argv[2] || path.join(process.cwd(), 'leads_with_company_country_address - leads_with_company_country_address.csv')
  console.log(`📄 Reading CSV from: ${csvFile}`)

  if (!fs.existsSync(csvFile)) {
    console.error(`❌ File not found: ${csvFile}`)
    process.exit(1)
  }

  const content = fs.readFileSync(csvFile, 'utf8')
  const companies = parseCSV(content)
  console.log(`📊 Found ${companies.length} companies to import/update:`)

  for (const comp of companies) {
    console.log(` - [${comp.slug}] ${comp.name} -> ${comp.slug}.hyrento.com (${comp.phone})`)
  }

  console.log(`\n🚀 Upserting into Supabase 'companies' table...`)
  const { data, error } = await supabase
    .from('companies')
    .upsert(companies, { onConflict: 'slug' })

  if (error) {
    console.warn(`⚠️ Supabase upsert returned: ${error.message}`)
    console.log(`Note: If 'companies' table is not yet created in Supabase, execute 'supabase_companies.sql' in your Supabase SQL Editor.`)
  } else {
    console.log(`✅ Successfully synced ${companies.length} companies to Supabase!`)
  }

  console.log(`\n🎉 Done! All subdomains ready:`)
  for (const comp of companies.slice(0, 5)) {
    console.log(`   🌐 https://${comp.slug}.hyrento.com`)
  }
}

if (require.main === module) {
  main().catch(console.error)
}
