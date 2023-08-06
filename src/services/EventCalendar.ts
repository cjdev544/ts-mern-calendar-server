import { ObjectId } from 'mongoose'
import { EvenCalendarModel } from '../models/eventCalendar'
import { type EventCalendarDB, type EventCalendar } from '../../types.d'

const eventCalendarServices = {
  getAllEventsCalendar: async () => {
    const events = await EvenCalendarModel.find({}).populate('user')
    return events
  },

  getCalendarEventById: async (eventId: string) => {
    const event = await EvenCalendarModel.findById(eventId)
    return event
  },

  createEventCalendar: async (
    eventCalendar: EventCalendar,
    uid: ObjectId | string
  ) => {
    const event: EventCalendarDB = await EvenCalendarModel.create({
      ...eventCalendar,
      user: uid,
    })
    return event
  },

  updateEventCalendarById: async (
    eventId: string,
    updateEvent: EventCalendar
  ) => {
    const event = await EvenCalendarModel.findByIdAndUpdate(
      eventId,
      updateEvent
    )
    return event
  },

  deleteEventCalendarById: async (eventId: string) => {
    const eventDeleted = await EvenCalendarModel.findByIdAndDelete(eventId)
    return eventDeleted
  },
}

export default eventCalendarServices
