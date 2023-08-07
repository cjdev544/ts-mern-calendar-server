import { Request, Response } from 'express'
import { type EventRequest } from '../../types.d'
import eventCalendarServices from '../services/EventCalendar'

const eventCalendarController = {
  getAllEventsCalendar: async (_req: Request, res: Response) => {
    const events = await eventCalendarServices.getAllEventsCalendar()

    const formatEvents = events.map((event) => {
      return {
        id: event.id,
        title: event.title,
        notes: event.notes,
        start: event.start,
        end: event.end,
        user: {
          uid: event.user?._id,
          name: event.user?.name,
        },
      }
    })
    return res.status(200).json({
      ok: true,
      events: formatEvents,
    })
  },

  createEventCalendar: async (req: Request, res: Response) => {
    const { title, notes, start, end } = (req as EventRequest).body
    const { uid } = req as EventRequest

    try {
      await eventCalendarServices.createEventCalendar(
        {
          title,
          notes,
          start,
          end,
        },
        uid
      )

      return res.status(201).json({
        ok: true,
        msg: 'Evento creado correctamente',
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        ok: false,
        msg: 'Error en el servidor al crear el evento del calendario',
      })
    }
  },

  updateEventCalendarById: async (req: Request, res: Response) => {
    const { title, notes, start, end } = (req as EventRequest).body
    const { uid } = req as EventRequest
    const { id } = req.params

    try {
      const eventUpdated = await eventCalendarServices.getCalendarEventById(id)

      if (!eventUpdated) {
        return res.status(404).json({
          ok: false,
          msg: 'Evento no encontrado',
        })
      }

      if (uid.toString() !== eventUpdated?.user?._id.toString()) {
        return res.status(401).json({
          ok: false,
          msg: 'No tiene permisos para actualizar este evento',
        })
      }

      await eventCalendarServices.updateEventCalendarById(id, {
        title,
        notes,
        start,
        end,
      })

      return res.status(200).json({
        ok: true,
        msg: 'Evento actualizado correctamente',
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        ok: false,
        msg: 'Error en el servidor al actualizar el evento del calendario',
      })
    }
  },

  deleteEventCalendarById: async (req: Request, res: Response) => {
    const { uid } = req as EventRequest
    const { id } = req.params

    try {
      const event = await eventCalendarServices.getCalendarEventById(id)

      if (!event) {
        return res.status(404).json({
          ok: false,
          msg: 'Evento no encontrado',
        })
      }

      if (uid.toString() !== event?.user?._id.toString()) {
        return res.status(401).json({
          ok: false,
          msg: 'No tiene permisos para actualizar este evento',
        })
      }

      await eventCalendarServices.deleteEventCalendarById(id)

      return res.status(200).json({
        ok: true,
        msg: 'Evento eliminado correctamente',
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        ok: false,
        msg: 'Error en el servidor al actualizar el evento del calendario',
      })
    }
  },
}

export default eventCalendarController
