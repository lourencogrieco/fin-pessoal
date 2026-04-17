'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Copy, RefreshCw, LogOut, Plus, Link as LinkIcon } from 'lucide-react'

interface FamiliaInfo {
  id: string
  name: string
  invite_code: string
  created_by: string
  membros: { id: string; name: string; email: string; role: string }[]
}

interface Props {
  onFamiliaChange: () => void
}

export function FamilySettings({ onFamiliaChange }: Props) {
  const [familia, setFamilia] = useState<FamiliaInfo | null | undefined>(undefined)
  const [tab, setTab] = useState<'criar' | 'entrar'>('criar')
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [copiado, setCopiado] = useState(false)

  const carregarFamilia = useCallback(() => {
    fetch('/api/familia')
      .then(r => r.json())
      .then(({ familia: f }) => setFamilia(f ?? null))
  }, [])

  useEffect(() => { carregarFamilia() }, [carregarFamilia])

  const criarFamilia = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const res = await fetch('/api/familia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nome }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setErro(data.error ?? 'Erro ao criar família')
    setFamilia(data.familia)
    onFamiliaChange()
  }

  const entrarFamilia = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const res = await fetch('/api/familia/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codigo }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setErro(data.error ?? 'Código inválido')
    setFamilia(data.familia)
    onFamiliaChange()
  }

  const sairFamilia = async () => {
    if (!confirm('Sair da família? Seus dados pessoais serão mantidos.')) return
    await fetch('/api/familia', { method: 'DELETE' })
    setFamilia(null)
    onFamiliaChange()
  }

  const novoConvite = async () => {
    const res = await fetch('/api/familia/invite', { method: 'POST' })
    const data = await res.json()
    if (res.ok) setFamilia(prev => prev ? { ...prev, invite_code: data.invite_code } : prev)
  }

  const copiarCodigo = () => {
    if (!familia) return
    navigator.clipboard.writeText(familia.invite_code)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  if (familia === undefined) {
    return <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (familia) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{familia.name}</h2>
              <p className="text-xs text-gray-400">{familia.membros?.length ?? 1} membro(s)</p>
            </div>
          </div>
          <button
            onClick={sairFamilia}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Membros</p>
          <div className="space-y-2">
            {familia.membros?.map(m => (
              <div key={m.id} className="flex items-center gap-2.5 py-1.5">
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.name}</p>
                  <p className="text-[11px] text-gray-400">{m.email}</p>
                </div>
                {m.role === 'admin' && (
                  <span className="ml-auto text-[10px] font-semibold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Admin</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Convidar membros</p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm font-mono font-bold text-gray-700 flex-1 tracking-widest">{familia.invite_code}</span>
            <button onClick={copiarCodigo} className="text-purple-500 hover:text-purple-700 p-1 rounded transition-colors" title="Copiar código">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={novoConvite} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors" title="Gerar novo código">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {copiado && <p className="text-xs text-green-500 mt-1 text-center">Código copiado!</p>}
          <p className="text-[11px] text-gray-400 mt-2">Compartilhe esse código com quem deseja convidar para a família.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Família</h2>
          <p className="text-xs text-gray-400">Crie ou entre em uma família</p>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
        <button
          onClick={() => setTab('criar')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'criar' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
        >
          Criar família
        </button>
        <button
          onClick={() => setTab('entrar')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'entrar' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
        >
          Entrar com código
        </button>
      </div>

      {tab === 'criar' ? (
        <form onSubmit={criarFamilia} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nome da família</label>
            <input
              required autoFocus
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-purple-400 transition-colors"
              placeholder="Ex: Família Silva"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>
          {erro && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Criando...' : 'Criar família'}
          </button>
        </form>
      ) : (
        <form onSubmit={entrarFamilia} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Código de convite</label>
            <input
              required autoFocus
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono uppercase tracking-widest outline-none focus:border-purple-400 transition-colors"
              placeholder="ABC123"
              maxLength={6}
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
            />
          </div>
          {erro && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar na família'}
          </button>
        </form>
      )}
    </div>
  )
}
