import Koa from 'koa'
import dotenv from 'dotenv'
import Router from 'koa-router'
import { router as googleRouter } from './app/google.app'
import cors from '@koa/cors'
import { PrismaClient } from '@prisma/client'
import authMiddleware from './middleware/auth.middleware'
import jwt from 'jsonwebtoken'
dotenv.config()

const app = new Koa()
const prisma = new PrismaClient()

app.use(cors({ origin: process.env.CORS_URL, credentials: true }))

const router = new Router()

router.use('/auth', googleRouter.routes())

interface AuthenticatedContext extends Koa.Context {
  state: {
    user: { id: string; role: 'user' | 'admin' }
  }
}

router.get('/posts', authMiddleware, async (ctx: AuthenticatedContext) => {
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
})

router.get('/', async (ctx) => {
  const refresh = ctx.cookies.get('refresh')

  if (!refresh) {
    ctx.status = 401

    ctx.body = { error: 'Refresh token is required' }
    return
  }

  ctx.body = `<a href='http://localhost:3001/auth/google'>google</a>`
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT, () => {
  console.log(`🚀 http://localhost:${process.env.PORT} `)
})
