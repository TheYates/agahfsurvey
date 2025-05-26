-- Create service_points table
CREATE TABLE IF NOT EXISTS service_points (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_point_feedback table
CREATE TABLE IF NOT EXISTS service_point_feedback (
  id SERIAL PRIMARY KEY,
  service_point_id INTEGER NOT NULL REFERENCES service_points(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial service points
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_service_point_feedback_service_point_id ON service_point_feedback(service_point_id);
CREATE INDEX IF NOT EXISTS idx_service_point_feedback_created_at ON service_point_feedback(created_at);
