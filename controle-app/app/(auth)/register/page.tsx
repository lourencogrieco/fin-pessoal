'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    if (form.password !== form.confirm) return setErro('As senhas não coincidem')
    if (form.password.length < 6) return setErro('Senha deve ter pelo menos 6 caracteres')

    setLoading(true)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setLoading(false)
      return setErro(data.error ?? 'Erro ao criar conta')
    }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Criar conta</h1>
      <p className="text-sm text-gray-400 mb-6">Comece a controlar suas finanças</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nome</label>
          <input
            required autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="Seu nome"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">E-mail</label>
          <input
            type="email" required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="seu@email.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Senha</label>
          <input
            type="password" required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirmar senha</label>
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
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Já tem conta?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}
