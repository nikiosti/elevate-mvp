import Router from 'koa-router'
import { createCategory, getCategories, patchCategory, deleteCategory } from '../controllers'

export const categoriesRouter = new Router({ prefix: '/api' })
export const categoriesRouterPublic = new Router({ prefix: '/api/public' })

categoriesRouterPublic.get('/categories', getCategories)

categoriesRouter.get('/categories', getCategories)

categoriesRouter.post('/categories', createCategory)

categoriesRouter.patch('/categories', patchCategory)
categoriesRouter.delete('/categories/:id', deleteCategory)
