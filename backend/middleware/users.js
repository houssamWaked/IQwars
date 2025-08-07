const express = require('express');
const UserController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, UserController.getProfile);

// Update user profile
router.put('/profile', authenticateToken, UserController.updateProfile);

// Get user statistics
router.get('/stats', authenticateToken, UserController.getStats);

module.exports = router;