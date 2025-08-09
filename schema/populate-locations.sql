-- =============================================
-- Populate Location Table with Survey Data
-- =============================================
-- This script populates the Location table with all the locations
-- needed for the hospital survey system

-- Clear existing data (optional - remove if you want to keep existing data)
-- DELETE FROM "Location";

-- Insert department locations
INSERT INTO "Location" ("name", "locationType", "createdAt", "updatedAt") VALUES
('Audiology Unit', 'department', NOW(), NOW()),
('Dental Clinic', 'department', NOW(), NOW()),
('Dressing Room', 'department', NOW(), NOW()),
('Emergency Unit', 'department', NOW(), NOW()),
('Eye Clinic', 'department', NOW(), NOW()),
('Eric Asubonteng Clinic (Bruno Est.)', 'department', NOW(), NOW()),
('Injection Room', 'department', NOW(), NOW()),
('Laboratory', 'department', NOW(), NOW()),
('Out-Patient Department (OPD)', 'department', NOW(), NOW()),
('Pharmacy', 'department', NOW(), NOW()),
('Physiotherapy', 'department', NOW(), NOW()),
('RCH', 'department', NOW(), NOW()),
('Ultrasound Unit', 'department', NOW(), NOW()),
('X-Ray Unit', 'department', NOW(), NOW())
ON CONFLICT ("name") DO UPDATE SET 
  "locationType" = EXCLUDED."locationType",
  "updatedAt" = NOW();

-- Insert ward locations
INSERT INTO "Location" ("name", "locationType", "createdAt", "updatedAt") VALUES
('Female''s Ward', 'ward', NOW(), NOW()),
('Intensive Care Unit (ICU)', 'ward', NOW(), NOW()),
('Kids Ward', 'ward', NOW(), NOW()),
('Lying-In Ward', 'ward', NOW(), NOW()),
('Male''s Ward', 'ward', NOW(), NOW()),
('Maternity Ward', 'ward', NOW(), NOW()),
('Neonatal Intensive Care Unit (NICU)', 'ward', NOW(), NOW())
ON CONFLICT ("name") DO UPDATE SET 
  "locationType" = EXCLUDED."locationType",
  "updatedAt" = NOW();

-- Insert canteen and other service locations
INSERT INTO "Location" ("name", "locationType", "createdAt", "updatedAt") VALUES
('Canteen Services', 'canteen', NOW(), NOW()),
('Occupational Health Unit (Medicals)', 'occupational_health', NOW(), NOW())
ON CONFLICT ("name") DO UPDATE SET 
  "locationType" = EXCLUDED."locationType",
  "updatedAt" = NOW();

-- Verify the data was inserted
SELECT 
  "locationType",
  COUNT(*) as count,
  STRING_AGG("name", ', ' ORDER BY "name") as locations
FROM "Location" 
GROUP BY "locationType"
ORDER BY "locationType";
