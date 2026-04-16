import { Movimentacao, ResumoFinanceiro, FiltrosPeriodo } from './types'

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarData(isoDate: string): string {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('pt-BR')
}

export function calcularResumo(movimentacoes: Movimentacao[]): ResumoFinanceiro {
  const totalReceitas = movimentacoes
    .filter(m => m.tipo === 'receita')
    .reduce((acc, m) => acc + m.valor, 0)

  const totalDespesas = movimentacoes
    .filter(m => m.tipo === 'despesa')
    .reduce((acc, m) => acc + m.valor, 0)

  return {
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
  }
}

export function filtrarPorPeriodo(
  movimentacoes: Movimentacao[],
  filtros: FiltrosPeriodo
): Movimentacao[] {
  return movimentacoes.filter(m => {
    const data = new Date(m.data + 'T12:00:00')
    return data.getMonth() + 1 === filtros.mes && data.getFullYear() === filtros.ano
  })
}

export function agruparPorCategoria(
  movimentacoes: Movimentacao[]
): { name: string; value: number }[] {
  const despesas = movimentacoes.filter(m => m.tipo === 'despesa')
  const grupos: Record<string, number> = {}

  despesas.forEach(m => {
    grupos[m.categoria] = (grupos[m.categoria] || 0) + m.valor
  })

  return Object.entries(grupos)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function agruparPorMes(
  movimentacoes: Movimentacao[],
  ano: number
): { mes: string; receitas: number; despesas: number }[] {
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ]

  return meses.map((mes, idx) => {
    const doMes = movimentacoes.filter(m => {
      const data = new Date(m.data + 'T12:00:00')
      return data.getFullYear() === ano && data.getMonth() === idx
    })

    return {
      mes,
      receitas: doMes.filter(m => m.tipo === 'receita').reduce((acc, m) => acc + m.valor, 0),
      despesas: doMes.filter(m => m.tipo === 'despesa').reduce((acc, m) => acc + m.valor, 0),
    }
  })
}

export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function getMesAtual(): number {
  return new Date().getMonth() + 1
}

export function getAnoAtual(): number {
  return new Date().getFullYear()
}

export const CORES_MEMBROS = [
  '#2563eb', '#16a34a', '#dc2626', '#9333ea',
  '#ea580c', '#0891b2', '#65a30d', '#db2777',
]

export const CORES_GRAFICO = [
  '#2563eb', '#16a34a', '#dc2626', '#9333ea',
  '#ea580c', '#0891b2', '#65a30d', '#db2777',
  '#f59e0b', '#6366f1',
]
