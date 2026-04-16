'use client'

import { FiltrosPeriodo } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface Props {
  filtros: FiltrosPeriodo
  onChange: (filtros: FiltrosPeriodo) => void
}

export function PeriodFilter({ filtros, onChange }: Props) {
  const anterior = () => {
    if (filtros.mes === 1) {
      onChange({ mes: 12, ano: filtros.ano - 1 })
    } else {
      onChange({ ...filtros, mes: filtros.mes - 1 })
    }
  }

  const proximo = () => {
    if (filtros.mes === 12) {
      onChange({ mes: 1, ano: filtros.ano + 1 })
    } else {
      onChange({ ...filtros, mes: filtros.mes + 1 })
    }
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
      <button
        onClick={anterior}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex gap-3 flex-1 items-center justify-center">
        <select
          value={filtros.mes}
          onChange={e => onChange({ ...filtros, mes: Number(e.target.value) })}
          className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
        >
          {MESES.map((nome, i) => (
            <option key={i} value={i + 1}>{nome}</option>
          ))}
        </select>

        <select
          value={filtros.ano}
          onChange={e => onChange({ ...filtros, ano: Number(e.target.value) })}
          className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(ano => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>

      <button
        onClick={proximo}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
