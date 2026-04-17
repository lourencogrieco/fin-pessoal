import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { MembroFamiliar } from '@/lib/types'

export async function POST(req: NextRequest) {
  const m: MembroFamiliar = await req.json()
  await sql`INSERT INTO membros (id, nome, cor) VALUES (${m.id}, ${m.nome}, ${m.cor})`
  return NextResponse.json({ ok: true })
}
