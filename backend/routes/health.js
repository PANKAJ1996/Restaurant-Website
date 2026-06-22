'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const config = require('../config/env');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * GET /api/health
 * Liveness/readiness check. Reports environment and database connectivity.
 */
router.get(
  '/health',
  asyncHandler(async (req, res) => {
    let database = 'down';
    try {
      await db.ping();
      database = 'up';
    } catch (err) {
      database = `error: ${err.message}`;
    }

    res.json({
      status: 'ok',
      environment: config.env,
      database,
      timestamp: new Date().toISOString(),
    });
  })
);

module.exports = router;
