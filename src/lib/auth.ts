import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import db from '@/src/lib/db'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Admin credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
            isBlacklisted: true,
          },
        })

        if (!user?.passwordHash || user.isBlacklisted) {
          return null
        }

        const passwordMatches = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!passwordMatches) {
          return null
        }

        if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.role = (token.role as 'ADMIN' | 'MANAGER' | 'CUSTOMER' | 'BRANCH_STAFF') ?? 'CUSTOMER'
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
