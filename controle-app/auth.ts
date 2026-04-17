import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const rows = await sql`
          SELECT id, email, name, password_hash FROM users
          WHERE email = ${credentials.email as string} LIMIT 1
        `
        const user = rows[0]
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password as string, user.password_hash as string)
        if (!valid) return null
        return { id: String(user.id), name: user.name as string, email: user.email as string }
      },
    }),
  ],
})
