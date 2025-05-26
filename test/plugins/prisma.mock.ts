/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { FastifyPluginCallback } from 'fastify'

const prismaMock = (): FastifyPluginCallback => (fastify, _opts, next) => {
  const functions = {
    findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Usuario de prueba' }]),
    findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'Usuario de prueba' }),
  }
  fastify.decorate('prisma', functions as any)
  next()
}

export default prismaMock
