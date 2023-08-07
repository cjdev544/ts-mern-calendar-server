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

describe('Testing "users/renew"', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({})
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

    const response2 = await request(app)
      .get('/api/v1/users/renew')
      .set('x-token', response.body.user.token)
      .send()

    const tokenDecoded = <Token>(
      jwt.verify(response2.body.token, process.env.SECRET_JWT_SEED!)
    )

    expect(response2.statusCode).toBe(200)
    expect(tokenDecoded.name).toBe(userTest.name)
    expect(tokenDecoded.uid).toBe(response.body.user.uid)
  })

  afterAll(() => {
    server.close()
    mongoose.connection.close()
  })
})
