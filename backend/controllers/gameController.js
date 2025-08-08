const gameService = require('../services/gameService');

const startGame = async (req, res, next) => {
  try {
    const { gameMode, categoryId } = req.body;
    const userId = req.user.id;

    const game = await gameService.startGame(userId, gameMode, categoryId);
    
    res.status(201).json({
      message: 'Game started successfully',
      game,
    });
  } catch (error) {
    next(error);
  }
};

const getGameQuestions = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    const questions = await gameService.getGameQuestions(gameId, userId);
    
    res.json({
      questions,
    });
  } catch (error) {
    next(error);
  }
};

const submitAnswer = async (req, res, next) => {
  try {
    const { gameId, questionId } = req.params;
    const { answer, timeToAnswer } = req.body;
    const userId = req.user.id;

    const result = await gameService.submitAnswer(gameId, questionId, userId, answer, timeToAnswer);
    
    res.json({
      message: 'Answer submitted successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
};

const completeGame = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    const gameResult = await gameService.completeGame(gameId, userId);
    
    res.json({
      message: 'Game completed successfully',
      result: gameResult,
    });
  } catch (error) {
    next(error);
  }
};

const getGameHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const games = await gameService.getGameHistory(userId, parseInt(page), parseInt(limit));
    
    res.json(games);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startGame,
  getGameQuestions,
  submitAnswer,
  completeGame,
  getGameHistory,
};