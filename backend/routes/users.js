const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT 
        u.*,
        CASE 
          WHEN u.total_games > 0 THEN ROUND((u.correct_answers::float / (u.total_games * 10)) * 100, 1)
          ELSE 0 
        END as accuracy,
        COALESCE(recent_games.avg_score, 0) as recent_avg_score,
        COALESCE(recent_games.games_this_week, 0) as games_this_week
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id,
          AVG(score) as avg_score,
          COUNT(*) as games_this_week
        FROM game_sessions 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' 
          AND status = 'completed'
        GROUP BY user_id
      ) recent_games ON u.id = recent_games.user_id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        level: user.level,
        xp: user.xp,
        xpToNext: (user.level * 1000) - (user.xp % 1000),
        coins: user.coins,
        currentStreak: user.current_streak,
        bestStreak: user.best_streak,
        totalGames: user.total_games,
        correctAnswers: user.correct_answers,
        accuracy: parseFloat(user.accuracy),
        recentAvgScore: Math.round(user.recent_avg_score),
        gamesThisWeek: user.games_this_week,
        joinedAt: user.created_at,
        lastPlayed: user.last_played
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    // Check if username is taken by another user
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND id != $2',
      [username.toLowerCase(), userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Update username
    const result = await pool.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING username',
      [username, userId]
    );

    res.json({ 
      message: 'Profile updated successfully',
      username: result.rows[0].username 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await pool.query(`
      SELECT 
        -- Basic stats
        COUNT(*) as total_games,
        SUM(correct_answers) as total_correct,
        AVG(score) as avg_score,
        MAX(score) as best_score,
        AVG(CASE WHEN total_questions > 0 THEN (correct_answers::float / total_questions) * 100 ELSE 0 END) as avg_accuracy,
        
        -- Game mode breakdown
        COUNT(CASE WHEN game_mode = '60-second' THEN 1 END) as sixty_second_games,
        COUNT(CASE WHEN game_mode = 'classic' THEN 1 END) as classic_games,
        COUNT(CASE WHEN game_mode = 'story' THEN 1 END) as story_games,
        
        -- Recent performance
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as games_this_week,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as games_this_month
        
      FROM game_sessions 
      WHERE user_id = $1 AND status = 'completed'
    `, [userId]);

    const categoryStats = await pool.query(`
      SELECT 
        c.name as category,
        c.color,
        COUNT(gs.id) as games_played,
        AVG(gs.score) as avg_score,
        SUM(gs.correct_answers) as total_correct
      FROM game_sessions gs
      JOIN categories c ON gs.category_id = c.id
      WHERE gs.user_id = $1 AND gs.status = 'completed'
      GROUP BY c.id, c.name, c.color
      ORDER BY games_played DESC
    `, [userId]);

    const result = stats.rows[0];
    
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
      categories: categoryStats.rows.map(cat => ({
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
});

module.exports = router;