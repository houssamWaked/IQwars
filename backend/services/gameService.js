const { Game, Question, Category, GameQuestion, User, UserAchievement } = require('../models');
const { calculateXP, calculateCoins, calculateLevel, checkAchievements } = require('../utils/gameLogic');
const { Op } = require('sequelize');

const startGame = async (userId, gameMode, categoryId = null) => {
  // Create new game record
  const game = await Game.create({
    userId,
    gameMode,
    categoryId,
    status: 'in_progress',
  });

  // Get questions for the game
  let questions;
  const questionCount = gameMode === 'sixty-second' ? 50 : 10; // More questions for 60-second mode

  if (categoryId) {
    questions = await Question.findAll({
      where: {
        categoryId,
        isActive: true,
      },
      order: [['id', 'ASC']], // For story mode progression
      limit: questionCount,
    });
  } else {
    questions = await Question.findAll({
      where: {
        isActive: true,
      },
      order: sequelize.random(),
      limit: questionCount,
    });
  }

  if (questions.length === 0) {
    throw new Error('No questions available for this game mode');
  }

  // Create game questions
  const gameQuestions = questions.map((question, index) => ({
    gameId: game.id,
    questionId: question.id,
    questionOrder: index + 1,
  }));

  await GameQuestion.bulkCreate(gameQuestions);

  return {
    id: game.id,
    gameMode: game.gameMode,
    categoryId: game.categoryId,
    totalQuestions: questions.length,
    status: game.status,
  };
};

const getGameQuestions = async (gameId, userId) => {
  // Verify game belongs to user
  const game = await Game.findOne({
    where: { id: gameId, userId },
  });

  if (!game) {
    const error = new Error('Game not found');
    error.status = 404;
    throw error;
  }

  const gameQuestions = await GameQuestion.findAll({
    where: { gameId },
    include: [
      {
        model: Question,
        as: 'question',
        attributes: ['id', 'question', 'options', 'difficulty', 'hint'],
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['name', 'slug'],
          },
        ],
      },
    ],
    order: [['questionOrder', 'ASC']],
  });

  return gameQuestions.map(gq => ({
    gameQuestionId: gq.id,
    questionOrder: gq.questionOrder,
    question: gq.question,
    isAnswered: gq.userAnswer !== null,
  }));
};

const submitAnswer = async (gameId, questionId, userId, answer, timeToAnswer) => {
  // Verify game belongs to user
  const game = await Game.findOne({
    where: { id: gameId, userId, status: 'in_progress' },
  });

  if (!game) {
    const error = new Error('Game not found or already completed');
    error.status = 404;
    throw error;
  }

  // Find the game question
  const gameQuestion = await GameQuestion.findOne({
    where: { gameId, questionId },
    include: [
      {
        model: Question,
        as: 'question',
        attributes: ['correctAnswer', 'difficulty'],
      },
    ],
  });

  if (!gameQuestion) {
    const error = new Error('Question not found in this game');
    error.status = 404;
    throw error;
  }

  if (gameQuestion.userAnswer !== null) {
    const error = new Error('Question already answered');
    error.status = 400;
    throw error;
  }

  const isCorrect = answer === gameQuestion.question.correctAnswer;

  // Update game question with answer
  await gameQuestion.update({
    userAnswer: answer,
    isCorrect,
    timeToAnswer,
    answeredAt: new Date(),
  });

  // Calculate points for this answer
  let points = 0;
  if (isCorrect) {
    const difficultyMultiplier = {
      'easy': 100,
      'medium': 150,
      'hard': 200,
    };
    points = difficultyMultiplier[gameQuestion.question.difficulty] || 100;
    
    // Time bonus for quick answers
    if (timeToAnswer && timeToAnswer < 10) {
      points += 50;
    }
  }

  return {
    isCorrect,
    correctAnswer: gameQuestion.question.correctAnswer,
    points,
    timeToAnswer,
  };
};

const completeGame = async (gameId, userId) => {
  const game = await Game.findOne({
    where: { id: gameId, userId },
    include: [
      {
        model: GameQuestion,
        as: 'gameQuestions',
        include: [
          {
            model: Question,
            as: 'question',
            attributes: ['difficulty'],
          },
        ],
      },
    ],
  });

  if (!game) {
    const error = new Error('Game not found');
    error.status = 404;
    throw error;
  }

  // Calculate final statistics
  const totalQuestions = game.gameQuestions.length;
  const answeredQuestions = game.gameQuestions.filter(gq => gq.userAnswer !== null);
  const correctAnswers = answeredQuestions.filter(gq => gq.isCorrect).length;
  
  let totalScore = 0;
  answeredQuestions.forEach(gq => {
    if (gq.isCorrect) {
      const difficultyMultiplier = {
        'easy': 100,
        'medium': 150,
        'hard': 200,
      };
      let points = difficultyMultiplier[gq.question.difficulty] || 100;
      
      // Time bonus
      if (gq.timeToAnswer && gq.timeToAnswer < 10) {
        points += 50;
      }
      
      totalScore += points;
    }
  });

  // Calculate XP and coins
  const xpEarned = calculateXP(game.gameMode, totalScore, correctAnswers, 'medium');
  const coinsEarned = calculateCoins(totalScore, correctAnswers);

  // Update game record
  await game.update({
    status: 'completed',
    score: totalScore,
    correctAnswers,
    totalQuestions,
    xpEarned,
    coinsEarned,
    completedAt: new Date(),
  });

  // Update user statistics
  const user = await User.findByPk(userId);
  const newTotalXP = user.xp + xpEarned;
  const newLevel = calculateLevel(newTotalXP);
  
  // Update streak
  const today = new Date();
  const lastPlay = user.lastPlayDate ? new Date(user.lastPlayDate) : null;
  let newStreak = user.currentStreak;
  
  if (lastPlay) {
    const daysDiff = Math.floor((today - lastPlay) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      newStreak += 1;
    } else if (daysDiff > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  await user.update({
    level: newLevel,
    xp: newTotalXP,
    coins: user.coins + coinsEarned,
    currentStreak: newStreak,
    bestStreak: Math.max(user.bestStreak, newStreak),
    totalGames: user.totalGames + 1,
    totalCorrectAnswers: user.totalCorrectAnswers + correctAnswers,
    lastPlayDate: today,
  });

  // Check for achievements
  const newAchievements = checkAchievements(user, {
    gameMode: game.gameMode,
    correctAnswers,
    totalQuestions,
  });

  // Unlock achievements
  for (const achievementKey of newAchievements) {
    await UserAchievement.findOrCreate({
      where: { userId, achievementKey },
      defaults: { userId, achievementKey },
    });
  }

  return {
    score: totalScore,
    correctAnswers,
    totalQuestions,
    accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
    xpEarned,
    coinsEarned,
    newLevel,
    leveledUp: newLevel > user.level,
    newAchievements,
    currentStreak: newStreak,
  };
};

const getGameHistory = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows: games } = await Game.findAndCountAll({
    where: { userId, status: 'completed' },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['name', 'slug'],
        required: false,
      },
    ],
    order: [['completedAt', 'DESC']],
    limit,
    offset,
  });

  return {
    games: games.map(game => ({
      id: game.id,
      gameMode: game.gameMode,
      category: game.category?.name || 'Mixed',
      score: game.score,
      correctAnswers: game.correctAnswers,
      totalQuestions: game.totalQuestions,
      accuracy: game.totalQuestions > 0 ? Math.round((game.correctAnswers / game.totalQuestions) * 100) : 0,
      xpEarned: game.xpEarned,
      coinsEarned: game.coinsEarned,
      completedAt: game.completedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalGames: count,
      hasNext: page < Math.ceil(count / limit),
      hasPrev: page > 1,
    },
  };
};

module.exports = {
  startGame,
  getGameQuestions,
  submitAnswer,
  completeGame,
  getGameHistory,
};