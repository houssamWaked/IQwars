const leaderboardService = require('../services/leaderboardService');

const getWeeklyLeaderboard = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const leaderboard = await leaderboardService.getWeeklyLeaderboard(parseInt(limit));
    
    res.json({
      leaderboard,
      period: 'weekly',
    });
  } catch (error) {
    next(error);
  }
};

const getAllTimeLeaderboard = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const leaderboard = await leaderboardService.getAllTimeLeaderboard(parseInt(limit));
    
    res.json({
      leaderboard,
      period: 'all-time',
    });
  } catch (error) {
    next(error);
  }
};

const getUserRank = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period = 'weekly' } = req.query;
    
    const rank = await leaderboardService.getUserRank(userId, period);
    
    res.json({
      rank,
      period,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeeklyLeaderboard,
  getAllTimeLeaderboard,
  getUserRank,
};