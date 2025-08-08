const express = require('express');
const gameController = require('../controllers/gameController');
const authenticateToken = require('../middleware/auth');
const { gameValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.use(authenticateToken); // All game routes require authentication

router.post('/start', gameValidation, handleValidationErrors, gameController.startGame);
router.get('/:gameId/questions', gameController.getGameQuestions);
router.post('/:gameId/questions/:questionId/answer', gameController.submitAnswer);
router.post('/:gameId/complete', gameController.completeGame);
router.get('/history', gameController.getGameHistory);

module.exports = router;