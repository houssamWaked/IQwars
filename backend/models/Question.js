const pool = require('../config/database');

class Question {
  constructor(questionData) {
    this.id = questionData.id;
    this.category_id = questionData.category_id;
    this.question = questionData.question;
    this.option_a = questionData.option_a;
    this.option_b = questionData.option_b;
    this.option_c = questionData.option_c;
    this.option_d = questionData.option_d;
    this.correct_answer = questionData.correct_answer;
    this.difficulty = questionData.difficulty;
    this.hint = questionData.hint;
    this.explanation = questionData.explanation;
    this.category = questionData.category;
    this.category_color = questionData.category_color;
    this.category_icon = questionData.category_icon;
  }

  // Get random questions with filters
  static async getRandomQuestions(filters = {}) {
    try {
      const { 
        count = 10, 
        difficulty, 
        categoryId,
        excludeIds = []
      } = filters;

      let query = `
        SELECT q.id, q.category_id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, 
               q.correct_answer, q.difficulty, q.hint, q.explanation,
               c.name as category, c.color as category_color, c.icon as category_icon
        FROM questions q
        JOIN categories c ON q.category_id = c.id
      `;
      
      const params = [];
      const conditions = [];

      // Filter by difficulty
      if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
        conditions.push(`q.difficulty = $${params.length + 1}`);
        params.push(difficulty);
      }

      // Filter by category
      if (categoryId) {
        conditions.push(`q.category_id = $${params.length + 1}`);
        params.push(parseInt(categoryId));
      }

      // Exclude specific question IDs
      if (excludeIds.length > 0) {
        const excludePlaceholders = excludeIds.map(() => `$${params.length + 1}`);
        conditions.push(`q.id NOT IN (${excludePlaceholders.join(',')})`);
        params.push(...excludeIds.map(id => parseInt(id)));
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
      params.push(Math.min(parseInt(count), 50));

      const result = await pool.query(query, params);

      return result.rows.map(q => new Question(q));
    } catch (error) {
      console.error('Error getting random questions:', error);
      throw error;
    }
  }

  // Find question by ID
  static async findById(id) {
    try {
      const result = await pool.query(`
        SELECT q.*, c.name as category, c.color as category_color, c.icon as category_icon
        FROM questions q
        JOIN categories c ON q.category_id = c.id
        WHERE q.id = $1
      `, [id]);
      
      return result.rows.length > 0 ? new Question(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding question by ID:', error);
      throw error;
    }
  }

  // Validate answer
  validateAnswer(selectedAnswer) {
    const isCorrect = this.correct_answer === parseInt(selectedAnswer);
    const pointsMap = { easy: 10, medium: 15, hard: 20 };
    const basePoints = pointsMap[this.difficulty] || 10;

    return {
      isCorrect,
      correctAnswer: this.correct_answer,
      explanation: this.explanation,
      pointsEarned: isCorrect ? basePoints : 0
    };
  }

  // Get question for client (without correct answer)
  toClient() {
    return {
      id: this.id,
      question: this.question,
      options: [this.option_a, this.option_b, this.option_c, this.option_d],
      category: this.category,
      categoryColor: this.category_color,
      categoryIcon: this.category_icon,
      difficulty: this.difficulty,
      hint: this.hint
    };
  }
}

module.exports = Question;