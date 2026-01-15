const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL client
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'bio_games',
  password: process.env.PG_PASSWORD || 'password',
  port: process.env.PG_PORT || 5432,
});

// Simple auth middleware
const authenticate = (req, res, next) => {
  req.user = { id: req.body.userId || 1 };
  next();
};

// Purchase endpoint
app.post('/purchase', authenticate, async (req, res) => {
  const { itemId, quantity, cost } = req.body;

  try {
    // Check user balance
    const userResult = await pool.query('SELECT currency FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rows[0].currency < cost) {
      return res.status(400).json({ error: 'Insufficient funds.' });
    }

    // Deduct currency
    await pool.query('UPDATE users SET currency = currency - $1 WHERE id = $2', [cost, req.user.id]);

    // Add to inventory
    await pool.query('INSERT INTO inventory (user_id, item_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = inventory.quantity + $3', [req.user.id, itemId, quantity]);

    res.json({ message: 'Purchase successful.' });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get inventory
app.get('/inventory', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT item_id, quantity FROM inventory WHERE user_id = $1', [req.user.id]);
    res.json({ inventory: result.rows });
  } catch (err) {
    console.error('Inventory error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'economy' });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Economy service running on port ${PORT}`);
});