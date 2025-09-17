/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Tag_name_key";

-- AlterTable
ALTER TABLE "public"."Tag" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_userId_key" ON "public"."Tag"("name", "userId");

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
