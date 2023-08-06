import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

export const jwtGenerator = (uid: ObjectId, name: string) => {
  const payload = { uid, name }

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED!,
      {
        expiresIn: '24h',
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('El token no pudo ser generado')
        }

        resolve(token)
      }
    )
  })
}
