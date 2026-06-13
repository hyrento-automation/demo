import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Manual .env parsing
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return {}
  
  const content = fs.readFileSync(envPath, 'utf8')
  const env: Record<string, string> = {}
  
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      let value = match[2] || ''
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
      env[match[1]] = value
    }
  })
  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function inspectRLS() {
  console.log('--- Inspecting Table RLS Status ---')
  
  // We can query the information_schema or pg_policies via rpc if set up, 
  // but a simpler way is to try a simple select without service role (using anon key)
  // Let's use the service role to just list tables first
  
  const { data, error } = await supabase.rpc('get_policies') 
  // Note: get_policies is not standard, we might need to use raw SQL if we had direct access.
  // Since we have DIRECT_URL, we could use Prisma to check policies? No.
  
  console.log('Since I am using the Service Role, I can see everything.')
  console.log('I will provide you with a SQL snippet to ensure basic RLS is set up correctly.')
}

async function checkTables() {
    const tables = ['Booking', 'Car', 'Payment', 'Customer', 'Addon']
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('id').limit(1)
        if (error) {
            console.log(`❌ Table "${table}" error:`, error.message)
        } else {
            console.log(`✅ Table "${table}" accessible.`)
        }
    }
}

async function main() {
  await checkTables()
}

main()
