import { Category, PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Context } from '../types/context.types'

import { CategoryWithChildren, Categories } from '../../../types/category'
dotenv.config()

const prisma = new PrismaClient()

const MAX_LEVEL = 5

export const getCategories = async (ctx: Context): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
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

    const transformData = (data: CategoryWithChildren[]): Categories[] => {
      return data?.map((item) => ({
        nodeProps: { type: item.type, image: item.image },
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

export const createCategory = async (ctx: Context) => {
  try {
    const { name, id, level } = ctx.request.body as { name: string; id?: string; level?: number }
    const files = ctx.request.files as { files: { newFilename: string } } | undefined
    //TODO
    if (level && level >= MAX_LEVEL) {
      ctx.status = 400
      ctx.body = { error: `Превышен максимальный уровень вложенности: ${MAX_LEVEL}` }
      return
    }

    const category = await prisma.category.create({
      data: {
        name,
        image: files?.files.newFilename ? 'http://localhost:3001/uploads/' + files?.files.newFilename : null,
        parentId: id,
        authorId: ctx.state.access.id,
      },
    })
    ctx.status = 201
    ctx.body = category
  } catch (error) {
    console.log(111, error)
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
