import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { Context } from 'koa'
import { generateAccessToken } from '../utils/auth.utils'

const prisma = new PrismaClient()

export const refreshToken = async (ctx: Context) => {
  const refreshToken = ctx.cookies.get('refresh_token')

  if (!refreshToken) {
    ctx.status = 401
    ctx.body = { error: 'Refresh token not provided' }
    return
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string }
    const user = await prisma.user.findUnique({ where: { id: payload.id } })

    if (!user) {
      ctx.status = 401
      ctx.body = { error: 'User not found' }
      return
    }

    const newAccessToken = generateAccessToken(user)
    ctx.cookies.set('access_token', newAccessToken, { httpOnly: true, secure: false, maxAge: 5 * 60 * 1000 })

    ctx.body = { message: 'Access token refreshed' }
  } catch (error) {
    ctx.status = 401
    ctx.body = { error: 'Invalid or expired refresh token' }
  }
}

export const logout = async (ctx: Context) => {
  ctx.cookies.set('access_token', '', { httpOnly: true, secure: false, maxAge: 0 })
  ctx.cookies.set('refresh_token', '', { httpOnly: true, secure: false, maxAge: 0 })

  ctx.body = { message: 'Выход выполнен успешно' }
}
