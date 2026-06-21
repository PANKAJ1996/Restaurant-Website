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
