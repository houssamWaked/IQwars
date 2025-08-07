const User = require('../models/User');
const GameSession = require('../models/GameSession');

class UserController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const user = req.user;
      const profile = await user.getProfile();

      res.json({ 
        user: {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          level: profile.level,
          xp: profile.xp,
          xpToNext: (profile.level * 1000) - (profile.xp % 1000),
          coins: profile.coins,
          currentStreak: profile.current_streak,
          bestStreak: profile.best_streak,
          totalGames: profile.total_games,
          correctAnswers: profile.correct_answers,
          accuracy: parseFloat(profile.accuracy),
          recentAvgScore: Math.round(profile.recent_avg_score),
          gamesThisWeek: profile.games_this_week,
          joinedAt: profile.created_at,
          lastPlayed: profile.last_played
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const { username } = req.body;
      const user = req.user;

      if (!username || username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
      }

      // Check if username is taken by another user
      const existingUser = await User.existsByEmailOrUsername('', username);
      if (existingUser) {
        // Additional check to make sure it's not the same user
        const existing = await User.findByEmail(user.email);
        if (existing && existing.username !== username) {
          return res.status(400).json({ error: 'Username already taken' });
        }
      }

      // Update username
      await user.updateUsername(username);

      res.json({ 
        message: 'Profile updated successfully',
        username: username
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Get user statistics
  static async getStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await GameSession.getUserStats(userId);

      const result = stats.overall;
      
      res.json({
        overall: {
          totalGames: parseInt(result.total_games) || 0,
          totalCorrectAnswers: parseInt(result.total_correct) || 0,
          averageScore: Math.round(result.avg_score) || 0,
          bestScore: parseInt(result.best_score) || 0,
          averageAccuracy: Math.round(result.avg_accuracy) || 0
        },
        gameModes: {
          sixtySecond: parseInt(result.sixty_second_games) || 0,
          classic: parseInt(result.classic_games) || 0,
          story: parseInt(result.story_games) || 0
        },
        recent: {
          gamesThisWeek: parseInt(result.games_this_week) || 0,
          gamesThisMonth: parseInt(result.games_this_month) || 0
        },
        categories: stats.categories.map(cat => ({
          category: cat.category,
          color: cat.color,
          gamesPlayed: parseInt(cat.games_played),
          averageScore: Math.round(cat.avg_score),
          totalCorrect: parseInt(cat.total_correct)
        }))
      });

    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
  }
}

module.exports = UserController;
