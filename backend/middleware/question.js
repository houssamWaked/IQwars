const express = require('express');
const QuestionController = require('../controllers/questionController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get random questions for game
router.get('/random', authenticateToken, QuestionController.getRandomQuestions);

// Get all categories
router.get('/categories', authenticateToken, QuestionController.getCategories);

// Validate answer (used during gameplay)
router.post('/validate', authenticateToken, QuestionController.validateAnswer);

module.exports = router;