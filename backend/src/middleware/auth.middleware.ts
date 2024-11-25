import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'
import { AccessToken } from '../utils/auth.utils'



const authMiddleware = async (ctx: Context, next: Next) => {
  const accessToken = ctx.cookies.get('access_token')

  if (!accessToken) {
    ctx.status = 401
    ctx.body = { error: 'middleware' }
    return
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as AccessToken
    ctx.state.access = payload

    await next()
  } catch (error) {
    ctx.status = 401

    ctx.body = { error: 'middleware' }
  }
}

export default authMiddleware
