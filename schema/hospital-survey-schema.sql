-- =============================================
-- Hospital Survey Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Main Hospital Survey Tables
-- =============================================

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey submissions table
CREATE TABLE IF NOT EXISTS survey_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_purpose VARCHAR(255) NOT NULL,
  patient_type VARCHAR(50) NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  would_recommend BOOLEAN NOT NULL,
  why_not_recommend TEXT,
  recommendation TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submission locations table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS submission_locations (
  id SERIAL PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department ratings table
CREATE TABLE IF NOT EXISTS department_ratings (
  id SERIAL PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  rating VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Department concerns table
CREATE TABLE IF NOT EXISTS department_concerns (
  id SERIAL PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  concern TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- General observations table
CREATE TABLE IF NOT EXISTS general_observations (
  id SERIAL PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  rating VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Service Point Quick Feedback Tables
-- =============================================

-- Service points table
CREATE TABLE IF NOT EXISTS service_points (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location_type VARCHAR(50) NOT NULL,
  custom_question VARCHAR(255) DEFAULT 'How would you rate your experience?',
  show_comments BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service point feedback table
CREATE TABLE IF NOT EXISTS service_point_feedback (
  id SERIAL PRIMARY KEY,
  service_point_id INTEGER NOT NULL REFERENCES service_points(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Indexes for better query performance
-- =============================================

-- Main survey indexes
CREATE INDEX IF NOT EXISTS idx_survey_submissions_submitted_at ON survey_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_survey_submissions_would_recommend ON survey_submissions(would_recommend);
CREATE INDEX IF NOT EXISTS idx_submission_locations_submission_id ON submission_locations(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_locations_location_id ON submission_locations(location_id);
CREATE INDEX IF NOT EXISTS idx_department_ratings_submission_id ON department_ratings(submission_id);
CREATE INDEX IF NOT EXISTS idx_department_ratings_location_id ON department_ratings(location_id);
CREATE INDEX IF NOT EXISTS idx_department_concerns_submission_id ON department_concerns(submission_id);
CREATE INDEX IF NOT EXISTS idx_department_concerns_location_id ON department_concerns(location_id);
CREATE INDEX IF NOT EXISTS idx_general_observations_submission_id ON general_observations(submission_id);

-- Service point feedback indexes
CREATE INDEX IF NOT EXISTS idx_service_point_feedback_service_point_id ON service_point_feedback(service_point_id);
CREATE INDEX IF NOT EXISTS idx_service_point_feedback_created_at ON service_point_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_service_point_feedback_rating ON service_point_feedback(rating);

-- =============================================
-- Initial Data for Locations
-- =============================================

-- Insert department locations
INSERT INTO locations (name, location_type) VALUES
('Audiology Unit', 'department'),
('Dental Clinic', 'department'),
('Dressing Room', 'department'),
('Emergency Unit', 'department'),
('Eye Clinic', 'department'),
('Eric Asubonteng Clinic (Bruno Est.)', 'department'),
('Injection Room', 'department'),
('Laboratory', 'department'),
('Out-Patient Department (OPD)', 'department'),
('Pharmacy', 'department'),
('Physiotherapy', 'department'),
('RCH', 'department'),
('Ultrasound Unit', 'department'),
('X-Ray Unit', 'department')
ON CONFLICT (id) DO NOTHING;

-- Insert ward locations
INSERT INTO locations (name, location_type) VALUES
('Female''s Ward', 'ward'),
('Intensive Care Unit (ICU)', 'ward'),
('Kids Ward', 'ward'),
('Lying-In Ward', 'ward'),
('Male''s Ward', 'ward'),
('Maternity Ward', 'ward'),
('Neonatal Intensive Care Unit (NICU)', 'ward')
ON CONFLICT (id) DO NOTHING;

-- Insert other locations
INSERT INTO locations (name, location_type) VALUES
('Canteen Services', 'canteen'),
('Occupational Health Unit (Medicals)', 'occupational_health')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Initial Data for Service Points
-- =============================================

-- Insert service points
INSERT INTO service_points (name, location_type) VALUES
('Consulting Room 1', 'consulting_room'),
('Consulting Room 2', 'consulting_room'),
('Consulting Room 3', 'consulting_room'),
('Consulting Room 4', 'consulting_room'),
('Consulting Room 5', 'consulting_room'),
('Consulting Room 6', 'consulting_room'),
('Consulting Room 7', 'consulting_room'),
('Consulting Room 8', 'consulting_room'),
('Consulting Room 9', 'consulting_room'),
('Emergency Unit', 'emergency'),
('Physiotherapy Unit', 'physiotherapy'),
('VIP Consulting Room', 'vip'),
('X-Ray Unit', 'xray'),
('Ultrasound Unit', 'ultrasound')
ON CONFLICT (id) DO NOTHING;
