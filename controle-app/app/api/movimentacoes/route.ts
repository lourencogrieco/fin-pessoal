import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserFamily } from '@/lib/familia'
import { Movimentacao } from '@/lib/types'

export const POST = auth(async function POST(req) {
  const userId = req.auth?.user?.id
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const familia = await getUserFamily(userId)
  const familyId = familia?.id ?? null

  const items: Movimentacao[] = await req.json()
  for (const m of items) {
    const fid = m.scope === 'familia' ? familyId : null
    await sql`
      INSERT INTO movimentacoes
        (id, descricao, valor, tipo, categoria, pagamento, data, membro_id, scope, user_id, family_id,
         parcela_grupo_id, parcela_atual, total_parcelas)
      VALUES
        (${m.id}, ${m.descricao}, ${m.valor}, ${m.tipo}, ${m.categoria}, ${m.pagamento}, ${m.data},
         ${m.membroId ?? null}, ${m.scope}, ${userId}, ${fid},
         ${m.parcelaGrupoId ?? null}, ${m.parcelaAtual ?? null}, ${m.totalParcelas ?? null})
    `
  }
  return NextResponse.json({ ok: true })
})
