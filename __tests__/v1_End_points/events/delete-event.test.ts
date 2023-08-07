import { afterAll, beforeEach, describe, expect, test } from '@jest/globals'
import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../../../src/app'
import { EvenCalendarModel } from '../../../src/models/eventCalendar'
import { UserModel } from '../../../src/models/user'

describe('Test (delete event by Id) "/events/:eventId"', () => {
  beforeEach(async () => {
    await EvenCalendarModel.deleteMany({})
    await UserModel.deleteMany({})
  })

  test('Should return status code 401 with no token', async () => {
    const response = await request(app).delete('/api/v1/events/123456')

    expect(response.statusCode).toBe(401)
    expect(response.body.msg).toBe('No hay token en la petición')
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })

  test('Should return status code 401, invalid token', async () => {
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
      .set('x-token', tokenResponse.body.user.token.replace('a', 'b'))

    expect(response.status).toBe(401)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.msg).toBe('Token invalido')
  })

  test('Should return status code 404, event not found', async () => {
    const note = {
      title: 'Title test',
      notes: 'Test notes',
      start: 1,
      end: '2',
    }

    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const tokenResponse = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    const result = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
    const eventId = result.body.events[0].id

    const response = await request(app)
      .delete(`/api/v1/events/${eventId.replace('a', 'b')}`)
      .set('x-token', tokenResponse.body.user.token)

    expect(response.status).toBe(404)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.msg).toBe('Evento no encontrado')
  })

  test('Should return status code 401, not permit auth delete event', async () => {
    const note = {
      title: 'Title test',
      notes: 'Test notes',
      start: 1,
      end: '2',
    }

    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const tokenResponse = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    const result = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
    const eventId = result.body.events[0].id

    await request(app).post('/api/v1/users/register').send({
      name: 'Test2',
      email: 'test2@test.com',
      password: 'XXXXXX',
    })
    const tokenResponse2 = await request(app).post('/api/v1/users/login').send({
      email: 'test2@test.com',
      password: 'XXXXXX',
    })

    const response = await request(app)
      .delete(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse2.body.user.token)

    expect(response.status).toBe(401)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.msg).toBe(
      'No tiene permisos para actualizar este evento'
    )
  })

  test('Should return status code 200, delete event', async () => {
    const note = {
      title: 'Title test',
      notes: 'Test notes',
      start: 1,
      end: '2',
    }

    await request(app).post('/api/v1/users/register').send({
      name: 'Test',
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    const tokenResponse = await request(app).post('/api/v1/users/login').send({
      email: 'test@test.com',
      password: 'XXXXXX',
    })

    await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    const result = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
    const eventId = result.body.events[0].id

    const response = await request(app)
      .delete(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse.body.user.token)

    expect(response.status).toBe(200)
    expect(response.body.ok).toBeTruthy()
    expect(response.body.msg).toBe('Evento eliminado correctamente')
  })
})
