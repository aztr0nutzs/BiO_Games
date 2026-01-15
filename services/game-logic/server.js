const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');
const { SlotMachine, WheelSpinner, KNXT4Validator, AntiCheatValidator } = require('../../server/game_validator');
const { hmacMiddleware, generateHMAC } = require('../../server/hmac_validator');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

// Initialize game validators
const slotMachine = new SlotMachine();
const wheelSpinner = new WheelSpinner();
const knxt4Validator = new KNXT4Validator();
const antiCheat = new AntiCheatValidator();

// Simple auth middleware
const authenticate = (req, res, next) => {
  req.user = { id: req.body.userId || 1 };
  next();
};

// Move endpoint
app.post('/move', authenticate, async (req, res) => {
  const { roomId, move } = req.body;

  try {
    // Validate move (add logic here)
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'game-logic' });
});

// Slot spin endpoint (server-authoritative)
app.post('/slot/spin', authenticate, async (req, res) => {
  const { bet } = req.body;

  try {
    // Anti-cheat check
    if (antiCheat.detectSpeedHack(req.user.id, 'slot_spin')) {
      return res.status(429).json({ error: 'Too many requests. Suspicious activity detected.' });
    }

    // Validate bet amount
    if (!bet || bet <= 0) {
      return res.status(400).json({ error: 'Invalid bet amount.' });
    }

    // Generate spin result
    const result = slotMachine.spin(bet);

    res.json(result);
  } catch (err) {
    console.error('Slot spin error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Wheel spin endpoint (server-authoritative)
app.post('/wheel/spin', authenticate, async (req, res) => {
  try {
    // Anti-cheat check
    if (antiCheat.detectSpeedHack(req.user.id, 'wheel_spin')) {
      return res.status(429).json({ error: 'Too many requests. Suspicious activity detected.' });
    }

    // Generate spin result
    const result = wheelSpinner.spin();

    res.json(result);
  } catch (err) {
    console.error('Wheel spin error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// KNXT4 move validation endpoint
app.post('/knxt4/validate-move', authenticate, async (req, res) => {
  const { board, column, player } = req.body;

  try {
    // Anti-cheat check
    if (antiCheat.detectSpeedHack(req.user.id, 'knxt4_move')) {
      return res.status(429).json({ error: 'Too many requests. Suspicious activity detected.' });
    }

    // Validate move
    const validation = knxt4Validator.validateMove(board, column, player);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Check for winner
    const isWinner = knxt4Validator.checkWinner(board, validation.row, validation.column, player);

    res.json({
      valid: true,
      row: validation.row,
      column: validation.column,
      isWinner
    });
  } catch (err) {
    console.error('KNXT4 validation error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Game logic service running on port ${PORT}`);
});