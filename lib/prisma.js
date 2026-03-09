import { PrismaClient } from '../prisma/generated-client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const globalForPrisma = globalThis

const prisma = prismaClientSingleton()

export default prisma

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
