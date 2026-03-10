import { getCloudflareContext } from '@opennextjs/cloudflare'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

type D1Binding = ConstructorParameters<typeof PrismaD1>[0]

type RequestContextEnv = {
  DB?: D1Binding
}

export async function getDb() {
  const context = await getCloudflareContext({ async: true })
  const database = (context.env as RequestContextEnv).DB

  if (!database) {
    throw new Error('Missing Cloudflare D1 binding: DB')
  }

  return new PrismaClient({
    adapter: new PrismaD1(database),
  })
}