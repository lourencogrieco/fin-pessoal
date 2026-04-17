import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserFamily, gerarInviteCode } from '@/lib/familia'
import { gerarId } from '@/lib/utils'

export const GET = auth(async function GET(req) {
  const userId = req.auth?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(userId)
  if (!familia) return NextResponse.json({ familia: null })

  const membros = await sql`
    SELECT u.id, u.name, u.email, fm.role
    FROM family_members fm JOIN users u ON u.id = fm.user_id
    WHERE fm.family_id = ${familia.id} ORDER BY fm.joined_at
  `
  return NextResponse.json({ familia: { ...familia, membros } })
})

export const POST = auth(async function POST(req) {
  const userId = req.auth?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const existing = await getUserFamily(userId)
  if (existing) return NextResponse.json({ error: 'Você já pertence a uma família' }, { status: 409 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const familyId = gerarId()
  const inviteCode = gerarInviteCode()
  await sql`INSERT INTO families (id, name, invite_code, created_by) VALUES (${familyId}, ${name.trim()}, ${inviteCode}, ${userId})`
  await sql`INSERT INTO family_members (id, family_id, user_id, role) VALUES (${gerarId()}, ${familyId}, ${userId}, 'admin')`

  const familia = await getUserFamily(userId)
  return NextResponse.json({ familia })
})

export const DELETE = auth(async function DELETE(req) {
  const userId = req.auth?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(userId)
  if (!familia) return NextResponse.json({ error: 'Sem família' }, { status: 404 })

  await sql`DELETE FROM family_members WHERE user_id = ${userId} AND family_id = ${familia.id}`
  const remaining = await sql`SELECT id FROM family_members WHERE family_id = ${familia.id} LIMIT 1`
  if (remaining.length === 0) await sql`DELETE FROM families WHERE id = ${familia.id}`

  return NextResponse.json({ ok: true })
})
