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

  test('Should return status code 401, invalid token', async () => {
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
      .put(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse.body.user.token.replace('a', 'b'))
      .send({})

    expect(response.status).toBe(401)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.msg).toBe('Token invalido')
  })

  test('Should return status code 400 with invalid title', async () => {
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

    await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    const result = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
    const eventId = result.body.events[0].id

    const response = await request(app)
      .put(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse.body.user.token)
      .send({ title: '', notes: 'Test notes', start: 1, end: '2' })

    expect(response.status).toBe(400)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.errors.title.msg).toBe(
      'El nombre del evento es obligatorio'
    )
  })

  test('Should return status code 400 with invalid date start', async () => {
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

    await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    const result = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
    const eventId = result.body.events[0].id

    const response = await request(app)
      .put(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse.body.user.token)
      .send({ title: 'Test', notes: 'Test notes', start: '', end: '2' })

    expect(response.status).toBe(400)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.errors.start.msg).toBe(
      'La fecha de inicio del evento es obligatorio'
    )
  })

  test('Should return status code 400 with invalid date end', async () => {
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

    await request(app)
      .post('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
      .send(note)

    const result = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)
    const eventId = result.body.events[0].id

    const response = await request(app)
      .put(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse.body.user.token)
      .send({ title: 'Test', notes: 'Test notes', start: 1, end: '' })

    expect(response.status).toBe(400)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.errors.end.msg).toBe(
      'La fecha final del evento es obligatorio'
    )
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
      .put(`/api/v1/events/${eventId.replace('1', '2')}`)
      .set('x-token', tokenResponse.body.user.token)
      .send({
        title: 'Title test',
        notes: 'Test notes',
        start: 1,
        end: '2',
      })

    expect(response.status).toBe(404)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.msg).toBe('Evento no encontrado')
  })

  test('Should return status code 401, not permit auth update event', async () => {
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
      .put(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse2.body.user.token)
      .send({
        title: 'Title test',
        notes: 'Test notes',
        start: 1,
        end: '2',
      })

    expect(response.status).toBe(401)
    expect(response.body.ok).toBeFalsy()
    expect(response.body.msg).toBe(
      'No tiene permisos para actualizar este evento'
    )
  })

  test('Should return status code 200, update event', async () => {
    const note = {
      title: 'Title test',
      notes: 'Test notes',
      start: 1,
      end: '2',
    }

    const updateNote = {
      title: 'Title test  update',
      notes: 'Test notes update',
      start: 3,
      end: 5,
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
      .put(`/api/v1/events/${eventId}`)
      .set('x-token', tokenResponse.body.user.token)
      .send(updateNote)

    expect(response.status).toBe(200)
    expect(response.body.ok).toBeTruthy()
    expect(response.body.msg).toBe('Evento actualizado correctamente')

    const result2 = await request(app)
      .get('/api/v1/events')
      .set('x-token', tokenResponse.body.user.token)

    expect(result2.body.events[0].title).toBe(updateNote.title)
    expect(result2.body.events[0].notes).toBe(updateNote.notes)
    expect(result2.body.events[0].start).toBe(updateNote.start)
    expect(result2.body.events[0].end).toBe(updateNote.end)
    expect(result2.body.events[0].user.uid).toBeTruthy()
    expect(result2.body.events[0].user.name).toBe('Test')
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })
})
