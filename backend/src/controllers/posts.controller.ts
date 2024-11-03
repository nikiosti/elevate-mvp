import dotenv from 'dotenv'
import { Context } from 'koa'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const prisma = new PrismaClient()

interface AuthenticatedContext extends Context {
  state: {
    user: { id: string; role: 'user' | 'admin' }
  }
}

export const getPosts = async (ctx: AuthenticatedContext) => {
  try {
    const refresh = ctx.cookies.get('refresh_token')
    if (!refresh) {
      ctx.status = 406
      ctx.body = 'refresh token none'
      return
    }
    const payload = jwt.verify(refresh, process.env.JWT_REFRESH_SECRET!) as unknown as { id: string }

    const posts = await prisma.post.findMany({
      where: {
        authorId: payload.id,
      },
    })

    ctx.status = 200
    ctx.body = posts
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Failed to create post' }
  }
}
