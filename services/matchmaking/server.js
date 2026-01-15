const express = require('express');
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect to Redis
redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

// Simple auth middleware (in production, use JWT validation)
const authenticate = (req, res, next) => {
  // Assume token is validated by gateway
  req.user = { id: req.body.userId || 1 }; // Mock for now
  next();
};

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'matchmaking' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Matchmaking service running on port ${PORT}`);
});