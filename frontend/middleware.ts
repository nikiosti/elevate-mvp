import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)

const verifyToken = async (token: string | undefined): Promise<{ isAuth: boolean; role?: string }> => {
  if (!token) return { isAuth: false }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    const currentTime = Math.floor(Date.now() / 1000)
    const isAuth = payload.exp ? payload.exp > currentTime : false
    const role = payload.role as string | undefined

    return { isAuth, role }
  } catch (err) {
    // Возвращаем isAuth: false в случае ошибки
    return { isAuth: false }
  }
}

const protectedRoutes = ['/admin']
const authRoutes = ['/login']

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('access_token')?.value
  const { isAuth, role } = await verifyToken(accessToken)

  // Если пользователь авторизован и заходит на /login, перенаправляем на /admin
  if (isAuth && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Если пользователь не авторизован и пытается зайти на защищенный маршрут
  // if (!isAuth && protectedRoutes.includes(request.nextUrl.pathname)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  // }

  // Если пользователь авторизован, но роль - не admin, ограничиваем доступ к /admin
  if (isAuth && role !== 'admin' && request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/me', request.url))
  }

  // Продолжаем выполнение запроса, если пользователь авторизован и имеет доступ
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/login'],
}
