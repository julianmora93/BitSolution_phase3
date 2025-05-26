/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { build } from '../helper'
import { FastifyInstance } from 'fastify'
import { findUsers, upsertManyUsers } from '../../src/repositories/users'
import { dataUsersMock, tokenMock } from '../utils/data.mock'

jest.mock('../../src/repositories/users', () => ({
  findUsers: jest.fn(),
  upsertManyUsers: jest.fn()
}))

describe('User Routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
  })

  beforeEach(() => {
    (findUsers as jest.Mock).mockResolvedValue(dataUsersMock),
    (upsertManyUsers as jest.Mock).mockResolvedValue(true)
  })

  afterAll(async () => {
    if (app) await app.close()
  })

  it('POST /token => should return 200 when data is valid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/token',
      body: {
        userId: '10',
        userName: 'jmora',
        scope: 'read write'
      }
    })
    
    expect(response.statusCode).toBe(200)
  })

  it('POST /token => should return 400 when the request body contains an invalid property', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/token',
      body: {
        userId: 0,
        userName: 'jmora',
        scope: 'read write'
      }
    })
    
    expect(response.statusCode).toBe(400)
  })

  it('POST /token => should return 500 when the request body is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/token',
    })

    expect(response.statusCode).toBe(500)
  })

  it('GET /users => should return 400 when the request body contains an invalid property', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        authorization: `${tokenMock}read`
      },
      query: {
        page: '0',
        pageSize: '10'
      }
    })

    expect(response.statusCode).toBe(400)
  })

  it('GET /users => should return 200 with mock', async () => {
    (findUsers as jest.Mock).mockResolvedValue(dataUsersMock)

    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        authorization: `${tokenMock}read`
      },
      query: {
        page: '1',
        pageSize: '10'
      }
    })
    expect(findUsers).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
  })
  
  it('GET /users => should return 401 without token', async () => {
    (findUsers as jest.Mock).mockResolvedValue(dataUsersMock)

    const response = await app.inject({
      method: 'GET',
      url: '/users',
      query: {
        page: '1',
        pageSize: '10'
      }
    })

    expect(response.statusCode).toBe(401)
  })

  it('GET /users => should return 403 when permissions are insufficient', async () => {
    (findUsers as jest.Mock).mockResolvedValue(dataUsersMock)

    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        authorization: `${tokenMock}write`
      },
      query: {
        page: '1',
        pageSize: '10'
      }
    })

    expect(response.statusCode).toBe(403)
  })

  it('POST /users/load => should return 200 as the request conditions are satisfied', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users/load',
      headers: {
        authorization: `${tokenMock}write read`
      }
    })
    const { count } = JSON.parse(response.body)
    expect(response.statusCode).toBe(200)
    expect(count).toBeGreaterThan(1)
    expect(upsertManyUsers).toHaveBeenCalledTimes(1)
  })
  
  it('POST /users/load => should return 400 if the Axios response is empty', async () => {
    app.axios.get = jest.fn().mockResolvedValue({ status: 200, data: [] })
    const response = await app.inject({
      method: 'POST',
      url: '/users/load',
      headers: {
        authorization: `${tokenMock}write read`
      }
    })
    const { count } = JSON.parse(response.body)
    expect(response.statusCode).toBe(400)
    expect(count).toEqual(0)
  })
  
  it('POST /users/load => should return 401 without token', async () => {
    app.axios.get = jest.fn().mockResolvedValue({ status: 200, data: [] })
    const response = await app.inject({
      method: 'POST',
      url: '/users/load',
    })
    expect(response.statusCode).toBe(401)
  })
  
  it('POST /users/load => should return 403 when permissions are insufficient', async () => {
    app.axios.get = jest.fn().mockResolvedValue({ status: 200, data: [] })
    const response = await app.inject({
      method: 'POST',
      url: '/users/load',
      headers: {
        authorization: `${tokenMock}read`
      }
    })
    expect(response.statusCode).toBe(403)
  })
})