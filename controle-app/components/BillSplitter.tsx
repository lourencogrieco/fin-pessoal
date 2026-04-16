'use client'

import { useState } from 'react'
import { MembroFamiliar } from '@/lib/types'
import { formatarMoeda } from '@/lib/utils'
import { Calculator, X } from 'lucide-react'

interface Props {
  membros: MembroFamiliar[]
}

export function BillSplitter({ membros }: Props) {
  const [descricao, setDescricao] = useState('')
  const [valorTotal, setValorTotal] = useState('')
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [resultado, setResultado] = useState<{ id: string; nome: string; cor: string; valor: number }[] | null>(null)

  const toggleMembro = (id: string) => {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
    setResultado(null)
  }

  const calcular = () => {
    const total = parseFloat(valorTotal)
    if (!total || selecionados.length === 0) return

    const valorPorPessoa = total / selecionados.length
    const res = selecionados.map(id => {
      const membro = membros.find(m => m.id === id)!
      return { id, nome: membro.nome, cor: membro.cor, valor: valorPorPessoa }
    })
    setResultado(res)
  }

  const limpar = () => {
    setDescricao('')
    setValorTotal('')
    setSelecionados([])
    setResultado(null)
  }

  if (membros.length === 0) return null

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-800">Divisão de Contas</h2>
        </div>
        {(descricao || valorTotal || selecionados.length > 0) && (
          <button onClick={limpar} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Limpar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <input
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
          placeholder="Descrição (ex: jantar)"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          min="0"
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
          placeholder="Valor total (R$)"
          value={valorTotal}
          onChange={e => { setValorTotal(e.target.value); setResultado(null) }}
        />
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Selecionar membros:</p>
        <div className="flex flex-wrap gap-2">
          {membros.map(m => (
            <button
              key={m.id}
              onClick={() => toggleMembro(m.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selecionados.includes(m.id)
                  ? 'text-white shadow-sm scale-105'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              style={selecionados.includes(m.id) ? { backgroundColor: m.cor } : {}}
            >
              {m.nome}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={calcular}
        disabled={!valorTotal || selecionados.length === 0}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium rounded-xl text-sm transition-colors"
      >
        Calcular divisão
      </button>

      {resultado && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          {descricao && (
            <p className="text-sm font-medium text-gray-700 mb-3">
              {descricao} — Total: {formatarMoeda(parseFloat(valorTotal))}
            </p>
          )}
          <div className="space-y-2">
            {resultado.map(r => (
              <div key={r.id} className="flex items-center justify-between">
                <span
                  className="flex items-center gap-2 text-sm font-medium text-white px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: r.cor }}
                >
                  {r.nome}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {formatarMoeda(r.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
