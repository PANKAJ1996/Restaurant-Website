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
  // Also allow forcing a specific auth plugin for compatibility issues.
  if (config.db.url) {
    const authPlugins = {};

    // If you hit errors like "auth_gssapi_client" plugin mismatch,
    // set FORCE_MYSQL_AUTH_PLUGIN to one of: mysql_native_password | caching_sha2_password.
    // This is optional and only affects compatibility edge-cases.
    const forcedPlugin = process.env.FORCE_MYSQL_AUTH_PLUGIN;
    if (forcedPlugin === 'mysql_native_password' || forcedPlugin === 'caching_sha2_password') {
      // mysql2 supports authPlugins option with plugin-name keys.
      authPlugins[forcedPlugin] = require(`mysql2/lib/auth_plugins/${forcedPlugin}`);
    }

    return { uri: config.db.url, ...base, ...(Object.keys(authPlugins).length ? { authPlugins } : {}) };
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

function isAuthPluginMismatchError(err) {
  const msg = String(err && (err.message || err.toString() || err.code || ''));

  // Common patterns across mysql/mariadb/edge proxies.
  return (
    /auth.*plugin/i.test(msg) ||
    /plugin.*mismatch/i.test(msg) ||
    /caching_sha2_password/i.test(msg) ||
    /mysql_native_password/i.test(msg) ||
    /gssapi_client/i.test(msg)
  );
}

function applyFallbackAuthPlugin(poolOpts, pluginName) {
  // mysql2 accepts authPlugins only when using credentials objects.
  // For URI pools, mysql2 forwards options; supplying authPlugins still works.
  const authPlugins = {
    [pluginName]: require(`mysql2/lib/auth_plugins/${pluginName}`),
  };

  // If buildPoolOptions returned { uri, ... } we preserve it.
  return {
    ...poolOpts,
    ...(poolOpts.uri ? { uri: poolOpts.uri } : null),
    authPlugins,
  };
}

function createPoolWithPossibleFallback() {
  const poolOpts = buildPoolOptions();

  // If user already forced a plugin, don't second-guess.
  const forcedPlugin = process.env.FORCE_MYSQL_AUTH_PLUGIN;
  const hasForced = forcedPlugin === 'mysql_native_password' || forcedPlugin === 'caching_sha2_password';

  try {
    return poolOpts.uri ? mysql.createPool(poolOpts.uri) : mysql.createPool(poolOpts);
  } catch (err) {
    if (hasForced || !isAuthPluginMismatchError(err)) throw err;

    // Try the two most compatible plugins.
    for (const plugin of ['mysql_native_password', 'caching_sha2_password']) {
      try {
        const nextOpts = applyFallbackAuthPlugin(poolOpts, plugin);
        return nextOpts.uri ? mysql.createPool(nextOpts.uri) : mysql.createPool(nextOpts);
      } catch (e2) {
        // continue
      }
    }

    throw err;
  }
}

const pool = createPoolWithPossibleFallback();


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
