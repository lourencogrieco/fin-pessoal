'use client'

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { Movimentacao } from '@/lib/types'
import { agruparPorCategoria, agruparPorMes, formatarMoeda, CORES_GRAFICO } from '@/lib/utils'

interface Props {
  movimentacoes: Movimentacao[]
  ano: number
}

const CustomTooltipPie = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-gray-800">{payload[0].name}</p>
        <p className="text-gray-600">{formatarMoeda(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

const CustomTooltipBar = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {formatarMoeda(p.value)}</p>
        ))}
      </div>
    )
  }
  return null
}

export function Charts({ movimentacoes, ano }: Props) {
  const dadosPizza = agruparPorCategoria(movimentacoes)
  const dadosBarra = agruparPorMes(movimentacoes, ano)

  const temDados = movimentacoes.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Pie chart - despesas por categoria */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Despesas por Categoria</h3>
        {!temDados || dadosPizza.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Sem dados para exibir
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {dadosPizza.map((_, i) => (
                  <Cell key={i} fill={CORES_GRAFICO[i % CORES_GRAFICO.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>
        )}
        {dadosPizza.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {dadosPizza.map((item, i) => (
              <span key={item.name} className="flex items-center gap-1 text-xs text-gray-600">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CORES_GRAFICO[i % CORES_GRAFICO.length] }}
                />
                {item.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bar chart - receitas x despesas por mês */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Receitas x Despesas — {ano}</h3>
        {!temDados ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Sem dados para exibir
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dadosBarra} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltipBar />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="receitas" name="Receitas" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
