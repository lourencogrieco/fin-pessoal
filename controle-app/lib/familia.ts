import { sql } from '@/lib/db'

export interface Familia {
  id: string
  name: string
  invite_code: string
  created_by: string
}

export async function getUserFamily(userId: string): Promise<Familia | null> {
  const rows = await sql`
    SELECT f.id, f.name, f.invite_code, f.created_by
    FROM families f
    JOIN family_members fm ON fm.family_id = f.id
    WHERE fm.user_id = ${userId}
    LIMIT 1
  `
  return (rows[0] as Familia) ?? null
}

export function gerarInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
