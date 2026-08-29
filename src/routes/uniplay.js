'use strict';

async function unplayRoutes(fastify) {

  fastify.get('/api/v1/active', async (request) => {
    return {
      result: 0,
      message: 'ok',
      active: true,
      apkey: request.query.apkey || '',
    };
  });

  fastify.get('/api/v1/create_gdkey', async (request) => {
    const { apkey, version, udkey } = request.query || {};
    const gdkey = require('crypto').randomBytes(16).toString('hex');
    return {
      result: 0,
      message: 'ok',
      gdkey,
      apkey: apkey || '',
      version: version || '1.0.0',
      udkey: udkey || '',
    };
  });

  fastify.options('/api/v1/active', async (_req, reply) => reply.code(204).send());
  fastify.options('/api/v1/create_gdkey', async (_req, reply) => reply.code(204).send());
}

module.exports = unplayRoutes
