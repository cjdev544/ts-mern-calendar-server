import { type User, type UserDB } from '../../types.d'
import { UserModel } from '../models/user'

const userServices = {
  userExist: async (email: string): Promise<UserDB | null> => {
    const userExist = await UserModel.findOne({ email })
    return userExist
  },

  createUser: async (user: User): Promise<UserDB> => {
    const newUser = await UserModel.create(user)
    return newUser
  },

  getUserById: async (id: string): Promise<UserDB | null> => {
    const user = await UserModel.findById(id)
    return user
  },
}

export default userServices
