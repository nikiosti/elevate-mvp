import dotenv from 'dotenv'
import { generateAccessToken, generateRefreshToken } from '../utils/auth.utils'
import { Context } from 'koa'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

dotenv.config()
const prisma = new PrismaClient()

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body as { email: string; password: string }

  const user = await prisma.user.findUnique({ where: { email } })

  if (user) {
    // Выполнение входа, если пользователь существует
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      ctx.status = 401
      ctx.body = { message: 'Неправильный email или пароль' }
      return
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    ctx.cookies.set('access_token', accessToken, { httpOnly: true, secure: false })
    ctx.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: false })

    ctx.body = { message: 'Вход выполнен успешно' }
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'user',
      },
    })

    const accessToken = generateAccessToken(newUser)
    const refreshToken = generateRefreshToken(newUser)

    ctx.cookies.set('access_token', accessToken, { httpOnly: true, secure: false })
    ctx.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: false })

    ctx.body = { message: 'Регистрация прошла успешно' }
  }
}
