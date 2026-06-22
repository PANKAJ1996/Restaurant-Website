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
 * GET /api/reservations
 * Optional filters: ?reservation_id=... or ?customer_email=...
 */
router.get(
  '/reservations',
  asyncHandler(async (req, res) => {
    const { reservation_id, customer_email } = req.query;
    let sql = 'SELECT * FROM reservations';
    const params = [];

    if (reservation_id) {
      sql += ' WHERE reservation_id = ?';
      params.push(reservation_id);
    } else if (customer_email) {
      sql += ' WHERE customer_email = ?';
      params.push(customer_email);
    }
    sql += ' ORDER BY id DESC LIMIT 50';

    const rows = await db.query(sql, params);
    res.json(rows);
  })
);

/**
 * POST /api/reservations
 */
router.post(
  '/reservations',
  asyncHandler(async (req, res) => {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    await db.query(
      `INSERT INTO reservations (
        reservation_id, created_at, status, reservation_date, reservation_time,
        guests, customer_name, customer_email, customer_phone, notes
      ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        payload.reservation_id || null,
        normalizeTimestamp(payload.created_at),
        payload.status || null,
        payload.reservation_date || null,
        payload.reservation_time || null,
        payload.guests || 1,
        payload.customer_name || null,
        payload.customer_email || null,
        payload.customer_phone || null,
        payload.notes || null,
      ]
    );

    res.status(201).json({ success: true });
  })
);

module.exports = router;
