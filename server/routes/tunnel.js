const express = require('express');
const { getTunnelInfo } = require('../lib/tunnel');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(getTunnelInfo());
});

// start/stop/restart removed — cloudflared is managed by systemd
router.post('/start', (req, res) => {
  res.status(400).json({ error: 'cloudflared is managed by systemd. Use: sudo systemctl start cloudflared' });
});

router.post('/stop', (req, res) => {
  res.status(400).json({ error: 'cloudflared is managed by systemd. Use: sudo systemctl stop cloudflared' });
});

router.post('/restart', (req, res) => {
  res.status(400).json({ error: 'cloudflared is managed by systemd. Use: sudo systemctl restart cloudflared' });
});

module.exports = router;
