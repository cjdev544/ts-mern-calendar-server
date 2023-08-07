import mongoose from 'mongoose'

export const dbConfig = async () => {
  const { NODE_ENV, MONGODB_URI, MONGODB_URI_DEV, MONGODB_URI_TEST } =
    process.env

  let connectionString: string | undefined

  if (NODE_ENV === 'test') connectionString = MONGODB_URI_TEST
  if (NODE_ENV === 'development') connectionString = MONGODB_URI_DEV
  if (NODE_ENV === 'production') connectionString = MONGODB_URI

  if (!connectionString) {
    throw new Error(
      'Remember to configure the environment variables in the ".env" file. Use MONGODB_URI_TEST for the testing environment, MONGODB_URI_DEV for the development environment, and MONGODB_URI for production'
    )
  }

  console.log({ connectionString })
  try {
    await mongoose.connect(connectionString!)
    console.log('Database connected')
  } catch (err) {
    console.error(err)
  }
}
