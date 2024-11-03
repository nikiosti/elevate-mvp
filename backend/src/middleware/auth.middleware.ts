import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

interface AuthState {
  user?: User
}

const authMiddleware = async (ctx: Context & { state: AuthState }, next: Next) => {
  const accessToken = ctx.cookies.get('access_token')

  if (!accessToken) {
    ctx.status = 401
    ctx.body = { error: 'Access token not provided' }
    return
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as { id: string }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    })

    if (!user) {
      ctx.status = 401
      ctx.body = { error: 'User not found' }
      return
    }

    ctx.state.user = user

    await next()
  } catch (error) {
    ctx.status = 401
    console.log(11, error)
    ctx.body = { error: 'Invalid or expired access token1' }
  }
}

export default authMiddleware
