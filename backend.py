import json
import os
import platform
import socket
import subprocess
from datetime import datetime

from flask import Flask, jsonify, request
import pymysql
import pymysql.cursors
from pymysql.err import MySQLError

app = Flask(__name__, static_folder='.', static_url_path='')

DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')
DB_PORT = int(os.environ.get('DB_PORT', '3306'))
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'root')
DB_NAME = os.environ.get('DB_NAME', 'restaurant_website')
BACKEND_PORT = int(os.environ.get('BACKEND_PORT', '5000'))

DB_CONFIG = {
    'host': DB_HOST,
    'port': DB_PORT,
    'user': DB_USER,
    'password': DB_PASSWORD,
    'database': DB_NAME,
    'autocommit': True,
}


def get_local_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(('8.8.8.8', 80))
            return sock.getsockname()[0]
    except OSError:
        return None


def open_windows_firewall_port(port):
    if platform.system() != 'Windows':
        return

    rule_name = 'Restaurant Website Backend'
    try:
        check = subprocess.run(
            ['netsh', 'advfirewall', 'firewall', 'show', 'rule', f'name={rule_name}'],
            capture_output=True,
            text=True,
            check=False,
        )
        if 'No rules match the specified criteria' not in check.stdout:
            print(f'Windows firewall rule already exists: {rule_name}')
            return

        subprocess.run(
            [
                'netsh',
                'advfirewall',
                'firewall',
                'add',
                'rule',
                f'name={rule_name}',
                'dir=in',
                'action=allow',
                'protocol=TCP',
                f'localport={port}',
                'profile=private',
                'enable=yes',
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        print(f'Opened port {port} in Windows firewall for inbound connections.')
    except subprocess.CalledProcessError as error:
        print('Could not open Windows firewall port automatically.')
        print(error.stdout or error.stderr or str(error))


def get_db_connection(use_database=True):
    config = {
        'host': DB_HOST,
        'port': DB_PORT,
        'user': DB_USER,
        'password': DB_PASSWORD,
        'charset': 'utf8mb4',
        'cursorclass': pymysql.cursors.DictCursor,
        'autocommit': True,
    }
    if use_database:
        config['database'] = DB_NAME
    return pymysql.connect(**config)


def ensure_database():
    try:
        connection = get_db_connection(use_database=False)
        cursor = connection.cursor()
        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` "
            "DEFAULT CHARACTER SET utf8mb4 "
            "COLLATE utf8mb4_unicode_ci"
        )
        cursor.close()
        connection.close()
    except MySQLError as error:
        raise RuntimeError(f"Could not create database: {error}")


def init_tables():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
    )

    cursor.execute(
        """
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
    )

    cursor.execute(
        """
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
    )

    cursor.close()
    connection.close()


def parse_timestamp(value):
    if not value:
        return None
    if isinstance(value, str):
        if value.endswith('Z'):
            value = value[:-1] + '+00:00'
        try:
            dt = datetime.fromisoformat(value)
            return dt.strftime('%Y-%m-%d %H:%M:%S')
        except ValueError:
            return value
    return value


def json_string(value):
    if isinstance(value, str):
        try:
            json.loads(value)
            return value
        except json.JSONDecodeError:
            return json.dumps(value)
    return json.dumps(value or [])


@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


def query_table(table, where_clause=None, params=None, limit=50):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = f"SELECT * FROM {table}"
    if where_clause:
        query += f" WHERE {where_clause}"
    query += " ORDER BY id DESC LIMIT %s"
    params = params or []
    params.append(limit)
    cursor.execute(query, params)
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return rows


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'database': DB_NAME})


@app.route('/api/orders', methods=['GET', 'POST'])
def orders():
    if request.method == 'POST':
        payload = request.get_json(force=True)
        if not payload:
            return jsonify({'error': 'Invalid JSON payload'}), 400

        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                INSERT INTO orders (
                    order_id,
                    created_at,
                    status,
                    total_amount,
                    payment_method,
                    payment_reference,
                    customer_name,
                    customer_email,
                    customer_phone,
                    items
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    payload.get('order_id'),
                    parse_timestamp(payload.get('created_at')),
                    payload.get('status'),
                    payload.get('total_amount'),
                    payload.get('payment_method'),
                    payload.get('payment_reference'),
                    payload.get('customer_name'),
                    payload.get('customer_email'),
                    payload.get('customer_phone'),
                    json_string(payload.get('items')),
                ),
            )
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({'success': True}), 201
        except MySQLError as error:
            return jsonify({'error': str(error)}), 500

    order_id = request.args.get('order_id')
    customer_email = request.args.get('customer_email')
    if order_id:
        rows = query_table('orders', 'order_id = %s', [order_id])
    elif customer_email:
        rows = query_table('orders', 'customer_email = %s', [customer_email])
    else:
        rows = query_table('orders')
    return jsonify(rows)


@app.route('/api/reservations', methods=['GET', 'POST'])
def reservations():
    if request.method == 'POST':
        payload = request.get_json(force=True)
        if not payload:
            return jsonify({'error': 'Invalid JSON payload'}), 400

        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                INSERT INTO reservations (
                    reservation_id,
                    created_at,
                    status,
                    reservation_date,
                    reservation_time,
                    guests,
                    customer_name,
                    customer_email,
                    customer_phone,
                    notes
                ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    payload.get('reservation_id'),
                    parse_timestamp(payload.get('created_at')),
                    payload.get('status'),
                    payload.get('reservation_date'),
                    payload.get('reservation_time'),
                    payload.get('guests'),
                    payload.get('customer_name'),
                    payload.get('customer_email'),
                    payload.get('customer_phone'),
                    payload.get('notes'),
                ),
            )
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({'success': True}), 201
        except MySQLError as error:
            return jsonify({'error': str(error)}), 500

    reservation_id = request.args.get('reservation_id')
    customer_email = request.args.get('customer_email')
    if reservation_id:
        rows = query_table('reservations', 'reservation_id = %s', [reservation_id])
    elif customer_email:
        rows = query_table('reservations', 'customer_email = %s', [customer_email])
    else:
        rows = query_table('reservations')
    return jsonify(rows)


@app.route('/api/cancellations', methods=['GET', 'POST'])
def cancellations():
    if request.method == 'POST':
        payload = request.get_json(force=True)
        if not payload:
            return jsonify({'error': 'Invalid JSON payload'}), 400

        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute(
                """
                INSERT INTO cancellations (
                    cancellation_id,
                    created_at,
                    type,
                    reference_id,
                    reason,
                    amount
                ) VALUES (%s,%s,%s,%s,%s,%s)
                """,
                (
                    payload.get('cancellation_id'),
                    parse_timestamp(payload.get('created_at')),
                    payload.get('type'),
                    payload.get('reference_id'),
                    payload.get('reason'),
                    payload.get('amount'),
                ),
            )
            connection.commit()
            cursor.close()
            connection.close()
            return jsonify({'success': True}), 201
        except MySQLError as error:
            return jsonify({'error': str(error)}), 500

    cancellation_id = request.args.get('cancellation_id')
    reference_id = request.args.get('reference_id')
    if cancellation_id:
        rows = query_table('cancellations', 'cancellation_id = %s', [cancellation_id])
    elif reference_id:
        rows = query_table('cancellations', 'reference_id = %s', [reference_id])
    else:
        rows = query_table('cancellations')
    return jsonify(rows)




@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_static(path):
    if os.path.isfile(path):
        return app.send_static_file(path)
    return app.send_static_file('index.html')


if __name__ == '__main__':
    try:
        ensure_database()
        init_tables()
    except RuntimeError as error:
        print(f'Failed to initialize MariaDB: {error}')
        exit(1)

    open_windows_firewall_port(BACKEND_PORT)
    local_ip = get_local_ip()
    print(f'Starting backend on http://0.0.0.0:{BACKEND_PORT}')
    if local_ip:
        print(f'Access from other network devices at: http://{local_ip}:{BACKEND_PORT}/')
    else:
        print('Could not detect local network IP. Use localhost or check your network settings.')
    app.run(host='0.0.0.0', port=BACKEND_PORT, debug=True)
