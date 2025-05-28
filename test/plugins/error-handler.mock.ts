/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { FastifyPluginCallback, FastifyReply } from 'fastify'

const customErrorHandlerMock = (): FastifyPluginCallback => (fastify, _opts, next) => {
  const errorHandler = (err: any, entity = '', reply: FastifyReply): void => {
    const code = err?.statusCode || 422
    const message = `TestError => Entity: ${entity} - message: ${err?.message || 'default message'}`

    // Simula comportamiento real
    reply.code(code).send({
      message,
      data: code,
      count: 0,
    })
  }

  fastify.decorate('customErrorHandler', errorHandler)
  next()
}

export default customErrorHandlerMock
