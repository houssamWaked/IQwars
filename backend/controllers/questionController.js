const questionService = require('../services/questionService');

const getCategories = async (req, res, next) => {
  try {
    const categories = await questionService.getCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

const getQuestionsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { limit = 20, difficulty } = req.query;
    
    const questions = await questionService.getQuestionsByCategory(
      categoryId, 
      parseInt(limit), 
      difficulty
    );
    
    res.json({ questions });
  } catch (error) {
    next(error);
  }
};

const getRandomQuestions = async (req, res, next) => {
  try {
    const { limit = 20, difficulty } = req.query;
    
    const questions = await questionService.getRandomQuestions(
      parseInt(limit), 
      difficulty
    );
    
    res.json({ questions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getQuestionsByCategory,
  getRandomQuestions,
};