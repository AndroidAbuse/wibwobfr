'use strict';

const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

const attrs = [{ name: 'commonName', value: 'yokai-server.local' }];
const pems = selfsigned.generate(attrs, {
  days: 365,
  keySize: 2048,
  algorithm: 'sha256',
});

const certDir = path.join(__dirname, '..', 'certs');
fs.mkdirSync(certDir, { recursive: true });
fs.writeFileSync(path.join(certDir, 'server.key'), pems.private);
fs.writeFileSync(path.join(certDir, 'server.crt'), pems.cert);

console.log('Self-signed certs generated in certs/');
