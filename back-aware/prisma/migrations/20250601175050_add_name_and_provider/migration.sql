-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
