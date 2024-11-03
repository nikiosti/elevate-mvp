import Router from 'koa-router'
import { getPosts } from '../controllers/posts.controller'

export const postsRouter = new Router()

postsRouter.get('/posts', getPosts)
