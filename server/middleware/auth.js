function authMiddleware(req, res, next) {
  // Allow login route
  if (req.path === '/api/auth/login' || req.path === '/api/auth/status') return next();
  // Allow static assets
  if (!req.path.startsWith('/api/')) return next();
  
  if (req.session && req.session.authenticated) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

module.exports = authMiddleware;
