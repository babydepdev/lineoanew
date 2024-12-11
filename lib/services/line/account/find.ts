import { PrismaClient } from '@prisma/client';
import { LineAccount } from '@/app/types/line';

const prisma = new PrismaClient();

export async function getActiveLineAccounts(): Promise<LineAccount[]> {
  const accounts = await prisma.lineAccount.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      channelSecret: true,
      channelAccessToken: true,
      active: true
    }
  });

  return accounts as LineAccount[];
}

export async function findLineAccountById(id: string): Promise<LineAccount | null> {
  const account = await prisma.lineAccount.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      channelSecret: true,
      channelAccessToken: true,
      active: true
    }
  });

  return account as LineAccount | null;
}