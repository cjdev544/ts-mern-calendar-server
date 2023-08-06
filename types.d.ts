import { Request } from 'express'
import { type ObjectId } from 'mongoose'

export interface UserDB {
  _id: ObjectId
  name: string
  email: string
  password: string
}

export interface EventCalendarDB {
  _id: ObjectId
  title: string
  notes: string
  start: number
  end: number
  user?: UserDB
}

export type User = Omit<UserDB, '_id'>
export type EventCalendar = Omit<EventCalendarDB, '_id'>

interface RequestWithToken extends Request {
  uid: ObjectId
  name: string
}

interface EventRequest extends RequestWithToken {
  body: EventCalendar
}
