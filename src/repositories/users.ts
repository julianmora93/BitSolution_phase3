/*
 * Copyright (c) 2023 Bit Solution Group
 */

import { Prisma, PrismaClient } from '@prisma/client'
// import { Sql } from '@prisma/client/runtime'

const upsertManyUsers = async (prisma: PrismaClient, users: any[]) => {
  const values = users.map(
    (u) =>
      Prisma.sql`(
        ${u.id}, 
        ${u.name}, 
        ${u.username}, 
        ${u.email}, 
        ${u.phone}, 
        ${u.website}, 
        ${Prisma.sql`CAST(
          ${JSON.stringify(u.address)} AS jsonb)`}, 
        ${Prisma.sql`CAST(
          ${JSON.stringify(u.company)} AS jsonb)`})`,
  )
  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO users
        (id, name, username, email, phone, website, address, company)
      VALUES
        ${Prisma.join(values)}
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        website = EXCLUDED.website,
        address = EXCLUDED.address,
        company = EXCLUDED.company
    `,
  )
}

const findUsers = async (
  prisma: PrismaClient,
  filters: {
    name?: string
    username?: string
    email?: string
    phone?: string
    website?: string
    page?: number
    pageSize?: number
  },
) => {
  const { page = 1, pageSize = 10 } = filters
  const offset = (page - 1) * pageSize

  const dynamicWhere: any = {}
  if (filters.name) dynamicWhere.name = { contains: filters.name, mode: 'insensitive' }
  if (filters.username) dynamicWhere.username = { contains: filters.username, mode: 'insensitive' }
  if (filters.email) dynamicWhere.email = { contains: filters.email, mode: 'insensitive' }
  if (filters.phone) dynamicWhere.phone = { contains: filters.phone, mode: 'insensitive' }
  if (filters.website) dynamicWhere.website = { contains: filters.website, mode: 'insensitive' }

  const users = await prisma.user.findMany({
    where: dynamicWhere,
    skip: offset,
    take: pageSize,
  })

  const count = await prisma.user.count({
    where: dynamicWhere,
  })

  return {
    users,
    count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  }
}

const getUserById = async (prisma: PrismaClient, id: number) => {
  const user = await prisma.$queryRaw<any>(
    Prisma.sql`SELECT 
        id, 
        name, 
        username, 
        email, 
        phone, 
        website, 
        address, 
        company 
      FROM users WHERE id = ${id} LIMIT 1`,
  )
  if (user && user.length === 0) return null
  return user[0]
}

export { upsertManyUsers, findUsers, getUserById }