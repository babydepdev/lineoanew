/*
  Warnings:

  - A unique constraint covering the columns `[userId,platform,channelId,lineAccountId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "botId" TEXT,
ADD COLUMN     "chatId" TEXT,
ADD COLUMN     "chatType" TEXT;

-- CreateIndex
CREATE INDEX "Conversation_platform_updatedAt_idx" ON "Conversation"("platform", "updatedAt");

-- CreateIndex
CREATE INDEX "Conversation_userId_platform_idx" ON "Conversation"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_userId_platform_channelId_lineAccountId_key" ON "Conversation"("userId", "platform", "channelId", "lineAccountId");

-- CreateIndex
CREATE INDEX "LineAccount_active_idx" ON "LineAccount"("active");

-- CreateIndex
CREATE INDEX "Message_conversationId_timestamp_idx" ON "Message"("conversationId", "timestamp");

-- CreateIndex
CREATE INDEX "Message_platform_timestamp_idx" ON "Message"("platform", "timestamp");

-- CreateIndex
CREATE INDEX "Message_externalId_idx" ON "Message"("externalId");

-- CreateIndex
CREATE INDEX "Message_botId_idx" ON "Message"("botId");

-- CreateIndex
CREATE INDEX "UserProfile_platform_updatedAt_idx" ON "UserProfile"("platform", "updatedAt");
