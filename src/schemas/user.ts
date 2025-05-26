/*
 * Copyright (c) 2025 Bit Solution Group
 */

import { Static, Type } from '@sinclair/typebox'

// SCHEMAS
const userLoadSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    username: Type.String(),
    email: Type.String(),
    address: Type.Object({
      street: Type.String(),
      suite: Type.String(),
      city: Type.String(),
      zipcode: Type.String(),
      geo: Type.Object({
        lat: Type.String(),
        lng: Type.String(),
      }),
    }),
    phone: Type.String(),
    website: Type.String(),
    company: Type.Object({
      name: Type.String(),
      catchPhrase: Type.String(),
      bs: Type.String(),
    }),
  },
  { description: 'User data from external API' },
)

const userQueryStringSchema = Type.Object(
  {
    name: Type.Optional(Type.String({ minLength: 1, description: 'Filter by name' })),
    username: Type.Optional(Type.String({ minLength: 1, description: 'Filter by username' })),
    email: Type.Optional(Type.String({ minLength: 1, description: 'Filter by email' })),
    phone: Type.Optional(Type.String({ minLength: 1, description: 'Filter by phone' })),
    website: Type.Optional(Type.String({ minLength: 1, description: 'Filter by website' })),
    page: Type.Optional(Type.String({ minLength: 1, description: 'Page' })),
    pageSize: Type.Optional(Type.String({ minLength: 1, description: 'Page size' })),
  },
  { description: 'User search parameters' },
)

const userBodyTokenSchema = Type.Object(
  {
    userId: Type.Number({ description: 'User ID' }),
    userName: Type.String({ minLength: 1, description: 'User Name' }),
    scope: Type.String({ minLength: 1, description: 'Scope of access, example: \"read write\"' }),
  },
  { description: 'User information required for token generation' },
)

// TYPES
type UserLoadSchema = Static<typeof userLoadSchema>
type UserBodyTokenSchema = Static<typeof userBodyTokenSchema>
type UserQueryStringSchema = Static<typeof userQueryStringSchema>

export { userLoadSchema, userQueryStringSchema, userBodyTokenSchema }

export type { UserLoadSchema, UserBodyTokenSchema, UserQueryStringSchema }