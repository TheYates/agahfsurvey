-- Add npsFeedback column to Rating table
ALTER TABLE "Rating"
ADD COLUMN "npsFeedback" TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN "Rating"."npsFeedback" IS 'Follow-up feedback based on NPS rating: What enjoyed most (9-10), What would make rate higher (7-8), How to make things right (0-6)';
