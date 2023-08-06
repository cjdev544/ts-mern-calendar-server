import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export default function validationFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  res.status(400).json({
    ok: false,
    errors: errors.mapped(),
  })
}
