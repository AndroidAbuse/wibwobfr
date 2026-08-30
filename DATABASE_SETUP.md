# Database Setup (Supabase)

Run this SQL in the **Supabase SQL Editor** before starting the server.

## Create Tables

```sql
CREATE TABLE IF NOT EXISTS public.account (
  gdkey TEXT PRIMARY KEY,
  ywp_user_tables JSONB,
  last_lgn_time TEXT,
  opening_tutorial_flag BOOLEAN,
  start_date TEXT,
  character_id TEXT UNIQUE,
  user_id TEXT UNIQUE,
  udkey TEXT
);

CREATE TABLE IF NOT EXISTS public.device (
  udkey TEXT PRIMARY KEY,
  gdkeys TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mail (
  mail TEXT PRIMARY KEY,
  "currentUdkey" TEXT
);
```

## Configure the Connection String

In the **Render dashboard**, set the `PostgresConnectionString` environment variable to your Supabase connection string:

```
Host=db.XXXX.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
```

To find your credentials:
1. Go to **Supabase** → **Settings** → **Database**
2. Under **Connection string**, select **.NET**
3. Copy the connection string and replace the password placeholder with your actual database password

## Important Notes

- The `PostgresConnectionString` env var is marked `sync: false` in `render.yaml`, meaning it must be set manually in the Render dashboard (it won't be committed to the repo).
- Never commit database passwords or connection strings to the repository.
- Supabase's free tier connection pool is limited; the server defaults to `MaxConnections: 100` and `MaxCachedAccounts: 100` which should work fine.
