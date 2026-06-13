import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'ADMIN' | 'MANAGER' | 'CUSTOMER' | 'BRANCH_STAFF'
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    role: 'ADMIN' | 'MANAGER' | 'CUSTOMER' | 'BRANCH_STAFF'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'ADMIN' | 'MANAGER' | 'CUSTOMER' | 'BRANCH_STAFF'
  }
}
