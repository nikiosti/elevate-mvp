import Router from 'koa-router'
import { PrismaClient, User } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export const router = new Router()
const prisma = new PrismaClient()

dotenv.config()

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

export const generateAccessToken = (user: User) => {
  return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.JWT_ACCESS_EXPIRY })
}

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.JWT_REFRESH_EXPIRY })
}

router.get('/google', async (ctx) => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
  })

  ctx.redirect(url)
})

router.get('/google/callback', async (ctx) => {
  const code = ctx.query.code as string
  if (!code) {
    ctx.status = 400
    ctx.body = { error: 'Authorization code not found' }
    return
  }

  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL,
    })

    if (tokens.id_token) {
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()
      if (payload && payload.email) {
        let user = await prisma.user.findUnique({
          where: {
            email: payload.email,
          },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: payload.email,
              name: payload.name,
              role: 'user',
            },
          })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        ctx.cookies.set('access_token', accessToken, { httpOnly: true, secure: false })
        ctx.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: false })
        ctx.body = { message: 'Авторизация прошла успешно!' }

        ctx.redirect('http://localhost:3000')
      }
    } else {
      ctx.status = 400
      ctx.body = { error: 'Google ID Token not found' }
    }
  } catch (error) {
    console.error('Ошибка при получении токенов:', error)
    ctx.status = 500
    ctx.body = { error }
  }
})

router.post('/google/refresh', async (ctx) => {
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
})

router.post('/logout', async (ctx) => {
  ctx.cookies.set('access_token', '', { httpOnly: true, secure: false, maxAge: 0 })
  ctx.cookies.set('refresh_token', '', { httpOnly: true, secure: false, maxAge: 0 })

  ctx.body = { message: 'Выход выполнен успешно' }
})
