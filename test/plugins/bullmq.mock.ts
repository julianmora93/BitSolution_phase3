import { FastifyPluginCallback } from 'fastify'
import { addToQueueMock } from '../utils/data.mock'

const bullmqMock = (): FastifyPluginCallback => (fastify, _opts, next) => {
  const functions = {
    add: addToQueueMock
  }
  fastify.decorate('bullmq', functions as any)
  next()
}

export default bullmqMock