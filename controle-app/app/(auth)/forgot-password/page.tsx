'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (data.resetUrl) setResetUrl(data.resetUrl)
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">E-mail enviado</h2>
        <p className="text-sm text-gray-400 mb-4">
          Se o e-mail estiver cadastrado, você receberá o link de redefinição em instantes.
        </p>
        {resetUrl && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl text-left">
            <p className="text-[11px] font-semibold text-blue-500 mb-1">Link de desenvolvimento:</p>
            <a href={resetUrl} className="text-xs text-blue-700 break-all underline">{resetUrl}</a>
          </div>
        )}
        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Esqueci a senha</h1>
      <p className="text-sm text-gray-400 mb-6">
        Informe seu e-mail e enviaremos um link para redefinir sua senha.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">E-mail</label>
          <input
            type="email" required autoFocus
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit" disabled={status === 'loading'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar link'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-gray-400">
        Lembrou a senha?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}
