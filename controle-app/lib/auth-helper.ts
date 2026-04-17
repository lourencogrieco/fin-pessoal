import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const userId = req.headers.get('x-user-id')
  if (userId) return userId

  // Fallback: resolve by email (when id not yet in JWT due to old session)
  const email = req.headers.get('x-user-email')
  if (!email) return null

  const rows = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  return (rows[0] as { id: string } | undefined)?.id ?? null
}

export function unauthorized() {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
}
