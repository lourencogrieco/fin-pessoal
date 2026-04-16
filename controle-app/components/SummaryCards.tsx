'use client'

import { Movimentacao, TipoScope } from '@/lib/types'
import { calcularResumo, formatarMoeda } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface Props {
  movimentacoes: Movimentacao[]
  scope?: TipoScope
}

export function SummaryCards({ movimentacoes, scope = 'pessoal' }: Props) {
  const { totalReceitas, totalDespesas, saldo } = calcularResumo(movimentacoes)
  const pctGasto = totalReceitas > 0 ? Math.min((totalDespesas / totalReceitas) * 100, 100) : 0
  const accentBg = scope === 'pessoal' ? 'bg-blue-500' : 'bg-purple-500'
  const accentText = scope === 'pessoal' ? 'text-blue-600' : 'text-purple-600'
  const accentLight = scope === 'pessoal' ? 'bg-blue-50' : 'bg-purple-50'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
      {/* Receitas */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Receitas</span>
          <div className="p-2 bg-green-50 rounded-xl">
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600 mb-1">{formatarMoeda(totalReceitas)}</p>
        <p className="text-xs text-gray-400">
          {movimentacoes.filter(m => m.tipo === 'receita').length} entrada(s)
        </p>
      </div>

      {/* Despesas */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Despesas</span>
          <div className="p-2 bg-red-50 rounded-xl">
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
        </div>
        <p className="text-2xl font-bold text-red-600 mb-1">{formatarMoeda(totalDespesas)}</p>
        {totalReceitas > 0 && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-400">% da receita</span>
              <span className="text-[10px] font-semibold text-red-500">{pctGasto.toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pctGasto > 80 ? 'bg-red-500' : 'bg-orange-400'}`}
                style={{ width: `${pctGasto}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Saldo */}
      <div className={`rounded-2xl p-5 shadow-sm border transition-shadow hover:shadow-md ${
        saldo >= 0 ? `${accentLight} border-transparent` : 'bg-red-50 border-transparent'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Saldo</span>
          <div className={`p-2 rounded-xl ${saldo >= 0 ? 'bg-white/60' : 'bg-white/60'}`}>
            <Wallet className={`w-4 h-4 ${saldo >= 0 ? accentText : 'text-red-500'}`} />
          </div>
        </div>
        <p className={`text-2xl font-bold mb-1 ${saldo >= 0 ? accentText : 'text-red-600'}`}>
          {formatarMoeda(saldo)}
        </p>
        <p className="text-xs text-gray-400">
          {saldo >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
        </p>
      </div>
    </div>
  )
}
