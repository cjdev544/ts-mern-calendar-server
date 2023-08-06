import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import { RequestWithToken } from '../../types'

interface Token {
  uid: ObjectId
  name: string
}

export const jwtValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición',
    })
  }

  try {
    const tokenDecoded = <Token>jwt.verify(token, process.env.SECRET_JWT_SEED!)

    ;(req as RequestWithToken).uid = tokenDecoded.uid
    ;(req as RequestWithToken).name = tokenDecoded.name

    next()
  } catch {
    return res.status(401).json({
      ok: false,
      msg: 'Token invalido',
    })
  }
  return
}
