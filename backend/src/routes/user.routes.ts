import Router from 'koa-router'
import { user } from '../controllers'

export const userRouter = new Router()

userRouter.get('/user', user)
