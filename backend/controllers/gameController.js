const GameSession = require('../models/GameSession');
const User = require('../models/User');

class GameController {
  // Start a new game session
  static async startGame(req, res) {
    try {
      const { game_mode, category_id } = req.body;
      const userId = req.user.id;

      if (!['60-second', 'classic', 'story'].includes(game_mode)) {
        return res.status(400).json({ error: 'Invalid game mode' });
      }

      const gameSession = await GameSession.create(userId, game_mode, category_id);

      res.json({ 
        gameSessionId: gameSession.id,
        startedAt: gameSession.created_at,
        gameMode: game_mode
      });

    } catch (error) {
      console.error('Start game error:', error);
      res.status(500).json({ error: 'Failed to start game' });
    }
  }

  // Complete a game session
  static async completeGame(req, res) {
    try {
      const { 
        game_mode,
        score, 
        correct_answers, 
        total_questions, 
        time_taken,
        questions_answered
      } = req.body;
      
      const userId = req.user.id;

      // Create completed game session
      const gameSession = await GameSession.complete({
        userId,
        gameMode: game_mode,
        score,
        correctAnswers: correct_answers,
        totalQuestions: total_questions,
        timeTaken: time_taken,
        questionsAnswered: questions_answered
      });

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
      const user = await User.findById(userId);
      const updatedStats = await user.updateStats(correct_answers, xpGained, coinsGained);

      // Check for level up (every 1000 XP)
      const newLevel = Math.floor(updatedStats.xp / 1000) + 1;
      let leveledUp = false;
      
      if (newLevel > updatedStats.level) {
        await user.updateLevel(newLevel);
        leveledUp = true;
        coinsGained += newLevel * 10; // Level up bonus
      }

      // Update streak
      await user.updateStreak();

      res.json({ 
        message: 'Game completed successfully',
        gameSessionId: gameSession.id,
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
          newLevel: leveledUp ? newLevel : updatedStats.level
        },
        userStats: {
          totalGames: updatedStats.total_games,
          totalCorrectAnswers: updatedStats.correct_answers,
          level: leveledUp ? newLevel : updatedStats.level,
          xp: updatedStats.xp,
          coins: updatedStats.coins + (leveledUp ? newLevel * 10 : 0)
        }
      });

    } catch (error) {
      console.error('Complete game error:', error);
      res.status(500).json({ error: 'Failed to complete game' });
    }
  }

  // Get user's game history
  static async getGameHistory(req, res) {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const userId = req.user.id;

      const games = await GameSession.getHistory(userId, { 
        limit: parseInt(limit), 
        offset: parseInt(offset) 
      });

      const formattedGames = games.map(game => ({
        id: game.id,
        gameMode: game.game_mode,
        score: game.score,
        correctAnswers: game.correct_answers,
        totalQuestions: game.total_questions,
        accuracy: game.accuracy,
        timeSpent: game.time_taken,
        category: game.categoryName,
        categoryColor: game.categoryColor,
        playedAt: game.created_at
      }));

      res.json({ 
        games: formattedGames, 
        hasMore: formattedGames.length === parseInt(limit) 
      });

    } catch (error) {
      console.error('Game history error:', error);
      res.status(500).json({ error: 'Failed to fetch game history' });
    }
  }
}

module.exports = GameController;