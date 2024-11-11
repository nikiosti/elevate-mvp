import { Context } from '../types/context.types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const user = async (ctx: Context) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.state.access.id,
      },
    })
    ctx.status = 200
    ctx.body = user
  } catch {
    ctx.status = 500
    ctx.body = 'Error server'
  }
}
