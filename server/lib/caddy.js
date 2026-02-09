const http = require('http');

const CADDY_ADMIN = 'http://localhost:2019';

function caddyRequest(method, path, body) {
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
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function buildConfig(services) {
  const routes = [];

  // Sort routes by specificity (longer paths first)
  const sorted = Object.entries(services)
    .filter(([, s]) => s.route && s.expose)
    .sort(([, a], [, b]) => (b.route || '').length - (a.route || '').length);

  for (const [, svc] of sorted) {
    const handler = svc.strip_prefix
      ? { handler: 'subroute', routes: [{ handle: [
          { handler: 'rewrite', strip_path_prefix: svc.route },
          { handler: 'reverse_proxy', upstreams: [{ dial: `localhost:${svc.port}` }] }
        ]}]}
      : { handler: 'reverse_proxy', upstreams: [{ dial: `localhost:${svc.port}` }] };

    routes.push({
      match: [{ path: [svc.route, svc.route + '/*'] }],
      handle: [handler]
    });
  }

  // Default route → service manager UI
  routes.push({
    handle: [{ handler: 'reverse_proxy', upstreams: [{ dial: 'localhost:9091' }] }]
  });

  return {
    apps: {
      http: {
        servers: {
          main: {
            listen: [':9090'],
            routes
          }
        }
      }
    }
  };
}

async function applyCaddyConfig(services) {
  const config = buildConfig(services);
  await caddyRequest('POST', '/load', config);
  return config;
}

async function getCaddyStatus() {
  try {
    const cfg = await caddyRequest('GET', '/config/');
    return { running: true, config: cfg };
  } catch {
    return { running: false };
  }
}

module.exports = { applyCaddyConfig, getCaddyStatus, buildConfig };
