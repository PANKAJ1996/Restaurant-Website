'use strict';

/**
 * Logging middleware built on top of morgan.
 * The log format is environment-driven (dev locally, combined in production).
 */

const morgan = require('morgan');
const config = require('../config/env');

const requestLogger = morgan(config.logFormat);

module.exports = requestLogger;
