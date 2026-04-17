'use client'

import { useState, useMemo } from 'react'
import { Movimentacao, MembroFamiliar } from '@/lib/types'
import { formatarMoeda, formatarData } from '@/lib/utils'
import { Trash2, Receipt, Filter, X, Pencil } from 'lucide-react'

const CATEGORIA_CORES: Record<string, string> = {
  Alimentação: '#f97316', Moradia: '#6366f1', Transporte: '#0ea5e9',
  Lazer: '#a855f7', Streaming: '#ec4899', Saúde: '#10b981',
  Salário: '#16a34a', Educação: '#f59e0b', Vestuário: '#8b5cf6',
  Água: '#06b6d4', Luz: '#eab308', Internet: '#3b82f6', Celular: '#8b5cf6',
  Combustível: '#ef4444', Farmácia: '#14b8a6', Faxina: '#f97316', Pet: '#84cc16',
  Recebíveis: '#22c55e', Outros: '#9ca3af',
}

interface Props {
  movimentacoes: Movimentacao[]
  membros: MembroFamiliar[]
  onRemover: (id: string) => void
  onEditar: (movimentacao: Movimentacao) => void
}

type Ordem = 'data_desc' | 'data_asc' | 'valor_desc' | 'valor_asc'

export function TransactionList({ movimentacoes, membros, onRemover, onEditar }: Props) {
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroMembro, setFiltroMembro] = useState('')
  const [ordem, setOrdem] = useState<Ordem>('data_desc')
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const getMembro = (id?: string) => membros.find(m => m.id === id)

  const categorias = useMemo(() => [...new Set(movimentacoes.map(m => m.categoria))].sort(), [movimentacoes])
  const hasFamilyData = membros.length > 0

  const filtradas = useMemo(() => {
    let list = [...movimentacoes]
    if (filtroTipo) list = list.filter(m => m.tipo === filtroTipo)
    if (filtroCategoria) list = list.filter(m => m.categoria === filtroCategoria)
    if (filtroMembro) list = list.filter(m => filtroMembro === 'conjunto' ? m.membroId === 'conjunto' : m.membroId === filtroMembro)
    switch (ordem) {
      case 'data_asc': list.sort((a, b) => a.data.localeCompare(b.data)); break
      case 'data_desc': list.sort((a, b) => b.data.localeCompare(a.data)); break
      case 'valor_asc': list.sort((a, b) => a.valor - b.valor); break
      case 'valor_desc': list.sort((a, b) => b.valor - a.valor); break
    }
    return list
  }, [movimentacoes, filtroTipo, filtroCategoria, filtroMembro, ordem])

  const ativos = [filtroTipo, filtroCategoria, filtroMembro].filter(Boolean).length

  const limpar = () => { setFiltroTipo(''); setFiltroCategoria(''); setFiltroMembro('') }

  const selectCls = 'text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 dark:text-gray-200 outline-none'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Movimentações</h2>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">{filtradas.length}</span>
          {ativos > 0 && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">{ativos} filtro(s)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {ativos > 0 && (
            <button onClick={limpar} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-3 h-3" /> Limpar
            </button>
          )}
          <button
            onClick={() => setMostrarFiltros(v => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${mostrarFiltros ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
            <Filter className="w-3.5 h-3.5" /> Filtros
          </button>
        </div>
      </div>

      {mostrarFiltros && (
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-2 items-center">
          <select className={selectCls} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>

          <select className={selectCls} value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas categorias</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {hasFamilyData && (
            <select className={selectCls} value={filtroMembro} onChange={e => setFiltroMembro(e.target.value)}>
              <option value="">Todos membros</option>
              <option value="conjunto">Conjunto</option>
              {membros.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
          )}

          <select className={selectCls} value={ordem} onChange={e => setOrdem(e.target.value as Ordem)}>
            <option value="data_desc">Data ↓ (mais recente)</option>
            <option value="data_asc">Data ↑ (mais antigo)</option>
            <option value="valor_desc">Valor ↓ (maior)</option>
            <option value="valor_asc">Valor ↑ (menor)</option>
          </select>
        </div>
      )}

      {filtradas.length === 0 ? (
        <div className="py-16 text-center">
          <Receipt className="w-8 h-8 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Nenhuma movimentação{ativos > 0 ? ' com esses filtros' : ' neste período'}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-800/80 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Descrição</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-left">Pagamento</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-left">Membro</th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtradas.map(m => {
                  const membro = getMembro(m.membroId)
                  const cor = CATEGORIA_CORES[m.categoria] ?? '#9ca3af'
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors group">
                      <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-200">
                        <span className="flex items-center gap-2">
                          {m.descricao}
                          {m.totalParcelas && m.parcelaAtual && (
                            <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              {m.parcelaAtual}/{m.totalParcelas}x
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-xs">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cor }} />
                          {m.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400 text-xs">{m.pagamento}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${m.tipo === 'receita' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                          {m.tipo === 'receita' ? '↑' : '↓'} {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 font-bold text-right tabular-nums ${m.tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {m.tipo === 'despesa' ? '−' : '+'}{formatarMoeda(m.valor)}
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatarData(m.data)}</td>
                      <td className="px-4 py-3.5">
                        {m.membroId === 'conjunto' ? (
                          <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">Conjunto</span>
                        ) : membro ? (
                          <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: membro.cor }}>{membro.nome}</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => onEditar(m)} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => onRemover(m.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-800">
            {filtradas.map(m => {
              const membro = getMembro(m.membroId)
              const cor = CATEGORIA_CORES[m.categoria] ?? '#9ca3af'
              return (
                <div key={m.id} className="px-4 py-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: cor + '20' }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cor }} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{m.descricao}</p>
                        {m.totalParcelas && m.parcelaAtual && (
                          <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded-full">{m.parcelaAtual}/{m.totalParcelas}x</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400">{m.categoria}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{formatarData(m.data)}</span>
                        {membro && <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: membro.cor }}>{membro.nome}</span>}
                        {m.membroId === 'conjunto' && <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">Conjunto</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className={`text-sm font-bold tabular-nums ${m.tipo === 'receita' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {m.tipo === 'despesa' ? '−' : '+'}{formatarMoeda(m.valor)}
                    </p>
                    <button onClick={() => onEditar(m)} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onRemover(m.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
