/*
 * Copyright (c) 2023 Bit Solution Group
 */

import fp from 'fastify-plugin'
import axios, { AxiosInstance } from 'axios'
import { AppOptions } from '../app'
import { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    axios: AxiosInstance
    handleAxiosError: (err: any) => { code: number; message: any }
  }
}

const axiosPlugin: FastifyPluginAsync<AppOptions> = async (fastify, opts) => {
  const { TEST_MODE } = opts

  if (TEST_MODE) return

  const axiosErrorChecker = (err: any) => {
    console.log(err)
    let code = 422
    let message = err.message

    if (axios.isAxiosError(err)) {
      code = err.response?.status || code
      message = err.response?.data
    }

    return { code, message }
  }

  fastify.decorate('axios', axios)
  fastify.decorate('handleAxiosError', axiosErrorChecker)
}

export default fp(axiosPlugin, {
  name: 'axios-plugin',
})