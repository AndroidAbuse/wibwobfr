js
'use strict';

const APP_ID = 10481;
const APP_VERSION = '2.0.3';

async function lncRoutes(fastify) {
  function buildLncResponse() {
    const defaultUrl = 'http://localhost:' + (process.env.PORT || 3000);
    const serverUrl = process.env.GAME_SERVER_URL || defaultUrl;
    const serverHost = process.env.GAME_SERVER_HOST || 'localhost';
    const isHttps = serverUrl.startsWith('https');
    const publicPort = parseInt(process.env.PUBLIC_PORT, 10) || (isHttps ? 443 : 80);

    return {
      header: {
        isSuccessful: true,
        resultCode: 200,
        resultMessage: 'SUCCESS',
      },
      launching: {
        server: {
          status: 'ok',
          statusCode: 200,
          ip: serverHost,
          port: publicPort,
        },
        maintenance: {
          isOn: false,
          message: '',
          url: '',
          typeCode: 'OPEN',
        },
        app: {
          storeUrl: '',
          needUpdate: false,
          latestVersion: APP_VERSION,
          minimumVersion: '1.0.0',
        },
        gameServer: {
          ip: serverHost,
          port: publicPort,
          url: serverUrl,
          protocol: isHttps ? 'https' : 'http',
        },
        tcpSocket: {
          ip: serverHost,
          port: publicPort + 1,
        },
        heartbeat: {
          interval: 120,
        },
        notice: {
          url: '',
          isOn: false,
        },
        login: {
          oauthprovider: 'guest',
          idpCode: 'toast',
        },
        hspConfig: {
          HSP_TIMEOUT_TCP: 30,
          HSP_TIMEOUT_HTTP: 30,
          HSP_HEARTBEAT_TIMEINTERVAL: 120,
          HSP_LOGIN_IDP: 'toast',
          HSP_MARKET: 'KG',
        },
      },
      timestamp: {
        key: 'HSP_LNC_NOTICE_TIMESTAMP_' + APP_ID + '_' + APP_VERSION,
        value: Date.now(),
      },
      resultCode: 200,
      resultMsg: 'SUCCESS',
    };
  }

  fastify.get('/hsp/lnc', async () => buildLncResponse());
  fastify.post('/hsp/lnc', async () => buildLncResponse());

  fastify.options('/hsp/lnc', async (_req, reply) => {
    reply.code(204).send();
  });
}

module.exports = lncRoutes;
