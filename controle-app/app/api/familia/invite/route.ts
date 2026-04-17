import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserFamily, gerarInviteCode } from '@/lib/familia'

export const POST = auth(async function POST(req) {
  const userId = req.auth?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(userId)
  if (!familia) return NextResponse.json({ error: 'Sem família' }, { status: 404 })
  if (familia.created_by !== userId) return NextResponse.json({ error: 'Apenas o criador pode gerar novo convite' }, { status: 403 })

  const newCode = gerarInviteCode()
  await sql`UPDATE families SET invite_code = ${newCode} WHERE id = ${familia.id}`
  return NextResponse.json({ invite_code: newCode })
})
