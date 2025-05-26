/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'
import { PostSchema } from '../schemas/notification'
import { defaultResponseSchema } from '../schemas/default-response'

const notification: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const ENTITY_NAME = 'Notifications'
  const { BULLMQ_QUEUE_NAME, EXTERNAL_ENDPOINT } = opts

  fastify.route({
    method: 'POST',
    url: '/posts/published-notification',
    preValidation: fastify.authenticate(['write']),
    handler: async (_req, reply) => {
      const { data: posts } = await fastify.axios.get<PostSchema[]>(`${EXTERNAL_ENDPOINT}/posts`)
      if (!posts || posts.length === 0) {
        throw fastify.customErrorHandler({ statusCode: 400 }, ENTITY_NAME, 'No posts found in the external API.')
      }
      for (const post of posts) {
        await fastify.bullmq.add(BULLMQ_QUEUE_NAME, post)
      }
      reply.code(200).send({ count: posts.length, message: 'Notifications enqueued successfully.', data: 'Ok' })
    },
    errorHandler: (error, _request, reply) => {
      reply.code(Number(error.code)).send({
        message: error.message,
        data: error.code,
        count: 0,
      })
    },
    schema: {
      tags: [ENTITY_NAME],
      summary: 'Simulate publishing posts and enqueue notifications for users.',
      response: {
        200: defaultResponseSchema(
          'Notification process result',
          'Persistence result message for pending notifications',
          'Registered notification count',
        ),
      },
    },
  })
}

export default notification
