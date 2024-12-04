import Router from 'koa-router'
import { getCategoryItems } from '../controllers'

export const categoryItems = new Router({ prefix: '/api' })

categoryItems.get('/category-items/:id', getCategoryItems)
