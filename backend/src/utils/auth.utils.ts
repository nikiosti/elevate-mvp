import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

dotenv.config()

export const generateAccessToken = (user: User) => {
  return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: process.env.JWT_ACCESS_EXPIRY })
}

export const generateRefreshToken = (user: User) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: process.env.JWT_REFRESH_EXPIRY })
}
