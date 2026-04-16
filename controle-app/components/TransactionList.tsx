'use client'

import { Movimentacao, MembroFamiliar } from '@/lib/types'
import { formatarMoeda, formatarData } from '@/lib/utils'
import { Trash2, Receipt } from 'lucide-react'

const CATEGORIA_CORES: Record<string, string> = {
  Alimentação: '#f97316',
  Moradia: '#6366f1',
  Transporte: '#0ea5e9',
  Lazer: '#a855f7',
  Streaming: '#ec4899',
  Saúde: '#10b981',
  Salário: '#16a34a',
  Educação: '#f59e0b',
  Vestuário: '#8b5cf6',
  Outros: '#9ca3af',
}

interface Props {
  movimentacoes: Movimentacao[]
  membros: MembroFamiliar[]
  onRemover: (id: string) => void
}

export function TransactionList({ movimentacoes, membros, onRemover }: Props) {
  const getMembro = (id?: string) => membros.find(m => m.id === id)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Movimentações
        </h2>
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {movimentacoes.length}
        </span>
      </div>

      {movimentacoes.length === 0 ? (
        <div className="py-16 text-center">
          <Receipt className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Nenhuma movimentação neste período</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Descrição</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-left">Pagamento</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-left">Data</th>
                <th className="px-4 py-3 text-left">Membro</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {movimentacoes.map(m => {
                const membro = getMembro(m.membroId)
                const categoriaCor = CATEGORIA_CORES[m.categoria] ?? '#9ca3af'
                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      <span className="flex items-center gap-2">
                        {m.descricao}
                        {m.totalParcelas && m.parcelaAtual && (
                          <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            {m.parcelaAtual}/{m.totalParcelas}x
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoriaCor }}
                        />
                        {m.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-xs">{m.pagamento}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          m.tipo === 'receita'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {m.tipo === 'receita' ? '↑' : '↓'} {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}
                      </span>
                    </td>
                    <td className={`px-4 py-3.5 font-bold text-right tabular-nums ${
                      m.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {m.tipo === 'despesa' ? '−' : '+'}{formatarMoeda(m.valor)}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatarData(m.data)}</td>
                    <td className="px-4 py-3.5">
                      {m.membroId === 'conjunto' ? (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                          Conjunto
                        </span>
                      ) : membro ? (
                        <span
                          className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: membro.cor }}
                        >
                          {membro.nome}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => onRemover(m.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
