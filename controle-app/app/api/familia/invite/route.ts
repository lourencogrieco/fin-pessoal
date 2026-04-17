import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFamily, gerarInviteCode } from '@/lib/familia'
import { getUserIdFromRequest, unauthorized } from '@/lib/auth-helper'

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return unauthorized()
  const familia = await getUserFamily(userId)
  if (!familia) return NextResponse.json({ error: 'Sem família' }, { status: 404 })
  if (familia.created_by !== userId) return NextResponse.json({ error: 'Apenas o criador pode gerar novo convite' }, { status: 403 })
  const newCode = gerarInviteCode()
  await sql`UPDATE families SET invite_code = ${newCode} WHERE id = ${familia.id}`
  return NextResponse.json({ invite_code: newCode })
}
