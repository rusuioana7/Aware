/*
  Warnings:

  - You are about to drop the column `profileCompleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileCompleted",
ADD COLUMN     "bannerPhoto" TEXT,
ADD COLUMN     "profilePhoto" TEXT;
