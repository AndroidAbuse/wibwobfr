'use strict';

const { getSupabase } = require('../db/supabase.js');

async function authMiddleware(request, reply) {
  const token =
    request.headers['x-session-token'] ||
    request.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    reply.code(401).send({
      resultCode: 401,
      resultMsg: 'Missing session token',
    });
    return;
  }

  const db = getSupabase();
  const { data: session, error } = await db
    .from('sessions')
    .select('*')
    .eq('session_token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) {
    reply.code(401).send({
      resultCode: 401,
      resultMsg: 'Invalid or expired session',
    });
    return;
  }

  // Attach to request for downstream handlers
  request.userId = session.user_id;
  request.sessionToken = session.session_token;
  request.deviceId = session.device_id;
}

module.exports = { authMiddleware };
