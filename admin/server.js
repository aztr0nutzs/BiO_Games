const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL client
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'bio_games',
  password: process.env.PG_PASSWORD || 'password',
  port: process.env.PG_PORT || 5432,
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'admin_jwt_secret';

// Middleware for admin auth
const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Admin login
app.post('/api/admin/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin exists (using users table for now)
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const admin = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get players
app.get('/api/admin/players', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, created_at FROM users LIMIT 100');
    res.json({ players: result.rows });
  } catch (err) {
    console.error('Get players error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get player details
app.get('/api/admin/players/:userId', authenticateAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const inventoryResult = await pool.query('SELECT * FROM inventory WHERE user_id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    res.json({
      player: userResult.rows[0],
      inventory: inventoryResult.rows
    });
  } catch (err) {
    console.error('Get player details error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Reset player currency
app.post('/api/admin/players/:userId/reset-currency', authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const { currency } = req.body;

  try {
    await pool.query('UPDATE users SET currency = $1 WHERE id = $2', [currency, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Reset currency error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Flag cheater
app.post('/api/admin/players/:userId/flag', authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  try {
    await pool.query('INSERT INTO cheat_reports (user_id, detection_method, actions_log) VALUES ($1, $2, $3)',
      [userId, 'admin_flagged', JSON.stringify({ reason, action: 'flagged' })]);
    res.json({ success: true });
  } catch (err) {
    console.error('Flag cheater error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Ban player
app.post('/api/admin/players/:userId/ban', authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const { duration, reason } = req.body;

  try {
    // For simplicity, just log the ban
    await pool.query('INSERT INTO audit_logs (admin_user_id, action, resource, resource_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.admin.id, 'ban_player', 'player', userId, JSON.stringify({ duration, reason })]);
    res.json({ success: true });
  } catch (err) {
    console.error('Ban player error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get cheat reports
app.get('/api/admin/cheats', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cheat_reports ORDER BY created_at DESC LIMIT 100');
    res.json({ reports: result.rows });
  } catch (err) {
    console.error('Get cheat reports error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Update cheat report status
app.put('/api/admin/cheats/:reportId/status', authenticateAdmin, async (req, res) => {
  const { reportId } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE cheat_reports SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, req.admin.id, reportId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Update cheat status error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get dashboard metrics
app.get('/api/admin/dashboard/metrics', authenticateAdmin, async (req, res) => {
  try {
    const revenueResult = await pool.query('SELECT SUM(total_spend) as total_revenue FROM users');
    const activeUsersResult = await pool.query('SELECT COUNT(*) as active_users FROM users WHERE last_active > CURRENT_TIMESTAMP - INTERVAL \'24 hours\'');
    const cheatFlagsResult = await pool.query('SELECT COUNT(*) as cheat_flags FROM cheat_reports WHERE created_at > CURRENT_TIMESTAMP - INTERVAL \'24 hours\'');

    res.json({
      revenue_today: revenueResult.rows[0].total_revenue || 0,
      active_users: parseInt(activeUsersResult.rows[0].active_users),
      cheat_flags: parseInt(cheatFlagsResult.rows[0].cheat_flags)
    });
  } catch (err) {
    console.error('Dashboard metrics error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get audit logs
app.get('/api/admin/audit-logs', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json({ logs: result.rows });
  } catch (err) {
    console.error('Get audit logs error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-panel' });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});