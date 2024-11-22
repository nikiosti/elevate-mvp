import Router from 'koa-router'
import { createRootCategory, getCategories, createSubCategory, patchCategory, deleteCategory } from '../controllers'

export const categoriesRouter = new Router({ prefix: '/api' })
export const categoriesRouterPublic = new Router({ prefix: '/api/public' })

categoriesRouterPublic.get('/categories', getCategories)

categoriesRouter.get('/categories', getCategories)

categoriesRouter.post('/root/categories', createRootCategory)
categoriesRouter.post('/sub/categories', createSubCategory)

categoriesRouter.patch('/categories', patchCategory)
categoriesRouter.delete('/categories/:id', deleteCategory)
