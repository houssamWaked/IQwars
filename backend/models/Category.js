const pool = require('../config/database');

class Category {
  constructor(categoryData) {
    this.id = categoryData.id;
    this.name = categoryData.name;
    this.icon = categoryData.icon;
    this.color = categoryData.color;
    this.created_at = categoryData.created_at;
  }

  // Get all categories with question counts
  static async getAllWithCounts() {
    try {
      const result = await pool.query(`
        SELECT c.*, COUNT(q.id) as question_count,
               COUNT(CASE WHEN q.difficulty = 'easy' THEN 1 END) as easy_count,
               COUNT(CASE WHEN q.difficulty = 'medium' THEN 1 END) as medium_count,
               COUNT(CASE WHEN q.difficulty = 'hard' THEN 1 END) as hard_count
        FROM categories c 
        LEFT JOIN questions q ON c.id = q.category_id 
        GROUP BY c.id, c.name, c.icon, c.color, c.created_at
        ORDER BY c.name
      `);

      return result.rows.map(cat => ({
        ...new Category(cat),
        questionCount: parseInt(cat.question_count),
        difficulty: {
          easy: parseInt(cat.easy_count),
          medium: parseInt(cat.medium_count),
          hard: parseInt(cat.hard_count)
        }
      }));
    } catch (error) {
      console.error('Error getting categories with counts:', error);
      throw error;
    }
  }

  // Find category by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM categories WHERE id = $1',
        [id]
      );
      
      return result.rows.length > 0 ? new Category(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding category by ID:', error);
      throw error;
    }
  }
}

module.exports = Category;
