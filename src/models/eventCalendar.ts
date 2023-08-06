import { Schema, model } from 'mongoose'
import { type EventCalendarDB, type EventCalendar } from '../../types'

const eventCalendarSchema = new Schema<EventCalendar>({
  title: { type: String, required: true },
  notes: { type: String },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
})

export const EvenCalendarModel = model<EventCalendarDB>(
  'EventCalendar',
  eventCalendarSchema
)
