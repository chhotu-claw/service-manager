const express = require('express');
const session = require('express-session');
const path = require('path');
const { loadConfig, loadServices } = require('./lib/config');
const { applyCaddyConfig } = require('./lib/caddy');
const { startTunnel } = require('./lib/tunnel');
const { pollHealth } = require('./lib/health');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = 9091;
const config = loadConfig();

app.use(express.json());
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(authMiddleware);

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/tunnel', require('./routes/tunnel'));

// Serve React build
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('/{*splat}', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`[service-manager] listening on port ${PORT}`);

  // Configure Caddy
  const services = loadServices();
  applyCaddyConfig(services)
    .then(() => console.log('[caddy] config applied'))
    .catch(err => console.error('[caddy] config failed:', err.message));

  // Start tunnel
  startTunnel();

  // Health polling every 30s
  pollHealth(services);
  setInterval(() => pollHealth(loadServices()), 30000);
});
