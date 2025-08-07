const express = require('express');
const AuthController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Register new user
router.post('/register', validateRegistration, AuthController.register);

// Login user
router.post('/login', validateLogin, AuthController.login);

// Refresh token
router.post('/refresh', authenticateToken, AuthController.refresh);

// Verify token (for app startup)
router.get('/verify', authenticateToken, AuthController.verify);

module.exports = router;