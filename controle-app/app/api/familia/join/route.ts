import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFamily } from '@/lib/familia'
import { getUserIdFromRequest, unauthorized } from '@/lib/auth-helper'
import { gerarId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return unauthorized()
  const existing = await getUserFamily(userId)
  if (existing) return NextResponse.json({ error: 'Você já pertence a uma família' }, { status: 409 })
  const { code } = await req.json()
  if (!code?.trim()) return NextResponse.json({ error: 'Código obrigatório' }, { status: 400 })
  const rows = await sql`SELECT id FROM families WHERE invite_code = ${code.trim().toUpperCase()} LIMIT 1`
  if (rows.length === 0) return NextResponse.json({ error: 'Código inválido' }, { status: 404 })
  const family = rows[0] as { id: string }
  await sql`INSERT INTO family_members (id, family_id, user_id, role) VALUES (${gerarId()}, ${family.id}, ${userId}, 'member')`
  const familia = await getUserFamily(userId)
  return NextResponse.json({ familia })
}
