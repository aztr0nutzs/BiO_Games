/**
 * HMAC Request Signing and Validation - Phase 3
 * Implements HMAC SHA256 with nonce and timestamp for request validation
 */

const crypto = require('crypto');

const HMAC_SECRET = process.env.HMAC_SECRET || 'your_hmac_secret_key_change_in_production';
const NONCE_EXPIRY = 300000; // 5 minutes in milliseconds
const usedNonces = new Set();

// Clean up old nonces periodically
setInterval(() => {
  usedNonces.clear();
}, NONCE_EXPIRY);

/**
 * Generate HMAC signature for a request
 * @param {Object} payload - Request payload
 * @param {string} timestamp - ISO timestamp
 * @param {string} nonce - Unique nonce
 * @returns {string} HMAC signature
 */
function generateHMAC(payload, timestamp, nonce) {
  const data = JSON.stringify(payload) + timestamp + nonce;
  return crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(data)
    .digest('hex');
}

/**
 * Validate HMAC signature
 * @param {Object} req - Express request object
 * @returns {Object} Validation result
 */
function validateHMAC(req) {
  const { signature, timestamp, nonce } = req.headers;
  const payload = req.body;

  // Check if required headers exist
  if (!signature || !timestamp || !nonce) {
    return {
      valid: false,
      error: 'Missing required headers: signature, timestamp, or nonce'
    };
  }

  // Check timestamp (prevent replay attacks)
  const requestTime = new Date(timestamp).getTime();
  const currentTime = Date.now();
  const timeDiff = Math.abs(currentTime - requestTime);

  if (timeDiff > NONCE_EXPIRY) {
    return {
      valid: false,
      error: 'Request timestamp expired'
    };
  }

  // Check nonce (prevent replay attacks)
  if (usedNonces.has(nonce)) {
    return {
      valid: false,
      error: 'Nonce already used'
    };
  }

  // Validate signature
  const expectedSignature = generateHMAC(payload, timestamp, nonce);
  if (signature !== expectedSignature) {
    return {
      valid: false,
      error: 'Invalid signature'
    };
  }

  // Mark nonce as used
  usedNonces.add(nonce);

  return {
    valid: true
  };
}

/**
 * Express middleware for HMAC validation
 */
function hmacMiddleware(req, res, next) {
  const result = validateHMAC(req);
  
  if (!result.valid) {
    return res.status(401).json({
      error: 'Request validation failed',
      message: result.error
    });
  }
  
  next();
}

module.exports = {
  generateHMAC,
  validateHMAC,
  hmacMiddleware
};
