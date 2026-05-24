// JWT auth — login route + middleware.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me';
const TOKEN_TTL = '12h';

function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: TOKEN_TTL });
}

function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Express middleware: 401 unless a valid `Authorization: Bearer <token>` is present.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: 'missing_token' });
  const payload = verify(m[1]);
  if (!payload) return res.status(401).json({ error: 'invalid_token' });
  req.user = payload;
  next();
}

// POST /api/auth/login  { email, password } -> { token, user }
function loginHandler(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'missing_credentials' });
  }
  const user = db
    .prepare('SELECT id, restaurant_id, email, password_hash FROM users WHERE email = ?')
    .get(String(email).toLowerCase().trim());
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });

  const ok = bcrypt.compareSync(String(password), user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

  const token = sign({
    sub: user.id,
    restaurant_id: user.restaurant_id,
    email: user.email,
  });
  res.json({
    token,
    user: { id: user.id, email: user.email, restaurant_id: user.restaurant_id },
  });
}

module.exports = { sign, verify, requireAuth, loginHandler };
