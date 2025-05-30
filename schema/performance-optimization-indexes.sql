-- Performance Optimization Indexes
-- This file contains additional indexes to improve query performance for the hospital survey application
-- Execute this file in your Supabase SQL editor to add these indexes

-- Index for Location.locationType - critical for filtering departments/wards
CREATE INDEX IF NOT EXISTS "idx_location_locationtype" ON "Location" ("locationType");

-- Compound index for SubmissionLocation to improve joins
CREATE INDEX IF NOT EXISTS "idx_submissionlocation_both_ids" ON "SubmissionLocation" ("locationId", "submissionId");

-- Indexes for SurveySubmission to improve sorting and filtering
CREATE INDEX IF NOT EXISTS "idx_surveysubmission_submittedat" ON "SurveySubmission" ("submittedAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_surveysubmission_recommendation" ON "SurveySubmission" ("recommendation") 
  WHERE "recommendation" IS NOT NULL AND "recommendation" != '';
CREATE INDEX IF NOT EXISTS "idx_surveysubmission_wouldrecommend" ON "SurveySubmission" ("wouldRecommend");
CREATE INDEX IF NOT EXISTS "idx_surveysubmission_visitpurpose" ON "SurveySubmission" ("visitPurpose");
CREATE INDEX IF NOT EXISTS "idx_surveysubmission_patienttype" ON "SurveySubmission" ("patientType");
CREATE INDEX IF NOT EXISTS "idx_surveysubmission_usertype" ON "SurveySubmission" ("userType");

-- Compound index for DepartmentConcern
CREATE INDEX IF NOT EXISTS "idx_departmentconcern_both_ids" ON "DepartmentConcern" ("locationId", "submissionId");

-- Index for Rating to improve filtering by rating types
CREATE INDEX IF NOT EXISTS "idx_rating_overall" ON "Rating" ("overall");

-- Create a partial index for non-empty recommendations to speed up recommendation queries
CREATE INDEX IF NOT EXISTS "idx_nonempty_recommendations" ON "SurveySubmission" ("submittedAt" DESC) 
  WHERE "recommendation" IS NOT NULL AND "recommendation" != '';

-- Create a combined index for visit times to speed up time-based analysis
CREATE INDEX IF NOT EXISTS "idx_surveysubmission_visittime" ON "SurveySubmission" ("visitTime", "submittedAt");

-- Create a composite index for wards & recommendations query
CREATE INDEX IF NOT EXISTS "idx_rating_locationid_overall" ON "Rating" ("locationId", "overall");

-- Add explain note for database administrators
COMMENT ON INDEX "idx_location_locationtype" IS 'Added to speed up queries that filter by department/ward type';
COMMENT ON INDEX "idx_surveysubmission_submittedat" IS 'Added to speed up sorting by submission date';
COMMENT ON INDEX "idx_nonempty_recommendations" IS 'Added to speed up queries for recommendations'; 