import Router from 'koa-router'
import { getItems, getItem, postItem, patchItem, patchItemPosition, deleteItem } from '../controllers'
import { router } from './router'

export const itemsPublic = new Router({ prefix: '/api/public' })

export const itemRouter = router

itemRouter.get('/items/:id', getItems)
itemRouter.get('/item/:id', getItem)
itemRouter.post('/item', postItem)
itemRouter.patch('/item/:id', patchItem)
itemRouter.patch('/item-position', patchItemPosition)
itemRouter.delete('/item/:id', deleteItem)
