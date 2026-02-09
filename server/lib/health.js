const http = require('http');

const healthCache = {};

function checkHealth(url) {
  return new Promise(resolve => {
    const req = http.get(url, { timeout: 3000 }, res => {
      res.resume();
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function checkPort(port) {
  return new Promise(resolve => {
    const req = http.get(`http://localhost:${port}`, { timeout: 2000 }, res => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function pollHealth(services) {
  const results = {};
  for (const [id, svc] of Object.entries(services)) {
    if (svc.health) {
      results[id] = await checkHealth(svc.health);
    } else {
      results[id] = await checkPort(svc.port);
    }
  }
  Object.assign(healthCache, results);
  return results;
}

function getHealthCache() { return { ...healthCache }; }

module.exports = { pollHealth, getHealthCache, checkPort };
