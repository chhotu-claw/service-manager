const http = require('http');

const CADDY_ADMIN = 'http://localhost:2019';

function caddyRequest(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, CADDY_ADMIN);
    const opts = { method, hostname: url.hostname, port: url.port, path: url.pathname, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 400) reject(new Error(`Caddy ${res.statusCode}: ${data}`));
        else resolve(data ? JSON.parse(data) : null);
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Read-only status check — no config injection
async function getCaddyStatus() {
  try {
    const cfg = await caddyRequest('GET', '/config/');
    return { running: true, config: cfg };
  } catch {
    return { running: false };
  }
}

module.exports = { getCaddyStatus };
