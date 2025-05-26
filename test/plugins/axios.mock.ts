/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { FastifyPluginCallback } from 'fastify'
import { dataUsersMock } from '../utils/data.mock'

const axiosMock = (): FastifyPluginCallback => (fastify, _opts, next) => {
  const axiosFn = {
    get: async (_url: string) => ({ status: 200, data: dataUsersMock.users }),
  }
  fastify.decorate('axios', axiosFn as any)
  next()
}

export default axiosMock
