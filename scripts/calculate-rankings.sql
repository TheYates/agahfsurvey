-- =============================================
-- Calculate Top 5 Departments and Wards Rankings
-- =============================================

-- Helper function to convert rating text to number
-- Run this first if it doesn't exist
CREATE OR REPLACE FUNCTION rating_to_value(rating TEXT) RETURNS NUMERIC AS $$
BEGIN
  RETURN CASE rating
    WHEN 'Excellent' THEN 5
    WHEN 'Very Good' THEN 4
    WHEN 'Good' THEN 3
    WHEN 'Fair' THEN 2
    WHEN 'Poor' THEN 1
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TOP 5 DEPARTMENTS
-- =============================================
WITH department_stats AS (
  SELECT 
    l.id,
    l.name,
    COUNT(r.id) as visit_count,
    -- Calculate average for each category
    ROUND(AVG(rating_to_value(r.reception))::numeric, 2) as avg_reception,
    ROUND(AVG(rating_to_value(r.professionalism))::numeric, 2) as avg_professionalism,
    ROUND(AVG(rating_to_value(r.understanding))::numeric, 2) as avg_understanding,
    ROUND(AVG(rating_to_value(r."promptnessCare"))::numeric, 2) as avg_promptness_care,
    ROUND(AVG(rating_to_value(r."promptnessFeedback"))::numeric, 2) as avg_promptness_feedback,
    ROUND(AVG(rating_to_value(r.overall))::numeric, 2) as avg_overall,
    -- Calculate recommend rate
    COUNT(CASE WHEN r."wouldRecommend" = true THEN 1 END) as recommend_count,
    ROUND(COUNT(CASE WHEN r."wouldRecommend" = true THEN 1 END)::numeric / NULLIF(COUNT(r.id), 0) * 100, 0) as recommend_rate
  FROM "Location" l
  LEFT JOIN "Rating" r ON r."locationId" = l.id
  WHERE l."locationType" = 'department'
  GROUP BY l.id, l.name
  HAVING COUNT(r.id) > 0
),
department_satisfaction AS (
  SELECT 
    *,
    -- Raw satisfaction = average of all category averages
    ROUND((
      COALESCE(avg_reception, 0) + 
      COALESCE(avg_professionalism, 0) + 
      COALESCE(avg_understanding, 0) + 
      COALESCE(avg_promptness_care, 0) + 
      COALESCE(avg_promptness_feedback, 0) + 
      COALESCE(avg_overall, 0)
    ) / NULLIF(
      (CASE WHEN avg_reception > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_professionalism > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_understanding > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_promptness_care > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_promptness_feedback > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_overall > 0 THEN 1 ELSE 0 END)
    , 0)::numeric, 2) as raw_satisfaction
  FROM department_stats
),
department_global AS (
  SELECT AVG(raw_satisfaction) as global_avg FROM department_satisfaction
),
department_weighted AS (
  SELECT 
    ds.*,
    dg.global_avg,
    -- Bayesian weighted average: (v/(v+m)) * R + (m/(v+m)) * C where m=5
    ROUND(
      (ds.visit_count::numeric / (ds.visit_count + 5)) * ds.raw_satisfaction + 
      (5::numeric / (ds.visit_count + 5)) * dg.global_avg
    , 2) as weighted_satisfaction
  FROM department_satisfaction ds
  CROSS JOIN department_global dg
)
SELECT 
  ROW_NUMBER() OVER (ORDER BY weighted_satisfaction DESC) as rank,
  name as department_name,
  visit_count,
  raw_satisfaction,
  weighted_satisfaction,
  recommend_rate || '%' as recommend_rate,
  recommend_count || '/' || visit_count as recommend_ratio,
  avg_reception,
  avg_professionalism,
  avg_understanding,
  avg_promptness_care,
  avg_promptness_feedback,
  avg_overall,
  ROUND(global_avg, 2) as global_avg_used
FROM department_weighted
ORDER BY weighted_satisfaction DESC
LIMIT 5;

-- =============================================
-- TOP 5 WARDS
-- =============================================
WITH ward_stats AS (
  SELECT 
    l.id,
    l.name,
    COUNT(r.id) as visit_count,
    -- Calculate average for each ward category
    ROUND(AVG(rating_to_value(r.admission))::numeric, 2) as avg_admission,
    ROUND(AVG(rating_to_value(r."nurseProfessionalism"))::numeric, 2) as avg_nurse_professionalism,
    ROUND(AVG(rating_to_value(r."doctorProfessionalism"))::numeric, 2) as avg_doctor_professionalism,
    ROUND(AVG(rating_to_value(r."foodQuality"))::numeric, 2) as avg_food_quality,
    ROUND(AVG(rating_to_value(r.understanding))::numeric, 2) as avg_understanding,
    ROUND(AVG(rating_to_value(r."promptnessCare"))::numeric, 2) as avg_promptness_care,
    ROUND(AVG(rating_to_value(r."promptnessFeedback"))::numeric, 2) as avg_promptness_feedback,
    ROUND(AVG(rating_to_value(r.discharge))::numeric, 2) as avg_discharge,
    ROUND(AVG(rating_to_value(r.overall))::numeric, 2) as avg_overall,
    -- Calculate recommend rate
    COUNT(CASE WHEN r."wouldRecommend" = true THEN 1 END) as recommend_count,
    ROUND(COUNT(CASE WHEN r."wouldRecommend" = true THEN 1 END)::numeric / NULLIF(COUNT(r.id), 0) * 100, 0) as recommend_rate
  FROM "Location" l
  LEFT JOIN "Rating" r ON r."locationId" = l.id
  WHERE l."locationType" = 'ward'
  GROUP BY l.id, l.name
  HAVING COUNT(r.id) > 0
),
ward_satisfaction AS (
  SELECT 
    *,
    -- Raw satisfaction = average of all category averages
    ROUND((
      COALESCE(avg_admission, 0) + 
      COALESCE(avg_nurse_professionalism, 0) + 
      COALESCE(avg_doctor_professionalism, 0) + 
      COALESCE(avg_food_quality, 0) + 
      COALESCE(avg_understanding, 0) + 
      COALESCE(avg_promptness_care, 0) + 
      COALESCE(avg_promptness_feedback, 0) + 
      COALESCE(avg_discharge, 0) + 
      COALESCE(avg_overall, 0)
    ) / NULLIF(
      (CASE WHEN avg_admission > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_nurse_professionalism > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_doctor_professionalism > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_food_quality > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_understanding > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_promptness_care > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_promptness_feedback > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_discharge > 0 THEN 1 ELSE 0 END) +
      (CASE WHEN avg_overall > 0 THEN 1 ELSE 0 END)
    , 0)::numeric, 2) as raw_satisfaction
  FROM ward_stats
),
ward_global AS (
  SELECT AVG(raw_satisfaction) as global_avg FROM ward_satisfaction
),
ward_weighted AS (
  SELECT 
    ws.*,
    wg.global_avg,
    -- Bayesian weighted average: (v/(v+m)) * R + (m/(v+m)) * C where m=5
    ROUND(
      (ws.visit_count::numeric / (ws.visit_count + 5)) * ws.raw_satisfaction + 
      (5::numeric / (ws.visit_count + 5)) * wg.global_avg
    , 2) as weighted_satisfaction
  FROM ward_satisfaction ws
  CROSS JOIN ward_global wg
)
SELECT 
  ROW_NUMBER() OVER (ORDER BY weighted_satisfaction DESC) as rank,
  name as ward_name,
  visit_count,
  raw_satisfaction,
  weighted_satisfaction,
  recommend_rate || '%' as recommend_rate,
  recommend_count || '/' || visit_count as recommend_ratio,
  avg_admission,
  avg_nurse_professionalism,
  avg_doctor_professionalism,
  avg_food_quality,
  avg_understanding,
  avg_promptness_care,
  avg_promptness_feedback,
  avg_discharge,
  avg_overall,
  ROUND(global_avg, 2) as global_avg_used
FROM ward_weighted
ORDER BY weighted_satisfaction DESC
LIMIT 5;
