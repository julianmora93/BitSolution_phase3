/*
 * Copyright (c) 2023 Bit Solution Group
 */

import fp from 'fastify-plugin'
import { AppOptions } from '../app'
import swagger from '@fastify/swagger'
import { FastifyPluginAsync } from 'fastify'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { name, description, version } from '../../package.json'

const swaggerPlugin: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
  const { TEST_MODE } = opts

  if (TEST_MODE) return

  fastify.register(swagger, {
    swagger: {
      info: { title: name, description, version },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [{ name, description }],
    },
  })
  fastify.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
    initOAuth: {},
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
  })
}

export default fp(swaggerPlugin, {
  name: 'swagger-plugin',
})