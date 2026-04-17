import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { gerarId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 })

  const rows = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  // Sempre retorna sucesso para não revelar se o e-mail existe
  if (rows.length === 0) return NextResponse.json({ ok: true })

  const userId = rows[0].id as string
  const token = gerarId() + gerarId()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1h

  await sql`
    INSERT INTO password_reset_tokens (id, user_id, token, expires_at)
    VALUES (${gerarId()}, ${userId}, ${token}, ${expiresAt.toISOString()})
  `

  const baseUrl = process.env.AUTH_URL ?? 'http://localhost:3000'
  const resetUrl = `${baseUrl}/reset-password?token=${token}`

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Controle Financeiro <noreply@resend.dev>',
      to: email,
      subject: 'Redefinição de senha',
      html: `
        <p>Olá,</p>
        <p>Clique no link abaixo para redefinir sua senha (válido por 1 hora):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    })
  } else {
    // Sem RESEND_API_KEY: retorna o link no response (apenas para dev)
    return NextResponse.json({ ok: true, resetUrl })
  }

  return NextResponse.json({ ok: true })
}
