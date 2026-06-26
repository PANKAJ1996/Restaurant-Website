# Railway MySQL Connection Testing (DATABASE_URL)

This backend is already wired to use **Railway’s MySQL “Connection string”** via the `DATABASE_URL` environment variable.

## How the code uses it
- `backend/config/env.js` reads:
  - `process.env.DATABASE_URL` (preferred)
- `backend/config/db.js` creates a MySQL pool using that URI.

## What to set in Railway
Set these environment variables on your Railway service/app:

1) **DATABASE_URL**
- Copy/paste the Railway MySQL **Connection string** here.

2) **DB_SSL**
- Often required by Railway. Set:
  - `DB_SSL=true`

3) (If you see MySQL auth-plugin errors like `auth_gssapi_client`)
- Force a compatible plugin:
  - `FORCE_MYSQL_AUTH_PLUGIN=mysql_native_password`

If that fails, switch to:
- `FORCE_MYSQL_AUTH_PLUGIN=caching_sha2_password`

## Local test in your repo
From the repo root:
```powershell
cd d:\WebUIdesign\Restaurant-Website
node -e "const { ping } = require('./backend/config/db'); ping().then(()=>{console.log('DB ping: OK');}).catch((e)=>{console.error('DB ping: FAILED'); console.error(e); process.exit(1);});"
```

### Notes
- Local testing requires the same env vars to be available to Node (either via a `.env.development-server` file or by setting process environment variables).
- If you are not using `DATABASE_URL` locally, you can alternatively use discrete vars (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

