/*
 * Copyright (c) 2025 Bit Solution Group
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
        fastify.customErrorHandler(
          { statusCode: 400, message: 'No posts found in the external API.' },
          ENTITY_NAME,
          reply,
        )
      }
      for (const post of posts) {
        await fastify.bullmq.add(BULLMQ_QUEUE_NAME, post)
      }
      reply.code(200).send({ count: posts.length, message: 'Notifications enqueued successfully.', data: 'Ok' })
    },
    errorHandler: (error, _request, reply) => fastify.customErrorHandler(error, ENTITY_NAME, reply),
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
