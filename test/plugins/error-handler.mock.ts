import { FastifyPluginCallback } from 'fastify'

const customErrorHandlerMock = (): FastifyPluginCallback => (fastify, _opts, next) => {
  const errorHandler = (err: any, entity: string, defaultMessage: string) => ({ code: err.statusCode, message: `TestError => Entity: ${entity} - message: ${defaultMessage}` })
  
  fastify.decorate('customErrorHandler', errorHandler as any)
  next()
}

export default customErrorHandlerMock