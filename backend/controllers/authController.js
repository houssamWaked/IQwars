const authService = require('../services/authService');
const { generateToken } = require('../utils/tokenGenerator');

const register = async (req, res, next) => {
  try {
    const { username, email, password, displayName } = req.body;
    
    const user = await authService.registerUser({
      username,
      email,
      password,
      displayName: displayName || 'Genius Player',
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    const user = await authService.loginUser(username, password);
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        totalGames: user.totalGames,
        totalCorrectAnswers: user.totalCorrectAnswers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};