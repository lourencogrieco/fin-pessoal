import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { gerarId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length > 0) {
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  await sql`INSERT INTO users (id, email, name, password_hash) VALUES (${gerarId()}, ${email}, ${name}, ${hash})`

  return NextResponse.json({ ok: true })
}
