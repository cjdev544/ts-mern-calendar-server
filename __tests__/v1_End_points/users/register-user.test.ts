import request from 'supertest'
import mongoose, { ObjectId } from 'mongoose'
import { afterAll, describe, test, expect, beforeEach } from '@jest/globals'
import jwt from 'jsonwebtoken'
import { app, server } from '../../../src/app'
import { UserModel } from '../../../src/models/user'

interface Token {
  uid: ObjectId
  name: string
}

describe('Testing "users/register"', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({})
  })

  test('Should return status code 400 when the name is not valid', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      name: 'T',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    expect(response.body.errors.name.msg).toBe(
      'El nombre debe tener al menos 2 caracteres'
    )
    expect(response.statusCode).toBe(400)
  })

  test('Should return status code 400 when the email is not valid', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test',
      password: 'XXXXXX',
    })
    expect(response.body.errors.email.msg).toBe('El email es obligatorio')
    expect(response.statusCode).toBe(400)
  })

  test('Should return status code 400 when the email is not valid', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXX',
    })

    expect(response.body.errors.password.msg).toBe(
      'La contraseña debe tener al menos 6 caracteres'
    )
    expect(response.statusCode).toBe(400)
  })

  test('Should return status code 200 and create new user', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    expect(response.body.errors).toBeUndefined()
    expect(response.statusCode).toBe(201)
    expect(response.body.user.name).toBe('Test')
    expect(response.body.user.uid).toBeTruthy()
    expect(response.body.user.token).toBeTruthy()
  })

  test('Should return status code 400 and return msg "El usuario ya existe"', async () => {
    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const response = await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    expect(response.body.msg).toBe('El usuario ya existe')
    expect(response.statusCode).toBe(400)
  })

  test('Should create token correctly', async () => {
    const userTest = {
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    }

    const response = await request(app)
      .post('/api/v1/users/register')
      .send(userTest)
    const tokenDecoded = <Token>(
      jwt.verify(response.body.user.token, process.env.SECRET_JWT_SEED!)
    )

    expect(tokenDecoded.uid).toBe(response.body.user.uid)
    expect(tokenDecoded.name).toBe(response.body.user.name)
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })
})
