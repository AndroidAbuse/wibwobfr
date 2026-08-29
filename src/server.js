'use strict';

const path = require('path');
const fs = require('fs');
const Fastify = require('fastify');
const cors = require('@fastify/cors');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const USE_HTTPS = process.env.USE_HTTPS === 'true';

async function build(opts = {}) {
  const fastifyOpts = {
    logger: opts.logger !== false
      ? { level: process.env.LOG_LEVEL || 'info' }
      : false,
    ...opts,
  };

  // HTTPS support (self-signed certs for dev)
  if (USE_HTTPS) {
    const certDir = path.join(__dirname, '..', 'certs');
    const keyPath = path.join(certDir, 'server.key');
    const certPath = path.join(certDir, 'server.crt');

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      fastifyOpts.https = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
    } else {
      console.warn('HTTPS requested but certs not found — run `npm run gen-certs` first. Falling back to HTTP.');
    }
  }

  const fastify = Fastify(fastifyOpts);

  // CORS
  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Session-Token',
      'X-Device-Id',
    ],
  });

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }));

  // Routes
  await fastify.register(require('./routes/lnc.js'));
  await fastify.register(require('./routes/auth.js'));
  await fastify.register(require('./routes/game.js'));

  return fastify;
}

async function start() {
  const fastify = await build();

  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    const proto = USE_HTTPS ? 'https' : 'http';
    console.log(`YO-KAI WATCH Wibble Wobble server running on ${proto}://0.0.0.0:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Only start when run directly (not when imported for tests)
if (require.main === module) {
  start();
}

module.exports = { build };
