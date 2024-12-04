import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Context } from '../types/context.types'

dotenv.config()

const prisma = new PrismaClient()

export const getCategoryItems = async (ctx: Context): Promise<void> => {
  try {
    const categoryItems = await prisma.category.findUnique({
      where: {
        id: ctx.params.id,
      },
      include: {
        items: {
          where: { categoryId: ctx.params.id },
          orderBy: {
            rank: 'asc',
          },
        },
      },
    })

    ctx.status = 200
    ctx.body = categoryItems
  } catch (error) {
    console.error('Error fetching categories:', error)
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
}
