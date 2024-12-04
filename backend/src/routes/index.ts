import { authRouter } from './auth.routes'
import { userRouter } from './user.routes'
import { categoriesRouter, categoriesRouterPublic } from './categories.routes'
import { itemsPublic, itemRouter } from './items.routes'
import { categoryItems } from './nested.routes'

export { authRouter, userRouter, categoriesRouter, categoriesRouterPublic, itemsPublic, itemRouter, categoryItems }
