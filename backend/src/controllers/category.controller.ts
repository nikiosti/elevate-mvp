import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Context } from '../types/context.types'
import { TreeNodeData } from '@mantine/core'

dotenv.config()

const prisma = new PrismaClient()

const MAX_LEVEL = 5

export const getCategories = async (ctx: Context): Promise<void> => {
  try {
    // Получаем категории с вложенными структурами
    const categories = await prisma.category.findMany({
      orderBy: {
        position: 'asc',
      },
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const transformData = (data: any[]): TreeNodeData[] => {
      return data?.map((item) => ({
        value: item.id,
        label: item.name,
        children: transformData(item.children),
      }))
    }

    ctx.status = 200
    ctx.body = transformData(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
}

export const createRootCategory = async (ctx: Context) => {
  try {
    const { name } = ctx.request.body as { name: string }
    const maxPosition = await prisma.category.aggregate({
      _max: {
        position: true,
      },
    })
    const newPosition = (maxPosition._max.position || 0) + 1
    const rootCategory = await prisma.category.create({
      data: {
        name,
        authorId: ctx.state.access.id,
        position: newPosition,
      },
    })
    ctx.status = 201
    ctx.body = rootCategory
  } catch {
    ctx.status = 500
  }
}

export const createSubCategory = async (ctx: Context) => {
  try {
    const { name, id, level } = ctx.request.body as { name: string; id: string; level: number }

    if (level >= MAX_LEVEL) {
      ctx.status = 400
      ctx.body = { error: `Превышен максимальный уровень вложенности: ${MAX_LEVEL}` }
      return
    }

    const sub = await prisma.category.create({
      data: {
        name,
        parentId: id,
        authorId: ctx.state.access.id,
      },
    })
    ctx.status = 201
    ctx.body = sub
  } catch (error) {
    ctx.status = 500
  }
}

export const patchCategory = async (ctx: Context) => {
  try {
    let { name, id, parentId } = ctx.request.body as {
      name: string
      id: string
      level: number
      parentId?: string | null
    }

    const patchCategory = await prisma.category.update({
      data: {
        name,
        parentId,
      },
      where: {
        id,
      },
    })
    ctx.status = 200
    ctx.body = patchCategory
  } catch {
    ctx.status = 500
  }
}

export const deleteCategory = async (ctx: Context) => {
  try {
    const deleteCategory = await prisma.category.delete({
      where: {
        id: ctx.params.id,
      },
    })

    ctx.body = deleteCategory
    ctx.status = 200
  } catch {
    ctx.status = 500
  }
}
