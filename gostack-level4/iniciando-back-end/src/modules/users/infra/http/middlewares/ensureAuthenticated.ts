import { NextFunction, Request, Response } from 'express'

import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'
import { verify } from 'jsonwebtoken'

interface ITokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token is missing', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, authConfig.jwt.secret) as ITokenPayload

    const { sub } = decoded

    request.user = { id: sub }

    return next()
  } catch (err) {
    throw new AppError('Invalid token', 401)
  }
}
