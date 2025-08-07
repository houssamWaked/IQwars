const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  // Register new user
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const exists = await User.existsByEmailOrUsername(email, username);
      if (exists) {
        return res.status(400).json({ error: 'User with this email or username already exists' });
      }

      // Create new user
      const user = await User.create({ username, email, password });

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Registration successful',
        user: user.toPublic(),
        token
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const validPassword = await user.verifyPassword(password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Update last login
      await user.updateLastLogin();

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({
        message: 'Login successful',
        user: user.toPublic(),
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  // Refresh token
  static async refresh(req, res) {
    try {
      const newToken = jwt.sign(
        { userId: req.user.id, username: req.user.username }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.json({ token: newToken });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  }

  // Verify token (for app startup)
  static async verify(req, res) {
    try {
      res.json({
        valid: true,
        user: req.user.toPublic()
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({ error: 'Token verification failed' });
    }
  }
}

module.exports = AuthController;