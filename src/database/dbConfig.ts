import mongoose from 'mongoose'

export const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('Database connected')
  } catch (err) {
    console.error(err)
  }
}
