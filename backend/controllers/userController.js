const userService = require('../services/userService');

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { displayName, email } = req.body;
    
    const updatedUser = await userService.updateProfile(userId, { displayName, email });
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await userService.getUserStats(userId);
    
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

const getUserAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const achievements = await userService.getUserAchievements(userId);
    
    res.json({ achievements });
  } catch (error) {
    next(error);
  }
};

const getDailyChallenges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const challenges = await userService.getDailyChallenges(userId);
    
    res.json({ challenges });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  getUserStats,
  getUserAchievements,
  getDailyChallenges,
};