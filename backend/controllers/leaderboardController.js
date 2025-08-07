const pool = require('../config/database');

class LeaderboardController {
  // Get global leaderboard
  static async getLeaderboard(req, res) {
    try {
      const { 
        type = 'all-time', 
        limit = 50, 
        category_id,
        game_mode 
      } = req.query;
      
      let timeFilter = '';
      let gameModeFilter = '';
      const params = [];

      // Time period filter
      if (type === 'weekly') {
        timeFilter = "AND gs.created_at >= CURRENT_DATE - INTERVAL '7 days'";
      } else if (type === 'monthly') {
        timeFilter = "AND gs.created_at >= CURRENT_DATE - INTERVAL '30 days'";
      } else if (type === 'daily') {
        timeFilter = "AND gs.created_at >= CURRENT_DATE";
      }

      // Category filter
      if (category_id) {
        timeFilter += ` AND gs.category_id = ${params.length + 1}`;
        params.push(parseInt(category_id));
      }

      // Game mode filter
      if (game_mode && ['60-second', 'classic', 'story'].includes(game_mode)) {
        gameModeFilter = ` AND gs.game_mode = ${params.length + 1}`;
        params.push(game_mode);
      }

      const query = `
        SELECT 
          u.id,
          u.username,
          u.level,
          u.current_streak,
          COALESCE(SUM(gs.score), 0) as total_score,
          COALESCE(SUM(gs.correct_answers), 0) as total_correct,
          COUNT(gs.id) as games_played,
          COALESCE(AVG(CASE WHEN gs.total_questions > 0 THEN (gs.correct_answers::float / gs.total_questions) * 100 ELSE 0 END), 0) as accuracy,
          MAX(gs.score) as best_score,
          u.created_at as joined_at
        FROM users u
        LEFT JOIN game_sessions gs ON u.id = gs.user_id 
          AND gs.status = 'completed' 
          ${timeFilter} 
          ${gameModeFilter}
        GROUP BY u.id, u.username, u.level, u.current_streak, u.created_at
        HAVING COUNT(gs.id) > 0 OR ${params.length + 1} = 'all-time'
        ORDER BY total_score DESC, accuracy DESC, games_played DESC
        LIMIT ${params.length + 2}
      `;
      
      params.push(type, Math.min(parseInt(limit), 100));

      const result = await pool.query(query, params);

      const leaderboard = result.rows.map((player, index) => ({
        rank: index + 1,
        id: player.id,
        username: player.username,
        level: player.level,
        totalScore: parseInt(player.total_score),
        totalCorrect: parseInt(player.total_correct),
        gamesPlayed: parseInt(player.games_played),
        accuracy: Math.round(player.accuracy),
        bestScore: parseInt(player.best_score),
        currentStreak: player.current_streak,
        joinedAt: player.joined_at
      }));

      // Get current user's rank
      const userRankQuery = `
        SELECT rank FROM (
          SELECT 
            u.id,
            ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(gs.score), 0) DESC, 
                             COALESCE(AVG(CASE WHEN gs.total_questions > 0 THEN (gs.correct_answers::float / gs.total_questions) * 100 ELSE 0 END), 0) DESC,
                             COUNT(gs.id) DESC) as rank
          FROM users u
          LEFT JOIN game_sessions gs ON u.id = gs.user_id 
            AND gs.status = 'completed' 
            ${timeFilter}
            ${gameModeFilter}
          GROUP BY u.id
          HAVING COUNT(gs.id) > 0 OR ${params.length - 1} = 'all-time'
        ) ranked_users 
        WHERE id = ${params.length}
      `;
      
      const userRankParams = [...params.slice(0, -2), type, req.user.id];
      const userRankResult = await pool.query(userRankQuery, userRankParams);
      
      const userRank = userRankResult.rows.length > 0 ? userRankResult.rows[0].rank : null;

      res.json({ 
        leaderboard,
        userRank: userRank ? parseInt(userRank) : null,
        type,
        total: leaderboard.length
      });

    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  // Get friends leaderboard (placeholder)
  static async getFriendsLeaderboard(req, res) {
    try {
      // For now, return empty array - implement friends system later
      res.json({ 
        leaderboard: [],
        message: 'Friends system not implemented yet'
      });
    } catch (error) {
      console.error('Friends leaderboard error:', error);
      res.status(500).json({ error: 'Failed to fetch friends leaderboard' });
    }
  }
}

module.exports = LeaderboardController;