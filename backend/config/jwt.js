module.exports = {
  secret: process.env.JWT_SECRET || 'fallback-secret-key',
  expiresIn: process.env.JWT_EXPIRE || '24h',
};
