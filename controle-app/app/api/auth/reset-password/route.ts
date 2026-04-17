import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const rows = await sql`
    SELECT id, user_id, expires_at, used FROM password_reset_tokens
    WHERE token = ${token} LIMIT 1
  `
  const t = rows[0]
  if (!t) return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
  if (t.used) return NextResponse.json({ error: 'Token já utilizado' }, { status: 400 })
  if (new Date(t.expires_at as string) < new Date()) {
    return NextResponse.json({ error: 'Token expirado' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${t.user_id as string}`
  await sql`UPDATE password_reset_tokens SET used = TRUE WHERE id = ${t.id as string}`

  return NextResponse.json({ ok: true })
}
