import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '@prisma/client'

dotenv.config()
export interface AccessToken extends JwtPayload {
  id: string
  role: string
}

export const generateAccessToken = (user: User): string => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY,
  })
}

export const generateRefreshToken = (user: User): string => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY,
  })
}
