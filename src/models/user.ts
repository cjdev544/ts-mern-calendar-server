import { Schema, model } from 'mongoose'
import { type UserDB, type User } from '../../types.d'

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

export const UserModel = model<UserDB>('User', userSchema)
