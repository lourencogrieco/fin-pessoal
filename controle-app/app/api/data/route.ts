import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { sql } from '@/lib/db'
import { getUserFamily } from '@/lib/familia'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const userId = session.user.id
  const familia = await getUserFamily(userId)
  const familyId = familia?.id ?? null

  const [movimentacoes, membros] = await Promise.all([
    familyId
      ? sql`
          SELECT id, descricao, valor, tipo, categoria, pagamento, data,
                 membro_id as "membroId", scope, family_id as "familyId",
                 parcela_grupo_id as "parcelaGrupoId",
                 parcela_atual as "parcelaAtual",
                 total_parcelas as "totalParcelas"
          FROM movimentacoes
          WHERE (scope = 'pessoal' AND user_id = ${userId})
             OR (scope = 'familia' AND family_id = ${familyId})
          ORDER BY data DESC, created_at DESC
        `
      : sql`
          SELECT id, descricao, valor, tipo, categoria, pagamento, data,
                 membro_id as "membroId", scope,
                 parcela_grupo_id as "parcelaGrupoId",
                 parcela_atual as "parcelaAtual",
                 total_parcelas as "totalParcelas"
          FROM movimentacoes
          WHERE user_id = ${userId}
          ORDER BY data DESC, created_at DESC
        `,
    familyId
      ? sql`SELECT id, nome, cor FROM membros WHERE family_id = ${familyId} ORDER BY created_at`
      : sql`SELECT id, nome, cor FROM membros WHERE 1=0`,
  ])

  return NextResponse.json({ movimentacoes, membros, familyId })
}
