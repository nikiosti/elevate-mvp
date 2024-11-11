import { Context as KoaContext } from 'koa'
import { AccessToken } from '../utils/auth.utils'
export interface Context extends KoaContext {
  state: {
    access: AccessToken
  }
}
