const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia123'; // simpan di .env lebih aman

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = {
  generateToken,
  verifyToken,
};
