import { Router } from 'express'
import userController from '../../controllers/user'
import { check } from 'express-validator'
import validationFields from '../../middlewares/validationFields'
import { jwtValidator } from '../../middlewares/jwtValidator'

const v1UsersRouter = Router()

v1UsersRouter

  .post(
    '/login',
    [
      check('email', 'La contraseña o el email son incorrectos')
        .trim()
        .toLowerCase()
        .isEmail(),
      check('password', 'La contraseña o el email son incorrectos')
        .trim()
        .isLength({
          min: 6,
        }),
    ],
    validationFields,
    userController.loginUser
  )

  .post(
    '/register',
    [
      check('name', 'El nombre debe tener al menos 2 caracteres')
        .trim()
        .isLength({ min: 2 }),
      check('email', 'El email es obligatorio').trim().toLowerCase().isEmail(),
      check('password', 'La contraseña debe tener al menos 6 caracteres')
        .trim()
        .isLength({
          min: 6,
        }),
    ],
    validationFields,
    userController.createUser
  )

  .get('/renew', jwtValidator, userController.renewToken)

  .get('/:uid', userController.getUserById)

// .delete('/:uid', userController.deleteUserById)

export default v1UsersRouter
