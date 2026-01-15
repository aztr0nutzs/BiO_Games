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

// Events endpoint
app.post('/events', async (req, res) => {
  const events = req.body.events || [req.body];

  try {
    for (const event of events) {
      await pool.query(
        'INSERT INTO telemetry_events (user_hash, device_hash, session_id, event_type, event_data, ip_hash, app_version, platform) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          event.user_hash || 'anonymous',
          event.device_hash || 'unknown',
          event.session_id,
          event.event_type,
          JSON.stringify(event.event_data),
          event.ip_hash,
          event.app_version,
          event.platform
        ]
      );
    }
    res.json({ message: 'Events ingested.' });
  } catch (err) {
    console.error('Events error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  const { event_type, start_date, end_date } = req.query;

  try {
    let query = 'SELECT COUNT(*) as count FROM telemetry_events WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (event_type) {
      query += ` AND event_type = $${paramIndex}`;
      params.push(event_type);
      paramIndex++;
    }

    if (start_date) {
      query += ` AND timestamp >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND timestamp <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    const result = await pool.query(query, params);
    res.json({ metrics: result.rows[0] });
  } catch (err) {
    console.error('Metrics error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'analytics' });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});