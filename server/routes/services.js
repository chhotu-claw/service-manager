const express = require('express');
const { loadServices } = require('../lib/config');
const systemd = require('../lib/systemd');
const { getHealthCache } = require('../lib/health');
const router = express.Router();

router.get('/', async (req, res) => {
  const services = loadServices();
  const health = getHealthCache();
  const result = {};

  for (const [id, svc] of Object.entries(services)) {
    let status = 'unknown';
    if (svc.systemd) {
      try { status = await systemd.getStatus(svc.systemd); } catch {}
    }
    result[id] = { ...svc, id, systemdStatus: status, healthy: health[id] ?? null };
  }
  res.json(result);
});

router.post('/:id/:action', async (req, res) => {
  const { id, action } = req.params;
  const services = loadServices();
  const svc = services[id];
  if (!svc) return res.status(404).json({ error: 'Service not found' });
  if (!svc.systemd) return res.status(400).json({ error: 'No systemd unit' });
  if (!['start', 'stop', 'restart'].includes(action)) return res.status(400).json({ error: 'Invalid action' });

  try {
    await systemd[action === 'start' ? 'startService' : action === 'stop' ? 'stopService' : 'restartService'](svc.systemd);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/logs', async (req, res) => {
  const services = loadServices();
  const svc = services[req.params.id];
  if (!svc?.systemd) return res.status(400).json({ error: 'No systemd unit' });
  const logs = await systemd.getLogs(svc.systemd, parseInt(req.query.lines) || 100);
  res.json({ logs });
});

module.exports = router;
