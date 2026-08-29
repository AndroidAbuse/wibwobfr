'use strict';

const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// ════════════════════════════════════════════════
// Mock Supabase before any require() of app code
// ════════════════════════════════════════════════

const MOCK_USERS = new Map();
const MOCK_SESSIONS = new Map();
const MOCK_YOUKAI = [
  { youkai_id: 2213000, name: 'Jibanyan',  max_hp: 250, base_atk: 120, base_def: 80,  rarity: 4, element: 'fire',      skill_name: 'Paws of Fury' },
  { youkai_id: 2213001, name: 'Komasan',   max_hp: 230, base_atk: 100, base_def: 90,  rarity: 3, element: 'ice',       skill_name: 'Spirit Dance' },
  { youkai_id: 2213003, name: 'Noko',      max_hp: 180, base_atk: 60,  base_def: 100, rarity: 1, element: 'earth',     skill_name: 'Lucky Aura'   },
];
const MOCK_THEMES = [
  { theme_no: 1, idx: 0, theme_type: 1, condition_val1: 0, condition_val2: 0, condition_val3: 0, condition_youkai_id: 0, theme_sec: 60, theme_hp: 500, theme_attack_power: 50, theme_clear_point: 100 },
  { theme_no: 2, idx: 1, theme_type: 1, condition_val1: 1, condition_val2: 0, condition_val3: 0, condition_youkai_id: 0, theme_sec: 60, theme_hp: 700, theme_attack_power: 70, theme_clear_point: 150 },
];
const MOCK_USER_YOUKAI = new Map();
const MOCK_BATTLE_RESULTS = [];
const MOCK_REWARDS = [
  { reward_id: 10801, reward_type: 1, name: 'Coin Pouch', description: 'A small pouch of coins', quantity: 500 },
  { reward_id: 10901, reward_type: 2, name: 'Gem Shard',  description: 'A single gem',           quantity: 1   },
];

let userIdCounter = 0;
let memberNoCounter = 5855000148550000;

function createMockSupabase() {
  return {
    from(table) {
      return {
        _table: table,
        select(cols) { return chainBase(table, { _cols: cols }); },
        insert(row) { return chainBase(table, { _insertRow: Array.isArray(row) ? row[0] : row }); },
        update(row) { return chainBase(table, { _updateRow: row }); },
        delete()    { return chainBase(table, { _delete: true }); },
      };
    },
  };
}

function chainBase(table, init = {}) {
  const self = {
    _table: table,
    _filters: {},
    _single: false,
    _cols: '*',
    _insertRow: null,
    _updateRow: null,
    _delete: false,
    _limit: null,
    ...init,

    select(cols)   { self._cols = cols; return self; },
    insert(row)    { self._insertRow = Array.isArray(row) ? row[0] : row; return self; },
    update(row)    { self._updateRow = row; return self; },
    delete()       { self._delete = true; return self; },
    eq(col, val)   { self._filters[col] = val; return self; },
    gt(col, val)   { self._filters[`${col}__gt`] = val; return self; },
    order()        { return self; },
    limit(n)       { self._limit = n; return self; },
    single()       { self._single = true; return self; },

    then(resolve, reject) {
      try { resolve(resolveChain(self)); }
      catch (err) { reject ? reject(err) : resolve({ data: null, error: err }); }
    },
  };
  return self;
}

function resolveChain(chain) {
  const t = chain._table;
  const f = chain._filters;

  // INSERT
  if (chain._insertRow) {
    if (t === 'users') {
      const id = `user-${++userIdCounter}`;
      const mno = chain._insertRow.member_no || `${++memberNoCounter}`;
      const user = {
        id,
        device_id: chain._insertRow.device_id,
        member_no: mno,
        username: chain._insertRow.username || 'Newcomer',
        coins: chain._insertRow.coins ?? 5000,
        gems: chain._insertRow.gems ?? 100,
        rank_points: 0,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };
      MOCK_USERS.set(user.device_id, user);
      return { data: user, error: null };
    }
    if (t === 'sessions') {
      MOCK_SESSIONS.set(chain._insertRow.session_token, chain._insertRow);
      return { data: chain._insertRow, error: null };
    }
    if (t === 'user_youkai') {
      const key = `${chain._insertRow.user_id}-${chain._insertRow.youkai_id}`;
      const uy = { id: `uy-${key}`, ...chain._insertRow, obtained_at: new Date().toISOString() };
      MOCK_USER_YOUKAI.set(key, uy);
      return { data: uy, error: null };
    }
    if (t === 'battle_results') {
      MOCK_BATTLE_RESULTS.push(chain._insertRow);
      return { data: chain._insertRow, error: null };
    }
    return { data: chain._insertRow, error: null };
  }

  // UPDATE
  if (chain._updateRow) {
    if (t === 'users' && f.id) {
      for (const u of MOCK_USERS.values()) {
        if (u.id === f.id) { Object.assign(u, chain._updateRow); return { data: u, error: null }; }
      }
    }
    if (t === 'sessions' && f.session_token) {
      const s = MOCK_SESSIONS.get(f.session_token);
      if (s) Object.assign(s, chain._updateRow);
      return { data: s, error: null };
    }
    if (t === 'user_youkai' && f.id) {
      for (const uy of MOCK_USER_YOUKAI.values()) {
        if (uy.id === f.id) { Object.assign(uy, chain._updateRow); return { data: uy, error: null }; }
      }
    }
    return { data: null, error: null };
  }

  // DELETE
  if (chain._delete) {
    if (t === 'sessions' && f.session_token) MOCK_SESSIONS.delete(f.session_token);
    return { data: null, error: null };
  }

  // SELECT
  if (t === 'users') {
    if (f.device_id) {
      const u = MOCK_USERS.get(f.device_id);
      return { data: u || null, error: u ? null : { code: 'PGRST116' } };
    }
    if (f.id) {
      for (const u of MOCK_USERS.values()) {
        if (u.id === f.id) return { data: u, error: null };
      }
      return { data: null, error: { code: 'PGRST116' } };
    }
    return { data: [...MOCK_USERS.values()].sort((a,b) => b.rank_points - a.rank_points), error: null };
  }
  if (t === 'sessions') {
    if (f.session_token) {
      const s = MOCK_SESSIONS.get(f.session_token);
      return { data: s || null, error: s ? null : { code: 'PGRST116' } };
    }
    return { data: null, error: null };
  }
  if (t === 'youkai') {
    if (f.youkai_id != null) {
      const y = MOCK_YOUKAI.find(y => y.youkai_id === f.youkai_id);
      return { data: y || null, error: y ? null : { code: 'PGRST116' } };
    }
    return { data: MOCK_YOUKAI, error: null };
  }
  if (t === 'themes') {
    if (f.theme_no != null) {
      const th = MOCK_THEMES.find(th => th.theme_no === f.theme_no);
      return { data: th || null, error: th ? null : { code: 'PGRST116' } };
    }
    return { data: MOCK_THEMES, error: null };
  }
  if (t === 'user_youkai') {
    if (f.user_id) {
      const list = [];
      for (const uy of MOCK_USER_YOUKAI.values()) {
        if (uy.user_id === f.user_id) {
          const master = MOCK_YOUKAI.find(y => y.youkai_id === uy.youkai_id) || {};
          list.push({ ...uy, youkai: master });
        }
      }
      if (f.youkai_id != null) {
        const match = list.find(uy => uy.youkai_id === f.youkai_id);
        return { data: match || null, error: match ? null : { code: 'PGRST116' } };
      }
      return { data: list, error: null };
    }
    return { data: [], error: null };
  }
  if (t === 'rewards') {
    if (f.reward_id != null) {
      const r = MOCK_REWARDS.find(r => r.reward_id === f.reward_id);
      return { data: r || null, error: r ? null : { code: 'PGRST116' } };
    }
    return { data: MOCK_REWARDS, error: null };
  }
  return { data: null, error: null };
}

// ════════════════════════════════════════════════
// Setup
// ════════════════════════════════════════════════
const mockSupa = createMockSupabase();

process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'mock-service-key';
process.env.PORT = '0';

const supabaseModule = require('../src/db/supabase.js');
supabaseModule.getSupabase = () => mockSupa;

const { build } = require('../src/server.js');

// ════════════════════════════════════════════════
// TESTS
// ════════════════════════════════════════════════
describe('YO-KAI Server', () => {
  let app;

  before(async () => {
    app = await build({ logger: false });
    await app.ready();
  });

  after(async () => { await app.close(); });

  beforeEach(() => {
    MOCK_USERS.clear();
    MOCK_SESSIONS.clear();
    MOCK_USER_YOUKAI.clear();
    MOCK_BATTLE_RESULTS.length = 0;
    userIdCounter = 0;
  });

  // ── Health ─────────────────────────────────────
  describe('GET /health', () => {
    it('returns ok', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.status, 'ok');
      assert.ok(body.timestamp);
      assert.equal(body.version, '1.0.0');
    });
  });

  // ── LNC ────────────────────────────────────────
  describe('LNC endpoint', () => {
    it('GET /hsp/lnc returns launch config with HSP fields', async () => {
      const res = await app.inject({ method: 'GET', url: '/hsp/lnc' });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.resultCode, 200);
      assert.equal(body.resultMsg, 'SUCCESS');
      assert.equal(body.header.isSuccessful, true);
      assert.equal(body.launching.server.status, 'ok');
      assert.equal(body.launching.maintenance.isOn, false);
      assert.equal(body.launching.app.needUpdate, false);
      assert.equal(body.launching.heartbeat.interval, 120);
      assert.equal(body.launching.hspConfig.HSP_TIMEOUT_TCP, 30);
      assert.equal(body.launching.hspConfig.HSP_LOGIN_IDP, 'toast');
      assert.equal(body.launching.hspConfig.HSP_MARKET, 'KG');
      assert.equal(body.launching.login.oauthprovider, 'guest');
      assert.ok(body.timestamp.key.startsWith('HSP_LNC_NOTICE_TIMESTAMP_'));
      assert.ok(typeof body.timestamp.value === 'number');
    });

    it('POST /hsp/lnc also works', async () => {
      const res = await app.inject({ method: 'POST', url: '/hsp/lnc' });
      assert.equal(res.statusCode, 200);
      assert.equal(res.json().resultCode, 200);
    });
  });

  // ── Auth ───────────────────────────────────────
  describe('Auth endpoints', () => {
    it('POST /hsp/auth/login creates user with HSP-format tokens', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: { deviceId: '45bc3b4e-547b-436b-afcd-3e8072e7dcc7', username: 'TestPlayer' },
      });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.resultCode, 200);

      // Session
      assert.ok(body.session.token);
      assert.ok(body.session.expiresAt);

      // HSP login block
      assert.equal(body.login.oauthprovider, 'guest');
      assert.equal(body.login.idpCode, 'toast');
      // memberNo: 16-digit numeric string
      assert.ok(/^\d{16}$/.test(body.login.memberNo), `memberNo should be 16 digits, got: ${body.login.memberNo}`);
      // guestLoginAuthData: UUID format
      assert.ok(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(body.login.guestLoginAuthData));
      // authData: base64 starting with AAAA
      assert.ok(body.login.authData.startsWith('AAAA'), `authData should start with AAAA, got: ${body.login.authData.substring(0, 8)}`);
      assert.ok(body.login.authData.length > 100, 'authData should be a long base64 token');

      // User
      assert.equal(body.user.username, 'TestPlayer');
      assert.ok(body.user.memberNo);
      assert.equal(body.user.coins, 5000);
      assert.equal(body.user.gems, 100);
    });

    it('POST /hsp/auth/login returns 400 without deviceId', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: {},
      });
      assert.equal(res.statusCode, 400);
    });

    it('POST /hsp/auth/login re-uses existing user with same memberNo', async () => {
      const res1 = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: { deviceId: 'test-device-reuse' },
      });
      const memberNo1 = res1.json().login.memberNo;
      const userId1 = res1.json().user.id;

      const res2 = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: { deviceId: 'test-device-reuse' },
      });
      assert.equal(res2.json().user.id, userId1);
      assert.equal(res2.json().login.memberNo, memberNo1);
    });

    it('GET /hsp/auth/userInfo returns 401 without token', async () => {
      const res = await app.inject({ method: 'GET', url: '/hsp/auth/userInfo' });
      assert.equal(res.statusCode, 401);
    });

    it('GET /hsp/auth/userInfo returns user with memberNo', async () => {
      const loginRes = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: { deviceId: 'device-info-test', username: 'InfoUser' },
      });
      const token = loginRes.json().session.token;

      const res = await app.inject({
        method: 'GET',
        url: '/hsp/auth/userInfo',
        headers: { 'x-session-token': token },
      });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.user.username, 'InfoUser');
      assert.ok(body.user.memberNo);
      assert.ok(body.user.deviceId);
    });

    it('POST /hsp/auth/heartbeat extends session', async () => {
      const loginRes = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: { deviceId: 'device-heartbeat' },
      });
      const token = loginRes.json().session.token;

      const res = await app.inject({
        method: 'POST',
        url: '/hsp/auth/heartbeat',
        headers: { 'x-session-token': token },
      });
      assert.equal(res.statusCode, 200);
      assert.equal(res.json().heartbeat.interval, 120);
    });

    it('POST /hsp/auth/logout removes session', async () => {
      const loginRes = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: { deviceId: 'device-logout' },
      });
      const token = loginRes.json().session.token;

      const res = await app.inject({
        method: 'POST',
        url: '/hsp/auth/logout',
        headers: { 'x-session-token': token },
      });
      assert.equal(res.statusCode, 200);

      const res2 = await app.inject({
        method: 'GET',
        url: '/hsp/auth/userInfo',
        headers: { 'x-session-token': token },
      });
      assert.equal(res2.statusCode, 401);
    });
  });

  // ── Game API ───────────────────────────────────
  describe('Game API', () => {
    let sessionToken;
    let userId;

    async function login() {
      const res = await app.inject({
        method: 'POST',
        url: '/hsp/auth/login',
        payload: { deviceId: `game-dev-${Date.now()}-${Math.random()}`, username: 'GameTester' },
      });
      const body = res.json();
      sessionToken = body.session.token;
      userId = body.user.id;
    }

    it('POST /api/user/register creates user with starter youkai', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/user/register',
        payload: { deviceId: 'new-player', username: 'NewPlayer' },
      });
      assert.equal(res.statusCode, 200);
      assert.equal(res.json().user.username, 'NewPlayer');
      assert.equal(res.json().user.coins, 5000);
    });

    it('POST /api/user/register returns 409 for duplicate', async () => {
      await app.inject({
        method: 'POST',
        url: '/api/user/register',
        payload: { deviceId: 'dup-player' },
      });
      const res = await app.inject({
        method: 'POST',
        url: '/api/user/register',
        payload: { deviceId: 'dup-player' },
      });
      assert.equal(res.statusCode, 409);
    });

    it('GET /api/youkai/list returns master list', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/youkai/list' });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.ok(Array.isArray(body.youkaiList));
      assert.ok(body.youkaiList.length > 0);
    });

    it('GET /api/theme/list returns themes', async () => {
      const res = await app.inject({ method: 'GET', url: '/api/theme/list' });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.ok(Array.isArray(body.themeList));
      assert.equal(body.themeList[0].themeNo, 1);
      assert.equal(body.themeList[0].themeSec, 60);
    });

    it('GET /api/user/data returns user data + youkai', async () => {
      await login();
      const res = await app.inject({
        method: 'GET',
        url: '/api/user/data',
        headers: { 'x-session-token': sessionToken },
      });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.user.username, 'GameTester');
      assert.ok(Array.isArray(body.userYoukaiList));
    });

    it('GET /api/user/youkai returns collection', async () => {
      await login();
      const res = await app.inject({
        method: 'GET',
        url: '/api/user/youkai',
        headers: { 'x-session-token': sessionToken },
      });
      assert.equal(res.statusCode, 200);
      assert.ok(Array.isArray(res.json().userYoukaiList));
    });

    it('POST /api/battle/start returns theme data', async () => {
      await login();
      const res = await app.inject({
        method: 'POST',
        url: '/api/battle/start',
        headers: { 'x-session-token': sessionToken },
        payload: { themeNo: 1 },
      });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.battle.themeNo, 1);
      assert.equal(body.battle.themeHp, 500);
    });

    it('POST /api/battle/start returns 404 for unknown theme', async () => {
      await login();
      const res = await app.inject({
        method: 'POST',
        url: '/api/battle/start',
        headers: { 'x-session-token': sessionToken },
        payload: { themeNo: 9999 },
      });
      assert.equal(res.statusCode, 404);
    });

    it('POST /api/battle/result records result and awards rewards', async () => {
      await login();
      const res = await app.inject({
        method: 'POST',
        url: '/api/battle/result',
        headers: { 'x-session-token': sessionToken },
        payload: { themeNo: 1, score: 500 },
      });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.score, 500);
      assert.ok(body.clearPoint >= 0);
      assert.ok(Array.isArray(body.dropRewardList));
      assert.ok(body.dropRewardList.length > 0);
      for (const r of body.dropRewardList) {
        assert.ok(r.rewardType);
        assert.ok(r.rewardId);
        assert.ok(r.rewardCnt > 0);
      }
    });

    it('POST /api/gacha/pull returns a youkai', async () => {
      await login();
      for (const u of MOCK_USERS.values()) {
        if (u.id === userId) u.coins = 5000;
      }

      const res = await app.inject({
        method: 'POST',
        url: '/api/gacha/pull',
        headers: { 'x-session-token': sessionToken },
      });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.ok(body.gacha.youkaiId);
      assert.ok(body.gacha.name);
      assert.ok(body.gacha.rarity >= 1 && body.gacha.rarity <= 5);
      assert.equal(body.gacha.reward.rewardType, 3);
    });

    it('POST /api/gacha/pull fails if not enough coins', async () => {
      await login();
      for (const u of MOCK_USERS.values()) {
        if (u.id === userId) u.coins = 0;
      }

      const res = await app.inject({
        method: 'POST',
        url: '/api/gacha/pull',
        headers: { 'x-session-token': sessionToken },
      });
      assert.equal(res.statusCode, 400);
    });

    it('GET /api/rank/list returns leaderboard', async () => {
      await login();
      const res = await app.inject({ method: 'GET', url: '/api/rank/list' });
      assert.equal(res.statusCode, 200);
      assert.ok(Array.isArray(res.json().rankList));
    });

    it('POST /api/reward/claim claims a coin reward', async () => {
      await login();
      const res = await app.inject({
        method: 'POST',
        url: '/api/reward/claim',
        headers: { 'x-session-token': sessionToken },
        payload: { rewardId: 10801 },
      });
      assert.equal(res.statusCode, 200);
      const body = res.json();
      assert.equal(body.claimed.rewardType, 1);
      assert.equal(body.claimed.rewardCnt, 500);
    });

    it('POST /api/reward/claim returns 404 for unknown reward', async () => {
      await login();
      const res = await app.inject({
        method: 'POST',
        url: '/api/reward/claim',
        headers: { 'x-session-token': sessionToken },
        payload: { rewardId: 99999 },
      });
      assert.equal(res.statusCode, 404);
    });
  });
});
