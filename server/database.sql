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