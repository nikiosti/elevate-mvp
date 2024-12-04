import { Item, PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Context } from '../types/context.types'
import { FileContext } from '../types/file.types'
import { LexoRank } from 'lexorank'

dotenv.config()

const prisma = new PrismaClient()

export const getItems = async (ctx: Context) => {
  try {
    const items = await prisma.item.findMany({
      where: {
        categoryId: ctx.params.id,
      },
    })

    ctx.status = 200
    ctx.body = items
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
}

export const getItem = async (ctx: Context) => {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: ctx.params.id,
      },
    })

    ctx.status = 200
    ctx.body = item
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
}

export const postItem = async (ctx: Context) => {
  try {
    const { name, categoryId, rank } = ctx.request.body as Item

    const files = ctx.request.files as { files?: { newFilename?: string } }

    const minRank = await prisma.item.findFirst({
      where: { categoryId },
      select: { rank: true },
      orderBy: { rank: 'asc' },
    })
    const newRank = minRank?.rank ? LexoRank.parse(minRank.rank).genPrev().toString() : LexoRank.middle().toString()

    const newItem = await prisma.item.create({
      data: {
        name,
        image: files?.files?.newFilename,
        rank: newRank,
        categoryId,
      },
    })

    ctx.status = 201
    ctx.body = newItem
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = { error: 'Error creating item' }
  }
}

export const patchItemPosition = async (ctx: Context) => {
  try {
    const { fromId, fromPositon, toId, toPositon } = ctx.request.body as {
      fromId: string
      toId: string
      fromPositon: number
      toPositon: number
    }

    const itemFrom = await prisma.item.update({
      data: {
        position: toPositon,
      },
      where: {
        id: fromId,
      },
    })
    const itemTo = await prisma.item.update({
      data: {
        position: fromPositon,
      },
      where: {
        id: toId,
      },
    })

    ctx.status = 200
    ctx.body = itemTo
  } catch {
    ctx.status = 500
  }
}

export const patchItem = async (ctx: Context) => {
  try {
    const { name, rank } = ctx.request.body as {
      name: string
      rank?: string
    }

    const files = ctx.request.files as FileContext

    const item = await prisma.item.update({
      data: {
        name,
        rank,
        image: files?.files?.newFilename,
      },
      where: {
        id: ctx.params.id,
      },
    })
    ctx.status = 200
    ctx.body = item
  } catch {
    ctx.status = 500
  }
}

export const deleteItem = async (ctx: Context) => {
  try {
    const item = await prisma.item.delete({
      where: {
        id: ctx.params.id,
      },
    })

    ctx.body = item
    ctx.status = 200
  } catch {
    ctx.status = 500
  }
}
