import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import v1UsersRouter from './v1/routes/user'
import { config } from 'dotenv'
import v1EventCalendarRouter from './v1/routes/eventCalendar'
import { dbConfig } from './database/dbConfig'

config()
const app = express()
const PORT = process.env.PORT || 3000

// Database connection
dbConfig()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/api/v1/users', v1UsersRouter)
app.use('/api/v1/events', v1EventCalendarRouter)

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
