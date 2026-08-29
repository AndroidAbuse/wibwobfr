'use strict';

const { randomUUID, randomBytes } = require('crypto');
const { getSupabase } = require('../db/supabase.js');
const { authMiddleware } = require('../middleware/auth.js');

// HSP SDK uses 16-digit member numbers (like Hangame/Toast memberNo)
let memberNoCounter = 5855000148550000n;
function generateMemberNo() {
  memberNoCounter += BigInt(Math.floor(Math.random() * 100) + 1);
  return memberNoCounter.toString();
}

// Mimic the AAAA… base64 authData token the real HSP SDK returns
function generateAuthData() {
  const prefix = Buffer.from([0x00, 0x00, 0x00]);
  const payload = randomBytes(253);
  return Buffer.concat([prefix, payload]).toString('base64');
}

async function authRoutes(fastify) {
  const db = getSupabase();

  // ──────────────────────────────────────────────
  // POST /hsp/auth/login — HSP guest/device login
  // Body: { deviceId: UUID, oauthprovider?: "guest" }
  // ──────────────────────────────────────────────
  fastify.post('/hsp/auth/login', async (request, reply) => {
    const body = request.body || {};
    const deviceId = body.deviceId || body.device_id || body.uuid;
    const oauthprovider = body.oauthprovider || 'guest';
    const username = body.username;

    if (!deviceId) {
      return reply.code(400).send({
        resultCode: 400,
        resultMsg: 'deviceId is required (UUID v4 format)',
      });
    }

    // Upsert user by device_id
    let { data: user, error } = await db
      .from('users')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (!user) {
      const memberNo = generateMemberNo();
      const insertName = username || 'Newcomer';
      const { data: newUser, error: insertErr } = await db
        .from('users')
        .insert({
          device_id: deviceId,
          username: insertName,
          member_no: memberNo,
        })
        .select('*')
        .single();

      if (insertErr) {
        request.log.error(insertErr, 'Failed to create user');
        return reply.code(500).send({
          resultCode: 500,
          resultMsg: 'Failed to create user',
        });
      }
      user = newUser;
    } else {
      await db
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);
    }

    // Generate HSP-format tokens
    const sessionToken = randomUUID();
    const guestLoginAuthData = randomUUID();
    const authData = generateAuthData();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error: sessErr } = await db.from('sessions').insert({
      session_token: sessionToken,
      user_id: user.id,
      device_id: deviceId,
      expires_at: expiresAt,
    });

    if (sessErr) {
      request.log.error(sessErr, 'Failed to create session');
      return reply.code(500).send({
        resultCode: 500,
        resultMsg: 'Failed to create session',
      });
    }

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      login: {
        oauthprovider,
        memberNo: user.member_no,
        guestLoginAuthData,
        authData,
        idpCode: 'toast',
      },
      session: {
        token: sessionToken,
        expiresAt,
      },
      user: {
        id: user.id,
        memberNo: user.member_no,
        username: user.username,
        coins: user.coins,
        gems: user.gems,
        rankPoints: user.rank_points,
      },
    };
  });

  // ──────────────────────────────────────────────
  // POST /hsp/auth/guest — alternative guest endpoint
  // Some HSP versions hit /hsp/auth/guest directly
  // ──────────────────────────────────────────────
  fastify.post('/hsp/auth/guest', async (request, reply) => {
    const body = request.body || {};
    const deviceId = body.deviceId || body.device_id || body.uuid || randomUUID();

    // Delegate to the same logic via internal redirect
    request.body = { ...body, deviceId, oauthprovider: 'guest' };
    return fastify.inject({
      method: 'POST',
      url: '/hsp/auth/login',
      payload: request.body,
      headers: request.headers,
    }).then((res) => {
      reply.code(res.statusCode);
      return res.json();
    });
  });

  // ──────────────────────────────────────────────
  // POST /hsp/auth/logout
  // ──────────────────────────────────────────────
  fastify.post('/hsp/auth/logout', {
    preHandler: authMiddleware,
  }, async (request) => {
    await db
      .from('sessions')
      .delete()
      .eq('session_token', request.sessionToken);

    return { resultCode: 200, resultMsg: 'Logged out' };
  });

  // ──────────────────────────────────────────────
  // POST /hsp/auth/heartbeat
  // ──────────────────────────────────────────────
  fastify.post('/hsp/auth/heartbeat', {
    preHandler: authMiddleware,
  }, async (request) => {
    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await db
      .from('sessions')
      .update({ expires_at: newExpiry })
      .eq('session_token', request.sessionToken);

    return {
      resultCode: 200,
      resultMsg: 'OK',
      heartbeat: { interval: 120 },
    };
  });

  // ──────────────────────────────────────────────
  // GET /hsp/auth/userInfo
  // ──────────────────────────────────────────────
  fastify.get('/hsp/auth/userInfo', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const { data: user, error } = await db
      .from('users')
      .select('*')
      .eq('id', request.userId)
      .single();

    if (error || !user) {
      return reply.code(404).send({
        resultCode: 404,
        resultMsg: 'User not found',
      });
    }

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      user: {
        id: user.id,
        memberNo: user.member_no,
        deviceId: user.device_id,
        username: user.username,
        coins: user.coins,
        gems: user.gems,
        rankPoints: user.rank_points,
        createdAt: user.created_at,
        lastLogin: user.last_login,
      },
    };
  });
}

module.exports = authRoutes;
