-- MariaDB setup for Restaurant Website
-- Run this in your local MariaDB shell or using a client.

CREATE DATABASE IF NOT EXISTS restaurant_website;
USE restaurant_website;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_reference VARCHAR(255),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  items JSON NOT NULL,
  INDEX idx_orders_order_id (order_id),
  INDEX idx_orders_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reservation_id VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time VARCHAR(50) NOT NULL,
  guests INT UNSIGNED NOT NULL DEFAULT 1,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  notes TEXT,
  INDEX idx_reservations_reservation_id (reservation_id),
  INDEX idx_reservations_date (reservation_date)
);

CREATE TABLE IF NOT EXISTS cancellations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cancellation_id VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type VARCHAR(50) NOT NULL,
  reference_id VARCHAR(100) NOT NULL,
  reason TEXT,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  INDEX idx_cancellations_cancellation_id (cancellation_id),
  INDEX idx_cancellations_reference_id (reference_id)
);
