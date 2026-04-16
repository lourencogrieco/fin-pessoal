'use client'

import { useState } from 'react'
import { Movimentacao, MembroFamiliar, Categoria, FormaPagamento, TipoMovimentacao, TipoScope } from '@/lib/types'
import { Plus } from 'lucide-react'

const CATEGORIAS: Categoria[] = [
  'Alimentação', 'Moradia', 'Transporte', 'Lazer',
  'Streaming', 'Saúde', 'Salário', 'Educação', 'Vestuário', 'Outros',
]

const PAGAMENTOS: FormaPagamento[] = ['Cartão', 'Pix', 'Dinheiro', 'Boleto', 'Transferência']

interface Props {
  scope: TipoScope
  membros: MembroFamiliar[]
  onSubmit: (dados: Omit<Movimentacao, 'id'>) => void
}

const hoje = new Date().toISOString().split('T')[0]

export function TransactionForm({ scope, membros, onSubmit }: Props) {
  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    tipo: '' as TipoMovimentacao | '',
    categoria: '' as Categoria | '',
    pagamento: '' as FormaPagamento | '',
    membroId: '',
    data: hoje,
  })

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.tipo || !form.categoria || !form.pagamento) return

    onSubmit({
      descricao: form.descricao,
      valor: parseFloat(form.valor),
      tipo: form.tipo,
      categoria: form.categoria,
      pagamento: form.pagamento,
      data: form.data,
      membroId: form.membroId || undefined,
      scope,
    })

    setForm({ descricao: '', valor: '', tipo: '', categoria: '', pagamento: '', membroId: '', data: hoje })
  }

  const accent = scope === 'pessoal' ? 'focus:border-blue-500' : 'focus:border-purple-500'
  const btnColor = scope === 'pessoal'
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-purple-600 hover:bg-purple-700'

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Nova Movimentação</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <input
          className={`col-span-2 sm:col-span-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${accent}`}
          placeholder="Descrição"
          value={form.descricao}
          onChange={e => set('descricao', e.target.value)}
          required
        />

        <input
          type="number"
          step="0.01"
          min="0.01"
          className={`border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${accent}`}
          placeholder="Valor (R$)"
          value={form.valor}
          onChange={e => set('valor', e.target.value)}
          required
        />

        <select
          className={`border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white ${accent}`}
          value={form.tipo}
          onChange={e => set('tipo', e.target.value)}
          required
        >
          <option value="">Tipo</option>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <select
          className={`border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white ${accent}`}
          value={form.categoria}
          onChange={e => set('categoria', e.target.value)}
          required
        >
          <option value="">Categoria</option>
          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className={`border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white ${accent}`}
          value={form.pagamento}
          onChange={e => set('pagamento', e.target.value)}
          required
        >
          <option value="">Pagamento</option>
          {PAGAMENTOS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <input
          type="date"
          className={`border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${accent}`}
          value={form.data}
          onChange={e => set('data', e.target.value)}
          required
        />

        {membros.length > 0 && (
          <select
            className={`border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white ${accent}`}
            value={form.membroId}
            onChange={e => set('membroId', e.target.value)}
            required={scope === 'familia'}
          >
            <option value="">{scope === 'familia' ? 'Quem pagou *' : 'Membro (opcional)'}</option>
            {membros.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        )}

        <button
          type="submit"
          className={`flex items-center justify-center gap-1.5 ${btnColor} text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-colors`}
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </form>
    </div>
  )
}
