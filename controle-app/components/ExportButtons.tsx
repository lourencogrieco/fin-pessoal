'use client'

import { Movimentacao } from '@/lib/types'
import { formatarMoeda, formatarData } from '@/lib/utils'
import { FileSpreadsheet, FileText } from 'lucide-react'

interface Props {
  movimentacoes: Movimentacao[]
  periodo: string
}

export function ExportButtons({ movimentacoes, periodo }: Props) {
  const exportarExcel = async () => {
    const { utils, writeFile } = await import('xlsx')

    const dados = movimentacoes.map(m => ({
      Descrição: m.descricao,
      Tipo: m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1),
      Categoria: m.categoria,
      Pagamento: m.pagamento,
      Valor: m.valor,
      Data: formatarData(m.data),
    }))

    const ws = utils.json_to_sheet(dados)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Movimentações')

    // Auto-width columns
    const cols = Object.keys(dados[0] || {}).map(key => ({
      wch: Math.max(key.length, ...dados.map(row => String(row[key as keyof typeof row]).length)) + 2,
    }))
    ws['!cols'] = cols

    writeFile(wb, `controle-financeiro-${periodo}.xlsx`)
  }

  const exportarPDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.setTextColor(31, 41, 55)
    doc.text('Controle Financeiro', 14, 20)

    doc.setFontSize(11)
    doc.setTextColor(107, 114, 128)
    doc.text(`Período: ${periodo}`, 14, 28)

    const receitas = movimentacoes.filter(m => m.tipo === 'receita').reduce((a, m) => a + m.valor, 0)
    const despesas = movimentacoes.filter(m => m.tipo === 'despesa').reduce((a, m) => a + m.valor, 0)
    const saldo = receitas - despesas

    doc.setFontSize(10)
    doc.setTextColor(22, 163, 74)
    doc.text(`Receitas: ${formatarMoeda(receitas)}`, 14, 38)
    doc.setTextColor(220, 38, 38)
    doc.text(`Despesas: ${formatarMoeda(despesas)}`, 70, 38)
    doc.setTextColor(saldo >= 0 ? 37 : 220, saldo >= 0 ? 99 : 38, saldo >= 0 ? 235 : 38)
    doc.text(`Saldo: ${formatarMoeda(saldo)}`, 130, 38)

    autoTable(doc, {
      startY: 45,
      head: [['Descrição', 'Tipo', 'Categoria', 'Pagamento', 'Valor', 'Data']],
      body: movimentacoes.map(m => [
        m.descricao,
        m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1),
        m.categoria,
        m.pagamento,
        formatarMoeda(m.valor),
        formatarData(m.data),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    })

    doc.save(`controle-financeiro-${periodo}.pdf`)
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={exportarExcel}
        disabled={movimentacoes.length === 0}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Excel
      </button>

      <button
        onClick={exportarPDF}
        disabled={movimentacoes.length === 0}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FileText className="w-4 h-4" />
        PDF
      </button>
    </div>
  )
}
