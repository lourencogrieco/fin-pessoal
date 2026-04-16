'use client'

import { useState } from 'react'
import { MembroFamiliar } from '@/lib/types'
import { CORES_MEMBROS } from '@/lib/utils'
import { UserPlus, X } from 'lucide-react'

interface Props {
  membros: MembroFamiliar[]
  onAdicionar: (nome: string, cor: string) => void
  onRemover: (id: string) => void
}

export function FamilyMembers({ membros, onAdicionar, onRemover }: Props) {
  const [nome, setNome] = useState('')
  const [cor, setCor] = useState(CORES_MEMBROS[0])
  const [aberto, setAberto] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return
    onAdicionar(nome.trim(), cor)
    setNome('')
    setCor(CORES_MEMBROS[(membros.length + 1) % CORES_MEMBROS.length])
    setAberto(false)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">Membros da Família</h2>
        <button
          onClick={() => setAberto(!aberto)}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {aberto && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Nome do membro"
            value={nome}
            onChange={e => setNome(e.target.value)}
            autoFocus
            required
          />
          <div className="flex gap-1.5 items-center">
            {CORES_MEMBROS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${cor === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Salvar
          </button>
        </form>
      )}

      {membros.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Nenhum membro cadastrado
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {membros.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: m.cor }}
            >
              {m.nome}
              <button
                onClick={() => onRemover(m.id)}
                className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
