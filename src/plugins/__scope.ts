// /*
//  * Copyright (c) 2023 Bit Solution Group
//  */

// import fp from'fastify-plugin'
// import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
// import { AppOptions } from '../app'

// declare module 'fastify' {
//   interface FastifyInstance {
//     scope: (requiredScopes: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>
//   }
// }

// declare module '@fastify/jwt' {
//   interface FastifyJWT {
//     user: {
//       scope: string[]
//       [key: string]: any
//     }
//   }
// }

// const scopePlugin: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
//   fastify.decorate('scope', (requiredScopes: string[] = []) => {
//     return async function (request: FastifyRequest, reply: FastifyReply) {
//       try {
//         await request.jwtVerify()
//         const hasAllScopes = requiredScopes.every(scope =>
//           request.user.scope.includes(scope)
//         )
  
//         if (!hasAllScopes) {
//           return reply.code(403).send({
//             error: 'Insufficient permissions to complete the request.',
//           })
//         }
//       } catch (err) {
//         const { code, message } = fastify.customErrorHandler(err, 'Scope', '')
//         reply.code(code).send({ error: message })
//       }
//     }
//   })
// }

// export default fp(scopePlugin, {
//   name: 'scope-plugin',
//   dependencies: ['error-handler-plugin'],
// })