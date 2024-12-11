/*
  Warnings:

  - You are about to drop the column `channelSecret` on the `LineChannel` table. All the data in the column will be lost.
  - The primary key for the `UserProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,platform,lineChannelId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `LineChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secret` to the `LineChannel` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `UserProfile` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `lineChannelId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "lineChannelId" TEXT;

-- AlterTable
ALTER TABLE "LineChannel" DROP COLUMN "channelSecret",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "secret" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "lineChannelId" TEXT NOT NULL,
ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Conversation_lineChannelId_idx" ON "Conversation"("lineChannelId");

-- CreateIndex
CREATE INDEX "LineChannel_name_idx" ON "LineChannel"("name");

-- CreateIndex
CREATE INDEX "LineChannel_channelId_idx" ON "LineChannel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_platform_lineChannelId_key" ON "UserProfile"("userId", "platform", "lineChannelId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_lineChannelId_fkey" FOREIGN KEY ("lineChannelId") REFERENCES "LineChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_lineChannelId_fkey" FOREIGN KEY ("lineChannelId") REFERENCES "LineChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
