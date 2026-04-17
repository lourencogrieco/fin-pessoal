import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { Movimentacao } from '@/lib/types'

export async function POST(req: NextRequest) {
  const items: Movimentacao[] = await req.json()
  for (const m of items) {
    await sql`
      INSERT INTO movimentacoes
        (id, descricao, valor, tipo, categoria, pagamento, data,
         membro_id, scope, parcela_grupo_id, parcela_atual, total_parcelas)
      VALUES
        (${m.id}, ${m.descricao}, ${m.valor}, ${m.tipo}, ${m.categoria},
         ${m.pagamento}, ${m.data}, ${m.membroId ?? null}, ${m.scope},
         ${m.parcelaGrupoId ?? null}, ${m.parcelaAtual ?? null}, ${m.totalParcelas ?? null})
    `
  }
  return NextResponse.json({ ok: true })
}
