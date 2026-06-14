import { PrismaClient } from '@prisma/client'

// Vercel's Supabase integration injects POSTGRES_URL / POSTGRES_URL_NON_POOLING.
// Our schema reads DATABASE_URL / DIRECT_URL.
// Bridge both so the app works whether env vars are set manually or via the integration.
if (!process.env.DATABASE_URL && process.env.POSTGRES_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL
}
if (!process.env.DIRECT_URL && process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DIRECT_URL = process.env.POSTGRES_URL_NON_POOLING
}
// Also support POSTGRES_PRISMA_URL (another name Vercel sometimes uses)
if (!process.env.DATABASE_URL && process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL
}

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
