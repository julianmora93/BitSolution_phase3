/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS
const defaultResponseSchema = (
  generalDescription: string,
  messageDescription: string,
  countDescription: string,
  dataDescription?: string,
) =>
  Type.Object(
    {
      message: Type.String({ description: messageDescription }),
      data: Type.Any({ description: dataDescription }),
      count: Type.Number({ description: countDescription }),
      page: Type.Optional(Type.Integer({ minimum: 1 })),
      pageSize: Type.Optional(Type.Integer({ minimum: 1 })),
      totalPages: Type.Optional(Type.Integer()),
    },
    { description: generalDescription },
  )

// TYPES
type DefaultResponseSchema = Static<ReturnType<typeof defaultResponseSchema>>

export { defaultResponseSchema }

export type { DefaultResponseSchema }