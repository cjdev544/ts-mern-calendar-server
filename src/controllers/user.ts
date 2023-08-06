import { Request, Response } from 'express'
import { ObjectId } from 'mongoose'
import bcrypt from 'bcrypt'
import userServices from '../services/user'
import { jwtGenerator } from '../helpers/jwtGenerator'
import { RequestWithToken } from '../../types'

interface UserRequest extends Request {
  body: {
    uid?: ObjectId
    name?: string
    email: string
    password: string
  }
}

const userController = {
  createUser: async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const userExist = await userServices.userExist(email)
      if (userExist) {
        return res.status(400).json({
          ok: false,
          msg: 'El usuario ya existe',
        })
      }

      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res
            .status(500)
            .send('Error en el servidor al crear el usuario')
        }
        req.body.password = hash

        const user = await userServices.createUser(req.body)

        const token = await jwtGenerator(user._id, user.name)

        return res.status(201).json({
          ok: true,
          user: {
            name: user.name,
            uid: user._id,
            token,
          },
        })
      })

      return
    } catch (err) {
      console.error(err)
      return res.status(500).send('Error en el servidor al crear el usuario')
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const userExist = await userServices.getUserById(req.params.uid)
      if (!userExist) {
        return res.status(400).json({
          ok: false,
          msg: 'El usuario no existe',
        })
      }

      return res.status(200).json({
        ok: true,
        user: {
          name: userExist.name,
          uid: userExist._id,
        },
      })
    } catch (err) {
      console.error(err)
      return res.status(500).send('Error en el servidor al obtener el usuario')
    }
  },

  loginUser: async (req: UserRequest, res: Response) => {
    const { email, password } = req.body

    try {
      const userExist = await userServices.userExist(email)
      if (!userExist) {
        return res.status(400).json({
          ok: false,
          msg: 'El correo y contraseña no coinciden',
        })
      }

      const match = await bcrypt.compare(password, userExist.password)

      if (!match) {
        return res.status(400).json({
          ok: false,
          msg: 'El correo y contraseña no coinciden',
        })
      }

      const token = await jwtGenerator(userExist._id, userExist.name)

      return res.status(200).json({
        ok: true,
        user: {
          uid: userExist._id,
          name: userExist.name,
          token,
        },
      })
    } catch (err) {
      console.error(err)
      return res.status(500).send('Error en el servidor intente de nuevo')
    }
  },

  renewToken: async (req: Request, res: Response) => {
    const { uid, name } = req as RequestWithToken

    const token = await jwtGenerator(uid, name)

    return res.status(200).json({
      ok: true,
      token,
    })
  },

  // deleteUserById: async (_req: Request, _res: Response) => {
  //   return
  // },
}

export default userController
