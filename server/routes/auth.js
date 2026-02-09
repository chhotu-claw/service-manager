const express = require('express');
const bcrypt = require('bcryptjs');
const { loadConfig } = require('../lib/config');
const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const config = loadConfig();
  if (bcrypt.compareSync(password || '', config.passwordHash)) {
    req.session.authenticated = true;
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Wrong password' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/status', (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.authenticated) });
});

module.exports = router;
