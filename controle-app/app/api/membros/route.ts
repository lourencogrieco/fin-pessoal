import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFamily } from '@/lib/familia'
import { getUserIdFromRequest, unauthorized } from '@/lib/auth-helper'
import { MembroFamiliar } from '@/lib/types'

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return unauthorized()

  const familia = await getUserFamily(userId)
  if (!familia) return NextResponse.json({ error: 'Sem família vinculada' }, { status: 400 })

  const m: MembroFamiliar = await req.json()
  await sql`INSERT INTO membros (id, nome, cor, user_id, family_id) VALUES (${m.id}, ${m.nome}, ${m.cor}, ${userId}, ${familia.id})`
  return NextResponse.json({ ok: true })
}
