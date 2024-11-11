import Router from 'koa-router'
import { createRootCategory, getCategories, createSubCategory, patchCategory, deleteCategory } from '../controllers'

export const categoriesRouter = new Router({ prefix: '/api' })

categoriesRouter.get('/categories', getCategories)
categoriesRouter.post('/root/categories', createRootCategory)
categoriesRouter.post('/sub/categories', createSubCategory)
categoriesRouter.patch('/categories', patchCategory)
categoriesRouter.delete('/categories/:id', deleteCategory)
