const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.put('/profile', userController.updateProfile);
router.get('/stats', userController.getUserStats);
router.get('/achievements', userController.getUserAchievements);
router.get('/daily-challenges', userController.getDailyChallenges);

module.exports = router;