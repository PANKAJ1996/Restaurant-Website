'use strict';

/**
 * MySQL connection pool (Railway-hosted MySQL compatible).
 *
 * Uses mysql2/promise. Connection details are resolved from config/env.js,
 * which reads either a single DATABASE_URL/MYSQL_URL connection string
 * (preferred on Railway) or discrete host/port/user/password variables.
 */

const mysql = require('mysql2/promise');
const config = require('./env');

function buildPoolOptions() {
  const base = {
    waitForConnections: true,
    connectionLimit: config.db.connectionLimit,
    queueLimit: 0,
    charset: 'utf8mb4',
  };

  if (config.db.ssl) {
    base.ssl = { rejectUnauthorized: false };
  }

  // Prefer the full connection string if provided (Railway MYSQL_URL).
  if (config.db.url) {
    return { uri: config.db.url, ...base };
  }

  return {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    ...base,
  };
}

const poolOptions = buildPoolOptions();
const pool = poolOptions.uri
  ? mysql.createPool(poolOptions.uri)
  : mysql.createPool(poolOptions);

/**
 * Run a query against the pool.
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<Array>}
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Verify the database is reachable. Throws on failure.
 */
async function ping() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}

module.exports = { pool, query, ping };
