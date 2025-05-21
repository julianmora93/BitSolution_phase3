// /*
//  * Copyright (c) 2023 Bit Solution Group
//  */

// import fp from'fastify-plugin'
// import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
// import { AppOptions } from '../app'
// import { fastifyJwt } from '@fastify/jwt';

// declare module 'fastify' {
//   interface FastifyInstance {
//     authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//   }
// }

// const jwtPlugin: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
//   const { JWT_SECRET } = opts

//   fastify.register(fastifyJwt, {
//     secret: JWT_SECRET,
//     sign: { expiresIn: '1h' },
//   });

//   fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
//     try {
//       await request.jwtVerify();
//     } catch (err) {
//       const { code, message } = fastify.customErrorHandler(err, 'Authenticate', '')
//       reply.code(code).send({ error: message });
//     }
//   });
// };

// export default fp(jwtPlugin, {
//   name: 'jwt-plugin',
//   dependencies: ['error-handler-plugin'],
// })