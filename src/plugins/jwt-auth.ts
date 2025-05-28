/*
 * Copyright (c) 2025 Bit Solution Group
 */

import fp from'fastify-plugin'
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { AppOptions } from '../app'
import { fastifyJwt } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (requiredScopes?: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      scope?: string
      [key: string]: any
    }
  }
}

const jwtPlugin: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
  const { TEST_MODE, JWT_SECRET } = opts

  if (TEST_MODE) return

  const ENTITY_NAME = 'jwt'

  fastify.register(fastifyJwt, {
    secret: JWT_SECRET,
    sign: { expiresIn: '1h' },
  })

  fastify.decorate('authenticate', (requiredScopes: string[] = []) => {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
        const hasAllScopes = requiredScopes.every((scope) => request.user.scope?.includes(scope))

        if (!hasAllScopes) {
          fastify.customErrorHandler(
            { statusCode: 403, message: 'Insufficient permissions to complete the request.' },
            ENTITY_NAME,
            reply,
          )
        }
      } catch (err: any) {
        fastify.customErrorHandler(err, ENTITY_NAME, reply)
      }
    }
  })
  
}

export default fp(jwtPlugin, {
  name: 'jwt-plugin',
  dependencies: ['error-handler-plugin'],
})