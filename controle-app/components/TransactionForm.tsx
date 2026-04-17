'use client'

import { useEffect, useState } from 'react'
import { Movimentacao, MembroFamiliar, CategoriaDespesa, CategoriaReceita, FormaPagamento, TipoMovimentacao, TipoScope } from '@/lib/types'
import { Pencil, Plus, X } from 'lucide-react'

const CATEGORIAS_DESPESA: CategoriaDespesa[] = [
  'Alimentação', 'Moradia', 'Água', 'Luz', 'Internet', 'Celular',
  'Transporte', 'Combustível', 'Saúde', 'Farmácia', 'Faxina', 'Pet', 'Educação',
  'Lazer', 'Streaming', 'Vestuário', 'Outros',
]

const CATEGORIAS_RECEITA: CategoriaReceita[] = ['Salário', 'Recebíveis', 'Outros']

const PAGAMENTOS: FormaPagamento[] = ['Cartão', 'Pix', 'Dinheiro', 'Boleto', 'Transferência']

interface Props {
  scope: TipoScope
  membros: MembroFamiliar[]
  onSubmit: (dados: Omit<Movimentacao, 'id'>, parcelas: number) => void
  initialData?: Movimentacao | null
  onCancelEdit?: () => void
}

const hoje = new Date().toISOString().split('T')[0]

function formatarValorInput(raw: string): string {
  const nums = raw.replace(/\D/g, '')
  if (!nums) return ''
  const cents = parseInt(nums, 10)
  return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parsearValor(formatted: string): number {
  return parseFloat(formatted.replace(/\./g, '').replace(',', '.')) || 0
}

export function TransactionForm({ scope, membros, onSubmit, initialData, onCancelEdit }: Props) {
  const [form, setForm] = useState({
    descricao: '', valorDisplay: '', tipo: '' as TipoMovimentacao | '',
    categoria: '', pagamento: '' as FormaPagamento | '',
    membroId: '', data: hoje, parcelas: '1',
  })

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  useEffect(() => {
    if (!initialData) {
      setForm({ descricao: '', valorDisplay: '', tipo: '', categoria: '', pagamento: '', membroId: '', data: hoje, parcelas: '1' })
      return
    }

    setForm({
      descricao: initialData.descricao,
      valorDisplay: initialData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      tipo: initialData.tipo,
      categoria: initialData.categoria,
      pagamento: initialData.pagamento,
      membroId: initialData.membroId ?? '',
      data: initialData.data,
      parcelas: String(initialData.totalParcelas ?? 1),
    })
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const valor = parsearValor(form.valorDisplay)
    if (!form.tipo || !form.categoria || !form.pagamento || valor <= 0) return
    const parcelas = parseInt(form.parcelas) || 1
    const parcelasSubmit = initialData ? 1 : parcelas
    onSubmit({
      descricao: form.descricao, valor,
      tipo: form.tipo as TipoMovimentacao,
      categoria: form.categoria as CategoriaDespesa | CategoriaReceita,
      pagamento: form.pagamento, data: form.data,
      membroId: form.membroId || undefined, scope,
    }, parcelasSubmit)
    setForm({ descricao: '', valorDisplay: '', tipo: '', categoria: '', pagamento: '', membroId: '', data: hoje, parcelas: '1' })
  }

  const accent = scope === 'pessoal' ? 'focus:border-blue-500' : 'focus:border-purple-500'
  const btnColor = scope === 'pessoal' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
  const isDespesa = form.tipo === 'despesa'
  const parcelasNum = parseInt(form.parcelas) || 1
  const valorNumerico = parsearValor(form.valorDisplay)
  const valorParcela = isDespesa && parcelasNum > 1 && valorNumerico > 0
    ? Math.round((valorNumerico / parcelasNum) * 100) / 100 : null
  const categorias = form.tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA
  const inputCls = `border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors bg-white dark:bg-gray-800 dark:text-gray-100 ${accent}`
  const editando = !!initialData

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {editando ? 'Editar Movimentação' : 'Nova Movimentação'}
        </h2>
        {editando && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancelar edição
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <input className={`col-span-2 sm:col-span-1 ${inputCls}`} placeholder="Descrição"
          value={form.descricao} onChange={e => set('descricao', e.target.value)} required />

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none select-none">R$</span>
          <input type="text" inputMode="numeric" className={`w-full pl-8 ${inputCls}`} placeholder="0,00"
            value={form.valorDisplay} onChange={e => set('valorDisplay', formatarValorInput(e.target.value))} required />
        </div>

        <select className={inputCls} value={form.tipo}
          onChange={e => { set('tipo', e.target.value); set('categoria', '') }} required>
          <option value="">Tipo</option>
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>

        <select className={inputCls} value={form.categoria} onChange={e => set('categoria', e.target.value)} required disabled={!form.tipo}>
          <option value="">Categoria</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className={inputCls} value={form.pagamento} onChange={e => set('pagamento', e.target.value)} required>
          <option value="">Pagamento</option>
          {PAGAMENTOS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <input type="date" className={inputCls} value={form.data} onChange={e => set('data', e.target.value)} required />

        {isDespesa && !editando && (
          <div className="relative">
            <select className={`w-full ${inputCls}`} value={form.parcelas} onChange={e => set('parcelas', e.target.value)}>
              <option value="1">À vista</option>
              {[2,3,4,5,6,7,8,9,10,11,12,18,24,36,48,60].map(n => <option key={n} value={n}>{n}x</option>)}
            </select>
            {valorParcela !== null && (
              <p className="absolute -bottom-4 left-1 text-[10px] text-gray-400">
                {parcelasNum}x de {valorParcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            )}
          </div>
        )}

        {membros.length > 0 && (
          <select className={inputCls} value={form.membroId} onChange={e => set('membroId', e.target.value)} required={scope === 'familia'}>
            <option value="">{scope === 'familia' ? 'Quem pagou *' : 'Membro (opcional)'}</option>
            {scope === 'familia' && <option value="conjunto">Conjunto (já dividido)</option>}
            {membros.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        )}

        <button type="submit" className={`flex items-center justify-center gap-1.5 ${btnColor} text-white font-medium rounded-xl px-4 py-2.5 text-sm transition-colors`}>
          {editando ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {editando ? 'Salvar edição' : 'Adicionar'}
        </button>
      </form>
    </div>
  )
}
