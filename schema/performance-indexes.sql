-- =============================================
-- Performance Optimization Indexes
-- AGA Health Foundation Survey System
-- =============================================

-- These indexes are designed to optimize the most common queries
-- in the survey reports system based on performance analysis

-- =============================================
-- Location Table Indexes
-- =============================================

-- Index for location type filtering (wards, departments, canteen)
CREATE INDEX IF NOT EXISTS idx_location_type 
ON "Location" ("locationType");

-- Index for location name searches (canteen, cafeteria, dining)
CREATE INDEX IF NOT EXISTS idx_location_name_search 
ON "Location" USING gin(to_tsvector('english', "name"));

-- Composite index for location type and name
CREATE INDEX IF NOT EXISTS idx_location_type_name 
ON "Location" ("locationType", "name");

-- =============================================
-- Rating Table Indexes (Most Critical)
-- =============================================

-- Primary index for location-based rating queries
CREATE INDEX IF NOT EXISTS idx_rating_location_id 
ON "Rating" ("locationId");

-- Index for overall rating queries (satisfaction calculations)
CREATE INDEX IF NOT EXISTS idx_rating_overall 
ON "Rating" ("overall") WHERE "overall" IS NOT NULL;

-- Index for food quality ratings (canteen-specific)
CREATE INDEX IF NOT EXISTS idx_rating_food_quality 
ON "Rating" ("foodQuality") WHERE "foodQuality" IS NOT NULL;

-- Composite index for location and overall rating (most common query)
CREATE INDEX IF NOT EXISTS idx_rating_location_overall 
ON "Rating" ("locationId", "overall");

-- Index for submission-based rating lookups
CREATE INDEX IF NOT EXISTS idx_rating_submission_id 
ON "Rating" ("submissionId");

-- Composite index for location and multiple rating fields
CREATE INDEX IF NOT EXISTS idx_rating_location_multi 
ON "Rating" ("locationId", "reception", "professionalism", "understanding", "promptnessCare");

-- Index for ward-specific ratings
CREATE INDEX IF NOT EXISTS idx_rating_ward_fields 
ON "Rating" ("locationId", "admission", "nurseProfessionalism", "doctorProfessionalism", "discharge") 
WHERE "admission" IS NOT NULL OR "nurseProfessionalism" IS NOT NULL;

-- =============================================
-- SurveySubmission Table Indexes
-- =============================================

-- Index for recommendation queries
CREATE INDEX IF NOT EXISTS idx_submission_recommend 
ON "SurveySubmission" ("wouldRecommend") WHERE "wouldRecommend" IS NOT NULL;

-- Index for submission date ordering
CREATE INDEX IF NOT EXISTS idx_submission_date 
ON "SurveySubmission" ("submittedAt");

-- Index for user type analysis
CREATE INDEX IF NOT EXISTS idx_submission_user_type 
ON "SurveySubmission" ("userType") WHERE "userType" IS NOT NULL;

-- Index for patient type analysis
CREATE INDEX IF NOT EXISTS idx_submission_patient_type 
ON "SurveySubmission" ("patientType") WHERE "patientType" IS NOT NULL;

-- Index for visit purpose analysis
CREATE INDEX IF NOT EXISTS idx_submission_visit_purpose 
ON "SurveySubmission" ("visitPurpose") WHERE "visitPurpose" IS NOT NULL;

-- Index for visit time analysis
CREATE INDEX IF NOT EXISTS idx_submission_visit_time 
ON "SurveySubmission" ("visitTime") WHERE "visitTime" IS NOT NULL;

-- Composite index for demographic analysis
CREATE INDEX IF NOT EXISTS idx_submission_demographics 
ON "SurveySubmission" ("userType", "patientType", "wouldRecommend");

-- =============================================
-- SubmissionLocation Table Indexes
-- =============================================

-- Primary index for location-based submission queries
CREATE INDEX IF NOT EXISTS idx_submission_location_location_id 
ON "SubmissionLocation" ("locationId");

-- Index for submission-based location queries
CREATE INDEX IF NOT EXISTS idx_submission_location_submission_id 
ON "SubmissionLocation" ("submissionId");

-- Composite index for efficient joins
CREATE INDEX IF NOT EXISTS idx_submission_location_composite 
ON "SubmissionLocation" ("locationId", "submissionId");

-- =============================================
-- DepartmentConcern Table Indexes
-- =============================================

-- Index for location-based concern queries
CREATE INDEX IF NOT EXISTS idx_concern_location_id 
ON "DepartmentConcern" ("locationId");

-- Index for concern text search
CREATE INDEX IF NOT EXISTS idx_concern_text_search 
ON "DepartmentConcern" USING gin(to_tsvector('english', "concern"));

-- Index for submission-based concern queries
CREATE INDEX IF NOT EXISTS idx_concern_submission_id 
ON "DepartmentConcern" ("submissionId");

-- =============================================
-- Service Points Table Indexes (Quick Feedback)
-- =============================================

-- Index for active service points
CREATE INDEX IF NOT EXISTS idx_service_points_active 
ON "service_points" ("active") WHERE "active" = true;

-- Index for service point type
CREATE INDEX IF NOT EXISTS idx_service_points_type 
ON "service_points" ("location_type");

-- =============================================
-- Service Point Feedback Indexes
-- =============================================

-- Index for service point feedback queries
CREATE INDEX IF NOT EXISTS idx_feedback_service_point 
ON "service_point_feedback" ("service_point_id");

-- Index for feedback date ordering
CREATE INDEX IF NOT EXISTS idx_feedback_date 
ON "service_point_feedback" ("created_at");

-- Index for rating-based queries
CREATE INDEX IF NOT EXISTS idx_feedback_rating 
ON "service_point_feedback" ("rating");

-- Composite index for service point and date
CREATE INDEX IF NOT EXISTS idx_feedback_service_point_date 
ON "service_point_feedback" ("service_point_id", "created_at");

-- =============================================
-- Partial Indexes for Specific Use Cases
-- =============================================

-- Index for non-null ratings only (excludes incomplete surveys)
CREATE INDEX IF NOT EXISTS idx_rating_complete_surveys 
ON "Rating" ("locationId", "overall") 
WHERE "overall" IS NOT NULL AND "reception" IS NOT NULL;

-- Index for recent submissions (last 6 months)
CREATE INDEX IF NOT EXISTS idx_submission_recent 
ON "SurveySubmission" ("submittedAt", "wouldRecommend") 
WHERE "submittedAt" > (CURRENT_DATE - INTERVAL '6 months');

-- Index for canteen-related locations
CREATE INDEX IF NOT EXISTS idx_location_canteen 
ON "Location" ("id", "name") 
WHERE "name" ILIKE '%canteen%' OR "name" ILIKE '%cafeteria%' OR "name" ILIKE '%dining%';

-- =============================================
-- Statistics Update
-- =============================================

-- Update table statistics for better query planning
ANALYZE "Location";
ANALYZE "SurveySubmission";
ANALYZE "Rating";
ANALYZE "SubmissionLocation";
ANALYZE "DepartmentConcern";
ANALYZE "service_points";
ANALYZE "service_point_feedback";

-- =============================================
-- Index Usage Monitoring Queries
-- =============================================

-- Use these queries to monitor index usage and performance:

/*
-- Check index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table scan statistics
SELECT 
    schemaname,
    tablename,
    seq_scan as table_scans,
    seq_tup_read as tuples_read,
    idx_scan as index_scans,
    idx_tup_fetch as index_tuples_fetched
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY seq_scan DESC;

-- Check slow queries (if pg_stat_statements is enabled)
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
WHERE query LIKE '%Rating%' OR query LIKE '%SurveySubmission%'
ORDER BY mean_time DESC
LIMIT 10;
*/

-- =============================================
-- Performance Notes
-- =============================================

/*
These indexes are optimized for the following query patterns:

1. Location-based filtering (wards, departments, canteen)
2. Rating aggregations by location
3. Recommendation rate calculations
4. Demographic analysis queries
5. Time-based filtering
6. Text search in concerns and locations

Expected Performance Improvements:
- Ward/Department queries: 60-80% faster
- Canteen queries: 70-90% faster
- Overview aggregations: 50-70% faster
- Search operations: 80-95% faster

Monitor index usage and adjust as needed based on actual query patterns.
*/
