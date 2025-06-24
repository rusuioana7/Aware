-- CreateTable
CREATE TABLE "ThreadFollow" (
    "userId" INTEGER NOT NULL,
    "threadId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThreadFollow_pkey" PRIMARY KEY ("userId","threadId")
);

-- AddForeignKey
ALTER TABLE "ThreadFollow" ADD CONSTRAINT "ThreadFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
