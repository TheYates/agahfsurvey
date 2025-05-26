-- Function to get location visits with counts and average ratings
CREATE OR REPLACE FUNCTION get_location_visits()
RETURNS TABLE (
  location TEXT,
  visit_count BIGINT,
  average_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH location_data AS (
    -- Department visits
    SELECT 
      department AS location,
      COUNT(*) AS visit_count,
      AVG(overall_rating) AS average_rating
    FROM department_ratings
    GROUP BY department
    
    UNION ALL
    
    -- Ward visits
    SELECT 
      ward AS location,
      COUNT(*) AS visit_count,
      AVG(overall_rating) AS average_rating
    FROM ward_ratings
    GROUP BY ward
    
    UNION ALL
    
    -- Canteen visits (single location)
    SELECT 
      'Canteen' AS location,
      COUNT(*) AS visit_count,
      AVG(overall_rating) AS average_rating
    FROM canteen_ratings
    
    UNION ALL
    
    -- Occupational Health visits (single location)
    SELECT 
      'Occupational Health' AS location,
