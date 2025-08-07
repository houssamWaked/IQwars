const express = require('express');
const GameController = require('../controllers/gameController');
const authenticateToken = require('../middleware/auth');
const { validateGameComplete } = require('../middleware/validation');
const router = express.Router();

// Start a new game session
router.post('/start', authenticateToken, GameController.startGame);

// Complete a game session
router.post('/complete', authenticateToken, validateGameComplete, GameController.completeGame);

// Get user's game history
router.get('/history', authenticateToken, GameController.getGameHistory);

module.exports = router;