-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LINE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'BOT');

-- CreateTable
CREATE TABLE "LineChannel" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lineChannelId" TEXT,

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

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "lineChannelId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "pictureUrl" TEXT,
    "statusMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LineChannel_channelId_key" ON "LineChannel"("channelId");

-- CreateIndex
CREATE INDEX "LineChannel_name_idx" ON "LineChannel"("name");

-- CreateIndex
CREATE INDEX "LineChannel_channelId_idx" ON "LineChannel"("channelId");

-- CreateIndex
CREATE INDEX "Conversation_lineChannelId_idx" ON "Conversation"("lineChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_externalId_key" ON "Message"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_platform_lineChannelId_key" ON "UserProfile"("userId", "platform", "lineChannelId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_lineChannelId_fkey" FOREIGN KEY ("lineChannelId") REFERENCES "LineChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_lineChannelId_fkey" FOREIGN KEY ("lineChannelId") REFERENCES "LineChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
