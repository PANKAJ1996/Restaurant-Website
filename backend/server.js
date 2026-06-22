'use strict';

const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const requestLogger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const healthRoutes = require('./routes/health');
const ordersRoutes = require('./routes/orders');
const reservationsRoutes = require('./routes/reservations');
const cancellationsRoutes = require('./routes/cancellations');

const app = express();

// --- JSON parser ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- CORS middleware ---
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

// --- Logging middleware ---
app.use(requestLogger);

// --- Routes ---
app.get('/', (req, res) => {
  res.json({
    name: 'restaurant-website-backend',
    environment: config.env,
    service: 'api',
    apiBase: '/api',
  });
});

app.use('/api', healthRoutes);
app.use('/api', ordersRoutes);
app.use('/api', reservationsRoutes);
app.use('/api', cancellationsRoutes);

// --- 404 + Error middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Dynamic port ---
app.listen(config.port, () => {
  console.log(`API server listening on port ${config.port} (env: ${config.env})`);
});

