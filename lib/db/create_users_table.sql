-- Create a users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create initial admin user (password: admin)
INSERT INTO users (username, password_hash, role)
VALUES ('admin', '$2a$10$rEko9Ey2yFEWhZEMUCC5guoUD07PRZ3eJ53LAZ3CUy5s1JT9SL0h.', 'admin')
ON CONFLICT (username) DO NOTHING; 