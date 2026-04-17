export type TipoMovimentacao = 'receita' | 'despesa'
export type TipoScope = 'pessoal' | 'familia'

export type CategoriaDespesa =
  | 'Alimentação'
  | 'Moradia'
  | 'Água'
  | 'Luz'
  | 'Internet'
  | 'Celular'
  | 'Transporte'
  | 'Combustível'
  | 'Saúde'
  | 'Farmácia'
  | 'Educação'
  | 'Lazer'
  | 'Streaming'
  | 'Vestuário'
  | 'Outros'

export type CategoriaReceita =
  | 'Salário'
  | 'Recebíveis'
  | 'Outros'

export type Categoria = CategoriaDespesa | CategoriaReceita

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
