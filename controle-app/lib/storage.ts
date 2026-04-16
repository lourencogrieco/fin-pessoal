import { FinanceState, Movimentacao } from './types'

const STORAGE_KEY = 'controle-financeiro-v3'
const LEGACY_KEY = 'controle-financeiro-v2'

const DEFAULT_STATE: FinanceState = {
  movimentacoes: [],
  membros: [],
}

export function loadState(): FinanceState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as FinanceState

    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const old = JSON.parse(legacy) as {
        movimentacoes: Omit<Movimentacao, 'scope'>[]
        membros: FinanceState['membros']
      }
      const migrated: FinanceState = {
        ...old,
        movimentacoes: old.movimentacoes.map(m => ({ ...m, scope: 'pessoal' as const })),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
      return migrated
    }

    return DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: FinanceState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
