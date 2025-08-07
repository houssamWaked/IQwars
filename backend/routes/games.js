const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const { validateGameComplete } = require('../middleware/validation');
const router = express.Router();

// Start a new game session
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { game_mode, category_id } = req.body;
    const userId = req.user.id;

    if (!['60-second', 'classic', 'story'].includes(game_mode)) {
      return res.status(400).json({ error: 'Invalid game mode' });
    }

    const result = await pool.query(`
      INSERT INTO game_sessions (user_id, game_mode, category_id, status) 
      VALUES ($1, $2, $3, 'active') 
      RETURNING id, created_at
    `, [userId, game_mode, category_id || null]);

    const gameSession = result.rows[0];

    res.json({ 
      gameSessionId: gameSession.id,
      startedAt: gameSession.created_at,
      gameMode: game_mode
    });

  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Complete a game session
router.post('/complete', authenticateToken, validateGameComplete, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      game_mode,
      score, 
      correct_answers, 
      total_questions, 
      time_taken,
      questions_answered
    } = req.body;
    
    const userId = req.user.id;

    // Create game session record
    const gameResult = await client.query(`
      INSERT INTO game_sessions (
        user_id, game_mode, score, correct_answers, total_questions, time_taken, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'completed')
      RETURNING id, created_at
    `, [userId, game_mode, score, correct_answers, total_questions, time_taken]);

    const gameSessionId = gameResult.rows[0].id;

    // Store individual question answers
    for (const answer of questions_answered) {
      await client.query(`
        INSERT INTO game_answers (game_session_id, question_id, selected_answer, time_spent)
        VALUES ($1, $2, $3, $4)
      `, [gameSessionId, answer.question_id, answer.selected_answer, answer.time_spent]);
    }

    // Calculate rewards
    const accuracy = total_questions > 0 ? (correct_answers / total_questions) * 100 : 0;
    let xpGained = correct_answers * 10; // Base XP
    let coinsGained = Math.floor(score / 100); // Base coins

    // Bonus rewards
    if (accuracy === 100) {
      xpGained += 50; // Perfect game bonus
      coinsGained += 25;
    } else if (accuracy >= 80) {
      xpGained += 25; // High accuracy bonus
      coinsGained += 10;
    }

    // Speed bonus for 60-second mode
    if (game_mode === '60-second' && correct_answers >= 20) {
      xpGained += 30;
      coinsGained += 15;
    }

    // Update user stats
    const userUpdate = await client.query(`
      UPDATE users 
      SET total_games = total_games + 1,
          correct_answers = correct_answers + $1,
          xp = xp + $2,
          coins = coins + $3,
          last_played = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING level, xp, coins, total_games, correct_answers
    `, [correct_answers, xpGained, coinsGained, userId]);

    const updatedUser = userUpdate.rows[0];

    // Check for level up (every 1000 XP)
    const newLevel = Math.floor(updatedUser.xp / 1000) + 1;
    let leveledUp = false;
    
    if (newLevel > updatedUser.level) {
      await client.query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
      leveledUp = true;
      coinsGained += newLevel * 10; // Level up bonus
    }

    // Update streak (simplified - just increment for now)
    await client.query(
      'UPDATE users SET current_streak = current_streak + 1, best_streak = GREATEST(best_streak, current_streak + 1) WHERE id = $1',
      [userId]
    );

    await client.query('COMMIT');

    res.json({ 
      message: 'Game completed successfully',
      gameSessionId,
      results: {
        score,
        correctAnswers: correct_answers,
        totalQuestions: total_questions,
        accuracy: Math.round(accuracy),
        timeSpent: time_taken
      },
      rewards: {
        xpGained,
        coinsGained,
        leveledUp,
        newLevel: leveledUp ? newLevel : updatedUser.level
      },
      userStats: {
        totalGames: updatedUser.total_games,
        totalCorrectAnswers: updatedUser.correct_answers,
        level: leveledUp ? newLevel : updatedUser.level,
        xp: updatedUser.xp,
        coins: updatedUser.coins + (leveledUp ? newLevel * 10 : 0)
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Complete game error:', error);
    res.status(500).json({ error: 'Failed to complete game' });
  } finally {
    client.release();
  }
});

// Get user's game history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT gs.*, c.name as category_name, c.color as category_color
      FROM game_sessions gs
      LEFT JOIN categories c ON gs.category_id = c.id
      WHERE gs.user_id = $1 AND gs.status = 'completed'
      ORDER BY gs.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, parseInt(limit), parseInt(offset)]);

    const games = result.rows.map(game => ({
      id: game.id,
      gameMode: game.game_mode,
      score: game.score,
      correctAnswers: game.correct_answers,
      totalQuestions: game.total_questions,
      accuracy: game.total_questions > 0 ? Math.round((game.correct_answers / game.total_questions) * 100) : 0,
      timeSpent: game.time_taken,
      category: game.category_name,
      categoryColor: game.category_color,
      playedAt: game.created_at
    }));

    res.json({ games, hasMore: games.length === parseInt(limit) });

  } catch (error) {
    console.error('Game history error:', error);
    res.status(500).json({ error: 'Failed to fetch game history' });
  }
});

module.exports = router;