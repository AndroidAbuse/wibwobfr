-- ============================================================
-- YO-KAI WATCH Wibble Wobble Private Server — Supabase Schema
-- ============================================================
-- NOTE: The game's master data is stored in AES-encrypted .cud
-- files inside the APK (key is embedded in libSGF.so). The seed
-- data below is placeholder/approximation until those files are
-- decrypted. See README § "Master Data (.cud files)" for the
-- full list of 14 master tables.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id     TEXT UNIQUE NOT NULL,
    member_no     TEXT UNIQUE NOT NULL,                 -- HSP memberNo, 16-digit integer string
    username      TEXT NOT NULL DEFAULT 'Newcomer',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login    TIMESTAMPTZ NOT NULL DEFAULT now(),
    coins         BIGINT NOT NULL DEFAULT 5000,
    gems          BIGINT NOT NULL DEFAULT 100,
    rank_points   BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_users_device    ON users(device_id);
CREATE INDEX idx_users_member_no ON users(member_no);

-- ============================================================
-- YOUKAI  (master catalogue — placeholder until .cud decrypted)
-- ============================================================
CREATE TABLE youkai (
    youkai_id     INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    max_hp        INTEGER NOT NULL DEFAULT 100,
    base_atk      INTEGER NOT NULL DEFAULT 10,
    base_def      INTEGER NOT NULL DEFAULT 10,
    rarity        INTEGER NOT NULL DEFAULT 1,          -- 1=E … 5=S
    element       TEXT NOT NULL DEFAULT 'normal',      -- fire, water, lightning, earth, ice, normal, dark, light
    skill_name    TEXT NOT NULL DEFAULT 'None'
);

-- ============================================================
-- USER_YOUKAI  (player collection)
-- ============================================================
CREATE TABLE user_youkai (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    youkai_id     INTEGER NOT NULL REFERENCES youkai(youkai_id),
    level         INTEGER NOT NULL DEFAULT 1,
    skill_lv      INTEGER NOT NULL DEFAULT 1,
    hp            INTEGER NOT NULL DEFAULT 100,
    atk_power     INTEGER NOT NULL DEFAULT 10,
    obtained_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, youkai_id)
);

CREATE INDEX idx_uyoukai_user ON user_youkai(user_id);

-- ============================================================
-- THEMES  (stages / levels — placeholder until .cud decrypted)
-- ============================================================
CREATE TABLE themes (
    theme_no              INTEGER PRIMARY KEY,
    idx                   INTEGER NOT NULL DEFAULT 0,
    theme_type            INTEGER NOT NULL DEFAULT 1,
    condition_val1        INTEGER NOT NULL DEFAULT 0,
    condition_val2        INTEGER NOT NULL DEFAULT 0,
    condition_val3        INTEGER NOT NULL DEFAULT 0,
    condition_youkai_id   INTEGER NOT NULL DEFAULT 0,
    theme_sec             INTEGER NOT NULL DEFAULT 20,
    theme_hp              INTEGER NOT NULL DEFAULT 1000,
    theme_attack_power    INTEGER NOT NULL DEFAULT 100,
    theme_clear_point     INTEGER NOT NULL DEFAULT 100
);

-- ============================================================
-- BATTLE_RESULTS
-- ============================================================
CREATE TABLE battle_results (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme_no      INTEGER NOT NULL REFERENCES themes(theme_no),
    score         INTEGER NOT NULL DEFAULT 0,
    clear_point   INTEGER NOT NULL DEFAULT 0,
    rewards       JSONB NOT NULL DEFAULT '[]'::jsonb,
    played_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_battle_user ON battle_results(user_id);
CREATE INDEX idx_battle_theme ON battle_results(theme_no);

-- ============================================================
-- REWARDS  (master catalogue — placeholder until .cud decrypted)
-- ============================================================
CREATE TABLE rewards (
    reward_id     INTEGER PRIMARY KEY,
    reward_type   INTEGER NOT NULL DEFAULT 1,   -- 1=coin, 2=gem, 3=youkai, 4=item
    name          TEXT NOT NULL,
    description   TEXT NOT NULL DEFAULT '',
    quantity      INTEGER NOT NULL DEFAULT 1
);

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE sessions (
    session_token TEXT PRIMARY KEY,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
    device_id     TEXT NOT NULL
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_youkai    ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE youkai         ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards        ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (the server uses service key)
CREATE POLICY "service_all_users"          ON users          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_user_youkai"    ON user_youkai    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_battle_results" ON battle_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_sessions"       ON sessions       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_youkai"         ON youkai         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_themes"         ON themes         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_all_rewards"        ON rewards        FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA — Youkai  (placeholder until .cud master data decrypted)
-- ============================================================
INSERT INTO youkai (youkai_id, name, max_hp, base_atk, base_def, rarity, element, skill_name) VALUES
  (2213000, 'Jibanyan',        250, 120, 80,  4, 'fire',      'Paws of Fury'),
  (2213001, 'Komasan',         230, 100, 90,  3, 'ice',       'Spirit Dance'),
  (2213002, 'Whisper',         200, 70,  110, 2, 'normal',    'Knowledge Boost'),
  (2213003, 'Noko',            180, 60,  100, 1, 'earth',     'Lucky Aura'),
  (2213004, 'Robonyan',        300, 140, 130, 5, 'lightning', 'Rocket Punch'),
  (2213005, 'Shogunyan',       320, 160, 100, 5, 'fire',      'Bonito Blade'),
  (2213006, 'Komajiro',        220, 95,  85,  3, 'lightning', 'Wild Zaps'),
  (2213007, 'Walkappa',        210, 105, 75,  2, 'water',     'Mega Waterfall'),
  (2213008, 'Tattletell',      190, 80,  70,  2, 'normal',    'Loving Slap'),
  (2213009, 'Manjimutt',       170, 55,  60,  1, 'earth',     'Puppy Eyes'),
  (2213010, 'Blazion',         260, 130, 90,  4, 'fire',      'Blazing Fist'),
  (2213011, 'Frostina',        240, 115, 105, 4, 'ice',       'Blizzard'),
  (2213012, 'Kyubi',           350, 170, 110, 5, 'fire',      'Inferno'),
  (2213013, 'Venoct',          340, 165, 120, 5, 'water',     'Octo Snake'),
  (2213014, 'Dracunyan',       200, 90,  85,  3, 'dark',      'Vampire Fang'),
  (2213015, 'Hidabat',         180, 75,  65,  1, 'dark',      'Leech'),
  (2213016, 'Dimmy',           175, 65,  55,  1, 'normal',    'Fade Away'),
  (2213017, 'Hungramps',       195, 85,  80,  2, 'normal',    'Hunger Aura'),
  (2213018, 'Happierre',       210, 70,  100, 2, 'light',     'Happy Song'),
  (2213019, 'Tengloom',        200, 90,  75,  2, 'dark',      'Gloom Parade');

-- ============================================================
-- SEED DATA — Themes  (placeholder until .cud master data decrypted)
-- ============================================================
INSERT INTO themes (theme_no, idx, theme_type, condition_val1, condition_val2, condition_val3, condition_youkai_id, theme_sec, theme_hp, theme_attack_power, theme_clear_point) VALUES
  (1,  0, 1, 0,  0, 0, 0, 60,  500,   50,  100),
  (2,  1, 1, 1,  0, 0, 0, 60,  700,   70,  150),
  (3,  2, 1, 2,  0, 0, 0, 55,  900,   90,  200),
  (4,  3, 1, 3,  0, 0, 0, 55,  1100,  110, 250),
  (5,  4, 1, 4,  0, 0, 0, 50,  1300,  130, 300),
  (6,  5, 2, 5,  0, 0, 2213000, 50,  1500, 150, 400),
  (7,  6, 1, 6,  0, 0, 0, 50,  1700,  170, 450),
  (8,  7, 1, 7,  0, 0, 0, 45,  2000,  200, 500),
  (9,  8, 2, 8,  0, 0, 2213004, 45,  2500, 250, 600),
  (10, 9, 1, 9,  0, 0, 0, 40,  3000,  300, 750),
  (11, 10, 1, 10, 0, 0, 0, 40,  3500,  350, 850),
  (12, 11, 2, 11, 0, 0, 2213012, 35,  4000, 400, 1000),
  (13, 12, 1, 0,  0, 0, 0, 60,  600,   60,  120),
  (14, 13, 1, 0,  0, 0, 0, 55,  800,   80,  180),
  (15, 14, 1, 0,  0, 0, 0, 50,  1000,  100, 220);

-- ============================================================
-- SEED DATA — Rewards  (placeholder until .cud master data decrypted)
-- ============================================================
INSERT INTO rewards (reward_id, reward_type, name, description, quantity) VALUES
  (10801, 1, 'Coin Pouch',      'A small pouch of coins',            500),
  (10802, 1, 'Coin Bag',        'A bag full of coins',               2000),
  (10803, 1, 'Coin Chest',      'A treasure chest of coins',         10000),
  (10901, 2, 'Gem Shard',       'A single gem',                      1),
  (10902, 2, 'Gem Cluster',     'A handful of gems',                 5),
  (10903, 2, 'Gem Hoard',       'A mountain of gems',                25),
  (11001, 4, 'Soul Secrets',    'Boosts youkai skill level',         1),
  (11002, 4, 'EXP Orb',        'Grants experience to a youkai',      1),
  (11003, 4, 'HP Boost',       'Permanently boosts HP',              1),
  (11004, 4, 'ATK Boost',      'Permanently boosts Attack',          1);
