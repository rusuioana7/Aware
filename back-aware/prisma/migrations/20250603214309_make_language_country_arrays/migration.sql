/*
  Warnings:

  - The `country` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "country",
ADD COLUMN     "country" TEXT[],
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[];
