-- =============================================
-- Add location-specific recommendation to Rating table
-- =============================================

-- Add wouldRecommend column to Rating table
ALTER TABLE "Rating"
ADD COLUMN IF NOT EXISTS "wouldRecommend" BOOLEAN;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_rating_would_recommend ON "Rating"("wouldRecommend");

-- Add comment to explain the column
COMMENT ON COLUMN "Rating"."wouldRecommend" IS 'Whether the user would recommend this specific location/department/ward to others';
