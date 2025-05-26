/*
 * Copyright (c) 2025 Bit Solution Group
 */

import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { app, AppOptions, loadRoutes } from '../src/app'
import axiosMock from './plugins/axios.mock'
import bullmqMock from './plugins/bullmq.mock'
import customErrorHandlerMock from './plugins/error-handler.mock'
import jwtAuthMock from './plugins/jwt-auth.mock'
import prismaMock from './plugins/prisma.mock'

const config = (): AppOptions => ({
  TEST_MODE: true,
  EXTERNAL_ENDPOINT: 'https://jsonplaceholder.typicode.com',
  DW_SERVER: 'localhost',
  DW_DATABASE: 'db_test',
  DW_USERNAME: 'bitsolution',
  DW_PASSWORD: 'bitsolution',
  DW_PORT: 5432,
  DW_SCHEMA: 'public',
  DATABASE_URL: 'postgresql://${DW_USERNAME}:${DW_PASSWORD}@${DW_SERVER}:${DW_PORT}/${DW_DATABASE}',
  MAILHOG_HOST: 'localhost',
  MAILHOG_SMTP_PORT: 1025,
  EMAIL_FROM: 'Notification API BitSolution Phase 2 <noreply@bitsoluction_test.com>',
  BULLMQ_QUEUE_NAME: 'postNotification',
  BULLMQ_QUEUE_HOST: 'localhost',
  BULLMQ_QUEUE_PORT: 6379,
  BULLMQ_REDIS_NAME_SPACE: 'redis-phase-2',
  WORKER_NAME: 'workerNotification',
  WORKER_CONCURRENCY_MINUTES: 1,
  JWT_SECRET: 'bitSolutionTest',
})

const build = async () => {
  try {
    const fastify = await app(config())
    await fastify.register(fp(axiosMock()))
    await fastify.register(fp(bullmqMock()))
    await fastify.register(fp(prismaMock()))
    await fastify.register(fp(jwtAuthMock()))
    await fastify.register(fp(customErrorHandlerMock()))

    void loadRoutes(fastify, config())
    return fastify
  } catch (e) {
    console.log('TEST_ERROR => ', e)
    process.exit(1)
  }
}

const closeApp = async (app: FastifyInstance) => {
  if (app) {
    await app.close()
  }
}

export { build, closeApp }
