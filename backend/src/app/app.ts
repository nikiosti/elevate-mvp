import dotenv from 'dotenv'
import Koa from 'koa'

import cors from '@koa/cors'
import bp from 'koa-bodyparser'
import authMiddleware from '../middleware/auth.middleware'
import { authRouter, userRouter, categoriesRouter } from '../routes'

dotenv.config()
const app = new Koa()
app.use(bp())
app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
app.use(authRouter.routes()).use(authRouter.allowedMethods())

app.use(authMiddleware)
app.use(userRouter.routes()).use(authRouter.allowedMethods())
app.use(categoriesRouter.routes())

export default app
