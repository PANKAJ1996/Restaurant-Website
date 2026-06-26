# Deployment setup (Render + Vercel)

This repo contains an Express API in `backend/`.

## Render (Web Service) – DEV / QA / PROD (compact setup)
Create **three** Render services (one per env) OR one service with different env settings:

- **Start Command**: `npm run start`
- **Env vars** per service:
  - DEV: `NODE_ENV=development`
  - QA: `NODE_ENV=qa`
  - PROD: `NODE_ENV=production`
- **Port**: Render injects `PORT` automatically.


### Required Environment Variables (for each service)
Set at least:
- `NODE_ENV` (development | qa | production)
- `CORS_ORIGINS` (frontend URL origin, e.g. `https://your-frontend.vercel.app`)

Database (choose one):
- Preferred: `DATABASE_URL`
- Or discrete variables:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`

## Vercel – REST API compatibility
Vercel does not host a long-running Express server as a traditional VM by default.
The easiest supported approach is to deploy the backend as **serverless functions**.

### Recommended approach (best effort)
1. Keep this Express code.
2. Create Vercel serverless endpoints that call your Express router OR convert routes into `/api/*` handlers.

Because implementing Vercel serverless conversion requires more code generation, this file only documents the env approach.

## Important note about `.env.*-server`
Your server reads:
- `.env.${NODE_ENV}-server` (e.g. `.env.production-server`)
- legacy `.env.${NODE_ENV}`
- finally `../.env`

On Render/Vercel you should set env vars in the platform UI instead of relying on `.env` files.

