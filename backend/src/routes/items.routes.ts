import Router from 'koa-router'
import { getItems, postItem } from '../controllers'

export const itemsPublic = new Router({ prefix: '/api/public' })

itemsPublic.get('/items/:id', getItems)
itemsPublic.post('/item', postItem)
