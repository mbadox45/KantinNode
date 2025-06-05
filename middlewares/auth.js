const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia123';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect: Bearer token

  if (!token) return res.status(401).json({ code: 401, status: false, message: 'Token tidak ditemukan' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ code: 403, status: false, message: 'Token tidak valid' });

    req.user = user; // Payload token disimpan di req.user
    next();
  });
}

module.exports = authenticateToken;
