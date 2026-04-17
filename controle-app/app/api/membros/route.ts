import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserFamily } from '@/lib/familia'
import { MembroFamiliar } from '@/lib/types'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(session.user.id)
  if (!familia) return NextResponse.json({ error: 'Sem família vinculada' }, { status: 400 })

  const m: MembroFamiliar = await req.json()
  await sql`INSERT INTO membros (id, nome, cor, user_id, family_id) VALUES (${m.id}, ${m.nome}, ${m.cor}, ${session.user.id}, ${familia.id})`
  return NextResponse.json({ ok: true })
}
