/*
 * Copyright (c) 2023 Bit Solution Group
 */
 
import { join } from 'path'
import { config, Env } from './config'
import fastify, { FastifyInstance } from 'fastify'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'

export type AppOptions = {
  TEST_MODE: boolean
} & Partial<AutoloadPluginOptions> &
  Env

export const app = async (opts: AppOptions = { ...config, TEST_MODE: false }): Promise<FastifyInstance> => {
  const { TEST_MODE } = opts

  const app = fastify({ logger: false })

  void app.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })

  if (TEST_MODE) return app

  app.swagger

  loadRoutes(app, opts)

  return app
}

export const loadRoutes = (app: FastifyInstance, opts: AppOptions): void =>
  void app.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  })