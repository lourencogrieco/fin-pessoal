import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest, unauthorized } from '@/lib/auth-helper'
import { Movimentacao } from '@/lib/types'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return unauthorized()

  const { id } = await params
  const m: Omit<Movimentacao, 'id'> = await req.json()

  await sql`
    UPDATE movimentacoes
    SET descricao = ${m.descricao},
        valor = ${m.valor},
        tipo = ${m.tipo},
        categoria = ${m.categoria},
        pagamento = ${m.pagamento},
        data = ${m.data},
        membro_id = ${m.membroId ?? null},
        scope = ${m.scope}
    WHERE id = ${id} AND user_id = ${userId}
  `

  return NextResponse.json({ ok: true })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await sql`DELETE FROM movimentacoes WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
