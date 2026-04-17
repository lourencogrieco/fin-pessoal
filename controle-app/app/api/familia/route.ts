import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserFamily, gerarInviteCode } from '@/lib/familia'
import { gerarId } from '@/lib/utils'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(session.user.id)
  if (!familia) return NextResponse.json({ familia: null })

  const membros = await sql`
    SELECT u.id, u.name, u.email, fm.role
    FROM family_members fm
    JOIN users u ON u.id = fm.user_id
    WHERE fm.family_id = ${familia.id}
    ORDER BY fm.joined_at
  `
  return NextResponse.json({ familia: { ...familia, membros } })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const existing = await getUserFamily(session.user.id)
  if (existing) return NextResponse.json({ error: 'Você já pertence a uma família' }, { status: 409 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const familyId = gerarId()
  const inviteCode = gerarInviteCode()

  await sql`INSERT INTO families (id, name, invite_code, created_by) VALUES (${familyId}, ${name.trim()}, ${inviteCode}, ${session.user.id})`
  await sql`INSERT INTO family_members (id, family_id, user_id, role) VALUES (${gerarId()}, ${familyId}, ${session.user.id}, 'admin')`

  const familia = await getUserFamily(session.user.id)
  return NextResponse.json({ familia })
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(session.user.id)
  if (!familia) return NextResponse.json({ error: 'Sem família' }, { status: 404 })

  await sql`DELETE FROM family_members WHERE user_id = ${session.user.id} AND family_id = ${familia.id}`

  const remaining = await sql`SELECT id FROM family_members WHERE family_id = ${familia.id} LIMIT 1`
  if (remaining.length === 0) {
    await sql`DELETE FROM families WHERE id = ${familia.id}`
  }

  return NextResponse.json({ ok: true })
}
