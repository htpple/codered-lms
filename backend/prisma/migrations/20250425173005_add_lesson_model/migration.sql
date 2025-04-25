/*
  Warnings:

  - You are about to drop the `_LessonToSubject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledAt` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LessonToSubject" DROP CONSTRAINT "_LessonToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_LessonToSubject" DROP CONSTRAINT "_LessonToSubject_B_fkey";

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "scheduledAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subjectId" INTEGER NOT NULL,
ADD COLUMN     "topic" TEXT;

-- DropTable
DROP TABLE "_LessonToSubject";

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
