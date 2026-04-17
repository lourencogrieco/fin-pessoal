'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    const res = await signIn('credentials', { ...form, redirect: false })
    setLoading(false)
    if (res?.error) {
      setErro('E-mail ou senha incorretos')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Entrar</h1>
      <p className="text-sm text-gray-400 mb-6">Controle Financeiro Pessoal e Familiar</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">E-mail</label>
          <input
            type="email"
            required
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="seu@email.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-gray-500">Senha</label>
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">
              Esqueci a senha
            </Link>
          </div>
          <input
            type="password"
            required
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          />
        </div>

        {erro && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Não tem conta?{' '}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
