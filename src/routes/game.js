'use strict';

const { randomUUID } = require('crypto');
const { getSupabase } = require('../db/supabase.js');
const { authMiddleware } = require('../middleware/auth.js');

async function gameRoutes(fastify) {
  const db = getSupabase();
  const auth = { preHandler: authMiddleware };

  // ──────────────────────────────────────────────
  // POST /api/user/register — new player registration
  // ──────────────────────────────────────────────
  fastify.post('/api/user/register', async (request, reply) => {
    const { deviceId, username } = request.body || {};
    if (!deviceId) {
      return reply.code(400).send({ resultCode: 400, resultMsg: 'deviceId required' });
    }

    // Check if already exists
    const { data: existing } = await db
      .from('users')
      .select('id')
      .eq('device_id', deviceId)
      .single();

    if (existing) {
      return reply.code(409).send({ resultCode: 409, resultMsg: 'User already exists' });
    }

    const { data: user, error } = await db
      .from('users')
      .insert({
        device_id: deviceId,
        username: username || 'Newcomer',
        coins: 5000,
        gems: 100,
      })
      .select('*')
      .single();

    if (error) {
      request.log.error(error, 'register failed');
      return reply.code(500).send({ resultCode: 500, resultMsg: 'Registration failed' });
    }

    // Grant starter youkai (Jibanyan)
    await db.from('user_youkai').insert({
      user_id: user.id,
      youkai_id: 2213000,
      level: 1,
      skill_lv: 1,
      hp: 250,
      atk_power: 120,
    });

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      user: {
        id: user.id,
        username: user.username,
        coins: user.coins,
        gems: user.gems,
        rankPoints: user.rank_points,
      },
    };
  });

  // ──────────────────────────────────────────────
  // GET /api/user/data — full user data with youkaiList
  // ──────────────────────────────────────────────
  fastify.get('/api/user/data', auth, async (request, reply) => {
    const [userRes, youkaiRes] = await Promise.all([
      db.from('users').select('*').eq('id', request.userId).single(),
      db.from('user_youkai')
        .select('*, youkai(*)')
        .eq('user_id', request.userId),
    ]);

    if (userRes.error || !userRes.data) {
      return reply.code(404).send({ resultCode: 404, resultMsg: 'User not found' });
    }

    const user = userRes.data;
    const userYoukaiList = (youkaiRes.data || []).map(formatUserYoukai);

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      requestId: 0,
      user: {
        id: user.id,
        username: user.username,
        coins: user.coins,
        gems: user.gems,
        rankPoints: user.rank_points,
        createdAt: user.created_at,
        lastLogin: user.last_login,
      },
      userYoukaiList,
    };
  });

  // ──────────────────────────────────────────────
  // GET /api/youkai/list — master youkai catalogue
  // ──────────────────────────────────────────────
  fastify.get('/api/youkai/list', async () => {
    const { data, error } = await db.from('youkai').select('*').order('youkai_id');
    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      youkaiList: data || [],
    };
  });

  // ──────────────────────────────────────────────
  // GET /api/user/youkai — user's collection
  // ──────────────────────────────────────────────
  fastify.get('/api/user/youkai', auth, async (request) => {
    const { data } = await db
      .from('user_youkai')
      .select('*, youkai(*)')
      .eq('user_id', request.userId);

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      userYoukaiList: (data || []).map(formatUserYoukai),
    };
  });

  // ──────────────────────────────────────────────
  // GET /api/theme/list — available themes
  // ──────────────────────────────────────────────
  fastify.get('/api/theme/list', async () => {
    const { data } = await db.from('themes').select('*').order('theme_no');
    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      themeList: (data || []).map((t) => ({
        themeNo: t.theme_no,
        idx: t.idx,
        themeType: t.theme_type,
        conditionVal1: t.condition_val1,
        conditionVal2: t.condition_val2,
        conditionVal3: t.condition_val3,
        conditionYoukaiId: t.condition_youkai_id,
        themeSec: t.theme_sec,
        themeHp: t.theme_hp,
        themeAttackPower: t.theme_attack_power,
        themeClearPoint: t.theme_clear_point,
      })),
    };
  });

  // ──────────────────────────────────────────────
  // POST /api/battle/start — start a battle
  // ──────────────────────────────────────────────
  fastify.post('/api/battle/start', auth, async (request, reply) => {
    const { themeNo } = request.body || {};
    if (!themeNo) {
      return reply.code(400).send({ resultCode: 400, resultMsg: 'themeNo required' });
    }

    const { data: theme, error } = await db
      .from('themes')
      .select('*')
      .eq('theme_no', themeNo)
      .single();

    if (error || !theme) {
      return reply.code(404).send({ resultCode: 404, resultMsg: 'Theme not found' });
    }

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      battle: {
        themeNo: theme.theme_no,
        themeSec: theme.theme_sec,
        themeHp: theme.theme_hp,
        themeAttackPower: theme.theme_attack_power,
        themeClearPoint: theme.theme_clear_point,
      },
    };
  });

  // ──────────────────────────────────────────────
  // POST /api/battle/result — submit battle result
  // ──────────────────────────────────────────────
  fastify.post('/api/battle/result', auth, async (request, reply) => {
    const { themeNo, score } = request.body || {};
    if (!themeNo || score == null) {
      return reply.code(400).send({ resultCode: 400, resultMsg: 'themeNo and score required' });
    }

    const { data: theme } = await db
      .from('themes')
      .select('*')
      .eq('theme_no', themeNo)
      .single();

    if (!theme) {
      return reply.code(404).send({ resultCode: 404, resultMsg: 'Theme not found' });
    }

    const clearPoint = score >= theme.theme_clear_point ? theme.theme_clear_point : 0;
    const rewards = generateBattleRewards(score, clearPoint);

    // Record result
    await db.from('battle_results').insert({
      user_id: request.userId,
      theme_no: themeNo,
      score,
      clear_point: clearPoint,
      rewards,
    });

    // Award coins/gems
    let coinGain = 0;
    let gemGain = 0;
    for (const r of rewards) {
      if (r.rewardType === 1) coinGain += r.rewardCnt;
      if (r.rewardType === 2) gemGain += r.rewardCnt;
    }

    if (coinGain > 0 || gemGain > 0) {
      const { data: user } = await db
        .from('users')
        .select('coins, gems, rank_points')
        .eq('id', request.userId)
        .single();

      if (user) {
        await db
          .from('users')
          .update({
            coins: user.coins + coinGain,
            gems: user.gems + gemGain,
            rank_points: user.rank_points + clearPoint,
          })
          .eq('id', request.userId);
      }
    }

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      clearPoint,
      score,
      dropRewardList: rewards,
    };
  });

  // ──────────────────────────────────────────────
  // POST /api/gacha/pull — gacha pull
  // ──────────────────────────────────────────────
  fastify.post('/api/gacha/pull', auth, async (request, reply) => {
    const GACHA_COST = 500;

    const { data: user } = await db
      .from('users')
      .select('*')
      .eq('id', request.userId)
      .single();

    if (!user || user.coins < GACHA_COST) {
      return reply.code(400).send({
        resultCode: 400,
        resultMsg: 'Not enough coins (need 500)',
      });
    }

    // Pull a random youkai weighted by rarity
    const { data: allYoukai } = await db.from('youkai').select('*');
    if (!allYoukai || allYoukai.length === 0) {
      return reply.code(500).send({ resultCode: 500, resultMsg: 'No youkai in database' });
    }

    const pulled = weightedRandomYoukai(allYoukai);

    // Deduct coins
    await db
      .from('users')
      .update({ coins: user.coins - GACHA_COST })
      .eq('id', request.userId);

    // Add to collection (upsert — if already owned, level up)
    const { data: existing } = await db
      .from('user_youkai')
      .select('*')
      .eq('user_id', request.userId)
      .eq('youkai_id', pulled.youkai_id)
      .single();

    if (existing) {
      const newLevel = Math.min(existing.level + 1, 50);
      const hpBoost = Math.floor(pulled.max_hp * 0.05);
      const atkBoost = Math.floor(pulled.base_atk * 0.05);

      await db
        .from('user_youkai')
        .update({
          level: newLevel,
          hp: existing.hp + hpBoost,
          atk_power: existing.atk_power + atkBoost,
          skill_lv: Math.min(existing.skill_lv + 1, 10),
        })
        .eq('id', existing.id);
    } else {
      await db.from('user_youkai').insert({
        user_id: request.userId,
        youkai_id: pulled.youkai_id,
        level: 1,
        skill_lv: 1,
        hp: pulled.max_hp,
        atk_power: pulled.base_atk,
      });
    }

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      gacha: {
        youkaiId: pulled.youkai_id,
        name: pulled.name,
        rarity: pulled.rarity,
        element: pulled.element,
        isNew: !existing,
        reward: {
          rewardType: 3,
          rewardId: pulled.youkai_id,
          rewardCnt: 1,
        },
      },
    };
  });

  // ──────────────────────────────────────────────
  // GET /api/rank/list — leaderboard
  // ──────────────────────────────────────────────
  fastify.get('/api/rank/list', async () => {
    const { data } = await db
      .from('users')
      .select('id, username, rank_points')
      .order('rank_points', { ascending: false })
      .limit(100);

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      rankList: (data || []).map((u, i) => ({
        rank: i + 1,
        userId: u.id,
        username: u.username,
        rankPoints: u.rank_points,
      })),
    };
  });

  // ──────────────────────────────────────────────
  // POST /api/reward/claim — claim reward
  // ──────────────────────────────────────────────
  fastify.post('/api/reward/claim', auth, async (request, reply) => {
    const { rewardId } = request.body || {};
    if (!rewardId) {
      return reply.code(400).send({ resultCode: 400, resultMsg: 'rewardId required' });
    }

    const { data: reward } = await db
      .from('rewards')
      .select('*')
      .eq('reward_id', rewardId)
      .single();

    if (!reward) {
      return reply.code(404).send({ resultCode: 404, resultMsg: 'Reward not found' });
    }

    const { data: user } = await db
      .from('users')
      .select('coins, gems')
      .eq('id', request.userId)
      .single();

    if (!user) {
      return reply.code(404).send({ resultCode: 404, resultMsg: 'User not found' });
    }

    // Apply reward
    const updates = {};
    if (reward.reward_type === 1) updates.coins = user.coins + reward.quantity;
    if (reward.reward_type === 2) updates.gems = user.gems + reward.quantity;

    if (Object.keys(updates).length > 0) {
      await db.from('users').update(updates).eq('id', request.userId);
    }

    return {
      resultCode: 200,
      resultMsg: 'SUCCESS',
      claimed: {
        rewardType: reward.reward_type,
        rewardId: reward.reward_id,
        rewardCnt: reward.quantity,
        name: reward.name,
      },
    };
  });
}

// ════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════

function formatUserYoukai(uy) {
  const y = uy.youkai || {};
  return {
    youkaiId: uy.youkai_id,
    name: y.name || '',
    hp: uy.hp,
    atkPower: uy.atk_power,
    level: uy.level,
    skillLv: uy.skill_lv,
    rarity: y.rarity || 1,
    element: y.element || 'normal',
    skillName: y.skill_name || 'None',
    obtainedAt: uy.obtained_at,
  };
}

function generateBattleRewards(score, clearPoint) {
  const rewards = [];
  // Base coin reward scaled to score
  const coinAmount = Math.max(50, Math.floor(score * 0.5));
  rewards.push({ rewardType: 1, rewardId: 10801, rewardCnt: coinAmount });

  // Gem chance on clear
  if (clearPoint > 0 && Math.random() < 0.3) {
    rewards.push({ rewardType: 2, rewardId: 10901, rewardCnt: 1 });
  }

  // Item drop chance
  if (Math.random() < 0.15) {
    const items = [11001, 11002, 11003, 11004];
    const pick = items[Math.floor(Math.random() * items.length)];
    rewards.push({ rewardType: 4, rewardId: pick, rewardCnt: 1 });
  }

  return rewards;
}

function weightedRandomYoukai(youkaiList) {
  // Inverse rarity weighting: lower rarity → higher weight
  const weights = youkaiList.map((y) => {
    switch (y.rarity) {
      case 5: return 1;
      case 4: return 3;
      case 3: return 8;
      case 2: return 15;
      default: return 25;
    }
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < youkaiList.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return youkaiList[i];
  }
  return youkaiList[youkaiList.length - 1];
}

module.exports = gameRoutes;
