/*
 * Copyright (c) 2023 Bit Solution Group
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
  const ENTITY_NAME = 'jwt'
  const { JWT_SECRET } = opts

  fastify.register(fastifyJwt, {
    secret: JWT_SECRET,
    sign: { expiresIn: '1h' },
  })

  fastify.decorate('authenticate', (requiredScopes: string[] = []) => {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify()
        const hasAllScopes = requiredScopes.every(scope =>
          request.user.scope?.includes(scope)
        )
  
        if (!hasAllScopes) {
          fastify.customErrorHandler('Insufficient permissions to complete the request.', ENTITY_NAME, '')
          return reply.code(403).send('Insufficient permissions to complete the request.')
        }
      } catch (err) {
        console.log('JMORA[jwtPlugin] => err: ', err)
        console.log('--')
        const { code, message } = fastify.customErrorHandler(err, ENTITY_NAME, '')
        reply.code(code).send(message)
      }
    }
  })
  
}

export default fp(jwtPlugin, {
  name: 'jwt-plugin',
  dependencies: ['error-handler-plugin'],
})