const { User, Game } = require('../models');
const { Op } = require('sequelize');

const getWeeklyLeaderboard = async (limit = 50) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const leaderboard = await User.findAll({
    attributes: [
      'id',
      'username',
      'displayName',
      'level',
      'currentStreak',
      [sequelize.fn('SUM', sequelize.col('games.score')), 'weeklyScore'],
      [sequelize.fn('COUNT', sequelize.col('games.id')), 'weeklyGames'],
    ],
    include: [
      {
        model: Game,
        as: 'games',
        where: {
          status: 'completed',
          completedAt: {
            [Op.gte]: oneWeekAgo,
          },
        },
        attributes: [],
        required: true,
      },
    ],
    group: ['User.id'],
    order: [[sequelize.literal('weeklyScore'), 'DESC']],
    limit,
  });

  return leaderboard.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    level: user.level,
    score: parseInt(user.dataValues.weeklyScore) || 0,
    gamesPlayed: parseInt(user.dataValues.weeklyGames) || 0,
    streak: user.currentStreak,
  }));
};

const getAllTimeLeaderboard = async (limit = 50) => {
  const leaderboard = await User.findAll({
    attributes: [
      'id',
      'username',
      'displayName',
      'level',
      'xp',
      'currentStreak',
      'totalGames',
      'totalCorrectAnswers',
    ],
    order: [['xp', 'DESC']],
    limit,
  });

  return leaderboard.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    level: user.level,
    score: user.xp,
    gamesPlayed: user.totalGames,
    correctAnswers: user.totalCorrectAnswers,
    streak: user.currentStreak,
  }));
};

const getUserRank = async (userId, period = 'weekly') => {
  let rank;
  let totalUsers;

  if (period === 'weekly') {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const userWeeklyScore = await User.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'username',
        'displayName',
        'level',
        'currentStreak',
        [sequelize.fn('SUM', sequelize.col('games.score')), 'weeklyScore'],
      ],
      include: [
        {
          model: Game,
          as: 'games',
          where: {
            status: 'completed',
            completedAt: {
              [Op.gte]: oneWeekAgo,
            },
          },
          attributes: [],
          required: false,
        },
      ],
      group: ['User.id'],
    });

    if (!userWeeklyScore) {
      return null;
    }

    const userScore = parseInt(userWeeklyScore.dataValues.weeklyScore) || 0;

    const betterUsers = await User.count({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('games.score')), 'weeklyScore'],
      ],
      include: [
        {
          model: Game,
          as: 'games',
          where: {
            status: 'completed',
            completedAt: {
              [Op.gte]: oneWeekAgo,
            },
          },
          attributes: [],
          required: true,
        },
      ],
      group: ['User.id'],
      having: sequelize.where(
        sequelize.fn('SUM', sequelize.col('games.score')),
        Op.gt,
        userScore
      ),
    });

    rank = (Array.isArray(betterUsers) ? betterUsers.length : betterUsers) + 1;
    
    totalUsers = await User.count({
      include: [
        {
          model: Game,
          as: 'games',
          where: {
            status: 'completed',
            completedAt: {
              [Op.gte]: oneWeekAgo,
            },
          },
          required: true,
        },
      ],
    });
  } else {
    // All-time ranking
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }

    const betterUsers = await User.count({
      where: {
        xp: {
          [Op.gt]: user.xp,
        },
      },
    });

    rank = betterUsers + 1;
    totalUsers = await User.count();
  }

  return {
    rank,
    totalUsers,
  };
};

module.exports = {
  getWeeklyLeaderboard,
  getAllTimeLeaderboard,
  getUserRank,
};