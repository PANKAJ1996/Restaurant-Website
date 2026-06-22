- [x] Create backend/server.js (Express app entrypoint): JSON parser, CORS, logger middleware, mount routes under /api, notFound + error middleware, dynamic PORT.

- [x] Add optional env templates: backend/.env.development, backend/.env.qa, backend/.env.production.

- [x] Update DEPLOYMENT_GUIDE.md with Render.com + Railway MySQL (DATABASE_URL, SSL) + CORS_ORIGINS instructions.

- [ ] Run local test: npm install (backend) + npm start; verify GET /api/health.

- [ ] Provide the API base URL format for Render once deployed (https://<service>.onrender.com/api).

