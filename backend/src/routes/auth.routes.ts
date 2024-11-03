import Router from 'koa-router'
import { googleAuth, googleCallback, logout, refreshToken, login } from '../controllers'

export const authRouter = new Router({ prefix: '/auth' })

authRouter.get('/google', googleAuth)
authRouter.get('/google/callback', googleCallback)

authRouter.post('/login', login)

authRouter.post('/refresh', refreshToken)
authRouter.post('/logout', logout)
