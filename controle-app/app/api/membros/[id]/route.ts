import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await sql`UPDATE movimentacoes SET membro_id = NULL WHERE membro_id = ${id}`
  await sql`DELETE FROM membros WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
