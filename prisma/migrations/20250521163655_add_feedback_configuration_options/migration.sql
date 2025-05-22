-- AlterTable
ALTER TABLE "ServicePoints" ADD COLUMN     "show_comments_box" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_recommend_question" BOOLEAN NOT NULL DEFAULT true;
