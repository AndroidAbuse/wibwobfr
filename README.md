# Puniemu — YO-KAI WATCH Wibble Wobble Private Server

A .NET 8 (ASP.NET Core) server emulator for **YO-KAI WATCH Wibble Wobble** (EU/FR version), powered by [Puniemu](https://github.com/SuperTavor/puniemu) and deployed on **Render.com** with **Supabase PostgreSQL**.

> **Legal Disclaimer:** This project is for educational and archival purposes only. You must own a legitimate copy of the game. "YO-KAI WATCH" is a trademark of Level-5 Inc.

---

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌───────────┐
│  Patched APK │──HTTP──▶│  Puniemu (.NET 8)│──SQL──▶│  Supabase │
│  (Android)   │◀───────│  (Render.com)    │◀──────│  (Postgres)│
└─────────────┘        └──────────────────┘        └───────────┘
```

## Quick Start

### 1. Set Up Supabase Database

Follow [DATABASE_SETUP.md](DATABASE_SETUP.md) to create the required tables in Supabase.

### 2. Deploy to Render

1. Fork or connect this repository to your [Render](https://render.com) account.
2. Render will auto-detect the `render.yaml` blueprint.
3. Create a new **Blueprint Instance** from this repo.
4. In the Render dashboard, set the `PostgresConnectionString` secret:
   ```
   Host=db.XXXX.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
   ```
5. Deploy. The server will build via Docker and start listening on port 8080.

### 3. Configure Your Game Client

Point your patched APK's server URL to your Render deployment URL (e.g., `https://puniemu-wibwob.onrender.com`).

## Configuration

All configuration is via environment variables (set in Render dashboard or `render.yaml`):

| Variable | Default | Description |
|---|---|---|
| `PostgresConnectionString` | *(secret)* | Supabase PostgreSQL connection string |
| `IsWibWob` | `true` | Enable Wibble Wobble mode (vs Puni Puni) |
| `GameVersion` | `4.0.6` | Expected game client version |
| `ServerName` | `WibWob FR` | Server display name |
| `MaxConnections` | `100` | Max concurrent Kestrel connections |
| `MaxCachedAccounts` | `100` | Max accounts held in memory cache |
| `DataDownloadURL` | `0` | `0` = use Supabase storage for game data |
| `PORT` | `8080` | HTTP listen port (Render injects this) |

## Tech Stack

- **.NET 8** / ASP.NET Core (minimal API)
- **Npgsql** (raw PostgreSQL driver, no Entity Framework)
- **Newtonsoft.Json** for request/response serialization
- **Docker** multi-stage build (SDK → runtime)
- **Render.com** for hosting (free tier compatible)
- **Supabase** for PostgreSQL database

## Credits

- [Puniemu](https://github.com/SuperTavor/puniemu) by SuperTavor — the original server emulator
- This deployment configured for Render.com + Supabase

## License

See the original [Puniemu repository](https://github.com/SuperTavor/puniemu) for license details.
