import { Router } from 'express'
import { check } from 'express-validator'

import { jwtValidator } from '../../middlewares/jwtValidator'
import eventCalendarController from '../../controllers/eventCalendar'
import validationFields from '../../middlewares/validationFields'
import { dateValidator } from '../../helpers/dateValidator'

const v1EventCalendarRouter = Router()

v1EventCalendarRouter
  .use(jwtValidator)

  .get('/', eventCalendarController.getAllEventsCalendar)

  .post(
    '/',
    [
      check('title', 'El nombre del evento es obligatorio').not().isEmpty(),
      check('start', 'La fecha de inicio del evento es obligatorio')
        .not()
        .isEmpty(),
      check('start', 'La fecha de inicio no es valida').custom(dateValidator),
      check('end', 'La fecha final del evento es obligatorio').not().isEmpty(),
      check('end', 'La fecha final no es valida').custom(dateValidator),
      validationFields,
    ],
    eventCalendarController.createEventCalendar
  )

  .put(
    '/:id',
    [
      check('title', 'El nombre del evento es obligatorio').not().isEmpty(),
      check('start', 'La fecha de inicio del evento es obligatorio')
        .not()
        .isEmpty(),
      check('start', 'La fecha de inicio no es valida').custom(dateValidator),
      check('end', 'La fecha final del evento es obligatorio').not().isEmpty(),
      check('end', 'La fecha final no es valida').custom(dateValidator),
      validationFields,
    ],
    eventCalendarController.updateEventCalendarById
  )

  .delete('/:id', eventCalendarController.deleteEventCalendarById)

export default v1EventCalendarRouter
