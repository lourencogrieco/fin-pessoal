import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'Controle Financeiro',
  description: 'Gestão de gastos pessoais e familiares',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
