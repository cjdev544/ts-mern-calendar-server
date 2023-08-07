import { afterAll, beforeEach, describe, expect, test } from '@jest/globals'
import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../../../src/app'
import { EvenCalendarModel } from '../../../src/models/eventCalendar'
import { UserModel } from '../../../src/models/user'

describe('Test "/events"', () => {
  beforeEach(async () => {
    await EvenCalendarModel.deleteMany({})
    await UserModel.deleteMany({})
  })

  test('Should return status code 401', async () => {
    const response = await request(app).post('/api/v1/events').send({})

    expect(response.statusCode).toBe(401)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.msg).toBe('No hay token en la petición')
  })

  test('Should return status code 401 with invalid title', async () => {
    const note = {
      title: '',
      notes: 'Test notes',
      start: 1,
      end: 2,
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

    const response = await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    expect(response.statusCode).toBe(400)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.errors.title.msg).toBe(
      'El nombre del evento es obligatorio'
    )
  })

  test('Should return status code 401 with invalid data start', async () => {
    const note = {
      title: 'Title test',
      notes: 'Test notes',
      start: '',
      end: 2,
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

    const response = await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    expect(response.statusCode).toBe(400)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.errors.start.msg).toBe(
      'La fecha de inicio del evento es obligatorio'
    )
  })

  test('Should return status code 401 with invalid data end', async () => {
    const note = {
      title: 'Title test',
      notes: 'Test notes',
      start: 1,
      end: '',
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

    const response = await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    expect(response.statusCode).toBe(400)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.errors.end.msg).toBe(
      'La fecha final del evento es obligatorio'
    )
  })

  test('Should return status code 201, create event', async () => {
    const note = {
      title: 'Title test',
      notes: 'Test notes',
      start: 1,
      end: 2,
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
    console.log(process.env.NODE_ENV)
    const response = await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    expect(response.statusCode).toBe(201)
    expect(response.body.errors).toBeUndefined()
    expect(response.body.ok).toBeTruthy()
    expect(response.body.msg).toBe('Evento creado correctamente')
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })
})
