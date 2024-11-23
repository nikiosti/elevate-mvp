import dotenv from 'dotenv'
import Koa from 'koa'

import cors from '@koa/cors'
import bp from 'koa-bodyparser'
import authMiddleware from '../middleware/auth.middleware'
import { authRouter, userRouter, categoriesRouter, categoriesRouterPublic, itemsPublic } from '../routes'
import koaBody from 'koa-body'
import serve from 'koa-static'
import path from 'path'

dotenv.config()
const app = new Koa()
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: './uploads', // Директория для загрузки файлов
      keepExtensions: true, // Сохранять расширения файлов
    },
  })
)
console.log(111, path.join(__dirname, '/uploads'))

app.use(cors({ origin: process.env.CORS_URL, credentials: true }))
app.use(authRouter.routes()).use(authRouter.allowedMethods())

app.use(serve('uploads/'))

//PUBLIC
app.use(categoriesRouterPublic.routes())
app.use(itemsPublic.routes())
//AUTH
app.use(authMiddleware)
app.use(userRouter.routes()).use(authRouter.allowedMethods())
app.use(categoriesRouter.routes())

export default app
