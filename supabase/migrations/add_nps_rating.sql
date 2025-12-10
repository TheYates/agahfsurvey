-- Add npsRating column to Rating table
ALTER TABLE "Rating"
ADD COLUMN "npsRating" INTEGER;

-- Add comment to describe the column
COMMENT ON COLUMN "Rating"."npsRating" IS 'Net Promoter Score rating (0-10 scale)';

-- Add check constraint to ensure npsRating is between 0 and 10
ALTER TABLE "Rating"
ADD CONSTRAINT "check_nps_rating_range"
CHECK ("npsRating" IS NULL OR ("npsRating" >= 0 AND "npsRating" <= 10));
