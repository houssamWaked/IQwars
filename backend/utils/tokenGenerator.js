const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = {
  generateToken,
  verifyToken,
};