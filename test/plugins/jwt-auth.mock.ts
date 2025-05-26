/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { FastifyPluginCallback } from 'fastify'
import { tokenMock } from '../utils/data.mock'

const jwtAuthMock = (): FastifyPluginCallback => (fastify, _opts, next) => {
  const jwt = {
    sign: (payload: any) => {
      const { scope } = payload
      return tokenMock + scope
    },
  }
  const auth =
    (requiredScopes = []) =>
    (request: any, reply: any, done: any) => {
      if (!request.headers.authorization) {
        reply.code(401).send({ message: 'Unauthorized' })
        return
      }

      request.headers.authorization.replace(tokenMock, '')

      const hasScope = requiredScopes.every((scope) => request.headers.authorization.includes(scope))
      if (!hasScope) {
        reply.code(403).send({ message: 'Insufficient permissions to complete the request.' })
        return
      }
      done && done()
    }
  fastify.decorate('jwt', jwt as any)
  fastify.decorate('authenticate', auth as any)
  next()
}

export default jwtAuthMock
