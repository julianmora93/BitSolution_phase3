/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { build } from '../helper'
import { FastifyInstance } from 'fastify'
import { tokenMock, addToQueueMock } from '../utils/data.mock'

describe('Notification Routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
  })

  afterAll(async () => {
    if (app) await app.close()
  })

  it('POST /posts/published-notification => should return 200 as the request conditions are satisfied', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/posts/published-notification',
      headers: {
        authorization: `${tokenMock}write read`
      }
    })
    const { count } = JSON.parse(response.body)
    expect(response.statusCode).toBe(200)
    expect(count).toBe(2)
    expect(addToQueueMock).toHaveBeenCalled()
  })

  it('POST /posts/published-notification => should return 400 if the Axios response is empty', async () => {
    app.axios.get = jest.fn().mockResolvedValue({ status: 200, data: [] })
    const response = await app.inject({
      method: 'POST',
      url: '/posts/published-notification',
      headers: {
        authorization: `${tokenMock}write read`
      }
    })
    const { count } = JSON.parse(response.body)
    expect(response.statusCode).toBe(400)
    expect(count).toEqual(0)
  })

  it('POST /posts/published-notification => should return 401 without token', async () => {

    const response = await app.inject({
      method: 'POST',
      url: '/posts/published-notification',
    })

    expect(response.statusCode).toBe(401)
  })

  it('POST /posts/published-notification => should return 403 when permissions are insufficient', async () => {

    const response = await app.inject({
      method: 'POST',
      url: '/posts/published-notification',
      headers: {
        authorization: `${tokenMock}read`
      }
    })

    expect(response.statusCode).toBe(403)
  })

})