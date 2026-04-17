import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const [movimentacoes, membros] = await Promise.all([
    sql`SELECT id, descricao, valor, tipo, categoria, pagamento, data,
               membro_id as "membroId", scope,
               parcela_grupo_id as "parcelaGrupoId",
               parcela_atual as "parcelaAtual",
               total_parcelas as "totalParcelas"
        FROM movimentacoes ORDER BY data DESC, created_at DESC`,
    sql`SELECT id, nome, cor FROM membros ORDER BY created_at`,
  ])
  return NextResponse.json({ movimentacoes, membros })
}
