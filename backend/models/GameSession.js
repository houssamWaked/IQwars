const pool = require('../config/database');

class GameSession {
  constructor(gameData) {
    this.id = gameData.id;
    this.user_id = gameData.user_id;
    this.game_mode = gameData.game_mode;
    this.category_id = gameData.category_id;
    this.score = gameData.score;
    this.correct_answers = gameData.correct_answers;
    this.total_questions = gameData.total_questions;
    this.time_taken = gameData.time_taken;
    this.status = gameData.status;
    this.created_at = gameData.created_at;
  }

  // Create new game session
  static async create(userId, gameMode, categoryId = null) {
    try {
      const result = await pool.query(`
        INSERT INTO game_sessions (user_id, game_mode, category_id, status) 
        VALUES ($1, $2, $3, 'active') 
        RETURNING *
      `, [userId, gameMode, categoryId]);

      return new GameSession(result.rows[0]);
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  // Complete game session
  static async complete(gameData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { 
        userId,
        gameMode,
        score, 
        correctAnswers, 
        totalQuestions, 
        timeTaken,
        questionsAnswered
      } = gameData;

      // Create completed game session
      const gameResult = await client.query(`
        INSERT INTO game_sessions (
          user_id, game_mode, score, correct_answers, total_questions, time_taken, status
        ) VALUES ($1, $2, $3, $4, $5, $6, 'completed')
        RETURNING *
      `, [userId, gameMode, score, correctAnswers, totalQuestions, timeTaken]);

      const gameSession = new GameSession(gameResult.rows[0]);

      // Store individual answers
      if (questionsAnswered && questionsAnswered.length > 0) {
        for (const answer of questionsAnswered) {
          await client.query(`
            INSERT INTO game_answers (game_session_id, question_id, selected_answer, time_spent)
            VALUES ($1, $2, $3, $4)
          `, [gameSession.id, answer.question_id, answer.selected_answer, answer.time_spent]);
        }
      }

      await client.query('COMMIT');
      return gameSession;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error completing game session:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Get user's game history
  static async getHistory(userId, options = {}) {
    try {
      const { limit = 20, offset = 0 } = options;

      const result = await pool.query(`
        SELECT gs.*, c.name as category_name, c.color as category_color
        FROM game_sessions gs
        LEFT JOIN categories c ON gs.category_id = c.id
        WHERE gs.user_id = $1 AND gs.status = 'completed'
        ORDER BY gs.created_at DESC
        LIMIT $2 OFFSET $3
      `, [userId, limit, offset]);

      return result.rows.map(game => ({
        ...new GameSession(game),
        categoryName: game.category_name,
        categoryColor: game.category_color,
        accuracy: game.total_questions > 0 ? Math.round((game.correct_answers / game.total_questions) * 100) : 0
      }));
    } catch (error) {
      console.error('Error getting game history:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const stats = await pool.query(`
        SELECT 
          COUNT(*) as total_games,
          SUM(correct_answers) as total_correct,
          AVG(score) as avg_score,
          MAX(score) as best_score,
          AVG(CASE WHEN total_questions > 0 THEN (correct_answers::float / total_questions) * 100 ELSE 0 END) as avg_accuracy,
          COUNT(CASE WHEN game_mode = '60-second' THEN 1 END) as sixty_second_games,
          COUNT(CASE WHEN game_mode = 'classic' THEN 1 END) as classic_games,
          COUNT(CASE WHEN game_mode = 'story' THEN 1 END) as story_games,
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

      return {
        overall: stats.rows[0],
        categories: categoryStats.rows
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
}

module.exports = GameSession;