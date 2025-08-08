const { User, UserAchievement, Game } = require('../models');
const { Op } = require('sequelize');

const updateProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  await user.update(updateData);
  
  const { password, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

const getUserStats = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  // Get additional stats
  const today = new Date();
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  const weeklyStats = await Game.findAll({
    where: {
      userId,
      status: 'completed',
      completedAt: {
        [Op.gte]: thisWeek,
      },
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'gamesThisWeek'],
      [sequelize.fn('SUM', sequelize.col('score')), 'scoreThisWeek'],
      [sequelize.fn('SUM', sequelize.col('correctAnswers')), 'correctThisWeek'],
    ],
  });

  const stats = weeklyStats[0]?.dataValues || {};

  return {
    ...user.toJSON(),
    gamesThisWeek: parseInt(stats.gamesThisWeek) || 0,
    scoreThisWeek: parseInt(stats.scoreThisWeek) || 0,
    correctAnswersThisWeek: parseInt(stats.correctThisWeek) || 0,
    accuracy: user.totalGames > 0 ? 
      Math.round((user.totalCorrectAnswers / (user.totalGames * 10)) * 100) : 0,
  };
};

const getUserAchievements = async (userId) => {
  const userAchievements = await UserAchievement.findAll({
    where: { userId },
    order: [['unlockedAt', 'DESC']],
  });

  const allAchievements = [
    {
      key: 'first_win',
      title: 'First Win',
      description: 'Win your first game',
      icon: 'trophy',
      rarity: 'common',
    },
    {
      key: 'speed_demon',
      title: 'Speed Demon',
      description: 'Answer 50 questions in 60 seconds',
      icon: 'zap',
      rarity: 'rare',
    },
    {
      key: 'perfectionist',
      title: 'Perfectionist',
      description: 'Get 100% accuracy in a game',
      icon: 'star',
      rarity: 'epic',
    },
    {
      key: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 10-day streak',
      icon: 'fire',
      rarity: 'legendary',
    },
    {
      key: 'category_expert',
      title: 'Category Expert',
      description: 'Complete all levels in a category',
      icon: 'award',
      rarity: 'epic',
    },
    {
      key: 'quiz_legend',
      title: 'Quiz Legend',
      description: 'Reach level 25',
      icon: 'crown',
      rarity: 'legendary',
    },
  ];

  const unlockedKeys = userAchievements.map(ua => ua.achievementKey);

  return allAchievements.map(achievement => ({
    ...achievement,
    unlocked: unlockedKeys.includes(achievement.key),
    unlockedAt: userAchievements.find(ua => ua.achievementKey === achievement.key)?.unlockedAt || null,
  }));
};

const getDailyChallenges = async (userId) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  // Get today's games for progress tracking
  const todayGames = await Game.findAll({
    where: {
      userId,
      status: 'completed',
      completedAt: {
        [Op.gte]: startOfDay,
        [Op.lt]: endOfDay,
      },
    },
  });

  const totalCorrectToday = todayGames.reduce((sum, game) => sum + game.correctAnswers, 0);
  const perfectGames = todayGames.filter(game => 
    game.totalQuestions > 0 && game.correctAnswers === game.totalQuestions
  ).length;

  const uniqueCategories = new Set(
    todayGames.filter(game => game.categoryId).map(game => game.categoryId)
  ).size;

  // Define daily challenges
  const challenges = [
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Answer 20 questions in 60 seconds',
      progress: Math.min(totalCorrectToday, 20),
      total: 20,
      reward: 100,
      type: 'coins',
      completed: totalCorrectToday >= 20,
    },
    {
      id: 'perfect_score',
      title: 'Perfect Score',
      description: 'Get 100% in Classic Mode',
      progress: perfectGames,
      total: 1,
      reward: 250,
      type: 'coins',
      completed: perfectGames >= 1,
    },
    {
      id: 'category_master',
      title: 'Category Master',
      description: 'Complete 3 different categories',
      progress: uniqueCategories,
      total: 3,
      reward: 150,
      type: 'coins',
      completed: uniqueCategories >= 3,
    },
  ];

  return challenges;
};

module.exports = {
  updateProfile,
  getUserStats,
  getUserAchievements,
  getDailyChallenges,
};