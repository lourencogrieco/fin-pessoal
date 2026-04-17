import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(p => pathname.startsWith(p))
  const isAuthApi = pathname.startsWith('/api/auth')
  const isProtectedApi = pathname.startsWith('/api/') && !isAuthApi

  if (!isLoggedIn && !isAuthPage && !isAuthApi) {
    if (isProtectedApi) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Passa o userId para as route handlers via request header
  if (isLoggedIn && req.auth?.user?.id) {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', req.auth.user.id)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
