'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useFinance } from '@/hooks/useFinance'
import { SummaryCards } from '@/components/SummaryCards'
import { PeriodFilter } from '@/components/PeriodFilter'
import { ExportButtons } from '@/components/ExportButtons'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionList } from '@/components/TransactionList'
import { Charts } from '@/components/Charts'
import { FamilyMembers } from '@/components/FamilyMembers'
import { BillSplitter } from '@/components/BillSplitter'
import { FamilySettlement } from '@/components/FamilySettlement'
import { LayoutDashboard, List, BarChart2, Users, User, LogOut } from 'lucide-react'
import { TipoScope } from '@/lib/types'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

type SubTab = 'dashboard' | 'transacoes' | 'graficos' | 'membros'

const SUBTABS_PESSOAL: { key: SubTab; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'transacoes', label: 'Transações', icon: List },
  { key: 'graficos', label: 'Gráficos', icon: BarChart2 },
]

const SUBTABS_FAMILIA: { key: SubTab; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'transacoes', label: 'Transações', icon: List },
  { key: 'graficos', label: 'Gráficos', icon: BarChart2 },
  { key: 'membros', label: 'Membros', icon: Users },
]

export default function Home() {
  const { data: session } = useSession()
  const {
    movimentacoesFiltradasPessoal,
    movimentacoesFiltradasFamilia,
    membros,
    filtros,
    setFiltros,
    adicionarMovimentacao,
    removerMovimentacao,
    adicionarMembro,
    removerMembro,
    hydrated,
  } = useFinance()

  const [scope, setScope] = useState<TipoScope>('pessoal')
  const [subTab, setSubTab] = useState<SubTab>('dashboard')

  const movimentacoes = scope === 'pessoal' ? movimentacoesFiltradasPessoal : movimentacoesFiltradasFamilia
  const periodoLabel = `${MESES[filtros.mes - 1].toLowerCase()}-${filtros.ano}`
  const subTabs = scope === 'pessoal' ? SUBTABS_PESSOAL : SUBTABS_FAMILIA

  const handleScopeChange = (s: TipoScope) => {
    setScope(s)
    setSubTab('dashboard')
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-7 h-7 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
              <span className="text-white text-xs font-bold">CF</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Controle Financeiro</h1>
              <p className="text-[10px] text-gray-400 leading-tight">Gestão pessoal e familiar</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ExportButtons movimentacoes={movimentacoes} periodo={periodoLabel} />
            {session?.user && (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
                <span className="text-xs text-gray-500 hidden sm:block">{session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Scope switcher */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Visão</span>
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => handleScopeChange('pessoal')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scope === 'pessoal'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Pessoal
            </button>
            <button
              onClick={() => handleScopeChange('familia')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                scope === 'familia'
                  ? 'bg-white text-purple-600 shadow-sm ring-1 ring-purple-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Família
            </button>
          </div>
          <div className={`h-1.5 w-1.5 rounded-full ${scope === 'pessoal' ? 'bg-blue-500' : 'bg-purple-500'}`} />
          <span className="text-xs text-gray-400">
            {scope === 'pessoal' ? 'Suas transações pessoais' : 'Gastos compartilhados da família'}
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-0.5">
          {subTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSubTab(key)}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                subTab === key
                  ? scope === 'pessoal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="mb-5">
          <PeriodFilter filtros={filtros} onChange={setFiltros} />
        </div>

        {subTab === 'dashboard' && (
          <>
            <SummaryCards movimentacoes={movimentacoes} scope={scope} />
            {scope === 'familia' && membros.length > 0 && (
              <div className="mb-5">
                <FamilySettlement movimentacoes={movimentacoes} membros={membros} />
              </div>
            )}
            <TransactionForm scope={scope} membros={scope === 'familia' ? membros : []} onSubmit={adicionarMovimentacao} />
            <TransactionList movimentacoes={movimentacoes} membros={membros} onRemover={removerMovimentacao} />
          </>
        )}

        {subTab === 'transacoes' && (
          <>
            <TransactionForm scope={scope} membros={scope === 'familia' ? membros : []} onSubmit={adicionarMovimentacao} />
            <TransactionList movimentacoes={movimentacoes} membros={membros} onRemover={removerMovimentacao} />
          </>
        )}

        {subTab === 'graficos' && (
          <>
            <SummaryCards movimentacoes={movimentacoes} scope={scope} />
            <Charts movimentacoes={movimentacoes} ano={filtros.ano} />
          </>
        )}

        {subTab === 'membros' && scope === 'familia' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FamilyMembers membros={membros} onAdicionar={adicionarMembro} onRemover={removerMembro} />
            <BillSplitter membros={membros} />
          </div>
        )}
      </main>
    </div>
  )
}
