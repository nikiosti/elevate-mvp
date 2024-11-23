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

    ctx.status = 200
    ctx.body = items
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: 'Internal Server Error' }
  }
}

import path from 'path'

export const postItem = async (ctx: Context) => {
  try {
    console.log('Body:', ctx.request.body)
    console.log('Files:', ctx.request.files)

    const files = ctx.request.files?.files
    console.log(2, files)

    const filePath = files.filepath.replace(/\\/g, '/') // Приводим путь к стандарту
    console.log(3, filePath)

    const fileName = path.basename(filePath) // Извлекаем имя файла
    console.log(fileName)
    const publicPath = `/uploads/${fileName}` // Относительный путь для API

    // const { name, categoryId } = ctx.request.body;

    // Сохраняем данные в базу
    // const newItem = await prisma.item.create({
    //   data: {
    //     name,
    //     imagePath: publicPath,
    //     categoryId: parseInt(categoryId, 10),
    //   },
    // });

    ctx.status = 201
    ctx.body = newItem
  } catch (error) {
    console.error(error)
    ctx.status = 500
    ctx.body = { error: 'Error creating item' }
  }
}
