-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recentViews" TEXT[] DEFAULT ARRAY[]::TEXT[];
