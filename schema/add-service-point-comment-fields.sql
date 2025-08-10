-- =============================================
-- Add Comment Configuration Fields to Service Points
-- =============================================
-- This migration adds fields to customize the comments section
-- for each service point individually

-- Add new columns to service_points table
ALTER TABLE service_points 
ADD COLUMN IF NOT EXISTS comments_title VARCHAR(255) DEFAULT 'Any additional comments?',
ADD COLUMN IF NOT EXISTS comments_placeholder VARCHAR(255) DEFAULT 'Share your thoughts...';

-- Update existing service points with default values
UPDATE service_points 
SET 
  comments_title = 'Any additional comments?',
  comments_placeholder = 'Share your thoughts...'
WHERE 
  comments_title IS NULL 
  OR comments_placeholder IS NULL;

-- Add comments to document the new fields
COMMENT ON COLUMN service_points.comments_title IS 'The label/title shown above the comments textbox in the feedback form';
COMMENT ON COLUMN service_points.comments_placeholder IS 'The placeholder text shown inside the comments textbox';

-- Create index for better performance when querying by comment settings
CREATE INDEX IF NOT EXISTS idx_service_points_comment_settings 
ON service_points (show_comments, comments_title) 
WHERE show_comments = true;

-- Verify the changes
SELECT 
  id,
  name,
  show_comments,
  comments_title,
  comments_placeholder,
  active
FROM service_points 
ORDER BY name
LIMIT 5;

-- Show table structure
\d service_points;
