import { afterAll, beforeEach, describe, expect, test } from '@jest/globals'
import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../../../src/app'
import { EvenCalendarModel } from '../../../src/models/eventCalendar'
import { UserModel } from '../../../src/models/user'

describe('Test (get all events) "/events"', () => {
  beforeEach(async () => {
    await EvenCalendarModel.deleteMany({})
    await UserModel.deleteMany({})
  })

  test('Should return status code 401 with no token', async () => {
    const response = await request(app).get('/api/v1/events')

    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('No hay token en la petición')
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })

  test('Should return status code 401 with invalid token', async () => {
    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const tokenResponse = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const result = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token.replace('a', 'b'))

    expect(result.status).toBe(401)
    expect(result.body.ok).toBeFalsy()
    expect(result.body.msg).toBe('Token invalido')
  })

  test('Should return status code 200', async () => {
    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const tokenResponse = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const response = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)

    expect(response.statusCode).toBe(200)
    expect(response.body.ok).toBeTruthy()
    expect(response.body.events).toBeInstanceOf(Array)
  })
})
