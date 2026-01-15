-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- Create game rooms table
CREATE TABLE IF NOT EXISTS game_rooms (
  id SERIAL PRIMARY KEY,
  room_id VARCHAR(255) UNIQUE NOT NULL,
  game_type VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create game room players table
CREATE TABLE IF NOT EXISTS game_room_players (
  id SERIAL PRIMARY KEY,
  room_id VARCHAR(255) REFERENCES game_rooms(room_id),
  user_id INTEGER REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ready BOOLEAN DEFAULT FALSE
);

-- Create game moves table
CREATE TABLE IF NOT EXISTS game_moves (
  id SERIAL PRIMARY KEY,
  room_id VARCHAR(255) REFERENCES game_rooms(room_id),
  user_id INTEGER REFERENCES users(id),
  move_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create game results table
CREATE TABLE IF NOT EXISTS game_results (
  id SERIAL PRIMARY KEY,
  room_id VARCHAR(255) REFERENCES game_rooms(room_id),
  winner_id INTEGER REFERENCES users(id),
  loser_id INTEGER REFERENCES users(id),
  result_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ranking table
CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  game_type VARCHAR(255) NOT NULL,
  mmr INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add columns to users table for economy and analytics
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency INTEGER DEFAULT 1000;
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_hash VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS segment_tags TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS cohort_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_spend DECIMAL(10,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS push_opt_in BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gdpr_consent BOOLEAN DEFAULT FALSE;

-- Economy tables
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  item_id VARCHAR(100) NOT NULL,
  quantity INTEGER DEFAULT 0,
  acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_id)
);

-- Analytics tables
CREATE TABLE IF NOT EXISTS telemetry_events (
  id SERIAL PRIMARY KEY,
  user_hash VARCHAR(64) NOT NULL,
  device_hash VARCHAR(64) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_hash VARCHAR(64),
  app_version VARCHAR(50),
  platform VARCHAR(20)
);

CREATE INDEX IF NOT EXISTS idx_telemetry_user_hash ON telemetry_events(user_hash);
CREATE INDEX IF NOT EXISTS idx_telemetry_event_type ON telemetry_events(event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry_events(timestamp);

-- A/B Testing tables
CREATE TABLE IF NOT EXISTS ab_tests (
  id SERIAL PRIMARY KEY,
  test_name VARCHAR(255) UNIQUE NOT NULL,
  test_key VARCHAR(100) NOT NULL,
  variants JSONB NOT NULL,
  rollout_percentage DECIMAL(5,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ab_assignments (
  id SERIAL PRIMARY KEY,
  user_hash VARCHAR(64) NOT NULL,
  test_id INTEGER REFERENCES ab_tests(id),
  variant VARCHAR(10) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Push Notification tables
CREATE TABLE IF NOT EXISTS push_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(255) UNIQUE NOT NULL,
  title_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  trigger_event VARCHAR(100),
  schedule_config JSONB,
  rate_limit_hours INTEGER DEFAULT 24,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS push_sends (
  id SERIAL PRIMARY KEY,
  user_hash VARCHAR(64) NOT NULL,
  template_id INTEGER REFERENCES push_templates(id),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delivered BOOLEAN DEFAULT FALSE,
  opened BOOLEAN DEFAULT FALSE,
  clicked BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS push_opt_outs (
  id SERIAL PRIMARY KEY,
  user_hash VARCHAR(64) NOT NULL,
  opt_out_reason VARCHAR(100),
  opt_out_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cohort Analysis tables
CREATE TABLE IF NOT EXISTS cohorts (
  id SERIAL PRIMARY KEY,
  cohort_name VARCHAR(255) NOT NULL,
  cohort_date DATE NOT NULL,
  user_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cohort_metrics (
  id SERIAL PRIMARY KEY,
  cohort_id INTEGER REFERENCES cohorts(id),
  metric_date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  retention_rate DECIMAL(5,2),
  arpu DECIMAL(10,2),
  arppu DECIMAL(10,2),
  session_count_avg DECIMAL(10,2)
);

-- User Segmentation
CREATE TABLE IF NOT EXISTS user_segments (
  id SERIAL PRIMARY KEY,
  segment_name VARCHAR(100) UNIQUE NOT NULL,
  criteria JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reward tracking
CREATE TABLE IF NOT EXISTS player_rewards (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES users(id),
  reward_type VARCHAR(50),
  amount INTEGER,
  triggered_at TIMESTAMP,
  claimed_at TIMESTAMP
);

-- Social interactions
CREATE TABLE IF NOT EXISTS social_challenges (
  id SERIAL PRIMARY KEY,
  challenger_id INTEGER REFERENCES users(id),
  challenged_id INTEGER REFERENCES users(id),
  game_type VARCHAR(50),
  stake_amount INTEGER,
  status VARCHAR(20),
  created_at TIMESTAMP
);

-- In-game announcements
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  target_audience VARCHAR(50) DEFAULT 'all',
  scheduled_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft'
);

-- Support ticket system
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal',
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'open',
  assigned_to INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ticket responses/messages
CREATE TABLE IF NOT EXISTS ticket_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES support_tickets(id),
  sender_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat logs
CREATE TABLE IF NOT EXISTS chat_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  room_id VARCHAR(255),
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cheat detection reports
CREATE TABLE IF NOT EXISTS cheat_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  risk_score DECIMAL(3,2) CHECK (risk_score >= 0 AND risk_score <= 1),
  detection_method VARCHAR(100),
  actions_log JSONB,
  replay_trace TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Economy settings/configuration
CREATE TABLE IF NOT EXISTS economy_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_by INTEGER REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs for admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  admin_user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id INTEGER,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);