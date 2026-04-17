'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const router = useRouter()
  const token = useSearchParams().get('token') ?? ''
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (form.password !== form.confirm) return setErro('As senhas não coincidem')
    if (form.password.length < 6) return setErro('Senha deve ter pelo menos 6 caracteres')

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: form.password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setErro(data.error ?? 'Erro ao redefinir senha')
    router.push('/login?reset=1')
  }

  if (!token) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-sm text-red-500">Link inválido ou expirado.</p>
        <Link href="/forgot-password" className="mt-4 block text-sm text-blue-600 font-medium">
          Solicitar novo link
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Nova senha</h1>
      <p className="text-sm text-gray-400 mb-6">Escolha uma nova senha para sua conta.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nova senha</label>
          <input
            type="password" required autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirmar nova senha</label>
          <input
            type="password" required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="Repita a senha"
            value={form.confirm}
            onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
          />
        </div>

        {erro && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
        >
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}
