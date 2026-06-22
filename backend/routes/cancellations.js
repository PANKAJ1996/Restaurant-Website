'use strict';

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const asyncHandler = require('../middleware/asyncHandler');

function normalizeTimestamp(value) {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/**
 * GET /api/cancellations
 * Optional filters: ?cancellation_id=... or ?reference_id=...
 */
router.get(
  '/cancellations',
  asyncHandler(async (req, res) => {
    const { cancellation_id, reference_id } = req.query;
    let sql = 'SELECT * FROM cancellations';
    const params = [];

    if (cancellation_id) {
      sql += ' WHERE cancellation_id = ?';
      params.push(cancellation_id);
    } else if (reference_id) {
      sql += ' WHERE reference_id = ?';
      params.push(reference_id);
    }
    sql += ' ORDER BY id DESC LIMIT 50';

    const rows = await db.query(sql, params);
    res.json(rows);
  })
);

/**
 * POST /api/cancellations
 */
router.post(
  '/cancellations',
  asyncHandler(async (req, res) => {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    await db.query(
      `INSERT INTO cancellations (
        cancellation_id, created_at, type, reference_id, reason, amount
      ) VALUES (?,?,?,?,?,?)`,
      [
        payload.cancellation_id || null,
        normalizeTimestamp(payload.created_at),
        payload.type || null,
        payload.reference_id || null,
        payload.reason || null,
        payload.amount || 0,
      ]
    );

    res.status(201).json({ success: true });
  })
);

module.exports = router;
