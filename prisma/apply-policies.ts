import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('Applying Supabase SQL RLS policies and initial configurations...')
  
  const sqlPath = path.join(__dirname, '../setup_supabase.sql')
  if (!fs.existsSync(sqlPath)) {
    console.error(`Error: SQL file not found at ${sqlPath}`)
    process.exit(1)
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8')

  // Split sql statements by semicolon, but handle comments/newlines gracefully
  // PostgreSQL supports running multi-statement queries in a single query via simple query protocol.
  // We can try to run it all as one block first. If that fails, we can execute statement by statement.
  try {
    console.log('Executing SQL statements...')
    await prisma.$executeRawUnsafe(sqlContent)
    console.log('✅ Supabase SQL RLS policies and config applied successfully!')
  } catch (error: any) {
    console.warn('⚠️ Standard execution failed, trying statement by statement...', error.message)
    
    // Fallback: Split by semicolon and run each statement separately
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      try {
        await prisma.$executeRawUnsafe(statement)
      } catch (stmtError: any) {
        console.error(`❌ Failed statement: ${statement.substring(0, 100)}...`)
        console.error(`Reason: ${stmtError.message}`)
      }
    }
    console.log('Finished statement by statement application.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
