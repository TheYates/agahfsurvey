# Database Migration Instructions for NPS Feature

## Overview

This migration adds the `npsRating` column to the `Rating` table to store Net Promoter Score ratings (0-10 scale).

## Files Updated

### 1. Database Migration

- **File**: `supabase/migrations/add_nps_rating.sql`
- **Changes**: Adds `npsRating` INTEGER column with constraint (0-10)

### 2. TypeScript Types

- **File**: `lib/supabase/database.types.ts`
- **Changes**: Added `npsRating: number | null` to Rating table types (Row, Insert, Update)

### 3. Survey Submission Logic

- **File**: `lib/supabase/survey-submission.ts`
- **Changes**:
  - Added `npsRating` to `mapRatingCategory()` function
  - Updated transformation logic to handle npsRating as number type

### 4. Report Actions

- **File**: `app/actions/report-actions.ts`
- **Changes**: Updated `getNPS()` function to fetch from `Rating.npsRating` instead of `SurveySubmission.recommendation`

### 5. Survey Components (UI)

- **Files**:
  - `components/survey/department-rating.tsx`
  - `components/survey/ward-rating.tsx`
  - `components/survey/canteen-rating.tsx`
  - `components/survey/occupational-health-rating.tsx`
- **Changes**: Added NPS question (0-10 scale) after "Would you recommend?" question

## How to Apply the Migration

### Option 1: Using Supabase CLI (Recommended)

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/add_nps_rating.sql`
4. Copy the SQL content and paste it into the SQL Editor
5. Click **Run** to execute the migration

### Option 3: Direct SQL Execution

Run the following SQL in your Supabase SQL editor:

\`\`\`sql
-- Add npsRating column to Rating table
ALTER TABLE "Rating"
ADD COLUMN "npsRating" INTEGER;

-- Add comment to describe the column
COMMENT ON COLUMN "Rating"."npsRating" IS 'Net Promoter Score rating (0-10 scale)';

-- Add check constraint to ensure npsRating is between 0 and 10
ALTER TABLE "Rating"
ADD CONSTRAINT "check_nps_rating_range"
CHECK ("npsRating" IS NULL OR ("npsRating" >= 0 AND "npsRating" <= 10));
\`\`\`

## Verification

After applying the migration, verify it worked:

\`\`\`sql
-- Check if column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Rating' AND column_name = 'npsRating';

-- Check if constraint exists
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'check_nps_rating_range';
\`\`\`

## Testing

1. **Submit a test survey**:

   - Go through the survey flow
   - Answer "Would you recommend?" question
   - Select an NPS rating (0-10)
   - Submit the survey

2. **Verify data is saved**:
   \`\`\`sql
   SELECT id, locationId, npsRating, wouldRecommend
   FROM "Rating"
   WHERE npsRating IS NOT NULL
   ORDER BY id DESC
   LIMIT 10;
   \`\`\`

3. **Check NPS report**:
   - Navigate to `/reports` page
   - Verify the NPS card shows correct data
   - Check promoters, passives, and detractors counts

## Rollback (if needed)

If you need to revert this migration:

\`\`\`sql
-- Remove constraint
ALTER TABLE "Rating"
DROP CONSTRAINT IF EXISTS "check_nps_rating_range";

-- Remove column
ALTER TABLE "Rating"
DROP COLUMN IF EXISTS "npsRating";
\`\`\`

## Notes

- Existing records will have `npsRating = NULL` (which is fine)
- The NPS question only appears for new survey submissions
- The constraint ensures only valid values (0-10) can be stored
- The NPS score is calculated from all ratings in the Rating table
