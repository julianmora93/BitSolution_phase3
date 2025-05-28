/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { UserBodyTokenSchema, userBodyTokenSchema, UserQueryStringSchema, userQueryStringSchema } from '../schemas/user'
import { upsertManyUsers, findUsers } from '../repositories/users'
import { defaultResponseSchema } from '../schemas/default-response'
import { UserLoadSchema } from '../schemas/user'

const user: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const ENTITY_NAME = 'Users'
  const { EXTERNAL_ENDPOINT } = opts

  fastify.route({
    method: 'POST',
    url: '/users/load',
    preValidation: fastify.authenticate(['write']),
    handler: async (_req, reply) => {
      const { data: users } = await fastify.axios.get<UserLoadSchema[]>(`${EXTERNAL_ENDPOINT}/users`)
      if (users?.length === 0) {
        fastify.customErrorHandler(
          { statusCode: 400, message: 'No users found in the external API.' },
          ENTITY_NAME,
          reply,
        )
      }
      await upsertManyUsers(
        fastify.prisma,
        users.map((u) => ({
          id: u.id,
          name: u.name,
          username: u.username,
          email: `user_bitsolution_test_${u.id}@yopmail.com`,
          phone: u.phone,
          website: u.website,
          address: u.address,
          company: u.company,
        })),
      )
      reply.send({ count: users.length, message: 'Users loaded successfully.', data: users })
    },
    errorHandler: (error, _request, reply) => fastify.customErrorHandler(error, ENTITY_NAME, reply),
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Loads users from an external API and saves them to the database.',
      response: {
        200: defaultResponseSchema('Load process result', 'Load process result message', 'Number of users loaded'),
      },
    },
  })

  fastify.route({
    method: 'GET',
    url: '/users',
    preValidation: fastify.authenticate(['read']),
    handler: async (req, reply) => {
      const queryParams = req.query as UserQueryStringSchema
      if (queryParams.page === '0' || queryParams.pageSize === '0') {
        fastify.customErrorHandler({ statusCode: 400, message: 'Body resquest error' }, ENTITY_NAME, reply)
      }
      const pageParam = Number(queryParams.page) || 1
      const pageSizeParam = Number(queryParams.pageSize) || 10
      const { users, count, page, pageSize, totalPages } = await findUsers(fastify.prisma, {
        ...queryParams,
        page: pageParam,
        pageSize: pageSizeParam,
      })
      reply.send({
        message: 'User query completed successfully.',
        data: users,
        count: count,
        page,
        pageSize,
        totalPages,
      })
    },
    errorHandler: (error, _request, reply) => fastify.customErrorHandler(error, ENTITY_NAME, reply),
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Retrieves the list of users stored in the database.',
      querystring: userQueryStringSchema,
      response: {
        200: defaultResponseSchema('Return list of Users', 'List of users', 'Number of users'),
      },
    },
  })

  fastify.route({
    method: 'POST',
    url: '/token',
    handler: async (request, reply) => {
      const { userId, userName, scope } = request.body as UserBodyTokenSchema
      if (userId == 0 || userName === '' || scope === '') {
        fastify.customErrorHandler({ statusCode: 400, message: 'Body resquest error' }, ENTITY_NAME, reply)
      }
      const token = fastify.jwt.sign({
        sub: userId,
        scope,
      })
      reply.send({ count: 1, message: `Token generated successfully. User ${userName}`, data: token })
    },
    errorHandler: (error, _request, reply) => {
      fastify.customErrorHandler(error, ENTITY_NAME, reply)
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Generates a JWT token for a given user ID and scope.',
      body: userBodyTokenSchema,
      response: {
        200: defaultResponseSchema('Return list of Users', 'List of users', 'Number of users'),
      },
    },
  })
}

export default user
