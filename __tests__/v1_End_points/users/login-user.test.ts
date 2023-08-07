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

describe('Testing "users/login"', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({})
  })

  test('Should return status code 400 when the email is not valid', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test',
      password: 'XXXXXX',
    })
    expect(response.body.errors.email.msg).toBe(
      'La contraseña o el email son incorrectos'
    )
    expect(response.statusCode).toBe(400)
  })

  test('Should return status code 400 when the email is not valid', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXX',
    })

    expect(response.body.errors.password.msg).toBe(
      'La contraseña o el email son incorrectos'
    )
    expect(response.statusCode).toBe(400)
  })

  test('Should return status code 400 with invalid password', async () => {
    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX7',
    })

    expect(response.body.msg).toBe('El correo y contraseña no coinciden')
    expect(response.statusCode).toBe(400)
  })

  test('Should return status code 400 with invalid email', async () => {
    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@tests.com',
      password: 'XXXXXX',
    })

    expect(response.body.msg).toBe('El correo y contraseña no coinciden')
    expect(response.statusCode).toBe(400)
  })

  test('Should return status code 200', async () => {
    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    expect(response.body.errors).toBeUndefined()
    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toBe('Test')
    expect(response.body.user.uid).toBeTruthy()
    expect(response.body.user.token).toBeTruthy()
  })

  test('Should create token correctly', async () => {
    const userTest = {
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    }

    await request(app).post('/api/v1/users/register').send(userTest)

    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX',
    })

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
