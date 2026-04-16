'use client'

import { useState, useEffect, useCallback } from 'react'
import { FinanceState, Movimentacao, MembroFamiliar, FiltrosPeriodo } from '@/lib/types'
import { loadState, saveState } from '@/lib/storage'
import { filtrarPorPeriodo, gerarId, getMesAtual, getAnoAtual } from '@/lib/utils'

export function useFinance() {
  const [state, setState] = useState<FinanceState>({ movimentacoes: [], membros: [] })
  const [filtros, setFiltros] = useState<FiltrosPeriodo>({
    mes: getMesAtual(),
    ano: getAnoAtual(),
  })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveState(state)
  }, [state, hydrated])

  const adicionarMovimentacao = useCallback(
    (dados: Omit<Movimentacao, 'id'>) => {
      setState(prev => ({
        ...prev,
        movimentacoes: [
          ...prev.movimentacoes,
          { ...dados, id: gerarId() },
        ],
      }))
    },
    []
  )

  const removerMovimentacao = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      movimentacoes: prev.movimentacoes.filter(m => m.id !== id),
    }))
  }, [])

  const adicionarMembro = useCallback((nome: string, cor: string) => {
    setState(prev => ({
      ...prev,
      membros: [...prev.membros, { id: gerarId(), nome, cor }],
    }))
  }, [])

  const removerMembro = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      membros: prev.membros.filter(m => m.id !== id),
      movimentacoes: prev.movimentacoes.map(m =>
        m.membroId === id ? { ...m, membroId: undefined } : m
      ),
    }))
  }, [])

  const todasFiltradas = filtrarPorPeriodo(state.movimentacoes, filtros)
  const movimentacoesFiltradasPessoal = todasFiltradas.filter(m => m.scope === 'pessoal')
  const movimentacoesFiltradasFamilia = todasFiltradas.filter(m => m.scope === 'familia')

  const getMembro = useCallback(
    (id?: string): MembroFamiliar | undefined =>
      id ? state.membros.find(m => m.id === id) : undefined,
    [state.membros]
  )

  return {
    movimentacoes: state.movimentacoes,
    movimentacoesFiltradasPessoal,
    movimentacoesFiltradasFamilia,
    membros: state.membros,
    filtros,
    setFiltros,
    adicionarMovimentacao,
    removerMovimentacao,
    adicionarMembro,
    removerMembro,
    getMembro,
    hydrated,
  }
}
