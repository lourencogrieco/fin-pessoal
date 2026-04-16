'use client'

import { Movimentacao, MembroFamiliar } from '@/lib/types'
import { formatarMoeda } from '@/lib/utils'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

interface Props {
  movimentacoes: Movimentacao[]
  membros: MembroFamiliar[]
}

interface MembroSaldo {
  id: string
  nome: string
  cor: string
  pagou: number
  parte: number
  saldo: number
}

interface Transferencia {
  de: MembroSaldo
  para: MembroSaldo
  valor: number
}

function calcularRateio(movimentacoes: Movimentacao[], membros: MembroFamiliar[]) {
  const despesas = movimentacoes.filter(m => m.tipo === 'despesa')
  const totalGasto = despesas.reduce((acc, m) => acc + m.valor, 0)
  const parteIgual = membros.length > 0 ? totalGasto / membros.length : 0

  const pagamentos: Record<string, number> = {}
  membros.forEach(m => { pagamentos[m.id] = 0 })
  despesas.forEach(m => {
    if (m.membroId === 'conjunto') {
      // despesa já paga em conjunto: distribuir igualmente para cada membro
      const valorPorMembro = membros.length > 0 ? m.valor / membros.length : 0
      membros.forEach(mb => {
        pagamentos[mb.id] = (pagamentos[mb.id] ?? 0) + valorPorMembro
      })
    } else if (m.membroId) {
      pagamentos[m.membroId] = (pagamentos[m.membroId] ?? 0) + m.valor
    }
  })

  const saldos: MembroSaldo[] = membros.map(m => ({
    ...m,
    pagou: pagamentos[m.id] ?? 0,
    parte: parteIgual,
    saldo: (pagamentos[m.id] ?? 0) - parteIgual,
  }))

  // Greedy settlement
  const credores = saldos.filter(b => b.saldo > 0.01).map(b => ({ ...b, restante: b.saldo }))
  const devedores = saldos.filter(b => b.saldo < -0.01).map(b => ({ ...b, restante: Math.abs(b.saldo) }))
  const transferencias: Transferencia[] = []

  let ci = 0, di = 0
  while (ci < credores.length && di < devedores.length) {
    const valor = Math.min(credores[ci].restante, devedores[di].restante)
    if (valor > 0.01) {
      transferencias.push({ de: devedores[di], para: credores[ci], valor })
    }
    credores[ci].restante -= valor
    devedores[di].restante -= valor
    if (credores[ci].restante < 0.01) ci++
    if (devedores[di].restante < 0.01) di++
  }

  return { saldos, transferencias, totalGasto, parteIgual }
}

export function FamilySettlement({ movimentacoes, membros }: Props) {
  if (membros.length === 0) return null

  const { saldos, transferencias, totalGasto, parteIgual } = calcularRateio(movimentacoes, membros)
  const temDados = totalGasto > 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Rateio do Período</h2>
          <p className="text-xs text-gray-400 mt-0.5">Quem pagou quanto e quem deve reembolsar quem</p>
        </div>
        {temDados && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Parte igual</p>
            <p className="text-sm font-bold text-purple-600">{formatarMoeda(parteIgual)}</p>
          </div>
        )}
      </div>

      {!temDados ? (
        <div className="py-10 text-center text-gray-400 text-sm">
          Nenhuma despesa registrada neste período
        </div>
      ) : (
        <div className="p-5 space-y-5">
          {/* Resumo por membro */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Total pago por cada membro
            </p>
            <div className="space-y-2">
              {saldos.map(m => {
                const pct = totalGasto > 0 ? (m.pagou / totalGasto) * 100 : 0
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <span
                      className="text-xs font-semibold text-white px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: m.cor }}
                    >
                      {m.nome}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: m.cor }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700 tabular-nums w-24 text-right">
                      {formatarMoeda(m.pagou)}
                    </span>
                    <span className={`text-xs font-semibold w-20 text-right tabular-nums ${
                      m.saldo > 0.01 ? 'text-green-600' : m.saldo < -0.01 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {m.saldo > 0.01 ? `+${formatarMoeda(m.saldo)}` : m.saldo < -0.01 ? `−${formatarMoeda(Math.abs(m.saldo))}` : 'Quites'}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs text-gray-400">Total gasto</span>
              <span className="text-sm font-bold text-gray-700">{formatarMoeda(totalGasto)}</span>
            </div>
          </div>

          {/* Reembolsos */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Reembolsos necessários
            </p>
            {transferencias.length === 0 ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">Todos estão quites!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {transferencias.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3"
                  >
                    <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span
                      className="text-xs font-semibold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: t.de.cor }}
                    >
                      {t.de.nome}
                    </span>
                    <span className="text-xs text-gray-500">deve pagar</span>
                    <span className="text-sm font-bold text-orange-600 tabular-nums">
                      {formatarMoeda(t.valor)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <span
                      className="text-xs font-semibold text-white px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: t.para.cor }}
                    >
                      {t.para.nome}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
