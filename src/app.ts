import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import v1UsersRouter from './v1/routes/user'
import { config } from 'dotenv'
import v1EventCalendarRouter from './v1/routes/eventCalendar'
import { dbConfig } from './database/dbConfig'

config()
export const app = express()
const PORT = process.env.PORT || 3000

// Database connection
dbConfig()

// Middlewares
app.use(express.json())
app.use(cors())
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.use('/api/v1/users', v1UsersRouter)
app.use('/api/v1/events', v1EventCalendarRouter)

export const server = app.listen(PORT, () =>
  console.log(`Server listening on port: ${PORT}`)
)
