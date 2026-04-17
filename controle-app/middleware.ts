import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(p => pathname.startsWith(p))
  const isProtectedApi = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')

  if (!isLoggedIn && !isAuthPage) {
    if (isProtectedApi) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
