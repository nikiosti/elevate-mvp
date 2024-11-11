import { Context } from 'koa'
import { PrismaClient } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library'
import dotenv from 'dotenv'
import { generateAccessToken, generateRefreshToken } from '../utils/auth.utils'

dotenv.config()

const prisma = new PrismaClient()
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

export const googleAuth = async (ctx: Context) => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
  })

  ctx.redirect(url)
}

export const googleCallback = async (ctx: Context) => {
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
          where: { email: payload.email },
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
}
