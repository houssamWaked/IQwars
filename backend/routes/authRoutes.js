const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation, 
  handleValidationErrors 
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;