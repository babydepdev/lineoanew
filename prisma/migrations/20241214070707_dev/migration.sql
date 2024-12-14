-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LINE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'BOT');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "LineAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelAccessToken" TEXT NOT NULL,
    "channelSecret" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lineAccountId" TEXT,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sender" "SenderType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platform" "Platform" NOT NULL,
    "externalId" TEXT,
    "chatType" TEXT,
    "chatId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "displayName" TEXT NOT NULL,
    "pictureUrl" TEXT,
    "statusMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId","platform")
);

-- CreateTable
CREATE TABLE "WebhookEventLog" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "WebhookEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageQueue" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "status" "QueueStatus" NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "MessageQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LineAccount_channelAccessToken_key" ON "LineAccount"("channelAccessToken");

-- CreateIndex
CREATE INDEX "LineAccount_active_idx" ON "LineAccount"("active");

-- CreateIndex
CREATE INDEX "Conversation_platform_updatedAt_idx" ON "Conversation"("platform", "updatedAt");

-- CreateIndex
CREATE INDEX "Conversation_userId_platform_idx" ON "Conversation"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_userId_platform_channelId_lineAccountId_key" ON "Conversation"("userId", "platform", "channelId", "lineAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_externalId_key" ON "Message"("externalId");

-- CreateIndex
CREATE INDEX "Message_conversationId_timestamp_idx" ON "Message"("conversationId", "timestamp");

-- CreateIndex
CREATE INDEX "Message_platform_timestamp_idx" ON "Message"("platform", "timestamp");

-- CreateIndex
CREATE INDEX "Message_externalId_idx" ON "Message"("externalId");

-- CreateIndex
CREATE INDEX "UserProfile_platform_updatedAt_idx" ON "UserProfile"("platform", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEventLog_eventId_key" ON "WebhookEventLog"("eventId");

-- CreateIndex
CREATE INDEX "WebhookEventLog_platform_createdAt_idx" ON "WebhookEventLog"("platform", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookEventLog_processed_createdAt_idx" ON "WebhookEventLog"("processed", "createdAt");

-- CreateIndex
CREATE INDEX "MessageQueue_status_scheduledFor_idx" ON "MessageQueue"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "MessageQueue_platform_status_idx" ON "MessageQueue"("platform", "status");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_lineAccountId_fkey" FOREIGN KEY ("lineAccountId") REFERENCES "LineAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
