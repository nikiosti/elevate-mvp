import dotenv from 'dotenv'
import Router from 'koa-router'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
dotenv.config()
export const router = new Router()

router.post('/create-payment', async (ctx) => {
  //https://yookassa.ru/developers/api

  const idempotenceKey = uuidv4()
  try {
    const response = await axios.post(
      'https://api.yookassa.ru/v3/payments',
      {
        amount: {
          value: '100.00',
          currency: 'RUB',
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: 'http://localhost:3000',
        },
        description: 'Заказ №1',
      },
      {
        headers: {
          'Idempotence-Key': idempotenceKey,
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.SHOP_ID!,
          password: process.env.YOOKASSA_KEY!,
        },
      }
    )

    ctx.body = response.data
  } catch (error: any) {
    ctx.status = error.response ? error.response.status : 500
    ctx.body = {
      message: error.message,
      ...(error.response ? error.response.data : {}),
    }
  }
})
