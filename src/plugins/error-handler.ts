/*
 * Copyright (c) 2025 Bit Solution Group
 */

import axios from 'axios'
import fp from 'fastify-plugin'
import { FastifyPluginAsync, FastifyReply } from 'fastify'
import { Prisma } from '@prisma/client'
import { AppOptions } from '../app'

declare module 'fastify' {
  export interface FastifyInstance {
    customErrorHandler(err: any, entity: string, reply: FastifyReply): void
  }
}

const customErrorHandler: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
  const { TEST_MODE } = opts

  if (TEST_MODE) return

  const customHandler = (err: any, entity = '', reply: FastifyReply): void => {
    let code = err?.statusCode || 422
    let message = err?.message || 'Unprocessable entity'
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          const meta = err.meta as { target: unknown[] }
          code = 409
          message = `Already exist a ${entity} with this: ${meta.target.join(', ')}`
          break
        case 'P2025':
          code = 404
          message = `${entity} not found`
          break
        case 'P2010':
          code = 422
          message = `Could not resolve the data from data source. Please check your criteria and retry`
          break
      }
    } else if (axios.isAxiosError(err)) {
      code = err.response?.status
      message = err.response?.data
    }
    console.log('customErrorHandler => ', {
      code,
      message,
      error: err,
    })
    reply.code(code).send({
      message,
      data: code,
      count: 0,
    })
  }

  fastify.decorate('customErrorHandler', customHandler)
}

export default fp(customErrorHandler, {
  name: 'error-handler-plugin',
})

