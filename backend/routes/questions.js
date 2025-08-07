const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Get random questions for game
router.get('/random', authenticateToken, async (req, res) => {
  try {
    const { 
      count = 10, 
      difficulty, 
      category_id,
      exclude_ids 
    } = req.query;

    let query = `
      SELECT q.id, q.question, q.option_a, q.option_b, q.option_c, q.option_d, 
             q.difficulty, q.hint, c.name as category, c.color as category_color, c.icon as category_icon
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
    if (category_id) {
      conditions.push(`q.category_id = $${params.length + 1}`);
      params.push(parseInt(category_id));
    }

    // Exclude specific question IDs (for story mode progression)
    if (exclude_ids) {
      const excludeArray = exclude_ids.split(',').map(id => parseInt(id));
      conditions.push(`q.id NOT IN (${excludeArray.map(() => `$${params.length + 1}`).join(',')})`);
      params.push(...excludeArray);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
    params.push(Math.min(parseInt(count), 50)); // Max 50 questions per request

    const result = await pool.query(query, params);

    const questions = result.rows.map(q => ({
      id: q.id,
      question: q.question,
      options: [q.option_a, q.option_b, q.option_c, q.option_d],
      category: q.category,
      categoryColor: q.category_color,
      categoryIcon: q.category_icon,
      difficulty: q.difficulty,
      hint: q.hint
      // Note: We never send the correct_answer to the client for security
    }));

    res.json({ 
      questions,
      count: questions.length,
      filters: { difficulty, category_id }
    });

  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get all categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, COUNT(q.id) as question_count,
             COUNT(CASE WHEN q.difficulty = 'easy' THEN 1 END) as easy_count,
             COUNT(CASE WHEN q.difficulty = 'medium' THEN 1 END) as medium_count,
             COUNT(CASE WHEN q.difficulty = 'hard' THEN 1 END) as hard_count
      FROM categories c 
      LEFT JOIN questions q ON c.id = q.category_id 
      GROUP BY c.id, c.name, c.icon, c.color
      ORDER BY c.name
    `);

    const categories = result.rows.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      totalQuestions: parseInt(cat.question_count),
      difficulty: {
        easy: parseInt(cat.easy_count),
        medium: parseInt(cat.medium_count),
        hard: parseInt(cat.hard_count)
      }
    }));

    res.json({ categories });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Validate answer (used during gameplay)
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const { question_id, selected_answer } = req.body;

    if (!question_id || selected_answer === undefined) {
      return res.status(400).json({ error: 'Question ID and selected answer are required' });
    }

    const result = await pool.query(
      'SELECT correct_answer, explanation, difficulty FROM questions WHERE id = $1',
      [question_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const question = result.rows[0];
    const isCorrect = question.correct_answer === parseInt(selected_answer);

    // Calculate points based on difficulty
    const pointsMap = { easy: 10, medium: 15, hard: 20 };
    const basePoints = pointsMap[question.difficulty] || 10;

    res.json({
      isCorrect,
      correctAnswer: question.correct_answer,
      explanation: question.explanation,
      pointsEarned: isCorrect ? basePoints : 0
    });

  } catch (error) {
    console.error('Answer validation error:', error);
    res.status(500).json({ error: 'Failed to validate answer' });
  }
});

module.exports = router;