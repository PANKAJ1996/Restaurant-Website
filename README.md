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

## Public backend tunnel
To expose the local backend with a public URL, use the new helper script:

```powershell
python -m pip install -r requirements.txt
python start_public_backend.py <your-ngrok-auth-token>
```

Then copy the printed `Public backend URL` into `script.js` as `backendConfig.url`.

If you want the backend accessible from any mobile network, ngrok is the easiest option.
