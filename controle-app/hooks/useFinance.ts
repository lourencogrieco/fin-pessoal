'use client'

import { useState, useEffect, useCallback } from 'react'
import { Movimentacao, MembroFamiliar, FiltrosPeriodo } from '@/lib/types'
import { filtrarPorPeriodo, gerarId, getMesAtual, getAnoAtual } from '@/lib/utils'

export function useFinance() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([])
  const [membros, setMembros] = useState<MembroFamiliar[]>([])
  const [familyId, setFamilyId] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosPeriodo>({ mes: getMesAtual(), ano: getAnoAtual() })
  const [hydrated, setHydrated] = useState(false)

  const recarregar = useCallback(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(({ movimentacoes: mvs, membros: mbs, familyId: fid }) => {
        setMovimentacoes(mvs.map((m: Movimentacao & { valor: string }) => ({ ...m, valor: Number(m.valor) })))
        setMembros(mbs)
        setFamilyId(fid ?? null)
        setHydrated(true)
      })
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  const adicionarMovimentacao = useCallback(async (dados: Omit<Movimentacao, 'id'>, parcelas = 1) => {
    const grupoId = parcelas > 1 ? gerarId() : undefined
    const novas: Movimentacao[] = Array.from({ length: parcelas }, (_, i) => {
      const base = new Date(dados.data + 'T12:00:00')
      base.setMonth(base.getMonth() + i)
      return {
        ...dados,
        id: gerarId(),
        valor: parcelas > 1 ? Math.round((dados.valor / parcelas) * 100) / 100 : dados.valor,
        data: base.toISOString().split('T')[0],
        parcelaGrupoId: grupoId,
        parcelaAtual: parcelas > 1 ? i + 1 : undefined,
        totalParcelas: parcelas > 1 ? parcelas : undefined,
      }
    })
    await fetch('/api/movimentacoes', { method: 'POST', body: JSON.stringify(novas), headers: { 'Content-Type': 'application/json' } })
    setMovimentacoes(prev => [...prev, ...novas])
  }, [])

  const removerMovimentacao = useCallback(async (id: string) => {
    await fetch(`/api/movimentacoes/${id}`, { method: 'DELETE' })
    setMovimentacoes(prev => prev.filter(m => m.id !== id))
  }, [])

  const adicionarMembro = useCallback(async (nome: string, cor: string) => {
    const membro: MembroFamiliar = { id: gerarId(), nome, cor }
    await fetch('/api/membros', { method: 'POST', body: JSON.stringify(membro), headers: { 'Content-Type': 'application/json' } })
    setMembros(prev => [...prev, membro])
  }, [])

  const removerMembro = useCallback(async (id: string) => {
    await fetch(`/api/membros/${id}`, { method: 'DELETE' })
    setMembros(prev => prev.filter(m => m.id !== id))
    setMovimentacoes(prev => prev.map(m => m.membroId === id ? { ...m, membroId: undefined } : m))
  }, [])

  const todasFiltradas = filtrarPorPeriodo(movimentacoes, filtros)
  const movimentacoesFiltradasPessoal = todasFiltradas.filter(m => m.scope === 'pessoal')
  const movimentacoesFiltradasFamilia = todasFiltradas.filter(m => m.scope === 'familia')

  return {
    movimentacoes,
    movimentacoesFiltradasPessoal,
    movimentacoesFiltradasFamilia,
    membros,
    familyId,
    filtros,
    setFiltros,
    adicionarMovimentacao,
    removerMovimentacao,
    adicionarMembro,
    removerMembro,
    recarregar,
    hydrated,
  }
}
