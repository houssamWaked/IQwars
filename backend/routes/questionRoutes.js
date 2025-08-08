const express = require('express');
const questionController = require('../controllers/questionController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/categories', questionController.getCategories);
router.get('/categories/:categoryId', questionController.getQuestionsByCategory);
router.get('/random', questionController.getRandomQuestions);

module.exports = router;