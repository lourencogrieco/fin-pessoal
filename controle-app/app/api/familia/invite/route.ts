import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserFamily, gerarInviteCode } from '@/lib/familia'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(session.user.id)
  if (!familia) return NextResponse.json({ error: 'Sem família' }, { status: 404 })
  if (familia.created_by !== session.user.id) return NextResponse.json({ error: 'Apenas o criador pode gerar novo convite' }, { status: 403 })

  const newCode = gerarInviteCode()
  await sql`UPDATE families SET invite_code = ${newCode} WHERE id = ${familia.id}`

  return NextResponse.json({ invite_code: newCode })
}
