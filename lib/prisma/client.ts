import { PrismaClient, Prisma } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: ['error', 'warn'],
  errorFormat: 'pretty' as const
};

// Create a new PrismaClient instance or reuse existing one
const prismaClient = global.prisma || new PrismaClient(prismaClientOptions);

// Save reference in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export const prisma = prismaClient;