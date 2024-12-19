import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

interface UpdateProfileParams {
  userId: string;
  platform: 'LINE';
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export async function updateUserProfile(params: UpdateProfileParams) {
  const { userId, platform, ...profileData } = params;

  return prisma.userProfile.upsert({
    where: {
      userId_platform: { userId, platform }
    },
    create: {
      userId,
      platform,
      ...profileData
    },
    update: {
      ...profileData,
      updatedAt: new Date()
    }
  });
}