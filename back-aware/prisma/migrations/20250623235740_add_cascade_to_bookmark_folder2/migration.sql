-- DropForeignKey
ALTER TABLE "BookmarkFolder" DROP CONSTRAINT "BookmarkFolder_parentId_fkey";

-- AddForeignKey
ALTER TABLE "BookmarkFolder" ADD CONSTRAINT "BookmarkFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BookmarkFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
