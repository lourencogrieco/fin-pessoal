export type TipoMovimentacao = 'receita' | 'despesa'
export type TipoScope = 'pessoal' | 'familia'

export type Categoria =
  | 'Alimentação'
  | 'Moradia'
  | 'Transporte'
  | 'Lazer'
  | 'Streaming'
  | 'Saúde'
  | 'Salário'
  | 'Educação'
  | 'Vestuário'
  | 'Outros'

export type FormaPagamento = 'Cartão' | 'Pix' | 'Dinheiro' | 'Boleto' | 'Transferência'

export interface Movimentacao {
  id: string
  descricao: string
  valor: number
  tipo: TipoMovimentacao
  categoria: Categoria
  pagamento: FormaPagamento
  data: string
  membroId?: string
  scope: TipoScope
  parcelaGrupoId?: string
  parcelaAtual?: number
  totalParcelas?: number
}

export interface MembroFamiliar {
  id: string
  nome: string
  cor: string
}

export interface FinanceState {
  movimentacoes: Movimentacao[]
  membros: MembroFamiliar[]
}

export interface FiltrosPeriodo {
  mes: number // 1-12
  ano: number
}

export interface ResumoFinanceiro {
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface DivisaoConta {
  descricao: string
  valorTotal: number
  membros: string[] // IDs dos membros
}
