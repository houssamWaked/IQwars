const express = require('express');
const leaderboardController = require('../controllers/leaderboardController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/weekly', leaderboardController.getWeeklyLeaderboard);
router.get('/all-time', leaderboardController.getAllTimeLeaderboard);
router.get('/my-rank', leaderboardController.getUserRank);

module.exports = router;