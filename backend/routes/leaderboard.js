const express = require('express');
const LeaderboardController = require('../controllers/leaderboardController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get global leaderboard
router.get('/', authenticateToken, LeaderboardController.getLeaderboard);

// Get friends leaderboard (placeholder)
router.get('/friends', authenticateToken, LeaderboardController.getFriendsLeaderboard);

module.exports = router;