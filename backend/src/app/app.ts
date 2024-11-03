import dotenv from 'dotenv'
import Koa from 'koa'
import { authRouter } from '../routes/auth.routes'
import { postsRouter } from '../routes/posts.routes'
import cors from '@koa/cors'
import bp from 'koa-bodyparser'

dotenv.config()
const app = new Koa()
app.use(bp())
app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
app.use(authRouter.routes()).use(authRouter.allowedMethods())
app.use(postsRouter.routes()).use(authRouter.allowedMethods())

export default app
