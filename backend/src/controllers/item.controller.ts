import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { Context } from '../types/context.types'
import fs from 'fs'
dotenv.config()

const prisma = new PrismaClient()

export const getItems = async (ctx: Context) => {
  try {
    const items = await prisma.item.findMany({
      where: {
        categoryId: ctx.params.id,
      },
    })
    console.log(items)
    ctx.status = 200
    ctx.body = items
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
}

export const postItem = async (ctx: Context) => {
  try {
    const body = ctx.request
    ctx.status = 201
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Error creating item' }
  }
}
