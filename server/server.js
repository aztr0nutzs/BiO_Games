const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Redis client for session management
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// PostgreSQL client for account management
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'bio_games',
  password: process.env.PG_PASSWORD || 'password',
  port: process.env.PG_PORT || 5432,
});

// Connect to PostgreSQL
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Connect to Redis
redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// API Endpoints

// Auth endpoint
app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Matchmaking endpoint
app.post('/matchmake', authenticate, async (req, res) => {
  const { gameType, region } = req.body;
  
  try {
    // Add user to matchmaking queue
    await redisClient.lPush(`matchmaking:${gameType}:${region}`, req.user.id);
    
    res.json({ message: 'Added to matchmaking queue.' });
  } catch (err) {
    console.error('Matchmaking error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Join room endpoint
app.post('/join_room', authenticate, async (req, res) => {
  const { roomId } = req.body;
  
  try {
    // Add user to room
    await redisClient.sAdd(`room:${roomId}:players`, req.user.id);
    
    res.json({ message: 'Joined room.' });
  } catch (err) {
    console.error('Join room error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Move endpoint
app.post('/move', authenticate, async (req, res) => {
  const { roomId, move } = req.body;
  
  try {
    // Validate move
    // ... (add move validation logic here)
    
    // Broadcast move to room
    io.to(roomId).emit('move', { playerId: req.user.id, move });
    
    res.json({ message: 'Move processed.' });
  } catch (err) {
    console.error('Move error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Forfeit endpoint
app.post('/forfeit', authenticate, async (req, res) => {
  const { roomId } = req.body;
  
  try {
    // Remove user from room
    await redisClient.sRem(`room:${roomId}:players`, req.user.id);
    
    // Broadcast forfeit to room
    io.to(roomId).emit('forfeit', { playerId: req.user.id });
    
    res.json({ message: 'Forfeit processed.' });
  } catch (err) {
    console.error('Forfeit error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Reconnect endpoint
app.post('/reconnect', authenticate, async (req, res) => {
  const { roomId } = req.body;
  
  try {
    // Check if user is in room
    const isInRoom = await redisClient.sIsMember(`room:${roomId}:players`, req.user.id);
    if (!isInRoom) {
      return res.status(400).json({ error: 'Not in room.' });
    }
    
    // Get current game state
    const gameState = await redisClient.get(`room:${roomId}:state`);
    
    res.json({ gameState });
  } catch (err) {
    console.error('Reconnect error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Client ${socket.id} left room ${roomId}`);
  });
  
  socket.on('move', (data) => {
    const { roomId, move } = data;
    socket.to(roomId).emit('move', { playerId: socket.id, move });
  });
  
  socket.on('forfeit', (roomId) => {
    socket.to(roomId).emit('forfeit', { playerId: socket.id });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});