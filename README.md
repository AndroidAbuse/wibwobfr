# YO-KAI WATCH Wibble Wobble — Private Server

A complete private server implementation for the EU version of **YO-KAI WATCH Wibble Wobble** (`com.Level5.YWPEU`), built with Node.js + Fastify and backed by Supabase (PostgreSQL).

> **Legal Disclaimer:** This project is for educational and archival purposes only. You must own a legitimate copy of the game. "YO-KAI WATCH" is a trademark of Level-5 Inc.

---

## Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌───────────┐
│  Patched APK │──HTTP──▶│  Fastify Server  │──SQL──▶│  Supabase │
│  (Android)   │◀───────│  (Railway/VPS)   │◀──────│  (Postgres)│
└─────────────┘        └──────────────────┘        └───────────┘
```

### HSP Auth Flow (real format)

```
1. Client → POST /hsp/lnc         (get server config + timestamp key)
2. Client → POST /hsp/auth/login   { deviceId: "45bc3b4e-547b-436b-afcd-3e8072e7dcc7" }
3. Server → {
     login: {
       oauthprovider: "guest",
       memberNo: "5855000148551792",          ← 16-digit Hangame member ID
       guestLoginAuthData: "a1b2c3d4-...",    ← UUID v4
       authData: "AAAA...long-base64...",     ← 256-byte base64 token
       idpCode: "toast"
     },
     session: { token: "uuid-v4", expiresAt: "..." }
   }
4. Client includes X-Session-Token on all subsequent requests
5. Client → POST /hsp/auth/heartbeat   every 120 s
```

### Emulated Endpoints

| Original URL | Replacement | Purpose |
|---|---|---|
| `http://lnc.gb.hangame.com:10080/hsp/lnc` | `GET/POST /hsp/lnc` | Launch & Config |
| HSP Auth | `POST /hsp/auth/login` | Device/guest login |
| HSP Auth | `POST /hsp/auth/guest` | Alternative guest login |
| HSP Auth | `POST /hsp/auth/logout` | Logout |
| HSP Auth | `POST /hsp/auth/heartbeat` | Keep-alive (120s) |
| HSP Auth | `GET /hsp/auth/userInfo` | User profile |
| Game API | `POST /api/user/register` | Registration |
| Game API | `GET /api/user/data` | Full user data |
| Game API | `GET /api/youkai/list` | Master youkai list |
| Game API | `GET /api/user/youkai` | Player collection |
| Game API | `POST /api/battle/start` | Start battle |
| Game API | `POST /api/battle/result` | Submit score + rewards |
| Game API | `GET /api/theme/list` | Stage list |
| Game API | `POST /api/gacha/pull` | Gacha pull (500 coins) |
| Game API | `GET /api/rank/list` | Leaderboard (top 100) |
| Game API | `POST /api/reward/claim` | Claim reward item |

---

## Master Data (.cud files)

The game's master data is stored in **AES-encrypted `.cud` files** inside the APK's `assets/` directory. The AES key and IV are embedded in `lib/armeabi-v7a/libSGF.so`.

Until those files are decrypted, this server uses **placeholder seed data** in Supabase. Once you extract the key from libSGF.so and decrypt the .cud files, replace the seed data with the real values.

### The 14 master data tables in .cud files

| # | File / Table | Description |
|---|---|---|
| 1 | `youkai_master` | All yo-kai: IDs, names, stats, tribe, element, rarity |
| 2 | `youkai_skill_master` | Soultimate moves: IDs, names, descriptions, power values |
| 3 | `theme_master` | Stages/levels: theme numbers, HP, ATK, time limits, clear points |
| 4 | `item_master` | Consumable items: food, soul secrets, EXP orbs |
| 5 | `reward_master` | Reward definitions: types, quantities, drop tables |
| 6 | `gacha_master` | Gacha banners: pools, rates, featured yo-kai |
| 7 | `gacha_rate_master` | Per-rarity pull probabilities for each gacha pool |
| 8 | `mission_master` | Daily/weekly/event missions and their conditions |
| 9 | `event_master` | Timed events: score attack, scramble battle, etc. |
| 10 | `tribe_master` | Yo-kai tribes (Brave, Mysterious, Tough, etc.) and bonuses |
| 11 | `element_master` | Element type effectiveness chart |
| 12 | `evolution_master` | Yo-kai evolution/fusion recipes |
| 13 | `localization_master` | UI strings (EU languages: EN, FR, DE, ES, IT) |
| 14 | `shop_master` | In-app purchase catalog and coin/gem packages |

### Decryption approach

```python
# Pseudocode — extract AES key from libSGF.so, then:
from Crypto.Cipher import AES
import json

key = bytes.fromhex("...")  # 16 or 32 bytes from libSGF.so
iv  = bytes.fromhex("...")  # 16 bytes from libSGF.so

with open("assets/youkai_master.cud", "rb") as f:
    ct = f.read()

cipher = AES.new(key, AES.MODE_CBC, iv)
pt = cipher.decrypt(ct)
# Remove PKCS7 padding
pad_len = pt[-1]
pt = pt[:-pad_len]
data = json.loads(pt)  # or MessagePack — inspect first bytes
```

> **Tip:** Search for `AES` or `Cipher` cross-references in libSGF.so using Ghidra/IDA. The key is typically in the `.rodata` section near the decryption function.

---

## 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the Supabase dashboard, open **SQL Editor**.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. Go to **Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (NOT `anon`) → `SUPABASE_SERVICE_KEY`

> The schema includes RLS policies that allow full access from the service role key. Never expose the service key to the client.

---

## 2. Local Development

```bash
# Clone and install
git clone <this-repo>
cd yokai-server
npm install

# Create .env from example
cp .env.example .env
# Edit .env with your Supabase credentials

# (Optional) Generate self-signed certs for HTTPS dev
npm run gen-certs

# Start the server
npm start
# or with auto-reload:
npm run dev
```

The server runs on `http://0.0.0.0:3000` by default.

Set `USE_HTTPS=true` in `.env` to enable HTTPS (requires certs).

### Quick test

```bash
# Health check
curl http://localhost:3000/health

# LNC config (what the game fetches on boot)
curl http://localhost:3000/hsp/lnc | jq .

# Guest login
curl -X POST http://localhost:3000/hsp/auth/login \
  -H "Content-Type: application/json" \
  -d '{"deviceId": "45bc3b4e-547b-436b-afcd-3e8072e7dcc7"}' | jq .

# The response includes login.memberNo, login.authData (AAAA... base64), etc.
```

---

## 3. Deploy to Railway

### Step-by-step

1. Push the repo to GitHub.
2. Go to [railway.app](https://railway.app) and create a new project.
3. Click **Deploy from GitHub repo** and select your repository.
4. In the Railway dashboard, go to **Variables** and add:

   | Variable | Value |
   |---|---|
   | `SUPABASE_URL` | `https://your-project.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | `your-service-role-key` |
   | `JWT_SECRET` | A strong random string (e.g. `openssl rand -hex 32`) |
   | `PORT` | `3000` (Railway auto-sets `PORT`, but be explicit) |
   | `GAME_SERVER_URL` | Your Railway public URL (e.g. `https://yokai-server-production.up.railway.app`) |
   | `GAME_SERVER_HOST` | The hostname only (e.g. `yokai-server-production.up.railway.app`) |

5. Railway auto-detects Node.js and runs `npm start`.
6. In **Settings → Networking**, enable the public domain.
7. Note the public URL — you'll need it for the APK patch.

### Verify deployment

```bash
curl https://your-railway-url.up.railway.app/health
# → {"status":"ok","timestamp":"...","version":"1.0.0"}

curl https://your-railway-url.up.railway.app/hsp/lnc
# → {"resultCode":200, "launching":{...}, "timestamp":{"key":"HSP_LNC_NOTICE_TIMESTAMP_10481_2.0.3",...}}
```

---

## 4. Patch the APK

You need:
- The original APK: `com.Level5.YWPEU` (EU version)
- [apktool](https://apktool.org/) v2.9+
- [uber-apk-signer](https://github.com/nicoepp/uber-apk-signer/releases)
- A hex editor (e.g. HxD, hexedit, or Python)

### 4.1 Decompile

```bash
apktool d com.Level5.YWPEU.apk -o ywpeu_mod
```

### 4.2 Redirect LNC endpoint

Edit `ywpeu_mod/res/xml/hsp_launching_zone.xml`:

Replace:
```xml
<zone name="REAL-TOAST">
    <server url="http://lnc.gb.hangame.com:10080/hsp/lnc" />
</zone>
```
With:
```xml
<zone name="REAL-TOAST">
    <server url="https://YOUR-RAILWAY-URL.up.railway.app/hsp/lnc" />
</zone>
```

### 4.3 Redirect game server in libSGF.so

The game server hostname `s-ywp-eu-gameserver.hangame.co.jp` is hardcoded in `lib/armeabi-v7a/libSGF.so`. You must hex-edit it:

```python
#!/usr/bin/env python3
"""hex_patch.py — Replace game server hostname in libSGF.so"""
import sys

LIB_PATH = sys.argv[1] if len(sys.argv) > 1 else "ywpeu_mod/lib/armeabi-v7a/libSGF.so"
OLD_HOST = b"s-ywp-eu-gameserver.hangame.co.jp"
NEW_HOST = b"YOUR-RAILWAY-URL.up.railway.app"  # Must be <= len(OLD_HOST)

# Pad with null bytes if new host is shorter
if len(NEW_HOST) > len(OLD_HOST):
    print(f"ERROR: New host ({len(NEW_HOST)} chars) is longer than old host ({len(OLD_HOST)} chars)")
    sys.exit(1)

NEW_HOST_PADDED = NEW_HOST + b"\x00" * (len(OLD_HOST) - len(NEW_HOST))

with open(LIB_PATH, "rb") as f:
    data = f.read()

count = data.count(OLD_HOST)
if count == 0:
    print("WARNING: Old hostname not found in binary")
else:
    data = data.replace(OLD_HOST, NEW_HOST_PADDED)
    print(f"Replaced {count} occurrence(s)")

with open(LIB_PATH, "wb") as f:
    f.write(data)
print("Done!")
```

```bash
python3 hex_patch.py ywpeu_mod/lib/armeabi-v7a/libSGF.so
```

> **Important:** The new hostname must be **≤ 35 characters** (same length as the original). If your Railway URL is longer, use a custom domain or a URL shortener/reverse proxy.

### 4.4 Allow cleartext traffic

Edit `ywpeu_mod/AndroidManifest.xml`. In the `<application>` tag, add:

```xml
android:networkSecurityConfig="@xml/network_security_config"
```

### 4.5 Create network security config

Create `ywpeu_mod/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">YOUR-RAILWAY-URL.up.railway.app</domain>
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </domain-config>
</network-security-config>
```

### 4.6 Recompile and sign

```bash
# Recompile
apktool b ywpeu_mod -o ywpeu_patched.apk

# Sign (uber-apk-signer auto-generates a debug keystore)
java -jar uber-apk-signer.jar --apks ywpeu_patched.apk

# The signed APK will be: ywpeu_patched-aligned-debugSigned.apk
```

### 4.7 Install

```bash
adb install ywpeu_patched-aligned-debugSigned.apk
```

---

## 5. Server Management

### Supabase Studio

Open your Supabase dashboard to:
- Browse/edit data in the **Table Editor**
- Run custom queries in the **SQL Editor**
- Monitor API usage in **Reports**

### Railway Logs

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and link
railway login
railway link

# View live logs
railway logs
```

### Useful SQL queries

```sql
-- Total registered users
SELECT COUNT(*) FROM users;

-- All users with their HSP member numbers
SELECT username, member_no, rank_points, coins, last_login FROM users
ORDER BY last_login DESC;

-- Top 10 players
SELECT username, rank_points, coins FROM users
ORDER BY rank_points DESC LIMIT 10;

-- Most popular youkai
SELECT y.name, COUNT(*) as owners
FROM user_youkai uy JOIN youkai y ON uy.youkai_id = y.youkai_id
GROUP BY y.name ORDER BY owners DESC;

-- Recent battles
SELECT u.username, br.theme_no, br.score, br.clear_point, br.played_at
FROM battle_results br JOIN users u ON br.user_id = u.id
ORDER BY br.played_at DESC LIMIT 20;
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SUPABASE_URL` | ✅ | — | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | ✅ | — | Supabase service role key |
| `PORT` | ❌ | `3000` | Server port |
| `JWT_SECRET` | ❌ | — | JWT signing secret (reserved for future use) |
| `USE_HTTPS` | ❌ | `false` | Enable HTTPS with self-signed certs |
| `GAME_SERVER_URL` | ❌ | `http://localhost:3000` | Full URL returned in LNC response |
| `GAME_SERVER_HOST` | ❌ | `localhost` | Hostname returned in LNC response |
| `LOG_LEVEL` | ❌ | `info` | Pino log level (trace/debug/info/warn/error) |

---

## Project Structure

```
yokai-server/
├── certs/                      # Self-signed TLS certs (dev only)
├── scripts/
│   └── gen-certs.js            # Certificate generator
├── src/
│   ├── db/
│   │   └── supabase.js         # Supabase client singleton
│   ├── middleware/
│   │   └── auth.js             # Session token validation
│   ├── routes/
│   │   ├── auth.js             # HSP auth endpoints (guest login, memberNo, authData)
│   │   ├── game.js             # Game API endpoints
│   │   └── lnc.js              # Launch & Config endpoint (HSP_LNC_NOTICE_TIMESTAMP)
│   └── server.js               # Fastify app entry point
├── supabase/
│   └── schema.sql              # Full database schema + placeholder seed data
├── test/
│   └── server.test.js          # Automated tests
├── .env.example
├── package.json
└── README.md
```

---

## License

Educational use only. Not affiliated with Level-5, NHN, or Hangame.
