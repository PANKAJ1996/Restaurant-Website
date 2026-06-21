# MariaDB Backend Setup

This project now includes a local Flask backend that inserts orders, reservations, and cancellations into MariaDB.

## Install dependencies

From the project folder:

```powershell
python -m pip install -r requirements.txt
```

## Configure the database

Copy `.env.example` to `.env` or export environment variables:

- `DB_HOST` — MariaDB host (default `127.0.0.1`)
- `DB_PORT` — MariaDB port (default `3306`)
- `DB_USER` — MariaDB username
- `DB_PASSWORD` — MariaDB password
- `DB_NAME` — database name (default `restaurant_website`)
- `BACKEND_PORT` — backend port (default `5000`)

## Run the backend

```powershell
python backend.py
```

The server will:

- create the database if it does not exist
- create the required `orders`, `reservations`, and `cancellations` tables
- serve the static website and backend API from the same origin

## Connect the front-end

Open `script.js` and set the backend URL:

```js
const backendConfig = {
  url: 'http://localhost:5000',
};
```

Then open the site in your browser at:

```text
http://localhost:5000
```

## API routes

- `POST /api/orders`
- `POST /api/reservations`
- `POST /api/cancellations`

Each endpoint expects JSON payloads matching the front-end insert logic.
