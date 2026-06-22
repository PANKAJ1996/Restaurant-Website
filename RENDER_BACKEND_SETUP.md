# Render.com Deployment (Node/Express API) - Restaurant Website

This guide assumes your backend lives in `backend/` and is a Node/Express API.

## 1) Create the API Web Service on Render
1. Go to **https://render.com** → **New +** → **Web Service**
2. Connect your **GitHub repository** → select the repo containing this project.
3. Configure:
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## 2) Environment Variables (per environment)
Render lets you set environment variables on the service.

### Required
- `NODE_ENV` = `development` / `qa` / `production`
- `PORT` = (Render usually injects automatically; you can leave it blank if Render sets it)

### CORS
- `CORS_ORIGINS` = your frontend origin(s)
  - Example: `https://your-frontend-domain.com`
  - For local testing: `http://localhost:5500`
  - If you want to allow all (not recommended for production): `*`

### Railway MySQL
Railway will provide a connection string. Use:
- `DATABASE_URL` = your Railway MySQL connection string
- `DB_SSL` = `true` (commonly required by Railway)

### Optional (only if you are not using DATABASE_URL)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## 3) API URL for frontend
After the Render service is created, Render provides a base URL like:
- `https://<your-service-name>.onrender.com`

Your API base paths:
- `https://<your-service-name>.onrender.com/api/health`
- `https://<your-service-name>.onrender.com/api/orders`
- `https://<your-service-name>.onrender.com/api/reservations`
- `https://<your-service-name>.onrender.com/api/cancellations`

## 4) Verify CORS
From your website frontend (browser):
- Confirm requests succeed without CORS errors.
- If you see CORS errors, update `CORS_ORIGINS` to exactly match the frontend origin.

## 5) Logging & Error Handling
The API includes:
- Request logging via `morgan`
- Centralized JSON error responses via `backend/middleware/errorHandler.js`

## 6) Local test before pushing
From `backend/`:
- `npm install`
- `npm start`

Then open:
- http://localhost:5000/api/health

