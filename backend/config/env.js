'use strict';

/**
 * Environment configuration loader.
 *
 * Supports three environments selected via NODE_ENV: development | qa | production
 * It loads the matching .env file (.env.development / .env.qa / .env.production)
 * and falls back to a plain .env if present. On hosted platforms such as
 * Render.com, the variables are injected directly into process.env, so the
 * .env files are only used for local development / testing.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();

// Load environment-specific file first, then a generic .env as fallback.
const envFileName = `.env.${NODE_ENV}`;
const envSpecificPath = path.resolve(__dirname, '..', envFileName);
const envDefaultPath = path.resolve(__dirname, '..', '.env');

if (fs.existsSync(envSpecificPath)) {
  dotenv.config({ path: envSpecificPath });
  console.log(`[env] Loaded environment file: ${envFileName}`);
} else if (fs.existsSync(envDefaultPath)) {
  dotenv.config({ path: envDefaultPath });
  console.log('[env] Loaded environment file: .env');
} else {
  // No file found — rely on platform-injected variables (Render/Railway).
  dotenv.config();
  console.log('[env] No .env file found, using process environment variables.');
}

function toInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseCorsOrigins(value) {
  if (!value || value.trim() === '*' || value.trim() === '') {
    return '*';
  }
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const config = {
  env: NODE_ENV,
  isProduction: NODE_ENV === 'production',
  isQA: NODE_ENV === 'qa',
  isDevelopment: NODE_ENV === 'development',

  // PORT must be dynamic so Render (and other PaaS) can inject it.
  port: toInt(process.env.PORT || process.env.BACKEND_PORT, 5000),

  // CORS allowed origins; "*" allows all. Comma-separate multiple origins.
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),

  // Logging format for morgan (dev | combined | tiny | short | common).
  logFormat: process.env.LOG_FORMAT || (NODE_ENV === 'production' ? 'combined' : 'dev'),

  // Railway MySQL database connection.
  // Railway provides a single MYSQL_URL connection string, but we also
  // support discrete variables for flexibility across environments.
  db: {
    url: process.env.DATABASE_URL || process.env.MYSQL_URL || '',
    host: process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1',
    port: toInt(process.env.DB_PORT || process.env.MYSQLPORT, 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    name: process.env.DB_NAME || process.env.MYSQLDATABASE || 'restaurant_website',
    connectionLimit: toInt(process.env.DB_CONNECTION_LIMIT, 10),
    // Railway requires SSL in many cases; enable when DB_SSL=true.
    ssl: String(process.env.DB_SSL || '').toLowerCase() === 'true',
  },
};

module.exports = config;
