const Question = require('../models/Question');
const Category = require('../models/Category');

class QuestionController {
  // Get random questions for game
  static async getRandomQuestions(req, res) {
    try {
      const { 
        count = 10, 
        difficulty, 
        category_id,
        exclude_ids 
      } = req.query;

      const excludeIds = exclude_ids ? exclude_ids.split(',').map(id => parseInt(id)) : [];

      const questions = await Question.getRandomQuestions({
        count: parseInt(count),
        difficulty,
        categoryId: category_id ? parseInt(category_id) : null,
        excludeIds
      });

      // Convert to client format (without correct answers)
      const clientQuestions = questions.map(q => q.toClient());

      res.json({ 
        questions: clientQuestions,
        count: clientQuestions.length,
        filters: { difficulty, category_id }
      });

    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  }

  // Get all categories
  static async getCategories(req, res) {
    try {
      const categories = await Category.getAllWithCounts();
      res.json({ categories });

    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }

  // Validate answer (used during gameplay)
  static async validateAnswer(req, res) {
    try {
      const { question_id, selected_answer } = req.body;

      if (!question_id || selected_answer === undefined) {
        return res.status(400).json({ error: 'Question ID and selected answer are required' });
      }

      const question = await Question.findById(question_id);
      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const validation = question.validateAnswer(selected_answer);
      res.json(validation);

    } catch (error) {
      console.error('Answer validation error:', error);
      res.status(500).json({ error: 'Failed to validate answer' });
    }
  }
}

module.exports = QuestionController;
