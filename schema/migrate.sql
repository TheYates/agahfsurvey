-- Drop existing tables if they exist
DROP TABLE IF EXISTS "ServicePointFeedback";
DROP TABLE IF EXISTS "ServicePoints";

-- Create ServicePoints table
CREATE TABLE IF NOT EXISTS "ServicePoints" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ServicePointFeedback table
CREATE TABLE IF NOT EXISTS "ServicePointFeedback" (
  id SERIAL PRIMARY KEY,
  service_point_id INTEGER NOT NULL REFERENCES "ServicePoints"(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  recommend BOOLEAN,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial service points
INSERT INTO "ServicePoints" (name, location, is_active) VALUES
('Main Reception', 'Tema Hospital', TRUE),
('Pediatric Ward', 'Makola Clinic', TRUE),
('Emergency Room', 'Tema Hospital', TRUE),
('Pharmacy', 'Accra Medical Center', TRUE),
('Laboratory', 'Tema Hospital', TRUE),
('Consulting Room 1', 'Tema Hospital', TRUE),
('Consulting Room 2', 'Tema Hospital', TRUE),
('Consulting Room 3', 'Tema Hospital', TRUE),
('Maternity Ward', 'Makola Clinic', TRUE),
('Ultrasound Room', 'Accra Medical Center', TRUE),
('Physiotherapy', 'Accra Medical Center', TRUE),
('X-Ray Department', 'Tema Hospital', TRUE),
('Dental Clinic', 'Makola Clinic', TRUE),
('Eye Clinic', 'Tema Hospital', TRUE);

-- Insert sample feedback data
INSERT INTO "ServicePointFeedback" (service_point_id, rating, recommend, comment) VALUES
(1, 5, TRUE, 'Excellent service, very friendly staff!'),
(1, 4, TRUE, 'Good service but had to wait a bit.'),
(2, 5, TRUE, 'The pediatric nurses were amazing with my child!'),
(3, 3, FALSE, 'Fast service but not very friendly.'),
(4, 4, TRUE, 'Great service at the pharmacy'),
(1, 2, FALSE, 'Long wait times and staff seemed overwhelmed'),
(5, 5, TRUE, 'Lab technician was very professional'),
(3, 4, TRUE, 'Emergency was handled quickly and efficiently'),
(2, 5, TRUE, 'Great care for my child'),
(6, 4, TRUE, 'Doctor was knowledgeable and caring');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_service_point_feedback_service_point_id ON "ServicePointFeedback"(service_point_id);
CREATE INDEX IF NOT EXISTS idx_service_point_feedback_created_at ON "ServicePointFeedback"(created_at);
CREATE INDEX IF NOT EXISTS idx_service_points_is_active ON "ServicePoints"(is_active); 