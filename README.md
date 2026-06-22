# Food Restaurant Website (Static)

This is a self-contained, static website (HTML/CSS/JS) with:
- Home / About / Menu / Services pages
- Contact form with validation
- Gallery page with food photography
- Online ordering cart (client-side) with localStorage persistence
- Reservation booking form with confirmation page
- Admin-like menu management (client-side) with localStorage persistence

## How to run
- Easiest: open `index.html` in your browser.
- Or run a local server from the folder:
  - Python: `python -m http.server 5500`
  - Then open: http://localhost:5500

## Admin notes
- Admin page uses browser localStorage only.
- This repository now includes an optional Flask/MariaDB backend for orders, reservations, and cancellations.

## Local backend API
This project now includes an optional Flask/MariaDB backend for orders, reservations, and cancellations.

### Run locally
1. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```
2. Start the backend:
   ```powershell
   python backend.py
   ```
3. Open the site and API locally:
   - Website: `http://127.0.0.1:5000/`
   - API base: `http://127.0.0.1:5000/api`

### API endpoints
- `GET http://127.0.0.1:5000/api/health`
- `GET/POST http://127.0.0.1:5000/api/orders`
- `GET/POST http://127.0.0.1:5000/api/reservations`
- `GET/POST http://127.0.0.1:5000/api/cancellations`

### Verify customer orders
- To see all orders: `GET http://127.0.0.1:5000/api/orders`
- To filter by customer email: `GET http://127.0.0.1:5000/api/orders?customer_email=you@example.com`
- To verify a specific order: `GET http://127.0.0.1:5000/api/orders?order_id=<order_id>`

The backend stores orders in MariaDB, so successful POSTs from the site are persisted and can be verified with these endpoints.
