-- =============================================
-- Backfill Rating.wouldRecommend from SurveySubmission.wouldRecommend
-- =============================================
-- This migration updates all existing Rating records to use the
-- wouldRecommend value from their parent SurveySubmission.
-- 
-- The final page of the survey asks "Would you recommend this hospital to others?"
-- This value should be applied to all location ratings for that submission.
-- =============================================

UPDATE "Rating" r
SET "wouldRecommend" = s."wouldRecommend"
FROM "SurveySubmission" s
WHERE r."submissionId" = s."id"
  AND s."wouldRecommend" IS NOT NULL;
