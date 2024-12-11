import { PrismaClient } from '@prisma/client';
import { LineAccountUpdateParams, LineAccountResult } from './types';
import { LineAccount } from '@/app/types/line';
import LineClientManager from '../client';

const prisma = new PrismaClient();

export async function updateLineAccount(
  id: string,
  params: LineAccountUpdateParams
): Promise<LineAccountResult> {
  try {
    const account = await prisma.lineAccount.update({
      where: { id },
      data: params,
      select: {
        id: true,
        name: true,
        channelSecret: true,
        channelAccessToken: true,
        active: true
      }
    });

    // Clear cached client if credentials were updated
    if (params.channelAccessToken || params.channelSecret) {
      LineClientManager.removeClient(id);
    }

    return {
      success: true,
      account: account as LineAccount
    };
  } catch (error) {
    console.error('Error updating LINE account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update LINE account'
    };
  }
}