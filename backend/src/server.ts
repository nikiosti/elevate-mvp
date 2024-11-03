import dotenv from 'dotenv'
import app from './app/app'

dotenv.config()

app.listen(process.env.PORT, () => {
  console.log(`🚀 http://localhost:${process.env.PORT} `)
})
