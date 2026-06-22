# MariaDB SQL Queries for Order, Reservation & Cancellation Verification

This document contains SQL queries to verify all customer data stored in MariaDB.

---

## Connection

```bash
mysql -u root -proot -e "USE restaurant_website; <query>"
```

Or connect first:
```bash
mysql -u root -proot
mysql> USE restaurant_website;
mysql> <query>
```

---

## 1. ORDERS VERIFICATION

### View all orders
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### View specific columns (cleaner)
```sql
SELECT order_id, customer_name, customer_email, total_amount, status, created_at 
FROM orders 
ORDER BY created_at DESC;
```

### Find orders by customer email
```sql
SELECT * FROM orders 
WHERE customer_email = 'pankaj@example.com' 
ORDER BY created_at DESC;
```

### Find orders by customer name
```sql
SELECT * FROM orders 
WHERE customer_name LIKE '%Pankaj%' 
ORDER BY created_at DESC;
```

### Find specific order by order_id
```sql
SELECT * FROM orders 
WHERE order_id = 'TEST-ORDER-001';
```

### Get order statistics
```sql
SELECT 
    COUNT(*) AS total_orders,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS average_order_value,
    MAX(total_amount) AS highest_order,
    MIN(total_amount) AS lowest_order
FROM orders;
```

### Orders placed in last 7 days
```sql
SELECT order_id, customer_name, customer_email, total_amount, created_at 
FROM orders 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
ORDER BY created_at DESC;
```

### Count orders by payment method
```sql
SELECT payment_method, COUNT(*) as count 
FROM orders 
GROUP BY payment_method;
```

### Count orders by status
```sql
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;
```

### Get total revenue
```sql
SELECT SUM(total_amount) AS total_revenue FROM orders;
```

### Export orders to CSV format
```sql
SELECT order_id, created_at, status, total_amount, payment_method, customer_name, customer_email, customer_phone 
FROM orders 
INTO OUTFILE '/tmp/orders.csv' 
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"' 
LINES TERMINATED BY '\n';
```

---

## 2. RESERVATIONS VERIFICATION

### View all reservations
```sql
SELECT * FROM reservations ORDER BY reservation_date DESC;
```

### View specific columns
```sql
SELECT reservation_id, customer_name, customer_email, reservation_date, reservation_time, guests, status, created_at 
FROM reservations 
ORDER BY reservation_date DESC;
```

### Find reservations by customer email
```sql
SELECT * FROM reservations 
WHERE customer_email = 'pankaj@example.com' 
ORDER BY reservation_date DESC;
```

### Find reservations for today
```sql
SELECT * FROM reservations 
WHERE DATE(reservation_date) = CURDATE() 
ORDER BY reservation_time;
```

### Find upcoming reservations (next 30 days)
```sql
SELECT * FROM reservations 
WHERE reservation_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
ORDER BY reservation_date, reservation_time;
```

### Count reservations by status
```sql
SELECT status, COUNT(*) as count 
FROM reservations 
GROUP BY status;
```

### Get reservation statistics
```sql
SELECT 
    COUNT(*) AS total_reservations,
    AVG(guests) AS average_guests,
    MAX(guests) AS max_guests,
    MIN(guests) AS min_guests
FROM reservations;
```

### Find reservations for specific date
```sql
SELECT * FROM reservations 
WHERE reservation_date = '2026-06-25' 
ORDER BY reservation_time;
```

### Count reservations by time
```sql
SELECT reservation_time, COUNT(*) as count 
FROM reservations 
GROUP BY reservation_time 
ORDER BY reservation_time;
```

---

## 3. CANCELLATIONS VERIFICATION

### View all cancellations
```sql
SELECT * FROM cancellations ORDER BY created_at DESC;
```

### View specific columns
```sql
SELECT cancellation_id, created_at, type, reference_id, reason, amount 
FROM cancellations 
ORDER BY created_at DESC;
```

### Find cancellations by reference (order or reservation ID)
```sql
SELECT * FROM cancellations 
WHERE reference_id = 'TEST-ORDER-001' 
ORDER BY created_at DESC;
```

### Get total refunded amount
```sql
SELECT 
    SUM(amount) AS total_refunded,
    COUNT(*) AS total_cancellations,
    AVG(amount) AS average_refund
FROM cancellations;
```

### Count cancellations by type
```sql
SELECT type, COUNT(*) as count, SUM(amount) as total_refunded 
FROM cancellations 
GROUP BY type;
```

### Cancellations in last 7 days
```sql
SELECT cancellation_id, reference_id, reason, amount, created_at 
FROM cancellations 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
ORDER BY created_at DESC;
```

---

## 4. COMBINED / DASHBOARD QUERIES

### Daily orders and revenue
```sql
SELECT 
    DATE(created_at) AS date,
    COUNT(*) AS orders,
    SUM(total_amount) AS revenue
FROM orders 
GROUP BY DATE(created_at) 
ORDER BY date DESC;
```

### Weekly summary
```sql
SELECT 
    WEEK(created_at) AS week,
    YEAR(created_at) AS year,
    COUNT(*) AS total_orders,
    SUM(total_amount) AS revenue,
    AVG(total_amount) AS avg_order
FROM orders 
GROUP BY YEAR(created_at), WEEK(created_at) 
ORDER BY year DESC, week DESC;
```

### Customer lifetime value
```sql
SELECT 
    customer_email,
    customer_name,
    COUNT(*) AS total_orders,
    SUM(total_amount) AS lifetime_value,
    MAX(created_at) AS last_order_date
FROM orders 
GROUP BY customer_email, customer_name 
ORDER BY lifetime_value DESC;
```

### Top customers
```sql
SELECT 
    customer_name,
    customer_email,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_spent
FROM orders 
GROUP BY customer_email, customer_name 
ORDER BY total_spent DESC 
LIMIT 10;
```

---

## 5. TABLE STRUCTURE VERIFICATION

### Show orders table structure
```sql
DESCRIBE orders;
```

### Show reservations table structure
```sql
DESCRIBE reservations;
```

### Show cancellations table structure
```sql
DESCRIBE cancellations;
```

### Show all tables in database
```sql
SHOW TABLES;
```

### Show database size
```sql
SELECT 
    TABLE_NAME,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'restaurant_website';
```

---

## 6. QUICK CHECKS

### Count total records in each table
```sql
SELECT 
    'orders' AS table_name, COUNT(*) AS record_count FROM orders
UNION ALL
SELECT 'reservations', COUNT(*) FROM reservations
UNION ALL
SELECT 'cancellations', COUNT(*) FROM cancellations;
```

### Last 5 orders
```sql
SELECT * FROM orders ORDER BY id DESC LIMIT 5;
```

### Last 5 reservations
```sql
SELECT * FROM reservations ORDER BY id DESC LIMIT 5;
```

### Check data integrity
```sql
SELECT 
    'Missing customer_email in orders' AS issue FROM orders WHERE customer_email IS NULL
UNION ALL
SELECT 'Missing customer_email in reservations' FROM reservations WHERE customer_email IS NULL
UNION ALL
SELECT 'Missing total_amount in orders' FROM orders WHERE total_amount IS NULL;
```

---

## Usage Examples

Run from terminal:

```bash
# View all orders
mysql -u root -proot restaurant_website -e "SELECT * FROM orders ORDER BY created_at DESC;"

# Find by email
mysql -u root -proot restaurant_website -e "SELECT * FROM orders WHERE customer_email='pankaj@example.com';"

# Get statistics
mysql -u root -proot restaurant_website -e "SELECT COUNT(*) as total_orders, SUM(total_amount) as revenue FROM orders;"
```

---

## Notes

- All timestamps are stored in UTC
- Customer email is the primary identifier for filtering
- Items in orders are stored as JSON in the `items` column
- Status values: 'pending', 'completed', 'cancelled', 'confirmed', etc.
- Always use `ORDER BY created_at DESC` to get newest first
