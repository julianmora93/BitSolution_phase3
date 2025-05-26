/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { FastifyPluginCallback } from 'fastify'
import { addToQueueMock } from '../utils/data.mock'

const bullmqMock = (): FastifyPluginCallback => (fastify, _opts, next) => {
  const functions = {
    add: addToQueueMock,
  }
  fastify.decorate('bullmq', functions as any)
  next()
}

export default bullmqMock
