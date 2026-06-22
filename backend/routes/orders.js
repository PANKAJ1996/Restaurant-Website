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

function toJsonString(value) {
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return value;
    } catch (e) {
      return JSON.stringify(value);
    }
  }
  return JSON.stringify(value || []);
}

/**
 * GET /api/orders
 * Optional filters: ?order_id=... or ?customer_email=...
 */
router.get(
  '/orders',
  asyncHandler(async (req, res) => {
    const { order_id, customer_email } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (order_id) {
      sql += ' WHERE order_id = ?';
      params.push(order_id);
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
 * POST /api/orders
 */
router.post(
  '/orders',
  asyncHandler(async (req, res) => {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    await db.query(
      `INSERT INTO orders (
        order_id, created_at, status, total_amount, payment_method,
        payment_reference, customer_name, customer_email, customer_phone, items
      ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        payload.order_id || null,
        normalizeTimestamp(payload.created_at),
        payload.status || null,
        payload.total_amount || 0,
        payload.payment_method || null,
        payload.payment_reference || null,
        payload.customer_name || null,
        payload.customer_email || null,
        payload.customer_phone || null,
        toJsonString(payload.items),
      ]
    );

    res.status(201).json({ success: true });
  })
);

module.exports = router;
