const express = require('express');
const tunnel = require('../lib/tunnel');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(tunnel.getTunnelInfo());
});

router.post('/start', (req, res) => {
  res.json(tunnel.startTunnel());
});

router.post('/stop', (req, res) => {
  res.json(tunnel.stopTunnel());
});

router.post('/restart', (req, res) => {
  tunnel.stopTunnel();
  setTimeout(() => res.json(tunnel.startTunnel()), 1000);
});

module.exports = router;
