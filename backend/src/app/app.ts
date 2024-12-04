import dotenv from 'dotenv'
import Koa from 'koa'

import cors from '@koa/cors'
import authMiddleware from '../middleware/auth.middleware'
import {
  authRouter,
  userRouter,
  categoriesRouter,
  categoriesRouterPublic,
  itemsPublic,
  categoryItems,
  itemRouter,
} from '../routes'
import koaBody from 'koa-body'
import serve from 'koa-static'

dotenv.config()
const app = new Koa()
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: './uploads',
      keepExtensions: true,
    },
  })
)

app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
app.use(authRouter.routes()).use(authRouter.allowedMethods())

//PUBLIC
app.use(serve('.'))
app.use(categoriesRouterPublic.routes())
app.use(itemsPublic.routes())

//AUTH
app.use(authMiddleware)
app.use(userRouter.routes()).use(authRouter.allowedMethods())
app.use(categoriesRouter.routes())
app.use(categoryItems.routes())
app.use(itemRouter.routes())

export default app
